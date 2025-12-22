/**
 * Search-Based KOL Discovery - BWS X SDK Version
 * Discovers crypto KOLs by mining high-engagement tweets
 *
 * MIGRATION: Converted from discover-by-engagement-crawlee.js to use BWS X SDK v1.6.0
 * SDK Methods: client.searchTweets(), client.getProfile()
 * Mode: Hybrid (crawler-first with API fallback)
 *
 * Features:
 * - Search-based tweet discovery
 * - Claude AI evaluation for crypto relevance
 * - Amplified search fallback
 * - Automatic account rotation
 */

// Load environment variables from .env file (local dev only, GitHub Actions uses secrets)
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __scriptsDir = path.dirname(__filename);
const worktreeRoot = path.resolve(__scriptsDir, '../../..');
dotenv.config({ path: path.join(worktreeRoot, '.env') });

import fs from 'fs';
import fsSync from 'fs';
import { XTwitterClient } from '@blockchain-web-services/bws-x-sdk-node';
import { runAmplifiedKolSearch } from '../utils/amplified-search.js';
import {
  loadConfig,
  loadKolsData,
  saveKolsData,
  updateReadmeKolStats,
  meetsKolCriteria,
  calculateEngagementRate,
  formatNumber,
  sleep
} from '../utils/kol-utils.js';
import { sendDiscoveryNotification } from '../utils/zapier-webhook.js';
import { createClaudeClient, evaluateUserAsCryptoKOL } from '../utils/claude-client.js';
import { logSearchDiscovery } from '../utils/execution-logger.js';

const __dirname = __scriptsDir;  // Use scriptsDir from dotenv setup above

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

