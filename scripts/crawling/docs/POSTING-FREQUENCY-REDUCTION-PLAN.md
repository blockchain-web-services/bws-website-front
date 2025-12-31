# Posting Frequency Reduction & Reply Increase Plan

**Date:** December 31, 2025
**Objective:** Reduce regular posts from ~2/day to 1 every 2 days, increase replies

---

## Current State Analysis

### Regular Posts (Current: ~2 per day)

**1. Weekly X Post:**
- Workflow: `.github/workflows/weekly-x-post.yml`
- Schedule: **Daily at 14:00 UTC** (`0 14 * * *`)
- Frequency: 7 posts/week
- Script: `generate-weekly-x-post.js`

**2. Article Content Post:**
- Workflow: `.github/workflows/post-article-content.yml`
- Schedule: **Every 12 hours** (`0 */12 * * *`)
- Frequency: MAX_POSTS_PER_RUN = 1, ~1 post/day (depends on article generation)
- Script: `post-article-content.js`

**Total Current Posts:** ~14 posts/week (2 per day)

---

### Replies (Current: ~30-34 per day)

**1. Product Replies:**
- Workflow: `.github/workflows/reply-to-product-tweets.yml`
- Schedule: **2x daily** (10 AM & 4 PM UTC)
- Frequency: 2-4 replies/day
- Script: `reply-to-product-tweets-sdk.js`

**2. KOL Replies (Cycle):**
- Workflow: `.github/workflows/kol-reply-cycle.yml`
- Schedule: **6x daily** (02:15, 07:30, 11:45, 15:20, 19:50, 23:10 UTC)
- Frequency: maxRepliesPerRun = 5 → Max 30/day
- Script: `reply-to-kol-posts-sdk.js`

**3. KOL Replies (Daily):**
- Workflow: `.github/workflows/reply-kols-daily.yml`
- Schedule: **4x daily** (00:30, 06:30, 12:30, 18:30 UTC)
- Script: `evaluate-and-reply-kols-sdk.js`

**Total Current Replies:** 30-34/day (capped by kol-config.json limits)

---

## Target State

### Regular Posts (Target: 1 every 2 days)

**Target:** 3.5 posts/week (0.5 posts/day)

**Strategy Options:**

#### **Option A: Keep Weekly Posts, Reduce Frequency (RECOMMENDED)**
- Weekly X Post: Every 2 days (3.5/week)
- Article Content: Disabled or reduced to 1x/week
- **Result:** Exactly 3.5 posts/week

#### **Option B: Alternate Between Post Types**
- Weekly X Post: 3x/week (Mon/Wed/Fri)
- Article Content: 1x/week (Sunday)
- **Result:** 4 posts/week

#### **Option C: Weekly X Post Only, Less Frequent**
- Weekly X Post: Every other day
- Article Content: Completely disabled
- **Result:** 3.5 posts/week

---

### Replies (Target: Increase significantly)

**Current Cap:** 30 replies/day
**Proposed Target:** 50-60 replies/day (67-100% increase)

**Strategy:**
1. Increase per-run limits
2. Add more execution cycles
3. Relax per-KOL weekly limits
4. Extend tweet freshness window

---

## Implementation Plan

### PHASE 1: Reduce Regular Posts to 1 Every 2 Days

#### **File 1: `.github/workflows/weekly-x-post.yml`**

**Current:**
```yaml
on:
  schedule:
    - cron: '0 14 * * *'  # Daily at 14:00 UTC
```

**Change To (Option A - Every 2 Days):**
```yaml
on:
  schedule:
    - cron: '0 14 */2 * *'  # Every 2 days at 14:00 UTC
```

**Change To (Option B - 3x per Week):**
```yaml
on:
  schedule:
    - cron: '0 14 * * 1,3,5'  # Mon/Wed/Fri at 14:00 UTC
```

**Impact:** Reduces from 7 posts/week → 3.5 posts/week (Option A) or 3 posts/week (Option B)

---

#### **File 2: `.github/workflows/post-article-content.yml`**

**Current:**
```yaml
on:
  schedule:
    - cron: '0 */12 * * *'  # Every 12 hours
```

**Option A: Reduce to Weekly**
```yaml
on:
  schedule:
    - cron: '0 20 * * 0'  # Sunday at 20:00 UTC (once per week)
```

