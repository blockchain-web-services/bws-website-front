/**
 * HTML Parser for X/Twitter Profiles
 *
 * Parses pre-rendered HTML from Oxylabs Web Unblocker
 * to extract profile data (replaces GraphQL interception)
 */

/**
 * Parse number from text (handles K, M, B suffixes)
 * Examples: "556.4K" -> 556400, "229.1M" -> 229100000, "1,227" -> 1227
 */
function parseNumber(text) {
  if (!text || typeof text !== 'string') return 0;

  // Clean up text: remove commas and extra whitespace
  text = text.replace(/,/g, '').trim();

  // Handle K, M, B suffixes (K = thousands, M = millions, B = billions)
  const multipliers = {
    'K': 1000,
    'M': 1000000,
    'B': 1000000000
  };

  // Match number with optional decimal and optional K/M/B suffix
  const match = text.match(/^([\d.]+)\s*([KMB])?$/i);
  if (!match) return 0;

  const number = parseFloat(match[1]);
  const suffix = match[2]?.toUpperCase();

  if (suffix) {
    return Math.floor(number * multipliers[suffix]);
  }
  return Math.floor(number);
}

/**
 * Try multiple selector strategies to extract a number from a link element
 * X/Twitter's HTML structure can vary, so we try different approaches
 */
async function extractNumberFromLink(page, linkSelectors, description = 'count') {
  // Strategy 1: Try each link selector with innermost span
  for (const selector of linkSelectors) {
    try {
      const link = await page.locator(selector).first();
      const count = await link.count();
      if (count === 0) continue;

      // Try innermost span (span span)
      const text = await link.locator('span span').first().textContent().catch(() => null);
      if (text) {
        const num = parseNumber(text);
        if (num > 0) return num;
      }
    } catch (e) {
      // Continue to next strategy
    }
  }

  // Strategy 2: Get all text and find numbers with K/M/B suffix
  for (const selector of linkSelectors) {
    try {
      const link = await page.locator(selector).first();
      const count = await link.count();
      if (count === 0) continue;

      const fullText = await link.textContent().catch(() => '');
      // Extract number patterns like "1.7M" or "229,100"
      const numberMatch = fullText.match(/([\d,.]+[KMB]?)/i);
      if (numberMatch) {
        const num = parseNumber(numberMatch[1]);
        if (num > 0) return num;
      }
    } catch (e) {
      // Continue to next strategy
    }
  }

  // Strategy 3: Try direct span within link (not nested)
  for (const selector of linkSelectors) {
    try {
      const link = await page.locator(selector).first();
      const count = await link.count();
      if (count === 0) continue;

      const spans = await link.locator('span').all();
      for (const span of spans) {
        const text = await span.textContent().catch(() => '');
        const num = parseNumber(text);
        if (num > 0) return num;
      }
    } catch (e) {
      // Continue to next strategy
    }
  }

  // Strategy 4: Use aria-label which often contains the full count
  for (const selector of linkSelectors) {
    try {
      const link = await page.locator(selector).first();
      const count = await link.count();
      if (count === 0) continue;

      const ariaLabel = await link.getAttribute('aria-label').catch(() => '');
      if (ariaLabel) {
        // aria-label often contains full number like "1,234,567 Followers"
        const numberMatch = ariaLabel.match(/([\d,]+)/);
        if (numberMatch) {
          const num = parseNumber(numberMatch[1]);
          if (num > 0) return num;
        }
      }
    } catch (e) {
      // Continue to next strategy
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
