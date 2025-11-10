#!/usr/bin/env node

/**
 * Find Exact Rate Limit by Posting Until 429
 *
 * This script posts test replies rapidly until hitting the rate limit,
 * then captures the exact limit value from the 429 error.
 */

import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

console.log('🔍 Finding Exact Twitter API Rate Limit\n');
console.log('='.repeat(60));
console.log('⚠️  This will post multiple test replies until hitting 429');
console.log('='.repeat(60) + '\n');

async function findRateLimit() {
  const client = new TwitterApi({
    appKey: process.env.BWSXAI_TWITTER_API_KEY,
    appSecret: process.env.BWSXAI_TWITTER_API_SECRET,
    accessToken: process.env.BWSXAI_TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.BWSXAI_TWITTER_ACCESS_SECRET,
  });

  // Verify account
  const me = await client.v2.me();
  console.log(`✅ Authenticated as: @${me.data.username}\n`);

  // Use a test tweet ID (one of our own tweets from earlier test)
  const testTweetId = '1987714834394497223';

  let successCount = 0;
  let failedCount = 0;
  let rateLimitInfo = null;

  console.log('Starting rapid posting test...\n');

  for (let i = 1; i <= 25; i++) {
    const replyText = `Rate limit test ${i}/${25} - ${Date.now()}`;

    try {
      const result = await client.v2.reply(replyText, testTweetId);
      successCount++;
      console.log(`✅ Post ${i}: SUCCESS (ID: ${result.data.id})`);

      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      failedCount++;

      if (error.code === 429) {
        console.log(`\n❌ Post ${i}: RATE LIMITED (429)\n`);

        if (error.rateLimit) {
          rateLimitInfo = error.rateLimit;

          console.log('📊 RATE LIMIT DETAILS CAPTURED:\n');
          console.log(`   Limit: ${error.rateLimit.limit} posts per time window`);
          console.log(`   Remaining: ${error.rateLimit.remaining}`);
          console.log(`   Used: ${error.rateLimit.limit - error.rateLimit.remaining}`);
          console.log(`   Reset: ${new Date(error.rateLimit.reset * 1000).toISOString()}`);

          const now = Date.now() / 1000;
          const hoursUntilReset = ((error.rateLimit.reset - now) / 3600).toFixed(1);
          console.log(`   Reset in: ${hoursUntilReset} hours\n`);

          // Identify tier
          const limit = error.rateLimit.limit;
          if (limit === 17) {
            console.log('🔴 TIER IDENTIFIED: FREE TIER (17 posts/24h)');
            console.log('   ❌ Your API keys are from a FREE tier app, not Basic!');
            console.log('   ❌ You need to use API keys from your Basic tier app.');
          } else if (limit === 100) {
            console.log('🟡 TIER IDENTIFIED: BASIC TIER - User Level (100 posts/24h)');
            console.log('   ✅ Using OAuth 1.0a which has per-user limits');
            console.log('   ℹ️  This is correct for Basic tier OAuth 1.0a');
          } else if (limit >= 1000) {
            console.log('🟢 TIER IDENTIFIED: PRO or ENTERPRISE TIER');
          } else {
            console.log(`🟠 TIER IDENTIFIED: UNKNOWN (${limit} posts/24h)`);
          }
        } else {
          console.log('⚠️  No rate limit headers in 429 response');
        }

        // Stop after hitting rate limit
        break;
      } else {
        console.log(`❌ Post ${i}: FAILED (${error.message})`);
        // Continue on other errors
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 SUMMARY:\n');
  console.log(`   Successful posts in this test: ${successCount}`);
  console.log(`   Failed posts: ${failedCount}`);

  if (rateLimitInfo) {
    const used = rateLimitInfo.limit - rateLimitInfo.remaining;
    console.log(`\n   Total used today: ${used}/${rateLimitInfo.limit}`);
    console.log(`   Remaining today: ${rateLimitInfo.remaining}/${rateLimitInfo.limit}`);

    // Calculate how many MORE posts we made beyond the earlier ones
    const postsFromThisTest = successCount;
    const postsBeforeThisTest = used - postsFromThisTest;
    console.log(`\n   Posts before this test: ~${postsBeforeThisTest}`);
    console.log(`   Posts from this test: ${postsFromThisTest}`);
    console.log(`   Total posts today: ${used}`);

    if (rateLimitInfo.limit === 17) {
      console.log('\n❌ CRITICAL: You\'re on FREE TIER, not Basic tier!');
      console.log('   Solution: Use API keys from your $200/month Basic tier app');
    } else if (used >= rateLimitInfo.limit * 0.8) {
      console.log(`\n⚠️  WARNING: ${(used / rateLimitInfo.limit * 100).toFixed(0)}% of daily quota used`);
      console.log('   Consider reducing posting frequency');
    }
  } else {
    console.log('\n⚠️  Did not hit rate limit in this test');
  }

  console.log('\n' + '='.repeat(60));
}

findRateLimit().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
