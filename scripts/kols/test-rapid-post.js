import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config({ path: '/mnt/x/Git/blockchain-web-services/bws/bws-front/bws-website-front/.trees/xai-trackkols/.env' });

const client = new TwitterApi({
  appKey: process.env.BWSXAI_TWITTER_API_KEY,
  appSecret: process.env.BWSXAI_TWITTER_API_SECRET,
  accessToken: process.env.BWSXAI_TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.BWSXAI_TWITTER_ACCESS_SECRET,
});

console.log('Testing immediate second post...\n');

try {
  const result = await client.v2.reply('Second test post to verify rate limit', '1987714834394497223');
  console.log('✅ Second post succeeded!');
  console.log(`   Reply ID: ${result.data.id}`);

  if (result.rateLimit) {
    console.log('\n📊 Rate Limit Info:');
    console.log(`   Limit: ${result.rateLimit.limit}`);
    console.log(`   Remaining: ${result.rateLimit.remaining}`);
    const resetDate = new Date(result.rateLimit.reset * 1000);
    console.log(`   Reset: ${resetDate.toISOString()}`);
  } else {
    console.log('\n⚠️  No rate limit headers in response');
  }
} catch (error) {
  console.log('❌ Second post failed with 429\n');

  if (error.rateLimit) {
    console.log('📊 Rate Limit Headers:');
    console.log(`   Limit: ${error.rateLimit.limit} posts per window`);
    console.log(`   Remaining: ${error.rateLimit.remaining}`);
    console.log(`   Used today: ${error.rateLimit.limit - error.rateLimit.remaining}`);
    const resetDate = new Date(error.rateLimit.reset * 1000);
    console.log(`   Reset: ${resetDate.toISOString()}`);

    const now = Date.now() / 1000;
    const secondsUntilReset = Math.max(0, error.rateLimit.reset - now);
    const hoursUntilReset = (secondsUntilReset / 3600).toFixed(1);
    console.log(`   Reset in: ${hoursUntilReset} hours`);

    const limit = error.rateLimit.limit;
    if (limit === 17) {
      console.log('\n❌ FREE TIER DETECTED (17 posts/24h)');
      console.log('   Your app is on the FREE tier, not Basic!');
    } else if (limit === 100) {
      console.log('\n⚠️  BASIC TIER - User Level (100 posts/24h)');
      console.log('   OAuth 1.0a uses per-user limits');
    } else if (limit >= 1000) {
      console.log('\n✅ HIGHER TIER DETECTED');
    }
  }

  console.log(`\nError: ${error.message}`);
}
