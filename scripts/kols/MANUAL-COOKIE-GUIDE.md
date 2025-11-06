# Manual Cookie Extraction Guide for X/Twitter

Since automated login has proven difficult due to X's bot detection, here's how to manually extract cookies from your browser.

## Method 1: Chrome DevTools (Recommended - 2 minutes)

### Step 1: Log in to X
1. Open Chrome/Edge in **normal mode** (not incognito)
2. Go to https://x.com
3. Log in with your account credentials
4. Make sure you see your home timeline (fully logged in)

### Step 2: Extract Cookies
1. Press `F12` to open DevTools
2. Click the **Application** tab (or **Storage** in Firefox)
3. In the left sidebar, expand **Cookies**
4. Click on `https://x.com`
5. Find these essential cookies:
   - `auth_token`
   - `ct0`
   - `guest_id`

### Step 3: Copy Cookie Values
Copy the entire cookie string in this format:
```
auth_token=YOUR_VALUE; ct0=YOUR_VALUE; guest_id=YOUR_VALUE
```

You can get all cookies at once by running this in the **Console** tab:
```javascript
document.cookie
```

Copy the entire output.

### Step 4: Save to Config File

Create or update: `scripts/kols/config/x-cookies.json`

```json
{
  "capturedAt": "2025-11-06T10:00:00.000Z",
  "scrapflyFormat": "PASTE_YOUR_COOKIES_HERE",
  "cookieCount": 15,
  "method": "manual_devtools"
}
```

Replace `PASTE_YOUR_COOKIES_HERE` with the cookie string from Step 3.

## Method 2: Using Browser Extension (Alternative)

### EditThisCookie Extension
1. Install "EditThisCookie" from Chrome Web Store
2. Go to https://x.com (logged in)
3. Click the extension icon
4. Click "Export" button
5. Paste exported JSON into a temporary file
6. Run our converter script (we'll create this)

## Method 3: Copy from capture-x-cookies.js (If it worked)

If you already ran the manual capture tool and got `config/x-cookies.json`, you're all set!

## Testing Your Cookies

Once you have cookies saved, test with:

```bash
node scripts/kols/test-scrapfly-auth.js
```

This will:
1. Load your cookies from `config/x-cookies.json`
2. Use them with ScrapFly to search for "$XAI" tweets
3. Verify you can see actual tweets (not login wall)

## Cookie Expiration

- X cookies typically last 30-60 days
- `auth_token` is the main authentication cookie
- ScrapFly sessions maintain cookies for 7 days
- Recapture cookies if you see login walls again

## Security Note

⚠️ Keep `x-cookies.json` private! It contains your session credentials.
✅ The file is already in `.gitignore`

## Troubleshooting

**"Still seeing login wall"**
- Cookies may have expired - recapture them
- Make sure you copied the entire cookie string
- Verify you're logged in before capturing

**"No tweets found"**
- Check that search URL is correct
- Try searching for a different term
- Verify cookies include `auth_token` and `ct0`

## Quick Start Summary

```bash
# 1. Log in to x.com in Chrome
# 2. Press F12 → Console tab
# 3. Type: document.cookie
# 4. Copy output
# 5. Create config/x-cookies.json:
{
  "capturedAt": "2025-11-06T10:00:00.000Z",
  "scrapflyFormat": "YOUR_COOKIES_HERE",
  "cookieCount": 15
}

# 6. Test it
node scripts/kols/test-scrapfly-auth.js
```
