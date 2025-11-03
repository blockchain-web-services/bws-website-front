import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testCredentials() {
  console.log('🔐 Testing OAuth credentials...\n');

  const apiKey = process.env.BWSXAI_TWITTER_API_KEY;
  const apiSecret = process.env.BWSXAI_TWITTER_API_SECRET;
  const accessToken = process.env.BWSXAI_TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.BWSXAI_TWITTER_ACCESS_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    console.error('❌ Missing credentials in .env file');
    console.log('Required variables:');
    console.log('  - BWSXAI_TWITTER_API_KEY:', apiKey ? '✅' : '❌');
    console.log('  - BWSXAI_TWITTER_API_SECRET:', apiSecret ? '✅' : '❌');
    console.log('  - BWSXAI_TWITTER_ACCESS_TOKEN:', accessToken ? '✅' : '❌');
    console.log('  - BWSXAI_TWITTER_ACCESS_SECRET:', accessSecret ? '✅' : '❌');
    process.exit(1);
  }

  console.log('✅ All credentials found in .env\n');

  const client = new TwitterApi({
    appKey: apiKey,
    appSecret: apiSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
  });

  try {
    // Post a test tweet
    console.log('📝 Posting test tweet...');
    const tweet = await client.v2.tweet('Test - credentials verification');

    console.log(`✅ Tweet posted successfully!`);
    console.log(`   Tweet ID: ${tweet.data.id}`);
    console.log(`   URL: https://twitter.com/BWSXAI/status/${tweet.data.id}\n`);

    // Wait a moment
    console.log('⏸️  Waiting 2 seconds before deletion...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Delete the test tweet
    console.log('🗑️  Deleting test tweet...');
    await client.v2.deleteTweet(tweet.data.id);

    console.log('✅ Tweet deleted successfully!\n');
    console.log('🎉 Credentials are working correctly!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) {
      console.error('   Error code:', error.code);
    }
    if (error.data) {
      console.error('   Error data:', JSON.stringify(error.data, null, 2));
    }
    process.exit(1);
  }
}

testCredentials();
