/**
 * Twitter/X Crawler using Crawlee and Playwright
 * Extracts data by intercepting GraphQL API responses
 */

import { PlaywrightCrawler } from 'crawlee';
import { parseUserProfile, parseSearchResults, parseFollowingList, parseUserTweets } from './graphql-parser.js';

/**
 * Get user profile by username
 * @param {string} username - Twitter username (without @)
 * @returns {Promise<Object|null>} User profile data matching Twitter API v2 format
 */
export async function getUserProfile(username) {
  console.log(`📞 getUserProfile called with username: "${username}"`);

  return new Promise((resolve, reject) => {
    let profileData = null;
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
        maxOpenPagesPerBrowser: 1,  // Force sequential processing - each browser instance handles only 1 page
      },
      maxConcurrency: 1,  // Process one request at a time to avoid browser pool conflicts
      maxRequestRetries: 3,
      requestHandlerTimeoutSecs: 60,

      async requestHandler({ page, request }) {
        try {
          // Extract username from request URL to avoid closure issues
          const requestUsername = request.url.split('/').pop();

          // Set up response interceptor before navigation
          const responsePromise = new Promise((resolveResponse) => {
            page.on('response', async (response) => {
              const url = response.url();

              // Look for UserByScreenName GraphQL endpoint
              if (url.includes('UserByScreenName') || url.includes('UserByRestId')) {
                try {
                  const data = await response.json();
                  const parsed = parseUserProfile(data);

                  if (parsed) {
                    profileData = parsed;
                    console.log(`✅ Captured profile data for @${requestUsername}`);
                    resolveResponse(parsed);
                  }
                } catch (err) {
                  // Not JSON or parsing error - ignore
                }
              }
            });
          });

          // Navigate to profile page
          console.log(`🔍 Crawling profile: @${requestUsername}`);
          console.log(`   URL: ${request.url}`);

          await page.goto(request.url, {
            waitUntil: 'domcontentloaded',
            timeout: 30000,
          });

          // Wait for GraphQL response with timeout
          const graphqlTimeout = new Promise((resolveTimeout) =>
            setTimeout(() => resolveTimeout(null), 5000)
          );

          await Promise.race([responsePromise, graphqlTimeout]);

          // Check if user exists (look for error indicators)
          const pageContent = await page.content();
          if (pageContent.includes('This account doesn\'t exist') ||
              pageContent.includes('Account suspended')) {
            console.log(`❌ User @${requestUsername} not found or suspended`);
            if (!isResolved) {
              isResolved = true;
              resolve(null);
            }
            return;
          }

          if (profileData) {
            if (!isResolved) {
              isResolved = true;
              resolve(profileData);
            }
          } else {
            // Fallback: scrape visible data if GraphQL capture failed
            console.log(`⚠️ GraphQL capture failed, attempting DOM scraping for @${requestUsername}`);
            const fallbackData = await scrapeProfileFromDOM(page, requestUsername);
            if (!isResolved) {
              isResolved = true;
              resolve(fallbackData);
            }
          }
        } catch (error) {
          console.error(`Error crawling @${requestUsername}:`, error.message);
          if (!isResolved) {
            isResolved = true;
            reject(error);
          }
        }
      },
    });

    // Run crawler with URL
    const targetUrl = `https://x.com/${username}`;
    console.log(`   🎯 Target URL: ${targetUrl}`);
    crawler.run([targetUrl])
      .catch((error) => {
        if (!isResolved) {
          isResolved = true;
          reject(error);
        }
      });
  });
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
      url: null,
      location: null,
      protected: false,
      verified_type: null,
      _source: 'dom_scrape', // Flag to indicate fallback method
    };
  } catch (error) {
    console.error('DOM scraping failed:', error.message);
    return null;
  }
}

/**
 * Search tweets by query
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @param {Array} options.cookies - Authentication cookies from auth manager
 * @param {Object} options.account - Account object with id, username, country
 * @param {Object} options.proxyConfig - Proxy configuration {username, password}
 * @returns {Promise<Array>} Array of tweets
 */
