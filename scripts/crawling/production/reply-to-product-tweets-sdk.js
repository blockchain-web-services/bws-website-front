/**
 * Product-Specific Reply Automation - BWS X SDK Version
 * Processes product discovery queue and posts educational threads
 *
 * MIGRATION: Converted from reply-to-product-tweets.js to use BWS X SDK v1.7.0
 * SDK Methods: client.followUser(), client.likeTweet(), client.postReply()
 * Mode: API (write operations)
 *
 * Flow: Queue → Evaluate → Generate Thread → Post → Track
 * Target: 2-4 educational threads per day across 4 products
 */

// Load environment variables
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __scriptsDir = path.dirname(__filename);
const worktreeRoot = path.resolve(__scriptsDir, '../../..');
dotenv.config({ path: path.join(worktreeRoot, '.env') });

import fs from 'fs/promises';
import fsSync from 'fs';
import { XTwitterClient } from '@blockchain-web-services/bws-x-sdk-node';
import { fetchProductDocs } from '../utils/docs-fetcher.js';
import { generateEducationalThread } from '../utils/thread-generator.js';
import { evaluateTweetForProductReply } from '../utils/claude-client.js';
import { sleep, loadBWSProducts } from '../utils/kol-utils.js';
import { sendProductReplyNotification } from '../utils/zapier-webhook.js';

const __dirname = __scriptsDir;

// Crawler accounts configuration path
const CRAWLER_ACCOUNTS_PATH = path.join(__dirname, '../config/x-crawler-accounts.json');

/**
 * Load crawler accounts from config file for SDK initialization
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
 * Preview thread without posting
 */
function previewThread(threadTweets) {
  console.log('\n📋 Thread Preview:');
  console.log('='.repeat(60));

  threadTweets.forEach((tweet, i) => {
    console.log(`\nTweet ${i + 1}:`);
    console.log(`  ${tweet.text}`);
    console.log(`  (${tweet.text.length} characters)`);
    if (tweet.purpose) {
      console.log(`  Purpose: ${tweet.purpose}`);
    }
    console.log('-'.repeat(60));
  });

  console.log('\n');
}

/**
 * Post a Twitter thread using SDK
 * Replaces postThread() utility with SDK postReply() calls
 */
async function postThreadWithSDK(client, parentTweetId, threadTweets, config = {}) {
  const {
    delayBetweenTweets = 5000, // 5 seconds between tweets
    retryAttempts = 2
  } = config;

  console.log(`\n🧵 Posting ${threadTweets.length}-tweet thread...`);
  console.log(`   📍 Replying to tweet: ${parentTweetId}`);

  // Validate thread
  for (let i = 0; i < threadTweets.length; i++) {
    const tweet = threadTweets[i];
    if (!tweet.text || tweet.text.length === 0) {
      throw new Error(`Tweet ${i + 1} is empty`);
    }
    if (tweet.text.length > 280) {
      throw new Error(`Tweet ${i + 1} exceeds 280 characters (${tweet.text.length} chars)`);
    }
  }

  const postedTweetIds = [];
  let currentReplyTo = parentTweetId;

  // Post each tweet in sequence
  for (let i = 0; i < threadTweets.length; i++) {
    const tweet = threadTweets[i];
    let posted = false;
    let lastError = null;

    console.log(`\n   📤 Posting tweet ${i + 1}/${threadTweets.length}...`);
    console.log(`      Text: ${tweet.text.substring(0, 100)}${tweet.text.length > 100 ? '...' : ''}`);
    console.log(`      Length: ${tweet.text.length} chars`);

    // Retry logic
    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        // SDK METHOD: client.postReply() replaces client.v2.reply()
        const response = await client.postReply({
          tweetId: currentReplyTo,
          text: tweet.text
        });

        if (response && response.id) {
          const tweetId = response.id;
          postedTweetIds.push(tweetId);
          currentReplyTo = tweetId; // Next tweet replies to this one
          posted = true;

          console.log(`      ✅ Posted successfully (ID: ${tweetId})`);
          break;
        } else {
          throw new Error('SDK returned no tweet ID');
        }
      } catch (error) {
        lastError = error;
        console.error(`      ❌ Attempt ${attempt}/${retryAttempts} failed: ${error.message}`);

        if (attempt < retryAttempts) {
          console.log(`      ⏳ Retrying in 3 seconds...`);
          await sleep(3000);
        }
      }
    }

    if (!posted) {
      // Thread failed partway through
      console.error(`\n❌ Failed to post tweet ${i + 1} after ${retryAttempts} attempts`);
      console.error(`   Error: ${lastError?.message}`);
      console.error(`   Posted so far: ${postedTweetIds.length}/${threadTweets.length} tweets`);

      throw new Error(
        `Thread incomplete: ${postedTweetIds.length}/${threadTweets.length} tweets posted. ` +
        `Last error: ${lastError?.message}`
      );
    }

    // Delay before next tweet (except after last tweet)
    if (i < threadTweets.length - 1) {
      console.log(`   ⏳ Waiting ${delayBetweenTweets / 1000}s before next tweet...`);
      await sleep(delayBetweenTweets);
    }
  }

  console.log(`\n✅ Thread posted successfully!`);
  console.log(`   📊 ${postedTweetIds.length} tweets posted`);
  console.log(`   🔗 Thread IDs: ${postedTweetIds.join(', ')}`);

  return postedTweetIds;
}

