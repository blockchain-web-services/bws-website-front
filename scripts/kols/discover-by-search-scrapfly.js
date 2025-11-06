/**
 * ScrapFly-based KOL and Content Discovery
 * Searches X/Twitter for KOLs and engaging posts using ScrapFly API
 */

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

  return {
    apiKey: config.scrapfly?.apiKey || config.scrapfly?.api_key,
    account: config.accounts[0],
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
  };

  try {
    // Load config
    const { apiKey, account, queries: queriesConfig } = await loadConfig();
    console.log(`📱 Using account: ${account.username}`);

    // Format cookies
    const cookieString = formatCookies(account);

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
      try {
        console.log(`\n🔎 Searching: ${query.query}`);

        const result = await client.searchTwitter(query.query, {
          cookies: cookieString,
          session: 'discovery-session',
          format: 'json',
          autoScroll: false,
          timeout: 60000,
          retry: false,
        });

        stats.queriesExecuted++;

        // Parse results
        const xhrCalls = result.result.browser_data?.xhr_call || [];
        const { tweets, users } = parseTweetsFromXHR(xhrCalls);

        console.log(`   Found ${tweets.length} tweets from ${users.length} users`);

        // Filter by engagement
        const filtered = filterByEngagement(tweets, query);
        console.log(`   ${filtered.length} meet engagement threshold`);

        allTweets.push(...filtered.map(t => ({ ...t, query: query.query, category: query.category })));
        allUsers.push(...users);

        stats.tweetsFound += filtered.length;

        // Small delay between queries
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`   ❌ Query failed: ${error.message}`);
        stats.errors++;

        // Check if it's a critical error
        if (error.message.includes('401') || error.message.includes('403') ||
            error.message.includes('credit')) {
          throw error; // Re-throw critical errors
        }
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
    console.log(`   Queries executed: ${stats.queriesExecuted}`);
    console.log(`   Tweets found: ${stats.tweetsFound}`);
    console.log(`   New KOLs: ${newKOLsCount}`);
    console.log(`   New engaging posts: ${newPostsCount}`);
    console.log(`   Errors: ${stats.errors}`);

    return stats;

  } catch (error) {
    console.error('\n❌ Discovery failed:', error.message);

    // Handle error and send alerts
    await handleScrapFlyError(error, {
      queriesAttempted: stats.queriesExecuted,
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
