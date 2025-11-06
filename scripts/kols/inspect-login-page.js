/**
 * Inspect X Login Page to find correct selectors
 */

import ScrapFlyClient from './utils/scrapfly-client.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, 'config/x-crawler-accounts.json');

async function inspectLoginPage() {
  console.log('🔍 Inspecting X Login Page\n');

  const configData = await fs.readFile(CONFIG_PATH, 'utf-8');
  const config = JSON.parse(configData);
  const apiKey = config.scrapfly?.apiKey || config.scrapfly?.api_key;

  const client = new ScrapFlyClient(apiKey);

  try {
    // Scrape login page with rendering
    const result = await client.scrape('https://x.com/login', {
      renderJs: true,
      format: 'json',
      retry: false,
      timeout: 60000,
      debug: false,  // Don't need debug, adds 5s
    });

    console.log('✅ Page loaded\n');

    // Save HTML
    const html = result.result.content || '';
    await fs.writeFile('/tmp/x-login-page.html', html);
    console.log('💾 HTML saved to: /tmp/x-login-page.html');
    console.log(`   Size: ${html.length} bytes\n`);

    // Look for input fields
    console.log('🔍 Searching for input fields...\n');

    const inputs = [
      { type: 'text', pattern: /<input[^>]*name=["']text["'][^>]*>/gi },
      { type: 'email', pattern: /<input[^>]*type=["']email["'][^>]*>/gi },
      { type: 'password', pattern: /<input[^>]*name=["']password["'][^>]*>/gi },
      { type: 'username', pattern: /<input[^>]*name=["']username["'][^>]*>/gi },
    ];

    inputs.forEach(({ type, pattern }) => {
      const matches = html.match(pattern);
      if (matches) {
        console.log(`   ✅ Found ${type} input: ${matches.length} match(es)`);
        matches.slice(0, 2).forEach(m => {
          console.log(`      ${m.substring(0, 100)}...`);
        });
      } else {
        console.log(`   ❌ No ${type} input found`);
      }
    });

    // Look for buttons
    console.log('\n🔍 Searching for buttons...\n');

    const buttons = [
      { type: 'Next', pattern: /<[^>]*role=["']button["'][^>]*>.*?Next.*?</gi },
      { type: 'Log in', pattern: /<[^>]*role=["']button["'][^>]*>.*?Log in.*?</gi },
      { type: 'Login', pattern: /<button[^>]*>.*?Log.*?in.*?</gi },
    ];

    buttons.forEach(({ type, pattern }) => {
      const matches = html.match(pattern);
      if (matches) {
        console.log(`   ✅ Found "${type}" button: ${matches.length} match(es)`);
      } else {
        console.log(`   ❌ No "${type}" button found`);
      }
    });

    // Check for specific test IDs
    console.log('\n🔍 Checking for data-testid attributes...\n');

    const testIds = [
      'LoginForm_Login_Button',
      'google_sign_in_container',
      'apple_sign_in_container',
    ];

    testIds.forEach(testId => {
      const pattern = new RegExp(`data-testid=["']${testId}["']`, 'i');
      if (pattern.test(html)) {
        console.log(`   ✅ Found: ${testId}`);
      } else {
        console.log(`   ❌ Missing: ${testId}`);
      }
    });

    console.log('\n📝 Recommendations:');
    console.log('   1. Review /tmp/x-login-page.html for actual selectors');
    console.log('   2. X login flow may require:');
    console.log('      • Email/phone/username on first page');
    console.log('      • Password on second page after clicking Next');
    console.log('      • Possible CAPTCHA or verification challenges');
    console.log('   3. Consider using manual cookie capture instead');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

inspectLoginPage()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
