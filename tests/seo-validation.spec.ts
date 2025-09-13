import { test, expect } from '@playwright/test';

test.describe('SEO Validation Tests', () => {
  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check title tag
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThanOrEqual(60); // Recommended max length
    
    // Check meta description
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(50);
    expect(description!.length).toBeLessThanOrEqual(160); // Recommended max length
    
    // Check viewport meta
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toBe('width=device-width, initial-scale=1');
  });
  
  test('should have Open Graph tags', async ({ page }) => {
    await page.goto('/');
    
    const requiredOGTags = [
      'og:title',
      'og:description', 
      'og:image',
      'og:url',
      'og:type'
    ];
    
    for (const tag of requiredOGTags) {
      const content = await page.locator(`meta[property="${tag}"]`).getAttribute('content');
      expect(content, `Missing Open Graph tag: ${tag}`).toBeTruthy();
      
      // Validate specific tags
      if (tag === 'og:image') {
        expect(content).toMatch(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i);
      }
      if (tag === 'og:url') {
        expect(content).toMatch(/^https?:\/\//);
      }
      if (tag === 'og:type') {
        expect(['website', 'article', 'product'].includes(content!)).toBeTruthy();
      }
    }
  });
  
  test('should have Twitter Card tags', async ({ page }) => {
    await page.goto('/');
    
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    expect(twitterCard).toBeTruthy();
    expect(['summary', 'summary_large_image', 'app', 'player'].includes(twitterCard!)).toBeTruthy();
    
    const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content');
    expect(twitterTitle).toBeTruthy();
    
    const twitterDescription = await page.locator('meta[name="twitter:description"]').getAttribute('content');
    expect(twitterDescription).toBeTruthy();
    
    const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content');
    expect(twitterImage).toBeTruthy();
  });
  
  test('should have canonical URL', async ({ page }) => {
    await page.goto('/');
    
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBeTruthy();
    expect(canonical).toMatch(/^https?:\/\//);
    
    // Canonical should not have query parameters or fragments
    expect(canonical).not.toContain('?');
    expect(canonical).not.toContain('#');
  });
  
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Check for H1
    const h1Count = await page.locator('h1').count();
    expect(h1Count, 'Page should have exactly one H1').toBe(1);
    
    // Get all headings
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    const headingLevels: number[] = [];
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName);
      headingLevels.push(parseInt(tagName[1]));
    }
    
    // Check for proper hierarchy (no skipping levels)
    for (let i = 1; i < headingLevels.length; i++) {
      const diff = headingLevels[i] - headingLevels[i - 1];
      expect(diff, 
        `Heading hierarchy skip: H${headingLevels[i-1]} to H${headingLevels[i]}`
      ).toBeLessThanOrEqual(1);
    }
  });
  
  test('should have structured data', async ({ page }) => {
    await page.goto('/');
    
    const structuredData = await page.locator('script[type="application/ld+json"]').all();
    
    // If structured data exists, validate it
    if (structuredData.length > 0) {
      for (const script of structuredData) {
        const content = await script.textContent();
        
        // Should be valid JSON
        let jsonData;
        try {
          jsonData = JSON.parse(content!);
        } catch (error) {
          throw new Error(`Invalid JSON in structured data: ${error}`);
        }
        
        // Check for required properties
        expect(jsonData['@context']).toBeTruthy();
        expect(jsonData['@type']).toBeTruthy();
      }
    } else {
      console.warn('No structured data found - consider adding Schema.org markup');
    }
  });
  
  test('should have sitemap reference', async ({ page }) => {
    await page.goto('/');
    
    // Check for sitemap in robots.txt
    const robotsResponse = await page.request.get('/robots.txt').catch(() => null);
    
    if (robotsResponse && robotsResponse.ok()) {
      const robotsContent = await robotsResponse.text();
      
      if (!robotsContent.includes('Sitemap:')) {
        console.warn('No sitemap reference in robots.txt');
      }
    } else {
      console.warn('No robots.txt file found');
    }
    
    // Check for sitemap.xml
    const sitemapResponse = await page.request.get('/sitemap.xml').catch(() => null);
    
    if (!sitemapResponse || !sitemapResponse.ok()) {
      console.warn('No sitemap.xml found - consider adding for better SEO');
    }
  });
  
  test('should have proper language attributes', async ({ page }) => {
    await page.goto('/');
    
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang, 'HTML should have lang attribute').toBeTruthy();
    expect(htmlLang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/); // e.g., 'en' or 'en-US'
  });
  
  test('images should have alt text', async ({ page }) => {
    await page.goto('/');
    
    const images = await page.locator('img').all();
    const missingAlt: string[] = [];
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      
      if (alt === null || alt === undefined) {
        missingAlt.push(src || 'unknown');
      } else if (alt.trim() === '') {
        // Empty alt is okay for decorative images, but log it
        console.log(`Empty alt text for image: ${src}`);
      }
    }
    
    expect(missingAlt, 
      `Images missing alt text: ${missingAlt.join(', ')}`
    ).toHaveLength(0);
  });
  
  test('should have favicon', async ({ page }) => {
    await page.goto('/');
    
    const favicon = await page.locator('link[rel="icon"], link[rel="shortcut icon"]').first();
    expect(await favicon.count()).toBeGreaterThan(0);
    
    const faviconHref = await favicon.getAttribute('href');
    expect(faviconHref).toBeTruthy();
    
    // Check if favicon loads
    if (faviconHref) {
      const response = await page.request.get(faviconHref).catch(() => null);
      expect(response?.ok(), `Favicon not found: ${faviconHref}`).toBeTruthy();
    }
  });
  
  test('should have mobile-friendly meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check for mobile web app capable
    const mobileCapable = await page.locator('meta[name="mobile-web-app-capable"]').count();
    const appleCapable = await page.locator('meta[name="apple-mobile-web-app-capable"]').count();
    
    if (mobileCapable === 0 && appleCapable === 0) {
      console.log('Consider adding mobile web app meta tags for better mobile experience');
    }
    
    // Check for theme color
    const themeColor = await page.locator('meta[name="theme-color"]').getAttribute('content');
    if (!themeColor) {
      console.log('Consider adding theme-color meta tag for mobile browsers');
    }
  });
});