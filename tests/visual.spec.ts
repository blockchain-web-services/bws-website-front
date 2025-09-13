import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('homepage visual snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for fonts to load
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('homepage.png', { 
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('homepage mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('homepage-mobile.png', { 
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('homepage tablet view', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('homepage-tablet.png', { 
      fullPage: true,
      animations: 'disabled'
    });
  });
});