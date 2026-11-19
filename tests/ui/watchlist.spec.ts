import { test, expect } from '../../fixtures/auth.fixture';
import { SearchPage } from '../../pages/search.page';
import type { Page } from '@playwright/test';

async function addCrimsonToList(page: Page) {
  const search = new SearchPage(page);
  await search.goto();
  await search.searchFor('crimson');
  await search.openTitle('The Crimson Hour');
  await page.getByRole('dialog').getByRole('button', { name: 'Add to My List' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Close' }).click();
}

test.describe('REQ-LIST: saved content', () => {
  test('renders a useful empty list state @regression', async ({ authenticatedPage: page }) => {
    await page.goto('/my-list');
    await expect(page.getByRole('heading', { name: 'Your list is empty.' })).toBeVisible();
  });

  test('adds a title and preserves it after reload @smoke @regression', async ({ authenticatedPage: page }) => {
    await addCrimsonToList(page);
    await page.goto('/my-list');
    const saved = page.getByRole('button', { name: 'Open The Crimson Hour' }).first();
    await expect(saved).toBeVisible();
    await page.reload();
    await expect(saved).toBeVisible();
  });

  test('removes a title from the watchlist @regression', async ({ authenticatedPage: page }) => {
    await addCrimsonToList(page);
    await page.goto('/my-list');
    await page.getByRole('button', { name: 'Open The Crimson Hour' }).first().click();
    await page.getByRole('dialog').getByRole('button', { name: 'Remove from My List' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('heading', { name: 'Your list is empty.' })).toBeVisible();
  });
});
