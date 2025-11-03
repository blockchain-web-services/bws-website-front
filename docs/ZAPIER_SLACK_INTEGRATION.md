# Zapier Slack Integration

## Overview

The KOL system now sends real-time notifications to Slack via Zapier webhook, providing visibility into workflow executions, API consumption, and failures.

## Implementation Date
November 3, 2025

## Webhook Endpoint
```
https://hooks.zapier.com/hooks/catch/15373826/us3spl5/
```

## What Gets Sent

### 1. **Discovery Completion Notifications**
Sent when KOL discovery workflows complete (both seed-based and search-based):

**JSON Payload:**
```json
{
  "type": "kol_discovery",
  "status": "completed",
  "script": "KOL Discovery - Search-Based",
  "timestamp": "2025-11-03T16:30:00.000Z",
  "summary": {
    "status": "✅ Completed",
    "queries": 6,
    "tweets_found": 150,
    "kols_added": 3,
    "total_kols": 4
  },
  "text": "✅ *KOL Discovery - Search-Based* - Completed\n*Time:* 11/3/2025, 4:30:00 PM UTC\n\n*Results:*\n  Queries executed: 6\n  Tweets found: 150\n  New KOLs added: 3\n  Total KOLs in DB: 4\n\n📊 *API Consumption:*\n*API Calls:* 10 total\n  ✅ Success: 8\n  ❌ Failed: 2\n*Items Fetched:* 150 (tweets/users)\n*Duration:* 12.5s\n*Rate:* 48.0 calls/min\n\n*By Endpoint:*\n✅ `tweets/search/recent`: 6 calls, 100 items\n✅ `users/lookup`: 4 calls, 50 items\n\n<https://github.com/.../actions/runs/12345|View Workflow Run>",
  "run_url": "https://github.com/.../actions/runs/12345"
}
```

### 2. **Reply Completion Notifications**
Sent when reply evaluation workflows complete:

**JSON Payload:**
```json
{
  "type": "kol_reply",
  "status": "completed",
  "script": "KOL Reply Evaluation",
  "timestamp": "2025-11-03T16:45:00.000Z",
  "summary": {
    "status": "💬 Completed",
    "tweets_evaluated": 15,
    "tweets_skipped": 12,
    "replies_posted": 3,
    "today_replies": 5,
    "max_per_day": 7,
    "total_replies": 42
  },
  "text": "💬 *KOL Reply Evaluation* - Completed\n...",
  "run_url": "https://github.com/.../actions/runs/12346"
}
```

### 3. **Error Notifications**
Sent when workflows fail with errors:

**JSON Payload:**
```json
{
  "type": "error",
  "status": "failed",
  "script": "KOL Discovery - Search-Based",
  "timestamp": "2025-11-03T16:50:00.000Z",
  "error": "Request failed with code 429 - Rate limit exceeded",
  "stack": "Error: Request failed...\n    at ...",
  "context": {
    "api_stats": {
      "overall": {
        "totalCalls": 6,
        "failedCalls": 6,
        ...
      }
    }
  },
  "text": "🚨 *KOL Discovery - Search-Based* - FAILED\n*Error:* Request failed with code 429...",
  "run_url": "https://github.com/.../actions/runs/12347"
}
```

## Test Messages Sent

Successfully sent 3 test messages to help configure Zapier:

1. ✅ **Simple Test** - Basic JSON structure validation
2. ✅ **Discovery Notification** - Full discovery completion with API stats
3. ✅ **Error Notification** - Error handling and context

## Configuring Zapier

### Step 1: Catch Webhook
Your Zapier webhook should have received the test messages. You can now see the available JSON fields:

**Top-Level Fields:**
- `type` - Message type: `test`, `kol_discovery`, `kol_reply`, `error`
- `status` - Status: `completed` or `failed`
- `script` - Name of the script that ran
- `timestamp` - ISO 8601 timestamp
- `text` - Pre-formatted Slack message (ready to use!)
- `run_url` - GitHub Actions workflow URL (optional)

**Summary Fields (for discovery):**
- `summary.status` - Emoji + status text
- `summary.queries` - Number of search queries executed
- `summary.tweets_found` - Tweets discovered
- `summary.kols_added` - New KOLs added this run
- `summary.total_kols` - Total KOLs in database

**Summary Fields (for reply):**
- `summary.tweets_evaluated` - Tweets analyzed
- `summary.tweets_skipped` - Tweets skipped (low relevance)
- `summary.replies_posted` - Replies posted this run
- `summary.today_replies` - Total replies today
- `summary.max_per_day` - Daily limit
- `summary.total_replies` - All-time replies

**Error Fields:**
- `error` - Error message
- `stack` - Stack trace
- `context` - Additional context (varies)

### Step 2: Format for Slack

**Option A: Use Pre-Formatted Text (Recommended)**

Simply use the `text` field which is already formatted for Slack:

