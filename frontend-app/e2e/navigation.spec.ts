import { test, expect } from '@playwright/test';
import { Navbar } from './page-objects/Navbar';

// Navigation tests to reach key management pages

test.describe('Navigation to management pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for navbar to be visible (auth bypassed in e2e)
    const nav = new Navbar(page);
    await nav.expectVisible();
  });

  test('reach Product Management page', async ({ page }) => {
    const nav = new Navbar(page);
    await nav.gotoProducts();
    await expect(page.getByTestId('product-management')).toBeVisible();
    await expect(page.getByTestId('add-new-product')).toBeVisible();
  });

  test('reach Event Management page', async ({ page }) => {
    const nav = new Navbar(page);
    await nav.gotoEvents();
    await expect(page.getByTestId('event-management')).toBeVisible();
    await expect(page.getByTestId('add-new-event')).toBeVisible();
  });

  test('reach Sales list page', async ({ page }) => {
    const nav = new Navbar(page);
    await nav.gotoSales();
    await expect(page.getByTestId('sales-history')).toBeVisible();
  });
});
