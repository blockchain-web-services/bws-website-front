/**
 * Twitter/X Crawler with Authentication - SIMPLE VERSION
 * Uses X auth manager for authenticated access with cookie sessions
 * Processes ONE profile at a time sequentially
 */

import { PlaywrightCrawler } from 'crawlee';
import { parseUserProfile } from './graphql-parser.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Crawlee storage
process.env.CRAWLEE_STORAGE_DIR = path.join(__dirname, '../storage');

// Account configuration path
const CONFIG_PATH = path.join(__dirname, '../config/x-crawler-accounts.json');

/**
 * Load account configuration and cookies
 */
async function loadAccountWithCookies() {
  // Load config
  if (!existsSync(CONFIG_PATH)) {
    throw new Error(
      `Account config not found at ${CONFIG_PATH}. ` +
      `Please create it with valid X cookies - see instructions in the file.`
    );
  }

  const configData = await fs.readFile(CONFIG_PATH, 'utf-8');
  const config = JSON.parse(configData);

  // Get first active account
  const account = config.accounts.find(a => a.status === 'active' && !a.suspended);

  if (!account) {
    throw new Error('No active accounts found in configuration');
  }

  if (!account.cookies || !account.cookies.auth_token || !account.cookies.ct0) {
    throw new Error(
      `Account ${account.id} has invalid cookies. ` +
      `Please add real X cookies (auth_token and ct0) to the config file.`
    );
  }

  console.log(`🔐 Using account: ${account.id} (@${account.username || 'unknown'})`);

  // Convert cookies to Playwright format
  const cookies = [
    {
      name: 'auth_token',
      value: account.cookies.auth_token,
      domain: '.x.com',
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    },
    {
      name: 'ct0',
      value: account.cookies.ct0,
      domain: '.x.com',
      path: '/',
      httpOnly: false,
      secure: true,
      sameSite: 'Lax'
    }
  ];

  if (account.cookies.guest_id) {
    cookies.push({
      name: 'guest_id',
      value: account.cookies.guest_id,
      domain: '.x.com',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'None'
    });
  }

  // Get proxy configuration
  let proxyUrl = null;
  if (config.proxy && config.proxy.enabled) {
    // Use environment variables if available (GitHub Secrets)
    const username = process.env.OXYLABS_USERNAME || config.proxy.username;
    const password = process.env.OXYLABS_PASSWORD || config.proxy.password;
    // Use account-specific country, fallback to proxy config country, default to 'es'
    const country = account.country || config.proxy.country || 'es';

    if (username && password && !username.includes('REPLACE')) {
      // Format: customer-USERNAME-country-COUNTRY:PASSWORD@pr.oxylabs.io:7777
      proxyUrl = `http://customer-${username}-country-${country}:${password}@${config.proxy.host}:${config.proxy.port}`;
      console.log(`🌐 Using Oxylabs proxy with country: ${country} (from account: ${account.id})`);
    } else {
      console.log(`⚠️  Proxy credentials not configured, running without proxy`);
    }
  }

  return { cookies, proxyUrl, account };
}

/**
 * Get user profile by username with authentication
 * @param {string} username - Twitter username (without @)
 * @returns {Promise<Object|null>} User profile data
 */
export async function getUserProfile(username) {
  console.log(`\n🔍 Fetching profile for @${username}...`);

  // Load account and cookies
  const { cookies, proxyUrl } = await loadAccountWithCookies();

  return new Promise(async (resolve, reject) => {
    let profileData = null;
    let resolved = false;

    const crawlerConfig = {
      launchContext: {
        launchOptions: {
          headless: process.env.CRAWLEE_HEADLESS !== 'false',
          args: [
            '--disable-blink-features=AutomationControlled',
            '--disable-dev-shm-usage',
            '--no-sandbox',
          ],
        },
      },
      maxConcurrency: 1,
      maxRequestRetries: 2,
      requestHandlerTimeoutSecs: 30,

      // Set up response interceptor ONCE per page
      preNavigationHooks: [async ({ page }) => {
        // Load cookies BEFORE navigation
        console.log(`   🍪 Loading authentication cookies...`);
        await page.context().addCookies(cookies);

        // Set realistic User-Agent
        await page.setExtraHTTPHeaders({
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        });

        // Set up GraphQL response listener ONCE per page
        if (!page._twitterListenerSetup) {
          page._twitterListenerSetup = true;

          page.on('response', async (response) => {
            const url = response.url();

            if (url.includes('UserByScreenName') || url.includes('UserByRestId')) {
              try {
                const data = await response.json();
                const parsed = parseUserProfile(data);

                if (parsed && parsed.username) {
                  profileData = parsed;
                  console.log(`   ✅ Captured profile data for @${parsed.username}`);
                }
              } catch (err) {
                // Not JSON or parsing error - ignore
              }
            }
          });
        }
      }],

      async requestHandler({ page, request }) {
        try {
          console.log(`   🌐 Loading: ${request.url}`);

          await page.goto(request.url, {
            waitUntil: 'domcontentloaded',
            timeout: 20000,
          });

          // Wait for GraphQL response
          await page.waitForTimeout(5000);

          // Check if account exists
          const pageContent = await page.content();
          if (pageContent.includes("This account doesn't exist") ||
              pageContent.includes('Account suspended')) {
            console.log(`   ❌ Account not found or suspended`);
            if (!resolved) {
              resolved = true;
              resolve(null);
            }
            return;
          }

          if (!resolved) {
            resolved = true;
            resolve(profileData);
          }

        } catch (error) {
          console.error(`   ❌ Error: ${error.message}`);
          if (!resolved) {
            resolved = true;
            reject(error);
          }
        }
      },
    };

    // Add proxy configuration if available
    if (proxyUrl) {
      crawlerConfig.proxyConfiguration = {
        proxyUrls: [proxyUrl],
      };
    }

    const crawler = new PlaywrightCrawler(crawlerConfig);

    try {
      await crawler.run([`https://x.com/${username}`]);
      await crawler.teardown();

      if (!resolved) {
        resolved = true;
        resolve(profileData);
      }
    } catch (error) {
      await crawler.teardown().catch(() => {});
      if (!resolved) {
        resolved = true;
        reject(error);
      }
    }
  });
}
