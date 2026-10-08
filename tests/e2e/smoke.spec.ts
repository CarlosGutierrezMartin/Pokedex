import { expect, test } from '@playwright/test';

test('bienvenida y límites demo sin tráfico externo', async ({ page, baseURL }) => {
  const externalRequests: string[] = [];
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/*', (route) => {
    if (new URL(route.request().url()).origin !== baseURL) {
      externalRequests.push(route.request().url());
      return route.abort();
    }
    return route.continue();
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Un encuentro.');
  await expect(page.getByText('Modo demo', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Conocer la demostración' }).click();
  await expect(page.getByRole('heading', { name: 'Una primera mirada' })).toBeVisible();
  await expect(page.getByText(/No analiza fotografías/)).toBeVisible();
  await page.getByRole('button', { name: 'Cerrar detalles' }).click();
  await expect(page.getByRole('heading', { name: 'Una primera mirada' })).toHaveCount(0);
  await page.reload();
  await expect(page.getByText('Modo demo', { exact: true })).toBeVisible();
  expect(externalRequests).toEqual([]);
  expect(errors).toEqual([]);
  await page.screenshot({ path: test.info().outputPath('bienvenida-390.png'), fullPage: true });
});

test('pantalla estrecha y acceso por teclado', async ({ page, browserName }) => {
  const nextControl = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Conocer la demostración' })).toBeVisible();
  await page.keyboard.press(nextControl);
  await expect(page.getByRole('link', { name: 'Fauna, inicio' })).toBeFocused();
  await page.keyboard.press(nextControl);
  await expect(page.getByRole('button', { name: 'Conocer la demostración' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Una primera mirada' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: test.info().outputPath('demo-320.png'), fullPage: true });
});
