# KOL Discovery Workflow - Issue Analysis & Fix

**Date**: 2025-11-17
**Workflow**: `kol-discovery-morning.yml`
**Script**: `scripts/crawling/production/discover-crawlee-direct.js`
**Status**: ⚠️ **FALSE POSITIVE SUCCESS** - Runs successfully but adds 0 new KOLs

---

## Executive Summary

The KOL Discovery workflow is marked as "successful" but **never adds new KOLs** to the database. All 5 recent runs (Nov 7, 10, 12, 14, 17) show `conclusion: "success"` despite discovering 0 new accounts.

**Root Cause**: The script uses a **hardcoded list** of 55 candidate usernames and skips all accounts already in the database. Since all 14 existing KOLs came from this list, the script now does nothing but check the same accounts repeatedly.

**Impact**:
- Database stagnates at 14 KOLs
- No actual discovery happening
- Workflow gives false confidence that discovery is working

---

## Technical Analysis

### 1. Current Discovery Algorithm

**Location**: `scripts/crawling/production/discover-crawlee-direct.js:18-81`

The script has a **hardcoded array** of 55 crypto influencer usernames:

```javascript
const candidateUsernames = [
  // Tier 1: 100K-500K followers
  'IncomeSharks',
  'AltcoinSherpa',
  'cobie',
  'CryptoKaleo',
  // ... 51 more hardcoded usernames
];
```

### 2. The Skip Logic Problem

**Location**: `discover-crawlee-direct.js:107-110`

```javascript
// Skip if already in database
if (existingUsernames.has(username.toLowerCase())) {
  console.log(`   ⏭️  Already in database`);
  continue;
}
```

**What Happens**:
1. Script loads 14 existing KOLs from `kols-data.json`
2. Checks each of 55 hardcoded candidates
3. Finds that 14 are already in database → **skips them**
4. The remaining 41 candidates either:
   - Don't exist / profiles not found
   - Below follower minimum (10K)
   - Above follower maximum (if set)
   - Don't pass crypto relevance filter

**Result**: 0 new KOLs added every run

### 3. Why It's Marked as "Success"

**Problem #1 - Hardcoded Success Status**

**Location**: `.github/workflows/kol-discovery-morning.yml:41`

```yaml
- name: Run KOL discovery with Crawlee
  run: |
    echo "Starting morning KOL discovery with Crawlee..."
    node scripts/crawling/production/discover-crawlee-direct.js
    echo "discover_status=success" >> $GITHUB_OUTPUT  # ← ALWAYS SUCCESS
  continue-on-error: true  # ← Prevents failure
```

The workflow **hardcodes success status** before knowing the result.

**Problem #2 - continue-on-error**

Even though the script exits with code 1 when `kolsAdded === 0` (line 301), the workflow uses `continue-on-error: true`, so it never fails.

**Problem #3 - No Validation**

The "Check for changes" step detects no git changes but doesn't fail the workflow:

```yaml
- name: Check for changes
  run: |
    if git diff --quiet scripts/crawling/data/kols-data.json; then
      echo "has_changes=false" >> $GITHUB_OUTPUT  # ← Just reports, doesn't fail
    fi
```

### 4. Evidence from Recent Runs

**Run #19424437887 (Nov 17, 2025)** - Latest run logs show:

```
📋 Candidates to check: 55
📊 Existing KOLs in database: 14

[1/55] Checking @IncomeSharks...
   ⏭️  Already in database

[2/55] Checking @AltcoinSherpa...
   ⏭️  Already in database

[3/55] Checking @cobie...
   ⏭️  Already in database

[4/55] Checking @CryptoKaleo...
   ⏭️  Already in database

... (pattern repeats for all 14 existing KOLs)
```

The script checks 55 candidates, skips the 14 already in database, and finds 0 new ones.

---

## Why This is a "Seed Discovery" Not True Discovery

This script was designed to **bootstrap** the KOL database with a curated list of known influencers. It's not a dynamic discovery algorithm.

