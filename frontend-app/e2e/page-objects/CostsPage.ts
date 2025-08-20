import { Locator, Page } from '@playwright/test';

export class CostsPage {
  readonly page: Page;
  readonly recordCostButton: Locator;
  readonly nameInput: Locator;
  readonly categoryInput: Locator;
  readonly amountInput: Locator;
  readonly dateInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.recordCostButton = page.getByTestId('record-cost');
    this.nameInput = page.getByTestId('cost-name');
    this.categoryInput = page.getByTestId('cost-category-select');
    this.amountInput = page.getByLabel('Amount');
    this.dateInput = page.getByTestId('cost-date');
  }
}
