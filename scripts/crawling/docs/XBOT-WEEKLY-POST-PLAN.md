# X Bot Weekly Best Players Post - Implementation Plan

**Feature:** Automated weekly post highlighting X Bot top performers
**Target:** Twitter/X post with snapshot from xbot.ninja
**Frequency:** Weekly (e.g., every Monday)
**Data Source:** https://xbot.ninja

---

## 1. Feature Requirements

### 1.1 Data Extraction
**Extract from xbot.ninja:**
1. **Best X Account** (Top X Accounts leaderboard)
   - Rank #1 account by performance score
   - Exclude: @BWSCommunity, @BWS (owned accounts)
   - Fallback: If #1 is excluded, use #2, then #3, etc.
   - Extract: Username, performance score, rank change

2. **Best Hashtag** (Top Hashtags leaderboard)
   - Rank #1 hashtag by engagement
   - Exclude: #BWS, #BWSCommunity (owned tags)
   - Fallback: If #1 is excluded, use #2, then #3, etc.
   - Extract: Hashtag, engagement metrics, rank change

3. **Time Period**
   - Default: "Last 7 Days" (weekly cadence)
   - Configurable via script parameter

### 1.2 Screenshot Requirements
**Capture Areas:**
- **Option A:** Full leaderboard view (both accounts and hashtags visible)
- **Option B:** Two separate screenshots
  - Top X Accounts section (top 5 visible)
  - Top Hashtags section (top 5 visible)

**Technical Requirements:**
- Wait for dynamic content to load (JavaScript-rendered)
- Ensure all data is fully rendered before capture
- Handle loading states gracefully
- Viewport size: 1280x720 or 1920x1080 (Twitter-friendly)
- Format: PNG (high quality for social media)

### 1.3 Post Content
**Tweet Structure:**
```
🏆 X Bot Weekly Winners (Dec 23-30)

👤 Top Performer: @{username}
   Performance Score: {score} (+{change}%)

#️⃣ Trending Tag: #{hashtag}
   Engagement: {metric}

Real KOL analytics, zero bot farms.
Track your performance 👉 https://xbot.ninja

$BWS @BWSCommunity #crypto #KOL #analytics

[IMAGE: Screenshot attached]
```

---

## 2. Technical Architecture

### 2.1 Technology Stack

**Headless Browser:** Playwright
```javascript
// Why Playwright?
// 1. Already installed in GitHub Actions environment
// 2. Handles dynamic content loading automatically
// 3. Built-in waiting mechanisms for async content
// 4. Screenshot capabilities with precise selectors
// 5. Cross-browser support (Chromium, Firefox, WebKit)
```

**Data Extraction:** Playwright selectors + DOM parsing
```javascript
// Approach:
// 1. Navigate to xbot.ninja
// 2. Wait for leaderboard data to load
// 3. Extract top performers using CSS selectors
// 4. Filter out BWS-owned accounts/tags
// 5. Format data for tweet
```

**Image Storage:** Local file system (GitHub Actions workspace)
```javascript
// Screenshots saved to: ./screenshots/xbot-weekly-{date}.png
// Cleaned up after tweet posted
```

### 2.2 File Structure

```
scripts/
└── crawling/
    ├── production/
    │   └── post-xbot-weekly.js          # Main script
    ├── utils/
    │   ├── xbot-scraper.js              # XBot.ninja data extraction
    │   ├── xbot-screenshot.js           # Screenshot capture logic
    │   └── twitter-image-post.js        # Tweet with image (extend existing)
    └── data/
        └── xbot-weekly-history.json     # Track posted winners (avoid repeats)
```

---

## 3. Implementation Components

### 3.1 XBot Data Scraper (`xbot-scraper.js`)

**Responsibilities:**
- Navigate to xbot.ninja
- Wait for dynamic content to load
- Extract top accounts and hashtags
- Filter out BWS-owned entities
- Return structured data

