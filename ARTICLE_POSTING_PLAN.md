# Dynamic Article Posting Plan - Natural Scheduling

**Date**: December 9, 2025
**Status**: Awaiting Manual Approval
**Purpose**: Eliminate bot-like appearance by spacing article posts naturally based on article generation frequency

---

## Problem Statement

### Current Behavior (Bot-Like)
```javascript
// Post 4 articles immediately with 1-minute delay
MAX_POSTS_PER_RUN = 4;
DELAY_BETWEEN_POSTS_MS = 60000; // 60 seconds

// Result: All 4 articles posted in 4 minutes
// Twitter sees: 4 posts in rapid succession → Bot detection risk
```

### Desired Behavior (Natural)
**Principle**: Space posts across the time window in which articles are generated

**Examples**:
- **4 articles generated per day (24 hours)** → Post 1 article every **8 hours**
- **4 articles generated per 2 days (48 hours)** → Post 1 article every **12 hours**
- **3 articles generated per day** → Post 1 article every **8 hours**
- **2 articles generated per 3 days** → Post 1 article every **36 hours**

**Formula**: `posting_interval = generation_window / articles_per_window`

---

## Proposed Solution Architecture

### Approach: Multi-Schedule Workflow + Dynamic Run Control

Instead of posting all articles at once, implement a **queue-based system** with **frequent workflow runs** that post **1 article per run** at **dynamically calculated intervals**.

### Core Components

#### 1. Article Generation Tracker
**Purpose**: Track article generation frequency over rolling 7-day window

**File**: `scripts/crawling/data/article-generation-history.json` (NEW)

**Structure**:
```json
{
  "history": [
    {
      "timestamp": "2025-12-09T10:00:00Z",
      "articlesGenerated": 4,
      "workflowRun": "generate-articles.yml"
    },
    {
      "timestamp": "2025-12-08T10:00:00Z",
      "articlesGenerated": 4,
      "workflowRun": "generate-articles.yml"
    }
  ],
  "rollingMetrics": {
    "last7Days": {
      "totalArticles": 28,
      "generationRuns": 7,
      "averagePerDay": 4.0,
      "recommendedPostingInterval": "8h"
    }
  }
}
```

#### 2. Dynamic Posting Scheduler
**Purpose**: Calculate optimal posting interval and determine if current run should post

**File**: `scripts/crawling/utils/article-posting-scheduler.js` (NEW)

**Functions**:
```javascript
/**
 * Calculate optimal posting interval based on article generation frequency
 * @returns {Object} { intervalHours, shouldPost, nextPostTime }
 */
async function calculatePostingSchedule() {
  // 1. Load article generation history (last 7 days)
  // 2. Calculate: total_articles / days_elapsed = articles_per_day
  // 3. Calculate: 24 / articles_per_day = hours_per_post
  // 4. Check last post time
  // 5. Determine if enough time elapsed to post next article
  // 6. Return schedule metadata
}

/**
 * Update article generation history
 * Called by generate-articles.yml after article generation
 */
async function recordArticleGeneration(articleCount) {
  // Add entry to article-generation-history.json
  // Trim history to last 7 days
  // Recalculate rolling metrics
}

/**
 * Check if sufficient time has passed since last post
 * @returns {boolean}
 */
async function shouldPostNow(intervalHours) {
  // Load article-x-posts.json
  // Get timestamp of last posted article
  // Compare: (now - lastPostTime) >= intervalHours
  // Return true/false
}
```

#### 3. Modified Posting Script
**File**: `scripts/crawling/production/post-article-content.js` (MODIFY)

