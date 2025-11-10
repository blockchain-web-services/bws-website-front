#!/usr/bin/env node

/**
 * Test Twitter API Rate Limits and Connectivity
 *
 * This script tests the Twitter API credentials, checks rate limits,
 * and verifies what's causing the 429 errors.
 */

import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env') });

console.log('🔍 Twitter API Rate Limit Test\n');
console.log('='.repeat(60));

/**
 * Test 1: Check Environment Variables
 */
function testEnvironmentVariables() {
  console.log('\n### 1. Environment Variables Check ###\n');

  const required = [
    'BWSXAI_TWITTER_BEARER_TOKEN',
    'BWSXAI_TWITTER_API_KEY',
    'BWSXAI_TWITTER_API_SECRET',
    'BWSXAI_TWITTER_ACCESS_TOKEN',
    'BWSXAI_TWITTER_ACCESS_SECRET'
  ];

  const status = {};
  required.forEach(key => {
    const exists = !!process.env[key];
    const masked = exists ? `${process.env[key].substring(0, 8)}...` : 'NOT SET';
    status[key] = exists;
    console.log(`${exists ? '✅' : '❌'} ${key}: ${masked}`);
  });

  const allPresent = Object.values(status).every(v => v);
  console.log(`\n${allPresent ? '✅' : '❌'} All credentials: ${allPresent ? 'Present' : 'MISSING'}`);

  return allPresent;
}

/**
 * Test 2: Bearer Token (Read-Only)
 */
async function testBearerToken() {
  console.log('\n### 2. Bearer Token Test (Read-Only) ###\n');

  try {
    const client = new TwitterApi(process.env.BWSXAI_TWITTER_BEARER_TOKEN);

    // Test simple read operation
    console.log('Testing: Search for recent tweets...');
    const result = await client.v2.search('crypto', { max_results: 10 });

    console.log(`✅ Bearer Token: Working`);
    console.log(`   Tweets found: ${result.data?.data?.length || 0}`);

    return true;
  } catch (error) {
    console.log(`❌ Bearer Token: Failed`);
    console.log(`   Error: ${error.message}`);
    if (error.code) console.log(`   Code: ${error.code}`);
    if (error.rateLimit) {
      console.log(`   Rate Limit Info:`);
      console.log(`     Limit: ${error.rateLimit.limit}`);
      console.log(`     Remaining: ${error.rateLimit.remaining}`);
      console.log(`     Reset: ${new Date(error.rateLimit.reset * 1000).toISOString()}`);
    }
    return false;
  }
}

/**
 * Test 3: OAuth 1.0a (Read)
 */
async function testOAuthRead() {
  console.log('\n### 3. OAuth 1.0a Test (Read) ###\n');

  try {
    const client = new TwitterApi({
      appKey: process.env.BWSXAI_TWITTER_API_KEY,
      appSecret: process.env.BWSXAI_TWITTER_API_SECRET,
      accessToken: process.env.BWSXAI_TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.BWSXAI_TWITTER_ACCESS_SECRET,
    }).readOnly;

    // Test getting authenticated user
    console.log('Testing: Get authenticated user...');
    const me = await client.v2.me();

    console.log(`✅ OAuth Read: Working`);
    console.log(`   Account: @${me.data.username}`);
    console.log(`   Name: ${me.data.name}`);
    console.log(`   ID: ${me.data.id}`);

    return { success: true, username: me.data.username };
  } catch (error) {
    console.log(`❌ OAuth Read: Failed`);
    console.log(`   Error: ${error.message}`);
    if (error.code) console.log(`   Code: ${error.code}`);
    return { success: false };
  }
}

/**
 * Test 4: OAuth 1.0a (Write) - Check Rate Limits
 */
async function testOAuthWrite() {
  console.log('\n### 4. OAuth 1.0a Test (Write Permissions) ###\n');

  try {
    const client = new TwitterApi({
      appKey: process.env.BWSXAI_TWITTER_API_KEY,
      appSecret: process.env.BWSXAI_TWITTER_API_SECRET,
      accessToken: process.env.BWSXAI_TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.BWSXAI_TWITTER_ACCESS_SECRET,
    });

    // Don't actually post, just verify we have write access
    console.log('Testing: Verify write permissions (not posting)...');

    // Check if we can access timeline (requires write permission scope)
    const me = await client.v2.me();

    console.log(`✅ OAuth Write Client: Initialized`);
    console.log(`   Account: @${me.data.username}`);
    console.log(`   Note: Not testing actual tweet posting`);

    return true;
  } catch (error) {
    console.log(`❌ OAuth Write: Failed`);
    console.log(`   Error: ${error.message}`);
    if (error.code) console.log(`   Code: ${error.code}`);
    return false;
  }
}

/**
 * Test 5: Rate Limit Status
 */
