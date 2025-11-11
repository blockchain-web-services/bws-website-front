import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

async function checkAccount() {
  console.log('🔍 Checking @BWSXAI Account Details\n');

  const client = new TwitterApi({
    appKey: process.env.BWSXAI_TWITTER_API_KEY,
    appSecret: process.env.BWSXAI_TWITTER_API_SECRET,
    accessToken: process.env.BWSXAI_TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.BWSXAI_TWITTER_ACCESS_SECRET,
  });

  try {
    const me = await client.v2.me({
      'user.fields': ['created_at', 'description', 'public_metrics', 'verified', 'verified_type', 'protected']
    });

    const user = me.data;

    console.log('Account Information:');
    console.log(`  Username: @${user.username}`);
    console.log(`  ID: ${user.id}`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Created: ${user.created_at}`);
    console.log(`  Verified: ${user.verified || false}`);
    console.log(`  Verified Type: ${user.verified_type || 'none'}`);
    console.log(`  Protected: ${user.protected || false}`);
    console.log(`\n  Metrics:`);
    console.log(`    Followers: ${user.public_metrics.followers_count}`);
    console.log(`    Following: ${user.public_metrics.following_count}`);
    console.log(`    Tweets: ${user.public_metrics.tweet_count}`);
    console.log(`\n  Bio: ${user.description || '(none)'}\n`);

    // Calculate account age
    const created = new Date(user.created_at);
    const ageMs = Date.now() - created.getTime();
    const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));

    console.log(`⏰ Account Age: ${ageDays} days\n`);

    if (ageDays < 30) {
      console.log('⚠️  Account is less than 30 days old');
      console.log('   Twitter may restrict replies for new accounts');
      console.log('   This could explain the 403 Forbidden on replies\n');
    }

    if (user.public_metrics.tweet_count < 10) {
      console.log('⚠️  Very low tweet count');
      console.log('   Twitter may restrict features for inactive accounts\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAccount();
