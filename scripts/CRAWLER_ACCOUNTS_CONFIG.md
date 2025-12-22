# 🔐 Crawler Accounts Configuration

## Overview

Crawler accounts are now managed via a **single source of truth**: `x-crawler-accounts.json`

This file is used by **both local development and GitHub Actions** - no duplicate environment variables needed!

---

## 📁 File Structure

### Primary Config File

```
scripts/crawling/config/x-crawler-accounts.json
```

**Contains:**
- 3 crawler accounts with cookies (auth_token, ct0, guest_id)
- Proxy configuration (Oxylabs)
- Account rotation strategy
- Usage metadata

**Status:** ✅ Tracked in git

---

## 🔧 How It Works

### Local Development

All SDK scripts automatically load crawler accounts from the config file:

```javascript
// scripts/crawling/production/fetch-twitter-partnerships-sdk.js
// scripts/test-bws-x-sdk.js
// scripts/test-fetch-tweets-with-text.js

import fs from 'fs';

const CRAWLER_ACCOUNTS_PATH = path.join(__dirname, 'crawling', 'config', 'x-crawler-accounts.json');

function loadCrawlerAccounts() {
  const config = JSON.parse(fs.readFileSync(CRAWLER_ACCOUNTS_PATH, 'utf-8'));

  // Transform to SDK format
  const accounts = config.accounts.map(acc => ({
    id: acc.id,
    username: acc.username,
    cookies: {
      auth_token: acc.cookies.auth_token,
      ct0: acc.cookies.ct0,
      guest_id: acc.cookies.guest_id || ''
    },
    country: acc.country || 'us'
  }));

  return { accounts, proxy: config.proxy };
}
```

**SDK Initialization:**

```javascript
const crawlerConfig = loadCrawlerAccounts();

const client = new XTwitterClient({
  mode: crawlerConfig ? 'hybrid' : 'api',
  crawler: crawlerConfig ? { accounts: crawlerConfig.accounts } : undefined,
  api: { /* API credentials from env */ },
  proxy: crawlerConfig?.proxy?.enabled ? { /* from config */ } : undefined
});
```

### GitHub Actions

Since `x-crawler-accounts.json` is tracked in git, GitHub Actions can access it directly:

```yaml
# .github/workflows/fetch-twitter-partnerships.yml

- name: Install dependencies
  run: npm install @blockchain-web-services/bws-x-sdk-node@1.6.0

- name: Fetch partnerships
  env:
    TWITTER_API_KEY: ${{ secrets.TWITTER_API_KEY }}
    TWITTER_API_SECRET: ${{ secrets.TWITTER_API_SECRET }}
    TWITTER_ACCESS_TOKEN: ${{ secrets.TWITTER_ACCESS_TOKEN }}
    TWITTER_ACCESS_SECRET: ${{ secrets.TWITTER_ACCESS_SECRET }}
    OXYLABS_USERNAME: ${{ secrets.OXYLABS_USERNAME }}
    OXYLABS_PASSWORD: ${{ secrets.OXYLABS_PASSWORD }}
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  run: node scripts/crawling/production/fetch-twitter-partnerships-sdk.js
```

**No X_ACCOUNTS secret needed!** The script reads from the JSON file automatically.

---

## 📊 Configuration Details

### Current Accounts (from x-crawler-accounts.json)

```json
{
  "accounts": [
    {
      "id": "account_1",
      "username": "@Altcoin934648",
      "country": "es",
      "status": "active",
      "suspended": false,
      "cookies": { "auth_token": "...", "ct0": "...", "guest_id": "..." },
      "lastUsed": "2025-11-24T10:43:15.448Z"
    },
    {
      "id": "account_2",
      "username": "@justdotit93",
      "country": "es",
      "status": "active",
      "suspended": false,
      "cookies": { "auth_token": "...", "ct0": "...", "guest_id": "..." },
      "lastUsed": "2025-11-24T10:43:15.448Z"
    },
    {
      "id": "account_3",
      "username": "@kilt_me",
      "country": "us",
      "city": "atlanta",
      "status": "active",
      "suspended": false,
      "cookies": { "auth_token": "...", "ct0": "...", "guest_id": "..." },
      "lastUsed": "2025-11-24T10:43:15.448Z"
    }
  ],
  "proxy": {
    "enabled": true,
    "provider": "oxylabs",
    "host": "pr.oxylabs.io",
    "port": 7777,
    "country": "es",
    "sessionType": "sticky",
    "username": "github_ZDKqq",
    "password": "G_xer7PTbXsBY38"
  },
  "rotation": {
    "strategy": "round-robin",
    "cooldownMinutes": 0
  }
}
```

### Proxy Configuration

**Credentials Priority:**
1. Environment variables (`OXYLABS_USERNAME`, `OXYLABS_PASSWORD`)
2. Fallback to values in x-crawler-accounts.json

**Why?** Environment variables are safer for production (not hardcoded in repo).

---

## ✅ What Changed

### Before (Old Approach)

```bash
# .env file
X_ACCOUNTS='[{"id":"account_1",...},{"id":"account_2",...}]'  # ❌ Duplicate data
```

**Problems:**
- Data duplicated between x-crawler-accounts.json and .env
- X_ACCOUNTS needed in GitHub Secrets
- Hard to maintain (two places to update)
- Long unwieldy environment variable

### After (New Approach)

```bash
# .env file
# NOTE: Crawler accounts are now managed in scripts/crawling/config/x-crawler-accounts.json
# No need for X_ACCOUNTS environment variable anymore
```

