import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have correct canonical URL', async ({ page }) => {
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe('https://www.bws.ninja');
  });

  test('should handle dynamic content visibility', async ({ page }) => {
    // Check if dynamic items are visible
    const dynamicItems = page.locator('.w-dyn-item');
    const count = await dynamicItems.count();
    
    if (count > 0) {
      // Check initial opacity
      const firstItem = dynamicItems.first();
      const opacity = await firstItem.evaluate(el => 
        window.getComputedStyle(el).opacity
      );
      expect(parseFloat(opacity)).toBeGreaterThan(0);
    }
  });

  test('page should be accessible without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Allow GTM and analytics errors as they're external
    const criticalErrors = errors.filter(err => 
      !err.includes('googletagmanager') && 
      !err.includes('gtag') &&
      !err.includes('GTM')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('should have proper document structure', async ({ page }) => {
    // Check for body class
    const bodyClass = await page.locator('body').getAttribute('class');
    expect(bodyClass).toContain('body');
    
    // Check for HTML attributes
    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveAttribute('data-wf-domain', 'www.bws.ninja');
    await expect(htmlElement).toHaveAttribute('data-wf-page');
    await expect(htmlElement).toHaveAttribute('data-wf-site');
  });
});