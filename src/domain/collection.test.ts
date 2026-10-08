import { describe, expect, it } from 'vitest';
import { assertObservation, collectionProgress, discoveries } from './collection';
import { demoCollections, demoSpecies } from '../test-support/catalog';
import { sampleObservation } from '../test-support/observation';

describe('progreso desde observaciones', () => {
  it('exige todos los predicados en una misma observación', () => {
    const collection = demoCollections.find((entry) => entry.id === 'algete')!;
    const domestic = { ...sampleObservation, context: 'domestic' as const };
    const otherTown = { ...sampleObservation, id: 'otro', municipality: 'san-agustin' as const };
    expect(collectionProgress(collection, [domestic, otherTown]).count).toBe(0);
    expect(collectionProgress(collection, [domestic, otherTown, sampleObservation]).count).toBe(1);
  });
  it('repetir no duplica especie y corregir/borrar recalcula', () => {
    const repeated = { ...sampleObservation, id: 'otro', confirmedAt: '2026-10-07T10:02:00Z' };
    expect(discoveries([sampleObservation, repeated]).size).toBe(1);
    expect(discoveries([repeated]).get('demo-gorrion')?.id).toBe('otro');
    expect(discoveries([{ ...sampleObservation, speciesId: 'demo-mirlo' }, repeated]).size).toBe(2);
    expect(discoveries([]).size).toBe(0);
  });
  it('una pendiente no descubre ni completa colecciones', () => {
    const pending = { ...sampleObservation, speciesId: null, confirmedAt: null, status: 'pending' as const };
    expect(discoveries([pending]).size).toBe(0);
    expect(collectionProgress(demoCollections[0]!, [pending]).count).toBe(0);
  });
  it('fecha desconocida no se sustituye por creación para una colección estacional', () => {
    const seasonal = { ...demoCollections[0]!, dateRange: { from: '2026-10-01', to: '2026-10-31' } };
    expect(collectionProgress(seasonal, [{ ...sampleObservation, observedDate: null }]).count).toBe(0);
    expect(collectionProgress(seasonal, [sampleObservation]).count).toBe(1);
  });
  it('desempata la primera confirmación por id', () => {
    expect(discoveries([{ ...sampleObservation, id: 'z' }, { ...sampleObservation, id: 'a' }]).get('demo-gorrion')?.id).toBe('a');
  });
  it('rechaza fuente demo en real y fechas inventadas', () => {
    expect(() => assertObservation(sampleObservation, 'real', demoSpecies)).toThrow();
    expect(() => assertObservation({ ...sampleObservation, observedDate: '2026-02-30' }, 'demo', demoSpecies)).toThrow();
  });
});
