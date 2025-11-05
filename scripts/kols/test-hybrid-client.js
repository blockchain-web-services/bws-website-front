/**
 * Test script for Twitter Hybrid Client
 * Demonstrates switching between Crawlee and Official API
 *
 * Usage:
 * - API mode (default):    node scripts/kols/test-hybrid-client.js
 * - Crawlee mode:          TWITTER_DATA_SOURCE=crawlee node scripts/kols/test-hybrid-client.js
 * - Crawlee visible mode:  TWITTER_DATA_SOURCE=crawlee CRAWLEE_HEADLESS=false node scripts/kols/test-hybrid-client.js
 */

import {
  createClient,
  getUserByUsername,
  searchTweets,
  getDataSource,
  isCrawleeMode,
  isAPIMode
} from './utils/twitter-hybrid-client.js';

async function testHybridClient() {
  console.log('🧪 Testing Twitter Hybrid Client\n');
  console.log(`📡 Data Source: ${getDataSource().toUpperCase()}`);
  console.log(`🤖 Crawlee Mode: ${isCrawleeMode()}`);
  console.log(`🔌 API Mode: ${isAPIMode()}\n`);
  console.log('='.repeat(60));

  // Create client (returns null for Crawlee mode)
  const client = createClient('readonly');

  if (client) {
    console.log('✅ API client created');
  } else {
    console.log('ℹ️  Crawlee mode - no API client needed');
  }

  // Test 1: Get user profile
  console.log('\n📋 Test 1: Get User Profile (@vitalikbuterin)');
  console.log('='.repeat(60));

  try {
    let profile;

    if (isCrawleeMode()) {
      // Crawlee mode: username only
      profile = await getUserByUsername('vitalikbuterin');
    } else {
      // API mode: client + username
      profile = await getUserByUsername(client, 'vitalikbuterin');
    }

    if (profile) {
      console.log('✅ Profile retrieved successfully:');
      console.log(`   Username: @${profile.username}`);
      console.log(`   Name: ${profile.name || 'N/A'}`);
      console.log(`   Followers: ${profile.public_metrics?.followers_count?.toLocaleString() || 'N/A'}`);
      console.log(`   Verified: ${profile.verified || false}`);
      console.log(`   Bio: ${(profile.description || '').substring(0, 80)}${profile.description?.length > 80 ? '...' : ''}`);
    } else {
      console.log('❌ Profile not found');
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }

  // Test 2: Search tweets
  console.log('\n📋 Test 2: Search Tweets (crypto)');
  console.log('='.repeat(60));

  try {
    let tweets;

    if (isCrawleeMode()) {
      // Crawlee mode: query + options
      tweets = await searchTweets('crypto', { maxResults: 5 });
    } else {
      // API mode: client + query + options
      const result = await searchTweets(client, 'crypto', { max_results: 5 });

      // Convert paginator to array
      tweets = [];
      for await (const tweet of result) {
        tweets.push(tweet);
        if (tweets.length >= 5) break;
      }
    }

    console.log(`✅ Found ${tweets.length} tweets:`);
    tweets.slice(0, 3).forEach((tweet, i) => {
      const text = (tweet.text || '').substring(0, 60).replace(/\n/g, ' ');
      console.log(`   ${i + 1}. ${text}${tweet.text?.length > 60 ? '...' : ''}`);
      console.log(`      Likes: ${tweet.public_metrics?.like_count || 0} | Retweets: ${tweet.public_metrics?.retweet_count || 0}`);
    });
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Hybrid client test complete!');
  console.log('='.repeat(60));

  // Exit cleanly
  process.exit(0);
}

// Run the test
testHybridClient().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
