import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage';
import { AboutPage } from '../page-objects/AboutPage';
import { IndustriesPage } from '../page-objects/IndustriesPage';
import { MarketplacePage } from '../page-objects/MarketplacePage';

test.describe('Navigation Tests', () => {
  test('Main navigation menu works correctly', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Test navigation to About page
    await homePage.navigateViaMenu('About');
    await expect(page).toHaveURL(/\/about/);

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
      if (await footerLink.isVisible()) {
        await footerLink.click();
        await expect(page).toHaveURL(new RegExp(link.url));
        await page.goBack();
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

    // Check for 404 content or redirect
    const pageContent = await page.textContent('body');
    const is404 = pageContent?.includes('404') || pageContent?.includes('Not Found');

    if (!is404) {
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