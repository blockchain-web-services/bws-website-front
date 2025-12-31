/**
 * Topic Trend Monitoring - BWS X SDK Version
 * Discovers trending conversations, viral threads, breaking news, and debates
 * about credentials, education fraud, and verification
 *
 * Uses BWS X SDK v1.6.0 with client.searchTweets()
 * Mode: Hybrid (crawler-first with API fallback)
 *
 * Strategy:
 * 1. Search tweets using trend-specific queries (high engagement thresholds)
 * 2. Detect viral threads and conversation clusters
 * 3. Classify trends by type (viral, news, debate, conversation)
 * 4. Score relevance and engagement
 * 5. Store in topic-trends.json for timely replies
 */

// Load environment variables
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __scriptsDir = path.dirname(__filename);
const worktreeRoot = path.resolve(__scriptsDir, '../../..');
dotenv.config({ path: path.join(worktreeRoot, '.env') });

import fs from 'fs/promises';
import fsSync from 'fs';
import { XTwitterClient } from '@blockchain-web-services/bws-x-sdk-node';
import { sleep } from '../utils/kol-utils.js';

const __dirname = __scriptsDir;

// Config paths
const CRAWLER_ACCOUNTS_PATH = path.join(__dirname, '../config/x-crawler-accounts.json');
const TOPIC_TRENDS_QUERIES_PATH = path.join(__dirname, '../config/topic-trends-queries.json');
const TOPIC_TRENDS_DATA_PATH = path.join(__dirname, '../data/topic-trends.json');

/**
 * Load crawler accounts
 */
