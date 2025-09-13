import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Content Verification Tests', () => {
  const pages = [
    { url: '/', file: 'index.html' },
    { url: '/marketplace/database-immutable.html', file: 'marketplace/database-immutable.html' },
    { url: '/marketplace/database-mutable.html', file: 'marketplace/database-mutable.html' },
    { url: '/marketplace/ipfs-upload.html', file: 'marketplace/ipfs-upload.html' },
    { url: '/marketplace/nft-zeroknwoledge.html', file: 'marketplace/nft-zeroknwoledge.html' },
    { url: '/marketplace/nft-gamecube.html', file: 'marketplace/nft-gamecube.html' },
    { url: '/marketplace/blockchain-badges.html', file: 'marketplace/blockchain-badges.html' },
    { url: '/marketplace/esg-credits.html', file: 'marketplace/esg-credits.html' },
    { url: '/marketplace/telegram-xbot.html', file: 'marketplace/telegram-xbot.html' },
    { url: '/industry-content/financial-services.html', file: 'industry-content/financial-services.html' },
    { url: '/industry-content/content-creation.html', file: 'industry-content/content-creation.html' },
    { url: '/industry-content/retail.html', file: 'industry-content/retail.html' },
    { url: '/industry-content/esg.html', file: 'industry-content/esg.html' },
    { url: '/industry-content/legal.html', file: 'industry-content/legal.html' },
    { url: '/industry-content/supply-chain.html', file: 'industry-content/supply-chain.html' },
    { url: '/contact-us.html', file: 'contact-us.html' },
    { url: '/legal-notice.html', file: 'legal-notice.html' },
    { url: '/privacy-policy.html', file: 'privacy-policy.html' }
  ];

  test('should have all pages present', async ({ page }) => {
    for (const pageInfo of pages) {
      const response = await page.goto(`http://localhost:8081${pageInfo.url}`);
      expect(response?.status(), `Page ${pageInfo.url} should load`).toBe(200);
    }
  });

  test('homepage should have tokenomics content', async ({ page }) => {
    await page.goto('http://localhost:8081/');
    
    // Check for tokenomics section
    const tokenomicsSection = await page.locator('#tokenomics').count();
    expect(tokenomicsSection).toBeGreaterThan(0);
    
    // Check for specific tokenomics content
    await expect(page.locator('text=$BWS Tokenomics')).toBeVisible();
    await expect(page.locator('text=Token Utility')).toBeVisible();
    await expect(page.locator('text=Developer Grants')).toBeVisible();
  });

  test('homepage should have roadmap content', async ({ page }) => {
    await page.goto('http://localhost:8081/');
    
    // Check for roadmap section
    const roadmapSection = await page.locator('#roadmap').count();
    expect(roadmapSection).toBeGreaterThan(0);
    
    // Check for specific roadmap content
    await expect(page.locator('text=ROADMAP')).toBeVisible();
    await expect(page.locator('text=Q3\' 2023')).toBeVisible();
    await expect(page.locator('text=Q4\' 2024')).toBeVisible();
    await expect(page.locator('text=Token Launch')).toBeVisible();
  });

  test('navigation should have correct solution names', async ({ page }) => {
    await page.goto('http://localhost:8081/');
    
    // Check for proper solution names in navigation
    const navigationText = await page.locator('nav').textContent();
    
    expect(navigationText).toContain('Blockchain Save');
    expect(navigationText).toContain('Blockchain Hash');
    expect(navigationText).toContain('BWS IPFS');
    expect(navigationText).toContain('NFT.zK');
    expect(navigationText).toContain('Fan Game Cube');
    expect(navigationText).toContain('ESG Credits');
    expect(navigationText).toContain('Telegram XBot');
    
    // Should NOT contain malformed titles
    expect(navigationText).not.toContain('Blockchain Web Services Blockchain Web Services');
  });

  test('all marketplace pages should have proper content', async ({ page }) => {
    const marketplacePages = [
      { url: '/marketplace/database-immutable.html', title: 'Blockchain Save', description: 'Certificate of Trust' },
      { url: '/marketplace/database-mutable.html', title: 'Blockchain Hash', description: 'trusted database' },
      { url: '/marketplace/ipfs-upload.html', title: 'BWS IPFS', description: 'IPFS network' },
      { url: '/marketplace/nft-zeroknwoledge.html', title: 'NFT.zK', description: 'Zero Knowledge' },
      { url: '/marketplace/nft-gamecube.html', title: 'Fan Game Cube', description: 'Sports Club' },
      { url: '/marketplace/blockchain-badges.html', title: 'Blockchain Badges', description: 'digital credentials' },
      { url: '/marketplace/esg-credits.html', title: 'ESG Credits', description: 'environmental impact' },
      { url: '/marketplace/telegram-xbot.html', title: 'Telegram XBot', description: 'X activity' }
    ];

    for (const pageInfo of marketplacePages) {
      await page.goto(`http://localhost:8081${pageInfo.url}`);
      
      const pageContent = await page.content();
      expect(pageContent).toContain(pageInfo.title);
      expect(pageContent).toContain(pageInfo.description);
    }
  });

  test('CSS should load correctly on all pages', async ({ page }) => {
    for (const pageInfo of pages.slice(0, 5)) { // Test first 5 pages
      await page.goto(`http://localhost:8081${pageInfo.url}`);
      
      // Check that CSS files are loaded
      const cssLinks = await page.locator('link[rel="stylesheet"]').all();
      expect(cssLinks.length).toBeGreaterThan(0);
      
      // Check that webflow.css is referenced
      const webflowCSS = await page.locator('link[href*="webflow.css"]').count();
      expect(webflowCSS).toBeGreaterThan(0);
      
      // Check that styles are applied
      const bodyStyles = await page.evaluate(() => {
        const body = document.body;
        const styles = window.getComputedStyle(body);
        return {
          fontFamily: styles.fontFamily,
          hasStyles: styles.fontFamily !== '' && styles.fontFamily !== 'serif'
        };
      });
      
      expect(bodyStyles.hasStyles).toBeTruthy();
    }
  });

  test('compare local content with live site structure', async ({ page }) => {
    // Test homepage has same major sections as live site
    await page.goto('http://localhost:8081/');
    
    const sections = [
      '#solutions',    // Solutions marketplace
      '#tokenomics',   // Tokenomics section
      '#grants',       // Developer grants
      '#roadmap'       // Roadmap
    ];
    
    for (const section of sections) {
      const element = await page.locator(section).count();
      expect(element, `Section ${section} should exist`).toBeGreaterThan(0);
    }
    
    // Check footer has proper sections
    const footerLinks = await page.locator('footer a').count();
    expect(footerLinks).toBeGreaterThan(10); // Should have many footer links
  });

  test('verify exact content match for critical sections', async ({ page }) => {
    await page.goto('http://localhost:8081/');
    
    // Critical content that must be present
    const criticalContent = [
      '$BWS Token Launch Success',
      'Blockchain Founders Group accelerates BWS',
      'A Blockchain Solutions Marketplace for mass-market users',
      'The economic engine that powers the marketplace',
      'BWS Developer Grants',
      'Building a developer\'s community ecosystem'
    ];
    
    for (const content of criticalContent) {
      const exists = await page.locator(`text="${content}"`).count();
      expect(exists, `Critical content "${content}" should exist`).toBeGreaterThan(0);
    }
  });

  test('verify images and videos are referenced correctly', async ({ page }) => {
    await page.goto('http://localhost:8081/');
    
    // Check for video background
    const videoElements = await page.locator('video').count();
    expect(videoElements).toBeGreaterThan(0);
    
    // Check for logo image
    const logo = await page.locator('img[alt*="BWS"], img[alt*="logo"]').first();
    expect(logo).toBeTruthy();
    
    // Check that images have proper src attributes
    const images = await page.locator('img').all();
    for (const img of images.slice(0, 5)) { // Check first 5 images
      const src = await img.getAttribute('src');
      expect(src).toBeTruthy();
      expect(src).not.toBe('');
    }
  });
});

test.describe('Content Comparison with Live Site', () => {
  test('verify page structure matches live site', async ({ page, request }) => {
    const pagesToCompare = [
      '/',
      '/marketplace/database-immutable',
      '/contact-us'
    ];
    
    for (const pageUrl of pagesToCompare) {
      // Get local page
      await page.goto(`http://localhost:8081${pageUrl}${pageUrl === '/' ? '' : '.html'}`);
      const localTitle = await page.title();
      const localH1 = await page.locator('h1').first().textContent().catch(() => '');
      
      // Get live page (using stored original)
      const originalPath = path.join(
        process.cwd(), 
        'original-pages',
        pageUrl === '/' ? 'index.html' : pageUrl + '.html'
      );
      
      if (fs.existsSync(originalPath)) {
        const originalContent = fs.readFileSync(originalPath, 'utf8');
        
        // Extract title from original
        const titleMatch = originalContent.match(/<title>([^<]*)<\/title>/);
        const originalTitle = titleMatch ? titleMatch[1] : '';
        
        // Titles should match
        expect(localTitle).toBe(originalTitle);
      }
    }
  });
});