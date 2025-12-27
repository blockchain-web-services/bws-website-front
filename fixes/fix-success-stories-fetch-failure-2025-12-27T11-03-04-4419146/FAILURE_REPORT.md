# Success Stories Fetch Failure Report

**Generated:** 2025-12-27T11:03:04.206Z
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/20538178935)
**Commit:** 4419146a7446bc207f65f0fa552814c4c3c7c573
**Branch:** master

## Issue Description

The daily success stories fetch workflow failed.

## Possible Causes

1. **Twitter API Issues:**
   - Rate limit exceeded
   - Invalid/expired bearer token
   - API endpoint changes
   - Search query returned no results
   - User @BWSCommunity not found or suspended

2. **Anthropic API Issues:**
   - Rate limit exceeded
   - Invalid/expired API key
   - Model errors or timeouts
   - JSON parsing errors from Claude response

3. **Network Issues:**
   - Connection timeout
   - DNS resolution failure
   - Firewall blocking API access

4. **Script Issues:**
   - Parse error in tweet content
   - Image download failure (size requirements)
   - File write permission issues
   - successStories.ts format changed
   - Product classification errors
   - Manual stories config parse error

## Action Required

1. Check the [workflow logs](https://github.com/blockchain-web-services/bws-website-front/actions/runs/20538178935)
2. Verify TWITTER_BEARER_TOKEN secret is valid
3. Verify ANTHROPIC_API_KEY secret is valid
4. Test script manually: `node scripts/fetch-success-stories.js`
5. Check manual-success-stories.json format
6. Fix the issue and push to this branch

---
*This is an automated report from the success stories fetch workflow.*