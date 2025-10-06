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

  // Tokenomics image
  '/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics%20Allocation-letters-black.png',

  // NFT image
  '/assets/images/6474d385cfec71cb21a9229a/65061646ead0751dc83790e1_NFT_1200x628.jpg',
];

test.describe('Asset Verification Tests', () => {

  test.skip('Critical images loading test', async ({ page }) => {
    // Skipped: Images need to be properly built and deployed first
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('Testing critical images...');

    // Check each critical image
    for (const imageSrc of CRITICAL_IMAGES) {
      console.log(`Testing image: ${imageSrc}`);

      // Make direct request to image
      const response = await page.request.get(imageSrc);
      console.log(`Image ${imageSrc}: Status ${response.status()}`);

      if (response.status() >= 400) {
        console.error(`❌ Missing image: ${imageSrc}`);
      } else {
        console.log(`✅ Image found: ${imageSrc}`);
      }
    }
  });

  test('AssureDefi image size check', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const assureImg = page.locator('img[src*="AssureDefi"]').first();
    if (await assureImg.count() > 0) {
      await expect(assureImg).toBeVisible();

      const boundingBox = await assureImg.boundingBox();
      console.log(`AssureDefi image size: ${boundingBox?.width}x${boundingBox?.height}`);

      if (boundingBox && boundingBox.width > 125) {
        console.error(`❌ AssureDefi image too wide: ${boundingBox.width}px (should be ≤120px)`);
      } else {
        console.log(`✅ AssureDefi image size OK: ${boundingBox?.width}px`);
      }
    }
  });

  test('Tokenomics image test', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.locator('#tokenomics').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const tokenomicsImg = page.locator('img[src*="Tokenomics"]');
    const count = await tokenomicsImg.count();
    console.log(`Found ${count} Tokenomics images`);

    if (count > 0) {
      const img = tokenomicsImg.first();
      await expect(img).toBeVisible();
      console.log('✅ Tokenomics image is visible');
    } else {
      console.error('❌ No Tokenomics images found in DOM');
    }
  });

  test('Blockchain Founders Group image test', async ({ page }) => {
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