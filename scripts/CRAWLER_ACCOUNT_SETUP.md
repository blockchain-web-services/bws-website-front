# Crawler Account Setup Guide

## 🎯 Why Use Crawler Accounts?

**Cost Savings:**
- ✅ **FREE** - No API rate limits or costs
- ✅ **Faster** - No API quota deductions
- ✅ **Reliable** - API fallback if crawler fails

**Hybrid Mode Strategy:**
1. **Try crawler first** (free, unlimited)
2. **Fallback to API** (only if crawler fails)
3. **Best of both worlds**

---

## 📋 Quick Setup (5 minutes)

### Step 1: Set Up Environment Variable

The SDK reads crawler accounts from the `X_ACCOUNTS` environment variable.

**Format:**
```bash
X_ACCOUNTS='[
  {
    "id": "account_1",
    "username": "@your_twitter_handle",
    "cookies": {
      "auth_token": "YOUR_AUTH_TOKEN",
      "ct0": "YOUR_CT0_TOKEN",
      "guest_id": "YOUR_GUEST_ID"
    },
    "country": "us"
  }
]'
```

### Step 2: Extract Cookies from Browser

**Using Chrome DevTools (Recommended - 2 minutes):**

1. **Log in to X:**
   - Open https://x.com in Chrome
   - Log in with your account
   - Make sure you see your home timeline

2. **Open DevTools:**
   - Press `F12`
   - Click **Application** tab
   - Expand **Cookies** → `https://x.com`

3. **Copy Required Cookies:**
   - `auth_token` - Your session token
   - `ct0` - CSRF token
   - `guest_id` - Guest identifier

4. **Quick Extract (Console Method):**
   ```javascript
   // Run this in DevTools Console
   const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
     const [key, value] = cookie.split('=');
     acc[key] = value;
     return acc;
   }, {});

   console.log({
     auth_token: cookies.auth_token,
     ct0: cookies.ct0,
     guest_id: cookies.guest_id
   });
   ```

### Step 3: Add to .env File

Edit `.trees/xai-trackkols/.env` and add:

```bash
# X Crawler Accounts (JSON format)
X_ACCOUNTS='[{"id":"account_1","username":"@YourHandle","cookies":{"auth_token":"YOUR_TOKEN","ct0":"YOUR_CT0","guest_id":"YOUR_GUEST_ID"},"country":"us"}]'

# Proxy (optional but recommended)
OXYLABS_USERNAME=your_username
OXYLABS_PASSWORD=your_password
```

### Step 4: Test the Setup

```bash
node scripts/test-bws-x-sdk.js
```

**Expected output:**
```
✅ SDK client initialized in hybrid mode
   Has crawler: ✅ Yes
   Has API: ✅ Yes
   Has proxy: ✅ Yes

🔍 Test 1: Fetching user profile...
[2025-12-19T12:00:00.000Z] INFO  Using crawler mode for getProfile
✅ Profile fetched successfully!
```

---

## 🔧 Advanced Setup: Multiple Accounts

### Using Existing Accounts

We already have 3 configured accounts in `scripts/crawling/config/x-crawler-accounts.json`:

```json
{
  "accounts": [
    {
      "id": "account_1",
      "username": "@Altcoin934648",
      "cookies": {
        "auth_token": "0b01d81486e6bb6a2eca588040d56f61cd5f65f4",
        "ct0": "1ab440b0042c89b0eb39139acaa2ba90b8d5e672048e5925027a4c7209c3a0f8780691b4e87c811d40edf564e9f0a440f9e0acbcf985d14c879623c33670bbb0c3773a25be5a18f1ddfc41e53f4425c4",
        "guest_id": "v1%3A176391575421801835"
      },
      "country": "es"
    },
    {
      "id": "account_2",
      "username": "@justdotit93",
      "cookies": {
        "auth_token": "579e586d78c88044d861c9d0b18ef833f0d4471f",
        "ct0": "ff09146f76243d136123a723a68472c88e219e47283dc87a38ab5f5010272934198264e26c472e8924a16aec58d14933142c0bc78c9363e73308f4987543b0f7fab7172f6513381877e42a3290715b53",
        "guest_id": "v1%3A176399562047222821"
      },
      "country": "es"
    },
    {
      "id": "account_3",
      "username": "@kilt_me",
      "cookies": {
        "auth_token": "a27a09f9fcd37dbdc6bcd5f68cb9074d47b24034",
        "ct0": "ddf3263e4b00953500b8be823fdb2c1170ebb0e8e243819e80d98da4335f0c0c31d2d46233c9607b6989cdcaac7693298757c95064b97d5c4fdebe91d0916521b8644f2c5cb1f58be268b2838f243507",
        "guest_id": "v1%3A176400671062878242"
      },
      "country": "us"
    }
  ]
}
```

