/**
 * Test Web Unblocker WITHOUT server-side rendering
 * Let the page load in our local browser instead
 */

import { config as dotenvConfig } from 'dotenv';
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenvConfig({ path: path.join(__dirname, '../../../.env') });

async function test() {
  console.log('🧪 Testing Web Unblocker WITHOUT X-Oxylabs-Render header\n');

  const username = process.env.OXYLABS_USERNAME;
  const password = process.env.OXYLABS_PASSWORD;

  const browser = await chromium.launch({
    headless: true,
    proxy: {
      server: 'https://unblock.oxylabs.io:60000',
      username,
      password
    },
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox'],
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    // NO X-Oxylabs-Render header - let browser render locally!
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  console.log('🌐 Loading https://www.google.com...');
  const start = Date.now();

  await page.goto('https://www.google.com', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  const loadTime = Date.now() - start;
  console.log(`   ✅ Loaded in ${(loadTime / 1000).toFixed(1)}s`);

  await browser.close();

  if (loadTime < 15000) {
    console.log('\n✅ MUCH FASTER! Web Unblocker as simple proxy works!');
    console.log('This means we can use local rendering + GraphQL interception!');
  } else {
    console.log('\n⚠️  Still slow even without rendering header');
  }
}

test().catch(console.error);
