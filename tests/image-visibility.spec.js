import { test, expect } from '@playwright/test';

test.describe('Image Visibility Tests', () => {

  test('Check AssureDefi image is visible and loads correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('Testing AssureDefi image visibility...');

    const assureImg = page.locator('img[src*="AssureDefi"]').first();

    // Check if image element exists
    const exists = await assureImg.count() > 0;
    console.log(`AssureDefi image element exists: ${exists}`);

    if (exists) {
      // Check if image is visible
      const visible = await assureImg.isVisible();
      console.log(`AssureDefi image is visible: ${visible}`);

      // Check if image loaded successfully
      const naturalWidth = await assureImg.evaluate((img) => img.naturalWidth);
      const naturalHeight = await assureImg.evaluate((img) => img.naturalHeight);
      console.log(`AssureDefi image dimensions: ${naturalWidth}x${naturalHeight}`);

      // Check computed size
      const boundingBox = await assureImg.boundingBox();
      console.log(`AssureDefi computed size: ${boundingBox?.width}x${boundingBox?.height}`);

      // Check for loading errors
      const complete = await assureImg.evaluate((img) => img.complete);
      console.log(`AssureDefi image complete: ${complete}`);

      // Get the actual src being used
      const actualSrc = await assureImg.getAttribute('src');
      console.log(`AssureDefi actual src: ${actualSrc}`);

      // Test if the image URL responds correctly
      const response = await page.request.get(actualSrc);
      console.log(`AssureDefi image HTTP status: ${response.status()}`);

      expect(naturalWidth).toBeGreaterThan(0);
      expect(visible).toBe(true);
    }
  });

  test('Check BFG image is visible and loads correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('Testing BFG image visibility...');

    // Target the visible BFG image in announcement section, not dropdown menu
    const bfgImg = page.locator('.flex-block-announcements img[src*="blockchain-founders-group"], .announcement-box img[src*="blockchain-founders-group"]').first();

    const exists = await bfgImg.count() > 0;
    console.log(`BFG image element exists: ${exists}`);

    if (exists) {
      const visible = await bfgImg.isVisible();
      console.log(`BFG image is visible: ${visible}`);

      const naturalWidth = await bfgImg.evaluate((img) => img.naturalWidth);
      const naturalHeight = await bfgImg.evaluate((img) => img.naturalHeight);
      console.log(`BFG image dimensions: ${naturalWidth}x${naturalHeight}`);

      const actualSrc = await bfgImg.getAttribute('src');
      console.log(`BFG actual src: ${actualSrc}`);

      const response = await page.request.get(actualSrc);
      console.log(`BFG image HTTP status: ${response.status()}`);

      expect(naturalWidth).toBeGreaterThan(0);
      expect(visible).toBe(true);
    }
  });


  test('Check all critical image HTTP responses', async ({ page }) => {
    const criticalImages = [
      '/assets/images/6474d385cfec71cb21a92251/670f82f9b05322735f72cbcc_PROOF-logo-lightBG.png',
      '/assets/images/6474d385cfec71cb21a92251/6707f1c5c0856eff6c22300e_AssureDefi.png',
      '/assets/images/6474d385cfec71cb21a92251/64e738258afae2bb6f4d56bf_logo-blockchain-founders-group-background-transparent-large.svg',
    ];

    console.log('Testing critical image HTTP responses...');

    for (const imageUrl of criticalImages) {
      console.log(`Testing: ${imageUrl}`);
      const response = await page.request.get(imageUrl);
      const status = response.status();
      console.log(`  Status: ${status}`);

      if (status !== 200) {
        console.error(`❌ Image failed to load: ${imageUrl} (Status: ${status})`);
      } else {
        const contentType = response.headers()['content-type'];
        console.log(`  ✅ Image loads successfully, Content-Type: ${contentType}`);
      }
    }
  });

  test.skip('Screenshot critical areas for manual inspection', async ({ page }) => {
    // SKIPPED: Partner logos section removed from news cards
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Screenshot the partner logos section
    const partnerSection = page.locator('.announcement-flex-logos').first();
    await partnerSection.screenshot({ path: 'test-results/partner-logos.png' });
    console.log('Partner logos screenshot saved to test-results/partner-logos.png');


  });
});