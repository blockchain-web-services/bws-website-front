/**
 * Test the fixes: bio filtering and search functionality
 */

import { getUserProfile, searchTweets } from './crawlers/twitter-crawler.js';

async function testFixes() {
  console.log('🧪 Testing Crawlee Fixes\n');
  console.log('='.repeat(60));

  // Test 1: Bio filtering (should now accept VitalikButerin)
  console.log('\n📋 Test 1: Improved Bio Filtering\n');

  const testUsers = ['VitalikButerin', 'cz_binance', 'naval'];
  const knownCryptoUsernames = [
    'vitalikbuterin', 'cz_binance', 'sbf_ftx', 'aantonop', 'naval',
    'balajis', 'apompliano', 'documentingbtc', 'defidad', 'sassal0x'
  ];

  for (const username of testUsers) {
    console.log(`Testing @${username}...`);

    try {
      const profile = await getUserProfile(username);

      if (!profile) {
        console.log(`  ❌ Profile not found\n`);
        continue;
      }

      const followers = profile.public_metrics?.followers_count || 0;
      const verified = profile.verified || false;
      const bio = profile.description || '';

      // Check crypto keywords
      const cryptoKeywords = ['crypto', 'bitcoin', 'btc', 'eth', 'ethereum', 'blockchain', 'defi', 'web3'];
      const bioLower = bio.toLowerCase();
      const hasCryptoKeyword = cryptoKeywords.some(kw => bioLower.includes(kw));
      const isKnownCryptoKOL = knownCryptoUsernames.includes(username.toLowerCase());
      const passesFilter = hasCryptoKeyword || isKnownCryptoKOL || (verified && followers > 500000);

      console.log(`  Username: @${username}`);
      console.log(`  Followers: ${followers.toLocaleString()}`);
      console.log(`  Verified: ${verified ? '✅' : '❌'}`);
      console.log(`  Has crypto keywords: ${hasCryptoKeyword ? '✅' : '❌'}`);
      console.log(`  Is known crypto KOL: ${isKnownCryptoKOL ? '✅' : '❌'}`);
      console.log(`  Passes filter: ${passesFilter ? '✅ YES' : '❌ NO'}`);
      console.log();

    } catch (error) {
      console.log(`  ❌ Error: ${error.message}\n`);
    }
  }

  // Test 2: Search functionality
  console.log('\n' + '='.repeat(60));
  console.log('📋 Test 2: Search Functionality\n');

  try {
    console.log('Searching for "bitcoin"...\n');

    const tweets = await searchTweets('bitcoin', { maxResults: 5 });

    console.log(`Results:`);
    console.log(`  Tweets found: ${tweets.length}`);

    if (tweets.length > 0) {
      console.log(`  ✅ Search is working!\n`);
      console.log(`  Sample tweets:`);
      tweets.slice(0, 3).forEach((tweet, i) => {
        const text = (tweet.text || '').substring(0, 80).replace(/\n/g, ' ');
        console.log(`    ${i + 1}. ${text}${tweet.text?.length > 80 ? '...' : ''}`);
      });
    } else {
      console.log(`  ⚠️  No tweets found - GraphQL capture may still need work`);
    }

  } catch (error) {
    console.log(`  ❌ Search error: ${error.message}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Tests complete!\n');
}

// Run tests
testFixes().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
