# Script Cleanup Plan - Post SDK Migration v1.7.0

**Date:** 2025-12-22
**Status:** Planning Phase - DO NOT IMPLEMENT YET
**Purpose:** Identify obsolete scripts after migrating to BWS X SDK v1.7.0

---

## Executive Summary

After migrating to BWS X SDK v1.7.0, we have **8 duplicate script pairs** (old + SDK versions). Analysis shows:

- ✅ **5 old scripts** can be safely removed NOW (no workflow dependencies)
- ⚠️ **3 old scripts** require workflow migration FIRST (still in active use)
- 🔧 **3 utility files** can be deprecated after full migration
- ✅ **4 production scripts** have no SDK version (must keep)
- ✅ **All crawler/parser utilities** must be kept (web scraping)

**Potential Cleanup:** ~2,000+ lines of obsolete code can be removed in 2 phases

---

## Phase 1: SAFE TO DELETE NOW (No Dependencies)

### Production Scripts with SDK Replacements (5 files)

These old versions are **NOT referenced in any active workflows** and have working SDK replacements:

| Old Script | SDK Replacement | Workflow Status | Lines | Safe to Delete |
|------------|-----------------|-----------------|-------|----------------|
| `discover-by-engagement-crawlee.js` | `discover-by-engagement-crawlee-sdk.js` | SDK version in `kol-discovery-search.yml` | ~400 | ✅ YES |
| `discover-crawlee-direct.js` | `discover-crawlee-direct-sdk.js` | SDK version in `discover-kols-daily.yml` | ~350 | ✅ YES |
| `discover-product-tweets.js` | `discover-product-tweets-sdk.js` | SDK version in `discover-product-tweets.yml` | ~450 | ✅ YES |
| `fetch-twitter-partnerships.js` | `fetch-twitter-partnerships-sdk.js` | SDK version in `fetch-twitter-partnerships.yml` | ~380 | ✅ YES |
| `monitor-kol-timelines.js` | `monitor-kol-timelines-sdk.js` | SDK version in `kol-monitor-timelines.yml` | ~520 | ✅ YES |

**Total:** ~2,100 lines can be removed immediately

**Action Required:**
```bash
# Verify no hidden dependencies first
grep -r "discover-by-engagement-crawlee.js" .github/workflows/
grep -r "discover-crawlee-direct.js" .github/workflows/
grep -r "discover-product-tweets.js" .github/workflows/
grep -r "fetch-twitter-partnerships.js" .github/workflows/
grep -r "monitor-kol-timelines.js" .github/workflows/

# If all return empty, safe to delete:
git rm scripts/crawling/production/discover-by-engagement-crawlee.js
git rm scripts/crawling/production/discover-crawlee-direct.js
git rm scripts/crawling/production/discover-product-tweets.js
git rm scripts/crawling/production/fetch-twitter-partnerships.js
git rm scripts/crawling/production/monitor-kol-timelines.js
```

---

## Phase 2: REQUIRES WORKFLOW MIGRATION FIRST

### Production Scripts Still in Active Use (3 files)

These old versions are **STILL REFERENCED** in active workflows. Must migrate workflows before deletion.

| Old Script | SDK Replacement | Active Workflow | Migration Required |
|------------|-----------------|-----------------|-------------------|
| `evaluate-and-reply-kols.js` | `evaluate-and-reply-kols-sdk.js` | `reply-kols-daily.yml` | ⚠️ Update workflow |
| `reply-to-kol-posts.js` | `reply-to-kol-posts-sdk.js` | `kol-reply-cycle.yml` | ⚠️ Update workflow |
| `reply-to-product-tweets.js` | `reply-to-product-tweets-sdk.js` | `reply-to-product-tweets.yml` | ⚠️ Update workflow |

**Total:** ~1,900 lines (can be removed after workflow migration)

**Required Actions:**

### 1. Update `reply-kols-daily.yml`
```yaml
# BEFORE:
- name: Run KOL Evaluation and Reply
  run: node scripts/crawling/production/evaluate-and-reply-kols.js

# AFTER:
- name: Run KOL Evaluation and Reply (SDK)
  run: node scripts/crawling/production/evaluate-and-reply-kols-sdk.js
```

### 2. Update `kol-reply-cycle.yml`
```yaml
# BEFORE:
- name: Reply to KOL Posts
  run: node scripts/crawling/production/reply-to-kol-posts.js

# AFTER:
- name: Reply to KOL Posts (SDK)
  run: node scripts/crawling/production/reply-to-kol-posts-sdk.js
```

