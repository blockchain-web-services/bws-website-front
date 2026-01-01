# BWS X SDK Fix Request: Extract Author Data in Crawler Mode

**Priority**: HIGH
**Component**: BWS X SDK (Crawler Mode)
**Issue**: `searchTweets()` returns empty author objects
**Impact**: Blocks account discovery workflows for all SDK users

---

## Problem Statement

The BWS X SDK's `searchTweets()` method in crawler mode (Playwright-based) returns tweets but with **empty author objects**:

```javascript
// Current behavior:
const tweets = await client.searchTweets(query, { maxResults: 20 });

// Returns:
[
  {
    id: "1234567890",
    text: "Tweet content here...",
    author: {
      username: '',           // ❌ Empty
      name: '',              // ❌ Empty
      description: undefined, // ❌ Missing
      public_metrics: undefined, // ❌ Missing
      verified: undefined    // ❌ Missing
    }
  }
]
```

**Expected behavior**: Author objects should contain full profile data extracted from the search results page.

---

## Root Cause

The Playwright crawler in the SDK extracts tweet content from Twitter search results but **doesn't scrape author profile information** from the same HTML elements.

**Location**: Likely in the SDK's crawler implementation of `searchTweets()`, specifically the HTML parsing/extraction logic.

---

## Required Fix

### 1. Update Crawler to Extract Author Data

**File to modify**: BWS X SDK crawler implementation (likely `crawler-client.js` or similar)

**What to extract from Twitter search results HTML**:

```javascript
// For each tweet in search results, extract:
{
  id: string,              // ✅ Already working
  text: string,            // ✅ Already working
  created_at: string,      // ✅ Already working

  // ADD THESE (from same HTML element):
  author: {
    id: string,            // Author user ID
    username: string,      // @handle (without @)
    name: string,          // Display name
    description: string,   // Bio text
    public_metrics: {
      followers_count: number,
      following_count: number,
      tweet_count: number,
      listed_count: number
    },
    verified: boolean,     // Blue checkmark status
    profile_image_url: string  // Optional
  }
}
```

### 2. HTML Selectors to Use

Based on Twitter's current HTML structure (as of 2026), author data is in the same article/tweet container:

```javascript
// Pseudo-code for extraction:
const tweetElements = await page.$$('[data-testid="tweet"]');

for (const tweet of tweetElements) {
  // Existing extraction:
  const tweetText = await tweet.$eval('[data-testid="tweetText"]', el => el.textContent);

  // ADD: Author username
  const username = await tweet.$eval('[data-testid="User-Name"] a[href^="/"]',
    el => el.getAttribute('href').replace('/', ''));

  // ADD: Author display name
  const name = await tweet.$eval('[data-testid="User-Name"] span',
    el => el.textContent);

  // ADD: Author bio (may require clicking through to profile - see Option 1 vs 2 below)

  // ADD: Follower count (if visible in search results)
  // Note: May not be available in search results, see workaround below
}
```

### 3. Two Implementation Options

#### Option 1: Extract What's Available in Search Results (RECOMMENDED)
**Pros**: Fast, no additional requests
**Cons**: Limited data (username, name, verified status only)

```javascript
// Minimal author data from search results:
author: {
  id: extractedFromDataAttributes,
  username: extractedFromLink,
  name: extractedFromSpan,
  verified: extractedFromVerifiedBadge,
  // description, public_metrics: null (not in search results)
}
```

#### Option 2: Fetch Full Profile for Each Author (More Complete)
**Pros**: Complete profile data including bio and follower counts
**Cons**: Slower (N additional requests), higher rate limit risk

```javascript
// After extracting usernames from search:
for (const username of uniqueUsernames) {
  const profile = await fetchUserProfile(username); // New method
  author = { ...profile };
}
```

**Recommendation**: Implement Option 1 first (fast, available now), add Option 2 as optional flag later.

---

## Implementation Guide

### Step 1: Locate the Crawler Search Implementation

```bash
# In BWS X SDK repository:
cd /path/to/bws-x-sdk-node

# Find the searchTweets crawler implementation:
grep -r "searchTweets" --include="*.js" --include="*.ts"
# Likely in: src/crawler/client.js or src/crawler/search.js
```

