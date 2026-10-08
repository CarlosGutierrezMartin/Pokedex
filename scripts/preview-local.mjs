import { readFileSync } from 'node:fs';
import { preview } from 'vite';

try {
  const cert = readFileSync(process.env.HTTPS_CERT ?? '.certs/local.pem');
  const key = readFileSync(process.env.HTTPS_KEY ?? '.certs/local-key.pem');
  const server = await preview({ preview: { host: '0.0.0.0', port: 4173, strictPort: true, https: { cert, key } } });
  server.printUrls();
} catch (error) {
  console.error('No se pudo iniciar HTTPS local. Consulta docs/04-arquitectura.md (guía Mac→iPhone).');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
