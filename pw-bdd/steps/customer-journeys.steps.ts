import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { SearchPage } from '../../pages/search.page';
import { PlayerPage } from '../../pages/player.page';

const { Given, When, Then } = createBdd();

Given('I am viewing StreamFlix as a signed-in customer', async ({ page }) => {
  await new LoginPage(page).goto();
  await new LoginPage(page).submit('qe@example.test', 'abcd1234');
  await expect(page).toHaveURL(/\/profiles$/);
  await page.getByRole('button', { name: 'Alok', exact: true }).click();
  await expect(page).toHaveURL(/\/browse$/);
});

When('I follow a search bookmark for {string}', async ({ page }, query: string) => {
  await page.goto('/search?q=' + encodeURIComponent(query));
});

Then('the search query {string} returns {string}',
  async ({ page }, query: string, title: string) => {
    await expect(page).toHaveURL(new RegExp('/search\\?q=' + query + '$'));
    await expect(page.getByRole('textbox', { name: 'Search' })).toHaveValue(query);
    await expect(new SearchPage(page).cardFor(title)).toBeVisible();
    await expect(new SearchPage(page).cardFor('Atlas Falling')).toHaveCount(0);
  });

When('I refresh the bookmarked page', async ({ page }) => {
  await page.reload();
});

When('I search the catalogue for {string}', async ({ page }, term: string) => {
  const search = new SearchPage(page);
  await search.goto();
  await search.searchFor(term);
  await expect(search.cardFor('The Crimson Hour')).toBeVisible();
});

When('I view the details for {string}', async ({ page }, title: string) => {
  await new SearchPage(page).openTitle(title);
  await expect(page.getByRole('dialog').getByRole('heading', { name: title })).toBeVisible();
});

When('I save the title from its details', async ({ page }) => {
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Add to My List' }).click();
  await expect(dialog.getByRole('button', { name: 'Remove from My List' })).toBeVisible();
});

When('I open My List', async ({ page }) => {
  await page.goto('/my-list');
});

Then('{string} is listed as a saved title', async ({ page }, title: string) => {
  await expect(page.getByRole('button', { name: 'Open ' + title }).first()).toBeVisible();
});

When('I reopen the saved title {string}', async ({ page }, title: string) => {
  await page.getByRole('button', { name: 'Open ' + title }).first().click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: title })).toBeVisible();
});

When('I remove the title from its details', async ({ page }) => {
  await page.getByRole('dialog').getByRole('button', { name: 'Remove from My List' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Close' }).click();
});

Then('{string} is absent from My List', async ({ page }, title: string) => {
  await expect(page.getByRole('button', { name: 'Open ' + title })).toHaveCount(0);
});

When('I open the player for {string}', async ({ page }, id: string) => {
  await new PlayerPage(page).goto(id);
});

When('I mute the player', async ({ page }) => {
  await new PlayerPage(page).revealControls();
  await page.getByRole('button', { name: 'Mute', exact: true }).click();
});

Then('the underlying video element is muted', async ({ page }) => {
  await expect.poll(() => new PlayerPage(page).muted()).toBe(true);
});

When('I select 1.5x playback', async ({ page }) => {
  await new PlayerPage(page).revealControls();
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: '1.5x', exact: true }).click();
});

Then('the video playback rate is 1.5', async ({ page }) => {
  await expect.poll(() => new PlayerPage(page).playbackRate()).toBe(1.5);
});

Then('the player reports a missing title', async ({ page }) => {
  await expect(page.getByText('Title not found.')).toBeVisible();
});

When('I return to browsing', async ({ page }) => {
  await page.getByRole('button', { name: 'Go back' }).click();
});

Then('the catalogue contains {string}', async ({ page }, title: string) => {
  await expect(page).toHaveURL(/\/browse$/);
  await expect(page.getByRole('button', { name: 'Open ' + title }).first()).toBeVisible();
});

Then('I am redirected to sign in without seeing a player', async ({ page }) => {
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.locator('video')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
});
