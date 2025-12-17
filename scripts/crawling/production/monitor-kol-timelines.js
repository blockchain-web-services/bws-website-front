/**
 * Script 2.2.1: KOL Timeline Monitor
 * Monitors KOL timelines for high-engagement tweets
 * Saves selected tweets to engaging-posts.json for later reply processing
 */

// Load environment variables from .env file (local dev only, GitHub Actions uses secrets)
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __scriptsDir = path.dirname(__filename);
const worktreeRoot = path.resolve(__scriptsDir, '../../..');
dotenv.config({ path: path.join(worktreeRoot, '.env') });

import {
  loadConfig,
  loadKolsData,
  loadProcessedPosts,
  saveProcessedPosts,
  RateLimiter,
  getTodayDateString,
  hasRepliedRecentlyToKol,
  prioritizeKolsWithRandomization
} from '../utils/kol-utils.js';
import { generateMultipleRandomCrons } from '../utils/schedule-randomizer.js';
import { updateAndCommitSchedule, isGitHubActions } from '../utils/workflow-updater.js';
import fs from 'fs/promises';

const __dirname = __scriptsDir;
const ENGAGING_POSTS_PATH = path.join(__dirname, '../data/engaging-posts.json');

// HTML parsing and auth manager for tweet fetching
import { getUserTweetsWebUnblocker } from '../crawlers/twitter-crawler.js';
import authManager from '../utils/x-auth-manager.js';
import { sendMonitorNotification } from '../utils/zapier-webhook.js';
import { createClaudeClient, quickFilterTweetRelevance } from '../utils/claude-client.js';

/**
 * Load engaging posts
 */
async function loadEngagingPosts() {
  try {
    const data = JSON.parse(await fs.readFile(ENGAGING_POSTS_PATH, 'utf-8'));
    return data;
  } catch (error) {
    console.log('⚠️  No engaging posts file found, starting fresh');
    return { posts: [], metadata: { lastUpdated: null, totalPosts: 0, byCategory: {} } };
  }
}

/**
 * Save engaging posts
 */
async function saveEngagingPosts(data) {
  try {
    await fs.writeFile(ENGAGING_POSTS_PATH, JSON.stringify(data, null, 2));
    console.log(`✅ Saved ${data.posts.length} engaging posts to ${ENGAGING_POSTS_PATH}`);
  } catch (error) {
    console.error('Failed to save engaging posts:', error.message);
    throw error;
  }
}

/**
 * Clean up old engaging posts (keep only last 48 hours)
 * Tweets older than 36 hours cannot be replied to, so 48h buffer ensures relevancy
 */
function cleanupOldEngagingPosts(data) {
  const MAX_AGE_HOURS = 48;
  const now = Date.now();
  const cutoffTime = now - (MAX_AGE_HOURS * 60 * 60 * 1000);

  const originalCount = data.posts.length;

  // Keep only posts added within the last 48 hours
  data.posts = data.posts.filter(post => {
    const addedTime = new Date(post.addedAt).getTime();
    return addedTime >= cutoffTime;
  });

  const removedCount = originalCount - data.posts.length;

  if (removedCount > 0) {
    console.log(`🧹 Cleaned up ${removedCount} old posts (kept ${data.posts.length} posts from last ${MAX_AGE_HOURS}h)`);
  }

  return data;
}

/**
 * Main Timeline Monitoring Function
 */
