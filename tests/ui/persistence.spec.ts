import { test, expect } from '@playwright/test';

test('REQ-STATE: invalid persisted JSON does not crash landing @regression', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('streamflix.state.v1', '{ broken json');
  });
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Sign In' }).first()).toBeVisible();
  await expect(page).toHaveTitle(/StreamFlix/);
});
