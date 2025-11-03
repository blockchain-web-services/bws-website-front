# Article Generation Automation

## Overview

This system automatically generates SEO-optimized article pages from product-related tweets posted by [@BWSCommunity](https://x.com/BWSCommunity). It runs daily to create fresh content that educates visitors about BWS products while improving search engine rankings.

## How It Works

### Daily Automation

The system runs automatically **every day at 10:00 AM UTC** via GitHub Actions.

**Schedule Details:**
- **Cron:** `0 10 * * *`
- **Frequency:** Once per day (1 hour after partnership fetch at 9 AM)
- **Time Zones:**
  - 10:00 AM UTC
  - 11:00 AM CET (Central European Time)
  - 5:00 AM EST (Eastern Standard Time)
  - 2:00 AM PST (Pacific Standard Time)

### Process Flow

1. **Fetch Tweets** - Retrieves last 50 tweets from @BWSCommunity
2. **Filter & Classify** - Identifies product-related tweets:
   - X Bot (community analytics)
   - Blockchain Badges (digital credentials)
   - ESG Credits (green finance)
   - Fan Game Cube (sports tokenization)
3. **Check Duplicates** - Verifies tweet hasn't been processed before
4. **Generate Content with AI:**
   - Article title (short, punchy)
   - Article subtitle (40-60 words, problem/solution focused)
   - Full article content (3+ sections with headings)
   - SEO meta description (150-160 chars)
5. **Extract Images** - Downloads up to 3 tweet images with fallback
6. **Create Files:**
   - Article page: `src/pages/articles/{slug}.astro`
   - Content component: `src/components/articles/{slug}MainContent.astro`
   - Article metadata entry in `src/data/articles.ts`
7. **Save Images** - Stores images in `/public/assets/images/articles/`
8. **Build Verification** - Runs Astro build to ensure site still compiles
9. **Track State** - Records tweet ID in `scripts/data/processed-article-tweets.json`
10. **Commit & Deploy** - Auto-commits changes and triggers site rebuild

### Error Handling

If the workflow fails, it automatically:
1. Creates a fix branch: `fix/article-generation-failure-{timestamp}-{sha}`
2. Creates a Pull Request with failure details
3. Creates an Issue for tracking
4. Provides debugging steps and common solutions

## Files & Structure

### Core Files

```
.github/workflows/
  └── generate-articles.yml          # Daily workflow automation

scripts/
  ├── generate-articles.js           # Main generation script
  └── data/
      └── processed-article-tweets.json  # State tracking (processed IDs)

public/assets/images/
  └── articles/                      # Downloaded article images
      ├── x-bot-*.jpg
      ├── blockchain-badges-*.jpg
      ├── esg-credits-*.jpg
      └── fan-game-cube-*.jpg

src/
  ├── data/
  │   └── articles.ts                # Article metadata
  ├── pages/articles/
  │   ├── x-bot-2025-10-18.astro
  │   ├── blockchain-badges-2025-10-18.astro
  │   ├── esg-credits-2025-10-18.astro
  │   └── fan-game-cube-2025-10-18.astro
  └── components/articles/
      ├── XBot20251018MainContent.astro
      ├── BlockchainBadges20251018MainContent.astro
      ├── EsgCredits20251018MainContent.astro
      └── FanGameCube20251018MainContent.astro
```

### Configuration Files

**State Tracking:** `scripts/data/processed-article-tweets.json`
```json
{
  "processedTweetIds": ["1972574130726641683", ...],
  "lastCheck": "2025-10-18T10:00:00Z",
  "lastSuccess": "2025-10-18T10:00:00Z",
  "failureCount": 0
}
```

## Product Classification

### Automatic Product Detection

The script automatically classifies tweets by product based on keywords and context:

**X Bot** (Community Analytics)
- Keywords: "X Bot", "XBot", "community tracking", "analytics", "KOL", "Telegram bot"
- Context: Social media monitoring, engagement metrics

**Blockchain Badges** (Digital Credentials)
- Keywords: "Blockchain Badges", "badge", "credential", "certification", "NFT badge"
- Context: Verifiable achievements, educational credentials

**ESG Credits** (Green Finance)
- Keywords: "ESG Credits", "green bond", "sustainability", "impact reporting", "ICMA"
- Context: Environmental finance, impact measurement

**Fan Game Cube** (Sports Tokenization)
- Keywords: "Fan Game Cube", "FGC", "sports", "stadium", "tokenization", "fan ownership"
- Context: Sports engagement, NFT ownership

## Generated Article Structure

### Article Page Format

Each article creates a full Astro page:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Navigation from '../../components/Navigation.astro';
import {Product}MainContent from '../../components/articles/{Product}MainContent.astro';
---

<BaseLayout title="{Article Title}" description="{SEO Description}">
  <Navigation />
  <{Product}MainContent />
</BaseLayout>
```

### Article Content Component

Each article's content component includes:

1. **Header Section:**
   - Publication date
   - Title (H1)
   - Subtitle paragraph

2. **Main Content:**
   - 3-5 sections with H3 headings
   - Problem/solution narrative
   - Key benefits and advantages
   - Proof points and use cases

3. **Floating Images:**
   - Up to 3 images from tweet
   - Float right with proper styling
   - Clickable lightbox functionality

4. **Call-to-Action:**
   - API Docs button
   - Contact Us button

5. **Image Lightbox:**
   - Full-screen overlay
   - Click to close
   - Keyboard navigation (Escape)

### Article Metadata Entry

```typescript
{
  slug: 'x-bot-2025-10-18',
  product: 'X Bot',
  title: 'X Bot: Automate Community Tracking and Boost Web3 Engagement',
  subtitle: 'Managing crypto community performance across X and Telegram...',
  publishDate: '2025-10-18T08:31:11.799Z',
  tweetId: '1972574130726641683',
  featuredImage: {
    src: '/assets/images/articles/x-bot-1760776271800.jpg',
    alt: 'X Bot - Article Title',
    loading: 'eager'
  },
  seoDescription: 'Learn how X Bot automates crypto community management...'
}
```

## Manual Execution

### Via GitHub Actions UI

1. Go to **Actions** tab in GitHub
2. Select **Generate Articles from X Posts** workflow
3. Click **Run workflow** button
4. Select branch (usually `master`)
5. Click **Run workflow**

### Locally (for testing)

```bash
# Set environment variables
export TWITTER_BEARER_TOKEN="your_bearer_token_here"
export ANTHROPIC_API_KEY="your_anthropic_api_key_here"

# Run script
node scripts/generate-articles.js
```

## Requirements

### GitHub Secrets

#### 1. **`TWITTER_BEARER_TOKEN`** - X API Bearer Token

Required for fetching tweets from @BWSCommunity account.

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

The script uses **Claude Sonnet 4.5** (claude-sonnet-4-5-20250929) to generate:

1. **Article Title** - Short, compelling headline
2. **Article Subtitle** - 40-60 word problem/solution statement
3. **Article Content** - 3+ sections with:
   - Introduction explaining the product
   - Key features and capabilities
   - Benefits and use cases
   - Proof points (if available)
4. **SEO Description** - 150-160 character meta description

### Content Guidelines

Articles are generated with these guidelines:
- **Problem-focused:** Start with the pain point
- **Solution-oriented:** Explain how the product solves it
- **Benefit-driven:** Emphasize value propositions
- **Proof-backed:** Use specific examples when possible
- **SEO-optimized:** Natural keyword integration
- **Readable:** Clear headings, short paragraphs

## Image Handling

### Image Priority Order

1. **Main Tweet Images** - Up to 3 images from the source tweet
2. **Quoted Tweet Images** - If main tweet has no images
3. **No Images** - Article generated without images (text only)

### Image Storage

- **Location:** `/public/assets/images/articles/`
- **Naming:** `{product}-{timestamp}.jpg`
- **Format:** JPEG (from Twitter API)
- **Layout:** Floating right in article content

### Image Lightbox

All article images include lightbox functionality:

```javascript
// Click to open full-screen view
img.onclick = function() {
  lightbox.style.display = 'flex';
  lightboxImg.src = this.getAttribute('data-image-src');
  document.body.style.overflow = 'hidden';
};

// Close with X button, background click, or Escape key
```

## Important: Separation from Success Stories

**CRITICAL:** Articles and Success Stories are completely separate systems.

### Articles System
- **Script:** `scripts/generate-articles.js`
- **Output:** `src/data/articles.ts` + article page files
- **Purpose:** SEO content, product education
- **Display:** Article pages at `/articles/*.html`

### Success Stories System
- **Script:** `scripts/fetch-success-stories.js`
- **Output:** `src/data/successStories.ts`
- **Purpose:** Customer partnerships, social proof
- **Display:** Marketplace carousel on homepage

**These scripts do NOT interact:** Each manages its own data files independently.

## Troubleshooting

### Common Issues

#### 1. No New Articles Generated

**Check:**
- Are there product-related tweets?
- Have they already been processed? (check `processed-article-tweets.json`)
- Is the workflow running? (check Actions tab)

**Solution:**
- Wait for new product tweets from @BWSCommunity
- Manually trigger workflow to test
- Check product classification keywords

#### 2. Workflow Failing

**Common Causes:**
- **Expired Bearer Token** - Update `TWITTER_BEARER_TOKEN` secret
- **Expired API Key** - Update `ANTHROPIC_API_KEY` secret
- **Rate Limit** - Wait for next scheduled run
- **API Changes** - Check API documentation

**Solution:**
- Review failure report in auto-created PR
- Check workflow logs in Actions tab
- Verify both secrets are valid
- Test script locally with valid credentials

#### 3. Build Failing After Article Creation

**Check:**
- Astro page syntax errors
- Missing imports or components
- Invalid image paths

**Solution:**
- Review build output in workflow logs
- Fix syntax errors in generated files
- Re-run workflow after manual fixes

#### 4. Images Not Displaying

**Check:**
- Is image file in `/public/assets/images/articles/`?
- Is image path correct in article component?
- Check browser console for 404 errors

**Solution:**
- Verify image path in component file
- Rebuild site: `npm run build`
- Check tweet actually has images

### Debugging Steps

#### Test Bearer Token
```bash
curl -H "Authorization: Bearer ${TWITTER_BEARER_TOKEN}" \
  "https://api.twitter.com/2/users/by/username/BWSCommunity"
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
node scripts/generate-articles.js
```

#### Check Product Classification
```bash
# Add debug logging to scripts/generate-articles.js
console.log('Classified as:', articleData.product);
```

## Monitoring

### Workflow Status

- **Actions Tab:** View all workflow runs and their status
- **Email Notifications:** GitHub sends emails on workflow failures
- **Issues:** Auto-created when workflow fails with detailed reports
- **PRs:** Auto-created fix branches for investigation

### Success Indicators

- ✅ Workflow completes successfully
- ✅ New entries in `src/data/articles.ts`
- ✅ New article page files created
- ✅ Images downloaded to `/public/assets/images/articles/`
- ✅ Tweet ID added to `processed-article-tweets.json`
- ✅ Build succeeds
- ✅ Changes committed to repository

### Failure Indicators

- ❌ Workflow fails (red X in Actions tab)
- ❌ Issue created with "article-generation" label
- ❌ PR created with "needs-fix" label
- ❌ `failureCount` incremented in `processed-article-tweets.json`

## Maintenance

### Updating Schedule

To change the daily run time, edit the cron expression in `.github/workflows/generate-articles.yml`:

```yaml
on:
  schedule:
    - cron: '0 10 * * *'  # Modify this line
```

**Examples:**
- `0 8 * * *` - 8:00 AM UTC daily
- `0 */12 * * *` - Every 12 hours
- `0 10 * * 1,3,5` - 10:00 AM UTC on Mon, Wed, Fri

### Adding New Products

To support a new product:

1. Add product classification logic in `scripts/generate-articles.js`:
```javascript
function classifyProduct(tweetText) {
  const lowerText = tweetText.toLowerCase();

  // Add new product
  if (lowerText.includes('new product') || lowerText.includes('keyword')) {
    return 'New Product';
  }

  // ... existing products
}
```

2. Update Claude prompt to understand new product context

3. Test with sample tweet locally

### Resetting Processed Tweets

To re-process tweets (e.g., after testing):

```bash
# Backup current state
cp scripts/data/processed-article-tweets.json scripts/data/processed-article-tweets.json.backup

# Reset to empty state
echo '{"processedTweetIds":[],"lastCheck":null,"lastSuccess":null,"failureCount":0}' > scripts/data/processed-article-tweets.json
```

## API Limits

### X API v2 Rate Limits (with Bearer Token)

- **User Timeline:** 1,500 requests per 15 minutes (per app)
- **User Lookup:** 900 requests per 15 minutes (per app)

### Anthropic API Rate Limits

- **Claude Sonnet 4.5:** 50 requests per minute (tier-dependent)
- **Max Tokens:** 200,000 per request

### Script Consumption

One workflow run uses:
- 1-2 X API requests (user lookup + timeline)
- 1-4 Claude API requests (per new article)

**Monthly Usage:** ~100 X API requests, ~120 Claude requests (daily runs)

This is well within free tier limits for both APIs.

## Best Practices

1. **Monitor Workflow Runs** - Check Actions tab regularly
2. **Review Generated Content** - Ensure quality before publishing
3. **Update API Keys** - Rotate credentials before expiration
4. **Test Locally First** - Verify changes with test runs
5. **Check Product Classification** - Ensure tweets are correctly categorized
6. **Verify Image Quality** - Check images display properly
7. **SEO Optimization** - Review meta descriptions for effectiveness

## Support

### Getting Help

1. **Check Logs:** Actions tab > Workflow run > Job details
2. **Review Auto-Created Issue:** Failure reports have debugging steps
3. **Test Locally:** Run script with your API credentials
4. **Check API Status:**
   - [Twitter API Status](https://api.twitterstat.us/)
   - [Anthropic Status](https://status.anthropic.com/)

### Reporting Issues

When reporting issues, include:
- Workflow run ID
- Error message from logs
- Tweet ID(s) that failed
- Product classification result
- API credential status (valid/expired)

## Related Documentation

- [GitHub Actions Workflows](./GITHUB_ACTIONS.md)
- [Success Stories Automation](./SUCCESS_STORIES_AUTOMATION.md)
- [Twitter Partnership Automation](./TWITTER_PARTNERSHIP_AUTOMATION.md)
- [Architecture Overview](../ARCHITECTURE.md)
