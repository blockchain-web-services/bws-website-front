/**
 * Test puppeteer-extra with stealth plugin
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Add stealth plugin
puppeteer.use(StealthPlugin());

async function testStealth() {
  console.log('🥷 Testing Puppeteer with Stealth Plugin\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });

  const page = await browser.newPage();

  console.log('📡 Navigating to X login...');
  await page.goto('https://x.com/i/flow/login', {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });

  console.log('✅ Navigation complete\n');

  await new Promise(resolve => setTimeout(resolve, 5000));

  const url = page.url();
  const title = await page.title();
  const bodyText = await page.evaluate(() => document.body.innerText);
  const usernameInput = await page.$('input[autocomplete="username"]');

  console.log('📍 Page Information:');
  console.log(`   URL: ${url}`);
  console.log(`   Title: ${title}`);
  console.log(`   Body text (first 150 chars): ${bodyText.substring(0, 150)}`);
  console.log(`   Login form found: ${!!usernameInput ? '✅' : '❌'}`);

  await page.screenshot({ path: '/tmp/stealth-test.png', fullPage: true });
  console.log(`   📸 Screenshot: /tmp/stealth-test.png\n`);

  await browser.close();

  return !!usernameInput;
}

testStealth()
  .then((success) => {
    if (success) {
      console.log('🎉 SUCCESS! Stealth plugin bypassed headless detection!');
    } else {
      console.log('❌ Stealth plugin did not bypass detection');
    }
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  });
