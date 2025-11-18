/**
 * Twitter/X Crawler using Crawlee and Playwright - SIMPLE VERSION
 * Processes ONE profile at a time sequentially - slower but reliable
 */

import { PlaywrightCrawler } from 'crawlee';
import { parseUserProfile } from './graphql-parser.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Crawlee storage
process.env.CRAWLEE_STORAGE_DIR = path.join(__dirname, '../storage');

/**
 * Get user profile by username - ONE AT A TIME
 * @param {string} username - Twitter username (without @)
 * @returns {Promise<Object|null>} User profile data
 */
export async function getUserProfile(username) {
  console.log(`\n🔍 Fetching profile for @${username}...`);

  return new Promise(async (resolve, reject) => {
    let profileData = null;
    let resolved = false;

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
      maxConcurrency: 1,
      maxRequestRetries: 2,
      requestHandlerTimeoutSecs: 30,

      preNavigationHooks: [async ({ page }) => {
        // Set up response interceptor ONCE per page
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
                  console.log(`✅ Captured profile data for @${parsed.username}`);
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
          console.log(`   Loading: ${request.url}`);

          await page.goto(request.url, {
            waitUntil: 'domcontentloaded',
            timeout: 20000,
          });

          // Wait for GraphQL response
          await page.waitForTimeout(3000);

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
    });

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
