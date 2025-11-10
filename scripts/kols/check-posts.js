import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config({ path: '/mnt/x/Git/blockchain-web-services/bws/bws-front/bws-website-front/.trees/xai-trackkols/.env' });

const client = new TwitterApi({
  appKey: process.env.BWSXAI_TWITTER_API_KEY,
  appSecret: process.env.BWSXAI_TWITTER_API_SECRET,
  accessToken: process.env.BWSXAI_TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.BWSXAI_TWITTER_ACCESS_SECRET,
});

console.log('Checking if test posts still exist...\n');

const testPostIds = [
  '1987916511101485056',
  '1987916822654443825',
];

for (const tweetId of testPostIds) {
  try {
    const tweet = await client.v2.singleTweet(tweetId);
    console.log(`✅ Tweet ${tweetId}: EXISTS`);
    console.log(`   Text: ${tweet.data.text}`);
  } catch (error) {
    if (error.code === 144 || error.message.includes('not found')) {
      console.log(`❌ Tweet ${tweetId}: DELETED or NOT FOUND`);
    } else {
      console.log(`⚠️  Tweet ${tweetId}: ERROR - ${error.message}`);
    }
  }
}

console.log('\n' + '='.repeat(60));
console.log('\nChecking @BWSXAI recent timeline...\n');

try {
  const me = await client.v2.me();
  const timeline = await client.v2.userTimeline(me.data.id, { max_results: 10 });

  console.log(`Recent tweets from @${me.data.username}:`);
  if (timeline.data.data && timeline.data.data.length > 0) {
    timeline.data.data.forEach((tweet, i) => {
      const text = tweet.text.substring(0, 80);
      console.log(`${i+1}. ${text}...`);
    });
  } else {
    console.log('❌ NO TWEETS FOUND in timeline!');
  }
} catch (error) {
  console.log(`❌ Error fetching timeline: ${error.message}`);
}
