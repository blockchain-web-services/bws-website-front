import { TwitterApi } from 'twitter-api-v2';
import { HttpsProxyAgent } from 'https-proxy-agent';
import dotenv from 'dotenv';

dotenv.config();

/**
 * PHASE 4: Proxy Isolation Test
 *
 * This script tests posting WITH and WITHOUT the Oxylabs proxy.
 * Purpose: Determine if proxy is causing 403 errors.
 *
 * Tests:
 * 1. Direct connection (no proxy) - post + delete
 * 2. Via Oxylabs proxy - post + delete
 * 3. Compare results
 */
async function testWithProxy(useProxy) {
  const apiKey = process.env.BWSXAI_TWITTER_API_KEY;
  const apiSecret = process.env.BWSXAI_TWITTER_API_SECRET;
  const accessToken = process.env.BWSXAI_TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.BWSXAI_TWITTER_ACCESS_SECRET;

  let proxyAgent = null;

  if (useProxy) {
    const oxylabsUsername = process.env.OXYLABS_USERNAME;
    const oxylabsPassword = process.env.OXYLABS_PASSWORD;

    if (!oxylabsUsername || !oxylabsPassword) {
      console.error('❌ Oxylabs credentials not found');
      return { success: false, error: 'Missing Oxylabs credentials' };
    }

    const sessionId = 'test-proxy-isolation';
    const proxyUrl = `http://customer-${oxylabsUsername}-sessid-${sessionId}:${oxylabsPassword}@pr.oxylabs.io:7777`;
    proxyAgent = new HttpsProxyAgent(proxyUrl);
  }

  const client = new TwitterApi({
    appKey: apiKey,
    appSecret: apiSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
  }, {
    agent: proxyAgent
  });

  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const testText = `🔬 Proxy Test ${timestamp} - ${useProxy ? 'WITH' : 'WITHOUT'} proxy`;

  try {
    // Authenticate
    const me = await client.v2.me();
    console.log(`   Authenticated as @${me.data.username}`);

    // Post tweet
    const postStartTime = Date.now();
    const tweet = await client.v2.tweet(testText);
    const postDuration = Date.now() - postStartTime;

    console.log(`   ✅ Posted successfully (${postDuration}ms)`);
    console.log(`   Tweet ID: ${tweet.data.id}`);

    // Delete tweet
    const deleteStartTime = Date.now();
    await client.v2.deleteTweet(tweet.data.id);
    const deleteDuration = Date.now() - deleteStartTime;

    console.log(`   ✅ Deleted successfully (${deleteDuration}ms)`);

    return {
      success: true,
      postDuration,
      deleteDuration,
      totalDuration: postDuration + deleteDuration,
      tweetId: tweet.data.id
    };

  } catch (error) {
    return {
      success: false,
      error: {
        code: error.code || error.status || 'unknown',
        message: error.message,
        data: error.data
      }
    };
  }
}

