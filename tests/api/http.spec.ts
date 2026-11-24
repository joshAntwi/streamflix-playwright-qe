import { test, expect } from '@playwright/test';

// Infrastructure checks only. These do not execute React or validate routing.
test.describe('REQ-HTTP: static production delivery @api', () => {
  test('serves the StreamFlix application document @smoke @regression', async ({ request }) => {
    const response = await request.get('/');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    expect(await response.text()).toMatch(/<title>StreamFlix/);
  });

  test('serves the SPA history fallback for a nested URL @regression', async ({ request }) => {
    const response = await request.get('/search?q=crimson');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    // An HTTP fallback is a deployment prerequisite, not evidence that
    // the client router rendered search results. See tests/ui/deeplink.spec.ts.
    expect(await response.text()).toMatch(/<title>StreamFlix/);
  });

  test('serves the JavaScript entry referenced by the document @regression', async ({ request }) => {
    const html = await (await request.get('/')).text();
    const asset = html.match(/<script[^>]+src="([^"]+\.js)"/i)?.[1];
    expect(asset, 'A production bundle must reference a JavaScript entry').toBeTruthy();
    const response = await request.get(asset!);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toMatch(/javascript|ecmascript/);
    expect((await response.body()).byteLength).toBeGreaterThan(0);
  });
});
