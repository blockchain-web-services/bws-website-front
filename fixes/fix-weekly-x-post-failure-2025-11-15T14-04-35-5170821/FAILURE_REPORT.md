# Weekly X Post Failure Report

**Generated:** 2025-11-15T14:04:35.572Z
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/19390892953)
**Commit:** 51708213bdd62c264cf6f56ce0a60b7e2061c615
**Branch:** master

## Issue Description

The weekly X post workflow failed.

## Possible Causes

1. **GitHub API Issues:**
   - Rate limit exceeded
   - Token permissions insufficient
   - Repository or branch not found

2. **Twitter API Issues:**
   - Invalid OAuth credentials
   - Rate limit exceeded
   - Account suspended
   - Wrong account authenticated

3. **Anthropic API Issues:**
   - Invalid API key
   - Rate limit exceeded
   - Model errors or timeouts

4. **Script Issues:**
   - Repo configuration errors
   - State file corruption
   - Network timeout

## Action Required

1. Check [workflow logs](https://github.com/blockchain-web-services/bws-website-front/actions/runs/19390892953)
2. Verify secrets:
   - PAT_GITHUB_ACTIONS (for cross-repo access)
   - TWITTER_API_KEY
   - TWITTER_API_SECRET
   - TWITTER_ACCESS_TOKEN
   - TWITTER_ACCESS_SECRET
   - ANTHROPIC_API_KEY
3. Test locally: `DRY_RUN=true node scripts/generate-weekly-x-post.js`
4. Fix and push to this branch

---
*This is an automated report from the weekly X post workflow.*