**Option B: Disable (Comment Out)**
```yaml
# Temporarily disabled - focusing on reply engagement
# on:
#   schedule:
#     - cron: '0 */12 * * *'
```

**Impact:**
- Option A: Reduces from ~7/week → 1/week
- Option B: Eliminates article posts entirely

---

#### **File 3: `scripts/crawling/production/post-article-content.js`**

**Current:**
```javascript
const MAX_POSTS_PER_RUN = 1;
const DELAY_BETWEEN_POSTS_MS = 60000; // 60 seconds
```

**No Change Required** (workflow frequency controls this)

---

#### **File 4: `scripts/crawling/utils/article-posting-scheduler.js`**

**Current:**
```javascript
const config = {
  allowedIntervals: [4, 6, 8, 12, 24],
  minIntervalHours: 4,
  maxIntervalHours: 24,
  defaultIntervalHours: 8,
  gracePeriodHours: 0.5,
  historyWindowDays: 7
};
```

**Change To:**
```javascript
const config = {
  allowedIntervals: [24, 48, 72],  // Only allow 24h, 48h, 72h intervals
  minIntervalHours: 24,            // Minimum 24 hours between posts
  maxIntervalHours: 72,            // Maximum 72 hours between posts
  defaultIntervalHours: 48,        // Default to 48 hours (2 days)
  gracePeriodHours: 2,             // 2-hour grace period
  historyWindowDays: 14            // 14-day rolling window
};
```

**Impact:** Enforces minimum 24-hour gaps between article posts

---

### PHASE 2: Increase Replies to 50-60 per Day

#### **File 5: `scripts/crawling/config/kol-config.json`**

**Current:**
```json
{
  "replySettings": {
    "enabled": true,
    "maxRepliesPerRun": 5,
    "maxTweetsToEvaluatePerRun": 10,
    "maxRepliesPerDay": 30,
    "maxRepliesPerKolPerWeek": 2,
    "minRelevanceScoreForReply": 7,
    "minTimeBetweenRepliesMinutes": 60,
    "minTimeBetweenReplies": 3600
  },
  "freshnessFilter": {
    "enabled": true,
    "maxTweetAgeHours": 24,
    "cleanupThresholdHours": 48
  }
}
```

**Change To:**
```json
{
  "replySettings": {
    "enabled": true,
    "maxRepliesPerRun": 8,              // 5 → 8 (60% increase per run)
    "maxTweetsToEvaluatePerRun": 20,    // 10 → 20 (evaluate more tweets)
    "maxRepliesPerDay": 60,             // 30 → 60 (100% increase)
    "maxRepliesPerKolPerWeek": 3,       // 2 → 3 (50% increase)
    "minRelevanceScoreForReply": 6,     // 7 → 6 (slightly lower threshold)
    "minTimeBetweenRepliesMinutes": 45, // 60 → 45 (tighter spacing)
    "minTimeBetweenReplies": 2700       // 3600 → 2700 (45 minutes)
  },
  "freshnessFilter": {
    "enabled": true,
    "maxTweetAgeHours": 36,             // 24 → 36 (wider time window)
    "cleanupThresholdHours": 72         // 48 → 72 (keep tweets longer)
  }
}
```

**Impact:**
- Max replies/day: 30 → 60 (100% increase)
- Per-run replies: 5 → 8
- With 6 runs/day: 6 × 8 = 48 replies/day (before daily cap)
- Wider time window captures more engagement opportunities

---

#### **File 6: `.github/workflows/kol-reply-cycle.yml`**

**Current:**
```yaml
on:
  schedule:
    - cron: '15 2 * * *'   # 02:15 UTC
    - cron: '30 7 * * *'   # 07:30 UTC
    - cron: '45 11 * * *'  # 11:45 UTC
    - cron: '20 15 * * *'  # 15:20 UTC
    - cron: '50 19 * * *'  # 19:50 UTC
    - cron: '10 23 * * *'  # 23:10 UTC
```

**Change To (Add 2 More Runs - 8 Total):**
```yaml
on:
  schedule:
    - cron: '15 2 * * *'   # 02:15 UTC
    - cron: '0 5 * * *'    # 05:00 UTC (NEW)
    - cron: '30 7 * * *'   # 07:30 UTC
    - cron: '15 10 * * *'  # 10:15 UTC (NEW)
    - cron: '45 11 * * *'  # 11:45 UTC
    - cron: '20 15 * * *'  # 15:20 UTC
    - cron: '50 19 * * *'  # 19:50 UTC
    - cron: '10 23 * * *'  # 23:10 UTC
```

