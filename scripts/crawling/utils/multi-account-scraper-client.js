import { Scraper } from '@the-convocation/twitter-scraper';
import { TwitterApi } from 'twitter-api-v2';
import { HttpsProxyAgent } from 'https-proxy-agent';
import apiTracker from './api-call-tracker.js';
import usageLogger from './api-usage-logger.js';

/**
 * Multi-Account Twitter Scraper Client
 *
 * Decouples search operations from Twitter API to avoid 403 Forbidden errors.
 *
 * Strategy:
 * - Use @the-convocation/twitter-scraper for search operations (NO Twitter API)
 * - Use 2-3 separate Twitter accounts for searching (rotates, logs in with credentials)
 * - Use Twitter API v2 ONLY for posting replies from @BWSXAI
 * - Reduces @BWSXAI Twitter API activity from 100+ calls → 1 call per run
 *
 * Key Difference from multi-account-twitter-client.js:
 * - Search operations use twitter-scraper (reverse-engineered frontend API)
 * - NOT using official Twitter API for searches
 * - Still requires real Twitter accounts but uses username/password authentication
 */

/**
 * Create Oxylabs proxy agent for Twitter API requests
 * Only used for posting from @BWSXAI
 */
function createProxyAgent(sessionId = 'bwsxai-posting') {
  const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

  if (!isCI) {
    return null;
  }

  const proxyUsername = process.env.OXYLABS_USERNAME;
  const proxyPassword = process.env.OXYLABS_PASSWORD;

  if (!proxyUsername || !proxyPassword) {
    console.log('   ⚠️  Running on CI without proxy (credentials not found)');
    return null;
  }

  const proxyUrl = `http://customer-${proxyUsername}-sessid-${sessionId}:${proxyPassword}@pr.oxylabs.io:7777`;

  return new HttpsProxyAgent(proxyUrl);
}

/**
 * Create Twitter API v2 client for posting (only used for @BWSXAI)
 */
function createPostingClient() {
  const credentials = {
    appKey: process.env.BWSXAI_TWITTER_API_KEY,
    appSecret: process.env.BWSXAI_TWITTER_API_SECRET,
    accessToken: process.env.BWSXAI_TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.BWSXAI_TWITTER_ACCESS_SECRET,
  };

  if (!credentials.appKey || !credentials.appSecret || !credentials.accessToken || !credentials.accessSecret) {
    throw new Error('All BWSXAI Twitter OAuth credentials are required for posting');
  }

  const clientConfig = { ...credentials };

  // Add proxy for posting
  const proxyAgent = createProxyAgent('bwsxai-posting');
  if (proxyAgent) {
    clientConfig.agent = proxyAgent;
    console.log(`   🌐 Using Oxylabs proxy for posting (session: bwsxai-posting)`);
  }

  return new TwitterApi(clientConfig);
}

/**
 * Multi-Account Scraper Client Manager
 */
export class MultiAccountScraperClient {
  constructor() {
    this.searchAccounts = [];
    this.postingClient = null;
    this.currentSearchIndex = 0;
    this.initialized = false;
  }

  /**
   * Initialize all accounts
   */
  async initialize() {
    if (this.initialized) {
      return;
    }

    console.log('\n📚 Initializing Multi-Account Twitter Scraper Client...');
    console.log('   Strategy: twitter-scraper (NO API) for searches + Twitter API for posting only\n');

    // Initialize search scrapers
    const searchAccountCount = await this.#initializeSearchScrapers();

    // Initialize posting client
    this.#initializePostingClient();

    console.log(`\n✅ Multi-Account Scraper Client initialized:`);
    console.log(`   - Search accounts: ${searchAccountCount} (using twitter-scraper library)`);
    console.log(`   - Posting account: @BWSXAI (using Twitter API v2)`);
    console.log(`   - Strategy: ${searchAccountCount}x scraper searches → 1x API post (99% API reduction)\n`);

    this.initialized = true;
  }

  /**
   * Initialize search scrapers from environment variables
   * Supports up to 3 search accounts (SEARCH1, SEARCH2, SEARCH3)
   */
  async #initializeSearchScrapers() {
    const accountPrefixes = ['SEARCH1', 'SEARCH2', 'SEARCH3'];
    let count = 0;

    for (const prefix of accountPrefixes) {
      const username = process.env[`${prefix}_USERNAME`];
      const password = process.env[`${prefix}_PASSWORD`];
      const email = process.env[`${prefix}_EMAIL`];

      // Check if credentials are present
      if (!username || !password) {
        if (username || password) {
          console.warn(`   ⚠️  ${prefix} has partial credentials - skipping`);
        }
        continue;
      }

      try {
        console.log(`   🔑 Logging into ${prefix.toLowerCase()}...`);

        const scraper = new Scraper();
        await scraper.login(username, password, email);

        // Verify login was successful
        if (await scraper.isLoggedIn()) {
          this.searchAccounts.push({
            name: prefix.toLowerCase(),
            scraper,
            callCount: 0
          });
          console.log(`   ✓ Search account loaded: ${prefix.toLowerCase()}`);
          count++;
        } else {
          console.error(`   ❌ ${prefix} login failed - authentication unsuccessful`);
        }
      } catch (error) {
        console.error(`   ❌ ${prefix} login error: ${error.message}`);
      }
    }

