# 🔄 ScrapFly Multi-Account Retry System

**Date:** 2025-11-06
**Purpose:** Implement automatic account failover for ScrapFly auth failures

---

## 🎯 Problems Addressed

Based on the error log:
```
❌ ScrapFly Search - AUTH FAILURE
Error: Cookie authentication failed (401/403)
```

### Issues Identified:

1. **No X Username in Logs**
   - Error showed "Using account: Altcoin934648" (account ID)
   - Didn't show the actual X/Twitter username for debugging
   - Hard to identify which Twitter account had expired cookies

2. **No Multi-Account Retry**
   - System only tried first account (accounts[0])
   - Failed immediately on 401/403 without trying backup accounts
   - No automatic failover despite having multiple accounts configured

3. **Missing Proxy Information in Errors**
   - Logs showed proxy during request but not in error context
   - Zapier notifications didn't include proxy details
   - Hard to determine if proxy was part of the problem

---

## ✅ Improvements Implemented

### 1. Multi-Account Retry Logic

**File:** `scripts/kols/discover-by-search-scrapfly.js`

**Before:**
```javascript
const { apiKey, account, queries: queriesConfig } = await loadConfig();
console.log(`📱 Using account: ${account.username}`);

const cookieString = formatCookies(account);
const result = await client.searchTwitter(query.query, {
  cookies: cookieString,
  // ...
});
```

**After:**
```javascript
const { apiKey, accounts, queries: queriesConfig } = await loadConfig();

// Filter active accounts with valid cookies
const activeAccounts = config.accounts.filter(acc =>
  acc.status === 'active' &&
  acc.cookies &&
  acc.cookies.auth_token &&
  acc.cookies.ct0
);

console.log(`📱 Available accounts: ${accounts.length}`);
console.log(`   Primary: @${accounts[0].username} (${accounts[0].id})`);
if (accounts.length > 1) {
  console.log(`   Fallbacks: ${accounts.slice(1).map(a => `@${a.username}`).join(', ')}`);
}

// Try each account until one succeeds
for (let accountIndex = 0; accountIndex < accounts.length; accountIndex++) {
  const account = accounts[accountIndex];

  try {
    console.log(`   👤 Using: @${account.username} (${account.id})`);

    const result = await client.searchTwitter(query.query, {
      cookies: formatCookies(account),
      session: `${account.id}-session`,
      // ...
    });

    break; // Success - don't try more accounts

  } catch (error) {
    const isAuthError = error.message.includes('401') || error.message.includes('403');

    console.error(`   ❌ Failed with @${account.username}: ${error.message}`);
    console.error(`      Authentication error: ${isAuthError ? 'YES (will try next account)' : 'NO'}`);
    console.error(`      Proxy used: public_residential_pool (us)`);

    // If auth error and more accounts available, try next account
    if (isAuthError && accountIndex < accounts.length - 1) {
      console.log(`   🔄 Trying next account...`);
      continue;
    }

    throw error; // Last account or non-auth error
  }
}
```

### 2. Enhanced Logging

**Account Tracking:**
```javascript
stats: {
  // ... existing stats
  accountsAttempted: [],  // NEW: Track which accounts were used
}

// During execution
if (!stats.accountsAttempted.includes(account.username)) {
  stats.accountsAttempted.push(account.username);
}

// In summary
console.log(`   Accounts used: ${stats.accountsAttempted.join(', ')}`);
```

**Error Context Enhancement:**
```javascript
// Add detailed context to error object
error.accountsFailed = stats.accountsAttempted;
error.proxyUsed = 'public_residential_pool (us)';
error.lastAccountTried = account.username;

// Log detailed error info
console.error('\n❌ Discovery failed:', error.message);
console.error(`   Accounts attempted: ${stats.accountsAttempted.join(', ') || 'None'}`);
console.error(`   Last account tried: @${error.lastAccountTried}`);
console.error(`   Proxy: ${error.proxyUsed}`);
```

### 3. Improved Zapier Notifications

**File:** `scripts/kols/utils/scrapfly-error-handler.js`

**Before:**
```
❌ ScrapFly Search - AUTH FAILURE

Error: Cookie authentication failed (401/403)

Details:
  • Cookies expired or invalid
  • Last successful search: Never
  • Consecutive failures: 1
```

