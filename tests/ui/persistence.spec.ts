import { test, expect } from '@playwright/test';

test('REQ-STATE: corrupt saved session is discarded and anonymous landing stays usable @regression', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('streamflix.state.v1', '{ broken json');
  });
  await page.goto('/');

  await expect(page.getByRole('link', { name: 'Sign In' }).first()).toBeVisible();
  await expect(page).toHaveTitle(/StreamFlix/);
  // Check recovery behaviour, not merely that a DOM element exists.
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem('streamflix.state.v1') ?? 'null') as { user: unknown; profile: unknown } | null);
  expect(state).not.toBeNull();
  expect(state?.user).toBeNull();
  expect(state?.profile).toBeNull();

  await page.goto('/my-list');
  await expect(page).toHaveURL(/\/login$/);
});
