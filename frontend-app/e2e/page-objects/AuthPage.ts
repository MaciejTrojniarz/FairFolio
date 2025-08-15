import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly title: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly toggleRegister: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('auth-title');
    this.email = page.getByTestId('auth-email');
    this.password = page.getByTestId('auth-password');
    this.submit = page.getByTestId('auth-submit');
    this.toggleRegister = page.getByTestId('toggle-register');
  }

  async login(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }

  async expectOnLogin() {
    await expect(this.title).toBeVisible();
  }
}
