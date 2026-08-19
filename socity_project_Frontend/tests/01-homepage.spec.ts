import { test, expect } from '@playwright/test';

test.describe('Homepage Tests', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/IGATESECURITY|Society Management/i);
    await page.waitForLoadState('networkidle');
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    const heroHeading = page.locator('h1').first();
    await expect(heroHeading).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should have Get Started button', async ({ page }) => {
    await page.goto('/');
    const ctaButton = page.getByRole('button', { name: /get started|sign up|join/i });
    await expect(ctaButton.first()).toBeVisible();
  });

  test('should display features section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const content = await page.content();
    expect(content.length).toBeGreaterThan(1000);
  });
});
