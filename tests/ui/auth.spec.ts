import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

test.describe('REQ-AUTH: demo login and protected routes', () => {
  test('signs in, selects a profile and reaches browse @smoke @regression', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.submit('qe@example.test', 'abcd1234');
    await expect(page).toHaveURL(/\/profiles$/);
    await expect(page.getByRole('heading', { name: "Who's watching?" })).toBeVisible();
    await page.getByRole('button', { name: 'Alok' }).click();
    await expect(page).toHaveURL(/\/browse$/);
  });

  test('rejects passwords shorter than four characters @regression', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.submit('qe@example.test', 'abc');
    await expect(page.getByText('Password must be at least 4 characters.')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('redirects unauthenticated navigation to login @regression', async ({ page }) => {
    await page.goto('/my-list');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });
});
