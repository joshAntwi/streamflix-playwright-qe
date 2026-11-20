import { After, AfterAll, Before, BeforeAll, Status } from '@cucumber/cucumber';
import { chromium, type Browser } from '@playwright/test';
import { appUrl, startAppIfNeeded, stopApp } from './app-server.ts';
import type { StreamFlixWorld } from './world.ts';

let browser: Browser;

// Cucumber owns lifecycle and retries; Playwright Test fixtures are NOT active.
BeforeAll({ timeout: 240_000 }, async function () {
  await startAppIfNeeded();
  browser = await chromium.launch({ headless: process.env.HEADED !== '1' });
});

Before(async function (this: StreamFlixWorld) {
  this.context = await browser.newContext({ baseURL: appUrl, viewport: { width: 1280, height: 800 } });
  this.page = await this.context.newPage();
});

After(async function (this: StreamFlixWorld, { result }) {
  try {
    if (result?.status === Status.FAILED && this.page && !this.page.isClosed()) {
      await this.attach(await this.page.screenshot({ fullPage: true }), 'image/png');
    }
  } finally {
    await this.context?.close();
  }
});

AfterAll(async function () {
  try {
    await browser?.close();
  } finally {
    stopApp();
  }
});
