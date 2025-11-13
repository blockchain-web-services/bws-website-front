import { createReadWriteClient } from './kols/utils/twitter-client.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * PHASE 3: Minimal Write Operation Test
 *
 * This script tests WRITE operations: posting and deleting a single tweet.
 * This is the CRITICAL test - workflows are failing with 403 on posting.
 *
 * Purpose: Verify write permissions work in CI environment
 */
async function testMinimalWrite() {
  console.log('🔍 PHASE 3: Minimal Write Operation Test\n');
  console.log('='.repeat(70));

  // Environment detection
  const isCI = process.env.CI === 'true';
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
  const hasOxylabs = !!(process.env.OXYLABS_USERNAME && process.env.OXYLABS_PASSWORD);

  console.log('📋 Environment:');
  console.log(`   CI: ${isCI ? '✅ Yes' : '❌ No'}`);
  console.log(`   GitHub Actions: ${isGitHubActions ? '✅ Yes' : '❌ No'}`);
  console.log(`   Proxy: ${isCI && hasOxylabs ? '✅ Enabled (Oxylabs)' : '❌ Disabled'}`);
  console.log();

  let tweetId = null;

  try {
    // Step 1: Create client
    console.log('📡 Creating Twitter client...');
    const client = createReadWriteClient();
    console.log('   ✅ Client created\n');

    // Step 2: Authenticate
    console.log('🔐 Authenticating...');
    const me = await client.v2.me();
    console.log(`   ✅ Authenticated as @${me.data.username}\n`);

    // Step 3: POST a test tweet
    console.log('📤 Step 3: Posting test tweet...');
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const testText = `🧪 Write Test ${timestamp} - ${isCI ? 'CI' : 'Local'} environment`;

    console.log(`   Text: "${testText}"`);

    const postStartTime = Date.now();
    const tweet = await client.v2.tweet(testText);
    const postDuration = Date.now() - postStartTime;

    tweetId = tweet.data.id;

    console.log(`   ✅ Tweet posted successfully! (${postDuration}ms)`);
    console.log(`   Tweet ID: ${tweetId}`);
    console.log(`   URL: https://twitter.com/i/web/status/${tweetId}\n`);

    // Step 4: DELETE the test tweet
    console.log('🗑️  Step 4: Deleting test tweet...');
    const deleteStartTime = Date.now();
    const deleteResult = await client.v2.deleteTweet(tweetId);
    const deleteDuration = Date.now() - deleteStartTime;

    if (deleteResult.data.deleted) {
      console.log(`   ✅ Tweet deleted successfully! (${deleteDuration}ms)\n`);
    } else {
      console.log(`   ⚠️  Delete returned false (${deleteDuration}ms)\n`);
    }

    // Final summary
    console.log('='.repeat(70));
    console.log('✅ PHASE 3 TEST PASSED: Write Operations Successful');
    console.log('='.repeat(70));
    console.log();
    console.log('Summary:');
    console.log('  ✅ Client created');
    console.log('  ✅ Authentication successful');
    console.log('  ✅ Tweet posting successful');
    console.log('  ✅ Tweet deletion successful');
    console.log();
    console.log('Performance:');
    console.log(`  Post time: ${postDuration}ms`);
    console.log(`  Delete time: ${deleteDuration}ms`);
    console.log(`  Total: ${postDuration + deleteDuration}ms`);
    console.log();
    console.log(`Environment: ${isCI ? 'CI (with proxy)' : 'Local (direct connection)'}`);
    console.log();

    // CRITICAL: This test passing means write permissions are working!
    console.log('🎯 CRITICAL FINDING:');
    console.log('   If this test passes, write permissions ARE working.');
    console.log('   If workflows still fail with 403, the issue is likely:');
    console.log('   - Specific to reply operations (not regular tweets)');
    console.log('   - Related to tweet interaction (like/follow before reply)');
    console.log('   - Rate limiting appearing as 403 instead of 429');
    console.log('   - Content filtering (spam detection)');
    console.log();

  } catch (error) {
    console.error('\n❌ PHASE 3 TEST FAILED: Write Operation Error\n');
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

    if (error.errors && Array.isArray(error.errors)) {
      console.error('  Twitter API Errors:');
      error.errors.forEach((err, i) => {
        console.error(`    ${i + 1}. ${err.message || JSON.stringify(err)}`);
      });
      console.error();
    }

    console.error('='.repeat(70));
    console.error('Diagnostics:\n');

    if (error.code === 403) {
      console.error('🔴 403 FORBIDDEN ERROR - CRITICAL:');
      console.error();
      console.error('   This is the SAME error as workflows are experiencing!');
      console.error();
      console.error('   Possible causes:');
      console.error('   1. OAuth app lacks "Read and Write" permissions');
      console.error('      → Check Twitter Developer Portal');
      console.error('      → App permissions page');
      console.error('      → Must be "Read and Write" or "Read, Write, and Direct Messages"');
      console.error();
      console.error('   2. Account suspended or in read-only mode');
      console.error('      → Check @BWSXAI account status on Twitter');
      console.error('      → Look for any warnings or restrictions');
      console.error();
      console.error('   3. Tokens regenerated but GitHub Secrets not updated');
      console.error('      → Verify tokens in GitHub Secrets match developer portal');
      console.error();
      if (isCI && hasOxylabs) {
        console.error('   4. Proxy blocking write operations');
        console.error('      → Test without proxy (run locally)');
        console.error('      → Check Oxylabs dashboard for blocks');
        console.error();
      }
      console.error('   5. IP/Account rate limits showing as 403 instead of 429');
      console.error('      → Wait 15 minutes and retry');
      console.error();
      console.error('   6. Credentials belong to different account');
      console.error('      → Verify ACCESS_TOKEN/SECRET match API_KEY/SECRET');
      console.error();
    } else if (error.code === 401) {
      console.error('🔴 401 UNAUTHORIZED:');
      console.error('   → Invalid credentials or revoked tokens');
      console.error('   → Regenerate tokens in Twitter Developer Portal');
    } else if (error.code === 429) {
      console.error('🔴 429 RATE LIMIT:');
      console.error('   → Too many requests');
      console.error('   → This is expected behavior, not an error');
      console.error('   → Wait 15 minutes');
    } else if (error.message?.includes('ECONNREFUSED') || error.message?.includes('ETIMEDOUT')) {
      console.error('🔴 NETWORK ERROR:');
      console.error('   → Cannot reach Twitter API');
      if (isCI && hasOxylabs) {
        console.error('   → Proxy connection issue');
        console.error('   → Verify Oxylabs credentials');
      }
    } else {
      console.error('🔴 UNKNOWN ERROR:');
      console.error('   → Review error details above');
    }

    console.error();
    console.error(`Test failed in ${isCI ? 'CI' : 'local'} environment`);
    console.error();

    // If tweet was posted but deletion failed, try to clean up
    if (tweetId) {
      console.error(`⚠️  Tweet ${tweetId} was posted but may not have been deleted`);
      console.error(`   Manual cleanup: https://twitter.com/i/web/status/${tweetId}`);
      console.error();
    }

    process.exit(1);
  }
}

// Run test
testMinimalWrite().catch(error => {
  console.error('\n💥 Unhandled error in test:', error);
  process.exit(1);
});