### 3. Update `reply-to-product-tweets.yml`
```yaml
# BEFORE:
- name: Reply to Product Tweets
  run: node scripts/crawling/production/reply-to-product-tweets.js

# AFTER:
- name: Reply to Product Tweets (SDK)
  run: node scripts/crawling/production/reply-to-product-tweets-sdk.js
```

**Testing Plan:**
1. Update one workflow at a time
2. Monitor production runs for 48 hours
3. Verify success metrics match previous runs
4. Only then delete old script version

**After Workflow Migration:**
```bash
# Only after confirming SDK versions work in production
git rm scripts/crawling/production/evaluate-and-reply-kols.js
git rm scripts/crawling/production/reply-to-kol-posts.js
git rm scripts/crawling/production/reply-to-product-tweets.js
```

---

## Phase 3: DEPRECATE OLD UTILITY LIBRARIES

### Twitter Client Utilities (3 files)

After all production scripts migrate to SDK, these become obsolete:

| File | Used By | Purpose | Lines | Action |
|------|---------|---------|-------|--------|
| `utils/twitter-client.js` | Old production scripts | Legacy read/write client | ~450 | ⚠️ Deprecate after Phase 2 |
| `utils/twitter-thread-client.js` | `reply-to-product-tweets.js` (old) | Thread posting | ~280 | ⚠️ Deprecate after Phase 2 |
| `utils/multi-account-twitter-client.js` | Old scripts | Multi-account management | ~320 | ⚠️ Deprecate after Phase 2 |

**Total:** ~1,050 lines

**Current Dependencies Check:**
```bash
# Find all imports of these utilities
grep -r "from.*twitter-client.js" scripts/
grep -r "from.*twitter-thread-client.js" scripts/
grep -r "from.*multi-account-twitter-client.js" scripts/
```

**Expected Results:**
- Should only show old (non-SDK) production scripts
- After Phase 2 completion, all results should be deleted scripts
- Then safe to remove utility files

**Deprecation Steps:**
1. Add deprecation warnings to each file:
   ```javascript
   console.warn('⚠️ DEPRECATED: This utility is replaced by BWS X SDK v1.7.0');
   console.warn('   Use: import { XTwitterClient } from "@blockchain-web-services/bws-x-sdk-node"');
   ```
2. Wait 1 week for any unknown dependencies to surface
3. Delete files if no issues reported

---

## MUST KEEP - No SDK Alternatives

### Production Scripts Without SDK Versions (4 files)

These scripts use specialized functionality not yet in SDK:

| Script | Why Keep | Primary Technology | Can Migrate? |
|--------|----------|-------------------|--------------|
| `discover-web-unblocker-batch.js` | Uses Crawlee + UnBlocker for batch discovery | Crawlee, Web Unblocker | 🔮 Future (needs SDK Crawlee support) |
| `discover-with-fallback.js` | Fallback discovery with web scraping | ScrapFly, fallback chains | 🔮 Future (complex fallback logic) |
| `generate-weekly-x-post.js` | Content generation pipeline | Claude AI, content synthesis | 🔮 Future (needs SDK thread posting) |
| `post-article-content.js` | Article publishing automation | Docs fetching, thread posting | 🔮 Future (needs SDK thread posting) |

**Action:** Keep these until SDK supports their specialized needs

### Web Scraping & Crawler Infrastructure (KEEP ALL)

| Category | Files | Why Keep |
|----------|-------|----------|
| **Crawlers** | `twitter-crawler*.js` (5 files) | Web scraping when API unavailable |
| **Parsers** | `graphql-parser.js`, `html-parser.js` | Parse Twitter's HTML/GraphQL responses |
| **Auth** | `x-auth-manager.js` | Manage crawler account rotation |
| **Scraping** | `multi-account-scraper-client.js` | Core scraping client |
| **Proxies** | `scrapfly-client.js`, `scrapfly-error-handler.js` | Proxy services |

**Reason:** SDK hybrid mode uses these for crawler-based operations

### Core Utilities (KEEP ALL)

| Category | Files | Why Keep |
|----------|-------|----------|
| **API Tracking** | `api-call-tracker.js`, `api-usage-logger.js` | Monitor usage/costs |
| **Logging** | `execution-logger.js` | Track script performance |
| **Content** | `claude-client.js`, `thread-generator.js`, `docs-fetcher.js` | AI/content generation |
| **KOL** | `kol-utils.js`, `amplified-search.js`, `search-based-discovery.js` | KOL management |
| **Workflow** | `workflow-updater.js`, `zapier-webhook.js`, `schedule-randomizer.js` | GitHub Actions integration |

**Reason:** Used by SDK scripts for business logic