**What's Missing**:
1. **Network Expansion**: Following KOLs' followers/following to discover new influencers
2. **Search-Based Discovery**: Searching for trending crypto hashtags/keywords
3. **Engagement-Based Discovery**: Finding accounts with high-engagement crypto content
4. **Organic Growth**: Continuously expanding beyond the seed list

**Current State**: Once the seed list is exhausted, the script does nothing.

---

## Root Causes Summary

| Issue | Impact | Severity |
|-------|--------|----------|
| **Hardcoded username list** | No new KOLs discovered beyond initial 55 | 🔴 Critical |
| **No dynamic expansion algorithm** | Database stagnates | 🔴 Critical |
| **Workflow always succeeds** | False confidence, no alerts | 🟡 High |
| **No failure on 0 discoveries** | Issue goes unnoticed | 🟡 High |
| **Script designed as seed, not discovery** | Fundamentally wrong approach | 🔴 Critical |

---

## Solutions

### Option A: Quick Fix - Expand Hardcoded List (Temporary)

**Pros**:
- Fast to implement (30 mins)
- Gets some new KOLs immediately

**Cons**:
- Not sustainable
- Same problem returns eventually
- Manual curation required

**Implementation**:
1. Research 50-100 more crypto influencers manually
2. Add to `candidateUsernames` array
3. Run discovery again

### Option B: Implement True Discovery Algorithm (Recommended)

**Approach 1: Network-Based Discovery**

Follow the social graph of existing KOLs:

```javascript
async function discoverFromNetwork() {
  for (const kol of existingKols) {
    // Get who the KOL follows
    const following = await getFollowing(kol.username, limit: 50);

    // Get KOL's followers (sample)
    const followers = await getFollowers(kol.username, limit: 100);

    // Filter for crypto relevance
    const cryptoAccounts = filterCryptoAccounts([...following, ...followers]);

    // Add qualifying accounts
    for (const account of cryptoAccounts) {
      if (meetsKolCriteria(account)) {
        addToDatabase(account);
      }
    }
  }
}
```

**Approach 2: Search-Based Discovery**

Search X/Twitter for crypto keywords:

```javascript
async function discoverFromSearch() {
  const searches = [
    '$BTC', '$ETH', '$SOL', 'crypto', 'defi', 'web3',
    'blockchain', 'nft', 'cryptocurrency'
  ];

  for (const query of searches) {
    const results = await searchTwitter(query, type: 'accounts');

    for (const account of results) {
      if (meetsKolCriteria(account) && !existsInDatabase(account)) {
        addToDatabase(account);
      }
    }
  }
}
```

**Approach 3: Engagement-Based Discovery**

Find accounts with high-engagement crypto content:

```javascript
async function discoverFromEngagement() {
  const trendingTopics = ['#Bitcoin', '#Ethereum', '#Crypto'];

  for (const topic of trendingTopics) {
    const topTweets = await searchTweets(topic, sort: 'engagement', limit: 100);

    const authors = topTweets.map(t => t.author);
    const uniqueAuthors = deduplicateAuthors(authors);

    for (const author of uniqueAuthors) {
      if (meetsKolCriteria(author) && !existsInDatabase(author)) {
        addToDatabase(author);
      }
    }
  }
}
```

### Option C: Fix Workflow Success Criteria (Immediate)

Even without changing discovery logic, fix the false positive:

**File**: `.github/workflows/kol-discovery-morning.yml`

```yaml
- name: Run KOL discovery with Crawlee
  id: discover
  run: |
    echo "Starting morning KOL discovery with Crawlee..."
    node scripts/crawling/production/discover-crawlee-direct.js
    # Don't hardcode success - let script exit code determine success
  # REMOVE: continue-on-error: true  ← This line

- name: Check for changes
  id: changes
  run: |
    if git diff --quiet scripts/crawling/data/kols-data.json; then
      echo "has_changes=false" >> $GITHUB_OUTPUT
      echo "⚠️  WARNING: No new KOLs discovered"
      exit 1  # ← FAIL if no changes
    else
      echo "has_changes=true" >> $GITHUB_OUTPUT
    fi
```

