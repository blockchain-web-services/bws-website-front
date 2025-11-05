/**
 * Hybrid Twitter Client
 * Routes requests to either Crawlee (scraping) or Official API based on environment variable
 *
 * Environment Variables:
 * - TWITTER_DATA_SOURCE: "crawlee" or "api" (default: "api")
 * - CRAWLEE_HEADLESS: "true" or "false" (default: "true")
 */

import * as officialAPI from './twitter-client.js';
import * as crawlee from '../crawlers/twitter-crawler.js';

// Determine data source
const DATA_SOURCE = process.env.TWITTER_DATA_SOURCE || 'api';

console.log(`🔧 Twitter data source: ${DATA_SOURCE.toUpperCase()}`);

/**
 * Get user profile by username
 * @param {Object|string} clientOrUsername - Official API client or username (for Crawlee)
 * @param {string} username - Username (only for official API mode)
 * @returns {Promise<Object>} User profile
 */
export async function getUserByUsername(clientOrUsername, username) {
  if (DATA_SOURCE === 'crawlee') {
    // For Crawlee, first param is the username
    const usernameParam = typeof clientOrUsername === 'string' ? clientOrUsername : username;
    return await crawlee.getUserProfile(usernameParam);
  } else {
    // For official API, first param is the client
    return await officialAPI.getUserByUsername(clientOrUsername, username);
  }
}

/**
 * Search tweets by query
 * @param {Object|string} clientOrQuery - Official API client or search query (for Crawlee)
 * @param {string|Object} queryOrOptions - Query string (for API) or options (for Crawlee)
 * @param {Object} options - Options (for API mode)
 * @returns {Promise<Object|Array>} Search results
 */
export async function searchTweets(clientOrQuery, queryOrOptions, options = {}) {
  if (DATA_SOURCE === 'crawlee') {
    // For Crawlee: searchTweets(query, options)
    const query = typeof clientOrQuery === 'string' ? clientOrQuery : queryOrOptions;
    const opts = typeof queryOrOptions === 'object' ? queryOrOptions : options;
    return await crawlee.searchTweets(query, opts);
  } else {
    // For official API: searchTweets(client, query, options)
    return await officialAPI.searchTweets(clientOrQuery, queryOrOptions, options);
  }
}

/**
 * Get user's following list
 * @param {Object|string} clientOrUsername - Official API client or username (for Crawlee)
 * @param {string|number} userIdOrMaxResults - User ID (for API) or maxResults (for Crawlee)
 * @param {number} maxResults - Max results (for API mode)
 * @returns {Promise<Object|Array>} Following list
 */
export async function getUserFollowing(clientOrUsername, userIdOrMaxResults, maxResults = 100) {
  if (DATA_SOURCE === 'crawlee') {
    // For Crawlee: getUserFollowing(username, maxResults)
    const username = typeof clientOrUsername === 'string' ? clientOrUsername : userIdOrMaxResults;
    const max = typeof userIdOrMaxResults === 'number' ? userIdOrMaxResults : maxResults;
    return await crawlee.getUserFollowing(username, max);
  } else {
    // For official API: getUserFollowing(client, userId, maxResults)
    return await officialAPI.getUserFollowing(clientOrUsername, userIdOrMaxResults, maxResults);
  }
}

/**
 * Get user's tweets
 * @param {Object|string} clientOrUsername - Official API client or username (for Crawlee)
 * @param {string|Object} userIdOrOptions - User ID (for API) or options (for Crawlee)
 * @param {Object} options - Options (for API mode)
 * @returns {Promise<Object|Array>} User tweets
 */
export async function getUserTweets(clientOrUsername, userIdOrOptions, options = {}) {
  if (DATA_SOURCE === 'crawlee') {
    // For Crawlee: getUserTweets(username, options)
    const username = typeof clientOrUsername === 'string' ? clientOrUsername : userIdOrOptions;
    const opts = typeof userIdOrOptions === 'object' ? userIdOrOptions : options;
    return await crawlee.getUserTweets(username, opts);
  } else {
    // For official API: getUserTweets(client, userId, options)
    return await officialAPI.getUserTweets(clientOrUsername, userIdOrOptions, options);
  }
}

/**
 * Get user tweets via search (API-only method)
 * Falls back to getUserTweets for Crawlee mode
 */
export async function getUserTweetsViaSearch(clientOrUsername, usernameOrMaxResults, maxResults = 100) {
  if (DATA_SOURCE === 'crawlee') {
    // Crawlee doesn't distinguish - just use getUserTweets
    const username = typeof clientOrUsername === 'string' ? clientOrUsername : usernameOrMaxResults;
    const max = typeof usernameOrMaxResults === 'number' ? usernameOrMaxResults : maxResults;
    return await crawlee.getUserTweets(username, { maxResults: max });
  } else {
    return await officialAPI.getUserTweetsViaSearch(clientOrUsername, usernameOrMaxResults, maxResults);
  }
}

/**
 * Get user tweets with metrics (API-only method)
 * Approximation for Crawlee mode
 */
