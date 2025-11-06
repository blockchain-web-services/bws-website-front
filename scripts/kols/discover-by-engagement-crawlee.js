/**
 * Search-Based KOL Discovery - Crawlee Version
 * Uses Crawlee for FREE X search (no API costs)
 * Discovers crypto KOLs by mining high-engagement tweets
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { searchTweets, getUserProfile } from './crawlers/twitter-crawler.js';
import {
  loadConfig,
  loadKolsData,
  saveKolsData,
  meetsKolCriteria,
  calculateEngagementRate,
  formatNumber,
  sleep
} from './utils/kol-utils.js';
import { sendDiscoveryNotification } from './utils/zapier-webhook.js';
import { createClaudeClient, evaluateUserAsCryptoKOL } from './utils/claude-client.js';
import authManager from './utils/x-auth-manager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadSearchQueries() {
  const configPath = path.join(__dirname, 'config', 'search-queries.json');

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
    // Add tweet author
    if (tweet.username) {
      usernames.add(tweet.username);
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
  return tweets.filter(tweet => {
    const metrics = tweet.public_metrics || {};
    return (
      (metrics.like_count || 0) >= threshold.minLikes &&
      (metrics.retweet_count || 0) >= threshold.minRetweets &&
      (metrics.impression_count || 0) >= threshold.minViews
    );
  });
}

/**
 * Main discovery function
 */
