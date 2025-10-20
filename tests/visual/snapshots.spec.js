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
  { name: 'database-immutable', path: '/marketplace/database-immutable', category: 'marketplace' },
  { name: 'database-mutable', path: '/marketplace/database-mutable', category: 'marketplace' },
  { name: 'esg-credits', path: '/marketplace/esg-credits', category: 'marketplace' },
  { name: 'ipfs-upload', path: '/marketplace/ipfs-upload', category: 'marketplace' },
  { name: 'nft-gamecube', path: '/marketplace/nft-gamecube', category: 'marketplace' },
  { name: 'nft-zeroknowledge', path: '/marketplace/nft-zeroknwoledge', category: 'marketplace' },
  { name: 'telegram-xbot', path: '/marketplace/telegram-xbot', category: 'marketplace' },

  // Article pages
  { name: 'article-x-bot', path: '/articles/x-bot-2025-10-20', category: 'articles' },
  { name: 'article-blockchain-badges', path: '/articles/blockchain-badges-2025-10-20', category: 'articles' },
  { name: 'article-esg-credits', path: '/articles/esg-credits-2025-10-20', category: 'articles' },
  { name: 'article-fan-game-cube', path: '/articles/fan-game-cube-2025-10-20', category: 'articles' },
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

        // Additional wait for any animations or lazy-loaded content
        await page.waitForTimeout(1000);

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

        await page.screenshot({
          path: screenshotPath,
          fullPage: true,
        });

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