/**
 * Load product reply configuration
 */
async function loadReplyConfig() {
  const configPath = path.join(__dirname, '..', 'config', 'product-reply-config.json');
  const data = await fs.readFile(configPath, 'utf-8');
  return JSON.parse(data);
}

/**
 * Load product highlights configuration
 */
async function loadProductHighlights() {
  const configPath = path.join(__dirname, '..', 'config', 'product-highlights.json');
  const data = await fs.readFile(configPath, 'utf-8');
  const config = JSON.parse(data);
  return config.productHighlights;
}

/**
 * Load product discovery queue
 */
async function loadProductQueue() {
  const queuePath = path.join(__dirname, '..', 'data', 'product-discovery-queue.json');
  const data = await fs.readFile(queuePath, 'utf-8');
  return JSON.parse(data);
}

/**
 * Save product discovery queue
 */
async function saveProductQueue(queue) {
  const queuePath = path.join(__dirname, '..', 'data', 'product-discovery-queue.json');
  await fs.writeFile(queuePath, JSON.stringify(queue, null, 2));
}

/**
 * Load product replies tracking
 */
async function loadProductReplies() {
  const repliesPath = path.join(__dirname, '..', 'data', 'product-replies.json');
  try {
    const data = await fs.readFile(repliesPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {
        replies: [],
        stats: {
          totalThreads: 0,
          byProduct: {},
          byApproach: {},
          averageRelevanceScore: 0,
          lastReply: null
        }
      };
    }
    throw error;
  }
}

/**
 * Save product replies tracking
 */
async function saveProductReplies(replies) {
  const repliesPath = path.join(__dirname, '..', 'data', 'product-replies.json');
  await fs.writeFile(repliesPath, JSON.stringify(replies, null, 2));
}

/**
 * Check if tweet is fresh enough to reply
 */
function isTweetFresh(tweet, maxHours) {
  const createdAt = new Date(tweet.created_at || tweet.discoveredAt);
  const age = Date.now() - createdAt.getTime();
  const ageHours = age / (60 * 60 * 1000);
  return ageHours <= maxHours;
}

/**
 * Select tweets to process (product rotation logic)
 */
