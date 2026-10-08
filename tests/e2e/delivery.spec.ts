import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { expect, test } from '@playwright/test';

test('interfaz instalada: servidor apagado conserva encuentros en página nueva', async ({ page, context, baseURL }) => {
  const server = createServer(async (request, response) => {
    try {
      const upstream = await fetch(`${baseURL}${request.url}`);
      response.writeHead(upstream.status, { 'Content-Type': upstream.headers.get('content-type') ?? 'application/octet-stream' });
      response.end(Buffer.from(await upstream.arrayBuffer()));
    } catch { response.writeHead(502); response.end(); }
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('No se abrió el servidor de prueba.');
  const origin = `http://127.0.0.1:${address.port}`;
  const outgoing: string[] = [];
  context.on('request', (request) => { if (new URL(request.url()).origin !== origin) outgoing.push(request.url()); });
  try {
    await page.goto(`${origin}/demo/escanear`);
    await page.getByRole('button', { name: 'Guardar pendiente', exact: true }).click();
    await page.getByRole('link', { name: 'Ajustes', exact: true }).click();
    await expect(page.getByText('Interfaz UX preparada sin conexión en este navegador.', { exact: true })).toBeVisible();
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    const cached = await page.evaluate(async () => {
      const names = await caches.keys();
      return (await Promise.all(names.map(async (name) => (await (await caches.open(name)).keys()).map((request) => request.url)))).flat();
    });
    expect(cached.some((url) => url.includes('index.html'))).toBe(true);
    expect(cached.some((url) => /\/(models|runtime)\//.test(url))).toBe(false);
    await page.close();
    await new Promise<void>((resolve, reject) => { server.close((error) => error ? reject(error) : resolve()); server.closeAllConnections(); });
    await expect(fetch(`${origin}/index.html`)).rejects.toThrow();
    const reopened = await context.newPage();
    await reopened.goto(`${origin}/demo/cuaderno`);
    await expect(reopened.getByText('1 encuentros guardados en este perfil local.')).toBeVisible();
    await reopened.getByRole('navigation').getByRole('link', { name: 'Escanear', exact: true }).click();
    await reopened.getByRole('button', { name: 'Guardar pendiente', exact: true }).click();
    await reopened.getByRole('navigation').getByRole('link', { name: 'Cuaderno', exact: true }).click();
    await expect(reopened.getByText('2 encuentros guardados en este perfil local.')).toBeVisible();
    await reopened.reload();
    await expect(reopened.getByText('2 encuentros guardados en este perfil local.')).toBeVisible();
    expect(outgoing).toEqual([]);
  } finally {
    if (server.listening) await new Promise<void>((resolve) => { server.close(() => resolve()); server.closeAllConnections(); });
  }
});

test('feedback exportable, eventos opcionales sin notas/fotos/GPS y limpieza independiente', async ({ page }) => {
  await page.goto('/demo/ajustes');
  await page.getByText('Feedback y diagnóstico local', { exact: true }).click();
  await expect(page.getByLabel('Registrar eventos locales')).not.toBeChecked();
  await page.getByLabel('Registrar eventos locales').check();
  await page.getByLabel('Comentario de prueba').fill('El botón de confirmar se entiende');
  await page.getByRole('button', { name: 'Guardar comentario local' }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'Escanear', exact: true }).click();
  await page.getByLabel('Notas (opcional)').fill('NO_EXPORTAR_ESTA_NOTA');
  await page.getByRole('button', { name: 'Simular captura' }).click();
  await page.getByRole('button', { name: 'Guardar pendiente', exact: true }).click();
  await page.getByRole('link', { name: 'Ajustes', exact: true }).click();
  await page.getByText('Feedback y diagnóstico local', { exact: true }).click();
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar feedback y eventos' }).click();
  const content = await readFile((await (await downloaded).path())!, 'utf8');
  const data = JSON.parse(content);
  expect(data.source).toBe('demo');
  expect(data.feedback[0].comment).toBe('El botón de confirmar se entiende');
  expect(data.events.map((entry: { name: string }) => entry.name)).toEqual(expect.arrayContaining(['session_started', 'scanner_opened', 'capture_taken', 'candidates_shown', 'observation_saved']));
  expect(content).not.toMatch(/NO_EXPORTAR_ESTA_NOTA|photoIds|latitude|longitude|profileId/);
  await page.getByRole('button', { name: 'Borrar diagnóstico local' }).click();
  await expect(page.getByLabel('Registrar eventos locales')).not.toBeChecked();
  await page.getByRole('navigation').getByRole('link', { name: 'Cuaderno', exact: true }).click();
  await expect(page.getByText('1 encuentros guardados en este perfil local.')).toBeVisible();
});

test('escenarios y pantallas representativas no afirman identificación real', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Colecciones para empezar' })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('explorar.png'), fullPage: true });
  await page.getByRole('navigation').getByRole('link', { name: 'Colección', exact: true }).click();
  await page.getByRole('link', { name: /Gorrión común/ }).click();
  await page.screenshot({ path: test.info().outputPath('ficha.png'), fullPage: true });
  await page.getByRole('navigation').getByRole('link', { name: 'Escanear', exact: true }).click();
  await expect(page.getByLabel('Fecha del encuentro (opcional)')).toHaveValue('');
  const heights = await page.locator('select').evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().height));
  expect(heights.every((height) => height >= 44)).toBe(true);
  await page.screenshot({ path: test.info().outputPath('escanear.png'), fullPage: true });
  await page.getByRole('link', { name: 'Ajustes', exact: true }).click();
  await page.getByText('Procedencia y cobertura del paquete demo', { exact: true }).click();
  await expect(page.getByText(/Cobertura de identificación real aprobada: ninguna especie/)).toBeVisible();
  await expect(page.getByText(/No se incorporan fotografías ni contenido de terceros/)).toBeVisible();
  await page.getByText('Procedencia y cobertura del paquete demo', { exact: true }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: test.info().outputPath('paquete-demo.png') });
  await page.getByText('Panel local de escenarios', { exact: true }).click();
  await page.getByLabel('Escenario demo').selectOption('doubt');
  await page.getByRole('link', { name: 'Abrir captura del escenario' }).click();
  await page.getByRole('button', { name: 'Simular captura' }).click();
  await expect(page.getByRole('heading', { name: 'Está bien tener dudas.' })).toBeVisible();
  await expect(page.getByRole('radio')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Confirmar y guardar' })).toBeDisabled();
  await page.screenshot({ path: test.info().outputPath('duda.png'), fullPage: true });
  await page.getByRole('button', { name: 'Guardar pendiente', exact: true }).click();
  await page.getByRole('link', { name: 'Ajustes', exact: true }).click();
  await page.getByText('Panel local de escenarios', { exact: true }).click();
  await page.getByLabel('Escenario demo').selectOption('permission');
  await page.getByRole('link', { name: 'Abrir captura del escenario' }).click();
  await expect(page.getByText(/Simulación: permiso de cámara denegado/)).toBeVisible();
  await expect(page.getByLabel('Elegir foto local (opcional)')).toBeEnabled();
  await page.getByRole('link', { name: 'Ajustes', exact: true }).click();
  await page.getByText('Panel local de escenarios', { exact: true }).click();
  await page.getByLabel('Escenario demo').selectOption('pack');
  await page.getByRole('navigation').getByRole('link', { name: 'Explorar', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('paquete incompleto');
});
