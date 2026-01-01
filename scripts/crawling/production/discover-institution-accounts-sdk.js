/**
 * Blockchain Badges Prospect Discovery - BWS X SDK v1.8.0 with enrichTweetAuthors()
 * Discovers BOTH institutional accounts AND engaged individual users
 * that are potential customers for Blockchain Badges
 *
 * SALES APPROACH: User-conversation monitoring strategy
 * - Institutions: Universities, e-learning platforms, bootcamps, certification bodies
 * - Engaged Users: HR professionals, students, educators, developers discussing credentials
 *
 * Uses BWS X SDK v1.8.0 with built-in enrichTweetAuthors() method
 * Mode: Hybrid (crawler-first with API fallback)
 *
 * Strategy:
 * 1. Search tweets using user-conversation queries (pain-points, achievements, discussions)
 * 2. Enrich tweets with full author profile data using client.enrichTweetAuthors()
 * 3. Extract enriched author accounts from tweets
 * 4. Classify accounts (institution, engaged_user, or irrelevant)
 * 5. Save BOTH institutions and engaged users (comprehensive audience building)
 * 6. Score accounts by product fit
 * 7. Store in institution-accounts.json
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

// Config paths
const CRAWLER_ACCOUNTS_PATH = path.join(__dirname, '../config/x-crawler-accounts.json');
const INSTITUTION_QUERIES_PATH = path.join(__dirname, '../config/institution-search-queries.json');
const INSTITUTION_ACCOUNTS_PATH = path.join(__dirname, '../data/institution-accounts.json');

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
 * Load institution search queries configuration
 */