**Benefits:**
- ✅ Single source of truth (x-crawler-accounts.json)
- ✅ Works for both local and GitHub Actions
- ✅ No GitHub Secret needed
- ✅ Easier to maintain (one file to update)
- ✅ No environment variable clutter

---

## 🔄 Migration Summary

### Files Updated

1. **`scripts/crawling/production/fetch-twitter-partnerships-sdk.js`**
   - Added `loadCrawlerAccounts()` function
   - Loads from x-crawler-accounts.json instead of X_ACCOUNTS env var

2. **`scripts/test-bws-x-sdk.js`**
   - Same loadCrawlerAccounts() approach
   - Auto-detects crawler accounts from file

3. **`scripts/test-fetch-tweets-with-text.js`**
   - Same loadCrawlerAccounts() approach

4. **`.env`**
   - Removed X_ACCOUNTS line
   - Added note about config file

### Files Removed

- ❌ `scripts/setup-crawler-accounts.js` (no longer needed)
- ❌ `scripts/add-x-accounts-secret.sh` (no longer needed)

---

## 📝 Required GitHub Secrets

For production GitHub Actions workflows:

| Secret | Status | Purpose |
|--------|--------|---------|
| TWITTER_API_KEY | ✅ | API fallback credentials |
| TWITTER_API_SECRET | ✅ | API fallback credentials |
| TWITTER_ACCESS_TOKEN | ✅ | API fallback credentials |
| TWITTER_ACCESS_SECRET | ✅ | API fallback credentials |
| OXYLABS_USERNAME | ✅ | Proxy credentials (override config file) |
| OXYLABS_PASSWORD | ✅ | Proxy credentials (override config file) |
| ANTHROPIC_API_KEY | ✅ | For Claude AI tweet processing |
| ~~X_ACCOUNTS~~ | ❌ **NOT NEEDED** | Read from config file instead |

**Total Required:** 7 secrets (was 8)

---

## 🔧 How to Update Crawler Accounts

### 1. Extract New Cookies from Browser

Open DevTools (F12) → Application → Cookies → https://x.com

Copy:
- `auth_token` (required)
- `ct0` (required)
- `guest_id` (optional)

### 2. Update Config File

Edit `scripts/crawling/config/x-crawler-accounts.json`:

```json
{
  "accounts": [
    {
      "id": "account_1",
      "username": "@YourAccountName",
      "cookies": {
        "auth_token": "NEW_TOKEN_HERE",
        "ct0": "NEW_CT0_HERE",
        "guest_id": "NEW_GUEST_ID_HERE"
      }
    }
  ]
}
```

### 3. Test Locally

```bash
node scripts/test-bws-x-sdk.js
```

Should show:
```
✅ Loaded 3 crawler accounts from config file
✅ SDK client initialized in hybrid mode
   Has crawler: ✅ Yes
```

### 4. Commit and Push

```bash
git add scripts/crawling/config/x-crawler-accounts.json
git commit -m "Update crawler account cookies"
git push
```

**That's it!** GitHub Actions will automatically use the updated file.

---

## 🚨 Security Considerations

### Is it safe to commit crawler cookies to git?

**Current approach:** Cookies ARE committed to git in `x-crawler-accounts.json`

**Risk level:** Medium
- Cookies expire after ~60 days
- If leaked, attacker could impersonate these accounts
- Accounts are disposable (burner accounts)

**Mitigation:**
1. Use burner/throwaway Twitter accounts
2. Don't use personal accounts
3. Rotate cookies regularly
4. Keep repository private

### Alternative: Use GitHub Secret (More Secure)

If you want extra security:

1. **Remove cookies from x-crawler-accounts.json:**
```json
{
  "accounts": [
    {
      "id": "account_1",
      "username": "@Altcoin934648",
      "cookies": {
        "auth_token": "",  // Empty - will load from env
        "ct0": "",
        "guest_id": ""
      }
    }
  ]
}
```

2. **Add X_ACCOUNTS to GitHub Secrets** (only include accounts array)

3. **Update script to merge config + env:**
```javascript
function loadCrawlerAccounts() {
  const config = JSON.parse(fs.readFileSync(CRAWLER_ACCOUNTS_PATH, 'utf-8'));

  // Override cookies from env if available
  if (process.env.X_ACCOUNTS) {
    const envAccounts = JSON.parse(process.env.X_ACCOUNTS);
    config.accounts = envAccounts;
  }

  return { accounts: config.accounts, proxy: config.proxy };
}
```

---

## 🎯 Testing

### Test Local Setup

```bash
# Should show: ✅ Loaded 3 crawler accounts from config file
node scripts/test-bws-x-sdk.js
```

### Test GitHub Actions

1. Go to Actions tab
2. Select "Fetch Twitter Partnerships" workflow
3. Click "Run workflow"
4. Check logs for: `✅ Loaded 3 crawler accounts from config file`

---

## 📊 Cost Savings

By using crawler accounts loaded from config file:

| Metric | Value |
|--------|-------|
| Cost per request | $0.00 (vs $0.002 with API) |
| Monthly savings (1k requests) | $2.00 |
| Annual savings (12k requests) | $24.00 |
| Production scale (10k requests/month) | $240.00/year saved |

---

## 📚 Related Documentation

- **Test Results:** `scripts/ACCOUNT_TEST_FINDINGS.md`
- **Setup Guide:** `scripts/CRAWLER_ACCOUNT_SETUP.md`
- **Migration Summary:** `scripts/MIGRATION_SUMMARY.md`
- **Hybrid Mode:** `scripts/HYBRID_MODE_SETUP_COMPLETE.md`

---

**Last Updated:** 2025-12-19
**Configuration Version:** 2.0 (file-based, no env var)
