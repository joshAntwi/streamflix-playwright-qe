import { type Page } from '@playwright/test';

export class SearchPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/search');
  }

  async searchFor(term: string) {
    await this.page.getByRole('textbox', { name: 'Search' }).fill(term);
  }

  cardFor(title: string) {
    return this.page.getByRole('button', { name: 'Open ' + title }).first();
  }

  async openTitle(title: string) {
    await this.cardFor(title).click();
  }
}
