import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load search queries configuration
 */
export function loadSearchQueries() {
  const configPath = path.join(__dirname, '..', 'config', 'search-queries.json');

  try {
    const data = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading search queries: ${error.message}`);
    throw error;
  }
}

/**
 * Execute a search query with proper options
 * @param {Object} client - Twitter API client
 * @param {string} query - Search query string
 * @param {number} maxResults - Maximum tweets to fetch (default 100)
 * @param {number} hoursBack - How many hours back to search (default 24)
 */
export async function executeSearchQuery(client, query, maxResults = 100, hoursBack = 24) {
  try {
    // Calculate start_time (X hours ago in ISO 8601 format)
    const startTime = new Date(Date.now() - (hoursBack * 60 * 60 * 1000)).toISOString();

    const result = await client.v2.search(query, {
      max_results: Math.min(maxResults, 100), // Twitter API max per page is 100
      start_time: startTime, // Only get tweets from last X hours
      sort_order: 'relevancy', // Sort by relevance (most engaging first)
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
    });

    // Collect tweets from paginator, but respect maxResults limit
    const tweets = [];
    for await (const tweet of result) {
      tweets.push(tweet);
      // Stop if we've reached the desired limit
      if (tweets.length >= maxResults) {
        break;
      }
    }

    return {
      tweets: tweets,
      includes: result.includes || {},
      meta: result.meta || {}
    };
  } catch (error) {
    console.error(`Error executing search query "${query}": ${error.message}`);
    return {
      tweets: [],
      includes: {},
      meta: {},
      error: error.message
    };
  }
}

/**
 * Extract unique user IDs from tweets and their interactions
 */
export function extractUserIdsFromTweets(tweets, includes = {}) {
  const userIds = new Set();

  for (const tweet of tweets) {
    // Add tweet author
    if (tweet.author_id) {
      userIds.add(tweet.author_id);
    }

    // Add mentioned users
    if (tweet.entities?.mentions) {
      for (const mention of tweet.entities.mentions) {
        if (mention.id) {
          userIds.add(mention.id);
        }
      }
    }

    // Add reply targets
    if (tweet.in_reply_to_user_id) {
      userIds.add(tweet.in_reply_to_user_id);
    }
  }

  // Add users from expanded referenced tweets
  if (includes.tweets) {
    for (const refTweet of includes.tweets) {
      if (refTweet.author_id) {
        userIds.add(refTweet.author_id);
      }
    }
  }

  return Array.from(userIds);
}

/**
 * Filter tweets by engagement thresholds
 */
export function filterByEngagement(tweets, threshold) {
  return tweets.filter(tweet => {
    const metrics = tweet.public_metrics || {};

    const likesPass = metrics.like_count >= threshold.minLikes;
    const retweetsPass = metrics.retweet_count >= threshold.minRetweets;
    const viewsPass = !threshold.minViews || (metrics.impression_count >= threshold.minViews);

    return likesPass && retweetsPass && viewsPass;
  });
}

/**
 * Deduplicate user IDs against existing database
 */
export function deduplicateAgainstDatabase(userIds, existingKols) {
  const existingIds = new Set(existingKols.map(kol => kol.id));
  return userIds.filter(id => !existingIds.has(id));
}

/**
 * Batch lookup users (handles splitting into 100-user chunks)
 */
export async function batchLookupUsers(client, userIds) {
  if (userIds.length === 0) {
    return [];
  }

  const batches = [];
  for (let i = 0; i < userIds.length; i += 100) {
    batches.push(userIds.slice(i, i + 100));
  }

  const allUsers = [];

  for (const batch of batches) {
    try {
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
      }
    } catch (error) {
      console.error(`Error in batch lookup: ${error.message}`);
      // Continue with other batches even if one fails
    }
  }

  return allUsers;
}

/**
 * Get engagement statistics from search results
 */
export function getSearchStats(tweets) {
  if (!tweets || !Array.isArray(tweets) || tweets.length === 0) {
    return {
      totalTweets: 0,
      avgLikes: 0,
      avgRetweets: 0,
      avgViews: 0,
      maxLikes: 0,
      maxRetweets: 0
    };
  }

  const totals = tweets.reduce((acc, tweet) => {
    const pm = tweet.public_metrics || {};
    return {
      likes: acc.likes + (pm.like_count || 0),
      retweets: acc.retweets + (pm.retweet_count || 0),
      views: acc.views + (pm.impression_count || 0),
      maxLikes: Math.max(acc.maxLikes, pm.like_count || 0),
      maxRetweets: Math.max(acc.maxRetweets, pm.retweet_count || 0)
    };
  }, { likes: 0, retweets: 0, views: 0, maxLikes: 0, maxRetweets: 0 });

  return {
    totalTweets: tweets.length,
    avgLikes: Math.round(totals.likes / tweets.length),
    avgRetweets: Math.round(totals.retweets / tweets.length),
    avgViews: Math.round(totals.views / tweets.length),
    maxLikes: totals.maxLikes,
    maxRetweets: totals.maxRetweets
  };
}

export default {
  loadSearchQueries,
  executeSearchQuery,
  extractUserIdsFromTweets,
  filterByEngagement,
  deduplicateAgainstDatabase,
  batchLookupUsers,
  getSearchStats
};
