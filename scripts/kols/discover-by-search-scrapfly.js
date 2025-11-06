/**
 * ScrapFly-based KOL and Content Discovery
 * Searches X/Twitter for KOLs and engaging posts using ScrapFly API
 */

// Load environment variables from .env file (local dev only, GitHub Actions uses secrets)
import dotenv from 'dotenv';
dotenv.config();

import ScrapFlyClient from './utils/scrapfly-client.js';
import { getTrendingQueries } from './utils/trending-topics.js';
import { handleScrapFlyError, handleScrapFlySuccess } from './utils/scrapfly-error-handler.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, 'config/x-crawler-accounts.json');
const QUERIES_PATH = path.join(__dirname, 'config/search-queries-scrapfly.json');
const KOLS_DATA_PATH = path.join(__dirname, 'data/kols-data.json');
const ENGAGING_POSTS_PATH = path.join(__dirname, 'data/engaging-posts.json');
const PROCESSED_POSTS_PATH = path.join(__dirname, 'data/processed-posts.json');

/**
 * Load configuration
 */
async function loadConfig() {
  const config = JSON.parse(await fs.readFile(CONFIG_PATH, 'utf-8'));
  const queriesConfig = JSON.parse(await fs.readFile(QUERIES_PATH, 'utf-8'));

  // Filter active accounts with cookies
  const activeAccounts = config.accounts.filter(acc =>
    acc.status === 'active' &&
    acc.cookies &&
    acc.cookies.auth_token &&
    acc.cookies.ct0
  );

  return {
    // Prioritize environment variable (GitHub Secrets or .env) over config file
    apiKey: process.env.SCRAPFLY_API_KEY || config.scrapfly?.apiKey || config.scrapfly?.api_key,
    accounts: activeAccounts,  // All active accounts for retry
    queries: queriesConfig,
  };
}

/**
 * Format cookies for ScrapFly
 */
function formatCookies(account) {
  const cookies = account.cookies;
  return `auth_token=${cookies.auth_token}; ct0=${cookies.ct0}; guest_id=${cookies.guest_id}`;
}

/**
 * Get rotation state and select next queries
 */
async function selectQueries(queriesConfig) {
  // Load processed posts to get rotation state
  let processed;
  try {
    processed = JSON.parse(await fs.readFile(PROCESSED_POSTS_PATH, 'utf-8'));
  } catch {
    processed = { queryRotation: { lastCategory: null, lastIndex: 0 } };
  }

  const rotation = queriesConfig.rotation;
  const categories = rotation.categoryRotation;
  const queriesPerRun = rotation.queriesPerRun;

  // Add trending queries
  const trendingQueries = await getTrendingQueries();
  queriesConfig.queries.trending = trendingQueries;

  // Collect all queries with their categories
  const allQueries = [];
  for (const category of categories) {
    const categoryQueries = queriesConfig.queries[category] || [];
    categoryQueries.forEach(q => {
      allQueries.push({ ...q, category });
    });
  }

  // Rotate selection
  const rotationState = processed.queryRotation || { lastIndex: 0 };
  const startIndex = rotationState.lastIndex || 0;
  const selected = [];

  for (let i = 0; i < queriesPerRun && allQueries.length > 0; i++) {
    const index = (startIndex + i) % allQueries.length;
    selected.push(allQueries[index]);
  }

  // Update rotation state
  const newIndex = (startIndex + queriesPerRun) % allQueries.length;
  processed.queryRotation = { lastIndex: newIndex, lastUpdated: new Date().toISOString() };
  await fs.writeFile(PROCESSED_POSTS_PATH, JSON.stringify(processed, null, 2));

  return selected;
}

/**
 * Parse tweets from XHR search response
 */
