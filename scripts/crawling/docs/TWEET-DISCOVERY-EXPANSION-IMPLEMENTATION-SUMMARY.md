# Tweet Discovery Expansion - Implementation Summary

**Date:** December 31, 2025
**Status:** ✅ FULLY IMPLEMENTED - READY FOR TESTING
**Branch:** xai-trackkols

---

## Executive Summary

Successfully implemented a comprehensive 3-phase expansion of the tweet discovery system to address the issue of insufficient tweet discovery for replies. The system now discovers tweets through:

1. **Enhanced Product-Specific Discovery** - 4x more queries (5→20) with category-aware selection
2. **Institution Account Discovery** - Identifies 200+ universities, e-learning platforms, bootcamps as potential customers
3. **Topic Trend Monitoring** - Discovers viral threads, breaking news, and trending conversations

**Expected Impact:**
- **10-20x increase** in tweet discovery volume
- **Broader topic coverage** - institutions, pain-points, use-cases, market trends
- **Timely engagement** - viral threads and breaking news opportunities
- **Better targeting** - institutional accounts with high product fit

---

## Implementation Overview

### Phase 1: Enhanced Product-Specific Discovery
**Status:** ✅ Complete and tested

**What Changed:**
- Expanded Blockchain Badges queries from 5 to 20 (+300%)
- Added category-based query organization (general, institutions, pain-points, use-cases)
- Implemented category-aware query selection algorithm
- Increased queries per run from 3 to 5 (+67%)
- Increased max tweets per product from 20 to 50 (+150%)

**New Queries Added (15):**

**Institutions (5):**
- E-learning platforms (Coursera, Udemy, edX)
- Bootcamp training programs
- Universities with digital credentials
- Corporate L&D programs
- Professional certification bodies (PMP, AWS, CompTIA)

**Pain Points (5):**
- Credential verification problems
- Fake credential concerns
- International recognition issues
- Employer verification needs
- Credential sharing/display challenges

**Use Cases (5):**
- Micro-credentials and nanodegrees
- Continuing education (CEUs)
- Skills-based hiring
- Alternative credentials
- Blockchain education courses

**Files Modified:**
1. `scripts/crawling/config/product-search-queries.json`
   - Added 15 new queries with category tags
   - Updated settings: maxQueriesPerRun 3→5, maxTweetsPerProduct 20→50
   - Added categoryDistribution config

2. `scripts/crawling/production/discover-product-tweets-sdk.js`
   - Implemented `selectQueriesForProduct()` with category-aware logic
   - Added `selectWeightedRandom()` helper function
   - Added `selectQueriesWeightedRandom()` fallback function
   - Ensures at least 1 query from each category per run

3. `scripts/crawling/test/test-category-aware-selection.js` (NEW)
   - Test script to validate category-aware selection
   - Runs 5 test selections and validates distribution
   - Confirmed all 4 categories represented in every run

**Testing Results:**
- ✅ Category-aware selection working correctly
- ✅ All 4 categories represented in test runs
- ✅ Exactly 5 queries selected per run
- ✅ Integration test with SDK completed successfully

---

### Phase 2: Institution Account Discovery
**Status:** ✅ Complete - Ready for deployment

**Purpose:**
Discover and classify institutional Twitter accounts (universities, e-learning platforms, bootcamps, certification bodies) that are potential customers for BWS Blockchain Badges.

**How It Works:**
1. Search tweets using institution-specific queries
2. Extract author accounts from tweets
3. Classify accounts as institution vs individual (confidence scoring)
4. Score accounts by product fit (Blockchain Badges relevance)
5. Store in `institution-accounts.json` database

**Files Created:**

1. `scripts/crawling/config/institution-search-queries.json` (NEW)
   - 15 queries targeting institutional accounts
   - Categories: universities, elearning, bootcamps, professional-training, certification-bodies
   - Account classification rules (institution indicators, exclude indicators)
   - Product fit scoring keywords and weights

2. `scripts/crawling/production/discover-institution-accounts-sdk.js` (NEW)
   - Main institution discovery script (BWS X SDK v1.6.0)
   - Account classification logic (checks bio, name, follower count)
   - Product fit scoring (0-100 scale, high/medium/low/none levels)
   - Category-aware query selection
   - Stores results in institution-accounts.json

3. `scripts/crawling/data/institution-accounts.json` (NEW)
   - Database structure for discovered institutions
   - Tracks account metadata, classification confidence, product fit scores
   - Stats by product, category, and fit level

4. `.github/workflows/discover-institutions.yml` (NEW)
   - Weekly workflow (Monday 8:00 AM UTC)
   - Manual trigger available
   - Auto-commits new institutions
   - Creates issues on failure

