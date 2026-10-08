import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test('modelo ausente produce error recuperable sin fingir una predicción', async ({ page }) => {
  await page.route('**/models/**', (route) => route.fulfill({ status: 404, body: 'Not found' }));
  await page.goto('/tecnica');
  await page.getByRole('button', { name: 'Ejecutar 1 + 20 inferencias' }).click();
  await expect(page.getByTestId('technical-report')).toContainText('Faltan pesos');
  await expect(page.getByRole('status')).toContainText('No se ha generado una identificación');
  await expect(page.getByRole('button', { name: 'Ejecutar 1 + 20 inferencias' })).toBeEnabled();
  await page.getByRole('button', { name: 'Ejecutar 1 + 20 inferencias' }).click();
  await expect(page.getByTestId('technical-report')).toContainText('Faltan pesos');
});
