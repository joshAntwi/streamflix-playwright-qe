import { type Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async submit(email: string, password: string) {
    await this.page.getByRole('textbox', { name: 'Email address' }).fill(email);
    await this.page.getByLabel('Password', { exact: true }).fill(password);
    await this.page.getByRole('button', { name: 'Sign In', exact: true }).click();
  }
}
