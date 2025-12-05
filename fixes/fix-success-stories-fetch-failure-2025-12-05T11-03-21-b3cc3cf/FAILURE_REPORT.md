# Success Stories Fetch Failure Report

**Generated:** 2025-12-05T11:03:21.071Z
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/19960914696)
**Commit:** b3cc3cfb858e6de6d68efba166abfd97848c347a
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

1. Check the [workflow logs](https://github.com/blockchain-web-services/bws-website-front/actions/runs/19960914696)
2. Verify TWITTER_BEARER_TOKEN secret is valid
3. Verify ANTHROPIC_API_KEY secret is valid
4. Test script manually: `node scripts/fetch-success-stories.js`
5. Check manual-success-stories.json format
6. Fix the issue and push to this branch

---
*This is an automated report from the success stories fetch workflow.*