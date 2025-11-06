/**
 * Test different Puppeteer configurations to find what works
 */

import puppeteer from 'puppeteer';

async function testConfiguration(name, launchOptions) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${name}`);
  console.log('='.repeat(60));

  try {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.goto('https://x.com/i/flow/login', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    const title = await page.title();
    const bodyText = await page.evaluate(() => document.body.innerText);
    const usernameInput = await page.$('input[autocomplete="username"]');

    console.log(`   Title: ${title}`);
    console.log(`   Body text (first 100 chars): ${bodyText.substring(0, 100)}`);
    console.log(`   Login form found: ${!!usernameInput}`);

    const screenshotPath = `/tmp/test-${name.toLowerCase().replace(/\s+/g, '-')}.png`;
    await page.screenshot({ path: screenshotPath });
    console.log(`   Screenshot: ${screenshotPath}`);

    await browser.close();

    return !!usernameInput;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Testing Puppeteer Configurations\n');

  const tests = [
    {
      name: 'Default (no args)',
      options: {
        headless: true,
      },
    },
    {
      name: 'With automation flags disabled',
      options: {
        headless: true,
        args: [
          '--disable-blink-features=AutomationControlled',
        ],
      },
    },
    {
      name: 'With full stealth args',
      options: {
        headless: true,
        args: [
          '--disable-blink-features=AutomationControlled',
          '--disable-features=IsolateOrigins,site-per-process',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
        ],
      },
    },
    {
      name: 'Non-headless (visible browser)',
      options: {
        headless: false,
        args: [
          '--disable-blink-features=AutomationControlled',
        ],
      },
    },
    {
      name: 'New headless mode',
      options: {
        headless: 'new',
        args: [
          '--disable-blink-features=AutomationControlled',
        ],
      },
    },
  ];

  const results = [];

  for (const test of tests) {
    const success = await testConfiguration(test.name, test.options);
    results.push({ name: test.name, success });
  }

  console.log('\n' + '='.repeat(60));
  console.log('RESULTS SUMMARY');
  console.log('='.repeat(60));

  results.forEach(({ name, success }) => {
    console.log(`${success ? '✅' : '❌'} ${name}`);
  });

  console.log();
}

runTests()
  .then(() => {
    console.log('✨ All tests complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Tests failed:', error);
    process.exit(1);
  });
