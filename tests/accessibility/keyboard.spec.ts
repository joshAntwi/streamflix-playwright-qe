import { test, expect } from '../../fixtures/auth.fixture';
import { SearchPage } from '../../pages/search.page';

test('REQ-A11Y: modal keyboard focus is trapped and Escape returns to the trigger @regression',
  async ({ authenticatedPage: page }) => {
    const search = new SearchPage(page);
    await search.goto();
    await search.searchFor('crimson');

    const trigger = search.cardFor('The Crimson Hour');
    await trigger.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator(':focus')).toHaveCount(1);

    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await expect(dialog.locator(':focus')).toHaveCount(1);
    }

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });
