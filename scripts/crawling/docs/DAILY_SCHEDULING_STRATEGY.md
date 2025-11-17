# KOL System Daily Scheduling Strategy

## API Rate Limits (Twitter Basic Tier)

### Endpoint Limits (Per 15-minute window)
| Endpoint | Limit | Used For |
|----------|-------|----------|
| `GET /2/tweets/search/recent` | 450 | Search queries |
| `GET /2/users/:id/tweets` | 1,500 | User timelines |
| `GET /2/users/by/username` | 300 | User lookups |
| `GET /2/users` (batch) | 300 | Batch user lookups |
| `POST /2/tweets` | 200 | Posting replies |

### Monthly Limits
- Search API: 10,000 tweets/month
- Tweet Posts: Based on account type (typically 2,400/day for paid)

---

## API Usage Per Operation

### Discovery Operation (Search-Based)
**Per Query:**
- 1x search call (returns ~100 tweets)
- 1x batch user lookup (100 users per call)
- 1x user timeline per candidate (~5-10 users evaluated)
- 1x Claude API per candidate

**Total per query:** ~3-12 API calls (depending on results)

### Reply Operation
**Per KOL:**
- 1x user timeline (fetch recent tweets)
- 1-5x Claude API (evaluate tweets)
- 1x tweet post (if relevant tweet found)

**Total per KOL:** ~2-7 API calls

---

## Daily Schedule (24 hours = 96 x 15-minute windows)

### Strategy: Alternate Discovery & Reply Operations

**Goal: 30 new KOLs + 5 replies per day**

### Time Blocks

#### Block Type A: Discovery (Search-Based)
- Run 1-2 search queries
- Extract user IDs
- Batch lookup users
- Evaluate top 5 candidates
- **API Usage:** ~8-15 calls
- **Duration:** ~10 minutes
- **Frequency:** 6 times per day

#### Block Type B: Reply Generation
- Process 2-3 KOLs
- Evaluate their tweets
- Post 1 reply if relevant
- **API Usage:** ~5-10 calls
- **Duration:** ~5 minutes
- **Frequency:** 3 times per day

#### Block Type C: Maintenance
- Update existing KOL data
- Check engagement metrics
- Clean up data
- **API Usage:** ~3-5 calls
- **Duration:** ~3 minutes
- **Frequency:** 2 times per day

---

## Recommended Schedule

### Early Morning (Catch overnight activity)
**06:00 UTC** - Discovery Block A (2 queries)
- Search @IncomeSharks mentions + replies
- Expected: 5-10 new KOLs

**06:30 UTC** - Reply Block B (1 reply target)
- Process active KOLs from yesterday
- Post 1 high-quality reply

### Mid Morning
**09:00 UTC** - Discovery Block A (2 queries)
- Search @Speculator_io mentions + replies
- Expected: 3-7 new KOLs

**09:30 UTC** - Maintenance Block C
- Update engagement metrics
- Check reply performance

### Midday (Peak crypto activity)
**12:00 UTC** - Reply Block B (2 reply targets)
- Process newly discovered KOLs
- Post up to 2 replies

**12:30 UTC** - Discovery Block A (1 query)
- Search PROOF keyword
- Expected: 2-5 new KOLs

### Afternoon
**15:00 UTC** - Discovery Block A (1 query)
- Search HOOD keyword
- Expected: 2-5 new KOLs

**15:30 UTC** - Reply Block B (1 reply target)
- Process morning discoveries
- Post 1 reply

### Evening
**18:00 UTC** - Discovery Block A (2 queries)
- Repeat high-performing queries
- Expected: 3-8 new KOLs

**18:30 UTC** - Maintenance Block C
- Daily report generation
- Database cleanup

### Late Evening (US market hours)
**21:00 UTC** - Reply Block B (1 reply target)
- Final reply of the day
- Focus on US timezone KOLs

---

## Daily Totals

### API Calls Distribution
- **Search API:** ~24-30 calls (well under 450/15min)
- **User Timeline:** ~35-50 calls (well under 1,500/15min)
- **User Lookup:** ~15-20 calls (well under 300/15min)
- **Tweet Posts:** ~5-7 calls (well under 200/15min)

### Expected Outcomes
- **New KOLs Discovered:** 25-40 per day
- **Replies Posted:** 5-7 per day
- **Total API Usage:** ~80-100 calls per day
- **Peak Usage:** 15 calls per 15-minute window