This ensures the workflow **fails** when no KOLs are added, triggering alerts.

---

## Recommended Implementation Plan

### Phase 1: Immediate Fix (Today - 1 hour)

1. ✅ **Fix workflow success criteria** (Option C)
   - Remove `continue-on-error: true`
   - Fail workflow if no changes detected
   - **Result**: Workflow will start failing (correctly), alerting team to the issue

### Phase 2: Quick Win (This Week - 4 hours)

2. ✅ **Expand hardcoded list** (Option A)
   - Add 50-100 more crypto influencers
   - Tier them by follower count
   - Run discovery to add immediate new KOLs

### Phase 3: Sustainable Solution (Next 2 Weeks - 2-3 days)

3. ✅ **Implement network-based discovery** (Option B, Approach 1)
   - Use Crawlee + Playwright to scrape KOL follower lists
   - Filter by crypto relevance using Claude AI
   - Automatically expand database organically

4. ✅ **Implement search-based discovery** (Option B, Approach 2)
   - Search for crypto keywords
   - Rank accounts by engagement
   - Add top performers to database

5. ✅ **Combine all methods**
   - Run network discovery weekly
   - Run search discovery daily
   - Keep seed list as fallback

---

## Updated README Documentation

After fixes, update `README.md` section 2.2:

```markdown
## 2.2 KOL Discovery - Morning

**Status**: ⚠️ **NEEDS FIX** - Currently using exhausted seed list

**Issue**: Script uses hardcoded list of 55 accounts, all of which are already in database. No actual discovery happening.

**Fix in Progress**:
- Phase 1: Fail workflow when 0 KOLs added (alerts team)
- Phase 2: Expand seed list temporarily
- Phase 3: Implement network + search based discovery

**Recent Outputs**: 0 new KOLs (last 5 runs)

**Recommended Action**: See `scripts/crawling/docs/KOL_DISCOVERY_ISSUE_ANALYSIS.md`
```

---

## Testing Plan

### Test 1: Verify Workflow Fails Correctly

After implementing Phase 1 fix:

```bash
# Trigger workflow manually
gh workflow run kol-discovery-morning.yml

# Should FAIL with message: "WARNING: No new KOLs discovered"
gh run watch
```

### Test 2: Verify Expanded List Works

After implementing Phase 2:

```bash
# Add new usernames to candidateUsernames array
# Trigger workflow
gh workflow run kol-discovery-morning.yml

# Should succeed and commit new KOLs
gh run watch
```

### Test 3: Verify Dynamic Discovery

After implementing Phase 3:

```bash
# Run locally first
node scripts/crawling/production/discover-network-expansion.js

# Should find KOLs beyond hardcoded list
# Check kols-data.json for new entries with discoveryMethod: 'network-expansion'
```

---

## Files to Modify

1. **`.github/workflows/kol-discovery-morning.yml`** - Fix success criteria
2. **`scripts/crawling/production/discover-crawlee-direct.js`** - Expand seed list (Phase 2)
3. **`scripts/crawling/production/discover-network-expansion.js`** - NEW FILE (Phase 3)
4. **`scripts/crawling/production/discover-search-based.js`** - NEW FILE (Phase 3)
5. **`README.md`** - Update automation status section

---

## Conclusion

The KOL Discovery workflow gives a **false sense of security** by reporting success while doing nothing. The hardcoded seed list approach worked initially but is now exhausted.

**Immediate Action Required**:
1. Fix workflow to fail when no discoveries made (alerts team)
2. Expand hardcoded list as temporary measure
3. Implement proper dynamic discovery algorithms for sustainable growth

**Expected Outcome**:
- Database grows from 14 → 50-100 KOLs in first week
- Continuous organic growth through network expansion
- No more false positive successes
