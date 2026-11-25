import { test, expect } from '../../fixtures/auth.fixture';
import { SearchPage } from '../../pages/search.page';

test.describe('REQ-SEARCH: accurate catalogue discovery', () => {
  test('returns a relevant title regardless of query case, not unrelated titles @smoke @regression',
    async ({ authenticatedPage: page }) => {
      const search = new SearchPage(page);
      await page.getByRole('button', { name: 'Search', exact: true }).first().click();
      const navbarSearch = page.getByPlaceholder(/Titles, genres, people/);
      await navbarSearch.fill('CRIMSON');
      await navbarSearch.press('Enter');
      await expect(page).toHaveURL(/\/search\?q=CRIMSON$/i);

      await expect(search.cardFor('The Crimson Hour')).toBeVisible();
      await expect(search.cardFor('Atlas Falling')).toHaveCount(0);
      await search.openTitle('The Crimson Hour');
      const detail = page.getByRole('dialog');
      await expect(detail.getByRole('heading', { name: 'The Crimson Hour' })).toBeVisible();
      await expect(detail.getByRole('button', { name: 'Add to My List' })).toBeVisible();
    });

  test('applies genre filtering to results and clearly handles no matches @regression',
    async ({ authenticatedPage: page }) => {
      const search = new SearchPage(page);
      await search.goto();
      await search.searchFor('crimson');
      await expect(search.cardFor('The Crimson Hour')).toBeVisible();

      await page.getByRole('button', { name: 'Comedy', exact: true }).click();
      await expect(search.cardFor('The Crimson Hour')).toHaveCount(0);
      await expect(page.getByText('Nothing matches that.')).toBeVisible();

      await page.getByRole('button', { name: 'Drama', exact: true }).click();
      await expect(search.cardFor('The Crimson Hour')).toBeVisible();
    });

  test('shows a helpful empty state and allows recovery @regression', async ({ authenticatedPage: page }) => {
    const search = new SearchPage(page);
    await search.goto();
    await search.searchFor('no-such-title-xy987654');
    await expect(page.getByText('Nothing matches that.')).toBeVisible();
    await page.getByRole('button', { name: 'Browse all titles' }).click();
    await expect(page).toHaveURL(/\/browse$/);
    await expect(page.getByRole('link', { name: 'StreamFlix home' })).toBeVisible();
  });

  test('clearing a search resets the input and restores catalogue results @regression', async ({ authenticatedPage: page }) => {
    const search = new SearchPage(page);
    await search.goto();
    await search.searchFor('no-such-title-xy987654');
    await expect(page.getByText('Nothing matches that.')).toBeVisible();
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(page.getByRole('textbox', { name: 'Search' })).toBeEmpty();
    await expect(page.getByText('Nothing matches that.')).toBeHidden();
    await expect(search.cardFor('The Crimson Hour')).toBeVisible();
    await expect(page).toHaveURL(/\/search$/);
  });
});
