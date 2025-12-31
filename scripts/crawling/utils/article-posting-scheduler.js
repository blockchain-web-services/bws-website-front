/**
 * Article Posting Scheduler
 * Calculates optimal posting intervals based on article generation frequency
 *
 * Purpose: Eliminate bot-like behavior by spacing posts naturally
 * Algorithm: posting_interval = generation_window / articles_per_window
 *
 * Example:
 * - 4 articles/day → post every 8 hours
 * - 4 articles/2 days → post every 12 hours
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  // Rolling window for metrics calculation
  historyWindowDays: 14,

  // Allowed posting intervals (hours) - rounded for predictability
  allowedIntervals: [24, 48, 72],

  // Grace period to avoid double-posting (hours)
  gracePeriodHours: 2,

  // Minimum interval to prevent over-posting (hours)
  minIntervalHours: 24,

  // Maximum interval to prevent under-posting (hours)
  maxIntervalHours: 72,

  // Default interval when no history available (hours)
  defaultIntervalHours: 48
};

// File paths
const HISTORY_FILE = path.join(__dirname, '..', 'data', 'article-generation-history.json');
const POSTS_FILE = path.join(__dirname, '..', '..', 'data', 'article-x-posts.json');

/**
 * Load article generation history
 */
async function loadHistory() {
  try {
    const data = await fs.readFile(HISTORY_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist yet - return empty history
      return {
        history: [],
        rollingMetrics: null
      };
    }
    throw error;
  }
}

/**
 * Save article generation history
 */
async function saveHistory(historyData) {
  await fs.writeFile(HISTORY_FILE, JSON.stringify(historyData, null, 2), 'utf-8');
}

/**
 * Load article posts data
 */
async function loadPosts() {
  try {
    const data = await fs.readFile(POSTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { posts: [] };
    }
    throw error;
  }
}

/**
 * Calculate rolling metrics from generation history
 */
function calculateRollingMetrics(history) {
  if (history.length === 0) {
    return null;
  }

  const now = new Date();
  const cutoffDate = new Date(now - CONFIG.historyWindowDays * 24 * 60 * 60 * 1000);

  // Filter to entries within rolling window
  const recentHistory = history.filter(entry =>
    new Date(entry.timestamp) >= cutoffDate
  );

  if (recentHistory.length === 0) {
    return null;
  }

  // Calculate totals
  const totalArticles = recentHistory.reduce((sum, entry) =>
    sum + entry.articlesGenerated, 0
  );

  // Calculate time span
  const oldestEntry = new Date(recentHistory[recentHistory.length - 1].timestamp);
  const newestEntry = new Date(recentHistory[0].timestamp);
  const daysElapsed = Math.max(
    (newestEntry - oldestEntry) / (1000 * 60 * 60 * 24),
    1 // Minimum 1 day
  );

  // Calculate articles per day
  const articlesPerDay = totalArticles / daysElapsed;

  // Calculate hours per article (raw)
  const hoursPerArticle = 24 / articlesPerDay;

  // Round to nearest allowed interval
  const intervalHours = roundToNearestInterval(hoursPerArticle);

  return {
    totalArticles,
    generationRuns: recentHistory.length,
    daysElapsed: Math.round(daysElapsed * 10) / 10,
    articlesPerDay: Math.round(articlesPerDay * 10) / 10,
    rawHoursPerArticle: Math.round(hoursPerArticle * 10) / 10,
    intervalHours
  };
}

/**
 * Round hours to nearest allowed interval
 */
function roundToNearestInterval(hours) {
  // Clamp to min/max
  const clampedHours = Math.max(
    CONFIG.minIntervalHours,
    Math.min(CONFIG.maxIntervalHours, hours)
  );

  // Find closest allowed interval
  return CONFIG.allowedIntervals.reduce((closest, interval) =>
    Math.abs(interval - clampedHours) < Math.abs(closest - clampedHours)
      ? interval
      : closest
  );
}

/**
 * Get last post time from article posts data
 */
function getLastPostTime(posts) {
  if (!posts || posts.length === 0) {
    return null;
  }

  // Find most recent posted article
  const postedArticles = posts.filter(p => p.status === 'posted');

  if (postedArticles.length === 0) {
    return null;
  }

  // Sort by postedAt descending
  postedArticles.sort((a, b) =>
    new Date(b.postedAt) - new Date(a.postedAt)
  );

  return postedArticles[0].postedAt;
}

/**
 * Check if sufficient time has passed to post next article
 */
