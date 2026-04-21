import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage.js';

test.describe('Image Visual Tests', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test.skip('Critical partner logos are visible and properly sized', async ({ page }) => {
    // SKIPPED: Partner logos removed from news cards in redesign
    // Check PROOF logo
    const proofDimensions = await homePage.checkProofLogoDimensions();
    expect(proofDimensions.isCorrectSize).toBeTruthy();
    // Height auto-adjusts based on 150px width and aspect ratio
    expect(proofDimensions.width).toBeLessThanOrEqual(150);

    // Check AssureDefi logo
    const assureDimensions = await homePage.checkAssureDefiLogoDimensions();
    expect(assureDimensions.isCorrectSize).toBeTruthy();
    // Width auto-adjusts based on 120px height and aspect ratio
    expect(assureDimensions.height).toBeLessThanOrEqual(120);

    // Check BFG logo
    const bfgDimensions = await homePage.checkBFGLogoDimensions();
    expect(bfgDimensions.isCorrectSize).toBeTruthy();
    expect(bfgDimensions.width).toBeLessThanOrEqual(150);
  });

  test('Tokenomics donut chart renders', async ({ page }) => {
    await homePage.scrollToTokenomics();
    const chart = page.locator('.token-allocation-svg').first();
    await expect(chart).toBeVisible();
    const legendItems = page.locator('.token-allocation-legend li');
    expect(await legendItems.count()).toBe(6);
  });


  test('No 404 errors for images', async ({ page }) => {
    const errors = await homePage.check404Errors();
    await page.reload();
    await page.waitForTimeout(2000);

    const imageErrors = errors.filter(url => url.includes('/assets/images/'));
    expect(imageErrors).toHaveLength(0);
  });


  test.skip('Images have correct CSS classes applied', async ({ page }) => {
    // SKIPPED: Partner logos removed from news cards in redesign
    // Check PROOF logo has correct class
    await expect(homePage.proofLogo).toHaveClass(/image-proof/);

    // Check AssureDefi logo has correct class
    await expect(homePage.assureDefiLogo).toHaveClass(/image-assure/);

    // Check BFG logo has correct class
    await expect(homePage.bfgLogo).toHaveClass(/image-bfg/);
  });

});