### Step 2: Add Author Extraction Logic

**Before** (current implementation):
```javascript
async searchTweets(query, options) {
  const tweets = await this.scrapeSearchResults(query, options);

  return tweets.map(tweet => ({
    id: tweet.id,
    text: tweet.text,
    created_at: tweet.timestamp,
    author: {} // ❌ Empty object
  }));
}
```

**After** (with fix):
```javascript
async searchTweets(query, options) {
  const tweets = await this.scrapeSearchResults(query, options);

  return tweets.map(tweet => ({
    id: tweet.id,
    text: tweet.text,
    created_at: tweet.timestamp,
    author: {
      id: tweet.authorId,
      username: tweet.authorUsername,
      name: tweet.authorName,
      description: tweet.authorBio || null,
      public_metrics: tweet.authorMetrics || {
        followers_count: 0,
        following_count: 0,
        tweet_count: 0,
        listed_count: 0
      },
      verified: tweet.authorVerified || false,
      profile_image_url: tweet.authorAvatar || null
    }
  }));
}
```

### Step 3: Update Scraper to Extract Author Fields

In the HTML scraping function:

```javascript
async scrapeSearchResults(query, options) {
  // ... existing page navigation code ...

  const tweets = await page.evaluate(() => {
    const tweetElements = document.querySelectorAll('[data-testid="tweet"]');

    return Array.from(tweetElements).map(tweet => {
      // Existing extraction:
      const tweetText = tweet.querySelector('[data-testid="tweetText"]')?.textContent;
      const tweetId = tweet.querySelector('a[href*="/status/"]')?.href.match(/status\/(\d+)/)?.[1];

      // NEW: Author extraction
      const authorLink = tweet.querySelector('a[href^="/"][href*=""]');
      const authorUsername = authorLink?.getAttribute('href')?.replace('/', '').split('/')[0];

      const authorName = tweet.querySelector('[data-testid="User-Name"] span')?.textContent;

      const authorVerified = !!tweet.querySelector('[data-testid="icon-verified"]');

      const authorAvatar = tweet.querySelector('img[src*="profile_images"]')?.src;

      // Author ID (from data attributes or REST ID)
      const authorId = tweet.querySelector('[data-testid="User-Avatar-Container"]')
        ?.closest('div')
        ?.getAttribute('data-user-id') || null;

      return {
        id: tweetId,
        text: tweetText,
        timestamp: extractedTimestamp,
        // NEW fields:
        authorId,
        authorUsername,
        authorName,
        authorVerified,
        authorAvatar,
        // Bio and metrics: null (not in search results)
        authorBio: null,
        authorMetrics: null
      };
    });
  });

  return tweets;
}
```

### Step 4: Add Tests

```javascript
// test/crawler-search.test.js

describe('searchTweets with author data', () => {
  it('should return author username and name', async () => {
    const client = new XTwitterClient({ mode: 'crawler', /* config */ });

    const tweets = await client.searchTweets('blockchain credentials', {
      maxResults: 5
    });

    expect(tweets[0].author.username).toBeTruthy();
    expect(tweets[0].author.username).not.toBe('');
    expect(tweets[0].author.name).toBeTruthy();
    expect(tweets[0].author.name).not.toBe('');
  });

  it('should extract verified status', async () => {
    const client = new XTwitterClient({ mode: 'crawler', /* config */ });

    const tweets = await client.searchTweets('from:verified_account', {
      maxResults: 1
    });

    expect(typeof tweets[0].author.verified).toBe('boolean');
  });
});
```

---

## Testing the Fix

### 1. Local Testing

```javascript
// test-author-extraction.js
import { XTwitterClient } from '@blockchain-web-services/bws-x-sdk-node';

const client = new XTwitterClient({
  mode: 'crawler',
  crawler: {
    accounts: [/* crawler account */]
  }
});

const tweets = await client.searchTweets(
  '(digital credential OR blockchain badge) min_faves:3 lang:en -is:retweet',
  { maxResults: 5 }
);

console.log('Sample author data:', {
  username: tweets[0].author.username,
  name: tweets[0].author.name,
  verified: tweets[0].author.verified,
  hasDescription: !!tweets[0].author.description,
  hasMetrics: !!tweets[0].author.public_metrics
});

// Expected output:
// Sample author data: {
//   username: 'actual_username',      // ✅ Not empty
//   name: 'Actual Name',               // ✅ Not empty
//   verified: false,                   // ✅ Boolean
//   hasDescription: false,             // OK for Option 1
//   hasMetrics: false                  // OK for Option 1
// }
```

