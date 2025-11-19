# Oxylabs Options Comparison for X/Twitter KOL Discovery

## Executive Summary

**RECOMMENDATION: Use Oxylabs Web Unblocker (with Playwright)**

This is the best solution for our X/Twitter KOL discovery crawler because it:
- ✅ Works with our existing Playwright code (simple proxy configuration change)
- ✅ AI-powered proxy with automatic fingerprinting and CAPTCHA solving
- ✅ JavaScript rendering built-in (`X-Oxylabs-Render: html` header)
- ✅ Cost-effective (pay-per-request, NOT expensive per-session pricing)
- ✅ Supports our cookie authentication approach
- ✅ Works with local Playwright installation (GitHub Actions compatible)
- ✅ **Free 1-week trial available** (no credit card required)

---

## Complete Option Comparison

### 1. Residential Proxies (CURRENT - NOT WORKING ❌)

**What we tried:**
```javascript
proxyUrl = `http://customer-${username}-country-${country}:${password}@pr.oxylabs.io:7777`;

launchOptions.proxy = {
  server: proxyUrl,
};
```

**Why it fails:**
- ❌ X/Twitter has advanced bot detection that blocks basic residential proxies
- ❌ Even with authentication cookies, connections timeout after 90+ seconds
- ❌ Requires managing browser fingerprinting manually
- ❌ No automatic CAPTCHA solving
- ❌ Simple IP rotation is insufficient for X/Twitter

**Status:** DEPRECATED - Does not work for X/Twitter

---

### 2. Web Scraper API

**What it is:**
- REST API service for scraping pre-defined targets
- Returns parsed JSON data
- No browser automation needed

**Endpoint:**
```
POST https://realtime.oxylabs.io/v1/queries
```

**Authentication:**
```json
{
  "username": "OXYLABS_USERNAME",
  "password": "OXYLABS_PASSWORD"
}
```

**For Twitter:**
- Supports Twitter profiles, tweets, search
- Returns structured JSON data
- Pricing: ~$99.99/month for Twitter-specific scraping

**Example:**
```javascript
import axios from 'axios';

const response = await axios.post(
  'https://realtime.oxylabs.io/v1/queries',
  {
    source: 'twitter',  // Pre-defined Twitter source
    query: username,
    parse: true
  },
  {
    auth: {
      username: process.env.OXYLABS_USERNAME,
      password: process.env.OXYLABS_PASSWORD
    }
  }
);

const profileData = response.data.results[0].content;
```

**Pros:**
- ✅ Simple REST API integration
- ✅ Returns pre-parsed JSON (no GraphQL interception needed)
- ✅ Handles all anti-bot measures automatically
- ✅ Synchronous (realtime) or asynchronous (push-pull) modes

**Cons:**
- ❌ **Limited to pre-defined data points** (may not have all fields we need)
- ❌ **Requires complete rewrite** of our crawler logic
- ❌ Less flexible than browser automation
- ❌ Cannot customize scraping logic
- ❌ Cannot use our existing cookie authentication
- ❌ Cannot intercept GraphQL responses

**Use case:** Good for simple, standardized scraping when you only need basic Twitter data

---

### 3. Web Unblocker (RECOMMENDED ✅)

**What it is:**
- AI-powered proxy solution with intelligent unblocking
- Works as an enhanced proxy endpoint for Playwright/Puppeteer
- Includes automatic proxy rotation, fingerprinting, CAPTCHA solving, and retries
- JavaScript rendering capability via headers
- **Uses local Playwright installation** (not cloud-based)

**Endpoint:**
```
https://unblock.oxylabs.io:60000
```

**Key Features:**
- AI-powered proxy type selection
- Automatic browser fingerprint generation
- Automatic retry mechanisms
- Session persistence across requests
- JavaScript rendering (`X-Oxylabs-Render: html`)
- Custom headers support
- Cookie reuse and POST request support
- **Free 1-week trial** (no credit card required)

**Integration with Playwright:**
```javascript
import { chromium } from 'playwright';

