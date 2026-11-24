import { test, expect } from '@playwright/test';

// Transport contract only. A 200 + HTML shell is NOT proof that client-side
// routing, authentication, or any user journey works. See ui/deeplink.spec.ts.
test('REQ-DELIVERY: production entrypoint serves its executable bundle @api @regression', async ({ request }) => {
  const response = await request.get('/');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('text/html');

  const html = await response.text();
  const asset = html.match(/<script[^>]+src="([^"]+\.js)"/i)?.[1];
  expect(asset, 'Production HTML must reference a JavaScript entrypoint').toBeTruthy();

  const javascript = await request.get(asset!);
  expect(javascript.ok(), 'The referenced entrypoint must be downloadable').toBe(true);
  expect(javascript.headers()['content-type']).toMatch(/javascript|ecmascript/);
  expect((await javascript.body()).byteLength).toBeGreaterThan(100);
});
