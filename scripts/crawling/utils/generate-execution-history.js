/**
 * Generate Execution History Tables for README
 * Fetches GitHub Actions workflow runs and generates markdown tables
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getExecutionLogs } from './execution-logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WORKFLOWS = {
  'morning-discovery': {
    file: 'kol-discovery-morning.yml',
    name: 'Morning Discovery (Seed-Based)',
    section: '2.1.1'
  },
  'search-discovery': {
    file: 'kol-discovery-search.yml',
    name: 'Search-Based Discovery (Dynamic)',
    section: '2.1.2'
  },
  'content-discovery': {
    file: 'discover-content-scrapfly.yml',
    name: 'Content Discovery - Crawlee',
    section: '2.2.1'
  }
};

/**
 * Fetch workflow runs from GitHub Actions (last 10 days only)
 */
function fetchWorkflowRuns(workflowFile, limit = 20) {
  try {
    const cmd = `gh api repos/blockchain-web-services/bws-website-front/actions/workflows/${workflowFile}/runs --paginate=false -q '.workflow_runs[0:${limit}] | .[] | {conclusion, created_at, head_branch, run_number, event}'`;

    const output = execSync(cmd, { encoding: 'utf-8' });

    // Parse JSON lines
    const runs = output.trim().split('\n').map(line => JSON.parse(line));

    // Filter to last 10 days only
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    const recentRuns = runs.filter(run => {
      const runDate = new Date(run.created_at);
      return runDate >= tenDaysAgo;
    });

    return recentRuns.slice(0, 10); // Return max 10 runs
  } catch (error) {
    console.error(`Error fetching workflow runs for ${workflowFile}:`, error.message);
    return [];
  }
}

/**
 * Format date for table
 */
function formatDate(isoDate) {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get day of week
 */
function getDayOfWeek(isoDate) {
  const date = new Date(isoDate);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
}

/**
 * Generate execution history table for morning discovery (seed-based)
 */
function generateMorningDiscoveryTable(runs) {
  if (runs.length === 0) {
    return '| _No runs yet_ | | | | | | | |\n';
  }

  // Load execution logs
  const logs = getExecutionLogs('morning-discovery');

  let table = '';

  runs.forEach(run => {
    const date = formatDate(run.created_at);
    const day = getDayOfWeek(run.created_at);
    const environment = run.event === 'schedule' ? 'GitHub' : 'Manual';
    const status = run.conclusion === 'success' ? '✅ Success' : '❌ Failed';

    // Find matching log entry by date (same day)
    const runDate = new Date(run.created_at);
    const matchingLog = logs.find(log => {
      const logDate = new Date(log.timestamp);
      return logDate.toDateString() === runDate.toDateString() &&
             log.environment === environment;
    });

    // Skip runs without logged metrics (old executions before logging was implemented)
    if (!matchingLog) {
      return;
    }

    // Use logged metrics
    const candidatesStart = matchingLog.candidatesStart;
    const kolsDiscovered = matchingLog.kolsDiscovered;
    const candidatesRemaining = matchingLog.candidatesRemaining;
    const topDiscovery = matchingLog.topDiscovery
      ? `@${matchingLog.topDiscovery.username} (${formatNumber(matchingLog.topDiscovery.followers)})`
      : '_None_';

    table += `| ${date} | ${day} | ${environment} | ${candidatesStart} | ${kolsDiscovered} | ${candidatesRemaining} | ${topDiscovery} | ${status} |\n`;
  });

  return table;
}

/**
 * Format number with K/M suffix
 */
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
}

/**
 * Generate execution history table for search discovery
 */
function generateSearchDiscoveryTable(runs) {
  if (runs.length === 0) {
    return '| _No runs yet_ | | | | | | | | |\n';
  }

  // Load execution logs
  const logs = getExecutionLogs('search-discovery');

  let table = '';

  runs.forEach(run => {
    const date = formatDate(run.created_at);
    const day = getDayOfWeek(run.created_at);
    const environment = run.event === 'schedule' ? 'GitHub' : 'Manual';
    const status = run.conclusion === 'success' ? '✅ Success' : '❌ Failed';

    // Find matching log entry by date (same day)
    const runDate = new Date(run.created_at);
    const matchingLog = logs.find(log => {
      const logDate = new Date(log.timestamp);
      return logDate.toDateString() === runDate.toDateString() &&
             log.environment === environment;
    });

    // Skip runs without logged metrics (old executions before logging was implemented)
    if (!matchingLog) {
      return;
    }

    // Use logged metrics
    const queriesUsed = matchingLog.queriesUsed
      ? matchingLog.queriesUsed.slice(0, 3).join(', ') + (matchingLog.queriesUsed.length > 3 ? '...' : '')
      : '_None_';
    const tweetsAnalyzed = matchingLog.tweetsAnalyzed;
    const candidatesChecked = matchingLog.candidatesChecked;
    const kolsDiscovered = matchingLog.kolsDiscovered;
    const topDiscovery = matchingLog.topDiscovery
      ? `@${matchingLog.topDiscovery.username} (${formatNumber(matchingLog.topDiscovery.followers)})`
      : '_None_';

    table += `| ${date} | ${day} | ${environment} | ${queriesUsed} | ${tweetsAnalyzed} | ${candidatesChecked} | ${kolsDiscovered} | ${topDiscovery} | ${status} |\n`;
  });

  return table;
}

