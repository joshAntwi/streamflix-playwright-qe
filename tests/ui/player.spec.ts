import { test, expect } from '../../fixtures/auth.fixture';
import { SearchPage } from '../../pages/search.page';
import { PlayerPage } from '../../pages/player.page';
import { fileURLToPath } from 'node:url';

test.describe('REQ-PLAYER: meaningful control and recovery behaviour', () => {
  test('opens a selected title in the player @smoke @regression', async ({ authenticatedPage: page }) => {
    const search = new SearchPage(page);
    const player = new PlayerPage(page);
    await search.goto();
    await search.searchFor('crimson');
    await search.openTitle('The Crimson Hour');
    await page.getByRole('dialog').getByRole('button', { name: 'Play', exact: true }).click();

    await expect(page).toHaveURL(/\/watch\/t1$/);
    await expect(page.getByText(/The Crimson Hour/).first()).toBeVisible();
    await expect(player.video).toBeVisible();
  });

  test('plays an episode and resumes its saved position after reopening @regression',
    async ({ authenticatedPage: page, browserName, isMobile }) => {
      test.skip(browserName !== 'chromium' || isMobile, 'The HLS fixture is validated on desktop Chromium');
      const stream = 'https://test-streams.mux.dev/x36xhzz/';
      const headers = { 'access-control-allow-origin': '*' };
      const assets = new Map([
        [`${stream}x36xhzz.m3u8`, { name: 'clip.m3u8', contentType: 'application/vnd.apple.mpegurl' }],
        [`${stream}clip-0.mpegts`, { name: 'clip-0.mpegts', contentType: 'video/mp2t' }],
      ]);
      await page.route('https://test-streams.mux.dev/**', async route => {
        const asset = assets.get(route.request().url());
        if (!asset) {
          await route.abort();
          return;
        }
        await route.fulfill({
          path: fileURLToPath(new URL(`../../fixtures/media/${asset.name}`, import.meta.url)),
          contentType: asset.contentType,
          headers,
        });
      });

      const search = new SearchPage(page);
      const player = new PlayerPage(page);
      await search.goto();
      await search.searchFor('crimson');
      await search.openTitle('The Crimson Hour');
      await page.getByRole('dialog').getByRole('button', { name: 'Play', exact: true }).click();
      await expect(page).toHaveURL(/\/watch\/t1$/);

      await expect.poll(() => player.ready()).toBe(true);
      await player.revealControls();
      if (await player.video.evaluate((video: HTMLVideoElement) => video.paused)) {
        await page.getByRole('button', { name: 'Play', exact: true }).click();
      }
      const initialTime = await player.currentTime();
      await expect.poll(() => player.currentTime()).toBeGreaterThan(initialTime + 1);

      // Wait for the app's periodic write before leaving the player.
      const savedPosition = () => page.evaluate(() => {
        const state = JSON.parse(localStorage.getItem('streamflix.state.v1') ?? '{}') as {
          progress?: { titleId: string; episodeId: string; positionSec: number }[];
        };
        return state.progress?.find(p => p.titleId === 't1' && p.episodeId === 't1-s1e1')?.positionSec ?? 0;
      });
      await expect.poll(savedPosition, { timeout: 12_000 }).toBeGreaterThan(2);
      const position = await savedPosition();

      await page.goto('/browse');
      // Observe a seek on reopen so ordinary playback from zero cannot pass.
      const seekPositions: number[] = [];
      await page.exposeFunction('recordResumeSeek', (seconds: number) => {
        seekPositions.push(seconds);
      });
      await page.addInitScript(() => {
        const browser = window as Window & { recordResumeSeek?: (seconds: number) => Promise<void> };
        document.addEventListener('seeked', event => {
          if (event.target instanceof HTMLVideoElement) void browser.recordResumeSeek?.(event.target.currentTime);
        }, true);
      });
      await player.goto();
      await expect.poll(() => seekPositions.some(seconds => Math.abs(seconds - position) < 0.75), {
        message: `The reopened episode should seek to its saved position (${position.toFixed(2)}s)`,
      }).toBe(true);
    });

  test('mute button and keyboard shortcut update the actual media element @regression',
    async ({ authenticatedPage: page }) => {
      const player = new PlayerPage(page);
      await player.goto();
      await player.revealControls();
      await expect(player.video).toBeVisible();
      await expect.poll(() => player.muted()).toBe(false);

      await page.getByRole('button', { name: 'Mute', exact: true }).click();
      await expect.poll(() => player.muted()).toBe(true);
      await expect(page.getByRole('button', { name: 'Unmute' })).toBeVisible();

      await page.keyboard.press('m');
      await expect.poll(() => player.muted()).toBe(false);
      await expect(page.getByRole('button', { name: 'Mute', exact: true })).toBeVisible();
    });

  test('playback-speed setting changes HTMLMediaElement playbackRate @regression',
    async ({ authenticatedPage: page }) => {
      const player = new PlayerPage(page);
      await player.goto();
      await player.revealControls();
      await page.getByRole('button', { name: 'Settings' }).click();
      await page.getByRole('button', { name: '1.5x', exact: true }).click();

      await expect.poll(() => player.playbackRate()).toBe(1.5);
      await page.getByRole('button', { name: '1x', exact: true }).click();
      await expect.poll(() => player.playbackRate()).toBe(1);
    });

  test('invalid title offers recovery and returns to a usable catalogue @regression',
    async ({ authenticatedPage: page }) => {
      const player = new PlayerPage(page);
      await player.goto('does-not-exist');
      await expect(page.getByText('Title not found.')).toBeVisible();
      await page.getByRole('button', { name: 'Go back' }).click();
      await expect(page).toHaveURL(/\/browse$/);
      await expect(page.getByRole('button', { name: 'Open The Crimson Hour' }).first()).toBeVisible();
    });

  test('external HLS stream plays and advances its media clock @external-media', async ({ authenticatedPage: page }) => {
    test.skip(process.env.RUN_MEDIA !== '1', 'External HLS/CDN dependency: run explicitly, not in deterministic CI gates');
    test.setTimeout(90_000);
    const player = new PlayerPage(page);
    await player.goto();
    await expect.poll(() => player.ready(), { timeout: 60_000 }).toBe(true);
    // A real streaming assertion, unlike checking only that the video element exists.
    await player.video.evaluate(async (video: HTMLVideoElement) => {
      video.muted = true;
      await video.play();
    });
    const start = await player.currentTime();
    await expect.poll(() => player.currentTime(), { timeout: 20_000 }).toBeGreaterThan(start + 0.5);
    await player.video.evaluate((video: HTMLVideoElement) => video.pause());
    await expect.poll(() => player.video.evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
  });
});