**Impact:**
- Runs: 6/day → 8/day
- Max replies: 6×8=48/day → 8×8=64/day (before 60/day cap kicks in)

---

#### **File 7: `.github/workflows/reply-kols-daily.yml`**

**Current:**
```yaml
on:
  schedule:
    - cron: '30 0 * * *'   # 00:30 UTC
    - cron: '30 6 * * *'   # 06:30 UTC
    - cron: '30 12 * * *'  # 12:30 UTC
    - cron: '30 18 * * *'  # 18:30 UTC
```

**Change To (Add 2 More Runs - 6 Total):**
```yaml
on:
  schedule:
    - cron: '30 0 * * *'   # 00:30 UTC
    - cron: '0 4 * * *'    # 04:00 UTC (NEW)
    - cron: '30 6 * * *'   # 06:30 UTC
    - cron: '30 9 * * *'   # 09:30 UTC (NEW)
    - cron: '30 12 * * *'  # 12:30 UTC
    - cron: '30 18 * * *'  # 18:30 UTC
```

**Impact:** Adds 2 more evaluation cycles per day

---

#### **File 8: `.github/workflows/reply-to-product-tweets.yml`**

**Current:**
```yaml
on:
  schedule:
    - cron: '0 10 * * *'   # 10:00 UTC
    - cron: '0 16 * * *'   # 16:00 UTC
```

**Change To (Add 1 More Run - 3 Total):**
```yaml
on:
  schedule:
    - cron: '0 10 * * *'   # 10:00 UTC
    - cron: '0 14 * * *'   # 14:00 UTC (NEW - midday)
    - cron: '0 16 * * *'   # 16:00 UTC
```

**Impact:** Product replies: 2-4/day → 3-6/day

---

### PHASE 3: Monitoring & Data Collection (Optional Adjustments)

These don't affect posting/reply frequency but collect data:

#### **File 9: `.github/workflows/kol-monitor-timelines.yml`**

**Current:** 4x daily (07:15, 12:30, 17:45, 22:00 UTC)

**Optional Change:** Increase to 6x daily to capture more engagement opportunities
```yaml
on:
  schedule:
    - cron: '0 3 * * *'    # 03:00 UTC
    - cron: '15 7 * * *'   # 07:15 UTC
    - cron: '0 11 * * *'   # 11:00 UTC
    - cron: '30 12 * * *'  # 12:30 UTC
    - cron: '45 17 * * *'  # 17:45 UTC
    - cron: '0 22 * * *'   # 22:00 UTC
```

**Impact:** More frequent data collection → better reply targeting

---

#### **File 10: `.github/workflows/discover-product-tweets.yml`**

**Current:** Daily at 8:00 AM UTC

**Optional Change:** Increase to 2x daily
```yaml
on:
  schedule:
    - cron: '0 8 * * *'    # 08:00 UTC
    - cron: '0 20 * * *'   # 20:00 UTC (NEW - evening discovery)
```

**Impact:** More product tweet discovery → more reply opportunities

---

## Summary of Changes

### Files to Modify

| File | Purpose | Change Type |
|------|---------|-------------|
| `.github/workflows/weekly-x-post.yml` | Regular posts | Schedule change |
| `.github/workflows/post-article-content.yml` | Article posts | Schedule change or disable |
| `scripts/crawling/utils/article-posting-scheduler.js` | Article timing | Config values |
| `scripts/crawling/config/kol-config.json` | Reply limits | Config values |
| `.github/workflows/kol-reply-cycle.yml` | KOL replies | Add 2 cron schedules |
| `.github/workflows/reply-kols-daily.yml` | KOL evaluation | Add 2 cron schedules |
| `.github/workflows/reply-to-product-tweets.yml` | Product replies | Add 1 cron schedule |
| `.github/workflows/kol-monitor-timelines.yml` | Monitoring (optional) | Add 2 cron schedules |
| `.github/workflows/discover-product-tweets.yml` | Discovery (optional) | Add 1 cron schedule |

**Total Files:** 9 (7 required, 2 optional)

---

## Expected Outcomes

### Before Changes