---

## Test Scripts Analysis

### Test Scripts (DO NOT DELETE)

**Location:** `scripts/test*.js` (23 files)

**Keep All Test Scripts Because:**
- Validate SDK functionality across versions
- Test authentication and credentials
- Verify proxy configurations
- Debug production issues
- Document expected behavior

**Examples of Critical Tests:**
- `test-bws-x-sdk.js` - SDK v1.7.0 validation
- `test-write-methods.js` - Write operation validation (created during migration)
- `test-minimal-auth.js` - Auth debugging
- `test-account-status.js` - Account health checks

**Action:** Keep all test scripts, add more as SDK evolves

---

## Summary Table: Deletion Candidates

| Phase | Files | Total Lines | Status | Dependencies |
|-------|-------|-------------|--------|--------------|
| **Phase 1** | 5 production scripts | ~2,100 | ✅ Safe to delete NOW | None |
| **Phase 2** | 3 production scripts | ~1,900 | ⚠️ Migrate workflows first | 3 workflows |
| **Phase 3** | 3 utility libraries | ~1,050 | ⚠️ After Phase 2 complete | Phase 2 scripts |
| **Total** | **11 files** | **~5,050 lines** | 2-phase cleanup | Workflow updates needed |

---

## Recommended Action Plan

### Immediate (This Week)

**1. Verify Phase 1 Safety**
```bash
# Run these checks to confirm no hidden dependencies
cd /mnt/x/Git/blockchain-web-services/bws/bws-front/bws-website-front/.trees/xai-trackkols

# Check workflow references
grep -r "discover-by-engagement-crawlee.js" .github/workflows/
grep -r "discover-crawlee-direct.js" .github/workflows/
grep -r "discover-product-tweets.js" .github/workflows/
grep -r "fetch-twitter-partnerships.js" .github/workflows/
grep -r "monitor-kol-timelines.js" .github/workflows/

# Check any script imports
grep -r "discover-by-engagement-crawlee.js" scripts/
grep -r "discover-crawlee-direct.js" scripts/
grep -r "discover-product-tweets.js" scripts/
grep -r "fetch-twitter-partnerships.js" scripts/
grep -r "monitor-kol-timelines.js" scripts/

# If all return empty or only old scripts, SAFE TO DELETE
```

**2. Execute Phase 1 Cleanup**
```bash
# Create cleanup branch
git checkout -b cleanup/remove-obsolete-scripts

# Delete Phase 1 scripts
git rm scripts/crawling/production/discover-by-engagement-crawlee.js
git rm scripts/crawling/production/discover-crawlee-direct.js
git rm scripts/crawling/production/discover-product-tweets.js
git rm scripts/crawling/production/fetch-twitter-partnerships.js
git rm scripts/crawling/production/monitor-kol-timelines.js

# Commit
git commit -m "chore: Remove obsolete scripts replaced by SDK versions

Phase 1 cleanup: Removed 5 production scripts that have working SDK
replacements and are no longer referenced in any workflows.

Scripts removed:
- discover-by-engagement-crawlee.js → using -sdk.js version
- discover-crawlee-direct.js → using -sdk.js version
- discover-product-tweets.js → using -sdk.js version
- fetch-twitter-partnerships.js → using -sdk.js version
- monitor-kol-timelines.js → using -sdk.js version

Total: ~2,100 lines of obsolete code removed"

# Push and merge
git push origin cleanup/remove-obsolete-scripts
# Create PR, review, merge
```

### Short Term (Next 2 Weeks)

**3. Migrate Workflows (Phase 2 Prerequisite)**
```bash
# Update workflows one at a time
git checkout -b migrate/workflows-to-sdk

# Edit each workflow file:
# - .github/workflows/reply-kols-daily.yml
# - .github/workflows/kol-reply-cycle.yml
# - .github/workflows/reply-to-product-tweets.yml

# Change script references from .js to -sdk.js

git commit -m "feat: Migrate remaining workflows to SDK scripts

Updated 3 workflows to use SDK versions:
- reply-kols-daily.yml → evaluate-and-reply-kols-sdk.js
- kol-reply-cycle.yml → reply-to-kol-posts-sdk.js
- reply-to-product-tweets.yml → reply-to-product-tweets-sdk.js

This completes the SDK migration for all production workflows."

git push origin migrate/workflows-to-sdk
# Create PR, test in production for 48 hours
```

**4. Monitor Production**
- Watch workflow runs for 48 hours
- Compare metrics with old scripts
- Verify Zapier notifications
- Check error rates

