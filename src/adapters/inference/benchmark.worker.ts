import { FilesetResolver, ImageClassifier } from '@mediapipe/tasks-vision';
import { percentile95 } from '../../domain/benchmark';
import type { BenchmarkResult } from '../../domain/benchmark';
import manifest from '../../test-support/model-artifacts.json';

self.onmessage = async (event: MessageEvent<{ modelId: string; origin: string }>) => {
  let classifier: ImageClassifier | undefined;
  try {
    const model = manifest.models.find((candidate) => candidate.id === event.data.modelId);
    const artifact = model?.files.find((file) => file.name === 'model.tflite');
    if (!model || !artifact) throw new Error('Modelo no registrado.');
    const start = performance.now();
    self.postMessage({ status: 'progress', message: 'Verificando pesos y cargando runtime local…' });
    const response = await fetch(`${event.data.origin}/models/${model.id}/model.tflite`);
    if (!response.ok) throw new Error('Faltan pesos. Ejecuta npm run prepare:models y vuelve a construir.');
    const buffer = await response.arrayBuffer();
    const checksum = [...new Uint8Array(await crypto.subtle.digest('SHA-256', buffer))].map((byte) => byte.toString(16).padStart(2, '0')).join('');
    if (buffer.byteLength !== artifact.bytes || checksum !== artifact.sha256) throw new Error('Pesos ausentes o corruptos: tamaño/checksum no coinciden.');
    const fileset = await FilesetResolver.forVisionTasks(`${event.data.origin}/runtime/mediapipe-1.1.0`);
    classifier = await ImageClassifier.createFromOptions(fileset, {
      baseOptions: { modelAssetBuffer: new Uint8Array(buffer), delegate: 'CPU' },
      runningMode: 'IMAGE',
      maxResults: 3,
    });
    const initializationMs = performance.now() - start;
    const canvas = new OffscreenCanvas(model.inputSize, model.inputSize);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D no disponible en worker.');
    context.fillStyle = '#808080';
    context.fillRect(0, 0, model.inputSize, model.inputSize);
    const inferenceStart = performance.now();
    const prediction = classifier.classify(canvas);
    const firstInferenceMs = performance.now() - inferenceStart;
    const warmInferenceMs: number[] = [];
    for (let index = 0; index < 20; index += 1) {
      const warmStart = performance.now();
      classifier.classify(canvas);
      warmInferenceMs.push(performance.now() - warmStart);
      self.postMessage({ status: 'progress', message: `Inferencia sintética ${index + 1}/20` });
    }
    const result: BenchmarkResult = {
      schemaVersion: 1, modelId: model.id, source: 'real', input: 'synthetic', initializationMs,
      firstInferenceMs, warmInferenceMs, warmP95Ms: percentile95(warmInferenceMs),
      outputCount: prediction.classifications[0]?.categories.length ?? 0, qualityEvaluated: false,
    };
    self.postMessage({ status: 'done', result });
  } catch (error) {
    self.postMessage({ status: 'error', message: error instanceof Error ? error.message : String(error) });
  } finally {
    classifier?.close();
  }
};
