# X/Twitter KOL Engagement System

An automated system for discovering and engaging with crypto Key Opinion Leaders (KOLs) on X (Twitter) to increase BWS product awareness and endorsement.

## Overview

This system consists of three main processes:

1. **KOL Discovery** - Automatically discovers crypto KOLs by traversing follow relationships
2. **Tweet Evaluation & Reply** - Analyzes KOL tweets and generates contextual product mentions
3. **Analytics & Reporting** - Tracks engagement metrics and provides weekly insights

**Product Information Source:**
The system reads BWS product information directly from `scripts/data/docs-index.json`. This file is maintained by your documentation crawler and should NOT be moved or copied. When documentation is updated, the KOL system automatically uses the latest product information on its next run.

## Features

- 🔍 **Intelligent KOL Discovery**: Uses AI to identify genuine crypto KOLs vs. businesses/bots
- 🤖 **AI-Powered Content Analysis**: Claude evaluates tweet relevance and generates natural replies
- 📊 **Comprehensive Analytics**: Weekly reports with engagement metrics and recommendations
- 🛡️ **Spam Prevention**: Built-in safeguards to avoid spam detection
- ⚙️ **Highly Configurable**: All parameters adjustable without code changes
- 🔄 **Automated Workflows**: Daily discovery, reply, and weekly analytics via GitHub Actions

## Directory Structure

```
scripts/kols/
├── config/
│   └── kol-config.json          # Main configuration file
├── data/                         # Data storage (gitignored)
│   ├── .gitkeep
│   ├── *.template.json           # Structure templates
│   ├── kols-data.json            # KOL database
│   ├── kol-replies.json          # Reply history
│   ├── processed-posts.json      # Deduplication tracking
│   └── kol-metrics.json          # Analytics data
├── utils/
│   ├── kol-utils.js              # Common utilities
│   ├── twitter-client.js         # Twitter API wrapper
│   └── claude-client.js          # Claude AI wrapper
├── discover-kols.js              # KOL discovery script
├── evaluate-and-reply-kols.js    # Reply generation script
├── analyze-kol-engagement.js     # Analytics script
├── test-kol-system.js            # System validation script
└── README.md                     # This file
```

## Prerequisites

### Required API Keys

1. **Twitter/X API Credentials (for @BWSXAI account)**
   - Read access: `BWSXAI_TWITTER_BEARER_TOKEN`
   - Write access (for posting):
     - `BWSXAI_TWITTER_API_KEY`
     - `BWSXAI_TWITTER_API_SECRET`
     - `BWSXAI_TWITTER_ACCESS_TOKEN`
     - `BWSXAI_TWITTER_ACCESS_SECRET`

2. **Anthropic Claude API**
   - `ANTHROPIC_API_KEY`

**Note:** The `BWSXAI_` prefix is used to distinguish these credentials from other Twitter accounts in the project.

### Environment Setup

Create a `.env` file in the project root:

```bash
# Twitter API for @BWSXAI account
BWSXAI_TWITTER_BEARER_TOKEN=your_bearer_token_here
BWSXAI_TWITTER_API_KEY=your_api_key_here
BWSXAI_TWITTER_API_SECRET=your_api_secret_here
BWSXAI_TWITTER_ACCESS_TOKEN=your_access_token_here
BWSXAI_TWITTER_ACCESS_SECRET=your_access_secret_here

# Anthropic
ANTHROPIC_API_KEY=your_anthropic_key_here
```

## Configuration

Edit `scripts/kols/config/kol-config.json`:

### Key Settings

```json
{
  "discovery": {
    "maxDepth": 2,                    // How many levels deep to traverse
    "seedKols": ["username1", "..."], // Initial KOLs to start from
    "maxKolsPerLevel": 50,            // Max KOLs to discover per level
    "processingBatchSize": 10         // Batch processing size
  },
  "kolCriteria": {
    "minFollowers": 1000,             // Minimum follower count
    "minCryptoRelevance": 70,         // Min crypto relevance (0-100)
    "recentActivityWindowDays": 7,    // Must be active in last N days
    "minEngagementRate": 0.5,         // Min engagement rate %
    "minAverageLikes": 10,            // Min average likes per tweet
    "minAverageViews": 100            // Min average views per tweet
  },
  "replySettings": {
    "maxRepliesPerDay": 5,            // Daily reply limit (start low!)
    "maxRepliesPerKolPerWeek": 1,     // Max replies per KOL per week
    "minRelevanceScoreForReply": 75,  // Min score to reply
    "minTimeBetweenRepliesMinutes": 30, // Wait time between replies
    "dryRun": true                    // true = no actual posts (testing)
  }
}
```

### Important: Add Seed KOLs

Before running, add initial KOL usernames to `discovery.seedKols` in the config:

```json
"seedKols": [
  "VitalikButerin",
  "CZ_Binance",
  "AndreCronjeTech",
  "elonmusk"
]
```

## Usage

### 1. Install Dependencies

```bash
npm install twitter-api-v2 @anthropic-ai/sdk
```

### 2. Test the System

**Always test first!**

```bash
node scripts/kols/test-kol-system.js
```

This validates:
- Configuration loading
- API credentials
- Twitter connectivity
- Claude API access
- End-to-end KOL evaluation

### 3. Discover KOLs

```bash
node scripts/kols/discover-kols.js
```

This will:
- Start from seed KOLs
- Traverse following relationships
- Evaluate each user with AI
- Filter by criteria
- Store qualified KOLs in database

