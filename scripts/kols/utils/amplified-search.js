/**
 * Amplified Search Module
 *
 * Provides fallback search strategies when primary KOL discovery or tweet evaluation
 * yields no suitable results. Automatically expands search to:
 * 1. Find NEW KOLs to track (beyond current database)
 * 2. Find relevant tweets from ANY users (not just tracked KOLs)
 *
 * This ensures continuous engagement and self-sustaining growth.
 */

import { searchTweets } from '../crawlers/twitter-crawler.js';
import authManager from './x-auth-manager.js';

/**
 * Amplified KOL Search
 *
 * Executes broader searches to discover new KOL candidates when existing
 * database yields no results.
 *
 * Strategy:
 * - Uses generic crypto/altcoin keywords (vs specific mentions/replies)
 * - Applies relaxed engagement thresholds
 * - Extracts usernames from high-engagement tweets
 * - Deduplicates against existing KOLs
 *
 * @param {Object} searchConfig - Search queries configuration
 * @param {Object} config - KOL config with amplified search settings
 * @param {Object} kolsData - Current KOLs database
 * @returns {Promise<Array>} - Array of new KOL candidates discovered
 */
export async function runAmplifiedKolSearch(searchConfig, config, kolsData) {
  console.log('\n🚀 AMPLIFIED KOL SEARCH ACTIVATED');
  console.log('   Strategy: Broad keyword search for crypto discussion');
  console.log('   Goal: Discover new KOL candidates\n');

  const amplifiedConfig = config.searchDiscovery?.amplifiedSearch || {
    enabled: true,
    kolSearchQueries: [
      'crypto microcap lang:en -is:retweet min_faves:10',
      'altcoin gems lang:en -is:retweet min_faves:10',
      'hidden gem crypto lang:en -is:retweet min_faves:10',
      'undervalued crypto projects lang:en -is:retweet min_faves:10',
      'blockchain utility lang:en -is:retweet min_faves:10'
    ],
    relaxedThresholds: {
      minLikes: 3,
      minRetweets: 0,
      minViews: 50
    },
    maxNewKolsPerRun: 5
  };

  if (!amplifiedConfig.enabled) {
    console.log('   ⏭️  Amplified search is disabled in configuration');
    return [];
  }

  // Use singleton auth manager for Crawlee searches
  const proxyConfig = searchConfig.proxy || null;

  const allUsernames = new Set();
  const usernameTweetCounts = new Map(); // Track how many high-quality tweets per user
  let queriesExecuted = 0;

  console.log(`🔍 Executing ${amplifiedConfig.kolSearchQueries.length} amplified queries...\n`);

  // Execute each amplified query
  for (const query of amplifiedConfig.kolSearchQueries) {
    queriesExecuted++;
    console.log(`[${queriesExecuted}/${amplifiedConfig.kolSearchQueries.length}] Amplified Query: "${query}"`);

    try {
      // Get account for this search
      const account = await authManager.getNextAccount();
      const cookies = await authManager.getAuthenticatedCookies(account);

      // Execute search with Crawlee
      const tweets = await searchTweets(query, {
        maxResults: 50,
        cookies,
        account,
        proxyConfig
      });

      console.log(`   ✅ Found ${tweets.length} tweets`);

      // Filter by relaxed engagement thresholds
      const qualifyingTweets = tweets.filter(tweet => {
        const likesOk = (tweet.likes || 0) >= amplifiedConfig.relaxedThresholds.minLikes;
        const retweetsOk = (tweet.retweets || 0) >= amplifiedConfig.relaxedThresholds.minRetweets;
        const viewsOk = !amplifiedConfig.relaxedThresholds.minViews || (tweet.views || 0) >= amplifiedConfig.relaxedThresholds.minViews;
        return likesOk && retweetsOk && viewsOk;
      });

      console.log(`   🎯 ${qualifyingTweets.length} tweets meet relaxed engagement criteria`);

      // Extract usernames from qualifying tweets
      for (const tweet of qualifyingTweets) {
        if (tweet.username) {
          allUsernames.add(tweet.username);

          // Track tweet count per user
          const currentCount = usernameTweetCounts.get(tweet.username) || 0;
          usernameTweetCounts.set(tweet.username, currentCount + 1);
        }
      }

      // Mark account as used
      await authManager.markAccountUsed(account);

    } catch (error) {
      console.error(`   ❌ Query failed: ${error.message}`);
    }
  }

  console.log(`\n📊 AMPLIFIED SEARCH RESULTS:`);
  console.log(`   Queries executed: ${queriesExecuted}`);
  console.log(`   Unique users found: ${allUsernames.size}`);

  // Deduplicate against existing KOLs
  const existingKolUsernames = new Set(
    kolsData.kols
      .filter(k => k.status === 'active' || k.status === 'pending')
      .map(k => k.username.toLowerCase())
  );

  const newCandidates = Array.from(allUsernames)
    .filter(username => !existingKolUsernames.has(username.toLowerCase()))
    .map(username => ({
      username,
      tweetCount: usernameTweetCounts.get(username) || 0
    }))
    .sort((a, b) => b.tweetCount - a.tweetCount) // Sort by tweet count descending
    .slice(0, amplifiedConfig.maxNewKolsPerRun); // Limit to max new KOLs

  console.log(`   New candidates (deduplicated): ${newCandidates.length}`);

  if (newCandidates.length > 0) {
    console.log(`\n💎 TOP NEW KOL CANDIDATES:`);
    newCandidates.forEach((candidate, i) => {
      console.log(`   ${i + 1}. @${candidate.username} (${candidate.tweetCount} high-quality tweets)`);
    });

    console.log(`\n✅ Add these to kols-data.json manually or via evaluation script`);
  } else {
    console.log(`   ⚠️  No new candidates found (all discovered users already tracked)`);
  }

  return newCandidates;
}

