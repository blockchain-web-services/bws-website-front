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

All notifications use a simplified **3-field JSON format** for easy Zapier configuration:

### Payload Structure

```json
{
  "Message": "Formatted text ready for Slack (includes all details)",
  "Timestamp": "2025-11-03T16:30:00.000Z",
  "Type": "SUCCESS" or "ERROR"
}
```

### 1. **Discovery Completion Notifications**
Sent when KOL discovery workflows complete (both seed-based and search-based):

**Example:**
```json
{
  "Message": "✅ *KOL Discovery - Search-Based* - Completed\n*Time:* 11/3/2025, 4:30:00 PM UTC\n\n*Results:*\n  Queries executed: 6\n  Tweets found: 150\n  New KOLs added: 3\n  Total KOLs in DB: 4\n\n📊 *API Consumption:*\n*API Calls:* 10 total\n  ✅ Success: 8\n  ❌ Failed: 2\n*Items Fetched:* 150 (tweets/users)\n*Duration:* 12.5s\n*Rate:* 48.0 calls/min\n\n*By Endpoint:*\n✅ `tweets/search/recent`: 6 calls, 100 items\n✅ `users/lookup`: 4 calls, 50 items\n\n<https://github.com/.../actions/runs/12345|View Workflow Run>",
  "Timestamp": "2025-11-03T16:30:00.000Z",
  "Type": "SUCCESS"
}
```

### 2. **Reply Completion Notifications**
Sent when reply evaluation workflows complete - includes our reply and original tweet details:

**Example:**
```json
{
  "Message": "💬 *KOL Reply Evaluation* - Completed\n*Time:* 11/3/2025, 4:45:00 PM UTC\n\n*Results:*\n  Tweets evaluated: 15\n  Tweets skipped: 12\n  Replies posted (this run): 1\n  Replies today: 3/7\n  Total replies all time: 42\n\n✉️ *Latest Reply Sent:*\n*Our Reply:* \"Great insights on blockchain scalability! Have you considered using BWS Immutable Database...\"\n<https://twitter.com/bws_official/status/1234567890|View Our Reply Tweet>\n\n*Original Tweet by @cryptokol123:*\n\"Just analyzed 100+ blockchain projects. The biggest challenge isn't speed - it's maintaining data integrity...\"\n<https://twitter.com/cryptokol123/status/1234567889|View Original Tweet>\n\n📊 *API Consumption:*\n...\n\n<https://github.com/.../actions/runs/12346|View Workflow Run>",
  "Timestamp": "2025-11-03T16:45:00.000Z",
  "Type": "SUCCESS"
}
```

### 3. **Error Notifications**
Sent when workflows fail with errors:

**Example:**
```json
{
  "Message": "🚨 *KOL Discovery - Search-Based* - FAILED\n*Time:* 11/3/2025, 4:50:00 PM UTC\n\n*Error:* Request failed with code 429 - Rate limit exceeded\n\n*Context:*\n  api_stats: {...}\n\n<https://github.com/.../actions/runs/12347|View Workflow Run>",
  "Timestamp": "2025-11-03T16:50:00.000Z",
  "Type": "ERROR"
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

**Simplified 3-Field Structure:**
- `Message` - Pre-formatted Slack message with all details (ready to use!)
- `Timestamp` - ISO 8601 timestamp (e.g., `2025-11-03T16:30:00.000Z`)
- `Type` - Either `SUCCESS` or `ERROR`

The `Message` field contains everything formatted for Slack:
- Execution results (queries executed, tweets found, KOLs added, etc.)
- For successful replies: Our reply text + URL, original tweet text + URL
- API consumption statistics (calls, items fetched, duration, endpoint breakdown)
- GitHub Actions workflow run link
- Error details (if applicable)

### Step 2: Send to Slack

**Recommended Setup:**

```
Action: Send Channel Message in Slack
Channel: #kol-monitoring
Message Text: {{Message}}
```

That's it! The `Message` field is already formatted with Slack markdown.

### Step 3: Filter by Type (Optional)

Add filters to route different message types to different channels:

- **Success Messages**: `Type` = `SUCCESS` → `#kol-success`
- **Error Messages**: `Type` = `ERROR` → `#kol-errors`

You can also filter on the `Message` field content:
- **Discovery**: `Message` contains `KOL Discovery` → `#kol-discovery`
- **Replies**: `Message` contains `KOL Reply Evaluation` → `#kol-replies`

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
