import { test, expect } from '../../fixtures/auth.fixture';
import { SearchPage } from '../../pages/search.page';
import type { Page } from '@playwright/test';

async function saveTitle(page: Page) {
  const search = new SearchPage(page);
  await search.goto();
  await search.searchFor('crimson');
  await expect(search.cardFor('The Crimson Hour')).toBeVisible();
  await search.openTitle('The Crimson Hour');
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'The Crimson Hour' })).toBeVisible();
  await dialog.getByRole('button', { name: 'Add to My List' }).click();
  await expect(dialog.getByRole('button', { name: 'Remove from My List' })).toBeVisible();
  await dialog.getByRole('button', { name: 'Close' }).click();
}

test.describe('REQ-LIST: save and remove content', () => {
  test('saves a discovered title and preserves it through a reload @smoke @regression',
    async ({ authenticatedPage: page }) => {
      await page.goto('/my-list');
      await expect(page.getByRole('heading', { name: 'Your list is empty.' })).toBeVisible();

      await saveTitle(page);
      await page.goto('/my-list');
      const saved = page.getByRole('button', { name: 'Open The Crimson Hour' }).first();
      await expect(saved).toBeVisible();
      await expect(page.getByText('1 title saved for later')).toBeVisible();

      await page.reload();
      await expect(saved).toBeVisible();
      await expect(page.getByText('1 title saved for later')).toBeVisible();
    });

  test('removes a saved title and keeps it removed after refresh @regression',
    async ({ authenticatedPage: page }) => {
      await saveTitle(page);
      await page.goto('/my-list');

      await page.getByRole('button', { name: 'Open The Crimson Hour' }).first().click();
      await page.getByRole('dialog').getByRole('button', { name: 'Remove from My List' }).click();
      await page.getByRole('dialog').getByRole('button', { name: 'Close' }).click();

      await expect(page.getByRole('heading', { name: 'Your list is empty.' })).toBeVisible();
      await page.reload();
      await expect(page.getByRole('heading', { name: 'Your list is empty.' })).toBeVisible();
    });
});