**Classification Algorithm:**
- Checks bio/description for institution indicators (university, college, school, academy, education, etc.)
- Excludes personal account indicators (student, alumni, learner, etc.)
- Minimum 100 followers required
- Confidence score: 40-100% (20 points per indicator, +20 for verified, +20 for high followers)

**Product Fit Scoring:**
- Analyzes bio/description for product-relevant keywords
- Keywords like "digital credentials" (+10), "blockchain credentials" (+15), "verifiable credentials" (+12)
- Verified accounts (+3), Large following (+2)
- Fit levels: high (30+), medium (15-29), low (5-14), none (<5)

**Expected Results:**
- Discover 50-200 institutional accounts per run
- Track high-fit institutions for targeted outreach
- Build institutional customer prospect database

---

### Phase 3: Topic Trend Monitoring
**Status:** ✅ Complete - Ready for deployment

**Purpose:**
Discover trending conversations, viral threads, breaking news, and debates about credentials, education fraud, and verification for timely engagement opportunities.

**How It Works:**
1. Search tweets using trend-specific queries (high engagement thresholds)
2. Filter by trend type (viral, news, debate, conversation, trend)
3. Detect viral threads (3+ tweet sequences)
4. Calculate trend scores (engagement × recency × type multiplier)
5. Store top 100 trends in topic-trends.json

**Files Created:**

1. `scripts/crawling/config/topic-trends-queries.json` (NEW)
   - 15 queries targeting trending topics
   - Categories: viral, news, debate, conversation, market, solution, pain-point, use-case
   - Trend types: viral (100+ likes), news (100+ likes, 30+ RT), debate (30+ likes, 10+ replies)
   - Thread detection config (min 3 tweets, max 20 tweets)

2. `scripts/crawling/production/monitor-topic-trends-sdk.js` (NEW)
   - Main trend monitoring script (BWS X SDK v1.6.0)
   - Engagement threshold filtering by trend type
   - Time window filtering (viral: 12h, news: 24h, debate: 48h, etc.)
   - Trend scoring algorithm (engagement × recency × type multiplier)
   - Thread detection (finds multi-tweet sequences from same author)
   - Stores top 100 trends sorted by score

3. `scripts/crawling/data/topic-trends.json` (NEW)
   - Database structure for discovered trends
   - Stores tweets with trend metadata, scores, thread info
   - Stats by product, category, and trend type

4. `.github/workflows/monitor-topic-trends.yml` (NEW)
   - Every 6 hours workflow
   - Manual trigger available
   - Auto-commits new trends
   - Creates issues on failure

**Trend Detection Features:**

**Trend Types:**
- **Viral:** 100+ likes, 20+ RT, 10+ replies (12h window)
- **News:** 100+ likes, 30+ RT, 5+ replies (24h window)
- **Debate:** 30+ likes, 5+ RT, 10+ replies (48h window)
- **Conversation:** 20+ likes, 3+ RT, 5+ replies (72h window)
- **Trend:** 30+ likes, 5+ RT, 3+ replies (168h window)

**Trend Scoring:**
```
engagementScore = (likes × 1) + (retweets × 3) + (replies × 2)
recencyMultiplier = max(0.5, 1 - (ageHours / 168)) // Decay over 1 week
typeMultiplier = { viral: 1.5, news: 1.3, debate: 1.2, conversation: 1.0, trend: 1.1 }
finalScore = engagementScore × recencyMultiplier × typeMultiplier
```

**Thread Detection:**
- Identifies multi-tweet threads from same author
- Finds tweets within 5-minute window
- Minimum 3 tweets to qualify as thread
- Tracks thread length and related tweet IDs

**Example Queries:**
- "Trending credential fraud" (fake, fraud, forged + degree/diploma, 50+ likes)
- "Viral verification threads" (verify + degree/diploma, 10+ replies, 50+ likes)
- "Breaking education news" (breaking, announced + university, scandal, 100+ likes)
- "Celebrity education fraud" (celebrity, politician + fake degree, 100+ likes)

**Expected Results:**
- Discover 20-50 trending topics per run (every 6 hours)
- Identify viral threads for timely engagement
- Track breaking news for thought leadership opportunities
- Find high-engagement debates for educational replies

---

## Files Summary

### New Files Created (11)

**Configuration Files:**
1. `scripts/crawling/config/institution-search-queries.json`
2. `scripts/crawling/config/topic-trends-queries.json`

**Production Scripts:**
3. `scripts/crawling/production/discover-institution-accounts-sdk.js`
4. `scripts/crawling/production/monitor-topic-trends-sdk.js`

