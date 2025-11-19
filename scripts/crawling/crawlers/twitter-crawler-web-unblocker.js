/**
 * Twitter/X Crawler with Oxylabs Web Unblocker
 * Uses HTML parsing instead of GraphQL interception
 * Processes ONE profile at a time sequentially
 */

import { config as dotenvConfig } from 'dotenv';
import { chromium } from 'playwright';
import { parseProfileFromHTML, waitForProfileLoad } from './html-parser.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenvConfig({ path: path.join(__dirname, '../../../.env') });

// Account configuration path
const CONFIG_PATH = path.join(__dirname, '../config/x-crawler-accounts.json');

/**
 * Load account configuration
 */
async function loadConfig() {
  if (!existsSync(CONFIG_PATH)) {
    throw new Error(`Account config not found at ${CONFIG_PATH}`);
  }

  const configData = await fs.readFile(CONFIG_PATH, 'utf-8');
  const config = JSON.parse(configData);

  // Get first active account
  const account = config.accounts.find(a => a.status === 'active' && !a.suspended);

  if (!account) {
    throw new Error('No active accounts found in configuration');
  }

  if (!account.cookies || !account.cookies.auth_token || !account.cookies.ct0) {
    throw new Error(`Account ${account.id} has invalid cookies`);
  }

  // Get Oxylabs credentials
  const username = process.env.OXYLABS_USERNAME;
  const password = process.env.OXYLABS_PASSWORD;

  if (!username || !password) {
    throw new Error(
      'OXYLABS_USERNAME and OXYLABS_PASSWORD must be set in .env file or GitHub Secrets'
    );
  }

  return { config, account, oxyUsername: username, oxyPassword: password };
}

/**
 * Create browser with Web Unblocker proxy
 */
async function createBrowser(oxyUsername, oxyPassword) {
  console.log('🚀 Launching browser with Oxylabs Web Unblocker...');

  const browser = await chromium.launch({
    headless: true,
    proxy: {
      server: 'https://unblock.oxylabs.io:60000',
      username: oxyUsername,
      password: oxyPassword
    },
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--no-sandbox',
    ],
  });

  return browser;
}

/**
 * Fetch single profile
 */
async function fetchProfile(username, account, browser) {
  console.log(`\n🔍 Fetching profile for @${username}...`);

  // Prepare cookies
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

  let context = null;

  try {
    // Create context with Web Unblocker settings
    context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      extraHTTPHeaders: {
        'X-Oxylabs-Render': 'html',  // Enable JavaScript rendering
        'x-csrf-token': account.cookies.ct0,
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      },
      ignoreHTTPSErrors: true,  // Required for Web Unblocker
    });

    // Add cookies
    console.log('   🍪 Adding authentication cookies...');
    await context.addCookies(cookies);

    // Create page
    const page = await context.newPage();

    // Navigate to profile
    console.log(`   🌐 Loading https://x.com/${username}...`);
    const startTime = Date.now();

    await page.goto(`https://x.com/${username}`, {
      waitUntil: 'networkidle',
      timeout: 180000,  // 3 minutes for rendering
    });

    const loadTime = Date.now() - startTime;
    console.log(`   ✅ Page loaded (${(loadTime / 1000).toFixed(1)}s)`);

    // With X-Oxylabs-Render, the page is pre-rendered, so content should be ready
    // Just wait a small moment for any final rendering
    await page.waitForTimeout(2000);

    // Extract profile data from HTML
    console.log('   📊 Extracting profile data...');
    const profile = await parseProfileFromHTML(page, username);

    if (profile) {
      console.log(`   ✅ Successfully extracted @${profile.username}`);
      console.log(`      Followers: ${profile.public_metrics.followers_count.toLocaleString()}`);
      console.log(`      Following: ${profile.public_metrics.following_count.toLocaleString()}`);
    }

    await context.close();

    return profile;

  } catch (error) {
    console.error(`   ❌ Error fetching @${username}:`, error.message);

    if (context) {
      await context.close().catch(() => {});
    }

    return null;
  }
}

/**
 * Fetch multiple profiles
 */
export async function fetchProfiles(usernames) {
  console.log('🐦 TWITTER PROFILE CRAWLER - WEB UNBLOCKER');
  console.log('=' .repeat(60));
  console.log();

  if (!Array.isArray(usernames) || usernames.length === 0) {
    throw new Error('usernames must be a non-empty array');
  }

  console.log(`📋 Profiles to fetch: ${usernames.length}`);
  usernames.forEach((u, i) => console.log(`   ${i + 1}. @${u}`));
  console.log();

  // Load configuration
  const { account, oxyUsername, oxyPassword } = await loadConfig();

  console.log(`🔐 Using account: @${account.username || account.id}`);
  console.log(`🌐 Proxy: Oxylabs Web Unblocker (unblock.oxylabs.io:60000)`);
  console.log(`🎨 Method: HTML parsing (pre-rendered)`);
  console.log();

  // Create browser once
  const browser = await createBrowser(oxyUsername, oxyPassword);

  const results = [];

  try {
    // Process profiles sequentially
    for (let i = 0; i < usernames.length; i++) {
      const username = usernames[i];

      console.log(`\n[${ i + 1}/${usernames.length}] Processing @${username}...`);

      const profile = await fetchProfile(username, account, browser);

      if (profile) {
        results.push(profile);
      } else {
        console.log(`   ⚠️  Skipping @${username} (not found or error)`);
      }

      // Small delay between requests to avoid rate limiting
      if (i < usernames.length - 1) {
        console.log('   ⏱️  Waiting 2s before next profile...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    await browser.close();

    console.log();
    console.log('=' .repeat(60));
    console.log('✅ CRAWLING COMPLETE');
    console.log('=' .repeat(60));
    console.log(`   Processed: ${usernames.length}`);
    console.log(`   Successful: ${results.length}`);
    console.log(`   Failed: ${usernames.length - results.length}`);
    console.log();

    return results;

  } catch (error) {
    await browser.close().catch(() => {});
    throw error;
  }
}

export default fetchProfiles;
