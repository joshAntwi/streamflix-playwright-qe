import { World, setWorldConstructor } from '@cucumber/cucumber';
import type { BrowserContext, Page } from '@playwright/test';

// New World per scenario. Page/context are created in Before and closed in After.
export class StreamFlixWorld extends World {
  page!: Page;
  context!: BrowserContext;
}

setWorldConstructor(StreamFlixWorld);