**After:**
```
❌ ScrapFly Search - AUTH FAILURE

Error: Cookie authentication failed (401/403)

Account Details:
  • Last account tried: @Altcoin934648
  • All accounts attempted: Altcoin934648, CryptoGems2024, Web3Hunter
  • Total accounts tried: 3

Connection Details:
  • Proxy used: public_residential_pool (us)
  • Last successful search: Never
  • Consecutive failures: 1
  • Credits remaining: Unknown

Action Required:
  All 3 accounts failed - refresh all cookies in `scripts/kols/config/x-crawler-accounts.json`
  Run: `node scripts/kols/save-cookies.js`
  Test: `node scripts/kols/test-scrapfly.js`
```

---

## 📊 Behavior Comparison

### Before: Single Account

```
🔍 Starting ScrapFly-based KOL Discovery

📱 Using account: Altcoin934648

🔎 Searching: $GROK OR $ELIZA lang:en -is:retweet
   🌐 ScrapFly request: https://x.com/search?q=...
   📍 Proxy: public_residential_pool (us)
   🔑 Session: discovery-session
   ❌ Query failed: ScrapFly error 401

❌ Discovery failed: ScrapFly error 401
```

### After: Multi-Account with Retry

**Scenario A: First Account Succeeds**
```
🔍 Starting ScrapFly-based KOL Discovery

📱 Available accounts: 3
   Primary: @Altcoin934648 (crawler_01)
   Fallbacks: @CryptoGems2024, @Web3Hunter

🔎 Searching: $GROK OR $ELIZA lang:en -is:retweet
   👤 Using: @Altcoin934648 (crawler_01)
   🌐 ScrapFly request: https://x.com/search?q=...
   📍 Proxy: public_residential_pool (us)
   🔑 Session: crawler_01-session
   ✅ Found 12 tweets from 8 users

✅ Discovery complete in 23.4s
📊 Summary:
   Accounts used: Altcoin934648
   Queries executed: 6
```

**Scenario B: First Account Fails, Second Succeeds**
```
🔍 Starting ScrapFly-based KOL Discovery

📱 Available accounts: 3
   Primary: @Altcoin934648 (crawler_01)
   Fallbacks: @CryptoGems2024, @Web3Hunter

🔎 Searching: $GROK OR $ELIZA lang:en -is:retweet
   👤 Using: @Altcoin934648 (crawler_01)
   ❌ Failed with @Altcoin934648: ScrapFly error 401
      Authentication error: YES (will try next account)
      Proxy used: public_residential_pool (us)
   🔄 Trying next account...

   👤 Using: @CryptoGems2024 (crawler_02)
   🌐 ScrapFly request: https://x.com/search?q=...
   📍 Proxy: public_residential_pool (us)
   🔑 Session: crawler_02-session
   ✅ Found 12 tweets from 8 users

✅ Discovery complete in 27.1s
📊 Summary:
   Accounts used: Altcoin934648, CryptoGems2024
   Queries executed: 6
```

**Scenario C: All Accounts Fail**
```
🔍 Starting ScrapFly-based KOL Discovery

📱 Available accounts: 3
   Primary: @Altcoin934648 (crawler_01)
   Fallbacks: @CryptoGems2024, @Web3Hunter

🔎 Searching: $GROK OR $ELIZA lang:en -is:retweet
   👤 Using: @Altcoin934648 (crawler_01)
   ❌ Failed with @Altcoin934648: ScrapFly error 401
      Authentication error: YES (will try next account)
      Proxy used: public_residential_pool (us)
   🔄 Trying next account...

   👤 Using: @CryptoGems2024 (crawler_02)
   ❌ Failed with @CryptoGems2024: ScrapFly error 401
      Authentication error: YES (will try next account)
      Proxy used: public_residential_pool (us)
   🔄 Trying next account...

   👤 Using: @Web3Hunter (crawler_03)
   ❌ Failed with @Web3Hunter: ScrapFly error 401
      Authentication error: YES (will try next account)
      Proxy used: public_residential_pool (us)
   ⚠️  Query failed with all 3 accounts

❌ Discovery failed: ScrapFly error 401
   Accounts attempted: Altcoin934648, CryptoGems2024, Web3Hunter
   All failed accounts: Altcoin934648, CryptoGems2024, Web3Hunter
   Last account tried: @Web3Hunter
   Proxy: public_residential_pool (us)
```

---

## 🔑 Key Features

### 1. Intelligent Retry Logic
- ✅ Only retry on authentication errors (401/403)
- ✅ Don't retry on credit exhaustion or other errors
- ✅ Stop after all accounts exhausted
- ✅ Break on first success

### 2. Account Management
- ✅ Filter only active accounts with valid cookie structure
- ✅ Check for required cookie fields (auth_token, ct0)
- ✅ Maintain account session isolation
- ✅ Track usage across queries

