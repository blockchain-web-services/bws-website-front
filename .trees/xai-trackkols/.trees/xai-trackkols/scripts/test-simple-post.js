import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

async function testSimpleTweet() {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });

  try {
    const me = await client.v2.me();
    console.log(`✅ Authenticated as: @${me.data.username}`);

    // Test: Very simple tweet without emojis or hashtags
    console.log('\nTesting simple text post (no emojis, no hashtags)...');
    const tweet = await client.v2.tweet({
      text: 'BWS API test message.'
    });
    console.log(`✅ SUCCESS! Tweet posted!`);
    console.log(`   Tweet ID: ${tweet.data.id}`);
    console.log(`   URL: https://x.com/${me.data.username}/status/${tweet.data.id}`);

  } catch (error) {
    console.error('\n❌ Failed:');
    console.error(`   Error code: ${error.code || error.status}`);
    console.error(`   Error message: ${error.message}`);
    if (error.data) {
      console.error(`   Details: ${JSON.stringify(error.data, null, 2)}`);
    }
  }
}

testSimpleTweet();
