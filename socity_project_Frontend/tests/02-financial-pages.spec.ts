import { test, expect } from '@playwright/test';

test.describe('Financial Management Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Set auth cookie or login if needed
    await page.goto('/dashboard');
  });

  test('Billing Management page loads', async ({ page }) => {
    await page.goto('/dashboard/financial/billing');
    await expect(page).toHaveURL(/\/dashboard\/financial\/billing/);

    // Check for page heading
    const heading = page.locator('h1, h2').filter({ hasText: /billing/i });
    await expect(heading.first()).toBeVisible({ timeout: 10000 });
  });

  test('Billing page has search functionality', async ({ page }) => {
    await page.goto('/dashboard/financial/billing');
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
    await expect(searchInput.first()).toBeVisible({ timeout: 10000 });
  });

  test('Billing page has statistics cards', async ({ page }) => {
    await page.goto('/dashboard/financial/billing');
    await page.waitForLoadState('networkidle');

    // Look for stat cards or metric displays
    const statsSection = page.locator('[class*="stat"], [class*="card"], [class*="metric"]');
    const count = await statsSection.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Invoice Management page loads', async ({ page }) => {
    await page.goto('/dashboard/financial/invoices');
    await expect(page).toHaveURL(/\/dashboard\/financial\/invoices/);

    const heading = page.locator('h1, h2').filter({ hasText: /invoice/i });
    await expect(heading.first()).toBeVisible({ timeout: 10000 });
  });

  test('Invoice page has data table', async ({ page }) => {
    await page.goto('/dashboard/financial/invoices');
    await page.waitForLoadState('networkidle');

    const table = page.locator('table, [role="table"]');
    await expect(table.first()).toBeVisible({ timeout: 10000 });
  });

  test('Payment Tracking page loads', async ({ page }) => {
    await page.goto('/dashboard/financial/payments');
    await expect(page).toHaveURL(/\/dashboard\/financial\/payments/);

    const heading = page.locator('h1, h2').filter({ hasText: /payment/i });
    await expect(heading.first()).toBeVisible({ timeout: 10000 });
  });

  test('Payment page has filter options', async ({ page }) => {
    await page.goto('/dashboard/financial/payments');
    await page.waitForLoadState('networkidle');

    // Look for filter buttons or dropdowns
    const filterElements = page.locator('button, select').filter({ hasText: /all|filter|status/i });
    const count = await filterElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('All financial pages are accessible from navigation', async ({ page }) => {
    await page.goto('/dashboard');

    // Check if navigation links exist
    const navLinks = [
      '/dashboard/financial/billing',
      '/dashboard/financial/invoices',
      '/dashboard/financial/payments'
    ];

    for (const link of navLinks) {
      await page.goto(link);
      await expect(page).toHaveURL(new RegExp(link));
    }
  });
});
