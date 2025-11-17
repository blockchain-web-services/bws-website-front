# Multi-Account Twitter Setup Guide

**Date:** 2025-11-14
**Purpose:** Step-by-step guide to set up multiple Twitter accounts for decoupled search/posting

---

## Overview

This guide will help you set up 2-3 Twitter accounts for searches, keeping @BWSXAI dedicated only for posting replies.

**Goal:** Reduce @BWSXAI API activity from 100+ calls → 1 call per run

**Time Required:** 2-3 hours total

---

## Phase 1: Create Twitter Accounts (1 hour)

### Account 1: SEARCH1

1. **Create Twitter account:**
   - Email: Use `your-email+search1@gmail.com` (Gmail alias)
   - Or use separate email provider
   - Username: Choose something neutral (e.g., `dev_monitor_1`)
   - Password: Generate strong password, save in password manager

2. **Set up basic profile:**
   - Profile photo: Generic image (not suspicious)
   - Bio: "Developer | API monitoring"
   - Follow 5-10 accounts (mix of tech/crypto)
   - Like 2-3 tweets
   - **Purpose:** Look like normal account, not bot

3. **Enable 2FA:**
   - Settings → Security → Two-factor authentication
   - Choose Authenticator app
   - Save backup codes

### Account 2: SEARCH2

Repeat same steps as SEARCH1:
- Email: `your-email+search2@gmail.com`
- Username: `dev_monitor_2`
- Different profile photo
- Follow different accounts

### Account 3: SEARCH3 (Optional)

Third account provides better load distribution:
- Email: `your-email+search3@gmail.com`
- Username: `dev_monitor_3`

**Note:** Start with 2 accounts (SEARCH1 + SEARCH2). Add SEARCH3 later if needed.

---

## Phase 2: Apply for API Access (30 minutes)

For each search account:

### 1. Go to Twitter Developer Portal

Visit: https://developer.twitter.com/en/portal/dashboard

### 2. Sign up for Developer Account

- Click "Sign up" or "Apply"
- Choose: **"Hobbyist"** → **"Exploring the API"**

### 3. Fill out application:

**What country do you live in?**
- Your country

**What would you like us to call you?**
- Your name or company name

**What's your use case?**
```
Developer monitoring and research tool for tracking public Twitter activity
and analyzing engagement metrics for research purposes. Read-only access
to public tweets and user profiles for non-commercial research.
```

**Will you make Twitter content or derived information available to a government entity?**
- No

**How will you use the Twitter API?**
```
1. Searching public tweets by keyword and username
2. Retrieving user profile information (public data only)
3. Analyzing tweet engagement metrics (likes, retweets, replies)
4. No data storage beyond temporary caching
5. All data access is read-only for research purposes
6. Estimated API usage: 100-200 requests per day
```

### 4. Accept Terms and Submit

- Read and accept Developer Agreement
- Click "Submit Application"
- Usually instant approval for Free tier

### 5. Create App

After approval:
- Click "Create App"
- App name: `Search Monitor 1` (or `Search Monitor 2`, etc.)
- App description: "API monitoring and research tool"
- Website URL: Your GitHub profile or personal site
- Callback URL: Leave blank (not needed)

### 6. Generate API Keys

**App Settings → Keys and Tokens:**

1. **API Key and Secret:**
   - Click "Generate" under "Consumer Keys"
   - Save both:
     - API Key (Consumer Key)
     - API Key Secret (Consumer Secret)

2. **Access Token and Secret:**
   - Click "Generate" under "Authentication Tokens"
   - Access Level: **Read and Write** (required for OAuth 1.0a)
   - Save both:
     - Access Token
     - Access Token Secret

**Important:** Save all 4 credentials securely. You'll need them in the next step.

---

## Phase 3: Configure GitHub Secrets (30 minutes)

### 1. Go to Repository Settings

1. Navigate to: `https://github.com/YOUR_ORG/YOUR_REPO/settings/secrets/actions`
2. Click "New repository secret"

### 2. Add SEARCH1 Credentials

Add these 4 secrets:

**SEARCH1_API_KEY**
```
Value: <API Key from SEARCH1 app>
```

**SEARCH1_API_SECRET**
```
Value: <API Key Secret from SEARCH1 app>
```

**SEARCH1_ACCESS_TOKEN**
```
Value: <Access Token from SEARCH1 app>
```

**SEARCH1_ACCESS_SECRET**
```
Value: <Access Token Secret from SEARCH1 app>
```

### 3. Add SEARCH2 Credentials

