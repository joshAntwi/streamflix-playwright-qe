import { test, expect } from '@playwright/test';

// StreamFlix is frontend-only. These are HTTP delivery checks, NOT
// backend API or authentication-contract tests.
test.describe('REQ-HTTP: deployed bundle responses @api', () => {
  test('serves a successful HTML app shell @smoke @regression', async ({ request }) => {
    const response = await request.get('/');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    expect(await response.text()).toContain('<div id="root"></div>');
  });

  test('serves the search deep link for client-side routing @regression', async ({ request }) => {
    const response = await request.get('/search?q=crimson');
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain('<div id="root"></div>');
  });

  test('loads the linked entry JavaScript bundle @regression', async ({ request }) => {
    const html = await (await request.get('/')).text();
    const asset = html.match(/<script[^>]+src="([^"]+\.js)"/i)?.[1];
    expect(asset, 'Vite build should publish an entry JavaScript bundle').toBeTruthy();
    const response = await request.get(asset!);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toMatch(/javascript|ecmascript/);
  });
});
