/**
 * Script 2.3.1: Reply to KOL Posts - BWS X SDK Version
 * Reads engaging posts from engaging-posts.json (populated by Script 2.2.1)
 * Evaluates posts with Claude AI and generates contextual replies
 *
 * MIGRATION: Converted from reply-to-kol-posts.js to use BWS X SDK v1.7.0
 * SDK Methods: client.uploadMedia(), client.followUser(), client.likeTweet(), client.postReply()
 * Mode: API (write operations)
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
  loadBWSProducts,
  loadKolsData,
  loadRepliesData,
  saveRepliesData,
  loadProcessedPosts,
  saveProcessedPosts,
  RateLimiter,
  getTodayDateString,
  hasReachedDailyLimit,
  hasRepliedRecentlyToKol,
  sleep,
  getNextFeaturedProducts
} from '../utils/kol-utils.js';
import { generateMultipleRandomCrons } from '../utils/schedule-randomizer.js';
import { updateAndCommitSchedule, isGitHubActions } from '../utils/workflow-updater.js';
import fs from 'fs/promises';
import fsSync from 'fs';
import { XTwitterClient } from '@blockchain-web-services/bws-x-sdk-node';

const __dirname = __scriptsDir;
const ENGAGING_POSTS_PATH = path.join(__dirname, '../data/engaging-posts.json');

// Crawler accounts configuration path
const CRAWLER_ACCOUNTS_PATH = path.join(__dirname, '../config/x-crawler-accounts.json');

import usageLogger from '../utils/api-usage-logger.js';
import { sendReplyNotification, sendErrorNotification } from '../utils/zapier-webhook.js';
import {
  createClaudeClient,
  evaluateTweetForReply,
  generateReplyText,
  selectProductImage
} from '../utils/claude-client.js';

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
 * Load engaging posts with 24-hour freshness filter
 */
