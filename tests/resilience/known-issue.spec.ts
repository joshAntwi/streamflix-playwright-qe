import { test, expect } from '../../fixtures/auth.fixture';

// Excluded from default quality gate: executable documentation of a known defect.
test('BUG-001: failed HLS manifest provides user feedback @known-issue', async ({ authenticatedPage: page }) => {
  test.fail(true, 'Known upstream issue: fatal HLS errors are logged but no accessible user error appears');
  await page.route('https://test-streams.mux.dev/**', (route) => route.abort('failed'));
  await page.goto('/watch/t1');
  await expect(page.getByRole('alert')).toContainText(/playback|network|try again/i, { timeout: 8_000 });
});
