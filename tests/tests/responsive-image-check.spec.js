import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4321';

const INDUSTRY_PAGES = [
  'financial-services',
  'content-creation',
  'esg',
  'legal',
  'retail',
  'supply-chain'
];

const VIEWPORT_SIZES = [
  { width: 375, height: 667, name: 'mobile' },    // iPhone SE
  { width: 768, height: 1024, name: 'tablet' },   // iPad
  { width: 1440, height: 900, name: 'desktop' },  // Desktop
  { width: 1920, height: 1080, name: 'large' }    // Large desktop
];

test.describe('Responsive Image Validation', () => {
  for (const viewportSize of VIEWPORT_SIZES) {
    test(`should load all images correctly at ${viewportSize.name} (${viewportSize.width}x${viewportSize.height})`, async ({ page }) => {
      // Set viewport size
      await page.setViewportSize({ width: viewportSize.width, height: viewportSize.height });

      const failedImages = [];
      const allImageRequests = [];

      // Monitor network requests
      page.on('response', response => {
        const url = response.url();
        if (url.includes('/assets/images/') && /\.(jpg|png|gif|webp|svg)$/i.test(url)) {
          allImageRequests.push({
            url,
            status: response.status(),
            ok: response.ok()
          });
        }
      });

      for (const pageName of INDUSTRY_PAGES) {
        const pageUrl = `${BASE_URL}/industry-content/${pageName}`;

        console.log(`\n🔍 Testing ${pageName} at ${viewportSize.name} (${viewportSize.width}x${viewportSize.height})`);

        // Navigate to page
        await page.goto(pageUrl, { waitUntil: 'networkidle' });

        // Get all images on the page
        const images = await page.locator('img').all();

        console.log(`   Found ${images.length} img elements`);

        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          const src = await img.getAttribute('src');
          const srcset = await img.getAttribute('srcset');

          if (src) {
            // Test main src
            const response = await page.request.get(src);
            if (!response.ok()) {
              failedImages.push({
                page: pageName,
                viewport: `${viewportSize.name} (${viewportSize.width}x${viewportSize.height})`,
                type: 'main-src',
                url: src,
                status: response.status()
              });
              console.log(`   ❌ Main image failed: ${src} (${response.status()})`);
            } else {
              console.log(`   ✅ Main image OK: ${src.split('/').pop()}`);
            }
          }

          if (srcset) {
            // Test srcset images
            const srcsetUrls = srcset.split(',').map(s => s.trim().split(/\s+/)[0]);

            for (const srcsetUrl of srcsetUrls) {
              if (srcsetUrl && srcsetUrl.startsWith('/')) {
                const response = await page.request.get(srcsetUrl);
                if (!response.ok()) {
                  failedImages.push({
                    page: pageName,
                    viewport: `${viewportSize.name} (${viewportSize.width}x${viewportSize.height})`,
                    type: 'srcset',
                    url: srcsetUrl,
                    status: response.status()
                  });
                  console.log(`   ❌ Srcset image failed: ${srcsetUrl} (${response.status()})`);
                } else {
                  console.log(`   ✅ Srcset image OK: ${srcsetUrl.split('/').pop()}`);
                }
              }
            }
          }
        }

        // Check background images
        const elementsWithBg = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll('*'));
          return elements
            .map(el => {
              const style = window.getComputedStyle(el);
              const bgImage = style.backgroundImage;
              if (bgImage && bgImage !== 'none' && bgImage.includes('url(')) {
                const matches = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
                return matches ? matches[1] : null;
              }
              return null;
            })
            .filter(url => url && url.startsWith('/assets/images/'));
        });

        for (const bgUrl of elementsWithBg) {
          const response = await page.request.get(bgUrl);
          if (!response.ok()) {
            failedImages.push({
              page: pageName,
              viewport: `${viewportSize.name} (${viewportSize.width}x${viewportSize.height})`,
              type: 'background',
              url: bgUrl,
              status: response.status()
            });
            console.log(`   ❌ Background image failed: ${bgUrl} (${response.status()})`);
          } else {
            console.log(`   ✅ Background image OK: ${bgUrl.split('/').pop()}`);
          }
        }
      }

      // Report results
      if (failedImages.length > 0) {
        console.log(`\n❌ FAILED IMAGES AT ${viewportSize.name.toUpperCase()}:`);
        console.log('='.repeat(60));

        const groupedByPage = failedImages.reduce((acc, img) => {
          if (!acc[img.page]) acc[img.page] = [];
          acc[img.page].push(img);
          return acc;
        }, {});

        Object.entries(groupedByPage).forEach(([page, images]) => {
          console.log(`\n${page}:`);
          images.forEach(img => {
            console.log(`  ${img.type}: ${img.url} (${img.status})`);
          });
        });

        console.log(`\nTotal failed images: ${failedImages.length}`);
      }

      // Assertions
      expect(failedImages.length,
        `Found ${failedImages.length} broken images at ${viewportSize.name} (${viewportSize.width}x${viewportSize.height}):\n${
          failedImages.map(img => `  - ${img.page}: ${img.url} (${img.status})`).join('\n')
        }`
      ).toBe(0);
    });
  }
});