function shouldPostNow(intervalHours, lastPostTime) {
  if (!lastPostTime) {
    // No posts yet - post immediately
    return true;
  }

  const now = new Date();
  const lastPost = new Date(lastPostTime);
  const hoursSinceLastPost = (now - lastPost) / (1000 * 60 * 60);

  // Allow posting if interval satisfied (with grace period)
  return hoursSinceLastPost >= (intervalHours - CONFIG.gracePeriodHours);
}

/**
 * Calculate complete posting schedule
 * Main function called by posting script
 *
 * @returns {Object} Schedule metadata and decision
 */
async function calculatePostingSchedule() {
  console.log('\n📅 Calculating posting schedule...');

  // Load data
  const historyData = await loadHistory();
  const postsData = await loadPosts();

  // Calculate metrics
  const metrics = calculateRollingMetrics(historyData.history);

  // Get last post time
  const lastPostTime = getLastPostTime(postsData.posts);

  // Determine interval
  let intervalHours;
  let metricsAvailable = false;

  if (metrics) {
    intervalHours = metrics.intervalHours;
    metricsAvailable = true;
  } else {
    // No history - use default
    intervalHours = CONFIG.defaultIntervalHours;
    console.log(`   ⚠️  No generation history - using default ${intervalHours}h interval`);
  }

  // Check if we should post now
  const shouldPost = shouldPostNow(intervalHours, lastPostTime);

  // Calculate time metrics
  const now = new Date();
  let hoursSinceLastPost = 0;
  let hoursUntilNextPost = intervalHours;
  let nextPostTime = null;

  if (lastPostTime) {
    const lastPost = new Date(lastPostTime);
    hoursSinceLastPost = (now - lastPost) / (1000 * 60 * 60);
    hoursUntilNextPost = Math.max(0, intervalHours - hoursSinceLastPost);

    nextPostTime = new Date(lastPost.getTime() + intervalHours * 60 * 60 * 1000);
  }

  return {
    // Decision
    shouldPost,

    // Interval
    intervalHours,

    // Metrics
    metricsAvailable,
    totalArticles: metrics?.totalArticles || 0,
    articlesPerDay: metrics?.articlesPerDay || 0,
    daysElapsed: metrics?.daysElapsed || 0,
    generationRuns: metrics?.generationRuns || 0,

    // Timing
    lastPostTime: lastPostTime || 'Never',
    hoursSinceLastPost: Math.round(hoursSinceLastPost * 10) / 10,
    hoursUntilNextPost: Math.round(hoursUntilNextPost * 10) / 10,
    nextPostTime: nextPostTime ? nextPostTime.toISOString() : 'Now',

    // Config
    gracePeriodHours: CONFIG.gracePeriodHours
  };
}

/**
 * Record article generation event
 * Called by article generation script after generating articles
 *
 * @param {number} articleCount - Number of articles generated
 */
async function recordArticleGeneration(articleCount) {
  console.log(`\n📊 Recording article generation event...`);
  console.log(`   Articles generated: ${articleCount}`);

  // Load current history
  const historyData = await loadHistory();

  // Add new entry
  const newEntry = {
    timestamp: new Date().toISOString(),
    articlesGenerated: articleCount,
    workflowRun: 'generate-articles.yml'
  };

  historyData.history.unshift(newEntry); // Add to beginning

  // Trim to rolling window
  const cutoffDate = new Date(Date.now() - CONFIG.historyWindowDays * 24 * 60 * 60 * 1000);
  historyData.history = historyData.history.filter(entry =>
    new Date(entry.timestamp) >= cutoffDate
  );

  // Recalculate metrics
  historyData.rollingMetrics = calculateRollingMetrics(historyData.history);

  // Save updated history
  await saveHistory(historyData);

  console.log(`   ✅ Generation recorded`);
  console.log(`   📈 History entries: ${historyData.history.length}`);

  if (historyData.rollingMetrics) {
    console.log(`   📊 Articles/day: ${historyData.rollingMetrics.articlesPerDay}`);
    console.log(`   ⏱️  Recommended interval: ${historyData.rollingMetrics.intervalHours}h`);
  }
}

/**
 * Get scheduler configuration (for debugging/monitoring)
 */
function getConfig() {
  return { ...CONFIG };
}

/**
 * Initialize history file if it doesn't exist
 */
async function initializeHistory() {
  try {
    await fs.access(HISTORY_FILE);
    // File exists, do nothing
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Create initial history file
      const initialData = {
        history: [],
        rollingMetrics: null
      };
      await saveHistory(initialData);
      console.log('   ✅ Initialized article-generation-history.json');
    } else {
      throw error;
    }
  }
}

export {
  calculatePostingSchedule,
  recordArticleGeneration,
  getConfig,
  initializeHistory
};
