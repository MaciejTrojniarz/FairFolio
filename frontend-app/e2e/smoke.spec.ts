import { test, expect } from '@playwright/test';
import { Navbar } from './page-objects/Navbar';
import { AuthPage } from './page-objects/AuthPage';

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
    await page.getByTestId('sales-view').waitFor();
  });
});
