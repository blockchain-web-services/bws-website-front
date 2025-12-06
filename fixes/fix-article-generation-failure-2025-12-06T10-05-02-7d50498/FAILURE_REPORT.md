# Article Generation Failure Report

**Generated:** 2025-12-06T10:05:02.712Z
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/19986903149)
**Commit:** 7d5049869fa70f9ee012be76df37ba2cdc48f91c
**Branch:** master

## Issue Description

The daily article generation workflow failed.

## Possible Causes

1. **Twitter API Issues:**
   - Rate limit exceeded
   - Invalid/expired bearer token
   - API endpoint changes
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
   - Image download failure
   - File write permission issues
   - articles.ts or successStories.ts format changed
   - Product classification errors
   - Article page generation errors

## Action Required

1. Check the [workflow logs](https://github.com/blockchain-web-services/bws-website-front/actions/runs/19986903149)
2. Verify TWITTER_BEARER_TOKEN secret is valid
3. Verify ANTHROPIC_API_KEY secret is valid
4. Test script manually: `node scripts/generate-articles.js`
5. Fix the issue and push to this branch

---
*This is an automated report from the article generation workflow.*