**Pseudo-code:**
```javascript
async function scrapeXBotTopPerformers(options = {}) {
  const {
    timePeriod = '7days',    // '7days', '30days', '90days'
    excludeAccounts = ['BWSCommunity', 'BWS'],
    excludeHashtags = ['BWS', 'BWSCommunity']
  } = options;

  // 1. Launch headless browser
  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage();

  // 2. Navigate to xbot.ninja
  await page.goto('https://xbot.ninja', { waitUntil: 'networkidle' });

  // 3. Select time period (if not default)
  // - Find time period selector
  // - Click appropriate option
  // - Wait for data to refresh

  // 4. Wait for leaderboard data to load
  await page.waitForSelector('[data-leaderboard="accounts"]', { timeout: 30000 });
  await page.waitForSelector('[data-leaderboard="hashtags"]', { timeout: 30000 });

  // Additional wait for content population
  await page.waitForTimeout(3000);

  // 5. Extract Top X Accounts
  const topAccounts = await page.$$eval('.account-leaderboard-item', items => {
    return items.map(item => ({
      rank: item.querySelector('.rank')?.textContent,
      username: item.querySelector('.username')?.textContent,
      score: item.querySelector('.performance-score')?.textContent,
      change: item.querySelector('.rank-change')?.textContent
    }));
  });

  // 6. Extract Top Hashtags
  const topHashtags = await page.$$eval('.hashtag-leaderboard-item', items => {
    return items.map(item => ({
      rank: item.querySelector('.rank')?.textContent,
      hashtag: item.querySelector('.hashtag')?.textContent,
      engagement: item.querySelector('.engagement-score')?.textContent,
      change: item.querySelector('.rank-change')?.textContent
    }));
  });

  // 7. Filter out BWS-owned entities
  const bestAccount = topAccounts.find(acc =>
    !excludeAccounts.some(excluded =>
      acc.username.toLowerCase().includes(excluded.toLowerCase())
    )
  );

  const bestHashtag = topHashtags.find(tag =>
    !excludeHashtags.some(excluded =>
      tag.hashtag.toLowerCase().includes(excluded.toLowerCase())
    )
  );

  await browser.close();

  return {
    account: bestAccount,
    hashtag: bestHashtag,
    scrapedAt: new Date().toISOString()
  };
}
```

**Challenges & Solutions:**

| Challenge | Solution |
|-----------|----------|
| **Unknown CSS selectors** | Inspect xbot.ninja DOM after load, identify patterns |
| **Content loads slowly** | Use `waitForTimeout(5000)` after networkidle |
| **API might fail** | Retry logic (3 attempts) with exponential backoff |
| **Selectors might change** | Use multiple selector strategies (class, data-attr, aria-label) |

### 3.2 Screenshot Capture (`xbot-screenshot.js`)

**Responsibilities:**
- Navigate to xbot.ninja with Playwright
- Wait for full rendering
- Capture specific sections or full page
- Save to file system

**Pseudo-code:**
```javascript
async function captureXBotLeaderboard(options = {}) {
  const {
    outputPath = './screenshots/xbot-weekly.png',
    viewport = { width: 1280, height: 720 },
    fullPage = false,
    selector = null  // Specific section to capture
  } = options;

  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport });

  // Navigate and wait for content
  await page.goto('https://xbot.ninja', { waitUntil: 'networkidle' });

  // CRITICAL: Wait for dynamic content to fully load
  await page.waitForSelector('[data-leaderboard="accounts"]', { timeout: 30000 });
  await page.waitForSelector('[data-leaderboard="hashtags"]', { timeout: 30000 });

  // Additional wait for charts/animations
  await page.waitForTimeout(5000);

  // Scroll to ensure all content is rendered
  if (fullPage) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
  }

  // Capture screenshot
  const screenshotOptions = {
    path: outputPath,
    fullPage,
    type: 'png'
  };

  if (selector) {
    // Capture specific element
    const element = await page.$(selector);
    await element.screenshot(screenshotOptions);
  } else {
    // Capture full page
    await page.screenshot(screenshotOptions);
  }

  await browser.close();

  return {
    path: outputPath,
    size: fs.statSync(outputPath).size
  };
}
```

**Screenshot Strategy Options:**

**Option A: Full Dashboard View**
```javascript
await captureXBotLeaderboard({
  outputPath: './screenshots/xbot-weekly.png',
  viewport: { width: 1920, height: 1080 },
  fullPage: false  // Capture above-the-fold content
});
```

**Option B: Specific Sections**
```javascript
// Top Accounts section only
await page.$('.accounts-leaderboard').screenshot({
  path: './screenshots/xbot-accounts.png'
});

// Top Hashtags section only
await page.$('.hashtags-leaderboard').screenshot({
  path: './screenshots/xbot-hashtags.png'
});

// Combine into single image with image processing
```

**Option C: Highlighted Winner Card**
```javascript
// Capture just the #1 account card (if exists)
await page.$('.account-leaderboard-item:first-child').screenshot({
  path: './screenshots/xbot-top-account.png'
});
```

