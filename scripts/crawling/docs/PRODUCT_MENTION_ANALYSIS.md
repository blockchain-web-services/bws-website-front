# Product Mention Frequency Analysis
**Generated**: 2025-12-01
**Analysis Period**: November 4-15, 2025 + December 1, 2025

## Executive Summary

**Your concern is PARTIALLY VALID**: X Bot appears frequently (11 total mentions), but the system IS designed to rotate products and prevent consecutive duplicates. The issue is that product rotation state doesn't persist between workflow runs, causing the selection algorithm to reset.

---

## Product Mention Statistics

### Overall Distribution (All Attempts)

| Product | Mentions | Percentage | Category |
|---------|----------|------------|----------|
| **Fan Game Cube** | **12** | **30.8%** | Priority Product (60% selection chance) |
| **X Bot** | **11** | **28.2%** | Priority Product (60% selection chance) |
| **Blockchain Hash** | **6** | **15.4%** | Other Product (40% selection chance) |
| **Blockchain Badges** | **4** | **10.3%** | Other Product (40% selection chance) |
| **ESG Credits** | **2** | **5.1%** | Other Product (40% selection chance) |
| **Blockchain Save** | **2** | **5.1%** | Other Product (40% selection chance) |
| **NFT.zK** | **1** | **2.6%** | Other Product (40% selection chance) |
| **BWS IPFS** | **1** | **2.6%** | Other Product (40% selection chance) |
| **TOTAL** | **39** | **100%** | - |

### Successfully Posted Replies (Nov 4-6)

| Date | Product | Tweet ID | Status |
|------|---------|----------|--------|
| Nov 4 | Fan Game Cube | 1985612564999651750 | ✅ Posted |
| Nov 5 | X Bot | 1986044379979821112 | ✅ Posted |
| Nov 5 | Blockchain Badges | 1986095726900760612 | ✅ Posted |
| Nov 5 | X Bot | 1986178535501808034 | ✅ Posted |
| Nov 6 | Fan Game Cube | 1986323364810543378 | ✅ Posted |

**Analysis**: 5 successful posts showed good variety (2 Fan Game Cube, 2 X Bot, 1 Blockchain Badges)

### Recent Success (Dec 1 - with Fallback)

| Featured Product | Status |
|------------------|--------|
| Fan Game Cube | ✅ Reply posted (1995572113151840328) |
| X Bot | ✅ Reply posted (1995572206152118459) |
| BWS IPFS | ✅ Reply posted (1995572323311628477) |

**Analysis**: Dec 1 showed PERFECT diversity - 3 different products in 3 consecutive replies!

---

## How Product Selection Works

### Algorithm Configuration

```javascript
// Priority Products (60% selection chance)
priorityProducts: ['X Bot', 'Fan Game Cube']

// Other Products (40% selection chance)
otherProducts: [
  'Blockchain Hash',
  'NFT.zK',
  'Blockchain Badges',
  'ESG Credits',
  'BWS IPFS',
  'Blockchain Save'
]
```

### Selection Logic

1. **60/40 Priority Split**:
   - 60% of replies feature priority products (X Bot or Fan Game Cube)
   - 40% of replies feature other products
   - This explains why X Bot + Fan Game Cube = ~59% of mentions

2. **Consecutive Prevention**:
   - Algorithm checks `rotation.lastProductUsed`
   - If same as previous, skips to next product in rotation
   - **PROBLEM**: This state doesn't persist between workflow runs!

3. **Rotation Indices**:
   - `priorityIndex`: Cycles through [X Bot, Fan Game Cube]
   - `otherIndex`: Cycles through other 6 products
   - Both reset to 0 at start of each workflow run

---

## Root Cause Analysis

### Issue #1: State Not Persisted

**Current Behavior**:
```
Run 1 (09:00 UTC):
  - Rotation state initialized: lastProductUsed = null
  - Reply 1: X Bot (priorityIndex=0)
  - Reply 2: Fan Game Cube (priorityIndex=1)
  - State discarded at end of run

Run 2 (21:00 UTC):
  - Rotation state re-initialized: lastProductUsed = null
  - Reply 1: X Bot (priorityIndex=0) ❌ Same as Run 1
  - Reply 2: Fan Game Cube (priorityIndex=1) ❌ Same as Run 1
```

