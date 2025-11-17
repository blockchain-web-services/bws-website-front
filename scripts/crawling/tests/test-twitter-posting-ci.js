import { createReadWriteClient } from './kols/utils/twitter-client.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Comprehensive Twitter posting test for CI environment
 * Tests the exact same setup used by actual workflows
 */
async function testTwitterPostingInCI() {
  console.log('🔍 Testing Twitter Posting in CI Environment\n');
  console.log('=' .repeat(60));

  // Check environment
  const isCI = process.env.CI === 'true';
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
  console.log(`Environment:`);
  console.log(`  CI: ${isCI ? '✅' : '❌'}`);
  console.log(`  GitHub Actions: ${isGitHubActions ? '✅' : '❌'}`);

  // Check proxy configuration
  const hasOxylabs = !!(process.env.OXYLABS_USERNAME && process.env.OXYLABS_PASSWORD);
  console.log(`  Oxylabs Proxy: ${hasOxylabs ? '✅ Available' : '❌ Not configured'}`);
  console.log();

  try {
    // Step 1: Create client (same as actual workflows)
    console.log('📡 Step 1: Creating Twitter client (with proxy support)...');
    const client = createReadWriteClient();
    console.log('   ✅ Client created\n');

    // Step 2: Verify authentication
    console.log('🔐 Step 2: Testing authentication...');
    const me = await client.v2.me();
    console.log(`   ✅ Authenticated as: @${me.data.username} (ID: ${me.data.id})`);
    console.log();

    // Step 3: Test posting (simple text)
    console.log('📤 Step 3: Testing tweet posting...');
    console.log('   Posting test tweet...');

    const testText = `CI Test ${new Date().toISOString().slice(0, 19).replace('T', ' ')} - Testing GitHub Actions environment`;

    const tweet = await client.v2.tweet(testText);

    console.log('   ✅ Tweet posted successfully!');
    console.log(`   Tweet ID: ${tweet.data.id}`);
    console.log(`   URL: https://twitter.com/i/web/status/${tweet.data.id}`);
    console.log();

    // Step 4: Clean up (delete test tweet)
    console.log('🧹 Step 4: Cleaning up test tweet...');
    await client.v2.deleteTweet(tweet.data.id);
    console.log('   ✅ Test tweet deleted\n');

    // Final summary
    console.log('=' .repeat(60));
    console.log('✅ ALL TESTS PASSED!');
    console.log('=' .repeat(60));
    console.log();
    console.log('Summary:');
    console.log('  ✅ Client creation with proxy support');
    console.log('  ✅ Authentication successful');
    console.log('  ✅ Tweet posting works');
    console.log('  ✅ Tweet deletion works');
    console.log();
    console.log('The Twitter posting mechanism is working correctly in this environment.');

  } catch (error) {
    console.error('\n❌ TEST FAILED\n');
    console.error('=' .repeat(60));
    console.error('Error Details:');
    console.error(`  Code: ${error.code || error.status || 'unknown'}`);
    console.error(`  Message: ${error.message}`);

    if (error.data) {
      console.error(`  API Response: ${JSON.stringify(error.data, null, 2)}`);
    }

    console.error('\n' + '=' .repeat(60));
    console.error('Diagnostics:\n');

    if (error.code === 403) {
      console.error('🔴 403 Forbidden Error - Possible causes:');
      console.error('   1. Account restrictions (suspended, read-only mode)');
      console.error('   2. OAuth app lacks "Read and Write" permissions');
      console.error('   3. Tokens may be for different account');
      console.error('   4. Duplicate content detection');
      console.error('   5. Rate limit reached (though should be 429)');
      console.error();
      console.error('   Action: Check @BWSXAI account status on Twitter');
      console.error('   Action: Verify OAuth app permissions in Twitter Developer Portal');
    } else if (error.code === 429) {
      console.error('🔴 429 Rate Limited:');
      console.error('   - Too many requests from this IP/account');
      console.error('   - Wait before retrying');
    } else if (error.code === 401) {
      console.error('🔴 401 Unauthorized:');
      console.error('   - Invalid credentials');
      console.error('   - Tokens may be revoked');
    } else if (error.message?.includes('ECONNREFUSED') || error.message?.includes('ETIMEDOUT')) {
      console.error('🔴 Network Error:');
      console.error('   - Cannot reach Twitter API');
      console.error('   - Proxy may be blocking connection');
      console.error('   - Check firewall rules');
    }

    console.error('=' .repeat(60));
    process.exit(1);
  }
}

// Run test
testTwitterPostingInCI().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
