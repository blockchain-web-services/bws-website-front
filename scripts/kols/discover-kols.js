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
  getUserByUsername,
  getUserFollowing,
  getUserTweetsWithMetrics,
  apiTracker
} from './utils/twitter-client.js';
import { sendDiscoveryNotification, sendErrorNotification } from './utils/zapier-webhook.js';
import {
  createClaudeClient,
  evaluateUserAsCryptoKOL
} from './utils/claude-client.js';

/**
 * Main KOL Discovery Script
 * Discovers crypto KOLs by traversing following relationships
 */

async function discoverKOLs() {
  console.log('🚀 Starting KOL Discovery Process...\n');

  // Reset API tracker for this execution
  apiTracker.reset();

  // Load configuration
  const config = loadConfig();
  const { maxDepth, seedKols, maxKolsPerLevel, processingBatchSize } = config.discovery;

  if (!seedKols || seedKols.length === 0) {
    console.error('❌ No seed KOLs configured in config/kol-config.json');
    console.log('💡 Add seed KOL usernames to discovery.seedKols array');
    process.exit(1);
  }

  console.log(`📊 Configuration:
   - Max Depth: ${maxDepth} levels
   - Seed KOLs: ${seedKols.length}
   - Max KOLs per level: ${maxKolsPerLevel}
   - Min Followers: ${formatNumber(config.kolCriteria.minFollowers)}
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

  // Create a map for quick lookup
  const existingKolsMap = new Map(
    kolsData.kols.map(k => [k.id, k])
  );

  // Discovery queue: { username, level, discoveredThrough }
  const discoveryQueue = seedKols.map(username => ({
    username,
    level: 0,
    discoveredThrough: 'seed'
  }));

  const discovered = new Set(seedKols.map(u => u.toLowerCase()));
  let totalProcessed = 0;
  let totalAdded = 0;
  let totalSkipped = 0;

  console.log('🔍 Starting discovery traversal...\n');

  while (discoveryQueue.length > 0 && totalProcessed < 1000) { // Safety limit
    const current = discoveryQueue.shift();

    // Check if we've exceeded the depth
    if (current.level >= maxDepth) {
      console.log(`⏭️  Skipping ${current.username} (depth ${current.level} >= max ${maxDepth})`);
      continue;
    }

    totalProcessed++;

    console.log(`\n📍 [${totalProcessed}] Processing @${current.username} (Level ${current.level})`);

    try {
      // Rate limit Twitter API
      await twitterLimiter.throttle();

      // Get user info
      const user = await getUserByUsername(twitterClient, current.username);
      console.log(`   Followers: ${formatNumber(user.public_metrics.followers_count)}`);

      // Check if already in database
      if (existingKolsMap.has(user.id)) {
        console.log(`   ℹ️  Already in database, updating last checked time`);
        const existing = existingKolsMap.get(user.id);
        existing.lastChecked = new Date().toISOString();
        continue;
      }

      // Quick filter: check minimum followers
      if (user.public_metrics.followers_count < config.kolCriteria.minFollowers) {
        console.log(`   ⏭️  Skipped: Below minimum followers (${formatNumber(user.public_metrics.followers_count)})`);
        totalSkipped++;
        continue;
      }

      // Get recent tweets with metrics (combined activity check + metrics)
      await twitterLimiter.throttle();
      const { tweets, metrics } = await getUserTweetsWithMetrics(
        twitterClient,
        user.id,
        config.kolCriteria.recentActivityWindowDays,
        20
      );

      // Check if user is active (using the tweets we just fetched)
      if (tweets.length === 0) {
        console.log(`   ⏭️  Skipped: No activity in last ${config.kolCriteria.recentActivityWindowDays} days`);
        totalSkipped++;
        continue;
      }

      if (tweets.length < 3) {
        console.log(`   ⏭️  Skipped: Insufficient tweets (${tweets.length})`);
        totalSkipped++;
        continue;
      }

      console.log(`   Tweets analyzed: ${tweets.length}, Avg likes: ${metrics.avgLikes}, Avg views: ${metrics.avgViews}`);

      // Calculate engagement rate
      const avgEngagementRate = calculateEngagementRate(
        metrics.avgLikes,
        metrics.avgRetweets,
        metrics.avgReplies,
        user.public_metrics.followers_count
      );

      // Use Claude to evaluate crypto relevance
      await claudeLimiter.throttle();
      console.log(`   🤖 Evaluating with Claude AI...`);

      const evaluation = await evaluateUserAsCryptoKOL(claudeClient, user, tweets);

      console.log(`   Crypto KOL: ${evaluation.isCryptoKOL ? '✅' : '❌'}`);
      console.log(`   Relevance Score: ${evaluation.cryptoRelevanceScore}%`);
      console.log(`   Account Type: ${evaluation.accountType}`);
      console.log(`   Topics: ${evaluation.primaryTopics?.join(', ') || 'N/A'}`);

      // Check if meets all criteria
      const criteriaCheck = meetsKolCriteria(user, config, evaluation.cryptoRelevanceScore, {
        avgEngagementRate,
        avgLikes: metrics.avgLikes,
        avgViews: metrics.avgViews
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
        avgLikes: metrics.avgLikes,
        avgViews: metrics.avgViews,
        discoveredAt: new Date().toISOString(),
        lastChecked: new Date().toISOString(),
        discoveredThrough: current.discoveredThrough,
        discoveryLevel: current.level,
        engagementHistory: {
          totalPostsAnalyzed: tweets.length,
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

      // If we're not at max depth, add their following to queue
      if (current.level + 1 < maxDepth) {
        console.log(`   🔗 Fetching following list...`);

        await twitterLimiter.throttle();
        const following = await getUserFollowing(twitterClient, user.id, maxKolsPerLevel);

        let addedToQueue = 0;
        for await (const followedUser of following) {
          const followedUsername = followedUser.username.toLowerCase();

          // Skip if already discovered or in queue
          if (!discovered.has(followedUsername)) {
            discovered.add(followedUsername);
            discoveryQueue.push({
              username: followedUser.username,
              level: current.level + 1,
              discoveredThrough: user.username
            });
            addedToQueue++;
          }

          if (addedToQueue >= maxKolsPerLevel) break;
        }

        console.log(`   📝 Added ${addedToQueue} users to discovery queue (Level ${current.level + 1})`);
      }

      // Batch save every 5 additions
      if (totalAdded % 5 === 0) {
        console.log(`\n💾 Saving progress... (${totalAdded} new KOLs)`);
        saveKolsData(kolsData);
      }

      // Wait between batches
      if (totalProcessed % processingBatchSize === 0) {
        console.log(`\n⏸️  Batch complete. Waiting ${config.rateLimits.waitBetweenBatchesMs / 1000}s...`);
        await sleep(config.rateLimits.waitBetweenBatchesMs);
      }

    } catch (error) {
      console.error(`   ❌ Error processing @${current.username}: ${error.message}`);
      totalSkipped++;
      continue;
    }
  }

  // Final save
  kolsData.metadata.lastDiscoveryRun = new Date().toISOString();
  kolsData.metadata.discoveryDepth = maxDepth;
  kolsData.metadata.seedKolsCount = seedKols.length;
  saveKolsData(kolsData);

  // Print summary
  console.log(`\n
${'='.repeat(60)}
📊 DISCOVERY SUMMARY
${'='.repeat(60)}

Seed KOLs: ${seedKols.length}
Total Processed: ${totalProcessed}
New KOLs Added: ${totalAdded}
Skipped: ${totalSkipped}
Total KOLs in Database: ${kolsData.kols.length}
Active KOLs: ${kolsData.kols.filter(k => k.status === 'active').length}
Queue Remaining: ${discoveryQueue.length}

${'='.repeat(60)}
`);

  // Display API consumption statistics
  apiTracker.displayStats();

  // Send notification to Zapier/Slack
  await sendDiscoveryNotification({
    scriptName: 'KOL Discovery - Seed-Based',
    success: true,
    totalQueries: 0, // Seed-based doesn't use search queries
    tweetsFound: 0,
    kolsAdded: totalAdded,
    totalKols: kolsData.kols.length,
    apiStats: apiTracker.exportStats(),
    runUrl: process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : null
  });

  console.log('\n✅ Discovery complete!');
}

// Run the script
discoverKOLs().catch(async (error) => {
  console.error('\n❌ Fatal error:', error);

  // Send error notification to Zapier/Slack
  await sendErrorNotification({
    scriptName: 'KOL Discovery - Seed-Based',
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