async function loadInstitutionQueries() {
  try {
    const data = await fs.readFile(INSTITUTION_QUERIES_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Error loading institution queries: ${error.message}`);
    throw error;
  }
}

/**
 * Load existing institution accounts database
 */
async function loadInstitutionAccounts() {
  try {
    const data = await fs.readFile(INSTITUTION_ACCOUNTS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist yet, return empty database
      return {
        accounts: [],
        stats: {
          totalDiscovered: 0,
          byProduct: {},
          byCategory: {},
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
 * Save institution accounts database
 */
async function saveInstitutionAccounts(database) {
  await fs.writeFile(INSTITUTION_ACCOUNTS_PATH, JSON.stringify(database, null, 2));
}

/**
 * Classify account as institution, engaged user, or irrelevant
 * SALES APPROACH: Save BOTH institutions and engaged individuals
 */
function classifyAccount(account, config) {
  const { accountClassification } = config;
  const { institutionIndicators, excludeIndicators, minFollowers } = accountClassification;

  // Check follower count (relaxed for engaged users)
  const followerCount = account.public_metrics?.followers_count || 0;
  const meetsMinFollowers = followerCount >= minFollowers;

  // Check bio/description
  const bio = (account.description || '').toLowerCase();
  const name = (account.name || '').toLowerCase();
  const username = (account.username || '').toLowerCase();

  // Institution indicators
  const institutionMatches = institutionIndicators.filter(indicator =>
    bio.includes(indicator) || name.includes(indicator) || username.includes(indicator)
  );

  // If has institution indicators, classify as institution
  if (institutionMatches.length > 0) {
    let confidence = Math.min(100, institutionMatches.length * 20);

    // Boost for verified accounts
    if (account.verified && accountClassification.verifiedBonus) {
      confidence = Math.min(100, confidence + 20);
    }

    // Boost for high follower count
    if (followerCount > 10000) confidence = Math.min(100, confidence + 10);
    if (followerCount > 50000) confidence = Math.min(100, confidence + 10);

    return {
      accountType: 'institution',
      isRelevant: confidence >= 40,
      confidence,
      reason: `Institution: ${institutionMatches.join(', ')}`,
      indicators: institutionMatches
    };
  }

  // If no institution indicators, classify as engaged user
  // SALES STRATEGY: These are users discussing credentials - valuable prospects!
  const engagedIndicators = [
    'hr', 'recruiter', 'hiring', 'talent',
    'student', 'alumni', 'graduate', 'learner',
    'educator', 'teacher', 'professor', 'instructor',
    'developer', 'engineer', 'tech', 'blockchain', 'web3', 'crypto',
    'credential', 'certificate', 'certification',
    'verification', 'identity', 'digital badge', 'education'
  ];

  const engagedMatches = engagedIndicators.filter(indicator =>
    bio.includes(indicator) || name.includes(indicator)
  );

  // CRITICAL LOGIC: If found via credential query, they're tweeting about credentials
  // This is THE engagement signal - save them!
  // Only exclude obvious spam (suspended accounts have follower_count = 0)
  const hasAnyProfile = account.username && account.username.length > 0;
  const notSuspended = followerCount > 0 || account.public_metrics?.following_count > 0;

  // Save everyone who was found via credential queries (unless obviously spam)
  if (hasAnyProfile && notSuspended) {
    let confidence = 50; // Base: tweeting about credentials

    // Boost for keyword matches in bio/name
    if (engagedMatches.length > 0) {
      confidence = Math.min(100, confidence + engagedMatches.length * 10);
    }

    // Boost for verified
    if (account.verified) confidence = Math.min(100, confidence + 20);

    // Boost for follower count
    if (followerCount >= 100) confidence = Math.min(100, confidence + 5);
    if (followerCount >= 500) confidence = Math.min(100, confidence + 10);
    if (followerCount >= 2000) confidence = Math.min(100, confidence + 15);

    return {
      accountType: 'engaged_user',
      isRelevant: true,
      confidence,
      reason: engagedMatches.length > 0
        ? `Engaged user: ${engagedMatches.join(', ')}`
        : 'Tweeting about credentials',
      indicators: engagedMatches.length > 0 ? engagedMatches : ['query-context']
    };
  }

  // Only reject suspended/deleted accounts
  return {
    accountType: 'unknown',
    isRelevant: false,
    confidence: 0,
    reason: 'Suspended or spam account'
  };
}

/**
 * Score account's fit for a specific product
 */
function scoreProductFit(account, productName, productConfig) {
  const { productFitScoring } = productConfig;
  const { keywords, descriptionKeywords } = productFitScoring;

  let score = 0;
  const reasons = [];

  // Check bio/description for keywords
  const bio = (account.description || '').toLowerCase();

  for (const [keyword, points] of Object.entries(descriptionKeywords)) {
    if (bio.includes(keyword.toLowerCase())) {
      score += points;
      reasons.push(`Bio: "${keyword}" (+${points})`);
    }
  }

  // Additional scoring based on account metadata
  const name = (account.name || '').toLowerCase();

  if (name.includes('university') || name.includes('college')) {
    score += 5;
    reasons.push('University/college name (+5)');
  }

  if (account.verified) {
    score += 3;
    reasons.push('Verified account (+3)');
  }

  const followerCount = account.public_metrics?.followers_count || 0;
  if (followerCount > 10000) {
    score += 2;
    reasons.push('Large following (+2)');
  }

  return {
    score,
    maxScore: 100,
    percentage: Math.min(100, (score / 50) * 100), // Normalize to 50 as max expected
    reasons,
    fitLevel: score >= 30 ? 'high' : score >= 15 ? 'medium' : score >= 5 ? 'low' : 'none'
  };
}

/**
 * Search tweets and extract author accounts using v1.8.0 enrichTweetAuthors()
 * NEW: Uses SDK's built-in enrichment method for cleaner, more efficient code
 */
async function searchAndExtractAccounts(client, product, query, config) {
  console.log(`\n🔍 Searching: ${query.name}`);
  console.log(`   Query: ${query.query}`);

  try {
    // Step 1: Search tweets
    const tweets = await client.searchTweets(query.query, {
      maxResults: config.settings.maxAccountsPerQuery
    });

    console.log(`   ✅ Found ${tweets.length} tweets`);

    if (tweets.length === 0) {
      return [];
    }

    // Step 2: Enrich tweets with full author profile data using v1.8.0 method
    console.log(`   🔍 Enriching with full author profiles (v1.8.0 enrichTweetAuthors)...`);

    // Access the crawler client (private but accessible in JavaScript)
    const crawlerClient = client.crawlerClient;

    let enrichedTweets;
    if (crawlerClient && crawlerClient.enrichTweetAuthors) {
      // Use v1.8.0's built-in enrichment method
      enrichedTweets = await crawlerClient.enrichTweetAuthors(tweets, {
        concurrency: 3  // Fetch 3 profiles at a time
      });
    } else {
      // Fallback: no enrichment available
      console.log(`   ⚠️  enrichTweetAuthors not available, using tweets as-is`);
      enrichedTweets = tweets;
    }

    // Step 3: Extract unique enriched author accounts
    const accountsMap = new Map();

    for (const tweet of enrichedTweets) {
      const author = tweet.author;
      if (!author || !author.username) continue;

      // Skip if we've already seen this account
      if (accountsMap.has(author.username)) continue;

      // Map to expected account structure
      accountsMap.set(author.username, {
        id: author.id,
        username: author.username,
        name: author.name,
        description: author.bio,  // v1.8.0 enriches this!
        public_metrics: {
          followers_count: author.followers || 0,  // v1.8.0 enriches this!
          following_count: author.following || 0,  // v1.8.0 enriches this!
          tweet_count: author.tweetCount || 0
        },
        verified: author.verified || false,
        profile_image_url: author.profileImageUrl,
        location: author.location,
        url: author.url,
        created_at: author.createdAt,
        _enriched: !!(author.bio || author.followers),  // Flag if enrichment worked
        _source: author._source || 'unknown',

        // Add discovery context
        discoveryContext: {
          product,
          query: query.name,
          queryCategory: query.category,
          discoveredAt: new Date().toISOString(),
          sampleTweet: {
            id: tweet.id,
            text: tweet.text,
            created_at: tweet.createdAt
          }
        }
      });
    }

    const accounts = Array.from(accountsMap.values());

    // Log enrichment summary
    const enrichedCount = accounts.filter(a => a._enriched).length;
    console.log(`   ✅ Extracted ${accounts.length} unique accounts (${enrichedCount} enriched)`);

    // Debug: Show sample enriched data
    if (accounts.length > 0) {
      const sample = accounts[0];
      console.log(`   ✅ Sample account:`, {
        username: sample.username,
        bio: sample.description?.substring(0, 50) || '(none)',
        followers: sample.public_metrics?.followers_count || 0,
        enriched: sample._enriched
      });
    }

    console.log(`   👥 ${accounts.length} accounts ready for classification`);

    return accounts;

  } catch (error) {
    console.error(`   ❌ Error in discovery: ${error.message}`);
    return [];
  }
}

/**
 * Select queries using weighted random with category distribution
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

  // Weight queries by priority
  const weightedQueries = queries.map(q => ({
    ...q,
    weight: priorityWeights[q.priority] || 1
  }));

  // If category-aware, ensure diversity
  if (rotationStrategy === 'category-aware' && categoryDistribution?.categories) {
    const categories = categoryDistribution.categories;
    const minPerCategory = categoryDistribution.minPerCategory || 1;

    // Group by category
    const queriesByCategory = {};
    weightedQueries.forEach(q => {
      const category = q.category || 'general';
      if (!queriesByCategory[category]) {
        queriesByCategory[category] = [];
      }
      queriesByCategory[category].push(q);
    });

    const selected = [];

    // Phase 1: Ensure minimum per category
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

    // Phase 2: Fill remaining slots
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

  // Simple weighted random selection
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
 * Main discovery function
 */
async function discoverInstitutionAccounts() {
  console.log('🎯 Starting Blockchain Badges Prospect Discovery...');
  console.log('📦 Using: BWS X SDK v1.8.0 with enrichTweetAuthors()');
  console.log('🔍 Strategy: User-conversation monitoring (institutions + engaged users)');
  console.log(`📍 Script: discover-institution-accounts-sdk.js\n`);

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

    // Webhook configuration - sends real-time notifications to Zapier/Slack
    webhook: {
      enabled: true,
      url: 'https://hooks.zapier.com/hooks/catch/15373826/us3spl5/',
      secret: 'zapier-webhook-no-signature-required',  // Required by SDK (Zapier ignores HMAC)
      events: ['account_failure', 'api_rate_limit', 'error', 'warning'],  // All SDK events
      debug: true,  // Enable debug logging for webhooks
      retries: {
        maxAttempts: 3,
        backoffMs: 1000,
        backoffMultiplier: 2
      }
    },

    logging: { level: 'info' }
  };

  const webhookConfig = sdkConfig.webhook;  // Save webhook config before SDK strips it
  const client = new XTwitterClient(sdkConfig);

  // WORKAROUND: SDK's ConfigManager.validate() strips webhook field (not in Zod schema)
  // Manually inject webhook manager after initialization
  if (webhookConfig) {
    const { WebhookManager } = await import('@blockchain-web-services/bws-x-sdk-node/dist/webhook/WebhookManager.js');
    const Logger = (await import('@blockchain-web-services/bws-x-sdk-node/dist/utils/Logger.js')).Logger;

    const logger = new Logger({ level: 'info' });
    const webhookManager = new WebhookManager(webhookConfig, logger);

    // Inject webhook manager into client (private field but accessible in JS)
    client.webhookManager = webhookManager;

    // Also inject into crawler and API clients
    if (client.crawlerClient) {
      client.crawlerClient.webhookManager = webhookManager;
    }
    if (client.apiClient) {
      client.apiClient.webhookManager = webhookManager;
    }

    console.log('\n✅ Webhook manager manually injected (SDK schema workaround)');
    console.log(`   Enabled: ${webhookManager.isEnabled()}`);
    console.log(`   URL: ${webhookConfig.url}`);
    console.log(`   Events: ${webhookConfig.events.join(', ')}\n`);
  }

  console.log(`\n✅ SDK client initialized in ${sdkConfig.mode} mode`);
  console.log(`   Has crawler: ${crawlerConfig ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has API: ✅ Yes`);
  console.log(`   Has proxy: ${sdkConfig.proxy ? '✅ Yes' : '❌ No'}\n`);

  // Load configuration and database
  const config = await loadInstitutionQueries();
  const database = await loadInstitutionAccounts();

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

  const stats = {
    totalSearched: 0,
    accountsFound: 0,
    institutionsClassified: 0,
    newInstitutions: 0,
    byProduct: {},
    byCategory: {}
  };

  // Process each product
  for (const [productName, productConfig] of Object.entries(productsToProcess)) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📦 Processing Product: ${productName}`);
    console.log(`${'='.repeat(60)}`);

    stats.byProduct[productName] = {
      queriesRun: 0,
      accountsFound: 0,
      institutionsFound: 0,
      newInstitutions: 0
    };

    // Select queries for this product
    const selectedQueries = selectQueriesForProduct(productConfig, config.settings);
    console.log(`\n🎯 Selected ${selectedQueries.length} queries (category-aware):`);
    selectedQueries.forEach(q => console.log(`   - ${q.name} (${q.priority}, ${q.category})`));

    // Search each query
    for (const query of selectedQueries) {
      const accounts = await searchAndExtractAccounts(client, productName, query, config);
      stats.totalSearched++;
      stats.byProduct[productName].queriesRun++;
      stats.byProduct[productName].accountsFound += accounts.length;
      stats.accountsFound += accounts.length;

      // Track by category
      const category = query.category || 'general';
      if (!stats.byCategory[category]) {
        stats.byCategory[category] = { accounts: 0, institutions: 0 };
      }
      stats.byCategory[category].accounts += accounts.length;

      // Classify and score each account
      let institutionsInQuery = 0;
      let newInQuery = 0;

      for (const account of accounts) {
        // Check if already exists
        const existingIndex = database.accounts.findIndex(a => a.id === account.id);
        if (existingIndex !== -1) {
          console.log(`   ⏭️  Account @${account.username} already exists, skipping`);
          continue;
        }

        // Classify as institution, engaged user, or irrelevant
        const classification = classifyAccount(account, productConfig);

        if (!classification.isRelevant) {
          console.log(`   ⏭️  @${account.username} not relevant (${classification.reason})`);
          continue;
        }

        const accountTypeLabel = classification.accountType === 'institution' ? 'institution' : 'engaged user';
        console.log(`   ✅ @${account.username} classified as ${accountTypeLabel} (${classification.confidence}% confidence)`);
        console.log(`      Reason: ${classification.reason}`);

        institutionsInQuery++;
        stats.institutionsClassified++;
        stats.byCategory[category].institutions++;

        // Score product fit
        const fitScore = scoreProductFit(account, productName, productConfig);

        console.log(`      Product fit: ${fitScore.fitLevel} (${fitScore.percentage.toFixed(0)}%)`);
        if (fitScore.reasons.length > 0) {
          fitScore.reasons.forEach(r => console.log(`      - ${r}`));
        }

        // Add to database with classification and account type
        database.accounts.push({
          ...account,
          accountType: classification.accountType, // 'institution' or 'engaged_user'
          classification,
          productFit: {
            [productName]: fitScore
          },
          discoveredAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        });

        newInQuery++;
        stats.byProduct[productName].newInstitutions++;
        stats.newInstitutions++;
      }

      console.log(`   📊 Query results: ${institutionsInQuery} relevant accounts, ${newInQuery} new (institutions + engaged users)`);

      // Delay between queries
      if (selectedQueries.indexOf(query) < selectedQueries.length - 1) {
        await sleep(5000); // 5 seconds
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

  // Update database metadata
  database.metadata.lastUpdated = new Date().toISOString();
  database.metadata.discoveryRuns = (database.metadata.discoveryRuns || 0) + 1;

  // Update stats
  database.stats.totalDiscovered = database.accounts.length;
  database.stats.lastDiscovery = new Date().toISOString();

  // Calculate account type breakdown
  const institutionCount = database.accounts.filter(a => a.accountType === 'institution').length;
  const engagedUserCount = database.accounts.filter(a => a.accountType === 'engaged_user').length;

  database.stats.byAccountType = {
    institutions: institutionCount,
    engagedUsers: engagedUserCount,
    total: database.accounts.length
  };

  // Calculate stats by product
  for (const product of Object.keys(productsToProcess)) {
    const productAccounts = database.accounts.filter(a => a.discoveryContext.product === product);

    database.stats.byProduct[product] = {
      total: productAccounts.length,
      institutions: productAccounts.filter(a => a.accountType === 'institution').length,
      engagedUsers: productAccounts.filter(a => a.accountType === 'engaged_user').length,
      highFit: productAccounts.filter(a =>
        a.productFit[product]?.fitLevel === 'high'
      ).length,
      mediumFit: productAccounts.filter(a =>
        a.productFit[product]?.fitLevel === 'medium'
      ).length
    };
  }

  // Calculate stats by category
  for (const category of Object.keys(stats.byCategory)) {
    database.stats.byCategory[category] = stats.byCategory[category].institutions;
  }

  // Save database
  await saveInstitutionAccounts(database);

  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ Discovery Complete (${duration}s)`);
  console.log(`${'='.repeat(60)}`);
  console.log(`\n📊 Discovery Stats:`);
  console.log(`   - Queries executed: ${stats.totalSearched}`);
  console.log(`   - Accounts found: ${stats.accountsFound}`);
  console.log(`   - Institutions classified: ${stats.institutionsClassified}`);
  console.log(`   - New institutions added: ${stats.newInstitutions}`);

  console.log(`\n📦 By Product:`);
  for (const [product, productStats] of Object.entries(stats.byProduct)) {
    console.log(`   ${product}:`);
    console.log(`     - Queries: ${productStats.queriesRun}`);
    console.log(`     - Accounts found: ${productStats.accountsFound}`);
    console.log(`     - Institutions: ${productStats.institutionsFound}`);
    console.log(`     - New: ${productStats.newInstitutions}`);
  }

  console.log(`\n🏷️  By Category:`);
  for (const [category, categoryStats] of Object.entries(stats.byCategory)) {
    console.log(`   ${category}: ${categoryStats.accounts} accounts, ${categoryStats.institutions} institutions`);
  }

  console.log(`\n📚 Database Status:`);
  console.log(`   - Total accounts: ${database.stats.totalDiscovered}`);
  console.log(`   - Institutions: ${database.stats.byAccountType?.institutions || 0}`);
  console.log(`   - Engaged users: ${database.stats.byAccountType?.engagedUsers || 0}`);

  for (const [product, productStats] of Object.entries(database.stats.byProduct)) {
    console.log(`\n   ${product}:`);
    console.log(`     - Total: ${productStats.total}`);
    console.log(`     - Institutions: ${productStats.institutions || 0}`);
    console.log(`     - Engaged users: ${productStats.engagedUsers || 0}`);
    console.log(`     - High fit: ${productStats.highFit}`);
    console.log(`     - Medium fit: ${productStats.mediumFit}`);
  }

  console.log('\n✨ Blockchain Badges prospect discovery complete!\n');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  discoverInstitutionAccounts().catch(error => {
    console.error('\n❌ Discovery failed:', error);
    process.exit(1);
  });
}

export { discoverInstitutionAccounts };
