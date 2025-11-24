/**
 * Test HTML fallback for search results
 * Tests multiple languages and query types
 */

import 'dotenv/config';
import { searchTweets } from './crawlers/twitter-crawler.js';
import fs from 'fs';

// Load account config
const config = JSON.parse(fs.readFileSync('./scripts/crawling/config/x-crawler-accounts.json', 'utf-8'));
const account = config.accounts[0];

const testQueries = [
  // English
  { query: 'bitcoin min_faves:100', lang: 'en', description: 'English - Bitcoin' },
  { query: 'crypto trading min_faves:50', lang: 'en', description: 'English - Crypto trading' },

  // Spanish
  { query: 'criptomonedas lang:es min_faves:50', lang: 'es', description: 'Spanish - Criptomonedas' },
  { query: 'bitcoin lang:es min_faves:30', lang: 'es', description: 'Spanish - Bitcoin' },

  // Portuguese
  { query: 'bitcoin lang:pt min_faves:30', lang: 'pt', description: 'Portuguese - Bitcoin' },

  // French
  { query: 'crypto lang:fr min_faves:30', lang: 'fr', description: 'French - Crypto' },
];

async function runTests() {
  console.log('🧪 Testing HTML fallback with multiple languages\n');
  console.log('=' .repeat(60));

  const results = [];

  for (const test of testQueries) {
    console.log(`\n📋 Test: ${test.description}`);
    console.log(`   Query: "${test.query}"`);

    try {
      const startTime = Date.now();
      const tweets = await searchTweets(test.query, {
        maxResults: 10,
        cookies: account.cookies,
        account: account
      });
      const duration = Date.now() - startTime;

      const result = {
        description: test.description,
        query: test.query,
        tweetsFound: tweets.length,
        duration: `${(duration / 1000).toFixed(1)}s`,
        success: tweets.length > 0,
        sampleAuthors: tweets.slice(0, 3).map(t => t.author?.username || 'unknown'),
        hasEngagement: tweets.some(t =>
          (t.public_metrics?.like_count > 0) ||
          (t.public_metrics?.retweet_count > 0)
        ),
        extractionMethods: [...new Set(tweets.map(t => t.extraction_method || 'GraphQL'))]
      };

      results.push(result);

      console.log(`   ✅ Found ${tweets.length} tweets in ${result.duration}`);
      console.log(`   📊 Extraction: ${result.extractionMethods.join(', ')}`);
      console.log(`   👤 Sample: @${result.sampleAuthors.join(', @')}`);

      if (tweets.length > 0) {
        const sample = tweets[0];
        console.log(`   💬 Text: "${sample.text?.substring(0, 60)}..."`);
        console.log(`   ❤️  Likes: ${sample.public_metrics?.like_count || 0}`);
      }

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      results.push({
        description: test.description,
        query: test.query,
        tweetsFound: 0,
        success: false,
        error: error.message
      });
    }

    // Small delay between tests
    await new Promise(r => setTimeout(r, 2000));
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY\n');

  const successCount = results.filter(r => r.success).length;
  const totalTweets = results.reduce((sum, r) => sum + (r.tweetsFound || 0), 0);

  console.log(`Tests passed: ${successCount}/${results.length}`);
  console.log(`Total tweets: ${totalTweets}`);

  console.log('\nResults by language:');
  results.forEach(r => {
    const status = r.success ? '✅' : '❌';
    console.log(`  ${status} ${r.description}: ${r.tweetsFound} tweets`);
  });

  // Check for HTML fallback usage
  const htmlFallbackUsed = results.some(r =>
    r.extractionMethods?.includes('HTML parsing')
  );

  console.log(`\nHTML fallback used: ${htmlFallbackUsed ? 'Yes' : 'No'}`);

  return results;
}

runTests()
  .then(() => {
    console.log('\n✅ Tests completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ Test suite failed:', err.message);
    process.exit(1);
  });