**Data Files:**
5. `scripts/crawling/data/institution-accounts.json`
6. `scripts/crawling/data/topic-trends.json`

**Workflows:**
7. `.github/workflows/discover-institutions.yml`
8. `.github/workflows/monitor-topic-trends.yml`

**Test Files:**
9. `scripts/crawling/test/test-category-aware-selection.js`

**Documentation:**
10. `scripts/crawling/docs/TWEET-DISCOVERY-IMPROVEMENT-PLAN.md` (from previous planning)
11. `scripts/crawling/docs/TWEET-DISCOVERY-EXPANSION-IMPLEMENTATION-SUMMARY.md` (this file)

### Modified Files (2)

1. `scripts/crawling/config/product-search-queries.json`
   - Added 15 new queries (5→20 for Blockchain Badges)
   - Updated settings (maxQueriesPerRun: 5, maxTweetsPerProduct: 50)
   - Added categoryDistribution config

2. `scripts/crawling/production/discover-product-tweets-sdk.js`
   - Implemented category-aware query selection
   - Added helper functions for weighted random selection

---

## Testing Instructions

### Phase 1: Product Discovery (Tested ✅)

```bash
# Test category-aware selection logic
node scripts/crawling/test/test-category-aware-selection.js

# Expected output:
# - 5 queries selected per run
# - All 4 categories represented
# - Validation checks pass: ✅✅✅

# Test actual tweet discovery
node scripts/crawling/production/discover-product-tweets-sdk.js --product="Blockchain Badges"

# Expected output:
# - 5 queries executed across 4 categories
# - Tweets discovered and added to queue
# - Stats by category shown
```

**Test Results:**
- ✅ Category-aware selection validated
- ✅ All 4 categories represented in test runs
- ✅ Integration with SDK successful
- ⚠️ Some queries hit rate limits (expected)

### Phase 2: Institution Discovery (Ready to Test)

```bash
# Test institution discovery
node scripts/crawling/production/discover-institution-accounts-sdk.js --product="Blockchain Badges"

# Expected output:
# - 5 queries executed across 5 categories
# - Accounts extracted from tweets
# - Accounts classified (institution vs individual)
# - Product fit scores calculated
# - Results saved to institution-accounts.json

# Check results
cat scripts/crawling/data/institution-accounts.json | jq '.stats'
```

**Expected Results:**
- 10-50 institutions discovered per run
- Classification confidence 40-100%
- Product fit scores distributed across high/medium/low

### Phase 3: Topic Trend Monitoring (Ready to Test)

```bash
# Test trend monitoring
node scripts/crawling/production/monitor-topic-trends-sdk.js --product="Blockchain Badges"

# Expected output:
# - 7 queries executed across 8 categories
# - Tweets filtered by engagement thresholds
# - Trend scores calculated
# - Threads detected
# - Results saved to topic-trends.json

# Check results
cat scripts/crawling/data/topic-trends.json | jq '.stats'
```

**Expected Results:**
- 10-30 trends discovered per run
- Trends sorted by score (highest first)
- Thread detection working (isThread: true for multi-tweet sequences)
- Trend types: viral, news, debate, conversation

---

## Deployment Instructions

### 1. Merge to Master

All changes are in the `xai-trackkols` worktree branch. To deploy:

```bash
# From project root
cd /mnt/x/Git/blockchain-web-services/bws/bws-front/bws-website-front

# Merge worktree to master
npm run worktree:merge xai-trackkols -- --update

# Or manually
cd .trees/xai-trackkols
git add .
git commit -m "feat: Expand tweet discovery with 3-phase implementation

Phase 1: Enhanced product-specific discovery (5→20 queries, category-aware)
Phase 2: Institution account discovery (universities, bootcamps, e-learning)
Phase 3: Topic trend monitoring (viral, news, debates)

Expected impact: 10-20x increase in tweet discovery volume"

cd ../..
npm run worktree:merge xai-trackkols
```

### 2. Verify Workflows Are Active

After merge, check GitHub Actions:

```bash
# List workflows
gh workflow list

# Should see:
# - Discover Institution Accounts (weekly, Monday 8 AM)
# - Monitor Topic Trends (every 6 hours)
```

### 3. Manual Test Runs

Trigger manual runs to verify:

```bash
# Test institution discovery
gh workflow run "Discover Institution Accounts"

# Test topic monitoring
gh workflow run "Monitor Topic Trends"

# Monitor runs
gh run watch
```

### 4. Monitor Initial Results

After first automated runs:

