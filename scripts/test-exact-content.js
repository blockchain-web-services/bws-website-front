import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { TwitterApi } from 'twitter-api-v2';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

async function testExactContent() {
  const client = new TwitterApi({
    appKey: process.env.BWSXAI_TWITTER_API_KEY,
    appSecret: process.env.BWSXAI_TWITTER_API_SECRET,
    accessToken: process.env.BWSXAI_TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.BWSXAI_TWITTER_ACCESS_SECRET,
  });

  // EXACT text from failed post #1
  const exactFailedText = `Stop manually tracking community mentions and KOL performance. X Bot automates engagement analytics across X and Telegram, delivering real-time leaderboards and tracking systems. @BWSCommunity $BWS

📖 Article: https://www.bws.ninja/articles/x-bot-2025-11-10
📚 Docs: https://docs.bws.ninja/telegram-bots/x-bot

#XBot #Web3Community`;

  console.log('Testing EXACT failed post content:');
  console.log(`Length: ${exactFailedText.length} chars`);
  console.log('---\n');

  try {
    const result = await client.v2.tweet(exactFailedText);
    console.log('✅ SUCCESS!');
    console.log(`Tweet ID: ${result.data.id}`);
    console.log(`URL: https://twitter.com/BWSXAI/status/${result.data.id}`);
    console.log('\n⚠️  This means the script has a different issue, not the content!');
  } catch (error) {
    console.log('❌ FAILED');
    console.log(`Code: ${error.code}`);
    console.log(`Message: ${error.message}`);
    if (error.data) {
      console.log(`Detail: ${error.data.detail}`);
      console.log('\n⚠️  The CONTENT is being blocked by Twitter!');
    }
  }
}

testExactContent();
