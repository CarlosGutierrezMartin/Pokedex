import { requireMatchingSource } from './workspace.ts';
import type { Workspace } from './workspace.ts';

export type Municipality = 'algete' | 'san-agustin';
export type Context = 'wild' | 'domestic' | 'captive' | 'unknown';
export type Habitat = 'urban' | 'garden' | 'other' | 'unknown';
export type Group = 'birds' | 'mammals' | 'reptiles' | 'insects';

export interface Species {
  id: string;
  commonName: string;
  scientificName: string;
  group: Group;
  source: 'demo';
  verifiedLocalPresence: false;
}

export interface Collection {
  id: string;
  version: string;
  title: string;
  memberSpeciesIds: string[];
  context?: Context;
  municipality?: Municipality;
  habitats?: Habitat[];
  dateRange?: { from: string; to: string };
  rule: string;
}

export interface Observation {
  id: string;
  operationId: string;
  profileId: string;
  source: Workspace;
  speciesId: string | null;
  status: 'pending' | 'confirmed';
  identificationMethod: 'manual' | 'model' | 'guided';
  context: Context;
  habitat: Habitat;
  municipality: Municipality | null;
  placeSource: 'manual' | 'unknown';
  observedDate: string | null;
  datePrecision: 'day' | 'unknown';
  createdAt: string;
  confirmedAt: string | null;
  notes: string;
  photoIds: string[];
}

export interface Identification {
  observationId: string;
  profileId: string;
  source: Workspace;
  modelId: string | null;
  candidates: { speciesId: string; rank: 'species' | 'genus' | 'family' }[];
  chosenSpeciesId: string | null;
}

export interface Profile {
  id: string;
  source: Workspace;
  name: string;
  createdAt: string;
  sound: boolean;
  reducedMotion: boolean;
}

export function assertObservation(observation: Observation, source: Workspace, species: readonly Species[]) {
  requireMatchingSource(source, observation.source);
  if (!observation.id || !observation.operationId || !observation.profileId) throw new Error('Falta la identidad de la observación.');
  if ((observation.status === 'confirmed') !== (observation.speciesId !== null && observation.confirmedAt !== null)) throw new Error('Una confirmación necesita especie y fecha de confirmación.');
  if (observation.status === 'pending' && (observation.speciesId !== null || observation.confirmedAt !== null)) throw new Error('Una observación pendiente no desbloquea especies.');
  if (observation.speciesId && (!species.some((entry) => entry.id === observation.speciesId) || source === 'real')) throw new Error('Especie fuera del catálogo de este espacio.');
  if ((observation.municipality === null) !== (observation.placeSource === 'unknown')) throw new Error('El lugar debe conservar su procedencia.');
  if ((observation.observedDate === null) !== (observation.datePrecision === 'unknown')) throw new Error('La fecha debe conservar su precisión.');
  if (observation.observedDate && (!/^\d{4}-\d{2}-\d{2}$/.test(observation.observedDate) || new Date(`${observation.observedDate}T12:00:00Z`).toISOString().slice(0, 10) !== observation.observedDate)) throw new Error('Fecha de encuentro inválida.');
  if (observation.notes.length > 2000 || new Set(observation.photoIds).size !== observation.photoIds.length) throw new Error('Notas demasiado largas o fotos duplicadas.');
}

export function discoveries(observations: readonly Observation[]) {
  const first = new Map<string, Observation>();
  for (const observation of observations) {
    if (observation.status !== 'confirmed' || !observation.speciesId || !observation.confirmedAt) continue;
    const previous = first.get(observation.speciesId);
    if (!previous || observation.confirmedAt < previous.confirmedAt! || (observation.confirmedAt === previous.confirmedAt && observation.id < previous.id)) first.set(observation.speciesId, observation);
  }
  return first;
}

export function collectionProgress(collection: Collection, observations: readonly Observation[]) {
  const discovered = new Set<string>();
  for (const observation of observations) {
    if (observation.status !== 'confirmed' || !observation.speciesId || !collection.memberSpeciesIds.includes(observation.speciesId)) continue;
    if (collection.context && observation.context !== collection.context) continue;
    if (collection.municipality && observation.municipality !== collection.municipality) continue;
    if (collection.habitats && !collection.habitats.includes(observation.habitat)) continue;
    if (collection.dateRange && (!observation.observedDate || observation.observedDate < collection.dateRange.from || observation.observedDate > collection.dateRange.to)) continue;
    discovered.add(observation.speciesId);
  }
  return { discovered, count: discovered.size, total: collection.memberSpeciesIds.length, complete: collection.memberSpeciesIds.length > 0 && discovered.size === collection.memberSpeciesIds.length };
}
