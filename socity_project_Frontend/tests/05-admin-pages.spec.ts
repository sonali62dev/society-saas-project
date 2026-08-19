import { test, expect } from '@playwright/test';

test.describe('Administration Pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('Complaint Management page loads', async ({ page }) => {
    await page.goto('/dashboard/admin/complaints');
    await expect(page).toHaveURL(/\/dashboard\/admin\/complaints/);

    const heading = page.locator('h1, h2').filter({ hasText: /complaint/i });
    await expect(heading.first()).toBeVisible({ timeout: 10000 });
  });

  test('Complaint page has complaints feed tabs', async ({ page }) => {
    await page.goto('/dashboard/admin/complaints');
    await page.waitForLoadState('networkidle');

    const tabsList = page.locator('[role="tablist"]');
    await expect(tabsList).toBeVisible();
  });

  test('Complaint page has status filters', async ({ page }) => {
    await page.goto('/dashboard/admin/complaints');
    await page.waitForLoadState('networkidle');

    const filterButtons = page.locator('button').filter({ hasText: /all|open|resolved|pending/i });
    const count = await filterButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Complaint page has data table', async ({ page }) => {
    await page.goto('/dashboard/admin/complaints');
    await page.waitForLoadState('networkidle');

    const table = page.locator('table, [role="table"]');
    await expect(table.first()).toBeVisible({ timeout: 10000 });
  });

  test('Asset Management page loads', async ({ page }) => {
    await page.goto('/dashboard/admin/assets');
    await expect(page).toHaveURL(/\/dashboard\/admin\/assets/);

    const heading = page.locator('h1, h2').filter({ hasText: /asset/i });
    await expect(heading.first()).toBeVisible({ timeout: 10000 });
  });

  test('Asset page has add asset button', async ({ page }) => {
    await page.goto('/dashboard/admin/assets');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button').filter({ hasText: /add|new|create/i });
    await expect(addButton.first()).toBeVisible({ timeout: 10000 });
  });

  test('Asset page has search functionality', async ({ page }) => {
    await page.goto('/dashboard/admin/assets');

    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
    await expect(searchInput.first()).toBeVisible({ timeout: 10000 });
  });

  test('Asset page has category filters', async ({ page }) => {
    await page.goto('/dashboard/admin/assets');
    await page.waitForLoadState('networkidle');

    const filterElements = page.locator('button, select').filter({ hasText: /all|category|type/i });
    const count = await filterElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Vendor Management page loads', async ({ page }) => {
    await page.goto('/dashboard/admin/vendors');
    await expect(page).toHaveURL(/\/dashboard\/admin\/vendors/);

    const heading = page.locator('h1, h2').filter({ hasText: /vendor/i });
    await expect(heading.first()).toBeVisible({ timeout: 10000 });
  });

  test('Vendor page has add vendor button', async ({ page }) => {
    await page.goto('/dashboard/admin/vendors');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button').filter({ hasText: /add|new|create/i });
    await expect(addButton.first()).toBeVisible({ timeout: 10000 });
  });

  test('Vendor page has data table', async ({ page }) => {
    await page.goto('/dashboard/admin/vendors');
    await page.waitForLoadState('networkidle');

    const table = page.locator('table, [role="table"]');
    await expect(table.first()).toBeVisible({ timeout: 10000 });
  });

  test('Vendor page has search functionality', async ({ page }) => {
    await page.goto('/dashboard/admin/vendors');

    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
    await expect(searchInput.first()).toBeVisible({ timeout: 10000 });
  });

  test('All admin pages are accessible', async ({ page }) => {
    const adminPages = [
      '/dashboard/admin/complaints',
      '/dashboard/admin/assets',
      '/dashboard/admin/vendors'
    ];

    for (const pagePath of adminPages) {
      await page.goto(pagePath);
      await expect(page).toHaveURL(new RegExp(pagePath));
      await page.waitForLoadState('networkidle');
    }
  });
});
