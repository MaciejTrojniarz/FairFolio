import { test, expect } from '@playwright/test';
import { Navbar } from './page-objects/Navbar';
import { CostsPage } from './page-objects/CostsPage';
// import { AuthPage } from './page-objects/AuthPage';

// Base smoke tests that do not require authentication

test.describe('Public shell and navigation', () => {
  test('loads home and shows navbar', async ({ page }) => {
    await page.goto('/');
    const navbar = new Navbar(page);
    await navbar.expectVisible();
    // Visual snapshot: generate on first run with `npm run test:e2e:update-snapshots`
    await expect(page).toHaveScreenshot({ fullPage: true });
  });

  test('sales page is reachable (auth bypassed in e2e)', async ({ page }) => {
    await page.goto('/sales/record');
    // Wait for the sales view to be visible
    await page.getByTestId('sales-view').waitFor({ state: 'visible', timeout: 10000 });
    // Wait for either the translated title or the fallback key to be visible
    await page.locator('h1').waitFor({ state: 'visible', timeout: 10000 });
  });

  test('costs page is reachable and can submit (auth bypassed)', async ({ page }) => {
    await page.goto('/costs/record');
    const costs = new CostsPage(page);
    await page.getByTestId('record-cost-view').waitFor({ timeout: 10000 });
    await costs.nameInput.fill('Smoke Test Cost');
    // Skip category selection for smoke test - use default empty option
    await costs.amountInput.fill('12.34');
    // date is prefilled; leave as is
    await costs.recordCostButton.click();
  });
});
