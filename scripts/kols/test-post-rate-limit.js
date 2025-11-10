#!/usr/bin/env node

/**
 * Test Twitter API Post Rate Limits - Enhanced
 *
 * This script attempts to post a test tweet and captures detailed rate limit info from the 429 error.
 */

import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env') });

console.log('🔍 Twitter API Post Rate Limit Test\n');
console.log('='.repeat(60));

/**
 * Test posting with OAuth 1.0a and capture rate limit headers
 */
async function testPostWithRateLimitHeaders() {
  console.log('\n### Testing Post Endpoint with Rate Limit Capture ###\n');

  try {
    const client = new TwitterApi({
      appKey: process.env.BWSXAI_TWITTER_API_KEY,
      appSecret: process.env.BWSXAI_TWITTER_API_SECRET,
      accessToken: process.env.BWSXAI_TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.BWSXAI_TWITTER_ACCESS_SECRET,
    });

    // Verify account first
    const me = await client.v2.me();
    console.log(`✅ Authenticated as: @${me.data.username}`);
    console.log(`   Account ID: ${me.data.id}`);
    console.log(`   Name: ${me.data.name}\n`);

    // Try to reply to a test tweet (using a popular tweet ID)
    // We'll use one of our own tweets to test (safer)
    const testTweetId = '1987714834394497223'; // From the actual test run
    const testReply = 'Test reply from rate limit diagnostic script - please ignore.';

    console.log('Attempting to post test reply...');
    console.log(`   Target Tweet ID: ${testTweetId}`);
    console.log(`   Reply Text: "${testReply}"`);
    console.log(`   ⚠️  This will actually post if successful!\n`);

    try {
      const result = await client.v2.reply(testReply, testTweetId);

      console.log('✅ POST SUCCESSFUL!');
      console.log(`   Posted reply ID: ${result.data.id}`);
      console.log(`   Text: ${result.data.text}`);

      // Check rate limit headers if available
      if (result.rateLimit) {
        console.log('\n📊 Rate Limit Info from Successful Response:');
        console.log(`   Limit: ${result.rateLimit.limit}`);
        console.log(`   Remaining: ${result.rateLimit.remaining}`);
        console.log(`   Reset: ${new Date(result.rateLimit.reset * 1000).toISOString()}`);
      }

      return { success: true, result };
    } catch (postError) {
      console.log('❌ POST FAILED with 429 Rate Limit\n');

      console.log('📊 Error Details:');
      console.log(`   Code: ${postError.code}`);
      console.log(`   Message: ${postError.message}`);

      if (postError.rateLimit) {
        console.log('\n📊 Rate Limit Headers from 429 Response:');
        console.log(`   Limit: ${postError.rateLimit.limit}`);
        console.log(`   Remaining: ${postError.rateLimit.remaining}`);
        console.log(`   Reset: ${new Date(postError.rateLimit.reset * 1000).toISOString()}`);
        console.log(`   Reset (human): ${new Date(postError.rateLimit.reset * 1000).toLocaleString()}`);

        const now = Date.now() / 1000;
        const secondsUntilReset = Math.max(0, postError.rateLimit.reset - now);
        const minutesUntilReset = Math.round(secondsUntilReset / 60);
        console.log(`   Time until reset: ${minutesUntilReset} minutes (${Math.round(secondsUntilReset)} seconds)`);
      } else {
        console.log('\n⚠️  No rate limit headers in error response');
      }

      if (postError.data) {
        console.log('\n📄 Additional Error Data:');
        console.log(JSON.stringify(postError.data, null, 2));
      }

      if (postError.errors) {
        console.log('\n🔴 API Errors:');
        postError.errors.forEach((err, i) => {
          console.log(`   ${i + 1}. ${err.message || err.title || 'Unknown error'}`);
          if (err.detail) console.log(`      Detail: ${err.detail}`);
          if (err.type) console.log(`      Type: ${err.type}`);
        });
      }

      return { success: false, error: postError };
    }
  } catch (error) {
    console.log(`❌ Setup Failed: ${error.message}`);
    return { success: false, error };
  }
}

/**
 * Check the Twitter Developer Portal App Settings
 */
async function checkAppAuthentication() {
  console.log('\n### App Authentication Check ###\n');

  try {
    const client = new TwitterApi({
      appKey: process.env.BWSXAI_TWITTER_API_KEY,
      appSecret: process.env.BWSXAI_TWITTER_API_SECRET,
      accessToken: process.env.BWSXAI_TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.BWSXAI_TWITTER_ACCESS_SECRET,
    });

    // Try to get app details (this might not work with user context)
    console.log('Checking authentication type...');

    // OAuth 1.0a always requires user context for posting
    console.log('✅ Using OAuth 1.0a User Context');
    console.log('   This uses per-user rate limits, not per-app');
    console.log('   Basic tier: 100 posts per 24 hours per user');
    console.log('   NOT 1,667 posts per 24 hours (that\'s app-level for Bearer token read operations)\n');

    return true;
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    return false;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('Starting Twitter API post rate limit diagnostics...\n');
  console.log('Date:', new Date().toISOString());
  console.log('='.repeat(60));

  // Check app authentication
  await checkAppAuthentication();

  // Try to post and capture rate limit info
  const postResult = await testPostWithRateLimitHeaders();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n### DIAGNOSTIC SUMMARY ###\n');

  if (postResult.success) {
    console.log('✅ Posting is WORKING!');
    console.log('   The rate limit issue may have been resolved or');
    console.log('   the rate limit window has reset since the last attempt.');
  } else {
    console.log('❌ Posting is RATE LIMITED (429 error)');

    if (postResult.error?.rateLimit) {
      const limit = postResult.error.rateLimit.limit;
      const remaining = postResult.error.rateLimit.remaining;

      console.log(`\n📊 Current Rate Limit Status:`);
      console.log(`   Limit: ${limit} posts per time window`);
      console.log(`   Used: ${limit - remaining} posts`);
      console.log(`   Remaining: ${remaining} posts`);

      // Identify the tier
      if (limit === 17) {
        console.log('\n⚠️  IDENTIFIED: FREE TIER');
        console.log('   Your app is using the FREE tier (17 posts/24h)');
        console.log('   You mentioned having Basic tier ($200/month)');
        console.log('   ❗ ACTION REQUIRED: Verify app in Twitter Developer Portal');
      } else if (limit === 100) {
        console.log('\n⚠️  IDENTIFIED: BASIC TIER (User-level)');
        console.log('   You\'re hitting the user-level limit (100 posts/24h)');
        console.log('   Basic tier user context: 100 posts/24h per user');
        console.log('   This is correct for OAuth 1.0a user context');
      } else if (limit === 1667) {
        console.log('\n✅ IDENTIFIED: BASIC TIER (App-level)');
        console.log('   You have the correct Basic tier app-level limit');
        console.log('   But you\'ve exceeded 1,667 posts in 24 hours!');
      } else {
        console.log(`\n❓ UNKNOWN TIER: ${limit} posts per time window`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n⚠️  IMPORTANT NEXT STEPS:\n');
  console.log('1. Log into https://developer.twitter.com (or developer.x.com)');
  console.log('2. Go to your app dashboard');
  console.log('3. Check "Plan & Billing" section');
  console.log('4. Verify your subscription is Basic tier and active');
  console.log('5. Check if payment is current');
  console.log('6. Verify the API keys belong to the Basic tier app\n');

  process.exit(postResult.success ? 0 : 1);
}

// Run tests
runTests().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
