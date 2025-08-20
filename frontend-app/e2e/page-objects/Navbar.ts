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
    // Wait for the logo first as it's always visible
    await expect(this.logo).toBeVisible({ timeout: 10000 });
    
    // Wait for authenticated navbar elements with longer timeout for CI
    await expect(this.products).toBeVisible({ timeout: 15000 });
    await expect(this.sales).toBeVisible({ timeout: 15000 });
    await expect(this.events).toBeVisible({ timeout: 15000 });
  }

  async gotoProducts() { 
    await this.products.waitFor({ state: 'visible', timeout: 15000 });
    await this.products.click(); 
  }
  
  async gotoSales() { 
    await this.sales.waitFor({ state: 'visible', timeout: 15000 });
    await this.sales.click(); 
  }
  
  async gotoEvents() { 
    await this.events.waitFor({ state: 'visible', timeout: 15000 });
    await this.events.click(); 
  }
}
