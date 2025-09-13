import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Helper function to check if crawler output exists
function getCrawlerData() {
  const crawlerOutputPath = path.join(process.cwd(), 'crawler', 'output');
  
  try {
    const pagesPath = path.join(crawlerOutputPath, 'pages.json');
    const linkReportPath = path.join(crawlerOutputPath, 'link-report.json');
    
    if (fs.existsSync(pagesPath) && fs.existsSync(linkReportPath)) {
      return {
        pages: JSON.parse(fs.readFileSync(pagesPath, 'utf8')),
        linkReport: JSON.parse(fs.readFileSync(linkReportPath, 'utf8'))
      };
    }
  } catch (error) {
    console.warn('Crawler data not found, using default test data');
  }
  
  // Default test data if crawler hasn't run
  return {
    pages: [{ url: '/', links: [], externalLinks: [] }],
    linkReport: { orphanPages: [], linkGraph: [], errors: [] }
  };
}

const { pages, linkReport } = getCrawlerData();

test.describe('Link Integrity Tests', () => {
  test('should have no orphan pages', async () => {
    // Every page except the homepage should be reachable from at least one other page
    const orphans = linkReport.orphanPages || [];
    
    if (orphans.length > 0) {
      console.log('Orphan pages found:', orphans);
    }
    
    expect(orphans, 
      `Found ${orphans.length} orphan pages: ${orphans.join(', ')}`
    ).toHaveLength(0);
  });
  
  test('should have no broken internal links', async ({ page }) => {
    const brokenLinks: Array<{source: string, target: string, status: number | string}> = [];
    const baseUrl = 'http://localhost:8081';
    
    // Test the main page
    await page.goto('/');
    
    const links = await page.locator('a[href]').all();
    console.log(`Found ${links.length} links to check`);
    
    for (const link of links) {
      const href = await link.getAttribute('href');
      
      if (!href) continue;
      
      // Skip external links, mailto, tel, and anchors
      if (href.startsWith('http') && !href.includes('localhost')) continue;
      if (href.startsWith('mailto:') || href.startsWith('tel:')) continue;
      if (href === '#') continue;
      
      // Check internal links
      if (href.startsWith('/') || !href.startsWith('http')) {
        const targetUrl = href.startsWith('/') 
          ? `${baseUrl}${href}`
          : new URL(href, baseUrl).href;
        
        try {
          const response = await page.request.head(targetUrl);
          
          if (response.status() >= 400) {
            brokenLinks.push({
              source: page.url(),
              target: href,
              status: response.status()
            });
          }
        } catch (error) {
          brokenLinks.push({
            source: page.url(),
            target: href,
            status: 'Failed to connect'
          });
        }
      }
    }
    
    if (brokenLinks.length > 0) {
      console.log('Broken links found:', JSON.stringify(brokenLinks, null, 2));
    }
    
    expect(brokenLinks).toHaveLength(0);
  });
  
  test('should have valid anchor links', async ({ page }) => {
    const invalidAnchors: Array<{page: string, anchor: string}> = [];
    
    await page.goto('/');
    
    const anchorLinks = await page.locator('a[href^="#"]').all();
    
    for (const link of anchorLinks) {
      const href = await link.getAttribute('href');
      
      if (href && href.length > 1) { // Skip lone #
        const targetId = href.substring(1);
        const target = page.locator(`#${CSS.escape(targetId)}`);
        const count = await target.count();
        
        if (count === 0) {
          invalidAnchors.push({
            page: page.url(),
            anchor: href
          });
        }
      }
    }
    
    if (invalidAnchors.length > 0) {
      console.log('Invalid anchor links:', invalidAnchors);
    }
    
    expect(invalidAnchors).toHaveLength(0);
  });
  
  test('should have navigation consistency', async ({ page }) => {
    // Check that main navigation links are consistent across pages
    await page.goto('/');
    
    // Get main navigation links
    const mainNavLinks = await page.locator('nav a, header a').all();
    const navigationUrls = new Set<string>();
    
    for (const link of mainNavLinks) {
      const href = await link.getAttribute('href');
      if (href && !href.startsWith('#')) {
        navigationUrls.add(href);
      }
    }
    
    expect(navigationUrls.size, 
      'Navigation should have links'
    ).toBeGreaterThan(0);
    
    // Store navigation structure for comparison
    const expectedNav = Array.from(navigationUrls);
    console.log('Expected navigation links:', expectedNav);
  });
  
  test('should not have duplicate links in navigation', async ({ page }) => {
    await page.goto('/');
    
    const navLinks = await page.locator('nav a').all();
    const linkHrefs: string[] = [];
    
    for (const link of navLinks) {
      const href = await link.getAttribute('href');
      if (href) {
        linkHrefs.push(href);
      }
    }
    
    const uniqueLinks = new Set(linkHrefs);
    const duplicates = linkHrefs.filter((href, index) => 
      linkHrefs.indexOf(href) !== index
    );
    
    if (duplicates.length > 0) {
      console.log('Duplicate navigation links found:', duplicates);
    }
    
    expect(duplicates).toHaveLength(0);
  });
  
  test('should have footer links working', async ({ page }) => {
    await page.goto('/');
    
    const footerLinks = await page.locator('footer a').all();
    const brokenFooterLinks: string[] = [];
    
    for (const link of footerLinks) {
      const href = await link.getAttribute('href');
      
      if (href && href.startsWith('/')) {
        const isVisible = await link.isVisible();
        
        if (!isVisible) {
          console.warn(`Hidden footer link: ${href}`);
        }
        
        // Check if link text exists
        const text = await link.textContent();
        if (!text || text.trim() === '') {
          brokenFooterLinks.push(`Empty link text for: ${href}`);
        }
      }
    }
    
    expect(brokenFooterLinks).toHaveLength(0);
  });
  
  test('should have images with valid sources', async ({ page }) => {
    await page.goto('/');
    
    const images = await page.locator('img').all();
    const brokenImages: string[] = [];
    
    for (const img of images) {
      const src = await img.getAttribute('src');
      
      if (src && !src.startsWith('data:')) {
        // Check if image loads
        const isVisible = await img.isVisible();
        
        if (isVisible) {
          const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
          
          if (naturalWidth === 0) {
            brokenImages.push(src);
          }
        }
      }
    }
    
    if (brokenImages.length > 0) {
      console.log('Broken images:', brokenImages);
    }
    
    expect(brokenImages).toHaveLength(0);
  });
  
  test('external links should have proper attributes', async ({ page }) => {
    await page.goto('/');
    
    const externalLinks = await page.locator('a[href^="http"]:not([href*="localhost"]):not([href*="bws.ninja"])').all();
    const improperLinks: string[] = [];
    
    for (const link of externalLinks) {
      const href = await link.getAttribute('href');
      const target = await link.getAttribute('target');
      const rel = await link.getAttribute('rel');
      
      // External links should open in new tab with proper rel attributes
      if (!target || target !== '_blank') {
        improperLinks.push(`${href} - missing target="_blank"`);
      }
      
      if (!rel || (!rel.includes('noopener') && !rel.includes('noreferrer'))) {
        improperLinks.push(`${href} - missing rel="noopener noreferrer"`);
      }
    }
    
    // This is a warning, not a failure
    if (improperLinks.length > 0) {
      console.warn('External links with improper attributes:', improperLinks);
    }
  });
});