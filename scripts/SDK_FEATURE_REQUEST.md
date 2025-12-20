# BWS X SDK - Missing Methods Feature Request

## Summary

After testing the BWS X SDK Node v1.4.0 in our production environment, we've identified **critical missing methods** that are blocking migration from our current twitter-crawler implementation. The SDK currently only exposes 3 methods (`getProfile`, `getTweet`, `postReply`) but our production scripts require tweet search and timeline fetching capabilities.

---

## Current SDK Status

### ✅ Available Methods (Confirmed via TypeScript definitions)
```typescript
class XTwitterClient {
  getProfile(username: string): Promise<UserProfile>
  getTweet(tweetId: string): Promise<Tweet>
  postReply(options: {...}): Promise<{id: string, text: string}>
}
```

### ❌ Missing Methods (Blocking Migration)
1. **searchTweets()** - Search tweets by query
2. **getUserTweets()** - Fetch user timeline
3. **getFollowing()** - Get following list (nice-to-have)

---

## Detailed Method Requirements

### 1. searchTweets() - CRITICAL PRIORITY

**Current Implementation** (twitter-crawler.js:294-480):
```javascript
export async function searchTweets(query, options = {}) {
  const { maxResults = 20, cookies, account, proxyConfig } = options;
  // Returns array of tweets matching query
}

export async function searchTweetsWebUnblocker(query, maxResults = 20) {
  // Web unblocker variant with Oxylabs
}
```

**Production Usage**:
- **discover-product-tweets.js**: Searches for tweets mentioning specific products/keywords
  ```javascript
  const tweets = await searchTweetsWebUnblocker(query.query, 20);
  // Example queries: "BWS Web3", "blockchain API", etc.
  ```
- **discover-by-engagement-crawlee.js**: Finds high-engagement tweets by topic
- **evaluate-and-reply-kols.js**: Searches for KOL mentions and engagement opportunities

**Requested SDK Method**:
```typescript
class XTwitterClient {
  /**
   * Search for tweets matching a query
   * Uses Crawlee-first strategy in hybrid mode
   *
   * @param query - Search query string (Twitter search syntax supported)
   * @param options - Search parameters
   * @returns Array of tweets matching the query
   *
   * @example
   * const client = new XTwitterClient(config);
   * const tweets = await client.searchTweets('Web3 API', {
   *   maxResults: 20,
   *   filter: 'latest' // or 'top', 'people', 'photos', 'videos'
   * });
   */
  searchTweets(
    query: string,
    options?: {
      maxResults?: number;      // Default: 20
      filter?: 'top' | 'latest' | 'people' | 'photos' | 'videos';
      startTime?: string;       // ISO 8601 date
      endTime?: string;         // ISO 8601 date
    }
  ): Promise<Tweet[]>
}
```

**Why Critical**: Used in 3 out of 5 production scripts. Without this method, we cannot migrate product discovery, engagement monitoring, or KOL evaluation workflows.

---

### 2. getUserTweets() - CRITICAL PRIORITY

**Current Implementation** (twitter-crawler.js:740-880):
```javascript
export async function getUserTweetsWebUnblocker(username, options = {}) {
  const { maxResults = 20, cookies, account } = options;
  // Returns recent tweets from user's timeline
}
```

**Production Usage**:
- **monitor-kol-timelines.js**: Monitors KOL timelines for high-engagement tweets
  ```javascript
  const tweets = await getUserTweetsWebUnblocker(kol.username, {
    maxResults: 100,
    cookies: account.cookies,
    account
  });
  // Filter tweets by engagement threshold
  // Evaluate for reply opportunities
  ```

**Requested SDK Method**:
```typescript
class XTwitterClient {
  /**
   * Get recent tweets from a user's timeline
   * Uses Crawlee-first strategy in hybrid mode
   *
   * @param username - Twitter username (without @)
   * @param options - Fetch parameters
   * @returns Array of tweets from user timeline
   *
   * @example
   * const client = new XTwitterClient(config);
   * const tweets = await client.getUserTweets('vitalikbuterin', {
   *   maxResults: 50,
   *   excludeReplies: true,
   *   excludeRetweets: false
   * });
   */
  getUserTweets(
    username: string,
    options?: {
      maxResults?: number;        // Default: 20
      excludeReplies?: boolean;   // Default: false
      excludeRetweets?: boolean;  // Default: false
      startTime?: string;         // ISO 8601 date
      endTime?: string;           // ISO 8601 date
    }
  ): Promise<Tweet[]>
}
```

**Why Critical**: Core functionality for timeline monitoring workflow. This script runs on GitHub Actions cron and generates engagement opportunities for our community team.

---

### 3. getFollowing() - NICE-TO-HAVE

