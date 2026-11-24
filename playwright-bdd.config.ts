import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';
import { resolve } from 'node:path';

// Gherkin is translated into Playwright tests; Playwright Test remains the runner.
const testDir = defineBddConfig({
  features: 'pw-bdd/features/**/*.feature',
  steps: 'pw-bdd/steps/**/*.ts',
  outputDir: 'pw-bdd/.features-gen',
});

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:4173';

export default defineConfig({
  testDir,
  timeout: 45_000,
  expect: { timeout: 8_000 },
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  forbidOnly: Boolean(process.env.CI),
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'pw-bdd/playwright-report' }],
    ['junit', { outputFile: 'pw-bdd/test-results/junit.xml' }],
    cucumberReporter('html', { outputFile: 'pw-bdd/reports/cucumber.html' }),
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: process.env.BASE_URL ? undefined : {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
    cwd: resolve(process.env.STREAMFLIX_DIR ?? '../streamflix'),
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
