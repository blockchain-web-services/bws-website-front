/**
 * Product-Specific Reply Automation
 * Processes product discovery queue and posts educational threads
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
import { fetchProductDocs } from '../utils/docs-fetcher.js';
import { generateEducationalThread } from '../utils/thread-generator.js';
import { postThread, previewThread } from '../utils/twitter-thread-client.js';
import { createReadWriteClient, followUser, likeTweet } from '../utils/twitter-client.js';
import { evaluateTweetForReply } from '../utils/claude-client.js';
import { sleep } from '../utils/kol-utils.js';

const __dirname = __scriptsDir;

/**
 * Load product reply configuration
 */
async function loadReplyConfig() {
  const configPath = path.join(__dirname, '..', 'config', 'product-reply-config.json');
  const data = await fs.readFile(configPath, 'utf-8');
  return JSON.parse(data);
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
  const { repliesPerRun, productRotation } = config;

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

  // Select tweets, rotating through products
  let productIndex = 0;
  while (selected.length < repliesPerRun && products.length > 0) {
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
 * Main reply automation
 */
async function replyToProductTweets() {
  console.log('🧵 Starting Product-Specific Reply Automation...');
  console.log(`📍 Script: reply-to-product-tweets.js\n`);

  const startTime = Date.now();

  // Load configuration
  const config = await loadReplyConfig();
  const queue = await loadProductQueue();
  const repliesData = await loadProductReplies();

  // Load product highlights for product information
  const highlightsPath = path.join(__dirname, '..', 'config', 'product-highlights.json');
  const highlightsData = await fs.readFile(highlightsPath, 'utf-8');
  const productsInfo = JSON.parse(highlightsData);

  console.log('📋 Configuration:');
  console.log(`   - Replies per run: ${config.repliesPerRun}`);
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

  // Select tweets to process (with product rotation)
  const tweetsToProcess = selectTweetsToProcess(
    unprocessed,
    config,
    repliesData.replies
  );

  console.log(`🎯 Selected ${tweetsToProcess.length} tweets for processing:`);
  tweetsToProcess.forEach((t, i) => {
    console.log(`   ${i + 1}. ${t.product} - ${t.text.substring(0, 60)}...`);
  });

  // Process each tweet
  let threadsPosted = 0;
  const errors = [];

  for (const tweet of tweetsToProcess) {
    try {
      console.log(`\n${'='.repeat(70)}`);
      console.log(`Processing Tweet ${threadsPosted + 1}/${tweetsToProcess.length}`);
      console.log(`${'='.repeat(70)}`);
      console.log(`Product: ${tweet.product}`);
      console.log(`Tweet ID: ${tweet.id}`);
      console.log(`Author: @${tweet.author.username}`);
      console.log(`Text: "${tweet.text}"`);
      console.log(`Engagement: ${tweet.public_metrics.like_count} likes, ${tweet.public_metrics.retweet_count} RTs`);

      // Load product information
      const productInfo = productsInfo.productHighlights[tweet.product];
      if (!productInfo) {
        throw new Error(`Product info not found for: ${tweet.product}`);
      }

      // Fetch documentation
      const docsContent = await fetchProductDocs(tweet.product, productInfo.docsPath);

      // Evaluate relevance with Claude AI
      console.log(`\n🤖 Evaluating tweet relevance...`);
      const evaluation = await evaluateTweetForReply(
        tweet.text,
        tweet.product,
        productInfo
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
        productInfo,
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
          await followUser(tweet.author.username);
          console.log(`   ✅ Followed @${tweet.author.username}`);
        } catch (error) {
          console.warn(`   ⚠️  Could not follow user: ${error.message}`);
        }
      }

      if (config.antiSpam.likeTweet) {
        try {
          await likeTweet(tweet.id);
          console.log(`   ✅ Liked tweet ${tweet.id}`);
        } catch (error) {
          console.warn(`   ⚠️  Could not like tweet: ${error.message}`);
        }
      }

      // Post the thread
      const threadIds = await postThread(
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
        threadPreview: thread.tweets[0].text.substring(0, 100)
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

  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n${'='.repeat(70)}`);
  console.log(`✅ Reply Automation Complete (${duration}s)`);
  console.log(`${'='.repeat(70)}`);
  console.log(`\n📊 Session Stats:`);
  console.log(`   - Threads posted: ${threadsPosted}/${tweetsToProcess.length}`);
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
