# Twitter/X Crawling & Automation Scripts

This directory contains all Twitter/X-related crawling, scraping, and automation functionality.

## System Status

**Last Updated:** December 29, 2025
**Overall Health:** ✅ OPERATIONAL (89.5% success rate across all workflows)

### Quick Status
- 🟢 **Core Systems:** ALL OPERATIONAL (KOL monitoring, replies, content generation)
- 🟢 **Recent Fix:** CRITICAL metrics bug resolved (Dec 27, 2025)
- 🟢 **Queue Status:** 40 posts ready for reply evaluation
- 🟡 **Minor Issues:** Some secondary workflows need attention (see detailed status)

**📊 For detailed workflow-by-workflow status, performance metrics, and recent fixes, see:**
👉 **[WORKFLOW_STATUS.md](./WORKFLOW_STATUS.md)** - Comprehensive status report with 48-hour analysis

### Critical Systems Status
| System | Status | Success Rate | Last Run |
|--------|--------|--------------|----------|
| KOL Timeline Monitoring | ✅ Operational | 100% (12/12) | Dec 29, 12:44 UTC |
| KOL Reply Cycle | ✅ Operational | 100% (16/16) | Dec 29, 15:28 UTC |
| Content Discovery | ✅ Operational | 100% (10/10) | Dec 29, 12:08 UTC |
| Product Automation | ✅ Operational | 100% (9/9) | Dec 29, 16:05 UTC |
| Article Posting | ✅ Operational | 100% (5/5) | Dec 29, 12:14 UTC |

### Recent Critical Fix (Dec 27, 2025)
**Issue:** Metrics field access bug causing 100% failure rate in timeline monitoring
**Root Cause:** Accessing `tweet.public_metrics.like_count` instead of SDK's `tweet.metrics.likes`
**Impact:** All tweets showed 0 engagement (0L+0RT), nothing passed filter
**Resolution:** Fixed field names in 6 locations
**Result:** System fully operational - 84.5% of tweets now passing engagement filter (538/637)
**Queue:** Repopulated with 40 high-engagement posts

## Directory Structure

```
scripts/crawling/
├── production/       # Production scripts actively used in workflows
├── utils/           # Shared utility modules
├── crawlers/        # Browser automation and scraping utilities
├── tests/           # Test scripts for credentials, API, etc.
├── data/            # JSON data files (KOLs, replies, metrics, etc.)
├── docs/            # Documentation and analysis files
└── README.md        # This file
```

## Production Scripts

Located in `production/`:

### KOL Reply Automation
- **evaluate-and-reply-kols.js** - Main KOL reply generation and posting script
- **analyze-kol-engagement.js** - Weekly analytics and metrics generation
- **discover-crawlee-direct.js** - Direct Crawlee-based KOL discovery
- **discover-by-engagement-crawlee.js** - Search-based KOL discovery
- **discover-with-fallback.js** - Discovery with fallback strategies

### Product-Specific Automation (NEW - Dec 2025)
- **discover-product-tweets.js** - Discover tweets mentioning BWS products (daily)
- **reply-to-product-tweets.js** - Reply with educational threads about products (2x daily)

### Content Generation
- **generate-weekly-x-post.js** - Weekly X post generation
- **post-article-content.js** - Article content posting to X
- **fetch-twitter-partnerships.js** - Partnership data fetching

## Utility Modules

Located in `utils/`:

- **kol-utils.js** - Core KOL data management utilities
- **twitter-client.js** - Twitter API v2 client (supports @BWSCommunity account)
- **twitter-thread-client.js** - Thread posting utilities (multi-tweet threads)
- **thread-generator.js** - Educational thread generation with Claude AI
- **docs-fetcher.js** - Product documentation fetching and caching
- **multi-account-scraper-client.js** - Multi-account scraping client
- **claude-client.js** - Anthropic Claude API integration (Sonnet 4.5)
- **amplified-search.js** - Enhanced search capabilities
- **api-usage-logger.js** - API usage tracking and logging
- **schedule-randomizer.js** - Random scheduling to avoid detection
- **workflow-updater.js** - GitHub Actions workflow automation

## Test Scripts

Located in `tests/`:

- Authentication tests (minimal auth, read, write, reply)
- Account status verification
- Proxy connection testing
- Multi-account scraper testing
- Secret values validation

## Data Files

Located in `data/`:

