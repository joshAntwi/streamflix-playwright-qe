import { test, expect } from '../../fixtures/auth.fixture';
import { SearchPage } from '../../pages/search.page';

test.describe('REQ-SEARCH: finding streaming content', () => {
  test('searches from the catalogue navbar and opens matching details @smoke @regression', async ({ authenticatedPage: page }) => {
    await page.getByRole('button', { name: 'Search', exact: true }).first().click();
    const navbarSearch = page.getByPlaceholder(/Titles, genres, people/);
    await navbarSearch.fill('crimson');
    await navbarSearch.press('Enter');

    await expect(page).toHaveURL(/\/search\?q=crimson$/);
    const search = new SearchPage(page);
    await expect(page.getByRole('textbox', { name: 'Search' })).toHaveValue('crimson');
    await expect(search.cardFor('The Crimson Hour')).toBeVisible();
    await search.openTitle('The Crimson Hour');
    await expect(page.getByRole('dialog').getByRole('heading', { name: 'The Crimson Hour' })).toBeVisible();
  });

  test('opens a bookmarked search URL and preserves the result after reload @smoke @regression', async ({ authenticatedPage: page }) => {
    // A functional deep-link test must execute the SPA in a browser,
    // hydrate the query and validate the actual rendered result.
    await page.goto('/search?q=crimson');

    const searchInput = page.getByRole('textbox', { name: 'Search' });
    await expect(page).toHaveURL(/\/search\?q=crimson$/);
    await expect(searchInput).toHaveValue('crimson');
    await expect(new SearchPage(page).cardFor('The Crimson Hour')).toBeVisible();

    await page.reload();
    await expect(page).toHaveURL(/\/search\?q=crimson$/);
    await expect(searchInput).toHaveValue('crimson');
    await expect(new SearchPage(page).cardFor('The Crimson Hour')).toBeVisible();
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
