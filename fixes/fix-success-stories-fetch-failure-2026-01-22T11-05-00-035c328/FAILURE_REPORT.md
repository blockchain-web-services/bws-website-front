# Success Stories Fetch Failure Report

**Generated:** 2026-01-22T11:05:00.710Z
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/21246027901)
**Commit:** 035c328b5b003b0fa5eb6f06ad3b35a22639849d
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

1. Check the [workflow logs](https://github.com/blockchain-web-services/bws-website-front/actions/runs/21246027901)
2. Verify TWITTER_BEARER_TOKEN secret is valid
3. Verify ANTHROPIC_API_KEY secret is valid
4. Test script manually: `node scripts/fetch-success-stories.js`
5. Check manual-success-stories.json format
6. Fix the issue and push to this branch

---
*This is an automated report from the success stories fetch workflow.*