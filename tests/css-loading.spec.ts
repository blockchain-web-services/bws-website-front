import { test, expect } from '@playwright/test';

test.describe('CSS Loading Tests', () => {
  test('should load all CSS files successfully', async ({ page }) => {
    const failedResources: string[] = [];
    
    // Monitor network requests
    page.on('response', response => {
      const url = response.url();
      if (url.endsWith('.css')) {
        if (response.status() !== 200 && response.status() !== 304) {
          failedResources.push(`${url} - Status: ${response.status()}`);
        }
      }
    });
    
    await page.goto('/');
    
    // Check that CSS files are linked
    const cssLinks = await page.locator('link[rel="stylesheet"]').all();
    expect(cssLinks.length).toBeGreaterThan(0);
    
    // Check each CSS link
    for (const link of cssLinks) {
      const href = await link.getAttribute('href');
      if (href) {
        const response = await page.request.get(href);
        expect(response.status()).toBe(200);
        
        // Verify it's actually CSS content
        const contentType = response.headers()['content-type'];
        expect(contentType).toMatch(/text\/css|application\/css/);
      }
    }
    
    expect(failedResources).toHaveLength(0);
  });
  
  test('should apply styles correctly', async ({ page }) => {
    await page.goto('/');
    
    // Wait for styles to load
    await page.waitForLoadState('networkidle');
    
    // Check that body has some styling applied
    const bodyStyles = await page.evaluate(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body);
      return {
        fontFamily: styles.fontFamily,
        margin: styles.margin,
        padding: styles.padding,
        backgroundColor: styles.backgroundColor
      };
    });
    
    // Font family should not be default
    expect(bodyStyles.fontFamily).not.toBe('');
    expect(bodyStyles.fontFamily).not.toMatch(/^serif$|^sans-serif$|^monospace$/);
  });
  
  test('should have webflow.css loaded', async ({ page }) => {
    await page.goto('/');
    
    // Check for webflow.css specifically
    const webflowLink = await page.locator('link[href*="webflow.css"]').first();
    expect(webflowLink).toBeTruthy();
    
    const href = await webflowLink.getAttribute('href');
    expect(href).toBeTruthy();
    
    // Verify the file loads
    const response = await page.request.get(href!);
    expect(response.status()).toBe(200);
    
    // Check content is not empty
    const content = await response.text();
    expect(content.length).toBeGreaterThan(1000); // Webflow CSS should be substantial
  });
  
  test('should have main.css loaded', async ({ page }) => {
    await page.goto('/');
    
    // Check for main.css specifically
    const mainLink = await page.locator('link[href*="main.css"]').first();
    expect(mainLink).toBeTruthy();
    
    const href = await mainLink.getAttribute('href');
    expect(href).toBeTruthy();
    
    // Verify the file loads
    const response = await page.request.get(href!);
    expect(response.status()).toBe(200);
    
    // Check content
    const content = await response.text();
    expect(content).toContain('BWS'); // Should have BWS-specific styles
  });
  
  test('should have no CSS 404 errors', async ({ page }) => {
    const cssErrors: string[] = [];
    
    page.on('response', response => {
      if (response.url().includes('.css') && response.status() === 404) {
        cssErrors.push(response.url());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(cssErrors).toHaveLength(0);
  });
  
  test('should have visible content with styles', async ({ page }) => {
    await page.goto('/');
    
    // Check that main elements are visible and styled
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    
    // Check header has background or border styling
    const headerStyles = await header.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        borderBottom: styles.borderBottom,
        padding: styles.padding
      };
    });
    
    // Should have some styling beyond defaults
    const hasBackground = headerStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                         headerStyles.backgroundColor !== 'transparent';
    const hasBorder = headerStyles.borderBottom !== 'none' && 
                     headerStyles.borderBottom !== '';
    const hasPadding = headerStyles.padding !== '0px';
    
    expect(hasBackground || hasBorder || hasPadding).toBeTruthy();
  });
  
  test('should load CSS for all page types', async ({ page }) => {
    const pagesToTest = [
      '/',
      '/about.html',
      '/marketplace/database-immutable.html',
      '/industry-content/financial-services.html',
      '/contact-us.html'
    ];
    
    for (const pageUrl of pagesToTest) {
      await page.goto(pageUrl);
      
      // Check CSS is loaded for each page
      const cssLinks = await page.locator('link[rel="stylesheet"]').count();
      expect(cssLinks).toBeGreaterThan(0);
      
      // Check that styles are applied
      const hasStyles = await page.evaluate(() => {
        const body = document.body;
        const styles = window.getComputedStyle(body);
        return styles.fontFamily !== '' && 
               styles.fontFamily !== 'serif' &&
               styles.fontFamily !== 'sans-serif';
      });
      
      expect(hasStyles).toBeTruthy();
    }
  });
});