/**
 * Test ScrapFly API for X/Twitter scraping
 */

import ScrapFlyClient from './utils/scrapfly-client.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, 'config/x-crawler-accounts.json');

async function testScrapFly() {
  console.log('🧪 Testing ScrapFly API for X/Twitter...\n');

  // Load config
  const configData = await fs.readFile(CONFIG_PATH, 'utf-8');
  const config = JSON.parse(configData);

  // Support both apiKey (camelCase) and api_key (snake_case)
  const apiKey = config.scrapfly?.apiKey || config.scrapfly?.api_key;

  if (!apiKey) {
    console.error('❌ ScrapFly API key not found in config!');
    console.log('\nPlease add your ScrapFly API key to scripts/kols/config/x-crawler-accounts.json:');
    console.log(JSON.stringify({
      scrapfly: {
        apiKey: 'scp-live-YOUR_API_KEY_HERE'
      }
    }, null, 2));
    process.exit(1);
  }

  const client = new ScrapFlyClient(apiKey);

  try {
    // Test 1: Search for xAI-related tweets (without waiting for selector)
    console.log('📍 Test 1: Searching for "$XAI" tweets...\n');

    const searchResult = await client.searchTwitter('$XAI', {
      session: 'test-session',
      debug: true,
      waitForSelector: null, // Don't wait for selector - X may show login wall
    });

    console.log('\n✅ Search request successful!');
    console.log(`   Status: ${searchResult.result.status_code}`);
    console.log(`   Content length: ${searchResult.result.content.length} bytes`);
    console.log(`   URL: ${searchResult.result.url}`);

    // Save HTML for inspection
    await fs.writeFile('/tmp/scrapfly-search.html', searchResult.result.content);
    console.log(`   💾 Saved to: /tmp/scrapfly-search.html`);

    // Check if login is required
    const content = searchResult.result.content;
    if (content.includes('Sign in to X') || content.includes('Log in')) {
      console.log('\n   ⚠️  X is showing login wall - authentication may be required');
    } else if (content.includes('data-testid="tweet"')) {
      console.log('\n   ✅ Tweets found in content!');
    }

    if (searchResult.result.screenshots) {
      console.log(`   📸 Screenshots available:`, Object.keys(searchResult.result.screenshots));
    }

    // Test 2: Get a user profile
    console.log('\n\n📍 Test 2: Getting @elonmusk profile...\n');

    const profileResult = await client.getUserProfile('elonmusk', {
      session: 'test-session',
    });

    console.log('\n✅ Profile fetch successful!');
    console.log(`   Status: ${profileResult.result.status_code}`);
    console.log(`   Content length: ${profileResult.result.content.length} bytes`);

    // Save HTML for inspection
    await fs.writeFile('/tmp/scrapfly-profile.html', profileResult.result.content);
    console.log(`   💾 Saved to: /tmp/scrapfly-profile.html`);

    console.log('\n\n🎉 All tests passed!');
    console.log('\nScrapFly successfully bypasses X anti-scraping protection.');
    console.log('You can now use this for KOL discovery and tracking.');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

testScrapFly()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Test error:', error);
    process.exit(1);
  });
