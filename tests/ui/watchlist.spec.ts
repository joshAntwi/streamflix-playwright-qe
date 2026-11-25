import { test, expect } from '../../fixtures/auth.fixture';
import { SearchPage } from '../../pages/search.page';
import type { Page } from '@playwright/test';

async function saveCrimson(page: Page): Promise<void> {
  const search = new SearchPage(page);
  await search.goto();
  await search.searchFor('crimson');
  await search.openTitle('The Crimson Hour');
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Add to My List' }).click();
  await expect(dialog.getByRole('button', { name: 'Remove from My List' })).toBeVisible();
  await dialog.getByRole('button', { name: 'Close' }).click();
}

test.describe('REQ-LIST: saving and removing content', () => {
  test('shows an actionable empty state and returns viewers to discovery @regression', async ({ authenticatedPage: page }) => {
    await page.goto('/my-list');
    await expect(page.getByRole('heading', { name: 'Your list is empty.' })).toBeVisible();
    await page.getByRole('button', { name: 'Discover titles' }).click();
    await expect(page).toHaveURL(/\/browse$/);
  });

  test('saves a title and retains it after a reload @smoke @regression', async ({ authenticatedPage: page }) => {
    await saveCrimson(page);
    await page.goto('/my-list');

    const saved = page.getByRole('button', { name: 'Open The Crimson Hour' }).first();
    await expect(saved).toBeVisible();
    await page.reload();
    await expect(saved).toBeVisible();
    await expect(page.getByText('1 title saved for later')).toBeVisible();
  });

  test('removes a saved title and retains the empty state after reload @regression', async ({ authenticatedPage: page }) => {
    await saveCrimson(page);
    await page.goto('/my-list');
    await page.getByRole('button', { name: 'Open The Crimson Hour' }).first().click();

    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Remove from My List' }).click();
    await expect(dialog.getByRole('button', { name: 'Add to My List' })).toBeVisible();
    await dialog.getByRole('button', { name: 'Close' }).click();

    await expect(page.getByRole('heading', { name: 'Your list is empty.' })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Your list is empty.' })).toBeVisible();
  });
});
