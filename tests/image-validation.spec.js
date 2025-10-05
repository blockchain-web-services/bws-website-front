import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  logImageLoadFailure,
  logCSSNotApplied,
  log404Error,
  logSizeConstraintViolation,
  formatBytes
} from './helpers/error-reporting.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve _site directory relative to project root, not test directory
const siteDir = path.join(__dirname, '..', '_site');

// Critical images to test
const criticalImages = [
  {
    name: 'PROOF Logo',
    url: '/assets/images/6474d385cfec71cb21a92251/670f82f9b05322735f72cbcc_PROOF-logo-lightBG.png',
    selector: 'img[src*="PROOF-logo"]',
    expectedClass: 'image-proof',
    maxWidth: '120px'
  },
  {
    name: 'AssureDefi Logo',
    url: '/assets/images/6474d385cfec71cb21a92251/6707f1c5c0856eff6c22300e_AssureDefi.png',
    selector: 'img[src*="AssureDefi"]',
    expectedClass: 'image-assure',
    maxWidth: '80px',
    height: '40px'
  },
  {
    name: 'BFG Logo',
    url: '/assets/images/6474d385cfec71cb21a92251/64e738258afae2bb6f4d56bf_logo-blockchain-founders-group-background-transparent-large.svg',
    selector: 'img.image-bfg', // Target visible main content logo, not dropdown menu
    expectedClass: 'image-bfg',
    maxWidth: '150px'
  },
  {
    name: 'Tokenomics Image',
    url: '/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics%20Allocation-letters-black.png',
    selector: 'img.image-token-allocation', // Target visible main content image, not dropdown
    expectedClass: 'image-token-allocation'
  }
];

