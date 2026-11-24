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

/** The app deliberately uses demo localStorage auth, not a backend. */
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
 * Set up demo session before StreamFlix's initial React render.
 * One-time tab marker prevents reload/navigation from wiping watchlist changes.
 * Avoids a race with the application's persistence useEffect.
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
