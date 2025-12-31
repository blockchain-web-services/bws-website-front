#!/usr/bin/env node

/**
 * X Bot Leaderboard Scraper
 *
 * Extracts top performers from xbot.ninja leaderboards:
 * - Top X Account (username and display name)
 * - Top Cashtag
 *
 * Automatically excludes BWS-owned entities (@BWS, @BWSCommunity, $BWS, $BWSCommunity)
 * If the #1 spot is BWS-owned, it selects the #2 spot instead.
 */

import playwright from 'playwright';

/**
 * List of BWS-owned usernames and cashtags to exclude
 */
const BWS_OWNED = {
  usernames: ['bws', 'bwscommunity'],
  cashtags: ['bws', 'bwscommunity']
};

/**
 * Check if a username is BWS-owned
 * @param {string} username - Username without @ symbol
 * @returns {boolean}
 */
function isBWSUsername(username) {
  if (!username) return false;
  const normalized = username.toLowerCase().replace('@', '');
  return BWS_OWNED.usernames.includes(normalized);
}

/**
 * Check if a cashtag is BWS-owned
 * @param {string} cashtag - Cashtag with or without $ symbol
 * @returns {boolean}
 */
function isBWSCashtag(cashtag) {
  if (!cashtag) return false;
  const normalized = cashtag.toLowerCase().replace('$', '');
  return BWS_OWNED.cashtags.includes(normalized);
}

/**
 * Extract username and display name from account element
 * @param {import('playwright').ElementHandle} accountElement
 * @returns {Promise<{username: string, displayName: string}>}
 */
async function extractAccountData(accountElement) {
  // The account element contains 2 divs: one for username, one for display name
  const divs = await accountElement.$$('div');

  if (divs.length < 2) {
    throw new Error('Account element does not contain expected 2 divs');
  }

  const username = (await divs[0].textContent()).trim();
  const displayName = (await divs[1].textContent()).trim();

  return { username, displayName };
}

/**
 * Extract cashtag from cashtag element
 * The element contains the cashtag (e.g., "$GURU") followed by additional text ("Mentioned in X posts")
 * We only want the cashtag symbol + name
 * @param {import('playwright').ElementHandle} cashtagElement
 * @returns {Promise<string>}
 */
async function extractCashtagData(cashtagElement) {
  const text = await cashtagElement.textContent();

  // Extract just the cashtag (starts with $, followed by letters/numbers)
  const match = text.match(/\$[A-Z0-9]+/);

  if (match) {
    return match[0];
  }

  // Fallback: return trimmed text
  return text.trim();
}

/**
 * Scrape top account from xbot.ninja
 * XPath: /html/body/main/div/section[3]/div[2]/div[3]/div/div[2]/div[2]/div[1]/div[1]/div[1]/div[2]
 *
 * @param {import('playwright').Page} page
 * @returns {Promise<{username: string, displayName: string, rank: number}>}
 */
async function scrapeTopAccount(page) {
  console.log('🔍 Scraping top X account...');

  // Base XPath for account items (removing the specific index to get all)
  const baseXPath = '/html/body/main/div/section[3]/div[2]/div[3]/div/div[2]/div[2]/div[1]/div[1]';

  // Get all account items
  const accountItems = await page.$$(`xpath=${baseXPath}/div`);

  if (accountItems.length === 0) {
    throw new Error('No account items found on the page');
  }

  console.log(`   Found ${accountItems.length} account items`);

  // Try each account until we find one that's not BWS-owned
  for (let i = 0; i < accountItems.length; i++) {
    const rank = i + 1;

    try {
      // Use XPath to get the data container div (the second div within each item)
      const dataContainers = await accountItems[i].$$('xpath=./div[2]');

      if (dataContainers.length === 0) {
        console.log(`   ⚠️  Rank #${rank}: No data container found, skipping`);
        continue;
      }

      const { username, displayName } = await extractAccountData(dataContainers[0]);

      // Remove @ symbol if present (we'll add it back when needed)
      const cleanUsername = username.replace(/^@/, '');

      console.log(`   Rank #${rank}: @${cleanUsername} (${displayName})`);

      if (isBWSUsername(cleanUsername)) {
        console.log(`   ⏭️  BWS-owned account, checking next...`);
        continue;
      }

      console.log(`   ✅ Selected: @${cleanUsername}`);
      return { username: cleanUsername, displayName, rank };
    } catch (err) {
      console.log(`   ⚠️  Rank #${rank}: Error extracting data - ${err.message}`);
      continue;
    }
  }

  throw new Error('All accounts in the list are BWS-owned');
}

