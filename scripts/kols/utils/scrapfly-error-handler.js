/**
 * ScrapFly Error Handler
 * Detects ScrapFly errors and sends Zapier webhooks using existing 4-field format
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROCESSED_POSTS_PATH = path.join(__dirname, '../data/processed-posts.json');
const KOL_REPLIES_PATH = path.join(__dirname, '../data/kol-replies.json');

/**
 * Error types that trigger Zapier alerts
 */
export const ERROR_TYPES = {
  AUTH_FAILURE: 'auth_failure',
  CREDITS_EXHAUSTED: 'credits_exhausted',
  SYSTEMATIC_FAILURE: 'systematic_failure',
  QUOTA_NOT_MET: 'quota_not_met',
};

/**
 * Get ScrapFly status from processed posts file
 */
async function getScrapFlyStatus() {
  try {
    const data = JSON.parse(await fs.readFile(PROCESSED_POSTS_PATH, 'utf-8'));
    return data.scrapflyStatus || {
      enabled: true,
      lastSuccess: null,
      consecutiveFailures: 0,
      lastError: null,
      fallbackActive: false,
      creditsRemaining: null,
    };
  } catch {
    return {
      enabled: true,
      lastSuccess: null,
      consecutiveFailures: 0,
      lastError: null,
      fallbackActive: false,
      creditsRemaining: null,
    };
  }
}

/**
 * Update ScrapFly status in processed posts file
 */