**Current Implementation** (graphql-parser.js has parseFollowingList):
```javascript
// Currently unused but available in parser
export function parseFollowingList(data) {
  // Returns list of users someone follows
}
```

**Requested SDK Method**:
```typescript
class XTwitterClient {
  /**
   * Get list of users that a user follows
   *
   * @param username - Twitter username (without @)
   * @param options - Fetch parameters
   * @returns Array of user profiles
   */
  getFollowing(
    username: string,
    options?: {
      maxResults?: number;  // Default: 100
    }
  ): Promise<UserProfile[]>
}
```

**Why Useful**: Would enable KOL network analysis and relationship mapping for targeting.

---

## Migration Impact

### Scripts Blocked by Missing Methods

| Script | Blocker | Impact |
|--------|---------|--------|
| `discover-product-tweets.js` | searchTweets() | ❌ Cannot discover product mentions |
| `discover-by-engagement-crawlee.js` | searchTweets() | ❌ Cannot find engagement opportunities |
| `evaluate-and-reply-kols.js` | searchTweets() | ❌ Cannot evaluate KOL mentions |
| `monitor-kol-timelines.js` | getUserTweets() | ❌ Cannot monitor timelines |

### Scripts Ready for Migration

| Script | Methods Used | Status |
|--------|-------------|--------|
| `fetch-twitter-partnerships.js` | getProfile(), getTweet() | ✅ Ready now |
| `test-bws-x-sdk.js` | getProfile(), getTweet() | ✅ Already migrated |

---

## Testing Environment

We have **full testing infrastructure** ready:
- ✅ Twitter API credentials configured
- ✅ Crawler account credentials (X_ACCOUNTS env var)
- ✅ Oxylabs proxy credentials
- ✅ Test script running successfully (scripts/test-bws-x-sdk.js)
- ✅ Production workflows using crawler functions

**We can immediately test new methods** as soon as they're added to the SDK.

---

## Implementation Notes

### Data Structure Consistency

The SDK already returns clean, flattened data structures:
```typescript
// Current SDK UserProfile (GOOD - keep this pattern)
{
  username: string;
  name: string;
  followers: number;     // Flattened (not nested in metrics)
  following: number;     // Flattened
  tweetCount: number;    // Flattened
  verified: boolean;
  // ...
}
```

**Request**: Please maintain this flattened structure for arrays too:
```typescript
// Preferred return format for searchTweets/getUserTweets
Tweet[] // Array of Tweet objects (already defined in types/tweet.d.ts)

// Each tweet should have:
{
  id: string;
  text: string;
  authorUsername: string;
  authorName: string;
  createdAt: string;
  likeCount: number;      // Flattened
  retweetCount: number;   // Flattened
  replyCount: number;     // Flattened
  viewCount?: number;     // Optional
  // ...
}
```

### Mode Strategy

Both new methods should follow the **Crawlee-first hybrid strategy** already used:
1. **Crawler mode** (preferred): Use Playwright + GraphQL interception (free, reliable)
2. **API fallback**: Use Twitter API v2 when crawler unavailable
3. **Hybrid mode**: Try crawler first, fall back to API on failure

This matches the pattern already implemented in `getProfile()` and `getTweet()`.

### Rate Limiting

- **Crawler mode**: Handle via existing AuthManager account rotation
- **API mode**: Handle via existing rate limit error handling
- Both are already implemented in the SDK ✅

---

## Example SDK Usage (After Implementation)

```javascript
import { XTwitterClient } from '@blockchain-web-services/bws-x-sdk-node';

const client = XTwitterClient.fromJsonEnv();

// Search for product mentions
const productTweets = await client.searchTweets('BWS Web3 API', {
  maxResults: 20,
  filter: 'latest'
});

// Monitor KOL timeline
const kolTweets = await client.getUserTweets('vitalikbuterin', {
  maxResults: 50,
  excludeRetweets: true
});

// Filter high-engagement tweets
const engaging = kolTweets.filter(t =>
  t.likeCount > 100 || t.retweetCount > 20
);

// Reply to engaging tweet
await client.postReply({
  tweetId: engaging[0].id,
  text: 'Great insights! Check out our Web3 API...'
});
```

---

## Request Summary

**Please add these 2 critical methods to XTwitterClient:**

1. ✅ `searchTweets(query, options)` - Search tweets by query
2. ✅ `getUserTweets(username, options)` - Fetch user timeline
3. 🔵 `getFollowing(username, options)` - Get following list (optional)

**Timeline**: As soon as possible - these are blocking migration of 4 production scripts.

**We're ready to test immediately** upon release. Please ping us when available!

---

## Questions?

- Current SDK version: v1.4.0
- Testing environment: Ready with all credentials
- Contact: Available for coordination on implementation details
