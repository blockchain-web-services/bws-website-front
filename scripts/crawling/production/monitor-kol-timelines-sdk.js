#!/usr/bin/env node

/**
 * Script 2.2.1: KOL Timeline Monitor - SDK Version
 *
 * MIGRATED TO: BWS X SDK v1.6.0
 * Monitors KOL timelines for high-engagement tweets
 * Saves selected tweets to engaging-posts.json for later reply processing
 *
 * Changes from original:
 * - ✅ Replaced getUserTweetsWebUnblocker() with client.getUserTweets()
 * - ✅ Removed authManager dependency (SDK handles account rotation)
 * - ✅ Using config-based crawler accounts from x-crawler-accounts.json
 * - ✅ Proxy disabled in GitHub Actions (direct connection works)
 * - ✅ All other logic preserved (Claude AI, filtering, file I/O, etc.)
 */

import { XTwitterClient } from '@blockchain-web-services/bws-x-sdk-node';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';

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
import { sendMonitorNotification } from '../utils/zapier-webhook.js';
import { createClaudeClient, quickFilterTweetRelevance } from '../utils/claude-client.js';

const __dirname = __scriptsDir;
const ENGAGING_POSTS_PATH = path.join(__dirname, '../data/engaging-posts.json');
const CRAWLER_ACCOUNTS_PATH = path.join(__dirname, '..', 'config', 'x-crawler-accounts.json');

/**
 * Load crawler accounts from config file
 */
function loadCrawlerAccounts() {
  try {
    if (!fsSync.existsSync(CRAWLER_ACCOUNTS_PATH)) {
      console.log('⚠️  No crawler accounts file found, will use API-only mode');
      return null;
    }

    const config = JSON.parse(fsSync.readFileSync(CRAWLER_ACCOUNTS_PATH, 'utf-8'));

    // Transform to SDK format
    const accounts = config.accounts.map(acc => ({
      id: acc.id,
      username: acc.username,
      cookies: {
        auth_token: acc.cookies.auth_token,
        ct0: acc.cookies.ct0,
        guest_id: acc.cookies.guest_id || ''
      },
      country: acc.country || 'us'
    }));

    console.log(`✅ Loaded ${accounts.length} crawler accounts from config file`);
    return { accounts, proxy: config.proxy };
  } catch (error) {
    console.error('⚠️  Error loading crawler accounts:', error.message);
    return null;
  }
}

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
 * Clean up old engaging posts (keep only last 7 days)
 * Aligns with post expiration time (expiresAt = addedAt + 7 days)
 */
