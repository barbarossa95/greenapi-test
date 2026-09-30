import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  resolve: {tsconfigPaths: true},
  plugins: [
    react(),
    svgr({
      include: '**/*.svg',
      svgrOptions: {icon: true, exportType: 'default'},
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/shared/lib/test/setup.tsx'],
    css: true,
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['**/*.integration.test.{js,jsx,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/shared/ui/**/*.{js,jsx,ts,tsx}'],
      exclude: ['src/shared/ui/**/index.ts', 'src/shared/ui/**/*.test.tsx'],
    },
  },
});