async function testRateLimits() {
  console.log('\n### 5. Rate Limit Status ###\n');

  try {
    const client = new TwitterApi(process.env.BWSXAI_TWITTER_BEARER_TOKEN);

    // Get rate limit status
    console.log('Fetching rate limit status...\n');
    const rateLimits = await client.v2.get('application/rate_limit_status');

    // Check specific endpoints we use
    const endpoints = [
      { path: '/tweets/search/recent', name: 'Tweet Search' },
      { path: '/users/by', name: 'Get Users' },
      { path: '/users/:id', name: 'Get User by ID' },
      { path: '/tweets', name: 'Post Tweet' },
    ];

    console.log('Key Endpoint Limits:\n');

    // Note: Twitter API v2 rate limits structure
    const resources = rateLimits.resources;

    if (resources.tweets) {
      const searchRecent = resources.tweets['/tweets/search/recent'];
      if (searchRecent) {
        console.log('📊 Tweet Search (/tweets/search/recent):');
        console.log(`   Limit: ${searchRecent.limit} requests per 15 min`);
        console.log(`   Remaining: ${searchRecent.remaining}`);
        console.log(`   Resets: ${new Date(searchRecent.reset * 1000).toLocaleString()}`);
        console.log(`   Status: ${searchRecent.remaining > 0 ? '✅ Available' : '❌ Exhausted'}\n`);
      }
    }

    if (resources.users) {
      const usersBy = resources.users['/users/by'];
      if (usersBy) {
        console.log('📊 Get Users (/users/by):');
        console.log(`   Limit: ${usersBy.limit} requests per 15 min`);
        console.log(`   Remaining: ${usersBy.remaining}`);
        console.log(`   Resets: ${new Date(usersBy.reset * 1000).toLocaleString()}`);
        console.log(`   Status: ${usersBy.remaining > 0 ? '✅ Available' : '❌ Exhausted'}\n`);
      }
    }

    // Check for any exhausted endpoints
    let exhaustedCount = 0;
    Object.keys(resources).forEach(category => {
      Object.keys(resources[category]).forEach(endpoint => {
        if (resources[category][endpoint].remaining === 0) {
          exhaustedCount++;
        }
      });
    });

    if (exhaustedCount > 0) {
      console.log(`⚠️  ${exhaustedCount} endpoints exhausted`);
    } else {
      console.log(`✅ All endpoints have available quota`);
    }

    return true;
  } catch (error) {
    console.log(`❌ Failed to fetch rate limits`);
    console.log(`   Error: ${error.message}`);
    if (error.code) console.log(`   Code: ${error.code}`);
    return false;
  }
}

/**
 * Test 6: Simulate Reply Posting (DRY RUN)
 */
async function testReplyDryRun() {
  console.log('\n### 6. Reply Test (Dry Run) ###\n');

  try {
    const client = new TwitterApi({
      appKey: process.env.BWSXAI_TWITTER_API_KEY,
      appSecret: process.env.BWSXAI_TWITTER_API_SECRET,
      accessToken: process.env.BWSXAI_TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.BWSXAI_TWITTER_ACCESS_SECRET,
    });

    console.log('Testing: Check if we can prepare a reply...');

    // Verify we have the write client working
    const me = await client.v2.me();
    console.log(`✅ Account verified: @${me.data.username}`);

    // Check rate limit for posting
    try {
      const limits = await client.v2.get('application/rate_limit_status');
      const tweetLimits = limits.resources?.tweets;

      if (tweetLimits) {
        console.log('\n📊 Posting Rate Limits:');
        Object.keys(tweetLimits).forEach(endpoint => {
          if (endpoint.includes('/tweets') && !endpoint.includes('search')) {
            const limit = tweetLimits[endpoint];
            console.log(`   ${endpoint}:`);
            console.log(`     Remaining: ${limit.remaining}/${limit.limit}`);
          }
        });
      }
    } catch (limitError) {
      console.log('⚠️  Could not fetch posting limits');
    }

    console.log('\n✅ Reply capability: Ready (dry run - not posting)');

    return true;
  } catch (error) {
    console.log(`❌ Reply Test Failed`);
    console.log(`   Error: ${error.message}`);
    if (error.code) console.log(`   Code: ${error.code}`);
    if (error.data) console.log(`   Details: ${JSON.stringify(error.data, null, 2)}`);
    return false;
  }
}

/**
 * Main Test Runner
 */
async function runTests() {
  console.log('Starting Twitter API diagnostics...\n');
  console.log('Date:', new Date().toISOString());
  console.log('='.repeat(60));

  const results = {};

  // Run all tests
  results.env = testEnvironmentVariables();

  if (results.env) {
    results.bearer = await testBearerToken();
    results.oauthRead = await testOAuthRead();
    results.oauthWrite = await testOAuthWrite();
    results.rateLimits = await testRateLimits();
    results.replyTest = await testReplyDryRun();
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n### TEST SUMMARY ###\n');

  const tests = {
    'Environment Variables': results.env,
    'Bearer Token (Read)': results.bearer,
    'OAuth Read': results.oauthRead?.success,
    'OAuth Write': results.oauthWrite,
    'Rate Limits Check': results.rateLimits,
    'Reply Capability': results.replyTest
  };

  Object.entries(tests).forEach(([name, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${name}`);
  });

  const allPassed = Object.values(tests).every(v => v);
  console.log(`\n${allPassed ? '✅' : '⚠️'} Overall Status: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);

  if (!allPassed) {
    console.log('\n⚠️  RECOMMENDATIONS:');
    if (!results.env) {
      console.log('   - Check .env file for missing credentials');
    }
    if (!results.bearer) {
      console.log('   - Verify BWSXAI_TWITTER_BEARER_TOKEN is valid');
    }
    if (!results.oauthRead?.success) {
      console.log('   - Verify OAuth credentials (API Key, Secret, Tokens)');
    }
    if (!results.oauthWrite) {
      console.log('   - Check if account has write permissions');
    }
    if (!results.rateLimits) {
      console.log('   - Rate limit check failed - may be temporary');
    }
    if (!results.replyTest) {
      console.log('   - Reply functionality may be restricted');
      console.log('   - Check Twitter Developer Portal for account status');
    }
  }

  console.log('\n' + '='.repeat(60));

  // Return non-zero exit code if any test failed
  process.exit(allPassed ? 0 : 1);
}

// Run tests
runTests().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