### KOL Automation Data
- **kols-data.json** - KOL profiles and metadata
- **kol-replies.json** - Reply history and tracking
- **engaging-posts.json** - Discovered engaging content
- **processed-posts.json** - Processed post tracking
- **kol-metrics.json** - Analytics and engagement metrics

### Product Automation Data (NEW)
- **product-discovery-queue.json** - Tweets discovered about BWS products
- **product-replies.json** - Educational threads posted about products

## Documentation

Located in `docs/`:

Comprehensive documentation about:
- Implementation summaries
- Authentication guides
- API usage tracking
- ScrapFly/Crawlee setup
- Error reporting improvements
- Investigation reports
- Multi-account analysis

## Usage in GitHub Actions

The scripts in this directory are used by several workflows:

### KOL Automation Workflows
- `.github/workflows/kol-reply-cycle.yml` - Main reply automation (4x daily)
- `.github/workflows/analyze-kols-weekly.yml` - Weekly analytics
- `.github/workflows/discover-content-scrapfly.yml` - Content discovery
- `.github/workflows/test-h-multi-account-scraper.yml` - Testing workflow

### Product Automation Workflows (NEW - Dec 2025)
- `.github/workflows/discover-product-tweets.yml` - Discover product mentions (daily at 8:00 AM UTC)
- `.github/workflows/reply-to-product-tweets.yml` - Post educational threads (2x daily: 10 AM, 4 PM UTC)

## Product Automation System (Dec 2025)

A new automated system for discovering and replying to tweets about BWS products with educational threads.

### How It Works

1. **Discovery Phase** (Daily at 8:00 AM UTC)
   - Searches Twitter for mentions of 4 BWS products: Blockchain Badges, BWS IPFS, NFT.zK, Blockchain Hash
   - Uses 8-12 targeted search queries per product
   - Filters tweets by engagement (min 10 likes) and freshness (24 hours)
   - Adds discovered tweets to `product-discovery-queue.json`

2. **Reply Phase** (2x daily at 10:00 AM, 4:00 PM UTC)
   - Processes 2-4 tweets from discovery queue
   - Uses product rotation to ensure balanced coverage
   - Generates educational 4-tweet threads with Claude AI (Sonnet 4.5)
   - Posts threads via @BWSCommunity account
   - Tracks posted threads in `product-replies.json`

3. **Thread Structure**
   - Tweet 1: Hook - Acknowledge pain point or need
   - Tweet 2: Features - List key product capabilities (includes $BWS cashtag)
   - Tweet 3: How-To - Getting started steps
   - Tweet 4: CTA - Documentation link + @BWSCommunity mention

4. **Anti-Spam Measures**
   - Follows tweet author before replying
   - Likes original tweet
   - 5-second delay between thread tweets
   - 3-minute delay between different threads
   - Product isolation (only mentions one product per thread)

### Configuration Files

Located in `config/`:

- **product-highlights.json** - Product features, use cases, technical details
- **product-reply-config.json** - Reply automation settings (thresholds, timing, etc.)
- **product-search-queries.json** - Search queries for each product

### Monitoring

- **WORKFLOW_STATUS_SUMMARY.md** - Current system status and performance
- **DEBUGGING_FIXES_SUMMARY.md** - Debugging history and fixes applied (Dec 9, 2025)

### Success Metrics (as of Dec 9, 2025)

- ✅ Discovery: 100% success rate, 35 tweets in queue
- ✅ Reply: First 2 threads posted successfully
- ✅ Thread quality: All tweets <280 chars, proper formatting, includes docs links
- 🎯 Target: 2-4 educational threads per day across 4 products

## Article Posting System (Dynamic Scheduler - Dec 2025)

A new **dynamic scheduling system** that spaces article posts naturally based on article generation frequency to avoid bot-like behavior.

### How It Works

**Problem**: Posting 4 articles in rapid succession (4 minutes) appears bot-like and risks spam detection.

**Solution**: Dynamic interval-based scheduling that adapts to article generation frequency.

#### 1. **Article Generation Tracking**
- Tracks article generation events over 7-day rolling window
- Records: timestamp, articles generated, workflow run
- Data stored in: `scripts/crawling/data/article-generation-history.json`

