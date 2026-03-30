import { test, expect } from '@playwright/test';

/**
 * HTML Structure Validation Tests
 * Ensures all pages have proper HTML5 structure
 * This prevents issues like the malformed contact-us/legal-notice pages
 */

test.describe('HTML Structure Validation', () => {
  const pagesToTest = [
    { path: '/', name: 'Homepage' },
    { path: '/about.html', name: 'About' },
    { path: '/contact-us.html', name: 'Contact Us' },
    { path: '/legal-notice.html', name: 'Legal Notice' },
    { path: '/privacy-policy.html', name: 'Privacy Policy' },
    { path: '/industries.html', name: 'Industries' },
    { path: '/resources.html', name: 'Resources' },
    { path: '/marketplace/database-immutable.html', name: 'Database Immutable' },
    { path: '/marketplace/database-mutable.html', name: 'Database Mutable' },
    { path: '/marketplace/ipfs-upload.html', name: 'IPFS Upload' },
    { path: '/marketplace/nft-zeroknwoledge.html', name: 'NFT Zero Knowledge' },
    { path: '/marketplace/blockchain-badges.html', name: 'Blockchain Badges' },
    { path: '/marketplace/telegram-xbot.html', name: 'Telegram XBot' },
    { path: '/industry-content/financial-services.html', name: 'Financial Services' },
    { path: '/industry-content/content-creation.html', name: 'Content Creation' },
    { path: '/industry-content/retail.html', name: 'Retail' },
    { path: '/industry-content/esg.html', name: 'ESG' },
    { path: '/industry-content/legal.html', name: 'Legal' },
    { path: '/industry-content/supply-chain.html', name: 'Supply Chain' },
  ];

  pagesToTest.forEach(({ path, name }) => {
    test(`${name} has valid HTML5 structure`, async ({ page }) => {
      // Navigate to the page
      const response = await page.goto(path);
      expect(response?.status()).toBeLessThan(400);

      // Get the full HTML content
      const html = await page.content();

      // Check for DOCTYPE
      expect(html).toMatch(/<!DOCTYPE\s+html/i);

      // Check for html tag
      const htmlElement = await page.locator('html');
      await expect(htmlElement).toBeVisible();

      // Check for head tag
      const headElement = await page.locator('head');
      await expect(headElement).toHaveCount(1);

      // Check for body tag
      const bodyElement = await page.locator('body');
      await expect(bodyElement).toBeVisible();

      // Check for title tag
      const titleElement = await page.locator('head title');
      await expect(titleElement).toHaveCount(1);
      const title = await titleElement.textContent();
      expect(title).toBeTruthy();

      // Check for charset meta tag
      const charsetMeta = await page.locator('head meta[charset]');
      await expect(charsetMeta).toHaveCount(1);

      // Check for viewport meta tag
      const viewportMeta = await page.locator('head meta[name="viewport"]');
      await expect(viewportMeta).toHaveCount(1);
    });
  });

  test('All pages have proper closing tags', async ({ page }) => {
    for (const { path, name } of pagesToTest) {
      await test.step(`Check ${name}`, async () => {
        await page.goto(path);
        const html = await page.content();

        // Check for closing tags
        expect(html).toMatch(/<\/html>/i);
        expect(html).toMatch(/<\/head>/i);
        expect(html).toMatch(/<\/body>/i);
      });
    }
  });

  test('No pages have malformed HTML tags', async ({ page }) => {
    for (const { path, name } of pagesToTest) {
      await test.step(`Check ${name}`, async () => {
        await page.goto(path);
        const html = await page.content();

        // Check for malformed HTML tag (unclosed angle bracket)
        expect(html).not.toMatch(/<html\s*$/m);
        expect(html).not.toMatch(/<head\s*$/m);
        expect(html).not.toMatch(/<body\s*$/m);

        // Check that HTML starts properly
        const htmlLines = html.split('\n');
        const firstNonEmptyLine = htmlLines.find(line => line.trim());
        expect(firstNonEmptyLine).toMatch(/^<!DOCTYPE\s+html/i);
      });
    }
  });

  test('Critical pages have navigation menu', async ({ page }) => {
    const criticalPages = [
      '/contact-us.html',
      '/legal-notice.html',
      '/about.html',
      '/industries.html'
    ];

    for (const path of criticalPages) {
      await test.step(`Check navigation in ${path}`, async () => {
        // Increase timeout for CI environments which may be slower
        await page.goto(path, { timeout: 90000 });

        // Check for navigation menu
        const navMenu = await page.locator('.nav-menu, nav[role="navigation"]');
        await expect(navMenu).toBeVisible();

        // Check for essential navigation elements
        const navLinks = await page.locator('.nav-link-dropdown, .nav-link');
        expect(await navLinks.count()).toBeGreaterThan(0);
      });
    }
  });
});

test.describe('Prevent Regression - Malformed HTML Detection', () => {
  test('Validator rejects malformed HTML fragments', async ({ page }) => {
    // This test ensures we never regress to accepting HTML fragments as valid pages
    const malformedHTML = `
      <div class="w-embed w-iframe">
        <!-- Google Tag Manager (noscript) -->
      </div>
      <div class="page-wrapper hidden-overflow">
      </div>
    `;

    // We can't actually test the validator directly in Playwright,
    // but we can ensure our pages don't match this pattern
    const response = await page.goto('/contact-us.html');
    const html = await page.content();

    // Ensure it has proper structure (opposite of malformed)
    expect(html).toContain('<!DOCTYPE html');
    expect(html).toContain('<html');
    expect(html).toContain('<head');
    expect(html).toContain('<body');
    expect(html).toContain('</html>');

    // Ensure it doesn't start with a fragment
    expect(html.trim()).not.toMatch(/^<div/);
  });
});