Repeat for SEARCH2:
- `SEARCH2_API_KEY`
- `SEARCH2_API_SECRET`
- `SEARCH2_ACCESS_TOKEN`
- `SEARCH2_ACCESS_SECRET`

### 4. Add SEARCH3 Credentials (Optional)

If you created a third account:
- `SEARCH3_API_KEY`
- `SEARCH3_API_SECRET`
- `SEARCH3_ACCESS_TOKEN`
- `SEARCH3_ACCESS_SECRET`

### 5. Verify Existing Secrets

Ensure these are still present:
- `BWSXAI_TWITTER_API_KEY`
- `BWSXAI_TWITTER_API_SECRET`
- `BWSXAI_TWITTER_ACCESS_TOKEN`
- `BWSXAI_TWITTER_ACCESS_SECRET`
- `OXYLABS_USERNAME`
- `OXYLABS_PASSWORD`
- `ANTHROPIC_API_KEY`

---

## Phase 4: Update Workflow (15 minutes)

The workflow file needs to include the new environment variables.

### Edit `.github/workflows/kol-reply-cycle.yml`:

Find the `env:` section in the "Run reply generation and posting" step and add the search account credentials:

```yaml
- name: Run reply generation and posting
  id: reply
  env:
    # Existing credentials
    BWSXAI_TWITTER_BEARER_TOKEN: ${{ secrets.BWSXAI_TWITTER_BEARER_TOKEN }}
    BWSXAI_TWITTER_API_KEY: ${{ secrets.BWSXAI_TWITTER_API_KEY }}
    BWSXAI_TWITTER_API_SECRET: ${{ secrets.BWSXAI_TWITTER_API_SECRET }}
    BWSXAI_TWITTER_ACCESS_TOKEN: ${{ secrets.BWSXAI_TWITTER_ACCESS_TOKEN }}
    BWSXAI_TWITTER_ACCESS_SECRET: ${{ secrets.BWSXAI_TWITTER_ACCESS_SECRET }}
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
    PAT_REPOS_AND_WORKFLOW: ${{ secrets.PAT_REPOS_AND_WORKFLOW }}
    OXYLABS_USERNAME: ${{ secrets.OXYLABS_USERNAME }}
    OXYLABS_PASSWORD: ${{ secrets.OXYLABS_PASSWORD }}

    # NEW: Search account credentials
    SEARCH1_API_KEY: ${{ secrets.SEARCH1_API_KEY }}
    SEARCH1_API_SECRET: ${{ secrets.SEARCH1_API_SECRET }}
    SEARCH1_ACCESS_TOKEN: ${{ secrets.SEARCH1_ACCESS_TOKEN }}
    SEARCH1_ACCESS_SECRET: ${{ secrets.SEARCH1_ACCESS_SECRET }}
    SEARCH2_API_KEY: ${{ secrets.SEARCH2_API_KEY }}
    SEARCH2_API_SECRET: ${{ secrets.SEARCH2_API_SECRET }}
    SEARCH2_ACCESS_TOKEN: ${{ secrets.SEARCH2_ACCESS_TOKEN }}
    SEARCH2_ACCESS_SECRET: ${{ secrets.SEARCH2_ACCESS_SECRET }}
    # Optional: SEARCH3 credentials
    SEARCH3_API_KEY: ${{ secrets.SEARCH3_API_KEY }}
    SEARCH3_API_SECRET: ${{ secrets.SEARCH3_API_SECRET }}
    SEARCH3_ACCESS_TOKEN: ${{ secrets.SEARCH3_ACCESS_TOKEN }}
    SEARCH3_ACCESS_SECRET: ${{ secrets.SEARCH3_ACCESS_SECRET }}

    CI: true
    GITHUB_ACTIONS: true
```

---

## Phase 5: Update Production Script (30 minutes)

### Option A: Minimal Changes (Recommended)

Update `scripts/kols/evaluate-and-reply-kols.js`:

1. **Change import at the top:**

```javascript
// OLD:
import twitterClient from './utils/twitter-client.js';

// NEW:
import multiAccountClient from './utils/multi-account-twitter-client.js';
```

2. **Remove old client initialization:**

```javascript
// OLD - Remove these lines:
const readClient = twitterClient.createReadWriteClient();

// NEW - Add this at the start of main():
multiAccountClient.initializeMultiAccountClient();
```

3. **Update API calls:**

