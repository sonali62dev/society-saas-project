import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

// Test all main pages render correctly
test.describe('Live Site Verification - IGATESECURITY UI', () => {

  test('Login page renders with IGATESECURITY branding', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);

    // Check page loads
    await expect(page).toHaveTitle(/Society|IGATESECURITY/i);

    // Check IGATESECURITY branding elements
    await expect(page.locator('text=IGATESECURITY')).toBeVisible();
    await expect(page.locator('text=Welcome Back')).toBeVisible();

    // Check login form
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Check demo login buttons
    await expect(page.locator('text=Admin')).toBeVisible();
    await expect(page.locator('text=Resident')).toBeVisible();
    await expect(page.locator('text=Guard')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/screenshots/login-page.png', fullPage: true });
    console.log('✅ Login page renders correctly');
  });

  test('Admin Dashboard renders after login', async ({ page }) => {
    // Go to login
    await page.goto(`${BASE_URL}/auth/login`);

    // Click Admin demo button and fill credentials
    await page.click('text=Admin');
    await page.waitForTimeout(500);

    // Click Sign In
    await page.click('button:has-text("Sign In")');

    // Wait for navigation to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Check dashboard elements
    await expect(page.locator('text=Dashboard')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/screenshots/admin-dashboard.png', fullPage: true });
    console.log('✅ Admin Dashboard renders correctly');
  });

  test('Resident Dashboard renders after login', async ({ page }) => {
    // Go to login
    await page.goto(`${BASE_URL}/auth/login`);

    // Click Resident demo button
    await page.click('text=Resident');
    await page.waitForTimeout(500);

    // Click Sign In
    await page.click('button:has-text("Sign In")');

    // Wait for navigation
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Check resident dashboard elements
    await expect(page.locator('text=Dashboard')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/screenshots/resident-dashboard.png', fullPage: true });
    console.log('✅ Resident Dashboard renders correctly');
  });

  test('Guard/Security Dashboard renders after login', async ({ page }) => {
    // Go to login
    await page.goto(`${BASE_URL}/auth/login`);

    // Click Guard demo button
    await page.click('text=Guard');
    await page.waitForTimeout(500);

    // Click Sign In
    await page.click('button:has-text("Sign In")');

    // Wait for navigation
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Check security dashboard elements
    await expect(page.locator('text=Dashboard')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/screenshots/security-dashboard.png', fullPage: true });
    console.log('✅ Security Dashboard renders correctly');
  });

  test('Settings page renders correctly', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/auth/login`);
    await page.click('text=Admin');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Navigate to settings
    await page.goto(`${BASE_URL}/dashboard/settings`);
    await page.waitForLoadState('networkidle');

    // Check settings page
    await expect(page.locator('text=Settings')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/screenshots/settings-page.png', fullPage: true });
    console.log('✅ Settings page renders correctly');
  });

  test('Visitors page renders correctly', async ({ page }) => {
    // Login as admin
    await page.goto(`${BASE_URL}/auth/login`);
    await page.click('text=Admin');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Navigate to visitors
    await page.goto(`${BASE_URL}/dashboard/security/visitors`);
    await page.waitForLoadState('networkidle');

    // Check visitors page
    await expect(page.locator('text=Visitor')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/screenshots/visitors-page.png', fullPage: true });
    console.log('✅ Visitors page renders correctly');
  });

  test('Billing page renders correctly', async ({ page }) => {
    // Login as admin
    await page.goto(`${BASE_URL}/auth/login`);
    await page.click('text=Admin');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Navigate to billing
    await page.goto(`${BASE_URL}/dashboard/financial/billing`);
    await page.waitForLoadState('networkidle');

    // Check billing page
    await expect(page.locator('text=Billing')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/screenshots/billing-page.png', fullPage: true });
    console.log('✅ Billing page renders correctly');
  });

  test('Amenities page renders correctly', async ({ page }) => {
    // Login as admin
    await page.goto(`${BASE_URL}/auth/login`);
    await page.click('text=Admin');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Navigate to amenities
    await page.goto(`${BASE_URL}/dashboard/residents/amenities`);
    await page.waitForLoadState('networkidle');

    // Check amenities page
    await expect(page.locator('text=Amenities')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/screenshots/amenities-page.png', fullPage: true });
    console.log('✅ Amenities page renders correctly');
  });

  test('Complaints page renders correctly', async ({ page }) => {
    // Login as admin
    await page.goto(`${BASE_URL}/auth/login`);
    await page.click('text=Admin');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Navigate to complaints
    await page.goto(`${BASE_URL}/dashboard/admin/complaints`);
    await page.waitForLoadState('networkidle');

    // Check complaints page
    await expect(page.locator('text=Complaint')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/screenshots/complaints-page.png', fullPage: true });
    console.log('✅ Complaints page renders correctly');
  });

  test('My Unit page renders for resident', async ({ page }) => {
    // Login as resident
    await page.goto(`${BASE_URL}/auth/login`);
    await page.click('text=Resident');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Navigate to my unit
    await page.goto(`${BASE_URL}/dashboard/my-unit`);
    await page.waitForLoadState('networkidle');

    // Check my unit page
    await expect(page.locator('text=My Unit')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/screenshots/my-unit-page.png', fullPage: true });
    console.log('✅ My Unit page renders correctly');
  });

  test('Mobile view renders correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });

    // Go to login
    await page.goto(`${BASE_URL}/auth/login`);
    await page.waitForLoadState('networkidle');

    // Screenshot mobile login
    await page.screenshot({ path: 'test-results/screenshots/mobile-login.png', fullPage: true });

    // Login
    await page.click('text=Admin');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Screenshot mobile dashboard
    await page.screenshot({ path: 'test-results/screenshots/mobile-dashboard.png', fullPage: true });

    // Check mobile bottom nav is visible
    await expect(page.locator('nav.fixed.bottom-0')).toBeVisible();

    console.log('✅ Mobile view renders correctly');
  });
});