// Simple proxy configuration
const browser = await chromium.launch({
  headless: true,
  proxy: {
    server: 'https://unblock.oxylabs.io:60000',
    username: process.env.OXYLABS_USERNAME,
    password: process.env.OXYLABS_PASSWORD
  },
  args: [
    '--disable-blink-features=AutomationControlled',
    '--disable-dev-shm-usage',
    '--no-sandbox',
  ],
});

const context = await browser.newContext({
  // Add JavaScript rendering header
  extraHTTPHeaders: {
    'X-Oxylabs-Render': 'html'  // Enable JS rendering
  },
  ignoreHTTPSErrors: true,  // Required for Web Unblocker
});

// Load cookies for X/Twitter authentication
await context.addCookies(cookies);

const page = await context.newPage();

// Set up GraphQL response listener (same as before!)
page.on('response', async (response) => {
  const url = response.url();
  if (url.includes('UserByScreenName')) {
    const data = await response.json();
    // ... handle profile data
  }
});

// Navigate to profile
await page.goto('https://x.com/username', {
  waitUntil: 'domcontentloaded',
  timeout: 90000
});

await browser.close();
```

**Pros:**
- ✅ **Minimal code changes** (just update proxy configuration)
- ✅ AI-powered anti-bot evasion (fingerprinting, CAPTCHA, retries)
- ✅ JavaScript rendering built-in
- ✅ Works with our existing cookie authentication
- ✅ **Supports GraphQL API interception** (our current approach)
- ✅ Uses local Playwright (works in GitHub Actions with existing setup)
- ✅ **Cost-effective** (pay-per-request, not per-session like Unblocking Browser)
- ✅ Session persistence for efficiency
- ✅ **Free 1-week trial** to test before committing

**Cons:**
- ⚠️ Requires ignoring SSL certificate validation (`ignoreHTTPSErrors: true`)
- ⚠️ 180-second timeout recommended for JavaScript rendering
- ⚠️ Slightly slower than direct requests due to rendering

**Use case:** Perfect for our X/Twitter KOL discovery - complex browser automation with anti-bot requirements

---

### 4. Unblocking Browser (EXPENSIVE ⚠️)

**What it is:**
- Cloud-based remote headless Chrome/Firefox
- WebSocket (CDP) connection to remote browser
- Pre-patched for anti-bot evasion
- Hosted on Oxylabs infrastructure

**Connection:**
```
wss://username:password@ubc.oxylabs.io
```

**Integration:**
```javascript
import { chromium } from 'playwright';

const browser = await chromium.connectOverCDP(
  `wss://${OXYLABS_USERNAME}:${OXYLABS_PASSWORD}@ubc.oxylabs.io`
);
```

**Pros:**
- ✅ Most advanced stealth capabilities
- ✅ Cloud-based (no local browser needed)
- ✅ Built-in proxies and anti-detection
- ✅ Works with Playwright/Puppeteer

**Cons:**
- ❌ **EXPENSIVE** (per-session pricing, higher cost than Web Unblocker)
- ❌ More complex setup (WebSocket connection)
- ❌ May not be accepted for our use case (user concern)
- ❌ Overkill for our needs

**Use case:** Enterprise-scale scraping with maximum stealth requirements

---

## Detailed Comparison Matrix

| Feature | Residential Proxies | Web Scraper API | **Web Unblocker** ✅ | Unblocking Browser |
|---------|---------------------|-----------------|----------------------|--------------------|
| **Works for X/Twitter** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| **Code Changes** | ✅ Current | ❌ Complete rewrite | ✅ Minimal | ⚠️ Moderate |
| **Cookie Auth** | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |
| **GraphQL Interception** | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |
| **JavaScript Rendering** | ❌ Manual | ✅ Automatic | ✅ Header-based | ✅ Built-in |
| **CAPTCHA Solving** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| **Fingerprinting** | ❌ Manual | ✅ Automatic | ✅ AI-powered | ✅ Pre-patched |
| **Local Playwright** | ✅ Yes | ❌ N/A | ✅ Yes | ❌ No (cloud-based) |
| **GitHub Actions** | ✅ Works | ✅ Works | ✅ Works | ✅ Works |
| **Pricing** | Base plan | ~$99.99/mo | Pay-per-request | Pay-per-session |
| **Cost** | Low | Medium | **Medium** | **High** |
| **Free Trial** | No | No | ✅ **1 week** | Varies |
| **Flexibility** | High | Low | High | High |
| **Data Fields** | All | Limited | All | All |

---

## Implementation Comparison

### Current (Residential Proxy - FAILING ❌)

```javascript
// ❌ NOT WORKING - Times out, detected by X/Twitter
const proxyUrl = `http://customer-${username}-country-${country}:${password}@pr.oxylabs.io:7777`;

