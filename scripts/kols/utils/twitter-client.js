import { TwitterApi } from 'twitter-api-v2';
import apiTracker from './api-call-tracker.js';
import usageLogger from './api-usage-logger.js';

/**
 * Initialize read-only Twitter client (Bearer Token)
 */
export function createReadOnlyClient() {
  const bearerToken = process.env.BWSXAI_TWITTER_BEARER_TOKEN;

  if (!bearerToken) {
    throw new Error('BWSXAI_TWITTER_BEARER_TOKEN environment variable is required');
  }

  return new TwitterApi(bearerToken);
}

/**
 * Initialize read-only OAuth client (OAuth 1.0a read-only)
 * Use this for operations requiring OAuth like getUserFollowing()
 */
export function createReadOnlyOAuthClient() {
  const apiKey = process.env.BWSXAI_TWITTER_API_KEY;
  const apiSecret = process.env.BWSXAI_TWITTER_API_SECRET;
  const accessToken = process.env.BWSXAI_TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.BWSXAI_TWITTER_ACCESS_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    throw new Error('All BWSXAI Twitter OAuth credentials are required');
  }

  return new TwitterApi({
    appKey: apiKey,
    appSecret: apiSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
  }).readOnly;
}

/**
 * Initialize read-write Twitter client (OAuth 1.0a)
 */
export function createReadWriteClient() {
  const apiKey = process.env.BWSXAI_TWITTER_API_KEY;
  const apiSecret = process.env.BWSXAI_TWITTER_API_SECRET;
  const accessToken = process.env.BWSXAI_TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.BWSXAI_TWITTER_ACCESS_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    throw new Error('All BWSXAI Twitter OAuth credentials are required for posting');
  }

  return new TwitterApi({
    appKey: apiKey,
    appSecret: apiSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
  });
}

/**
 * Fetch user by username
 */
export async function getUserByUsername(client, username) {
  try {
    const result = await client.v2.userByUsername(username, {
      'user.fields': [
        'created_at',
        'description',
        'public_metrics',
        'verified',
        'profile_image_url'
      ]
    });

    if (!result.data) {
      apiTracker.recordCall('users/by/username', 0, false, 'User not found');
      throw new Error(`User ${username} not found`);
    }

    apiTracker.recordCall('users/by/username', 1, true);
    return result.data;
  } catch (error) {
    apiTracker.recordCall('users/by/username', 0, false, error.message);
    console.error(`Error fetching user ${username}: ${error.message}`);
    throw error;
  }
}

/**
 * Fetch user's following list
 * NOTE: Requires OAuth user context (not available with Bearer token)
 */
export async function getUserFollowing(client, userId, maxResults = 100) {
  try {
    const following = await client.v2.following(userId, {
      max_results: maxResults,
      'user.fields': [
        'created_at',
        'description',
        'public_metrics',
        'verified',
        'profile_image_url'
      ]
    });

    const count = following.data?.length || 0;
    apiTracker.recordCall('users/following', count, true);
    return following;
  } catch (error) {
    const is403 = error.code === 403 || error.message?.includes('403');
    const is429 = error.code === 429 || error.message?.includes('429');

    const errorDetail = is403
      ? 'Forbidden (403) - Requires OAuth user context, not available with Bearer token'
      : is429
      ? 'Rate limit (429) - Too many requests'
      : error.message;

    apiTracker.recordCall('users/following', 0, false, errorDetail);

    console.error(`Error fetching following for user ${userId}: ${errorDetail}`);
    throw error;
  }
}

/**
 * Fetch user's recent tweets
 */
export async function getUserTweets(client, userId, options = {}) {
  try {
    const defaultOptions = {
      max_results: 10,
      'tweet.fields': [
        'created_at',
        'text',
        'public_metrics',
        'referenced_tweets',
        'conversation_id'
      ],
      'user.fields': ['username', 'name'],
      exclude: ['retweets', 'replies']
    };

    const mergedOptions = { ...defaultOptions, ...options };

    const tweets = await client.v2.userTimeline(userId, mergedOptions);

    return tweets;
  } catch (error) {
    console.error(`Error fetching tweets for user ${userId}: ${error.message}`);
    throw error;
  }
}

/**
 * Post a reply to a tweet
 */
