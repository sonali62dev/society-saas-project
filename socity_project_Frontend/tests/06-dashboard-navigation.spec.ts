import { test, expect } from '@playwright/test';

test.describe('Dashboard Navigation & UI Tests', () => {
  test('Dashboard main page loads', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
    await page.waitForLoadState('networkidle');
  });

  test('Dashboard has sidebar navigation', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Look for sidebar or navigation menu
    const nav = page.locator('nav, aside, [role="navigation"]');
    await expect(nav.first()).toBeVisible({ timeout: 10000 });
  });

  test('Dashboard has Financial section in navigation', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const financialLink = page.locator('a, button').filter({ hasText: /financial|billing/i });
    await expect(financialLink.first()).toBeVisible({ timeout: 10000 });
  });

  test('Dashboard has Security section in navigation', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const securityLink = page.locator('a, button').filter({ hasText: /security|visitor/i });
    await expect(securityLink.first()).toBeVisible({ timeout: 10000 });
  });

  test('Dashboard has Residents section in navigation', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const residentsLink = page.locator('a, button').filter({ hasText: /residents|directory/i });
    await expect(residentsLink.first()).toBeVisible({ timeout: 10000 });
  });

  test('Dashboard has Admin section in navigation', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const adminLink = page.locator('a, button').filter({ hasText: /admin|complaint/i });
    await expect(adminLink.first()).toBeVisible({ timeout: 10000 });
  });

  test('Dashboard displays user info or profile', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Look for user profile, avatar, or settings
    const userSection = page.locator('[class*="user"], [class*="profile"], [class*="avatar"]');
    const count = await userSection.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Dashboard is responsive - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Check if mobile bottom navigation exists
    const mobileBottomNav = page.locator('nav.fixed.bottom-0, [class*="mobile-bottom-nav" i]');
    await expect(mobileBottomNav.first()).toBeVisible({ timeout: 10000 });
  });

  test('All main navigation links work', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const allPages = [
      '/dashboard/financial/billing',
      '/dashboard/financial/invoices',
      '/dashboard/financial/payments',
      '/dashboard/security/visitors',
      '/dashboard/security/vehicles',
      '/dashboard/security/parcels',
      '/dashboard/residents/directory',
      '/dashboard/residents/amenities',
      '/dashboard/residents/events',
      '/dashboard/residents/notices',
      '/dashboard/admin/complaints',
      '/dashboard/admin/assets',
      '/dashboard/admin/vendors'
    ];

    for (const pagePath of allPages) {
      await page.goto(pagePath);
      await expect(page).toHaveURL(new RegExp(pagePath));

      // Check page loads without errors
      const errors: string[] = [];
      page.on('pageerror', err => errors.push(err.message));

      await page.waitForLoadState('networkidle');

      // Verify no critical errors
      expect(errors.filter(e => !e.includes('Warning'))).toHaveLength(0);
    }
  });

  test('Page transitions work smoothly', async ({ page }) => {
    await page.goto('/dashboard');

    // Navigate through different sections
    await page.goto('/dashboard/financial/billing');
    await page.waitForLoadState('networkidle');

    await page.goto('/dashboard/security/visitors');
    await page.waitForLoadState('networkidle');

    await page.goto('/dashboard/residents/directory');
    await page.waitForLoadState('networkidle');

    await page.goto('/dashboard/admin/assets');
    await page.waitForLoadState('networkidle');

    // All should load successfully
    await expect(page).toHaveURL(/\/dashboard\/admin\/assets/);
  });
});
