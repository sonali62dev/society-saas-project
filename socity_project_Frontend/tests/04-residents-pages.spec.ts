import { test, expect } from '@playwright/test';

test.describe('Residents Management Pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('Resident Directory page loads', async ({ page }) => {
    await page.goto('/dashboard/residents/directory');
    await expect(page).toHaveURL(/\/dashboard\/residents\/directory/);

    const heading = page.locator('h1, h2').filter({ hasText: /directory|resident/i });
    await expect(heading.first()).toBeVisible({ timeout: 10000 });
  });

  test('Directory has search functionality', async ({ page }) => {
    await page.goto('/dashboard/residents/directory');

    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
    await expect(searchInput.first()).toBeVisible({ timeout: 10000 });
  });

  test('Directory has resident cards or table', async ({ page }) => {
    await page.goto('/dashboard/residents/directory');
    await page.waitForLoadState('networkidle');

    const dataDisplay = page.locator('table, [role="table"], [class*="card"], [class*="grid"]');
    const count = await dataDisplay.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Amenities Booking page loads', async ({ page }) => {
    await page.goto('/dashboard/residents/amenities');
    await expect(page).toHaveURL(/\/dashboard\/residents\/amenities/);

    const heading = page.locator('h1, h2').filter({ hasText: /amenities/i });
    await expect(heading.first()).toBeVisible({ timeout: 10000 });
  });

  test('Amenities page has booking button', async ({ page }) => {
    await page.goto('/dashboard/residents/amenities');
    await page.waitForLoadState('networkidle');

    const bookButton = page.locator('button').filter({ hasText: /book|reserve|new/i });
    await expect(bookButton.first()).toBeVisible({ timeout: 10000 });
  });

  test('Amenities page displays available facilities', async ({ page }) => {
    await page.goto('/dashboard/residents/amenities');
    await page.waitForLoadState('networkidle');

    const content = await page.content();
    expect(content.length).toBeGreaterThan(500);
  });

  test('Events & Activities page loads', async ({ page }) => {
    await page.goto('/dashboard/residents/events');
    await expect(page).toHaveURL(/\/dashboard\/residents\/events/);

    const heading = page.locator('h1, h2').filter({ hasText: /event/i });
    await expect(heading.first()).toBeVisible({ timeout: 10000 });
  });

  test('Events page has create event button', async ({ page }) => {
    await page.goto('/dashboard/residents/events');
    await page.waitForLoadState('networkidle');

    const createButton = page.locator('button').filter({ hasText: /create|add|new/i });
    await expect(createButton.first()).toBeVisible({ timeout: 10000 });
  });

  test('Events page has filter options', async ({ page }) => {
    await page.goto('/dashboard/residents/events');
    await page.waitForLoadState('networkidle');

    const filterElements = page.locator('button, select').filter({ hasText: /all|upcoming|past/i });
    const count = await filterElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Notices Board page loads', async ({ page }) => {
    await page.goto('/dashboard/residents/notices');
    await expect(page).toHaveURL(/\/dashboard\/residents\/notices/);

    const heading = page.locator('h1, h2').filter({ hasText: /notice/i });
    await expect(heading.first()).toBeVisible({ timeout: 10000 });
  });

  test('Notices page has post notice button', async ({ page }) => {
    await page.goto('/dashboard/residents/notices');
    await page.waitForLoadState('networkidle');

    const postButton = page.locator('button').filter({ hasText: /post|add|create|new/i });
    await expect(postButton.first()).toBeVisible({ timeout: 10000 });
  });

  test('All residents pages are accessible', async ({ page }) => {
    const residentsPages = [
      '/dashboard/residents/directory',
      '/dashboard/residents/amenities',
      '/dashboard/residents/events',
      '/dashboard/residents/notices'
    ];

    for (const pagePath of residentsPages) {
      await page.goto(pagePath);
      await expect(page).toHaveURL(new RegExp(pagePath));
      await page.waitForLoadState('networkidle');
    }
  });
});