/**
 * Generate execution history table for content discovery
 */
function generateContentTable(runs) {
  if (runs.length === 0) {
    return '| _No runs yet_ | | | | | | |\n';
  }

  // Load execution logs
  const logs = getExecutionLogs('content-discovery');

  let table = '';

  runs.forEach(run => {
    const date = formatDate(run.created_at);
    const time = new Date(run.created_at).toISOString().substring(11, 16) + ' UTC';
    const environment = run.event === 'schedule' ? 'GitHub' : 'Manual';
    const status = run.conclusion === 'success' ? '✅ Success' : '❌ Failed';

    // Find matching log entry by timestamp (within 1 hour)
    const runTime = new Date(run.created_at).getTime();
    const matchingLog = logs.find(log => {
      const logTime = new Date(log.timestamp).getTime();
      const timeDiff = Math.abs(runTime - logTime);
      return timeDiff < 3600000 && log.environment === environment; // Within 1 hour
    });

    // Skip runs without logged metrics (old executions before logging was implemented)
    if (!matchingLog) {
      return;
    }

    // Use logged metrics
    const kolsMonitored = matchingLog.kolsMonitored;
    const postsFound = matchingLog.postsFound;
    const highRelevance = matchingLog.highRelevance;

    table += `| ${date} | ${time} | ${environment} | ${kolsMonitored} | ${postsFound} | ${highRelevance} | ${status} |\n`;
  });

  return table;
}

/**
 * Update README with execution history
 */
function updateReadmeHistory() {
  const readmePath = path.join(__dirname, '..', '..', '..', 'README.md');

  if (!fs.existsSync(readmePath)) {
    console.error('README.md not found');
    return false;
  }

  console.log('📊 Generating execution history tables...\n');

  // Fetch runs for each workflow
  const morningRuns = fetchWorkflowRuns(WORKFLOWS['morning-discovery'].file, 10);
  const searchRuns = fetchWorkflowRuns(WORKFLOWS['search-discovery'].file, 10);
  const contentRuns = fetchWorkflowRuns(WORKFLOWS['content-discovery'].file, 10);

  console.log(`✅ Morning Discovery: ${morningRuns.length} runs`);
  console.log(`✅ Search Discovery: ${searchRuns.length} runs`);
  console.log(`✅ Content Discovery: ${contentRuns.length} runs\n`);

  // Generate tables
  const morningTable = generateMorningDiscoveryTable(morningRuns);
  const searchTable = generateSearchDiscoveryTable(searchRuns);
  const contentTable = generateContentTable(contentRuns);

  // Read README
  let readme = fs.readFileSync(readmePath, 'utf-8');

  // Update Morning Discovery table (section 2.1.1)
  const morningPattern = /(### 2\.1\.1 Morning Discovery[\s\S]*?\*\*Recent Execution History\*\* \(Last 10 Days\):\n\n\| Date \| Day \| Environment \| Candidates Start \| KOLs Discovered \| Candidates Remaining \| Top Discovery \| Status \|\n\|[-|]+\|\n)([\s\S]*?)(\n\n_Note:)/;

  if (morningPattern.test(readme)) {
    readme = readme.replace(morningPattern, `$1${morningTable}$3`);
    console.log('✅ Updated Morning Discovery table');
  } else {
    console.log('⚠️  Could not find Morning Discovery table pattern');
  }

  // Update Search Discovery table (section 2.1.2)
  const searchPattern = /(### 2\.1\.2 Search-Based Discovery[\s\S]*?\*\*Recent Execution History\*\* \(Last 10 Days\):\n\n\| Date \| Day \| Environment \| Queries Used \| Tweets Analyzed \| Candidates Checked \| KOLs Discovered \| Top Discovery \| Status \|\n\|[-|]+\|\n)([\s\S]*?)(\n\n_Note:)/;

  if (searchPattern.test(readme)) {
    readme = readme.replace(searchPattern, `$1${searchTable}$3`);
    console.log('✅ Updated Search Discovery table');
  } else {
    console.log('⚠️  Could not find Search Discovery table pattern');
  }

  // Update Content Discovery table (section 2.2.1)
  const contentPattern = /(### 2\.2\.1 Content Discovery[\s\S]*?\*\*Recent Execution History\*\* \(Last 10 Days\):\n\n\| Date \| Time \(UTC\) \| Environment \| KOLs Monitored \| Posts Found \| High-Relevance \| Status \|\n\|[-|]+\|\n)([\s\S]*?)(\n\n_Note:)/;

  if (contentPattern.test(readme)) {
    readme = readme.replace(contentPattern, `$1${contentTable}$3`);
    console.log('✅ Updated Content Discovery table');
  } else {
    console.log('⚠️  Could not find Content Discovery table pattern');
  }

  // Write updated README
  fs.writeFileSync(readmePath, readme, 'utf-8');

  console.log('\n✅ README execution history updated!');
  console.log('\n💡 Note: Only runs with logged metrics are displayed. Old runs before logging');
  console.log('   was implemented are automatically excluded from history tables.');

  return true;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updateReadmeHistory();
}

export { updateReadmeHistory, fetchWorkflowRuns };
