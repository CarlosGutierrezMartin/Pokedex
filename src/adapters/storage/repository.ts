import Dexie from 'dexie';
import type { Table } from 'dexie';
import { assertObservation } from '../../domain/collection';
import type { Identification, Observation, Profile } from '../../domain/collection';
import type { Workspace } from '../../domain/workspace';
import { requireMatchingSource } from '../../domain/workspace';
import { demoSpecies } from '../../test-support/catalog';
import { identificationSchema, observationSchema, profileSchema } from './schema';

export const PHOTO_LIMIT = 2 * 1024 * 1024;
export const PROFILE_PHOTO_LIMIT = 60 * 1024 * 1024;
export interface PhotoRecord { id: string; profileId: string; blob: Blob; thumbnail: Blob }
export interface BinaryPhotoRecord { id: string; profileId: string; data: ArrayBuffer; thumbnailData: ArrayBuffer; mime: 'image/jpeg' }

export async function serializePhoto(photo: PhotoRecord): Promise<BinaryPhotoRecord> {
  return { id: photo.id, profileId: photo.profileId, data: await photo.blob.arrayBuffer(), thumbnailData: await photo.thumbnail.arrayBuffer(), mime: 'image/jpeg' };
}

export function deserializePhoto(photo: BinaryPhotoRecord | PhotoRecord): PhotoRecord {
  if ('blob' in photo) return photo;
  return { id: photo.id, profileId: photo.profileId, blob: new Blob([photo.data], { type: photo.mime }), thumbnail: new Blob([photo.thumbnailData], { type: photo.mime }) };
}

export class FaunaDatabase extends Dexie {
  profiles!: Table<Profile, string>;
  observations!: Table<Observation, [string, string]>;
  identifications!: Table<Identification, [string, string]>;
  photos!: Table<BinaryPhotoRecord | PhotoRecord, [string, string]>;

  constructor(name: string) {
    super(name);
    this.version(1).stores({ profiles: '&id, createdAt', observations: '[profileId+id], &[profileId+operationId], profileId', identifications: '[profileId+observationId], profileId', photos: '[profileId+id], profileId' });
  }
}

export class LocalRepository {
  readonly database: FaunaDatabase;
  readonly source: Workspace;

  constructor(source: Workspace, databaseName = `fauna-${source}-v1`) {
    this.source = source;
    this.database = new FaunaDatabase(databaseName);
  }

  async createProfile(name: string): Promise<Profile> {
    const profile = profileSchema.parse({ id: crypto.randomUUID(), source: this.source, name: name.trim(), createdAt: new Date().toISOString(), sound: false, reducedMotion: false });
    await this.database.profiles.add(profile);
    return profile;
  }

  async profile(id: string) {
    const profile = await this.database.profiles.get(id);
    if (!profile) throw new Error('Perfil no encontrado. Vuelve al inicio.');
    requireMatchingSource(this.source, profile.source);
    return profile;
  }

  async observations(profileId: string) {
    await this.profile(profileId);
    return this.database.observations.where('profileId').equals(profileId).toArray();
  }

  validate(observation: Observation, identification: Identification) {
    observationSchema.parse(observation);
    identificationSchema.parse(identification);
    assertObservation(observation, this.source, this.source === 'demo' ? demoSpecies : []);
    requireMatchingSource(this.source, identification.source);
    if (identification.profileId !== observation.profileId || identification.observationId !== observation.id || identification.chosenSpeciesId !== observation.speciesId) throw new Error('Identificación no vinculada al encuentro.');
    if (this.source === 'real' && (observation.identificationMethod !== 'manual' || identification.modelId || identification.candidates.length)) throw new Error('El espacio real aún no dispone de modelo validado.');
    if (identification.candidates.some((candidate) => !demoSpecies.some((species) => species.id === candidate.speciesId))) throw new Error('Candidato fuera del catálogo.');
  }

  async save(observation: Observation, identification: Identification, photos: PhotoRecord[] = []) {
    this.validate(observation, identification);
    this.validatePhotos(observation.profileId, photos);
    const preparedPhotos = await Promise.all(photos.map(serializePhoto));
    return this.database.transaction('rw', this.database.profiles, this.database.observations, this.database.identifications, this.database.photos, async () => {
      await this.profile(observation.profileId);
      const previous = await this.database.observations.where('[profileId+operationId]').equals([observation.profileId, observation.operationId]).first();
      if (previous) return previous;
      if (observation.photoIds.length !== photos.length || observation.photoIds.some((id) => !photos.some((photo) => photo.id === id))) throw new Error('Falta una foto vinculada.');
      const existingPhotos = await this.database.photos.where('profileId').equals(observation.profileId).toArray();
      const size = [...existingPhotos.map(deserializePhoto), ...photos].reduce((total, photo) => total + photo.blob.size + photo.thumbnail.size, 0);
      if (size > PROFILE_PHOTO_LIMIT) throw new Error('Límite de 60 MiB de fotos: exporta una copia y libera espacio.');
      await this.database.observations.add(observation);
      await this.database.identifications.add(identification);
      await this.database.photos.bulkAdd(preparedPhotos);
      return observation;
    });
  }

  validatePhotos(profileId: string, photos: PhotoRecord[]) {
    if (new Set(photos.map((photo) => photo.id)).size !== photos.length) throw new Error('Fotos duplicadas.');
    for (const photo of photos) {
      if (photo.profileId !== profileId || photo.blob.type !== 'image/jpeg' || photo.thumbnail.type !== 'image/jpeg' || photo.blob.size === 0 || photo.blob.size > PHOTO_LIMIT || photo.thumbnail.size === 0 || photo.thumbnail.size > 65536) throw new Error('Foto inválida o demasiado grande.');
    }
  }

  async update(observation: Observation) {
    return this.database.transaction('rw', this.database.profiles, this.database.observations, this.database.identifications, async () => {
      await this.profile(observation.profileId);
      const previous = await this.database.observations.get([observation.profileId, observation.id]);
      const identification = await this.database.identifications.get([observation.profileId, observation.id]);
      if (!previous || !identification) throw new Error('El encuentro ya no existe.');
      if (previous.operationId !== observation.operationId || previous.createdAt !== observation.createdAt || JSON.stringify(previous.photoIds) !== JSON.stringify(observation.photoIds)) throw new Error('La edición no puede reemplazar la identidad o las fotos.');
      const resolved = { ...identification, chosenSpeciesId: observation.speciesId };
      this.validate(observation, resolved);
      await this.database.observations.put(observation);
      await this.database.identifications.put(resolved);
    });
  }

  async deleteObservation(profileId: string, id: string) {
    await this.database.transaction('rw', this.database.observations, this.database.identifications, this.database.photos, async () => {
      const observation = await this.database.observations.get([profileId, id]);
      if (!observation) return;
      await this.database.photos.bulkDelete(observation.photoIds.map((photoId) => [profileId, photoId]));
      await this.database.identifications.delete([profileId, id]);
      await this.database.observations.delete([profileId, id]);
    });
  }

  async deleteProfile(profileId: string) {
    await this.database.transaction('rw', this.database.profiles, this.database.observations, this.database.identifications, this.database.photos, async () => {
      await this.database.photos.where('profileId').equals(profileId).delete();
      await this.database.identifications.where('profileId').equals(profileId).delete();
      await this.database.observations.where('profileId').equals(profileId).delete();
      await this.database.profiles.delete(profileId);
    });
  }
}
