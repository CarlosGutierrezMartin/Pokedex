import { z } from 'zod';
import type { Workspace } from '../domain/workspace';

export const screens = ['explorar', 'coleccion', 'ficha', 'escanear', 'encuentro', 'cuaderno', 'ajustes'] as const;
const eventNames = ['session_started', 'collection_opened', 'scanner_opened', 'capture_taken', 'candidates_shown', 'observation_saved', 'recovery_used'] as const;
const eventSchema = z.strictObject({ name: z.enum(eventNames), screen: z.enum(screens), at: z.iso.datetime(), durationMs: z.number().int().nonnegative().max(86_400_000) });
const feedbackSchema = z.strictObject({ screen: z.enum(screens), comment: z.string().min(1).max(1000), at: z.iso.datetime() });
const dataSchema = z.strictObject({ enabled: z.boolean(), events: z.array(eventSchema).max(200), feedback: z.array(feedbackSchema).max(30) });
const BUILD = '0.0.1-ux-demo1';
export type Screen = typeof screens[number];

export class LocalDiagnostics {
  private readonly key: string;
  constructor(private readonly storage: Storage, private readonly source: Workspace, profileId: string) { this.key = `fauna-diagnostics-${source}-${profileId}`; }
  read() {
    const saved = this.storage.getItem(this.key);
    return saved ? dataSchema.parse(JSON.parse(saved)) : { enabled: false, events: [], feedback: [] };
  }
  enable(enabled: boolean) { this.storage.setItem(this.key, JSON.stringify({ ...this.read(), enabled })); }
  recordElapsed(name: typeof eventNames[number], screen: Screen, started: number) { this.record(name, screen, performance.now() - started); }
  record(name: typeof eventNames[number], screen: Screen, durationMs = 0) {
    try {
      const data = this.read();
      if (!data.enabled) return;
      const entry = eventSchema.parse({ name, screen, at: new Date().toISOString(), durationMs: Math.min(86_400_000, Math.max(0, Math.round(durationMs))) });
      this.storage.setItem(this.key, JSON.stringify({ ...data, events: [...data.events, entry].slice(-200) }));
    } catch { return; }
  }
  feedback(screen: Screen, comment: string) {
    const data = this.read();
    const entry = feedbackSchema.parse({ screen, comment: comment.trim(), at: new Date().toISOString() });
    this.storage.setItem(this.key, JSON.stringify({ ...data, feedback: [...data.feedback, entry].slice(-30) }));
  }
  export() { return JSON.stringify({ schemaVersion: 1, source: this.source, build: BUILD, ...this.read() }, null, 2); }
  clear() { this.storage.removeItem(this.key); }
}
