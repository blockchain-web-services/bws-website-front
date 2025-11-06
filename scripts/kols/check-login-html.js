/**
 * Get raw HTML from login page
 */

import ScrapFlyClient from './utils/scrapfly-client.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, 'config/x-crawler-accounts.json');

async function checkLoginHTML() {
  const configData = await fs.readFile(CONFIG_PATH, 'utf-8');
  const config = JSON.parse(configData);
  const apiKey = config.scrapfly?.apiKey || config.scrapfly?.api_key;

  const client = new ScrapFlyClient(apiKey);

  try {
    console.log('🔍 Fetching X login page HTML...\n');

    // Get raw HTML
    const result = await client.scrape('https://x.com/login', {
      renderJs: true,
      format: 'json',  // We still need JSON for the content field
      retry: false,
      timeout: 60000,
    });

    // Save actual HTML content
    const html = result.result.content;
    await fs.writeFile('/tmp/x-login-raw.html', html);

    console.log(`✅ Saved HTML: ${html.length} bytes`);
    console.log(`   File: /tmp/x-login-raw.html\n`);

    // Look for key elements in HTML
    console.log('🔍 Searching for login elements...\n');

    // Check for various input selectors
    const checks = [
      ['Username input (name="text")', /<input[^>]*name=["']text["']/],
      ['Username input (autocomplete="username")', /<input[^>]*autocomplete=["']username["']/],
      ['Email input', /<input[^>]*type=["']email["']/],
      ['Password input', /<input[^>]*type=["']password["']/],
      ['Password input (name="password")', /<input[^>]*name=["']password["']/],
      ['Any input field', /<input[^>]/],
      ['Login button', /Log in|Sign in/i],
      ['Next button', /Next/i],
    ];

    checks.forEach(([label, pattern]) => {
      const found = pattern.test(html);
      console.log(`   ${found ? '✅' : '❌'} ${label}`);
    });

    console.log('\n💡 Debug tip: Open /tmp/x-login-raw.html in a text editor');
    console.log('   Search for <input to find all input fields\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkLoginHTML();