function selectTweetsToProcess(unprocessed, config, recentReplies) {
  const { evaluatePerRun, productRotation } = config;

  // Get recently replied products
  const recentProducts = recentReplies
    .slice(0, 5)
    .map(r => r.product);

  // Group by product
  const byProduct = {};
  for (const tweet of unprocessed) {
    if (!byProduct[tweet.product]) {
      byProduct[tweet.product] = [];
    }
    byProduct[tweet.product].push(tweet);
  }

  const selected = [];

  // Product rotation: prefer products not recently replied to
  const products = Object.keys(byProduct);
  products.sort((a, b) => {
    const aRecent = recentProducts.filter(p => p === a).length;
    const bRecent = recentProducts.filter(p => p === b).length;
    return aRecent - bRecent; // Products with fewer recent replies first
  });

  // Select tweets for evaluation, rotating through products
  let productIndex = 0;
  while (selected.length < evaluatePerRun && products.length > 0) {
    const product = products[productIndex % products.length];
    const productTweets = byProduct[product];

    if (productTweets && productTweets.length > 0) {
      // Take highest priority tweet from this product
      const tweet = productTweets.shift();
      selected.push(tweet);

      if (productTweets.length === 0) {
        // Remove product if no more tweets
        products.splice(productIndex % products.length, 1);
      } else {
        productIndex++;
      }
    } else {
      productIndex++;
    }

    if (productIndex >= products.length * 10) {
      // Safety: avoid infinite loop
      break;
    }
  }

  return selected;
}

/**
 * Mark tweet as processed in queue
 */
function markAsProcessed(queue, tweetId, status) {
  const tweet = queue.tweets.find(t => t.id === tweetId);
  if (tweet) {
    tweet.processed = true;
    tweet.processedAt = new Date().toISOString();
    tweet.processedStatus = status; // 'replied', 'low_relevance', 'error'
  }
}

/**
 * Count threads posted today
 */
function getTodayThreadCount(repliesData) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return repliesData.replies.filter(r => {
    const replyDate = new Date(r.timestamp).toISOString().split('T')[0];
    return replyDate === today;
  }).length;
}

/**
 * Main reply automation
 */