### Convert to SDK Format

**Quick script to extract accounts:**
```bash
# Extract just the accounts array from config
node -e "
const config = require('./scripts/crawling/config/x-crawler-accounts.json');
console.log(JSON.stringify(config.accounts, null, 2));
" | pbcopy  # macOS (use xclip on Linux)
```

**Or manually copy:**
```bash
# In .env file
X_ACCOUNTS='[{"id":"account_1","username":"@Altcoin934648","cookies":{"auth_token":"0b01d81486e6bb6a2eca588040d56f61cd5f65f4","ct0":"1ab440b0042c89b0eb39139acaa2ba90b8d5e672048e5925027a4c7209c3a0f8780691b4e87c811d40edf564e9f0a440f9e0acbcf985d14c879623c33670bbb0c3773a25be5a18f1ddfc41e53f4425c4","guest_id":"v1%3A176391575421801835"},"country":"es"},{"id":"account_2","username":"@justdotit93","cookies":{"auth_token":"579e586d78c88044d861c9d0b18ef833f0d4471f","ct0":"ff09146f76243d136123a723a68472c88e219e47283dc87a38ab5f5010272934198264e26c472e8924a16aec58d14933142c0bc78c9363e73308f4987543b0f7fab7172f6513381877e42a3290715b53","guest_id":"v1%3A176399562047222821"},"country":"es"},{"id":"account_3","username":"@kilt_me","cookies":{"auth_token":"a27a09f9fcd37dbdc6bcd5f68cb9074d47b24034","ct0":"ddf3263e4b00953500b8be823fdb2c1170ebb0e8e243819e80d98da4335f0c0c31d2d46233c9607b6989cdcaac7693298757c95064b97d5c4fdebe91d0916521b8644f2c5cb1f58be268b2838f243507","guest_id":"v1%3A176400671062878242"},"country":"us"}]'
```

---

## 🚀 Production Setup (GitHub Actions)

### Add Secret to GitHub Actions

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `X_ACCOUNTS`
4. Value: The JSON array from above (minified, no newlines)
5. Click **Add secret**

### Verify in Workflow

The script will automatically detect `X_ACCOUNTS` and use hybrid mode:

```yaml
# .github/workflows/fetch-partnerships.yml
- name: Fetch Partnerships
  env:
    X_ACCOUNTS: ${{ secrets.X_ACCOUNTS }}
    TWITTER_API_KEY: ${{ secrets.TWITTER_API_KEY }}
    TWITTER_API_SECRET: ${{ secrets.TWITTER_API_SECRET }}
    TWITTER_ACCESS_TOKEN: ${{ secrets.TWITTER_ACCESS_TOKEN }}
    TWITTER_ACCESS_SECRET: ${{ secrets.TWITTER_ACCESS_SECRET }}
    OXYLABS_USERNAME: ${{ secrets.OXYLABS_USERNAME }}
    OXYLABS_PASSWORD: ${{ secrets.OXYLABS_PASSWORD }}
  run: |
    node scripts/crawling/production/fetch-twitter-partnerships-sdk.js
```

---

## 📊 How Hybrid Mode Works

### Execution Flow

```
1. Request: getUserTweets('BWSCommunity', { maxResults: 50 })
   ↓
2. Try Crawler First (if available)
   ├─ ✅ Success → Return tweets (FREE, no API quota used)
   └─ ❌ Failed → Continue to Step 3
   ↓
3. Fallback to API (if available)
   ├─ ✅ Success → Return tweets (uses API quota)
   └─ ❌ Failed → Throw error
```

