import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page.ts';
import { SearchPage } from '../../pages/search.page.ts';
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

Then('I should reach the browse catalogue', async function (this: StreamFlixWorld) {
  await expect(this.page).toHaveURL(/\/browse$/);
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

Then('I should find the title {string}',
  async function (this: StreamFlixWorld, title: string) {
    await expect(new SearchPage(this.page).cardFor(title)).toBeVisible();
  });

Then('I should be told that no content matches', async function (this: StreamFlixWorld) {
  await expect(this.page.getByText('Nothing matches that.')).toBeVisible();
  await expect(this.page.getByRole('button', { name: 'Browse all titles' })).toBeVisible();
});

When('I open the title {string}', async function (this: StreamFlixWorld, title: string) {
  await new SearchPage(this.page).openTitle(title);
  await expect(this.page.getByRole('dialog').getByRole('heading', { name: title })).toBeVisible();
});

When('I add the open title to My List', async function (this: StreamFlixWorld) {
  await this.page.getByRole('dialog').getByRole('button', { name: 'Add to My List' }).click();
});

When('I navigate to My List', async function (this: StreamFlixWorld) {
  await this.page.goto('/my-list');
});

Then('My List should contain {string}',
  async function (this: StreamFlixWorld, title: string) {
    await expect(this.page.getByRole('button', { name: 'Open ' + title }).first()).toBeVisible();
  });

When('I reload My List', async function (this: StreamFlixWorld) {
  await this.page.reload();
});
