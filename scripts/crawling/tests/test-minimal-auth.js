import { createReadWriteClient } from './kols/utils/twitter-client.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * PHASE 1: Minimal Authentication Test
 *
 * This script ONLY verifies authentication by calling client.v2.me()
 * No posting, no reading tweets, no searches - just auth verification.
 *
 * Purpose: Isolate whether credentials work in CI environment
 */
async function testMinimalAuth() {
  console.log('🔍 PHASE 1: Minimal Authentication Test\n');
  console.log('='.repeat(70));

  // Step 1: Environment detection
  const isCI = process.env.CI === 'true';
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
  const hasOxylabs = !!(process.env.OXYLABS_USERNAME && process.env.OXYLABS_PASSWORD);

  console.log('📋 Environment Information:');
  console.log(`   CI: ${isCI ? '✅ Yes' : '❌ No'}`);
  console.log(`   GitHub Actions: ${isGitHubActions ? '✅ Yes' : '❌ No'}`);
  console.log(`   Oxylabs Credentials: ${hasOxylabs ? '✅ Present' : '❌ Missing'}`);
  console.log(`   Expected Proxy: ${isCI && hasOxylabs ? '✅ Enabled (automatic)' : '❌ Disabled (local)'}`);
  console.log();

  // Step 2: Credential presence check
  const hasApiKey = !!process.env.BWSXAI_TWITTER_API_KEY;
  const hasApiSecret = !!process.env.BWSXAI_TWITTER_API_SECRET;
  const hasAccessToken = !!process.env.BWSXAI_TWITTER_ACCESS_TOKEN;
  const hasAccessSecret = !!process.env.BWSXAI_TWITTER_ACCESS_SECRET;

  console.log('🔑 Twitter Credentials Check:');
  console.log(`   BWSXAI_TWITTER_API_KEY: ${hasApiKey ? '✅ Present' : '❌ Missing'}`);
  console.log(`   BWSXAI_TWITTER_API_SECRET: ${hasApiSecret ? '✅ Present' : '❌ Missing'}`);
  console.log(`   BWSXAI_TWITTER_ACCESS_TOKEN: ${hasAccessToken ? '✅ Present' : '❌ Missing'}`);
  console.log(`   BWSXAI_TWITTER_ACCESS_SECRET: ${hasAccessSecret ? '✅ Present' : '❌ Missing'}`);
  console.log();

  if (!hasApiKey || !hasApiSecret || !hasAccessToken || !hasAccessSecret) {
    console.error('❌ ABORT: Missing required Twitter credentials\n');
    process.exit(1);
  }

  try {
    // Step 3: Create client (same as failing workflows)
    console.log('📡 Creating Twitter client...');
    console.log('   Using: createReadWriteClient() (exact same as workflows)');
    const client = createReadWriteClient();
    console.log('   ✅ Client object created successfully\n');

    // Step 4: Test authentication (ONLY API call)
    console.log('🔐 Testing authentication with client.v2.me()...');
    const startTime = Date.now();

    const me = await client.v2.me();

    const duration = Date.now() - startTime;
    console.log(`   ✅ Authentication successful! (${duration}ms)\n`);

    // Step 5: Display results
    console.log('👤 Account Information:');
    console.log(`   Username: @${me.data.username}`);
    console.log(`   User ID: ${me.data.id}`);
    console.log(`   Name: ${me.data.name || 'N/A'}`);
    console.log();

    // Final summary
    console.log('='.repeat(70));
    console.log('✅ PHASE 1 TEST PASSED: Authentication Successful');
    console.log('='.repeat(70));
    console.log();
    console.log('Summary:');
    console.log('  ✅ Environment detected correctly');
    console.log('  ✅ Credentials present');
    console.log('  ✅ Client created successfully');
    console.log('  ✅ Authentication successful');
    console.log(`  ✅ Connected to account: @${me.data.username}`);
    console.log();
    console.log(`Environment: ${isCI ? 'CI (with proxy)' : 'Local (direct connection)'}`);
    console.log(`Response time: ${duration}ms`);
    console.log();

  } catch (error) {
    console.error('\n❌ PHASE 1 TEST FAILED: Authentication Error\n');
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
      console.error('🔴 403 FORBIDDEN ERROR:');
      console.error('   Possible causes:');
      console.error('   1. OAuth app lacks "Read and Write" permissions');
      console.error('   2. Account suspended or in read-only mode');
      console.error('   3. Tokens revoked or expired');
      console.error('   4. IP address blocked (proxy issue on CI)');
      console.error('   5. Credentials belong to different account');
      console.error();
      console.error('   Recommended actions:');
      console.error('   → Check @BWSXAI account status on Twitter');
      console.error('   → Verify OAuth app permissions in Twitter Developer Portal');
      console.error('   → Confirm tokens match the intended account');
      if (isCI && hasOxylabs) {
        console.error('   → Test without proxy to isolate proxy-related issues');
      }
    } else if (error.code === 401) {
      console.error('🔴 401 UNAUTHORIZED ERROR:');
      console.error('   → Credentials are invalid or revoked');
      console.error('   → Check GitHub Secrets match local .env values');
      console.error('   → Regenerate tokens in Twitter Developer Portal');
    } else if (error.code === 429) {
      console.error('🔴 429 RATE LIMIT ERROR:');
      console.error('   → Too many requests from this IP/account');
      console.error('   → Wait 15 minutes before retrying');
    } else if (error.message?.includes('ECONNREFUSED') || error.message?.includes('ETIMEDOUT')) {
      console.error('🔴 NETWORK ERROR:');
      console.error('   → Cannot reach Twitter API');
      if (isCI && hasOxylabs) {
        console.error('   → Proxy may be blocking connection');
        console.error('   → Verify Oxylabs credentials');
      } else {
        console.error('   → Check internet connection');
        console.error('   → Verify firewall rules');
      }
    } else {
      console.error('🔴 UNKNOWN ERROR:');
      console.error('   → Review error details above');
      console.error('   → Check network logs');
    }

    console.error();
    console.error('='.repeat(70));
    console.error();
    console.error(`Test failed in ${isCI ? 'CI' : 'local'} environment`);
    console.error(`Proxy: ${isCI && hasOxylabs ? 'Enabled (Oxylabs)' : 'Disabled'}`);
    console.error();

    process.exit(1);
  }
}

// Run test
testMinimalAuth().catch(error => {
  console.error('\n💥 Unhandled error in test:', error);
  process.exit(1);
});
