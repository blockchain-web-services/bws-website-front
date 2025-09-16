import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage.js';

test.describe('Image Visual Tests', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('Critical partner logos are visible and properly sized', async ({ page }) => {
    // Check PROOF logo
    const proofDimensions = await homePage.checkProofLogoDimensions();
    expect(proofDimensions.isCorrectSize).toBeTruthy();
    expect(proofDimensions.width).toBeLessThanOrEqual(120);

    // Check AssureDefi logo
    const assureDimensions = await homePage.checkAssureDefiLogoDimensions();
    expect(assureDimensions.isCorrectSize).toBeTruthy();
    expect(assureDimensions.width).toBeLessThanOrEqual(80);
    expect(assureDimensions.height).toBeLessThanOrEqual(40);

    // Check BFG logo
    const bfgDimensions = await homePage.checkBFGLogoDimensions();
    expect(bfgDimensions.isCorrectSize).toBeTruthy();
    expect(bfgDimensions.width).toBeLessThanOrEqual(150);
  });

  test('Tokenomics image loads and displays correctly', async ({ page }) => {
    await homePage.scrollToTokenomics();
    const isVisible = await homePage.isTokenomicsImageVisible();
    expect(isVisible).toBeTruthy();

    const dimensions = await homePage.getTokenomicsImageDimensions();
    expect(dimensions.naturalWidth).toBeGreaterThan(0);
    expect(dimensions.naturalHeight).toBeGreaterThan(0);
    expect(dimensions.displayWidth).toBeGreaterThan(0);
  });

  test('All critical images load successfully', async ({ page }) => {
    const criticalImages = [
      'PROOF-logo',
      'AssureDefi',
      'blockchain-founders-group',
      'Tokenomics',
      'NFT_1200x628'
    ];

    for (const imageName of criticalImages) {
      const isLoaded = await homePage.checkImageLoading(imageName);
      expect(isLoaded).toBeTruthy();
    }
  });

  test('No 404 errors for images', async ({ page }) => {
    const errors = await homePage.check404Errors();
    await page.reload();
    await page.waitForTimeout(2000);

    const imageErrors = errors.filter(url => url.includes('/assets/images/'));
    expect(imageErrors).toHaveLength(0);
  });

  test('Visual regression - Homepage screenshots', async ({ page }) => {
    // Full page screenshot
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      maxDiffPixels: 100
    });

    // Partner logos section
    await expect(homePage.partnerLogosSection).toHaveScreenshot('partner-logos.png');

    // Tokenomics section
    await homePage.scrollToTokenomics();
    await expect(homePage.tokenomicsSection).toHaveScreenshot('tokenomics-section.png');
  });

  test('Images have correct CSS classes applied', async ({ page }) => {
    // Check PROOF logo has correct class
    await expect(homePage.proofLogo).toHaveClass(/image-proof/);

    // Check AssureDefi logo has correct class
    await expect(homePage.assureDefiLogo).toHaveClass(/image-assure/);

    // Check BFG logo has correct class
    await expect(homePage.bfgLogo).toHaveClass(/image-bfg/);
  });

  test('Images display correctly at different viewport sizes', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Check if images are still visible
      const logosVisible = await homePage.arePartnerLogosVisible();
      expect(logosVisible).toBeTruthy();

      // Take screenshot for visual comparison
      await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`, {
        fullPage: false,
        maxDiffPixels: 100
      });
    }
  });
});