import { test, expect } from '@playwright/test';

test.describe('All Pages Accessibility Tests', () => {
  const allPages = [
    // Main pages
    { path: '/', name: 'Homepage' },
    { path: '/about.html', name: 'About' },
    { path: '/industries.html', name: 'Industries' },
    { path: '/resources.html', name: 'Resources' },
    { path: '/contact-us.html', name: 'Contact' },
    { path: '/privacy-policy.html', name: 'Privacy Policy' },
    { path: '/legal-notice.html', name: 'Legal Notice' },
    { path: '/white-paper.html', name: 'White Paper' },
    
    // Marketplace pages
    { path: '/marketplace/database-immutable.html', name: 'Database Immutable' },
    { path: '/marketplace/database-mutable.html', name: 'Database Mutable' },
    { path: '/marketplace/ipfs-upload.html', name: 'IPFS Upload' },
    { path: '/marketplace/nft-zeroknwoledge.html', name: 'NFT Zero Knowledge' },
    { path: '/marketplace/nft-gamecube.html', name: 'NFT Gamecube' },
    { path: '/marketplace/blockchain-badges.html', name: 'Blockchain Badges' },
    { path: '/marketplace/esg-credits.html', name: 'ESG Credits' },
    { path: '/marketplace/telegram-xbot.html', name: 'Telegram XBot' },
    
    // Industry pages
    { path: '/industry-content/financial-services.html', name: 'Financial Services' },
    { path: '/industry-content/content-creation.html', name: 'Content Creation' },
    { path: '/industry-content/retail.html', name: 'Retail' },
    { path: '/industry-content/esg.html', name: 'ESG Industry' },
    { path: '/industry-content/legal.html', name: 'Legal Industry' },
    { path: '/industry-content/supply-chain.html', name: 'Supply Chain' },
    
    // Article pages
    { path: '/articles/discover-the-power-of-blockchain-bwss-data-management-solutions.html', name: 'Blockchain Article' },
    { path: '/articles/investment-impact-reporting-unlocking-a-sustainable-future.html', name: 'Investment Impact Article' },
    { path: '/articles/embrace-sustainability-with-esg-credits-bws-solution.html', name: 'ESG Credits Article' },
  ];
  
  test('should have all pages accessible (no 404s)', async ({ page }) => {
    const brokenPages: { path: string; status: number }[] = [];
    
    for (const pageInfo of allPages) {
      const response = await page.goto(pageInfo.path, { waitUntil: 'domcontentloaded' });
      
      if (!response || response.status() === 404) {
        brokenPages.push({
          path: pageInfo.path,
          status: response ? response.status() : 0
        });
      }
    }
    
    if (brokenPages.length > 0) {
      console.log('Broken pages found:', brokenPages);
    }
    
    expect(brokenPages).toHaveLength(0);
  });
  
  test('each page should have proper HTML structure', async ({ page }) => {
    const pagesWithIssues: string[] = [];
    
    for (const pageInfo of allPages) {
      await page.goto(pageInfo.path);
      
      // Check for essential HTML elements
      const hasTitle = await page.title();
      const hasH1 = await page.locator('h1').count();
      const hasHeader = await page.locator('header').count();
      const hasFooter = await page.locator('footer').count();
      const hasBody = await page.locator('body').count();
      
      if (!hasTitle || hasH1 === 0 || hasHeader === 0 || hasFooter === 0 || hasBody === 0) {
        pagesWithIssues.push(`${pageInfo.name} (${pageInfo.path}): Missing essential elements`);
      }
    }
    
    expect(pagesWithIssues).toHaveLength(0);
  });
  
  test('all internal links should work', async ({ page }) => {
    const brokenLinks: { source: string; target: string; status: number }[] = [];
    const checkedUrls = new Set<string>();
    
    for (const pageInfo of allPages) {
      await page.goto(pageInfo.path);
      
      // Get all links on the page
      const links = await page.locator('a[href]').all();
      
      for (const link of links) {
        const href = await link.getAttribute('href');
        if (!href) continue;
        
        // Skip external links and anchors
        if (href.startsWith('http://') || href.startsWith('https://') || 
            href.startsWith('mailto:') || href.startsWith('tel:') || 
            href === '#' || href.startsWith('#')) {
          continue;
        }
        
        // Construct full URL
        const targetUrl = new URL(href, page.url()).href;
        
        // Skip if already checked
        if (checkedUrls.has(targetUrl)) continue;
        checkedUrls.add(targetUrl);
        
        // Check if link works
        const response = await page.request.get(targetUrl);
        
        if (response.status() === 404) {
          brokenLinks.push({
            source: pageInfo.path,
            target: href,
            status: response.status()
          });
        }
      }
    }
    
    if (brokenLinks.length > 0) {
      console.log('Broken links found:', JSON.stringify(brokenLinks, null, 2));
    }
    
    expect(brokenLinks).toHaveLength(0);
  });
  
  test('each page should have CSS loaded', async ({ page }) => {
    const pagesWithoutCSS: string[] = [];
    
    for (const pageInfo of allPages) {
      await page.goto(pageInfo.path);
      
      // Check for CSS files
      const cssLinks = await page.locator('link[rel="stylesheet"]').count();
      
      if (cssLinks === 0) {
        pagesWithoutCSS.push(pageInfo.name);
      }
      
      // Check that styles are actually applied
      const hasStyles = await page.evaluate(() => {
        const body = document.body;
        const styles = window.getComputedStyle(body);
        // Check if font-family is not a generic default
        return styles.fontFamily && 
               styles.fontFamily !== 'serif' && 
               styles.fontFamily !== 'sans-serif' &&
               styles.fontFamily !== 'monospace';
      });
      
      if (!hasStyles) {
        pagesWithoutCSS.push(`${pageInfo.name} (no styles applied)`);
      }
    }
    
    expect(pagesWithoutCSS).toHaveLength(0);
  });
  
  test('navigation should be consistent across all pages', async ({ page }) => {
    let referenceNavLinks: string[] = [];
    const inconsistentPages: string[] = [];
    
    // Get navigation from homepage as reference
    await page.goto('/');
    const navLinks = await page.locator('nav a, header a').all();
    for (const link of navLinks) {
      const href = await link.getAttribute('href');
      if (href) referenceNavLinks.push(href);
    }
    
    // Check all other pages
    for (const pageInfo of allPages.slice(1)) { // Skip homepage
      await page.goto(pageInfo.path);
      
      const pageNavLinks: string[] = [];
      const links = await page.locator('nav a, header a').all();
      for (const link of links) {
        const href = await link.getAttribute('href');
        if (href) pageNavLinks.push(href);
      }
      
      // Compare with reference
      if (JSON.stringify(pageNavLinks.sort()) !== JSON.stringify(referenceNavLinks.sort())) {
        inconsistentPages.push(pageInfo.name);
      }
    }
    
    expect(inconsistentPages).toHaveLength(0);
  });
  
  test('all pages should load quickly', async ({ page }) => {
    const slowPages: { name: string; loadTime: number }[] = [];
    const maxLoadTime = 5000; // 5 seconds
    
    for (const pageInfo of allPages) {
      const startTime = Date.now();
      await page.goto(pageInfo.path, { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;
      
      if (loadTime > maxLoadTime) {
        slowPages.push({ name: pageInfo.name, loadTime });
      }
    }
    
    if (slowPages.length > 0) {
      console.log('Slow pages:', slowPages);
    }
    
    expect(slowPages).toHaveLength(0);
  });
});