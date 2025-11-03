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
  timeout: 90000, // Increase test timeout to 90 seconds for slow CI/CD environments

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
    video: 'off', // Disable video recording - screenshots and traces are sufficient for debugging
    actionTimeout: 30000, // Increased from 15000
    navigationTimeout: 60000, // Increased from 30000 for slow network conditions
    viewport: { width: 1280, height: 720 }, // Explicit viewport for consistent CSS rendering
    launchOptions: {
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-sandbox'
      ]
    }
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Force headless mode to match CI/CD environment
        launchOptions: {
          headless: true,
        },
      },
    },
    {
      name: 'smoke',
      testMatch: 'smoke/*.spec.{js,ts}',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          headless: true,
        },
      },
    },
    {
      name: 'e2e',
      testMatch: 'e2e/*.spec.{js,ts}',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          headless: true,
        },
      },
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