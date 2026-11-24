import { test, expect } from '../../fixtures/auth.fixture';
import { SearchPage } from '../../pages/search.page';

test.describe('REQ-DEEPLINK: users can actually use bookmarked routes', () => {
  test('opens a search deep link and retains its query and results after refresh @smoke @regression',
    async ({ authenticatedPage: page }) => {
      const search = new SearchPage(page);
      await page.goto('/search?q=crimson');
      await expect(page).toHaveURL(/\/search\?q=crimson$/);
      await expect(page.getByRole('textbox', { name: 'Search' })).toHaveValue('crimson');
      await expect(search.cardFor('The Crimson Hour')).toBeVisible();

      await page.reload();
      await expect(page).toHaveURL(/\/search\?q=crimson$/);
      await expect(page.getByRole('textbox', { name: 'Search' })).toHaveValue('crimson');
      await expect(search.cardFor('The Crimson Hour')).toBeVisible();
    });

  test('opens a bookmarked player URL for a signed-in profile @regression',
    async ({ authenticatedPage: page }) => {
      await page.goto('/watch/t1');
      await expect(page).toHaveURL(/\/watch\/t1$/);
      await expect(page.getByText('The Crimson Hour', { exact: true }).first()).toBeVisible();
      await expect(page.locator('video')).toBeVisible();

      await page.reload();
      await expect(page).toHaveURL(/\/watch\/t1$/);
      await expect(page.getByRole('slider', { name: 'Seek' })).toBeVisible();
    });
});
