import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  testDir: './src',

  testMatch: [
    '**/__tests__/**/*.integration.{test,spec}.{js,ts,jsx,tsx}',
    '**/*.integration.{test,spec}.{js,ts,jsx,tsx}',
  ],

  fullyParallel: true,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html'],
    ['json', {outputFile: 'playwright-report/results.json'}],
    process.env.CI ? ['github'] : ['list'],
  ],

  use: {
    baseURL: 'http://localhost:3000',

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome']},
    },
  ],
});
