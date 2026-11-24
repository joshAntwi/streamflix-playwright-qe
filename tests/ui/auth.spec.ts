import { test, expect } from '../../fixtures/auth.fixture';
import { LoginPage } from '../../pages/login.page';

test.describe('REQ-AUTH: demo login and protected routes', () => {
  test('signs in, chooses a viewing profile and reaches the usable catalogue @smoke @regression', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.submit('qe@example.test', 'abcd1234');
    await expect(page).toHaveURL(/\/profiles$/);
    await expect(page.getByRole('heading', { name: "Who's watching?" })).toBeVisible();
    await page.getByRole('button', { name: 'Alok' }).click();
    await expect(page).toHaveURL(/\/browse$/);
    await expect(page.getByRole('button', { name: 'Search', exact: true })).toBeVisible();
  });

  test('rejects passwords shorter than four characters without creating a session @regression', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.submit('qe@example.test', 'abc');
    await expect(page.getByText('Password must be at least 4 characters.')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
    await page.goto('/my-list');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('redirects unauthenticated visitors away from protected pages @regression', async ({ page }) => {
    await page.goto('/search?q=crimson');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('signing out prevents further access to the saved-list route @regression', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.submit('qe@example.test', 'abcd1234');
    await page.getByRole('button', { name: 'Alok' }).click();
    await expect(page).toHaveURL(/\/browse$/);

    // The demo application's profile menu lacks an accessible name.
    await page.locator('button[aria-haspopup="menu"]').click();
    await page.getByRole('button', { name: 'Sign out' }).click();
    await expect(page).toHaveURL(/\/$/);

    await page.goto('/my-list');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });
});
