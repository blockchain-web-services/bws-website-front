/**
 * Test ScrapFly with Authenticated Cookies
 */

import ScrapFlyClient from './utils/scrapfly-client.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, 'config/x-crawler-accounts.json');
const COOKIE_PATH = path.join(__dirname, 'config/x-cookies.json');

async function testAuthenticatedScraping() {
  console.log('🔐 Testing ScrapFly with Authenticated Cookies\n');

  // Load ScrapFly API key
  const configData = await fs.readFile(CONFIG_PATH, 'utf-8');
  const config = JSON.parse(configData);
  const apiKey = config.scrapfly?.apiKey || config.scrapfly?.api_key;

  if (!apiKey) {
    console.error('❌ ScrapFly API key not found in config!');
    process.exit(1);
  }

  // Load cookies
  let cookies = null;
  try {
    const cookieData = await fs.readFile(COOKIE_PATH, 'utf-8');
    const cookieJson = JSON.parse(cookieData);
    cookies = cookieJson.scrapflyFormat;

    console.log('✅ Loaded cookies from:', COOKIE_PATH);
    console.log(`   Captured: ${new Date(cookieJson.capturedAt).toLocaleString()}`);
    console.log(`   Cookie count: ${cookieJson.cookieCount}\n`);
  } catch (error) {
    console.error('❌ Cookie file not found!');
    console.error('\n💡 Run this first to capture cookies:');
    console.error('   node scripts/kols/capture-x-cookies.js\n');
    process.exit(1);
  }

  const client = new ScrapFlyClient(apiKey);

  try {
    // Test 1: Search with authentication
    console.log('📍 Test 1: Searching for "$XAI" tweets (authenticated)...\n');

    const searchResult = await client.searchTwitter('$XAI', {
      session: 'auth-session',
      cookies: cookies,
      debug: true,
    });

    console.log('\n✅ Search request successful!');
    console.log(`   Status: ${searchResult.result.status_code}`);
    console.log(`   Content length: ${searchResult.result.content.length} bytes`);

    // Save HTML for inspection
    await fs.writeFile('/tmp/scrapfly-auth-search.html', searchResult.result.content);
    console.log(`   💾 Saved to: /tmp/scrapfly-auth-search.html`);

    // Check results
    const content = searchResult.result.content;
    const tweetCount = (content.match(/data-testid="tweet"/g) || []).length;

    if (content.includes('Sign in to X') || content.includes('Log in')) {
      console.log('\n   ⚠️  Still showing login wall - cookies may have expired');
      console.log('   💡 Try running capture-x-cookies.js again');
    } else if (tweetCount > 0) {
      console.log(`\n   🎉 SUCCESS! Found ${tweetCount} tweets in content!`);
    } else {
      console.log('\n   ⚠️  No login wall, but no tweets found either');
    }

    // Test 2: Get user profile
    console.log('\n\n📍 Test 2: Getting @elonmusk profile (authenticated)...\n');

    const profileResult = await client.getUserProfile('elonmusk', {
      session: 'auth-session',
      cookies: cookies,
    });

    console.log('\n✅ Profile fetch successful!');
    console.log(`   Status: ${profileResult.result.status_code}`);
    console.log(`   Content length: ${profileResult.result.content.length} bytes`);

    // Save HTML
    await fs.writeFile('/tmp/scrapfly-auth-profile.html', profileResult.result.content);
    console.log(`   💾 Saved to: /tmp/scrapfly-auth-profile.html`);

    // Check for profile elements
    const profileContent = profileResult.result.content;
    if (profileContent.includes('data-testid="UserDescription"')) {
      console.log('   ✅ Profile data found!');
    }

    console.log('\n\n🎉 All tests completed!');
    console.log('\nNext steps:');
    console.log('   1. Inspect the HTML files in /tmp/');
    console.log('   2. Build HTML parser to extract tweet/profile data');
    console.log('   3. Integrate into KOL discovery workflow');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

testAuthenticatedScraping()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Test error:', error);
    process.exit(1);
  });
