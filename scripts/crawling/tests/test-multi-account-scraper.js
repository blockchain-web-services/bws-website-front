#!/usr/bin/env node
/**
 * Simple test script for multi-account scraper client
 * Tests initialization and basic search functionality
 */

import {
  initializeMultiAccountClient,
  getUserTweetsViaSearch,
  printMultiAccountUsageSummary
} from './kols/utils/multi-account-scraper-client.js';

async function testMultiAccountScraper() {
  console.log('🧪 Testing Multi-Account Scraper Client\n');
  console.log('=' .repeat(60));

  try {
    // Step 1: Initialize client
    console.log('\n📍 Step 1: Initializing multi-account client...\n');
    await initializeMultiAccountClient();
    console.log('\n✅ Client initialized successfully!');

    // Step 2: Test search operation
    console.log('\n' + '='.repeat(60));
    console.log('\n📍 Step 2: Testing tweet search...\n');
    console.log('   Searching for recent tweets from @elonmusk...');

    const tweets = await getUserTweetsViaSearch('elonmusk', 5);

    console.log(`\n✅ Search successful! Found ${tweets.length} tweets:`);
    tweets.slice(0, 3).forEach((tweet, i) => {
      console.log(`\n   ${i + 1}. ${tweet.text.substring(0, 80)}${tweet.text.length > 80 ? '...' : ''}`);
      console.log(`      Likes: ${tweet.public_metrics?.like_count || 0}, Retweets: ${tweet.public_metrics?.retweet_count || 0}`);
    });

    // Step 3: Show usage summary
    console.log('\n' + '='.repeat(60));
    console.log('\n📍 Step 3: Usage Summary\n');
    printMultiAccountUsageSummary();

    console.log('=' .repeat(60));
    console.log('\n✅ ALL TESTS PASSED!\n');
    console.log('The multi-account scraper client is working correctly.');
    console.log('Ready for production use.\n');

  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('\n❌ TEST FAILED\n');
    console.error('Error:', error.message);
    console.error('\nStack trace:', error.stack);
    console.error('\n' + '='.repeat(60));
    console.error('\nTroubleshooting:');
    console.error('1. Check that SEARCH1_USERNAME and SEARCH1_PASSWORD are set');
    console.error('2. Verify the account credentials are correct');
    console.error('3. Make sure the account is not suspended');
    console.error('4. Check if 2FA is enabled (may require additional setup)');
    console.error('\n');
    process.exit(1);
  }
}

// Run test
testMultiAccountScraper();
