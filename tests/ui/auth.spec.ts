import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

test.describe('REQ-AUTH: accessible demo sign-in and protected navigation', () => {
  test('completes sign-in and opens a selected profile catalogue @smoke @regression', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.submit('qe@example.test', 'abcd1234');
    await expect(page).toHaveURL(/\/profiles$/);
    await expect(page.getByRole('heading', { name: "Who's watching?" })).toBeVisible();

    await page.getByRole('button', { name: 'Alok', exact: true }).click();
    await expect(page).toHaveURL(/\/browse$/);
    await expect(page.getByRole('link', { name: 'StreamFlix home' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open The Crimson Hour' }).first()).toBeVisible();
  });

  test('rejects an invalid password without creating a session @regression', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.submit('qe@example.test', 'abc');
    await expect(page.getByText('Password must be at least 4 characters.')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);

    await page.goto('/my-list');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('protects a direct player URL from anonymous visitors @regression', async ({ page }) => {
    await page.goto('/watch/t1');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.locator('video')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });
});
