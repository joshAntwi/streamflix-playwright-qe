import { test, expect } from '../../fixtures/auth.fixture';
import { SearchPage } from '../../pages/search.page';

test.describe('REQ-PLAYER: playback journeys and controls', () => {
  test('opens a selected title in the player and toggles media mute @smoke @regression', async ({ authenticatedPage: page }) => {
    const search = new SearchPage(page);
    await search.goto();
    await search.searchFor('crimson');
    await search.openTitle('The Crimson Hour');
    await page.getByRole('dialog').getByRole('button', { name: 'Play', exact: true }).click();

    await expect(page).toHaveURL(/\/watch\/t1$/);
    await expect(page.getByText(/The Crimson Hour/).first()).toBeVisible();

    const video = page.locator('video');
    await expect(video).toBeVisible();
    await page.getByRole('button', { name: 'Mute', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Unmute', exact: true })).toBeVisible();
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.muted)).toBe(true);

    await page.getByRole('button', { name: 'Unmute', exact: true }).click();
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.muted)).toBe(false);
    await expect(page.getByRole('button', { name: 'Mute', exact: true })).toBeVisible();
  });

  test('changes the actual playback speed from settings @regression', async ({ authenticatedPage: page }) => {
    await page.goto('/watch/t1');
    const video = page.locator('video');
    await expect(video).toBeVisible();

    await page.getByRole('button', { name: 'Settings', exact: true }).click();
    await page.getByRole('button', { name: '1.5x', exact: true }).click();
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.playbackRate)).toBe(1.5);

    await page.getByRole('button', { name: '1x', exact: true }).click();
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.playbackRate)).toBe(1);
  });

  test('explains missing content and returns the viewer to browse @regression', async ({ authenticatedPage: page }) => {
    await page.goto('/watch/does-not-exist');
    await expect(page.getByText('Title not found.', { exact: false })).toBeVisible();

    await page.getByRole('button', { name: 'Go back' }).click();
    await expect(page).toHaveURL(/\/browse$/);
    await expect(page.getByRole('link', { name: 'StreamFlix home' })).toBeVisible();
  });

  test('can decode the external HLS stream and advance playback @external-stream', async ({ authenticatedPage: page }) => {
    test.skip(!process.env.RUN_LIVE_STREAM, 'Optional external-stream check: CDN/network availability is outside the test environment');
    test.slow();
    await page.goto('/watch/t1');
    const video = page.locator('video');
    await expect(video).toBeVisible();

    // Actual media readiness and timeline advancement (not just a Play button).
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.readyState), {
      timeout: 30_000,
      message: 'HLS stream never provided decodable media',
    }).toBeGreaterThanOrEqual(2);

    // Muted playback avoids browser autoplay policy blocking the test.
    await video.evaluate(async (element: HTMLVideoElement) => {
      element.muted = true;
      await element.play();
    });
    const firstPosition = await video.evaluate((element: HTMLVideoElement) => element.currentTime);
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime), {
      timeout: 20_000,
      message: 'Video timeline did not advance with real playback',
    }).toBeGreaterThan(firstPosition + 1);
  });
});
