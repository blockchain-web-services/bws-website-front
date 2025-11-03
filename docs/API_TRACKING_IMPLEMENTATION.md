# X API Call Tracking Implementation

## Overview

Implemented comprehensive API call tracking system to monitor X (Twitter) API consumption across all KOL discovery and reply workflows.

## Implementation Date
November 3, 2025

## What Was Implemented

### 1. API Call Tracker (`scripts/kols/utils/api-call-tracker.js`)

**Purpose:** Singleton tracker that monitors all X API calls

**Features:**
- Tracks each API call with timestamp, endpoint, items fetched, success/failure
- Groups statistics by endpoint
- Calculates overall consumption metrics
- Displays formatted statistics table
- Exports data as JSON for analysis

**Key Methods:**
- `recordCall(endpoint, itemsFetched, success, error)` - Record an API call
- `getStatsByEndpoint()` - Get statistics grouped by endpoint
- `getOverallStats()` - Get overall consumption summary
- `displayStats()` - Display comprehensive statistics table
- `reset()` - Reset tracker for new execution

### 2. Twitter Client Integration (`scripts/kols/utils/twitter-client.js`)

**Updated Functions:**

| Function | Endpoint Tracked | Items Counted |
|----------|------------------|---------------|
| `searchTweets()` | `tweets/search/recent` | Tweets returned |
| `getUserByUsername()` | `users/by/username` | User profile |
| `postReply()` | `tweets/reply` | Reply posted |
| `batchUserLookup()` | `users/lookup` | Users fetched |

**Special Handling:**
- Rate limit errors (429) are flagged as `'Rate limit (429)'`
- Dry run posts are tracked but marked with note
- All errors captured with descriptive messages

### 3. Script Integration

**Updated Scripts:**
- `scripts/kols/discover-by-engagement.js` - Search-based discovery
- `scripts/kols/discover-kols.js` - Seed-based discovery
- `scripts/kols/evaluate-and-reply-kols.js` - Reply evaluation

**Integration Pattern:**
```javascript
import { apiTracker } from './utils/twitter-client.js';

async function mainFunction() {
  // Reset tracker at start
  apiTracker.reset();

  // ... execution ...

  // Display stats at end
  apiTracker.displayStats();
}
```

## Output Format

### Compact Summary (Inline)
```
📊 API Summary: 6 calls (✅ 0, ❌ 6), 0 items fetched in 0.5s
```

### Detailed Statistics Table
```
======================================================================
📊 API CONSUMPTION STATISTICS
======================================================================

🌍 OVERALL SUMMARY:
   Total API Calls:       6
   Successful:            0 ✅
   Failed:                6 ❌
   Total Items Fetched:   0 (tweets/users)
   Duration:              0.5s
   Rate:                  720.0 calls/minute

📍 BY ENDPOINT:
   ------------------------------------------------------------------
   Endpoint                      Calls  Success  Failed  Items
   ------------------------------------------------------------------
   tweets/search/recent              6        0       6      0
      ❌ Error: Rate limit (429)
   ------------------------------------------------------------------

======================================================================
```

## Benefits

### 1. **Visibility**
- Clear view of exactly how many API calls are made per execution
- Count of tweets/users fetched per call
- Immediate identification of rate limit issues

### 2. **Debugging**
- Track which endpoints are consuming quota
- Identify failed calls and error patterns
- Monitor execution performance (duration, rate)

### 3. **Cost Management**
- Calculate monthly API usage projections
- Optimize query strategies based on actual consumption
- Make informed decisions about API tier upgrades

### 4. **Compliance**
- Ensure staying within rate limits
- Track usage against quotas
- Document API consumption for auditing

## Usage Example

When a workflow runs, you'll see:

**Before execution:**
```
🔍 Starting Search-Based KOL Discovery Process...
```

**During execution:**
```
[1/6] Query: "incomesharks-mentions"
   ❌ Query failed: Request failed with code 429
```

**After execution:**
```
======================================================================
📊 API CONSUMPTION STATISTICS
======================================================================

🌍 OVERALL SUMMARY:
   Total API Calls:       6
   Successful:            0 ✅
   Failed:                6 ❌
   Total Items Fetched:   0 (tweets/users)
   Duration:              0.5s
   Rate:                  720.0 calls/minute

📍 BY ENDPOINT:
   ------------------------------------------------------------------
   Endpoint                      Calls  Success  Failed  Items
   ------------------------------------------------------------------
   tweets/search/recent              6        0       6      0
      ❌ Error: Rate limit (429)
   ------------------------------------------------------------------

======================================================================

✅ Search-based discovery complete!
```

## Tracked Metrics

### Per Execution
- Total API calls made
- Successful vs failed calls
- Total items (tweets/users) fetched
- Execution duration
- Calls per minute rate

### Per Endpoint
- Call count by endpoint type
- Success/failure breakdown
- Items fetched per endpoint
- Error messages grouped by endpoint

## Endpoints Monitored

| Endpoint | Purpose | Rate Limit (Free) | Rate Limit (Basic) |
|----------|---------|-------------------|-------------------|
| `tweets/search/recent` | Search for tweets | 50/month | 10,000/month |
| `users/by/username` | Get user profile | 300/15min | 300/15min |
| `users/lookup` | Batch user lookup | 300/15min | 300/15min |
| `tweets/reply` | Post reply | 50/24h | 50/24h |

## Future Enhancements

### Potential Additions:
1. **Persistent Storage**: Save API stats to JSON file for historical analysis
2. **Alerting**: Notify when approaching rate limits
3. **Visualization**: Generate charts of API consumption trends
4. **Optimization Suggestions**: Recommend query adjustments based on usage patterns
5. **Cost Calculator**: Estimate monthly costs based on usage patterns

## Testing

To test the tracking system:

```bash
# Run discovery (will show API stats)
node scripts/kols/discover-by-engagement.js

# Run reply evaluation (will show API stats)
node scripts/kols/evaluate-and-reply-kols.js

# Check GitHub Actions logs for stats in automated runs
gh run view <run-id> --log
```

## Troubleshooting

### Stats Not Showing
- Ensure `apiTracker.reset()` is called at start of function
- Verify `apiTracker.displayStats()` is called before completion
- Check imports include `apiTracker`

### Incorrect Counts
- Verify tracking is called in all API wrapper functions
- Check that paginated calls count correctly
- Ensure error paths also record calls

### Rate Limit Errors Not Flagged
- Confirm error message includes "429" or "Too Many Requests"
- Check error handling wraps all API calls

## Related Files

- `scripts/kols/utils/api-call-tracker.js` - Main tracker class
- `scripts/kols/utils/twitter-client.js` - Twitter API wrapper with tracking
- `scripts/kols/discover-by-engagement.js` - Discovery integration
- `scripts/kols/discover-kols.js` - Seed discovery integration
- `scripts/kols/evaluate-and-reply-kols.js` - Reply integration

## Commit

**Commit:** e095a86
**Title:** Implement comprehensive X API call tracking system
**Date:** November 3, 2025