const launchOptions = {
  headless: true,
  proxy: {
    server: proxyUrl
  }
};

const crawler = new PlaywrightCrawler({
  launchContext: { launchOptions },
  // ... config
});
```

**Issues:**
- Times out after 90 seconds
- X/Twitter detects and blocks
- No CAPTCHA solving
- No intelligent fingerprinting

---

### Recommended: Web Unblocker ✅

```javascript
// ✅ RECOMMENDED - AI-powered, cost-effective, minimal changes
import { chromium } from 'playwright';

async function getUserProfile(username, cookies) {
  // Launch browser with Web Unblocker proxy
  const browser = await chromium.launch({
    headless: true,
    proxy: {
      server: 'https://unblock.oxylabs.io:60000',
      username: process.env.OXYLABS_USERNAME,
      password: process.env.OXYLABS_PASSWORD
    },
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--no-sandbox',
    ],
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    extraHTTPHeaders: {
      'X-Oxylabs-Render': 'html'  // Enable JavaScript rendering
    },
    ignoreHTTPSErrors: true,  // Required for Web Unblocker
  });

  // Add X/Twitter authentication cookies
  await context.addCookies(cookies);

  const page = await context.newPage();

  // Set up GraphQL response listener (unchanged!)
  let profileData = null;

  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('UserByScreenName')) {
      try {
        const data = await response.json();
        profileData = parseUserProfile(data);
      } catch (e) {
        console.error('Error parsing profile:', e);
      }
    }
  });

  // Navigate to profile
  await page.goto(`https://x.com/${username}`, {
    waitUntil: 'domcontentloaded',
    timeout: 180000  // 3 minutes for JS rendering
  });

  // Wait for GraphQL response
  await page.waitForTimeout(5000);

  await browser.close();

  return profileData;
}
```

**Changes from current code:**
1. ✅ Update proxy server to `https://unblock.oxylabs.io:60000`
2. ✅ Add `X-Oxylabs-Render: html` header
3. ✅ Set `ignoreHTTPSErrors: true`
4. ✅ Increase timeout to 180 seconds
5. ✅ **Everything else stays the same!**

---

### Alternative: Web Scraper API

```javascript
// ⚠️ ALTERNATIVE - Requires complete rewrite
import axios from 'axios';

async function getUserProfile(username) {
  const response = await axios.post(
    'https://realtime.oxylabs.io/v1/queries',
    {
      source: 'twitter',
      query: username,
      parse: true,
      geo_location: 'Spain'
    },
    {
      auth: {
        username: process.env.OXYLABS_USERNAME,
        password: process.env.OXYLABS_PASSWORD
      },
      timeout: 180000
    }
  );

  // Returns pre-parsed JSON
  const content = response.data.results[0].content;

  // Need to map API fields to our structure
  return {
    followers_count: content.followers,
    // ... may not have all fields we need
  };
}
```

**Changes required:**
1. ❌ Remove Playwright entirely
2. ❌ Remove cookie authentication
3. ❌ Remove GraphQL interception
4. ❌ Rewrite data parsing logic
5. ❌ May lose some data fields

---

## Pricing Details

