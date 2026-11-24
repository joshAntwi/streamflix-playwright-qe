import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page.ts';
import { SearchPage } from '../../pages/search.page.ts';
import { PlayerPage } from '../../pages/player.page.ts';
import type { StreamFlixWorld } from '../support/world.ts';

Given('I am on the StreamFlix login page', async function (this: StreamFlixWorld) {
  await new LoginPage(this.page).goto();
});

When('I sign in with email {string} and password {string}',
  async function (this: StreamFlixWorld, email: string, password: string) {
    await new LoginPage(this.page).submit(email, password);
    await expect(this.page).toHaveURL(/\/profiles$/);
  });

When('I select the {string} viewing profile',
  async function (this: StreamFlixWorld, profile: string) {
    await this.page.getByRole('button', { name: profile, exact: true }).click();
  });

Then('I should reach a usable browse catalogue', async function (this: StreamFlixWorld) {
  await expect(this.page).toHaveURL(/\/browse$/);
  await expect(this.page.getByRole('button', { name: 'Open The Crimson Hour' }).first()).toBeVisible();
});

Given('I am a signed-in StreamFlix customer', async function (this: StreamFlixWorld) {
  await new LoginPage(this.page).goto();
  await new LoginPage(this.page).submit('qe@example.test', 'abcd1234');
  await expect(this.page).toHaveURL(/\/profiles$/);
  await this.page.getByRole('button', { name: 'Alok', exact: true }).click();
  await expect(this.page).toHaveURL(/\/browse$/);
});

When('I search for {string}', async function (this: StreamFlixWorld, term: string) {
  const search = new SearchPage(this.page);
  await search.goto();
  await search.searchFor(term);
});

Then('the results should include {string} but not {string}',
  async function (this: StreamFlixWorld, expected: string, excluded: string) {
    const search = new SearchPage(this.page);
    await expect(search.cardFor(expected)).toBeVisible();
    await expect(search.cardFor(excluded)).toHaveCount(0);
  });

When('I open the title {string}', async function (this: StreamFlixWorld, title: string) {
  await new SearchPage(this.page).openTitle(title);
});

Then('I should see details for {string}', async function (this: StreamFlixWorld, title: string) {
  await expect(this.page.getByRole('dialog').getByRole('heading', { name: title })).toBeVisible();
});

When('I open the search deep link for {string}', async function (this: StreamFlixWorld, query: string) {
  await this.page.goto('/search?q=' + encodeURIComponent(query));
});

Then('the search field should contain {string}', async function (this: StreamFlixWorld, query: string) {
  await expect(this.page.getByRole('textbox', { name: 'Search' })).toHaveValue(query);
});

When('I refresh the current page', async function (this: StreamFlixWorld) {
  await this.page.reload();
});

When('I filter search results by {string}', async function (this: StreamFlixWorld, genre: string) {
  await this.page.getByRole('button', { name: genre, exact: true }).click();
});

Then('I should be told that no content matches', async function (this: StreamFlixWorld) {
  await expect(this.page.getByText('Nothing matches that.')).toBeVisible();
});

When('I add the open title to My List', async function (this: StreamFlixWorld) {
  const dialog = this.page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Add to My List' }).click();
  await expect(dialog.getByRole('button', { name: 'Remove from My List' })).toBeVisible();
});

When('I navigate to My List', async function (this: StreamFlixWorld) {
  await this.page.goto('/my-list');
});

When('I open the saved title {string}', async function (this: StreamFlixWorld, title: string) {
  await this.page.getByRole('button', { name: 'Open ' + title }).first().click();
});

When('I remove the open title from My List', async function (this: StreamFlixWorld) {
  await this.page.getByRole('dialog').getByRole('button', { name: 'Remove from My List' }).click();
  await this.page.getByRole('dialog').getByRole('button', { name: 'Close' }).click();
});

Then('My List should contain {string}', async function (this: StreamFlixWorld, title: string) {
  await expect(this.page.getByRole('button', { name: 'Open ' + title }).first()).toBeVisible();
  await expect(this.page.getByText('1 title saved for later')).toBeVisible();
});

Then('My List should be empty', async function (this: StreamFlixWorld) {
  await expect(this.page.getByRole('heading', { name: 'Your list is empty.' })).toBeVisible();
});

When('I open the player for title {string}', async function (this: StreamFlixWorld, titleId: string) {
  await new PlayerPage(this.page).goto(titleId);
});

When('I mute playback', async function (this: StreamFlixWorld) {
  await new PlayerPage(this.page).revealControls();
  await this.page.getByRole('button', { name: 'Mute', exact: true }).click();
});

Then('the media element should be muted', async function (this: StreamFlixWorld) {
  await expect.poll(() => new PlayerPage(this.page).muted()).toBe(true);
});

When('I set playback speed to 1.5x', async function (this: StreamFlixWorld) {
  await new PlayerPage(this.page).revealControls();
  await this.page.getByRole('button', { name: 'Settings' }).click();
  await this.page.getByRole('button', { name: '1.5x', exact: true }).click();
});

Then('the media element speed should be 1.5', async function (this: StreamFlixWorld) {
  await expect.poll(() => new PlayerPage(this.page).playbackRate()).toBe(1.5);
});

Then('I should see a title-not-found message', async function (this: StreamFlixWorld) {
  await expect(this.page.getByText('Title not found.')).toBeVisible();
});

When('I choose to go back to the catalogue', async function (this: StreamFlixWorld) {
  await this.page.getByRole('button', { name: 'Go back' }).click();
});

Then('I should be redirected to sign in', async function (this: StreamFlixWorld) {
  await expect(this.page).toHaveURL(/\/login$/);
  await expect(this.page.locator('video')).toHaveCount(0);
  await expect(this.page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
});
