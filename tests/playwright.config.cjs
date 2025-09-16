const { defineConfig, devices } = require('@playwright/test');

// Define port consistently for both CI and local
const PORT = process.env.PORT || '4321';
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${PORT}`;

module.exports = defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.{js,ts}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list']
  ],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'smoke',
      testMatch: 'smoke/*.spec.{js,ts}',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'e2e',
      testMatch: 'e2e/*.spec.{js,ts}',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: process.env.NO_WEBSERVER ? undefined : {
    command: 'npm run preview',
    port: parseInt(PORT),
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 120 * 1000, // 2 minutes
  },

  outputDir: 'test-results/',
});