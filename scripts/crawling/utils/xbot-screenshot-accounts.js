#!/usr/bin/env node

/**
 * Capture X Bot Accounts Leaderboard Screenshot
 *
 * Captures the Top X Accounts section (before clicking cashtags tab)
 */

import playwright from 'playwright';
import fs from 'fs';
import path from 'path';

async function captureAccountsLeaderboard(outputPath) {
  console.log('📸 X Bot Accounts Leaderboard Screenshot\n');

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

    console.log('📸 Capturing screenshot...');

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

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const outputPath = process.argv[2] || 'xbot-accounts-snapshot.png';

  captureAccountsLeaderboard(outputPath)
    .then(savedPath => {
      console.log(`\n✅ Screenshot saved to: ${savedPath}`);
      process.exit(0);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export default captureAccountsLeaderboard;