function cleanupOldEngagingPosts(data) {
  const MAX_AGE_HOURS = 168;  // 7 days (matches expiresAt timeframe)
  const now = Date.now();
  const cutoffTime = now - (MAX_AGE_HOURS * 60 * 60 * 1000);

  const originalCount = data.posts.length;

  // Keep only posts added within the last 7 days (aligns with expiration)
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
  console.log('🚀 Starting KOL Timeline Monitoring (Script 2.2.1 - SDK Version)...');
  console.log(`📍 Script: monitor-kol-timelines-sdk.js`);
  console.log(`📦 Using: BWS X SDK v1.6.0`);
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
  // STEP 2: Initialize SDK Client
  // ========================================================================

  currentPhase = 'initializing_sdk';
  console.log(`⏰ [${Math.round((Date.now() - scriptStartTime) / 1000)}s] 🔧 Initializing XTwitterClient...`);

  // Load crawler accounts from config file
  const crawlerConfig = loadCrawlerAccounts();

  // Build configuration with hybrid mode for cost optimization
  const sdkConfig = {
    mode: crawlerConfig ? 'hybrid' : 'api',  // Hybrid if crawler accounts available, otherwise API-only

    // Crawler accounts (from x-crawler-accounts.json)
    crawler: crawlerConfig ? {
      accounts: crawlerConfig.accounts
    } : undefined,

    // API fallback (when crawler fails or rate limited)
    api: {
      accounts: [{
        name: 'BWSCommunity',
        apiKey: process.env.TWITTER_API_KEY,
        apiSecret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_SECRET
      }]
    },

    // Proxy for crawler mode (from config file or env vars)
    // NOTE: Proxy is DISABLED in GitHub Actions because direct access works better
    // Working scripts (discover-by-engagement-crawlee.js) use "WITHOUT proxy - direct access works on GitHub Actions"
    proxy: (crawlerConfig?.proxy?.enabled && !process.env.GITHUB_ACTIONS) ? {
      provider: crawlerConfig.proxy.provider,
      username: process.env.OXYLABS_USERNAME || crawlerConfig.proxy.username,
      password: process.env.OXYLABS_PASSWORD || crawlerConfig.proxy.password
    } : undefined,

    // Logging
    logging: {
      level: 'info'
    }
  };

  const client = new XTwitterClient(sdkConfig);

  // Display what mode we're using
  const info = client.getInfo();
  console.log(`✅ SDK client initialized in ${info.mode} mode`);
  console.log(`   Has crawler: ${info.hasCrawler ? '✅ Yes' : '❌ No (will use API only)'}`);
  console.log(`   Has API: ${info.hasAPI ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has proxy: ${info.hasProxy ? '✅ Yes' : '❌ No'}`);
  console.log('');

  // ========================================================================
  // STEP 3: Main Timeline Monitoring Process
  // ========================================================================

  // Load configuration
  currentPhase = 'loading_config';
  console.log(`⏰ [${Math.round((Date.now() - scriptStartTime) / 1000)}s] 📍 Phase: ${currentPhase}`);
  const config = loadConfig();
  lastSuccessfulOperation = 'config_loaded';

  const { minEngagementThreshold, maxTweetsPerKol, dryRun } = config.monitorSettings || {
    minEngagementThreshold: { likes: 25, retweets: 5 },  // Lowered from 50/10 for more opportunities
    maxTweetsPerKol: 10,
    dryRun: false
  };

  console.log(`📊 Configuration:
   - Min engagement threshold: ${minEngagementThreshold.likes} likes, ${minEngagementThreshold.retweets} retweets
   - Max tweets per KOL: ${maxTweetsPerKol}
   - Dry run mode: ${dryRun ? '✅ ON (no save)' : '❌ OFF (will save)'}
`);

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
  let tweetsFetched = 0;  // NEW: Total tweets fetched from Twitter
  let tweetsPassedEngagement = 0;  // NEW: Tweets meeting engagement threshold
  let crawlerSuccesses = 0;  // NEW: KOLs processed via crawler
  let apiFallbacks = 0;  // NEW: KOLs that fell back to API
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

      // Fetch recent tweets via SDK (replaces getUserTweetsWebUnblocker + authManager)
      currentPhase = `fetching_tweets_for_${kol.username}`;
      lastSuccessfulOperation = `processing_kol_${kol.username}`;
      await twitterLimiter.throttle();

      // SDK MIGRATION: Replace getUserTweetsWebUnblocker() with client.getUserTweets()
      const tweets = await client.getUserTweets(kol.username, {
        maxResults: 100,
        excludeReplies: false,
        excludeRetweets: true
      });
      lastSuccessfulOperation = `fetched_tweets_for_${kol.username}`;

      tweetsFetched += tweets.length;  // Track total tweets fetched
      crawlerSuccesses++;  // Track successful crawler usage

      console.log(`📊 Fetched ${tweets.length} tweets from @${kol.username}`);

      if (tweets.length === 0) {
        console.log(`⏭️  No tweets found, skipping...`);
        kolsProcessed++;
        continue;
      }

      // Filter tweets by engagement threshold (OR logic - either metric can qualify)
      const engagingTweets = tweets.filter(tweet => {
        const likes = tweet.public_metrics?.like_count || 0;
        const retweets = tweet.public_metrics?.retweet_count || 0;
        return likes >= minEngagementThreshold.likes || retweets >= minEngagementThreshold.retweets;
      });

      tweetsPassedEngagement += engagingTweets.length;  // Track tweets meeting threshold

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

        // Quick AI content filter
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

      // Track API fallback if error message indicates it
      if (error.message.includes('rate limit') || error.message.includes('API')) {
        apiFallbacks++;
      }
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
      // NEW: Additional metrics for better visibility
      tweetsFetched,
      tweetsPassedEngagement,
      crawlerSuccesses,
      apiFallbacks,
      engagementThreshold: minEngagementThreshold,
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
  console.log(`  - Via crawler: ${crawlerSuccesses}`);
  console.log(`  - Via API (fallback): ${apiFallbacks}`);
  console.log(`Tweets fetched from Twitter: ${tweetsFetched}`);
  console.log(`Tweets meeting engagement threshold (${minEngagementThreshold.likes}L+${minEngagementThreshold.retweets}RT): ${tweetsPassedEngagement}`);
  console.log(`Tweets evaluated by AI: ${tweetsEvaluated}`);
  console.log(`Tweets filtered by content: ${tweetsFilteredByContent}`);
  console.log(`Tweets selected: ${tweetsSelected}`);
  console.log(`Tweets skipped (duplicates/errors): ${tweetsSkipped}`);
  console.log(`Total engaging posts in queue: ${engagingPostsData.posts.length}`);
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