### 3. Detailed Logging
- ✅ Show all available accounts at startup
- ✅ Log X username (@username) for each attempt
- ✅ Distinguish auth errors from other errors
- ✅ Show proxy information consistently
- ✅ Track cumulative accounts attempted

### 4. Error Context
- ✅ Attach account list to error object
- ✅ Include last account tried
- ✅ Add proxy information
- ✅ Pass context to error handler

### 5. Actionable Notifications
- ✅ Show which specific account failed
- ✅ Indicate if single or all accounts failed
- ✅ Suggest appropriate fix based on failure count
- ✅ Provide test command to verify fixes

---

## 🚀 Benefits

### For Operations
- **Automatic Failover**: System tries backup accounts without manual intervention
- **Higher Uptime**: Single expired account doesn't break entire discovery
- **Clear Diagnostics**: Know exactly which account needs cookie refresh

### For Debugging
- **X Username Visibility**: See real Twitter username in logs
- **Proxy Information**: Understand if proxy contributed to failure
- **Retry Visibility**: See each attempt and why it failed

### For Maintenance
- **Staggered Updates**: Don't need to update all cookies at once
- **Graceful Degradation**: System works with partial account pool
- **Better Alerts**: Notifications show actionable information

---

## 📝 Configuration Requirements

### Account Configuration Format

**File:** `scripts/kols/config/x-crawler-accounts.json`

```json
{
  "accounts": [
    {
      "id": "crawler_01",
      "username": "Altcoin934648",  // ← X/Twitter username (required for logging)
      "status": "active",           // ← Must be "active"
      "cookies": {                  // ← Must have valid cookies
        "auth_token": "XXX",        // ← Required
        "ct0": "YYY",               // ← Required
        "guest_id": "ZZZ"
      },
      "lastUsed": null,
      "suspended": false
    },
    {
      "id": "crawler_02",
      "username": "CryptoGems2024",
      "status": "active",
      "cookies": {
        "auth_token": "AAA",
        "ct0": "BBB",
        "guest_id": "CCC"
      }
    }
    // Add more accounts for higher resilience
  ]
}
```

### Filtering Rules

The system will ONLY use accounts that meet ALL criteria:
1. `status === 'active'`
2. `cookies` object exists
3. `cookies.auth_token` exists and not empty
4. `cookies.ct0` exists and not empty

If NO accounts meet these criteria, the system will fail with:
```
Error: No active accounts with valid cookies found in config
```

---

## 🧪 Testing

### Test Single Account
```bash
# Configure only one account in x-crawler-accounts.json
node scripts/kols/discover-with-fallback.js

# Expected: Uses single account, falls back to Crawlee on failure
```

### Test Multi-Account Failover
```bash
# Configure 3+ accounts
# Invalidate first account cookies (set auth_token to "invalid")
node scripts/kols/discover-with-fallback.js

# Expected:
# - Tries account 1 → fails with 401
# - Tries account 2 → succeeds
# - Logs show both accounts attempted
```

### Test All Accounts Expired
```bash
# Invalidate all account cookies
node scripts/kols/discover-with-fallback.js

# Expected:
# - Tries all accounts sequentially
# - Each fails with 401
# - Falls back to Crawlee
# - Zapier alert shows all accounts failed
```

### Verify Cookie Refresh
```bash
# After refreshing cookies with save-cookies.js
node scripts/kols/test-scrapfly.js

# Expected: Search succeeds with 200 status
```

---

## 📚 Related Files

- `scripts/kols/discover-by-search-scrapfly.js` - Main discovery script with retry logic
- `scripts/kols/utils/scrapfly-client.js` - ScrapFly API client
- `scripts/kols/utils/scrapfly-error-handler.js` - Error detection and Zapier alerts
- `scripts/kols/config/x-crawler-accounts.json` - Account configuration
- `scripts/kols/save-cookies.js` - Script to refresh cookies
- `scripts/kols/test-scrapfly.js` - Test script to verify ScrapFly works

---

## 🔄 Next Steps

1. **Refresh Cookies** for all configured accounts:
   ```bash
   node scripts/kols/save-cookies.js
   ```

2. **Test ScrapFly** with refreshed cookies:
   ```bash
   node scripts/kols/test-scrapfly.js
   ```

3. **Monitor Next Run** to see multi-account behavior in action

4. **Set Up Cookie Rotation Schedule**: Consider refreshing cookies weekly to prevent expiration

---

## 💡 Future Enhancements

- [ ] Add cookie expiration tracking
- [ ] Automatic cookie refresh before expiration
- [ ] Rate limit tracking per account
- [ ] Account health dashboard
- [ ] Intelligent account selection based on success rate
- [ ] Cookie validation before attempting search
