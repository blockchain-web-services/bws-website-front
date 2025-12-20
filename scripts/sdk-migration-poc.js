#!/usr/bin/env node

/**
 * SDK Migration Proof of Concept
 *
 * Demonstrates how to migrate from old crawler functions to new BWS X SDK v1.6.0
 * Shows side-by-side comparison of old vs new approaches
 */

import { XTwitterClient } from '@blockchain-web-services/bws-x-sdk-node';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('📚 BWS X SDK Migration Guide\n');
console.log('='.repeat(70));
console.log('\nThis demonstrates migrating from old crawler functions to SDK v1.6.0\n');

// =============================================================================
// OLD APPROACH (Before SDK)
// =============================================================================
console.log('📜 OLD APPROACH (Before SDK):');
console.log('-'.repeat(70));
console.log(`
// Import multiple separate modules
import { getUserTweetsWebUnblocker } from './crawlers/twitter-crawler.js';
import { searchTweetsWebUnblocker } from './crawlers/twitter-crawler.js';
import authManager from './utils/x-auth-manager.js';
import { TwitterApi } from 'twitter-api-v2';

// Configure separately for API
const apiClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET
});

// Get account from auth manager for crawler
const account = await authManager.getNextAvailableAccount();

// Call crawler function with account
const tweets = await getUserTweetsWebUnblocker('vitalikbuterin', {
  maxResults: 50,
  cookies: account.cookies,
  account
});

// Manual error handling and rate limit management
// Manual fallback between crawler and API
// Separate proxy configuration
`);

// =============================================================================
// NEW APPROACH (With SDK v1.6.0)
// =============================================================================
console.log('\n✨ NEW APPROACH (With SDK v1.6.0):');
console.log('-'.repeat(70));
console.log(`
// Single unified import
import { XTwitterClient } from '@blockchain-web-services/bws-x-sdk-node';

// Simple configuration (API-only mode for this example)
const client = new XTwitterClient({
  mode: 'api',  // or 'crawler' or 'hybrid'
  api: {
    accounts: [{
      name: 'BWSCommunity',
      apiKey: process.env.TWITTER_API_KEY,
      apiSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET
    }]
  },
  proxy: {
    provider: 'oxylabs',
    username: process.env.OXYLABS_USERNAME,
    password: process.env.OXYLABS_PASSWORD
  }
});

// Clean, simple API calls
const tweets = await client.getUserTweets('vitalikbuterin', {
  maxResults: 50,
  excludeReplies: true
});

// Built-in error handling, rate limiting, automatic fallback
// Unified interface for both crawler and API modes
`);

// =============================================================================
// MIGRATION EXAMPLES
// =============================================================================
console.log('\n📋 MIGRATION EXAMPLES:');
console.log('='.repeat(70));

console.log('\n1️⃣  Searching Tweets:');
console.log('-'.repeat(70));
console.log(`
BEFORE:
  import { searchTweetsWebUnblocker } from './crawlers/twitter-crawler.js';
  const tweets = await searchTweetsWebUnblocker('blockchain web3', 20);

AFTER:
  const tweets = await client.searchTweets('blockchain web3', {
    maxResults: 20,
    filter: 'latest'
  });
`);

console.log('\n2️⃣  Getting User Timeline:');
console.log('-'.repeat(70));
console.log(`
BEFORE:
  import { getUserTweetsWebUnblocker } from './crawlers/twitter-crawler.js';
  const account = await authManager.getNextAvailableAccount();
  const tweets = await getUserTweetsWebUnblocker('vitalikbuterin', {
    maxResults: 50,
    cookies: account.cookies,
    account
  });

AFTER:
  const tweets = await client.getUserTweets('vitalikbuterin', {
    maxResults: 50,
    excludeReplies: true,
    excludeRetweets: true
  });
`);

console.log('\n3️⃣  Getting Profile:');
console.log('-'.repeat(70));
console.log(`
BEFORE:
  import { getUserProfile } from './crawlers/twitter-crawler.js';
  await startCrawling();  // Start crawler
  const profile = await getUserProfile('vitalikbuterin');
  await teardownCrawler();  // Clean up

AFTER:
  const profile = await client.getProfile('vitalikbuterin');
  // No manual crawler management needed
`);

