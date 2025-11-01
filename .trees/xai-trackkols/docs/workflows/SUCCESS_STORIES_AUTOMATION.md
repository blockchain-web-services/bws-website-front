# Success Stories Automation

## Overview

This system automatically fetches customer success stories and partnership highlights from X (Twitter) and displays them on the marketplace carousel. It runs daily to showcase real customer partnerships and validate BWS products through social proof.

## How It Works

### Daily Automation

The system runs automatically **every day at 11:00 AM UTC** via GitHub Actions.

**Schedule Details:**
- **Cron:** `0 11 * * *`
- **Frequency:** Once per day (1 hour after article generation at 10 AM)
- **Time Zones:**
  - 11:00 AM UTC
  - 12:00 PM CET (Central European Time)
  - 6:00 AM EST (Eastern Standard Time)
  - 3:00 AM PST (Pacific Standard Time)

### Process Flow

1. **Fetch Tweets** - Searches for tweets containing "Success Story"
2. **Process Manual Stories** - Loads manually configured success stories from JSON config
3. **Check Duplicates** - Verifies tweet hasn't been processed before
4. **Extract Content:**
   - Client/partner name
   - Partnership details
   - Tweet images (with size validation)
5. **Generate AI Summary** - Uses Claude API to create client-focused descriptions highlighting:
   - Partner organization name
   - Key capabilities delivered
   - Business value and impact
6. **Validate Images** - Ensures images meet minimum size requirements (400x300px)
7. **Download Images** - Saves images to `/public/assets/images/success-stories/`
8. **Update Success Stories** - Writes to `src/data/successStories.ts`
9. **Track State** - Records tweet ID in `scripts/data/processed-success-story-tweets.json`
10. **Commit & Deploy** - Auto-commits changes and triggers site rebuild

### Error Handling

If the workflow fails, it automatically:
1. Creates a fix branch: `fix/success-stories-fetch-failure-{timestamp}-{sha}`
2. Creates a Pull Request with failure details
3. Creates an Issue for tracking
4. Provides debugging steps and common solutions

## Files & Structure

### Core Files

```
.github/workflows/
  └── fetch-success-stories.yml      # Daily workflow automation

scripts/
  ├── fetch-success-stories.js       # Main fetch script
  └── data/
      ├── processed-success-story-tweets.json  # State tracking
      └── manual-success-stories.json          # Manual config

public/assets/images/
  └── success-stories/               # Downloaded partnership images
      ├── blockchain-badges-1894436368530428316.jpg
      ├── blockchain-badges-1883112146369651124.jpg
      └── blockchain-badges-1881416481377861689.jpg

src/data/
  └── successStories.ts              # Success stories data
```

### Configuration Files

**State Tracking:** `scripts/data/processed-success-story-tweets.json`
```json
{
  "processedTweetIds": ["1894436368530428316", ...],
  "lastCheck": "2025-10-18T11:00:00Z",
  "lastSuccess": "2025-10-18T11:00:00Z",
  "failureCount": 0
}
```

**Manual Stories Config:** `scripts/data/manual-success-stories.json`
```json
{
  "manualStories": [
    {
      "tweetId": "1894436368530428316",
      "tweetUrl": "https://x.com/BWSCommunity/status/1894436368530428316",
      "product": "Blockchain Badges",
      "partnerName": "DeFi Talents",
      "description": "BWS partners with DeFi Talents to pilot blockchain badges..."
    }
  ]
}
```

## Success Story Entry Format

Each success story creates an entry like:

