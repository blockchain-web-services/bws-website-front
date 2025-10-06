import { test, expect } from '@playwright/test';
import {
  logImageLoadFailure,
  logCSSNotApplied,
  logSizeConstraintViolation
} from './helpers/error-reporting.js';

test.describe('Image Visibility on Index Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the actual index page
    await page.goto('/', { waitUntil: 'networkidle' });

    // Wait for the page to fully load
    await page.waitForTimeout(2000);
  });

  test('PROOF Logo visibility and CSS', async ({ page }, testInfo) => {
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
    // Note: In headless Chrome, CSS may not always apply instantly
    console.log('PROOF Logo:', dimensions, styles);

    // Check max-width constraint
    if (!styles.maxWidth || styles.maxWidth === 'none' || !styles.maxWidth.includes('120px')) {
      logCSSNotApplied(testInfo, 'PROOF Logo', {
        selector: 'img[src*="PROOF-logo"]',
        expectedClass: 'image-proof',
        hasClass: true, // We don't check class here, just styles
        expectedMaxWidth: '120px',
        actualMaxWidth: styles.maxWidth,
        inlineMaxWidth: '', // Not checking inline styles in this test
        clientWidth: dimensions.displayWidth,
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity
      });
      console.error('\n⚠️ This is likely a CSS timing issue in headless Chrome.');
      console.error('If tests pass locally but fail in CI, increase waitForTimeout in beforeEach.');
    }
    expect(styles.maxWidth).toContain('120px');
  });

  test('AssureDefi Logo visibility and CSS', async ({ page }, testInfo) => {
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

    if (dimensions.naturalWidth === 0 || dimensions.naturalHeight === 0) {
      logImageLoadFailure(testInfo, 'AssureDefi Logo', {
        url: '/assets/images/.../AssureDefi.png',
        selector: 'img[src*="AssureDefi"]',
        count: 1,
        naturalWidth: dimensions.naturalWidth,
        naturalHeight: dimensions.naturalHeight,
        src: await assureImg.getAttribute('src'),
        status: 'Failed to load'
      });
    }
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
    if (!styles.maxWidth || !styles.maxWidth.includes('80px')) {
      logSizeConstraintViolation(testInfo, 'AssureDefi Logo', {
        selector: 'img[src*="AssureDefi"]',
        constraint: 'maxWidth',
        expected: '80px',
        actual: styles.maxWidth,
        clientWidth: dimensions.displayWidth,
        clientHeight: dimensions.displayHeight,
        naturalWidth: dimensions.naturalWidth,
        naturalHeight: dimensions.naturalHeight,
        computedMaxWidth: styles.maxWidth,
        computedHeight: styles.height,
        objectFit: styles.objectFit
      });
    }
    expect(styles.maxWidth).toContain('80px');

    if (!styles.height || !styles.height.includes('40px')) {
      logSizeConstraintViolation(testInfo, 'AssureDefi Logo', {
        selector: 'img[src*="AssureDefi"]',
        constraint: 'height',
        expected: '40px',
        actual: styles.height,
        clientWidth: dimensions.displayWidth,
        clientHeight: dimensions.displayHeight,
        naturalWidth: dimensions.naturalWidth,
        naturalHeight: dimensions.naturalHeight,
        computedMaxWidth: styles.maxWidth,
        computedHeight: styles.height,
        objectFit: styles.objectFit
      });
    }
    expect(styles.height).toContain('40px');
    expect(styles.objectFit).toBe('contain');

    console.log('AssureDefi Logo:', dimensions, styles);
  });

  test('BFG Logo visibility and CSS', async ({ page }, testInfo) => {
    // Target the .image-bfg class in main content, not the dropdown menu version
    // The visible one is in announcement section
    const bfgImg = page.locator('.flex-block-announcements img.image-bfg, .announcement-box img.image-bfg').first();

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
    if (dimensions.displayWidth === 0 || dimensions.displayHeight === 0) {
      console.error('\n❌ BFG Logo has zero display dimensions');
      console.error(`Display dimensions: ${dimensions.displayWidth}x${dimensions.displayHeight}`);
      console.error('This means the SVG is not rendering properly.');
    }
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

    if (!styles.maxWidth || !styles.maxWidth.includes('150px')) {
      logSizeConstraintViolation(testInfo, 'BFG Logo', {
        selector: 'img.image-bfg',
        constraint: 'maxWidth',
        expected: '150px',
        actual: styles.maxWidth,
        clientWidth: dimensions.displayWidth,
        clientHeight: dimensions.displayHeight,
        naturalWidth: dimensions.naturalWidth,
        naturalHeight: dimensions.naturalHeight,
        computedMaxWidth: styles.maxWidth,
        computedHeight: 'N/A (SVG)'
      });
    }
    expect(styles.maxWidth).toContain('150px');

    console.log('BFG Logo:', dimensions, styles);
  });

  test('Tokenomics Image visibility', async ({ page }, testInfo) => {
    // Target the visible main content image, not any dropdown/menu versions
    const tokenImg = page.locator('img.image-token-allocation').first();

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

      if (dimensions.naturalWidth === 0) {
        logImageLoadFailure(testInfo, 'Tokenomics Image', {
          url: '/assets/images/.../Tokenomics%20Allocation-letters-black.png',
          selector: 'img[src*="Tokenomics"]',
          count: 1,
          naturalWidth: dimensions.naturalWidth,
          naturalHeight: dimensions.naturalHeight,
          src: await tokenImg.getAttribute('src'),
          status: 'Failed to load'
        });
      }
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
    } else {
      console.warn('⚠️ Tokenomics Image not found on page - this is optional');
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
          console.error('\n❌ CSS CONFLICT DETECTED');
          console.error(`Image: ${conflicts.src}`);
          console.error(`Computed max-width: ${conflicts.computedMaxWidth}`);
          console.error(`Inline max-width: ${conflicts.inlineMaxWidth || 'NONE'}`);
          console.error(`Computed display: ${conflicts.computedDisplay}`);
          console.error(`Computed visibility: ${conflicts.computedVisibility}`);
          console.error(`Computed opacity: ${conflicts.computedOpacity}`);
          console.error('\nThis image has CSS properties that make it invisible or unrestricted.');
          console.error('Check for conflicting rules in public/styles.css.');
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

    page.on('response', async response => {
      const url = response.url();
      if (url.includes('/assets/images/')) {
        // Get timing from the request object, not response
        const timing = await response.request().timing();
        imageLoadTimes.push({
          url: url.substring(url.lastIndexOf('/') + 1),
          status: response.status(),
          timing: timing
        });
      }
    });

    await page.reload({ waitUntil: 'networkidle' });

    // Check that all image responses are successful
    for (const img of imageLoadTimes) {
      if (img.status !== 200) {
        console.error(`\n❌ Image failed to load: ${img.url}`);
        console.error(`Status: ${img.status}`);
        console.error(`Load time: ${img.timing?.responseEnd || 'N/A'}ms`);
        if (img.status === 404) {
          console.error('\nThis is a 404 error. The image file is missing.');
          console.error(`Download from: https://www.bws.ninja/assets/images/.../${img.url}`);
        }
      } else {
        console.log(`✅ Image ${img.url}: ${img.status} - Load time: ${img.timing?.responseEnd}ms`);
      }
      expect(img.status).toBe(200);
    }
  });
});