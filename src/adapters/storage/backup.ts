import type { Identification, Observation, Profile } from '../../domain/collection';
import type { PhotoRecord } from './repository';
import { deserializePhoto, LocalRepository, PROFILE_PHOTO_LIMIT, serializePhoto } from './repository';
import { backupSchema } from './schema';

export const BACKUP_LIMIT = 100 * 1024 * 1024;
const hash = async (bytes: ArrayBuffer) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map((byte) => byte.toString(16).padStart(2, '0')).join('');

async function encode(blob: Blob) {
  const bytes = await blob.arrayBuffer();
  let binary = '';
  const array = new Uint8Array(bytes);
  for (let offset = 0; offset < array.length; offset += 8192) binary += String.fromCharCode(...array.subarray(offset, offset + 8192));
  return { data: btoa(binary), sha256: await hash(bytes) };
}

async function decode(data: string, checksum: string) {
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(data) || data.length % 4 !== 0) throw new Error('Foto codificada inválida.');
  const bytes = Uint8Array.from(atob(data), (character) => character.charCodeAt(0));
  if (await hash(bytes.buffer) !== checksum || bytes[0] !== 255 || bytes[1] !== 216 || bytes[2] !== 255) throw new Error('Foto corrupta o incompatible.');
  return new Blob([bytes], { type: 'image/jpeg' });
}

function validateGraph(repository: LocalRepository, profile: Profile, observations: Observation[], identifications: Identification[], photos: PhotoRecord[]) {
  if (profile.source !== repository.source) throw new Error('La copia pertenece a otro espacio. Demo y real no se mezclan.');
  if (new Set(observations.map((observation) => observation.id)).size !== observations.length || new Set(observations.map((observation) => observation.operationId)).size !== observations.length || new Set(identifications.map((identification) => identification.observationId)).size !== identifications.length || identifications.length !== observations.length) throw new Error('Encuentros o identificaciones duplicados/incompletos.');
  repository.validatePhotos(profile.id, photos);
  const usedPhotos = new Set<string>();
  for (const observation of observations) {
    const identification = identifications.find((entry) => entry.observationId === observation.id);
    if (observation.profileId !== profile.id || !identification) throw new Error('Vínculos de perfil inválidos.');
    repository.validate(observation, identification);
    for (const id of observation.photoIds) {
      if (usedPhotos.has(id) || !photos.some((photo) => photo.id === id)) throw new Error('Foto ausente o compartida entre encuentros.');
      usedPhotos.add(id);
    }
  }
  if (usedPhotos.size !== photos.length || photos.reduce((total, photo) => total + photo.blob.size + photo.thumbnail.size, 0) > PROFILE_PHOTO_LIMIT) throw new Error('Fotos huérfanas o presupuesto excedido.');
}

export async function exportBackup(repository: LocalRepository, profileId: string): Promise<Blob> {
  const database = repository.database;
  const snapshot = await database.transaction('r', database.profiles, database.observations, database.identifications, database.photos, async () => ({
    profile: await repository.profile(profileId), observations: await database.observations.where('profileId').equals(profileId).toArray(),
    identifications: await database.identifications.where('profileId').equals(profileId).toArray(), photos: (await database.photos.where('profileId').equals(profileId).toArray()).map(deserializePhoto),
  }));
  validateGraph(repository, snapshot.profile, snapshot.observations, snapshot.identifications, snapshot.photos);
  const photos = [];
  for (const photo of snapshot.photos) {
    const full = await encode(photo.blob);
    const thumbnail = await encode(photo.thumbnail);
    photos.push({ id: photo.id, mime: 'image/jpeg' as const, data: full.data, sha256: full.sha256, thumbnail: thumbnail.data, thumbnailSha256: thumbnail.sha256 });
  }
  const result = backupSchema.parse({ format: 'fauna-local', schemaVersion: 1, profile: snapshot.profile, observations: snapshot.observations, identifications: snapshot.identifications, photos });
  const blob = new Blob([JSON.stringify(result)], { type: 'application/json' });
  if (blob.size > BACKUP_LIMIT) throw new Error('La copia supera 100 MiB. Exportación cancelada.');
  await validateBackup(repository, blob);
  return blob;
}

export async function validateBackup(repository: LocalRepository, file: Blob) {
  if (file.size > BACKUP_LIMIT) throw new Error('Copia demasiado grande: máximo 100 MiB.');
  const backup = backupSchema.parse(JSON.parse(await file.text()));
  const photos: PhotoRecord[] = [];
  for (const photo of backup.photos) photos.push({ id: photo.id, profileId: backup.profile.id, blob: await decode(photo.data, photo.sha256), thumbnail: await decode(photo.thumbnail, photo.thumbnailSha256) });
  validateGraph(repository, backup.profile, backup.observations, backup.identifications, photos);
  return { ...backup, photos };
}

export async function restoreBackup(repository: LocalRepository, file: Blob): Promise<Profile> {
  const backup = await validateBackup(repository, file);
  const profile: Profile = { ...backup.profile, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  const database = repository.database;
  const preparedPhotos = await Promise.all(backup.photos.map((photo) => serializePhoto({ ...photo, profileId: profile.id })));
  await database.transaction('rw', database.profiles, database.observations, database.identifications, database.photos, async () => {
    await database.profiles.add(profile);
    await database.observations.bulkAdd(backup.observations.map((observation) => ({ ...observation, profileId: profile.id })));
    await database.identifications.bulkAdd(backup.identifications.map((identification) => ({ ...identification, profileId: profile.id })));
    await database.photos.bulkAdd(preparedPhotos);
    if (await database.observations.where('profileId').equals(profile.id).count() !== backup.observations.length || await database.photos.where('profileId').equals(profile.id).count() !== backup.photos.length) throw new Error('Restauración incompleta.');
  });
  return profile;
}
