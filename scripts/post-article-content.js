import { TwitterApi } from 'twitter-api-v2';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { sendArticlePostNotification } from './kols/utils/zapier-webhook.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

// Configuration
const ARTICLE_X_POSTS_FILE = join(__dirname, 'data', 'article-x-posts.json');
const MAX_POSTS_PER_RUN = 4; // Conservative limit per execution
const DELAY_BETWEEN_POSTS_MS = 60000; // 60 seconds (1 minute) between posts

/**
 * Initialize Twitter client for posting
 */
function createTwitterClient() {
  const apiKey = process.env.BWSXAI_TWITTER_API_KEY;
  const apiSecret = process.env.BWSXAI_TWITTER_API_SECRET;
  const accessToken = process.env.BWSXAI_TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.BWSXAI_TWITTER_ACCESS_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    throw new Error('Missing BWSXAI Twitter OAuth credentials. Please check your .env file.');
  }

  return new TwitterApi({
    appKey: apiKey,
    appSecret: apiSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
  });
}

/**
 * Load posts data
 */
function loadPostsData() {
  console.log('📖 Loading posts data...');

  if (!existsSync(ARTICLE_X_POSTS_FILE)) {
    throw new Error(`Posts file not found: ${ARTICLE_X_POSTS_FILE}\nPlease run generate-article-posts.js first.`);
  }

  const data = JSON.parse(readFileSync(ARTICLE_X_POSTS_FILE, 'utf8'));
  console.log(`   ✅ Loaded ${data.posts?.length || 0} total posts\n`);

  return data;
}

/**
 * Save updated posts data
 */
function savePostsData(data) {
  console.log('💾 Saving updated posts data...');

  // Update metadata
  data.metadata = {
    ...data.metadata,
    lastPosted: new Date().toISOString(),
    pendingPosts: data.posts.filter(p => p.status === 'pending').length,
    postedCount: data.posts.filter(p => p.status === 'posted').length,
    failedCount: data.posts.filter(p => p.status === 'failed').length
  };

  writeFileSync(ARTICLE_X_POSTS_FILE, JSON.stringify(data, null, 2), 'utf8');
  console.log(`   ✅ Data saved\n`);
}

/**
 * Get posts ready to be posted
 * Prioritize by: high priority first, then oldest first
 */
function getPostsToPost(postsData, limit) {
  const pendingPosts = postsData.posts.filter(post => post.status === 'pending');

  // Sort by priority (high first) then by generatedAt (oldest first)
  const sortedPosts = pendingPosts.sort((a, b) => {
    // Priority comparison
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    // If same priority, older posts first
    return new Date(a.generatedAt) - new Date(b.generatedAt);
  });

  return sortedPosts.slice(0, limit);
}

/**
 * Post a single tweet
 */
async function postTweet(client, post) {
  console.log(`📤 Posting tweet for ${post.product}...`);
  console.log(`   Type: ${post.type}`);
  console.log(`   Priority: ${post.priority}`);

  // Display main text and links separately for clarity
  if (post.mainText) {
    console.log(`   Main text: ${post.mainText}`);
    console.log(`   Article: ${post.articleUrl}`);
    console.log(`   Docs: ${post.docsUrl}`);
  } else {
    console.log(`   Text: ${post.text}`);
  }
  console.log(`   Hashtags: ${post.hashtags.join(', ')}`);

  try {
    // Post the tweet (regular tweet, NOT a reply)
    const response = await client.v2.tweet(post.text);

    console.log(`   ✅ Posted successfully!`);
    console.log(`   Tweet ID: ${response.data.id}`);
    console.log(`   URL: https://twitter.com/i/web/status/${response.data.id}\n`);

    return {
      success: true,
      tweetId: response.data.id,
      tweetUrl: `https://twitter.com/i/web/status/${response.data.id}`,
      error: null
    };

  } catch (error) {
    console.error(`   ❌ Failed to post tweet`);
    console.error(`   Error: ${error.message}`);

    // Log detailed error info
    if (error.code) {
      console.error(`   Code: ${error.code}`);
    }

    if (error.code === 403) {
      console.error(`   ⚠️  403 Forbidden - This might be due to:`);
      console.error(`      - Account restrictions (low activity)`);
      console.error(`      - OAuth app permissions issue`);
      console.error(`      - Duplicate content`);
    } else if (error.code === 429) {
      console.error(`   ⚠️  429 Rate Limited - Reached posting limit`);
      console.error(`      - Wait before trying again`);
    } else if (error.code === 187) {
      console.error(`   ⚠️  187 Duplicate Status - Already posted this text`);
    }

    console.log();

    return {
      success: false,
      tweetId: null,
      tweetUrl: null,
      error: {
        message: error.message,
        code: error.code || 'unknown',
        timestamp: new Date().toISOString()
      }
    };
  }
}