async function replyToProductTweets() {
  console.log('🧵 Starting Product-Specific Reply Automation...');
  console.log('📦 Using: BWS X SDK v1.7.0');
  console.log(`📍 Script: reply-to-product-tweets-sdk.js\n`);

  const startTime = Date.now();

  // Initialize SDK client
  console.log('🔧 Initializing XTwitterClient...');
  const crawlerConfig = loadCrawlerAccounts();

  const sdkConfig = {
    mode: crawlerConfig ? 'hybrid' : 'api',

    crawler: crawlerConfig ? {
      accounts: crawlerConfig.accounts
    } : undefined,

    api: {
      accounts: [{
        name: 'BWSCommunity',
        apiKey: process.env.TWITTER_API_KEY,
        apiSecret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_SECRET
      }]
    },

    // Proxy disabled in GitHub Actions (write operations use API only in v1.7.0)
    proxy: (crawlerConfig?.proxy?.enabled && !process.env.GITHUB_ACTIONS) ? {
      provider: crawlerConfig.proxy.provider,
      username: process.env.OXYLABS_USERNAME || crawlerConfig.proxy.username,
      password: process.env.OXYLABS_PASSWORD || crawlerConfig.proxy.password
    } : undefined,

    logging: { level: 'info' }
  };

  const client = new XTwitterClient(sdkConfig);

  console.log(`\n✅ SDK client initialized`);
  console.log(`   Mode: ${sdkConfig.mode}`);
  console.log(`   Has API: ✅ Yes (required for write operations)`)
  console.log(`   Has proxy: ${sdkConfig.proxy ? '✅ Yes' : '❌ No'}\\n`);

  // Load configuration
  const config = await loadReplyConfig();
  const queue = await loadProductQueue();
  const repliesData = await loadProductReplies();
  const productsInfo = loadBWSProducts();
  const productHighlights = await loadProductHighlights();

  console.log('📋 Configuration:');
  console.log(`   - Evaluate per run: ${config.evaluatePerRun} tweets`);
  console.log(`   - Max threads per run: ${config.maxThreadsPerRun}`);
  console.log(`   - Max threads per day: ${config.maxThreadsPerDay}`);
  console.log(`   - Relevance threshold: ${config.relevanceThreshold}`);
  console.log(`   - Freshness: ${config.freshnessFilter.maxTweetAgeHours}h max age`);
  console.log(`   - Product isolation: ${config.productIsolation.enforceStrictly ? 'STRICT' : 'lenient'}\n`);

  // Filter unprocessed and fresh tweets
  const unprocessed = queue.tweets.filter(t =>
    !t.processed &&
    isTweetFresh(t, config.freshnessFilter.maxTweetAgeHours)
  );

  console.log(`📊 Queue Status:`);
  console.log(`   - Total tweets: ${queue.tweets.length}`);
  console.log(`   - Unprocessed: ${unprocessed.length}`);
  console.log(`   - Fresh (< ${config.freshnessFilter.maxTweetAgeHours}h): ${unprocessed.length}\n`);

  if (unprocessed.length === 0) {
    console.log('ℹ️  No tweets to process');
    return;
  }

  // Check daily limit
  const todayThreadCount = getTodayThreadCount(repliesData);
  console.log(`📊 Today's threads: ${todayThreadCount}/${config.maxThreadsPerDay}`);

  if (todayThreadCount >= config.maxThreadsPerDay) {
    console.log(`⚠️  Daily thread limit reached (${todayThreadCount}/${config.maxThreadsPerDay}). Exiting...\n`);
    return;
  }

  const remainingToday = config.maxThreadsPerDay - todayThreadCount;
  const maxThreadsThisRun = Math.min(config.maxThreadsPerRun, remainingToday);
  console.log(`📍 Max threads this run: ${maxThreadsThisRun} (remaining today: ${remainingToday})\n`);

  // Select tweets to process (with product rotation)
  const tweetsToProcess = selectTweetsToProcess(
    unprocessed,
    config,
    repliesData.replies
  );

  console.log(`🎯 Selected ${tweetsToProcess.length} tweets for evaluation:`);
  tweetsToProcess.forEach((t, i) => {
    console.log(`   ${i + 1}. ${t.product} - ${t.text.substring(0, 60)}...`);
  });
  console.log(`   Will post up to ${maxThreadsThisRun} threads (based on relevance scores)\n`);

  // Process each tweet
  let threadsPosted = 0;
  let tweetsEvaluated = 0;
  const errors = [];
  const allThreadDetails = [];

  for (const tweet of tweetsToProcess) {
    tweetsEvaluated++;

    // Check if we've reached the posting limit for this run
    if (threadsPosted >= maxThreadsThisRun) {
      console.log(`\n✅ Reached max threads for this run (${maxThreadsThisRun}). Marking remaining tweets as skipped...\n`);
      break;
    }

    try {
      console.log(`\n${'='.repeat(70)}`);
      console.log(`Evaluating Tweet ${tweetsEvaluated}/${tweetsToProcess.length} (Threads posted: ${threadsPosted}/${maxThreadsThisRun})`);
      console.log(`${'='.repeat(70)}`);
      console.log(`Product: ${tweet.product}`);
      console.log(`Tweet ID: ${tweet.id}`);
      console.log(`Author: @${tweet.author.username}`);
      console.log(`Text: "${tweet.text}"`);
      const likes = tweet.public_metrics?.like_count || 0;
      const retweets = tweet.public_metrics?.retweet_count || 0;
      console.log(`Engagement: ${likes} likes, ${retweets} RTs`);

      // Load product information
      const productInfo = productsInfo[tweet.product];
      const productHighlight = productHighlights[tweet.product];
      if (!productInfo || !productHighlight) {
        throw new Error(`Product info not found for: ${tweet.product}`);
      }

      // Fetch documentation
      const docsContent = await fetchProductDocs(tweet.product, productHighlight.docsPath);

      // Evaluate relevance with Claude AI
      console.log(`\n🤖 Evaluating tweet relevance...`);
      const evaluation = await evaluateTweetForProductReply(
        tweet.text,
        tweet.product,
        productHighlight
      );

      console.log(`   📊 Relevance Score: ${evaluation.relevanceScore}/100`);
      console.log(`   💡 Detected Pain Point: ${evaluation.detectedPainPoint || 'None'}`);
      console.log(`   🎯 Suggested Approach: ${evaluation.suggestedApproach || 'None'}`);

      if (evaluation.relevanceScore < config.relevanceThreshold) {
        console.log(`   ⚠️  Below threshold (${config.relevanceThreshold}), skipping...`);
        markAsProcessed(queue, tweet.id, 'low_relevance');
        continue;
      }

      // Generate educational thread
      const thread = await generateEducationalThread(
        tweet.id,
        tweet.text,
        tweet.product,
        productHighlight,
        docsContent,
        evaluation,
        config
      );

      // Preview thread
      previewThread(thread.tweets);

      // Post thread to Twitter
      console.log(`\n📤 Posting thread to Twitter...`);

      // Anti-spam actions: follow and like
      if (config.antiSpam.followAuthor) {
        try {
          // SDK METHOD: client.followUser() replaces followUser(twitterClient, userId)
          await client.followUser(tweet.author.username);
          console.log(`   ✅ Followed @${tweet.author.username}`);
        } catch (error) {
          console.warn(`   ⚠️  Could not follow user: ${error.message}`);
        }
      }

      if (config.antiSpam.likeTweet) {
        try {
          // SDK METHOD: client.likeTweet() replaces likeTweet(twitterClient, tweetId)
          await client.likeTweet(tweet.id);
          console.log(`   ✅ Liked tweet ${tweet.id}`);
        } catch (error) {
          console.warn(`   ⚠️  Could not like tweet: ${error.message}`);
        }
      }

      // Post the thread using SDK
      const threadIds = await postThreadWithSDK(
        client,
        tweet.id,
        thread.tweets,
        {
          delayBetweenTweets: config.antiSpam.delayBetweenThreadTweets,
          validateBeforePost: config.productIsolation.validateBeforePost
        }
      );

      // Track reply
      repliesData.replies.push({
        originalTweetId: tweet.id,
        originalTweetAuthor: tweet.author.username,
        product: tweet.product,
        threadTweetIds: threadIds,
        templateUsed: thread.templateUsed,
        templateName: thread.templateName,
        approach: thread.approach,
        relevanceScore: evaluation.relevanceScore,
        timestamp: new Date().toISOString(),
        threadPreview: thread.tweets[0].text.substring(0, 100),
        sdkVersion: '1.7.0'
      });

      // Update stats
      repliesData.stats.totalThreads++;
      repliesData.stats.byProduct[tweet.product] =
        (repliesData.stats.byProduct[tweet.product] || 0) + 1;
      repliesData.stats.byApproach[thread.approach] =
        (repliesData.stats.byApproach[thread.approach] || 0) + 1;
      repliesData.stats.lastReply = new Date().toISOString();

      // Recalculate average relevance score
      const scores = repliesData.replies.map(r => r.relevanceScore);
      repliesData.stats.averageRelevanceScore =
        Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);

      // Mark as processed
      markAsProcessed(queue, tweet.id, 'replied');

      threadsPosted++;

      // Save thread details for notification
      allThreadDetails.push({
        product: tweet.product,
        threadPreview: thread.tweets[0].text,
        threadUrl: threadIds[0] ? `https://x.com/BWSCommunity/status/${threadIds[0]}` : null,
        originalTweetText: tweet.text,
        originalTweetUrl: `https://x.com/${tweet.author.username}/status/${tweet.id}`,
        originalAuthor: tweet.author.username,
        relevanceScore: evaluation.relevanceScore,
        approach: thread.approach
      });

      console.log(`\n✅ Thread posted successfully!`);

      // Delay before next thread
      if (threadsPosted < tweetsToProcess.length) {
        const delaySeconds = config.antiSpam.delayBetweenReplies / 1000;
        console.log(`\n⏳ Waiting ${delaySeconds}s before next thread...`);
        await sleep(config.antiSpam.delayBetweenReplies);
      }

    } catch (error) {
      console.error(`\n❌ Error processing tweet ${tweet.id}:`, error.message);
      errors.push({
        tweetId: tweet.id,
        product: tweet.product,
        error: error.message
      });
      markAsProcessed(queue, tweet.id, 'error');
    }
  }

  // Clean up old tweets from queue
  const cleanupThreshold = config.freshnessFilter.cleanupThresholdHours;
  const beforeCleanup = queue.tweets.length;
  queue.tweets = queue.tweets.filter(t =>
    isTweetFresh(t, cleanupThreshold) || t.processed
  );
  const removed = beforeCleanup - queue.tweets.length;

  if (removed > 0) {
    console.log(`\n🗑️  Cleaned up ${removed} old tweets (> ${cleanupThreshold}h)`);
  }

  // Update queue stats
  queue.stats.lastRun = new Date().toISOString();
  for (const product of Object.keys(queue.stats.byProduct)) {
    queue.stats.byProduct[product] = {
      total: queue.tweets.filter(t => t.product === product).length,
      unprocessed: queue.tweets.filter(t => t.product === product && !t.processed).length,
      processed: queue.tweets.filter(t => t.product === product && t.processed).length
    };
  }

  // Save updates
  await saveProductQueue(queue);
  await saveProductReplies(repliesData);

  // Send Zapier notification
  try {
    console.log('\n🔔 Sending Zapier notification...');

    await sendProductReplyNotification({
      success: errors.length === 0,
      tweetsEvaluated,
      tweetsSkipped: tweetsEvaluated - threadsPosted,
      threadsPosted,
      totalThreads: repliesData.stats.totalThreads,
      averageRelevance: repliesData.stats.averageRelevanceScore,
      byProduct: repliesData.stats.byProduct,
      byApproach: repliesData.stats.byApproach,
      queueSize: queue.tweets.filter(t => !t.processed).length,
      allThreadDetails,
      runUrl: process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
        ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
        : null
    });

    console.log('✅ Zapier notification sent successfully');
  } catch (notificationError) {
    console.error('⚠️  Failed to send Zapier notification:', notificationError.message);
  }

  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n${'='.repeat(70)}`);
  console.log(`✅ Reply Automation Complete (${duration}s)`);
  console.log(`${'='.repeat(70)}`);
  console.log(`\n📊 Session Stats:`);
  console.log(`   - Tweets evaluated: ${tweetsEvaluated}`);
  console.log(`   - Threads posted: ${threadsPosted}/${maxThreadsThisRun} (this run)`);
  console.log(`   - Today total: ${todayThreadCount + threadsPosted}/${config.maxThreadsPerDay}`);
  console.log(`   - Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log(`\n⚠️  Errors:`);
    errors.forEach(e => {
      console.log(`   - ${e.product} (${e.tweetId}): ${e.error}`);
    });
  }

  console.log(`\n📈 Overall Stats:`);
  console.log(`   - Total threads: ${repliesData.stats.totalThreads}`);
  console.log(`   - Average relevance: ${repliesData.stats.averageRelevanceScore}`);
  console.log(`\n📦 By Product:`);
  for (const [product, count] of Object.entries(repliesData.stats.byProduct)) {
    console.log(`   - ${product}: ${count} threads`);
  }

  console.log(`\n📋 By Approach:`);
  for (const [approach, count] of Object.entries(repliesData.stats.byApproach)) {
    console.log(`   - ${approach}: ${count} threads`);
  }

  console.log('\n✨ Reply automation complete!\n');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  replyToProductTweets().catch(error => {
    console.error('\n❌ Reply automation failed:', error);
    process.exit(1);
  });
}

export { replyToProductTweets };