function loadCrawlerAccounts() {
  try {
    if (!fsSync.existsSync(CRAWLER_ACCOUNTS_PATH)) {
      console.log('⚠️  No crawler accounts file found, will use API-only mode');
      return null;
    }

    const config = JSON.parse(fsSync.readFileSync(CRAWLER_ACCOUNTS_PATH, 'utf-8'));

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
 * Load topic trends queries configuration
 */
async function loadTopicTrendsQueries() {
  try {
    const data = await fs.readFile(TOPIC_TRENDS_QUERIES_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Error loading topic trends queries: ${error.message}`);
    throw error;
  }
}

/**
 * Load existing topic trends database
 */
async function loadTopicTrends() {
  try {
    const data = await fs.readFile(TOPIC_TRENDS_DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {
        trends: [],
        stats: {
          totalDiscovered: 0,
          byProduct: {},
          byCategory: {},
          byTrendType: {},
          lastDiscovery: null
        },
        metadata: {
          version: '1.0.0',
          lastUpdated: null,
          discoveryRuns: 0
        }
      };
    }
    throw error;
  }
}

/**
 * Save topic trends database
 */
async function saveTopicTrends(database) {
  await fs.writeFile(TOPIC_TRENDS_DATA_PATH, JSON.stringify(database, null, 2));
}

/**
 * Check if tweet meets engagement threshold for its trend type
 */
function meetsEngagementThreshold(tweet, trendType, config) {
  const thresholds = config.trendDetection.minEngagement[trendType];
  if (!thresholds) return false;

  const metrics = tweet.public_metrics || {};
  return (
    (metrics.like_count || 0) >= (thresholds.likes || 0) &&
    (metrics.retweet_count || 0) >= (thresholds.retweets || 0) &&
    (metrics.reply_count || 0) >= (thresholds.replies || 0)
  );
}

/**
 * Check if tweet is within time window for its trend type
 */
function isWithinTimeWindow(tweet, trendType, config) {
  const timeWindow = config.trendDetection.timeWindow[trendType];
  if (!timeWindow) return true;

  const tweetDate = new Date(tweet.created_at);
  const now = new Date();
  const ageHours = (now - tweetDate) / (1000 * 60 * 60);

  return ageHours <= timeWindow;
}

/**
 * Calculate trend score based on engagement and recency
 */
function calculateTrendScore(tweet, trendType, config) {
  const metrics = tweet.public_metrics || {};
  const likes = metrics.like_count || 0;
  const retweets = metrics.retweet_count || 0;
  const replies = metrics.reply_count || 0;

  // Engagement score (weighted)
  const engagementScore = (likes * 1) + (retweets * 3) + (replies * 2);

  // Recency bonus
  const tweetDate = new Date(tweet.created_at);
  const ageHours = (new Date() - tweetDate) / (1000 * 60 * 60);
  const recencyMultiplier = Math.max(0.5, 1 - (ageHours / 168)); // Decay over 1 week

  // Trend type multiplier
  const trendTypeMultipliers = {
    viral: 1.5,
    news: 1.3,
    debate: 1.2,
    conversation: 1.0,
    trend: 1.1
  };

  const typeMultiplier = trendTypeMultipliers[trendType] || 1.0;

  const finalScore = engagementScore * recencyMultiplier * typeMultiplier;

  return {
    score: Math.round(finalScore),
    engagementScore,
    recencyMultiplier: parseFloat(recencyMultiplier.toFixed(2)),
    typeMultiplier,
    breakdown: {
      likes,
      retweets,
      replies,
      ageHours: parseFloat(ageHours.toFixed(1))
    }
  };
}

/**
 * Detect if tweet is part of a thread
 */
function detectThread(tweet, allTweets, config) {
  if (!config.trendDetection.threadDetection.enabled) {
    return { isThread: false };
  }

  // Check if tweet is a reply to another tweet
  const isReply = !!tweet.in_reply_to_user_id;

  // Find potential thread members (tweets from same author around same time)
  const author_id = tweet.author_id || tweet.author?.id;
  const potentialThreadTweets = allTweets.filter(t => {
    const t_author_id = t.author_id || t.author?.id;
    return t_author_id === author_id && t.id !== tweet.id;
  });

  if (potentialThreadTweets.length === 0) {
    return { isThread: false };
  }

  // Simple heuristic: tweets from same author within 5 minutes
  const tweetTime = new Date(tweet.created_at).getTime();
  const threadTweets = potentialThreadTweets.filter(t => {
    const tTime = new Date(t.created_at).getTime();
    const diff = Math.abs(tweetTime - tTime);
    return diff < (5 * 60 * 1000); // 5 minutes
  });

  const threadLength = threadTweets.length + 1; // +1 for current tweet

  return {
    isThread: threadLength >= (config.trendDetection.threadDetection.minThreadLength || 3),
    threadLength,
    threadTweets: threadTweets.map(t => t.id)
  };
}

/**
 * Search tweets for a specific trend query
 */
async function searchTrendTweets(client, product, query, config) {
  console.log(`\n🔍 Searching trend: ${query.name}`);
  console.log(`   Query: ${query.query}`);
  console.log(`   Type: ${query.trendType}, Category: ${query.category}`);

  try {
    const tweets = await client.searchTweets(query.query, {
      maxResults: config.settings.maxTweetsPerQuery
    });

    console.log(`   ✅ Found ${tweets.length} tweets`);

    // Filter by engagement threshold
    const qualified = tweets.filter(tweet =>
      meetsEngagementThreshold(tweet, query.trendType, config.products[product]) &&
      isWithinTimeWindow(tweet, query.trendType, config.products[product])
    );

    console.log(`   📊 ${qualified.length}/${tweets.length} meet ${query.trendType} criteria`);

    // Add metadata to tweets
    return qualified.map(tweet => {
      const threadInfo = detectThread(tweet, tweets, config.products[product]);
      const trendScore = calculateTrendScore(tweet, query.trendType, config.products[product]);

      return {
        ...tweet,
        trendMetadata: {
          product,
          query: query.name,
          queryCategory: query.category,
          trendType: query.trendType,
          trendScore: trendScore.score,
          trendScoreBreakdown: trendScore,
          threadInfo,
          discoveredAt: new Date().toISOString()
        }
      };
    });
  } catch (error) {
    console.error(`   ❌ Error searching ${product} - ${query.name}: ${error.message}`);
    return [];
  }
}

/**
 * Select queries using category-aware distribution
 */
function selectWeightedRandom(queries) {
  if (queries.length === 0) return null;

  const totalWeight = queries.reduce((sum, q) => sum + (q.weight || 1), 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < queries.length; i++) {
    random -= (queries[i].weight || 1);
    if (random <= 0) {
      return queries[i];
    }
  }

  return queries[queries.length - 1];
}

function selectQueriesForProduct(productConfig, settings) {
  const { queries } = productConfig;
  const { maxQueriesPerRun, priorityWeights, rotationStrategy, categoryDistribution } = settings;

  const weightedQueries = queries.map(q => ({
    ...q,
    weight: priorityWeights[q.priority] || 1
  }));

  if (rotationStrategy === 'category-aware' && categoryDistribution?.categories) {
    const categories = categoryDistribution.categories;
    const minPerCategory = categoryDistribution.minPerCategory || 1;

    const queriesByCategory = {};
    weightedQueries.forEach(q => {
      const category = q.category || 'general';
      if (!queriesByCategory[category]) {
        queriesByCategory[category] = [];
      }
      queriesByCategory[category].push(q);
    });

    const selected = [];

    // Phase 1: Minimum per category
    for (const category of categories) {
      if (!queriesByCategory[category]) continue;

      const categoryQueries = [...queriesByCategory[category]];
      for (let i = 0; i < Math.min(minPerCategory, categoryQueries.length); i++) {
        if (selected.length >= maxQueriesPerRun) break;

        const selectedQuery = selectWeightedRandom(categoryQueries);
        if (selectedQuery) {
          selected.push(selectedQuery);
          const index = categoryQueries.findIndex(q => q.name === selectedQuery.name);
          if (index !== -1) categoryQueries.splice(index, 1);
        }
      }
    }

    // Phase 2: Fill remaining
    if (selected.length < maxQueriesPerRun) {
      const remaining = weightedQueries.filter(q => !selected.find(s => s.name === q.name));

      while (selected.length < maxQueriesPerRun && remaining.length > 0) {
        const selectedQuery = selectWeightedRandom(remaining);
        if (selectedQuery) {
          selected.push(selectedQuery);
          const index = remaining.findIndex(q => q.name === selectedQuery.name);
          if (index !== -1) remaining.splice(index, 1);
        } else {
          break;
        }
      }
    }

    return selected;
  }

  // Simple weighted random
  const selected = [];
  const available = [...weightedQueries];

  for (let i = 0; i < Math.min(maxQueriesPerRun, queries.length); i++) {
    if (available.length === 0) break;

    const selectedQuery = selectWeightedRandom(available);
    if (selectedQuery) {
      selected.push(selectedQuery);
      const index = available.findIndex(q => q.name === selectedQuery.name);
      if (index !== -1) available.splice(index, 1);
    }
  }

  return selected;
}

/**
 * Main monitoring function
 */
async function monitorTopicTrends() {
  console.log('📈 Starting Topic Trend Monitoring...');
  console.log('📦 Using: BWS X SDK v1.6.0');
  console.log(`📍 Script: monitor-topic-trends-sdk.js\n`);

  const startTime = Date.now();

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

    proxy: (crawlerConfig?.proxy?.enabled && !process.env.GITHUB_ACTIONS) ? {
      provider: crawlerConfig.proxy.provider,
      username: process.env.OXYLABS_USERNAME || crawlerConfig.proxy.username,
      password: process.env.OXYLABS_PASSWORD || crawlerConfig.proxy.password
    } : undefined,

    logging: { level: 'info' }
  };

  const client = new XTwitterClient(sdkConfig);

  console.log(`\n✅ SDK client initialized in ${sdkConfig.mode} mode`);
  console.log(`   Has crawler: ${crawlerConfig ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has API: ✅ Yes`);
  console.log(`   Has proxy: ${sdkConfig.proxy ? '✅ Yes' : '❌ No'}\n`);

  // Load configuration and database
  const config = await loadTopicTrendsQueries();
  const database = await loadTopicTrends();

  // Get CLI argument for specific product
  const args = process.argv.slice(2);
  const productArg = args.find(arg => arg.startsWith('--product='));
  const targetProduct = productArg ? productArg.split('=')[1] : null;

  const productsToProcess = targetProduct
    ? { [targetProduct]: config.products[targetProduct] }
    : config.products;

  if (targetProduct && !productsToProcess[targetProduct]) {
    console.error(`❌ Product "${targetProduct}" not found in configuration`);
    process.exit(1);
  }

  const stats = {
    totalSearched: 0,
    trendsFound: 0,
    newTrends: 0,
    byProduct: {},
    byCategory: {},
    byTrendType: {}
  };

  // Process each product
  for (const [productName, productConfig] of Object.entries(productsToProcess)) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📦 Processing Product: ${productName}`);
    console.log(`${'='.repeat(60)}`);

    stats.byProduct[productName] = {
      queriesRun: 0,
      trendsFound: 0,
      newTrends: 0
    };

    // Select queries
    const selectedQueries = selectQueriesForProduct(productConfig, config.settings);
    console.log(`\n🎯 Selected ${selectedQueries.length} trend queries (category-aware):`);
    selectedQueries.forEach(q =>
      console.log(`   - ${q.name} (${q.priority}, ${q.category}, ${q.trendType})`)
    );

    // Search each query
    for (const query of selectedQueries) {
      const trends = await searchTrendTweets(client, productName, query, config);
      stats.totalSearched++;
      stats.byProduct[productName].queriesRun++;
      stats.byProduct[productName].trendsFound += trends.length;
      stats.trendsFound += trends.length;

      // Track by category and trend type
      const category = query.category || 'general';
      const trendType = query.trendType || 'conversation';

      if (!stats.byCategory[category]) stats.byCategory[category] = 0;
      if (!stats.byTrendType[trendType]) stats.byTrendType[trendType] = 0;

      stats.byCategory[category] += trends.length;
      stats.byTrendType[trendType] += trends.length;

      // Add new trends to database
      let newInQuery = 0;
      for (const trend of trends) {
        const existingIndex = database.trends.findIndex(t => t.id === trend.id);
        if (existingIndex === -1) {
          database.trends.push(trend);
          newInQuery++;
          stats.newTrends++;
          stats.byProduct[productName].newTrends++;

          console.log(`   ✨ New trend: @${trend.author?.username || 'unknown'} (score: ${trend.trendMetadata.trendScore})`);
          if (trend.trendMetadata.threadInfo.isThread) {
            console.log(`      🧵 Thread detected (${trend.trendMetadata.threadInfo.threadLength} tweets)`);
          }
        }
      }

      console.log(`   📊 Query results: ${newInQuery} new trends`);

      // Delay between queries
      if (selectedQueries.indexOf(query) < selectedQueries.length - 1) {
        await sleep(5000);
      }
    }

    // Delay between products
    const productEntries = Object.entries(productsToProcess);
    const currentIndex = productEntries.findIndex(([name]) => name === productName);
    if (currentIndex < productEntries.length - 1) {
      console.log('\n⏳ Waiting 10 seconds before next product...');
      await sleep(10000);
    }
  }

  // Sort trends by score (descending)
  database.trends.sort((a, b) =>
    (b.trendMetadata?.trendScore || 0) - (a.trendMetadata?.trendScore || 0)
  );

  // Limit trends per product
  const maxTrendsPerProduct = config.settings.maxTrendsPerProduct || 100;
  if (database.trends.length > maxTrendsPerProduct) {
    database.trends = database.trends.slice(0, maxTrendsPerProduct);
  }

  // Update database metadata
  database.metadata.lastUpdated = new Date().toISOString();
  database.metadata.discoveryRuns = (database.metadata.discoveryRuns || 0) + 1;

  // Update stats
  database.stats.totalDiscovered = database.trends.length;
  database.stats.lastDiscovery = new Date().toISOString();

  for (const product of Object.keys(productsToProcess)) {
    database.stats.byProduct[product] = database.trends.filter(
      t => t.trendMetadata.product === product
    ).length;
  }

  for (const category of Object.keys(stats.byCategory)) {
    database.stats.byCategory[category] = database.trends.filter(
      t => t.trendMetadata.queryCategory === category
    ).length;
  }

  for (const trendType of Object.keys(stats.byTrendType)) {
    database.stats.byTrendType[trendType] = database.trends.filter(
      t => t.trendMetadata.trendType === trendType
    ).length;
  }

  // Save database
  await saveTopicTrends(database);

  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ Monitoring Complete (${duration}s)`);
  console.log(`${'='.repeat(60)}`);
  console.log(`\n📊 Discovery Stats:`);
  console.log(`   - Queries executed: ${stats.totalSearched}`);
  console.log(`   - Trends found: ${stats.trendsFound}`);
  console.log(`   - New trends added: ${stats.newTrends}`);

  console.log(`\n📦 By Product:`);
  for (const [product, productStats] of Object.entries(stats.byProduct)) {
    console.log(`   ${product}:`);
    console.log(`     - Queries: ${productStats.queriesRun}`);
    console.log(`     - Trends found: ${productStats.trendsFound}`);
    console.log(`     - New: ${productStats.newTrends}`);
  }

  console.log(`\n🏷️  By Category:`);
  for (const [category, count] of Object.entries(stats.byCategory)) {
    console.log(`   ${category}: ${count} trends`);
  }

  console.log(`\n📈 By Trend Type:`);
  for (const [trendType, count] of Object.entries(stats.byTrendType)) {
    console.log(`   ${trendType}: ${count} trends`);
  }

  console.log(`\n📚 Database Status:`);
  console.log(`   - Total trends: ${database.stats.totalDiscovered}`);
  for (const [product, count] of Object.entries(database.stats.byProduct)) {
    console.log(`   ${product}: ${count} trends`);
  }

  console.log('\n✨ Topic trend monitoring complete!\n');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  monitorTopicTrends().catch(error => {
    console.error('\n❌ Monitoring failed:', error);
    process.exit(1);
  });
}

export { monitorTopicTrends };