/**
 * Update post status after posting attempt
 */
function updatePostStatus(post, result) {
  if (result.success) {
    post.status = 'posted';
    post.postedAt = new Date().toISOString();
    post.tweetId = result.tweetId;
    post.tweetUrl = result.tweetUrl;
    post.error = null;
  } else {
    post.status = 'failed';
    post.error = result.error;
    post.lastAttempt = new Date().toISOString();

    // Track retry count
    if (!post.retryCount) {
      post.retryCount = 0;
    }
    post.retryCount++;
  }
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Article Content Posting\n');
  console.log('=' .repeat(60) + '\n');

  // Check for Twitter credentials
  if (!process.env.BWSXAI_TWITTER_API_KEY) {
    console.error('❌ Twitter credentials not set');
    console.error('   Please set BWSXAI_TWITTER_API_KEY and related env vars\n');
    process.exit(1);
  }

  try {
    // Initialize Twitter client
    const twitterClient = createTwitterClient();
    console.log('✅ Twitter client initialized\n');

    // Load posts data
    const postsData = loadPostsData();

    // Get posts to post
    const postsToPost = getPostsToPost(postsData, MAX_POSTS_PER_RUN);

    console.log(`📊 Posting Summary:`);
    console.log(`   Total posts in queue: ${postsData.posts.length}`);
    console.log(`   Pending posts: ${postsData.posts.filter(p => p.status === 'pending').length}`);
    console.log(`   Already posted: ${postsData.posts.filter(p => p.status === 'posted').length}`);
    console.log(`   Failed: ${postsData.posts.filter(p => p.status === 'failed').length}`);
    console.log(`   Will post now: ${postsToPost.length}\n`);

    if (postsToPost.length === 0) {
      console.log('✅ No posts to publish right now!\n');
      return;
    }

    console.log('=' .repeat(60) + '\n');

    // Post each tweet
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < postsToPost.length; i++) {
      const post = postsToPost[i];

      console.log(`[${i + 1}/${postsToPost.length}] ${'-'.repeat(40)}\n`);

      // Post the tweet
      const result = await postTweet(twitterClient, post);

      // Update post status
      updatePostStatus(post, result);

      if (result.success) {
        successCount++;

        // Send Zapier notification for successful post
        try {
          await sendArticlePostNotification({
            success: true,
            product: post.product,
            articleTitle: post.metadata.articleTitle,
            articleUrl: post.articleUrl,
            docsUrl: post.docsUrl,
            postUrl: result.tweetUrl,
            postText: post.mainText || post.text.substring(0, 200),
            hashtags: post.hashtags
          });
        } catch (notifError) {
          console.log(`   ⚠️  Notification failed (non-critical): ${notifError.message}`);
        }
      } else {
        failureCount++;

        // If we get a rate limit error, stop posting
        if (result.error?.code === 429) {
          console.log('⚠️  Rate limited - stopping further posts\n');
          break;
        }
      }

      // Save after each post
      savePostsData(postsData);

      // Delay before next post (except for last post)
      if (i < postsToPost.length - 1) {
        const delaySeconds = DELAY_BETWEEN_POSTS_MS / 1000;
        console.log(`⏳ Waiting ${delaySeconds} seconds before next post...\n`);
        await sleep(DELAY_BETWEEN_POSTS_MS);
      }
    }

    console.log('=' .repeat(60));
    console.log('\n✅ Posting complete!\n');
    console.log(`📊 Results:`);
    console.log(`   Successfully posted: ${successCount}`);
    console.log(`   Failed: ${failureCount}`);
    console.log(`   Remaining pending: ${postsData.posts.filter(p => p.status === 'pending').length}`);
    console.log(`\n📝 Data saved to: ${ARTICLE_X_POSTS_FILE}\n`);

    if (successCount > 0) {
      console.log(`🎉 Check your posts at: https://twitter.com/BWSXAI\n`);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { postTweet, getPostsToPost, updatePostStatus };
