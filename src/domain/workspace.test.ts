import { describe, expect, it } from 'vitest';
import { requireMatchingSource } from './workspace';

describe('frontera de datos demo/reales', () => {
  it.each(['demo', 'real'] as const)('admite datos del espacio %s', (workspace) => {
    expect(() => requireMatchingSource(workspace, workspace)).not.toThrow();
  });
  it.each([['demo', 'real'], ['real', 'demo']] as const)('rechaza %s en %s', (source, workspace) => {
    expect(() => requireMatchingSource(workspace, source)).toThrow(/separados/);
  });
});
