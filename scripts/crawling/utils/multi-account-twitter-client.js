import { TwitterApi } from 'twitter-api-v2';
import { HttpsProxyAgent } from 'https-proxy-agent';
import apiTracker from './api-call-tracker.js';
import usageLogger from './api-usage-logger.js';

/**
 * Multi-Account Twitter Client
 *
 * Decouples search operations from posting to avoid 403 Forbidden errors
 * caused by high-volume API activity pattern on posting account.
 *
 * Strategy:
 * - Use 2-3 separate Twitter accounts for search operations (rotates)
 * - Use dedicated @BWSXAI account ONLY for posting replies
 * - Reduces @BWSXAI API activity from 100+ calls → 1 call per run
 * - Makes pattern look like normal user (similar to Test F which succeeds)
 */

/**
 * Create Oxylabs proxy agent for Twitter API requests
 * Only used on CI/GitHub Actions environments
 */
function createProxyAgent(sessionId = 'bwsxai-posting') {
  // Only use proxy on CI (GitHub Actions)
  const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

  if (!isCI) {
    return null; // No proxy for local development
  }

  // Get proxy credentials from environment (set in GitHub Secrets)
  const proxyUsername = process.env.OXYLABS_USERNAME;
  const proxyPassword = process.env.OXYLABS_PASSWORD;

  if (!proxyUsername || !proxyPassword) {
    console.log('   ⚠️  Running on CI without proxy (credentials not found)');
    return null;
  }

  // Oxylabs proxy configuration
  // Use session-based proxy for consistency (same IP across requests)
  const proxyUrl = `http://customer-${proxyUsername}-sessid-${sessionId}:${proxyPassword}@pr.oxylabs.io:7777`;

  return new HttpsProxyAgent(proxyUrl);
}

/**
 * Create Twitter client for a specific account
 */
function createClient(credentials, proxySessionId = null) {
  const { appKey, appSecret, accessToken, accessSecret } = credentials;

  if (!appKey || !appSecret || !accessToken || !accessSecret) {
    throw new Error('All Twitter OAuth credentials are required');
  }

  const clientConfig = {
    appKey,
    appSecret,
    accessToken,
    accessSecret,
  };

  // Add proxy agent if session ID provided
  if (proxySessionId) {
    const proxyAgent = createProxyAgent(proxySessionId);
    if (proxyAgent) {
      clientConfig.agent = proxyAgent;
      console.log(`   🌐 Using Oxylabs proxy (session: ${proxySessionId})`);
    }
  }

  return new TwitterApi(clientConfig);
}

/**
 * Multi-Account Twitter Client Manager
 */
export class MultiAccountTwitterClient {
  constructor() {
    this.searchAccounts = [];
    this.postingClient = null;
    this.currentSearchIndex = 0;
    this.initialized = false;
  }

  /**
   * Initialize all accounts
   */
  initialize() {
    if (this.initialized) {
      return; // Already initialized
    }

    console.log('\n📚 Initializing Multi-Account Twitter Client...');
    console.log('   Strategy: Decoupled search (multiple accounts) + posting (single account)\n');

    // Initialize search accounts
    const searchAccountCount = this.#initializeSearchAccounts();

    // Initialize posting account
    this.#initializePostingAccount();

    console.log(`\n✅ Multi-Account Client initialized:`);
    console.log(`   - Search accounts: ${searchAccountCount}`);
    console.log(`   - Posting account: @BWSXAI`);
    console.log(`   - Strategy: ${searchAccountCount}x search → 1x post (99% activity reduction)\n`);

    this.initialized = true;
  }

  /**
   * Initialize search accounts from environment variables
   * Supports up to 3 search accounts (SEARCH1, SEARCH2, SEARCH3)
   */
  #initializeSearchAccounts() {
    const accountPrefixes = ['SEARCH1', 'SEARCH2', 'SEARCH3'];
    let count = 0;

    for (const prefix of accountPrefixes) {
      const credentials = {
        appKey: process.env[`${prefix}_API_KEY`],
        appSecret: process.env[`${prefix}_API_SECRET`],
        accessToken: process.env[`${prefix}_ACCESS_TOKEN`],
        accessSecret: process.env[`${prefix}_ACCESS_SECRET`],
      };

      // Check if all credentials are present
      const hasAllCredentials = Object.values(credentials).every(val => val);

      if (hasAllCredentials) {
        const client = createClient(credentials);
        this.searchAccounts.push({
          name: prefix.toLowerCase(),
          client,
          callCount: 0
        });
        console.log(`   ✓ Search account loaded: ${prefix.toLowerCase()}`);
        count++;
      } else if (credentials.appKey || credentials.appSecret) {
        // Partial credentials - warn user
        console.warn(`   ⚠️  ${prefix} has partial credentials - skipping`);
      }
      // If no credentials at all, silently skip (account not configured)
    }

