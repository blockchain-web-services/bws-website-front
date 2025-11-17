# KOL System Setup Guide

Quick guide to get the X/Twitter KOL engagement system up and running.

## 🚀 Quick Start (5 Steps)

### Step 1: Add Seed KOLs

Edit `scripts/kols/config/kol-config.json` and add initial KOL usernames:

```json
{
  "discovery": {
    "seedKols": [
      "VitalikButerin",
      "CZ_Binance",
      "AndreCronjeTech",
      "elonmusk",
      "naval"
    ]
  }
}
```

**Tip:** Start with 5-10 well-known crypto KOLs.

### Step 2: Configure Your Environment

Create `.env` file in project root:

```bash
# Twitter API for @BWSXAI account (get from https://developer.twitter.com)
BWSXAI_TWITTER_BEARER_TOKEN=your_bearer_token_here
BWSXAI_TWITTER_API_KEY=your_api_key_here
BWSXAI_TWITTER_API_SECRET=your_api_secret_here
BWSXAI_TWITTER_ACCESS_TOKEN=your_access_token_here
BWSXAI_TWITTER_ACCESS_SECRET=your_access_secret_here

# Anthropic (get from https://console.anthropic.com)
ANTHROPIC_API_KEY=your_anthropic_key_here
```

### Step 3: Install Dependencies

```bash
npm install twitter-api-v2 @anthropic-ai/sdk
```

### Step 4: Test the System

```bash
node scripts/kols/test-kol-system.js
```

**Expected output:**
```
🧪 Starting KOL System Tests...

Test 1: Configuration Loading
   ✅ Configuration loaded successfully

Test 2: Data File Operations
   ✅ Data files loaded successfully

...

✅ All tests passed! System is ready.
```

### Step 5: Run Discovery (Dry Run)

```bash
node scripts/kols/discover-kols.js
```

This will discover KOLs and save them to the database.

## 📋 Next Steps

### Test Reply Generation

With `dryRun: true` in config (default):

```bash
node scripts/kols/evaluate-and-reply-kols.js
```

**Review the generated replies carefully!**

Output will show:
- Which tweets were evaluated
- Relevance scores
- Generated reply text
- Which product was mentioned

### When Ready to Go Live

1. **Review your dry-run results** - Make sure replies look natural
2. **Start conservatively** - Keep `maxRepliesPerDay: 5`
3. **Edit config** - Set `"dryRun": false`
4. **Run live** - `node scripts/kols/evaluate-and-reply-kols.js`
5. **Monitor closely** - Watch for spam indicators

## 🔧 Configuration Tips

### Conservative Settings (Recommended Start)

```json
{
  "discovery": {
    "maxDepth": 1,        // Only 1 level deep
    "maxKolsPerLevel": 25 // Limit to 25 KOLs
  },
  "replySettings": {
    "maxRepliesPerDay": 5,              // Only 5 per day
    "maxRepliesPerKolPerWeek": 1,       // Max 1 per KOL
    "minRelevanceScoreForReply": 80,    // High bar (80%)
    "dryRun": true                       // Safe mode
  }
}
```

### Aggressive Settings (After Validation)

```json
{
  "discovery": {
    "maxDepth": 2,         // 2 levels deep
    "maxKolsPerLevel": 50  // Up to 50 KOLs
  },
  "replySettings": {
    "maxRepliesPerDay": 20,             // 20 per day
    "maxRepliesPerKolPerWeek": 1,       // Still max 1 per KOL
    "minRelevanceScoreForReply": 75,    // Slightly lower (75%)
    "dryRun": false                      // Live mode
  }
}
```

## 🤖 GitHub Actions Setup

### Add Secrets to Repository

1. Go to your repository on GitHub
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret (for @BWSXAI account):
   - `BWSXAI_TWITTER_BEARER_TOKEN`
   - `BWSXAI_TWITTER_API_KEY`
   - `BWSXAI_TWITTER_API_SECRET`
   - `BWSXAI_TWITTER_ACCESS_TOKEN`
   - `BWSXAI_TWITTER_ACCESS_SECRET`
   - `ANTHROPIC_API_KEY`

### Enable Workflows

Workflows will run automatically:
- **Discovery:** Daily at 6 AM UTC
- **Replies:** Daily at 12 PM UTC
- **Analytics:** Sundays at 9 PM UTC

Manual trigger:
1. Go to Actions tab
2. Select workflow
3. Click "Run workflow"

## 📊 Monitoring

### Check Daily

```bash
# See latest KOL data
cat scripts/kols/data/kols-data.json | jq '.metadata'

# See reply stats
cat scripts/kols/data/kol-replies.json | jq '.metadata'
```

### Weekly Analytics

```bash
node scripts/kols/analyze-kol-engagement.js
```

Or wait for the weekly GitHub issue to be created automatically.

## ⚠️ Important Safety Notes

### DO ✅
- Start with dry-run mode
- Test thoroughly before going live
- Monitor spam indicators
- Keep reply volume low initially
- Review AI-generated replies
- Track engagement metrics

### DON'T ❌
- Skip testing phase
- Start with high reply volumes
- Reply to same KOL frequently
- Ignore spam warnings
- Commit API keys to git
- Use overly promotional language

## 🐛 Troubleshooting

### Test Script Fails?

```bash
# Check config
cat scripts/kols/config/kol-config.json | jq

# Check environment
cat .env

# Check node version (need 20+)
node --version
```

### API Errors?

- **Twitter 429:** Rate limited - wait 15 minutes
- **Twitter 401:** Invalid credentials - check tokens
- **Anthropic 401:** Invalid API key - check key
- **Anthropic 429:** Rate limited - wait or upgrade plan

### No KOLs Discovered?

- Check seed KOLs are valid usernames
- Lower criteria thresholds temporarily
- Check API credentials
- Increase `maxKolsPerLevel`

## 📈 Success Metrics

Track these over time:

- **KOL Growth:** Total active KOLs in database
- **Reply Success Rate:** % of posts that succeed
- **Engagement Rate:** Likes/RT on our replies
- **Relevance Score:** Average relevance of posts replied to
- **Spam Indicators:** Should stay LOW

## 🎯 Goals

**Week 1:**
- Discover 50-100 KOLs
- Post 5-10 test replies (dry run)
- Validate system works

**Week 2-4:**
- Discover 200-300 KOLs
- Post 5-10 replies per day (live)
- Monitor engagement

**Month 2+:**
- Discover 500+ KOLs
- Scale to 20-30 replies per day
- Optimize based on data

## 📚 Documentation

Full documentation: `scripts/kols/README.md`

## Need Help?

1. Read the README: `scripts/kols/README.md`
2. Check test output: `node scripts/kols/test-kol-system.js`
3. Review workflow logs in GitHub Actions
4. Check weekly analytics reports

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