console.log('\n4️⃣  Posting Replies:');
console.log('-'.repeat(70));
console.log(`
BEFORE:
  import { TwitterApi } from 'twitter-api-v2';
  const apiClient = new TwitterApi({ /* credentials */ });
  const result = await apiClient.v2.reply('reply text', tweetId);

AFTER:
  const result = await client.postReply({
    tweetId: '1234567890',
    text: 'Great insights!',
    dryRun: false
  });
`);

// =============================================================================
// DATA STRUCTURE DIFFERENCES
// =============================================================================
console.log('\n📊 DATA STRUCTURE (Tweet):');
console.log('='.repeat(70));
console.log(`
SDK v1.6.0 returns clean, consistent structures:

Tweet {
  id: string;
  text: string;
  author: {
    username: string;
    name: string;
    verified: boolean;
    // ... full UserProfile
  };
  createdAt: Date;
  metrics: {
    likes: number;
    retweets: number;
    replies: number;
    quotes: number;
    views?: number;
  };
  entities?: { hashtags, mentions, urls, cashtags };
  _source: 'api' | 'crawler';  // Indicates data source
}

No more:
- Different field names between API and crawler
- Nested public_metrics vs metrics
- Manual timestamp parsing
- Inconsistent null handling
`);

// =============================================================================
// MIGRATION BENEFITS
// =============================================================================
console.log('\n🎯 MIGRATION BENEFITS:');
console.log('='.repeat(70));
console.log(`
✅ Single unified interface for all X/Twitter operations
✅ Automatic hybrid mode (crawler-first, API fallback)
✅ Built-in rate limit handling and retry logic
✅ Consistent data structures (API vs crawler normalized)
✅ Better error handling with typed errors
✅ Simplified configuration management
✅ No manual crawler lifecycle management
✅ Proxy support built-in
✅ TypeScript type definitions included
✅ Easier testing and mocking
`);

// =============================================================================
// MIGRATION CHECKLIST
// =============================================================================
console.log('\n📝 MIGRATION CHECKLIST:');
console.log('='.repeat(70));
console.log(`
For each script:

□ Install SDK: npm install @blockchain-web-services/bws-x-sdk-node@1.6.0
□ Replace imports:
  - Remove: twitter-crawler.js imports
  - Remove: x-auth-manager.js imports
  - Remove: twitter-api-v2 direct usage
  - Add: import { XTwitterClient } from '@blockchain-web-services/bws-x-sdk-node'

□ Initialize client once at script start
□ Replace function calls:
  - searchTweetsWebUnblocker() → client.searchTweets()
  - getUserTweetsWebUnblocker() → client.getUserTweets()
  - getUserProfile() → client.getProfile()
  - (direct API calls) → client.postReply()

□ Update data access:
  - tweet.public_metrics.like_count → tweet.metrics.likes
  - tweet.author_id → tweet.author.id
  - tweet.author_username → tweet.author.username

□ Remove manual crawler management:
  - Remove startCrawling() calls
  - Remove teardownCrawler() calls
  - Remove authManager.getNextAvailableAccount()

□ Test with small dataset first
□ Verify rate limit handling
□ Check error handling paths
`);

// =============================================================================
// RECOMMENDED MIGRATION ORDER
// =============================================================================
console.log('\n🎯 RECOMMENDED MIGRATION ORDER:');
console.log('='.repeat(70));
console.log(`
Priority 1 (Simple, low risk):
  1. fetch-twitter-partnerships.js - Uses getProfile() only
  2. test-bws-x-sdk.js - Already migrated ✅

Priority 2 (Core workflows):
  3. monitor-kol-timelines.js - Uses getUserTweets()
  4. reply-to-kol-posts.js - Uses getProfile() + postReply()

Priority 3 (Search-heavy):
  5. discover-product-tweets.js - Uses searchTweets()
  6. discover-by-engagement-crawlee.js - Uses searchTweets()
  7. evaluate-and-reply-kols.js - Uses searchTweets()

Priority 4 (Complex workflows):
  8. reply-to-product-tweets.js - Multiple methods
  9. post-article-content.js - Uses postReply()
`);

console.log('\n' + '='.repeat(70));
console.log('\n✅ Migration guide complete!\n');
console.log('Next step: Choose a Priority 1 or 2 script and migrate it.\n');
console.log('Run this guide anytime: node scripts/sdk-migration-poc.js\n');