/**
 * Scrape top cashtag from xbot.ninja
 * XPath: //*[@id="cashtagsList"]/div[1]/div[1]/div
 *
 * @param {import('playwright').Page} page
 * @returns {Promise<{cashtag: string, rank: number}>}
 */
async function scrapeTopCashtag(page) {
  console.log('🔍 Scraping top cashtag...');

  // Base XPath for cashtag items
  const baseXPath = '//*[@id="cashtagsList"]';

  // Get all cashtag items
  const cashtagItems = await page.$$(`xpath=${baseXPath}/div`);

  if (cashtagItems.length === 0) {
    throw new Error('No cashtag items found on the page');
  }

  console.log(`   Found ${cashtagItems.length} cashtag items`);

  // Try each cashtag until we find one that's not BWS-owned
  for (let i = 0; i < cashtagItems.length; i++) {
    const rank = i + 1;

    try {
      // Navigate to div[1]/div within each item using XPath
      const dataContainers = await cashtagItems[i].$$('xpath=./div[1]/div');

      if (dataContainers.length === 0) {
        console.log(`   ⚠️  Rank #${rank}: No data container found, skipping`);
        continue;
      }

      const cashtag = await extractCashtagData(dataContainers[0]);

      console.log(`   Rank #${rank}: ${cashtag}`);

      if (isBWSCashtag(cashtag)) {
        console.log(`   ⏭️  BWS-owned cashtag, checking next...`);
        continue;
      }

      console.log(`   ✅ Selected: ${cashtag}`);
      return { cashtag, rank };
    } catch (err) {
      console.log(`   ⚠️  Rank #${rank}: Error extracting data - ${err.message}`);
      continue;
    }
  }

  throw new Error('All cashtags in the list are BWS-owned');
}

/**
 * Main scraper function
 * @returns {Promise<{account: {username: string, displayName: string, rank: number}, cashtag: {cashtag: string, rank: number}}>}
 */
async function scrapeXBotLeaderboards() {
  console.log('🚀 X Bot Leaderboard Scraper\n');

  const browser = await playwright.chromium.launch({
    headless: true
  });

  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  try {
    console.log('📂 Navigating to https://xbot.ninja...');
    await page.goto('https://xbot.ninja', {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    console.log('⏳ Waiting for dynamic content to load...');

    // Wait for account list to load (we know this works)
    const accountXPath = '/html/body/main/div/section[3]/div[2]/div[3]/div/div[2]/div[2]/div[1]/div[1]/div[1]';
    await page.waitForSelector(`xpath=${accountXPath}`, { timeout: 30000 });
    console.log('   ✅ Account list loaded');

    // Click the cashtags tab to trigger loading
    console.log('   Clicking cashtags tab...');
    const cashtagsTabButton = await page.$('button[data-tab="cashtags"]');
    if (cashtagsTabButton) {
      await cashtagsTabButton.click();
      console.log('   ✅ Cashtags tab clicked');
    } else {
      console.log('   ⚠️  Cashtags tab button not found, trying without click');
    }

    // Wait for cashtagsList to unhide and have content
    await page.waitForFunction(() => {
      const cashtagsEl = document.getElementById('cashtagsList');
      return cashtagsEl && !cashtagsEl.classList.contains('hidden') && cashtagsEl.children.length > 0;
    }, { timeout: 30000 });
    console.log('   ✅ Cashtags list loaded');

    // Additional buffer for animations
    await page.waitForTimeout(2000);

    // Scrape both leaderboards
    const account = await scrapeTopAccount(page);
    const cashtag = await scrapeTopCashtag(page);

    console.log('\n✅ Scraping complete!\n');
    console.log('📊 Results:');
    console.log(`   Top Account: @${account.username} (${account.displayName}) - Rank #${account.rank}`);
    console.log(`   Top Cashtag: ${cashtag.cashtag} - Rank #${cashtag.rank}`);

    return { account, cashtag };

  } catch (error) {
    console.error('\n❌ Scraping failed:', error.message);
    throw error;
  } finally {
    await browser.close();
    console.log('\n🔒 Browser closed.');
  }
}

// If run directly (not imported), execute the scraper
if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeXBotLeaderboards()
    .then(results => {
      console.log('\n📄 Full Results:');
      console.log(JSON.stringify(results, null, 2));
      process.exit(0);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export default scrapeXBotLeaderboards;
