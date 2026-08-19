import { test, expect } from '@playwright/test';

// Simple smoke test that runs quickly
test.describe('Quick Smoke Test - All Pages Load', () => {
  const allPages = [
    { path: '/dashboard/financial/billing', name: 'Billing' },
    { path: '/dashboard/financial/invoices', name: 'Invoices' },
    { path: '/dashboard/financial/payments', name: 'Payments' },
    { path: '/dashboard/security/visitors', name: 'Visitors' },
    { path: '/dashboard/security/vehicles', name: 'Vehicles' },
    { path: '/dashboard/security/parcels', name: 'Parcels' },
    { path: '/dashboard/residents/directory', name: 'Directory' },
    { path: '/dashboard/residents/amenities', name: 'Amenities' },
    { path: '/dashboard/residents/events', name: 'Events' },
    { path: '/dashboard/residents/notices', name: 'Notices' },
    { path: '/dashboard/admin/complaints', name: 'Complaints' },
    { path: '/dashboard/admin/assets', name: 'Assets' },
    { path: '/dashboard/admin/vendors', name: 'Vendors' }
  ];

  for (const page of allPages) {
    test(`${page.name} page should load`, async ({ page: browserPage }) => {
      await browserPage.goto(page.path, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await expect(browserPage).toHaveURL(new RegExp(page.path));

      // Just check that page has loaded - look for any heading
      const hasContent = await browserPage.locator('body').isVisible();
      expect(hasContent).toBeTruthy();
    });
  }
});
