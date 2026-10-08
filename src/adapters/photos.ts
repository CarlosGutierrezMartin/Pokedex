import type { PhotoRecord } from './storage/repository';
import { PHOTO_LIMIT } from './storage/repository';

function encode(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('No se pudo preparar la foto.')), 'image/jpeg', quality));
}

export async function normalizePhoto(file: File, profileId: string): Promise<PhotoRecord> {
  if (!file.type.startsWith('image/') || file.size > 20 * 1024 * 1024) throw new Error('Elige una imagen de hasta 20 MiB. Si es HEIC y no abre, usa JPEG.');
  const bitmap = await createImageBitmap(file);
  try {
    if (bitmap.width * bitmap.height > 40_000_000) throw new Error('La imagen supera 40 megapíxeles. Elige una copia más pequeña.');
    const canvas = document.createElement('canvas');
    const factor = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    canvas.width = Math.max(1, Math.round(bitmap.width * factor));
    canvas.height = Math.max(1, Math.round(bitmap.height * factor));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('No se puede preparar la foto en este navegador.');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    let blob = await encode(canvas, .85);
    for (const quality of [.7, .55, .4]) {
      if (blob.size <= PHOTO_LIMIT) break;
      blob = await encode(canvas, quality);
    }
    if (blob.size > PHOTO_LIMIT) throw new Error('La copia supera 2 MiB. Selecciona otra foto.');
    const thumbnailCanvas = document.createElement('canvas');
    const thumbnailFactor = Math.min(1, 240 / Math.max(canvas.width, canvas.height));
    thumbnailCanvas.width = Math.max(1, Math.round(canvas.width * thumbnailFactor));
    thumbnailCanvas.height = Math.max(1, Math.round(canvas.height * thumbnailFactor));
    thumbnailCanvas.getContext('2d')!.drawImage(canvas, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);
    return { id: crypto.randomUUID(), profileId, blob, thumbnail: await encode(thumbnailCanvas, .7) };
  } finally { bitmap.close(); }
}