**What Should Happen**:
```
Run 1 (09:00 UTC):
  - Load persisted state or initialize if first run
  - Reply 1: X Bot (priorityIndex=0)
  - Reply 2: Fan Game Cube (priorityIndex=1)
  - Save state: {lastProductUsed: "Fan Game Cube", priorityIndex: 0, otherIndex: 0}

Run 2 (21:00 UTC):
  - Load state: {lastProductUsed: "Fan Game Cube", ...}
  - Reply 1: Blockchain Hash (otherIndex=0, 40% turn)
  - Reply 2: X Bot (priorityIndex=0, different from last)
  - Save updated state
```

### Issue #2: Small Pool of Priority Products

With only 2 priority products (X Bot, Fan Game Cube) selected 60% of the time:
- They will naturally dominate the mentions
- 60% × 50% each = 30% each product
- This matches observed data: Fan Game Cube (30.8%), X Bot (28.2%)

---

## Recommendations

### Option 1: Persist Rotation State (Recommended)

**Modify**: `scripts/crawling/data/engaging-posts.json` to include rotation state

```json
{
  "posts": [...],
  "productRotation": {
    "lastProductUsed": "Fan Game Cube",
    "priorityIndex": 0,
    "otherIndex": 2,
    "positioningPhraseIndex": 1,
    "replyCount": 15
  }
}
```

**Implementation**:
1. Load rotation state at script start from `engaging-posts.json`
2. Use existing `getNextFeaturedProducts()` logic
3. Save rotation state to `engaging-posts.json` after each reply
4. Next run loads state and continues rotation

**Benefits**:
- ✅ True rotation across workflow runs
- ✅ Prevents same product starting each run
- ✅ Maintains existing algorithm logic
- ✅ Minimal code changes

### Option 2: Expand Priority Products List

Add 1-2 more products to priority list to improve diversity:

```javascript
priorityProducts: ['X Bot', 'Fan Game Cube', 'Blockchain Hash', 'Blockchain Badges']
```

**Effect**: Each priority product gets ~15% instead of ~30%

### Option 3: Adjust Priority Ratio

Reduce priority product selection from 60% to 40%:

```javascript
const usePriority = (rotation.replyCount % 5) < 2; // 2 out of 5 = 40%
```

**Effect**: More variety from "other products" pool

### Option 4: Combination Approach

1. Persist rotation state (Option 1)
2. Add Blockchain Hash to priority products
3. Keep 60/40 ratio

**Result**: 3 priority products at 60% = ~20% each, better distribution

---

## Validation: Recent Success

The Dec 1 fallback test showed PERFECT diversity without any changes:

```
Reply 1: Fan Game Cube
Reply 2: X Bot
Reply 3: BWS IPFS
```

This proves the algorithm DOES work within a single run. The issue is state reset between runs.

---

## Conclusion

**Is X Bot over-mentioned?**
- ✅ Yes, at 28.2% of attempts
- ❌ But it's working as designed (priority product with 60% selection chance)

**Should we fix it?**
- ✅ Yes - persist rotation state to maintain diversity across runs
- ✅ Consider expanding priority products to 3-4 items
- ⚠️  Current algorithm works fine WITHIN a single run (proven Dec 1)

**Next Steps**:
1. **HIGHEST PRIORITY**: Implement Option 1 (persist rotation state in engaging-posts.json)
2. Consider Option 4 (add Blockchain Hash to priority products)
3. Monitor distribution after changes

---

## Technical Implementation Notes

### Files to Modify

1. **`scripts/crawling/production/reply-to-kol-posts.js`**:
   - Load `productRotation` from `engaging-posts.json` at script start
   - Pass to `getNextFeaturedProducts()`
   - Save updated `productRotation` back to `engaging-posts.json` after processing

2. **`scripts/crawling/data/engaging-posts.json`**:
   - Add `productRotation` field alongside `posts` array
   - Initialize with default values if missing

### Sample Code

```javascript
// At script start (after loading engaging-posts.json)
if (!engagingPostsData.productRotation) {
  engagingPostsData.productRotation = {
    priorityProducts: ['X Bot', 'Fan Game Cube'],
    otherProducts: ['Blockchain Hash', 'NFT.zK', 'Blockchain Badges', 'ESG Credits', 'BWS IPFS', 'Blockchain Save'],
    priorityIndex: 0,
    otherIndex: 0,
    lastProductUsed: null,
    positioningPhraseIndex: 0,
    replyCount: 0
  };
}

// After each successful reply
await saveEngagingPosts(engagingPostsData); // Saves both posts and productRotation
```
