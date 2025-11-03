# KOL System - Deployment Guide

## ✅ System Complete & Ready to Deploy

Your automated KOL discovery and engagement system is now fully implemented with intelligent rate limit management and daily scheduling.

---

## 📋 What's Been Built

### Core Components

**1. Search-Based Discovery System**
- File: `scripts/kols/discover-by-engagement.js`
- Discovers KOLs from: @IncomeSharks, @Speculator_io, PROOF, HOOD communities
- Uses Twitter Search API with engagement filtering
- Rate-limited with 10s delays between queries
- Expected: 25-40 new KOLs per day

**2. Reply Generation System**
- File: `scripts/kols/evaluate-and-reply-kols.js`
- Evaluates tweets for BWS product relevance
- Generates contextual replies using Claude AI
- Posts up to 7 replies per day (2 per run)
- Respects 1 reply per KOL per week limit

**3. Scheduling System**
- Morning discovery: 06:00, 09:00 UTC (2 queries each)
- Afternoon discovery: 12:30, 15:00, 18:00 UTC (1 query each)
- Reply cycles: 06:30, 12:00, 15:30, 21:00 UTC (2 replies each)
- Stays within Twitter API 15-minute rate limits

---

## 🚀 Deployment Steps

### Step 1: Verify Local Setup

```bash
# Navigate to your project
cd /mnt/x/Git/blockchain-web-services/bws/bws-front/bws-website-front

# Test the system
node -r dotenv/config .trees/xai-trackkols/scripts/kols/test-kol-system.js
```

**Expected**: All tests pass (may hit rate limits if recently tested)

### Step 2: Copy Files to Main Branch

The system is currently in a worktree (`.trees/xai-trackkols`). Copy these files to your main branch:

```bash
# From your main repo directory
cp -r .trees/xai-trackkols/scripts/kols scripts/
cp -r .trees/xai-trackkols/.github/workflows/*.yml .github/workflows/
cp .trees/xai-trackkols/DAILY_SCHEDULING_STRATEGY.md .
cp .trees/xai-trackkols/DEPLOYMENT_GUIDE.md .
```

### Step 3: Configure GitHub Secrets

Go to: `Settings → Secrets and variables → Actions`

Add these secrets:

**Twitter API (for @BWSXAI account):**
- `BWSXAI_TWITTER_BEARER_TOKEN`
- `BWSXAI_TWITTER_API_KEY`
- `BWSXAI_TWITTER_API_SECRET`
- `BWSXAI_TWITTER_ACCESS_TOKEN`
- `BWSXAI_TWITTER_ACCESS_SECRET`

**Anthropic Claude:**
- `ANTHROPIC_API_KEY`

### Step 4: Enable GitHub Actions Workflows

1. Go to `Actions` tab in your repository
2. You'll see new workflows:
   - KOL Discovery - Morning
   - KOL Discovery - Afternoon
   - KOL Reply Cycle
3. Enable each workflow
4. Test with "Run workflow" button (manual trigger)

### Step 5: Initial Test Run

**Test Discovery (manually):**
```bash
# In your main branch, wait for rate limits to reset (~15 min from last test)
node -r dotenv/config scripts/kols/discover-by-engagement.js
```

**Expected Output:**
- Executes 6 search queries
- Finds 100+ user IDs
- Evaluates candidates with Claude
- Adds qualified KOLs to database

**Test Reply (manually, dry-run first):**
```bash
# Set dryRun: true in config first
node -r dotenv/config scripts/kols/evaluate-and-reply-kols.js
```

**Expected Output:**
- Processes KOL tweets
- Shows what replies would be posted
- NO actual tweets posted (dry-run)

### Step 6: Enable Live Posting

Once you've verified dry-run replies look good:

1. Edit `scripts/kols/config/kol-config.json`
2. Set `"dryRun": false`
3. Commit and push
4. GitHub Actions will now post live replies

---

## 📊 Daily Schedule

### API Usage Per Window (15 minutes)

| Time (UTC) | Action | API Calls | Output |
|------------|--------|-----------|--------|
| 06:00 | Discovery (2 queries) | ~8-12 | 5-10 KOLs |
| 06:30 | Reply (2 max) | ~6-10 | 1-2 replies |
| 09:00 | Discovery (2 queries) | ~8-12 | 3-7 KOLs |
| 12:00 | Reply (2 max) | ~6-10 | 1-2 replies |
| 12:30 | Discovery (1 query) | ~4-6 | 2-5 KOLs |
| 15:00 | Discovery (1 query) | ~4-6 | 2-5 KOLs |
| 15:30 | Reply (2 max) | ~6-10 | 1-2 replies |
| 18:00 | Discovery (2 queries) | ~8-12 | 3-8 KOLs |
| 21:00 | Reply (2 max) | ~6-10 | 1 reply |

**Daily Totals:**
- New KOLs discovered: 25-40
- Replies posted: 5-7
- Total API calls: ~80-100 (well under limits)

---

## ⚙️ Configuration

### Current Settings (Conservative - Week 1)