```javascript
// OLD:
const user = await twitterClient.getUserByUsername(readClient, kol.username);
const tweets = await twitterClient.searchTweets(readClient, query, options);
const result = await twitterClient.postReply(writeClient, tweetId, replyText);

// NEW:
const user = await multiAccountClient.getUserByUsername(kol.username);
const tweets = await multiAccountClient.searchTweets(query, options);
const result = await multiAccountClient.postReply(tweetId, replyText);
```

4. **Add usage summary at the end:**

```javascript
// At the end of main(), before exit:
multiAccountClient.printMultiAccountUsageSummary();
```

### Key Changes Summary:

1. Import multi-account client instead of regular client
2. Initialize multi-account client at start
3. Remove client parameters from function calls (client selection is automatic)
4. Print usage summary at end

---

## Phase 6: Testing (1 hour)

### 1. Test Locally First

```bash
# Set environment variables
export SEARCH1_API_KEY="your_key"
export SEARCH1_API_SECRET="your_secret"
export SEARCH1_ACCESS_TOKEN="your_token"
export SEARCH1_ACCESS_SECRET="your_token_secret"
export SEARCH2_API_KEY="your_key"
export SEARCH2_API_SECRET="your_secret"
export SEARCH2_ACCESS_TOKEN="your_token"
export SEARCH2_ACCESS_SECRET="your_token_secret"
# ... rest of credentials

# Run script
node scripts/kols/evaluate-and-reply-kols.js
```

**Look for:**
```
📚 Initializing Multi-Account Twitter Client...
   ✓ Search account loaded: search1
   ✓ Search account loaded: search2
   ✓ Posting account loaded: @BWSXAI (with proxy)

✅ Multi-Account Client initialized:
   - Search accounts: 2
   - Posting account: @BWSXAI
   - Strategy: 2x search → 1x post (99% activity reduction)
```

### 2. Create Test H Workflow

Create `.github/workflows/test-h-multi-account.yml`:

```yaml
name: Test H - Multi-Account Reply Test

on:
  workflow_dispatch:

permissions:
  contents: write

env:
  NODE_VERSION: "20"

jobs:
  test-multi-account:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: |
          npm install twitter-api-v2 @anthropic-ai/sdk

      - name: Run multi-account test
        env:
          BWSXAI_TWITTER_API_KEY: ${{ secrets.BWSXAI_TWITTER_API_KEY }}
          BWSXAI_TWITTER_API_SECRET: ${{ secrets.BWSXAI_TWITTER_API_SECRET }}
          BWSXAI_TWITTER_ACCESS_TOKEN: ${{ secrets.BWSXAI_TWITTER_ACCESS_TOKEN }}
          BWSXAI_TWITTER_ACCESS_SECRET: ${{ secrets.BWSXAI_TWITTER_ACCESS_SECRET }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          OXYLABS_USERNAME: ${{ secrets.OXYLABS_USERNAME }}
          OXYLABS_PASSWORD: ${{ secrets.OXYLABS_PASSWORD }}
          SEARCH1_API_KEY: ${{ secrets.SEARCH1_API_KEY }}
          SEARCH1_API_SECRET: ${{ secrets.SEARCH1_API_SECRET }}
          SEARCH1_ACCESS_TOKEN: ${{ secrets.SEARCH1_ACCESS_TOKEN }}
          SEARCH1_ACCESS_SECRET: ${{ secrets.SEARCH1_ACCESS_SECRET }}
          SEARCH2_API_KEY: ${{ secrets.SEARCH2_API_KEY }}
          SEARCH2_API_SECRET: ${{ secrets.SEARCH2_API_SECRET }}
          SEARCH2_ACCESS_TOKEN: ${{ secrets.SEARCH2_ACCESS_TOKEN }}
          SEARCH2_ACCESS_SECRET: ${{ secrets.SEARCH2_ACCESS_SECRET }}
          CI: true
          GITHUB_ACTIONS: true
        run: |
          echo "🧪 Testing multi-account reply system"
          node scripts/kols/evaluate-and-reply-kols.js

      - name: Summary
        run: |
          echo "## 🧪 Multi-Account Test Complete" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "Check logs for multi-account usage distribution" >> $GITHUB_STEP_SUMMARY
```

### 3. Trigger Test H

```bash
gh workflow run test-h-multi-account.yml
```

### 4. Monitor Test Results

Check for:
- ✅ Multi-account initialization successful
- ✅ Search accounts being rotated
- ✅ Posting account used only once
- ✅ No 403 errors
- ✅ Reply posted successfully

---

## Expected Log Output

### Successful Run:

