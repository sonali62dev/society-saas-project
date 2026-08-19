import { test, expect } from '@playwright/test';

test.describe('End-to-End Full Application Flow', () => {
  test('Complete application walkthrough', async ({ page }) => {
    // 1. Homepage
    console.log('Testing: Homepage');
    await page.goto('/');
    await expect(page).toHaveTitle(/IGATESECURITY|Society Management/i);
    await page.waitForLoadState('networkidle');

    // 2. Navigate to Dashboard
    console.log('Testing: Dashboard navigation');
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/dashboard/);

    // 3. Test Financial Section
    console.log('Testing: Financial pages');
    await page.goto('/dashboard/financial/billing');
    await page.waitForLoadState('networkidle');
    const billingHeading = page.locator('h1, h2').first();
    await expect(billingHeading).toBeVisible();

    await page.goto('/dashboard/financial/invoices');
    await page.waitForLoadState('networkidle');
    const invoiceHeading = page.locator('h1, h2').first();
    await expect(invoiceHeading).toBeVisible();

    await page.goto('/dashboard/financial/payments');
    await page.waitForLoadState('networkidle');
    const paymentHeading = page.locator('h1, h2').first();
    await expect(paymentHeading).toBeVisible();

    // 4. Test Security Section
    console.log('Testing: Security pages');
    await page.goto('/dashboard/security/visitors');
    await page.waitForLoadState('networkidle');
    const visitorHeading = page.locator('h1, h2').first();
    await expect(visitorHeading).toBeVisible();

    await page.goto('/dashboard/security/vehicles');
    await page.waitForLoadState('networkidle');
    const vehicleHeading = page.locator('h1, h2').first();
    await expect(vehicleHeading).toBeVisible();

    await page.goto('/dashboard/security/parcels');
    await page.waitForLoadState('networkidle');
    const parcelHeading = page.locator('h1, h2').first();
    await expect(parcelHeading).toBeVisible();

    // 5. Test Residents Section
    console.log('Testing: Residents pages');
    await page.goto('/dashboard/residents/directory');
    await page.waitForLoadState('networkidle');
    const directoryHeading = page.locator('h1, h2').first();
    await expect(directoryHeading).toBeVisible();

    await page.goto('/dashboard/residents/amenities');
    await page.waitForLoadState('networkidle');
    const amenitiesHeading = page.locator('h1, h2').first();
    await expect(amenitiesHeading).toBeVisible();

    await page.goto('/dashboard/residents/events');
    await page.waitForLoadState('networkidle');
    const eventsHeading = page.locator('h1, h2').first();
    await expect(eventsHeading).toBeVisible();

    await page.goto('/dashboard/residents/notices');
    await page.waitForLoadState('networkidle');
    const noticesHeading = page.locator('h1, h2').first();
    await expect(noticesHeading).toBeVisible();

    // 6. Test Admin Section
    console.log('Testing: Admin pages');
    await page.goto('/dashboard/admin/complaints');
    await page.waitForLoadState('networkidle');
    const complaintsHeading = page.locator('h1, h2').first();
    await expect(complaintsHeading).toBeVisible();

    await page.goto('/dashboard/admin/assets');
    await page.waitForLoadState('networkidle');
    const assetsHeading = page.locator('h1, h2').first();
    await expect(assetsHeading).toBeVisible();

    await page.goto('/dashboard/admin/vendors');
    await page.waitForLoadState('networkidle');
    const vendorsHeading = page.locator('h1, h2').first();
    await expect(vendorsHeading).toBeVisible();

    console.log('✅ All pages tested successfully!');
  });

  test('No console errors on any page', async ({ page }) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
      if (msg.type() === 'warning') warnings.push(msg.text());
    });

    const allPages = [
      '/',
      '/dashboard',
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
      console.log(`Checking: ${pagePath}`);
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
    }

    console.log(`Total errors: ${errors.length}`);
    console.log(`Total warnings: ${warnings.length}`);

    // Allow some warnings but no critical errors
    expect(errors.filter(e => !e.includes('favicon') && !e.includes('404'))).toHaveLength(0);
  });

  test('All pages load within acceptable time', async ({ page }) => {
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
      const startTime = Date.now();
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      console.log(`${pagePath}: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(10000); // 10 second timeout
    }
  });
});
