import { test, expect } from '@playwright/test';

test.describe('Image Visibility on Index Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the actual index page
    await page.goto('/', { waitUntil: 'networkidle' });

    // Wait for the page to fully load
    await page.waitForTimeout(2000);
  });

  test('PROOF Logo visibility and CSS', async ({ page }) => {
    const proofImg = page.locator('img[src*="PROOF-logo"]').first();

    // Check if image exists
    await expect(proofImg).toBeVisible({ timeout: 10000 });

    // Check natural dimensions (means image loaded)
    const dimensions = await proofImg.evaluate((img) => ({
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      displayWidth: img.clientWidth,
      displayHeight: img.clientHeight
    }));

    expect(dimensions.naturalWidth).toBeGreaterThan(0);
    expect(dimensions.naturalHeight).toBeGreaterThan(0);

    // Check computed styles
    const styles = await proofImg.evaluate((img) => {
      const computed = window.getComputedStyle(img);
      return {
        maxWidth: computed.maxWidth,
        display: computed.display,
        visibility: computed.visibility,
        opacity: computed.opacity
      };
    });

    expect(styles.visibility).toBe('visible');
    expect(parseFloat(styles.opacity)).toBeGreaterThan(0);
    expect(styles.display).not.toBe('none');

    // Check if max-width constraint is applied
    expect(styles.maxWidth).toContain('120px');

    console.log('PROOF Logo:', dimensions, styles);
  });

  test('AssureDefi Logo visibility and CSS', async ({ page }) => {
    const assureImg = page.locator('img[src*="AssureDefi"]').first();

    // Check if image exists and is visible
    await expect(assureImg).toBeVisible({ timeout: 10000 });

    // Check natural dimensions
    const dimensions = await assureImg.evaluate((img) => ({
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      displayWidth: img.clientWidth,
      displayHeight: img.clientHeight
    }));

    expect(dimensions.naturalWidth).toBeGreaterThan(0);
    expect(dimensions.naturalHeight).toBeGreaterThan(0);

    // Check computed styles
    const styles = await assureImg.evaluate((img) => {
      const computed = window.getComputedStyle(img);
      return {
        maxWidth: computed.maxWidth,
        height: computed.height,
        display: computed.display,
        visibility: computed.visibility,
        opacity: computed.opacity,
        objectFit: computed.objectFit
      };
    });

    expect(styles.visibility).toBe('visible');
    expect(parseFloat(styles.opacity)).toBeGreaterThan(0);
    expect(styles.display).not.toBe('none');

    // Check if size constraints are applied
    expect(styles.maxWidth).toContain('80px');
    expect(styles.height).toContain('40px');
    expect(styles.objectFit).toBe('contain');

    console.log('AssureDefi Logo:', dimensions, styles);
  });

  test('BFG Logo visibility and CSS', async ({ page }) => {
    const bfgImg = page.locator('img[src*="blockchain-founders-group"]').first();

    // Check if image exists
    await expect(bfgImg).toBeVisible({ timeout: 10000 });

    // Check dimensions and styles
    const dimensions = await bfgImg.evaluate((img) => ({
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      displayWidth: img.clientWidth,
      displayHeight: img.clientHeight
    }));

    // SVG images might not have naturalWidth/Height
    expect(dimensions.displayWidth).toBeGreaterThan(0);
    expect(dimensions.displayHeight).toBeGreaterThan(0);

    const styles = await bfgImg.evaluate((img) => {
      const computed = window.getComputedStyle(img);
      return {
        maxWidth: computed.maxWidth,
        display: computed.display,
        visibility: computed.visibility,
        opacity: computed.opacity
      };
    });

    expect(styles.visibility).toBe('visible');
    expect(parseFloat(styles.opacity)).toBeGreaterThan(0);
    expect(styles.maxWidth).toContain('150px');

    console.log('BFG Logo:', dimensions, styles);
  });

  test('Tokenomics Image visibility', async ({ page }) => {
    const tokenImg = page.locator('img[src*="Tokenomics"]').first();

    // Check if image exists
    const count = await tokenImg.count();
    if (count > 0) {
      await expect(tokenImg).toBeVisible({ timeout: 10000 });

      const dimensions = await tokenImg.evaluate((img) => ({
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayWidth: img.clientWidth,
        displayHeight: img.clientHeight
      }));

      expect(dimensions.naturalWidth).toBeGreaterThan(0);
      expect(dimensions.displayWidth).toBeGreaterThan(0);

      const styles = await tokenImg.evaluate((img) => {
        const computed = window.getComputedStyle(img);
        return {
          display: computed.display,
          visibility: computed.visibility,
          opacity: computed.opacity
        };
      });

      expect(styles.visibility).toBe('visible');
      expect(parseFloat(styles.opacity)).toBeGreaterThan(0);

      console.log('Tokenomics Image:', dimensions, styles);
    }
  });

  test('Check for CSS conflicts', async ({ page }) => {
    // Get all images and check for CSS conflicts
    const images = page.locator('img');
    const count = await images.count();

    console.log(`Total images on page: ${count}`);

    for (let i = 0; i < Math.min(count, 10); i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');

      if (src && (src.includes('AssureDefi') || src.includes('PROOF') || src.includes('blockchain-founders'))) {
        const conflicts = await img.evaluate((element) => {
          const computed = window.getComputedStyle(element);
          const inline = element.style;

          // Check if there are conflicting styles
          return {
            src: element.src,
            computedMaxWidth: computed.maxWidth,
            inlineMaxWidth: inline.maxWidth,
            computedDisplay: computed.display,
            computedVisibility: computed.visibility,
            computedOpacity: computed.opacity,
            hasConflict: computed.maxWidth === 'none' || computed.display === 'none' || computed.visibility === 'hidden' || computed.opacity === '0'
          };
        });

        if (conflicts.hasConflict) {
          console.log('CSS Conflict detected:', conflicts);
        }

        expect(conflicts.hasConflict).toBe(false);
      }
    }
  });

  test('Visual regression test - take screenshots', async ({ page }) => {
    // Take full page screenshot
    await page.screenshot({
      path: 'tests/screenshots/full-page.png',
      fullPage: true
    });

    // Take screenshots of specific image areas
    const proofImg = page.locator('img[src*="PROOF-logo"]').first();
    if (await proofImg.count() > 0) {
      await proofImg.screenshot({
        path: 'tests/screenshots/proof-logo.png'
      });
    }

    const assureImg = page.locator('img[src*="AssureDefi"]').first();
    if (await assureImg.count() > 0) {
      await assureImg.screenshot({
        path: 'tests/screenshots/assure-logo.png'
      });
    }

    console.log('Screenshots saved to tests/screenshots/');
  });

  test('Check image loading performance', async ({ page }) => {
    // Monitor image loading
    const imageLoadTimes = [];

    page.on('response', response => {
      const url = response.url();
      if (url.includes('/assets/images/')) {
        imageLoadTimes.push({
          url: url.substring(url.lastIndexOf('/') + 1),
          status: response.status(),
          size: response.headers()['content-length'] || 0
        });
      }
    });

    await page.reload({ waitUntil: 'networkidle' });

    // Check that all image responses are successful
    for (const img of imageLoadTimes) {
      expect(img.status).toBe(200);
      console.log(`Image ${img.url}: ${img.status} - Size: ${img.size}`);
    }
  });
});