**Expected runtime:** 10-30 minutes depending on depth and batch size

### 4. Generate Replies (Dry Run)

```bash
node scripts/kols/evaluate-and-reply-kols.js
```

With `dryRun: true` in config, this will:
- Evaluate KOL tweets
- Generate replies
- Show what would be posted
- **Not actually post anything**

**Review the output carefully!**

### 5. Enable Live Posting

When satisfied with dry-run results:

1. Edit `scripts/kols/config/kol-config.json`
2. Set `"dryRun": false`
3. Run again: `node scripts/kols/evaluate-and-reply-kols.js`

### 6. Analyze Engagement

```bash
node scripts/kols/analyze-kol-engagement.js
```

Generates:
- Weekly performance report
- Product performance breakdown
- Top engaging KOLs
- AI-powered recommendations
- Spam risk assessment

## GitHub Actions Automation

Three workflows are configured to run automatically:

### Daily KOL Discovery
**File:** `.github/workflows/discover-kols-daily.yml`
**Schedule:** Daily at 6 AM UTC
**Action:** Discovers new KOLs and updates database

### Daily Reply Generation
**File:** `.github/workflows/reply-kols-daily.yml`
**Schedule:** Daily at 12 PM UTC
**Action:** Evaluates tweets and posts replies

### Weekly Analytics
**File:** `.github/workflows/analyze-kols-weekly.yml`
**Schedule:** Sundays at 9 PM UTC
**Action:** Generates weekly report as GitHub issue

### Setup GitHub Actions

1. Add secrets to repository:
   - Go to Settings → Secrets and variables → Actions
   - Add all required API keys

2. Enable workflows:
   - Go to Actions tab
   - Enable workflows if needed

3. Manual trigger:
   - Actions → Select workflow → Run workflow

## Data Files

All data files are stored in `scripts/kols/data/` and are **gitignored** for security.

### kols-data.json
Contains discovered KOLs with:
- Profile information
- Crypto relevance scores
- Engagement metrics
- Relationship graph
- Recent topics

### kol-replies.json
Tracks all replies:
- Original tweet
- Reply text
- Product mentioned
- Engagement metrics
- Success/failure status

### kol-metrics.json
Analytics data:
- Weekly reports
- Product performance
- Top KOLs
- AI analysis

### processed-posts.json
Deduplication:
- Tweet IDs already processed
- Prevents duplicate replies

## Best Practices

### Starting Out

1. ✅ **Start with dry-run mode enabled**
2. ✅ **Use conservative settings** (5 replies/day, depth=1)
3. ✅ **Monitor for spam indicators**
4. ✅ **Review AI-generated replies manually at first**
5. ✅ **Gradually increase reply volume**

### Spam Prevention

- **Max 1 reply per KOL per week** (configurable)
- **30+ minutes between replies** (randomized)
- **High relevance threshold** (75%+)
- **Avoid promotional posts** (AI filtered)
- **Track spam indicators** (weekly reports)

### Scaling Up

Week 1: 5 replies/day, depth=1
Week 2: 10 replies/day, depth=1
Week 3: 15 replies/day, depth=2
Week 4+: Adjust based on metrics

## Monitoring

### Daily Checks

- Check GitHub Actions runs for failures
- Review commits to `scripts/kols/data/`
- Monitor for API rate limit warnings

### Weekly Checks

- Read weekly analytics issue
- Review top performing products
- Check spam indicators
- Adjust strategy based on AI recommendations

### Warning Signs

🚨 **Stop immediately if:**
- Spam risk level is HIGH
- Failure rate > 20%
- Getting blocked/muted by KOLs
- API rate limits consistently hit

## Troubleshooting

### "Configuration test failed"
- Check `scripts/kols/config/kol-config.json` exists
- Validate JSON syntax

### "Twitter API test failed"
- Verify `BWSXAI_TWITTER_BEARER_TOKEN` in `.env`
- Check token hasn't expired

### "Claude API test failed"
- Verify `ANTHROPIC_API_KEY` in `.env`
- Check API credits/quota

### "No seed KOLs configured"
- Add usernames to `discovery.seedKols` in config

### "Failed to post reply"
- Check write API credentials
- Verify OAuth tokens haven't expired
- Check if account is rate limited

## API Rate Limits

### Twitter API v2
- Read: 15 requests per 15 minutes (per endpoint)
- Write: Varies by account type

### Anthropic Claude
- Varies by plan
- System has built-in rate limiting

**Tip:** The system includes automatic rate limiting and batching to stay within limits.

## Maintenance

### Weekly
- Review analytics report
- Check for failed workflows
- Adjust configuration if needed

### Monthly
- Review overall strategy
- Update seed KOLs list
- Refresh product descriptions
- Clean up old data (optional)

### Quarterly
- Evaluate product performance
- Consider expanding to new topics
- Update success criteria

## Security Notes

- ❌ **Never commit API keys to git**
- ✅ Data files are gitignored
- ✅ Use GitHub Secrets for Actions
- ✅ Regularly rotate API keys
- ✅ Monitor for unauthorized access

## Support

For issues or questions:
1. Check workflow logs in GitHub Actions
2. Run test script: `node scripts/kols/test-kol-system.js`
3. Review weekly analytics for patterns
4. Check API status pages

## License

This code is part of the BWS website project.

## Credits

Built with:
- [Twitter API v2](https://developer.twitter.com/en/docs/twitter-api)
- [Anthropic Claude](https://www.anthropic.com/claude)
- [GitHub Actions](https://github.com/features/actions)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