function parseTweetsFromXHR(xhrCalls) {
  const tweets = [];
  const users = new Map();

  const searchCalls = xhrCalls.filter(xhr =>
    xhr.url && (xhr.url.includes('SearchTimeline') || xhr.url.includes('search/adaptive'))
  );

  for (const xhr of searchCalls) {
    if (!xhr.response || !xhr.response.body) continue;

    try {
      const data = JSON.parse(xhr.response.body);
      const instructions = data.data?.search_by_raw_query?.search_timeline?.timeline?.instructions || [];

      for (const instruction of instructions) {
        if (instruction.type === 'TimelineAddEntries') {
          const entries = instruction.entries || [];

          for (const entry of entries) {
            const tweetResult = entry.content?.itemContent?.tweet_results?.result;
            if (!tweetResult || !tweetResult.legacy) continue;

            const tweet = tweetResult.legacy;
            const userResult = tweetResult.core?.user_results?.result;

            // Extract user data
            const username = userResult?.core?.screen_name || userResult?.legacy?.screen_name;
            const displayName = userResult?.core?.name || userResult?.legacy?.name;
            const verified = userResult?.is_blue_verified || false;
            const followersCount = userResult?.legacy?.followers_count || 0;
            const friendsCount = userResult?.legacy?.friends_count || 0;
            const description = userResult?.legacy?.description || '';

            if (username && !users.has(username)) {
              users.set(username, {
                username,
                displayName,
                verified,
                followersCount,
                friendsCount,
                description,
              });
            }

            // Extract tweet data
            tweets.push({
              id: tweet.id_str,
              text: tweet.full_text,
              username: username || 'unknown',
              displayName: displayName || 'Unknown',
              created_at: tweet.created_at,
              likes: tweet.favorite_count,
              retweets: tweet.retweet_count,
              replies: tweet.reply_count,
              views: tweetResult.views?.count || 0,
              verified: verified,
            });
          }
        }
      }
    } catch (e) {
      console.error('Parse error:', e.message);
    }
  }

  return { tweets, users: Array.from(users.values()) };
}

/**
 * Filter tweets by engagement thresholds
 */
function filterByEngagement(tweets, query) {
  return tweets.filter(tweet => {
    return (
      tweet.likes >= query.min_likes &&
      tweet.retweets >= query.min_retweets &&
      tweet.views >= query.min_views
    );
  });
}

/**
 * Identify KOLs from users
 */
function identifyKOLs(users, minFollowers = 10000, maxFollowers = 1000000) {
  return users.filter(user => {
    const followers = user.followersCount || 0;
    const hasCryptoKeywords = user.description?.toLowerCase().includes('crypto') ||
                              user.description?.toLowerCase().includes('blockchain') ||
                              user.description?.toLowerCase().includes('defi') ||
                              user.description?.toLowerCase().includes('nft');

    return followers >= minFollowers &&
           followers <= maxFollowers &&
           hasCryptoKeywords;
  });
}

/**
 * Load existing KOLs data
 */