async function updateScrapFlyStatus(updates) {
  try {
    const data = JSON.parse(await fs.readFile(PROCESSED_POSTS_PATH, 'utf-8'));
    data.scrapflyStatus = {
      ...data.scrapflyStatus,
      ...updates,
    };
    await fs.writeFile(PROCESSED_POSTS_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to update ScrapFly status:', error.message);
  }
}

/**
 * Check if error is auth-related (401/403)
 */
export function isAuthError(error) {
  const message = error.message || String(error);
  return message.includes('401') || message.includes('403') ||
         message.includes('Unauthorized') || message.includes('Forbidden') ||
         message.includes('authentication') || message.includes('auth');
}

/**
 * Check if error is credits exhaustion
 */
export function isCreditsExhausted(error) {
  const message = error.message || String(error);
  return message.includes('credit') && (
    message.includes('exhaust') || message.includes('depleted') ||
    message.includes('insufficient') || message.includes('limit')
  );
}

/**
 * Get today's reply count
 */
async function getTodayReplyCount() {
  try {
    const data = JSON.parse(await fs.readFile(KOL_REPLIES_PATH, 'utf-8'));
    const today = new Date().toISOString().split('T')[0];
    const todayReplies = data.replies?.filter(r =>
      r.postedAt?.startsWith(today)
    ) || [];
    return todayReplies.length;
  } catch {
    return 0;
  }
}

/**
 * Format Zapier webhook message for ScrapFly errors
 * Uses existing 4-field format: Message, Timestamp, Type, Process
 */
function formatZapierMessage(errorType, details) {
  const timestamp = new Date().toISOString();
  let message = '';

  switch (errorType) {
    case ERROR_TYPES.AUTH_FAILURE:
      message = `❌ *ScrapFly Search* - AUTH FAILURE

*Error:* Cookie authentication failed (${details.statusCode || '401/403'})

*Details:*
  • Cookies expired or invalid
  • Last successful search: ${details.lastSuccess || 'Never'}
  • Consecutive failures: ${details.consecutiveFailures || 0}
  • Credits remaining: ${details.creditsRemaining || 'Unknown'}

*Fallback Status:*
  ✅ Switched to Crawlee search method
  ✅ KOL discovery continuing normally
  ✅ Reply posting unaffected

*Action Required:*
  Refresh cookies in \`scripts/kols/config/x-crawler-accounts.json\`
  Run: \`node scripts/kols/save-cookies.js\`

${details.workflowUrl ? `<${details.workflowUrl}|View Workflow Run>` : ''}`;
      break;

    case ERROR_TYPES.CREDITS_EXHAUSTED:
      message = `❌ *ScrapFly Search* - CREDITS EXHAUSTED

*Error:* ScrapFly API credits depleted

*Details:*
  • Credits remaining: ${details.creditsRemaining || 0}
  • Last successful search: ${details.lastSuccess || 'Unknown'}
  • Queries attempted: ${details.queriesAttempted || 0}

*Fallback Status:*
  ✅ Switched to Crawlee search method
  ✅ KOL discovery continuing normally
  ✅ Reply posting unaffected

*Action Required:*
  Top up ScrapFly credits at <https://scrapfly.io/dashboard|ScrapFly Dashboard>
  Current balance: ${details.creditsRemaining || 0} credits

${details.workflowUrl ? `<${details.workflowUrl}|View Workflow Run>` : ''}`;
      break;

    case ERROR_TYPES.SYSTEMATIC_FAILURE:
      message = `⚠️ *ScrapFly Search* - SYSTEMATIC FAILURE

*Error:* ${details.consecutiveFailures || 3}+ consecutive search failures detected

*Recent Errors:*
  • ${details.lastError || 'Unknown error'}
  • Last success: ${details.lastSuccess || 'More than 24h ago'}
  • Failure count: ${details.consecutiveFailures || 0}

*Fallback Status:*
  ✅ Permanently switched to Crawlee search
  ✅ KOL discovery continuing
  ⚠️  Manual intervention required to re-enable ScrapFly

*Action Required:*
  1. Review ScrapFly configuration and logs
  2. Check API key validity
  3. Verify cookie freshness
  4. Test manually: \`node scripts/kols/test-search-with-accounts.js\`

${details.workflowUrl ? `<${details.workflowUrl}|View Workflow Run>` : ''}`;
      break;

    case ERROR_TYPES.QUOTA_NOT_MET:
      message = `⚠️ *KOL Engagement* - LOW REPLY QUOTA

*Warning:* Only ${details.repliesPosted || 0}/${details.targetReplies || 15} replies posted today (${Math.round((details.repliesPosted || 0) / (details.targetReplies || 15) * 100)}%)

*Possible Issues:*
  • Not enough engaging content found in searches
  • Search queries not returning quality results
  • Reply evaluation too strict

*Current Status:*
  • KOLs tracked: ${details.kolsTracked || 'Unknown'}
  • Tweets evaluated today: ${details.tweetsEvaluated || 'Unknown'}
  • Posts in queue: ${details.postsInQueue || 0}

*Recommended Actions:*
  • Review search query effectiveness
  • Consider lowering engagement thresholds
  • Expand search query categories
  • Check if ScrapFly is functioning properly

${details.workflowUrl ? `<${details.workflowUrl}|View Workflow Run>` : ''}`;
      break;

    default:
      message = `❌ *ScrapFly Error* - UNKNOWN

*Error:* ${details.error || 'Unknown error occurred'}

*Details:*
${JSON.stringify(details, null, 2)}`;
  }

  return {
    Message: message,
    Timestamp: timestamp,
    Type: 'ERROR',
    Process: 'discovery',
  };
}

/**
 * Send Zapier webhook alert
 */
async function sendZapierAlert(errorType, details) {
  try {
    // Import zapier webhook utility
    const { sendRequest } = await import('./zapier-webhook.js');

    const payload = formatZapierMessage(errorType, details);
    await sendRequest(payload);

    console.log(`✅ Zapier alert sent: ${errorType}`);
  } catch (error) {
    console.error('Failed to send Zapier alert:', error.message);
  }
}

/**
 * Handle ScrapFly error and trigger appropriate alerts
 */
export async function handleScrapFlyError(error, context = {}) {
  const status = await getScrapFlyStatus();

  // Determine error type
  let errorType = null;
  const details = {
    error: error.message || String(error),
    lastSuccess: status.lastSuccess,
    consecutiveFailures: status.consecutiveFailures + 1,
    creditsRemaining: context.creditsRemaining || status.creditsRemaining,
    workflowUrl: context.workflowUrl,
  };

  if (isAuthError(error)) {
    errorType = ERROR_TYPES.AUTH_FAILURE;
    details.statusCode = error.statusCode || '401/403';
  } else if (isCreditsExhausted(error)) {
    errorType = ERROR_TYPES.CREDITS_EXHAUSTED;
    details.queriesAttempted = context.queriesAttempted;
  } else if (status.consecutiveFailures >= 2) { // Will be 3 after increment
    errorType = ERROR_TYPES.SYSTEMATIC_FAILURE;
    details.lastError = error.message;
  }

  // Update status
  await updateScrapFlyStatus({
    consecutiveFailures: details.consecutiveFailures,
    lastError: error.message,
    fallbackActive: true,
  });

  // Send alert if error type identified
  if (errorType) {
    await sendZapierAlert(errorType, details);
  }

  return { errorType, fallbackActive: true };
}

/**
 * Handle successful ScrapFly operation (reset failure counters)
 */
export async function handleScrapFlySuccess(context = {}) {
  await updateScrapFlyStatus({
    lastSuccess: new Date().toISOString(),
    consecutiveFailures: 0,
    lastError: null,
    fallbackActive: false,
    creditsRemaining: context.creditsRemaining,
  });
}

/**
 * Check daily reply quota and alert if not met
 */
export async function checkReplyQuota(targetReplies = 15) {
  const repliesPosted = await getTodayReplyCount();
  const percentage = (repliesPosted / targetReplies) * 100;

  // Alert if less than 50% of target met (after 6pm UTC, giving full day)
  const hour = new Date().getUTCHours();
  if (hour >= 18 && percentage < 50) {
    const status = await getScrapFlyStatus();

    const details = {
      repliesPosted,
      targetReplies,
      percentage: Math.round(percentage),
      kolsTracked: 'Check kols-data.json',
      tweetsEvaluated: 'Check logs',
      postsInQueue: 'Check engaging-posts.json',
    };

    await sendZapierAlert(ERROR_TYPES.QUOTA_NOT_MET, details);
  }
}

/**
 * Get current ScrapFly health status
 */
export async function getHealthStatus() {
  const status = await getScrapFlyStatus();
  return {
    healthy: !status.fallbackActive && status.consecutiveFailures === 0,
    status: status,
    lastCheck: new Date().toISOString(),
  };
}

export default {
  handleScrapFlyError,
  handleScrapFlySuccess,
  checkReplyQuota,
  getHealthStatus,
  ERROR_TYPES,
  isAuthError,
  isCreditsExhausted,
};