    if (count === 0) {
      throw new Error(
        'No search accounts configured! Please set up at least SEARCH1_USERNAME and SEARCH1_PASSWORD.\n' +
        'See /tmp/kol-monitoring/crawlee-multiaccount-analysis.md for setup instructions.'
      );
    }

    return count;
  }

  /**
   * Initialize posting client (@BWSXAI) - uses Twitter API v2
   */
  #initializePostingClient() {
    this.postingClient = createPostingClient();
    console.log(`   ✓ Posting account loaded: @BWSXAI (Twitter API v2 with proxy)`);
  }

  /**
   * Get next search scraper (round-robin rotation)
   */
  getSearchScraper() {
    if (!this.initialized) {
      throw new Error('Client not initialized. Call initialize() first.');
    }

    const account = this.searchAccounts[this.currentSearchIndex];
    account.callCount++;

    // Rotate to next account
    this.currentSearchIndex = (this.currentSearchIndex + 1) % this.searchAccounts.length;

    console.log(`   📚 Using search scraper: ${account.name} (${account.callCount} calls)`);

    return account.scraper;
  }

  /**
   * Get posting client (@BWSXAI) - uses Twitter API v2
   */
  getPostingClient() {
    if (!this.initialized) {
      throw new Error('Client not initialized. Call initialize() first.');
    }

    console.log(`   ✍️  Using posting account: @BWSXAI (Twitter API v2 - dedicated for replies only)`);

    return this.postingClient;
  }

  /**
   * Get usage statistics
   */
  getUsageStats() {
    const searchCalls = this.searchAccounts.reduce((sum, acc) => sum + acc.callCount, 0);

    return {
      searchAccounts: this.searchAccounts.map(acc => ({
        name: acc.name,
        calls: acc.callCount
      })),
      totalSearchCalls: searchCalls,
      accountCount: this.searchAccounts.length,
      loadDistribution: this.searchAccounts.map(acc => ({
        name: acc.name,
        percentage: searchCalls > 0 ? Math.round((acc.callCount / searchCalls) * 100) : 0
      }))
    };
  }

  /**
   * Print usage summary
   */
  printUsageSummary() {
    const stats = this.getUsageStats();

    console.log('\n📊 Multi-Account Scraper Usage Summary:');
    console.log(`   Total scraper calls: ${stats.totalSearchCalls} (NO Twitter API used)`);
    console.log(`   Distributed across ${stats.accountCount} accounts:\n`);

    stats.searchAccounts.forEach(acc => {
      const bar = '█'.repeat(Math.floor(acc.calls / 5));
      console.log(`   ${acc.name.padEnd(8)}: ${String(acc.calls).padStart(3)} calls ${bar}`);
    });

    console.log(`\n   Load distribution:`);
    stats.loadDistribution.forEach(acc => {
      console.log(`   ${acc.name}: ${acc.percentage}%`);
    });

    console.log(`\n   ✅ @BWSXAI activity: 1 Twitter API call (reply only)`);
    console.log(`   📉 Twitter API reduction: 100+ → 1 (99% reduction)\n`);
  }
}

// Create singleton instance
const multiAccountScraperClient = new MultiAccountScraperClient();

/**
 * Wrapper functions that use appropriate client
 */

/**
 * Fetch user by username (uses search scraper - NO Twitter API)
 */
export async function getUserByUsername(username) {
  const scraper = multiAccountScraperClient.getSearchScraper();

  try {
    const profile = await scraper.getProfile(username);

    if (!profile) {
      apiTracker.recordCall('scraper/getProfile', 0, false, 'User not found');
      throw new Error(`User ${username} not found`);
    }

    apiTracker.recordCall('scraper/getProfile', 1, true);

    // Convert scraper format to Twitter API format for compatibility
    return {
      id: profile.userId,
      username: profile.username,
      name: profile.name,
      description: profile.biography,
      created_at: profile.joined?.toISOString(),
      public_metrics: {
        followers_count: profile.followersCount,
        following_count: profile.followingCount,
        tweet_count: profile.statusesCount,
        listed_count: profile.listedCount
      },
      verified: profile.isVerified,
      profile_image_url: profile.avatar
    };
  } catch (error) {
    apiTracker.recordCall('scraper/getProfile', 0, false, error.message);
    console.error(`Error fetching user ${username}: ${error.message}`);
    throw error;
  }
}

/**
 * Search recent tweets by query (uses search scraper - NO Twitter API)
 */
