/**
 * Test bare Puppeteer without Crawlee
 */

import puppeteer from 'puppeteer';
import fs from 'fs/promises';

async function testBarePuppeteer() {
  console.log('🧪 Testing bare Puppeteer\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-features=IsolateOrigins,site-per-process',
    ],
  });

  const page = await browser.newPage();

  console.log('📡 Navigating to X login...');
  await page.goto('https://x.com/i/flow/login', {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });

  console.log('✅ Navigation complete\n');

  // Wait additional time for JavaScript
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Get page info
  const url = page.url();
  const title = await page.title();
  const bodyText = await page.evaluate(() => document.body.innerText);

  console.log('📍 Page Information:');
  console.log(`   URL: ${url}`);
  console.log(`   Title: ${title}`);
  console.log(`   Body text length: ${bodyText.length}`);
  console.log(`   Body text (first 500 chars):`);
  console.log(bodyText.substring(0, 500));
  console.log();

  // Check for login form
  const usernameInput = await page.$('input[autocomplete="username"]');
  console.log(`   Username input found: ${!!usernameInput}`);

  // Take screenshot
  await page.screenshot({ path: '/tmp/bare-puppeteer.png', fullPage: true });
  console.log('   📸 Screenshot: /tmp/bare-puppeteer.png\n');

  await browser.close();
}

testBarePuppeteer()
  .then(() => {
    console.log('✨ Test complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  });
