import { test, expect } from '@playwright/test';

test('REQ-RESILIENCE: landing remains usable when poster images fail @regression', async ({ page }) => {
  await page.route(/^https:\/\/picsum\.photos\//, (route) => route.abort('failed'));
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Sign In' }).first()).toBeVisible();
  await page.getByRole('link', { name: 'Sign In' }).first().click();
  await expect(page).toHaveURL(/\/login$/);
});