```typescript
{
  product: 'Blockchain Badges',
  title: 'DeFi Talents Partnership Launch',
  description: 'BWS partners with DeFi Talents, a leading Web3 talent development program, to pilot verifiable badge issuance for educational credentials. Key capabilities:<ul><li>Testing phase for blockchain-certified digital credentials</li><li>Verifiable badges for hundreds of Web3 students</li><li>Immutable achievement recognition across platforms</li></ul>This partnership validates student accomplishments in the growing Web3 ecosystem.',
  image: {
    src: '/assets/images/success-stories/blockchain-badges-1894436368530428316.jpg',
    alt: 'Blockchain Badges - DeFi Talents Partnership Launch',
    loading: 'lazy',
    sizes: '(max-width: 767px) 100vw, (max-width: 991px) 95vw, 829px'
  },
  buttons: [
    {
      text: 'View Post',
      href: 'https://x.com/BWSCommunity/status/1894436368530428316',
      target: '_blank',
      hasArrow: true
    },
    {
      text: 'Learn More',
      href: '/marketplace/blockchain-badges.html',
      hasArrow: true
    },
  ],
  tweetUrl: 'https://x.com/BWSCommunity/status/1894436368530428316',
  tweetId: '1894436368530428316'
}
```

## Manual Execution

### Via GitHub Actions UI

1. Go to **Actions** tab in GitHub
2. Select **Fetch Success Stories** workflow
3. Click **Run workflow** button
4. Select branch (usually `master`)
5. Click **Run workflow**

### Locally (for testing)

```bash
# Set environment variables
export TWITTER_BEARER_TOKEN="your_bearer_token_here"
export ANTHROPIC_API_KEY="your_anthropic_api_key_here"

# Run script
node scripts/fetch-success-stories.js
```

## Requirements

### GitHub Secrets

#### 1. **`TWITTER_BEARER_TOKEN`** - X API Bearer Token

Required for fetching success story tweets.

**How to Set Up:**
1. Go to Repository **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret**
3. Name: `TWITTER_BEARER_TOKEN`
4. Value: Your X API bearer token
5. Click **Add secret**

#### 2. **`ANTHROPIC_API_KEY`** - Anthropic Claude API Key

Required for AI-powered content generation.

**How to Set Up:**
1. Go to Repository **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret**
3. Name: `ANTHROPIC_API_KEY`
4. Value: Your Anthropic API key
5. Click **Add secret**

### Dependencies

The script uses:
- `twitter-api-v2` npm package (installed by workflow)
- `@anthropic-ai/sdk` npm package (installed by workflow)
- Node.js 20 (configured in workflow)

## AI-Generated Content

### Claude API Usage

The script uses **Claude Sonnet 4.5** to generate:

1. **Story Title** - Short carousel title (3-5 words focusing on partner)
2. **Story Description** - Client-focused summary (30-50 words) including:
   - Partner organization name prominently featured
   - Key capabilities delivered
   - Business value and impact
   - HTML unordered list with 3 key points

### Content Guidelines

Success stories emphasize:
- **Client-First:** Partner name featured prominently
- **Value-Focused:** Business outcomes and benefits
- **Specific:** Concrete capabilities and use cases
- **Proof-Driven:** Real partnership validation
- **Structured:** Bullet points for scannability

## Image Handling

### Image Requirements

Success story images must meet minimum size requirements:
- **Minimum Width:** 400px
- **Minimum Height:** 300px
- **Format:** JPEG (from Twitter API)
- **Source Priority:**
  1. Main tweet image (if meets size requirements)
  2. Quoted/retweeted image (if meets size requirements)
  3. Skip story if no valid images found

### Image Storage

- **Location:** `/public/assets/images/success-stories/`
- **Naming:** `{product-slug}-{tweetId}.jpg`
- **Display:** Marketplace carousel with Swiper.js
- **Lightbox:** Clickable images with full-screen overlay

### Image Lightbox

Success story images include lightbox functionality:

```javascript
// Unique lightbox ID to avoid conflicts with articles
const lightbox = document.createElement('div');
lightbox.id = 'success-story-lightbox';  // Different from article-image-lightbox

// Click to open full-screen view
img.onclick = function() {
  lightbox.style.display = 'flex';
  lightboxImg.src = this.getAttribute('data-image-src');
  document.body.style.overflow = 'hidden';
};
```

