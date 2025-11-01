import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Comprehensive Asset Check', () => {
  test('should find all broken images including background-images', async ({ page }) => {
    const brokenAssets = [];
    const checkedUrls = new Set();
    
    // Listen for failed network requests
    page.on('response', response => {
      const url = response.url();
      if (!checkedUrls.has(url)) {
        checkedUrls.add(url);
        if (response.status() === 404) {
          brokenAssets.push({
            url: url,
            status: response.status(),
            type: 'network-request'
          });
        }
      }
    });

    // Navigate to homepage
    await page.goto('/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Trigger dropdown menus to load their background images
    const dropdowns = await page.$$('[data-hover="true"]');
    for (const dropdown of dropdowns) {
      try {
        await dropdown.hover();
        await page.waitForTimeout(500);
      } catch (e) {
        // Dropdown might not be visible
      }
    }

    // Scroll to trigger lazy-loaded images
    await page.evaluate(() => {
      return new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            window.scrollTo(0, 0);
            resolve();
          }
        }, 100);
      });
    });

    // Check all elements with background-image styles
    const elementsWithBgImages = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const bgImages = [];
      
      elements.forEach(element => {
        const style = window.getComputedStyle(element);
        const bgImage = style.backgroundImage;
        
        if (bgImage && bgImage !== 'none') {
          // Extract URL from background-image: url("...") 
          const matches = bgImage.match(/url\(["']?([^"'\)]+)["']?\)/);
          if (matches && matches[1]) {
            const url = matches[1];
            // Convert relative to absolute URL
            const absoluteUrl = new URL(url, window.location.href).href;
            bgImages.push({
              url: absoluteUrl,
              element: element.tagName + (element.className ? '.' + element.className.split(' ')[0] : '')
            });
          }
        }
      });
      
      return bgImages;
    });

    // Check each background image URL
    for (const bgImage of elementsWithBgImages) {
      if (!checkedUrls.has(bgImage.url)) {
        checkedUrls.add(bgImage.url);
        const response = await page.request.get(bgImage.url).catch(() => null);
        if (!response || response.status() === 404) {
          brokenAssets.push({
            url: bgImage.url,
            status: response ? response.status() : 'Failed',
            type: 'background-image',
            element: bgImage.element
          });
        }
      }
    }

    // Check all <img> tags
    const imgResults = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.map(img => ({
        src: img.src,
        alt: img.alt,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayed: img.offsetParent !== null
      }));
    });

    // Find broken images
    imgResults.forEach(img => {
      if (img.displayed && img.naturalWidth === 0) {
        if (!brokenAssets.find(a => a.url === img.src)) {
          brokenAssets.push({
            url: img.src,
            status: 404,
            type: 'img-tag',
            alt: img.alt
          });
        }
      }
    });

    // Report findings
    if (brokenAssets.length > 0) {
      console.log('\n=== Broken Assets Found ==="');
      console.log('\nNetwork Requests (404s):');
      brokenAssets.filter(a => a.type === 'network-request').forEach(asset => {
        console.log(`  - ${asset.url}`);
      });
      
      console.log('\nBackground Images (404s):');
      brokenAssets.filter(a => a.type === 'background-image').forEach(asset => {
        console.log(`  - ${asset.url}`);
        console.log(`    Element: ${asset.element}`);
      });
      
      console.log('\nBroken <img> tags:');
      brokenAssets.filter(a => a.type === 'img-tag').forEach(asset => {
        console.log(`  - ${asset.url}`);
        if (asset.alt) console.log(`    Alt: ${asset.alt}`);
      });
      
      console.log(`\nTotal broken assets: ${brokenAssets.length}`);
      
      // Save report
      const report = {
        timestamp: new Date().toISOString(),
        brokenAssets: brokenAssets,
        totalChecked: checkedUrls.size
      };
      
      fs.writeFileSync(
        path.join(process.cwd(), 'broken-assets-report.json'),
        JSON.stringify(report, null, 2)
      );
      console.log('\nDetailed report saved to broken-assets-report.json');
    } else {
      console.log('\n✅ All assets loading correctly! No 404s found.');
    }

    // Test passes if no broken assets
    expect(brokenAssets.length).toBe(0);
  });
});