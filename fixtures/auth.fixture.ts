import { test as base, expect, type Page } from '@playwright/test';

const STORAGE_KEY = 'streamflix.state.v1';

type DemoState = {
  user: {
    id: string;
    email: string;
    name: string;
    plan: string;
    joinedAt: string;
  };
  profile: {
    id: string;
    name: string;
    avatar: string;
    isKid: boolean;
    color: string;
  };
  myList: string[];
  progress: unknown[];
  recentSearches: string[];
};

/** The app intentionally uses demo-only localStorage auth, not a backend. */
export function demoState(overrides: Partial<DemoState> = {}): DemoState {
  return {
    user: {
      id: 'u_qe',
      email: 'qe@example.test',
      name: 'Quality Engineer',
      plan: 'Premium',
      joinedAt: '2026-01-01T00:00:00.000Z',
    },
    profile: {
      id: 'p1',
      name: 'Alok',
      avatar: '🦊',
      isKid: false,
      color: 'from-rose-500 to-orange-500',
    },
    myList: [],
    progress: [],
    recentSearches: [],
    ...overrides,
  };
}

/**
export async function seedDemoSession(page: Page, state = demoState()) {
  await page.goto('/');
  await page.evaluate(
    ({ key, value }) => window.localStorage.setItem(key, value),
    { key: STORAGE_KEY, value: JSON.stringify(state) },
  );
  await page.goto('/browse');
  await expect(page).toHaveURL(/\/browse$/);
}

type Fixtures = { authenticatedPage: Page };
export const test = base.extend<Fixtures>({
  authenticatedPage: async ({ page }, use) => {
    await seedDemoSession(page);
    await use(page);
  },
});
export { expect };/**
 * Seed before the app's first script reads localStorage.
 * Guard with sessionStorage so hard navigations/reloads DON'T reset the
 * user's watchlist or other changes created within the same test scenario.
 * This removes a race with StreamFlix's initial persistence useEffect.
 */
export async function seedDemoSession(page: Page, state = demoState()) {
  await page.addInitScript(
    ({ key, value, marker }) => {
      if (window.sessionStorage.getItem(marker)) return;
      window.localStorage.setItem(key, value);
      window.sessionStorage.setItem(marker, 'true');
    },
    {
      key: STORAGE_KEY,
      value: JSON.stringify(state),
      marker: 'streamflix.qe.seeded.v1',
    },
  );
  await page.goto('/browse');
  await expect(page).toHaveURL(/\/browse$/);
}
type Fixtures = { authenticatedPage: Page };
export const test = base.extend<Fixtures>({
  authenticatedPage: async ({ page }, use) => {
    await seedDemoSession(page);
    await use(page);
  },
});
export { expect };