```
📚 Initializing Multi-Account Twitter Client...
   Strategy: Decoupled search (multiple accounts) + posting (single account)

   ✓ Search account loaded: search1
   ✓ Search account loaded: search2
   ✓ Posting account loaded: @BWSXAI (with proxy)

✅ Multi-Account Client initialized:
   - Search accounts: 2
   - Posting account: @BWSXAI
   - Strategy: 2x search → 1x post (99% activity reduction)

Processing KOL: elonmusk
   📚 Using search account: search1 (1 calls)
   Found 10 recent tweets

Processing KOL: VitalikButerin
   📚 Using search account: search2 (1 calls)
   Found 8 recent tweets

...

Posting reply to best tweet:
   ✍️  Using posting account: @BWSXAI (dedicated for replies only)
   🌐 Using Oxylabs proxy (session: bwsxai-posting)
   ✅ Posted reply to tweet 1234567890

📊 Multi-Account Usage Summary:
   Total search calls: 28
   Distributed across 2 accounts:

   search1 : 14 calls ██████████████
   search2 : 14 calls ██████████████

   Load distribution:
   search1: 50%
   search2: 50%

   ✅ @BWSXAI activity: 1 call (reply only)
   📉 Activity reduction: 28+ → 1 (3%)
```

---

## Troubleshooting

### Error: "No search accounts configured!"

**Problem:** Search account credentials not found

**Solution:**
1. Check GitHub Secrets are named correctly: `SEARCH1_API_KEY`, not `SEARCH_1_API_KEY`
2. Verify all 4 credentials for each account
3. Check workflow file includes env variables

### Error: "All Twitter OAuth credentials are required"

**Problem:** Missing one or more credentials for an account

**Solution:**
1. Check all 4 credentials exist for each account:
   - API_KEY
   - API_SECRET
   - ACCESS_TOKEN
   - ACCESS_SECRET
2. Regenerate missing credentials from Twitter Developer Portal

### Search account suspended

**Problem:** Twitter flagged account as suspicious

**Solution:**
1. Appeal via Twitter support
2. Verify account with phone number
3. Add more organic activity (follow, like, tweet)
4. Create new search account as replacement

### Still getting 403 errors

**Problem:** Multi-account didn't solve the issue

**Possible causes:**
1. Account-level restriction on @BWSXAI
2. Tweet-specific reply restrictions
3. Twitter correlating all accounts

**Next steps:**
1. Check @BWSXAI account status manually
2. Try Test F to verify @BWSXAI can post at all
3. Consider additional approaches (longer delays, different pattern)

---

## Security Best Practices

1. **Never commit credentials to git**
   - Use GitHub Secrets only
   - Add `.env` to `.gitignore`

2. **Use strong passwords**
   - Different password for each account
   - Store in password manager

3. **Enable 2FA**
   - Authenticator app (not SMS)
   - Save backup codes

4. **Rotate credentials periodically**
   - Every 90 days
   - After any security incident

5. **Monitor for suspicious activity**
   - Check account login history
   - Review API usage
   - Watch for unauthorized posts

---

## Maintenance

### Monthly Tasks:
- Check search accounts still active
- Verify API rate limits not exceeded
- Review error logs for patterns

### Quarterly Tasks:
- Rotate API credentials
- Update account profiles (add tweets, follows)
- Test all accounts manually

### As Needed:
- Replace suspended accounts
- Add more search accounts if needed
- Adjust rotation strategy

---

## Success Criteria

✅ 2-3 search accounts created and configured
✅ All credentials added to GitHub Secrets
✅ Workflow updated with new environment variables
✅ Production script using multi-account client
✅ Test H passes without 403 errors
✅ Logs show proper account rotation
✅ @BWSXAI only makes 1 API call (reply)
✅ Production run succeeds with multi-account approach

---

## Next Steps

After successful setup:

1. **Monitor 24-hour period**
   - Watch for 403 errors
   - Track success rate
   - Verify account rotation working

2. **Compare with baseline**
   - Before: 0% success rate
   - Target: 60-80% success rate

3. **Adjust if needed**
   - Add more search accounts
   - Tune rotation strategy
   - Combine with other optimizations

4. **Document results**
   - Success rate improvement
   - Error patterns
   - Lessons learned

---

## Support

**Questions?** Check these resources:
- Twitter API Docs: https://developer.twitter.com/en/docs
- GitHub Secrets: https://docs.github.com/en/actions/security-guides/encrypted-secrets
- Multi-account analysis: `/tmp/kol-monitoring/multi-account-decoupling-analysis.md`

**Issues?** Review:
- Workflow logs
- Script output
- API tracker data
- Usage logger results
