# Twitter Partnership Automation

## Overview

This system automatically fetches partnership announcements from the [@BWSCommunity](https://x.com/BWSCommunity) X (Twitter) account and adds them to the news carousel on the BWS website.

## How It Works

### Daily Automation

The system runs automatically **every day at 9:00 AM UTC** via GitHub Actions.

**Schedule Details:**
- **Cron:** `0 9 * * *`
- **Frequency:** Once per day
- **Time Zones:**
  - 9:00 AM UTC
  - 10:00 AM CET (Central European Time)
  - 4:00 AM EST (Eastern Standard Time)
  - 1:00 AM PST (Pacific Standard Time)

### Process Flow

1. **Fetch Tweets** - Retrieves the last 50 tweets from @BWSCommunity
2. **Filter** - Identifies tweets starting with "Partnership"
3. **Check Duplicates** - Verifies tweet hasn't been processed before
4. **Extract Content:**
   - Tweet text (for title and description)
   - Images (with 3-tier priority):
     1. Main tweet image
     2. Quoted/retweeted image
     3. Fallback: BWS violet flying logo
5. **Download Images** - Saves images to `/public/assets/images/news/`
6. **Update News** - Adds entry to `src/data/news.ts`
7. **Track State** - Records tweet ID in `scripts/data/processed-tweets.json`
8. **Commit & Deploy** - Auto-commits changes and triggers site rebuild

### Error Handling

If the workflow fails, it automatically:
1. Creates a fix branch: `fix/twitter-fetch-failure-{timestamp}-{sha}`
2. Creates a Pull Request with failure details
3. Creates an Issue for tracking
4. Provides debugging steps and common solutions

## Files & Structure

### Core Files

```
.github/workflows/
  └── fetch-twitter-partnerships.yml   # Daily workflow automation

scripts/
  ├── fetch-twitter-partnerships.js    # Main fetch script
  └── data/
      └── processed-tweets.json        # State tracking (processed IDs)

public/assets/images/
  ├── logos/
  │   └── bws-logo-violet-flying.png   # Fallback image
  └── news/
      └── partnership-*.jpg            # Downloaded partnership images

src/data/
  └── news.ts                          # News carousel data
```

### Configuration Files

**State Tracking:** `scripts/data/processed-tweets.json`
```json
{
  "processedTweetIds": ["1975576723337982186", ...],
  "lastCheck": "2025-01-15T09:00:00Z",
  "lastSuccess": "2025-01-15T09:00:00Z",
  "failureCount": 0
}
```

## Manual Execution

### Via GitHub Actions UI

1. Go to **Actions** tab in GitHub
2. Select **Fetch Twitter Partnerships** workflow
3. Click **Run workflow** button
4. Select branch (usually `main` or `master`)
5. Click **Run workflow**

### Locally (for testing)

```bash
# Set environment variable
export TWITTER_BEARER_TOKEN="your_bearer_token_here"

# Run script
node scripts/fetch-twitter-partnerships.js
```

## Requirements

### GitHub Secrets

The workflow requires one secret to be configured:

**`TWITTER_BEARER_TOKEN`** - X API Bearer Token (read-only access)

#### How to Set Up:

1. Go to Repository **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret**
3. Name: `TWITTER_BEARER_TOKEN`
4. Value: Your X API bearer token
5. Click **Add secret**

#### How to Obtain Bearer Token:

1. Visit [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create/select your app
3. Go to **Keys and Tokens** tab
4. Generate/copy **Bearer Token**

### Dependencies

The script uses:
- `twitter-api-v2` npm package (installed automatically by workflow)
- Node.js 20 (configured in workflow)

## News Entry Format

Each partnership announcement creates an entry like:

```typescript
{
  title: 'Partnership: {Partner Name}',
  description: '{Tweet text cleaned and formatted}',
  partnershipTitle: '{Partner Name}',
  logos: [{
    src: '/assets/images/news/partnership-{timestamp}-{tweetId}.jpg',
    alt: '{Partner Name} partnership',
    href: 'https://x.com/BWSCommunity/status/{tweetId}',
    class: 'image-partnership'
  }],
  buttons: [{
    text: 'View Announcement',
    href: 'https://x.com/BWSCommunity/status/{tweetId}',
    type: 'secondary',
    target: '_blank',
    hasArrow: true
  }]
}
```

## Image Handling

### Priority Order

1. **Main Tweet** - If tweet has an attached image, use it
2. **Quoted Tweet** - If no main image, check quoted/retweeted content
3. **Fallback** - Use `/assets/images/logos/bws-logo-violet-flying.png`

### Image Storage

- **Location:** `/public/assets/images/news/`
- **Naming:** `partnership-{timestamp}-{tweetId}.jpg`
- **Format:** JPEG (from Twitter API)
- **CSS Class:** `.image-partnership`

### CSS Styling

Partnership images use the `.image-partnership` class defined in `public/styles.css`:

```css
html body .announcement-flex-logos img.image-partnership {
  max-width: 180px !important;
  max-height: 120px !important;
  width: auto !important;
  height: auto !important;
  object-fit: contain !important;
}
```

## Troubleshooting

### Common Issues

#### 1. No New Partnerships Detected

**Check:**
- Are there tweets starting with "Partnership"?
- Have they already been processed? (check `processed-tweets.json`)
- Is the workflow running? (check Actions tab)

**Solution:**
- Wait for new partnership tweets from @BWSCommunity
- Manually trigger workflow to test

#### 2. Workflow Failing

**Common Causes:**
- **Expired Bearer Token** - Update `TWITTER_BEARER_TOKEN` secret
- **Rate Limit** - Wait for next scheduled run
- **API Changes** - Check [X API docs](https://developer.x.com/en/docs/x-api) for updates

**Solution:**
- Review failure report in auto-created PR
- Check workflow logs in Actions tab
- Verify bearer token is valid

#### 3. Images Not Displaying

**Check:**
- Is image file in `/public/assets/images/news/`?
- Is CSS class `.image-partnership` defined?
- Check browser console for 404 errors

**Solution:**
- Verify image path in `news.ts`
- Rebuild site: `npm run build`
- Check fallback image exists

### Debugging Steps

#### Test Bearer Token
```bash
curl -H "Authorization: Bearer ${TWITTER_BEARER_TOKEN}" \
  "https://api.twitter.com/2/users/by/username/BWSCommunity"
```

#### Check Rate Limits
```bash
curl -H "Authorization: Bearer ${TWITTER_BEARER_TOKEN}" \
  "https://api.twitter.com/2/users/by/username/BWSCommunity" \
  -i | grep x-rate-limit
```

#### Run Script Locally
```bash
export TWITTER_BEARER_TOKEN="your_token"
node scripts/fetch-twitter-partnerships.js
```

## Monitoring

### Workflow Status

- **Actions Tab:** View all workflow runs and their status
- **Email Notifications:** GitHub sends emails on workflow failures
- **Issues:** Auto-created when workflow fails

### Success Indicators

- ✅ Workflow completes successfully
- ✅ New entry appears in `src/data/news.ts`
- ✅ Image downloaded to `/public/assets/images/news/`
- ✅ Tweet ID added to `processed-tweets.json`
- ✅ Changes committed to repository

### Failure Indicators

- ❌ Workflow fails (red X in Actions tab)
- ❌ Issue created with "twitter-fetch" label
- ❌ PR created with "needs-fix" label
- ❌ `failureCount` incremented in `processed-tweets.json`

## Maintenance

### Updating Schedule

To change the daily run time, edit the cron expression in `.github/workflows/fetch-twitter-partnerships.yml`:

```yaml
on:
  schedule:
    - cron: '0 9 * * *'  # Modify this line
```

**Cron format:** `minute hour day month weekday`

Examples:
- `0 6 * * *` - 6:00 AM UTC daily
- `0 */6 * * *` - Every 6 hours
- `0 9 * * 1` - 9:00 AM UTC every Monday

### Cleaning Old Images

To remove old partnership images (optional):

```bash
# List images older than 90 days
find public/assets/images/news/ -name "partnership-*.jpg" -mtime +90

# Delete images older than 90 days
find public/assets/images/news/ -name "partnership-*.jpg" -mtime +90 -delete
```

### Resetting Processed Tweets

To re-process tweets (e.g., after testing):

```bash
# Backup current state
cp scripts/data/processed-tweets.json scripts/data/processed-tweets.json.backup

# Reset to empty state
echo '{"processedTweetIds":[],"lastCheck":null,"lastSuccess":null,"failureCount":0}' > scripts/data/processed-tweets.json
```

## API Limits

### X API v2 Rate Limits (with Bearer Token)

- **User Timeline:** 1,500 requests per 15 minutes (per app)
- **User Lookup:** 900 requests per 15 minutes (per app)

### Script Consumption

One workflow run uses:
- 1 user lookup request (get @BWSCommunity ID)
- 1 timeline request (fetch up to 50 tweets)

**Total:** ~100 requests per month (daily runs)

This is well within free tier limits.

## Support

### Getting Help

1. **Check Logs:** Actions tab > Workflow run > Job details
2. **Review Issue:** Auto-created issues have debugging steps
3. **Test Locally:** Run script with your bearer token
4. **Check API Status:** Visit [Twitter API Status](https://api.twitterstat.us/)

### Reporting Issues

When reporting issues, include:
- Workflow run ID
- Error message from logs
- Tweet ID(s) that failed
- Bearer token status (valid/expired)

## Related Documentation

- [X API v2 Documentation](https://developer.x.com/en/docs/x-api)
- [twitter-api-v2 npm package](https://www.npmjs.com/package/twitter-api-v2)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [BWS Architecture](./ARCHITECTURE.md)
- [Testing Guide](./TESTING.md)
