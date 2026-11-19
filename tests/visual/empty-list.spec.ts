import { test, expect } from '../../fixtures/auth.fixture';

test('REQ-VISUAL: empty watchlist baseline @visual', async ({ authenticatedPage: page }) => {
  test.skip(!process.env.RUN_VISUAL, 'Opt-in: approve baseline with RUN_VISUAL=1 npm run test:visual:update');
  await page.goto('/my-list');
  await expect(page.getByRole('heading', { name: 'Your list is empty.' })).toBeVisible();
  await expect(page).toHaveScreenshot('empty-watchlist.png', {
    animations: 'disabled',
    maxDiffPixelRatio: 0.02,
  });
});
