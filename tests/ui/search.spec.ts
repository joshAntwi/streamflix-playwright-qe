import { test, expect } from '../../fixtures/auth.fixture';
import { SearchPage } from '../../pages/search.page';

test.describe('REQ-SEARCH: catalogue search', () => {
  test('finds a known title and opens details @smoke @regression', async ({ authenticatedPage: page }) => {
    const search = new SearchPage(page);
    await search.goto();
    await search.searchFor('crimson');
    await expect(search.cardFor('The Crimson Hour')).toBeVisible();
    await search.openTitle('The Crimson Hour');
    await expect(page.getByRole('dialog').getByRole('heading', { name: 'The Crimson Hour' })).toBeVisible();
  });

  test('shows an informative empty state @regression', async ({ authenticatedPage: page }) => {
    const search = new SearchPage(page);
    await search.goto();
    await search.searchFor('no-such-title-xy987654');
    await expect(page.getByText('Nothing matches that.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Browse all titles' })).toBeVisible();
  });

  test('allows search input to be cleared @regression', async ({ authenticatedPage: page }) => {
    const search = new SearchPage(page);
    await search.goto();
    await search.searchFor('crimson');
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(page.getByRole('textbox', { name: 'Search' })).toBeEmpty();
    await expect(search.cardFor('The Crimson Hour')).toBeVisible();
  });
});
