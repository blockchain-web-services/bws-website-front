# API Usage Tracking System

Comprehensive tracking of Twitter API usage to monitor quota consumption, identify external usage, and diagnose rate limit issues.

---

## Features

### 1. **Persistent Logging**
- All posting attempts logged to `data/api-usage-log.json`
- Rate limit errors captured with full details
- Successful posts tracked with reply IDs
- Maintains last 1000 entries automatically

### 2. **Daily Summaries**
- Aggregated daily statistics in `data/api-usage-daily.json`
- Post attempts, successes, failures tracked
- Rate limit details (limit, remaining, used, reset time)
- Automatic tier identification (Free/Basic/Pro)
- Keeps last 30 days of data

### 3. **Real-time Monitoring**
- Usage summary displayed after each workflow run
- Identifies quota consumption patterns
- Detects external API usage
- Shows time until rate limit reset

---

## Files Created

### Core Module
```
scripts/kols/utils/api-usage-logger.js
```
- Main logging module
- Persistent storage handler
- Analytics calculator
- Display formatter

### Data Files
```
scripts/kols/data/api-usage-log.json      (Auto-created, recent 1000 entries)
scripts/kols/data/api-usage-daily.json     (Auto-created, last 30 days)
```

### Viewer Script
```
scripts/kols/view-api-usage.js            (Standalone usage viewer)
```

---

## Usage

### View Today's Usage
```bash
node scripts/kols/view-api-usage.js
# or
node scripts/kols/view-api-usage.js today
```

Output:
```
📊 TODAY'S API USAGE SUMMARY
======================================================================

📅 Date: 2025-11-10
⏰ First attempt: 12:00:55
⏰ Last attempt:  12:07:32

📤 Post Attempts:      6
✅ Successful:         0 (0%)
❌ Failed:             6 (100%)
🚫 Rate Limit Errors:  6

📊 Rate Limit Details:
   Daily Limit:    100 posts/24h
   Used Today:     23
   Remaining:      77
   Resets At:      2025-11-10T18:00:00.000Z
   Reset In:       45 minutes

   ✅ TIER: BASIC TIER (100 posts/24h per user)
```

### View Last 7 Days
```bash
node scripts/kols/view-api-usage.js week
```

Output:
```
📊 LAST 7 DAYS API USAGE
======================================================================

   Date         Attempts  Success  Failed  Rate Limited
   ------------------------------------------------------------------
   2025-11-04          1        1 (100%)       0             0
   2025-11-05          3        3 (100%)       0             0
   2025-11-06          1        1 (100%)       0             0
   2025-11-07          2        0 (0%)         2             0
   2025-11-10          6        0 (0%)         6             6
   ------------------------------------------------------------------
   TOTAL              13        5 (38%)        8             6
```

### View Recent API Attempts
```bash
node scripts/kols/view-api-usage.js recent 20
```

Output:
```
📋 Last 20 API Attempts:

   #   Time          Type            Status    Details
   ------------------------------------------------------------------
     1  12:00:55  rate_limit_error  ❌ FAIL  Limit: 23/100 used
     2  12:01:22  rate_limit_error  ❌ FAIL  Limit: 23/100 used
     3  12:02:26  rate_limit_error  ❌ FAIL  Limit: 23/100 used
   ------------------------------------------------------------------
```

### View Both Today + Week
```bash
node scripts/kols/view-api-usage.js both
```

### Export All Data (JSON)
```bash
node scripts/kols/view-api-usage.js export > usage-data.json
```

---

## Automated Tracking

### Integrated into Reply Workflow

The system automatically tracks:
1. ✅ Every posting attempt
2. ✅ Success/failure status
3. ✅ Rate limit errors with full details
4. ✅ Tier identification
5. ✅ Daily quota usage

At the end of each workflow run, you'll see:
```
📊 API CONSUMPTION STATISTICS
(standard apiTracker stats)

📊 TODAY'S API USAGE SUMMARY
(persistent usage tracking)
```

---

## What Gets Logged

### Successful Post
```json
{
  "timestamp": "2025-11-10T12:00:00.000Z",
  "type": "post_success",
  "endpoint": "tweets/reply",
  "tweetId": "1234567890",
  "replyId": "9876543210",
  "replyText": "Great insight! $BWS...",
  "rateLimit": {
    "limit": 100,
    "remaining": 77,
    "reset": 1699632000
  }
}
```

