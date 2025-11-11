import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { TwitterApi } from 'twitter-api-v2';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

async function testLengths() {
  const client = new TwitterApi({
    appKey: process.env.BWSXAI_TWITTER_API_KEY,
    appSecret: process.env.BWSXAI_TWITTER_API_SECRET,
    accessToken: process.env.BWSXAI_TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.BWSXAI_TWITTER_ACCESS_SECRET,
  });

  const tests = [
    {
      name: 'SHORT (100 chars)',
      tweet: 'X Bot automates community tracking. Real-time analytics for crypto projects. @BWSCommunity $BWS'
    },
    {
      name: 'MEDIUM with 1 URL (200 chars)',
      tweet: 'X Bot automates community tracking across X and Telegram. Real-time analytics and engagement leaderboards. @BWSCommunity $BWS\n\nhttps://www.bws.ninja/articles/x-bot-2025-11-10'
    },
    {
      name: 'LONG with 2 URLs + emojis (280 chars)',
      tweet: 'X Bot automates community tracking across X and Telegram, delivering real-time analytics. @BWSCommunity $BWS\n\n📖 https://www.bws.ninja/articles/x-bot-2025-11-10\n📚 https://docs.bws.ninja/telegram-bots/x-bot\n\n#XBot'
    }
  ];

  for (const test of tests) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing: ${test.name}`);
    console.log(`Actual length: ${test.tweet.length} chars`);
    console.log('---');
    try {
      const result = await client.v2.tweet(test.tweet);
      console.log(`✅ SUCCESS - ID: ${result.data.id}`);
      console.log(`   URL: https://twitter.com/BWSXAI/status/${result.data.id}`);
    } catch (error) {
      console.log(`❌ FAILED`);
      console.log(`   Code: ${error.code}`);
      console.log(`   Message: ${error.message}`);
      if (error.data?.detail) {
        console.log(`   Detail: ${error.data.detail}`);
      }
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('\nTest complete!');
}

testLengths();
