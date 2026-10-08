import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';

const manifest = JSON.parse(await readFile('src/test-support/model-artifacts.json', 'utf8'));
for (const model of manifest.models) {
  const directory = `public/models/${model.id}`;
  await mkdir(directory, { recursive: true });
  for (const artifact of model.files) {
    const target = `${directory}/${artifact.name}`;
    const valid = (buffer) => buffer.length === artifact.bytes && createHash('sha256').update(buffer).digest('hex') === artifact.sha256;
    const existing = await readFile(target).catch(() => null);
    if (existing && valid(existing)) {
      console.log(`${model.id}/${artifact.name}: verificado`);
      continue;
    }
    const response = await fetch(artifact.url, { signal: AbortSignal.timeout(60000) });
    if (!response.ok || !response.body) throw new Error(`Descarga fallida: ${artifact.name} (${response.status})`);
    const chunks = [];
    let bytes = 0;
    for await (const chunk of response.body) {
      bytes += chunk.length;
      if (bytes > artifact.bytes) throw new Error(`Tamaño excedido: ${artifact.name}`);
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    if (!valid(buffer)) throw new Error(`Checksum o tamaño incorrecto: ${artifact.name}`);
    await writeFile(`${target}.staging`, buffer);
    await rename(`${target}.staging`, target);
    console.log(`${model.id}/${artifact.name}: ${bytes} bytes verificados`);
  }
}
