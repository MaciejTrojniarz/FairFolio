import { Page, Locator, expect } from '@playwright/test';

export class SalesPage {
  readonly page: Page;
  readonly view: Locator;
  readonly productsTitle: Locator;
  readonly basketTitle: Locator;
  readonly clearButton: Locator;
  readonly recordSaleButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.view = page.getByTestId('sales-view');
    this.productsTitle = page.getByTestId('products-section-title');
    this.basketTitle = page.getByTestId('basket-section-title');
    this.clearButton = page.getByTestId('basket-clear');
    this.recordSaleButton = page.getByTestId('record-sale');
  }

  async expectLoaded() {
    await expect(this.view).toBeVisible();
    await expect(this.productsTitle).toBeVisible();
    await expect(this.basketTitle).toBeVisible();
  }
}
