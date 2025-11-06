/**
 * Test Oxylabs proxy connection
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

puppeteer.use(StealthPlugin());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, 'config/x-crawler-accounts.json');

async function testProxy() {
  console.log('🧪 Testing Oxylabs proxy connection...\n');

  // Load config
  const configData = await fs.readFile(CONFIG_PATH, 'utf-8');
  const config = JSON.parse(configData);

  const sessionId = 'session-test';
  const proxyUrl = 'pr.oxylabs.io:7777';
  const proxyUsername = `customer-${config.proxy.username}-sessid-${sessionId}`;
  const proxyPassword = config.proxy.password;

  console.log(`   Proxy: ${proxyUrl}`);
  console.log(`   Session: ${sessionId}\n`);

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--proxy-server=${proxyUrl}`
    ],
  });

  const page = await browser.newPage();

  // Authenticate
  await page.authenticate({
    username: proxyUsername,
    password: proxyPassword,
  });

  try {
    console.log('   📡 Testing with httpbin.org/ip...');
    await page.goto('https://httpbin.org/ip', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    const body = await page.evaluate(() => document.body.textContent);
    console.log('   ✅ Proxy response:', body);

    console.log('\n   🌐 Testing with x.com...');
    await page.goto('https://x.com/i/flow/login', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    console.log('   ⏳ Waiting 15 seconds for page to fully render...');
    await new Promise(resolve => setTimeout(resolve, 15000));
    await page.screenshot({ path: '/tmp/proxy-test-xcom.png' });

    const url = page.url();
    const hasLoginForm = await page.$('input[autocomplete="username"]') !== null;

    console.log(`   Current URL: ${url}`);
    console.log(`   Login form visible: ${hasLoginForm ? '✅ YES' : '❌ NO'}`);

    if (hasLoginForm) {
      console.log('\n✅ SUCCESS! Proxy works for X.com');
    } else {
      console.log('\n⚠️  Proxy connects but X.com shows different page');
    }

    await page.screenshot({ path: '/tmp/proxy-test.png' });
    console.log('   📸 Screenshot: /tmp/proxy-test.png');

  } catch (error) {
    console.error('\n❌ Proxy test failed:', error.message);
    await page.screenshot({ path: '/tmp/proxy-error.png' });
    console.log('   📸 Error screenshot: /tmp/proxy-error.png');
  } finally {
    await browser.close();
  }
}

testProxy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Test error:', error);
    process.exit(1);
  });