### 3.3 Twitter Image Post Integration

**Extend existing Twitter posting utilities:**

```javascript
// In utils/twitter-image-post.js (NEW FILE)
import { TwitterApi } from 'twitter-api-v2';
import fs from 'fs';
import path from 'path';

async function tweetWithImage(options) {
  const {
    text,
    imagePath,
    altText = 'X Bot weekly leaderboard snapshot'
  } = options;

  // Initialize Twitter client
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET
  });

  // Upload media
  const mediaId = await client.v1.uploadMedia(imagePath, {
    mimeType: 'image/png',
    target: 'tweet'
  });

  // Add alt text for accessibility
  await client.v1.createMediaMetadata(mediaId, {
    alt_text: { text: altText }
  });

  // Post tweet with media
  const tweet = await client.v2.tweet({
    text,
    media: { media_ids: [mediaId] }
  });

  return tweet;
}
```

### 3.4 Main Orchestration Script (`post-xbot-weekly.js`)

**Flow:**
```javascript
#!/usr/bin/env node

import { scrapeXBotTopPerformers } from '../utils/xbot-scraper.js';
import { captureXBotLeaderboard } from '../utils/xbot-screenshot.js';
import { tweetWithImage } from '../utils/twitter-image-post.js';
import { sendToZapier } from '../utils/zapier-webhook.js';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('🏆 Starting X Bot Weekly Post...\n');

  try {
    // 1. Scrape top performers data
    console.log('📊 Scraping xbot.ninja data...');
    const data = await scrapeXBotTopPerformers({
      timePeriod: '7days',
      excludeAccounts: ['BWSCommunity', 'BWS'],
      excludeHashtags: ['BWS', 'BWSCommunity']
    });

    if (!data.account || !data.hashtag) {
      throw new Error('Failed to extract top performers data');
    }

    console.log(`✅ Best Account: @${data.account.username} (Score: ${data.account.score})`);
    console.log(`✅ Best Hashtag: #${data.hashtag.hashtag} (Engagement: ${data.hashtag.engagement})`);

    // 2. Capture screenshot
    console.log('\n📸 Capturing leaderboard screenshot...');
    const screenshotPath = path.join(process.cwd(), 'screenshots', `xbot-weekly-${Date.now()}.png`);

    await captureXBotLeaderboard({
      outputPath: screenshotPath,
      viewport: { width: 1280, height: 720 }
    });

    console.log(`✅ Screenshot saved: ${screenshotPath}`);

    // 3. Format tweet text
    const dateRange = getWeekDateRange(); // Helper to get "Dec 23-30"
    const tweetText = formatTweet({
      dateRange,
      account: data.account,
      hashtag: data.hashtag
    });

    console.log(`\n📝 Tweet text:\n${tweetText}\n`);

    // 4. Post to Twitter
    if (!process.env.DRY_RUN) {
      console.log('🐦 Posting to Twitter...');
      const tweet = await tweetWithImage({
        text: tweetText,
        imagePath: screenshotPath,
        altText: `X Bot weekly leaderboard showing top performer @${data.account.username} and trending hashtag #${data.hashtag.hashtag}`
      });

      console.log(`✅ Tweet posted: ${tweet.data.id}`);
      console.log(`   URL: https://twitter.com/BWSCommunity/status/${tweet.data.id}`);

      // 5. Send notification to Zapier
      await sendToZapier({
        Message: `✅ X Bot Weekly Post Published\n\nTop Account: @${data.account.username}\nTop Hashtag: #${data.hashtag.hashtag}\n\nTweet: https://twitter.com/BWSCommunity/status/${tweet.data.id}`,
        Type: 'SUCCESS',
        Process: 'xbot-weekly'
      });
    } else {
      console.log('⚠️  DRY RUN MODE - Tweet not posted');
    }

    // 6. Cleanup screenshot
    if (fs.existsSync(screenshotPath)) {
      fs.unlinkSync(screenshotPath);
      console.log('✅ Screenshot cleaned up');
    }

    // 7. Save to history
    saveToHistory(data, dateRange);

    console.log('\n✅ X Bot Weekly Post complete!');

  } catch (error) {
    console.error('❌ Error in X Bot Weekly Post:', error);

    // Send error notification
    await sendToZapier({
      Message: `❌ X Bot Weekly Post Failed\n\nError: ${error.message}`,
      Type: 'ERROR',
      Process: 'xbot-weekly'
    });

    process.exit(1);
  }
}

