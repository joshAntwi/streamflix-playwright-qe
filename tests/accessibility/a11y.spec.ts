import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../../fixtures/auth.fixture';

test('REQ-A11Y: critical accessibility scan of empty watchlist @a11y', async ({ authenticatedPage: page }, testInfo) => {
  await page.goto('/my-list');
  await expect(page.getByRole('heading', { name: 'Your list is empty.' })).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  await testInfo.attach('axe-results.json', {
    body: JSON.stringify(results.violations, null, 2),
    contentType: 'application/json',
  });
  // Expand from critical to all violations after agreeing remediation baseline.
  expect(results.violations.filter((v) => v.impact === 'critical')).toEqual([]);
});
