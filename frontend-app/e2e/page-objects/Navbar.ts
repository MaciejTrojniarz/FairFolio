import { Page, Locator, expect } from '@playwright/test';

export class Navbar {
  readonly page: Page;
  readonly logo: Locator;
  readonly products: Locator;
  readonly sales: Locator;
  readonly events: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.getByTestId('navbar-logo');
    this.products = page.getByTestId('navbar-products');
    this.sales = page.getByTestId('navbar-sales');
    this.events = page.getByTestId('navbar-events');
  }

  async expectVisible() {
    await expect(this.logo).toBeVisible();
    await expect(this.products).toBeVisible();
    await expect(this.sales).toBeVisible();
    await expect(this.events).toBeVisible();
  }

  async gotoProducts() { await this.products.click(); }
  async gotoSales() { await this.sales.click(); }
  async gotoEvents() { await this.events.click(); }
}
