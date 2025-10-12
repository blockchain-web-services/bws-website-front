/**
 * Playwright snapshot script for index page
 * Captures full page screenshot after CSS consolidation
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'http://localhost:4321';
const SCREENSHOT_PATH = join(__dirname, '../index-snapshot-after-consolidation.png');

async function captureSnapshot() {
  console.log('🎭 Launching Playwright...\n');

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  console.log(`📸 Navigating to ${BASE_URL}...`);

  try {
    await page.goto(BASE_URL, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    console.log('⏳ Waiting for page to stabilize...');

    // Wait for key elements to ensure page is fully loaded
    await page.waitForSelector('.hero-section', { timeout: 10000 });
    await page.waitForSelector('.news-carousel', { timeout: 10000 });

    // Wait a bit for any animations or carousel initialization
    await page.waitForTimeout(2000);

    console.log(`💾 Capturing full page screenshot to: ${SCREENSHOT_PATH}`);

    await page.screenshot({
      path: SCREENSHOT_PATH,
      fullPage: true
    });

    console.log('✅ Screenshot captured successfully!\n');

    // Get some page metrics
    const title = await page.title();
    const url = page.url();

    console.log('📊 Page Info:');
    console.log(`   Title: ${title}`);
    console.log(`   URL: ${url}`);
    console.log(`   Screenshot: ${SCREENSHOT_PATH}`);

  } catch (error) {
    console.error('❌ Error capturing screenshot:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the script
captureSnapshot().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