---

## GitHub Actions Implementation

### Workflow Files

**`.github/workflows/kol-discovery-morning.yml`**
- Schedule: `0 6,9 * * *` (06:00, 09:00 UTC)
- Runs: 2 search queries per execution
- Timeout: 10 minutes

**`.github/workflows/kol-discovery-afternoon.yml`**
- Schedule: `30 12,15,18 * * *` (12:30, 15:00, 18:00 UTC)
- Runs: 1 search query per execution
- Timeout: 8 minutes

**`.github/workflows/kol-reply-cycle.yml`**
- Schedule: `30 6,0,30,30 12,15,21 * * *` (06:30, 12:00, 15:30, 21:00 UTC)
- Max replies: 2 per run (total 5-7/day)
- Timeout: 8 minutes

**`.github/workflows/kol-maintenance.yml`**
- Schedule: `30 9,18 * * *` (09:30, 18:30 UTC)
- Runs: Metrics update, reporting
- Timeout: 5 minutes

---

## Safety Measures

### Rate Limit Protection
1. **Built-in throttling:** 10s between queries
2. **Window tracking:** Track API calls per 15-min window
3. **Graceful degradation:** Skip operations if approaching limits
4. **Error handling:** Retry with exponential backoff

### Quality Control
1. **Max 1 reply per KOL per week**
2. **Min 75% relevance score for replies**
3. **30-minute gaps between replies**
4. **Human review queue for borderline cases**

### Monitoring
1. **Daily summary reports** (GitHub issue)
2. **Rate limit tracking** (logged in each run)
3. **Success/failure metrics**
4. **Alert on 3 consecutive failures**

---

## Scaling Strategy

### Week 1 (Testing)
- 3 discovery runs/day (15 KOLs)
- 2 reply runs/day (2 replies)
- Monitor closely

### Week 2-3 (Ramp Up)
- 6 discovery runs/day (30 KOLs)
- 4 reply runs/day (5 replies)
- Optimize based on metrics

### Week 4+ (Full Scale)
- 6-8 discovery runs/day (40+ KOLs)
- 5-6 reply runs/day (7-10 replies)
- Maintain quality standards

---

## Emergency Procedures

### If Rate Limited
1. **Immediate:** Skip current operation
2. **Log:** Record which endpoint hit limit
3. **Adjust:** Reduce frequency of that operation
4. **Resume:** After 15-minute window

### If Quality Drops
1. **Pause:** Stop automated replies
2. **Review:** Last 10 replies manually
3. **Adjust:** Increase relevance threshold
4. **Resume:** After adjustments

### If Spam Detected
1. **Stop:** All automated posting immediately
2. **Investigate:** Review flagged content
3. **Fix:** Adjust filters and criteria
4. **Restart:** After 24-48 hour pause

---

## Configuration

### Current Settings (Conservative)
```json
{
  "rateLimits": {
    "twitterApiCallsPerMinute": 15,
    "maxSearchQueriesPerRun": 2,
    "maxKolsToEvaluatePerRun": 5,
    "waitBetweenQueriesMs": 10000
  },
  "replySettings": {
    "maxRepliesPerRun": 2,
    "maxRepliesPerDay": 7,
    "maxRepliesPerKolPerWeek": 1
  }
}
```

### Optimal Settings (After Testing)
```json
{
  "rateLimits": {
    "twitterApiCallsPerMinute": 25,
    "maxSearchQueriesPerRun": 3,
    "maxKolsToEvaluatePerRun": 10,
    "waitBetweenQueriesMs": 8000
  },
  "replySettings": {
    "maxRepliesPerRun": 3,
    "maxRepliesPerDay": 10,
    "maxRepliesPerKolPerWeek": 1
  }
}
```

---

## Success Metrics

### Weekly Targets
- **New KOLs:** 150-250
- **Replies Posted:** 35-50
- **Engagement Rate:** >2% avg
- **Relevance Score:** >80% avg
- **API Efficiency:** <70% of limits used

### Monthly Targets
- **Total KOLs:** 600-1000
- **Active Engagement:** 150-200 replies
- **Quality Score:** >85%
- **Zero spam flags**

---

🤖 This schedule maximizes discovery and engagement while staying well within API limits!