export async function getUserTweetsWithMetrics(clientOrUsername, userIdOrUsername, daysBack = 7, maxResults = 100) {
  if (DATA_SOURCE === 'crawlee') {
    // Crawlee mode: Get tweets and calculate metrics manually
    const username = typeof clientOrUsername === 'string' ? clientOrUsername : userIdOrUsername;
    const tweets = await crawlee.getUserTweets(username, { maxResults });

    // Calculate metrics from crawled tweets
    const metrics = {
      totalTweets: tweets.length,
      avgLikes: 0,
      avgRetweets: 0,
      avgReplies: 0,
      avgViews: 0,
      totalEngagement: 0
    };

    if (tweets.length > 0) {
      const totals = tweets.reduce((acc, tweet) => {
        const pm = tweet.public_metrics || {};
        return {
          likes: acc.likes + (pm.like_count || 0),
          retweets: acc.retweets + (pm.retweet_count || 0),
          replies: acc.replies + (pm.reply_count || 0),
          views: acc.views + (pm.impression_count || 0)
        };
      }, { likes: 0, retweets: 0, replies: 0, views: 0 });

      metrics.avgLikes = Math.round(totals.likes / tweets.length);
      metrics.avgRetweets = Math.round(totals.retweets / tweets.length);
      metrics.avgReplies = Math.round(totals.replies / tweets.length);
      metrics.avgViews = Math.round(totals.views / tweets.length);
      metrics.totalEngagement = totals.likes + totals.retweets + totals.replies;
    }

    return { tweets, metrics };
  } else {
    return await officialAPI.getUserTweetsWithMetrics(clientOrUsername, userIdOrUsername, daysBack, maxResults);
  }
}

/**
 * Check if user is active (API-only method)
 * Approximation for Crawlee mode
 */
export async function isUserActive(clientOrUsername, userIdOrUsername, daysBack = 7) {
  if (DATA_SOURCE === 'crawlee') {
    // Crawlee mode: Get recent tweets and check dates
    const username = typeof clientOrUsername === 'string' ? clientOrUsername : userIdOrUsername;
    const tweets = await crawlee.getUserTweets(username, { maxResults: 10 });

    if (tweets.length === 0) return false;

    const cutoffTime = new Date();
    cutoffTime.setDate(cutoffTime.getDate() - daysBack);

    // Check if any tweet is within the time window
    return tweets.some(tweet => {
      if (!tweet.created_at) return false;
      const tweetDate = new Date(tweet.created_at);
      return tweetDate >= cutoffTime;
    });
  } else {
    return await officialAPI.isUserActive(clientOrUsername, userIdOrUsername, daysBack);
  }
}

/**
 * Batch user lookup (API-only method)
 * Not supported in Crawlee mode - use official API as fallback
 */
export async function batchUserLookup(client, userIds) {
  if (DATA_SOURCE === 'crawlee') {
    console.warn('⚠️ batchUserLookup not supported in Crawlee mode, using official API fallback');
    // For batch operations, fall back to official API even in Crawlee mode
    const apiClient = officialAPI.createReadOnlyClient();
    return await officialAPI.batchUserLookup(apiClient, userIds);
  } else {
    return await officialAPI.batchUserLookup(client, userIds);
  }
}

/**
 * Post reply (API-only method - Crawlee cannot post)
 */
export async function postReply(client, tweetId, replyText, dryRun = false) {
  if (DATA_SOURCE === 'crawlee') {
    throw new Error('Cannot post tweets in Crawlee mode - switch to API mode (TWITTER_DATA_SOURCE=api)');
  }
  return await officialAPI.postReply(client, tweetId, replyText, dryRun);
}

/**
 * Get tweet by ID (API-only method)
 * Not available in Crawlee mode
 */
export async function getTweetById(client, tweetId) {
  if (DATA_SOURCE === 'crawlee') {
    throw new Error('getTweetById not supported in Crawlee mode - switch to API mode');
  }
  return await officialAPI.getTweetById(client, tweetId);
}

/**
 * Create appropriate client based on mode
 * Returns null for Crawlee mode (no client needed)
 */
export function createClient(type = 'readonly') {
  if (DATA_SOURCE === 'crawlee') {
    console.log('ℹ️ Crawlee mode - no API client needed');
    return null;
  }

  switch (type) {
    case 'readonly':
      return officialAPI.createReadOnlyClient();
    case 'oauth':
      return officialAPI.createReadOnlyOAuthClient();
    case 'readwrite':
      return officialAPI.createReadWriteClient();
    default:
      throw new Error(`Unknown client type: ${type}`);
  }
}

/**
 * Get current data source mode
 */
export function getDataSource() {
  return DATA_SOURCE;
}

/**
 * Check if currently using Crawlee
 */
export function isCrawleeMode() {
  return DATA_SOURCE === 'crawlee';
}

/**
 * Check if currently using official API
 */
export function isAPIMode() {
  return DATA_SOURCE === 'api';
}

// Export API tracker (only relevant for API mode)
export const apiTracker = officialAPI.apiTracker;

// Export all official API functions for direct access if needed
export { officialAPI, crawlee };

export default {
  getUserByUsername,
  searchTweets,
  getUserFollowing,
  getUserTweets,
  getUserTweetsViaSearch,
  getUserTweetsWithMetrics,
  isUserActive,
  batchUserLookup,
  postReply,
  getTweetById,
  createClient,
  getDataSource,
  isCrawleeMode,
  isAPIMode,
  apiTracker,
  officialAPI,
  crawlee
};
