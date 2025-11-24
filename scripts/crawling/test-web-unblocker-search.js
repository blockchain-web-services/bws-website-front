/**
 * Test Web Unblocker search implementation
 * Tests the searchTweetsWebUnblocker function with debug output
 */

import 'dotenv/config';
import { searchTweetsWebUnblocker } from './crawlers/twitter-crawler.js';
import fs from 'fs';

// Load account config
const config = JSON.parse(fs.readFileSync('./scripts/crawling/config/x-crawler-accounts.json', 'utf-8'));
const account = config.accounts[0];

const testQueries = [
  { query: 'bitcoin min_faves:100', description: 'Bitcoin high engagement' },
  { query: 'crypto trading min_faves:50', description: 'Crypto trading' },
];

async function runTests() {
  console.log('🧪 Testing Web Unblocker search implementation\n');
  console.log('=' .repeat(60));

  for (const test of testQueries) {
    console.log(`\n📋 Test: ${test.description}`);
    console.log(`   Query: "${test.query}"`);

    try {
      const startTime = Date.now();
      const tweets = await searchTweetsWebUnblocker(test.query, {
        maxResults: 10,
        cookies: account.cookies,
        account: account
      });
      const duration = Date.now() - startTime;

      console.log(`\n   ✅ Found ${tweets.length} tweets in ${(duration / 1000).toFixed(1)}s`);

      if (tweets.length > 0) {
        console.log(`\n   📊 Sample tweets:`);
        tweets.slice(0, 3).forEach((tweet, i) => {
          console.log(`      ${i + 1}. @${tweet.author?.username}`);
          console.log(`         Text: "${tweet.text?.substring(0, 60)}..."`);
          console.log(`         Likes: ${tweet.public_metrics?.like_count || 0}`);
        });
      }

    } catch (error) {
      console.log(`\n   ❌ Error: ${error.message}`);
      console.error(error.stack);
    }

    // Delay between tests
    console.log('\n   ⏳ Waiting 5 seconds before next test...');
    await new Promise(r => setTimeout(r, 5000));
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Tests completed');
}

runTests()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ Test suite failed:', err.message);
    console.error(err.stack);
    process.exit(1);
  });
