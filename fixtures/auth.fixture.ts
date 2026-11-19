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

/** Seed once, not through addInitScript which would reset state on reload. */
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
export { expect };