function formatTweet({ dateRange, account, hashtag }) {
  return `🏆 X Bot Weekly Winners (${dateRange})

👤 Top Performer: @${account.username}
   Performance Score: ${account.score}${account.change ? ` (${account.change})` : ''}

#️⃣ Trending Tag: #${hashtag.hashtag}
   Engagement: ${hashtag.engagement}

Real KOL analytics, zero bot farms.
Track your performance 👉 https://xbot.ninja

$BWS @BWSCommunity #crypto #KOL #analytics`;
}

function getWeekDateRange() {
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  const format = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  return `${format(lastWeek)}-${format(today)}`;
}

function saveToHistory(data, dateRange) {
  const historyPath = path.join(process.cwd(), 'scripts/crawling/data/xbot-weekly-history.json');

  let history = { posts: [] };
  if (fs.existsSync(historyPath)) {
    history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
  }

  history.posts.push({
    dateRange,
    account: data.account,
    hashtag: data.hashtag,
    postedAt: new Date().toISOString()
  });

  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
}

main();
```

---

## 4. GitHub Actions Workflow

### 4.1 Workflow File

**Location:** `.github/workflows/xbot-weekly-post.yml`

```yaml
name: X Bot Weekly Post

on:
  schedule:
    # Every Monday at 10:00 AM UTC
    - cron: '0 10 * * 1'
  workflow_dispatch:  # Manual trigger

jobs:
  post-xbot-weekly:
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          cd scripts/crawling
          npm install

      - name: Install Playwright browsers
        run: |
          cd scripts/crawling
          npx playwright install chromium
          npx playwright install-deps chromium

      - name: Create screenshots directory
        run: mkdir -p screenshots

      - name: Run X Bot Weekly Post
        env:
          TWITTER_API_KEY: ${{ secrets.TWITTER_API_KEY }}
          TWITTER_API_SECRET: ${{ secrets.TWITTER_API_SECRET }}
          TWITTER_ACCESS_TOKEN: ${{ secrets.TWITTER_ACCESS_TOKEN }}
          TWITTER_ACCESS_SECRET: ${{ secrets.TWITTER_ACCESS_SECRET }}
        run: |
          node scripts/crawling/production/post-xbot-weekly.js

      - name: Commit history updates
        if: success()
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add scripts/crawling/data/xbot-weekly-history.json
          git commit -m "chore: Update X Bot weekly post history" || echo "No changes to commit"
          git push

      - name: Cleanup screenshots
        if: always()
        run: rm -rf screenshots

      - name: Create summary
        if: always()
        run: |
          echo "## 🏆 X Bot Weekly Post" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "- **Status:** ${{ job.status }}" >> $GITHUB_STEP_SUMMARY
          echo "- **Date:** $(date +'%Y-%m-%d %H:%M UTC')" >> $GITHUB_STEP_SUMMARY
```

### 4.2 GitHub Actions Considerations

**Playwright Installation:**
- `playwright install chromium` - Installs browser binary
- `playwright install-deps chromium` - Installs system dependencies (fonts, libs)
- ~300MB download - first run takes 2-3 minutes

**Dynamic Content Loading:**
- GitHub Actions has good network speeds
- Typical xbot.ninja load time: 3-5 seconds
- Add 5-second buffer after networkidle: `waitForTimeout(5000)`

**Screenshot Quality:**
- Use headless: true for GitHub Actions
- Viewport: 1280x720 (optimal for Twitter)
- PNG format for best quality
- Typical file size: 100-500KB

**Timeout Management:**
- Workflow timeout: 15 minutes (generous)
- Page load timeout: 30 seconds
- Screenshot capture timeout: 10 seconds
- Total expected runtime: 2-3 minutes

---

## 5. Selector Discovery Strategy

**Before implementation, need to identify actual selectors:**

### 5.1 Manual Inspection Steps

1. **Open xbot.ninja in browser**
2. **Open DevTools (F12)**
3. **Wait for leaderboards to load**
4. **Inspect Top X Accounts section:**
   ```
   - Container selector: ?
   - Individual item selector: ?
   - Username element: ?
   - Score element: ?
   - Rank change element: ?
   ```
5. **Inspect Top Hashtags section:**
   ```
   - Container selector: ?
   - Individual item selector: ?
   - Hashtag element: ?
   - Engagement element: ?
   - Rank change element: ?
   ```

### 5.2 Selector Discovery Script

**Create a one-time inspection script:**

```javascript
// scripts/crawling/utils/inspect-xbot-selectors.js
import playwright from 'playwright';

