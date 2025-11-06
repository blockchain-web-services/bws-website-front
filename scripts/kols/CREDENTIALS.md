# 🔐 Credentials Management Guide

This document explains how credentials are managed for the KOL discovery and engagement system.

## 📋 Required Credentials

### 1. ScrapFly API Key
- **Service:** [ScrapFly](https://scrapfly.io)
- **Purpose:** Web scraping for X/Twitter search (primary method)
- **GitHub Secret:** `SCRAPFLY_API_KEY`
- **Local .env:** `SCRAPFLY_API_KEY=scp-live-YOUR-KEY-HERE`

**Usage:**
- Primary discovery method via `discover-by-search-scrapfly.js`
- Handles anti-bot protection and JavaScript rendering
- Includes residential proxies

### 2. Oxylabs Proxy Credentials
- **Service:** [Oxylabs](https://oxylabs.io)
- **Purpose:** Residential proxies for Crawlee fallback method
- **GitHub Secrets:**
  - `OXYLABS_USERNAME` (format: `nachocoll_XXXX`)
  - `OXYLABS_PASSWORD`
- **Local .env:**
  ```
  OXYLABS_USERNAME=customer-nachocoll_XXXX
  OXYLABS_PASSWORD=YOUR-PASSWORD-HERE
  ```

**Usage:**
- Fallback discovery method via `discover-by-engagement-crawlee.js`
- Used when ScrapFly fails or is disabled
- Connects to: `pr.oxylabs.io:7777`

### 3. Anthropic API Key
- **Service:** [Anthropic Claude](https://console.anthropic.com)
- **Purpose:** AI evaluation and reply generation
- **GitHub Secret:** `ANTHROPIC_API_KEY`
- **Local .env:** `ANTHROPIC_API_KEY=sk-ant-YOUR-KEY-HERE`

**Usage:**
- Evaluate tweets for relevance
- Generate contextual replies
- Assess KOL quality

### 4. X/Twitter API Credentials
- **Service:** [Twitter Developer Portal](https://developer.twitter.com)
- **Purpose:** Post replies to X/Twitter
- **GitHub Secrets:**
  - `BWSXAI_TWITTER_BEARER_TOKEN`
  - `BWSXAI_TWITTER_API_KEY`
  - `BWSXAI_TWITTER_API_SECRET`
  - `BWSXAI_TWITTER_ACCESS_TOKEN`
  - `BWSXAI_TWITTER_ACCESS_SECRET`

**Usage:**
- Read tweets via API (read-only operations)
- Post replies (write operations)

### 5. X/Twitter Cookies (Manual)
- **Purpose:** Authenticated search via ScrapFly
- **Config File:** `scripts/kols/config/x-crawler-accounts.json`
- **Format:**
  ```json
  {
    "cookies": {
      "auth_token": "XXXX",
      "ct0": "YYYY",
      "guest_id": "ZZZZ"
    }
  }
  ```

**Note:** These are manually extracted and stored in the config file (gitignored).

## 🔧 Setup Instructions

### Local Development

1. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

2. **Add credentials to .env:**
   ```bash
   # ScrapFly
   SCRAPFLY_API_KEY=scp-live-YOUR-KEY-HERE

   # Oxylabs
   OXYLABS_USERNAME=nachocoll_XXXX
   OXYLABS_PASSWORD=YOUR-PASSWORD

   # Anthropic
   ANTHROPIC_API_KEY=sk-ant-YOUR-KEY

   # Twitter (if testing posting)
   BWSXAI_TWITTER_BEARER_TOKEN=AAAA...
   BWSXAI_TWITTER_API_KEY=XXX
   BWSXAI_TWITTER_API_SECRET=YYY
   BWSXAI_TWITTER_ACCESS_TOKEN=ZZZ
   BWSXAI_TWITTER_ACCESS_SECRET=WWW
   ```

3. **Verify .env is gitignored:**
   ```bash
   grep "^\.env$" .gitignore
   # Should show: .env
   ```

### GitHub Actions

Add all credentials as repository secrets:

```bash
# ScrapFly
gh secret set SCRAPFLY_API_KEY -b "scp-live-YOUR-KEY"

# Oxylabs
gh secret set OXYLABS_USERNAME -b "nachocoll_XXXX"
gh secret set OXYLABS_PASSWORD -b "YOUR-PASSWORD"

# Anthropic
gh secret set ANTHROPIC_API_KEY -b "sk-ant-YOUR-KEY"

# Twitter (already configured)
# BWSXAI_TWITTER_* credentials
```

## 🔄 Credential Rotation

### When to Rotate
- **Immediately:** If credentials are exposed in git history or logs
- **Regularly:** Every 90 days as best practice
- **After incidents:** Team member leaves, repository access changes

### How to Rotate

**1. ScrapFly API Key:**
```bash
# 1. Generate new key at https://scrapfly.io/dashboard/api
# 2. Update GitHub Secret
gh secret set SCRAPFLY_API_KEY -b "scp-live-NEW-KEY"
# 3. Update local .env
echo "SCRAPFLY_API_KEY=scp-live-NEW-KEY" >> .env
# 4. Delete old key from ScrapFly dashboard
```

**2. Oxylabs Credentials:**
```bash
# 1. Generate new credentials at Oxylabs dashboard
# 2. Update GitHub Secrets
gh secret set OXYLABS_USERNAME -b "NEW-USERNAME"
gh secret set OXYLABS_PASSWORD -b "NEW-PASSWORD"
# 3. Update local .env
# 4. Delete old credentials from Oxylabs
```

**3. X/Twitter Cookies:**
```bash
# 1. Extract new cookies using capture-x-cookies.js
node scripts/kols/capture-x-cookies.js
# 2. Update x-crawler-accounts.json manually
```

## 🚨 Security Best Practices

### ✅ DO
- Store credentials in GitHub Secrets for CI/CD
- Use .env file for local development
- Add .env to .gitignore
- Rotate credentials regularly
- Use environment variables in code
- Maintain backward compatibility with config files

### ❌ DON'T
- Commit credentials to git
- Share credentials in chat/email
- Use production credentials locally
- Store credentials in code comments
- Push .env files to repository

## 📊 Environment Priority

The code follows this priority order:

```
1. Environment Variables (process.env.XXX)
   ↓
2. Config File (x-crawler-accounts.json)
   ↓
3. Error/Fallback
```

**Example (ScrapFly):**
```javascript
apiKey = process.env.SCRAPFLY_API_KEY       // Highest priority
      || config.scrapfly?.apiKey             // Fallback
      || config.scrapfly?.api_key            // Legacy support
```

## 🔍 Troubleshooting

### "API key not found"
- Check GitHub Secrets are set correctly
- Verify .env file exists and is loaded
- Ensure environment variables are passed in workflow

### "Proxy connection failed"
- Verify Oxylabs credentials are correct
- Check Oxylabs account has sufficient balance
- Confirm proxy URL: `pr.oxylabs.io:7777`

### "Twitter API unauthorized"
- Regenerate Twitter API credentials
- Verify OAuth 1.0a credentials (not OAuth 2.0)
- Check app has read+write permissions

## 📚 Related Files

- `.env` - Local environment variables (gitignored)
- `.env.example` - Template for .env file
- `scripts/kols/config/x-crawler-accounts.json` - Account configuration
- `scripts/kols/config/x-crawler-accounts.json.template` - Template
- `scripts/kols/utils/scrapfly-client.js` - ScrapFly API client
- `scripts/kols/utils/x-auth-manager.js` - Oxylabs proxy manager

## 🎯 Quick Reference

| Credential | Service | Priority | Rotation | Cost |
|------------|---------|----------|----------|------|
| SCRAPFLY_API_KEY | ScrapFly | Required | 90 days | $$$ |
| OXYLABS_USERNAME | Oxylabs | Fallback | 90 days | $$$ |
| OXYLABS_PASSWORD | Oxylabs | Fallback | 90 days | $$$ |
| ANTHROPIC_API_KEY | Claude | Required | 90 days | $$ |
| BWSXAI_TWITTER_* | X/Twitter | Required | 90 days | Free |
| X Cookies | X/Twitter | Required | 30 days | Free |