| Metric | Current Value |
|--------|---------------|
| Regular Posts | ~14 posts/week (2/day) |
| KOL Replies | Max 30/day |
| Product Replies | 2-4/day |
| Total Replies | 32-34/day |
| Posts:Replies Ratio | 1:2.4 |

### After Changes

| Metric | New Value | Change |
|--------|-----------|--------|
| Regular Posts | 3.5 posts/week (0.5/day) | -75% |
| KOL Replies | Max 60/day | +100% |
| Product Replies | 3-6/day | +50% |
| Total Replies | 63-66/day | +94% |
| Posts:Replies Ratio | 1:18 | 7.5x increase |

---

## Implementation Sequence

### Step 1: Reduce Regular Posts (Low Risk)
1. Edit `weekly-x-post.yml` - Change cron to every 2 days
2. Edit `post-article-content.yml` - Change to weekly or disable
3. Edit `article-posting-scheduler.js` - Update interval config
4. **Commit:** "feat: Reduce regular posts to 1 every 2 days"

### Step 2: Increase Reply Capacity (Medium Risk)
5. Edit `kol-config.json` - Increase all reply limits
6. **Commit:** "feat: Increase reply capacity to 60/day"

### Step 3: Add Reply Workflow Runs (Medium Risk)
7. Edit `kol-reply-cycle.yml` - Add 2 cron schedules
8. Edit `reply-kols-daily.yml` - Add 2 cron schedules
9. Edit `reply-to-product-tweets.yml` - Add 1 cron schedule
10. **Commit:** "feat: Add additional reply workflow cycles"

### Step 4: Monitor & Optimize (Optional)
11. Edit `kol-monitor-timelines.yml` - Add monitoring runs
12. Edit `discover-product-tweets.yml` - Add discovery runs
13. **Commit:** "feat: Increase monitoring and discovery frequency"

### Step 5: Test & Validate
14. Monitor first 48 hours of reduced posting
15. Check reply counts don't hit rate limits
16. Verify Twitter API usage stays within bounds
17. Check Zapier notifications for errors

---

## Rollback Plan

If issues occur:

1. **Revert workflow schedules:**
   ```bash
   git revert <commit-hash>
   git push origin master
   ```

2. **Emergency disable:**
   - Comment out new cron schedules in workflow files
   - Reduce `maxRepliesPerDay` back to 30 in kol-config.json

3. **Partial rollback:**
   - Keep reduced posting frequency
   - Revert reply increases if Twitter API limits hit

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Hit Twitter API rate limits | Medium | High | Monitor API usage logs, gradual rollout |
| Reduced engagement from fewer posts | Low | Medium | Offset by increased replies |
| Reply quality degrades | Medium | Medium | Keep minRelevanceScoreForReply at 6, monitor |
| Workflow execution costs increase | Low | Low | GitHub Actions has generous free tier |
| KOL fatigue from more replies | Low | Medium | Maintain maxRepliesPerKolPerWeek cap at 3 |

---

## Monitoring Metrics

Track these metrics for 1 week after changes:

1. **Posting Frequency:**
   - `scripts/data/article-x-posts.json` - verify 0.5 posts/day
   - `weekly-x-posts-state.json` - verify every 2 days

2. **Reply Frequency:**
   - `scripts/crawling/data/kol-replies.json` - verify approaching 60/day
   - Check daily reply counts don't exceed cap

3. **API Usage:**
   - `scripts/crawling/logs/api-usage.json` - monitor Twitter API calls
   - Ensure under rate limit thresholds

4. **Engagement Metrics:**
   - Compare post engagement (likes, replies, retweets) before/after
   - Track reply response rates from KOLs

5. **Error Rates:**
   - Monitor Zapier webhook notifications
   - Check GitHub Actions failure rates

---

## Next Steps

1. **Review & Approve Plan** - User confirmation
2. **Create Feature Branch** - `git checkout -b feat/reduce-posts-increase-replies`
3. **Implement Changes** - Follow implementation sequence
4. **Test Locally** - Dry-run scripts with new configs
5. **Deploy to Production** - Merge to master
6. **Monitor 48 Hours** - Track metrics closely
7. **Fine-tune** - Adjust based on results

---

**Plan Status:** 📋 Ready for Review
**Risk Level:** 🟡 Medium (controlled rollout recommended)
**Expected Impact:** ✅ Positive (better engagement ratio)
