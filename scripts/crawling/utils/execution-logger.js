/**
 * Execution Logger - Logs workflow execution metrics for README history generation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOGS_FILE = path.join(__dirname, '..', 'data', 'execution-logs.json');

/**
 * Load existing execution logs
 */
function loadExecutionLogs() {
  try {
    if (!fs.existsSync(LOGS_FILE)) {
      return {
        'morning-discovery': [],
        'search-discovery': [],
        'content-discovery': []
      };
    }

    const data = fs.readFileSync(LOGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading execution logs:', error.message);
    return {
      'morning-discovery': [],
      'search-discovery': [],
      'content-discovery': []
    };
  }
}

/**
 * Save execution logs
 */
function saveExecutionLogs(logs) {
  try {
    fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving execution logs:', error.message);
    return false;
  }
}

/**
 * Log morning discovery execution
 */
export function logMorningDiscovery(metrics) {
  try {
    const logs = loadExecutionLogs();

    const entry = {
      timestamp: new Date().toISOString(),
      environment: process.env.GITHUB_ACTIONS ? 'GitHub' : 'Local',
      candidatesStart: metrics.candidatesStart || 0,
      candidatesChecked: metrics.candidatesChecked || 0,
      kolsDiscovered: metrics.kolsAdded || 0,
      candidatesRemaining: metrics.candidatesRemaining || 0,
      topDiscovery: metrics.topDiscovery || null,
      profilesRetrieved: metrics.profilesRetrieved || 0,
      errors: metrics.errors?.length || 0,
      duration: metrics.duration || 0,
      success: metrics.kolsAdded > 0
    };

    // Add to beginning of array (most recent first)
    logs['morning-discovery'].unshift(entry);

    // Keep only last 50 entries
    logs['morning-discovery'] = logs['morning-discovery'].slice(0, 50);

    saveExecutionLogs(logs);
    console.log('✅ Logged morning discovery execution');
    return true;
  } catch (error) {
    console.error('Error logging morning discovery:', error.message);
    return false;
  }
}

/**
 * Log search-based discovery execution
 */
export function logSearchDiscovery(metrics) {
  try {
    const logs = loadExecutionLogs();

    const entry = {
      timestamp: new Date().toISOString(),
      environment: process.env.GITHUB_ACTIONS ? 'GitHub' : 'Local',
      queriesExecuted: metrics.queriesExecuted || 0,
      queriesUsed: metrics.queriesUsed || [],
      tweetsFound: metrics.totalTweetsFound || 0,
      tweetsAnalyzed: metrics.tweetsFiltered || 0,
      candidatesChecked: metrics.profilesFetched || 0,
      kolsDiscovered: metrics.kolsAdded || 0,
      topDiscovery: metrics.topDiscovery || null,
      errors: metrics.errors?.length || 0,
      duration: metrics.duration || 0,
      success: metrics.kolsAdded > 0
    };

    // Add to beginning of array
    logs['search-discovery'].unshift(entry);

    // Keep only last 50 entries
    logs['search-discovery'] = logs['search-discovery'].slice(0, 50);

    saveExecutionLogs(logs);
    console.log('✅ Logged search discovery execution');
    return true;
  } catch (error) {
    console.error('Error logging search discovery:', error.message);
    return false;
  }
}

/**
 * Log content discovery execution
 */
export function logContentDiscovery(metrics) {
  try {
    const logs = loadExecutionLogs();

    const entry = {
      timestamp: new Date().toISOString(),
      environment: process.env.GITHUB_ACTIONS ? 'GitHub' : 'Local',
      kolsMonitored: metrics.kolsMonitored || 0,
      postsFound: metrics.postsFound || 0,
      highRelevance: metrics.highRelevance || 0,
      duration: metrics.duration || 0,
      success: metrics.postsFound > 0
    };

    // Add to beginning of array
    logs['content-discovery'].unshift(entry);

    // Keep only last 50 entries
    logs['content-discovery'] = logs['content-discovery'].slice(0, 50);

    saveExecutionLogs(logs);
    console.log('✅ Logged content discovery execution');
    return true;
  } catch (error) {
    console.error('Error logging content discovery:', error.message);
    return false;
  }
}

/**
 * Get execution logs by workflow type
 */
export function getExecutionLogs(workflowType) {
  const logs = loadExecutionLogs();
  return logs[workflowType] || [];
}

export default {
  logMorningDiscovery,
  logSearchDiscovery,
  logContentDiscovery,
  getExecutionLogs
};
