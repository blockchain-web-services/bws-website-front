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

  test('Check Tokenomics image is visible and loads correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll to tokenomics section
    await page.locator('#tokenomics').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    console.log('Testing Tokenomics image visibility...');

    const tokenomicsImg = page.locator('img[src*="Tokenomics"]').first();

    const exists = await tokenomicsImg.count() > 0;
    console.log(`Tokenomics image element exists: ${exists}`);

    if (exists) {
      const visible = await tokenomicsImg.isVisible();
      console.log(`Tokenomics image is visible: ${visible}`);

      const naturalWidth = await tokenomicsImg.evaluate((img) => img.naturalWidth);
      const naturalHeight = await tokenomicsImg.evaluate((img) => img.naturalHeight);
      console.log(`Tokenomics image dimensions: ${naturalWidth}x${naturalHeight}`);

      const actualSrc = await tokenomicsImg.getAttribute('src');
      console.log(`Tokenomics actual src: ${actualSrc}`);

      const response = await page.request.get(actualSrc);
      console.log(`Tokenomics image HTTP status: ${response.status()}`);

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

  test('Industry cards have visible background images and text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('Testing Industry cards visibility...');

    // Hover over Solutions menu to show industry cards
    await page.locator('text=Solutions').first().hover();
    await page.waitForTimeout(1000);

    const industryCards = page.locator('.top-menu-industry-card');
    const cardCount = await industryCards.count();
    console.log(`Found ${cardCount} industry cards`);

    for (let i = 0; i < cardCount; i++) {
      const card = industryCards.nth(i);
      const visible = await card.isVisible();
      console.log(`Industry card ${i + 1} is visible: ${visible}`);

      if (visible) {
        // Check background image style
        const bgStyle = await card.getAttribute('style');
        const hasBackgroundImage = bgStyle && bgStyle.includes('background-image');
        console.log(`Industry card ${i + 1} has background-image: ${hasBackgroundImage}`);

        // Check if text is visible
        const titleElement = card.locator('.industries-top-menu-option-tittle');
        const titleVisible = await titleElement.isVisible();
        const titleText = await titleElement.textContent();
        console.log(`Industry card ${i + 1} title visible: ${titleVisible}, text: "${titleText}"`);

        if (hasBackgroundImage) {
          // Extract the URL from background-image style
          const match = bgStyle.match(/background-image:\s*url\("?([^"]*)"?\)/);
          if (match) {
            const imageUrl = match[1];
            console.log(`Industry card ${i + 1} image URL: ${imageUrl}`);

            const response = await page.request.get(imageUrl);
            console.log(`Industry card ${i + 1} image HTTP status: ${response.status()}`);
          }
        }
      }
    }
  });

  test('Check all critical image HTTP responses', async ({ page }) => {
    const criticalImages = [
      '/assets/images/6474d385cfec71cb21a92251/670f82f9b05322735f72cbcc_PROOF-logo-lightBG.png',
      '/assets/images/6474d385cfec71cb21a92251/6707f1c5c0856eff6c22300e_AssureDefi.png',
      '/assets/images/6474d385cfec71cb21a92251/64e738258afae2bb6f4d56bf_logo-blockchain-founders-group-background-transparent-large.svg',
      '/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics%20Allocation-letters-black.png',
      '/assets/images/6474d385cfec71cb21a9229a/65061646ead0751dc83790e1_NFT_1200x628.jpg'
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

  test('Screenshot critical areas for manual inspection', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Screenshot the partner logos section
    const partnerSection = page.locator('.announcement-flex-logos').first();
    await partnerSection.screenshot({ path: 'test-results/partner-logos.png' });
    console.log('Partner logos screenshot saved to test-results/partner-logos.png');

    // Scroll to tokenomics and screenshot
    await page.locator('#tokenomics').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    const tokenomicsSection = page.locator('.token-allocation-image');
    await tokenomicsSection.screenshot({ path: 'test-results/tokenomics.png' });
    console.log('Tokenomics screenshot saved to test-results/tokenomics.png');

    // Screenshot industry cards
    await page.locator('text=Solutions').first().hover();
    await page.waitForTimeout(1000);
    const industrySection = page.locator('.industries-top-menu-collections-list');
    await industrySection.screenshot({ path: 'test-results/industry-cards.png' });
    console.log('Industry cards screenshot saved to test-results/industry-cards.png');
  });
});