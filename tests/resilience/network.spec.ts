import { test, expect } from '../../fixtures/auth.fixture';
import { SearchPage } from '../../pages/search.page';

// Images are hosted by a third party; a catalogue should not become unusable
// when that CDN is blocked. This verifies content discovery, not only navigation.
test('REQ-RESILIENCE: missing artwork does not block search or title details @regression',
  async ({ authenticatedPage: page }) => {
    await page.route('https://picsum.photos/**', (route) => route.abort('failed'));
    const search = new SearchPage(page);
    await search.goto();
    await search.searchFor('crimson');
    await expect(search.cardFor('The Crimson Hour')).toBeVisible();

    await search.openTitle('The Crimson Hour');
    await expect(page.getByRole('dialog').getByRole('heading', { name: 'The Crimson Hour' })).toBeVisible();
    await expect(page.getByRole('dialog').getByRole('button', { name: 'Add to My List' })).toBeVisible();
  });