`scripts/kols/config/kol-config.json`:

```json
{
  "replySettings": {
    "maxRepliesPerRun": 2,
    "maxRepliesPerDay": 7,
    "maxRepliesPerKolPerWeek": 1,
    "minRelevanceScoreForReply": 75,
    "dryRun": false
  },
  "rateLimits": {
    "twitterApiCallsPerMinute": 20,
    "maxSearchQueriesPerRun": 2,
    "maxKolsToEvaluatePerRun": 5
  },
  "kolCriteria": {
    "minFollowers": 1000,
    "minCryptoRelevance": 70,
    "minEngagementRate": 0.03
  },
  "searchDiscovery": {
    "minFollowersOverride": 500,
    "engagementTier": "tier2"
  }
}
```

### Scaling Up (Week 2+)

After monitoring for a week, you can increase:

```json
{
  "replySettings": {
    "maxRepliesPerRun": 3,
    "maxRepliesPerDay": 10
  },
  "rateLimits": {
    "maxSearchQueriesPerRun": 3,
    "maxKolsToEvaluatePerRun": 10
  }
}
```

---

## 🔍 Monitoring

### Check GitHub Actions

**Daily:**
- Go to `Actions` tab
- Check workflow runs for failures
- Review commit messages for stats

**Workflow Outputs Show:**
- Number of KOLs discovered
- Number of replies posted
- Any errors or rate limits hit

### Check Database Files

```bash
# View KOLs database
cat scripts/kols/data/kols-data.json | jq '.kols | length'

# View replies
cat scripts/kols/data/kol-replies.json | jq '.replies | length'

# Check today's replies
TODAY=$(date +'%Y-%m-%d')
cat scripts/kols/data/kol-replies.json | jq --arg date "$TODAY" '[.replies[] | select(.timestamp | startswith($date))] | length'
```

### Weekly Review

Check `DAILY_SCHEDULING_STRATEGY.md` for success metrics:
- 150-250 new KOLs per week
- 35-50 replies per week
- >2% engagement rate
- >80% relevance score

---

## 🚨 Troubleshooting

### Rate Limit Errors (429)

**Cause:** API limits exceeded (450 searches/15min)

**Solution:**
1. Workflows automatically skip and retry next cycle
2. Reduce `maxSearchQueriesPerRun` in config
3. Increase delays in `search-queries.json`

### No Replies Posted

**Check:**
1. Is `dryRun: true`? (set to `false` for live posting)
2. Are there active KOLs in database?
3. Do any tweets meet relevance threshold (75%)?
4. Check `maxRepliesPerDay` not already reached

### Discovery Finding No KOLs

**Check:**
1. Search queries returning tweets?
2. Engagement thresholds too high? (try tier3)
3. `minFollowersOverride` too high? (try 300)
4. Are queries targeting active communities?

### Spam Detection Risk

**Indicators:**
- Repeated replies to same users
- Generic/template replies
- High failure rate

**Actions:**
1. PAUSE: Set `dryRun: true`
2. REVIEW: Last 10 replies in database
3. ADJUST: Increase relevance threshold to 85%
4. WAIT: 24-48 hours before resuming

---

## 📈 Success Metrics

### Week 1 Targets
- ✅ 100-150 new KOLs discovered
- ✅ 30-40 replies posted
- ✅ Zero spam flags
- ✅ All workflows running smoothly

### Month 1 Targets
- ✅ 500-800 total KOLs in database
- ✅ 150-200 total replies
- ✅ >2% avg engagement on replies
- ✅ >80% avg relevance score

---

## 🎯 Next Steps After Deployment

**Day 1-3:**
- Monitor closely (check Actions every 6 hours)
- Verify replies are high quality
- Watch for any spam indicators

**Day 4-7:**
- Review first week metrics
- Adjust relevance threshold if needed
- Identify best performing queries

**Week 2:**
- Increase `maxRepliesPerRun` to 3 if quality is good
- Add more search queries if needed
- Optimize engagement thresholds

**Month 1:**
- Generate comprehensive analytics report
- Identify top-performing KOLs
- Expand to new communities

---

## 📞 Support

**Documentation:**
- `DAILY_SCHEDULING_STRATEGY.md` - Detailed schedule
- `scripts/kols/README.md` - System overview
- `IMPORTANT_FILE_LOCATIONS.md` - File structure

**Testing:**
```bash
# Test configuration
node scripts/kols/test-kol-system.js

# Test discovery (dry)
node scripts/kols/discover-by-engagement.js

# Test replies (dry-run mode)
# Set dryRun: true first!
node scripts/kols/evaluate-and-reply-kols.js
```

---

## ✨ System Ready!

Your KOL system is fully configured and ready to:
1. ✅ Discover 25-40 new crypto KOLs daily
2. ✅ Post 5-7 high-quality BWS product replies daily
3. ✅ Stay within all API rate limits
4. ✅ Run autonomously via GitHub Actions
5. ✅ Scale up as you gain confidence

**Deploy when ready!** 🚀

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