export async function postReply(client, tweetId, replyText, dryRun = false) {
  try {
    if (dryRun) {
      console.log('🔍 [DRY RUN] Would post reply:');
      console.log(`   Tweet ID: ${tweetId}`);
      console.log(`   Reply: ${replyText}`);
      apiTracker.recordCall('tweets/reply', 1, true, 'Dry run - not posted');
      return {
        data: {
          id: `dry-run-${Date.now()}`,
          text: replyText
        },
        dryRun: true
      };
    }

    const result = await client.v2.reply(replyText, tweetId);

    // Log successful post
    apiTracker.recordCall('tweets/reply', 1, true);
    await usageLogger.logSuccessfulPost({
      tweetId,
      replyId: result.data?.id,
      replyText: replyText.substring(0, 100),
      rateLimit: result.rateLimit || null
    });

    console.log(`✅ Posted reply to tweet ${tweetId}`);
    return result;
  } catch (error) {
    // Enhanced 429 error logging with rate limit details
    if (error.code === 429 && error.rateLimit) {
      const limit = error.rateLimit.limit;
      const remaining = error.rateLimit.remaining;
      const reset = new Date(error.rateLimit.reset * 1000);
      const used = limit - remaining;

      console.error(`❌ Rate limit exceeded (429):`);
      console.error(`   Limit: ${limit} posts per time window`);
      console.error(`   Used: ${used} posts`);
      console.error(`   Remaining: ${remaining} posts`);
      console.error(`   Resets at: ${reset.toISOString()}`);

      // Identify tier based on limit
      if (limit === 17) {
        console.error(`   ⚠️  FREE TIER DETECTED - Upgrade to Basic tier required`);
      } else if (limit === 100) {
        console.error(`   ✅ Basic tier user-level limit (OAuth 1.0a)`);
      } else if (limit >= 1000) {
        console.error(`   ✅ Higher tier detected`);
      }

      // Log rate limit error to persistent storage
      await usageLogger.logRateLimitError({
        tweetId,
        limit,
        remaining,
        used,
        reset: reset.toISOString()
      });

      apiTracker.recordCall('tweets/reply', 0, false, `Rate limit: ${used}/${limit} used`);
    } else {
      apiTracker.recordCall('tweets/reply', 0, false, error.message);

      // Log other errors
      await usageLogger.logPostAttempt({
        tweetId,
        success: false,
        error: error.message,
        errorCode: error.code
      });
    }

    console.error(`❌ Error posting reply to tweet ${tweetId}: ${error.message}`);
    throw error;
  }
}

/**
 * Get tweet by ID
 */
export async function getTweetById(client, tweetId) {
  try {
    const result = await client.v2.singleTweet(tweetId, {
      'tweet.fields': [
        'created_at',
        'text',
        'public_metrics',
        'author_id',
        'conversation_id'
      ],
      'user.fields': ['username', 'name']
    });

    return result.data;
  } catch (error) {
    console.error(`Error fetching tweet ${tweetId}: ${error.message}`);
    throw error;
  }
}

/**
 * Search recent tweets by query
 */
export async function searchTweets(client, query, options = {}) {
  try {
    const defaultOptions = {
      max_results: 100,
      'tweet.fields': [
        'created_at',
        'text',
        'public_metrics',
        'author_id',
        'entities',
        'referenced_tweets',
        'in_reply_to_user_id'
      ],
      'user.fields': ['username', 'name', 'public_metrics'],
      expansions: 'author_id,entities.mentions.username,referenced_tweets.id.author_id'
    };

    const mergedOptions = { ...defaultOptions, ...options };

    const result = await client.v2.search(query, mergedOptions);

    // Count tweets returned
    const tweetCount = result.data?.data?.length || 0;
    apiTracker.recordCall('tweets/search/recent', tweetCount, true);

    return result;
  } catch (error) {
    // Extract error code from message if it's a rate limit error
    const errorMsg = error.message || String(error);
    const is429 = errorMsg.includes('429') || errorMsg.includes('Too Many Requests');
    apiTracker.recordCall('tweets/search/recent', 0, false, is429 ? 'Rate limit (429)' : errorMsg);

    console.error(`Error searching tweets: ${error.message}`);
    throw error;
  }
}

/**
 * Get user tweets via Search API (60 calls/15min vs userTimeline's 10 calls/15min)
 * Uses search with "from:username" query
 */
export async function getUserTweetsViaSearch(client, username, maxResults = 100) {
  try {
    const query = `from:${username} -is:retweet -is:reply`;

    const result = await searchTweets(client, query, {
      max_results: Math.min(maxResults, 100) // Search API max is 100
    });

    // Collect tweets from paginator
    const tweets = [];
    for await (const tweet of result) {
      tweets.push(tweet);
      if (tweets.length >= maxResults) break;
    }

    // Note: searchTweets() already tracks the API call
    return tweets;
  } catch (error) {
    console.error(`Error fetching tweets via search for @${username}: ${error.message}`);
    throw error;
  }
}

/**
 * Paginate through results
 */
export async function* paginateResults(paginator, maxPages = 5) {
  let pageCount = 0;

  for await (const page of paginator) {
    yield page;

    pageCount++;
    if (pageCount >= maxPages) {
      break;
    }
  }
}

