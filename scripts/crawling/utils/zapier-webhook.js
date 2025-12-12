/**
 * Zapier Webhook Integration
 * Sends formatted messages to Slack via Zapier
 */

import https from 'https';
import http from 'http';
import { loadKolsData } from './kol-utils.js';

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
 * Format KOL list for Slack display
 * @param {Array} kols - Array of KOL objects
 * @returns {string} Formatted text
 */
function formatKolList(kols) {
  const lines = [];

  // Sort by followers count descending
  const sortedKols = [...kols].sort((a, b) => b.followersCount - a.followersCount);

  sortedKols.forEach((kol, index) => {
    const followerCount = kol.followersCount.toLocaleString();
    lines.push(`${index + 1}. @${kol.username} - ${followerCount} followers, ${kol.cryptoRelevanceScore}% relevance`);
  });

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
    queriesExecuted = 0,
    totalQueries = 0,  // Keep for backward compatibility
    tweetsFound = 0,
    kolsAdded = 0,
    totalKols = 0,
    method = null,  // 'scrapfly', 'crawlee', etc.
    duration = null,
    apiStats = null,
    apiCalls = null,  // Alternative to apiStats
    error = null,
    runUrl = null,
    discardedKols = [],  // Array of { username, reason }
    candidatesProcessed = 0
  } = options;

  const emoji = success ? '✅' : '❌';
  const statusText = success ? 'SUCCESS' : 'FAILURE';

  // Build formatted message
  const textParts = [];
  textParts.push(`${emoji} *${scriptName}* - ${statusText}`);

  // Add method if provided
  if (method) {
    textParts.push(`*Method:* ${method}`);
  }

  // Add duration if provided
  if (duration) {
    textParts.push(`*Duration:* ${duration}s`);
  }

  textParts.push('');
  textParts.push('*Results:*');
  textParts.push(`  Candidates processed: ${candidatesProcessed}`);
  textParts.push(`  ✅ New KOLs added: ${kolsAdded}`);
  textParts.push(`  ❌ Discarded: ${discardedKols.length}`);
  textParts.push(`  Total KOLs tracked: ${totalKols}`);

  // Show discarded KOLs with reasons
  if (discardedKols.length > 0) {
    textParts.push('');
    textParts.push('*Discarded Candidates:*');

    // Group by reason
    const byReason = {};
    for (const { username, reason } of discardedKols) {
      if (!byReason[reason]) byReason[reason] = [];
      byReason[reason].push(username);
    }

    for (const [reason, usernames] of Object.entries(byReason)) {
      if (usernames.length <= 3) {
        textParts.push(`  • ${reason}: @${usernames.join(', @')}`);
      } else {
        textParts.push(`  • ${reason}: @${usernames.slice(0, 3).join(', @')} +${usernames.length - 3} more`);
      }
    }
  }

  // Handle both apiStats and apiCalls format
  if (apiStats) {
    textParts.push('');
    textParts.push('');
    textParts.push('*API Consumption:*');
    textParts.push(formatApiStats(apiStats.overall));

    if (apiStats.byEndpoint && Object.keys(apiStats.byEndpoint).length > 0) {
      textParts.push('');
      textParts.push(formatEndpointStats(apiStats.byEndpoint));
    }
  } else if (apiCalls) {
    textParts.push('');
    textParts.push('');
    textParts.push('*API Calls:*');
    textParts.push(`  Total: ${apiCalls.total || 0}`);
    textParts.push(`  Successful: ${apiCalls.successful || 0}`);
    textParts.push(`  Failed: ${apiCalls.failed || 0}`);
  }

  if (error) {
    textParts.push('');
    textParts.push('');
    // Handle error serialization properly
    const errorMessage = typeof error === 'object'
      ? (error.message || JSON.stringify(error, Object.getOwnPropertyNames(error)))
      : String(error);
    textParts.push(`*Error:* ${errorMessage}`);

    // Add error stack trace for debugging if available
    if (error && error.stack) {
      textParts.push('');
      textParts.push('*Stack Trace:*');
      textParts.push('```');
      textParts.push(error.stack.substring(0, 500)); // Limit to 500 chars
      textParts.push('```');
    }
  }

  if (runUrl) {
    textParts.push('');
    textParts.push('');
    textParts.push(`<${runUrl}|View Workflow Run>`);
  }

  // Enhanced payload with Process field
  const payload = {
    Message: textParts.join('\n'),
    Timestamp: new Date().toISOString(),
    Type: success ? 'SUCCESS' : 'ERROR',
    Process: 'discovery'
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
    totalKols = 0,
    activeKols = 0,
    kolsProcessed = 0,  // NEW: KOLs actually checked this run
    apiStats = null,
    error = null,
    dryRun = false,
    runUrl = null,
    replyDetails = null  // { replyText, replyUrl, originalTweetText, originalTweetUrl, kolUsername }
  } = options;

  const emoji = success ? '✅' : '❌';
  const statusText = success ? 'SUCCESS' : 'FAILURE';

  // Calculate selection rate
  const tweetsConsidered = tweetsEvaluated > 0 ? tweetsEvaluated : 1; // Avoid division by zero
  const selectionRate = ((repliesPosted / tweetsConsidered) * 100).toFixed(1);
  const skipRate = ((tweetsSkipped / tweetsConsidered) * 100).toFixed(1);

  // Build formatted message
  const textParts = [];
  textParts.push(`${emoji} *KOL Reply Evaluation* - ${statusText}`);

  if (dryRun) {
    textParts.push('');
    textParts.push('⚠️ *DRY RUN MODE* - No actual tweets posted');
  }

  textParts.push('');
  textParts.push('*KOL Database:*');
  textParts.push(`  Total tracked: ${totalKols}`);
  textParts.push(`  Active: ${activeKols}`);
  if (kolsProcessed > 0) {
    textParts.push(`  Checked this run: ${kolsProcessed}`);
  }

  textParts.push('');
  textParts.push('*Tweet Processing:*');
  textParts.push(`  📊 Tweets checked: ${tweetsEvaluated}`);
  textParts.push(`  ✅ Selected for reply: ${repliesPosted} (${selectionRate}%)`);
  textParts.push(`  ⏭️  Skipped: ${tweetsSkipped} (${skipRate}%)`);

  textParts.push('');
  textParts.push('*Reply Stats:*');
  textParts.push(`  Posted this run: ${repliesPosted}`);
  textParts.push(`  Today total: ${todayReplies}/${maxRepliesPerDay}`);
  textParts.push(`  All time: ${totalReplies}`);

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
    // Handle error serialization properly
    const errorMessage = typeof error === 'object'
      ? (error.message || JSON.stringify(error, Object.getOwnPropertyNames(error)))
      : String(error);
    textParts.push(`*Error:* ${errorMessage}`);

    // Add error stack trace for debugging if available
    if (error && error.stack) {
      textParts.push('');
      textParts.push('*Stack Trace:*');
      textParts.push('```');
      textParts.push(error.stack.substring(0, 500)); // Limit to 500 chars
      textParts.push('```');
    }
  }

  if (runUrl) {
    textParts.push('');
    textParts.push('');
    textParts.push(`<${runUrl}|View Workflow Run>`);
  }

  // Enhanced payload with Process field
  const payload = {
    Message: textParts.join('\n'),
    Timestamp: new Date().toISOString(),
    Type: success ? 'SUCCESS' : 'ERROR',
    Process: 'reply'
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
    runUrl = null,
    process = 'error'  // 'discovery', 'reply', or 'error'
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

  // Enhanced payload with Process field
  const payload = {
    Message: textParts.join('\n'),
    Timestamp: new Date().toISOString(),
    Type: 'ERROR',
    Process: process
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

/**
 * Send article post notification
 * @param {Object} options - Notification options
 */
export async function sendArticlePostNotification(options) {
  const {
    success = true,
    product,
    articleTitle,
    articleUrl,
    docsUrl,
    postUrl,
    postText,
    hashtags = [],
    error = null,
    runUrl = null
  } = options;

  const emoji = success ? '✅' : '❌';
  const statusText = success ? 'POSTED' : 'FAILED';

  // Build formatted message
  const textParts = [];
  textParts.push(`${emoji} *Article Content Posted* - ${statusText}`);
  textParts.push('');
  textParts.push(`*Product:* ${product}`);
  textParts.push(`*Article:* ${articleTitle}`);
  textParts.push('');
  textParts.push('*Links:*');
  textParts.push(`  📖 Article: <${articleUrl}|View Article>`);
  textParts.push(`  📚 Docs: <${docsUrl}|View Docs>`);
  if (postUrl) {
    textParts.push(`  🐦 Post: <${postUrl}|View on X>`);
  }

  if (postText) {
    textParts.push('');
    textParts.push('*Posted Text:*');
    textParts.push(`"${postText}"`);
  }

  if (hashtags && hashtags.length > 0) {
    textParts.push('');
    textParts.push(`*Hashtags:* ${hashtags.map(t => `#${t}`).join(' ')}`);
  }

  if (error) {
    textParts.push('');
    textParts.push('');
    const errorMessage = typeof error === 'object'
      ? (error.message || JSON.stringify(error, Object.getOwnPropertyNames(error)))
      : String(error);
    textParts.push(`*Error:* ${errorMessage}`);
  }

  if (runUrl) {
    textParts.push('');
    textParts.push('');
    textParts.push(`<${runUrl}|View Workflow Run>`);
  }

  const payload = {
    Message: textParts.join('\n'),
    Timestamp: new Date().toISOString(),
    Type: success ? 'SUCCESS' : 'ERROR',
    Process: 'article_post'
  };

  try {
    const result = await sendToZapier(payload);
    console.log('✅ Sent article post notification to Zapier/Slack');
    return result;
  } catch (err) {
    console.error('❌ Failed to send article post notification to Zapier:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send timeline monitoring notification (Script 2.2.1)
 * Simplified notification showing tweets selected for reply processing
 */
export async function sendMonitorNotification(options) {
  const {
    success = true,
    kolsProcessed = 0,
    tweetsEvaluated = 0,
    tweetsSelected = 0,
    tweetsSkipped = 0,
    totalKols = 0,
    totalEngagingPosts = 0,
    duration = '0',
    dryRun = false,
    runUrl = null
  } = options;

  const emoji = success ? ':white_check_mark:' : ':x:';
  const statusText = success ? 'SUCCESS' : 'NO TWEETS SELECTED';

  const selectionRate = tweetsEvaluated > 0 ? ((tweetsSelected / tweetsEvaluated) * 100).toFixed(1) : '0.0';

  const textParts = [];
  textParts.push(`${emoji} *KOL Timeline Monitoring* - ${statusText}`);

  textParts.push('');
  textParts.push('*KOLs Monitored:*');
  textParts.push(`  Processed: ${kolsProcessed}/${totalKols}`);

  textParts.push('');
  textParts.push('*Timeline Scanning:*');
  textParts.push(`  :mag: Tweets scanned: ${tweetsEvaluated}`);
  textParts.push(`  :white_check_mark: Selected for reply: ${tweetsSelected} (${selectionRate}%)`);
  textParts.push(`  :no_entry_sign: Skipped: ${tweetsSkipped}`);

  textParts.push('');
  textParts.push('*Engaging Posts Queue:*');
  textParts.push(`  Total posts awaiting reply: ${totalEngagingPosts}`);
  textParts.push(`  Added this run: ${tweetsSelected}`);

  textParts.push('');
  textParts.push(`*Duration:* ${duration}s`);

  if (dryRun) {
    textParts.push('');
    textParts.push(':warning: *DRY RUN MODE* - No changes saved');
  }

  if (runUrl) {
    textParts.push('');
    textParts.push(`<${runUrl}|View Workflow Run>`);
  }

  const payload = {
    Message: textParts.join('\n'),
    Timestamp: new Date().toISOString(),
    Type: success ? 'SUCCESS' : 'WARNING',
    Process: 'monitor'
  };

  try {
    console.log(`\n📤 Sending timeline monitoring notification to Zapier...`);
    await sendToZapier(payload);
    console.log('✅ Zapier notification sent successfully\n');
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send Zapier notification:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send product-specific reply notification
 * For educational thread replies targeting customer acquisition
 * @param {Object} options - Notification options
 */
export async function sendProductReplyNotification(options) {
  const {
    success = true,
    tweetsEvaluated = 0,
    tweetsSkipped = 0,
    threadsPosted = 0,
    totalThreads = 0,
    averageRelevance = 0,
    byProduct = {},
    byApproach = {},
    queueSize = 0,
    error = null,
    runUrl = null,
    lastThreadDetails = null  // { product, threadPreview, threadUrl, originalTweetText, originalTweetUrl, originalAuthor, relevanceScore, approach }
  } = options;

  const emoji = success ? '✅' : '❌';
  const statusText = success ? 'SUCCESS' : 'FAILURE';

  // Calculate selection rate
  const tweetsConsidered = tweetsEvaluated > 0 ? tweetsEvaluated : 1;
  const selectionRate = ((threadsPosted / tweetsConsidered) * 100).toFixed(1);

  // Build formatted message
  const textParts = [];
  textParts.push(`${emoji} *Product-Specific Reply Automation* - ${statusText}`);
  textParts.push('');
  textParts.push('*Customer Acquisition via Educational Threads*');

  textParts.push('');
  textParts.push('*Tweet Processing:*');
  textParts.push(`  📊 Tweets evaluated: ${tweetsEvaluated}`);
  textParts.push(`  ✅ Threads posted: ${threadsPosted} (${selectionRate}%)`);
  textParts.push(`  ⏭️  Skipped (low relevance): ${tweetsSkipped}`);

  textParts.push('');
  textParts.push('*Overall Stats:*');
  textParts.push(`  Total threads all-time: ${totalThreads}`);
  textParts.push(`  Average relevance score: ${averageRelevance}/100`);
  textParts.push(`  Queue size: ${queueSize} unprocessed tweets`);

  // Product breakdown
  if (Object.keys(byProduct).length > 0) {
    textParts.push('');
    textParts.push('*By Product:*');
    for (const [product, count] of Object.entries(byProduct)) {
      textParts.push(`  ${product}: ${count} threads`);
    }
  }

  // Approach breakdown
  if (Object.keys(byApproach).length > 0) {
    textParts.push('');
    textParts.push('*By Approach:*');
    for (const [approach, count] of Object.entries(byApproach)) {
      textParts.push(`  ${approach}: ${count} threads`);
    }
  }

  // If successful thread with details, show them
  if (success && lastThreadDetails && threadsPosted > 0) {
    textParts.push('');
    textParts.push('');
    textParts.push('*Latest Thread Posted:*');
    textParts.push(`*Product:* ${lastThreadDetails.product}`);
    textParts.push(`*Relevance Score:* ${lastThreadDetails.relevanceScore}/100`);
    textParts.push(`*Approach:* ${lastThreadDetails.approach}`);
    textParts.push('');
    textParts.push(`*Our Thread Preview:*`);
    textParts.push(`"${lastThreadDetails.threadPreview}"`);
    if (lastThreadDetails.threadUrl) {
      textParts.push(`<${lastThreadDetails.threadUrl}|View Thread on X>`);
    }
    textParts.push('');
    textParts.push(`*Replying to @${lastThreadDetails.originalAuthor}:*`);
    textParts.push(`"${lastThreadDetails.originalTweetText}"`);
    if (lastThreadDetails.originalTweetUrl) {
      textParts.push(`<${lastThreadDetails.originalTweetUrl}|View Original Tweet>`);
    }
  }

  if (error) {
    textParts.push('');
    textParts.push('');
    const errorMessage = typeof error === 'object'
      ? (error.message || JSON.stringify(error, Object.getOwnPropertyNames(error)))
      : String(error);
    textParts.push(`*Error:* ${errorMessage}`);

    if (error && error.stack) {
      textParts.push('');
      textParts.push('*Stack Trace:*');
      textParts.push('```');
      textParts.push(error.stack.substring(0, 500));
      textParts.push('```');
    }
  }

  if (runUrl) {
    textParts.push('');
    textParts.push('');
    textParts.push(`<${runUrl}|View Workflow Run>`);
  }

  // Enhanced payload with Process field
  const payload = {
    Message: textParts.join('\n'),
    Timestamp: new Date().toISOString(),
    Type: success ? 'SUCCESS' : 'ERROR',
    Process: 'product_reply'
  };

  try {
    const result = await sendToZapier(payload);
    console.log('✅ Sent product reply notification to Zapier/Slack');
    return result;
  } catch (err) {
    console.error('❌ Failed to send product reply notification to Zapier:', err.message);
    return { success: false, error: err.message };
  }
}

// Named export for ScrapFly error handler compatibility
export const sendRequest = sendToZapier;

export default {
  sendToZapier,
  sendRequest,
  sendDiscoveryNotification,
  sendReplyNotification,
  sendArticlePostNotification,
  sendErrorNotification,
  sendMonitorNotification,
  sendProductReplyNotification
};