**Changes**:
```javascript
// BEFORE:
const MAX_POSTS_PER_RUN = 4; // Post 4 at once

// AFTER:
const MAX_POSTS_PER_RUN = 1; // Post 1 per run

// NEW: Dynamic scheduling logic
import { calculatePostingSchedule } from '../utils/article-posting-scheduler.js';

async function main() {
  console.log('\n📅 Article Posting - Dynamic Scheduler\n');

  // 1. Calculate current schedule
  const schedule = await calculatePostingSchedule();

  console.log(`   📊 Article Generation Metrics (Last 7 Days):`);
  console.log(`      Total Articles: ${schedule.totalArticles}`);
  console.log(`      Articles/Day: ${schedule.articlesPerDay}`);
  console.log(`      Recommended Interval: ${schedule.intervalHours}h`);
  console.log(`      Last Post: ${schedule.lastPostTime}`);
  console.log(`      Time Since Last Post: ${schedule.hoursSinceLastPost}h`);

  // 2. Check if we should post now
  if (!schedule.shouldPost) {
    console.log(`\n   ⏸️  Skipping - Next post scheduled in ${schedule.hoursUntilNextPost}h`);
    console.log(`      Next post time: ${schedule.nextPostTime}`);
    return;
  }

  console.log(`\n   ✅ Time to post - ${schedule.intervalHours}h interval satisfied`);

  // 3. Load article queue (existing logic)
  const articles = loadArticleQueue();
  const pendingArticles = articles.filter(a => a.status === 'pending');

  if (pendingArticles.length === 0) {
    console.log('   📭 No pending articles to post');
    return;
  }

  // 4. Post ONLY 1 article
  const articleToPost = pendingArticles[0];

  console.log(`\n   📤 Posting 1 article: "${articleToPost.title}"`);

  await postSingleArticle(articleToPost);

  console.log(`\n   ✅ Posted 1 article - Next post in ~${schedule.intervalHours}h`);
}
```

#### 4. Multi-Schedule Workflow
**File**: `.github/workflows/post-article-content.yml` (MODIFY)

**Change**: Run workflow **more frequently** (every 4 hours) but let script decide whether to actually post

```yaml
name: Post Article Content to X

on:
  # NEW: Run every 4 hours to check if it's time to post
  schedule:
    - cron: '0 */4 * * *'  # Every 4 hours

  # KEEP: Also trigger after article generation (will check schedule)
  workflow_run:
    workflows: ["Generate Articles"]
    types: [completed]

  # KEEP: Manual trigger for testing
  workflow_dispatch:

jobs:
  post-articles:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Post article (if schedule allows)
        run: node scripts/crawling/production/post-article-content.js
        env:
          TWITTER_CONSUMER_KEY: ${{ secrets.TWITTER_CONSUMER_KEY }}
          TWITTER_CONSUMER_SECRET: ${{ secrets.TWITTER_CONSUMER_SECRET }}
          TWITTER_ACCESS_TOKEN: ${{ secrets.TWITTER_ACCESS_TOKEN }}
          TWITTER_ACCESS_TOKEN_SECRET: ${{ secrets.TWITTER_ACCESS_TOKEN_SECRET }}
```

#### 5. Article Generation Recorder
**File**: `scripts/crawling/production/generate-article-x-posts.js` (MODIFY - if exists)

**Add**: Call to record article generation

```javascript
import { recordArticleGeneration } from '../utils/article-posting-scheduler.js';

// After generating articles
const newArticles = [...]; // Generated articles

// Record generation event
await recordArticleGeneration(newArticles.length);

console.log(`   📊 Recorded generation of ${newArticles.length} articles`);
```

---

## Implementation Details

### Calculation Algorithm

#### Step 1: Track Article Generation
After each article generation run, record:
- Timestamp
- Number of articles generated
- Workflow run ID

#### Step 2: Calculate Rolling Metrics (Last 7 Days)
```javascript
function calculateRollingMetrics(history) {
  const now = new Date();
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

  // Filter to last 7 days
  const recentHistory = history.filter(entry =>
    new Date(entry.timestamp) >= sevenDaysAgo
  );

  // Calculate totals
  const totalArticles = recentHistory.reduce((sum, entry) =>
    sum + entry.articlesGenerated, 0
  );

  const daysElapsed = Math.max(
    (now - new Date(recentHistory[0].timestamp)) / (1000 * 60 * 60 * 24),
    1 // Minimum 1 day
  );

  const articlesPerDay = totalArticles / daysElapsed;

  // Calculate recommended interval
  const hoursPerArticle = 24 / articlesPerDay;

  // Round to nearest reasonable interval (4h, 6h, 8h, 12h, 24h)
  const intervalHours = roundToNearestInterval(hoursPerArticle);

  return {
    totalArticles,
    generationRuns: recentHistory.length,
    daysElapsed: Math.round(daysElapsed * 10) / 10,
    articlesPerDay: Math.round(articlesPerDay * 10) / 10,
    intervalHours
  };
}

function roundToNearestInterval(hours) {
  const intervals = [4, 6, 8, 12, 24];

  // Find closest interval
  return intervals.reduce((closest, interval) =>
    Math.abs(interval - hours) < Math.abs(closest - hours)
      ? interval
      : closest
  );
}
```