/**
 * Amplified Tweet Search
 *
 * Searches for relevant tweets from ANY users (not just tracked KOLs) that
 * match BWS product categories and are suitable for reply engagement.
 *
 * Strategy:
 * - Generates product-specific search queries
 * - Searches beyond tracked KOL database
 * - Filters for relevance and engagement
 * - Returns tweets ready for immediate reply processing
 *
 * @param {Object} bwsProducts - BWS product documentation
 * @param {Object} config - KOL configuration
 * @param {Object} processedPosts - Already processed tweets (to avoid duplicates)
 * @returns {Promise<Array>} - Array of engaging posts suitable for replies
 */
export async function runAmplifiedTweetSearch(bwsProducts, config, processedPosts) {
  console.log('\n🚀 AMPLIFIED TWEET SEARCH ACTIVATED');
  console.log('   Strategy: Product-specific searches beyond tracked KOLs');
  console.log('   Goal: Find relevant tweets to reply to\n');

  const amplifiedConfig = config.searchDiscovery?.amplifiedSearch || {
    enabled: true,
    maxTweetsPerProduct: 10
  };

  if (!amplifiedConfig.enabled) {
    console.log('   ⏭️  Amplified search is disabled in configuration');
    return [];
  }

  // Product-specific search queries
  const productQueries = {
    'Fan Game Cube': [
      'sports fan engagement -is:retweet lang:en min_faves:5',
      'sports NFT gamification -is:retweet lang:en min_faves:5',
      'fan rewards platform -is:retweet lang:en min_faves:5'
    ],
    'Blockchain Badges': [
      'digital credentials blockchain -is:retweet lang:en min_faves:5',
      'verifiable certificates NFT -is:retweet lang:en min_faves:5',
      'educational credentials -is:retweet lang:en min_faves:5'
    ],
    'ESG Credits': [
      'ESG reporting blockchain -is:retweet lang:en min_faves:5',
      'environmental impact tracking -is:retweet lang:en min_faves:5',
      'sustainability blockchain -is:retweet lang:en min_faves:5'
    ],
    'Blockchain Hash': [
      'blockchain API developers -is:retweet lang:en min_faves:5',
      'crypto API infrastructure -is:retweet lang:en min_faves:5',
      'blockchain development tools -is:retweet lang:en min_faves:5'
    ],
    'Blockchain Save': [
      'decentralized storage blockchain -is:retweet lang:en min_faves:5',
      'IPFS alternatives -is:retweet lang:en min_faves:5',
      'blockchain file storage -is:retweet lang:en min_faves:5'
    ],
    'X Bot': [
      'X API automation -is:retweet lang:en min_faves:5',
      'social media analytics blockchain -is:retweet lang:en min_faves:5',
      'crypto community management -is:retweet lang:en min_faves:5'
    ]
  };

  // Use singleton auth manager
  const proxyConfig = config.proxy || null;

  const allEngagingPosts = [];
  const processedTweetIds = new Set(processedPosts.repliedTweetIds || []);
  processedTweetIds.add(...(processedPosts.skippedTweetIds || []));

  // Select 2-3 priority products to search for
  const productNames = Object.keys(productQueries);
  const priorityProducts = productNames.slice(0, 3); // Focus on top 3 products

  console.log(`🎯 Searching for tweets related to: ${priorityProducts.join(', ')}\n`);

  for (const productName of priorityProducts) {
    const queries = productQueries[productName] || [];

    console.log(`\n📦 Product: ${productName} (${queries.length} queries)`);

    for (const query of queries) {
      console.log(`   🔍 Query: "${query}"`);

      try {
        // Get account for this search
        const account = await authManager.getNextAccount();
        const cookies = await authManager.getAuthenticatedCookies(account);

        // Execute search with Crawlee
        const tweets = await searchTweets(query, {
          maxResults: 20,
          cookies,
          account,
          proxyConfig
        });

        console.log(`      ✅ Found ${tweets.length} tweets`);

        // Filter for engagement and deduplication
        const qualifyingTweets = tweets.filter(tweet => {
          // Skip if already processed
          if (processedTweetIds.has(tweet.id)) {
            return false;
          }

          // Minimum engagement criteria
          const hasEngagement = (tweet.likes || 0) >= 5 && (tweet.retweets || 0) >= 0;

          // Skip very short tweets (likely spam)
          const hasContent = tweet.text && tweet.text.length > 50;

          return hasEngagement && hasContent;
        });

        console.log(`      🎯 ${qualifyingTweets.length} qualifying tweets (after filters)`);

        // Convert to engaging posts format
        for (const tweet of qualifyingTweets.slice(0, amplifiedConfig.maxTweetsPerProduct)) {
          allEngagingPosts.push({
            id: tweet.id,
            username: tweet.username,
            text: tweet.text,
            likes: tweet.likes || 0,
            retweets: tweet.retweets || 0,
            views: tweet.views || 0,
            category: 'amplified-search',
            product: productName,
            processed: false,
            discoveredAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
            source: 'amplified-search'
          });
        }

        // Mark account as used
        await authManager.markAccountUsed(account);

      } catch (error) {
        console.error(`      ❌ Query failed: ${error.message}`);
      }
    }
  }

  console.log(`\n📊 AMPLIFIED TWEET SEARCH RESULTS:`);
  console.log(`   Total engaging posts found: ${allEngagingPosts.length}`);
  console.log(`   Products searched: ${priorityProducts.length}`);

  if (allEngagingPosts.length > 0) {
    console.log(`\n💬 SAMPLE TWEETS FOUND:`);
    allEngagingPosts.slice(0, 3).forEach((post, i) => {
      console.log(`   ${i + 1}. @${post.username}: "${post.text.substring(0, 80)}..."`);
      console.log(`      Engagement: ${post.likes} likes, ${post.retweets} RTs`);
    });
  } else {
    console.log(`   ⚠️  No suitable tweets found in amplified search`);
  }

  return allEngagingPosts;
}

/**
 * Combined Amplified Discovery
 *
 * Runs both KOL search and tweet search in sequence.
 * Use this for comprehensive amplified discovery.
 *
 * @param {Object} searchConfig - Search configuration
 * @param {Object} config - KOL configuration
 * @param {Object} kolsData - Current KOLs database
 * @param {Object} bwsProducts - BWS products
 * @param {Object} processedPosts - Processed posts tracker
 * @returns {Promise<Object>} - Results from both searches
 */
export async function runAmplifiedDiscovery(searchConfig, config, kolsData, bwsProducts, processedPosts) {
  console.log('\n🚀🚀 FULL AMPLIFIED DISCOVERY MODE 🚀🚀\n');

  const kolCandidates = await runAmplifiedKolSearch(searchConfig, config, kolsData);
  const engagingPosts = await runAmplifiedTweetSearch(bwsProducts, config, processedPosts);

  console.log('\n✅ AMPLIFIED DISCOVERY COMPLETE');
  console.log(`   New KOL candidates: ${kolCandidates.length}`);
  console.log(`   Engaging posts found: ${engagingPosts.length}`);

  return {
    kolCandidates,
    engagingPosts
  };
}
