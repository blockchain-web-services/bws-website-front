/**
 * HTML Parser for X/Twitter Profiles
 *
 * Parses pre-rendered HTML from Oxylabs Web Unblocker
 * to extract profile data (replaces GraphQL interception)
 */

/**
 * Parse number from text (handles K, M, B suffixes)
 * Supports both US format (1,234.5K) and European format (1.234,5K)
 * Examples: "556.4K" -> 556400, "188,2K" -> 188200, "1,227" -> 1227
 */
function parseNumber(text) {
  if (!text || typeof text !== 'string') return 0;

  text = text.trim();

  const multipliers = { 'K': 1000, 'M': 1000000, 'B': 1000000000 };

  // First, try to match number WITH K/M/B suffix
  let match = text.match(/([\d.,]+)\s*([KMB])/i);

  if (match) {
    let numStr = match[1];
    const suffix = match[2].toUpperCase();

    // Detect decimal format based on last separator
    const lastComma = numStr.lastIndexOf(',');
    const lastPeriod = numStr.lastIndexOf('.');

    if (lastComma > lastPeriod && numStr.length - lastComma <= 4) {
      // European format: comma is decimal separator
      numStr = numStr.replace(/\./g, '').replace(',', '.');
    } else if (lastPeriod > lastComma && numStr.length - lastPeriod <= 4) {
      // US format: period is decimal separator
      numStr = numStr.replace(/,/g, '');
    } else {
      numStr = numStr.replace(/[.,]/g, '');
    }

    const number = parseFloat(numStr);
    if (isNaN(number)) return 0;

    // SANITY CHECK: If number >= 1000 with K/M/B suffix, it's likely wrong
    // "376.2K" makes sense (376.2 < 1000), "376200K" doesn't (would be 376.2M)
    if (number >= 1000) {
      // Return the number without applying the suffix multiplier
      return Math.round(number);
    }

    return Math.round(number * multipliers[suffix]);
  }

  // No suffix found, try plain number
  match = text.match(/([\d.,]+)/);
  if (match) {
    let numStr = match[1];

    // For plain numbers, commas are usually thousands separators
    const commaCount = (numStr.match(/,/g) || []).length;
    const periodCount = (numStr.match(/\./g) || []).length;

    if (commaCount > 1 || periodCount > 1) {
      numStr = numStr.replace(/[.,]/g, '');
    } else if (commaCount === 1 && periodCount === 0) {
      const afterComma = numStr.split(',')[1];
      if (afterComma && afterComma.length <= 2) {
        numStr = numStr.replace(',', '.');
      } else {
        numStr = numStr.replace(',', '');
      }
    } else if (periodCount === 1 && commaCount === 0) {
      const afterPeriod = numStr.split('.')[1];
      if (afterPeriod && afterPeriod.length === 3) {
        numStr = numStr.replace('.', '');
      }
    } else {
      numStr = numStr.replace(/,/g, '');
    }

    const number = parseFloat(numStr);
    if (isNaN(number)) return 0;

    return Math.floor(number);
  }

  return 0;
}

/**
 * Extract a number from a link element
 * Gets FULL text content first to capture K/M/B suffixes
 */
async function extractNumberFromLink(page, linkSelectors, description = 'count') {
  for (const selector of linkSelectors) {
    try {
      const link = await page.locator(selector).first();
      const count = await link.count();
      if (count === 0) continue;

      // Strategy 1: Get FULL text content (this includes K/M/B suffix)
      const fullText = await link.textContent().catch(() => '');
      console.log(`      [DEBUG] ${description} fullText: "${fullText}"`);
      if (fullText) {
        const num = parseNumber(fullText);
        console.log(`      [DEBUG] ${description} parsed: ${num}`);
        if (num > 0) return num;
      }

      // Strategy 2: Try aria-label (often has full number)
      const ariaLabel = await link.getAttribute('aria-label').catch(() => '');
      console.log(`      [DEBUG] ${description} ariaLabel: "${ariaLabel}"`);
      if (ariaLabel) {
        const num = parseNumber(ariaLabel);
        if (num > 0) return num;
      }
    } catch (e) {
      // Continue to next selector
    }
  }

  return 0;
}

/**
 * Extract profile data from rendered HTML page
 *
 * @param {Page} page - Playwright page object with loaded profile
 * @param {string} username - Twitter/X username being scraped
 * @returns {Promise<Object|null>} Profile data or null if not found
 */
