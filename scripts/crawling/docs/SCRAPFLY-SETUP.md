# ScrapFly Integration for X/Twitter Scraping

## Overview

ScrapFly successfully bypasses X/Twitter's anti-scraping protection. This document outlines what works, what requires authentication, and how to use the system.

## What's Working

✅ **Anti-Bot Detection Bypass**: ScrapFly's ASP (Anti-Scraping Protection) successfully bypasses X's bot detection
✅ **User Profiles**: Public profiles are accessible WITHOUT authentication
✅ **Recent Tweets**: Profile pages show recent tweets (≈13 tweets visible)
✅ **Profile Metadata**: Username, bio, follower counts all accessible

## What Requires Authentication

🔐 **Search Results**: Searching for tweets/users requires logged-in cookies
🔐 **Extended Tweet History**: Full timeline access needs authentication
🔐 **Interactions**: Likes, retweets, replies require authentication

## API Costs

Based on testing with ScrapFly API:
- **Search request**: ~32 credits
- **Profile request**: ~30 credits
- **Current balance**: 814 credits remaining

## Files Created

### Core Implementation
- `utils/scrapfly-client.js` - ScrapFly API client
  - `searchTwitter(query, options)` - Search for tweets (needs auth)
  - `getUserProfile(username, options)` - Get profile (public)
  - `getTweet(tweetUrl, options)` - Get specific tweet
  - `scrape(url, options)` - Generic scraping method

### Testing & Setup
- `test-scrapfly.js` - Basic functionality test (no auth required)
- `test-scrapfly-auth.js` - Authenticated scraping test
- `capture-x-cookies.js` - Manual cookie capture tool

### Configuration
- `config/x-crawler-accounts.json` - Contains ScrapFly API key
  ```json
  {
    "scrapfly": {
      "apiKey": "scp-live-..."
    }
  }
  ```

## Usage

### 1. Test Basic Functionality (No Auth)

```bash
node scripts/kols/test-scrapfly.js
```

This tests:
- Profile scraping (Elon Musk's profile)
- Search (will show login wall)

### 2. Capture Cookies for Authenticated Scraping

```bash
node scripts/kols/capture-x-cookies.js
```

This will:
1. Open a browser window
2. Let you manually log in to X
3. Capture and save cookies to `config/x-cookies.json`

### 3. Test Authenticated Scraping

```bash
node scripts/kols/test-scrapfly-auth.js
```

This uses saved cookies to test search functionality.

## Code Examples

### Get User Profile (No Auth Needed)

```javascript
import ScrapFlyClient from './utils/scrapfly-client.js';

const client = new ScrapFlyClient('scp-live-YOUR_KEY');

const result = await client.getUserProfile('elonmusk');
const html = result.result.content;

// Parse HTML to extract profile data
// - Username, display name
// - Bio/description
// - Follower/following counts
// - Recent tweets (≈13 visible)
```

### Search Tweets (Auth Required)

```javascript
import fs from 'fs/promises';

// Load cookies
const cookieData = await fs.readFile('config/x-cookies.json', 'utf-8');
const cookies = JSON.parse(cookieData).scrapflyFormat;

const result = await client.searchTwitter('$XAI', {
  session: 'my-session',
  cookies: cookies,
  waitForSelector: 'article[data-testid="tweet"]', // Now we can wait for tweets
});
```

## Key Findings

### Public Profile Structure

When scraping `https://x.com/{username}`:
- ✅ `data-testid="UserName"` - Contains username
- ✅ `data-testid="UserDescription"` - Contains bio
- ✅ `data-testid="tweet"` - Recent tweets (≈13)
- ✅ No authentication required
- ✅ 569KB HTML content

### Search (Requires Auth)

When scraping `https://x.com/search?q=...`:
- ⚠️ Shows login modal without cookies
- ⚠️ Only 278KB HTML (login page)
- ✅ Works with valid cookies
- ✅ Can search for tweets, users, hashtags

## Recommended Approach for KOL Discovery

### Phase 1: Profile-Based Discovery (No Auth)
1. Start with known KOL usernames
2. Scrape their profiles (public access)
3. Extract follower counts, bio keywords
4. Identify other KOLs from their tweets

### Phase 2: Search-Based Discovery (With Auth)
1. Capture cookies once using `capture-x-cookies.js`
2. Use cookies for search queries
3. Search for hashtags: `$XAI`, `#GrokAI`, `#xAI`
4. Discover new KOLs from search results

### Phase 3: Continuous Monitoring
1. Use ScrapFly sessions to maintain cookies
2. Rotate sessions to avoid rate limits
3. Combine profile + search for comprehensive tracking

## Error Handling

### ERR::SCRAPE::DOM_SELECTOR_NOT_FOUND

This error occurs when:
- Waiting for an element that doesn't exist
- Login wall prevents element from appearing
- Page structure is different than expected

**Solution**: Remove `waitForSelector` by default, only use it when authenticated.

The ScrapFly client has been updated to NOT wait for selectors by default. Pass `waitForSelector` explicitly when you have valid cookies.

## Next Steps

1. **Build HTML Parser**: Extract structured data from HTML
   - Profile parser (username, bio, followers, tweets)
   - Search results parser (tweets, users)

2. **Cookie Management**:
   - Automatic cookie refresh
   - Multiple account rotation
   - Cookie expiration detection

3. **Rate Limiting**:
   - Track ScrapFly credit usage
   - Implement request throttling
   - Session rotation strategy

4. **Integration**:
   - Integrate with `track-kols.js`
   - Add to daily cron job
   - Store results in `data/tracked-kols.json`

## Cost Estimation

At ~30 credits per request:
- **814 credits remaining** = ~27 requests
- Need to monitor usage and top up as needed
- Consider implementing caching to reduce API calls

## Resources

- ScrapFly Dashboard: https://scrapfly.io/dashboard
- ScrapFly Docs: https://scrapfly.io/docs/scrape-api/getting-started
- Anti-Bot Protection: https://scrapfly.io/docs/scrape-api/anti-scraping-protection
