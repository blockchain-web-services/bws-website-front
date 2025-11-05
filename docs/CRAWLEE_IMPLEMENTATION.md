# Crawlee Implementation Guide

## Overview

The KOL system now supports **two data sources** that can be switched via environment variable:

1. **Official Twitter API** (default) - Uses twitter-api-v2 library
2. **Crawlee Web Scraping** - Uses Playwright to scrape Twitter/X directly

## Quick Start

### Switch Between Modes

```bash
# API Mode (default)
node scripts/kols/discover-by-engagement.js

# Crawlee Mode
TWITTER_DATA_SOURCE=crawlee node scripts/kols/discover-by-engagement.js

# Crawlee Mode with visible browser (debugging)
TWITTER_DATA_SOURCE=crawlee CRAWLEE_HEADLESS=false node scripts/kols/discover-by-engagement.js
```

### Test the Hybrid Client

```bash
# Test in API mode (requires credentials)
node scripts/kols/test-hybrid-client.js

# Test in Crawlee mode (no credentials needed)
TWITTER_DATA_SOURCE=crawlee node scripts/kols/test-hybrid-client.js

# Test Crawlee directly (visible browser)
CRAWLEE_HEADLESS=false node scripts/kols/test-crawlee.js
```

## Environment Variables

| Variable | Values | Default | Purpose |
|----------|--------|---------|---------|
| `TWITTER_DATA_SOURCE` | `api` or `crawlee` | `api` | Choose data source |
| `CRAWLEE_HEADLESS` | `true` or `false` | `true` | Show/hide browser in Crawlee mode |

## Architecture

### Files Structure

```
scripts/kols/
├── crawlers/
│   ├── graphql-parser.js          # Parses Twitter GraphQL responses
│   └── twitter-crawler.js         # Crawlee browser automation
├── utils/
│   ├── twitter-client.js          # Official API client
│   └── twitter-hybrid-client.js   # Router (API ↔ Crawlee)
├── test-crawlee.js                # Test Crawlee functions
└── test-hybrid-client.js          # Test hybrid switching
```

### How It Works

```
┌─────────────────────────────────────┐
│   Your Script (e.g., discover.js)  │
└──────────────┬──────────────────────┘
               │
               ├─→ Import: twitter-hybrid-client.js
               │
               ├─→ Check: TWITTER_DATA_SOURCE env var
               │
               ├──→ "api"     ──→ Official API (twitter-api-v2)
               │
               └──→ "crawlee" ──→ Browser Scraping (Playwright)
                                   ├─→ Navigate to X.com
                                   ├─→ Intercept GraphQL responses
                                   ├─→ Parse with graphql-parser.js
                                   └─→ Return data (same format as API)
```

## Available Functions

### Hybrid Client Functions

All these functions work in **both API and Crawlee modes**:

#### getUserByUsername(clientOrUsername, username)

**API Mode:**
```javascript
import { createClient, getUserByUsername } from './utils/twitter-hybrid-client.js';

const client = createClient('readonly');
const user = await getUserByUsername(client, 'vitalikbuterin');
```

**Crawlee Mode:**
```javascript
// Set env: TWITTER_DATA_SOURCE=crawlee
import { getUserByUsername } from './utils/twitter-hybrid-client.js';

const user = await getUserByUsername('vitalikbuterin');
```

#### searchTweets(clientOrQuery, queryOrOptions, options)

**API Mode:**
```javascript
const tweets = await searchTweets(client, 'crypto', { max_results: 100 });
```

**Crawlee Mode:**
```javascript
const tweets = await searchTweets('crypto', { maxResults: 100 });
```

#### getUserFollowing(clientOrUsername, userIdOrMaxResults, maxResults)

**API Mode:**
```javascript
const following = await getUserFollowing(client, userId, 100);
```

**Crawlee Mode:**
```javascript
const following = await getUserFollowing('vitalikbuterin', 100);
```

#### getUserTweets(clientOrUsername, userIdOrOptions, options)

**API Mode:**
```javascript
const tweets = await getUserTweets(client, userId, { max_results: 20 });
```

**Crawlee Mode:**
```javascript
const tweets = await getUserTweets('vitalikbuterin', { maxResults: 20 });
```

### API-Only Functions

These functions **only work in API mode** (will throw error in Crawlee mode):