#### 2. **Dynamic Interval Calculation**
- Formula: `posting_interval = 24 hours / articles_per_day`
- Rounds to allowed intervals: [4, 6, 8, 12, 24] hours
- Example scenarios:
  - 4 articles/day → 6h interval → posts at 10 AM, 4 PM, 10 PM, 4 AM
  - 4 articles/2 days → 12h interval → posts at 10 AM, 10 PM daily
  - 2 articles/day → 12h interval → posts at 10 AM, 10 PM

#### 3. **Posting Schedule Check**
- Workflow runs every 4 hours (6x daily)
- Script calculates time since last post
- Posts 1 article if interval satisfied (with 30-minute grace period)
- Skips if not time yet

#### 4. **Natural Posting Pattern**
- Posts **1 article per run** (not 4)
- Spaced evenly across the generation window
- Adapts automatically to frequency changes
- Handles edge cases (failures, queue exhaustion)

### Architecture

**Scheduler Utility**: `scripts/crawling/utils/article-posting-scheduler.js`
- `calculatePostingSchedule()` - Main decision logic
- `recordArticleGeneration()` - Track generation events
- Maintains 7-day rolling window metrics

**Modified Posting Script**: `scripts/crawling/production/post-article-content.js`
- Changed `MAX_POSTS_PER_RUN` from 4 to 1
- Integrated scheduler check before posting
- Early exit if interval not satisfied

**Updated Workflow**: `.github/workflows/post-article-content.yml`
- Schedule: `0 */4 * * *` (every 4 hours)
- Trigger: After article generation OR schedule
- Manual trigger: workflow_dispatch

**Generation Recording**: `scripts/generate-article-posts.js`
- Calls `recordArticleGeneration()` after generating articles
- Updates generation history automatically

### Configuration

**Scheduler Config** (`article-posting-scheduler.js`):
```javascript
{
  historyWindowDays: 7,         // Rolling window for metrics
  allowedIntervals: [4,6,8,12,24], // Rounded intervals (hours)
  gracePeriodHours: 0.5,        // Prevent double-posting
  minIntervalHours: 4,          // Minimum interval
  maxIntervalHours: 24,         // Maximum interval
  defaultIntervalHours: 8       // Fallback when no history
}
```

### Example Run (Dec 9, 2025)

**Scheduler Output**:
```
📅 Calculating posting schedule...
   📊 Article Generation Metrics (Last 7 Days):
      Total Articles: 4
      Articles/Day: 4
      Days Elapsed: 1
      Generation Runs: 1

   ⏱️  Posting Schedule:
      Recommended Interval: 6h
      Last Post: 2025-11-11T17:17:43.603Z
      Time Since Last Post: 666.2h
      Hours Until Next Post: 0h

   ✅ Time to post - 6h interval satisfied

📊 Posting Summary:
   Total posts in queue: 24
   Pending posts: 16
   Already posted: 1
   Failed: 7
   Will post now: 1

✅ Posted successfully!
   Tweet ID: 1998354862451380308
```

### Benefits

- ✅ **Natural appearance**: Posts spaced across day, not clustered
- ✅ **Adaptive**: Automatically adjusts to generation frequency changes
- ✅ **Bot-detection resistant**: No rapid-fire posting patterns
- ✅ **Resilient**: Handles failures gracefully with catch-up logic
- ✅ **Configurable**: Easy to adjust intervals and thresholds

### Monitoring

**Check scheduler behavior**:
- View `article-generation-history.json` for tracked generation events
- Review workflow logs for schedule calculations
- Monitor posting pattern over 7 days to verify natural spacing

**Expected pattern** (4 articles/day, 6h interval):
- Run 1 (12 AM): Check schedule → Skip (not time yet)
- Run 2 (4 AM): Check schedule → Post article 1
- Run 3 (8 AM): Check schedule → Skip
- Run 4 (12 PM): Check schedule → Post article 2
- Run 5 (4 PM): Check schedule → Skip
- Run 6 (8 PM): Check schedule → Post article 3

## Important Notes

1. All Twitter API credentials are stored as GitHub Secrets
2. Multi-account approach separates search (scraper) from posting (API)
3. Product replies use @BWSCommunity account (TWITTER_* credentials)
4. Article posting uses @BWSCommunity account with dynamic scheduler
5. Oxylabs proxy is used for API calls to avoid rate limiting
6. Claude API is used for content evaluation and reply generation (Sonnet 4.5)
7. Schedule randomization prevents spam detection (KOL replies)
8. Dynamic interval scheduling prevents bot-like patterns (article posting)
9. Educational threads include documentation links to drive traffic to docs.bws.ninja