#### Step 3: Check Posting Schedule
```javascript
function shouldPostNow(intervalHours, lastPostTime) {
  if (!lastPostTime) {
    return true; // No posts yet, post immediately
  }

  const now = new Date();
  const lastPost = new Date(lastPostTime);
  const hoursSinceLastPost = (now - lastPost) / (1000 * 60 * 60);

  // Allow posting if interval satisfied (with 30-minute grace period)
  return hoursSinceLastPost >= (intervalHours - 0.5);
}
```

---

## Example Scenarios

### Scenario 1: Daily Article Generation (4 articles/day)

**Article Generation**: 10:00 AM UTC daily (4 articles)

**Calculation**:
- Last 7 days: 28 articles generated
- Articles per day: 28 / 7 = 4.0
- Hours per article: 24 / 4 = 6 hours
- **Rounded interval: 8 hours** (user preference)

**Posting Schedule**:
- Post 1: 10:00 AM UTC (immediately after generation)
- Post 2: 6:00 PM UTC (8 hours later)
- Post 3: 2:00 AM UTC next day (8 hours later)
- Post 4: 10:00 AM UTC next day (8 hours later, coincides with new generation)

**Workflow Runs**:
- 12:00 AM UTC: Check schedule → Not time yet (skip)
- 4:00 AM UTC: Check schedule → Post article 3 (2:00 AM + 8h = past due)
- 8:00 AM UTC: Check schedule → Not time yet (skip)
- 12:00 PM UTC: Check schedule → Not time yet (skip)
- 4:00 PM UTC: Check schedule → Not time yet (skip)
- 8:00 PM UTC: Check schedule → Post article 2 (6:00 PM + 8h = past due)

### Scenario 2: Articles Every 2 Days (4 articles per 2 days)

**Article Generation**: Every 2 days at 10:00 AM UTC (4 articles)

**Calculation**:
- Last 7 days: 12 articles generated (3 runs)
- Articles per day: 12 / 7 = 1.71
- Hours per article: 24 / 1.71 = 14 hours
- **Rounded interval: 12 hours**

**Posting Schedule**:
- Day 1, 10:00 AM: Post article 1
- Day 1, 10:00 PM: Post article 2 (12h later)
- Day 2, 10:00 AM: Post article 3 (12h later)
- Day 2, 10:00 PM: Post article 4 (12h later)
- Day 3: No new articles, no posts
- Day 4, 10:00 AM: New generation → Post article 1

### Scenario 3: Variable Generation (3-5 articles/day)

**Article Generation**: Variable (sometimes 3, sometimes 5 articles)

**Calculation** (example week):
- Day 1: 4 articles
- Day 2: 5 articles
- Day 3: 3 articles
- Day 4: 4 articles
- Day 5: 5 articles
- Day 6: 3 articles
- Day 7: 4 articles
- **Total: 28 articles / 7 days = 4.0 articles/day**
- **Interval: 8 hours** (rounded from 6h)

**Adaptation**: System recalculates daily, adjusting interval as needed

---

## Edge Cases & Handling

### 1. First Run (No History)
**Issue**: No article generation history exists yet

**Solution**:
```javascript
if (history.length === 0) {
  // Default to conservative 8-hour interval
  return {
    intervalHours: 8,
    shouldPost: true, // Post immediately if articles pending
    message: 'No history - using default 8h interval'
  };
}
```

### 2. Workflow Failure (Missed Posting Window)
**Issue**: Workflow fails, misses scheduled post time

**Solution**:
- Next run checks if time elapsed exceeds interval
- If yes, posts immediately (catches up)
- Grace period of 30 minutes prevents double-posting

### 3. Article Queue Exhausted
**Issue**: All pending articles posted, but more scheduled runs

**Solution**:
```javascript
if (pendingArticles.length === 0) {
  console.log('   📭 No pending articles - skipping until next generation');
  return; // Gracefully exit
}
```

### 4. Manual Article Addition
**Issue**: User manually adds articles to queue outside generation workflow

**Solution**:
- System posts based on interval, regardless of source
- Queue-based approach handles any article source

### 5. Rapid Generation Change
**Issue**: Generation frequency suddenly changes (e.g., 4/day → 2/week)