async function runProxyComparisonTest() {
  console.log('🔍 PHASE 4: Proxy Isolation Test\n');
  console.log('='.repeat(70));

  const isCI = process.env.CI === 'true';
  const hasOxylabs = !!(process.env.OXYLABS_USERNAME && process.env.OXYLABS_PASSWORD);

  console.log('📋 Environment:');
  console.log(`   CI: ${isCI ? '✅ Yes' : '❌ No'}`);
  console.log(`   Oxylabs Credentials: ${hasOxylabs ? '✅ Present' : '❌ Missing'}`);
  console.log();

  if (!hasOxylabs) {
    console.log('⚠️  Oxylabs credentials not found - can only test without proxy');
    console.log('   This test requires OXYLABS_USERNAME and OXYLABS_PASSWORD');
    console.log();
  }

  // Test 1: Without proxy
  console.log('🧪 Test 1: WITHOUT Proxy (Direct Connection)');
  console.log('-'.repeat(70));
  const withoutProxyResult = await testWithProxy(false);
  console.log();

  // Test 2: With proxy (if credentials available)
  let withProxyResult = null;
  if (hasOxylabs) {
    console.log('🧪 Test 2: WITH Proxy (Oxylabs)');
    console.log('-'.repeat(70));
    withProxyResult = await testWithProxy(true);
    console.log();
  }

  // Comparison
  console.log('='.repeat(70));
  console.log('📊 RESULTS COMPARISON');
  console.log('='.repeat(70));
  console.log();

  console.log('WITHOUT Proxy:');
  if (withoutProxyResult.success) {
    console.log(`  ✅ SUCCESS`);
    console.log(`  Post time: ${withoutProxyResult.postDuration}ms`);
    console.log(`  Delete time: ${withoutProxyResult.deleteDuration}ms`);
    console.log(`  Total: ${withoutProxyResult.totalDuration}ms`);
  } else {
    console.log(`  ❌ FAILED`);
    console.log(`  Error: ${withoutProxyResult.error.code} - ${withoutProxyResult.error.message}`);
  }
  console.log();

  if (hasOxylabs && withProxyResult) {
    console.log('WITH Proxy (Oxylabs):');
    if (withProxyResult.success) {
      console.log(`  ✅ SUCCESS`);
      console.log(`  Post time: ${withProxyResult.postDuration}ms`);
      console.log(`  Delete time: ${withProxyResult.deleteDuration}ms`);
      console.log(`  Total: ${withProxyResult.totalDuration}ms`);
    } else {
      console.log(`  ❌ FAILED`);
      console.log(`  Error: ${withProxyResult.error.code} - ${withProxyResult.error.message}`);
    }
    console.log();
  }

  // Analysis
  console.log('='.repeat(70));
  console.log('🔍 ANALYSIS');
  console.log('='.repeat(70));
  console.log();

  if (!hasOxylabs) {
    console.log('⚠️  Cannot compare - Oxylabs credentials missing');
    console.log();
    if (withoutProxyResult.success) {
      console.log('✅ Direct connection works - credentials are valid');
    } else {
      console.log('❌ Direct connection failed - credentials may be invalid');
    }
  } else {
    const directWorks = withoutProxyResult.success;
    const proxyWorks = withProxyResult.success;

    if (directWorks && proxyWorks) {
      console.log('✅ BOTH direct and proxy connections work!');
      console.log();
      console.log('   This means:');
      console.log('   → Credentials are valid');
      console.log('   → Proxy is configured correctly');
      console.log('   → Both connection methods work');
      console.log();
      console.log('   If workflows fail with 403, the issue is likely:');
      console.log('   → Specific to reply operations (not regular tweets)');
      console.log('   → Related to anti-spam measures');
      console.log('   → Rate limiting appearing as 403');
      console.log();

      // Performance comparison
      const speedDiff = Math.abs(withoutProxyResult.totalDuration - withProxyResult.totalDuration);
      const slower = withProxyResult.totalDuration > withoutProxyResult.totalDuration ? 'Proxy' : 'Direct';
      console.log(`   Performance: ${slower} is ${speedDiff}ms slower`);

    } else if (directWorks && !proxyWorks) {
      console.log('⚠️  DIRECT works but PROXY fails!');
      console.log();
      console.log('   🎯 ROOT CAUSE IDENTIFIED:');
      console.log('   → Oxylabs proxy is causing the 403 errors');
      console.log();
      console.log('   Possible reasons:');
      console.log('   1. Twitter blocks Oxylabs IPs');
      console.log('   2. Proxy credentials incorrect');
      console.log('   3. Proxy configuration issue');
      console.log();
      console.log(`   Proxy error: ${withProxyResult.error.code} - ${withProxyResult.error.message}`);
      console.log();
      console.log('   Recommended actions:');
      console.log('   → Test workflows without proxy');
      console.log('   → Contact Oxylabs support');
      console.log('   → Try different proxy provider');

    } else if (!directWorks && proxyWorks) {
      console.log('⚠️  PROXY works but DIRECT fails!');
      console.log();
      console.log('   This is unusual. Possible reasons:');
      console.log('   1. Local IP blocked by Twitter');
      console.log('   2. ISP blocking Twitter API');
      console.log('   3. Firewall rules');
      console.log();
      console.log(`   Direct error: ${withoutProxyResult.error.code} - ${withoutProxyResult.error.message}`);

    } else {
      console.log('❌ BOTH direct and proxy connections FAIL!');
      console.log();
      console.log('   🎯 ROOT CAUSE IDENTIFIED:');
      console.log('   → Credentials are invalid OR');
      console.log('   → Account is restricted OR');
      console.log('   → OAuth app lacks write permissions');
      console.log();
      console.log('   Direct error: ' + withoutProxyResult.error.code);
      console.log('   Proxy error: ' + withProxyResult.error.code);
      console.log();
      console.log('   Recommended actions:');
      console.log('   → Check @BWSXAI account status');
      console.log('   → Verify OAuth app permissions');
      console.log('   → Regenerate tokens');
    }
  }

  console.log();
  console.log('='.repeat(70));

  // Exit with appropriate code
  if (hasOxylabs) {
    if (withoutProxyResult.success && withProxyResult.success) {
      console.log('✅ PHASE 4 TEST PASSED');
      process.exit(0);
    } else {
      console.log('❌ PHASE 4 TEST FAILED');
      process.exit(1);
    }
  } else {
    if (withoutProxyResult.success) {
      console.log('✅ PHASE 4 TEST PASSED (direct only)');
      process.exit(0);
    } else {
      console.log('❌ PHASE 4 TEST FAILED');
      process.exit(1);
    }
  }
}

// Run test
runProxyComparisonTest().catch(error => {
  console.error('\n💥 Unhandled error in test:', error);
  process.exit(1);
});
