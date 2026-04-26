import { test, devices } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// Define all pages to snapshot
const pages = [
  // Main pages
  { name: 'index', path: '/', category: 'main' },
  { name: 'about', path: '/about', category: 'main' },
  { name: 'contact-us', path: '/contact-us', category: 'main' },
  { name: 'industries', path: '/industries', category: 'main' },
  { name: 'resources', path: '/resources', category: 'main' },
  { name: 'white-paper', path: '/white-paper', category: 'main' },
  { name: 'legal-notice', path: '/legal-notice', category: 'main' },
  { name: 'privacy-policy', path: '/privacy-policy', category: 'main' },

  // Industry content pages
  { name: 'content-creation', path: '/industry-content/content-creation', category: 'industry-content' },
  { name: 'esg', path: '/industry-content/esg', category: 'industry-content' },
  { name: 'financial-services', path: '/industry-content/financial-services', category: 'industry-content' },
  { name: 'legal', path: '/industry-content/legal', category: 'industry-content' },
  { name: 'retail', path: '/industry-content/retail', category: 'industry-content' },
  { name: 'supply-chain', path: '/industry-content/supply-chain', category: 'industry-content' },

  // Marketplace pages
  { name: 'blockchain-badges', path: '/marketplace/blockchain-badges', category: 'marketplace' },
  { name: 'blockchain-database', path: '/marketplace/blockchain-database', category: 'marketplace' },
  { name: 'ipfs-upload', path: '/marketplace/ipfs-upload', category: 'marketplace' },
  { name: 'nft-zeroknowledge', path: '/marketplace/nft-zeroknwoledge', category: 'marketplace' },
  { name: 'telegram-xbot', path: '/marketplace/telegram-xbot', category: 'marketplace' },

  // Article pages
  { name: 'article-x-bot', path: '/articles/x-bot-2025-10-20', category: 'articles' },
  { name: 'article-blockchain-badges', path: '/articles/blockchain-badges-2025-10-20', category: 'articles' },
];

// Define viewports to test
const viewports = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'iphone-se', ...devices['iPhone SE'].viewport },
  { name: 'iphone-12-pro', ...devices['iPhone 12 Pro'].viewport },
  { name: 'pixel-5', ...devices['Pixel 5'].viewport },
];

// Output directory relative to project root
const SCREENSHOTS_BASE_DIR = path.join('..', 'docs', 'screenshots');

test.describe('Visual Snapshots for All Pages', () => {
  test.setTimeout(120000); // 2 minutes per test

  for (const pageInfo of pages) {
    for (const viewport of viewports) {
      test(`${pageInfo.name} - ${viewport.name}`, async ({ page }) => {
        // Set viewport
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height
        });

        // Navigate to page
        await page.goto(pageInfo.path);

        // Wait for page to be fully loaded
        await page.waitForLoadState('networkidle');

        // Homepage-specific handling to address carousel and complex content
        if (pageInfo.name === 'index') {
          // Wait for Swiper carousel to initialize
          await page.waitForSelector('.swiper-initialized', { timeout: 10000 }).catch(() => {
            console.log('⚠ Swiper carousel not found, continuing...');
          });

          // Wait for all images to load
          await page.evaluate(async () => {
            const images = Array.from(document.querySelectorAll('img'));
            await Promise.all(
              images.map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise((resolve) => {
                  img.addEventListener('load', resolve);
                  img.addEventListener('error', resolve); // Continue even if image fails
                  // Timeout after 5 seconds per image
                  setTimeout(resolve, 5000);
                });
              })
            );
          });

          // Disable carousel autoplay to reduce GPU load during screenshot
          await page.evaluate(() => {
            const swipers = document.querySelectorAll('.swiper');
            swipers.forEach(swiperEl => {
              // @ts-ignore - Swiper instance attached to element
              if (swiperEl.swiper && swiperEl.swiper.autoplay) {
                swiperEl.swiper.autoplay.stop();
              }
            });
          }).catch(() => {
            console.log('⚠ Could not stop carousel autoplay');
          });

          // Additional wait for animations to complete
          await page.waitForTimeout(2000);

          // Scroll to trigger any lazy-loaded content
          await page.evaluate(async () => {
            const scrollHeight = document.body.scrollHeight;
            const viewportHeight = window.innerHeight;
            const scrollSteps = Math.ceil(scrollHeight / viewportHeight);

            for (let i = 0; i < scrollSteps; i++) {
              window.scrollTo(0, i * viewportHeight);
              await new Promise(resolve => setTimeout(resolve, 200));
            }

            // Scroll back to top
            window.scrollTo(0, 0);
            await new Promise(resolve => setTimeout(resolve, 500));
          });
        } else {
          // Standard wait for non-homepage pages
          await page.waitForTimeout(1000);
        }

        // Create directory structure if it doesn't exist
        const screenshotDir = path.join(SCREENSHOTS_BASE_DIR, pageInfo.category, pageInfo.name);
        if (!fs.existsSync(screenshotDir)) {
          fs.mkdirSync(screenshotDir, { recursive: true });
        }

        // Take full-page screenshot
        const screenshotPath = path.join(
          screenshotDir,
          `${viewport.name}.png`
        );

        // For homepage mobile viewports, use clip-based approach to reduce GPU load
        const isHomepageMobile = pageInfo.name === 'index' && viewport.width < 768;

        if (isHomepageMobile) {
          // Get full page height
          const fullHeight = await page.evaluate(() => document.body.scrollHeight);
          const viewportHeight = viewport.height;

          // Take screenshot with a maximum height limit to avoid GPU crashes
          const maxHeight = Math.min(fullHeight, 15000); // Limit to 15000px to reduce memory usage

          await page.screenshot({
            path: screenshotPath,
            fullPage: false, // Don't use fullPage mode
            clip: {
              x: 0,
              y: 0,
              width: viewport.width,
              height: maxHeight
            }
          });

          if (fullHeight > maxHeight) {
            console.log(`⚠ ${pageInfo.name} at ${viewport.name}: Page height (${fullHeight}px) exceeds max (${maxHeight}px), screenshot truncated`);
          }
        } else {
          await page.screenshot({
            path: screenshotPath,
            fullPage: true,
          });
        }

        console.log(`✓ Captured: ${pageInfo.name} at ${viewport.name} → ${screenshotPath}`);
      });
    }
  }
});

// Summary test that logs completion
test.afterAll(async () => {
  const totalSnapshots = pages.length * viewports.length;
  console.log(`\n📸 Snapshot generation complete!`);
  console.log(`   Total pages: ${pages.length}`);
  console.log(`   Viewports per page: ${viewports.length}`);
  console.log(`   Total snapshots: ${totalSnapshots}`);
  console.log(`   Output directory: ${SCREENSHOTS_BASE_DIR}`);
});