**Solution**:
- 7-day rolling window adapts over ~3 days
- Gradual transition prevents sudden interval jumps
- Manual workflow trigger available for immediate adjustment

---

## Configuration

### article-posting-scheduler.js Configuration
```javascript
const CONFIG = {
  // Rolling window for metrics
  historyWindowDays: 7,

  // Allowed posting intervals (hours)
  allowedIntervals: [4, 6, 8, 12, 24],

  // Grace period to avoid double-posting (hours)
  gracePeriodHours: 0.5,

  // Minimum interval to prevent over-posting (hours)
  minIntervalHours: 4,

  // Maximum interval to prevent under-posting (hours)
  maxIntervalHours: 24,

  // Default interval when no history (hours)
  defaultIntervalHours: 8
};
```

---

## Testing Strategy

### Phase 1: Unit Tests
Test `article-posting-scheduler.js` functions:

```javascript
// Test 1: Calculate metrics with 4 articles/day
const history = generateMockHistory(7, 4); // 7 days, 4 articles/day
const metrics = calculateRollingMetrics(history);
assert.equal(metrics.articlesPerDay, 4.0);
assert.equal(metrics.intervalHours, 8);

// Test 2: Check posting schedule (should post)
const shouldPost = shouldPostNow(8, '2025-12-09T02:00:00Z'); // 8 hours ago
assert.equal(shouldPost, true);

// Test 3: Check posting schedule (should not post)
const shouldNotPost = shouldPostNow(8, '2025-12-09T08:00:00Z'); // 2 hours ago
assert.equal(shouldNotPost, false);
```

### Phase 2: Integration Tests
Test full posting workflow:

1. **Simulate article generation**:
   - Manually add 4 articles to queue
   - Record generation event
   - Verify history updated

2. **Trigger posting workflow**:
   - Run `post-article-content.js`
   - Verify schedule calculated correctly
   - Verify 1 article posted (not 4)

3. **Verify interval enforcement**:
   - Trigger workflow again immediately
   - Verify skipped (interval not satisfied)
   - Wait 8 hours (or adjust timestamp)
   - Trigger again
   - Verify next article posted

### Phase 3: Production Testing
Deploy to GitHub Actions:

1. **Monitor first 3 days**:
   - Check workflow runs every 4 hours
   - Verify posting intervals match calculation
   - Confirm no bot-like patterns

2. **Measure engagement**:
   - Compare engagement before/after (if metrics available)
   - Verify natural posting pattern improves perception

---

## Rollout Plan

### Step 1: Create Scheduler Utility (1 session)
- Create `scripts/crawling/utils/article-posting-scheduler.js`
- Implement `calculatePostingSchedule()`
- Implement `recordArticleGeneration()`
- Implement `shouldPostNow()`
- Add configuration constants

### Step 2: Create History Tracker (1 session)
- Create `scripts/crawling/data/article-generation-history.json`
- Initialize with empty structure
- Add helper functions to load/save history

### Step 3: Modify Posting Script (1 session)
- Update `scripts/crawling/production/post-article-content.js`
- Change `MAX_POSTS_PER_RUN` from 4 to 1
- Add scheduler integration
- Add schedule logging
- Test locally with mock data

### Step 4: Update Workflow (1 session)
- Modify `.github/workflows/post-article-content.yml`
- Change schedule from daily to every 4 hours (`0 */4 * * *`)
- Keep workflow_run trigger
- Test with workflow_dispatch

### Step 5: Add Generation Recorder (1 session)
- Find where articles are generated (generate-articles.yml script)
- Add call to `recordArticleGeneration()`
- Verify history updated after generation

### Step 6: Deploy & Monitor (ongoing)
- Deploy to production
- Monitor first 7 days closely
- Verify interval calculations
- Adjust configuration if needed

---

## Success Metrics

### Quantitative
1. **Posting Pattern**:
   - ✅ No more than 1 article per workflow run
   - ✅ Interval between posts matches calculation (±30 min grace)
   - ✅ 4 articles posted per day (if 4 generated/day)
   - ✅ Even distribution across 24-hour period

2. **System Reliability**:
   - ✅ Workflow runs every 4 hours
   - ✅ Schedule calculations complete without errors
   - ✅ History tracking accurate over 7-day window

