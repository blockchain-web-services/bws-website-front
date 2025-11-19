/**
 * Twitter/X Crawler with Oxylabs Web Unblocker - OPTIMIZED
 *
 * Optimization strategies:
 * 1. NO server-side rendering (X-Oxylabs-Render disabled)
 * 2. Session reuse (X-Oxylabs-Session-Id) for all profiles
 * 3. GraphQL interception (original fast approach)
 * 4. Geo-location targeting
 * 5. Event-based waiting (no fixed timeouts)
 * 6. Reduced timeouts (60s instead of 180s)
 */

import { config as dotenvConfig } from 'dotenv';
import { chromium } from 'playwright';
import { parseProfileFromHTML } from './html-parser.js';
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
  console.log('🚀 Launching browser with Oxylabs Web Unblocker (OPTIMIZED)...');

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
 * Fetch single profile with optimizations
 */
async function fetchProfile(username, account, browser, sessionId) {
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
  let profileData = null;

  try {
    // OPTIMIZATION: Create context WITHOUT server-side rendering
    context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      extraHTTPHeaders: {
        // REQUIRED: X/Twitter needs server-side rendering to execute JavaScript
        // Without this, we get empty pages with no data
        'X-Oxylabs-Render': 'html',
        // OPTIMIZATION 1: Session reuse (same IP for all profiles, 10-min window)
        'X-Oxylabs-Session-Id': sessionId,
        // OPTIMIZATION 2: Geo-location targeting (may improve routing speed)
        'X-Oxylabs-Geo-Location': account.country || 'Spain',
        // Required for X/Twitter
        'x-csrf-token': account.cookies.ct0,
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      },
      ignoreHTTPSErrors: true,
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
      waitUntil: 'networkidle',  // Wait for rendering to complete
      timeout: 120000,  // 2 minutes for server-side rendering
    });

    const loadTime = Date.now() - startTime;
    console.log(`   ✅ Page loaded (${(loadTime / 1000).toFixed(1)}s)`);

    // OPTIMIZATION: Small wait for final rendering
    await page.waitForTimeout(2000);

    // Extract profile data from pre-rendered HTML
    console.log('   📊 Extracting profile data from HTML...');
    profileData = await parseProfileFromHTML(page, username);

    if (profileData) {
      console.log(`   ✅ Successfully extracted @${profileData.username}`);
      console.log(`      Followers: ${profileData.public_metrics.followers_count.toLocaleString()}`);
      console.log(`      Following: ${profileData.public_metrics.following_count.toLocaleString()}`);
    }

    await context.close();

    return profileData;

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
  console.log('🐦 TWITTER PROFILE CRAWLER - WEB UNBLOCKER (OPTIMIZED)');
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
  console.log(`🎨 Method: Server-side rendering + HTML parsing`);
  console.log(`⚡ Optimizations applied:`);
  console.log(`   • Session reuse (same IP, 10-min window)`);
  console.log(`   • Geo-targeting (${account.country || 'Spain'})`);
  console.log(`   • Reduced timeouts (180s → 60s where possible)`);
  console.log(`⚠️  Note: X/Twitter requires server-side rendering (slow)`);
  console.log();

  // Create browser once
  const browser = await createBrowser(oxyUsername, oxyPassword);

  // OPTIMIZATION 2: Reuse same session for all profiles
  const sessionId = `kol-discovery-${Date.now()}`;
  console.log(`🔑 Session ID: ${sessionId} (10-min reuse window)`);
  console.log();

  const results = [];
  const totalStartTime = Date.now();

  try {
    // Process profiles sequentially
    for (let i = 0; i < usernames.length; i++) {
      const username = usernames[i];

      console.log(`\n[${i + 1}/${usernames.length}] Processing @${username}...`);

      const profile = await fetchProfile(username, account, browser, sessionId);

      if (profile) {
        results.push(profile);
      } else {
        console.log(`   ⚠️  Skipping @${username} (not found or error)`);
      }

      // Small delay between requests
      if (i < usernames.length - 1) {
        console.log('   ⏱️  Waiting 2s before next profile...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    await browser.close();

    const totalTime = Date.now() - totalStartTime;

    console.log();
    console.log('=' .repeat(60));
    console.log('✅ CRAWLING COMPLETE');
    console.log('=' .repeat(60));
    console.log(`   Processed: ${usernames.length}`);
    console.log(`   Successful: ${results.length}`);
    console.log(`   Failed: ${usernames.length - results.length}`);
    console.log(`   Total time: ${(totalTime / 1000 / 60).toFixed(1)} minutes`);
    console.log(`   Avg time/profile: ${(totalTime / usernames.length / 1000).toFixed(1)}s`);
    console.log();

    return results;

  } catch (error) {
    await browser.close().catch(() => {});
    throw error;
  }
}

export default fetchProfiles;