async function loadEngagingPosts() {
  try {
    const data = JSON.parse(await fs.readFile(ENGAGING_POSTS_PATH, 'utf-8'));

    const now = new Date().getTime();
    const THIRTY_SIX_HOURS = 36 * 60 * 60 * 1000;
    const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;

    // Separate posts into valid (fresh) and stale (to remove)
    const validPosts = [];
    const stalePosts = [];
    let skippedOld = 0;

    (data.posts || []).forEach(post => {
      // Already processed - keep but don't evaluate
      if (post.processed) {
        validPosts.push(post);
        return;
      }

      // Check tweet age (created_at from Twitter)
      let tweetAge = null;
      if (post.created_at) {
        const createdAt = new Date(post.created_at).getTime();
        tweetAge = now - createdAt;

        // Remove posts older than 48 hours
        if (tweetAge > FORTY_EIGHT_HOURS) {
          stalePosts.push(post);
          return;
        }

        // Skip (but keep in file) posts between 36-48 hours old
        if (tweetAge > THIRTY_SIX_HOURS) {
          validPosts.push(post);
          skippedOld++;
          return;
        }
      } else {
        // No created_at - fallback to addedAt for legacy posts
        console.warn(`⚠️  Post ${post.id} missing created_at, using addedAt`);
        const addedAt = new Date(post.addedAt).getTime();
        tweetAge = now - addedAt;

        if (tweetAge > FORTY_EIGHT_HOURS) {
          stalePosts.push(post);
          return;
        }

        if (tweetAge > THIRTY_SIX_HOURS) {
          validPosts.push(post);
          skippedOld++;
          return;
        }
      }

      // Check expiresAt (legacy system)
      if (post.expiresAt) {
        const expiresAt = new Date(post.expiresAt).getTime();
        if (expiresAt < now) {
          stalePosts.push(post);
          return;
        }
      }

      // Post is fresh (< 24 hours old)
      validPosts.push(post);
    });

    // Log cleanup stats
    if (stalePosts.length > 0) {
      console.log(`🧹 Removing ${stalePosts.length} stale posts (>48 hours old)`);
    }
    if (skippedOld > 0) {
      console.log(`⏭️  Skipping ${skippedOld} posts between 36-48 hours old (too old to reply)`);
    }

    // Calculate fresh posts available for reply
    const freshPosts = validPosts.filter(p => {
      if (p.processed) return false;
      if (!p.created_at) return true; // Legacy posts
      const createdAt = new Date(p.created_at).getTime();
      return (now - createdAt) <= THIRTY_SIX_HOURS;
    });

    console.log(`📋 Found ${freshPosts.length} fresh posts (<36h old) available for reply`);

    return {
      ...data,
      posts: validPosts,
      _removedStale: stalePosts.length > 0 // Flag to trigger save
    };
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
 * Upload image to Twitter using SDK and return media ID
 * @param {XTwitterClient} client - SDK client instance
 * @param {Object} imageMetadata - Image metadata from product
 * @returns {string|null} Media ID for use in tweet, or null if upload failed
 */
async function uploadImageWithSDK(client, imageMetadata) {
  if (!imageMetadata || !imageMetadata.localPath) {
    return null;
  }

  try {
    // Resolve absolute path from public directory
    const absolutePath = path.join(worktreeRoot, 'public', imageMetadata.localPath);

    console.log(`📸 Uploading image: ${imageMetadata.localPath}`);

    // Check if file exists
    try {
      await fs.access(absolutePath);
    } catch (fileError) {
      console.warn(`⚠️  Image file not found: ${absolutePath}`);
      return null;
    }

    // Read image buffer
    const imageBuffer = await fs.readFile(absolutePath);

    // Determine media type from MIME type
    let mediaType = 'image';
    if (imageMetadata.mimeType) {
      if (imageMetadata.mimeType.includes('gif')) {
        mediaType = 'gif';
      } else if (imageMetadata.mimeType.includes('video')) {
        mediaType = 'video';
      }
    }

    // SDK METHOD: client.uploadMedia() replaces client.v1.uploadMedia()
    const result = await client.uploadMedia({
      buffer: imageBuffer,
      mediaType,
      altText: imageMetadata.alt || undefined
    });

    console.log(`✅ Image uploaded successfully, media ID: ${result.mediaId}`);
    if (imageMetadata.alt) {
      console.log(`   Alt text: ${imageMetadata.alt}`);
    }

    return result.mediaId;
  } catch (error) {
    console.error(`❌ Failed to upload image: ${error.message}`);
    return null;
  }
}

/**
 * Main Reply Processing Function
 */
async function replyToKolPosts() {
  const scriptStartTime = Date.now();
  console.log('🚀 Starting KOL Reply Processing (Script 2.3.1)...');
  console.log('📦 Using: BWS X SDK v1.7.0');
  console.log(`📍 Script: reply-to-kol-posts-sdk.js`);
  console.log(`⏰ Start time: ${new Date().toISOString()}\n`);

  // Setup timeout warnings
  const TIMEOUT_WARNINGS = [5, 10, 15, 20, 25];
  const timeoutWarnings = TIMEOUT_WARNINGS.map(minutes => {
    return setTimeout(() => {
      const elapsed = Math.round((Date.now() - scriptStartTime) / 1000 / 60);
      console.log(`\n⏰ TIMEOUT WARNING: Script has been running for ${elapsed} minutes`);
      console.log(`   Current phase: ${currentPhase || 'unknown'}`);
    }, minutes * 60 * 1000);
  });

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
        scheduleDataFile: path.join(__scriptsDir, 'data', 'kol-reply-schedule.json'),
        timeWindow: {
          minHour: 6,
          maxHour: 22
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

      const workflowFile = path.join(__scriptsDir, '..', '.github', 'workflows', 'kol-reply-cycle.yml');
      const updateSuccess = updateAndCommitSchedule(
        crons,
        schedules[0].time,
        workflowFile,
        'KOL reply cycle'
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
  // STEP 2: Main Reply Processing
  // ========================================================================

  // Load configuration and products
  currentPhase = 'loading_config';
  console.log(`⏰ [${Math.round((Date.now() - scriptStartTime) / 1000)}s] 📍 Phase: ${currentPhase}`);
  const config = loadConfig();
  lastSuccessfulOperation = 'config_loaded';

  currentPhase = 'loading_products';
  const bwsProducts = loadBWSProducts();
  lastSuccessfulOperation = 'products_loaded';
  const { maxRepliesPerRun, maxTweetsToEvaluatePerRun, maxRepliesPerDay, maxRepliesPerKolPerWeek, minRelevanceScoreForReply, minTimeBetweenRepliesMinutes, dryRun, antiSpamActions, imageAttachments } = config.replySettings;
  const maxRepliesThisRun = maxRepliesPerRun || maxRepliesPerDay;
  const maxEvaluationsThisRun = maxTweetsToEvaluatePerRun || 10; // Default to 10 if not specified

  // Default anti-spam settings if not specified
  const antiSpam = antiSpamActions || {
    followKolBeforeReply: true,
    likeTweetBeforeReply: true,
    onlyIfNotAlreadyFollowing: true,
    skipOnError: true
  };

  // Default image attachment settings if not specified
  const imageSettings = imageAttachments || {
    enabled: true,
    attachOnlyWhenAvailable: true,
    skipReplyOnUploadFailure: false
  };

  if (Object.keys(bwsProducts).length === 0) {
    console.error('❌ No BWS products loaded. Check scripts/data/docs-index.json exists.');
    process.exit(1);
  }

  console.log(`📊 Configuration:
   - Max tweets to evaluate: ${maxEvaluationsThisRun}
   - Max replies this run: ${maxRepliesThisRun}
   - Max replies per day: ${maxRepliesPerDay}
   - Max replies per KOL per week: ${maxRepliesPerKolPerWeek}
   - Min relevance score: ${minRelevanceScoreForReply}
   - Min time between replies: ${minTimeBetweenRepliesMinutes} minutes
   - Dry run mode: ${dryRun ? '✅ ON (no actual posts)' : '❌ OFF (will post)'}
   - Anti-spam actions:
     • Follow KOL: ${antiSpam.followKolBeforeReply ? '✅' : '❌'}
     • Like tweet: ${antiSpam.likeTweetBeforeReply ? '✅' : '❌'}
   - Image attachments:
     • Enabled: ${imageSettings.enabled ? '✅' : '❌'}
     • Attach when available: ${imageSettings.attachOnlyWhenAvailable ? '✅' : '❌'}
`);

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

    // Proxy disabled in GitHub Actions
    proxy: (crawlerConfig?.proxy?.enabled && !process.env.GITHUB_ACTIONS) ? {
      provider: crawlerConfig.proxy.provider,
      username: process.env.OXYLABS_USERNAME || crawlerConfig.proxy.username,
      password: process.env.OXYLABS_PASSWORD || crawlerConfig.proxy.password
    } : undefined,

    logging: { level: 'info' }
  };

  const sdkClient = new XTwitterClient(sdkConfig);

  console.log(`✅ [${Math.round((Date.now() - scriptStartTime) / 1000)}s] SDK client initialized`);
  console.log(`   Mode: ${sdkConfig.mode}`);
  console.log(`   Has API: ✅ Yes (required for write operations)\n`);

  currentPhase = 'initializing_claude_client';
  const claudeClient = createClaudeClient();
  console.log(`✅ [${Math.round((Date.now() - scriptStartTime) / 1000)}s] Claude client initialized`);

  // Initialize rate limiters with defaults if not in config
  const claudeLimiter = new RateLimiter(config.rateLimits?.claudeApiCallsPerMinute || 50);

  // Load data
  currentPhase = 'loading_data';
  console.log(`⏰ [${Math.round((Date.now() - scriptStartTime) / 1000)}s] 📍 Phase: ${currentPhase}`);
  const kolsData = loadKolsData();
  const repliesData = loadRepliesData();
  const engagingPostsData = await loadEngagingPosts();
  const processedPosts = loadProcessedPosts();

  // Save cleaned file if stale posts were removed
  if (engagingPostsData._removedStale) {
    console.log('💾 Saving cleaned engaging-posts.json...');
    await saveEngagingPosts({
      posts: engagingPostsData.posts,
      metadata: engagingPostsData.metadata,
      productRotation: engagingPostsData.productRotation
    });
    delete engagingPostsData._removedStale; // Remove internal flag
  }

  // Initialize product rotation in engagingPostsData if not present
  if (!engagingPostsData.productRotation) {
    engagingPostsData.productRotation = {
      allProducts: [
        'X Bot',
        'Fan Game Cube',
        'Blockchain Hash',
        'NFT.zK',
        'Blockchain Badges',
        'ESG Credits',
        'BWS IPFS',
        'Blockchain Save'
      ],
      currentIndex: 0,
      lastProductUsed: null,
      positioningPhraseIndex: 0,
      replyCount: 0
    };
    console.log('✨ Initialized product rotation state in engaging-posts.json');
  }

  // Use engaging-posts rotation state instead of processed-posts
  // This ensures rotation persists across workflow runs
  processedPosts.productRotation = engagingPostsData.productRotation;

  // Note: engagingPostsData.posts is already filtered for freshness (<36h old) and unprocessed status
  const unprocessedCount = engagingPostsData.posts.filter(p => !p.processed).length;
  console.log(`📋 Loaded ${engagingPostsData.posts.length} total posts (${unprocessedCount} unprocessed, fresh < 36h)\n`);

  if (engagingPostsData.posts.length === 0) {
    console.log('⚠️  No engaging posts to process. Exiting...');

    // Send notification about no posts
    await sendReplyNotification({
      success: false,
      tweetsEvaluated: 0,
      tweetsSkipped: 0,
      repliesPosted: 0,
      todayReplies: 0,
      maxRepliesPerDay,
      totalReplies: repliesData.replies.length,
      totalKols: kolsData.kols.length,
      activeKols: kolsData.kols.filter(k => k.status === 'active').length,
      kolsProcessed: 0,
      dryRun,
      runUrl: process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
        ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
        : null
    });

    process.exit(0);
  }

  // Check daily limit
  const todayDate = getTodayDateString();
  const todayReplies = repliesData.replies.filter(r => r.timestamp.startsWith(todayDate)).length;

  if (hasReachedDailyLimit(repliesData, maxRepliesPerDay)) {
    console.log(`⚠️  Daily reply limit reached (${todayReplies}/${maxRepliesPerDay}). Exiting...`);
    process.exit(0);
  }

  console.log(`📊 Today's replies: ${todayReplies}/${maxRepliesPerDay}\n`);

  // Tracking stats
  let tweetEvaluated = 0;
  let tweetsSkipped = 0;
  let repliesPosted = 0;
  let lastReplyDetails = null;

  // Process engaging posts
  for (const post of engagingPostsData.posts) {
    // Check if we've hit the evaluation limit AND posted at least 1 reply
    // Continue evaluating if no replies posted yet (up to 2x the limit)
    const shouldContinueForFirstReply = repliesPosted === 0 && tweetEvaluated < (maxEvaluationsThisRun * 2);

    if (tweetEvaluated >= maxEvaluationsThisRun) {
      if (shouldContinueForFirstReply) {
        console.log(`\n⏩ Evaluated ${tweetEvaluated} tweets with no replies yet. Continuing to find at least 1 reply...`);
      } else {
        console.log(`\n✅ Reached max tweet evaluations for this run (${tweetEvaluated}/${maxEvaluationsThisRun})`);
        console.log(`   Posted ${repliesPosted} ${repliesPosted === 1 ? 'reply' : 'replies'}. Remaining tweets will be processed in next run.`);
        break;
      }
    }

    // Check if we've hit the run limit
    if (repliesPosted >= maxRepliesThisRun) {
      console.log(`\n✅ Reached max replies for this run (${repliesPosted}/${maxRepliesThisRun}). Stopping...`);
      break;
    }

    // Check if we've hit the daily limit
    if (hasReachedDailyLimit(repliesData, maxRepliesPerDay)) {
      console.log(`\n✅ Reached daily reply limit. Stopping...`);
      break;
    }

    // Declare variables outside try block so they're accessible in catch block for retry
    let tweet = null;
    let kol = null;
    let evaluation = null;
    let replyText = null;
    let productSelection = null;

    try {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📝 Processing Post: ${post.id}`);
      console.log(`   Author: @${post.author.username}`);
      console.log(`   Text: ${post.text.substring(0, 100)}...`);
      console.log(`${'='.repeat(60)}\n`);

      tweet = {
        id: post.id,
        text: post.text,
        author: post.author,
        public_metrics: post.public_metrics,
        created_at: post.created_at
      };

      // Find KOL data
      kol = kolsData.kols.find(k => k.username === post.author.username);
      if (!kol) {
        console.log(`⚠️  KOL @${post.author.username} not found in database. Skipping...`);
        post.processed = true;
        tweetsSkipped++;
        continue;
      }

      // CRITICAL: Check if we've already replied to this specific tweet
      const alreadyRepliedToTweet = repliesData.replies.some(r => r.tweetId === post.id);
      if (alreadyRepliedToTweet) {
        console.log(`⏭️  Already replied to this specific tweet (${post.id}). Skipping...`);
        post.processed = true;
        tweetsSkipped++;
        continue;
      }

      // Check if already replied to this KOL recently
      if (hasRepliedRecentlyToKol(repliesData, kol.id, minTimeBetweenRepliesMinutes)) {
        console.log(`⏭️  Replied to @${kol.username} recently (within ${minTimeBetweenRepliesMinutes} minutes). Skipping...`);
        tweetsSkipped++;
        continue;
      }

      // Evaluate tweet with Claude
      currentPhase = `evaluating_tweet_${post.id}`;
      await claudeLimiter.throttle();

      console.log(`🤖 Evaluating tweet relevance with Claude AI...`);
      evaluation = await evaluateTweetForReply(claudeClient, tweet, kol, bwsProducts, config);
      tweetEvaluated++;

      console.log(`   Relevance score: ${evaluation.relevanceScore}/100`);
      console.log(`   Reasoning: ${evaluation.reasoning}`);

      if (!evaluation.shouldReply) {
        console.log(`⏭️  Tweet doesn't meet relevance threshold. Skipping...`);
        post.processed = true;
        tweetsSkipped++;
        continue;
      }

      // Generate reply
      currentPhase = `generating_reply_for_${post.id}`;
      await claudeLimiter.throttle();

      productSelection = getNextFeaturedProducts(processedPosts, bwsProducts, config);
      const selectedProduct = Object.values(productSelection.products)[0]; // Get first product
      console.log(`\n✍️  Generating reply (featuring: ${productSelection.productNames.join(', ')})...`);
      if (productSelection.specialNotes) {
        console.log(`   📌 Special note: ${productSelection.specialNotes}`);
      }

      // Get last 10 successful replies for diversity context
      const recentSuccessfulReplies = repliesData.replies
        .filter(r => r.status === 'posted' && r.replyText)
        .slice(-10)
        .reverse(); // Most recent first

      const replyResult = await generateReplyText(
        claudeClient,
        tweet,
        kol,
        selectedProduct,
        evaluation,
        productSelection.positioningPhrase,
        recentSuccessfulReplies,
        productSelection.specialNotes
      );

      replyText = replyResult.replyText || replyResult.alternativeVersion || JSON.stringify(replyResult);

      console.log(`\n📤 Generated reply (${replyText.length} chars):`);
      console.log(`"${replyText}"`);
      if (replyResult.templateUsed) {
        console.log(`   Template: ${replyResult.templateName} (${replyResult.templateUsed})`);
      }
      console.log('');

      // Select product image (if enabled and available)
      let selectedImage = null;
      let uploadedMediaId = null;

      if (imageSettings.enabled && selectedProduct && selectedProduct.images && selectedProduct.images.length > 0) {
        selectedImage = selectProductImage(selectedProduct, replyResult);
        if (selectedImage) {
          console.log(`📸 Selected image for ${selectedProduct.name}: ${selectedImage.localPath}`);
        }
      } else if (imageSettings.enabled && selectedProduct) {
        console.log(`ℹ️  No images available for ${selectedProduct.name}`);
      }

      if (dryRun) {
        console.log('⚠️  DRY RUN: Would have posted reply (skipped)');
        if (selectedImage) {
          console.log(`⚠️  DRY RUN: Would have attached image: ${selectedImage.localPath}`);
        }
        repliesPosted++;
        post.processed = true;
        continue;
      }

      // Upload image if selected and enabled
      if (imageSettings.enabled && selectedImage && sdkClient) {
        try {
          // SDK METHOD: client.uploadMedia() replaces uploadImageToTwitter()
          uploadedMediaId = await uploadImageWithSDK(sdkClient, selectedImage);

          // Check if upload failed and we should skip reply
          if (!uploadedMediaId && imageSettings.skipReplyOnUploadFailure) {
            console.warn(`⚠️  Image upload failed and skipReplyOnUploadFailure is enabled. Skipping reply...`);
            tweetsSkipped++;
            continue;
          }
        } catch (uploadError) {
          console.error(`❌ Image upload error: ${uploadError.message}`);
          if (imageSettings.skipReplyOnUploadFailure) {
            console.warn(`⚠️  Skipping reply due to upload failure`);
            tweetsSkipped++;
            continue;
          }
          // Otherwise continue without image
          console.log(`ℹ️  Continuing with reply without image attachment`);
        }
      }

      // Anti-spam actions: Follow and like
      if (sdkClient) {
        // Follow KOL
        if (antiSpam.followKolBeforeReply) {
          try {
            await sleep(1000);
            // SDK METHOD: client.followUser() replaces followUser(writeClient, userId, ...)
            // Note: SDK uses username, not user ID
            const followResult = await sdkClient.followUser(kol.username);
            if (followResult.success) {
              console.log(`✅ Followed @${kol.username}`);
            }
          } catch (followError) {
            console.warn(`⚠️  Failed to follow @${kol.username}:`, followError.message);
            if (!antiSpam.skipOnError) {
              throw followError;
            }
          }
        }

        // Like tweet
        if (antiSpam.likeTweetBeforeReply) {
          try {
            await sleep(1000);
            // SDK METHOD: client.likeTweet() replaces likeTweet(writeClient, tweetId)
            const likeResult = await sdkClient.likeTweet(tweet.id);
            if (likeResult.success) {
              console.log(`✅ Liked tweet ${tweet.id}`);
            }
          } catch (likeError) {
            console.warn(`⚠️  Failed to like tweet:`, likeError.message);
            if (!antiSpam.skipOnError) {
              throw likeError;
            }
          }
        }

        // Post reply
        await sleep(2000);
        console.log(`\n📤 Posting reply to tweet ${tweet.id}...`);
        if (uploadedMediaId) {
          console.log(`   📎 Attaching media ID: ${uploadedMediaId}`);
        }

        // SDK METHOD: client.postReply() replaces writeClient.v2.reply()
        const replyResponse = await sdkClient.postReply({
          tweetId: tweet.id,
          text: replyText,
          mediaIds: uploadedMediaId ? [uploadedMediaId] : undefined
        });
        const replyTweetId = replyResponse.id;

        console.log(`✅ Reply posted! Tweet ID: ${replyTweetId}`);
        console.log(`   URL: https://twitter.com/${process.env.BWSXAI_TWITTER_USERNAME || 'user'}/status/${replyTweetId}\n`);

        // Record reply
        const replyRecord = {
          id: `${kol.id}-${tweet.id}-${Date.now()}`,
          tweetId: tweet.id,
          tweetUrl: `https://twitter.com/${kol.username}/status/${tweet.id}`,
          kolId: kol.id,
          kolUsername: kol.username,
          originalTweetText: tweet.text,
          replyTweetId,
          replyText,
          productMentioned: evaluation.bestMatchingProduct || productSelection.productNames[0] || 'BWS',
          relevanceScore: evaluation.relevanceScore,
          templateUsed: replyResult.templateUsed || null,
          templateName: replyResult.templateName || null,
          imageAttached: uploadedMediaId ? true : false,
          imagePath: selectedImage ? selectedImage.localPath : null,
          timestamp: new Date().toISOString(),
          status: 'posted',
          dryRun: false,
          sdkVersion: '1.7.0'
        };

        repliesData.replies.push(replyRecord);
        saveRepliesData(repliesData);

        // Mark post as processed
        post.processed = true;
        repliesPosted++;
        lastReplyDetails = replyRecord;

        // Log to persistent usage tracker
        await usageLogger.logReply(replyRecord);
      }

    } catch (error) {
      console.error(`❌ Error processing post ${post.id}:`, error.message);
      if (error.stack) {
        console.error(error.stack);
      }
      tweetsSkipped++;
    }
  }

  // Save updated engaging posts
  await saveEngagingPosts(engagingPostsData);

  // Clear timeouts
  timeoutWarnings.forEach(timeout => clearTimeout(timeout));

  // Display API consumption statistics
  console.log('\n📊 API Usage Summary:');
  await usageLogger.displayTodayUsage();

  // Calculate duration
  const duration = ((Date.now() - scriptStartTime) / 1000).toFixed(1);

  // Send notification to Zapier/Slack
  try {
    await sendReplyNotification({
      success: repliesPosted > 0,
      tweetsEvaluated: tweetEvaluated,
      tweetsSkipped,
      repliesPosted,
      todayReplies: todayReplies + repliesPosted,
      maxRepliesPerDay,
      totalReplies: repliesData.replies.length,
      totalKols: kolsData.kols.length,
      activeKols: kolsData.kols.filter(k => k.status === 'active').length,
      kolsProcessed: new Set(engagingPostsData.posts.map(p => p.author.username)).size,
      dryRun,
      replyDetails: lastReplyDetails,
      runUrl: process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
        ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
        : null
    });
  } catch (notificationError) {
    console.error('⚠️  Failed to send Zapier notification:', notificationError.message);
  }

  // Print summary
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Reply Processing Summary`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Tweets evaluated: ${tweetEvaluated}`);
  console.log(`Tweets skipped: ${tweetsSkipped}`);
  console.log(`Replies posted: ${repliesPosted}`);
  console.log(`Today's total: ${todayReplies + repliesPosted}/${maxRepliesPerDay}`);
  console.log(`All-time total: ${repliesData.replies.length}`);
  console.log(`Duration: ${duration}s`);
  console.log(`${'='.repeat(60)}\n`);

  console.log('✅ Reply processing complete!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  replyToKolPosts()
    .then(() => {
      console.log('✅ Reply processing completed successfully');
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

export default replyToKolPosts;
