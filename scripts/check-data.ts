import { demoCollections, demoSpecies } from '../src/test-support/catalog.ts';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const pack = JSON.parse(await readFile(new URL('../src/test-support/demo-pack.json', import.meta.url), 'utf8'));
if (pack.schemaVersion !== 1 || pack.id !== 'fauna-ux-demo' || pack.version !== 'demo-1' || pack.source !== 'demo' || pack.reviewStatus !== 'synthetic-fixture' || pack.coverage.verifiedLocalPresence !== false || pack.coverage.supportedSpeciesIds.length !== 0 || pack.models.length !== 0) throw new Error('El paquete UX no puede atribuirse revisión biológica ni cobertura IA.');
if (pack.speciesIds.join('|') !== demoSpecies.map((entry) => entry.id).join('|') || pack.collectionIds.join('|') !== demoCollections.map((entry) => entry.id).join('|') || demoCollections.some((entry) => entry.version !== pack.version)) throw new Error('El manifiesto no coincide con el catálogo/versiones.');
const requiredFiles = ['src/test-support/catalog.ts', 'src/ui/AnimalArt.tsx'];
if (pack.files.length !== requiredFiles.length || requiredFiles.some((path) => !pack.files.some((file: { path: string }) => file.path === path))) throw new Error('Manifiesto de integridad incompleto.');
for (const file of pack.files) {
  if (!requiredFiles.includes(file.path) || !file.provenance || !file.licenseStatus) throw new Error('Ruta o procedencia de contenido inválida.');
  const bytes = await readFile(new URL(`../${file.path}`, import.meta.url));
  if (bytes.length !== file.bytes || createHash('sha256').update(bytes).digest('hex') !== file.sha256) throw new Error(`Integridad incorrecta: ${file.path}. Revisar contenido y versión antes de actualizar el manifiesto.`);
}

const ids = new Set(demoSpecies.map((species) => species.id));
if (ids.size !== demoSpecies.length || demoSpecies.some((species) => species.source !== 'demo' || species.verifiedLocalPresence !== false || !species.id.startsWith('demo-'))) throw new Error('Fixtures duplicados o sin frontera demo.');
if (new Set(demoCollections.map((collection) => collection.id)).size !== demoCollections.length) throw new Error('Colecciones duplicadas.');
for (const collection of demoCollections) {
  if (collection.memberSpeciesIds.length === 0 || new Set(collection.memberSpeciesIds).size !== collection.memberSpeciesIds.length || collection.memberSpeciesIds.some((id) => !ids.has(id))) throw new Error(`Miembros inválidos: ${collection.id}`);
}
console.log(`${demoSpecies.length} fichas y ${demoCollections.length} colecciones demo válidas; presencia local sin verificar.`);
console.log(`Paquete ${pack.id}@${pack.version}: integridad y procedencia comprobadas; 0 especies con identificación real aprobada.`);
