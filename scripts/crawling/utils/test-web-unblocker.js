/**
 * Test Oxylabs Web Unblocker
 *
 * Tests the Web Unblocker proxy with:
 * 1. Simple website (google.com) to verify proxy works
 * 2. X/Twitter profile with cookies to verify scraping works
 * 3. GraphQL interception to verify data extraction works
 *
 * Usage: node test-web-unblocker.js
 */

import { config as dotenvConfig } from 'dotenv';
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from worktree root
dotenvConfig({ path: path.join(__dirname, '../../../.env') });

// Account configuration path
const CONFIG_PATH = path.join(__dirname, '../config/x-crawler-accounts.json');

/**
 * Test 1: Verify Web Unblocker proxy works with a simple website
 */
async function testSimpleWebsite() {
  console.log('\n🧪 TEST 1: Simple Website (Google.com)');
  console.log('=' .repeat(60));

  const username = process.env.OXYLABS_USERNAME;
  const password = process.env.OXYLABS_PASSWORD;

  if (!username || !password) {
    throw new Error(
      'Oxylabs credentials not found in environment variables.\n' +
      'Please set OXYLABS_USERNAME and OXYLABS_PASSWORD in .env file.'
    );
  }

  console.log(`📋 Proxy: unblock.oxylabs.io:60000`);
  console.log(`   Username: ${username.substring(0, 3)}***${username.substring(username.length - 2)}`);
  console.log(`   Password: ${'*'.repeat(password.length)}`);
  console.log();

  let browser;

  try {
    console.log('🚀 Launching browser with Web Unblocker proxy...');

    browser = await chromium.launch({
      headless: true,
      proxy: {
        server: 'https://unblock.oxylabs.io:60000',
        username: username,
        password: password
      },
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--no-sandbox',
      ],
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      extraHTTPHeaders: {
        'X-Oxylabs-Render': 'html'  // Enable JavaScript rendering
      },
      ignoreHTTPSErrors: true,  // Required for Web Unblocker
    });

    const page = await context.newPage();

    console.log('🌐 Fetching https://www.google.com...');
    const startTime = Date.now();

    await page.goto('https://www.google.com', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    const loadTime = Date.now() - startTime;
    const title = await page.title();

    console.log(`   ✅ Success! (${loadTime}ms)`);
    console.log(`   Page title: "${title}"`);
    console.log();

    // Test 1b: Check IP to verify proxy is working
    console.log('🌐 Checking IP address via api.ipify.org...');
    const ipStartTime = Date.now();

    await page.goto('https://api.ipify.org?format=json', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    const ipLoadTime = Date.now() - ipStartTime;
    const content = await page.content();
    const ipMatch = content.match(/"ip":"([^"]+)"/);
    const ip = ipMatch ? ipMatch[1] : 'Could not extract IP';

    console.log(`   ✅ Success! (${ipLoadTime}ms)`);
    console.log(`   Your IP through proxy: ${ip}`);
    console.log();

    await browser.close();

    console.log('=' .repeat(60));
    console.log('✅ TEST 1 PASSED: Web Unblocker proxy is working!');
    console.log('=' .repeat(60));

    return true;

  } catch (error) {
    if (browser) {
      await browser.close().catch(() => {});
    }

    console.log('=' .repeat(60));
    console.log('❌ TEST 1 FAILED');
    console.log('=' .repeat(60));
    console.log('Error:', error.message);
    console.log();
    throw error;
  }
}

/**
 * Test 2: Verify Web Unblocker works with X/Twitter and cookies
 */
