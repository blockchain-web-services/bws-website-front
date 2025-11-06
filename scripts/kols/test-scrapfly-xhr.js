/**
 * Test ScrapFly with XHR-based data extraction
 * This approach parses background XHR calls instead of HTML
 */

import ScrapFlyClient from './utils/scrapfly-client.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, 'config/x-crawler-accounts.json');

async function testXHRExtraction() {
  console.log('🔬 Testing ScrapFly with XHR Data Extraction\n');

  // Load config
  const configData = await fs.readFile(CONFIG_PATH, 'utf-8');
  const config = JSON.parse(configData);
  const apiKey = config.scrapfly?.apiKey || config.scrapfly?.api_key;

  if (!apiKey) {
    console.error('❌ ScrapFly API key not found in config!');
    process.exit(1);
  }

  const client = new ScrapFlyClient(apiKey);

  try {
    // Test: Scrape profile with XHR data
    console.log('📍 Scraping @elonmusk profile with XHR extraction...\n');

    const result = await client.getUserProfile('elonmusk');

    console.log('✅ Scrape successful!');
    console.log(`   Status: ${result.result.status_code}`);
    console.log(`   URL: ${result.result.url}\n`);

    // Check if we got browser_data
    if (!result.result.browser_data) {
      console.error('❌ No browser_data in response!');
      console.log('   Make sure format=json is being used');
      process.exit(1);
    }

    const xhrCalls = result.result.browser_data.xhr_call || [];
    console.log(`📡 XHR Calls captured: ${xhrCalls.length}`);

    // Find user data XHR calls
    const userCalls = xhrCalls.filter(xhr => xhr.url && xhr.url.includes('UserBy'));
    console.log(`   User data calls: ${userCalls.length}`);

    // Find tweet XHR calls
    const tweetCalls = xhrCalls.filter(xhr => xhr.url && xhr.url.includes('TweetResultByRestId'));
    console.log(`   Tweet data calls: ${tweetCalls.length}\n`);

    // Parse user data
    if (userCalls.length > 0) {
      const userXhr = userCalls[0];
      if (userXhr.response && userXhr.response.body) {
        try {
          const userData = JSON.parse(userXhr.response.body);
          const user = userData.data?.user?.result;

          if (user) {
            console.log('👤 User Profile Data:');
            console.log(`   ID: ${user.rest_id}`);
            console.log(`   Username: ${user.legacy?.screen_name}`);
            console.log(`   Display Name: ${user.legacy?.name}`);
            console.log(`   Verified: ${user.is_blue_verified ? 'Yes' : 'No'}`);
            console.log(`   Followers: ${user.legacy?.followers_count?.toLocaleString()}`);
            console.log(`   Following: ${user.legacy?.friends_count?.toLocaleString()}`);
            console.log(`   Tweets: ${user.legacy?.statuses_count?.toLocaleString()}`);
            console.log(`   Bio: ${user.legacy?.description?.substring(0, 100)}...`);
            console.log();

            // Save parsed data
            const parsedData = {
              id: user.rest_id,
              username: user.legacy?.screen_name,
              displayName: user.legacy?.name,
              verified: user.is_blue_verified,
              followers: user.legacy?.followers_count,
              following: user.legacy?.friends_count,
              tweets: user.legacy?.statuses_count,
              bio: user.legacy?.description,
              location: user.legacy?.location,
              url: user.legacy?.url,
              created_at: user.legacy?.created_at,
            };

            await fs.writeFile(
              '/tmp/scrapfly-profile-parsed.json',
              JSON.stringify(parsedData, null, 2)
            );
            console.log('💾 Saved parsed profile to: /tmp/scrapfly-profile-parsed.json');
          }
        } catch (e) {
          console.error('❌ Failed to parse user data:', e.message);
        }
      }
    }

    // Parse tweet data
    if (tweetCalls.length > 0) {
      console.log(`\n🐦 Processing ${tweetCalls.length} tweets...`);
      const tweets = [];

      for (const tweetXhr of tweetCalls.slice(0, 5)) {  // First 5 tweets
        if (tweetXhr.response && tweetXhr.response.body) {
          try {
            const tweetData = JSON.parse(tweetXhr.response.body);
            const tweet = tweetData.data?.tweetResult?.result;

            if (tweet && tweet.legacy) {
              const parsed = {
                id: tweet.legacy.id_str,
                text: tweet.legacy.full_text,
                created_at: tweet.legacy.created_at,
                retweets: tweet.legacy.retweet_count,
                likes: tweet.legacy.favorite_count,
                replies: tweet.legacy.reply_count,
                views: tweet.views?.count,
              };
              tweets.push(parsed);

              console.log(`   • ${parsed.text.substring(0, 60)}...`);
              console.log(`     ❤️  ${parsed.likes} | 🔁 ${parsed.retweets} | 💬 ${parsed.replies}`);
            }
          } catch (e) {
            // Skip malformed tweets
          }
        }
      }

      if (tweets.length > 0) {
        await fs.writeFile(
          '/tmp/scrapfly-tweets-parsed.json',
          JSON.stringify(tweets, null, 2)
        );
        console.log(`\n💾 Saved ${tweets.length} tweets to: /tmp/scrapfly-tweets-parsed.json`);
      }
    }

    console.log('\n\n🎉 XHR extraction test complete!');
    console.log('\n✅ This approach:');
    console.log('   • Extracts structured JSON data (not HTML parsing)');
    console.log('   • More reliable and faster');
    console.log('   • Same approach used by ScrapFly\'s official scraper');
    console.log('\n📚 Next: Implement parser module to extract all tweet/profile data');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
}

testXHRExtraction()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Test error:', error);
    process.exit(1);
  });
