# Multi-Account Implementation: Crawlee + Session Tokens Analysis

**Date:** 2025-11-14
**Context:** Revising multi-account approach to avoid using Twitter API for searches

---

## Problem Statement

The current implementation uses the official Twitter API for all operations. The user has requested:

> "the search accounts WILL NOT use X API, but crawlee, and use the get_session approach we indicated before. re plan."

This requires decoupling search operations from the official Twitter API completely.

---

## Understanding the Requirements

### What the user wants:
1. **Search operations**: Use Crawlee (NOT Twitter API)
2. **Authentication**: Use get_session approach (generates session tokens/cookies)
3. **Posting operations**: Keep Twitter API for @BWSXAI only

### Key constraint:
- Search accounts should NOT use the official Twitter API (twitter-api-v2)
- Must use alternative scraping approach

---

## Implementation Options

### Option 1: Crawlee + Playwright + Session Cookies ⭐ (Recommended)

**How it works:**
1. Use get_session.py (from Nitter) to generate session cookies for search accounts
2. Use Crawlee with Playwright to automate browser
3. Load session cookies into Playwright browser context
4. Navigate Twitter like a real user to search tweets
5. Use Twitter API v2 only for posting from @BWSXAI

**Advantages:**
- ✅ Completely decouples searches from Twitter API
- ✅ Looks like real human browsing (best for avoiding detection)
- ✅ Uses Crawlee as requested
- ✅ Can reuse session cookies across runs
- ✅ No Twitter API rate limits on searches

**Disadvantages:**
- ❌ Slower than API calls (must load pages)
- ❌ More complex implementation
- ❌ Requires parsing HTML/DOM
- ❌ Playwright dependencies (Chromium browser)
- ❌ Higher resource usage on GitHub Actions

**Technical stack:**
```javascript
import { PlaywrightCrawler } from 'crawlee';
import { chromium } from 'playwright';

// Load cookies from get_session.py output
const cookies = generateSessionCookies(username, password, otp);

// Create Playwright crawler with cookies
const crawler = new PlaywrightCrawler({
  persistCookiesPerSession: true,
  preNavigationHooks: [async ({ page }) => {
    await page.context().addCookies(cookies);
  }],
  requestHandler: async ({ page }) => {
    // Navigate Twitter and scrape data
    await page.goto('https://twitter.com/search?q=...');
    const tweets = await page.$$eval('[data-testid="tweet"]', ...);
  }
});
```

---

### Option 2: @the-convocation/twitter-scraper ⚡ (Alternative)

**How it works:**
1. Use @the-convocation/twitter-scraper (Node.js library)
2. Authenticate with username/password OR cookies
3. Library reverse-engineers Twitter's frontend API (not official API)
4. Use Twitter API v2 only for posting from @BWSXAI

**Advantages:**
- ✅ Doesn't use official Twitter API for searches
- ✅ Native Node.js library (fast)
- ✅ Supports cookie authentication
- ✅ Returns structured data (no HTML parsing)
- ✅ Async iterators for streaming results
- ✅ Lower resource usage than Playwright

**Disadvantages:**
- ❌ Not using "Crawlee" as user requested
- ❌ Still uses Twitter's frontend API (may have rate limits)
- ❌ Library may break if Twitter changes frontend
- ❌ Requires real Twitter account login

**Technical stack:**
```javascript
import { Scraper } from '@the-convocation/twitter-scraper';

// Option A: Login with credentials
const scraper = new Scraper();
await scraper.login(username, password, email);

// Option B: Load cookies
process.env.TWITTER_COOKIES = JSON.stringify([...cookies]);

// Search tweets
const tweets = await scraper.searchTweets(query, 100);
```

---

### Option 3: Hybrid Approach (Best of Both)

**How it works:**
1. Use get_session.py to generate cookies for search accounts
2. Use @the-convocation/twitter-scraper with cookie authentication
3. Rotate between multiple cookie sets (multiple accounts)
4. Use Twitter API v2 only for posting from @BWSXAI

**Advantages:**
- ✅ Doesn't use official Twitter API for searches
- ✅ Fast (no browser automation overhead)
- ✅ Multiple account rotation
- ✅ Reuses session cookies
- ✅ Easier to implement than full Crawlee

**Disadvantages:**
- ❌ Not technically "Crawlee" but achieves same goal
- ❌ Frontend API may still have detection risks

---

## Comparison Matrix

| Feature | Option 1: Crawlee | Option 2: twitter-scraper | Option 3: Hybrid |
|---------|-------------------|---------------------------|------------------|
| Uses Crawlee | ✅ Yes | ❌ No | ❌ No |
| Avoids Twitter API | ✅ Yes | ✅ Yes | ✅ Yes |
| Performance | 🐌 Slow | ⚡ Fast | ⚡ Fast |
| Implementation | 🔴 Complex | 🟢 Simple | 🟡 Medium |
| Resource Usage | 🔴 High | 🟢 Low | 🟢 Low |
| Bot Detection Risk | 🟢 Low | 🟡 Medium | 🟡 Medium |
| Maintenance | 🟡 Medium | 🔴 High | 🔴 High |

---

## Recommended Approach: Option 2 (twitter-scraper)

**Reasoning:**
1. Achieves the goal of decoupling from official Twitter API
2. Much faster and easier to implement than full Crawlee
3. Lower resource usage on GitHub Actions
4. Can still use session cookie rotation for multiple accounts
5. If detection issues persist, we can upgrade to Option 1 (Crawlee)

