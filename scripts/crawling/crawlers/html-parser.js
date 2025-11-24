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

  // Handle Spanish format: "149,8 mil" = 149.8K, "1,2 millones" = 1.2M
  let spanishMatch = text.match(/([\d.,]+)\s*(mil|millones?)\b/i);
  if (spanishMatch) {
    let numStr = spanishMatch[1];
    const spanishSuffix = spanishMatch[2].toLowerCase();

    // Spanish uses comma as decimal separator
    // "149,8" → "149.8"
    numStr = numStr.replace(/\./g, '').replace(',', '.');

    const number = parseFloat(numStr);
    if (isNaN(number)) return 0;

    // mil = thousand, millones = million
    const multiplier = spanishSuffix === 'mil' ? 1000 : 1000000;
    return Math.round(number * multiplier);
  }

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
      'a[href$="/followers"]',
      // Fallback: Any link containing "Follower" text
      'a:has-text("Follower")',
      'a:has-text("Seguidores")',
      // Data-testid based selectors
      '[data-testid="UserProfileHeader_Items"] a[href*="followers"]'
    ];
    const followers_count = await extractNumberFromLink(page, followerSelectors, 'followers');

    // If still 0, try to find any text with follower patterns and parse it
    let followers_count_final = followers_count;
    if (followers_count === 0) {
      console.log('      [DEBUG] No followers found with selectors, trying text patterns...');
      try {
        const bodyText = await page.locator('body').textContent().catch(() => '');
        // Look for patterns like "123K Followers" or "123 mil Seguidores" or "3 M Seguidores"
        const followerMatch = bodyText.match(/([\d.,]+)\s*([KMB]|mil|millones?)?\s*(Followers?|Seguidores)/i);
        if (followerMatch) {
          console.log(`      [DEBUG] Found text pattern: "${followerMatch[0]}"`);
          // Parse the matched text
          const parsedFromBody = parseNumber(followerMatch[0]);
          if (parsedFromBody > 0) {
            console.log(`      [DEBUG] Parsed from body text: ${parsedFromBody}`);
            followers_count_final = parsedFromBody;
          }
        } else {
          console.log('      [DEBUG] No follower text pattern found in page body');
        }
      } catch (e) {
        console.log('      [DEBUG] Failed to search body text:', e.message);
      }
    }

    // Extract following count using multi-strategy approach
    const followingSelectors = [
      'a[href$="/following"]',
      'a:has-text("Following")',
      'a:has-text("Siguiendo")'
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
        followers_count: followers_count_final,
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

/**
 * Parse search results from HTML page (fallback when GraphQL fails)
 *
 * @param {Page} page - Playwright page object with loaded search results
 * @returns {Promise<Array>} Array of tweet objects
 */
export async function parseSearchResultsFromHTML(page) {
  try {
    const tweets = [];

    // Get all tweet articles
    const tweetElements = await page.locator('article[data-testid="tweet"]').all();
    console.log(`   📄 HTML fallback: Found ${tweetElements.length} tweet elements`);

    for (const tweetEl of tweetElements) {
      try {
        // Extract username from the tweet
        const userNameEl = await tweetEl.locator('[data-testid="User-Name"]').first();
        const userText = await userNameEl.textContent().catch(() => '');
        const usernameMatch = userText.match(/@([\w]+)/);
        const username = usernameMatch ? usernameMatch[1] : '';

        if (!username) continue;

        // Extract display name
        const nameMatch = userText.match(/^(.+?)[@·]/);
        const name = nameMatch ? nameMatch[1].trim() : '';

        // Extract tweet text
        const tweetTextEl = await tweetEl.locator('[data-testid="tweetText"]').first();
        const text = await tweetTextEl.textContent().catch(() => '');

        // Extract engagement metrics
        // Likes
        const likeButton = await tweetEl.locator('[data-testid="like"]').first();
        const likeAriaLabel = await likeButton.getAttribute('aria-label').catch(() => '');
        const likeMatch = likeAriaLabel.match(/([\d.,]+)/);
        const likeCount = likeMatch ? parseNumber(likeMatch[0]) : 0;

        // Retweets
        const retweetButton = await tweetEl.locator('[data-testid="retweet"]').first();
        const retweetAriaLabel = await retweetButton.getAttribute('aria-label').catch(() => '');
        const retweetMatch = retweetAriaLabel.match(/([\d.,]+)/);
        const retweetCount = retweetMatch ? parseNumber(retweetMatch[0]) : 0;

        // Reply count
        const replyButton = await tweetEl.locator('[data-testid="reply"]').first();
        const replyAriaLabel = await replyButton.getAttribute('aria-label').catch(() => '');
        const replyMatch = replyAriaLabel.match(/([\d.,]+)/);
        const replyCount = replyMatch ? parseNumber(replyMatch[0]) : 0;

        // Views (if available)
        const viewsEl = await tweetEl.locator('a[href*="/analytics"]').first();
        const viewsAriaLabel = await viewsEl.getAttribute('aria-label').catch(() => '');
        const viewsMatch = viewsAriaLabel.match(/([\d.,]+)/);
        const viewCount = viewsMatch ? parseNumber(viewsMatch[0]) : 0;

        // Try to get tweet ID from link
        const tweetLink = await tweetEl.locator('a[href*="/status/"]').first();
        const tweetHref = await tweetLink.getAttribute('href').catch(() => '');
        const tweetIdMatch = tweetHref.match(/\/status\/(\d+)/);
        const tweetId = tweetIdMatch ? tweetIdMatch[1] : `html-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        // Build tweet object matching GraphQL structure
        const tweet = {
          id: tweetId,
          text: text.trim(),
          author: {
            id: '', // Not available from HTML
            username: username,
            name: name,
            profile_image_url: '',
            public_metrics: {
              followers_count: 0, // Not available from HTML
              following_count: 0,
              tweet_count: 0
            }
          },
          public_metrics: {
            like_count: likeCount,
            retweet_count: retweetCount,
            reply_count: replyCount,
            impression_count: viewCount
          },
          created_at: '', // Not easily available from HTML
          extraction_method: 'HTML parsing'
        };

        tweets.push(tweet);
      } catch (e) {
        // Skip individual tweet parsing errors
        continue;
      }
    }

    console.log(`   ✅ HTML fallback extracted ${tweets.length} tweets`);
    return tweets;

  } catch (error) {
    console.error('   ❌ Error parsing search results from HTML:', error.message);
    return [];
  }
}

export default {
  parseProfileFromHTML,
  waitForProfileLoad,
  parseNumber,
  parseSearchResultsFromHTML
};
