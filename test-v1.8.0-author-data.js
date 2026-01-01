/**
 * Test v1.8.0 Author Data Enrichment
 * Check if searchTweets() now returns populated author objects
 */
import dotenv from 'dotenv';
import { XTwitterClient } from '@blockchain-web-services/bws-x-sdk-node';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('🧪 Testing v1.8.0 Author Data in searchTweets()\n');

// Load crawler accounts
const crawlerConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'scripts/crawling/config/x-crawler-accounts.json'), 'utf-8')
);

const client = new XTwitterClient({
  mode: 'hybrid',
  crawler: {
    accounts: crawlerConfig.accounts.map(acc => ({
      id: acc.id,
      username: acc.username,
      cookies: acc.cookies,
      country: acc.country || 'us'
    }))
  },
  api: {
    accounts: [{
      name: 'BWSCommunity',
      apiKey: process.env.TWITTER_API_KEY,
      apiSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET
    }]
  },
  logging: { level: 'info' }
});

async function testAuthorEnrichment() {
  try {
    console.log('📍 Searching for blockchain tweets...\n');

    const tweets = await client.searchTweets(
      'blockchain education min_faves:5 lang:en -is:retweet',
      { maxResults: 5 }
    );

    console.log(`✅ Found ${tweets.length} tweets\n`);

    if (tweets.length === 0) {
      console.log('⚠️  No tweets found to test');
      return;
    }

    // Test first tweet's author data
    const tweet = tweets[0];

    console.log('🔍 Checking author data in first tweet:\n');
    console.log('Tweet ID:', tweet.id);
    console.log('Tweet text:', tweet.text?.substring(0, 100));
    console.log('\n📊 Author Data:');
    console.log('  - author object exists:', !!tweet.author);
    console.log('  - author.username:', tweet.author?.username || '(empty)');
    console.log('  - author.name:', tweet.author?.name || '(empty)');
    console.log('  - author.bio:', tweet.author?.bio?.substring(0, 50) || '(empty)');
    console.log('  - author.followers:', tweet.author?.followers || 0);
    console.log('  - author.verified:', tweet.author?.verified || false);
    console.log('  - author._source:', tweet.author?._source || '(none)');

    console.log('\n' + '='.repeat(60));

    if (tweet.author?.username && tweet.author.username.length > 0) {
      console.log('✅ SUCCESS: v1.8.0 returns populated author data!');
      console.log('   No manual enrichment needed - SDK does it automatically!');
    } else {
      console.log('❌ NOTICE: Author username still empty');
      console.log('   Manual enrichment still required');
    }

    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAuthorEnrichment();
