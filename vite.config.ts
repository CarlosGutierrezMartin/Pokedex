import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'prompt',
    includeAssets: ['assets/icon.svg', 'assets/icon-180.png'],
    manifest: {
      id: '/', name: 'Fauna · Piloto local', short_name: 'Fauna', lang: 'es',
      description: 'Cuaderno local y colección de demostración. Identificación real pendiente.',
      start_url: '/', scope: '/', display: 'standalone',
      theme_color: '#bc3832', background_color: '#f8f5e9',
      icons: [192, 512].map((size) => ({ src: `/assets/icon-${size}.png`, sizes: `${size}x${size}`, type: 'image/png', purpose: 'any maskable' })),
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html}'],
      globIgnores: ['models/**', 'runtime/**', '**/benchmark.worker-*.js'],
      navigateFallbackDenylist: [/^\/models\//, /^\/runtime\//],
      maximumFileSizeToCacheInBytes: 1024 * 1024,
      cleanupOutdatedCaches: true,
    },
  })],
  test: { include: ['src/**/*.test.ts'] },
});
