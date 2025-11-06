/**
 * Test X/Twitter Search with ScrapFly
 * Requires authentication cookies
 */

import ScrapFlyClient from './utils/scrapfly-client.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, 'config/x-crawler-accounts.json');
const COOKIE_PATH = path.join(__dirname, 'config/x-cookies.json');

async function testSearch() {
  console.log('🔍 Testing X/Twitter Search with ScrapFly\n');

  // Load API key
  const configData = await fs.readFile(CONFIG_PATH, 'utf-8');
  const config = JSON.parse(configData);
  const apiKey = config.scrapfly?.apiKey || config.scrapfly?.api_key;

  if (!apiKey) {
    console.error('❌ ScrapFly API key not found!');
    process.exit(1);
  }

  // Load cookies
  let cookies = null;
  let useSession = false;

  try {
    const cookieData = await fs.readFile(COOKIE_PATH, 'utf-8');
    const cookieJson = JSON.parse(cookieData);

    if (cookieJson.sessionName) {
      console.log('✅ Using saved session');
      console.log(`   Session: ${cookieJson.sessionName}`);
      console.log(`   Captured: ${new Date(cookieJson.capturedAt).toLocaleString()}\n`);
      useSession = cookieJson.sessionName;
    } else if (cookieJson.scrapflyFormat) {
      console.log('✅ Using saved cookies');
      console.log(`   Captured: ${new Date(cookieJson.capturedAt).toLocaleString()}`);
      console.log(`   Cookies: ${cookieJson.cookieCount}\n`);
      cookies = cookieJson.scrapflyFormat;
    }
  } catch (error) {
    console.error('❌ No cookies found!');
    console.error('\n💡 To capture cookies:');
    console.error('   Method 1: Browser DevTools (2 minutes)');
    console.error('     1. Log in to x.com in Chrome');
    console.error('     2. Press F12 → Console');
    console.error('     3. Type: document.cookie');
    console.error('     4. Run: node scripts/kols/save-cookies.js');
    console.error('     5. Paste the cookie string\n');
    console.error('   Method 2: Automated (if Puppeteer works)');
    console.error('     node scripts/kols/capture-x-cookies.js\n');
    console.error('See MANUAL-COOKIE-GUIDE.md for detailed instructions.\n');
    process.exit(1);
  }

  const client = new ScrapFlyClient(apiKey);

  try {
    // Test search
    console.log('🔎 Searching for "$XAI" tweets...\n');

    const searchOptions = {
      format: 'json',
      autoScroll: true,
      debug: true,
      timeout: 60000,
    };

    if (useSession) {
      searchOptions.session = useSession;
    } else if (cookies) {
      searchOptions.cookies = cookies;
      searchOptions.session = 'search-session';  // Create session with cookies
    }

    const result = await client.searchTwitter('$XAI', searchOptions);

    console.log('\n✅ Search request completed!\n');
    console.log(`📊 Response Details:`);
    console.log(`   Status: ${result.result.status_code}`);
    console.log(`   URL: ${result.result.url}`);
    console.log(`   Content length: ${result.result.content.length} bytes\n`);

    // Check for login wall
    const html = result.result.content || '';
    if (html.includes('Sign in to X') || html.includes('Log in')) {
      console.log('❌ LOGIN WALL DETECTED');
      console.log('   X is still requiring authentication');
      console.log('\n🔍 Possible issues:');
      console.log('   1. Cookies expired - recapture them');
      console.log('   2. Cookies not being sent properly');
      console.log('   3. X requires additional verification\n');

      // Save HTML for debugging
      await fs.writeFile('/tmp/search-login-wall.html', html);
      console.log('💾 Saved HTML to: /tmp/search-login-wall.html');
      console.log('   Review this file to see what X is returning\n');

      process.exit(1);
    }

    // Check XHR calls for tweets
    const xhrCalls = result.result.browser_data?.xhr_call || [];
    console.log(`📡 XHR Calls: ${xhrCalls.length} captured\n`);

    // Look for search API calls
    const searchCalls = xhrCalls.filter(xhr =>
      xhr.url && (
        xhr.url.includes('SearchTimeline') ||
        xhr.url.includes('search/adaptive')
      )
    );

    console.log(`🔍 Search API calls: ${searchCalls.length}\n`);

    if (searchCalls.length === 0) {
      console.log('⚠️  No search API calls found');
      console.log('   This suggests the search page didn\'t load properly\n');

      // Check what XHR calls we did get
      console.log('📋 XHR calls received:');
      xhrCalls.slice(0, 5).forEach(xhr => {
        const url = xhr.url || '';
        const urlPath = url.split('?')[0].substring(url.lastIndexOf('/'));
        console.log(`   • ${urlPath}`);
      });
      console.log();
    } else {
      // Parse search results
      console.log('🐦 Parsing search results...\n');

      let tweetCount = 0;
      const tweets = [];

      for (const xhr of searchCalls) {
        if (xhr.response && xhr.response.body) {
          try {
            const data = JSON.parse(xhr.response.body);

            // Navigate the Twitter API response structure
            const instructions = data.data?.search_by_raw_query?.search_timeline?.timeline?.instructions || [];

            for (const instruction of instructions) {
              if (instruction.type === 'TimelineAddEntries') {
                const entries = instruction.entries || [];

                for (const entry of entries) {
                  if (entry.content?.itemContent?.tweet_results?.result) {
                    const tweet = entry.content.itemContent.tweet_results.result;
                    const legacy = tweet.legacy || {};

                    const parsed = {
                      id: legacy.id_str,
                      text: legacy.full_text,
                      user: tweet.core?.user_results?.result?.legacy?.screen_name,
                      created_at: legacy.created_at,
                      likes: legacy.favorite_count,
                      retweets: legacy.retweet_count,
                      replies: legacy.reply_count,
                    };

                    tweets.push(parsed);
                    tweetCount++;

                    console.log(`   ${tweetCount}. @${parsed.user}`);
                    console.log(`      ${parsed.text.substring(0, 80)}...`);
                    console.log(`      ❤️  ${parsed.likes} | 🔁 ${parsed.retweets} | 💬 ${parsed.replies}\n`);
                  }
                }
              }
            }
          } catch (e) {
            console.log(`   ⚠️  Failed to parse XHR: ${e.message}`);
          }
        }
      }

      if (tweets.length > 0) {
        console.log(`\n🎉 SUCCESS! Found ${tweets.length} tweets\n`);

        // Save parsed tweets
        await fs.writeFile(
          '/tmp/search-results.json',
          JSON.stringify(tweets, null, 2)
        );
        console.log('💾 Saved tweets to: /tmp/search-results.json\n');

        console.log('✅ Search is working!');
        console.log('\n📚 Next steps:');
        console.log('   1. Implement full search parser');
        console.log('   2. Integrate with KOL tracking');
        console.log('   3. Set up automated discovery workflow\n');

        process.exit(0);
      } else {
        console.log('\n⚠️  No tweets found in search results');
        console.log('   The API call succeeded but returned no tweets\n');
      }
    }

    // Save full response for debugging
    await fs.writeFile(
      '/tmp/search-full-response.json',
      JSON.stringify(result, null, 2)
    );
    console.log('💾 Saved full response to: /tmp/search-full-response.json');
    console.log('   Review this file for debugging\n');

  } catch (error) {
    console.error('\n❌ Search failed:', error.message);
    if (error.message.includes('401') || error.message.includes('403')) {
      console.error('\n🔒 Authentication error');
      console.error('   Your cookies may have expired');
      console.error('   Recapture them using the guide in MANUAL-COOKIE-GUIDE.md\n');
    }
    process.exit(1);
  }
}

testSearch()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
