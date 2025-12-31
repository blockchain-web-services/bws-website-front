#!/usr/bin/env node

/**
 * X Bot Weekly Winners Post
 *
 * Automated weekly Twitter post highlighting top performers from xbot.ninja:
 * - #1 X Account (username and performance score)
 * - #1 Cashtag (hashtag and engagement)
 *
 * This script:
 * 1. Scrapes top performers from xbot.ninja
 * 2. Captures screenshot of leaderboards
 * 3. Posts tweet with screenshot attached
 *
 * Schedule: Runs every Monday at 10:00 AM UTC via GitHub Actions
 */

import path from 'path';
import fs from 'fs';
import scrapeXBotLeaderboards from '../utils/xbot-scraper.js';
import { captureXBotScreenshotForTwitter } from '../utils/xbot-screenshot.js';
import { postTweetWithSingleImage } from '../utils/twitter-image-post.js';

/**
 * Get date range for "last week"
 * @returns {string} Date range string (e.g., "Dec 23-30")
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

  // If same month: "Dec 23-30"
  // If different months: "Dec 25-Jan 1"
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}`;
  } else {
    return `${startMonth} ${startDay}-${endMonth} ${endDay}`;
  }
}

/**
 * Format tweet text for X Bot weekly winners
 * Enthusiastic tone highlighting the winner with product description
 *
 * @param {Object} data - Scraped leaderboard data
 * @param {Object} data.account - Top account info
 * @param {Object} data.cashtag - Top cashtag info
 * @returns {string} Formatted tweet text
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
 * Main execution function
 */
async function postXBotWeekly() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║         X BOT WEEKLY WINNERS - TWITTER POST              ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const tempDir = path.join(process.cwd(), 'temp');
  const screenshotPath = path.join(tempDir, `xbot-weekly-${timestamp}.png`);

  try {
    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Step 1: Scrape leaderboards
    console.log('STEP 1: Scraping X Bot Leaderboards');
    console.log('─'.repeat(60));
    const leaderboardData = await scrapeXBotLeaderboards();
    console.log('');

    // Step 2: Capture screenshot
    console.log('STEP 2: Capturing Screenshot');
    console.log('─'.repeat(60));
    await captureXBotScreenshotForTwitter(screenshotPath);
    console.log('');

    // Step 3: Format tweet text
    console.log('STEP 3: Formatting Tweet');
    console.log('─'.repeat(60));
    const tweetText = formatTweetText(leaderboardData);

    console.log('Tweet preview:');
    console.log('┌' + '─'.repeat(58) + '┐');
    tweetText.split('\n').forEach(line => {
      console.log(`│ ${line.padEnd(57)} │`);
    });
    console.log('└' + '─'.repeat(58) + '┘');
    console.log(`Character count: ${tweetText.length}/280\n`);

    if (tweetText.length > 280) {
      throw new Error(`Tweet exceeds 280 characters (${tweetText.length} chars)`);
    }

    // Step 4: Post tweet with image
    console.log('STEP 4: Posting to Twitter');
    console.log('─'.repeat(60));

    // Use @BWSCommunity account for posting (fallback = true)
    const result = await postTweetWithSingleImage(tweetText, screenshotPath, {
      useFallback: true  // Post from @BWSCommunity
    });

    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║                    ✅ SUCCESS!                            ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    console.log('📊 Weekly Post Summary:');
    console.log(`   Top Account: @${leaderboardData.account.username}`);
    console.log(`   Top Cashtag: ${leaderboardData.cashtag.cashtag}`);
    console.log(`   Tweet URL: ${result.tweetUrl}`);
    console.log(`   Account: @${result.accountName}`);
    console.log('');

    // Cleanup: Remove screenshot file
    if (fs.existsSync(screenshotPath)) {
      fs.unlinkSync(screenshotPath);
      console.log('🧹 Cleaned up temporary screenshot file');
    }

    return {
      success: true,
      leaderboardData,
      tweetId: result.tweetId,
      tweetUrl: result.tweetUrl,
      tweetText,
      screenshotPath
    };

  } catch (error) {
    console.error('');
    console.error('╔═══════════════════════════════════════════════════════════╗');
    console.error('║                    ❌ FAILURE!                            ║');
    console.error('╚═══════════════════════════════════════════════════════════╝\n');

    console.error('Error Details:');
    console.error(`   Message: ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
    console.error('');

    // Cleanup: Remove screenshot file if it exists
    if (fs.existsSync(screenshotPath)) {
      fs.unlinkSync(screenshotPath);
      console.log('🧹 Cleaned up temporary screenshot file');
    }

    throw error;
  }
}

// If run directly (not imported), execute the main function
if (import.meta.url === `file://${process.argv[1]}`) {
  postXBotWeekly()
    .then(result => {
      console.log('✅ X Bot weekly post completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ X Bot weekly post failed:', error.message);
      process.exit(1);
    });
}

export default postXBotWeekly;