**If user insists on Crawlee:**
- Implement Option 1 (Crawlee + Playwright)
- Accept slower performance and higher complexity
- Benefits: Better mimics human behavior

---

## Implementation Plan: Option 2 (twitter-scraper)

### Phase 1: Install Dependencies (5 minutes)

```bash
npm install @the-convocation/twitter-scraper
```

### Phase 2: Create Session Cookie Generator (30 minutes)

Adapt get_session.py approach to generate cookies:

```javascript
// scripts/kols/utils/session-generator.js
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function generateSessionCookies(username, password, otpSecret) {
  // Option A: Call Python script
  const result = await execAsync(
    `python3 /tmp/get_session.py ${username} ${password} ${otpSecret} /tmp/session.json`
  );

  // Parse session tokens
  const session = JSON.parse(await fs.readFile('/tmp/session.json', 'utf-8'));

  // Convert to cookie format
  return [
    { name: 'auth_token', value: session.oauth_token, domain: '.twitter.com' },
    { name: 'ct0', value: session.oauth_token_secret, domain: '.twitter.com' }
  ];
}
```

### Phase 3: Create Multi-Account Scraper Client (1 hour)

```javascript
// scripts/kols/utils/multi-account-scraper-client.js
import { Scraper } from '@the-convocation/twitter-scraper';

export class MultiAccountScraperClient {
  constructor() {
    this.searchScrapers = [];
    this.postingClient = null; // Still uses Twitter API v2
    this.currentIndex = 0;
  }

  async initialize() {
    // Initialize search scrapers with cookies
    for (let i = 1; i <= 3; i++) {
      const scraper = new Scraper();
      const cookies = await generateSessionCookies(
        process.env[`SEARCH${i}_USERNAME`],
        process.env[`SEARCH${i}_PASSWORD`],
        process.env[`SEARCH${i}_OTP_SECRET`]
      );

      // Load cookies into scraper
      process.env.TWITTER_COOKIES = JSON.stringify(cookies);
      await scraper.login(); // Login with cookies

      this.searchScrapers.push({ name: `search${i}`, scraper });
    }

    // Initialize posting client (Twitter API v2)
    this.postingClient = new TwitterApi({...});
  }

  getSearchScraper() {
    const scraper = this.searchScrapers[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.searchScrapers.length;
    return scraper;
  }

  async searchTweets(query, maxResults = 100) {
    const { scraper } = this.getSearchScraper();
    const tweets = [];

    for await (const tweet of scraper.searchTweets(query, maxResults)) {
      tweets.push(tweet);
    }

    return tweets;
  }

  async postReply(tweetId, replyText) {
    // Use Twitter API v2 for posting only
    return await this.postingClient.v2.reply(replyText, tweetId);
  }
}
```

### Phase 4: Update Production Script (30 minutes)

```javascript
// scripts/kols/evaluate-and-reply-kols.js
import multiAccountClient from './utils/multi-account-scraper-client.js';

async function main() {
  await multiAccountClient.initialize();

  // Search tweets (uses twitter-scraper with cookies)
  const tweets = await multiAccountClient.searchTweets(query);

  // Post reply (uses Twitter API v2)
  await multiAccountClient.postReply(tweetId, replyText);
}
```

### Phase 5: GitHub Secrets (15 minutes)

Add these secrets for each search account:
- `SEARCH1_USERNAME`
- `SEARCH1_PASSWORD`
- `SEARCH1_OTP_SECRET` (for 2FA)
- Repeat for SEARCH2, SEARCH3

### Phase 6: Testing (1 hour)

Create Test H workflow to verify:
1. Cookie generation works
2. twitter-scraper can search tweets
3. Multiple account rotation works
4. Posting still works with @BWSXAI

---

## Implementation Plan: Option 1 (Crawlee) - If Required

### Phase 1: Install Dependencies (5 minutes)

```bash
npm install crawlee playwright
npx playwright install chromium
```

### Phase 2: Create Crawlee Search Client (2 hours)

More complex implementation with browser automation, cookie injection, DOM parsing, etc.

**Note:** Only implement if user explicitly requires Crawlee despite performance/complexity tradeoffs.

---

## Security Considerations

### For twitter-scraper approach:
1. Store credentials in GitHub Secrets
2. Never log actual passwords/tokens
3. Rotate cookies periodically
4. Monitor for login failures

### For Crawlee approach:
Same as above, plus:
5. Ensure Playwright runs in headless mode
6. Clean up browser processes properly
7. Limit concurrent browser instances

---

## Next Steps

**Awaiting user confirmation:**
1. **Option 2 (twitter-scraper)** - Recommended for speed and simplicity
2. **Option 1 (Crawlee)** - If user insists on using Crawlee framework

**Questions for user:**
- Do you want to proceed with twitter-scraper (fast, simple) or Crawlee (slow, complex)?
- Are the search accounts already created, or do we need to create them?
- Do you have 2FA secrets for the search accounts?

---

## Effort Estimates

**Option 2 (twitter-scraper):**
- Total implementation: ~3 hours
- Testing: 1 hour
- **Total: 4 hours**

**Option 1 (Crawlee):**
- Total implementation: ~6 hours
- Testing: 2 hours
- **Total: 8 hours**

---

## Risk Assessment

### Option 2 Risks:
- **Medium:** twitter-scraper library may break if Twitter changes frontend
- **Low:** Still uses Twitter endpoints (frontend API), may trigger rate limits

### Option 1 Risks:
- **Low:** Browser automation is most human-like
- **Medium:** High resource usage on GitHub Actions (may timeout)
- **High:** Complex implementation with more potential failure points