### 2. Integration Testing

Use the existing BWS website front discovery script:

```bash
cd /mnt/x/Git/blockchain-web-services/bws/bws-front/bws-website-front/.trees/xai-trackkols

# Update package.json to use local SDK with fix:
# "dependencies": {
#   "@blockchain-web-services/bws-x-sdk-node": "file:../../../bws-x-sdk-node"
# }

npm install

# Run discovery:
node scripts/crawling/production/discover-institution-accounts-sdk.js --product="Blockchain Badges"

# Check results:
cat scripts/crawling/data/institution-accounts.json

# Expected:
# {
#   "accounts": [ /* 10-20 accounts */ ],  // ✅ Not empty!
#   "stats": {
#     "totalDiscovered": 16,               // ✅ > 0
#     "byAccountType": {
#       "engagedUsers": 16                 // ✅ Classified!
#     }
#   }
# }
```

---

## Success Criteria

After implementing this fix, the following should be true:

### ✅ Minimal Success (Option 1):
- [x] Author `username` is populated (not empty string)
- [x] Author `name` is populated
- [x] Author `verified` is boolean
- [x] Author `id` is populated
- [x] Discovery script saves 10-20 accounts per run

### 🎯 Complete Success (Option 2 - Future):
- [x] All Option 1 criteria
- [x] Author `description` (bio) is populated
- [x] Author `public_metrics.followers_count` is populated
- [x] Author `public_metrics.following_count` is populated

---

## Expected Impact

### For BWS Website Front (Immediate User):
- **Blockchain Badges discovery**: 50-100 accounts/month
- **Sales workflow**: Full audience building capability
- **@ Mentions**: Can tag prospects in BWS posts
- **Twitter Lists**: Can create targeted lists

### For All BWS X SDK Users:
- **Account discovery workflows**: Now functional
- **Influencer identification**: Can analyze author profiles
- **Audience research**: Can segment by follower count, bio keywords
- **Verified account filtering**: Can prioritize verified users

---

## Additional Context

### Why This Matters

The BWS website front has implemented a sophisticated account classification system that evaluates:
1. **Institution indicators**: university, college, bootcamp, etc.
2. **Engaged user indicators**: student, hr, developer, educator, etc.
3. **Follower count**: For confidence scoring
4. **Bio content**: For product fit scoring

**None of this works without author data from the SDK.**

### Current Workaround Limitations

**Option B (API-only mode)**:
- Hits rate limits after 3 queries
- Not sustainable for daily discovery

**Option C (Skip account saving)**:
- Loses audience building
- Can't create Twitter Lists
- Can't @ mention prospects
- Loses 80% of sales workflow value

### Related Code

**Discovery Script**: `.trees/xai-trackkols/scripts/crawling/production/discover-institution-accounts-sdk.js`

**Classification Logic** (lines 120-225):
- ✅ Production-ready
- ✅ Tested extensively
- ✅ Waiting on SDK fix to function

**Account Database**: `scripts/crawling/data/institution-accounts.json`
- Currently empty due to SDK issue
- Will populate immediately when SDK fixed

---

## Questions?

If you need clarification on:
- Twitter HTML structure for scraping
- Testing approach
- Integration with BWS website front
- Classification logic requirements

**Contact**: Refer to `BLOCKCHAIN-BADGES-FIX-SUMMARY.md` in the xai-trackkols worktree for full investigation details.

---

## Timeline

**Estimated effort**: 2-4 hours
- 1-2 hours: Implementation
- 1 hour: Testing
- 1 hour: Documentation

**Priority**: HIGH - Blocks production discovery workflow

---

**Generated with Claude Code**
**Request Date**: 2026-01-01
**Requesting Project**: BWS Website Front - Blockchain Badges Discovery
**SDK Version**: v1.6.0-1.7.0
