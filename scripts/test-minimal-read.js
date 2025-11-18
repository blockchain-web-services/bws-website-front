import { createReadWriteClient } from './kols/utils/twitter-client.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * PHASE 2: Minimal Read Operation Test
 *
 * This script tests a single READ operation: fetching one tweet by ID.
 * No posting, no searches, no timeline fetching - just one tweet read.
 *
 * Purpose: Verify read operations work in CI environment
 */
async function testMinimalRead() {
  console.log('🔍 PHASE 2: Minimal Read Operation Test\n');
  console.log('='.repeat(70));

  // Environment detection
  const isCI = process.env.CI === 'true';
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
  const hasOxylabs = !!(process.env.OXYLABS_USERNAME && process.env.OXYLABS_PASSWORD);

  console.log('📋 Environment:');
  console.log(`   CI: ${isCI ? '✅ Yes' : '❌ No'}`);
  console.log(`   GitHub Actions: ${isGitHubActions ? '✅ Yes' : '❌ No'}`);
  console.log(`   Proxy: ${isCI && hasOxylabs ? '✅ Enabled' : '❌ Disabled'}`);
  console.log();

  try {
    // Step 1: Create client
    console.log('📡 Creating Twitter client...');
    const client = createReadWriteClient();
    console.log('   ✅ Client created\n');

    // Step 2: Authenticate
    console.log('🔐 Authenticating...');
    const me = await client.v2.me();
    console.log(`   ✅ Authenticated as @${me.data.username}\n`);

    // Step 3: Read a single tweet
    // Using a known tweet ID from @BWSXAI account or a popular tweet
    // We'll use the account's own latest tweet for testing
    console.log('📖 Step 3: Fetching user timeline (1 tweet)...');
    const startTime = Date.now();

    const timeline = await client.v2.userTimeline(me.data.id, {
      max_results: 1,
      'tweet.fields': ['created_at', 'public_metrics', 'author_id']
    });

    const duration = Date.now() - startTime;

    if (timeline.data && timeline.data.data && timeline.data.data.length > 0) {
      const tweet = timeline.data.data[0];
      console.log(`   ✅ Successfully fetched tweet (${duration}ms)\n`);

      console.log('📄 Tweet Details:');
      console.log(`   Tweet ID: ${tweet.id}`);
      console.log(`   Created: ${tweet.created_at || 'N/A'}`);
      console.log(`   Text: ${tweet.text.substring(0, 100)}${tweet.text.length > 100 ? '...' : ''}`);
      if (tweet.public_metrics) {
        console.log(`   Likes: ${tweet.public_metrics.like_count || 0}`);
        console.log(`   Retweets: ${tweet.public_metrics.retweet_count || 0}`);
      }
      console.log();
    } else {
      console.log('   ⚠️  No tweets found in timeline\n');
    }

    // Final summary
    console.log('='.repeat(70));
    console.log('✅ PHASE 2 TEST PASSED: Read Operation Successful');
    console.log('='.repeat(70));
    console.log();
    console.log('Summary:');
    console.log('  ✅ Client created');
    console.log('  ✅ Authentication successful');
    console.log('  ✅ Timeline read successful');
    console.log(`  ✅ Response time: ${duration}ms`);
    console.log();
    console.log(`Environment: ${isCI ? 'CI (with proxy)' : 'Local (direct connection)'}`);
    console.log();

  } catch (error) {
    console.error('\n❌ PHASE 2 TEST FAILED: Read Operation Error\n');
    console.error('='.repeat(70));
    console.error('Error Details:');
    console.error(`  Type: ${error.constructor.name}`);
    console.error(`  Code: ${error.code || error.status || 'unknown'}`);
    console.error(`  Message: ${error.message}`);
    console.error();

    if (error.data) {
      console.error('  API Response:');
      console.error(`  ${JSON.stringify(error.data, null, 2)}`);
      console.error();
    }

    console.error('='.repeat(70));
    console.error('Diagnostics:\n');

    if (error.code === 403) {
      console.error('🔴 403 FORBIDDEN:');
      console.error('   → OAuth app may lack read permissions (unlikely)');
      console.error('   → Account may be restricted');
      if (isCI && hasOxylabs) {
        console.error('   → Proxy may be blocking read operations');
      }
    } else if (error.code === 401) {
      console.error('🔴 401 UNAUTHORIZED:');
      console.error('   → Invalid credentials');
      console.error('   → Tokens may be expired');
    } else if (error.code === 429) {
      console.error('🔴 429 RATE LIMIT:');
      console.error('   → Too many requests');
      console.error('   → Wait 15 minutes');
    } else if (error.message?.includes('ECONNREFUSED') || error.message?.includes('ETIMEDOUT')) {
      console.error('🔴 NETWORK ERROR:');
      console.error('   → Cannot reach Twitter API');
      if (isCI && hasOxylabs) {
        console.error('   → Proxy connection issue');
      }
    }

    console.error();
    console.error(`Test failed in ${isCI ? 'CI' : 'local'} environment`);
    console.error();

    process.exit(1);
  }
}

// Run test
testMinimalRead().catch(error => {
  console.error('\n💥 Unhandled error in test:', error);
  process.exit(1);
});