### Residential Proxies
- **Pricing:** Included in base Oxylabs plan
- **Cost:** Low (but doesn't work for X/Twitter)
- **Model:** Pay for proxy bandwidth

### Web Scraper API
- **Pricing:** ~$99.99/month for Twitter-specific scraping
- **Cost:** Medium (subscription-based)
- **Model:** Monthly subscription + usage limits

### Web Unblocker (RECOMMENDED)
- **Pricing:** Pay-per-request
- **Cost:** Medium (cost-effective for our use case)
- **Model:** Pay only for successful requests
- **Trial:** ✅ **Free 1-week trial** (no credit card required)
- **Billing:** Based on number of pages scraped

### Unblocking Browser
- **Pricing:** Pay-per-session
- **Cost:** High (expensive for our use case)
- **Model:** Pay for browser session time
- **Billing:** Based on session duration and requests

**Recommendation:** Web Unblocker offers the best cost/performance ratio for our KOL discovery workflow.

---

## Migration Plan: Web Unblocker

### Phase 1: Testing (1-2 days)

1. ✅ Create test script with Web Unblocker proxy
2. ✅ Test with google.com to verify proxy works
3. ✅ Test with x.com profile using cookies
4. ✅ Verify GraphQL interception still works
5. ✅ Validate all profile data fields are captured

### Phase 2: Integration (1 day)

1. Update `twitter-crawler-authenticated.js`:
   - Change proxy endpoint to Web Unblocker
   - Add `X-Oxylabs-Render: html` header
   - Set `ignoreHTTPSErrors: true`
   - Increase timeout to 180 seconds

2. Test locally with .env credentials
3. Test in GitHub Actions with secrets

### Phase 3: Production Deployment (1 day)

1. Update all discovery scripts
2. Remove old residential proxy config code
3. Update documentation (AUTHENTICATION_SETUP.md)
4. Deploy to scheduled workflows
5. Monitor first production run

### Phase 4: Optimization (ongoing)

1. Monitor usage and costs
2. Tune timeout values for efficiency
3. Implement session reuse if beneficial
4. Add error handling for proxy failures
5. Consider rate limiting to control costs

---

## Decision Matrix

**Use Web Unblocker if:**
- ✅ You need browser automation (GraphQL interception, cookies)
- ✅ You want minimal code changes
- ✅ Cost-effectiveness is important
- ✅ You need all profile data fields
- ✅ You want to keep existing Playwright setup

**Use Web Scraper API if:**
- ⚠️ You only need basic profile fields
- ⚠️ You're willing to rewrite crawler logic
- ⚠️ You prefer REST API over browser automation
- ⚠️ You want predictable monthly pricing

**Use Unblocking Browser if:**
- ❌ Cost is not a concern (enterprise budget)
- ❌ You need maximum stealth
- ❌ Cloud-based execution is required
- ❌ (Not recommended for our use case)

---

## Recommendation Summary

**MIGRATE TO WEB UNBLOCKER**

**Why:**
1. ✅ **Minimal code changes** (just proxy configuration)
2. ✅ **AI-powered anti-bot** (solves our timeout issues)
3. ✅ **Cost-effective** (pay-per-request, not per-session)
4. ✅ **Works with existing setup** (cookie auth, GraphQL interception)
5. ✅ **Free trial available** (test before committing)
6. ✅ **GitHub Actions compatible** (uses local Playwright)
7. ✅ **All data fields preserved** (no data loss)

**Next Steps:**
1. Create `test-web-unblocker.js` test script
2. Test with google.com to verify proxy
3. Test with x.com to verify scraping works
4. Update main crawler if successful
5. Deploy to production

---

## Resources

- [Web Unblocker Documentation](https://developers.oxylabs.io/advanced-proxy-solutions/web-unblocker)
- [Web Unblocker Getting Started](https://developers.oxylabs.io/advanced-proxy-solutions/web-unblocker/getting-started)
- [JavaScript Rendering Guide](https://developers.oxylabs.io/advanced-proxy-solutions/web-unblocker/headless-browser/javascript-rendering)
- [Playwright Integration](https://developers.oxylabs.io/proxies/integration-guides/3rd-party-integrations/playwright)
- [Web Scraper API Documentation](https://developers.oxylabs.io/scraper-apis/web-scraper-api)
- [Oxylabs Dashboard](https://dashboard.oxylabs.io/) (Free 1-week trial)
