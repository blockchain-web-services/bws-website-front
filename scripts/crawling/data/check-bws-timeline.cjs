const { TwitterApi } = require('twitter-api-v2');

const bearerToken = process.env.TWITTER_BEARER_TOKEN;
if (!bearerToken) {
  console.error('TWITTER_BEARER_TOKEN not found');
  process.exit(1);
}

const client = new TwitterApi(bearerToken);

(async () => {
  try {
    // Get @BWSCommunity user
    const user = await client.v2.userByUsername('BWSCommunity');
    console.log('Found user:', user.data.name, '(@' + user.data.username + ')');
    console.log();

    // Get recent tweets (including replies)
    const timeline = await client.v2.userTimeline(user.data.id, {
      max_results: 20,
      'tweet.fields': ['created_at', 'in_reply_to_user_id', 'referenced_tweets']
      // By default includes all tweet types (original tweets and replies, but not retweets)
    });

    const tweets = timeline.data.data || [];
    console.log('Recent Activity (Last 20 tweets/replies):');
    console.log('='.repeat(80));

    tweets.forEach((tweet, idx) => {
      const isReply = tweet.referenced_tweets?.some(ref => ref.type === 'replied_to') || tweet.in_reply_to_user_id;
      const type = isReply ? '↩️  REPLY' : '📢 TWEET';
      const date = new Date(tweet.created_at).toISOString();
      const preview = tweet.text.substring(0, 80).replace(/\n/g, ' ');

      console.log(`${idx + 1}. ${type} - ${date}`);
      console.log(`   ${preview}...`);
      console.log();
    });

    // Count replies vs tweets
    const replies = tweets.filter(t => t.referenced_tweets?.some(ref => ref.type === 'replied_to') || t.in_reply_to_user_id);
    const regularTweets = tweets.filter(t => !t.referenced_tweets?.some(ref => ref.type === 'replied_to') && !t.in_reply_to_user_id);

    console.log('='.repeat(80));
    console.log(`Summary: ${replies.length} replies, ${regularTweets.length} regular tweets (last 20 posts)`);

    if (replies.length > 0) {
      console.log(`Most recent reply: ${new Date(replies[0].created_at).toISOString()}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
