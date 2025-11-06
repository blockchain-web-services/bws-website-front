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
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENGAGING_POSTS_PATH = path.join(__dirname, 'data/engaging-posts.json');
import {
  createReadOnlyClient,
  createReadWriteClient,
  getUserTweets,
  getUserTweetsViaSearch,
  postReply,
  apiTracker
} from './utils/twitter-client.js';
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
  console.log('🚀 Starting KOL Tweet Evaluation and Reply Process...\n');

  // Reset API tracker for this execution
  apiTracker.reset();

  // Load configuration and products
  const config = loadConfig();
  const bwsProducts = loadBWSProducts();
  const { maxRepliesPerRun, maxRepliesPerDay, maxRepliesPerKolPerWeek, minRelevanceScoreForReply, minTimeBetweenRepliesMinutes, dryRun } = config.replySettings;
  const maxRepliesThisRun = maxRepliesPerRun || maxRepliesPerDay;

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
`);

  // Initialize clients
  const readClient = createReadOnlyClient();
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
      await twitterLimiter.throttle();

      const tweets = await getUserTweetsViaSearch(readClient, kol.username, 100);

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
      console.error(`   ❌ Error processing @${kol.username}: ${error.message}`);
      continue;
    }
  }

  // Process engaging posts from ScrapFly discovery
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
}

// Run the script
evaluateAndReply().catch(async (error) => {
  console.error('\n❌ Fatal error:', error);

  // Send error notification to Zapier/Slack
  await sendErrorNotification({
    scriptName: 'KOL Reply Evaluation',
    error,
    context: {
      api_stats: apiTracker.exportStats()
    },
    runUrl: process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : null
  });

  process.exit(1);
});
