import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage.js';
import { AboutPage } from '../page-objects/AboutPage.js';
import { IndustriesPage } from '../page-objects/IndustriesPage.js';
import { MarketplacePage } from '../page-objects/MarketplacePage.js';

test.describe('Navigation Tests', () => {
  test('Main navigation menu works correctly', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Wait for navigation to be ready
    await page.waitForLoadState('networkidle');

    // Test navigation to About page
    await homePage.navigateViaMenu('About');
    await expect(page).toHaveURL(/\/about/, { timeout: 10000 });

    // Test navigation to Industries
    await homePage.navigateViaMenu('Industries');
    await expect(page).toHaveURL(/\/industries/);

    // Test navigation to Resources
    await homePage.navigateViaMenu('Resources');
    await expect(page).toHaveURL(/\/resources/);

    // Test navigation to Contact
    await homePage.navigateViaMenu('Contact');
    await expect(page).toHaveURL(/\/contact/);
  });

  test('Industry dropdown navigation works', async ({ page }) => {
    const industriesPage = new IndustriesPage(page);
    await page.goto('/');

    // Hover over Solutions to show dropdown
    await industriesPage.hoverOverSolutions();

    // Check all industry cards are visible
    const cardCount = await industriesPage.getIndustryCardsCount();
    expect(cardCount).toBeGreaterThan(0);

    // Navigate to Content Creation
    await industriesPage.navigateToIndustry('content-creation');
    await expect(page).toHaveURL(/\/industry-content\/content-creation/);
  });

  test('Footer navigation links work', async ({ page }) => {
    const homePage = new HomePage(page);

    // Setup console error tracking
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await homePage.goto();

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // Test footer links
    const footerLinks = [
      { text: 'Privacy Policy', url: '/privacy-policy' },
      { text: 'Legal Notice', url: '/legal-notice' }
    ];

    for (const link of footerLinks) {
      const footerLink = page.locator(`footer a:has-text("${link.text}")`);

      // Check if link exists and is visible
      const count = await footerLink.count();
      if (count === 0) {
        console.log(`⚠️ Footer link "${link.text}" not found`);
        continue;
      }

      const isVisible = await footerLink.isVisible({ timeout: 5000 }).catch(() => false);
      if (!isVisible) {
        console.log(`⚠️ Footer link "${link.text}" not visible`);
        continue;
      }

      // Get href before clicking for debugging
      const href = await footerLink.getAttribute('href');
      console.log(`Clicking footer link: "${link.text}" (href: ${href})`);

      // Click and wait for navigation
      await footerLink.click();
      await page.waitForLoadState('domcontentloaded', { timeout: 15000 });

      // Log console errors if any
      if (consoleErrors.length > 0) {
        console.log(`Console errors detected: ${consoleErrors.join(', ')}`);
      }

      // Check URL
      const currentURL = page.url();
      console.log(`Current URL after click: ${currentURL}`);
      await expect(page).toHaveURL(new RegExp(link.url), { timeout: 5000 });

      await page.goBack();
      await page.waitForLoadState('domcontentloaded');
    }
  });

  test('Logo click returns to homepage', async ({ page }) => {
    const aboutPage = new AboutPage(page);
    await aboutPage.goto();

    // Click logo to return home - with better error handling
    const logoLink = page.locator('.logo-link, a[href="/"]').first();

    // Wait for logo to be visible and clickable
    await logoLink.waitFor({ state: 'visible', timeout: 10000 });

    console.log('Clicking logo to return to homepage...');
    await logoLink.click({ timeout: 15000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });

    const currentURL = page.url();
    console.log(`Current URL after logo click: ${currentURL}`);
    await expect(page).toHaveURL('/', { timeout: 5000 });
  });

  test('404 page handles non-existent routes', async ({ page }) => {
    // Navigate to non-existent page
    const response = await page.goto('/non-existent-page-12345');
    await page.waitForLoadState('domcontentloaded');

    console.log(`Response status: ${response?.status()}`);
    console.log(`Current URL: ${page.url()}`);

    // Check for 404 content or redirect
    const pageContent = await page.textContent('body');
    const is404 = pageContent?.includes('404') || pageContent?.includes('Not Found');

    console.log(`Is 404 page: ${is404}`);

    if (!is404) {
      // If not a 404 page, Astro may redirect to home
      // Wait a bit for potential redirect
      await page.waitForTimeout(2000);
      const finalURL = page.url();
      console.log(`Final URL: ${finalURL}`);

      // Check if redirected to home
      await expect(page).toHaveURL('/', { timeout: 5000 });
    }
  });

  test('All marketplace products are accessible', async ({ page }) => {
    const marketplaceProducts = [
      'database-immutable',
      'database-mutable',
      'blockchain-badges',
      'esg-credits',
      'ipfs-upload',
      'nft-gamecube',
      'nft-zeroknwoledge',
      'telegram-xbot'
    ];

    for (const product of marketplaceProducts) {
      await page.goto(`/marketplace/${product}`);
      await expect(page).not.toHaveTitle(/404/);

      // Check that page has content
      const h1 = await page.locator('h1').first().textContent();
      expect(h1).toBeTruthy();
    }
  });

  test('Browser back/forward navigation works', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Navigate to multiple pages
    await homePage.navigateViaMenu('About');
    await homePage.navigateViaMenu('Industries');
    await homePage.navigateViaMenu('Resources');

    // Test browser back button
    await page.goBack();
    await expect(page).toHaveURL(/\/industries/);

    await page.goBack();
    await expect(page).toHaveURL(/\/about/);

    // Test browser forward button
    await page.goForward();
    await expect(page).toHaveURL(/\/industries/);
  });
});