function loadSearchQueries() {
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
 * Extract unique user IDs/usernames from tweets
 */
function extractUsernamesFromTweets(tweets) {
  const usernames = new Set();

  tweets.forEach(tweet => {
    // Add tweet author (support both formats: tweet.username and tweet.author.username)
    const username = tweet.username || tweet.author?.username;
    if (username) {
      usernames.add(username);
    }

    // Add mentioned users (if available in parsed data)
    if (tweet.mentions && Array.isArray(tweet.mentions)) {
      tweet.mentions.forEach(mention => {
        if (mention.username) {
          usernames.add(mention.username);
        }
      });
    }
  });

  return Array.from(usernames);
}

/**
 * Filter tweets by engagement threshold
 */
function filterByEngagement(tweets, threshold) {
  console.log(`\n🔍 DEBUG: Filtering ${tweets.length} tweets with threshold:`, JSON.stringify(threshold));

  const filtered = tweets.filter(tweet => {
    const metrics = tweet.public_metrics || {};
    const passes = (
      (metrics.like_count || 0) >= threshold.minLikes &&
      (metrics.retweet_count || 0) >= threshold.minRetweets &&
      (metrics.impression_count || 0) >= threshold.minViews
    );

    // Debug first tweet to see what data we have
    if (tweets.indexOf(tweet) === 0) {
      console.log(`🔍 DEBUG: First tweet metrics:`, {
        likes: metrics.like_count || 0,
        retweets: metrics.retweet_count || 0,
        views: metrics.impression_count || 0,
        hasMetrics: !!tweet.public_metrics,
        metricsKeys: tweet.public_metrics ? Object.keys(tweet.public_metrics) : []
      });
    }

    return passes;
  });

  console.log(`🔍 DEBUG: ${filtered.length}/${tweets.length} tweets passed filter\n`);
  return filtered;
}

/**
 * Main discovery function
 */
async function discoverByEngagementSDK() {
  console.log('🔍 Starting Search-Based KOL Discovery (SDK Mode)...');
  console.log('📦 Using: BWS X SDK v1.6.0');
  console.log(`📍 Script: discover-by-engagement-crawlee-sdk.js\n`);

  const startTime = Date.now();
  let currentPhase = 'initialization';
  let lastSuccessfulOperation = null;

  // Initialize SDK client
  currentPhase = 'initializing_sdk';
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
  lastSuccessfulOperation = 'sdk_initialized';

  // Load configuration
  currentPhase = 'loading_config';
  const config = loadConfig();
  const searchConfig = loadSearchQueries();
  const claudeClient = createClaudeClient();
  lastSuccessfulOperation = 'config_loaded';

  // Get engagement threshold (use defaults if not configured)
  const engagementTier = config.searchDiscovery?.engagementTier || 'tier4';
  const defaultThreshold = {
    minLikes: searchConfig.settings?.minEngagementThreshold || 15,
    minRetweets: 0,
    minViews: 0
  };
  const threshold = searchConfig.engagementThresholds?.[engagementTier] || defaultThreshold;

  console.log(`📊 Configuration:`);
  console.log(`   - Queries: ${searchConfig.queries.length}`);
  console.log(`   - Engagement tier: ${engagementTier}`);
  console.log(`   - Min Likes: ${threshold.minLikes}`);
  console.log(`   - Min Retweets: ${threshold.minRetweets}`);
  console.log(`   - Min Views: ${threshold.minViews}`);
  console.log(`   - Follower range: ${formatNumber(config.kolCriteria.minFollowers)} - ${formatNumber(config.kolCriteria.maxFollowers)}\n`);

  // Load existing data
  let kolsData = loadKolsData();
  const existingUsernames = new Set(kolsData.kols.map(k => k.username.toLowerCase()));

  // Track stats
  const results = {
    queriesExecuted: 0,
    queriesUsed: [],
    totalTweetsFound: 0,
    tweetsFiltered: 0,
    usernamesExtracted: 0,
    uniqueUsernames: 0,
    newCandidates: 0,
    profilesFetched: 0,
    kolsAdded: 0,
    topDiscovery: null,
    errors: [],
    discardedKols: []  // Track discards with reasons: { username, reason }
  };

  const allUsernames = new Set();
  const maxQueriesPerRun = searchConfig.settings.maxQueriesPerRun || 6;

  console.log('🔎 Executing search queries...\n');

  // Execute search queries
  currentPhase = 'executing_search_queries';
  for (const queryConfig of searchConfig.queries.slice(0, maxQueriesPerRun)) {
    results.queriesExecuted++;
    results.queriesUsed.push(queryConfig.query);
    const queryPhase = `search_query_${results.queriesExecuted}_${queryConfig.name}`;
    currentPhase = queryPhase;

    console.log(`\n[${results.queriesExecuted}/${Math.min(searchConfig.queries.length, maxQueriesPerRun)}] Query: "${queryConfig.name}"`);
    console.log(`   Category: ${queryConfig.category}`);
    console.log(`   Search: "${queryConfig.query}"`);
    console.log(`   📍 Phase: ${queryPhase}`);

    try {
      // SDK METHOD: client.searchTweets() replaces searchTweetsWebUnblocker()
      const tweets = await client.searchTweets(queryConfig.query, {
        maxResults: searchConfig.settings.maxTweetsPerQuery || 50
      });

      if (tweets.length === 0) {
        console.log(`   ℹ️  No tweets found`);
        continue;
      }

      results.totalTweetsFound += tweets.length;
      console.log(`   ✅ Found ${tweets.length} tweets`);

      // Filter by engagement
      const highEngagementTweets = filterByEngagement(tweets, threshold);
      results.tweetsFiltered += highEngagementTweets.length;

      console.log(`   🎯 ${highEngagementTweets.length} tweets meet engagement threshold`);

      if (highEngagementTweets.length === 0) {
        console.log(`   ⏭️  No tweets passed engagement filter`);
        continue;
      }

      // Extract usernames
      const usernames = extractUsernamesFromTweets(highEngagementTweets);
      results.usernamesExtracted += usernames.length;

      console.log(`   👥 Extracted ${usernames.length} usernames`);

      // Add to set for deduplication
      usernames.forEach(u => allUsernames.add(u.toLowerCase()));

    } catch (error) {
      console.error(`   ❌ Error in phase: ${currentPhase}`);
      console.error(`   Last successful operation: ${lastSuccessfulOperation}`);
      console.error(`   Error: ${error.message}`);
      if (error.stack) {
        console.error(`   Stack trace: ${error.stack.substring(0, 300)}`);
      }

      results.errors.push(`Query "${queryConfig.name}" (${currentPhase}): ${error.message}`);

      continue;
    }

    // Wait between queries
    if (results.queriesExecuted < maxQueriesPerRun && results.queriesExecuted < searchConfig.queries.length) {
      console.log(`   ⏸️  Waiting 15s before next query...`);
      await sleep(15000);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 SEARCH PHASE SUMMARY');
  console.log('='.repeat(60));
  console.log(`Queries executed: ${results.queriesExecuted}`);
  console.log(`Total tweets found: ${results.totalTweetsFound}`);
  console.log(`Tweets after engagement filter: ${results.tweetsFiltered}`);
  console.log(`Usernames extracted: ${results.usernamesExtracted}`);
  console.log(`Unique usernames: ${allUsernames.size}`);
  console.log('='.repeat(60));

  if (allUsernames.size === 0) {
    console.log('\n⚠️  No users discovered.');

    // Trigger amplified search to find new KOL candidates
    console.log('\n🔍 No users found from standard queries. Triggering amplified search...');
    try {
      const amplifiedCandidates = await runAmplifiedKolSearch(searchConfig, config, kolsData);

      if (amplifiedCandidates.length > 0) {
        console.log(`\n💎 Amplified search found ${amplifiedCandidates.length} new candidates!`);
        console.log('   These candidates can be manually reviewed and added to the KOL database.\n');
      }
    } catch (amplifiedError) {
      console.error(`\n❌ Amplified search failed: ${amplifiedError.message}`);
    }

    await sendDiscoveryNotification({
      scriptName: 'KOL Discovery - SDK Search',
      success: false,
      totalQueries: results.queriesExecuted,
      tweetsFound: results.totalTweetsFound,
      kolsAdded: 0,
      totalKols: kolsData.kols.length,
      runUrl: process.env.GITHUB_RUN_URL || null
    });

    return results;
  }

  // Deduplicate against existing database
  const newUsernames = Array.from(allUsernames).filter(u => !existingUsernames.has(u));
  results.newCandidates = newUsernames.length;

  console.log(`\n🔄 Deduplication:`);
  console.log(`   - Already in database: ${allUsernames.size - newUsernames.length}`);
  console.log(`   - New candidates: ${newUsernames.length}\n`);

  if (newUsernames.length === 0) {
    console.log('✅ All discovered users are already in the database!');

    // Trigger amplified search to find new KOL candidates
    console.log('\n🔍 No new candidates from standard search. Triggering amplified search...');
    try {
      const amplifiedCandidates = await runAmplifiedKolSearch(searchConfig, config, kolsData);

      if (amplifiedCandidates.length > 0) {
        console.log(`\n💎 Amplified search found ${amplifiedCandidates.length} new candidates!`);
        console.log('   These candidates can be manually reviewed and added to the KOL database.\n');
      }
    } catch (amplifiedError) {
      console.error(`\n❌ Amplified search failed: ${amplifiedError.message}`);
    }

    await sendDiscoveryNotification({
      scriptName: 'KOL Discovery - SDK Search',
      success: false,
      totalQueries: results.queriesExecuted,
      tweetsFound: results.totalTweetsFound,
      kolsAdded: 0,
      totalKols: kolsData.kols.length,
      runUrl: process.env.GITHUB_RUN_URL || null
    });

    return results;
  }

  // Fetch and evaluate candidates
  console.log('🔍 Evaluating candidates...\n');

  const maxToEvaluate = config.rateLimits?.maxKolsToEvaluatePerRun || 20;
  const candidatesToProcess = newUsernames.slice(0, maxToEvaluate);

  console.log(`⚠️  Evaluation limit: ${maxToEvaluate} candidates per run`);
  console.log(`   Processing: ${candidatesToProcess.length} candidates\n`);

  for (const username of candidatesToProcess) {
    console.log(`\n[${results.profilesFetched + 1}/${candidatesToProcess.length}] @${username}`);

    try {
      // SDK METHOD: client.getProfile() replaces getUserProfileWebUnblocker()
      const profile = await client.getProfile(username);

      if (!profile) {
        console.log(`   ❌ Profile not found`);
        results.errors.push(`@${username}: Profile not found`);
        results.discardedKols.push({ username, reason: 'Profile not found' });
        continue;
      }

      results.profilesFetched++;

      const followers = profile.public_metrics?.followers_count || 0;
      console.log(`   Followers: ${formatNumber(followers)}`);

      // Quick filters
      if (followers < config.kolCriteria.minFollowers) {
        console.log(`   ⏭️  Skipped: Below minimum followers`);
        results.discardedKols.push({ username, reason: `Below ${formatNumber(config.kolCriteria.minFollowers)} followers` });
        continue;
      }

      if (config.kolCriteria.maxFollowers && followers > config.kolCriteria.maxFollowers) {
        console.log(`   ⏭️  Skipped: Above maximum followers (${formatNumber(config.kolCriteria.maxFollowers)})`);
        results.discardedKols.push({ username, reason: `Above ${formatNumber(config.kolCriteria.maxFollowers)} followers` });
        continue;
      }

      // Check bio for crypto keywords (expanded list matching 2.1.1)
      const bio = (profile.description || '').toLowerCase();
      const cryptoKeywords = [
        'crypto', 'bitcoin', 'btc', 'eth', 'ethereum', 'blockchain', 'defi', 'web3', 'nft', 'dao', 'degen',
        'solana', 'sol', 'token', 'coin', 'protocol', 'decentralized', 'smart contract', 'validator',
        'staking', 'yield', 'liquidity', 'airdrop', 'hodl', 'moon', 'rug', 'dex', 'cex', 'wallet',
        'ledger', 'metamask', 'uniswap', 'opensea', 'founder', 'investor', 'vc', 'angel', 'altcoin'
      ];
      const hasCryptoKeyword = cryptoKeywords.some(keyword => bio.includes(keyword));

      // Known crypto influencers (expanded list)
      const knownCryptoUsernames = [
        'vitalikbuterin', 'cz_binance', 'aantonop', 'naval',
        'balajis', 'apompliano', 'documentingbtc', 'defidad', 'sassal0x',
        'elonmusk', 'satoshilite', 'justinsuntron', 'cobie', 'incomesharks',
        'dcfgod', 'vladzamfir', 'stanikulechov', 'erikvoorhees', 'ryansadams',
        'trustlessstate', 'ljxie', 'antiprosynth', 'takenstheorem', 'justinbons',
        'cryptotea_', 'altcoinbuzz', 'cryptorus'
      ];
      const isKnownCryptoKOL = knownCryptoUsernames.includes(username.toLowerCase());

      // More lenient filter: accept if crypto keyword OR known KOL OR high followers (50K+)
      const passesFilter = hasCryptoKeyword || isKnownCryptoKOL || followers >= 50000;

      if (!passesFilter && bio.length > 0) {
        console.log(`   ⏭️  Skipped: Does not meet crypto relevance criteria`);
        results.discardedKols.push({ username, reason: 'Not crypto relevant' });
        continue;
      }

      // Evaluate with Claude AI
      console.log(`   🤖 Evaluating with Claude AI...`);

      // For initial evaluation, we'll use the profile only
      // (fetching tweets would require additional SDK calls)
      const evaluation = await evaluateUserAsCryptoKOL(claudeClient, profile, []);

      console.log(`   Crypto KOL: ${evaluation.isCryptoKOL ? '✅' : '❌'}`);
      console.log(`   Relevance Score: ${evaluation.cryptoRelevanceScore}%`);
      console.log(`   Account Type: ${evaluation.accountType}`);

      // Check criteria
      if (!evaluation.isCryptoKOL) {
        console.log(`   ⏭️  Skipped: Not identified as crypto KOL`);
        results.discardedKols.push({ username, reason: 'Not identified as crypto KOL' });
        continue;
      }

      if (evaluation.cryptoRelevanceScore < config.kolCriteria.minCryptoRelevance) {
        console.log(`   ⏭️  Skipped: Crypto relevance too low (${evaluation.cryptoRelevanceScore}%)`);
        results.discardedKols.push({ username, reason: `Low crypto relevance (${evaluation.cryptoRelevanceScore}%)` });
        continue;
      }

      if (!['person', 'mixed'].includes(evaluation.accountType.toLowerCase())) {
        console.log(`   ⏭️  Skipped: Not a person account (${evaluation.accountType})`);
        results.discardedKols.push({ username, reason: `Not person account (${evaluation.accountType})` });
        continue;
      }

      // Add to KOLs
      const newKol = {
        id: profile.id || `sdk_search_${username}`,
        username: profile.username || username,
        name: profile.name || username,
        bio: profile.description || '',
        followersCount: followers,
        followingCount: profile.public_metrics?.following_count || 0,
        tweetCount: profile.public_metrics?.tweet_count || 0,
        isVerified: profile.verified || false,
        cryptoRelevanceScore: evaluation.cryptoRelevanceScore,
        engagementRate: 0, // Will be calculated when we analyze tweets
        avgLikes: 0,
        avgViews: 0,
        discoveredAt: new Date().toISOString(),
        lastChecked: new Date().toISOString(),
        discoveredThrough: 'sdk-search',
        discoveryLevel: 0,
        engagementHistory: {
          totalPostsAnalyzed: 0,
          repliedTo: 0,
          lastEngagement: null,
          successfulReplies: 0,
          failedReplies: 0
        },
        relationships: {
          follows: [],
          followedBy: []
        },
        recentTopics: evaluation.primaryTopics || [],
        cryptoProjects: evaluation.cryptoProjects || [],
        sentimentTowardsCrypto: evaluation.sentimentTowardsCrypto || 'neutral',
        accountType: evaluation.accountType,
        lastTweetAnalyzed: null,
        status: 'active'
      };

      kolsData.kols.push(newKol);
      existingUsernames.add(newKol.username.toLowerCase());
      results.kolsAdded++;

      // Track top discovery (highest follower count)
      if (!results.topDiscovery || followers > results.topDiscovery.followers) {
        results.topDiscovery = {
          username: newKol.username,
          followers: followers
        };
      }

      console.log(`   ✅ Added to KOLs database!`);

      // Save after each addition
      saveKolsData(kolsData);

    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      results.errors.push(`@${username}: ${error.message}`);
      continue;
    }

    // Rate limiting between evaluations
    if (results.profilesFetched < candidatesToProcess.length) {
      await sleep(5000);
    }
  }

  // Final save
  if (results.kolsAdded > 0) {
    kolsData.metadata.lastDiscoveryRun = new Date().toISOString();
    kolsData.metadata.discoveryMethod = 'sdk-search';
    saveKolsData(kolsData);

    // Update README with new KOL counts
    console.log('\n📝 Updating README.md with new KOL stats...');
    updateReadmeKolStats();
  }

  const duration = Math.round((Date.now() - startTime) / 1000);

  // Print final summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 DISCOVERY SUMMARY');
  console.log('='.repeat(60));
  console.log(`\nSearch Phase:`);
  console.log(`  Queries executed: ${results.queriesExecuted}`);
  console.log(`  Tweets found: ${results.totalTweetsFound}`);
  console.log(`  Tweets filtered (engagement): ${results.tweetsFiltered}`);
  console.log(`  Usernames extracted: ${results.usernamesExtracted}`);
  console.log(`  Unique usernames: ${allUsernames.size}`);
  console.log(`  New candidates: ${results.newCandidates}`);
  console.log(`\nEvaluation Phase:`);
  console.log(`  Profiles fetched: ${results.profilesFetched}`);
  console.log(`  KOLs added: ${results.kolsAdded}`);
  console.log(`\nDatabase:`);
  console.log(`  Total KOLs: ${kolsData.kols.length}`);
  console.log(`  Active KOLs: ${kolsData.kols.filter(k => k.status === 'active').length}`);
  console.log(`\nExecution:`);
  console.log(`  Duration: ${duration}s (${Math.round(duration/60)}m ${duration%60}s)`);

  if (results.errors.length > 0) {
    console.log(`\n❌ Errors (${results.errors.length}):`);
    results.errors.slice(0, 5).forEach((err, i) => {
      console.log(`  ${i + 1}. ${err}`);
    });
    if (results.errors.length > 5) {
      console.log(`  ... and ${results.errors.length - 5} more`);
    }
  }

  console.log('='.repeat(60));
  console.log(`\n✅ SDK search discovery complete! Added ${results.kolsAdded} new KOLs`);

  // Add duration to results
  results.duration = duration;

  // Send Zapier notification
  await sendDiscoveryNotification({
    scriptName: 'KOL Discovery - SDK Search',
    success: results.kolsAdded > 0,
    totalQueries: results.queriesExecuted,
    tweetsFound: results.totalTweetsFound,
    kolsAdded: results.kolsAdded,
    totalKols: kolsData.kols.length,
    method: 'BWS X SDK',
    duration: duration,
    discardedKols: results.discardedKols,
    candidatesProcessed: results.profilesFetched,
    runUrl: process.env.GITHUB_RUN_URL || null
  });

  // Log execution metrics for README history
  console.log('\n📊 Logging execution metrics...');
  try {
    logSearchDiscovery(results);
  } catch (logError) {
    console.error('⚠️  Failed to log execution metrics:', logError.message);
    // Don't fail the whole script if logging fails
  }

  return results;
}

// Run discovery
discoverByEngagementSDK().then(results => {
  process.exit(results.kolsAdded > 0 ? 0 : 1);
}).catch(async (error) => {
  console.error('\n💥 Fatal error:', error);
  console.error('Stack trace:', error.stack);

  // Send error notification
  try {
    await sendDiscoveryNotification({
      scriptName: 'KOL Discovery - SDK Search',
      success: false,
      queriesExecuted: 0,
      tweetsFound: 0,
      kolsAdded: 0,
      totalKols: 0,
      method: 'sdk',
      error: {
        message: error.message,
        type: error.name || 'Error',
        stack: error.stack ? error.stack.substring(0, 500) : null,
      },
      runUrl: process.env.GITHUB_RUN_URL || null
    });
  } catch (notifError) {
    console.error('Failed to send error notification:', notifError.message);
  }

  process.exit(1);
});
