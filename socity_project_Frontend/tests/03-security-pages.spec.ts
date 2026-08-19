import { test, expect } from '@playwright/test';

test.describe('Security Management Pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('Visitor Management page loads', async ({ page }) => {
    await page.goto('/dashboard/security/visitors');
    await expect(page).toHaveURL(/\/dashboard\/security\/visitors/);

    const heading = page.locator('h1, h2').filter({ hasText: /visitor/i });
    await expect(heading.first()).toBeVisible({ timeout: 10000 });
  });

  test('Visitor page has add visitor button', async ({ page }) => {
    await page.goto('/dashboard/security/visitors');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button').filter({ hasText: /add|new|create/i });
    await expect(addButton.first()).toBeVisible({ timeout: 10000 });
  });

  test('Visitor page has data table', async ({ page }) => {
    await page.goto('/dashboard/security/visitors');
    await page.waitForLoadState('networkidle');

    const table = page.locator('table, [role="table"]');
    await expect(table.first()).toBeVisible({ timeout: 10000 });
  });

  test('Vehicle Registration page loads', async ({ page }) => {
    await page.goto('/dashboard/security/vehicles');
    await expect(page).toHaveURL(/\/dashboard\/security\/vehicles/);

    const heading = page.locator('h1, h2').filter({ hasText: /vehicle/i });
    await expect(heading.first()).toBeVisible({ timeout: 10000 });
  });

  test('Vehicle page has search functionality', async ({ page }) => {
    await page.goto('/dashboard/security/vehicles');

    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
    await expect(searchInput.first()).toBeVisible({ timeout: 10000 });
  });

  test('Vehicle page has statistics', async ({ page }) => {
    await page.goto('/dashboard/security/vehicles');
    await page.waitForLoadState('networkidle');

    const statsCards = page.locator('[class*="stat"], [class*="card"]');
    const count = await statsCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Parcel Tracking page loads', async ({ page }) => {
    await page.goto('/dashboard/security/parcels');
    await expect(page).toHaveURL(/\/dashboard\/security\/parcels/);

    const heading = page.locator('h1, h2').filter({ hasText: /parcel/i });
    await expect(heading.first()).toBeVisible({ timeout: 10000 });
  });

  test('Parcel page has status filters', async ({ page }) => {
    await page.goto('/dashboard/security/parcels');
    await page.waitForLoadState('networkidle');

    const filterButtons = page.locator('button').filter({ hasText: /all|pending|delivered/i });
    const count = await filterButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Parcel page has data table', async ({ page }) => {
    await page.goto('/dashboard/security/parcels');
    await page.waitForLoadState('networkidle');

    const table = page.locator('table, [role="table"]');
    await expect(table.first()).toBeVisible({ timeout: 10000 });
  });

  test('All security pages are accessible', async ({ page }) => {
    const securityPages = [
      '/dashboard/security/visitors',
      '/dashboard/security/vehicles',
      '/dashboard/security/parcels'
    ];

    for (const pagePath of securityPages) {
      await page.goto(pagePath);
      await expect(page).toHaveURL(new RegExp(pagePath));
      await page.waitForLoadState('networkidle');
    }
  });
});
