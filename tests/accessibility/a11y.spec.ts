import AxeBuilder from '@axe-core/playwright';
import type { Page, TestInfo } from '@playwright/test';
import { test, expect } from '../../fixtures/auth.fixture';
import { LoginPage } from '../../pages/login.page';

async function expectNoCriticalViolations(page: Page, testInfo: TestInfo) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  await testInfo.attach('axe-results.json', {
    body: JSON.stringify(results.violations, null, 2),
    contentType: 'application/json',
  });
  expect(results.violations.filter((v) => v.impact === 'critical')).toEqual([]);
}

test('REQ-A11Y: critical accessibility scan of sign-in @a11y @regression', async ({ page }, testInfo) => {
  await new LoginPage(page).goto();
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await expectNoCriticalViolations(page, testInfo);
});

test('REQ-A11Y: critical accessibility scan of empty watchlist @a11y', async ({ authenticatedPage: page }, testInfo) => {
  await page.goto('/my-list');
  await expect(page.getByRole('heading', { name: 'Your list is empty.' })).toBeVisible();
  await expectNoCriticalViolations(page, testInfo);
});
