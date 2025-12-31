#!/usr/bin/env node

/**
 * Test X Bot Weekly Post (Dry Run)
 *
 * Tests the complete X Bot weekly post workflow without posting to Twitter:
 * 1. Scrapes xbot.ninja leaderboards
 * 2. Captures screenshot
 * 3. Formats tweet text
 * 4. Validates everything is ready for posting
 *
 * This is a safe way to test the workflow end-to-end.
 */

import path from 'path';
import fs from 'fs';
import scrapeXBotLeaderboards from '../utils/xbot-scraper.js';
import { captureXBotScreenshotForTwitter } from '../utils/xbot-screenshot.js';

/**
 * Get date range for "last week"
 */
function getWeekDateRange() {
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const startMonth = monthNames[lastWeek.getMonth()];
  const endMonth = monthNames[today.getMonth()];
  const startDay = lastWeek.getDate();
  const endDay = today.getDate();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}`;
  } else {
    return `${startMonth} ${startDay}-${endMonth} ${endDay}`;
  }
}

/**
 * Format tweet text for X Bot weekly winners
 * Enthusiastic tone highlighting the winner with product description
 */
function formatTweetText(data) {
  const { account, cashtag } = data;
  const dateRange = getWeekDateRange();

  const username = account.username;
  const displayName = account.displayName;
  const cashtagSymbol = cashtag.cashtag;

  const tweet = `🎉 This week's X Bot champion!

🏆 @${username} (${displayName})
💎 Trending: ${cashtagSymbol}

Amazing performance! 🚀

X Bot tracks real KOL performance on X. We filter bot farms to show authentic influence metrics.

📊 https://xbot.ninja

$BWS @BWSCommunity #XBot`;

  return tweet;
}

/**
 * Main test function
 */
async function testXBotWeeklyPost() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║    X BOT WEEKLY WINNERS - DRY RUN TEST                   ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const tempDir = path.join(process.cwd(), 'temp');
  const screenshotPath = path.join(tempDir, `xbot-test-${timestamp}.png`);

  try {
    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Step 1: Scrape leaderboards
    console.log('TEST STEP 1: Scraping X Bot Leaderboards');
    console.log('─'.repeat(60));
    const leaderboardData = await scrapeXBotLeaderboards();
    console.log('');

    console.log('✅ Scraping successful!');
    console.log(`   Top Account: @${leaderboardData.account.username} (${leaderboardData.account.displayName})`);
    console.log(`   Top Cashtag: ${leaderboardData.cashtag.cashtag}`);
    console.log('');

    // Step 2: Capture screenshot
    console.log('TEST STEP 2: Capturing Screenshot');
    console.log('─'.repeat(60));
    await captureXBotScreenshotForTwitter(screenshotPath);
    console.log('');

    console.log('✅ Screenshot captured!');
    console.log(`   File: ${screenshotPath}`);

    const fileStats = fs.statSync(screenshotPath);
    const fileSizeMB = (fileStats.size / 1024 / 1024).toFixed(2);
    console.log(`   Size: ${fileSizeMB} MB`);
    console.log('');

    // Step 3: Format tweet text
    console.log('TEST STEP 3: Formatting Tweet');
    console.log('─'.repeat(60));
    const tweetText = formatTweetText(leaderboardData);

    console.log('Generated Tweet:');
    console.log('┌' + '─'.repeat(58) + '┐');
    tweetText.split('\n').forEach(line => {
      console.log(`│ ${line.padEnd(57)} │`);
    });
    console.log('└' + '─'.repeat(58) + '┘\n');

    console.log(`Character count: ${tweetText.length}/280`);

    if (tweetText.length > 280) {
      console.error('❌ VALIDATION FAILED: Tweet exceeds 280 characters!');
      return {
        success: false,
        error: 'Tweet too long',
        tweetLength: tweetText.length
      };
    }

    console.log('✅ Tweet length valid');
    console.log('');

    // Step 4: Summary
    console.log('TEST STEP 4: Validation Summary');
    console.log('─'.repeat(60));
    console.log('✅ All validations passed!');
    console.log('');
    console.log('Ready to post:');
    console.log(`   Account to use: @BWSCommunity`);
    console.log(`   Top Account: @${leaderboardData.account.username}`);
    console.log(`   Top Cashtag: ${leaderboardData.cashtag.cashtag}`);
    console.log(`   Screenshot: ${screenshotPath}`);
    console.log(`   Tweet length: ${tweetText.length} chars`);
    console.log('');

    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║                    ✅ DRY RUN SUCCESSFUL!                 ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    console.log('📋 Next Steps:');
    console.log('   1. Review the screenshot at: ' + screenshotPath);
    console.log('   2. Verify the tweet text above');
    console.log('   3. To post for real, run:');
    console.log('      node scripts/crawling/production/post-xbot-weekly.js');
    console.log('');

    return {
      success: true,
      leaderboardData,
      screenshotPath,
      tweetText,
      tweetLength: tweetText.length
    };

  } catch (error) {
    console.error('');
    console.error('╔═══════════════════════════════════════════════════════════╗');
    console.error('║                    ❌ DRY RUN FAILED!                     ║');
    console.error('╚═══════════════════════════════════════════════════════════╝\n');

    console.error('Error Details:');
    console.error(`   Message: ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
    console.error('');

    return {
      success: false,
      error: error.message,
      stack: error.stack
    };
  }
}

// Run the test
testXBotWeeklyPost()
  .then(result => {
    if (result.success) {
      console.log('✅ Test completed successfully');
      process.exit(0);
    } else {
      console.error('❌ Test failed:', result.error);
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
