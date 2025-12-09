/**
 * Twitter Thread Client
 * Posts multi-tweet threads via Twitter API v2
 *
 * Features:
 * - Chain tweets as replies to create thread
 * - Delay between tweets to avoid spam detection
 * - Error handling and retry logic
 * - Thread integrity validation
 */

import { createReadWriteClient } from './twitter-client.js';
import { sleep } from './kol-utils.js';

/**
 * Post a Twitter thread (series of connected tweets)
 *
 * @param {string} parentTweetId - ID of tweet to reply to (starts the thread)
 * @param {Array<Object>} threadTweets - Array of tweets to post
 * @param {Object} config - Configuration options
 * @returns {Promise<Array<string>>} Array of posted tweet IDs
 */
async function postThread(parentTweetId, threadTweets, config = {}) {
  const {
    delayBetweenTweets = 5000, // 5 seconds between tweets
    retryAttempts = 2,
    validateBeforePost = true
  } = config;

  console.log(`\n🧵 Posting ${threadTweets.length}-tweet thread...`);
  console.log(`   📍 Replying to tweet: ${parentTweetId}`);

  // Validate thread before posting
  if (validateBeforePost) {
    const validation = validateThreadBeforePost(threadTweets);
    if (!validation.isValid) {
      throw new Error(`Thread validation failed: ${validation.errors.join(', ')}`);
    }
  }

  // Create Twitter client (use @BWSCommunity credentials)
  const { client } = createReadWriteClient(true);

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
        // Post tweet as reply
        const response = await client.v2.reply(
          tweet.text,
          currentReplyTo
        );

        if (response.data && response.data.id) {
          const tweetId = response.data.id;
          postedTweetIds.push(tweetId);
          currentReplyTo = tweetId; // Next tweet replies to this one
          posted = true;

          console.log(`      ✅ Posted successfully (ID: ${tweetId})`);
          break;
        } else {
          throw new Error('Twitter API returned no tweet ID');
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
 * Validate thread before posting
 */
function validateThreadBeforePost(threadTweets) {
  const errors = [];

  // Check array
  if (!Array.isArray(threadTweets)) {
    errors.push('threadTweets must be an array');
    return { isValid: false, errors };
  }

  if (threadTweets.length === 0) {
    errors.push('Thread must have at least 1 tweet');
    return { isValid: false, errors };
  }

  if (threadTweets.length > 10) {
    errors.push('Thread cannot exceed 10 tweets');
  }

  // Validate each tweet
  threadTweets.forEach((tweet, i) => {
    // Must have text
    if (!tweet.text || typeof tweet.text !== 'string') {
      errors.push(`Tweet ${i + 1} must have text field`);
      return;
    }

    // Character limit
    if (tweet.text.length === 0) {
      errors.push(`Tweet ${i + 1} is empty`);
    }

    if (tweet.text.length > 280) {
      errors.push(`Tweet ${i + 1} exceeds 280 characters (${tweet.text.length} chars)`);
    }

    // Check for common issues
    if (tweet.text.includes('undefined') || tweet.text.includes('null')) {
      errors.push(`Tweet ${i + 1} contains placeholder text`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
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
 * Get thread metrics
 */
function getThreadMetrics(threadTweets) {
  return {
    tweetCount: threadTweets.length,
    totalCharacters: threadTweets.reduce((sum, t) => sum + t.text.length, 0),
    averageLength: Math.round(
      threadTweets.reduce((sum, t) => sum + t.text.length, 0) / threadTweets.length
    ),
    longestTweet: Math.max(...threadTweets.map(t => t.text.length)),
    shortestTweet: Math.min(...threadTweets.map(t => t.text.length)),
    hasBWSCashtag: threadTweets.some(t => t.text.includes('$BWS')),
    hasBWSCommunity: threadTweets.some(t => t.text.includes('@BWSCommunity')),
    hasDocsLink: threadTweets.some(t => t.text.includes('docs.bws.ninja'))
  };
}

export {
  postThread,
  validateThreadBeforePost,
  previewThread,
  getThreadMetrics
};