## Important: Separation from Articles

**CRITICAL:** Success Stories and Articles are completely separate systems.

### Success Stories System
- **Script:** `scripts/fetch-success-stories.js`
- **Output:** `src/data/successStories.ts`
- **Purpose:** Customer partnerships, social proof
- **Display:** Marketplace carousel on homepage
- **Focus:** Real client partnerships

### Articles System
- **Script:** `scripts/generate-articles.js`
- **Output:** `src/data/articles.ts` + article page files
- **Purpose:** SEO content, product education
- **Display:** Article pages at `/articles/*.html`
- **Focus:** Product features and benefits

**These scripts do NOT interact:** Each manages its own data files independently.

## Display on Website

### Marketplace Carousel

Success stories appear in the marketplace carousel on the homepage:

**Component:** `src/components/home/MarketplaceAnnouncementCarousel.astro`

**Features:**
- Swiper.js carousel with navigation
- 3 slides visible on desktop, 1 on mobile
- Auto-rotation every 5 seconds
- Clickable images with lightbox
- "View Post" and "Learn More" buttons

**CSS Styling:**
```css
.success-story-image-clickable {
  cursor: pointer;
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}
```

## Troubleshooting

### Common Issues

#### 1. No New Success Stories Found

**Check:**
- Are there tweets with "Success Story" text?
- Have they already been processed?
- Do images meet minimum size requirements (400x300)?
- Is manual config valid JSON?

**Solution:**
- Wait for new success story tweets from @BWSCommunity
- Manually trigger workflow to test
- Check image sizes in tweet
- Validate `manual-success-stories.json` format

#### 2. Workflow Failing

**Common Causes:**
- **Expired Bearer Token** - Update `TWITTER_BEARER_TOKEN` secret
- **Expired API Key** - Update `ANTHROPIC_API_KEY` secret
- **Invalid Manual Config** - Check `manual-success-stories.json` syntax
- **Image Too Small** - Tweet images don't meet 400x300 minimum
- **Rate Limit** - Wait for next scheduled run

**Solution:**
- Review failure report in auto-created PR
- Check workflow logs in Actions tab
- Verify both secrets are valid
- Validate manual config JSON
- Test script locally

#### 3. Images Not Displaying

**Check:**
- Is image file in `/public/assets/images/success-stories/`?
- Is image path correct in `successStories.ts`?
- Check browser console for 404 errors
- Verify carousel component imports data correctly

**Solution:**
- Verify image path matches file name
- Rebuild site: `npm run build`
- Check tweet actually has images
- Ensure images meet minimum size

#### 4. Build Failing After Update

**Check:**
- TypeScript syntax errors in `successStories.ts`
- Invalid image paths
- Missing button properties

**Solution:**
- Review build output in workflow logs
- Validate TypeScript syntax
- Fix any missing required fields
- Re-run workflow after manual fixes

### Debugging Steps

#### Test Bearer Token
```bash
curl -H "Authorization: Bearer ${TWITTER_BEARER_TOKEN}" \
  "https://api.twitter.com/2/tweets/search/recent?query=from:BWSCommunity Success Story"
```

#### Test Anthropic API Key
```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: ${ANTHROPIC_API_KEY}" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-sonnet-4-5-20250929","max_tokens":100,"messages":[{"role":"user","content":"test"}]}'
```

#### Run Script Locally
```bash
export TWITTER_BEARER_TOKEN="your_token"
export ANTHROPIC_API_KEY="your_key"
node scripts/fetch-success-stories.js
```

#### Validate Manual Config
```bash
# Check JSON syntax
node -e "console.log(JSON.parse(require('fs').readFileSync('scripts/data/manual-success-stories.json')))"
```

## Monitoring

### Workflow Status