### Rate Limit Error
```json
{
  "timestamp": "2025-11-10T12:00:55.000Z",
  "type": "rate_limit_error",
  "endpoint": "tweets/reply",
  "error": "429 Rate Limit Exceeded",
  "tweetId": "1234567890",
  "limit": 100,
  "remaining": 0,
  "used": 100,
  "reset": "2025-11-10T18:00:00.000Z"
}
```

---

## Key Insights

### Identify External Usage

If you see high `used` count but low `postAttempts`:
```
📊 TODAY'S API USAGE SUMMARY
📤 Post Attempts:      6       👈 Your workflow attempts
📊 Rate Limit Details:
   Used Today:     45           👈 Actual API usage (7.5x more!)
```

**Diagnosis**: 39 posts made by external sources!

### Track Tier Changes

The system auto-identifies your tier:
- `Limit: 17` → ⚠️  FREE TIER
- `Limit: 100` → ✅ BASIC TIER
- `Limit: 1667+` → ✅ PRO/ENTERPRISE TIER

### Monitor Success Rate

Weekly view shows posting patterns:
```
Success rate dropping? → Rate limit or external usage issue
Success rate 0% → Burst traffic or quota exhausted
Success rate 80%+ → Healthy operation
```

---

## Troubleshooting

### Rate Limit Errors Despite Low Attempts

**Symptom**: Only 5 post attempts but getting 429 errors

**Check**:
```bash
node scripts/kols/view-api-usage.js today
```

Look for:
```
📤 Post Attempts:      5
   Used Today:     23    👈 23 posts made but only 5 attempts tracked
```

**Diagnosis**: External usage consuming quota

**Solutions**:
1. Check Twitter Developer Portal for actual usage
2. Verify API keys aren't shared with other apps
3. Check for manual API testing/scripts

### First Post Fails with 429

**Symptom**: Even the first post at 12:00 gets 429

**Check recent entries**:
```bash
node scripts/kols/view-api-usage.js recent 50
```

Look for posts before 12:00 that aren't from your workflows.

**Diagnosis**: Quota used by earlier activity (manual posts, other workflows, or different app)

---

## Data Management

### File Sizes

- `api-usage-log.json`: Max 1000 entries (~500KB)
- `api-usage-daily.json`: 30 days (~50KB)

### Cleanup (if needed)

```bash
# View current data
node scripts/kols/view-api-usage.js export | wc -l

# Backup before cleaning
cp scripts/kols/data/api-usage-log.json scripts/kols/data/api-usage-log.backup.json
cp scripts/kols/data/api-usage-daily.json scripts/kols/data/api-usage-daily.backup.json

# Files auto-trim, but you can manually reset:
echo '[]' > scripts/kols/data/api-usage-log.json
echo '{}' > scripts/kols/data/api-usage-daily.json
```

---

## Integration Points

### Modified Files

1. **`scripts/kols/utils/twitter-client.js`**
   - Added `usageLogger` import
   - Logs successful posts in `postReply()`
   - Logs rate limit errors with full details

2. **`scripts/kols/evaluate-and-reply-kols.js`**
   - Added `usageLogger` import
   - Displays usage summary after apiTracker stats

### New Files

1. **`scripts/kols/utils/api-usage-logger.js`** - Core logging module
2. **`scripts/kols/view-api-usage.js`** - Standalone viewer
3. **`scripts/kols/data/api-usage-*.json`** - Auto-created data files

---

## Next Steps

### Monitor the Next Workflow Run

After the 18:00 UTC run today:

```bash
# Check if posting succeeded
node scripts/kols/view-api-usage.js today

# Check recent attempts
node scripts/kols/view-api-usage.js recent 10
```

### Daily Monitoring (Optional)

Add to your daily routine:
```bash
node scripts/kols/view-api-usage.js both
```

This shows:
- Today's quota usage
- Weekly trend
- Success rate patterns
- External usage detection

---

## Expected Results

### After Fix (Duplicate Workflow Disabled)

**Today (Nov 10)** - Before fix:
```
Post Attempts:      6
Successful:         0 (0%)
Rate Limited:       6 (100%)
```

**Tomorrow (Nov 11)** - After fix:
```
Post Attempts:      3-6      (reduced from 12)
Successful:         2-4      (60%+ success rate)
Rate Limited:       0-2      (<30%)
```

### Healthy Operation

Target metrics:
```
📤 Post Attempts:      4-8 per day
✅ Successful:         60-80%
❌ Failed:             20-40%
🚫 Rate Limit Errors:  <10%
```

---

**Documentation Generated**: 2025-11-10
**Version**: 1.0
**Status**: ✅ Active Tracking Enabled
