/**
 * Test X Search with Account Cookies
 */

import ScrapFlyClient from './utils/scrapfly-client.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, 'config/x-crawler-accounts.json');

async function testSearch() {
  console.log('🐦 Testing X Search with Account Cookies\n');

  // Load config
  const config = JSON.parse(await fs.readFile(CONFIG_PATH, 'utf-8'));
  const apiKey = config.scrapfly.apiKey;
  const account = config.accounts[0];

  console.log('📱 Account:', account.username);
  console.log('🍪 Cookies loaded\n');

  // Format cookies for ScrapFly
  const cookieString = `auth_token=${account.cookies.auth_token}; ct0=${account.cookies.ct0}; guest_id=${account.cookies.guest_id}`;

  const client = new ScrapFlyClient(apiKey);

  try {
    console.log('🔎 Searching for "$XAI" tweets...\n');

    const result = await client.searchTwitter('$XAI', {
      cookies: cookieString,
      session: 'search-session-test',
      format: 'json',
      autoScroll: false,
      timeout: 60000,
      retry: false,
    });

    console.log('✅ Search completed!\n');

    // Parse results
    const xhrCalls = result.result.browser_data?.xhr_call || [];
    const searchCalls = xhrCalls.filter(xhr =>
      xhr.url && (xhr.url.includes('SearchTimeline') || xhr.url.includes('search/adaptive'))
    );

    console.log('📡 Search API calls:', searchCalls.length);

    const tweets = [];
    const users = new Set();

    for (const xhr of searchCalls) {
      if (xhr.response && xhr.response.body) {
        try {
          const data = JSON.parse(xhr.response.body);
          const instructions = data.data?.search_by_raw_query?.search_timeline?.timeline?.instructions || [];

          for (const instruction of instructions) {
            if (instruction.type === 'TimelineAddEntries') {
              const entries = instruction.entries || [];

              for (const entry of entries) {
                const tweetResult = entry.content?.itemContent?.tweet_results?.result;
                if (tweetResult && tweetResult.legacy) {
                  const tweet = tweetResult.legacy;

                  // User data is nested in core.user_results.result
                  const userResult = tweetResult.core?.user_results?.result;
                  const username = userResult?.core?.screen_name || userResult?.legacy?.screen_name || 'unknown';
                  const displayName = userResult?.core?.name || userResult?.legacy?.name || 'Unknown';
                  const verified = userResult?.is_blue_verified || false;

                  const parsed = {
                    id: tweet.id_str,
                    text: tweet.full_text,
                    username: username,
                    displayName: displayName,
                    created_at: tweet.created_at,
                    likes: tweet.favorite_count,
                    retweets: tweet.retweet_count,
                    replies: tweet.reply_count,
                    views: tweetResult.views?.count || 0,
                    verified: verified,
                  };

                  tweets.push(parsed);
                  if (parsed.username !== 'unknown') {
                    users.add(parsed.username);
                  }
                }
              }
            }
          }
        } catch (e) {
          console.log('   ⚠️  Parse error:', e.message);
        }
      }
    }

    console.log('🐦 Tweets found:', tweets.length);
    console.log('👥 Unique users:', users.size);
    console.log();

    if (tweets.length > 0) {
      console.log('📊 Top 10 Most Engaged Tweets:\n');

      tweets
        .sort((a, b) => (b.likes + b.retweets) - (a.likes + a.retweets))
        .slice(0, 10)
        .forEach((tweet, i) => {
          console.log(`${i + 1}. @${tweet.username} ${tweet.verified ? '✓' : ''}`);
          console.log(`   ${tweet.text.substring(0, 80).replace(/\n/g, ' ')}...`);
          console.log(`   ❤️  ${tweet.likes.toLocaleString()} | 🔁 ${tweet.retweets.toLocaleString()} | 💬 ${tweet.replies.toLocaleString()} | 👁️  ${tweet.views.toLocaleString()}`);
          console.log();
        });

      console.log('👥 KOLs Found (sorted by engagement):\n');

      // Calculate engagement per user
      const userEngagement = {};
      tweets.forEach(tweet => {
        if (!userEngagement[tweet.username]) {
          userEngagement[tweet.username] = {
            tweets: 0,
            totalLikes: 0,
            totalRetweets: 0,
            verified: tweet.verified,
          };
        }
        userEngagement[tweet.username].tweets++;
        userEngagement[tweet.username].totalLikes += tweet.likes;
        userEngagement[tweet.username].totalRetweets += tweet.retweets;
      });

      Object.entries(userEngagement)
        .sort((a, b) => (b[1].totalLikes + b[1].totalRetweets) - (a[1].totalLikes + a[1].totalRetweets))
        .slice(0, 15)
        .forEach(([username, stats]) => {
          const totalEngagement = stats.totalLikes + stats.totalRetweets;
          console.log(`   • @${username} ${stats.verified ? '✓' : ''}`);
          console.log(`     ${stats.tweets} tweets | ${totalEngagement.toLocaleString()} total engagement`);
        });

      // Save results
      await fs.writeFile('/tmp/xai-search-results.json', JSON.stringify(tweets, null, 2));
      console.log(`\n💾 Saved ${tweets.length} tweets to /tmp/xai-search-results.json\n`);

      console.log('✅ ✅ ✅ SEARCH WORKING PERFECTLY! ✅ ✅ ✅\n');
      console.log('🎯 Ready for production use!\n');

      process.exit(0);
    } else {
      console.log('⚠️  No tweets parsed from search results\n');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

testSearch();
