/**
 * Test if a generic email can progress past username screen
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function testGenericEmail() {
  console.log('🧪 Testing with generic email to check if account is blocked...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  try {
    console.log('   🌐 Navigating to X login page...');
    await page.goto('https://x.com/i/flow/login', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    console.log('   ⏳ Waiting for page to render...');
    await new Promise(resolve => setTimeout(resolve, 8000));

    console.log('   📝 Entering test email: robert@gmail.com');
    await page.waitForSelector('input[autocomplete="username"]', { visible: true, timeout: 20000 });
    await page.type('input[autocomplete="username"]', 'robert@gmail.com', { delay: 50 });
    await new Promise(resolve => setTimeout(resolve, 1000));

    await page.screenshot({ path: '/tmp/test-before-submit.png' });
    console.log('   📸 Screenshot before submit: /tmp/test-before-submit.png');

    console.log('   🖱️  Clicking Next button...');
    // Find and click the Next button
    const buttons = await page.$$('button');
    for (const button of buttons) {
      const text = await button.evaluate(el => el.textContent);
      if (text.includes('Next')) {
        await button.click();
        break;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 5000));

    await page.screenshot({ path: '/tmp/test-after-submit.png' });
    console.log('   📸 Screenshot after submit: /tmp/test-after-submit.png');

    // Check if password field appears
    const hasPasswordField = await page.$('input[type="password"]') !== null;
    const hasError = await page.evaluate(() => {
      const text = document.body.textContent;
      return text.includes('Could not log you in') || text.includes('Please try again');
    });

    console.log('\n📊 Results:');
    console.log(`   Password field appeared: ${hasPasswordField ? '✅ YES' : '❌ NO'}`);
    console.log(`   Error message shown: ${hasError ? '❌ YES' : '✅ NO'}`);

    if (hasPasswordField) {
      console.log('\n✅ SUCCESS! Generic email progressed to password screen.');
      console.log('   This suggests the Altcoin934648 account may be flagged.');
    } else if (hasError) {
      console.log('\n⚠️  Generic email also blocked.');
      console.log('   This suggests IP/browser fingerprint is the issue.');
    }

    await browser.close();

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    await page.screenshot({ path: '/tmp/test-error.png' });
    console.log('   📸 Error screenshot: /tmp/test-error.png');
    await browser.close();
  }
}

testGenericEmail()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Test error:', error);
    process.exit(1);
  });
