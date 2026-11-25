import { test, expect } from '../../fixtures/auth.fixture';
import { SearchPage } from '../../pages/search.page';

// The app's service worker caches artwork and can bypass page routing.
test.use({ serviceWorkers: 'block' });

// Images are hosted by a third party; a catalogue should not become unusable
// when that CDN is blocked. This verifies content discovery, not only navigation.
test('REQ-RESILIENCE: missing artwork does not block search or title details @regression',
  async ({ authenticatedPage: page }) => {
    const abortedImages = new Set<string>();
    await page.route('https://picsum.photos/**', async route => {
      const request = route.request();
      await route.abort('failed');
      if (request.resourceType() === 'image') abortedImages.add(request.url());
    });
    const search = new SearchPage(page);
    await search.goto();
    await search.searchFor('crimson');
    const card = search.cardFor('The Crimson Hour');
    await expect(card).toBeVisible();
    const artwork = card.getByRole('img', { name: 'The Crimson Hour' });
    const artworkUrl = await artwork.evaluate((image: HTMLImageElement) => image.src);
    await expect.poll(() => abortedImages.has(artworkUrl), {
      message: 'The rendered title artwork request should be aborted',
    }).toBe(true);

    await search.openTitle('The Crimson Hour');
    await expect(page.getByRole('dialog').getByRole('heading', { name: 'The Crimson Hour' })).toBeVisible();
    await expect(page.getByRole('dialog').getByRole('button', { name: 'Add to My List' })).toBeVisible();
  });
