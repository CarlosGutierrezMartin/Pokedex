import 'fake-indexeddb/auto';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { LocalRepository } from './repository';
import { sampleObservation } from '../../test-support/observation';
import { exportBackup, restoreBackup } from './backup';
import type { Identification, Observation } from '../../domain/collection';

let repository: LocalRepository;
let observation: Observation;
let identification: Identification;
beforeEach(async () => {
  repository = new LocalRepository('demo', `test-${crypto.randomUUID()}`);
  const profile = await repository.createProfile('Prueba');
  observation = { ...sampleObservation, profileId: profile.id };
  identification = { profileId: profile.id, observationId: observation.id, source: 'demo', modelId: 'demo-fixture@1', candidates: [{ speciesId: 'demo-gorrion', rank: 'species' }], chosenSpeciesId: 'demo-gorrion' };
});
afterEach(async () => { await repository.database.delete(); });

it('dos confirmaciones concurrentes del mismo operationId generan un registro', async () => {
  await Promise.all([repository.save(observation, identification), repository.save(observation, identification)]);
  expect(await repository.observations(observation.profileId)).toHaveLength(1);
  expect(await repository.database.identifications.count()).toBe(1);
});

it('fallo al guardar blob revierte encuentro e identificación; el reintento funciona', async () => {
  const photo = { id: 'foto', profileId: observation.profileId, blob: new Blob(['fixture'], { type: 'image/jpeg' }), thumbnail: new Blob(['thumb'], { type: 'image/jpeg' }) };
  observation = { ...observation, photoIds: [photo.id] };
  const fail = () => { throw new Error('Espacio insuficiente'); };
  repository.database.photos.hook('creating', fail);
  await expect(repository.save(observation, identification, [photo])).rejects.toThrow('Espacio insuficiente');
  expect(await repository.database.observations.count()).toBe(0);
  expect(await repository.database.identifications.count()).toBe(0);
  expect(await repository.database.photos.count()).toBe(0);
  repository.database.photos.hook('creating').unsubscribe(fail);
  await repository.save(observation, identification, [photo]);
  expect(await repository.database.observations.count()).toBe(1);
});

it('editar la elección no sobrescribe los candidatos originales y borrar elimina vínculos', async () => {
  await repository.save(observation, identification);
  await repository.update({ ...observation, speciesId: 'demo-mirlo', identificationMethod: 'manual' });
  const stored = await repository.database.identifications.get([observation.profileId, observation.id]);
  expect(stored?.chosenSpeciesId).toBe('demo-mirlo');
  expect(stored?.candidates[0]?.speciesId).toBe('demo-gorrion');
  await repository.deleteObservation(observation.profileId, observation.id);
  expect(await repository.database.observations.count()).toBe(0);
  expect(await repository.database.identifications.count()).toBe(0);
});

it('restaura en un perfil nuevo y una copia corrupta no toca datos existentes', async () => {
  await repository.save(observation, identification);
  const backup = await exportBackup(repository, observation.profileId);
  const restored = await restoreBackup(repository, backup);
  expect(restored.id).not.toBe(observation.profileId);
  expect(await repository.observations(restored.id)).toHaveLength(1);
  const invalid = JSON.parse(await backup.text());
  invalid.observations[0].photoIds = ['foto-inexistente'];
  await expect(restoreBackup(repository, new Blob([JSON.stringify(invalid)]))).rejects.toThrow('Foto ausente');
  expect(await repository.database.profiles.count()).toBe(2);
  expect(await repository.database.observations.count()).toBe(2);
});

it('no importa una copia demo al espacio real', async () => {
  await repository.save(observation, identification);
  const backup = await exportBackup(repository, observation.profileId);
  const real = new LocalRepository('real', `test-real-${crypto.randomUUID()}`);
  try {
    await real.createProfile('Real');
    await expect(restoreBackup(real, backup)).rejects.toThrow('otro espacio');
    expect(await real.database.observations.count()).toBe(0);
    expect(await real.database.profiles.count()).toBe(1);
  } finally { await real.database.delete(); }
});

it('un fallo de restauración revierte también el perfil nuevo', async () => {
  await repository.save(observation, identification);
  const backup = await exportBackup(repository, observation.profileId);
  repository.database.identifications.hook('creating', () => { throw new Error('Fallo de escritura'); });
  await expect(restoreBackup(repository, backup)).rejects.toThrow('Fallo de escritura');
  expect(await repository.database.profiles.count()).toBe(1);
  expect(await repository.database.observations.count()).toBe(1);
});

it('un fallo al corregir revierte elección e identificación juntas', async () => {
  await repository.save(observation, identification);
  repository.database.identifications.hook('updating', () => { throw new Error('Fallo de corrección'); });
  await expect(repository.update({ ...observation, speciesId: 'demo-mirlo' })).rejects.toThrow('Fallo de corrección');
  expect((await repository.observations(observation.profileId))[0]?.speciesId).toBe('demo-gorrion');
  expect((await repository.database.identifications.get([observation.profileId, observation.id]))?.chosenSpeciesId).toBe('demo-gorrion');
});

it('el espacio real rechaza un pendiente atribuido a modelo aunque no traiga candidatos', async () => {
  const real = new LocalRepository('real', `test-real-${crypto.randomUUID()}`);
  try {
    const profile = await real.createProfile('Real');
    const pending: Observation = { ...observation, source: 'real', profileId: profile.id, speciesId: null, confirmedAt: null, status: 'pending', identificationMethod: 'model' };
    const proposal: Identification = { ...identification, source: 'real', profileId: profile.id, modelId: null, candidates: [], chosenSpeciesId: null };
    await expect(real.save(pending, proposal)).rejects.toThrow('modelo validado');
    await real.save({ ...pending, identificationMethod: 'manual' }, proposal);
    expect(await real.observations(profile.id)).toHaveLength(1);
  } finally { await real.database.delete(); }
});