- `postReply()` - Posting requires authentication (Crawlee can't post)
- `getTweetById()` - Not supported by Crawlee scraping
- `batchUserLookup()` - Falls back to API even in Crawlee mode (batch operations need API)

## Comparison: API vs Crawlee

### Official Twitter API

**Pros:**
- ✅ FREE (for our usage level)
- ✅ Reliable (99% success rate)
- ✅ Fast (direct API calls)
- ✅ Batch operations supported
- ✅ Posting/replying supported
- ✅ No maintenance

**Cons:**
- ❌ Rate limits (300 requests/15min for search)
- ❌ Requires API credentials
- ❌ May be restricted in future

**Best For:**
- Production workflows
- Posting replies
- Batch operations
- GitHub Actions

### Crawlee Web Scraping

**Pros:**
- ✅ No API credentials needed
- ✅ No official rate limits
- ✅ Can bypass API restrictions
- ✅ Works even if API is restricted

**Cons:**
- ❌ Slower (browser automation)
- ❌ Twitter blocks after ~100-300 requests (without proxies)
- ❌ 70-80% success rate (blocking, CAPTCHAs)
- ❌ Cannot post/reply
- ❌ Requires maintenance (Twitter changes)
- ❌ No batch operations

**Best For:**
- Testing without API credentials
- Backup when API quota exhausted
- Local development
- Future-proofing (if API becomes restricted)

**Requires residential proxies for production use**
- Cost: $300-1500/month
- Adds 10-15 hours/month maintenance

## Current Recommendation

**Use Official API** (default `TWITTER_DATA_SOURCE=api`)

The official API is:
- FREE for our needs
- More reliable
- Faster
- Easier to maintain

Use Crawlee only for:
- Testing without credentials
- Emergency backup when API quota exhausted
- Exploration/research

## Implementation Status

### ✅ Completed

- [x] Install Crawlee dependencies (crawlee, playwright, etc.)
- [x] Fix OAuth issue for `getUserFollowing()`
- [x] Create GraphQL parser for Twitter responses
- [x] Implement Crawlee crawler with all 4 main functions:
  - [x] `getUserProfile()`
  - [x] `searchTweets()`
  - [x] `getUserFollowing()`
  - [x] `getUserTweets()`
- [x] Create hybrid client router
- [x] Test Crawlee functions locally ✅ Working!
- [x] Test hybrid switching ✅ Working!

### 🔄 In Progress / Optional

- [ ] Update `discover-by-engagement.js` to use hybrid client
- [ ] Update `discover-kols.js` to use hybrid client
- [ ] Update `evaluate-and-reply-kols.js` to use hybrid client

**Note:** These scripts are heavily API-dependent (batch operations, direct v2 calls). They work fine with the current official API. Updating them to support Crawlee mode is optional and recommended only if API access becomes restricted.

## How to Update Existing Scripts

To make a script use the hybrid client:

### 1. Update Imports

**Before:**
```javascript
import {
  createReadOnlyClient,
  getUserByUsername,
  searchTweets
} from './utils/twitter-client.js';
```

**After:**
```javascript
import {
  createClient,
  getUserByUsername,
  searchTweets,
  isCrawleeMode,
  isAPIMode
} from './utils/twitter-hybrid-client.js';
```

### 2. Create Client

**Before:**
```javascript
const client = createReadOnlyClient();
```

**After:**
```javascript
const client = createClient('readonly'); // Returns null in Crawlee mode
```

### 3. Update Function Calls

**For functions that work in both modes:**
```javascript
// API mode
const user = await getUserByUsername(client, username);

// Crawlee mode (client is null, so username becomes first param)
const user = await getUserByUsername(username);

// Solution: Use conditional based on mode
if (isCrawleeMode()) {
  const user = await getUserByUsername(username);
} else {
  const user = await getUserByUsername(client, username);
}
```

**Or use the smart wrapper pattern:**
```javascript
// Hybrid client handles the routing automatically
const user = isCrawleeMode()
  ? await getUserByUsername(username)
  : await getUserByUsername(client, username);
```

### 4. Handle API-Only Operations

Some operations only work in API mode:

```javascript
if (isAPIMode()) {
  // Batch operations
  const users = await batchUserLookup(client, userIds);

  // Post replies
  await postReply(client, tweetId, replyText);
} else {
  console.warn('⚠️ Batch operations not supported in Crawlee mode');
  // Fallback or skip
}
```

## Testing

### Test Crawlee Functions

```bash
# Test getUserProfile
node -e "
import('./scripts/kols/crawlers/twitter-crawler.js').then(async ({ getUserProfile }) => {
  const profile = await getUserProfile('vitalikbuterin');
  console.log(profile);
  process.exit(0);
});
"

# Test searchTweets
TWITTER_DATA_SOURCE=crawlee node scripts/kols/test-crawlee.js
```

### Test Hybrid Client

```bash
# API mode (requires BWSXAI_TWITTER_BEARER_TOKEN)
export BWSXAI_TWITTER_BEARER_TOKEN="your_token_here"
node scripts/kols/test-hybrid-client.js

# Crawlee mode (no credentials needed)
TWITTER_DATA_SOURCE=crawlee node scripts/kols/test-hybrid-client.js
```

## Troubleshooting

### Issue: Crawlee Gets Blocked Quickly

**Solution:** This is expected without proxies. Twitter blocks:
- Datacenter IPs: Immediately
- Residential IPs: After 100-300 requests

**Options:**
1. Use API mode instead (recommended)
2. Purchase residential proxies ($300-1500/month)
3. Rotate between different network connections
4. Add longer delays between requests

### Issue: GraphQL Capture Fails

**Symptom:** "⚠️ GraphQL capture failed, attempting DOM scraping"

**Cause:** Twitter's GraphQL endpoints may require authentication

**Solution:** DOM scraping fallback activates automatically. For better results:
1. Use API mode
2. Or implement cookie/session management in Crawlee

### Issue: Crawler Hangs After Completion

**Cause:** Crawlee keeps browser instances open

**Solution:** This is expected. The data is successfully returned, but cleanup takes time. The process will exit eventually, or you can kill it manually.

## Next Steps

1. **Test locally:** Run `TWITTER_DATA_SOURCE=crawlee node scripts/kols/test-hybrid-client.js`
2. **Keep using API mode** for production (it's free and works great)
3. **Use Crawlee** only when needed (backup, testing, research)
4. **Optional:** Update existing scripts to use hybrid client (not urgent)

## Production Recommendations

For GitHub Actions workflows:

```yaml
# Keep using API mode (default)
env:
  TWITTER_DATA_SOURCE: api  # or omit (default is api)
  BWSXAI_TWITTER_BEARER_TOKEN: ${{ secrets.BWSXAI_TWITTER_BEARER_TOKEN }}
```

Only switch to Crawlee if API becomes restricted:

```yaml
env:
  TWITTER_DATA_SOURCE: crawlee
  CRAWLEE_HEADLESS: true
  # Note: Will need residential proxies for reliability
```

## Support

For issues or questions:
1. Check logs for specific error messages
2. Test in visible browser mode (`CRAWLEE_HEADLESS=false`)
3. Verify environment variables are set correctly
4. Try API mode first to isolate Crawlee-specific issues