async function loadExistingKOLs() {
  try {
    const data = await fs.readFile(KOLS_DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Save KOLs data
 */
async function saveKOLs(kols, newKOLs) {
  // Merge new KOLs with existing
  const existingUsernames = new Set(kols.map(k => k.username));
  const toAdd = newKOLs.filter(k => !existingUsernames.has(k.username));

  const updatedKOLs = [...kols, ...toAdd.map(k => ({
    id: `twitter_${k.username}`,
    username: k.username,
    displayName: k.displayName,
    followersCount: k.followersCount,
    verified: k.verified,
    description: k.description,
    discoveryMethod: 'scrapfly',
    lastSearchQuery: 'multiple',
    discoveredAt: new Date().toISOString(),
    status: 'active',
  }))];

  await fs.writeFile(KOLS_DATA_PATH, JSON.stringify(updatedKOLs, null, 2));
  console.log(`✅ Saved ${toAdd.length} new KOLs (total: ${updatedKOLs.length})`);

  return toAdd.length;
}

/**
 * Load existing engaging posts
 */
async function loadEngagingPosts() {
  try {
    const data = await fs.readFile(ENGAGING_POSTS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { posts: [], metadata: { lastUpdated: null, totalPosts: 0 } };
  }
}

/**
 * Save engaging posts
 */
async function saveEngagingPosts(existingData, newPosts, query) {
  // Remove expired posts (48h TTL)
  const now = new Date().getTime();
  const validPosts = existingData.posts.filter(p => {
    const expiresAt = new Date(p.expiresAt).getTime();
    return expiresAt > now;
  });

  // Add new posts
  const existingIds = new Set(validPosts.map(p => p.id));
  const toAdd = newPosts.filter(p => !existingIds.has(p.id));

  const enrichedPosts = toAdd.map(p => ({
    ...p,
    category: query.category,
    query: query.query,
    relevanceScore: null, // To be filled by AI evaluation later
    discoveredAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    processed: false,
  }));

  const allPosts = [...validPosts, ...enrichedPosts];

  // Update metadata
  const metadata = {
    lastUpdated: new Date().toISOString(),
    totalPosts: allPosts.length,
    byCategory: {},
  };

  // Count by category
  for (const post of allPosts) {
    metadata.byCategory[post.category] = (metadata.byCategory[post.category] || 0) + 1;
  }

  const updated = {
    posts: allPosts,
    metadata,
  };

  await fs.writeFile(ENGAGING_POSTS_PATH, JSON.stringify(updated, null, 2));
  console.log(`✅ Saved ${enrichedPosts.length} new engaging posts (total: ${allPosts.length})`);

  return enrichedPosts.length;
}

/**
 * Main discovery function
 */
export async function discover() {
  console.log('🔍 Starting ScrapFly-based KOL Discovery\n');

  const startTime = Date.now();
  const stats = {
    queriesExecuted: 0,
    tweetsFound: 0,
    kolsFound: 0,
    engagingPostsFound: 0,
    errors: 0,
    accountsAttempted: [],
  };

  try {
    // Load config
    const { apiKey, accounts, queries: queriesConfig } = await loadConfig();

    if (accounts.length === 0) {
      throw new Error('No active accounts with valid cookies found in config');
    }

    console.log(`📱 Available accounts: ${accounts.length}`);
    console.log(`   Primary: @${accounts[0].username} (${accounts[0].id})`);
    if (accounts.length > 1) {
      console.log(`   Fallbacks: ${accounts.slice(1).map(a => `@${a.username}`).join(', ')}`);
    }

    // Initialize client
    const client = new ScrapFlyClient(apiKey);

    // Select queries for this run
    const selectedQueries = await selectQueries(queriesConfig);
    console.log(`\n📋 Selected ${selectedQueries.length} queries:\n`);
    selectedQueries.forEach((q, i) => {
      console.log(`${i + 1}. [${q.category}] ${q.query.substring(0, 60)}...`);
    });

    // Execute searches
    const allTweets = [];
    const allUsers = [];

    for (const query of selectedQueries) {
      let querySuccess = false;
      let lastError = null;

      // Try each account until one succeeds
      for (let accountIndex = 0; accountIndex < accounts.length; accountIndex++) {
        const account = accounts[accountIndex];
        const cookieString = formatCookies(account);

        try {
          console.log(`\n🔎 Searching: ${query.query}`);
          console.log(`   👤 Using: @${account.username} (${account.id})`);

          const result = await client.searchTwitter(query.query, {
            cookies: cookieString,
            session: `${account.id}-session`,
            format: 'json',
            autoScroll: false,
            timeout: 60000,
            retry: false,
          });

          // Track which account was used
          if (!stats.accountsAttempted.includes(account.username)) {
            stats.accountsAttempted.push(account.username);
          }

          stats.queriesExecuted++;
          querySuccess = true;

          // Parse results
          const xhrCalls = result.result.browser_data?.xhr_call || [];
          const { tweets, users } = parseTweetsFromXHR(xhrCalls);

          console.log(`   ✅ Found ${tweets.length} tweets from ${users.length} users`);

          // Filter by engagement
          const filtered = filterByEngagement(tweets, query);
          console.log(`   ${filtered.length} meet engagement threshold`);

          allTweets.push(...filtered.map(t => ({ ...t, query: query.query, category: query.category })));
          allUsers.push(...users);

          stats.tweetsFound += filtered.length;

          // Small delay between queries
          await new Promise(resolve => setTimeout(resolve, 2000));

          break; // Success - don't try more accounts

        } catch (error) {
          lastError = error;

          // Track which account failed
          if (!stats.accountsAttempted.includes(account.username)) {
            stats.accountsAttempted.push(account.username);
          }

          const isAuthError = error.message.includes('401') || error.message.includes('403');

          console.error(`   ❌ Failed with @${account.username}: ${error.message}`);
          console.error(`      Authentication error: ${isAuthError ? 'YES (will try next account)' : 'NO'}`);
          console.error(`      Proxy used: public_residential_pool (us)`);

          // If auth error and more accounts available, try next account
          if (isAuthError && accountIndex < accounts.length - 1) {
            console.log(`   🔄 Trying next account...`);
            continue;
          }

          // If credit error or last account, re-throw
          if (error.message.includes('credit') || accountIndex === accounts.length - 1) {
            stats.errors++;

            // Add detailed context to error
            error.accountsFailed = stats.accountsAttempted;
            error.proxyUsed = 'public_residential_pool (us)';
            error.lastAccountTried = account.username;

            throw error;
          }

          break; // Non-auth error - don't try more accounts
        }
      }

      // If query failed with all accounts
      if (!querySuccess && lastError) {
        console.error(`   ⚠️  Query failed with all ${accounts.length} accounts`);
        stats.errors++;
      }
    }

    // Identify KOLs
    const kols = identifyKOLs(allUsers);
    console.log(`\n👥 Identified ${kols.length} potential KOLs`);
    stats.kolsFound = kols.length;

    // Save KOLs
    const existingKOLs = await loadExistingKOLs();
    const newKOLsCount = await saveKOLs(existingKOLs, kols);

    // Save engaging posts
    const existingPosts = await loadEngagingPosts();
    let newPostsCount = 0;
    for (const query of selectedQueries) {
      const queryTweets = allTweets.filter(t => t.query === query.query);
      newPostsCount += await saveEngagingPosts(existingPosts, queryTweets, query);
    }
    stats.engagingPostsFound = newPostsCount;

    // Mark success
    await handleScrapFlySuccess({ creditsRemaining: 'Check dashboard' });

    // Print summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n✅ Discovery complete in ${duration}s`);
    console.log(`📊 Summary:`);
    console.log(`   Accounts used: ${stats.accountsAttempted.join(', ')}`);
    console.log(`   Queries executed: ${stats.queriesExecuted}`);
    console.log(`   Tweets found: ${stats.tweetsFound}`);
    console.log(`   New KOLs: ${newKOLsCount}`);
    console.log(`   New engaging posts: ${newPostsCount}`);
    console.log(`   Errors: ${stats.errors}`);

    return stats;

  } catch (error) {
    console.error('\n❌ Discovery failed:', error.message);
    console.error(`   Accounts attempted: ${stats.accountsAttempted.join(', ') || 'None'}`);

    if (error.accountsFailed) {
      console.error(`   All failed accounts: ${error.accountsFailed.join(', ')}`);
    }
    if (error.lastAccountTried) {
      console.error(`   Last account tried: @${error.lastAccountTried}`);
    }
    if (error.proxyUsed) {
      console.error(`   Proxy: ${error.proxyUsed}`);
    }

    // Handle error and send alerts
    await handleScrapFlyError(error, {
      queriesAttempted: stats.queriesExecuted,
      accountsAttempted: stats.accountsAttempted,
      accountsFailed: error.accountsFailed || stats.accountsAttempted,
      lastAccountTried: error.lastAccountTried,
      proxyUsed: error.proxyUsed || 'public_residential_pool (us)',
      workflowUrl: process.env.GITHUB_RUN_URL,
    });

    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  discover()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export default discover;
