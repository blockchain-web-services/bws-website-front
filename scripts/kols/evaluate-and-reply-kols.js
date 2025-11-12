// Load environment variables from .env file (local dev only, GitHub Actions uses secrets)
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __scriptsDir = path.dirname(__filename);
const worktreeRoot = path.resolve(__scriptsDir, '../..');
dotenv.config({ path: path.join(worktreeRoot, '.env') });

import {
  loadConfig,
  loadBWSProducts,
  loadKolsData,
  saveKolsData,
  loadRepliesData,
  saveRepliesData,
  loadProcessedPosts,
  saveProcessedPosts,
  RateLimiter,
  getTodayDateString,
  hasReachedDailyLimit,
  hasRepliedRecentlyToKol,
  sleep,
  getNextFeaturedProducts,
  prioritizeKolsWithRandomization
} from './utils/kol-utils.js';
import { runAmplifiedTweetSearch } from './utils/amplified-search.js';
import { generateMultipleRandomCrons } from '../utils/schedule-randomizer.js';
import { updateAndCommitSchedule, isGitHubActions } from '../utils/workflow-updater.js';
import fs from 'fs/promises';

const __dirname = __scriptsDir;
const ENGAGING_POSTS_PATH = path.join(__dirname, 'data/engaging-posts.json');
import {
  createReadOnlyClient,
  createReadWriteClient,
  getUserTweets,
  getUserTweetsViaSearch,
  postReply,
  followUser,
  likeTweet,
  apiTracker
} from './utils/twitter-client.js';
import usageLogger from './utils/api-usage-logger.js';
import { sendReplyNotification, sendErrorNotification } from './utils/zapier-webhook.js';
import {
  createClaudeClient,
  evaluateTweetForReply,
  generateReplyText
} from './utils/claude-client.js';

/**
 * Load engaging posts from ScrapFly discovery
 */
async function loadEngagingPosts() {
  try {
    const data = JSON.parse(await fs.readFile(ENGAGING_POSTS_PATH, 'utf-8'));

    // Filter out expired and already processed posts
    const now = new Date().getTime();
    const validPosts = (data.posts || []).filter(post => {
      if (post.processed) return false;
      if (post.expiresAt) {
        const expiresAt = new Date(post.expiresAt).getTime();
        if (expiresAt < now) return false;
      }
      return true;
    });

    return { ...data, posts: validPosts };
  } catch (error) {
    console.log('⚠️  No engaging posts file found or error loading it');
    return { posts: [], metadata: {} };
  }
}

/**
 * Save updated engaging posts
 */
