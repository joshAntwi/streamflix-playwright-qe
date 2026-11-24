import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

test('REQ-STATE: corrupt local storage recovers and allows a fresh sign-in @regression', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('streamflix.state.v1', '{ broken json');
  });
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Sign In' }).first()).toBeVisible();

  const login = new LoginPage(page);
  await login.goto();
  await login.submit('qe@example.test', 'abcd1234');
  await expect(page).toHaveURL(/\/profiles$/);
  await page.getByRole('button', { name: 'Alok', exact: true }).click();
  await expect(page).toHaveURL(/\/browse$/);
  await expect(page.getByRole('button', { name: 'Open The Crimson Hour' }).first()).toBeVisible();
});