async function discoverByEngagementCrawlee() {
  console.log('🔍 Starting Search-Based KOL Discovery (Crawlee Mode)...\n');

  const startTime = Date.now();

  // Initialize authentication manager
  console.log('🔐 Initializing authentication manager...');
  await authManager.initialize();
  const authStats = authManager.getStats();
  console.log(`   ✅ ${authStats.available} accounts available for use\n`);

  if (authStats.available === 0) {
    console.error('❌ No crawler accounts available! Please run setup-crawler-accounts.js first.');
    process.exit(1);
  }

  // Load configuration
  const config = loadConfig();
  const searchConfig = loadSearchQueries();
  const claudeClient = createClaudeClient();

  // Get engagement threshold
  const engagementTier = config.searchDiscovery?.engagementTier || 'tier4';
  const threshold = searchConfig.engagementThresholds[engagementTier];

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
    totalTweetsFound: 0,
    tweetsFiltered: 0,
    usernamesExtracted: 0,
    uniqueUsernames: 0,
    newCandidates: 0,
    profilesFetched: 0,
    kolsAdded: 0,
    errors: []
  };

  const allUsernames = new Set();
  const maxQueriesPerRun = searchConfig.settings.maxQueriesPerRun || 6;

  console.log('🔎 Executing search queries...\n');

  // Execute search queries
  for (const queryConfig of searchConfig.queries.slice(0, maxQueriesPerRun)) {
    results.queriesExecuted++;

    console.log(`\n[${results.queriesExecuted}/${Math.min(searchConfig.queries.length, maxQueriesPerRun)}] Query: "${queryConfig.name}"`);
    console.log(`   Category: ${queryConfig.category}`);
    console.log(`   Search: "${queryConfig.query}"`);

    try {
      // Get next available account with authentication
      const account = await authManager.getNextAccount();
      console.log(`   🔄 Using account: ${account.id}`);

      // Get authenticated cookies
      const cookies = await authManager.getAuthenticatedCookies(account);

      // Use Crawlee to search with authentication (FREE - no API costs)
      const tweets = await searchTweets(queryConfig.query, {
        maxResults: searchConfig.settings.maxTweetsPerQuery || 50,
        cookies
      });

      // Mark account as used
      await authManager.markUsed(account.id);

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
      console.error(`   ❌ Error: ${error.message}`);
      results.errors.push(`Query "${queryConfig.name}": ${error.message}`);

      // Handle account-specific errors
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        console.log(`   ⏳ Account rate-limited, will retry with next account`);
        // Auth manager will automatically switch to next account on next iteration
      } else if (error.message.includes('suspended')) {
        console.log(`   🚫 Account suspended, will use next account`);
        // Auth manager already marked account as suspended
      }

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

    await sendDiscoveryNotification({
      scriptName: 'KOL Discovery - Crawlee Search',
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

    await sendDiscoveryNotification({
      scriptName: 'KOL Discovery - Crawlee Search',
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
      // Fetch profile with Crawlee (FREE)
      const profile = await getUserProfile(username);

      if (!profile) {
        console.log(`   ❌ Profile not found`);
        results.errors.push(`@${username}: Profile not found`);
        continue;
      }

      results.profilesFetched++;

      const followers = profile.public_metrics?.followers_count || 0;
      console.log(`   Followers: ${formatNumber(followers)}`);

      // Quick filters
      if (followers < config.kolCriteria.minFollowers) {
        console.log(`   ⏭️  Skipped: Below minimum followers`);
        continue;
      }

      if (config.kolCriteria.maxFollowers && followers > config.kolCriteria.maxFollowers) {
        console.log(`   ⏭️  Skipped: Above maximum followers (${formatNumber(config.kolCriteria.maxFollowers)})`);
        continue;
      }

      // Check bio for crypto keywords
      const bio = (profile.description || '').toLowerCase();
      const cryptoKeywords = ['crypto', 'bitcoin', 'btc', 'eth', 'ethereum', 'blockchain', 'defi', 'nft', 'web3', 'degen', 'altcoin', 'token', 'dao'];
      const hasCryptoKeyword = cryptoKeywords.some(keyword => bio.includes(keyword));

      if (!hasCryptoKeyword && bio.length > 0) {
        console.log(`   ⏭️  Skipped: No crypto keywords in bio`);
        continue;
      }

      // Evaluate with Claude AI
      console.log(`   🤖 Evaluating with Claude AI...`);

      // For initial evaluation, we'll use the profile only
      // (fetching tweets would require additional Crawlee calls)
      const evaluation = await evaluateUserAsCryptoKOL(claudeClient, profile, []);

      console.log(`   Crypto KOL: ${evaluation.isCryptoKOL ? '✅' : '❌'}`);
      console.log(`   Relevance Score: ${evaluation.cryptoRelevanceScore}%`);
      console.log(`   Account Type: ${evaluation.accountType}`);

      // Check criteria
      if (!evaluation.isCryptoKOL) {
        console.log(`   ⏭️  Skipped: Not identified as crypto KOL`);
        continue;
      }

      if (evaluation.cryptoRelevanceScore < config.kolCriteria.minCryptoRelevance) {
        console.log(`   ⏭️  Skipped: Crypto relevance too low (${evaluation.cryptoRelevanceScore}%)`);
        continue;
      }

      if (!['person', 'mixed'].includes(evaluation.accountType.toLowerCase())) {
        console.log(`   ⏭️  Skipped: Not a person account (${evaluation.accountType})`);
        continue;
      }

      // Add to KOLs
      const newKol = {
        id: profile.id || `crawlee_search_${username}`,
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
        discoveredThrough: 'crawlee-search',
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
    kolsData.metadata.discoveryMethod = 'crawlee-search';
    saveKolsData(kolsData);
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
  console.log(`\n✅ Crawlee search discovery complete! Added ${results.kolsAdded} new KOLs`);

  // Send Zapier notification
  await sendDiscoveryNotification({
    scriptName: 'KOL Discovery - Crawlee Search',
    success: results.kolsAdded > 0,
    totalQueries: results.queriesExecuted,
    tweetsFound: results.totalTweetsFound,
    kolsAdded: results.kolsAdded,
    totalKols: kolsData.kols.length,
    runUrl: process.env.GITHUB_RUN_URL || null
  });

  return results;
}

// Run discovery
discoverByEngagementCrawlee().then(results => {
  process.exit(results.kolsAdded > 0 ? 0 : 1);
}).catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
