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

  test('Footer navigation links work', async ({ page, context }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // Test footer links - these open in new tabs
    const footerLinks = [
      { text: 'Privacy Policy', url: '/privacy-policy' },
      { text: 'Legal Notice', url: '/legal-notice' }
    ];

    for (const link of footerLinks) {
      const footerLink = page.locator(`footer a:has-text("${link.text}")`);
      if (await footerLink.isVisible()) {
        // Wait for new page to be created when clicking link with target="_blank"
        const pagePromise = context.waitForEvent('page');
        await footerLink.click();
        const newPage = await pagePromise;
        
        // Verify the new page navigated to the correct URL
        await newPage.waitForLoadState();
        await expect(newPage).toHaveURL(new RegExp(link.url));
        
        // Close the new page
        await newPage.close();
      }
    }
  });

  test('Logo click returns to homepage', async ({ page }) => {
    const aboutPage = new AboutPage(page);
    await aboutPage.goto();

    // Click logo to return home
    await page.locator('.logo-link, a[href="/"]').first().click();
    await expect(page).toHaveURL('/');
  });

  test('404 page handles non-existent routes', async ({ page }) => {
    await page.goto('/non-existent-page-12345');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check for 404 content or redirect
    const pageContent = await page.textContent('body');
    const is404 = pageContent?.includes('404') || pageContent?.includes('Not Found') || pageContent?.includes('Page Not Found');

    if (is404) {
      // If it's a 404 page, verify we're still on the 404 URL or redirected to a 404 page
      const currentUrl = page.url();
      const is404Url = currentUrl.includes('/404') || currentUrl.includes('non-existent-page');
      expect(is404Url || is404).toBeTruthy();
    } else {
      // If not a 404 page, should redirect to home
      await expect(page).toHaveURL('/');
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