import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const siteDir = '_site';

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
    selector: 'img[src*="blockchain-founders-group"]',
    expectedClass: 'image-bfg',
    maxWidth: '150px'
  },
  {
    name: 'Tokenomics Image',
    url: '/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png',
    selector: 'img[src*="Tokenomics"]',
    expectedClass: 'image-token-allocation'
  }
];

test.describe('Image Files and CSS Validation', () => {
  test('Check image files exist in build directory', async () => {
    for (const image of criticalImages) {
      const imagePath = path.join(siteDir, image.url);
      const decodedPath = path.join(siteDir, decodeURIComponent(image.url));

      const exists = fs.existsSync(imagePath) || fs.existsSync(decodedPath);
      expect(exists).toBeTruthy();

      if (exists) {
        console.log(`✅ ${image.name}: File exists`);
      } else {
        console.log(`❌ ${image.name}: File missing at ${imagePath}`);
      }
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
      expect(found).toBeTruthy();
      console.log(`${found ? '✅' : '❌'} ${rule.description}`);

      // Check for conflicting rules
      const selectorRegex = new RegExp(`${selector.replace('.', '\\.')}\\s*{[^}]*}`, 'g');
      const matches = cssContent.match(selectorRegex) || [];

      for (const match of matches) {
        if (match.includes('max-width: none') || match.includes('max-width:none')) {
          throw new Error(`Conflicting max-width: none found for ${selector}`);
        }
      }
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
            throw new Error(`${image.name} has inline style: ${styleMatch[1]}`);
          }
        }

        // Check for fixed height attributes (except height="Auto")
        if (imgTag.includes('height=') && !imgTag.includes('height="Auto"')) {
          const heightMatch = imgTag.match(/height="([^"]*)"/);
          if (heightMatch) {
            throw new Error(`${image.name} has fixed height: ${heightMatch[1]}`);
          }
        }

        // Verify correct CSS class
        if (image.expectedClass && !imgTag.includes(`class="${image.expectedClass}"`)) {
          console.warn(`Warning: ${image.name} missing expected class="${image.expectedClass}"`);
        }
      }
    }

    console.log('✅ HTML validation passed - no problematic attributes found');
  });
});

test.describe('Image Visibility on Live Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
  });

  test('All critical images are visible and properly sized', async ({ page }) => {
    for (const image of criticalImages) {
      const imgElement = page.locator(image.selector).first();

      // Check if image exists in DOM
      const count = await imgElement.count();
      expect(count).toBeGreaterThan(0);

      if (count > 0) {
        // Check visibility
        await expect(imgElement).toBeVisible({ timeout: 5000 });

        // Check dimensions and computed styles
        const evaluation = await imgElement.evaluate((img, expectedClass) => {
          const computed = window.getComputedStyle(img);
          return {
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            clientWidth: img.clientWidth,
            clientHeight: img.clientHeight,
            computedMaxWidth: computed.maxWidth,
            computedHeight: computed.height,
            computedDisplay: computed.display,
            computedVisibility: computed.visibility,
            computedOpacity: computed.opacity,
            hasClass: img.classList.contains(expectedClass)
          };
        }, image.expectedClass);

        // Verify image loaded (natural dimensions > 0 for non-SVG)
        if (!image.url.endsWith('.svg')) {
          expect(evaluation.naturalWidth).toBeGreaterThan(0);
          expect(evaluation.naturalHeight).toBeGreaterThan(0);
        }

        // Verify visible
        expect(evaluation.computedVisibility).toBe('visible');
        expect(parseFloat(evaluation.computedOpacity)).toBeGreaterThan(0);
        expect(evaluation.computedDisplay).not.toBe('none');

        // Verify CSS constraints are applied
        if (image.maxWidth) {
          const expectedWidth = parseInt(image.maxWidth.replace('px', ''));
          const actualWidth = parseInt(evaluation.computedMaxWidth.replace('px', ''));
          expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        }

        if (image.height) {
          const expectedHeight = parseInt(image.height.replace('px', ''));
          const actualHeight = parseInt(evaluation.computedHeight.replace('px', ''));
          expect(actualHeight).toBeLessThanOrEqual(expectedHeight);
        }

        // Verify CSS class
        if (image.expectedClass) {
          expect(evaluation.hasClass).toBeTruthy();
        }

        console.log(`✅ ${image.name}: Visible with correct styles`);
        console.log(`   Dimensions: ${evaluation.clientWidth}x${evaluation.clientHeight}`);
        console.log(`   Max-width: ${evaluation.computedMaxWidth}`);
      }
    }
  });

  test('No 404 errors for images', async ({ page }) => {
    const failed404s = [];

    page.on('response', response => {
      const url = response.url();
      if (url.includes('/assets/images/') && response.status() === 404) {
        failed404s.push(url);
      }
    });

    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    if (failed404s.length > 0) {
      console.error('❌ 404 errors detected for:');
      failed404s.forEach(url => console.error(`   - ${url}`));
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