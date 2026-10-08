import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } } },
    { name: 'webkit', use: { ...devices['Desktop Safari'], viewport: { width: 390, height: 844 } } },
  ],
  webServer: { command: 'npm run preview:test', url: 'http://127.0.0.1:4173', reuseExistingServer: false },
});
