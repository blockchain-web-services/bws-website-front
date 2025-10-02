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
  timeout: 60000, // Increase test timeout to 60 seconds

  reporter: process.env.CI ? [
    ['json', { outputFile: './test-results.json' }],
    ['list'],
    ['line']
  ] : [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list']
  ],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 30000, // Increased from 15000
    navigationTimeout: 60000, // Increased from 30000 for slow network conditions
    viewport: { width: 1280, height: 720 }, // Explicit viewport for consistent CSS rendering
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
    command: 'npm run preview:sirv',
    port: parseInt(PORT),
    cwd: __dirname,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 120 * 1000, // 2 minutes
  },

  outputDir: 'test-results/',
});