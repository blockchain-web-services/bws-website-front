/**
 * Twitter/X Crawler using Crawlee and Playwright
 * Extracts data by intercepting GraphQL API responses
 *
 * ARCHITECTURE: Uses a shared singleton crawler instance to avoid:
 * - Browser pool conflicts between multiple crawler instances
 * - Premature process termination from teardown() calls
 * - Excessive setup/teardown overhead
 */

import { PlaywrightCrawler } from 'crawlee';
import { chromium } from 'playwright';
import { parseUserProfile, parseSearchResults, parseFollowingList, parseUserTweets } from './graphql-parser.js';
import { parseProfileFromHTML } from './html-parser.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Crawlee storage to use local directory via environment variable
process.env.CRAWLEE_STORAGE_DIR = path.join(__dirname, '../storage');

// Shared crawler instance - created once and reused
let sharedCrawler = null;

// Map to store pending profile requests: username -> { resolve, reject, profileData }
const pendingRequests = new Map();

/**
 * Get or create the shared crawler instance
 */
function getSharedCrawler() {
  if (sharedCrawler) {
    return sharedCrawler;
  }

  sharedCrawler = new PlaywrightCrawler({
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
    browserPoolOptions: {
      useFingerprints: true,
      maxOpenPagesPerBrowser: 1,
    },
    maxConcurrency: 1,  // Sequential processing
    maxRequestRetries: 3,
    requestHandlerTimeoutSecs: 60,

    // Set up response interceptor ONCE per page (not per request)
    preNavigationHooks: [async ({ page, request }) => {
      // Only set up listener once per page
      if (!page._twitterResponseListenerSetup) {
        page._twitterResponseListenerSetup = true;

        page.on('response', async (response) => {
          const url = response.url();

          // Check if this is a Twitter GraphQL response
          if (url.includes('UserByScreenName') || url.includes('UserByRestId')) {
            try {
              const data = await response.json();
              const parsed = parseUserProfile(data);

              if (parsed && parsed.username) {
                // Find the pending request for this username
                const pendingRequest = pendingRequests.get(parsed.username);

                if (pendingRequest) {
                  pendingRequest.profileData = parsed;
                  console.log(`✅ Captured profile data for @${parsed.username}`);

                  // Resolve the promise
                  if (pendingRequest.resolveResponse) {
                    pendingRequest.resolveResponse(parsed);
                  }
                } else {
                  console.log(`⚠️  Received profile for @${parsed.username} but no pending request found`);
                }
              }
            } catch (err) {
              // Not JSON or parsing error - ignore
            }
          }
        });
      }
    }],

    async requestHandler({ page, request }) {
      // Extract username from URL
      const requestUsername = request.url.split('/').pop();
      const pendingRequest = pendingRequests.get(requestUsername);

      if (!pendingRequest) {
        console.error(`⚠️  No pending request found for @${requestUsername}`);
        return;
      }

      try {
        console.log(`🔍 Crawling profile: @${requestUsername}`);
        console.log(`   URL: ${request.url}`);

        // Create a promise that will be resolved by the response interceptor
        const responsePromise = new Promise((resolveResponse) => {
          pendingRequest.resolveResponse = resolveResponse;
        });

        // Navigate to profile page
        await page.goto(request.url, {
          waitUntil: 'domcontentloaded',
          timeout: 30000,
        });

        // Wait for GraphQL response with timeout
        const graphqlTimeout = new Promise((resolveTimeout) =>
          setTimeout(() => resolveTimeout(null), 5000)
        );

        await Promise.race([responsePromise, graphqlTimeout]);

        // Check if user exists
        const pageContent = await page.content();
        if (pageContent.includes('This account doesn\'t exist') ||
            pageContent.includes('Account suspended')) {
          console.log(`❌ User @${requestUsername} not found or suspended`);
          pendingRequest.resolve(null);
          pendingRequests.delete(requestUsername);
          return;
        }

        if (pendingRequest.profileData) {
          pendingRequest.resolve(pendingRequest.profileData);
        } else {
          // Fallback: scrape visible data if GraphQL capture failed
          console.log(`⚠️ GraphQL capture failed, attempting DOM scraping for @${requestUsername}`);
          const fallbackData = await scrapeProfileFromDOM(page, requestUsername);
          pendingRequest.resolve(fallbackData);
        }

        pendingRequests.delete(requestUsername);

      } catch (error) {
        console.error(`Error crawling @${requestUsername}:`, error.message);
        pendingRequest.reject(error);
        pendingRequests.delete(requestUsername);
      }
    },
  });

  return sharedCrawler;
}