async function monitorKolTimelines() {
  const scriptStartTime = Date.now();
  console.log('🚀 Starting KOL Timeline Monitoring (Script 2.2.1)...');
  console.log(`📍 Script: monitor-kol-timelines.js`);
  console.log(`⏰ Start time: ${new Date().toISOString()}\n`);

  // Track current phase for debugging
  let currentPhase = 'initialization';
  let lastSuccessfulOperation = null;

  // ========================================================================
  // STEP 1: Randomize next run schedule FIRST (before main work)
  // ========================================================================
  if (isGitHubActions()) {
    currentPhase = 'schedule_randomization';
    console.log('='.repeat(60));
    console.log(`⏰ [${Math.round((Date.now() - scriptStartTime) / 1000)}s] 🎲 Randomizing next run schedules...\n`);

    try {
      const scheduleConfig = {
        scheduleDataFile: path.join(__scriptsDir, 'data', 'kol-monitor-schedule.json'),
        timeWindow: {
          minHour: 6,   // 6:00 AM UTC
          maxHour: 22   // 10:00 PM UTC
        },
        runConstraints: {
          minHoursBetween: 18,
          maxHoursBetween: 30
        }
      };

      const schedules = generateMultipleRandomCrons(4, scheduleConfig);
      const crons = schedules.map(s => s.cron);

      console.log('   Generated schedules:');
      schedules.forEach((s, i) => {
        console.log(`   ${i + 1}. ${s.cron} (${s.time})`);
      });

      const workflowFile = path.join(__scriptsDir, '..', '.github', 'workflows', 'kol-monitor-timelines.yml');
      const updateSuccess = updateAndCommitSchedule(
        crons,
        schedules[0].time,
        workflowFile,
        'KOL timeline monitoring'
      );

      if (updateSuccess) {
        console.log(`✅ [${Math.round((Date.now() - scriptStartTime) / 1000)}s] Schedule randomization complete!`);
      } else {
        console.error('⚠️  Schedule randomization failed, will use existing schedule');
      }
    } catch (scheduleError) {
      console.error('⚠️  Error during schedule randomization:', scheduleError.message);
      console.error('   Continuing with main script...');
    }
    console.log('='.repeat(60) + '\n');
  } else {
    console.log('ℹ️  Skipping schedule randomization (not running on GitHub Actions)\n');
  }

  // ========================================================================
  // STEP 2: Main Timeline Monitoring Process
  // ========================================================================

  // Load configuration
  currentPhase = 'loading_config';
  console.log(`⏰ [${Math.round((Date.now() - scriptStartTime) / 1000)}s] 📍 Phase: ${currentPhase}`);
  const config = loadConfig();
  lastSuccessfulOperation = 'config_loaded';

  const { minEngagementThreshold, maxTweetsPerKol, dryRun } = config.monitorSettings || {
    minEngagementThreshold: { likes: 50, retweets: 10 },
    maxTweetsPerKol: 10,
    dryRun: false
  };

  console.log(`📊 Configuration:
   - Min engagement threshold: ${minEngagementThreshold.likes} likes, ${minEngagementThreshold.retweets} retweets
   - Max tweets per KOL: ${maxTweetsPerKol}
   - Dry run mode: ${dryRun ? '✅ ON (no save)' : '❌ OFF (will save)'}
`);

  // Initialize authManager
  currentPhase = 'initializing_authManager';
  await authManager.initialize();
  currentPhase = 'ready_to_fetch_tweets';
  console.log(`⏰ [${Math.round((Date.now() - scriptStartTime) / 1000)}s] 📍 HTML parsing ready via authManager`);

  // Initialize Claude client for content filtering
  currentPhase = 'initializing_claude';
  const claudeClient = createClaudeClient();
  console.log(`✅ [${Math.round((Date.now() - scriptStartTime) / 1000)}s] Claude client initialized for content filtering`);

  // Initialize rate limiters
  const twitterLimiter = new RateLimiter(config.rateLimits?.twitterApiCallsPerMinute || 15);
  const claudeLimiter = new RateLimiter(config.rateLimits?.claudeApiCallsPerMinute || 30);

  // Load data
  currentPhase = 'loading_data';
  console.log(`⏰ [${Math.round((Date.now() - scriptStartTime) / 1000)}s] 📍 Phase: ${currentPhase}`);
  const kolsData = loadKolsData();
  let engagingPostsData = await loadEngagingPosts();

  // Clean up old posts (keep only last 48 hours for relevancy)
  console.log(`\n📋 Engaging Posts Queue:`);
  console.log(`   Total posts before cleanup: ${engagingPostsData.posts.length}`);
  engagingPostsData = cleanupOldEngagingPosts(engagingPostsData);
  console.log(`   Total posts after cleanup: ${engagingPostsData.posts.length}\n`);

  const processedPosts = loadProcessedPosts();

  const activeKols = kolsData.kols.filter(k => k.status === 'active');
  console.log(`📋 Found ${activeKols.length} active KOLs to monitor\n`);

  // Prioritize KOLs with randomization
  const prioritizedKols = prioritizeKolsWithRandomization(activeKols);

  // Tracking stats
  let kolsProcessed = 0;
  let tweetsEvaluated = 0;
  let tweetsSelected = 0;
  let tweetsSkipped = 0;
  let tweetsFilteredByContent = 0;
  const selectedTweets = [];
  const contentFilterStats = {
    'project-discussion': 0,
    'altcoin-talk': 0,
    'market-trends': 0,
    'price-speculation': 0,
    'technical-analysis': 0,
    'off-topic': 0,
    'news': 0,
    'error': 0
  };

  // Process each KOL
  for (const kol of prioritizedKols) {
    try {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`👤 Processing KOL: @${kol.username} (${kol.displayName})`);
      console.log(`   Followers: ${kol.followersCount?.toLocaleString() || 'N/A'}`);
      console.log(`${'='.repeat(60)}\n`);

      // Fetch recent tweets via HTML parsing
      currentPhase = `fetching_tweets_for_${kol.username}`;
      lastSuccessfulOperation = `processing_kol_${kol.username}`;
      await twitterLimiter.throttle();

      const account = await authManager.getNextAccount();
      const tweets = await getUserTweetsWebUnblocker(kol.username, {
        maxResults: 100,
        cookies: account.cookies,
        account
      });
      lastSuccessfulOperation = `fetched_tweets_for_${kol.username}`;

      console.log(`📊 Fetched ${tweets.length} tweets from @${kol.username}`);

      if (tweets.length === 0) {
        console.log(`⏭️  No tweets found, skipping...`);
        kolsProcessed++;
        continue;
      }

      // Filter tweets by engagement threshold
      const engagingTweets = tweets.filter(tweet => {
        const likes = tweet.public_metrics?.like_count || 0;
        const retweets = tweet.public_metrics?.retweet_count || 0;
        return likes >= minEngagementThreshold.likes && retweets >= minEngagementThreshold.retweets;
      });

      console.log(`✨ Found ${engagingTweets.length} tweets meeting engagement threshold`);

      // Select top tweets (limit per KOL)
      const topTweets = engagingTweets.slice(0, maxTweetsPerKol);

      // Add to selected tweets with metadata, with AI content filtering
      for (const tweet of topTweets) {
        // Check if already in engaging posts or processed
        const tweetId = tweet.id || tweet.tweet_id;
        const alreadyExists = (engagingPostsData.posts || []).some(p => p.id === tweetId);
        const alreadyProcessed = (processedPosts.posts || []).some(p => p.postId === tweetId);

        if (alreadyExists || alreadyProcessed) {
          console.log(`⏭️  Tweet ${tweetId} already tracked, skipping...`);
          tweetsSkipped++;
          continue;
        }

        tweetsEvaluated++;

        // NEW: Quick AI content filter
        await claudeLimiter.throttle();
        console.log(`🤖 Quick filter: "${tweet.text.substring(0, 80)}${tweet.text.length > 80 ? '...' : ''}"`);

        const filterResult = await quickFilterTweetRelevance(claudeClient, tweet);
        contentFilterStats[filterResult.category] = (contentFilterStats[filterResult.category] || 0) + 1;

        if (!filterResult.isRelevant) {
          console.log(`   ⏭️  Filtered out (${filterResult.category})`);
          tweetsFilteredByContent++;
          continue;
        }

        console.log(`   ✅ Passed filter (${filterResult.category})`);

        selectedTweets.push({
          id: tweetId,
          text: tweet.text,
          author: {
            id: kol.id,
            username: kol.username,
            displayName: kol.displayName
          },
          public_metrics: tweet.public_metrics,
          created_at: tweet.created_at,
          url: `https://twitter.com/${kol.username}/status/${tweetId}`,
          processed: false,
          addedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          source: 'timeline_monitor',
          contentCategory: filterResult.category
        });

        tweetsSelected++;
      }

      kolsProcessed++;

    } catch (error) {
      console.error(`❌ Error processing KOL @${kol.username}:`, error.message);
      tweetsSkipped++;
    }
  }

  // Update engaging posts data
  engagingPostsData.posts.push(...selectedTweets);
  engagingPostsData.metadata = {
    lastUpdated: new Date().toISOString(),
    totalPosts: engagingPostsData.posts.length,
    bySource: {
      timeline_monitor: engagingPostsData.posts.filter(p => p.source === 'timeline_monitor').length,
      search_discovery: engagingPostsData.posts.filter(p => p.source === 'search_discovery').length
    }
  };

  // Save engaging posts
  if (!dryRun) {
    await saveEngagingPosts(engagingPostsData);
  } else {
    console.log('\n⚠️  DRY RUN: Would have saved engaging posts (skipped)');
  }

  // Calculate duration
  const duration = ((Date.now() - scriptStartTime) / 1000).toFixed(1);

  // Send Zapier notification
  try {
    await sendMonitorNotification({
      success: tweetsSelected > 0,
      kolsProcessed,
      tweetsEvaluated,
      tweetsSelected,
      tweetsSkipped,
      totalKols: activeKols.length,
      totalEngagingPosts: engagingPostsData.posts.length,
      duration,
      dryRun,
      runUrl: process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
        ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
        : null
    });
  } catch (notificationError) {
    console.error('⚠️  Failed to send Zapier notification:', notificationError.message);
  }

  // Print summary
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Timeline Monitoring Summary`);
  console.log(`${'='.repeat(60)}`);
  console.log(`KOLs processed: ${kolsProcessed}/${activeKols.length}`);
  console.log(`Tweets evaluated: ${tweetsEvaluated}`);
  console.log(`Tweets filtered by content: ${tweetsFilteredByContent}`);
  console.log(`Tweets selected: ${tweetsSelected}`);
  console.log(`Tweets skipped (duplicates): ${tweetsSkipped}`);
  console.log(`Total engaging posts: ${engagingPostsData.posts.length}`);
  console.log(`Duration: ${duration}s`);
  console.log(`\n📊 Content Filter Breakdown:`);
  Object.entries(contentFilterStats).forEach(([category, count]) => {
    if (count > 0) {
      const emoji = category.includes('project') || category.includes('altcoin') || category.includes('market') ? '✅' : '⏭️';
      console.log(`   ${emoji} ${category}: ${count}`);
    }
  });
  console.log(`${'='.repeat(60)}\n`);

  console.log('✅ Timeline monitoring complete!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  monitorKolTimelines()
    .then(() => {
      console.log('✅ Monitoring completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fatal error:', error.message);
      if (error.stack) {
        console.error(error.stack);
      }
      process.exit(1);
    });
}

export default monitorKolTimelines;
