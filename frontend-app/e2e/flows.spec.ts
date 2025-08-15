import { test, expect } from '@playwright/test';
import { Navbar } from './page-objects/Navbar';

// Open create flows (new product, new event, record sale)

test.describe('Create flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('open New Product form', async ({ page }) => {
    const nav = new Navbar(page);
    await nav.gotoProducts();
    await page.getByTestId('add-new-product').click();
    await expect(page.getByTestId('product-form')).toBeVisible();
  });

  test('open New Event form', async ({ page }) => {
    const nav = new Navbar(page);
    await nav.gotoEvents();
    await page.getByTestId('add-new-event').click();
    await expect(page.getByTestId('event-form')).toBeVisible();
  });

  test('open Record Sales view', async ({ page }) => {
    await page.goto('/sales/record');
    await expect(page.getByTestId('sales-view')).toBeVisible();
  });
});
