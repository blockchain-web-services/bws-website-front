import {
  loadConfig,
  loadKolsData,
  saveKolsData,
  RateLimiter,
  meetsKolCriteria,
  calculateEngagementRate,
  formatNumber,
  sleep
} from './utils/kol-utils.js';
import {
  createReadOnlyClient,
  batchUserLookup,
  apiTracker
} from './utils/twitter-client.js';
import { sendDiscoveryNotification, sendErrorNotification } from './utils/zapier-webhook.js';
import {
  createClaudeClient,
  evaluateUserAsCryptoKOL
} from './utils/claude-client.js';
import {
  loadSearchQueries,
  executeSearchQuery,
  extractUserIdsFromTweets,
  filterByEngagement,
  deduplicateAgainstDatabase,
  getSearchStats
} from './utils/search-based-discovery.js';

/**
 * Search-Based KOL Discovery Script
 * Discovers crypto KOLs by mining high-engagement tweets
 */

async function discoverByEngagement() {
  console.log('🔍 Starting Search-Based KOL Discovery Process...\n');

  // Reset API tracker for this execution
  apiTracker.reset();

  // Load configuration
  const config = loadConfig();
  const searchConfig = loadSearchQueries();

  console.log(`📊 Configuration:
   - Queries to run: ${searchConfig.queries.length}
   - Max tweets per query: ${searchConfig.settings.maxTweetsPerQuery}
   - Engagement tier: ${config.searchDiscovery?.engagementTier || 'tier2'}
   - Min Followers: ${formatNumber(config.searchDiscovery?.minFollowersOverride || config.kolCriteria.minFollowers)}
   - Min Crypto Relevance: ${config.kolCriteria.minCryptoRelevance}%
`);

  // Initialize clients
  const twitterClient = createReadOnlyClient();
  const claudeClient = createClaudeClient();

  // Initialize rate limiters
  const twitterLimiter = new RateLimiter(config.rateLimits.twitterApiCallsPerMinute);
  const claudeLimiter = new RateLimiter(config.rateLimits.claudeApiCallsPerMinute);

  // Load existing data
  let kolsData = loadKolsData();
  const existingKolsMap = new Map(kolsData.kols.map(k => [k.id, k]));

  // Get engagement threshold
  const engagementTier = config.searchDiscovery?.engagementTier || 'tier2';
  const threshold = searchConfig.engagementThresholds[engagementTier];

  console.log(`✅ Using engagement threshold: ${engagementTier}`);
  console.log(`   - Min Likes: ${threshold.minLikes}`);
  console.log(`   - Min Retweets: ${threshold.minRetweets}`);
  console.log(`   - Min Views: ${threshold.minViews}\n`);

  // Track stats
  let totalQueries = 0;
  let totalTweetsFound = 0;
  let totalTweetsFiltered = 0;
  let totalUserIds = 0;
  let totalUnique = 0;
  let totalNew = 0;
  let totalProcessed = 0;
  let totalAdded = 0;
  let totalSkipped = 0;

  const allUserIds = new Set();

  console.log('🔎 Executing search queries...\n');

  const waitBetweenQueries = searchConfig.settings.waitBetweenQueriesMs || 10000;

  // Execute each search query
  for (const queryConfig of searchConfig.queries) {
    totalQueries++;

    console.log(`\n[${totalQueries}/${searchConfig.queries.length}] Query: "${queryConfig.name}"`);
    console.log(`   Category: ${queryConfig.category}`);
    console.log(`   Search: "${queryConfig.query}"`);

    try {
      // Execute search with rate limiting
      await twitterLimiter.throttle();

      const { tweets, includes, meta, error } = await executeSearchQuery(
        twitterClient,
        queryConfig.query,
        searchConfig.settings.maxTweetsPerQuery
      );

      if (error) {
        console.log(`   ❌ Query failed: ${error}`);
        continue;
      }

      if (tweets.length === 0) {
        console.log(`   ℹ️  No tweets found`);
        continue;
      }

      totalTweetsFound += tweets.length;
      console.log(`   ✅ Found ${tweets.length} tweets`);

      // Get stats before filtering
      const stats = getSearchStats(tweets);
      console.log(`   📊 Avg engagement: ${stats.avgLikes} likes, ${stats.avgRetweets} retweets`);

      // Filter by engagement threshold
      const highEngagementTweets = filterByEngagement(tweets, threshold);
      totalTweetsFiltered += highEngagementTweets.length;

      console.log(`   🎯 ${highEngagementTweets.length} tweets meet engagement threshold`);

      if (highEngagementTweets.length === 0) {
        console.log(`   ⏭️  No tweets passed engagement filter`);
        continue;
      }

      // Extract user IDs
      const userIds = extractUserIdsFromTweets(highEngagementTweets, includes);
      totalUserIds += userIds.length;

      console.log(`   👥 Extracted ${userIds.length} user IDs (authors + mentions)`);

      // Add to set for deduplication
      userIds.forEach(id => allUserIds.add(id));

    } catch (error) {
      console.error(`   ❌ Error processing query: ${error.message}`);
      continue;
    }

    // Wait between queries to avoid rate limits
    if (totalQueries < searchConfig.queries.length) {
      console.log(`   ⏸️  Waiting ${waitBetweenQueries / 1000}s before next query...`);
      await sleep(waitBetweenQueries);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 SEARCH PHASE SUMMARY');
  console.log('='.repeat(60));
  console.log(`Queries executed: ${totalQueries}`);
  console.log(`Total tweets found: ${totalTweetsFound}`);
  console.log(`Tweets after engagement filter: ${totalTweetsFiltered}`);
  console.log(`Total user IDs extracted: ${totalUserIds}`);
  console.log(`Unique user IDs: ${allUserIds.size}`);
  console.log('='.repeat(60));

  if (allUserIds.size === 0) {
    console.log('\n⚠️  No users discovered. Try different queries or lower engagement thresholds.');

    // Send notification even when no users discovered
    await sendDiscoveryNotification({
      scriptName: 'KOL Discovery - Search-Based',
      success: true,
      totalQueries,
      tweetsFound: totalTweetsFound,
      kolsAdded: 0,
      totalKols: kolsData.kols.length,
      apiStats: apiTracker.exportStats(),
      runUrl: process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
        ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
        : null
    });

    process.exit(0);
  }

  // Deduplicate against existing database
  const uniqueUserIds = Array.from(allUserIds);
  const newUserIds = deduplicateAgainstDatabase(uniqueUserIds, kolsData.kols);
  totalNew = newUserIds.length;

  console.log(`\n🔄 Deduplication:`);
  console.log(`   - Already in database: ${uniqueUserIds.length - newUserIds.length}`);
  console.log(`   - New candidates: ${newUserIds.length}`);

  if (newUserIds.length === 0) {
    console.log('\n✅ All discovered users are already in the database!');

    // Send notification even when all users already in database
    await sendDiscoveryNotification({
      scriptName: 'KOL Discovery - Search-Based',
      success: true,
      totalQueries,
      tweetsFound: totalTweetsFound,
      kolsAdded: 0,
      totalKols: kolsData.kols.length,
      apiStats: apiTracker.exportStats(),
      runUrl: process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
        ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
        : null
    });

    process.exit(0);
  }

  // Batch lookup users
  console.log(`\n📥 Fetching user profiles in batches of 100...`);

  await twitterLimiter.throttle();
  const users = await batchUserLookup(twitterClient, newUserIds);

  console.log(`✅ Fetched ${users.length} user profiles\n`);

  // Filter and evaluate users
  const minFollowers = config.searchDiscovery?.minFollowersOverride || config.kolCriteria.minFollowers;

  console.log('🔍 Evaluating candidates...\n');

  for (const user of users) {
    totalProcessed++;

    console.log(`\n[${totalProcessed}/${users.length}] @${user.username}`);
    console.log(`   Followers: ${formatNumber(user.public_metrics.followers_count)}`);

    // Quick filter: minimum followers
    if (user.public_metrics.followers_count < minFollowers) {
      console.log(`   ⏭️  Skipped: Below minimum followers`);
      totalSkipped++;
      continue;
    }

    // Get their recent tweets for evaluation
    try {
      await twitterLimiter.throttle();

      const tweets = await twitterClient.v2.userTimeline(user.id, {
        max_results: 20,
        'tweet.fields': ['created_at', 'text', 'public_metrics'],
        exclude: ['retweets']
      });

      const tweetsArray = [];
      for await (const tweet of tweets) {
        tweetsArray.push(tweet);
      }

      if (tweetsArray.length < 3) {
        console.log(`   ⏭️  Skipped: Insufficient tweets (${tweetsArray.length})`);
        totalSkipped++;
        continue;
      }

      console.log(`   Tweets analyzed: ${tweetsArray.length}`);

      // Evaluate with Claude
      await claudeLimiter.throttle();
      console.log(`   🤖 Evaluating with Claude AI...`);

      const evaluation = await evaluateUserAsCryptoKOL(claudeClient, user, tweetsArray);

      console.log(`   Crypto KOL: ${evaluation.isCryptoKOL ? '✅' : '❌'}`);
      console.log(`   Relevance Score: ${evaluation.cryptoRelevanceScore}%`);
      console.log(`   Account Type: ${evaluation.accountType}`);

      // Check if meets all criteria
      const avgEngagementRate = tweetsArray.length > 0 ? calculateEngagementRate(
        tweetsArray.reduce((sum, t) => sum + (t.public_metrics?.like_count || 0), 0) / tweetsArray.length,
        tweetsArray.reduce((sum, t) => sum + (t.public_metrics?.retweet_count || 0), 0) / tweetsArray.length,
        tweetsArray.reduce((sum, t) => sum + (t.public_metrics?.reply_count || 0), 0) / tweetsArray.length,
        user.public_metrics.followers_count
      ) : 0;

      const criteriaCheck = meetsKolCriteria(user, config, evaluation.cryptoRelevanceScore, {
        avgEngagementRate,
        avgLikes: tweetsArray.reduce((sum, t) => sum + (t.public_metrics?.like_count || 0), 0) / tweetsArray.length,
        avgViews: 0
      });

      if (!criteriaCheck.meets) {
        console.log(`   ⏭️  Skipped: ${criteriaCheck.reason}`);
        totalSkipped++;
        continue;
      }

      // Filter: Only add "person" accounts (not businesses or bots)
      if (!['person', 'mixed'].includes(evaluation.accountType.toLowerCase())) {
        console.log(`   ⏭️  Skipped: Not a person account (${evaluation.accountType})`);
        totalSkipped++;
        continue;
      }

      // Add to KOLs list
      const newKol = {
        id: user.id,
        username: user.username,
        name: user.name,
        bio: user.description || '',
        followersCount: user.public_metrics.followers_count,
        followingCount: user.public_metrics.following_count,
        tweetCount: user.public_metrics.tweet_count,
        isVerified: user.verified || false,
        cryptoRelevanceScore: evaluation.cryptoRelevanceScore,
        engagementRate: avgEngagementRate,
        avgLikes: tweetsArray.reduce((sum, t) => sum + (t.public_metrics?.like_count || 0), 0) / tweetsArray.length,
        avgViews: 0,
        discoveredAt: new Date().toISOString(),
        lastChecked: new Date().toISOString(),
        discoveredThrough: 'search-engagement',
        discoveryLevel: 0,
        engagementHistory: {
          totalPostsAnalyzed: tweetsArray.length,
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
      existingKolsMap.set(newKol.id, newKol);
      totalAdded++;

      console.log(`   ✅ Added to KOLs database!`);

      // Batch save every 5 additions
      if (totalAdded % 5 === 0) {
        console.log(`\n💾 Saving progress... (${totalAdded} new KOLs)`);
        saveKolsData(kolsData);
      }

    } catch (error) {
      console.error(`   ❌ Error evaluating @${user.username}: ${error.message}`);
      totalSkipped++;
      continue;
    }
  }

  // Final save
  kolsData.metadata.lastDiscoveryRun = new Date().toISOString();
  kolsData.metadata.discoveryMethod = 'search-engagement';
  saveKolsData(kolsData);

  // Print summary
  console.log(`\n
${'='.repeat(60)}
📊 DISCOVERY SUMMARY
${'='.repeat(60)}

Search Phase:
  Queries executed: ${totalQueries}
  Tweets found: ${totalTweetsFound}
  Tweets filtered (engagement): ${totalTweetsFiltered}
  User IDs extracted: ${totalUserIds}
  Unique users: ${uniqueUserIds.length}
  New candidates: ${totalNew}

Evaluation Phase:
  Profiles fetched: ${users.length}
  Total Processed: ${totalProcessed}
  New KOLs Added: ${totalAdded}
  Skipped: ${totalSkipped}

Database:
  Total KOLs: ${kolsData.kols.length}
  Active KOLs: ${kolsData.kols.filter(k => k.status === 'active').length}

${'='.repeat(60)}
`);

  // Display API consumption statistics
  apiTracker.displayStats();

  // Send notification to Zapier/Slack
  await sendDiscoveryNotification({
    scriptName: 'KOL Discovery - Search-Based',
    success: true,
    totalQueries,
    tweetsFound: totalTweetsFound,
    kolsAdded: totalAdded,
    totalKols: kolsData.kols.length,
    apiStats: apiTracker.exportStats(),
    runUrl: process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : null
  });

  console.log('\n✅ Search-based discovery complete!');
}

// Run the script
discoverByEngagement().catch(async (error) => {
  console.error('\n❌ Fatal error:', error);

  // Send error notification to Zapier/Slack
  await sendErrorNotification({
    scriptName: 'KOL Discovery - Search-Based',
    error,
    context: {
      api_stats: apiTracker.exportStats()
    },
    runUrl: process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : null
  });

  process.exit(1);
});
