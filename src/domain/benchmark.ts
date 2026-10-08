export interface BenchmarkResult {
  schemaVersion: 1;
  modelId: string;
  source: 'real';
  input: 'synthetic';
  initializationMs: number;
  firstInferenceMs: number;
  warmInferenceMs: number[];
  warmP95Ms: number;
  outputCount: number;
  qualityEvaluated: false;
}

export function percentile95(samples: number[]): number {
  if (samples.length === 0 || samples.some((sample) => !Number.isFinite(sample) || sample < 0)) {
    throw new Error('Las mediciones deben ser finitas, no negativas y no estar vacías.');
  }
  const sorted = [...samples].sort((first, second) => first - second);
  return sorted[Math.ceil(sorted.length * .95) - 1]!;
}
