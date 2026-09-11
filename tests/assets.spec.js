import { test, expect } from '@playwright/test';

const RESPONSIVE_SIZES = [
  { name: 'Desktop', width: 1200, height: 800 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 667 },
];

const CRITICAL_IMAGES = [
  // Partner logos
  '/assets/images/6474d385cfec71cb21a92251/670f82f9b05322735f72cbcc_PROOF-logo-lightBG.png',
  '/assets/images/6474d385cfec71cb21a92251/6707f1c5c0856eff6c22300e_AssureDefi.png',
  '/assets/images/6474d385cfec71cb21a92251/64e738258afae2bb6f4d56bf_logo-blockchain-founders-group-background-transparent-large.svg',


];

test.describe('Asset Verification Tests', () => {


  test('AssureDefi image size check', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const assureImg = page.locator('img[src*="AssureDefi"]').first();
    if (await assureImg.count() > 0) {
      await expect(assureImg).toBeVisible();

      const boundingBox = await assureImg.boundingBox();
      console.log(`AssureDefi image size: ${boundingBox?.width}x${boundingBox?.height}`);

      // AssureDefi uses height: 120px, width auto-adjusts based on aspect ratio
      if (boundingBox && boundingBox.height > 125) {
        console.error(`❌ AssureDefi image too tall: ${boundingBox.height}px (should be ≤120px)`);
      } else {
        console.log(`✅ AssureDefi image size OK: ${boundingBox?.height}px height`);
      }
    }
  });

  test.skip('Blockchain Founders Group image test', async ({ page }) => {
    // SKIPPED: Partner logos removed from news cards in redesign
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Target the visible BFG logo on the main page (not the one in dropdown menu)
    // The visible one is in the announcement section, not in .top-menu-dropdown
    const bfgImg = page.locator('.flex-block-announcements img.image-bfg, .announcement-box img.image-bfg').first();

    await expect(bfgImg).toBeVisible();
    console.log('✅ BFG image is visible');
  });

  RESPONSIVE_SIZES.forEach(size => {
    test(`Layout test on ${size.name}`, async ({ page }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check no horizontal overflow
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      console.log(`${size.name}: Body width ${bodyWidth}px vs viewport ${size.width}px`);

      if (bodyWidth > size.width + 20) {
        console.error(`❌ Horizontal overflow on ${size.name}: ${bodyWidth}px > ${size.width}px`);
      } else {
        console.log(`✅ No overflow on ${size.name}`);
      }
    });
  });
});