### Cost Comparison

| Mode | Cost per Request | Rate Limits | Speed |
|------|-----------------|-------------|-------|
| **Crawler** | $0 (FREE) | None | ~2-3s |
| **API** | $0.01-0.05 | 40k/month | ~0.3s |
| **Hybrid** | $0 (tries crawler first) | None (with fallback) | ~2-3s or 0.3s |

**Example savings for 1000 requests/day:**
- API-only: ~$30-50/month
- Crawler-only: **$0/month** (but no fallback)
- Hybrid: **$0-5/month** (crawler works 90%+ of time)

---

## 🔍 Troubleshooting

### Problem: "Has crawler: ❌ No"

**Check:**
```bash
# Verify X_ACCOUNTS is set
echo $X_ACCOUNTS

# Should output JSON array, not empty
```

**Fix:**
```bash
# Make sure it's valid JSON
node -e "JSON.parse(process.env.X_ACCOUNTS)"

# If error, fix JSON format (escape quotes, remove newlines)
```

### Problem: Cookies Expired

**Symptoms:**
- Crawler returns login wall
- Error: "This tweet is from a suspended account"

**Fix:**
1. Re-extract cookies from browser (Step 2 above)
2. Update X_ACCOUNTS in .env
3. Cookies last ~30-60 days

### Problem: Rate Limited

**If crawler hits rate limit:**
- SDK automatically switches to API fallback
- No action needed (that's why hybrid mode is great!)

**If API also rate limited:**
- Wait for reset (shown in error message)
- Add more crawler accounts
- Reduce request frequency

---

## 🛡️ Security Best Practices

### DO:
- ✅ Store cookies in .env file (gitignored)
- ✅ Use GitHub Secrets for production
- ✅ Rotate cookies every 30 days
- ✅ Use separate burner accounts for crawling

### DON'T:
- ❌ Commit cookies to git
- ❌ Use your main Twitter account
- ❌ Share cookie values publicly
- ❌ Store cookies in plaintext in code

---

## 📖 Cookie Expiration & Rotation

### Automatic Rotation (TODO)

```javascript
// Future enhancement: Auto-rotate accounts
const client = new XTwitterClient({
  mode: 'hybrid',
  crawler: {
    accounts: JSON.parse(process.env.X_ACCOUNTS),
    rotation: {
      strategy: 'round-robin',  // Rotate after each request
      cooldownMinutes: 5         // Wait 5 min before reusing
    }
  }
});
```

### Manual Rotation

Update cookies every 30 days:
1. Log in to X with account
2. Extract fresh cookies
3. Update X_ACCOUNTS
4. Restart scripts

---

## ✅ Verification Checklist

After setup, verify:

- [ ] X_ACCOUNTS environment variable is set
- [ ] JSON is valid (no syntax errors)
- [ ] Cookies contain auth_token, ct0, guest_id
- [ ] Test script shows "Has crawler: ✅ Yes"
- [ ] API calls use crawler mode first
- [ ] Fallback to API works if crawler fails

---

## 🎉 Success!

Once configured, you should see:

```bash
$ node scripts/crawling/production/fetch-twitter-partnerships-sdk.js

🚀 Starting Twitter partnership fetch (SDK version)...
📦 Using: BWS X SDK v1.6.0

🔧 Initializing XTwitterClient...
[2025-12-19T12:00:00.000Z] INFO  Initializing XTwitterClient {"mode":"hybrid"}
[2025-12-19T12:00:00.000Z] INFO  Crawler client initialized with 3 accounts
[2025-12-19T12:00:00.000Z] INFO  API client initialized with account: BWSCommunity
✅ SDK client initialized in hybrid mode
   Has crawler: ✅ Yes
   Has API: ✅ Yes
   Has proxy: ✅ Yes

🔍 Fetching tweets from @BWSCommunity...
[2025-12-19T12:00:01.000Z] INFO  Using crawler mode for getUserTweets
📊 Found 50 tweets
```

**No API quota used! 🎉**
