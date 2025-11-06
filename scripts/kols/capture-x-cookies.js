/**
 * Manual X/Twitter Cookie Capture Tool
 * Opens a browser for manual login, then saves cookies for ScrapFly
 */

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COOKIE_FILE = path.join(__dirname, 'config/x-cookies.json');

async function captureCookies() {
  console.log('🍪 X/Twitter Cookie Capture Tool\n');
  console.log('This tool will help you manually log in to X and save cookies for ScrapFly.\n');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 900 },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
  });

  const page = await browser.newPage();

  // Set user agent
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  console.log('📱 Opening X login page...\n');
  console.log('👉 INSTRUCTIONS:');
  console.log('   1. Log in to X manually in the browser window');
  console.log('   2. Complete any verification steps');
  console.log('   3. Once you see your home timeline, come back here');
  console.log('   4. Press ENTER in this terminal to save cookies\n');

  await page.goto('https://x.com/login', { waitUntil: 'networkidle2' });

  // Wait for user to press Enter
  await new Promise((resolve) => {
    process.stdin.once('data', resolve);
  });

  console.log('\n📸 Capturing cookies...');

  // Get all cookies
  const cookies = await page.cookies();

  // Format for ScrapFly (Cookie header format)
  const cookieHeader = cookies
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join('; ');

  // Save both formats
  const cookieData = {
    capturedAt: new Date().toISOString(),
    puppeteerFormat: cookies,
    scrapflyFormat: cookieHeader,
    cookieCount: cookies.length,
  };

  await fs.writeFile(COOKIE_FILE, JSON.stringify(cookieData, null, 2));

  console.log(`\n✅ Cookies saved to: ${COOKIE_FILE}`);
  console.log(`   Total cookies: ${cookies.length}`);
  console.log(`\n🔍 Important cookies captured:`);

  // Show key cookies
  const keyCookies = ['auth_token', 'ct0', 'guest_id'];
  keyCookies.forEach(name => {
    const cookie = cookies.find(c => c.name === name);
    if (cookie) {
      console.log(`   ✓ ${name}: ${cookie.value.substring(0, 20)}...`);
    }
  });

  console.log('\n🎉 Done! You can now use these cookies with ScrapFly.');
  console.log('\n💡 Test with: node scripts/kols/test-scrapfly-auth.js');

  await browser.close();
  process.exit(0);
}

captureCookies().catch((error) => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
