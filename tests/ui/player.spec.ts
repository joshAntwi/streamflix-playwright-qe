import { test, expect } from '../../fixtures/auth.fixture';

test.describe('REQ-PLAYER: rendering and controls', () => {
  test('shows video shell and accessible playback controls @smoke @regression', async ({ authenticatedPage: page }) => {
    await page.goto('/watch/t1');
    await expect(page.locator('video')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Back', exact: true })).toBeVisible();
    await expect(page.getByRole('slider', { name: 'Seek' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mute' })).toBeVisible();
    if ((page.viewportSize()?.width ?? 0) >= 768) {
      await expect(page.getByText(/Shortcuts:/)).toBeVisible();
    }
  });

  test('does not crash when opening a non-existent title @regression', async ({ authenticatedPage: page }) => {
    await page.goto('/watch/does-not-exist');
    await expect(page.getByRole('button', { name: 'Go back' })).toBeVisible();
  });
});