    if (count === 0) {
      throw new Error(
        'No search accounts configured! Please set up at least SEARCH1_* credentials.\n' +
        'See /tmp/kol-monitoring/multi-account-setup-guide.md for setup instructions.'
      );
    }

    return count;
  }

  /**
   * Initialize posting account (@BWSXAI)
   */
  #initializePostingAccount() {
    const credentials = {
      appKey: process.env.BWSXAI_TWITTER_API_KEY,
      appSecret: process.env.BWSXAI_TWITTER_API_SECRET,
      accessToken: process.env.BWSXAI_TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.BWSXAI_TWITTER_ACCESS_SECRET,
    };

    // Create client with proxy (use dedicated session for posting)
    this.postingClient = createClient(credentials, 'bwsxai-posting');
    console.log(`   ✓ Posting account loaded: @BWSXAI (with proxy)`);
  }

  /**
   * Get next search client (round-robin rotation)
   */
  getSearchClient() {
    if (!this.initialized) {
      this.initialize();
    }

    const account = this.searchAccounts[this.currentSearchIndex];
    account.callCount++;

    // Rotate to next account
    this.currentSearchIndex = (this.currentSearchIndex + 1) % this.searchAccounts.length;

    console.log(`   📚 Using search account: ${account.name} (${account.callCount} calls)`);

    return account.client;
  }

  /**
   * Get posting client (@BWSXAI)
   */
  getPostingClient() {
    if (!this.initialized) {
      this.initialize();
    }

    console.log(`   ✍️  Using posting account: @BWSXAI (dedicated for replies only)`);

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

    console.log('\n📊 Multi-Account Usage Summary:');
    console.log(`   Total search calls: ${stats.totalSearchCalls}`);
    console.log(`   Distributed across ${stats.accountCount} accounts:\n`);

    stats.searchAccounts.forEach(acc => {
      const bar = '█'.repeat(Math.floor(acc.calls / 5));
      console.log(`   ${acc.name.padEnd(8)}: ${String(acc.calls).padStart(3)} calls ${bar}`);
    });

    console.log(`\n   Load distribution:`);
    stats.loadDistribution.forEach(acc => {
      console.log(`   ${acc.name}: ${acc.percentage}%`);
    });

    console.log(`\n   ✅ @BWSXAI activity: 1 call (reply only)`);
    console.log(`   📉 Activity reduction: ${stats.totalSearchCalls}+ → 1 (${Math.round((1/(stats.totalSearchCalls+1))*100)}%)\n`);
  }
}

// Create singleton instance
const multiAccountClient = new MultiAccountTwitterClient();

/**
 * Wrapper functions that use appropriate client
 */

/**
 * Fetch user by username (uses search account)
 */
export async function getUserByUsername(username) {
  const client = multiAccountClient.getSearchClient();

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
 * Search recent tweets by query (uses search account)
 */
export async function searchTweets(query, options = {}) {
  const client = multiAccountClient.getSearchClient();

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
 * Get user tweets via Search API (uses search account)
 */
export async function getUserTweetsViaSearch(username, maxResults = 100) {
  const query = `from:${username} -is:retweet -is:reply`;

  const result = await searchTweets(query, {
    max_results: Math.min(maxResults, 100) // Search API max is 100
  });

  // Collect tweets from paginator
  const tweets = [];
  for await (const tweet of result) {
    tweets.push(tweet);
    if (tweets.length >= maxResults) break;
  }

  return tweets;
}

/**
 * Post a reply to a tweet (uses posting account ONLY)
 */
export async function postReply(tweetId, replyText, dryRun = false) {
  const client = multiAccountClient.getPostingClient();

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
 * Get tweet by ID (uses search account)
 */
export async function getTweetById(tweetId) {
  const client = multiAccountClient.getSearchClient();

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
 * Initialize multi-account client (call this at start of your script)
 */
export function initializeMultiAccountClient() {
  multiAccountClient.initialize();
}

/**
 * Print usage summary (call this at end of your script)
 */
export function printMultiAccountUsageSummary() {
  multiAccountClient.printUsageSummary();
}

/**
 * Get the multi-account client instance (for advanced usage)
 */
export function getMultiAccountClient() {
  return multiAccountClient;
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
