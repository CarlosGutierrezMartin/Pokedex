import { beforeEach, expect, it } from 'vitest';
import { LocalDiagnostics } from './diagnostics';

const values = new Map<string, string>();
const storage: Storage = {
  get length() { return values.size; },
  key: (index) => [...values.keys()][index] ?? null,
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => { values.set(key, value); },
  removeItem: (key) => { values.delete(key); },
  clear: () => values.clear(),
};
beforeEach(() => values.clear());

it('no registra sin activación y limita el diagnóstico a campos y tamaño explícitos', () => {
  const diagnostics = new LocalDiagnostics(storage, 'demo', 'private-profile');
  diagnostics.record('session_started', 'explorar');
  expect(diagnostics.read().events).toEqual([]);
  diagnostics.enable(true);
  for (let index = 0; index < 205; index++) diagnostics.record('observation_saved', 'escanear', index + 0.4);
  const exported = JSON.parse(diagnostics.export());
  expect(exported.events).toHaveLength(200);
  expect(exported.events[0].durationMs).toBe(5);
  expect(Object.keys(exported.events[0]).sort()).toEqual(['at', 'durationMs', 'name', 'screen']);
  expect(diagnostics.export()).not.toContain('private-profile');
  diagnostics.enable(false);
  diagnostics.record('capture_taken', 'escanear');
  expect(diagnostics.read().events.at(-1)?.name).toBe('observation_saved');
});

it('feedback explícito se separa por perfil y origen y puede borrarse', () => {
  const demo = new LocalDiagnostics(storage, 'demo', 'profile');
  demo.feedback('coleccion', 'No encontré el filtro');
  expect(new LocalDiagnostics(storage, 'real', 'profile').read().feedback).toEqual([]);
  expect(new LocalDiagnostics(storage, 'demo', 'other').read().feedback).toEqual([]);
  expect(() => demo.feedback('coleccion', 'x'.repeat(1001))).toThrow();
  expect(demo.read().feedback).toHaveLength(1);
  demo.clear();
  expect(demo.read()).toEqual({ enabled: false, events: [], feedback: [] });
});

it('falta de espacio o diagnóstico corrupto no interrumpe el encuentro', () => {
  const diagnostics = new LocalDiagnostics(storage, 'demo', 'profile');
  storage.setItem('fauna-diagnostics-demo-profile', '{');
  expect(() => diagnostics.record('observation_saved', 'escanear')).not.toThrow();
  expect(() => diagnostics.export()).toThrow();
  diagnostics.clear();
  expect(diagnostics.read().enabled).toBe(false);
});