### Qualitative
1. **Natural Appearance**:
   - Posts appear at varied times (not clustered)
   - Spacing appears human-like
   - No "bot-like" rapid succession

2. **User Perception** (future):
   - Engagement metrics stable or improved
   - No spam reports or account restrictions

---

## Alternative Approaches Considered

### Alternative 1: Multiple Scheduled Workflows
**Approach**: Create 4 separate workflows scheduled 8 hours apart

**Pros**: Simple, no dynamic logic needed

**Cons**:
- Fixed schedule (can't adapt to generation frequency)
- Requires manual workflow edits to change schedule
- Less flexible

**Verdict**: ❌ Rejected - not adaptable to frequency changes

### Alternative 2: Cron Expression Generator
**Approach**: Dynamically write cron expressions to workflow file

**Pros**: True scheduled execution at exact times

**Cons**:
- Requires modifying `.github/workflows/` files from scripts
- Git complications (uncommitted changes)
- Complex implementation

**Verdict**: ❌ Rejected - too complex and fragile

### Alternative 3: Time-Based Queue System (CHOSEN)
**Approach**: Workflow runs frequently, script decides whether to post

**Pros**:
- ✅ Fully dynamic and adaptable
- ✅ No workflow file modifications needed
- ✅ Easy to test and debug
- ✅ Handles edge cases gracefully

**Cons**:
- Workflow runs even when not posting (minor overhead)

**Verdict**: ✅ **Selected** - best balance of flexibility and simplicity

---

## Files to Create/Modify

### New Files:
1. `scripts/crawling/utils/article-posting-scheduler.js` - Scheduler logic
2. `scripts/crawling/data/article-generation-history.json` - Generation tracking
3. `ARTICLE_POSTING_PLAN.md` - This plan document

### Modified Files:
1. `scripts/crawling/production/post-article-content.js` - Posting script (integrate scheduler)
2. `.github/workflows/post-article-content.yml` - Workflow schedule (every 4h)
3. `scripts/crawling/production/generate-article-x-posts.js` (or equivalent) - Record generation

### Updated Documentation:
1. `scripts/crawling/README.md` - Add dynamic scheduling section
2. `WORKFLOW_STATUS_SUMMARY.md` - Update with new article posting approach

---

## Risk Assessment

### Low Risk
- ✅ Queue-based system is safe (no data loss)
- ✅ Graceful degradation (defaults to 8h interval if issues)
- ✅ Manual trigger always available for emergencies

### Medium Risk
- ⚠️ Initial 7 days: System learning generation frequency (mitigated by default interval)
- ⚠️ Workflow overhead: Runs every 4h but may not post (acceptable trade-off)

### High Risk
- ❌ None identified

---

## Open Questions for User

1. **Interval Rounding**: Should we strictly follow calculated intervals (e.g., 6h) or round to user-friendly intervals (4h, 8h, 12h)?
   - **Recommendation**: Round to [4, 6, 8, 12, 24] hours for predictability

2. **Workflow Frequency**: Is every 4 hours acceptable for checking schedule, or prefer different frequency?
   - **Recommendation**: Every 4 hours balances responsiveness and overhead

3. **Grace Period**: 30-minute grace period acceptable to prevent double-posting?
   - **Recommendation**: Yes, prevents edge case issues

4. **First Run Behavior**: Should first run after deployment post immediately or wait for calculated interval?
   - **Recommendation**: Post immediately if articles pending (catch up on backlog)

5. **History Window**: 7-day rolling window appropriate, or prefer different timeframe?
   - **Recommendation**: 7 days balances recent trends and stability

---

## Conclusion

This plan implements **dynamic, frequency-adaptive article posting** that eliminates bot-like behavior by spacing posts naturally based on article generation frequency.

**Key Benefits**:
- ✅ Adapts automatically to generation frequency changes
- ✅ Posts appear natural and human-like
- ✅ No manual schedule adjustments needed
- ✅ Handles edge cases gracefully
- ✅ Easy to test and monitor

**Implementation Effort**: ~5 sessions (1 per rollout step)

**User Approval Required**: Please review and approve before implementation.

---

**Next Steps After Approval**:
1. Create `article-posting-scheduler.js` utility
2. Implement scheduler logic with tests
3. Modify posting script integration
4. Update workflow schedule
5. Deploy and monitor

**Questions?** Please provide feedback or approve to proceed with implementation.
