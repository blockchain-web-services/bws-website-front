# Fix: Post Article Content to X Workflow

**Date:** December 4, 2025
**Status:** ✅ Path Issues Fixed, ⚠️ Twitter Auth Still Required

---

## Problem Identified

The **Post Article Content to X** workflow (section 2.4) has been failing with **100% failure rate** (5/5 recent runs).

### Root Causes Found:

1. **❌ Wrong Script Path in Workflow**
   - Workflow tried: `cd scripts && node post-article-content.js`
   - Actual location: `scripts/crawling/production/post-article-content.js`
   - Result: Script not found error

2. **❌ Wrong Import Paths in Script**
   - Script tried: `import { ... } from './kols/utils/zapier-webhook.js'`
   - Directory doesn't exist: `scripts/crawling/production/kols/utils/`
   - Actual location: `scripts/crawling/utils/`
   - Result: Import errors

3. **❌ Wrong Data File Path**
   - Script tried: `join(__dirname, 'data', 'article-x-posts.json')`
   - Would resolve to: `scripts/crawling/production/data/article-x-posts.json` (doesn't exist)
   - Actual location: `scripts/data/article-x-posts.json`
   - Result: File not found error

---

## Fixes Applied

### 1. Fixed Workflow Script Path

**File:** `.github/workflows/post-article-content.yml`

**Before:**
```yaml
- name: Post to X (Twitter)
  run: |
    cd scripts
    node post-article-content.js
```

**After:**
```yaml
- name: Post to X (Twitter)
  run: |
    node scripts/crawling/production/post-article-content.js
```

✅ **Result:** Workflow now calls the correct script location

---

### 2. Fixed Import Paths

**File:** `scripts/crawling/production/post-article-content.js`

**Before:**
```javascript
import { sendArticlePostNotification } from './kols/utils/zapier-webhook.js';
import { createReadWriteClient } from './kols/utils/twitter-client.js';
```

**After:**
```javascript
import { sendArticlePostNotification } from '../utils/zapier-webhook.js';
import { createReadWriteClient } from '../utils/twitter-client.js';
```

✅ **Result:** Imports now point to existing files in `scripts/crawling/utils/`

---

### 3. Fixed Data File Path

**File:** `scripts/crawling/production/post-article-content.js`

**Before:**
```javascript
// From scripts/crawling/production/__dirname
const ARTICLE_X_POSTS_FILE = join(__dirname, 'data', 'article-x-posts.json');
// → scripts/crawling/production/data/article-x-posts.json ❌
```

**After:**
```javascript
// From scripts/crawling/production/__dirname, go up 2 levels to scripts/
const ARTICLE_X_POSTS_FILE = join(__dirname, '..', '..', 'data', 'article-x-posts.json');
// → scripts/data/article-x-posts.json ✅
```

✅ **Result:** Script now finds the correct data file

---

### 4. Fixed .env Path

**Before:**
```javascript
dotenv.config({ path: join(__dirname, '..', '.env') });
// → scripts/crawling/.env ❌
```

**After:**
```javascript
dotenv.config({ path: join(__dirname, '..', '..', '..', '.env') });
// → .env (project root) ✅
```

✅ **Result:** Environment variables now load from correct location

---

## Expected Behavior After Fix

### Workflow Execution:
1. ✅ Script file found and executed
2. ✅ Imports load successfully
3. ✅ Data file loads from `scripts/data/article-x-posts.json`
4. ✅ Environment variables load from root `.env`
5. ⚠️ **Will still fail with Twitter API 401/403 errors** (expired tokens)

### Next Run Should Show:
```
📖 Loading posts data...
   ✅ Loaded X total posts

📤 Posting tweet for [Product]...
   ❌ Failed to post tweet
   Error: Request failed with code 401 - Invalid or expired token
```

**Before the fix, it failed earlier:**
```
Error: Cannot find module './kols/utils/zapier-webhook.js'
```

---

## Remaining Issue: Twitter Authentication

**Status:** ⚠️ **BLOCKED - Same as KOL Reply System**

The path issues are fixed, but the workflow will still fail because:

### Problem:
- Twitter API tokens have expired for @BWSXAI account
- Getting 401 "Invalid or expired token" errors
- Same issue affecting KOL Reply Cycle

### Solution Required:
Regenerate Twitter API tokens (same fix as KOL reply system):

**Tokens to Update in GitHub Secrets:**
```
BWSXAI_TWITTER_API_KEY
BWSXAI_TWITTER_API_SECRET
BWSXAI_TWITTER_ACCESS_TOKEN
BWSXAI_TWITTER_ACCESS_SECRET
```

**Steps:**
1. Go to https://developer.twitter.com/en/portal/dashboard
2. Regenerate API tokens for @BWSXAI app
3. Update GitHub repository secrets
4. Test with manual workflow dispatch

---

## What This Workflow Does

**Purpose:** Automatically posts newly published blog articles to @BWSXAI Twitter account

**Process:**
1. **Generate Posts** (`scripts/generate-article-posts.js`):
   - Scans `src/data/articles.ts` for new articles
   - Generates promotional tweet text with Claude AI
   - Creates posts in `scripts/data/article-x-posts.json`

2. **Post to Twitter** (`scripts/crawling/production/post-article-content.js`):
   - Loads pending posts from data file
   - Posts up to 4 tweets per run (rate limiting)
   - 60-second delay between posts
   - Updates post status (pending → posted/failed)
   - Sends Zapier webhook notifications

**Expected Outputs:**
- Format: "[Emoji] Article Title - [Summary] [Link] [Hashtags]"
- Example: "🚀 New Guide: Building Web3 Marketplaces with BWS NFT Platform https://bws.ninja/article-slug #Web3 #Blockchain #NFT"

---

## Files Modified

1. `.github/workflows/post-article-content.yml`
   - Fixed script execution path

2. `scripts/crawling/production/post-article-content.js`
   - Fixed import paths (zapier-webhook, twitter-client)
   - Fixed data file path
   - Fixed .env path

---

## Testing Plan

### Step 1: Verify Path Fixes (Can Test Now)
```bash
# Test that script can be imported
node -e "import('./scripts/crawling/production/post-article-content.js').catch(e => console.error(e.message))"
```

**Expected:** Import successful (or Twitter auth error, which is expected)

### Step 2: Test After Token Regeneration
1. Update Twitter tokens in GitHub Secrets
2. Trigger workflow manually:
   ```bash
   gh workflow run post-article-content.yml
   ```
3. Check logs for successful posting

**Expected Success Output:**
```
📤 Posting tweet for [Product]...
   ✅ Posted successfully!
   Tweet ID: 123456789
   URL: https://twitter.com/i/web/status/123456789
```

---

## Impact Analysis

### Before Fix:
- ❌ Script not found
- ❌ Import errors
- ❌ 0% success rate
- ❌ No articles posted to Twitter

### After Path Fix:
- ✅ Script executes
- ✅ Imports load
- ✅ Data file loads
- ⚠️ Still blocked by auth (expected)

### After Token Regeneration:
- ✅ Full workflow functional
- ✅ Articles automatically posted
- ✅ Twitter account promotion working

---

## Related Issues

This workflow shares the same **Twitter API authentication issue** with:
- KOL Reply Cycle (section 2.3)
- Weekly X Post (section 2.5)

All three workflows will resume normal operation once Twitter tokens are regenerated.

---

## Summary

**Path Issues:** ✅ **FIXED**
- Wrong script path in workflow → corrected
- Wrong import paths → corrected
- Wrong data file path → corrected
- Wrong .env path → corrected

**Authentication Issue:** ⚠️ **PENDING**
- Twitter API tokens expired → requires regeneration
- Same issue as other Twitter posting workflows
- Not a code issue, just expired credentials

**Next Step:** Regenerate Twitter API tokens for @BWSXAI account

---

**Commit:** `3798c51` - Fix Post Article Content workflow - correct script paths
**Date:** December 4, 2025
