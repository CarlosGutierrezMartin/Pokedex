export type Workspace = 'demo' | 'real';

export function requireMatchingSource(workspace: Workspace, source: Workspace): void {
  if (workspace !== source) {
    throw new Error('Los datos demo y reales deben permanecer separados.');
  }
}
