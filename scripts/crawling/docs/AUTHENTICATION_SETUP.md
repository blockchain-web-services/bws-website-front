# X/Twitter Authentication Setup for KOL Discovery

## Overview

The KOL discovery crawler now uses **authenticated sessions** with real X/Twitter cookies to bypass bot detection and successfully capture profile data via GraphQL API interception.

## Why Authentication is Required

X.com detects and blocks unauthenticated headless browsers by:
- Not making GraphQL API calls that we intercept
- Serving simplified pages without profile data
- Blocking based on browser fingerprinting

**With authentication**, the crawler appears as a logged-in user and gets full access to GraphQL APIs.

## Setup Steps

### 1. Get Your X/Twitter Cookies

You need to extract cookies from a real, logged-in X.com session:

1. **Open X.com in your browser** (Chrome, Firefox, Edge, etc.)
2. **Log in** to your X/Twitter account
3. **Open DevTools** (Press F12 or right-click → Inspect)
4. **Navigate to Application/Storage tab**
5. **Click on Cookies → https://x.com**
6. **Copy these cookie values:**
   - `auth_token` (REQUIRED) - Your authentication token
   - `ct0` (REQUIRED) - CSRF token
   - `guest_id` (optional but recommended)

### 2. Update Configuration File

Edit `scripts/crawling/config/x-crawler-accounts.json`:

```json
{
  "accounts": [
    {
      "id": "account_1",
      "username": "your_x_username",
      "email": "your_email@example.com",
      "country": "es",
      "status": "active",
      "suspended": false,
      "cookies": {
        "auth_token": "paste_your_auth_token_here",
        "ct0": "paste_your_ct0_token_here",
        "guest_id": "paste_your_guest_id_here"
      }
    }
  ]
}
```

**IMPORTANT**: Replace ALL `REPLACE_WITH_*` placeholders with real values.

**Country Code**: Set to your actual country code (e.g., "es" for Spain, "us" for USA). This is used by Oxylabs proxy to route through that country, reducing bot detection.

### 3. Configure Proxy Settings (Oxylabs)

The crawler uses Oxylabs residential proxies to avoid detection.

#### Option A: Using .env File (RECOMMENDED for local development)

Create or edit `.env` file in the project root:

```
OXYLABS_USERNAME=your_oxylabs_username
OXYLABS_PASSWORD=your_oxylabs_password
```

The crawler automatically loads this file using `dotenv`.

#### Option B: Using GitHub Secrets (RECOMMENDED for CI/CD)

Add these secrets in GitHub repository settings:

- `OXYLABS_USERNAME` - Your Oxylabs customer username
- `OXYLABS_PASSWORD` - Your Oxylabs password

The crawler will automatically use these values in GitHub Actions.

#### Option C: Local Configuration File

Edit the `proxy` section in `x-crawler-accounts.json`:

```json
{
  "proxy": {
    "enabled": true,
    "provider": "oxylabs",
    "host": "pr.oxylabs.io",
    "port": 7777,
    "username": "your_oxylabs_username",
    "password": "your_oxylabs_password",
    "country": "es",
    "sessionType": "sticky"
  }
}
```

**Country Code**: Use your actual country code (e.g., "es" for Spain, "us" for USA) to match your geographic location and reduce bot detection.

**Credential Priority**: The crawler loads credentials in this order:
1. Environment variables (`.env` file locally, GitHub Secrets in CI/CD)
2. Values from `x-crawler-accounts.json` config file
3. Default values

## How It Works

1. **Cookie Loading**: Before navigating to X.com, the crawler loads your authentication cookies
2. **Authenticated Session**: X.com sees the crawler as your logged-in account
3. **GraphQL Access**: X.com makes GraphQL API calls that the crawler intercepts
4. **Profile Data**: The crawler captures profile data from GraphQL responses
5. **Proxy Protection**: Oxylabs proxy with your country code masks the automation

## Security Notes

⚠️ **NEVER commit real cookies to Git!**

- The `x-crawler-accounts.json` file should contain placeholders in version control
- Real cookies should only exist in:
  - Local development environment (gitignored)
  - GitHub Secrets (for CI/CD)
  - Secure production environment

⚠️ **Cookie Expiration**

- X/Twitter cookies typically last 30 days
- If the crawler stops working, your cookies may have expired
- You'll need to log in again and extract fresh cookies

⚠️ **Account Safety**

- Use a dedicated X account for crawling (not your personal account)
- Avoid excessive requests to prevent rate limiting
- The crawler uses cooldowns and rotation to stay within limits

## Testing

After setup, test with a single profile:

```bash
cd scripts/crawling/production
node discover-crawlee-direct.js
```

Look for these success indicators:
```
🔐 Using account: account_1 (@your_username)
🍪 Loading authentication cookies...
✅ Captured profile data for @CryptoCobain
```

## Troubleshooting

### "Account config not found"
- Make sure `x-crawler-accounts.json` exists in `scripts/crawling/config/`
- Check file permissions

### "Account has invalid cookies"
- Verify you replaced ALL `REPLACE_WITH_*` placeholders
- Check that `auth_token` and `ct0` are not empty
- Try extracting fresh cookies from X.com

### "Profile not found" (but profile exists)
- Cookies may have expired - extract fresh ones
- Check that you're logged into X.com when extracting cookies
- Verify the account is not suspended

### "Proxy connection failed"
- Check Oxylabs credentials are correct
- Verify you have active Oxylabs subscription
- Try setting `enabled: false` to test without proxy

## Files

- `scripts/crawling/config/x-crawler-accounts.json` - Account configuration (contains cookies)
- `scripts/crawling/crawlers/twitter-crawler-authenticated.js` - Authenticated crawler
- `scripts/crawling/utils/x-auth-manager.js` - Auth management utilities

## Next Steps

Once authentication is working:
1. The crawler will successfully capture profile data
2. GraphQL API responses will be intercepted
3. KOL profiles will be added to the database
4. You can scale up from 1 to 146 candidates