export async function searchTweets(query, options = {}) {
  const {
    maxResults = 100,
    cookies = null,
    account = null,
    proxyConfig = null,
  } = options;

  // Determine if we should use proxy
  // Use proxy on GitHub Actions OR if explicitly requested
  const isCI = !!(process.env.CI || process.env.GITHUB_ACTIONS);
  const useProxy = isCI && proxyConfig && proxyConfig.username && proxyConfig.password;

  // Build proxy configuration if needed
  let proxyConfig_playwright = null;
  if (useProxy && account) {
    const country = account.country || 'us';
    const sessionId = account.id; // Session-based proxy for consistency

    // Oxylabs format: customer-USERNAME-sessid-SESSIONID-cc-COUNTRY
    const proxyUsername = `customer-${proxyConfig.username}-sessid-${sessionId}-cc-${country}`;
    const proxyPassword = proxyConfig.password;

    // Playwright requires proxy as an object, not command-line arg with credentials
    proxyConfig_playwright = {
      server: 'http://pr.oxylabs.io:7777',
      username: proxyUsername,
      password: proxyPassword
    };

    console.log(`   🌐 Using Oxylabs proxy: ${country.toUpperCase()} (session: ${sessionId})`);
  } else if (isCI) {
    console.log(`   🔓 Running on CI without proxy (no credentials provided)`);
  } else {
    console.log(`   🔓 Direct connection (local environment)`);
  }

  return new Promise((resolve, reject) => {
    const tweets = [];
    let isResolved = false;

    const launchOptions = {
      headless: process.env.CRAWLEE_HEADLESS !== 'false',
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--no-sandbox',
      ],
    };

    // Add proxy if configured (must be object with server/username/password)
    if (proxyConfig_playwright) {
      launchOptions.proxy = proxyConfig_playwright;
    }

    const crawler = new PlaywrightCrawler({
      launchContext: {
        launchOptions,
      },
      browserPoolOptions: {
        useFingerprints: true,
      },
      maxRequestRetries: 3,
      requestHandlerTimeoutSecs: 60,

      async requestHandler({ page, request }) {
        try {
          // Inject authentication cookies if provided
          if (cookies) {
            console.log(`   🔐 Injecting authentication cookies...`);
            await page.context().addCookies(cookies);
          }

          let graphqlCaptured = false;

          // Set up response interceptor BEFORE navigation
          const allGraphQLUrls = []; // Track all GraphQL URLs for debugging
          const responseHandler = async (response) => {
            const url = response.url();

            // Check for ANY GraphQL endpoint with search data
            if (url.includes('graphql') || url.includes('api.twitter.com') || url.includes('api.x.com')) {
              try {
                const contentType = response.headers()['content-type'] || '';
                if (!contentType.includes('json')) return;

                // Extract endpoint name from URL for logging
                const urlObj = new URL(url);
                const pathname = urlObj.pathname;
                const endpointName = pathname.split('/').pop() || 'unknown';

                // Track this URL
                if (!allGraphQLUrls.includes(endpointName)) {
                  allGraphQLUrls.push(endpointName);
                }

                const data = await response.json();

                // Log the URL and check if it has tweet data
                const hasDataKey = !!data.data;
                const dataKeys = data.data ? Object.keys(data.data).join(', ') : 'N/A';
                console.log(`   📡 GraphQL: ${endpointName} | has data: ${hasDataKey} | keys: ${dataKeys}`);

                // Try to parse search results from any GraphQL response
                const parsed = parseSearchResults(data);

                if (parsed && parsed.length > 0 && !graphqlCaptured) {
                  tweets.push(...parsed);
                  graphqlCaptured = true;
                  console.log(`   ✅ Captured ${parsed.length} tweets from: ${endpointName}`);
                }
              } catch (err) {
                // Not JSON or parsing failed - ignore
              }
            }
          };

          page.on('response', responseHandler);

          // Navigate to search page
          console.log(`🔍 Searching: ${query}`);

          await page.goto(request.url, {
            waitUntil: 'domcontentloaded',
            timeout: 45000,
          });

          // Wait for content to load
          await page.waitForTimeout(3000);

          // Check if we're actually on the search page or stuck on login
          const currentUrl = page.url();
          console.log(`   📍 Final URL: ${currentUrl}`);

          // Check for login indicators
          const pageContent = await page.textContent('body').catch(() => '');
          const isOnLogin = currentUrl.includes('/login') || currentUrl.includes('/flow/login') ||
                           pageContent.includes('Sign in to X') || pageContent.includes('Log in to X');

          if (isOnLogin) {
            console.log(`   ⚠️  AUTHENTICATION FAILED: Redirected to login page`);
            console.log(`      Cookies may be expired or invalid`);
          }

          // Try to wait for tweets to appear
          try {
            await page.waitForSelector('article[data-testid="tweet"]', { timeout: 5000 });
          } catch (e) {
            console.log(`   ⚠️  No tweet elements found (may still have data from GraphQL)`);
          }

          // Scroll to load more tweets
          let scrollCount = 0;
          const maxScrolls = Math.ceil(maxResults / 20); // ~20 tweets per scroll

          while (scrollCount < maxScrolls && tweets.length < maxResults) {
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));
            await page.waitForTimeout(2000); // Wait for new tweets to load
            scrollCount++;

            // Stop if we got enough tweets
            if (tweets.length >= maxResults) break;
          }

          // Final wait
          await page.waitForTimeout(2000);

          // Remove listener
          page.off('response', responseHandler);

          // Don't resolve here - let the crawler finish
        } catch (error) {
          console.error(`Error searching tweets:`, error.message);
          if (!isResolved) {
            isResolved = true;
            reject(error);
          }
        }
      },
    });

    // Properly wait for crawler completion before resolving
    crawler.run([`https://x.com/search?q=${encodeURIComponent(query)}&src=typed_query&f=live`])
      .then(() => {
        // Crawler finished - now resolve with collected tweets
        if (!isResolved) {
          isResolved = true;
          resolve(tweets.slice(0, maxResults));
        }
      })
      .catch((error) => {
        if (!isResolved) {
          isResolved = true;
          reject(error);
        }
      });
  });
}

