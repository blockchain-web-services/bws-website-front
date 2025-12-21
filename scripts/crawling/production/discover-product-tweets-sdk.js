/**
 * Product-Specific Tweet Discovery - BWS X SDK Version
 * Discovers tweets related to specific BWS products for targeted educational replies
 *
 * MIGRATION: Converted from discover-product-tweets.js to use BWS X SDK v1.6.0
 * SDK Method: client.searchTweets(query, options)
 * Mode: Hybrid (crawler-first with API fallback)
 *
 * Products: Blockchain Badges, BWS IPFS, NFT.zK, Blockchain Hash
 * Strategy: Product-specific search queries + Engagement filtering + Product tagging
 */

// Load environment variables from .env file (local dev only, GitHub Actions uses secrets)
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

// Crawler accounts configuration path
const CRAWLER_ACCOUNTS_PATH = path.join(__dirname, '../config/x-crawler-accounts.json');

/**
 * Load crawler accounts from config file for SDK initialization
 */
function loadCrawlerAccounts() {
  try {
    if (!fsSync.existsSync(CRAWLER_ACCOUNTS_PATH)) {
      console.log('⚠️  No crawler accounts file found, will use API-only mode');
      return null;
    }

    const config = JSON.parse(fsSync.readFileSync(CRAWLER_ACCOUNTS_PATH, 'utf-8'));

    // Transform to SDK format
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
 * Load product search queries configuration
 */
async function loadProductQueries() {
  const configPath = path.join(__dirname, '..', 'config', 'product-search-queries.json');

  try {
    const data = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Error loading product queries: ${error.message}`);
    throw error;
  }
}

/**
 * Load existing product discovery queue
 */
async function loadProductQueue() {
  const queuePath = path.join(__dirname, '..', 'data', 'product-discovery-queue.json');

  try {
    const data = await fs.readFile(queuePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist yet, return empty queue
      return {
        tweets: [],
        lastDiscovery: {},
        stats: {
          totalDiscovered: 0,
          byProduct: {},
          lastRun: null
        }
      };
    }
    throw error;
  }
}

/**
 * Save product discovery queue
 */
async function saveProductQueue(queue) {
  const queuePath = path.join(__dirname, '..', 'data', 'product-discovery-queue.json');
  await fs.writeFile(queuePath, JSON.stringify(queue, null, 2));
}

/**
 * Filter tweets by engagement threshold
 */
function filterByEngagement(tweets, thresholds) {
  return tweets.filter(tweet => {
    const metrics = tweet.public_metrics || {};
    return (
      (metrics.like_count || 0) >= thresholds.minLikes &&
      (metrics.retweet_count || 0) >= thresholds.minRetweets &&
      (metrics.impression_count || 0) >= thresholds.minViews
    );
  });
}

/**
 * Check if tweet already exists in queue
 */
function tweetExistsInQueue(tweetId, queue) {
  return queue.tweets.some(t => t.id === tweetId);
}

/**
 * Select queries for a product using weighted round-robin
 */
function selectQueriesForProduct(productConfig, settings) {
  const { queries } = productConfig;
  const { maxQueriesPerRun, priorityWeights } = settings;

  // Sort by priority weight
  const weightedQueries = queries.map(q => ({
    ...q,
    weight: priorityWeights[q.priority] || 1
  }));

  // Weighted random selection
  const selected = [];
  const available = [...weightedQueries];

  for (let i = 0; i < Math.min(maxQueriesPerRun, queries.length); i++) {
    if (available.length === 0) break;

    // Calculate total weight
    const totalWeight = available.reduce((sum, q) => sum + q.weight, 0);

    // Random selection weighted by priority
    let random = Math.random() * totalWeight;
    let selectedIndex = 0;

    for (let j = 0; j < available.length; j++) {
      random -= available[j].weight;
      if (random <= 0) {
        selectedIndex = j;
        break;
      }
    }

    selected.push(available[selectedIndex]);
    available.splice(selectedIndex, 1);
  }

  return selected;
}

/**
 * Search tweets for a specific product and query using SDK
 */
async function searchProductTweets(client, product, query, config) {
  console.log(`\n🔍 Searching for ${product}: ${query.name}`);
  console.log(`   Query: ${query.query}`);

  try {
    // SDK METHOD: client.searchTweets() replaces searchTweetsWebUnblocker()
    const tweets = await client.searchTweets(query.query, {
      maxResults: config.settings.maxTweetsPerQuery
    });

    console.log(`   ✅ Found ${tweets.length} tweets`);

    return tweets.map(tweet => ({
      ...tweet,
      product,
      queryName: query.name,
      queryPriority: query.priority,
      discoveredAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error(`   ❌ Error searching ${product} - ${query.name}: ${error.message}`);
    return [];
  }
}

/**
 * Main discovery function
 */
async function discoverProductTweets() {
  console.log('🔍 Starting Product-Specific Tweet Discovery...');
  console.log('📦 Using: BWS X SDK v1.6.0');
  console.log(`📍 Script: discover-product-tweets-sdk.js\n`);

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

    // Proxy is DISABLED in GitHub Actions because direct access works better
    // Working scripts (discover-by-engagement-crawlee.js) use "WITHOUT proxy"
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

  // Load configuration
  const config = await loadProductQueries();
  const queue = await loadProductQueue();

  // Get CLI argument for specific product (optional)
  const args = process.argv.slice(2);
  const productArg = args.find(arg => arg.startsWith('--product='));
  const targetProduct = productArg ? productArg.split('=')[1] : null;

  // Determine which products to process
  const productsToProcess = targetProduct
    ? { [targetProduct]: config.products[targetProduct] }
    : config.products;

  if (targetProduct && !productsToProcess[targetProduct]) {
    console.error(`❌ Product "${targetProduct}" not found in configuration`);
    process.exit(1);
  }

  const newTweets = [];
  const stats = {
    totalSearched: 0,
    totalFound: 0,
    totalNew: 0,
    byProduct: {}
  };

  // Process each product
  for (const [productName, productConfig] of Object.entries(productsToProcess)) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📦 Processing Product: ${productName}`);
    console.log(`${'='.repeat(60)}`);

    stats.byProduct[productName] = {
      queriesRun: 0,
      tweetsFound: 0,
      tweetsNew: 0
    };

    // Select queries for this product
    const selectedQueries = selectQueriesForProduct(productConfig, config.settings);
    console.log(`\n🎯 Selected ${selectedQueries.length} queries (weighted by priority):`);
    selectedQueries.forEach(q => console.log(`   - ${q.name} (${q.priority})`));

    // Search each query
    for (const query of selectedQueries) {
      const tweets = await searchProductTweets(client, productName, query, config);
      stats.totalSearched++;
      stats.byProduct[productName].queriesRun++;

      // Filter by engagement
      const engagedTweets = filterByEngagement(tweets, productConfig.engagementThreshold);
      console.log(`   📊 ${engagedTweets.length}/${tweets.length} passed engagement filter`);

      // Filter out existing tweets
      const newFromQuery = engagedTweets.filter(t => !tweetExistsInQueue(t.id, queue));
      console.log(`   ✨ ${newFromQuery.length} new tweets`);

      stats.totalFound += engagedTweets.length;
      stats.byProduct[productName].tweetsFound += engagedTweets.length;
      stats.byProduct[productName].tweetsNew += newFromQuery.length;

      newTweets.push(...newFromQuery);

      // Delay between queries to avoid rate limits
      if (selectedQueries.indexOf(query) < selectedQueries.length - 1) {
        await sleep(5000); // 5 seconds
      }
    }

    // Update last discovery time
    queue.lastDiscovery[productName] = new Date().toISOString();

    // Delay between products
    const productEntries = Object.entries(productsToProcess);
    const currentIndex = productEntries.findIndex(([name]) => name === productName);
    if (currentIndex < productEntries.length - 1) {
      console.log('\n⏳ Waiting 10 seconds before next product...');
      await sleep(10000);
    }
  }

  // Limit tweets per product in queue
  const productCounts = {};
  for (const product of Object.keys(productsToProcess)) {
    productCounts[product] = queue.tweets.filter(t =>
      t.product === product && !t.processed
    ).length;
  }

  // Add new tweets, respecting maxTweetsPerProduct limit
  const tweetsToAdd = [];
  for (const tweet of newTweets) {
    const currentCount = productCounts[tweet.product] || 0;
    if (currentCount < config.settings.maxTweetsPerProduct) {
      tweetsToAdd.push(tweet);
      productCounts[tweet.product] = (productCounts[tweet.product] || 0) + 1;
    }
  }

  stats.totalNew = tweetsToAdd.length;

  // Add to queue
  queue.tweets.push(...tweetsToAdd);

  // Update queue stats
  queue.stats = {
    totalDiscovered: queue.tweets.length,
    byProduct: {},
    lastRun: new Date().toISOString()
  };

  for (const product of Object.keys(config.products)) {
    queue.stats.byProduct[product] = {
      total: queue.tweets.filter(t => t.product === product).length,
      unprocessed: queue.tweets.filter(t => t.product === product && !t.processed).length,
      processed: queue.tweets.filter(t => t.product === product && t.processed).length
    };
  }

  // Save queue
  await saveProductQueue(queue);

  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ Discovery Complete (${duration}s)`);
  console.log(`${'='.repeat(60)}`);
  console.log(`\n📊 Discovery Stats:`);
  console.log(`   - Queries executed: ${stats.totalSearched}`);
  console.log(`   - Tweets found: ${stats.totalFound}`);
  console.log(`   - New tweets added: ${stats.totalNew}`);

  console.log(`\n📦 By Product:`);
  for (const [product, productStats] of Object.entries(stats.byProduct)) {
    console.log(`   ${product}:`);
    console.log(`     - Queries: ${productStats.queriesRun}`);
    console.log(`     - Found: ${productStats.tweetsFound}`);
    console.log(`     - New: ${productStats.tweetsNew}`);
  }

  console.log(`\n📋 Queue Status:`);
  for (const [product, productStats] of Object.entries(queue.stats.byProduct)) {
    console.log(`   ${product}: ${productStats.unprocessed} unprocessed, ${productStats.processed} processed`);
  }

  console.log('\n✨ Product discovery complete!\n');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  discoverProductTweets().catch(error => {
    console.error('\n❌ Discovery failed:', error);
    process.exit(1);
  });
}

export { discoverProductTweets };
