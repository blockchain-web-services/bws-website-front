/**
 * Test Oxylabs Proxy Connection
 *
 * Simple test to verify Oxylabs proxy credentials work
 * by fetching a basic website (Google.com)
 *
 * Usage: node test-oxylabs-proxy.js
 */

import 'dotenv/config';
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Account configuration path
const CONFIG_PATH = path.join(__dirname, '../config/x-crawler-accounts.json');

/**
 * Load proxy configuration
 */
async function loadProxyConfig() {
  if (!existsSync(CONFIG_PATH)) {
    throw new Error(`Config not found at ${CONFIG_PATH}`);
  }

  const configData = await fs.readFile(CONFIG_PATH, 'utf-8');
  const config = JSON.parse(configData);

  // Get credentials from environment variables
  const username = process.env.OXYLABS_USERNAME;
  const password = process.env.OXYLABS_PASSWORD;

  if (!username || !password) {
    throw new Error(
      'Oxylabs credentials not found in environment variables.\n' +
      'Please set OXYLABS_USERNAME and OXYLABS_PASSWORD in .env file or GitHub Secrets.'
    );
  }

  if (username.includes('REPLACE') || password.includes('REPLACE')) {
    throw new Error('Oxylabs credentials still contain placeholder values');
  }

  // Get account for country code
  const account = config.accounts.find(a => a.status === 'active' && !a.suspended);
  const country = account?.country || config.proxy?.country || 'es';

  // Build proxy URL
  const proxyUrl = `http://customer-${username}-country-${country}:${password}@${config.proxy.host}:${config.proxy.port}`;

  console.log('📋 Proxy Configuration:');
  console.log(`   Host: ${config.proxy.host}:${config.proxy.port}`);
  console.log(`   Country: ${country}`);
  console.log(`   Username: ${username.substring(0, 3)}***${username.substring(username.length - 2)}`);
  console.log(`   Password: ${'*'.repeat(password.length)}`);
  console.log();

  return { proxyUrl, country };
}

/**
 * Test proxy connection by fetching Google.com
 */
async function testProxyConnection() {
  console.log('🧪 OXYLABS PROXY TEST');
  console.log('=' .repeat(60));
  console.log();

  let browser;

  try {
    // Load proxy config
    const { proxyUrl, country } = await loadProxyConfig();

    // Launch browser with proxy
    console.log('🚀 Launching browser with proxy...');
    browser = await chromium.launch({
      headless: true,
      proxy: {
        server: proxyUrl,
      },
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--no-sandbox',
      ],
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();

    // Test 1: Fetch Google.com
    console.log('🌐 Test 1: Fetching https://www.google.com...');
    const startTime = Date.now();

    try {
      await page.goto('https://www.google.com', {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });

      const loadTime = Date.now() - startTime;
      const title = await page.title();

      console.log(`   ✅ Success! (${loadTime}ms)`);
      console.log(`   Page title: "${title}"`);
      console.log();

      // Test 2: Check IP address (to verify proxy is working)
      console.log('🌐 Test 2: Checking IP address via api.ipify.org...');
      const ipStartTime = Date.now();

      await page.goto('https://api.ipify.org?format=json', {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });

      const ipLoadTime = Date.now() - ipStartTime;
      const content = await page.content();
      const ipMatch = content.match(/"ip":"([^"]+)"/);
      const ip = ipMatch ? ipMatch[1] : 'Could not extract IP';

      console.log(`   ✅ Success! (${ipLoadTime}ms)`);
      console.log(`   Your IP through proxy: ${ip}`);
      console.log();

      console.log('=' .repeat(60));
      console.log('✅ PROXY TEST PASSED');
      console.log('=' .repeat(60));
      console.log();
      console.log('The Oxylabs proxy is working correctly.');
      console.log('You can now use it for X/Twitter crawling.');

      await browser.close();
      process.exit(0);

    } catch (error) {
      const loadTime = Date.now() - startTime;
      console.log(`   ❌ Failed after ${loadTime}ms`);
      console.log(`   Error: ${error.message}`);
      console.log();
      throw error;
    }

  } catch (error) {
    if (browser) {
      await browser.close().catch(() => {});
    }

    console.log('=' .repeat(60));
    console.log('❌ PROXY TEST FAILED');
    console.log('=' .repeat(60));
    console.log();
    console.log('Error:', error.message);
    console.log();
    console.log('Possible causes:');
    console.log('  1. Invalid Oxylabs credentials');
    console.log('  2. Expired Oxylabs account or insufficient credits');
    console.log('  3. Proxy server unreachable or blocked');
    console.log('  4. Network/firewall blocking proxy connections');
    console.log();
    console.log('Please verify:');
    console.log('  - OXYLABS_USERNAME is correct in .env or GitHub Secrets');
    console.log('  - OXYLABS_PASSWORD is correct in .env or GitHub Secrets');
    console.log('  - Your Oxylabs account is active with available credits');
    console.log();

    process.exit(1);
  }
}

// Run test
testProxyConnection();
