#!/usr/bin/env node

/**
 * X Bot Screenshot Capture Tool
 *
 * Captures a screenshot of the xbot.ninja leaderboards section
 * for use in weekly Twitter posts highlighting top performers.
 *
 * The screenshot includes:
 * - Top X Accounts leaderboard
 * - Top Cashtags leaderboard
 *
 * Optimized for Twitter image specifications:
 * - 1200x675px (16:9 aspect ratio)
 * - High quality for social media sharing
 */

import playwright from 'playwright';
import fs from 'fs';
import path from 'path';

/**
 * Capture screenshot of xbot.ninja leaderboards
 * @param {string} outputPath - Where to save the screenshot
 * @param {Object} options - Screenshot options
 * @param {boolean} options.fullPage - Capture full page (default: false, captures specific section)
 * @param {Object} options.clip - Specific area to capture {x, y, width, height}
 * @returns {Promise<string>} Path to saved screenshot
 */
async function captureXBotScreenshot(outputPath, options = {}) {
  console.log('📸 X Bot Screenshot Capture\n');

  const browser = await playwright.chromium.launch({
    headless: true
  });

  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  try {
    console.log('📂 Navigating to https://xbot.ninja...');
    await page.goto('https://xbot.ninja', {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    console.log('⏳ Waiting for dynamic content to load...');

    // Wait for account list to load
    const accountXPath = '/html/body/main/div/section[3]/div[2]/div[3]/div/div[2]/div[2]/div[1]/div[1]/div[1]';
    await page.waitForSelector(`xpath=${accountXPath}`, { timeout: 30000 });
    console.log('   ✅ Account list loaded');

    // Click the cashtags tab to trigger loading
    console.log('   Clicking cashtags tab...');
    const cashtagsTabButton = await page.$('button[data-tab="cashtags"]');
    if (cashtagsTabButton) {
      await cashtagsTabButton.click();
      console.log('   ✅ Cashtags tab clicked');
    }

    // Wait for cashtagsList to unhide and have content
    await page.waitForFunction(() => {
      const cashtagsEl = document.getElementById('cashtagsList');
      return cashtagsEl && !cashtagsEl.classList.contains('hidden') && cashtagsEl.children.length > 0;
    }, { timeout: 30000 });
    console.log('   ✅ Cashtags list loaded');

    // Additional buffer for animations and rendering
    await page.waitForTimeout(3000);

    console.log('📸 Capturing screenshot...');

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Take screenshot
    const screenshotOptions = {
      path: outputPath,
      type: 'png',
      ...options
    };

    // If no specific clip is provided, capture the leaderboards section
    if (!options.clip && !options.fullPage) {
      // Get the leaderboards section bounding box
      const leaderboardsSection = await page.$('xpath=/html/body/main/div/section[3]');

      if (leaderboardsSection) {
        const boundingBox = await leaderboardsSection.boundingBox();

        if (boundingBox) {
          console.log(`   Leaderboards section: ${Math.round(boundingBox.width)}x${Math.round(boundingBox.height)}px at (${Math.round(boundingBox.x)}, ${Math.round(boundingBox.y)})`);

          screenshotOptions.clip = {
            x: boundingBox.x,
            y: boundingBox.y,
            width: boundingBox.width,
            height: boundingBox.height
          };
        }
      }
    }

    await page.screenshot(screenshotOptions);

    const fileStats = fs.statSync(outputPath);
    const fileSizeKB = (fileStats.size / 1024).toFixed(2);

    console.log(`✅ Screenshot saved to: ${outputPath}`);
    console.log(`   File size: ${fileSizeKB} KB`);

    return outputPath;

  } catch (error) {
    console.error('\n❌ Screenshot capture failed:', error.message);
    throw error;
  } finally {
    await browser.close();
    console.log('\n🔒 Browser closed.');
  }
}

/**
 * Capture optimized screenshot for Twitter - Accounts Leaderboard View
 * Captures the full leaderboards section showing Top X Accounts
 * @param {string} outputPath - Where to save the screenshot
 * @returns {Promise<string>} Path to saved screenshot
 */
async function captureXBotScreenshotForTwitter(outputPath) {
  console.log('🐦 Capturing X Bot Accounts Leaderboard for Twitter...\n');

  const browser = await playwright.chromium.launch({
    headless: true
  });

  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  try {
    console.log('📂 Navigating to https://xbot.ninja...');
    await page.goto('https://xbot.ninja', {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    console.log('⏳ Waiting for accounts to load...');

    // Wait for account list to load
    const accountXPath = '/html/body/main/div/section[3]/div[2]/div[3]/div/div[2]/div[2]/div[1]/div[1]/div[1]';
    await page.waitForSelector(`xpath=${accountXPath}`, { timeout: 30000 });
    console.log('   ✅ Accounts loaded');

    // Wait for full render
    await page.waitForTimeout(3000);

    // Scroll to leaderboards section
    await page.evaluate(() => {
      const xpath = '/html/body/main/div/section[3]';
      const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      const section = result.singleNodeValue;
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    await page.waitForTimeout(2000);

    console.log('📸 Capturing leaderboards section...');

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Get the leaderboards section bounding box
    const leaderboardsSection = await page.$('xpath=/html/body/main/div/section[3]');

    let screenshotOptions = {
      path: outputPath,
      type: 'png'
    };

    if (leaderboardsSection) {
      const boundingBox = await leaderboardsSection.boundingBox();
      if (boundingBox) {
        console.log(`   Leaderboards section: ${Math.round(boundingBox.width)}x${Math.round(boundingBox.height)}px`);

        screenshotOptions.clip = {
          x: boundingBox.x,
          y: boundingBox.y,
          width: boundingBox.width,
          height: boundingBox.height
        };
      }
    }

    await page.screenshot(screenshotOptions);

    const fileStats = fs.statSync(outputPath);
    const fileSizeKB = (fileStats.size / 1024).toFixed(2);

    console.log(`✅ Screenshot saved to: ${outputPath}`);
    console.log(`   File size: ${fileSizeKB} KB`);

    return outputPath;

  } catch (error) {
    console.error('\n❌ Screenshot capture failed:', error.message);
    throw error;
  } finally {
    await browser.close();
    console.log('\n🔒 Browser closed.');
  }
}

// If run directly (not imported), execute screenshot capture
if (import.meta.url === `file://${process.argv[1]}`) {
  const outputPath = process.argv[2] || path.join(process.cwd(), 'xbot-leaderboard.png');
  const useTwitterOptimized = process.argv.includes('--twitter');

  const captureFunction = useTwitterOptimized
    ? captureXBotScreenshotForTwitter
    : captureXBotScreenshot;

  captureFunction(outputPath)
    .then(savedPath => {
      console.log(`\n✅ Screenshot successfully saved to: ${savedPath}`);
      process.exit(0);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { captureXBotScreenshot, captureXBotScreenshotForTwitter };
export default captureXBotScreenshot;
