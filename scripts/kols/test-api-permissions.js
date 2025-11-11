import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

async function testPermissions() {
  console.log('🔍 Testing @BWSXAI API Permissions\n');
  
  const apiKey = process.env.BWSXAI_TWITTER_API_KEY;
  const apiSecret = process.env.BWSXAI_TWITTER_API_SECRET;
  const accessToken = process.env.BWSXAI_TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.BWSXAI_TWITTER_ACCESS_SECRET;
  
  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    console.error('❌ Missing credentials');
    process.exit(1);
  }
  
  console.log('✅ Credentials found');
  console.log('   API Key:', apiKey.substring(0, 10) + '...');
  console.log('   Access Token:', accessToken.substring(0, 10) + '...\n');
  
  const client = new TwitterApi({
    appKey: apiKey,
    appSecret: apiSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
  });
  
  try {
    // Test 1: Get current user (read access)
    console.log('📖 Test 1: Read Access - Get current user');
    const me = await client.v2.me();
    console.log(`   ✅ Read access works: @${me.data.username}`);
    console.log(`   Account ID: ${me.data.id}\n`);
    
    // Test 2: Check app permissions via account verification
    console.log('🔐 Test 2: Check OAuth App Permissions');
    try {
      // Try to get the app's rate limit status which requires authentication
      const limits = await client.v1.rateLimitStatuses();
      console.log('   ✅ OAuth authentication successful\n');
      
      // Check specific endpoint limits
      const tweetLimits = limits.resources?.statuses?.['/statuses/update'];
      if (tweetLimits) {
        console.log('   📊 Tweet Posting Limits:');
        console.log(`      Limit: ${tweetLimits.limit}`);
        console.log(`      Remaining: ${tweetLimits.remaining}`);
        console.log(`      Reset: ${new Date(tweetLimits.reset * 1000).toISOString()}\n`);
      }
    } catch (error) {
      console.log(`   ⚠️  Could not fetch rate limits: ${error.message}\n`);
    }
    
    // Test 3: Try to create a tweet (write access) - DRY RUN
    console.log('✍️  Test 3: Write Access - Attempt to post');
    console.log('   Testing with a minimal API call...');
    
    try {
      // Attempt to post a tweet (this will fail with 403 if no write permission)
      const testTweet = await client.v2.tweet('API permission test - please ignore');
      console.log('   ✅ WRITE ACCESS WORKS!');
      console.log(`   Tweet ID: ${testTweet.data.id}`);
      console.log('   ⚠️  Deleting test tweet...');
      
      // Delete the test tweet
      await client.v2.deleteTweet(testTweet.data.id);
      console.log('   ✅ Test tweet deleted\n');
    } catch (error) {
      if (error.code === 403) {
        console.log('   ❌ WRITE ACCESS DENIED (403 Forbidden)');
        console.log('   \n🔥 ROOT CAUSE: OAuth app does NOT have "Read and Write" permissions\n');
        console.log('   📝 TO FIX:');
        console.log('      1. Go to https://developer.twitter.com/en/portal/dashboard');
        console.log('      2. Select your app for @BWSXAI');
        console.log('      3. Go to "Settings" → "User authentication settings"');
        console.log('      4. Change permissions to "Read and Write"');
        console.log('      5. Regenerate Access Token & Secret');
        console.log('      6. Update GitHub secrets with new tokens\n');
      } else if (error.code === 429) {
        console.log('   ⚠️  Rate limited - cannot test write access');
        console.log(`   Current quota exhausted\n`);
      } else {
        console.log(`   ❌ Error: ${error.message}`);
        console.log(`   Code: ${error.code || 'unknown'}\n`);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 401) {
      console.error('\n🔥 Invalid credentials - tokens may be revoked or expired');
    }
  }
}

testPermissions();