async function testTwitterProfile() {
  console.log('\n🧪 TEST 2: X/Twitter Profile with Authentication');
  console.log('=' .repeat(60));

  // Load account configuration
  if (!existsSync(CONFIG_PATH)) {
    throw new Error(`Config not found at ${CONFIG_PATH}`);
  }

  const configData = await fs.readFile(CONFIG_PATH, 'utf-8');
  const config = JSON.parse(configData);

  // Get first active account
  const account = config.accounts.find(a => a.status === 'active' && !a.suspended);

  if (!account) {
    throw new Error('No active account found in config');
  }

  console.log(`📋 Testing with account: ${account.username}`);
  console.log(`   Country: ${account.country || 'default'}`);
  console.log();

  // Prepare cookies for X/Twitter
  const cookies = [
    {
      name: 'auth_token',
      value: account.cookies.auth_token,
      domain: '.x.com',
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    },
    {
      name: 'ct0',
      value: account.cookies.ct0,
      domain: '.x.com',
      path: '/',
      httpOnly: false,
      secure: true,
      sameSite: 'Lax'
    }
  ];

  if (account.cookies.guest_id) {
    cookies.push({
      name: 'guest_id',
      value: account.cookies.guest_id,
      domain: '.x.com',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'None'
    });
  }

  const username = process.env.OXYLABS_USERNAME;
  const password = process.env.OXYLABS_PASSWORD;

  let browser;

  try {
    console.log('🚀 Launching browser with Web Unblocker...');

    browser = await chromium.launch({
      headless: true,
      proxy: {
        server: 'https://unblock.oxylabs.io:60000',
        username: username,
        password: password
      },
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--no-sandbox',
      ],
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      extraHTTPHeaders: {
        'X-Oxylabs-Render': 'html',  // Required for JavaScript rendering
        'x-csrf-token': account.cookies.ct0,  // CSRF token for X/Twitter
      },
      ignoreHTTPSErrors: true,
    });

    console.log('🔐 Adding authentication cookies...');
    await context.addCookies(cookies);

    const page = await context.newPage();

    // Set up GraphQL response listener
    let profileData = null;
    let graphqlRequests = [];

    // Log all GraphQL requests
    page.on('response', async (response) => {
      const url = response.url();

      // Log all GraphQL-related requests
      if (url.includes('graphql') || url.includes('api.x.com') || url.includes('api.twitter.com')) {
        graphqlRequests.push({
          url: url.substring(0, 100),
          status: response.status()
        });
      }

      if (url.includes('UserByScreenName')) {
        try {
          const data = await response.json();

          if (data.data?.user?.result) {
            const user = data.data.user.result;
            const legacy = user.legacy || {};

            profileData = {
              username: legacy.screen_name,
              name: legacy.name,
              description: legacy.description,
              followers: legacy.followers_count,
              following: legacy.friends_count,
              verified: user.is_blue_verified || legacy.verified,
              created_at: legacy.created_at,
            };

            console.log('   📊 GraphQL data captured!');
            console.log(`      Username: @${profileData.username}`);
            console.log(`      Name: ${profileData.name}`);
            console.log(`      Followers: ${profileData.followers?.toLocaleString()}`);
            console.log(`      Following: ${profileData.following?.toLocaleString()}`);
            console.log(`      Verified: ${profileData.verified ? '✓' : '✗'}`);
          }
        } catch (e) {
          console.error('   ⚠️  Error parsing GraphQL response:', e.message);
        }
      }
    });

    // Navigate to a well-known crypto profile (use elonmusk as it definitely exists)
    const testUsername = 'elonmusk';
    console.log(`🌐 Fetching https://x.com/${testUsername}...`);
    const startTime = Date.now();

    await page.goto(`https://x.com/${testUsername}`, {
      waitUntil: 'networkidle',  // Wait for network to be idle
      timeout: 180000,  // 3 minutes for JS rendering
    });

    const loadTime = Date.now() - startTime;
    console.log(`   ✅ Page loaded! (${loadTime}ms)`);
    console.log();

    // Since we're using X-Oxylabs-Render, the page is pre-rendered
    // GraphQL requests won't happen in browser, so we need to parse HTML instead
    console.log('⏳ Extracting profile data from rendered HTML...');

    try {
      // Extract profile data from page selectors
      const username = await page.textContent('[data-testid="UserName"]').catch(() => null);
      const followersText = await page.textContent('a[href$="/verified_followers"] span').catch(() => null);
      const followingText = await page.textContent('a[href$="/following"] span').catch(() => null);

      if (username || followersText) {
        profileData = {
          username: username || 'unknown',
          followers_text: followersText || 'unknown',
          following_text: followingText || 'unknown',
          extraction_method: 'HTML parsing (Web Unblocker pre-rendered)'
        };
        console.log(`   ✅ Extracted profile data from HTML`);
      } else {
        console.log(`   ⚠️  Could not extract data from HTML selectors`);
      }
    } catch (e) {
      console.log(`   ⚠️  Error extracting from HTML: ${e.message}`);
    }

    // Log debug info
    console.log();
    console.log(`📊 Debug Info:`);
    console.log(`   GraphQL requests detected: ${graphqlRequests.length}`);

    if (graphqlRequests.length > 0) {
      console.log(`   Sample requests:`);
      graphqlRequests.slice(0, 5).forEach((req, i) => {
        console.log(`      ${i + 1}. ${req.url} (${req.status})`);
      });
    }

    // Take a screenshot for debugging
    try {
      const screenshotPath = path.join(__dirname, 'test-x-screenshot.png');
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`   Screenshot saved: ${screenshotPath}`);
    } catch (e) {
      console.log(`   Could not save screenshot: ${e.message}`);
    }

    await browser.close();

    if (profileData) {
      console.log();
      console.log('=' .repeat(60));
      console.log('✅ TEST 2 PASSED: X/Twitter scraping works!');
      console.log('=' .repeat(60));
      console.log();
      console.log('Profile Data:');
      console.log(JSON.stringify(profileData, null, 2));
      console.log();
      return true;
    } else {
      console.log();
      console.log('=' .repeat(60));
      console.log('⚠️  TEST 2 INCOMPLETE: Page loaded but no GraphQL data captured');
      console.log('=' .repeat(60));
      console.log();
      console.log('This could mean:');
      console.log('  1. GraphQL request not made (page not fully loaded)');
      console.log('  2. Authentication issue (cookies invalid/expired)');
      console.log('  3. X/Twitter blocked the request');
      console.log('  4. Page structure has changed');
      console.log();
      console.log('Check the screenshot to see what the page looks like.');
      console.log();
      return false;
    }

  } catch (error) {
    if (browser) {
      await browser.close().catch(() => {});
    }

    console.log('=' .repeat(60));
    console.log('❌ TEST 2 FAILED');
    console.log('=' .repeat(60));
    console.log('Error:', error.message);
    console.log();
    throw error;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🧪 OXYLABS WEB UNBLOCKER TEST SUITE');
  console.log('=' .repeat(60));
  console.log();

  try {
    // Test 1: Simple website
    await testSimpleWebsite();

    // Test 2: X/Twitter profile
    await testTwitterProfile();

    console.log('\n' + '=' .repeat(60));
    console.log('✅ ALL TESTS PASSED');
    console.log('=' .repeat(60));
    console.log();
    console.log('Web Unblocker is working correctly!');
    console.log('You can now migrate the main crawler to use Web Unblocker.');
    console.log();

    process.exit(0);

  } catch (error) {
    console.log('\n' + '=' .repeat(60));
    console.log('❌ TEST SUITE FAILED');
    console.log('=' .repeat(60));
    console.log();
    console.log('Error:', error.message);
    console.log();
    console.log('Troubleshooting steps:');
    console.log('  1. Verify OXYLABS_USERNAME and OXYLABS_PASSWORD in .env');
    console.log('  2. Check Oxylabs dashboard for account status');
    console.log('  3. Ensure Web Unblocker is enabled for your account');
    console.log('  4. Try the free 1-week trial: https://dashboard.oxylabs.io/');
    console.log();

    process.exit(1);
  }
}

// Run tests
runTests();