async function saveEngagingPosts(data) {
  try {
    await fs.writeFile(ENGAGING_POSTS_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to save engaging posts:', error.message);
  }
}

/**
 * Main Evaluation and Reply Script
 * Evaluates KOL posts and generates contextual replies
 */

async function evaluateAndReply() {
  console.log('🚀 Starting KOL Tweet Evaluation and Reply Process...');
  console.log(`📍 Script: evaluate-and-reply-kols.js\n`);

  // Reset API tracker for this execution
  apiTracker.reset();

  let currentPhase = 'initialization';
  let lastSuccessfulOperation = null;

  // Load configuration and products
  currentPhase = 'loading_config';
  console.log(`📍 Phase: ${currentPhase}`);
  const config = loadConfig();
  lastSuccessfulOperation = 'config_loaded';

  currentPhase = 'loading_products';
  const bwsProducts = loadBWSProducts();
  lastSuccessfulOperation = 'products_loaded';
  const { maxRepliesPerRun, maxRepliesPerDay, maxRepliesPerKolPerWeek, minRelevanceScoreForReply, minTimeBetweenRepliesMinutes, dryRun, antiSpamActions } = config.replySettings;
  const maxRepliesThisRun = maxRepliesPerRun || maxRepliesPerDay;

  // Default anti-spam settings if not specified
  const antiSpam = antiSpamActions || {
    followKolBeforeReply: true,
    likeTweetBeforeReply: true,
    onlyIfNotAlreadyFollowing: true,
    skipOnError: true
  };

  if (Object.keys(bwsProducts).length === 0) {
    console.error('❌ No BWS products loaded. Check scripts/data/docs-index.json exists.');
    process.exit(1);
  }

  console.log(`📊 Configuration:
   - Max replies this run: ${maxRepliesThisRun}
   - Max replies per day: ${maxRepliesPerDay}
   - Max replies per KOL per week: ${maxRepliesPerKolPerWeek}
   - Min relevance score: ${minRelevanceScoreForReply}
   - Min time between replies: ${minTimeBetweenRepliesMinutes} minutes
   - Dry run mode: ${dryRun ? '✅ ON (no actual posts)' : '❌ OFF (will post)'}
   - Anti-spam actions:
     • Follow KOL: ${antiSpam.followKolBeforeReply ? '✅' : '❌'}
     • Like tweet: ${antiSpam.likeTweetBeforeReply ? '✅' : '❌'}
`);

  // Initialize clients
  currentPhase = 'initializing_twitter_client';
  console.log(`📍 Phase: ${currentPhase}`);
  const readClient = createReadOnlyClient();
  lastSuccessfulOperation = 'read_client_initialized';

  let writeClient = null;

  if (!dryRun) {
    try {
      writeClient = createReadWriteClient();
      console.log('✅ Twitter write client initialized\n');
    } catch (error) {
      console.error('❌ Failed to initialize write client. Running in dry-run mode.');
      console.error(`   Error: ${error.message}\n`);
      config.replySettings.dryRun = true;
    }
  }

  const claudeClient = createClaudeClient();

  // Initialize rate limiters
  const twitterLimiter = new RateLimiter(config.rateLimits.twitterApiCallsPerMinute);
  const claudeLimiter = new RateLimiter(config.rateLimits.claudeApiCallsPerMinute);

  // Load data
  const kolsData = loadKolsData();
  const repliesData = loadRepliesData();
  const processedPosts = loadProcessedPosts();
  const engagingPostsData = await loadEngagingPosts();

  // Check daily limit
  if (hasReachedDailyLimit(repliesData, maxRepliesPerDay)) {
    console.log(`⚠️  Daily reply limit (${maxRepliesPerDay}) already reached. Exiting.`);
    process.exit(0);
  }

  const activeKols = kolsData.kols.filter(k => k.status === 'active');

  if (activeKols.length === 0) {
    console.log('❌ No active KOLs found in database. Run discover-kols.js first.');
    process.exit(1);
  }

  console.log(`📋 Found ${activeKols.length} active KOLs`);
  console.log(`📰 Found ${engagingPostsData.posts.length} unprocessed engaging posts\n`);

  // Prioritize KOLs with stratified randomization
  // Groups by quality tier, then randomizes within each tier for variety
  const prioritizedKols = prioritizeKolsWithRandomization(activeKols);

  console.log(`🎲 Randomized KOL order within quality tiers for natural engagement\n`);

  const today = getTodayDateString();
  let todayReplies = repliesData.dailyStats[today]?.repliesPosted || 0;
  let repliesPosted = 0;
  let tweetEvaluated = 0;
  let tweetsSkipped = 0;
  let lastReplyDetails = null;  // Track last successful reply for notification

  console.log('🔍 Evaluating recent tweets from KOLs...\n');

  // Process KOLs
  for (const kol of prioritizedKols) {
    // Check if we've reached run limit or daily limit
    if (repliesPosted >= maxRepliesThisRun) {
      console.log(`\n⚠️  Reached run reply limit (${maxRepliesThisRun}). Stopping.`);
      break;
    }
    if (todayReplies + repliesPosted >= maxRepliesPerDay) {
      console.log(`\n⚠️  Reached daily reply limit (${maxRepliesPerDay}). Stopping.`);
      break;
    }

    // Check if we've recently replied to this KOL
    if (hasRepliedRecentlyToKol(repliesData, kol.id, maxRepliesPerKolPerWeek)) {
      console.log(`⏭️  Skipping @${kol.username} (already replied this week)`);
      continue;
    }

    console.log(`\n📍 Processing @${kol.username} (${kol.cryptoRelevanceScore}% crypto relevance)`);

    try {
      // Fetch recent tweets via Search API (60 calls/15min vs userTimeline's 10 calls/15min)
      currentPhase = `fetching_tweets_for_${kol.username}`;
      lastSuccessfulOperation = `processing_kol_${kol.username}`;
      await twitterLimiter.throttle();

      const tweets = await getUserTweetsViaSearch(readClient, kol.username, 100);
      lastSuccessfulOperation = `fetched_tweets_for_${kol.username}`;

      // Filter tweets: only last 6 hours (preferred) or max 24 hours
      const now = new Date();
      const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const tweetsArray = tweets.filter(tweet => {
        // Check if already processed
        if (processedPosts.repliedTweetIds.includes(tweet.id) ||
            processedPosts.skippedTweetIds.includes(tweet.id)) {
          return false;
        }

        // Check tweet age (max 24 hours)
        if (tweet.created_at) {
          const tweetDate = new Date(tweet.created_at);
          if (tweetDate < twentyFourHoursAgo) {
            return false;
          }
        }

        return true;
      });

      if (tweetsArray.length === 0) {
        console.log(`   No new tweets to process`);
        continue;
      }

      console.log(`   Found ${tweetsArray.length} new tweets`);

      // Evaluate each tweet
      for (const tweet of tweetsArray) {
        tweetEvaluated++;

        // Check limits again
        if (repliesPosted >= maxRepliesThisRun) {
          break;
        }
        if (todayReplies + repliesPosted >= maxRepliesPerDay) {
          break;
        }

        console.log(`\n   📝 Tweet ${tweet.id.slice(-6)}...`);
        console.log(`      "${tweet.text.substring(0, 100)}${tweet.text.length > 100 ? '...' : ''}"`);
        console.log(`      Likes: ${tweet.public_metrics?.like_count || 0}, Retweets: ${tweet.public_metrics?.retweet_count || 0}`);

        // Get featured products using round-robin
        const featured = getNextFeaturedProducts(processedPosts, bwsProducts, config);
        console.log(`      🎯 Featured product: ${featured.productNames.join(', ')} ${featured.isPriority ? '(Priority)' : ''}`);
        console.log(`      📝 Positioning: ${featured.positioningPhrase}`);

        // Evaluate with Claude
        await claudeLimiter.throttle();
        console.log(`      🤖 Evaluating with Claude...`);

        const evaluation = await evaluateTweetForReply(
          claudeClient,
          tweet,
          kol,
          featured.products,  // Use featured products instead of all products
          config
        );

        console.log(`      Should Reply: ${evaluation.shouldReply ? '✅' : '❌'}`);
        console.log(`      Relevance Score: ${evaluation.relevanceScore}%`);
        console.log(`      Best Product: ${evaluation.bestMatchingProduct || 'None'}`);
        console.log(`      Category: ${evaluation.tweetCategory}`);

        if (evaluation.riskFactors && evaluation.riskFactors.length > 0) {
          console.log(`      ⚠️  Risk Factors: ${evaluation.riskFactors.join(', ')}`);
        }

        // Check if we should reply
        if (!evaluation.shouldReply ||
            !evaluation.bestMatchingProduct ||
            evaluation.relevanceScore < minRelevanceScoreForReply) {
          console.log(`      ⏭️  Skipped: ${evaluation.reasoning}`);
          tweetsSkipped++;

          // Mark tweet as skipped to avoid re-evaluation
          processedPosts.skippedTweetIds.push(tweet.id);

          continue;
        }

        // Generate reply
        await claudeLimiter.throttle();
        console.log(`      ✍️  Generating reply...`);

        // Handle multiple products - extract first product name
        let productKey = evaluation.bestMatchingProduct;

        // Handle "Multiple (Product1, Product2)" format
        if (productKey && productKey.toLowerCase().startsWith('multiple')) {
          // Extract first product from parentheses
          const match = productKey.match(/\(([^,)]+)/);
          productKey = match ? match[1].trim() : productKey;
        }

        // Handle comma-separated format
        if (productKey && productKey.includes(',')) {
          productKey = productKey.split(',')[0].trim();
        }

        // Strip parenthetical notes like "(Marketplace Solution)" or "(Platform API)"
        if (productKey) {
          productKey = productKey.replace(/\s*\([^)]*\)\s*/g, '').trim();
        }

        const product = bwsProducts[productKey];
        if (!product) {
          console.log(`      ⚠️  Product not found: ${productKey}`);
          console.log(`      Available products: ${Object.keys(bwsProducts).join(', ')}`);
          tweetsSkipped++;
          continue;
        }

        // Get recent replies for diversity context
        const maxRecentReplies = config.contentDiversity?.maxRecentRepliesToInclude || 3;
        const recentReplies = (repliesData.replies || [])
          .filter(r => r.status === 'posted')
          .slice(-maxRecentReplies)
          .reverse(); // Most recent first

        const replyGeneration = await generateReplyText(
          claudeClient,
          tweet,
          kol,
          product,
          evaluation,
          featured.positioningPhrase,  // Dynamic positioning phrase
          recentReplies,  // Recent replies for diversity
          featured.specialNotes  // Pass special notes (e.g., Fan Game Cube iGaming)
        );

        console.log(`      💬 Reply: "${replyGeneration.replyText}"`);
        console.log(`      Tone: ${replyGeneration.tone}`);

        // Post reply
        let replyStatus = 'pending';
        let replyTweetId = null;
        let error = null;

        try {
          // Anti-spam actions: Follow and Like before replying
          if (!dryRun && writeClient && antiSpam) {
            // Like the original tweet
            if (antiSpam.likeTweetBeforeReply) {
              try {
                console.log(`      👍 Liking original tweet...`);
                const likeResult = await likeTweet(writeClient, tweet.id);
                if (likeResult.success) {
                  console.log(`      ✅ Liked tweet successfully`);
                } else if (!antiSpam.skipOnError) {
                  throw new Error(`Failed to like tweet: ${likeResult.error}`);
                } else {
                  console.log(`      ⚠️  Failed to like (continuing): ${likeResult.error}`);
                }
              } catch (likeError) {
                if (!antiSpam.skipOnError) {
                  throw likeError;
                }
                console.log(`      ⚠️  Like error (continuing): ${likeError.message}`);
              }
            }

            // Follow the KOL
            if (antiSpam.followKolBeforeReply) {
              try {
                console.log(`      👤 Following @${kol.username}...`);
                const followResult = await followUser(writeClient, kol.id);
                if (followResult.success) {
                  console.log(`      ✅ Followed successfully`);
                } else if (!antiSpam.skipOnError) {
                  throw new Error(`Failed to follow user: ${followResult.error}`);
                } else {
                  console.log(`      ⚠️  Failed to follow (continuing): ${followResult.error}`);
                }
              } catch (followError) {
                if (!antiSpam.skipOnError) {
                  throw followError;
                }
                console.log(`      ⚠️  Follow error (continuing): ${followError.message}`);
              }
            }

            // Small delay after anti-spam actions
            await sleep(2000); // 2 seconds
          }

          await twitterLimiter.throttle();

          const clientToUse = dryRun ? readClient : writeClient;
          const result = await postReply(
            clientToUse,
            tweet.id,
            replyGeneration.replyText,
            dryRun
          );

          replyTweetId = result.data?.id || null;
          replyStatus = dryRun ? 'dry-run' : 'posted';

          console.log(`      ✅ ${dryRun ? 'DRY RUN - Would post' : 'Posted successfully'}!`);

          repliesPosted++;

          // Track last successful reply details for notification
          lastReplyDetails = {
            replyText: replyGeneration.replyText,
            replyUrl: replyTweetId ? `https://twitter.com/bws_official/status/${replyTweetId}` : null,
            originalTweetText: tweet.text,
            originalTweetUrl: `https://twitter.com/${kol.username}/status/${tweet.id}`,
            kolUsername: kol.username
          };

          // Mark tweet as replied
          processedPosts.repliedTweetIds.push(tweet.id);

        } catch (postError) {
          error = postError.message;
          replyStatus = 'failed';
          console.error(`      ❌ Failed to post: ${error}`);

          // Mark as skipped if posting failed (don't retry failed posts)
          processedPosts.skippedTweetIds.push(tweet.id);
        }

        // Record reply
        const replyRecord = {
          id: `${kol.id}-${tweet.id}-${Date.now()}`,
          tweetId: tweet.id,
          tweetUrl: `https://twitter.com/${kol.username}/status/${tweet.id}`,
          kolId: kol.id,
          kolUsername: kol.username,
          originalTweetText: tweet.text,
          replyTweetId,
          replyText: replyGeneration.replyText,
          productMentioned: evaluation.bestMatchingProduct,
          relevanceScore: evaluation.relevanceScore,
          timestamp: new Date().toISOString(),
          status: replyStatus,
          dryRun,
          engagement: {
            likes: 0,
            retweets: 0,
            replies: 0,
            views: 0,
            lastChecked: new Date().toISOString()
          },
          error
        };

        repliesData.replies.push(replyRecord);

        // Update daily stats
        if (!repliesData.dailyStats[today]) {
          repliesData.dailyStats[today] = {
            repliesPosted: 0,
            repliesFailed: 0,
            averageRelevance: 0,
            productDistribution: {}
          };
        }

        if (replyStatus === 'posted' || replyStatus === 'dry-run') {
          repliesData.dailyStats[today].repliesPosted++;
        } else {
          repliesData.dailyStats[today].repliesFailed++;
        }

        if (!repliesData.dailyStats[today].productDistribution[evaluation.bestMatchingProduct]) {
          repliesData.dailyStats[today].productDistribution[evaluation.bestMatchingProduct] = 0;
        }
        repliesData.dailyStats[today].productDistribution[evaluation.bestMatchingProduct]++;

        // Update KOL engagement history
        kol.engagementHistory.repliedTo++;
        if (replyStatus === 'posted') {
          kol.engagementHistory.successfulReplies++;
        } else if (replyStatus === 'failed') {
          kol.engagementHistory.failedReplies++;
        }
        kol.engagementHistory.lastEngagement = new Date().toISOString();
        kol.lastTweetAnalyzed = tweet.id;

        // Save progress periodically
        if (repliesPosted % 2 === 0) {
          saveRepliesData(repliesData);
          saveProcessedPosts(processedPosts);
          saveKolsData(kolsData);
        }

        // Wait between replies to avoid spam detection
        if (repliesPosted < maxRepliesThisRun && todayReplies + repliesPosted < maxRepliesPerDay) {
          const waitTime = minTimeBetweenRepliesMinutes * 60 * 1000;
          console.log(`      ⏸️  Waiting ${minTimeBetweenRepliesMinutes} minutes before next reply...`);
          await sleep(waitTime);
        }
      }

    } catch (error) {
      console.error(`   ❌ Error processing @${kol.username} in phase: ${currentPhase}`);
      console.error(`   Last successful operation: ${lastSuccessfulOperation}`);
      console.error(`   Error: ${error.message}`);

      // Check for rate limit errors
      if (error.message && (error.message.includes('429') || error.message.includes('rate limit'))) {
        console.error(`   ⚠️  RATE LIMIT HIT - Twitter API returned 429`);
        console.error(`   API Tracker stats before error:`);
        console.error(`   - Total calls: ${apiTracker.exportStats().overall.totalCalls}`);
        console.error(`   - Calls/min: ${apiTracker.exportStats().overall.callsPerMinute}`);

        // If we hit rate limit, stop processing more KOLs
        console.log(`\n⏸️  Stopping due to rate limit. Will resume on next run.`);
        break;
      }

      continue;
    }
  }

  // Process engaging posts from ScrapFly discovery
  if (engagingPostsData.posts.length > 0) {
    console.log('\n🔍 Processing engaging posts from search discovery...\n');
  } else if (repliesPosted === 0) {
    // No engaging posts and no replies posted yet - trigger amplified search
    console.log('\n🔍 No engaging posts found and no replies posted. Triggering amplified tweet search...');
    try {
      const amplifiedPosts = await runAmplifiedTweetSearch(bwsProducts, config, processedPosts);

      if (amplifiedPosts.length > 0) {
        console.log(`\n💬 Amplified search found ${amplifiedPosts.length} relevant tweets!`);
        console.log('   Adding to engaging posts for processing...\n');
        engagingPostsData.posts.push(...amplifiedPosts);
      } else {
        console.log('   ⚠️  No suitable tweets found in amplified search\n');
      }
    } catch (amplifiedError) {
      console.error(`\n❌ Amplified tweet search failed: ${amplifiedError.message}\n`);
    }
  }

  if (engagingPostsData.posts.length > 0) {
    console.log('\n🔍 Processing engaging posts from search discovery...\n');

    for (const post of engagingPostsData.posts) {
      // Check if we've reached run limit or daily limit
      if (repliesPosted >= maxRepliesThisRun) {
        console.log(`\n⚠️  Reached run reply limit (${maxRepliesThisRun}). Stopping.`);
        break;
      }
      if (todayReplies + repliesPosted >= maxRepliesPerDay) {
        console.log(`\n⚠️  Reached daily reply limit (${maxRepliesPerDay}). Stopping.`);
        break;
      }

      // Skip if already processed (double-check)
      if (processedPosts.repliedTweetIds.includes(post.id) ||
          processedPosts.skippedTweetIds.includes(post.id)) {
        continue;
      }

      console.log(`\n📍 Processing post from @${post.username}`);
      console.log(`   Category: ${post.category}`);

      try {
        tweetEvaluated++;

        console.log(`\n   📝 Tweet ${post.id.slice(-6)}...`);
        console.log(`      "${post.text.substring(0, 100)}${post.text.length > 100 ? '...' : ''}"`);
        console.log(`      Likes: ${post.likes || 0}, Retweets: ${post.retweets || 0}, Views: ${post.views || 0}`);

        // Create a mock KOL object for evaluation (we don't have full KOL data)
        const mockKol = {
          id: `engaging_post_${post.username}`,
          username: post.username,
          displayName: post.displayName || post.username,
          cryptoRelevanceScore: 80, // Assume relevant since it came from targeted search
          verified: post.verified || false
        };

        // Get featured products
        const featured = getNextFeaturedProducts(processedPosts, bwsProducts, config);
        console.log(`      🎯 Featured product: ${featured.productNames.join(', ')} ${featured.isPriority ? '(Priority)' : ''}`);
        console.log(`      📝 Positioning: ${featured.positioningPhrase}`);

        // Evaluate with Claude
        await claudeLimiter.throttle();
        console.log(`      🤖 Evaluating with Claude...`);

        const evaluation = await evaluateTweetForReply(
          claudeClient,
          post, // Post has same structure as tweet
          mockKol,
          featured.products,
          config
        );

        console.log(`      Should Reply: ${evaluation.shouldReply ? '✅' : '❌'}`);
        console.log(`      Relevance Score: ${evaluation.relevanceScore}%`);
        console.log(`      Best Product: ${evaluation.bestMatchingProduct || 'None'}`);
        console.log(`      Category: ${evaluation.tweetCategory}`);

        if (evaluation.riskFactors && evaluation.riskFactors.length > 0) {
          console.log(`      ⚠️  Risk Factors: ${evaluation.riskFactors.join(', ')}`);
        }

        // Mark post as processed regardless of outcome
        post.processed = true;

        // Check if we should reply
        if (!evaluation.shouldReply ||
            !evaluation.bestMatchingProduct ||
            evaluation.relevanceScore < minRelevanceScoreForReply) {
          console.log(`      ⏭️  Skipped: ${evaluation.reasoning}`);
          tweetsSkipped++;
          processedPosts.skippedTweetIds.push(post.id);
          continue;
        }

        // Generate reply
        await claudeLimiter.throttle();
        console.log(`      ✍️  Generating reply...`);

        // Extract product key
        let productKey = evaluation.bestMatchingProduct;
        if (productKey && productKey.toLowerCase().startsWith('multiple')) {
          const match = productKey.match(/\(([^,)]+)/);
          productKey = match ? match[1].trim() : productKey;
        }
        if (productKey && productKey.includes(',')) {
          productKey = productKey.split(',')[0].trim();
        }

        const product = bwsProducts[productKey];
        if (!product) {
          console.log(`      ⚠️  Product not found: ${productKey}`);
          tweetsSkipped++;
          processedPosts.skippedTweetIds.push(post.id);
          continue;
        }

        // Get recent replies for diversity
        const maxRecentReplies = config.contentDiversity?.maxRecentRepliesToInclude || 3;
        const recentReplies = (repliesData.replies || [])
          .filter(r => r.status === 'posted')
          .slice(-maxRecentReplies)
          .reverse();

        const replyGeneration = await generateReplyText(
          claudeClient,
          post,
          mockKol,
          product,
          evaluation,
          featured.positioningPhrase,
          recentReplies,
          featured.specialNotes
        );

        console.log(`      💬 Reply: "${replyGeneration.replyText}"`);
        console.log(`      Tone: ${replyGeneration.tone}`);

        // Post reply
        let replyStatus = 'pending';
        let replyTweetId = null;
        let error = null;

        try {
          await twitterLimiter.throttle();

          const clientToUse = dryRun ? readClient : writeClient;
          const result = await postReply(
            clientToUse,
            post.id,
            replyGeneration.replyText,
            dryRun
          );

          replyTweetId = result.data?.id || null;
          replyStatus = dryRun ? 'dry-run' : 'posted';

          console.log(`      ✅ ${dryRun ? 'DRY RUN - Would post' : 'Posted successfully'}!`);

          repliesPosted++;

          // Track last successful reply
          lastReplyDetails = {
            replyText: replyGeneration.replyText,
            replyUrl: replyTweetId ? `https://twitter.com/bws_official/status/${replyTweetId}` : null,
            originalTweetText: post.text,
            originalTweetUrl: `https://twitter.com/${post.username}/status/${post.id}`,
            kolUsername: post.username
          };

          processedPosts.repliedTweetIds.push(post.id);

        } catch (postError) {
          error = postError.message;
          replyStatus = 'failed';
          console.error(`      ❌ Failed to post: ${error}`);
          processedPosts.skippedTweetIds.push(post.id);
        }

        // Record reply
        const replyRecord = {
          id: `engaging_${post.id}-${Date.now()}`,
          tweetId: post.id,
          tweetUrl: `https://twitter.com/${post.username}/status/${post.id}`,
          kolId: mockKol.id,
          kolUsername: post.username,
          originalTweetText: post.text,
          replyTweetId,
          replyText: replyGeneration.replyText,
          productMentioned: evaluation.bestMatchingProduct,
          relevanceScore: evaluation.relevanceScore,
          timestamp: new Date().toISOString(),
          status: replyStatus,
          dryRun,
          source: 'engaging_post', // Mark source
          category: post.category,
          engagement: {
            likes: 0,
            retweets: 0,
            replies: 0,
            views: 0,
            lastChecked: new Date().toISOString()
          },
          error
        };

        repliesData.replies.push(replyRecord);

        // Update daily stats
        if (!repliesData.dailyStats[today]) {
          repliesData.dailyStats[today] = {
            repliesPosted: 0,
            repliesFailed: 0,
            averageRelevance: 0,
            productDistribution: {}
          };
        }

        if (replyStatus === 'posted' || replyStatus === 'dry-run') {
          repliesData.dailyStats[today].repliesPosted++;
        } else {
          repliesData.dailyStats[today].repliesFailed++;
        }

        if (!repliesData.dailyStats[today].productDistribution[evaluation.bestMatchingProduct]) {
          repliesData.dailyStats[today].productDistribution[evaluation.bestMatchingProduct] = 0;
        }
        repliesData.dailyStats[today].productDistribution[evaluation.bestMatchingProduct]++;

        // Save progress periodically
        if (repliesPosted % 2 === 0) {
          saveRepliesData(repliesData);
          saveProcessedPosts(processedPosts);
          await saveEngagingPosts(engagingPostsData);
        }

        // Wait between replies
        if (repliesPosted < maxRepliesThisRun && todayReplies + repliesPosted < maxRepliesPerDay) {
          const waitTime = minTimeBetweenRepliesMinutes * 60 * 1000;
          console.log(`      ⏸️  Waiting ${minTimeBetweenRepliesMinutes} minutes before next reply...`);
          await sleep(waitTime);
        }

      } catch (error) {
        console.error(`   ❌ Error processing post: ${error.message}`);
        post.processed = true; // Mark as processed even on error
        continue;
      }
    }

    // Save updated engaging posts (all marked as processed)
    await saveEngagingPosts(engagingPostsData);
  }

  // Calculate average relevance for today
  const todayRepliesArray = repliesData.replies.filter(r => r.timestamp.startsWith(today));
  if (todayRepliesArray.length > 0) {
    const avgRelevance = todayRepliesArray.reduce((sum, r) => sum + r.relevanceScore, 0) / todayRepliesArray.length;
    repliesData.dailyStats[today].averageRelevance = Math.round(avgRelevance);
  }

  // Final save
  saveRepliesData(repliesData);
  saveProcessedPosts(processedPosts);
  saveKolsData(kolsData);

  // Print summary
  console.log(`\n
${'='.repeat(60)}
📊 REPLY SUMMARY
${'='.repeat(60)}

Tweets Evaluated: ${tweetEvaluated}
Tweets Skipped: ${tweetsSkipped}
Replies Posted (this run): ${repliesPosted}
Replies Posted Today: ${todayReplies + repliesPosted}/${maxRepliesPerDay}
Total Replies All Time: ${repliesData.replies.length}

${dryRun ? '⚠️  DRY RUN MODE - No actual tweets posted' : ''}

${'='.repeat(60)}
`);

  // Display API consumption statistics
  apiTracker.displayStats();

  // Display persistent usage tracking
  await usageLogger.displayTodayUsage();

  // Send notification to Zapier/Slack
  // SUCCESS = at least 1 reply posted, FAILURE = no replies posted
  await sendReplyNotification({
    success: repliesPosted > 0,
    tweetsEvaluated: tweetEvaluated,
    tweetsSkipped,
    repliesPosted,
    todayReplies: todayReplies + repliesPosted,
    maxRepliesPerDay,
    totalReplies: repliesData.replies.length,
    totalKols: kolsData.kols.length,
    activeKols: activeKols.length,
    dryRun,
    replyDetails: lastReplyDetails,  // Include last successful reply details
    apiStats: apiTracker.exportStats(),
    runUrl: process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : null
  });

  console.log('\n✅ Evaluation and reply process complete!');

  // Randomize next run schedule (only on GitHub Actions)
  if (isGitHubActions()) {
    console.log('\n' + '='.repeat(60));
    console.log('\n🎲 Randomizing next run schedules...\n');

    try {
      const config = {
        scheduleDataFile: path.join(__scriptsDir, 'data', 'kol-reply-schedule.json'),
        timeWindow: {
          minHour: 6,   // 6:00 AM UTC
          maxHour: 22   // 10:00 PM UTC (wider window for 4 schedules)
        },
        runConstraints: {
          minHoursBetween: 18,  // Not used for multiple schedules
          maxHoursBetween: 30
        }
      };

      // Generate 4 random schedules evenly distributed throughout the day
      const schedules = generateMultipleRandomCrons(4, config);
      const crons = schedules.map(s => s.cron);

      console.log('   Generated schedules:');
      schedules.forEach((s, i) => {
        console.log(`   ${i + 1}. ${s.cron} (${s.time})`);
      });

      const workflowFile = path.join(__scriptsDir, '..', '.github', 'workflows', 'kol-reply-cycle.yml');
      const updateSuccess = updateAndCommitSchedule(
        crons,
        schedules[0].time,  // Use first schedule time for logging
        workflowFile,
        'KOL reply cycle'
      );

      if (!updateSuccess) {
        console.error('⚠️  Schedule randomization failed, will use existing schedule');
      }
    } catch (scheduleError) {
      console.error('⚠️  Error during schedule randomization:', scheduleError.message);
      console.error('   Continuing with existing schedule');
    }
  } else {
    console.log('\nℹ️  Skipping schedule randomization (not running on GitHub Actions)');
  }
}

// Run the script
evaluateAndReply().catch(async (error) => {
  console.error('\n❌ Fatal error:', error);
  console.error('Stack trace:', error.stack);

  // Build error context with detailed information
  const errorContext = {
    message: error.message,
    type: error.name || 'Error',
  };

  // Check for rate limit errors
  if (error.message && (error.message.includes('429') || error.message.includes('rate limit'))) {
    errorContext.is_rate_limit = true;
    errorContext.note = 'Twitter API rate limit exceeded. Will retry on next scheduled run.';
  }

  // Add API stats if available
  try {
    errorContext.api_stats = apiTracker.exportStats();
  } catch (e) {
    // Ignore if apiTracker not available
  }

  // Send error notification to Zapier/Slack
  await sendErrorNotification({
    scriptName: 'KOL Reply Evaluation',
    error,
    context: errorContext,
    process: 'reply',
    runUrl: process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : null
  });

  process.exit(1);
});