/**
 * Get user profile by username
 * @param {string} username - Twitter username (without @)
 * @returns {Promise<Object|null>} User profile data matching Twitter API v2 format
 */
export async function getUserProfile(username) {
  console.log(`📞 getUserProfile called with username: "${username}"`);

  return new Promise(async (resolve, reject) => {
    // Store the pending request
    pendingRequests.set(username, {
      resolve,
      reject,
      profileData: null,
      resolveResponse: null  // Will be set in requestHandler
    });

    const targetUrl = `https://x.com/${username}`;
    console.log(`   🎯 Target URL: ${targetUrl}`);

    // Get shared crawler and add request to queue
    const crawler = getSharedCrawler();

    try {
      // Add URL to crawler's request queue
      await crawler.addRequests([targetUrl]);
      console.log(`   ✅ Request added to queue for @${username}`);
    } catch (error) {
      console.error(`Failed to add request for @${username}:`, error.message);
      const pending = pendingRequests.get(username);
      if (pending) {
        pending.reject(error);
        pendingRequests.delete(username);
      }
    }
  });
}

/**
 * Start the shared crawler to process all queued requests
 * Call this AFTER all getUserProfile() calls have been made
 */
export async function startCrawler() {
  const crawler = getSharedCrawler();

  if (crawler.running) {
    console.log('⚠️  Crawler already running');
    return;
  }

  console.log('🚀 Starting shared crawler to process queued requests...');

  try {
    await crawler.run();
    console.log('✅ Crawler finished processing all requests');
  } catch (error) {
    console.error('❌ Crawler run error:', error.message);
    throw error;
  }
}

/**
 * Cleanup: Teardown the shared crawler
 * Call this after all profile fetches are complete
 */
export async function cleanupCrawler() {
  if (sharedCrawler) {
    console.log('🧹 Tearing down shared crawler...');
    await sharedCrawler.teardown();
    sharedCrawler = null;
    pendingRequests.clear();
  }
}

/**
 * Fallback: Scrape profile data from DOM when GraphQL capture fails
 * @param {Page} page - Playwright page object
 * @param {string} username - Twitter username
 * @returns {Promise<Object|null>} Basic profile data
 */
async function scrapeProfileFromDOM(page, username) {
  try {
    // Wait for profile to load
    await page.waitForSelector('[data-testid="UserName"]', { timeout: 10000 });

    // Extract basic info from DOM
    const name = await page.textContent('[data-testid="UserName"] span:first-child').catch(() => username);
    const bio = await page.textContent('[data-testid="UserDescription"]').catch(() => '');

    // Extract metrics
    const followingText = await page.textContent('a[href$="/following"] span').catch(() => '0');
    const followersText = await page.textContent('a[href$="/verified_followers"] span').catch(() => '0');

    const parseMetric = (text) => {
      if (!text) return 0;
      const cleaned = text.replace(/,/g, '');
      if (cleaned.includes('K')) return Math.round(parseFloat(cleaned) * 1000);
      if (cleaned.includes('M')) return Math.round(parseFloat(cleaned) * 1000000);
      return parseInt(cleaned) || 0;
    };

    return {
      id: null, // Not available from DOM
      username,
      name: name || username,
      description: bio || '',
      public_metrics: {
        followers_count: parseMetric(followersText),
        following_count: parseMetric(followingText),
        tweet_count: 0, // Not easily available from DOM
        listed_count: 0,
      },
      verified: false,
      created_at: null,
      profile_image_url: null,
      profile_banner_url: null,
    };
  } catch (error) {
    console.error(`DOM scraping failed for @${username}:`, error.message);
    return null;
  }
}

/**
 * Search for tweets matching query
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum number of results
 * @returns {Promise<Array>} Array of tweets
 */
