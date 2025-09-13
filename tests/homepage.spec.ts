import { test, expect } from '@playwright/test';

test.describe('BWS Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/Cutting-Edge Blockchain Solutions/);
  });

  test('should have meta tags for SEO', async ({ page }) => {
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toContain('Blockchain Solutions Marketplace');
    
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBe('Cutting-Edge Blockchain Solutions');
  });

  test('should load essential assets', async ({ page }) => {
    // Check favicon loads
    const favicon = page.locator('link[rel="shortcut icon"]');
    await expect(favicon).toHaveAttribute('href', 'assets/images/favicon-32x32.png');
    
    // Check CSS files load
    const mainCSS = page.locator('link[href="assets/css/main.css"]');
    await expect(mainCSS).toHaveCount(1);
    
    const webflowCSS = page.locator('link[href="assets/css/webflow.css"]');
    await expect(webflowCSS).toHaveCount(1);
  });

  test('should load JavaScript files', async ({ page }) => {
    // Check if main.js is loaded
    const mainJS = page.locator('script[src="assets/js/main.js"]');
    await expect(mainJS).toHaveCount(1);
    
    // Check if Google Analytics is loaded
    const gaScript = page.locator('script[src*="googletagmanager.com/gtag"]');
    await expect(gaScript).toHaveCount(1);
  });

  test('should have Google Tag Manager', async ({ page }) => {
    // Check GTM script
    const gtmScript = await page.evaluate(() => {
      return window.dataLayer !== undefined;
    });
    expect(gtmScript).toBe(true);
    
    // Check GTM noscript iframe
    const gtmNoScript = page.locator('iframe[src*="googletagmanager.com/ns.html"]');
    await expect(gtmNoScript).toHaveCount(1);
  });

  test('should have responsive viewport meta tag', async ({ page }) => {
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toBe('width=device-width, initial-scale=1');
  });

  test('should load web fonts', async ({ page }) => {
    // Check if WebFont loader is present
    const webFontScript = page.locator('script[src*="webfont.js"]');
    await expect(webFontScript).toHaveCount(1);
    
    // Check if fonts are configured
    const fontsLoaded = await page.evaluate(() => {
      return typeof WebFont !== 'undefined';
    });
    expect(fontsLoaded).toBe(true);
  });
});