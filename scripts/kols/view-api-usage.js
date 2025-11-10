#!/usr/bin/env node

/**
 * View API Usage History
 *
 * Displays persistent Twitter API usage tracking data
 * to monitor quota consumption and identify patterns
 */

import usageLogger from './utils/api-usage-logger.js';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'today';

  console.log('🔍 Twitter API Usage Viewer\n');

  switch (command) {
    case 'today':
      await usageLogger.displayTodayUsage();
      break;

    case 'week':
      await usageLogger.displayWeeklyUsage();
      break;

    case 'both':
      await usageLogger.displayTodayUsage();
      await usageLogger.displayWeeklyUsage();
      break;

    case 'recent':
      const count = parseInt(args[1]) || 20;
      const entries = await usageLogger.getRecentEntries(count);

      console.log(`\n📋 Last ${count} API Attempts:\n`);
      console.log('   #   Time          Type            Status    Details');
      console.log('   ' + '-'.repeat(66));

      entries.forEach((entry, i) => {
        const time = entry.timestamp.split('T')[1].substring(0, 8);
        const type = entry.type.padEnd(15);
        const status = entry.error ? '❌ FAIL' : '✅ OK  ';

        let details = '';
        if (entry.limit) {
          details = `Limit: ${entry.used}/${entry.limit} used`;
        } else if (entry.error) {
          details = entry.error.substring(0, 30);
        } else if (entry.replyId) {
          details = `Posted: ${entry.replyId}`;
        }

        console.log(`   ${String(i + 1).padStart(3)}  ${time}  ${type}  ${status}  ${details}`);
      });
      console.log('   ' + '-'.repeat(66) + '\n');
      break;

    case 'export':
      const data = await usageLogger.exportUsageData();
      console.log(JSON.stringify(data, null, 2));
      break;

    case 'help':
    default:
      console.log('Usage: node view-api-usage.js [command]\n');
      console.log('Commands:');
      console.log('  today    - Show today\'s usage summary (default)');
      console.log('  week     - Show last 7 days usage');
      console.log('  both     - Show today + last 7 days');
      console.log('  recent [N] - Show last N API attempts (default: 20)');
      console.log('  export   - Export all data as JSON');
      console.log('  help     - Show this help message\n');
      console.log('Examples:');
      console.log('  node view-api-usage.js');
      console.log('  node view-api-usage.js week');
      console.log('  node view-api-usage.js recent 50');
      console.log('');
      break;
  }
}

main().catch(error => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
