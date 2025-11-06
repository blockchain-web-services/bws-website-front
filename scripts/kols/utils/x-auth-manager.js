/**
 * X/Twitter Authentication Manager
 * Handles multi-account rotation, cookie management, and auto-login
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Add stealth plugin to hide automation
puppeteer.use(StealthPlugin());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, '../config/x-crawler-accounts.json');
const COOKIES_DIR = path.join(__dirname, '../data/cookies');

class XAuthManager {
  constructor() {
    this.config = null;
    this.accounts = [];
  }

  /**
   * Initialize the auth manager
   */
  async initialize() {
    await this.loadConfig();
    console.log(`🔐 Auth Manager initialized with ${this.accounts.length} accounts`);
  }

  /**
   * Load account configuration
   */
  async loadConfig() {
    try {
      const configData = await fs.readFile(CONFIG_PATH, 'utf-8');
      this.config = JSON.parse(configData);
      this.accounts = this.config.accounts;
    } catch (error) {
      throw new Error(
        `Failed to load account config from ${CONFIG_PATH}. ` +
        `Please create it from x-crawler-accounts.json.template`
      );
    }
  }

  /**
   * Save updated account configuration
   */
  async saveConfig() {
    const configData = JSON.stringify(this.config, null, 2);
    await fs.writeFile(CONFIG_PATH, configData, 'utf-8');
  }

  /**
   * Get next available account using rotation strategy
   */
  async getNextAccount() {
    const { cooldownMinutes } = this.config.rotation;
    const now = new Date();

    // Filter available accounts
    const availableAccounts = this.accounts.filter(account => {
      // Must be active and not suspended
      if (account.status !== 'active' || account.suspended) {
        return false;
      }

      // Check rate limit
      if (account.rateLimitedUntil && new Date(account.rateLimitedUntil) > now) {
        return false;
      }

      // Check cooldown
      if (account.lastUsed) {
        const minutesSinceUse = (now - new Date(account.lastUsed)) / 60000;
        if (minutesSinceUse < cooldownMinutes) {
          return false;
        }
      }

      return true;
    });

    if (availableAccounts.length === 0) {
      throw new Error('No available accounts. All accounts are suspended, rate-limited, or in cooldown.');
    }

    // Sort by least recently used
    availableAccounts.sort((a, b) => {
      const aTime = a.lastUsed ? new Date(a.lastUsed).getTime() : 0;
      const bTime = b.lastUsed ? new Date(b.lastUsed).getTime() : 0;
      return aTime - bTime;
    });

    const selected = availableAccounts[0];
    console.log(`🔄 Selected account: ${selected.id} (last used: ${selected.lastUsed || 'never'})`);

    return selected;
  }

  /**
   * Mark account as used and update stats
   */
  async markUsed(accountId) {
    const account = this.accounts.find(a => a.id === accountId);
    if (!account) return;

    account.lastUsed = new Date().toISOString();
    account.usageCount = (account.usageCount || 0) + 1;

    await this.saveConfig();
  }

  /**
   * Mark account as rate-limited
   */
  async markRateLimited(accountId, retryAfterSeconds = 3600) {
    const account = this.accounts.find(a => a.id === accountId);
    if (!account) return;

    const rateLimitUntil = new Date(Date.now() + retryAfterSeconds * 1000);
    account.rateLimitedUntil = rateLimitUntil.toISOString();

    console.log(`⏳ Account ${accountId} rate-limited until ${rateLimitUntil.toLocaleString()}`);
    await this.saveConfig();
  }

  /**
   * Mark account as suspended
   */
  async markSuspended(accountId, reason = 'Unknown') {
    const account = this.accounts.find(a => a.id === accountId);
    if (!account) return;

    account.suspended = true;
    account.status = 'suspended';
    account.notes = `Suspended: ${reason}`;

    console.log(`🚫 Account ${accountId} marked as suspended: ${reason}`);
    await this.saveConfig();
  }

  /**
   * Get path to cookie file for account
   */
  getCookieFilePath(accountId) {
    return path.join(COOKIES_DIR, `${accountId}.json`);
  }

  /**
   * Load cookies for account
   */
  async loadCookies(accountId) {
    const cookiePath = this.getCookieFilePath(accountId);

    if (!existsSync(cookiePath)) {
      return null;
    }

    try {
      const cookieData = await fs.readFile(cookiePath, 'utf-8');
      const data = JSON.parse(cookieData);

      // Check if cookies are expired
      if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
        console.log(`🔄 Cookies expired for ${accountId}`);
        return null;
      }

      return data.cookies;
    } catch (error) {
      console.error(`Failed to load cookies for ${accountId}:`, error.message);
      return null;
    }
  }

  /**
   * Save cookies for account
   */
  async saveCookies(accountId, cookies) {
    const cookiePath = this.getCookieFilePath(accountId);

    // Find auth_token expiration
    const authToken = cookies.find(c => c.name === 'auth_token');
    const expiresAt = authToken?.expires
      ? new Date(authToken.expires * 1000).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // Default: 30 days

    const cookieData = {
      account_id: accountId,
      cookies,
      lastValidated: new Date().toISOString(),
      expiresAt
    };

    await fs.writeFile(cookiePath, JSON.stringify(cookieData, null, 2), 'utf-8');
    console.log(`💾 Saved cookies for ${accountId} (expires: ${expiresAt})`);
  }

  /**
   * Login to X/Twitter and save cookies using puppeteer-extra with stealth
   */
  async login(account, options = {}) {
    const { headless = true, timeout = 60000 } = options;

    console.log(`🔐 Logging in account: ${account.username}`);

    // Get proxy configuration for this account
    let proxyUrl = null;
    let proxyUsername = null;
    let proxyPassword = null;

    if (this.config.proxy && this.config.proxy.username && this.config.proxy.password) {
      proxyUrl = 'pr.oxylabs.io:7777';

      // Use rotating proxy for login (no session ID = fresh IP each time)
      // Rotating proxies are better for Twitter automation to avoid detection
      proxyUsername = `customer-${this.config.proxy.username}`;
      proxyPassword = this.config.proxy.password;
      console.log(`   🌐 Using Oxylabs rotating residential proxy`);
    }

    // Launch browser with stealth
    const launchOptions = {
      headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    };

    if (proxyUrl) {
      launchOptions.args.push(`--proxy-server=${proxyUrl}`);
    }

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    // Set realistic User-Agent (KEY INSIGHT from working examples)
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Authenticate proxy if configured
    if (proxyUsername && proxyPassword) {
      await page.authenticate({
        username: proxyUsername,
        password: proxyPassword,
      });
    }

    try {
      // Navigate to login page
      console.log(`   🌐 Navigating to X login page...`);
      await page.goto('https://twitter.com/i/flow/login', {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });

      console.log(`   ⏳ Waiting for network to be idle...`);
      // Wait for network to be idle (KEY INSIGHT from working examples)
      try {
        await page.waitForNetworkIdle({ idleTime: 1500, timeout: 30000 });
      } catch (e) {
        console.log(`   ⚠️  Network idle timeout, continuing anyway...`);
      }

      // Additional wait for page to fully render (especially important with proxies)
      if (proxyUrl) {
        console.log(`   ⏳ Waiting extra 15s for page to render (proxy mode)...`);
        await new Promise(resolve => setTimeout(resolve, 15000));
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Check if we actually got to the login page
      const currentUrl = page.url();
      console.log(`   📍 Current URL: ${currentUrl}`);

      console.log(`   📝 Looking for username input...`);

      // Wait for username input (use name="text" selector from working example)
      await page.waitForSelector('input[name="text"]', { visible: true, timeout: 20000 });

      // Type username with delay
      await page.type('input[name="text"]', account.username, { delay: 50 });

      // Verify username
      const enteredValue = await page.$eval('input[name="text"]', el => el.value);
      console.log(`   ✓ Username entered: ${enteredValue}`);

      // Take screenshot before submitting
      await page.screenshot({ path: '/tmp/login-before-next.png' });
      console.log(`   📸 Before submitting: /tmp/login-before-next.png`);

      // Click Next button using page.evaluate (KEY INSIGHT from working examples)
      console.log(`   🖱️  Finding and clicking Next button...`);

      // Find all buttons and click the one with "Next" text
      // Use actual Puppeteer click (not page.evaluate) for realistic mouse events
      const buttons = await page.$$('button');
      let nextButton = null;

      for (const button of buttons) {
        const text = await button.evaluate(el => el.textContent);
        if (text && (text.includes('Next') || text.includes('Siguiente'))) {
          nextButton = button;
          break;
        }
      }

      if (!nextButton) {
        throw new Error('Next button not found');
      }

      console.log(`   🖱️  Clicking Next button with real mouse event...`);
      // Add small random delay to seem more human
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

      // Click using Puppeteer's click (generates real mouse events)
      await nextButton.click();
      console.log(`   ✓ Next button clicked`);

      // Wait for network idle after action (KEY INSIGHT)
      try {
        await page.waitForNetworkIdle({ idleTime: 1500, timeout: 30000 });
      } catch (e) {
        console.log(`   ⚠️  Network idle timeout after clicking Next, continuing...`);
      }

      // Take screenshot after submitting
      await page.screenshot({ path: '/tmp/login-after-next.png' });
      console.log(`   📸 After submitting: /tmp/login-after-next.png`);

      console.log(`   ⏳ Checking for verification or password screen...`);

      // Check if Twitter is asking for additional verification
      const pageText = await page.evaluate(() => document.body.innerText);
      if (pageText.includes('Enter your phone number or username')) {
        console.log(`   ⚠️  Verification challenge detected!`);
        throw new Error('Account requires verification - enter phone number or username');
      }

      console.log(`   🔑 Entering password...`);
      await page.waitForSelector('[autocomplete="current-password"]', { visible: true, timeout: 10000 });

      // Type password with delay
      await page.type('[autocomplete="current-password"]', account.password, { delay: 50 });

      // Add small human-like delay before clicking login
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

      // Click Login button using data-testid (from working example)
      console.log(`   🖱️  Clicking Login button...`);
      const loginButtonSelector = 'div[data-testid="LoginForm_Login_Button"]';

      try {
        await page.waitForSelector(loginButtonSelector, { visible: true, timeout: 5000 });
        await page.click(loginButtonSelector);
      } catch (e) {
        // Fallback: try to find button by text
        const allButtons = await page.$$('button');
        let loginButton = null;

        for (const button of allButtons) {
          const text = await button.evaluate(el => el.textContent);
          if (text && (text.includes('Log in') || text.includes('Iniciar'))) {
            loginButton = button;
            break;
          }
        }

        if (loginButton) {
          await loginButton.click();
        } else {
          throw new Error('Login button not found');
        }
      }

      // Wait for navigation after login (from working example)
      console.log(`   ⏳ Waiting for login to complete...`);
      try {
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
      } catch (e) {
        console.log(`   ⚠️  Navigation timeout, continuing...`);
      }
      const finalUrl = page.url();

      if (!finalUrl.includes('/home')) {
        throw new Error(`Login failed - unexpected URL: ${finalUrl}`);
      }

      console.log(`   ✅ Login successful for ${account.username}`);

      // Extract cookies
      const cookies = await page.cookies();
      await this.saveCookies(account.id, cookies);

      await browser.close();
      return cookies;

    } catch (error) {
      try {
        await page.screenshot({ path: '/tmp/login-error.png', fullPage: true });
        console.log(`   📸 Screenshot saved to /tmp/login-error.png`);
      } catch (screenshotError) {
        console.log(`   ⚠️  Could not capture screenshot: ${screenshotError.message}`);
      }

      console.error(`   ❌ Login failed: ${error.message}`);

      try {
        await browser.close();
      } catch (closeError) {
        // Ignore browser close errors
      }

      if (error.message.includes('suspended')) {
        await this.markSuspended(account.id, 'Account suspended by X');
      }

      throw error;
    }
  }

  /**
   * Get authenticated cookies for an account (load or re-login if needed)
   */
  async getAuthenticatedCookies(account) {
    // Try to load existing cookies
    let cookies = await this.loadCookies(account.id);

    // If no cookies or expired, login
    if (!cookies) {
      console.log(`🔄 No valid cookies for ${account.id}, logging in...`);
      cookies = await this.login(account);
    }

    return cookies;
  }

  /**
   * Validate cookies by making a test request using puppeteer-extra
   */
  async validateCookies(accountId) {
    const account = this.accounts.find(a => a.id === accountId);
    if (!account) return false;

    const cookies = await this.loadCookies(accountId);
    if (!cookies) return false;

    // Get proxy URL for this account
    let proxyServer = null;
    if (this.config.proxy && this.config.proxy.username && this.config.proxy.password) {
      const sessionId = `session-${accountId}`;
      proxyServer = `http://customer-${this.config.proxy.username}-sessid-${sessionId}:${this.config.proxy.password}@pr.oxylabs.io:7777`;
    }

    const launchOptions = {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    };

    if (proxyServer) {
      launchOptions.args.push(`--proxy-server=${proxyServer}`);
    }

    try {
      const browser = await puppeteer.launch(launchOptions);
      const page = await browser.newPage();

      // Add cookies before navigation
      await page.setCookie(...cookies);

      // Navigate to home page
      await page.goto('https://x.com/home', {
        waitUntil: 'networkidle2',
        timeout: 15000,
      });

      // Check if we're actually logged in
      const url = page.url();
      const isValid = url.includes('/home') && !url.includes('/login');

      await browser.close();
      return isValid;

    } catch (error) {
      console.error(`   ⚠️  Cookie validation failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Get account statistics
   */
  getStats() {
    const total = this.accounts.length;
    const active = this.accounts.filter(a => a.status === 'active' && !a.suspended).length;
    const suspended = this.accounts.filter(a => a.suspended).length;
    const rateLimited = this.accounts.filter(a =>
      a.rateLimitedUntil && new Date(a.rateLimitedUntil) > new Date()
    ).length;

    return {
      total,
      active,
      suspended,
      rateLimited,
      available: active - rateLimited
    };
  }
}

// Export singleton instance
const authManager = new XAuthManager();
export default authManager;