**5. Execute Phase 2 Cleanup (After 48h Success)**
```bash
git checkout -b cleanup/remove-phase2-scripts

git rm scripts/crawling/production/evaluate-and-reply-kols.js
git rm scripts/crawling/production/reply-to-kol-posts.js
git rm scripts/crawling/production/reply-to-product-tweets.js

git commit -m "chore: Remove Phase 2 obsolete scripts

All workflows now using SDK versions. Removed old scripts:
- evaluate-and-reply-kols.js
- reply-to-kol-posts.js
- reply-to-product-tweets.js

Total: ~1,900 lines removed"
```

### Medium Term (Next Month)

**6. Deprecate Old Utilities (Phase 3)**
```bash
# Add deprecation warnings first
# Edit these files to add console.warn at top of main functions:
# - scripts/crawling/utils/twitter-client.js
# - scripts/crawling/utils/twitter-thread-client.js
# - scripts/crawling/utils/multi-account-twitter-client.js

git commit -m "chore: Add deprecation warnings to old Twitter utilities"

# Wait 1 week, monitor logs for any unexpected usage

# Then remove
git rm scripts/crawling/utils/twitter-client.js
git rm scripts/crawling/utils/twitter-thread-client.js
git rm scripts/crawling/utils/multi-account-twitter-client.js

git commit -m "chore: Remove deprecated Twitter utility libraries

All scripts now use BWS X SDK. Removed utilities:
- twitter-client.js (replaced by XTwitterClient)
- twitter-thread-client.js (replaced by SDK postReply)
- multi-account-twitter-client.js (SDK handles multi-account)

Total: ~1,050 lines removed"
```

---

## Risk Assessment

### Low Risk (Phase 1)
✅ Scripts not in any workflows
✅ SDK versions tested and working
✅ No dependencies found
**Risk Level:** 🟢 Very Low

### Medium Risk (Phase 2)
⚠️ Active production workflows
⚠️ Need 48h monitoring period
⚠️ Rollback plan required
**Risk Level:** 🟡 Medium

**Mitigation:**
- Keep old scripts until SDK versions proven stable
- Monitor metrics for 48 hours
- Have rollback plan ready (revert workflow changes)
- Test in staging first if available

### Low Risk (Phase 3)
✅ Only after Phase 2 success
✅ Deprecation warnings added first
✅ 1-week grace period
**Risk Level:** 🟢 Low

---

## Rollback Plan

If SDK versions fail in production:

```bash
# Revert workflow changes
git revert <commit-hash>
git push origin master

# Old scripts still available in git history
git checkout <commit-before-deletion> -- scripts/crawling/production/[script-name].js
git commit -m "rollback: Restore [script-name].js due to issues"
```

---

## Expected Outcomes

### Code Reduction
- **Phase 1:** -2,100 lines (immediate)
- **Phase 2:** -1,900 lines (after workflow migration)
- **Phase 3:** -1,050 lines (after full migration)
- **Total:** ~5,050 lines removed (~15% of codebase)

### Maintenance Benefits
- Single source of truth (SDK only)
- Reduced test surface area
- Clearer onboarding for new developers
- Easier dependency management
- Better cost tracking (SDK includes usage tracking)

### Performance Benefits
- SDK uses hybrid mode (crawler + API fallback)
- Automatic account rotation
- Better rate limit handling
- Consistent error handling across all scripts

---

## Questions to Answer Before Proceeding

1. ✅ **Are all SDK scripts tested?** YES - All tested successfully
2. ✅ **Do workflows use SDK versions?** PARTIAL - 5 of 8 migrated
3. ❓ **Any custom logic in old scripts?** NEED TO VERIFY - Compare implementations
4. ❓ **Are there hidden dependencies?** NEED TO CHECK - Run grep commands
5. ❓ **Is rollback plan acceptable?** NEED APPROVAL - Review with team

---

## Approval Checklist

Before executing cleanup:

- [ ] Phase 1 dependency check completed (no workflow/script references)
- [ ] Old scripts vs SDK scripts comparison done (no missing functionality)
- [ ] Rollback plan reviewed and approved
- [ ] Phase 2 workflow migration tested in staging (if available)
- [ ] 48-hour monitoring plan established
- [ ] Team notified of cleanup timeline

---

## Notes

- This cleanup is NON-URGENT. SDK and old versions can coexist safely.
- Prioritize workflow migration success over quick cleanup
- Document any differences found between old and SDK versions
- Keep git history - never force delete commits
- Consider archiving old scripts in a separate branch before deletion

---

**Last Updated:** 2025-12-22
**Next Review:** After Phase 1 completion
**Owner:** SDK Migration Team
