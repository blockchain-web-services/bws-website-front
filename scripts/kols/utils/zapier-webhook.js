/**
 * Zapier Webhook Integration
 * Sends formatted messages to Slack via Zapier
 */

import https from 'https';
import http from 'http';

// TODO: Replace this with YOUR webhook URL from Zapier
// Go to https://zapier.com/app/zaps and create a Zap with "Catch Hook" trigger
const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/15373826/us3spl5/';

/**
 * Send a message to Zapier webhook
 * @param {Object} payload - Message payload
 * @returns {Promise<Object>} Response from Zapier
 */
export async function sendToZapier(payload) {
  const url = new URL(ZAPIER_WEBHOOK_URL);

  const data = JSON.stringify(payload);

  // Log detailed request info
  console.log('\n📤 ZAPIER WEBHOOK REQUEST:');
  console.log(`   URL: ${ZAPIER_WEBHOOK_URL}`);
  console.log(`   Payload size: ${data.length} bytes`);
  console.log(`   Payload keys: ${Object.keys(payload).join(', ')}`);

  const options = {
    hostname: url.hostname,
    port: url.port || 443,
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data, 'utf8')  // Fixed: use byte length for UTF-8
    }
  };

  return new Promise((resolve, reject) => {
    const protocol = url.protocol === 'https:' ? https : http;

    const req = protocol.request(options, (res) => {
      let responseBody = '';

      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        // Log detailed response info
        console.log('\n📥 ZAPIER WEBHOOK RESPONSE:');
        console.log(`   Status Code: ${res.statusCode}`);
        console.log(`   Status Message: ${res.statusMessage}`);
        console.log(`   Response Body: ${responseBody.substring(0, 500)}`);
        console.log(`   Response Length: ${responseBody.length} bytes`);

        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const jsonResponse = JSON.parse(responseBody);
            console.log(`   ✅ Success - Parsed JSON response`);
            resolve({ success: true, data: jsonResponse, status: res.statusCode });
          } catch (e) {
            console.log(`   ✅ Success - Raw text response`);
            resolve({ success: true, data: responseBody, status: res.statusCode });
          }
        } else {
          console.log(`   ❌ Failed with status ${res.statusCode}`);
          reject(new Error(`Zapier webhook failed with status ${res.statusCode}: ${responseBody}`));
        }
      });
    });

    req.on('error', (error) => {
      console.log(`\n❌ ZAPIER REQUEST ERROR: ${error.message}`);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

/**
 * Format API stats for Slack display
 * @param {Object} stats - API stats from tracker
 * @returns {string} Formatted text
 */
function formatApiStats(stats) {
  const lines = [];

  lines.push(`*API Calls:* ${stats.totalCalls} total`);
  lines.push(`  Success: ${stats.successfulCalls}`);
  lines.push(`  Failed: ${stats.failedCalls}`);
  lines.push(`*Items Fetched:* ${stats.totalItemsFetched} (tweets/users)`);
  lines.push(`*Duration:* ${stats.duration}s`);
  lines.push(`*Rate:* ${stats.callsPerMinute} calls/min`);

  return lines.join('\n');
}

/**
 * Format endpoint stats for Slack display
 * @param {Object} byEndpoint - Stats grouped by endpoint
 * @returns {string} Formatted text
 */
function formatEndpointStats(byEndpoint) {
  const lines = [];

  lines.push('*By Endpoint:*');

  const sortedEndpoints = Object.entries(byEndpoint)
    .sort(([, a], [, b]) => b.totalCalls - a.totalCalls);

  for (const [endpoint, stats] of sortedEndpoints) {
    lines.push(`\`${endpoint}\`: ${stats.totalCalls} calls, ${stats.totalItemsFetched} items`);

    if (stats.errors.length > 0) {
      for (const error of stats.errors) {
        lines.push(`    ${error}`);
      }
    }
  }

  return lines.join('\n');
}

/**
 * Send KOL discovery completion notification
 * @param {Object} options - Notification options
 */
export async function sendDiscoveryNotification(options) {
  const {
    scriptName = 'KOL Discovery',
    success = true,
    totalQueries = 0,
    tweetsFound = 0,
    kolsAdded = 0,
    totalKols = 0,
    apiStats = null,
    error = null,
    runUrl = null
  } = options;

  const emoji = success ? '✅' : '❌';
  const statusText = success ? 'SUCCESS' : 'FAILURE';

  // Build formatted message
  const textParts = [];
  textParts.push(`${emoji} *${scriptName}* - ${statusText}`);
  textParts.push('');
  textParts.push('*Results:*');
  textParts.push(`  Queries executed: ${totalQueries}`);
  textParts.push(`  Tweets found: ${tweetsFound}`);
  textParts.push(`  New KOLs added: ${kolsAdded}`);
  textParts.push(`  Total KOLs in DB: ${totalKols}`);

  if (apiStats) {
    textParts.push('');
    textParts.push('');
    textParts.push('*API Consumption:*');
    textParts.push(formatApiStats(apiStats.overall));

    if (apiStats.byEndpoint && Object.keys(apiStats.byEndpoint).length > 0) {
      textParts.push('');
      textParts.push(formatEndpointStats(apiStats.byEndpoint));
    }
  }

  if (error) {
    textParts.push('');
    textParts.push('');
    textParts.push(`*Error:* ${error}`);
  }

  if (runUrl) {
    textParts.push('');
    textParts.push('');
    textParts.push(`<${runUrl}|View Workflow Run>`);
  }

  // Simplified 3-field payload
  const payload = {
    Message: textParts.join('\n'),
    Timestamp: new Date().toISOString(),
    Type: success ? 'SUCCESS' : 'ERROR'
  };

  try {
    const result = await sendToZapier(payload);
    console.log('✅ Sent notification to Zapier/Slack');
    return result;
  } catch (err) {
    console.error('❌ Failed to send notification to Zapier:', err.message);
    // Don't throw - notification failure shouldn't break the workflow
    return { success: false, error: err.message };
  }
}

/**
 * Send KOL reply completion notification
 * @param {Object} options - Notification options
 */
export async function sendReplyNotification(options) {
  const {
    success = true,
    tweetsEvaluated = 0,
    tweetsSkipped = 0,
    repliesPosted = 0,
    todayReplies = 0,
    maxRepliesPerDay = 7,
    totalReplies = 0,
    apiStats = null,
    error = null,
    dryRun = false,
    runUrl = null,
    replyDetails = null  // { replyText, replyUrl, originalTweetText, originalTweetUrl, kolUsername }
  } = options;

  const emoji = success ? '✅' : '❌';
  const statusText = success ? 'SUCCESS' : 'FAILURE';

  // Build formatted message
  const textParts = [];
  textParts.push(`${emoji} *KOL Reply Evaluation* - ${statusText}`);

  if (dryRun) {
    textParts.push('');
    textParts.push('⚠️ *DRY RUN MODE* - No actual tweets posted');
  }

  textParts.push('');
  textParts.push('*Results:*');
  textParts.push(`  Tweets evaluated: ${tweetsEvaluated}`);
  textParts.push(`  Tweets skipped: ${tweetsSkipped}`);
  textParts.push(`  Replies posted (this run): ${repliesPosted}`);
  textParts.push(`  Replies today: ${todayReplies}/${maxRepliesPerDay}`);
  textParts.push(`  Total replies all time: ${totalReplies}`);

  // If successful reply with details, show them
  if (success && replyDetails && repliesPosted > 0) {
    textParts.push('');
    textParts.push('');
    textParts.push('*Latest Reply Sent:*');
    textParts.push(`*Our Reply:* "${replyDetails.replyText}"`);
    if (replyDetails.replyUrl) {
      textParts.push(`<${replyDetails.replyUrl}|View Our Reply Tweet>`);
    }
    textParts.push('');
    textParts.push(`*Original Tweet by @${replyDetails.kolUsername}:*`);
    textParts.push(`"${replyDetails.originalTweetText}"`);
    if (replyDetails.originalTweetUrl) {
      textParts.push(`<${replyDetails.originalTweetUrl}|View Original Tweet>`);
    }
  }

  if (apiStats) {
    textParts.push('');
    textParts.push('');
    textParts.push('*API Consumption:*');
    textParts.push(formatApiStats(apiStats.overall));

    if (apiStats.byEndpoint && Object.keys(apiStats.byEndpoint).length > 0) {
      textParts.push('');
      textParts.push(formatEndpointStats(apiStats.byEndpoint));
    }
  }

  if (error) {
    textParts.push('');
    textParts.push('');
    textParts.push(`*Error:* ${error}`);
  }

  if (runUrl) {
    textParts.push('');
    textParts.push('');
    textParts.push(`<${runUrl}|View Workflow Run>`);
  }

  // Simplified 3-field payload
  const payload = {
    Message: textParts.join('\n'),
    Timestamp: new Date().toISOString(),
    Type: success ? 'SUCCESS' : 'ERROR'
  };

  try {
    const result = await sendToZapier(payload);
    console.log('✅ Sent notification to Zapier/Slack');
    return result;
  } catch (err) {
    console.error('❌ Failed to send notification to Zapier:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send error/failure notification
 * @param {Object} options - Notification options
 */
export async function sendErrorNotification(options) {
  const {
    scriptName = 'KOL Script',
    error,
    context = {},
    runUrl = null
  } = options;

  // Build formatted message
  const textParts = [];
  textParts.push(`❌ *${scriptName}* - FAILURE`);
  textParts.push('');
  textParts.push(`*Error:* ${error.message || String(error)}`);

  if (Object.keys(context).length > 0) {
    textParts.push('');
    textParts.push('');
    textParts.push('*Context:*');
    for (const [key, value] of Object.entries(context)) {
      textParts.push(`  ${key}: ${JSON.stringify(value)}`);
    }
  }

  if (runUrl) {
    textParts.push('');
    textParts.push('');
    textParts.push(`<${runUrl}|View Workflow Run>`);
  }

  // Simplified 3-field payload
  const payload = {
    Message: textParts.join('\n'),
    Timestamp: new Date().toISOString(),
    Type: 'ERROR'
  };

  try {
    const result = await sendToZapier(payload);
    console.log('✅ Sent error notification to Zapier/Slack');
    return result;
  } catch (err) {
    console.error('❌ Failed to send error notification to Zapier:', err.message);
    return { success: false, error: err.message };
  }
}

export default {
  sendToZapier,
  sendDiscoveryNotification,
  sendReplyNotification,
  sendErrorNotification
};
