/**
 * Test script for Crawlee Twitter crawler
 * Run with: CRAWLEE_HEADLESS=false node scripts/kols/test-crawlee.js
 */

import { getUserProfile, searchTweets, getUserFollowing, getUserTweets } from './crawlers/twitter-crawler.js';

async function testGetUserProfile() {
  console.log('\n📋 Testing getUserProfile()...\n');

  try {
    const profile = await getUserProfile('elonmusk');

    if (profile) {
      console.log('✅ Profile retrieved successfully:');
      console.log(JSON.stringify(profile, null, 2));
      return true;
    } else {
      console.log('❌ Profile retrieval returned null');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function testSearchTweets() {
  console.log('\n📋 Testing searchTweets()...\n');

  try {
    const tweets = await searchTweets('crypto', { maxResults: 10 });

    if (tweets && tweets.length > 0) {
      console.log(`✅ Retrieved ${tweets.length} tweets:`);
      console.log(JSON.stringify(tweets.slice(0, 2), null, 2)); // Show first 2
      return true;
    } else {
      console.log('❌ Search returned no tweets');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function testGetUserFollowing() {
  console.log('\n📋 Testing getUserFollowing()...\n');

  try {
    const following = await getUserFollowing('elonmusk', 20);

    if (following && following.length > 0) {
      console.log(`✅ Retrieved ${following.length} following users:`);
      console.log(JSON.stringify(following.slice(0, 2), null, 2)); // Show first 2
      return true;
    } else {
      console.log('❌ Following list returned empty');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function testGetUserTweets() {
  console.log('\n📋 Testing getUserTweets()...\n');

  try {
    const tweets = await getUserTweets('elonmusk', { maxResults: 10 });

    if (tweets && tweets.length > 0) {
      console.log(`✅ Retrieved ${tweets.length} tweets:`);
      console.log(JSON.stringify(tweets.slice(0, 2), null, 2)); // Show first 2
      return true;
    } else {
      console.log('❌ Tweets retrieval returned empty');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Crawlee Twitter Crawler Tests\n');
  console.log('💡 Tip: Run with CRAWLEE_HEADLESS=false to see browser\n');

  const results = {
    getUserProfile: false,
    searchTweets: false,
    getUserFollowing: false,
    getUserTweets: false,
  };

  // Test each function
  results.getUserProfile = await testGetUserProfile();

  // Only run other tests if first one passes
  if (results.getUserProfile) {
    results.searchTweets = await testSearchTweets();
    results.getUserFollowing = await testGetUserFollowing();
    results.getUserTweets = await testGetUserTweets();
  } else {
    console.log('\n⚠️ Skipping other tests due to getUserProfile failure\n');
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Results Summary');
  console.log('='.repeat(60));

  for (const [test, passed] of Object.entries(results)) {
    const icon = passed ? '✅' : '❌';
    console.log(`${icon} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
  }

  const passCount = Object.values(results).filter(r => r).length;
  const totalCount = Object.keys(results).length;

  console.log('='.repeat(60));
  console.log(`\n🎯 Overall: ${passCount}/${totalCount} tests passed\n`);

  process.exit(passCount === totalCount ? 0 : 1);
}

// Run tests
runTests().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
