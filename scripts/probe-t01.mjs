import { chromium, webkit } from '@playwright/test';
import { preview } from 'vite';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const server = await preview({ preview: { host: '127.0.0.1', port: 4173, strictPort: true } });
const reports = [];
const manifest = JSON.parse(await readFile('src/test-support/model-artifacts.json', 'utf8'));
try {
  for (const [name, engine] of Object.entries({ chromium, webkit })) {
    const browser = await engine.launch();
    try {
      const page = await browser.newPage();
      for (const model of manifest.models) {
      await page.goto('http://127.0.0.1:4173/tecnica');
      await page.getByLabel('Candidato').selectOption(model.id);
      await page.getByRole('button', { name: 'Ejecutar 1 + 20 inferencias' }).click();
      const report = page.getByTestId('technical-report');
      await report.waitFor({ timeout: 60000 });
      const result = JSON.parse(await report.innerText());
      reports.push({ browser: name, version: browser.version(), environment: await page.evaluate(() => navigator.userAgent), ...result });
      console.log(name, JSON.stringify(result));
      if (result.error) process.exitCode = 1;
      }
    } finally {
      await browser.close();
    }
  }
  await mkdir('docs/evidencia', { recursive: true });
  await writeFile('docs/evidencia/t01-desktop.json', JSON.stringify({ date: new Date().toISOString(), input: 'synthetic', qualityEvaluated: false, reports }, null, 2) + '\n');
} finally {
  await new Promise((resolve) => server.httpServer.close(resolve));
}