async function discoverSelectors() {
  const browser = await playwright.chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://xbot.ninja', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);

  // Get page HTML structure
  const html = await page.content();
  console.log('Page loaded. Inspecting structure...\n');

  // Try to find common patterns
  const patterns = {
    'Top Accounts Container': ['[data-accounts]', '.accounts-leaderboard', '#accounts', '[class*="account"]'],
    'Top Hashtags Container': ['[data-hashtags]', '.hashtags-leaderboard', '#hashtags', '[class*="hashtag"]'],
    'Leaderboard Items': ['.leaderboard-item', '[class*="item"]', 'li', 'tr'],
    'Username/Hashtag': ['.username', '.name', '[class*="user"]', 'strong', 'b'],
    'Score/Engagement': ['.score', '.points', '[class*="score"]', 'span']
  };

  for (const [name, selectors] of Object.entries(patterns)) {
    console.log(`\n${name}:`);
    for (const selector of selectors) {
      const count = await page.$$eval(selector, els => els.length).catch(() => 0);
      if (count > 0) {
        console.log(`  ✅ ${selector} - found ${count} elements`);
      }
    }
  }

  // Wait for manual inspection
  console.log('\n\n🔍 Browser will stay open for manual inspection...');
  console.log('   Press Ctrl+C when done inspecting selectors.\n');
  await page.waitForTimeout(300000); // 5 minutes

  await browser.close();
}

discoverSelectors();
```

**Run this script locally to identify actual selectors before implementation.**

---

## 6. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   GitHub Actions Workflow                   │
│                    (Every Monday 10 AM UTC)                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
           ┌─────────────────────────────┐
           │   Install Playwright +      │
           │   Node Dependencies         │
           └─────────────┬───────────────┘
                         │
                         ▼
           ┌─────────────────────────────┐
           │  Run post-xbot-weekly.js    │
           └─────────────┬───────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
  ┌──────────┐   ┌──────────────┐  ┌──────────┐
  │  Scrape  │   │  Capture     │  │  Format  │
  │  Data    │──▶│  Screenshot  │──▶│  Tweet   │
  │  (xbot   │   │  (Playwright)│  │  Text    │
  │  .ninja) │   └──────────────┘  └────┬─────┘
  └──────────┘                          │
        │                               │
        │         ┌─────────────────────┘
        │         │
        ▼         ▼
  ┌──────────────────────┐
  │  Filter BWS/owned    │
  │  accounts/hashtags   │
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐
  │  Post to Twitter     │
  │  with Image          │
  └──────────┬───────────┘
             │
     ┌───────┴────────┐
     │                │
     ▼                ▼
┌─────────┐    ┌─────────────┐
│ Send    │    │ Save to     │
│ Zapier  │    │ History     │
│ Alert   │    │ JSON        │
└─────────┘    └─────────────┘
```

---

## 7. Testing Strategy

### 7.1 Local Testing

**Step 1: Selector Discovery**
```bash
node scripts/crawling/utils/inspect-xbot-selectors.js
# Manually note working selectors
```

**Step 2: Data Extraction Test**
```bash
# Test scraper in isolation
node -e "
import('./scripts/crawling/utils/xbot-scraper.js').then(m => {
  m.scrapeXBotTopPerformers().then(console.log);
});
"
```

**Step 3: Screenshot Test**
```bash
# Test screenshot capture
DRY_RUN=true node scripts/crawling/production/post-xbot-weekly.js
# Check generated screenshot manually
```

**Step 4: Full Integration Test (Dry Run)**
```bash
DRY_RUN=true node scripts/crawling/production/post-xbot-weekly.js
# Verifies: scraping + screenshot + formatting
# Does NOT post to Twitter
```

### 7.2 GitHub Actions Testing

**Manual Trigger:**
```yaml
# Trigger via GitHub UI:
# Actions → X Bot Weekly Post → Run workflow
```

**Test Checklist:**
- [ ] Playwright installs correctly
- [ ] xbot.ninja loads within timeout
- [ ] Data extraction succeeds
- [ ] Screenshot generates successfully
- [ ] Tweet format is correct
- [ ] History file commits properly

### 7.3 Edge Cases to Test