test.describe('Image Files and CSS Validation', () => {
  test('Check image files exist in build directory', async () => {
    for (const image of criticalImages) {
      const imagePath = path.join(siteDir, image.url);
      const decodedPath = path.join(siteDir, decodeURIComponent(image.url));

      const exists = fs.existsSync(imagePath) || fs.existsSync(decodedPath);

      if (!exists) {
        console.error(`\n❌ ${image.name}: File missing`);
        console.error(`Expected path: ${imagePath}`);
        console.error(`Decoded path: ${decodedPath}`);
        console.error(`\nTo download missing file:`);
        console.error(`curl -o "_site${image.url}" "https://www.bws.ninja${image.url}"`);
        console.error(`\nTo verify directory structure:`);
        console.error(`ls -la "${path.dirname(imagePath)}"`);
      } else {
        const actualPath = fs.existsSync(imagePath) ? imagePath : decodedPath;
        const stats = fs.statSync(actualPath);
        console.log(`✅ ${image.name}: File exists (${formatBytes(stats.size)})`);
      }

      expect(exists).toBeTruthy();
    }
  });

  test('Check CSS classes are defined with proper rules', async () => {
    const cssPath = path.join(siteDir, 'styles.css');

    if (!fs.existsSync(cssPath)) {
      throw new Error('styles.css not found in _site directory');
    }

    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    const cssRules = {
      '.image-assure': {
        pattern: /\.image-assure\s*{[^}]*max-width:\s*80px\s*!important/,
        description: 'AssureDefi logo CSS with max-width: 80px !important'
      },
      '.image-proof': {
        pattern: /\.image-proof\s*{[^}]*max-width:\s*120px\s*!important/,
        description: 'PROOF logo CSS with max-width: 120px !important'
      },
      '.image-bfg': {
        pattern: /\.image-bfg\s*{[^}]*max-width:\s*150px\s*!important/,
        description: 'BFG logo CSS with max-width: 150px !important'
      }
    };

    for (const [selector, rule] of Object.entries(cssRules)) {
      const found = rule.pattern.test(cssContent);

      if (!found) {
        console.error(`\n❌ ${rule.description} - NOT FOUND`);
        console.error(`Expected pattern: ${rule.pattern}`);
        console.error(`\nSearching for ${selector} in CSS...`);

        // Find all instances of this selector
        const selectorRegex = new RegExp(`${selector.replace('.', '\\.')}\\s*{[^}]*}`, 'g');
        const matches = cssContent.match(selectorRegex) || [];

        if (matches.length > 0) {
          console.error(`Found ${matches.length} instance(s) of ${selector}:`);
          matches.forEach((match, i) => {
            console.error(`\n  Instance ${i + 1}:`);
            console.error(`  ${match}`);
          });
        } else {
          console.error(`${selector} not found anywhere in styles.css`);
        }

        console.error(`\nTo fix: Add this rule to public/styles.css:`);
        const maxWidth = rule.description.match(/(\d+px)/)?.[0] || '???px';
        console.error(`${selector} {`);
        console.error(`  max-width: ${maxWidth} !important;`);
        console.error(`}`);
      } else {
        console.log(`✅ ${rule.description}`);
      }

      // Check for conflicting rules
      const selectorRegex = new RegExp(`${selector.replace('.', '\\.')}\\s*{[^}]*}`, 'g');
      const matches = cssContent.match(selectorRegex) || [];

      for (const match of matches) {
        if (match.includes('max-width: none') || match.includes('max-width:none')) {
          console.error(`\n❌ CONFLICTING RULE FOUND for ${selector}:`);
          console.error(match);
          console.error('\nThis rule conflicts with the expected max-width constraint.');
          console.error('Remove "max-width: none" or ensure !important flag on correct rule.');
          throw new Error(`Conflicting max-width: none found for ${selector}`);
        }
      }

      expect(found).toBeTruthy();
    }
  });

  test('Check HTML for problematic attributes', async () => {
    const indexPath = path.join(siteDir, 'index.html');

    if (!fs.existsSync(indexPath)) {
      throw new Error('index.html not found in _site directory');
    }

    const htmlContent = fs.readFileSync(indexPath, 'utf-8');

    // Check for problematic srcset with missing files
    const srcsetRegex = /srcset="([^"]*)"/g;
    let match;

    while ((match = srcsetRegex.exec(htmlContent)) !== null) {
      const srcset = match[1];

      // Check for external CDN URLs
      if (srcset.includes('cdn.prod.website-files.com') || srcset.includes('https://')) {
        console.error('\n❌ External URL found in srcset attribute');
        console.error(`Srcset: ${srcset.substring(0, 150)}${srcset.length > 150 ? '...' : ''}`);
        console.error('\nExternal URLs should be downloaded and served locally.');
        console.error('Update the src/components/*.astro files to use local paths.');
        throw new Error(`External URL found in srcset: ${srcset.substring(0, 100)}...`);
      }

      // Check for non-existent variant files
      const variants = srcset.split(',').map(s => s.trim().split(' ')[0]);
      for (const variant of variants) {
        if (variant && !variant.startsWith('http')) {
          const variantPath = path.join(siteDir, variant);
          if (!fs.existsSync(variantPath)) {
            console.warn(`Warning: Missing srcset variant: ${variant}`);
          }
        }
      }
    }

    // Check for pixel-specific sizes attributes
    const sizesRegex = /sizes="([^"]*)"/g;
    while ((match = sizesRegex.exec(htmlContent)) !== null) {
      const sizes = match[1];
      if (sizes.match(/^\d+(\.\d+)?px$/)) {
        console.error('\n❌ Pixel-specific sizes attribute found');
        console.error(`Sizes attribute: "${sizes}"`);
        console.error('\nPixel-specific sizes prevent responsive image loading.');
        console.error('Use viewport-width units like "100vw" or media queries like "(max-width: 768px) 50vw"');
        console.error('Or remove the sizes attribute to let the browser decide.');
        throw new Error(`Pixel-specific sizes attribute found: sizes="${sizes}"`);
      }
    }

    // Check critical images for inline styles and fixed heights
    for (const image of criticalImages) {
      const imgRegex = new RegExp(`<img[^>]*${image.url.split('/').pop().split('.')[0]}[^>]*>`, 'gi');
      const imgMatches = htmlContent.match(imgRegex) || [];

      for (const imgTag of imgMatches) {
        // Check for inline styles
        if (imgTag.includes('style=')) {
          const styleMatch = imgTag.match(/style="([^"]*)"/);
          if (styleMatch) {
            console.error(`\n❌ ${image.name} has inline style attribute`);
            console.error(`Inline style: ${styleMatch[1]}`);
            console.error(`Image tag: ${imgTag.substring(0, 200)}${imgTag.length > 200 ? '...' : ''}`);
            console.error('\nInline styles override CSS and make maintenance difficult.');
            console.error('Remove the style attribute and use CSS classes instead.');
            console.error(`Check src/components/*.astro files and remove style="..." from ${image.name}`);
            throw new Error(`${image.name} has inline style: ${styleMatch[1]}`);
          }
        }

        // Check for fixed height attributes (except height="Auto")
        if (imgTag.includes('height=') && !imgTag.includes('height="Auto"')) {
          const heightMatch = imgTag.match(/height="([^"]*)"/);
          if (heightMatch) {
            console.error(`\n❌ ${image.name} has fixed height attribute`);
            console.error(`Height: ${heightMatch[1]}`);
            console.error(`Image tag: ${imgTag.substring(0, 200)}${imgTag.length > 200 ? '...' : ''}`);
            console.error('\nFixed height attributes prevent responsive scaling.');
            console.error('Remove height attribute or set to "Auto" and use CSS for sizing.');
            console.error(`Check src/components/*.astro files and fix height attribute on ${image.name}`);
            throw new Error(`${image.name} has fixed height: ${heightMatch[1]}`);
          }
        }

        // Verify correct CSS class
        if (image.expectedClass && !imgTag.includes(`class="${image.expectedClass}"`)) {
          console.warn(`\n⚠️ ${image.name} missing expected CSS class`);
          console.warn(`Expected class: ${image.expectedClass}`);
          console.warn(`Image tag: ${imgTag.substring(0, 200)}${imgTag.length > 200 ? '...' : ''}`);
          console.warn('\nWithout the correct class, CSS styles may not be applied.');
          console.warn(`Add class="${image.expectedClass}" to ${image.name} in src/components/*.astro`);
        }
      }
    }

    console.log('✅ HTML validation passed - no problematic attributes found');
  });
});

