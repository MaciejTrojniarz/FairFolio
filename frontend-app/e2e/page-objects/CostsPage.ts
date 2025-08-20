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
    this.nameInput = page.getByLabel('Cost Name');
    this.categoryInput = page.getByLabel('Cost Category');
    this.amountInput = page.getByLabel('Amount');
    this.dateInput = page.getByLabel('Date');
  }
}
