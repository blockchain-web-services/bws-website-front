/**
 * Automated X/Twitter Login using ScrapFly js_scenario
 * Uses browser automation to fill login form and capture cookies
 */

import ScrapFlyClient from './utils/scrapfly-client.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, 'config/x-crawler-accounts.json');
const COOKIE_PATH = path.join(__dirname, 'config/x-cookies.json');

async function loginWithScrapFly() {
  console.log('🔐 Automated X/Twitter Login via ScrapFly\n');

  // Load config
  const configData = await fs.readFile(CONFIG_PATH, 'utf-8');
  const config = JSON.parse(configData);

  const apiKey = config.scrapfly?.apiKey || config.scrapfly?.api_key;
  if (!apiKey) {
    console.error('❌ ScrapFly API key not found!');
    process.exit(1);
  }

  // Get first account credentials
  if (!config.accounts || config.accounts.length === 0) {
    console.error('❌ No X accounts configured!');
    process.exit(1);
  }

  const account = config.accounts[0];
  console.log(`📱 Logging in as: ${account.username}\n`);

  const client = new ScrapFlyClient(apiKey);

  try {
    // Step 1: Define the login scenario
    const loginScenario = [
      // Wait for login page to load
      { "wait_for_selector": { "selector": "input[name='text']", "timeout": 10000 } },

      // Fill username
      { "fill": { "selector": "input[name='text']", "value": account.username } },

      // Click "Next" button
      { "click": { "selector": "div[role='button']:has-text('Next')", "ignore_if_not_visible": true } },

      // Alternative: click any visible Next button
      { "click": { "selector": "button:has-text('Next')", "ignore_if_not_visible": true } },

      // Wait for password field
      { "wait": 2000 },
      { "wait_for_selector": { "selector": "input[name='password']", "timeout": 10000 } },

      // Fill password
      { "fill": { "selector": "input[name='password']", "value": account.password } },

      // Click "Log in" button
      { "click": { "selector": "div[data-testid='LoginForm_Login_Button']" } },

      // Wait for navigation to home
      { "wait_for_navigation": { "timeout": 10000 } },

      // Wait for home timeline to confirm login
      { "wait_for_selector": { "selector": "div[data-testid='primaryColumn']", "timeout": 10000 } },
    ];

    // Convert scenario to base64
    const scenarioJson = JSON.stringify(loginScenario);
    const scenarioBase64 = Buffer.from(scenarioJson).toString('base64');

    console.log('🎬 Executing login scenario...\n');
    console.log('   Steps:');
    console.log('   1. Navigate to login page');
    console.log('   2. Fill username');
    console.log('   3. Click Next');
    console.log('   4. Fill password');
    console.log('   5. Click Log in');
    console.log('   6. Wait for home timeline\n');

    // Step 2: Execute the scenario
    const result = await client.scrape('https://x.com/login', {
      renderJs: true,
      jsScenario: scenarioBase64,
      format: 'json',
      session: 'x-login-session',  // Use session to maintain cookies
      timeout: 90000,  // 90 seconds
      retry: false,  // Don't retry on failure
      debug: true,
    });

    console.log('✅ Scenario executed!\n');

    // Step 3: Check scenario results
    const jsScenarioResult = result.result.browser_data?.js_scenario;

    if (jsScenarioResult) {
      console.log(`📊 Scenario Stats:`);
      console.log(`   Duration: ${jsScenarioResult.duration}s`);
      console.log(`   Steps executed: ${jsScenarioResult.executed}/${jsScenarioResult.steps.length}\n`);

      // Check each step
      console.log('📝 Step Results:');
      jsScenarioResult.steps.forEach((step, i) => {
        const status = step.success ? '✅' : '❌';
        console.log(`   ${i + 1}. ${status} ${step.action} (${step.duration}s)`);
        if (!step.success && step.result) {
          console.log(`      Error: ${step.result}`);
        }
      });
      console.log();
    }

    // Step 4: Extract cookies from the response
    const xhrCalls = result.result.browser_data?.xhr_call || [];

    // Get cookies from XHR calls
    let cookies = [];
    for (const xhr of xhrCalls) {
      if (xhr.request && xhr.request.headers && xhr.request.headers.cookie) {
        const cookieString = xhr.request.headers.cookie;
        cookies = cookieString.split(';').map(c => c.trim());
        break;
      }
    }

    // Also check Set-Cookie headers from responses
    for (const xhr of xhrCalls) {
      if (xhr.response && xhr.response.headers && xhr.response.headers['set-cookie']) {
        const setCookies = Array.isArray(xhr.response.headers['set-cookie'])
          ? xhr.response.headers['set-cookie']
          : [xhr.response.headers['set-cookie']];

        setCookies.forEach(cookie => {
          const cookieParts = cookie.split(';')[0];  // Get just the name=value part
          if (!cookies.includes(cookieParts)) {
            cookies.push(cookieParts);
          }
        });
      }
    }

    if (cookies.length === 0) {
      console.log('⚠️  No cookies captured from XHR calls');
      console.log('   Checking if login was successful...\n');

      // Check if we're on the home page
      const finalUrl = result.result.url;
      console.log(`   Final URL: ${finalUrl}`);

      if (finalUrl.includes('/home')) {
        console.log('   ✅ Login appears successful (on home page)');
        console.log('   ℹ️  Cookies are maintained in session: x-login-session');
        console.log('   💡 Use this session for subsequent requests\n');

        // Save session info
        const sessionData = {
          capturedAt: new Date().toISOString(),
          sessionName: 'x-login-session',
          account: account.username,
          method: 'js_scenario_automated',
          note: 'Use session=x-login-session for authenticated requests',
        };

        await fs.writeFile(COOKIE_PATH, JSON.stringify(sessionData, null, 2));
        console.log(`💾 Session info saved to: ${COOKIE_PATH}`);

        return { success: true, session: 'x-login-session' };
      } else {
        console.log('   ❌ Login may have failed (not on home page)');
      }
    } else {
      // Save cookies
      const cookieString = cookies.join('; ');
      console.log(`🍪 Captured ${cookies.length} cookies\n`);

      // Check for essential cookies
      const hasAuthToken = cookies.some(c => c.startsWith('auth_token='));
      const hasCt0 = cookies.some(c => c.startsWith('ct0='));

      console.log('🔑 Essential cookies:');
      console.log(`   auth_token: ${hasAuthToken ? '✅' : '❌'}`);
      console.log(`   ct0: ${hasCt0 ? '✅' : '❌'}\n`);

      const cookieData = {
        capturedAt: new Date().toISOString(),
        scrapflyFormat: cookieString,
        cookieCount: cookies.length,
        method: 'js_scenario_automated',
        account: account.username,
        sessionName: 'x-login-session',
        hasAuthToken,
        hasCt0,
      };

      await fs.writeFile(COOKIE_PATH, JSON.stringify(cookieData, null, 2));
      console.log(`💾 Cookies saved to: ${COOKIE_PATH}`);

      if (hasAuthToken && hasCt0) {
        console.log('\n🎉 Login successful!');
        console.log('\n✅ You can now:');
        console.log('   1. Use session=x-login-session for searches');
        console.log('   2. Or use the saved cookies directly');
        console.log('\n🧪 Test authenticated search:');
        console.log('   node scripts/kols/test-scrapfly-search.js\n');

        return { success: true, cookies: cookieString, session: 'x-login-session' };
      }
    }

    // Check HTML content for error messages
    const html = result.result.content || '';
    if (html.includes('Wrong password') || html.includes('incorrect')) {
      console.error('\n❌ Login failed: Wrong password');
    } else if (html.includes('suspended')) {
      console.error('\n❌ Login failed: Account suspended');
    } else if (html.includes('Enter your phone')) {
      console.error('\n❌ Login failed: Additional verification required');
      console.error('   X is asking for phone/email verification');
      console.error('   You may need to verify this account manually first');
    } else {
      console.log('\n⚠️  Login status unclear - check the scenario results above');
    }

    return { success: false };

  } catch (error) {
    console.error('\n❌ Login failed:', error.message);
    if (error.stack) console.error(error.stack);
    return { success: false, error: error.message };
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  loginWithScrapFly()
    .then((result) => {
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export default loginWithScrapFly;