test.describe('Image Visibility on Live Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Increased timeout for CSS to fully parse and apply in headless Chrome
    // CI environments may need more time than local development
    await page.waitForTimeout(2000);

    // Verify CSS is loaded by checking if computed styles are available
    const cssLoaded = await page.evaluate(() => {
      const testImg = document.querySelector('img[src*="PROOF-logo"]');
      if (!testImg) return true; // Image not on page, skip check

      const computed = window.getComputedStyle(testImg);
      return computed.maxWidth !== 'none' && computed.maxWidth !== '';
    });

    if (!cssLoaded) {
      console.warn('⚠️ CSS may not be fully loaded, waiting additional time...');
      await page.waitForTimeout(2000);
    }
  });

  test('All critical images are visible and properly sized', async ({ page }, testInfo) => {
    for (const image of criticalImages) {
      const imgElement = page.locator(image.selector).first();

      // Check if image exists in DOM
      const count = await imgElement.count();

      if (count === 0) {
        console.error(`\n❌ ${image.name} not found in DOM`);
        console.error(`Selector: ${image.selector}`);
        console.error(`Expected URL: ${image.url}`);
        console.error('\nPossible causes:');
        console.error('1. Image not in HTML (check src/components/*.astro)');
        console.error('2. Incorrect selector (check actual HTML in _site/index.html)');
        console.error('3. Image removed during build');
        console.error('\nDebug command:');
        console.error(`grep -i "${image.name.split(' ')[0].toLowerCase()}" _site/index.html`);
      }

      expect(count).toBeGreaterThan(0);

      if (count > 0) {
        // Check visibility
        try {
          await expect(imgElement).toBeVisible({ timeout: 5000 });
        } catch (error) {
          const evaluation = await imgElement.evaluate((img) => {
            const computed = window.getComputedStyle(img);
            return {
              src: img.src,
              display: computed.display,
              visibility: computed.visibility,
              opacity: computed.opacity,
              position: computed.position,
              width: computed.width,
              height: computed.height
            };
          });

          console.error(`\n❌ ${image.name} not visible`);
          console.error(`Selector: ${image.selector}`);
          console.error(`Computed styles:`);
          console.error(`  display: ${evaluation.display}`);
          console.error(`  visibility: ${evaluation.visibility}`);
          console.error(`  opacity: ${evaluation.opacity}`);
          console.error(`  width: ${evaluation.width}`);
          console.error(`  height: ${evaluation.height}`);
          console.error(`  position: ${evaluation.position}`);
          console.error(`  src: ${evaluation.src}`);
          throw error;
        }

        // Check dimensions and computed styles
        const evaluation = await imgElement.evaluate((img, expectedClass) => {
          const computed = window.getComputedStyle(img);
          return {
            src: img.src,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            clientWidth: img.clientWidth,
            clientHeight: img.clientHeight,
            computedMaxWidth: computed.maxWidth,
            computedHeight: computed.height,
            computedDisplay: computed.display,
            computedVisibility: computed.visibility,
            computedOpacity: computed.opacity,
            inlineMaxWidth: img.style.maxWidth,
            hasClass: img.classList.contains(expectedClass),
            classList: Array.from(img.classList).join(', ')
          };
        }, image.expectedClass);

        // Verify image loaded (natural dimensions > 0 for non-SVG)
        if (!image.url.endsWith('.svg')) {
          if (evaluation.naturalWidth === 0 || evaluation.naturalHeight === 0) {
            logImageLoadFailure(testInfo, image.name, {
              url: image.url,
              selector: image.selector,
              count: 1,
              naturalWidth: evaluation.naturalWidth,
              naturalHeight: evaluation.naturalHeight,
              src: evaluation.src,
              status: 'Image failed to load (natural dimensions are 0)'
            });
          }
          expect(evaluation.naturalWidth).toBeGreaterThan(0);
          expect(evaluation.naturalHeight).toBeGreaterThan(0);
        }

        // Verify visible
        if (evaluation.computedVisibility !== 'visible') {
          console.error(`\n❌ ${image.name} has visibility: ${evaluation.computedVisibility}`);
          console.error(`Expected: visible`);
          console.error(`Check CSS for "visibility: hidden" rules`);
        }
        expect(evaluation.computedVisibility).toBe('visible');

        const opacity = parseFloat(evaluation.computedOpacity);
        if (opacity <= 0) {
          console.error(`\n❌ ${image.name} has opacity: ${evaluation.computedOpacity}`);
          console.error(`Expected: > 0`);
          console.error(`Check CSS for "opacity: 0" rules or animations`);
        }
        expect(opacity).toBeGreaterThan(0);

        if (evaluation.computedDisplay === 'none') {
          console.error(`\n❌ ${image.name} has display: none`);
          console.error(`Check CSS for "display: none" rules`);
        }
        expect(evaluation.computedDisplay).not.toBe('none');

        // Verify CSS constraints are applied
        if (image.maxWidth) {
          const expectedWidth = parseInt(image.maxWidth.replace('px', ''));
          const actualWidth = parseInt(evaluation.computedMaxWidth.replace('px', ''));

          if (isNaN(actualWidth) || actualWidth > expectedWidth) {
            logSizeConstraintViolation(testInfo, image.name, {
              selector: image.selector,
              constraint: 'maxWidth',
              expected: image.maxWidth,
              actual: evaluation.computedMaxWidth,
              clientWidth: evaluation.clientWidth,
              clientHeight: evaluation.clientHeight,
              naturalWidth: evaluation.naturalWidth,
              naturalHeight: evaluation.naturalHeight,
              computedMaxWidth: evaluation.computedMaxWidth,
              computedHeight: evaluation.computedHeight
            });
          }
          expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        }

        if (image.height) {
          const expectedHeight = parseInt(image.height.replace('px', ''));
          const actualHeight = parseInt(evaluation.computedHeight.replace('px', ''));

          if (isNaN(actualHeight) || actualHeight > expectedHeight) {
            logSizeConstraintViolation(testInfo, image.name, {
              selector: image.selector,
              constraint: 'height',
              expected: image.height,
              actual: evaluation.computedHeight,
              clientWidth: evaluation.clientWidth,
              clientHeight: evaluation.clientHeight,
              naturalWidth: evaluation.naturalWidth,
              naturalHeight: evaluation.naturalHeight,
              computedMaxWidth: evaluation.computedMaxWidth,
              computedHeight: evaluation.computedHeight
            });
          }
          expect(actualHeight).toBeLessThanOrEqual(expectedHeight);
        }

        // Verify CSS class
        if (image.expectedClass) {
          if (!evaluation.hasClass) {
            logCSSNotApplied(testInfo, image.name, {
              selector: image.selector,
              expectedClass: image.expectedClass,
              hasClass: false,
              expectedMaxWidth: image.maxWidth,
              actualMaxWidth: evaluation.computedMaxWidth,
              inlineMaxWidth: evaluation.inlineMaxWidth,
              clientWidth: evaluation.clientWidth,
              display: evaluation.computedDisplay,
              visibility: evaluation.computedVisibility,
              opacity: evaluation.computedOpacity
            });
            console.error(`Actual classes: ${evaluation.classList || 'NONE'}`);
          }
          expect(evaluation.hasClass).toBeTruthy();
        }

        console.log(`✅ ${image.name}: Visible with correct styles`);
        console.log(`   Dimensions: ${evaluation.clientWidth}x${evaluation.clientHeight}`);
        console.log(`   Max-width: ${evaluation.computedMaxWidth}`);
      }
    }
  });

  test('No 404 errors for images', async ({ page }, testInfo) => {
    const failed404s = [];

    page.on('response', response => {
      const url = response.url();
      if (url.includes('/assets/images/') && response.status() === 404) {
        failed404s.push({
          url,
          status: response.status(),
          type: response.request().resourceType()
        });
      }
    });

    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    if (failed404s.length > 0) {
      console.error('\n❌ 404 ERRORS DETECTED FOR IMAGES');
      console.error(`Total 404 errors: ${failed404s.length}\n`);

      failed404s.forEach((error, index) => {
        log404Error(testInfo, error.url, {
          page: page.url(),
          type: error.type,
          status: error.status
        });

        if (index < failed404s.length - 1) {
          console.error('\n' + '='.repeat(60));
        }
      });

      console.error('\n' + '='.repeat(60));
      console.error('SUMMARY: Fix these 404 errors by:');
      console.error('1. Downloading missing images from www.bws.ninja');
      console.error('2. Placing them in the correct _site/assets/images/ directories');
      console.error('3. Ensuring build process copies them correctly');

      throw new Error(`${failed404s.length} images returned 404 errors`);
    }

    console.log('✅ No 404 errors detected for images');
  });

  test('Take screenshots for visual verification', async ({ page }) => {
    const screenshotDir = 'tests/screenshots';

    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    // Full page screenshot
    await page.screenshot({
      path: path.join(screenshotDir, 'full-page.png'),
      fullPage: true
    });

    // Individual image screenshots
    for (const image of criticalImages) {
      const imgElement = page.locator(image.selector).first();
      if (await imgElement.count() > 0) {
        const fileName = image.name.toLowerCase().replace(/\s+/g, '-') + '.png';
        await imgElement.screenshot({
          path: path.join(screenshotDir, fileName)
        });
      }
    }

    console.log(`✅ Screenshots saved to ${screenshotDir}/`);
  });
});