| Scenario | Expected Behavior |
|----------|-------------------|
| xbot.ninja is down | Retry 3 times, then fail with error notification |
| #1 account is @BWSCommunity | Skip to #2, #3, etc. until non-BWS found |
| All top 5 are BWS-owned | Post with note "BWS dominates top 5!" |
| Screenshot timeout | Retry once, fallback to text-only tweet |
| Twitter API fails | Log error, send Zapier alert, exit with code 1 |
| Content doesn't load | Wait longer (10s), retry, or fail gracefully |

---

## 8. Dependencies & Prerequisites

### 8.1 NPM Packages

**Add to scripts/crawling/package.json:**
```json
{
  "dependencies": {
    "playwright": "^1.40.0",
    "twitter-api-v2": "^1.15.0"
  }
}
```

**Already Available:**
- Node.js 20+
- File system operations
- Zapier webhook utilities

### 8.2 GitHub Secrets Required

```
TWITTER_API_KEY          (existing)
TWITTER_API_SECRET       (existing)
TWITTER_ACCESS_TOKEN     (existing)
TWITTER_ACCESS_SECRET    (existing)
```

**No new secrets needed** - reuse existing Twitter credentials.

### 8.3 System Requirements (GitHub Actions)

- Ubuntu latest (ubuntu-latest)
- Node.js 20
- Chromium browser (via Playwright)
- ~500MB disk space for browser binary
- Network access to xbot.ninja

---

## 9. Rollout Plan

### Phase 1: Preparation (1-2 days)
1. ✅ Inspect xbot.ninja selectors manually
2. ✅ Document actual CSS selectors/data attributes
3. ✅ Create selector discovery script

### Phase 2: Development (2-3 days)
1. ✅ Implement xbot-scraper.js
2. ✅ Implement xbot-screenshot.js
3. ✅ Implement twitter-image-post.js
4. ✅ Implement post-xbot-weekly.js
5. ✅ Test locally with DRY_RUN mode

### Phase 3: Integration (1 day)
1. ✅ Create GitHub Actions workflow file
2. ✅ Test manual workflow trigger
3. ✅ Verify screenshot quality
4. ✅ Verify tweet formatting

### Phase 4: Production (1 day)
1. ✅ Enable weekly schedule (Monday 10 AM UTC)
2. ✅ Monitor first automated run
3. ✅ Adjust based on results

**Total Estimated Time:** 4-7 days

---

## 10. Success Criteria

✅ **Automated weekly post goes live every Monday**
✅ **Screenshot captures xbot.ninja data clearly**
✅ **Top account and hashtag correctly identified (excluding BWS)**
✅ **Tweet posts successfully with image**
✅ **Zapier notifications confirm success/failure**
✅ **History tracking prevents duplicate features**
✅ **Zero manual intervention required**

---

## 11. Monitoring & Alerts

### 11.1 Success Metrics
- Weekly post published: ✅/❌
- Screenshot quality: Visual inspection
- Engagement on tweets: Track likes/retweets
- Error rate: <5% acceptable

### 11.2 Zapier Notifications

**Success Message:**
```
✅ X Bot Weekly Post Published

Top Account: @username
Top Hashtag: #tag

Tweet: https://twitter.com/BWSCommunity/status/{id}
```

**Failure Message:**
```
❌ X Bot Weekly Post Failed

Error: {error message}
Workflow: https://github.com/.../actions/runs/{run_id}
```

### 11.3 Manual Review

**Weekly checklist (first month):**
- [ ] Verify tweet posted
- [ ] Check screenshot quality
- [ ] Confirm correct account/hashtag
- [ ] Review engagement metrics
- [ ] Check for any errors in logs

---

## 12. Future Enhancements

### 12.1 Short-Term (30 days)
- [ ] Add performance score trend graphs to screenshot
- [ ] Include "Last Week's Winner" comparison
- [ ] A/B test posting times (Monday 10 AM vs Friday 3 PM)

### 12.2 Mid-Term (90 days)
- [ ] Multi-image post (accounts + hashtags as separate images)
- [ ] Video snippet showing leaderboard animation
- [ ] Thread format: Individual tweets for top 3 performers

### 12.3 Long-Term (6 months)
- [ ] Interactive web dashboard showing weekly history
- [ ] Hall of Fame: All-time top performers
- [ ] Monthly recap: Top accounts/hashtags of the month

---

**Document Version:** 1.0
**Created:** December 30, 2025
**Author:** Claude Sonnet 4.5
**Status:** 📋 PLANNING COMPLETE - Ready for implementation
**Next Step:** Run selector discovery script to identify actual DOM elements
