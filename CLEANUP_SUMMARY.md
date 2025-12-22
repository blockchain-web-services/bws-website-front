# Script Cleanup Summary - Quick Reference

**Date:** 2025-12-22
**Full Plan:** See `SCRIPT_CLEANUP_PLAN.md` for detailed analysis

---

## TL;DR

- **5 scripts** can be deleted NOW ✅
- **3 scripts** need workflow migration first ⚠️
- **3 utilities** can be removed after migration ⚠️
- **~5,050 lines** of obsolete code total

---

## Phase 1: DELETE NOW (No Dependencies)

✅ **SAFE TO REMOVE** - Not used in any workflows:

```bash
scripts/crawling/production/discover-by-engagement-crawlee.js
scripts/crawling/production/discover-crawlee-direct.js
scripts/crawling/production/discover-product-tweets.js
scripts/crawling/production/fetch-twitter-partnerships.js
scripts/crawling/production/monitor-kol-timelines.js
```

**SDK Replacements:**
- `discover-by-engagement-crawlee-sdk.js` (in kol-discovery-search.yml)
- `discover-crawlee-direct-sdk.js` (in discover-kols-daily.yml)
- `discover-product-tweets-sdk.js` (in discover-product-tweets.yml)
- `fetch-twitter-partnerships-sdk.js` (in fetch-twitter-partnerships.yml)
- `monitor-kol-timelines-sdk.js` (in kol-monitor-timelines.yml)

---

## Phase 2: REQUIRES WORKFLOW UPDATE FIRST

⚠️ **STILL IN USE** - Migrate workflows before deletion:

| Old Script | Workflow Using It | SDK Replacement |
|------------|-------------------|-----------------|
| `evaluate-and-reply-kols.js` | `reply-kols-daily.yml` | `evaluate-and-reply-kols-sdk.js` |
| `reply-to-kol-posts.js` | `kol-reply-cycle.yml` | `reply-to-kol-posts-sdk.js` |
| `reply-to-product-tweets.js` | `reply-to-product-tweets.yml` | `reply-to-product-tweets-sdk.js` |

**Action:** Update 3 workflow files to use `-sdk.js` versions, then monitor for 48 hours before deleting old scripts.

---

## Phase 3: DEPRECATE UTILITIES (After Phase 2)

⚠️ **REMOVE AFTER ALL SCRIPTS MIGRATED:**

```bash
scripts/crawling/utils/twitter-client.js
scripts/crawling/utils/twitter-thread-client.js
scripts/crawling/utils/multi-account-twitter-client.js
```

**Reason:** Replaced by `XTwitterClient` from BWS X SDK

---

## MUST KEEP

### No SDK Alternative (4 scripts)
```
discover-web-unblocker-batch.js    # Uses Crawlee + UnBlocker
discover-with-fallback.js          # Complex fallback logic
generate-weekly-x-post.js          # Content generation pipeline
post-article-content.js            # Article publishing
```

### Infrastructure (Keep All)
- All crawler files (`twitter-crawler*.js`)
- All parser files (`graphql-parser.js`, `html-parser.js`)
- `x-auth-manager.js` (account rotation)
- `multi-account-scraper-client.js` (web scraping)
- All content/workflow utilities

### Tests (Keep All)
- All 23 test scripts
- Include `test-write-methods.js` (SDK validation)

---

## Quick Start Commands

### Verify Phase 1 is Safe
```bash
cd .trees/xai-trackkols

# Check for any workflow references (should return empty)
grep -r "discover-by-engagement-crawlee.js" .github/workflows/
grep -r "discover-crawlee-direct.js" .github/workflows/
grep -r "discover-product-tweets.js" .github/workflows/
grep -r "fetch-twitter-partnerships.js" .github/workflows/
grep -r "monitor-kol-timelines.js" .github/workflows/
```

### Execute Phase 1 Cleanup
```bash
git checkout -b cleanup/remove-obsolete-scripts

git rm scripts/crawling/production/discover-by-engagement-crawlee.js
git rm scripts/crawling/production/discover-crawlee-direct.js
git rm scripts/crawling/production/discover-product-tweets.js
git rm scripts/crawling/production/fetch-twitter-partnerships.js
git rm scripts/crawling/production/monitor-kol-timelines.js

git commit -m "chore: Remove Phase 1 obsolete scripts (~2,100 lines)"
git push origin cleanup/remove-obsolete-scripts
```

---

## Total Impact

| Phase | Files | Lines | Timeline |
|-------|-------|-------|----------|
| Phase 1 | 5 | ~2,100 | This week |
| Phase 2 | 3 | ~1,900 | Next 2 weeks |
| Phase 3 | 3 | ~1,050 | Next month |
| **Total** | **11** | **~5,050** | **1 month** |

---

## Risk Level

- **Phase 1:** 🟢 Very Low (no dependencies)
- **Phase 2:** 🟡 Medium (production workflows, needs monitoring)
- **Phase 3:** 🟢 Low (only after Phase 2 success)

---

**See `SCRIPT_CLEANUP_PLAN.md` for full details, rollback plans, and approval checklist.**