export async function searchTweets(query, maxResults = 20) {
  console.log(`🔍 Searching tweets: "${query}"`);

  return new Promise((resolve, reject) => {
    const tweets = [];
    let isResolved = false;

    const crawler = new PlaywrightCrawler({
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
      browserPoolOptions: {
        useFingerprints: true,
      },
      maxConcurrency: 1,
      maxRequestRetries: 3,
      requestHandlerTimeoutSecs: 60,

      async requestHandler({ page, request }) {
        try {
          // Set up response interceptor
          page.on('response', async (response) => {
            const url = response.url();

            if (url.includes('SearchTimeline')) {
              try {
                const data = await response.json();
                const parsed = parseSearchResults(data);

                if (parsed && parsed.length > 0) {
                  tweets.push(...parsed);
                  console.log(`✅ Captured ${parsed.length} tweets`);
                }
              } catch (err) {
                // Not JSON or parsing error - ignore
              }
            }
          });

          // Navigate to search page
          await page.goto(request.url, {
            waitUntil: 'domcontentloaded',
            timeout: 30000,
          });

          // Wait for results to load
          await page.waitForTimeout(3000);

          // Scroll to load more results
          for (let i = 0; i < 3 && tweets.length < maxResults; i++) {
            await page.evaluate(() => window.scrollBy(0, 1000));
            await page.waitForTimeout(1000);
          }

          if (!isResolved) {
            isResolved = true;
            resolve(tweets.slice(0, maxResults));
          }
        } catch (error) {
          console.error('Error searching tweets:', error.message);
          if (!isResolved) {
            isResolved = true;
            reject(error);
          }
        }
      },
    });

    const searchUrl = `https://x.com/search?q=${encodeURIComponent(query)}&src=typed_query&f=live`;
    crawler.run([searchUrl])
      .then(() => crawler.teardown())
      .catch((error) => {
        crawler.teardown().catch(() => {});
        if (!isResolved) {
          isResolved = true;
          reject(error);
        }
      });
  });
}

/**
 * Get user profile using Web Unblocker (improved parsing)
 * Uses Oxylabs Web Unblocker for server-side rendering + html-parser.js
 *
 * @param {string} username - Twitter username (without @)
 * @param {Object} options - Configuration options
 * @param {Object} options.account - Account config with cookies
 * @returns {Promise<Object|null>} User profile data
 */
export async function getUserProfileWebUnblocker(username, options = {}) {
  console.log(`🔍 Fetching profile for @${username} (Web Unblocker)...`);

  // Load account config if not provided
  let account = options.account;
  if (!account) {
    try {
      const configPath = path.join(__dirname, '../config/x-crawler-accounts.json');
      const configData = fs.readFileSync(configPath, 'utf-8');
      const config = JSON.parse(configData);
      account = config.accounts.find(a => a.status === 'active' && !a.suspended);

      if (!account) {
        throw new Error('No active account found');
      }
    } catch (error) {
      console.error(`   ❌ Failed to load account config: ${error.message}`);
      return null;
    }
  }

  // Get Oxylabs credentials
  const oxyUsername = process.env.OXYLABS_USERNAME;
  const oxyPassword = process.env.OXYLABS_PASSWORD;

  if (!oxyUsername || !oxyPassword) {
    console.error('   ❌ OXYLABS_USERNAME and OXYLABS_PASSWORD required');
    return null;
  }

  let browser = null;
  let context = null;

  try {
    // Launch browser with Web Unblocker proxy
    browser = await chromium.launch({
      headless: true,
      proxy: {
        server: 'https://unblock.oxylabs.io:60000',
        username: oxyUsername,
        password: oxyPassword
      },
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--no-sandbox',
      ],
    });

    // Prepare cookies
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

    // Create context with Web Unblocker headers
    context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      extraHTTPHeaders: {
        'X-Oxylabs-Render': 'html',
        'X-Oxylabs-Geo-Location': account.country || 'Spain',
        'x-csrf-token': account.cookies.ct0,
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      },
      ignoreHTTPSErrors: true,
    });

    await context.addCookies(cookies);
    const page = await context.newPage();

    // Navigate to profile
    console.log(`   🌐 Loading https://x.com/${username}...`);
    const startTime = Date.now();

    await page.goto(`https://x.com/${username}`, {
      waitUntil: 'networkidle',
      timeout: 120000,
    });

    const loadTime = Date.now() - startTime;
    console.log(`   ✅ Page loaded (${(loadTime / 1000).toFixed(1)}s)`);

    // Wait for rendering
    await page.waitForTimeout(2000);

    // Extract profile using improved html-parser
    const profile = await parseProfileFromHTML(page, username);

    await context.close();
    await browser.close();

    if (profile) {
      console.log(`   ✅ Extracted @${profile.username}`);
      console.log(`      Followers: ${profile.public_metrics.followers_count.toLocaleString()}`);
    }

    return profile;

  } catch (error) {
    console.error(`   ❌ Error fetching @${username}:`, error.message);

    if (context) await context.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});

    return null;
  }
}
