import { cp, mkdir } from 'node:fs/promises';

await mkdir('public/runtime/mediapipe-1.1.0', { recursive: true });
await cp('node_modules/@mediapipe/tasks-vision/wasm', 'public/runtime/mediapipe-1.1.0', { recursive: true });
console.log('Runtime MediaPipe 1.1.0 preparado localmente, sin CDN.');