/**
 * Get user's recent tweets with engagement metrics
 */
export async function getUserTweetsWithMetrics(client, userId, daysBack = 7, maxResults = 100) {
  try {
    const cutoffTime = new Date();
    cutoffTime.setDate(cutoffTime.getDate() - daysBack);

    const tweets = await client.v2.userTimeline(userId, {
      max_results: maxResults,
      'tweet.fields': [
        'created_at',
        'text',
        'public_metrics',
        'referenced_tweets'
      ],
      exclude: ['retweets']
    });

    const tweetsArray = [];
    for await (const tweet of tweets) {
      // Only include tweets within the time window
      if (tweet.created_at) {
        const tweetDate = new Date(tweet.created_at);
        if (tweetDate >= cutoffTime) {
          tweetsArray.push(tweet);
        }
      }
    }

    // Calculate metrics
    const metrics = {
      totalTweets: tweetsArray.length,
      avgLikes: 0,
      avgRetweets: 0,
      avgReplies: 0,
      avgViews: 0,
      totalEngagement: 0
    };

    if (tweetsArray.length > 0) {
      const totals = tweetsArray.reduce((acc, tweet) => {
        const pm = tweet.public_metrics || {};
        return {
          likes: acc.likes + (pm.like_count || 0),
          retweets: acc.retweets + (pm.retweet_count || 0),
          replies: acc.replies + (pm.reply_count || 0),
          views: acc.views + (pm.impression_count || 0)
        };
      }, { likes: 0, retweets: 0, replies: 0, views: 0 });

      metrics.avgLikes = Math.round(totals.likes / tweetsArray.length);
      metrics.avgRetweets = Math.round(totals.retweets / tweetsArray.length);
      metrics.avgReplies = Math.round(totals.replies / tweetsArray.length);
      metrics.avgViews = Math.round(totals.views / tweetsArray.length);
      metrics.totalEngagement = totals.likes + totals.retweets + totals.replies;
    }

    apiTracker.recordCall('users/tweets', tweetsArray.length, true);

    return {
      tweets: tweetsArray,
      metrics
    };
  } catch (error) {
    const is429 = error.code === 429 || error.message?.includes('429');
    const is403 = error.code === 403 || error.message?.includes('403');

    const errorDetail = is429
      ? 'Rate limit (429) - Too many requests'
      : is403
      ? 'Forbidden (403)'
      : error.message;

    apiTracker.recordCall('users/tweets', 0, false, errorDetail);

    console.error(`Error fetching tweets with metrics for user ${userId}: ${errorDetail}`);
    throw error;
  }
}

/**
 * Check if user is still active (has posted recently)
 */
export async function isUserActive(client, userId, daysBack = 7) {
  try {
    const cutoffTime = new Date();
    cutoffTime.setDate(cutoffTime.getDate() - daysBack);

    const tweets = await client.v2.userTimeline(userId, {
      max_results: 10,
      'tweet.fields': ['created_at'],
      exclude: ['retweets']
    });

    // Check if any tweets are within the time window
    for await (const tweet of tweets) {
      if (tweet.created_at) {
        const tweetDate = new Date(tweet.created_at);
        if (tweetDate >= cutoffTime) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error(`Error checking user activity for ${userId}: ${error.message}`);
    return false;
  }
}

/**
 * Batch lookup multiple users by ID (up to 100 per request)
 */
export async function batchUserLookup(client, userIds) {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return [];
  }

  try {
    // Handle batches of 100
    const batches = [];
    for (let i = 0; i < userIds.length; i += 100) {
      batches.push(userIds.slice(i, i + 100));
    }

    const allUsers = [];

    for (const batch of batches) {
      const result = await client.v2.users(batch, {
        'user.fields': [
          'created_at',
          'description',
          'public_metrics',
          'verified',
          'profile_image_url'
        ]
      });

      if (result.data) {
        allUsers.push(...result.data);
        apiTracker.recordCall('users/lookup', result.data.length, true);
      } else {
        apiTracker.recordCall('users/lookup', 0, false, 'No data returned');
      }
    }

    return allUsers;
  } catch (error) {
    apiTracker.recordCall('users/lookup', 0, false, error.message);
    console.error(`Error in batch user lookup: ${error.message}`);
    throw error;
  }
}

export { apiTracker };

export default {
  createReadOnlyClient,
  createReadOnlyOAuthClient,
  createReadWriteClient,
  getUserByUsername,
  getUserFollowing,
  getUserTweets,
  getUserTweetsViaSearch,
  postReply,
  getTweetById,
  searchTweets,
  paginateResults,
  getUserTweetsWithMetrics,
  isUserActive,
  batchUserLookup,
  apiTracker
};