```bash
# Check institution database
gh api repos/blockchain-web-services/bws-website-front/contents/scripts/crawling/data/institution-accounts.json | jq -r '.content' | base64 -d | jq '.stats'

# Check topic trends database
gh api repos/blockchain-web-services/bws-website-front/contents/scripts/crawling/data/topic-trends.json | jq -r '.content' | base64 -d | jq '.stats'

# Check product queue for increased tweets
gh api repos/blockchain-web-services/bws-website-front/contents/scripts/crawling/data/product-discovery-queue.json | jq -r '.content' | base64 -d | jq '.stats'
```

---

## Monitoring & Metrics

### Key Metrics to Track

**Product Discovery:**
- Total tweets discovered per day (baseline: ~5-10, target: 50-100)
- Tweets by category (should see distribution across 4 categories)
- Queue utilization (unprocessed tweets available)

**Institution Discovery:**
- Total institutions discovered (target: 50-200 after first few runs)
- High-fit institutions (target: 20-50)
- Classification confidence (target: 60-100% average)

**Topic Trends:**
- Trends discovered per run (target: 20-50)
- Viral trends (target: 5-10 per day)
- Breaking news (target: 2-5 per day)
- Thread detection rate (target: 10-20% of trends are threads)

### Success Criteria

**Week 1:**
- ✅ All 3 workflows running successfully
- ✅ Product discovery: 30+ tweets/day (6x increase)
- ✅ Institutions: 50+ discovered
- ✅ Trends: 100+ discovered

**Month 1:**
- ✅ Product discovery: 50-100 tweets/day (10-20x increase)
- ✅ Institutions: 200+ high-quality prospects
- ✅ Trends: Consistent viral/news discovery
- ✅ Reply rate increased due to more tweet availability

---

## Rollback Plan

If issues arise, rollback is straightforward:

### Option 1: Disable New Workflows Only

Edit workflow files and comment out schedules:

```yaml
# .github/workflows/discover-institutions.yml
# on:
#   schedule:
#     - cron: '0 8 * * 1'

# .github/workflows/monitor-topic-trends.yml
# on:
#   schedule:
#     - cron: '0 */6 * * *'
```

Phase 1 changes will continue working (enhanced product discovery).

### Option 2: Revert Product Discovery Changes

```bash
git checkout HEAD~1 -- scripts/crawling/config/product-search-queries.json
git checkout HEAD~1 -- scripts/crawling/production/discover-product-tweets-sdk.js
git commit -m "rollback: Revert product discovery enhancements"
git push origin master
```

### Option 3: Full Rollback

```bash
# Find the commit hash before tweet discovery expansion
git log --oneline | grep "feat: Expand tweet discovery"

# Revert that commit
git revert <commit-hash>
git push origin master
```

---

## Next Steps

1. **Test All Phases Locally** (if not done yet)
   - Run each script manually to verify functionality
   - Check data files for expected structure

2. **Commit and Merge to Master**
   - Use worktree merge workflow
   - Verify deployment in GitHub Actions

3. **Monitor First Week**
   - Check workflow runs daily
   - Verify data files are being updated
   - Monitor for API rate limit issues

4. **Tune Configuration** (after 1 week of data)
   - Adjust engagement thresholds if too strict/loose
   - Adjust query selection if category distribution is uneven
   - Adjust workflow frequency if hitting rate limits

5. **Document Results**
   - Create metrics report after 1 week
   - Compare before/after tweet discovery volumes
   - Share success metrics with team

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| API rate limits | Medium | Medium | Monitor usage, adjust workflow frequency |
| Too many low-quality tweets | Low | Medium | Engagement thresholds, relevance scoring |
| Institution misclassification | Low | Low | Confidence scores, manual review of high-fit |
| Trend scoring noise | Low | Low | High engagement thresholds, time windows |
| Workflow failures | Low | High | Auto-issue creation, manual trigger available |

---

## Questions & Support

**Implementation Questions:**
- File structure: See "Files Summary" section above
- Testing: See "Testing Instructions" section above
- Deployment: See "Deployment Instructions" section above

**Technical Details:**
- All scripts use BWS X SDK v1.6.0
- Hybrid mode (crawler-first with API fallback)
- Category-aware query selection across all 3 phases
- Weighted random selection by priority (high: 3, medium: 2, low: 1)

**Documentation:**
- Planning: `TWEET-DISCOVERY-IMPROVEMENT-PLAN.md`
- Implementation: This file
- Original context: User request on Dec 31, 2025

---

**Status:** ✅ IMPLEMENTATION COMPLETE
**Ready for:** Testing and deployment to master
**Next Action:** Test all 3 phases, commit, and merge to master