export async function parseProfileFromHTML(page, username) {
  try {
    // Check if account exists using data-testid selectors (more reliable)
    const emptyStateHeader = await page.locator('[data-testid="empty_state_header_text"]').first();
    const emptyStateText = await emptyStateHeader.textContent().catch(() => '');

    // Check for various account error states
    const accountNotFound = emptyStateText.includes("This account doesn't exist") ||
                           emptyStateText.includes("doesn't exist");
    const accountSuspended = emptyStateText.includes("Account suspended") ||
                            emptyStateText.includes("suspended");
    const accountUnavailable = emptyStateText.includes("Something went wrong") ||
                              emptyStateText.includes("unavailable");

    if (accountNotFound) {
      console.log(`   ⚠️  Account @${username} does not exist`);
      return null;
    }

    if (accountSuspended) {
      console.log(`   ⚠️  Account @${username} is suspended`);
      return null;
    }

    if (accountUnavailable) {
      console.log(`   ⚠️  Account @${username} is unavailable`);
      return null;
    }

    // Extract username and name
    const userNameElement = await page.locator('[data-testid="UserName"]').first();
    const fullText = await userNameElement.textContent().catch(() => '');

    // Format is usually: "Name✓@username" or "Name@username"
    const nameMatch = fullText.match(/^(.+?)[@✓]/);
    const usernameMatch = fullText.match(/@([\w]+)/);

    const name = nameMatch ? nameMatch[1].trim() : '';
    const extractedUsername = usernameMatch ? usernameMatch[1] : username;

    // Extract description/bio
    const description = await page.locator('[data-testid="UserDescription"]')
      .textContent()
      .catch(() => '');

    // Extract follower count using multi-strategy approach
    const followerSelectors = [
      'a[href$="/verified_followers"]',
      'a[href$="/followers"]'
    ];
    const followers_count = await extractNumberFromLink(page, followerSelectors, 'followers');

    // Extract following count using multi-strategy approach
    const followingSelectors = [
      'a[href$="/following"]'
    ];
    const following_count = await extractNumberFromLink(page, followingSelectors, 'following');

    // Extract location
    const location = await page.locator('[data-testid="UserLocation"] span')
      .textContent()
      .catch(() => '');

    // Extract website URL
    const url = await page.locator('[data-testid="UserUrl"] a')
      .getAttribute('href')
      .catch(() => '');

    // Extract profile image
    const profile_image_url = await page.locator('a[href$="/photo"] img, [data-testid="UserAvatar"] img')
      .first()
      .getAttribute('src')
      .catch(() => '');

    // Extract banner image
    const profile_banner_url = await page.locator('a[href$="/header_photo"] img')
      .getAttribute('src')
      .catch(() => '');

    // Check verification status (blue checkmark)
    const verifiedBadge = await page.locator('[data-testid="UserName"] svg[aria-label*="Verified"]').count();
    const verified = verifiedBadge > 0;

    // Extract join date
    const joinDateElement = await page.locator('[data-testid="UserJoinDate"]');
    const joinDateText = await joinDateElement.textContent().catch(() => '');
    // Format: "Joined June 2009" -> extract for created_at
    const created_at = joinDateText.replace('Joined ', '');

    // Check if account is protected/private
    const protectedBadge = await page.locator('text="Protected account"').count();
    const isProtected = protectedBadge > 0;

    // Build profile object (matching GraphQL structure)
    const profile = {
      username: extractedUsername,
      name: name,
      description: description.trim(),
      public_metrics: {
        followers_count,
        following_count,
        tweet_count: 0,  // Not easily extractable from HTML
        listed_count: 0   // Not easily extractable from HTML
      },
      verified,
      created_at,
      profile_image_url,
      profile_banner_url,
      url,
      location: location.trim(),
      protected: isProtected,
      verified_type: verified ? 'blue' : null,
      // Metadata
      extraction_method: 'HTML parsing (Web Unblocker)',
      extracted_at: new Date().toISOString()
    };

    // Validate we got minimum data
    if (!profile.username || profile.public_metrics.followers_count === undefined) {
      console.log(`   ⚠️  Incomplete profile data extracted`);
      return null;
    }

    return profile;

  } catch (error) {
    console.error(`   ❌ Error parsing HTML for @${username}:`, error.message);
    return null;
  }
}

/**
 * Helper to wait for profile to load
 *
 * @param {Page} page - Playwright page object
 * @param {number} timeout - Max wait time in ms (default: 10000)
 * @returns {Promise<boolean>} True if profile loaded, false otherwise
 */
export async function waitForProfileLoad(page, timeout = 10000) {
  try {
    // Wait for profile to load (UserName element appears on all profile pages)
    await page.waitForSelector('[data-testid="UserName"]', { timeout });
    return true;
  } catch (error) {
    // Check if it's an error page
    const hasError = await page.locator('text=/This account|Account suspended/').count() > 0;
    if (hasError) {
      return true;  // Error page loaded successfully
    }

    console.log(`   ⚠️  Timeout waiting for profile to load`);
    return false;
  }
}

export default {
  parseProfileFromHTML,
  waitForProfileLoad,
  parseNumber
};