```
Action: Send Channel Message in Slack
Channel: #kol-monitoring
Message Text: {{text}}
```

**Option B: Custom Formatting**

Build your own message:

```
{{emoji}} *{{script}}* - {{status}}

*Results:*
• Queries: {{summary.queries}}
• KOLs Added: {{summary.kols_added}}
• Total KOLs: {{summary.total_kols}}

{{#if run_url}}
<{{run_url}}|View Run>
{{/if}}
```

### Step 3: Filter by Type (Optional)

Add filters to route different message types to different channels:

- **Success Messages**: `status` = `completed` → `#kol-success`
- **Error Messages**: `status` = `failed` → `#kol-errors`
- **Discovery**: `type` = `kol_discovery` → `#kol-discovery`
- **Replies**: `type` = `kol_reply` → `#kol-replies`

## When Notifications Are Sent

### Automatic (GitHub Actions)
Notifications are automatically sent when workflows run:

**Discovery Workflows:**
- Morning: 06:00, 09:00 UTC (2x daily)
- Afternoon: 12:30, 15:00, 18:00 UTC (3x daily)

**Reply Workflows:**
- 06:30, 12:00, 15:30, 21:00 UTC (4x daily)

### Manual Testing
You can test the webhook anytime:

```bash
cd /mnt/x/Git/blockchain-web-services/bws/bws-front/bws-website-front
node scripts/kols/test-zapier-webhook.js
```

This sends 5 different test messages to verify your Zap configuration.

## Message Examples

### Success Example (Slack)
```
✅ *KOL Discovery - Search-Based* - Completed
*Time:* 11/3/2025, 4:30:00 PM UTC

*Results:*
  Queries executed: 6
  Tweets found: 150
  New KOLs added: 3
  Total KOLs in DB: 4

📊 *API Consumption:*
*API Calls:* 10 total
  ✅ Success: 8
  ❌ Failed: 2
*Items Fetched:* 150 (tweets/users)

*By Endpoint:*
✅ `tweets/search/recent`: 6 calls, 100 items
⚠️ `users/lookup`: 2 calls, 0 items
    ❌ Rate limit (429)

<https://github.com/.../runs/12345|View Workflow Run>
```

### Error Example (Slack)
```
🚨 *KOL Discovery - Search-Based* - FAILED
*Time:* 11/3/2025, 4:50:00 PM UTC

*Error:* Request failed with code 429 - Rate limit exceeded

*Context:*
  api_stats: [Object with 6 failed calls]

<https://github.com/.../runs/12347|View Workflow Run>
```

### Reply Example (Slack)
```
💬 *KOL Reply Evaluation* - Completed
*Time:* 11/3/2025, 5:00:00 PM UTC

*Results:*
  Tweets evaluated: 15
  Tweets skipped: 12
  Replies posted (this run): 3
  Replies today: 5/7
  Total replies all time: 42

📊 *API Consumption:*
*API Calls:* 5 total
  ✅ Success: 5
  ❌ Failed: 0
*Items Fetched:* 15 (tweets/users)

<https://github.com/.../runs/12346|View Workflow Run>
```

## Benefits

### 1. **Real-Time Visibility**
- Instant notifications when workflows complete
- No need to check GitHub Actions logs manually
- See results directly in Slack

### 2. **Proactive Error Monitoring**
- Immediate alerts when workflows fail
- Error details and context included
- Quick access to workflow logs via URL

### 3. **API Consumption Tracking**
- Monitor X API usage in real-time
- Spot rate limit issues immediately
- Track which endpoints are consuming quota

### 4. **Team Awareness**
- Everyone on the team sees workflow results
- Celebrate successes (new KOLs, replies posted)
- Collaborate on error resolution

## Troubleshooting

### Messages Not Appearing in Slack
1. Check Zapier webhook received the data (check Zap history)
2. Verify Slack action is configured correctly
3. Ensure Slack channel permissions allow bot posts
4. Test with `node scripts/kols/test-zapier-webhook.js`

### Missing Fields in Slack
1. Check which fields Zapier received in the catch step
2. Verify field mapping in the Slack action
3. Some fields are optional (e.g., `run_url` is only set in GitHub Actions)

### 400 Errors
- May occur due to request size or CloudFront rate limiting
- Non-critical - notification failure doesn't break workflows
- Errors are logged but don't cause script failure

## Related Files

- `scripts/kols/utils/zapier-webhook.js` - Webhook integration utility
- `scripts/kols/test-zapier-webhook.js` - Test script
- `scripts/kols/discover-by-engagement.js` - Search-based discovery integration
- `scripts/kols/discover-kols.js` - Seed-based discovery integration
- `scripts/kols/evaluate-and-reply-kols.js` - Reply evaluation integration

## Commit

**Commit:** 5113bb6
**Title:** Integrate Zapier webhook notifications for KOL system monitoring
**Date:** November 3, 2025