- **Actions Tab:** View all workflow runs and their status
- **Email Notifications:** GitHub sends emails on workflow failures
- **Issues:** Auto-created when workflow fails
- **PRs:** Auto-created fix branches for investigation

### Success Indicators

- ✅ Workflow completes successfully
- ✅ New entries in `src/data/successStories.ts`
- ✅ Images downloaded to `/public/assets/images/success-stories/`
- ✅ Tweet IDs added to `processed-success-story-tweets.json`
- ✅ Build succeeds
- ✅ Changes committed to repository
- ✅ Stories visible in marketplace carousel

### Failure Indicators

- ❌ Workflow fails (red X in Actions tab)
- ❌ Issue created with "success-stories" label
- ❌ PR created with "needs-fix" label
- ❌ `failureCount` incremented in tracking file
- ❌ No new stories in carousel

## Maintenance

### Updating Schedule

To change the daily run time, edit the cron expression in `.github/workflows/fetch-success-stories.yml`:

```yaml
on:
  schedule:
    - cron: '0 11 * * *'  # Modify this line
```

### Adding Manual Success Stories

To add a success story manually:

1. Edit `scripts/data/manual-success-stories.json`:
```json
{
  "manualStories": [
    {
      "tweetId": "1234567890",
      "tweetUrl": "https://x.com/BWSCommunity/status/1234567890",
      "product": "Blockchain Badges",
      "partnerName": "Acme Corp",
      "description": "Partnership description..."
    }
  ]
}
```

2. Run workflow manually or wait for daily run

3. Verify story appears in marketplace carousel

### Resetting Processed Tweets

To re-process tweets (e.g., after testing):

```bash
# Backup current state
cp scripts/data/processed-success-story-tweets.json scripts/data/processed-success-story-tweets.json.backup

# Reset to empty state
echo '{"processedTweetIds":[],"lastCheck":null,"lastSuccess":null,"failureCount":0}' > scripts/data/processed-success-story-tweets.json
```

## API Limits

### X API v2 Rate Limits (with Bearer Token)

- **Tweet Search:** 450 requests per 15 minutes (per app)
- **User Lookup:** 900 requests per 15 minutes (per app)

### Anthropic API Rate Limits

- **Claude Sonnet 4.5:** 50 requests per minute (tier-dependent)
- **Max Tokens:** 200,000 per request

### Script Consumption

One workflow run uses:
- 1-2 X API requests (search + user lookup)
- 1-3 Claude API requests (per new story)

**Monthly Usage:** ~60 X API requests, ~90 Claude requests (daily runs)

This is well within free tier limits for both APIs.

## Best Practices

1. **Curate Manual Stories** - Add high-quality partnerships manually
2. **Verify Image Quality** - Ensure images are professional and clear
3. **Monitor Carousel** - Check stories display correctly on homepage
4. **Update API Keys** - Rotate credentials before expiration
5. **Review Generated Content** - Ensure partner names are highlighted
6. **Maintain Diversity** - Mix different products and use cases
7. **Test Lightbox** - Verify clickable images work properly

## Support

### Getting Help

1. **Check Logs:** Actions tab > Workflow run > Job details
2. **Review Auto-Created Issue:** Failure reports have debugging steps
3. **Test Locally:** Run script with your API credentials
4. **Validate Config:** Check manual-success-stories.json format
5. **Check API Status:**
   - [Twitter API Status](https://api.twitterstat.us/)
   - [Anthropic Status](https://status.anthropic.com/)

### Reporting Issues

When reporting issues, include:
- Workflow run ID
- Error message from logs
- Tweet ID(s) that failed
- Image size information
- API credential status
- Manual config validation results

## Related Documentation

- [GitHub Actions Workflows](./GITHUB_ACTIONS.md)
- [Article Generation](./ARTICLE_GENERATION.md)
- [Twitter Partnership Automation](./TWITTER_PARTNERSHIP_AUTOMATION.md)
- [Architecture Overview](../ARCHITECTURE.md)