/**
 * Get user's following list
 * @param {string} username - Twitter username
 * @param {Object} options - Options
 * @param {number} options.maxResults - Maximum number of users to return
 * @param {Array} options.cookies - Authentication cookies from auth manager
 * @returns {Promise<Array>} Array of user profiles
 */
export async function getUserFollowing(username, options = {}) {
  const {
    maxResults = 100,
    cookies = null,
  } = options;

  return new Promise((resolve, reject) => {
    const users = [];
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
      maxRequestRetries: 3,
      requestHandlerTimeoutSecs: 60,

      async requestHandler({ page, request }) {
        try {
          // Inject authentication cookies if provided
          if (cookies) {
            console.log(`   🔐 Injecting authentication cookies...`);
            await page.context().addCookies(cookies);
          }

          // Intercept GraphQL responses
          page.on('response', async (response) => {
            const url = response.url();

            // Look for Following GraphQL endpoint
            if (url.includes('Following') || url.includes('following')) {
              try {
                const data = await response.json();
                const parsed = parseFollowingList(data);

                if (parsed && parsed.length > 0) {
                  users.push(...parsed);
                  console.log(`✅ Captured ${parsed.length} following users`);
                }
              } catch (err) {
                // Not JSON or parsing error - ignore
              }
            }
          });

          // Navigate to following page
          console.log(`🔍 Getting following list for @${username}`);

          await page.goto(request.url, {
            waitUntil: 'networkidle',
            timeout: 30000,
          });

          // Scroll to load more users
          let scrollCount = 0;
          const maxScrolls = Math.ceil(maxResults / 20); // ~20 users per scroll

          while (scrollCount < maxScrolls && users.length < maxResults) {
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));
            await page.waitForTimeout(1500);
            scrollCount++;
          }

          // Wait for final users to load
          await page.waitForTimeout(2000);

          if (!isResolved) {
            isResolved = true;
            resolve(users.slice(0, maxResults));
          }
        } catch (error) {
          console.error(`Error getting following list:`, error.message);
          if (!isResolved) {
            isResolved = true;
            reject(error);
          }
        }
      },
    });

    crawler.run([`https://x.com/${username}/following`])
      .catch((error) => {
        if (!isResolved) {
          isResolved = true;
          reject(error);
        }
      });
  });
}

/**
 * Get user's recent tweets
 * @param {string} username - Twitter username
 * @param {Object} options - Options
 * @param {Array} options.cookies - Authentication cookies from auth manager
 * @returns {Promise<Array>} Array of tweets
 */
export async function getUserTweets(username, options = {}) {
  const {
    maxResults = 10,
    excludeReplies = true,
    excludeRetweets = true,
    cookies = null,
  } = options;

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
      maxRequestRetries: 3,
      requestHandlerTimeoutSecs: 60,

      async requestHandler({ page, request }) {
        try {
          // Inject authentication cookies if provided
          if (cookies) {
            console.log(`   🔐 Injecting authentication cookies...`);
            await page.context().addCookies(cookies);
          }

          // Intercept GraphQL responses
          page.on('response', async (response) => {
            const url = response.url();

            // Look for UserTweets GraphQL endpoint
            if (url.includes('UserTweets') || url.includes('UserTweetsAndReplies')) {
              try {
                const data = await response.json();
                const parsed = parseUserTweets(data);

                if (parsed && parsed.length > 0) {
                  // Filter tweets based on options
                  const filtered = parsed.filter(tweet => {
                    if (excludeRetweets && tweet.text.startsWith('RT @')) return false;
                    if (excludeReplies && tweet.text.startsWith('@')) return false;
                    return true;
                  });

                  tweets.push(...filtered);
                  console.log(`✅ Captured ${filtered.length} tweets from @${username}`);
                }
              } catch (err) {
                // Not JSON or parsing error - ignore
              }
            }
          });

          // Navigate to profile page
          console.log(`🔍 Getting tweets for @${username}`);

          await page.goto(request.url, {
            waitUntil: 'networkidle',
            timeout: 30000,
          });

          // Scroll to load more tweets
          let scrollCount = 0;
          const maxScrolls = Math.ceil(maxResults / 10); // ~10 tweets per scroll

          while (scrollCount < maxScrolls && tweets.length < maxResults) {
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));
            await page.waitForTimeout(1500);
            scrollCount++;
          }

          // Wait for final tweets to load
          await page.waitForTimeout(2000);

          if (!isResolved) {
            isResolved = true;
            resolve(tweets.slice(0, maxResults));
          }
        } catch (error) {
          console.error(`Error getting tweets for @${username}:`, error.message);
          if (!isResolved) {
            isResolved = true;
            reject(error);
          }
        }
      },
    });

    crawler.run([`https://x.com/${username}`])
      .catch((error) => {
        if (!isResolved) {
          isResolved = true;
          reject(error);
        }
      });
  });
}

export default {
  getUserProfile,
  searchTweets,
  getUserFollowing,
  getUserTweets,
};