export async function searchTweets(query, options = {}) {
  const scraper = multiAccountScraperClient.getSearchScraper();
  const maxResults = options.max_results || 100;

  try {
    const tweets = [];

    // Use scraper's searchTweets (returns async iterator)
    for await (const tweet of scraper.searchTweets(query, maxResults)) {
      tweets.push({
        id: tweet.id,
        text: tweet.text,
        created_at: tweet.timeParsed?.toISOString(),
        author_id: tweet.userId,
        public_metrics: {
          retweet_count: tweet.retweetCount,
          reply_count: tweet.replyCount,
          like_count: tweet.likeCount,
          quote_count: tweet.quoteCount
        },
        entities: tweet.urls ? { urls: tweet.urls.map(u => ({ url: u })) } : undefined,
        referenced_tweets: tweet.isRetweet ? [{ type: 'retweeted', id: tweet.retweetedStatusId }] : undefined,
        in_reply_to_user_id: tweet.inReplyToStatusId,
        conversation_id: tweet.conversationId
      });

      if (tweets.length >= maxResults) break;
    }

    apiTracker.recordCall('scraper/searchTweets', tweets.length, true);

    // Return in format compatible with Twitter API v2 response
    return {
      data: { data: tweets },
      [Symbol.asyncIterator]: async function* () {
        for (const tweet of tweets) {
          yield tweet;
        }
      }
    };
  } catch (error) {
    const errorMsg = error.message || String(error);
    const is429 = errorMsg.includes('429') || errorMsg.includes('Too Many Requests');
    apiTracker.recordCall('scraper/searchTweets', 0, false, is429 ? 'Rate limit (429)' : errorMsg);

    console.error(`Error searching tweets: ${error.message}`);
    throw error;
  }
}

/**
 * Get user tweets via scraper (NO Twitter API)
 */
export async function getUserTweetsViaSearch(username, maxResults = 100) {
  const scraper = multiAccountScraperClient.getSearchScraper();

  try {
    const tweets = [];

    for await (const tweet of scraper.getTweets(username, maxResults)) {
      // Filter out retweets and replies
      if (!tweet.isRetweet && !tweet.inReplyToStatusId) {
        tweets.push({
          id: tweet.id,
          text: tweet.text,
          created_at: tweet.timeParsed?.toISOString(),
          author_id: tweet.userId,
          public_metrics: {
            retweet_count: tweet.retweetCount,
            reply_count: tweet.replyCount,
            like_count: tweet.likeCount,
            quote_count: tweet.quoteCount
          }
        });
      }

      if (tweets.length >= maxResults) break;
    }

    apiTracker.recordCall('scraper/getTweets', tweets.length, true);
    return tweets;
  } catch (error) {
    apiTracker.recordCall('scraper/getTweets', 0, false, error.message);
    console.error(`Error fetching tweets for ${username}: ${error.message}`);
    throw error;
  }
}

/**
 * Post a reply to a tweet (uses Twitter API v2 ONLY - @BWSXAI account)
 */
export async function postReply(tweetId, replyText, dryRun = false) {
  const client = multiAccountScraperClient.getPostingClient();

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
    // Enhanced 403 error logging
    const is403 = error.code === 403 || error.message?.includes('403');

    if (is403) {
      console.error(`❌ 403 Forbidden error on posting account:`);
      console.error(`   Despite using multi-account decoupling!`);
      console.error(`   This suggests account-level or other restrictions.`);
    }

    // Enhanced 429 error logging
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
 * Get tweet by ID (uses search scraper - NO Twitter API)
 */
export async function getTweetById(tweetId) {
  const scraper = multiAccountScraperClient.getSearchScraper();

  try {
    const tweet = await scraper.getTweet(tweetId);

    if (!tweet) {
      throw new Error(`Tweet ${tweetId} not found`);
    }

    // Convert to Twitter API format
    return {
      id: tweet.id,
      text: tweet.text,
      created_at: tweet.timeParsed?.toISOString(),
      author_id: tweet.userId,
      conversation_id: tweet.conversationId,
      public_metrics: {
        retweet_count: tweet.retweetCount,
        reply_count: tweet.replyCount,
        like_count: tweet.likeCount,
        quote_count: tweet.quoteCount
      }
    };
  } catch (error) {
    console.error(`Error fetching tweet ${tweetId}: ${error.message}`);
    throw error;
  }
}

/**
 * Initialize multi-account scraper client (call this at start of your script)
 */
export async function initializeMultiAccountClient() {
  await multiAccountScraperClient.initialize();
}

/**
 * Print usage summary (call this at end of your script)
 */
export function printMultiAccountUsageSummary() {
  multiAccountScraperClient.printUsageSummary();
}

/**
 * Get the multi-account client instance (for advanced usage)
 */
export function getMultiAccountClient() {
  return multiAccountScraperClient;
}

export { apiTracker };

export default {
  initializeMultiAccountClient,
  getUserByUsername,
  searchTweets,
  getUserTweetsViaSearch,
  postReply,
  getTweetById,
  printMultiAccountUsageSummary,
  getMultiAccountClient,
  apiTracker
};
