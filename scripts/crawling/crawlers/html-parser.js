/**
 * HTML Parser for X/Twitter Profiles
 *
 * Parses pre-rendered HTML from Oxylabs Web Unblocker
 * to extract profile data (replaces GraphQL interception)
 */

/**
 * Parse number from text (handles K, M, B suffixes)
 * Examples: "229.1M" -> 229100000, "1,227" -> 1227
 */
function parseNumber(text) {
  if (!text || typeof text !== 'string') return 0;

  // Remove commas
  text = text.replace(/,/g, '').trim();

  // Handle K, M, B suffixes
  const multipliers = {
    'K': 1000,
    'M': 1000000,
    'B': 1000000000
  };

  const match = text.match(/^([\d.]+)([KMB])?$/i);
  if (!match) return 0;

  const number = parseFloat(match[1]);
  const suffix = match[2]?.toUpperCase();

  return suffix ? Math.floor(number * multipliers[suffix]) : Math.floor(number);
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
    // Check if account exists (look for error message)
    const accountNotFound = await page.locator('text="This account doesn\'t exist"').count() > 0;
    const accountSuspended = await page.locator('text="Account suspended"').count() > 0;

    if (accountNotFound || accountSuspended) {
      console.log(`   ⚠️  Account @${username} ${accountNotFound ? 'not found' : 'suspended'}`);
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

    // Extract follower count
    const followersElement = await page.locator('a[href$="/verified_followers"] span, a[href$="/followers"] span').first();
    const followersText = await followersElement.textContent().catch(() => '0');
    const followers_count = parseNumber(followersText);

    // Extract following count
    const followingElement = await page.locator('a[href$="/following"] span').first();
    const followingText = await followingElement.textContent().catch(() => '0');
    const following_count = parseNumber(followingText);

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
