/**
 * Health Check Script for X Crawler Accounts
 * Validates all accounts, auto-refreshes expired cookies, reports status
 */

import authManager from './utils/x-auth-manager.js';

async function checkAccountHealth() {
  console.log('🏥 X Crawler Account Health Check\n');
  console.log('Starting health validation for all accounts...\n');

  try {
    // Initialize auth manager
    await authManager.initialize();

    const results = {
      healthy: [],
      expired: [],
      refreshed: [],
      suspended: [],
      failed: []
    };

    // Check each account
    for (const account of authManager.accounts) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Checking: ${account.id} (${account.username})`);
      console.log('='.repeat(60));

      // Skip if already marked as suspended
      if (account.suspended) {
        console.log(`🚫 ${account.id} is suspended, skipping validation`);
        results.suspended.push({
          id: account.id,
          username: account.username,
          reason: account.notes || 'Unknown'
        });
        continue;
      }

      try {
        // Check if cookies exist
        const existingCookies = await authManager.loadCookies(account.id);

        if (!existingCookies) {
          console.log(`⚠️  ${account.id} has no cookies, attempting login...`);

          // Try to login and save cookies
          await authManager.login(account, { headless: true });

          results.refreshed.push({
            id: account.id,
            username: account.username,
            reason: 'No cookies found'
          });
          console.log(`✅ ${account.id} logged in successfully`);
          continue;
        }

        // Validate cookies
        console.log(`🔍 Validating cookies for ${account.id}...`);
        const isValid = await authManager.validateCookies(account.id);

        if (isValid) {
          console.log(`✅ ${account.id} cookies are valid`);
          results.healthy.push({
            id: account.id,
            username: account.username,
            lastUsed: account.lastUsed,
            usageCount: account.usageCount || 0
          });
        } else {
          console.log(`⚠️  ${account.id} cookies are invalid, refreshing...`);
          results.expired.push({
            id: account.id,
            username: account.username
          });

          // Re-login to refresh cookies
          await authManager.login(account, { headless: true });

          results.refreshed.push({
            id: account.id,
            username: account.username,
            reason: 'Cookies expired'
          });
          console.log(`✅ ${account.id} cookies refreshed`);
        }

        // Small delay between checks
        if (authManager.accounts.indexOf(account) < authManager.accounts.length - 1) {
          console.log(`⏳ Waiting 3 seconds before next check...`);
          await new Promise(resolve => setTimeout(resolve, 3000));
        }

      } catch (error) {
        console.error(`❌ ${account.id} health check failed:`, error.message);

        // Check if account was suspended
        if (error.message.includes('suspended')) {
          await authManager.markSuspended(account.id, 'Detected during health check');
          results.suspended.push({
            id: account.id,
            username: account.username,
            reason: error.message
          });
        } else {
          results.failed.push({
            id: account.id,
            username: account.username,
            error: error.message
          });
        }
      }
    }

    // Print comprehensive summary
    console.log(`\n\n${'='.repeat(60)}`);
    console.log('📊 HEALTH CHECK SUMMARY');
    console.log('='.repeat(60));

    console.log(`\n✅ Healthy Accounts: ${results.healthy.length}/${authManager.accounts.length}`);
    if (results.healthy.length > 0) {
      results.healthy.forEach(({ id, username, lastUsed, usageCount }) => {
        const lastUsedStr = lastUsed
          ? new Date(lastUsed).toLocaleString()
          : 'Never';
        console.log(`   - ${id} (${username})`);
        console.log(`     Last used: ${lastUsedStr} | Uses: ${usageCount}`);
      });
    }

    if (results.refreshed.length > 0) {
      console.log(`\n🔄 Refreshed: ${results.refreshed.length}`);
      results.refreshed.forEach(({ id, username, reason }) =>
        console.log(`   - ${id} (${username}): ${reason}`)
      );
    }

    if (results.expired.length > 0) {
      console.log(`\n⏰ Expired (before refresh): ${results.expired.length}`);
      results.expired.forEach(({ id, username }) =>
        console.log(`   - ${id} (${username})`)
      );
    }

    if (results.suspended.length > 0) {
      console.log(`\n🚫 Suspended: ${results.suspended.length}`);
      results.suspended.forEach(({ id, username, reason }) =>
        console.log(`   - ${id} (${username}): ${reason}`)
      );
    }

    if (results.failed.length > 0) {
      console.log(`\n❌ Failed: ${results.failed.length}`);
      results.failed.forEach(({ id, username, error }) =>
        console.log(`   - ${id} (${username}): ${error}`)
      );
    }

    // Print account statistics
    console.log('\n📈 Account Statistics:');
    const stats = authManager.getStats();
    console.log(`   - Total accounts: ${stats.total}`);
    console.log(`   - Active accounts: ${stats.active}`);
    console.log(`   - Suspended accounts: ${stats.suspended}`);
    console.log(`   - Rate-limited accounts: ${stats.rateLimited}`);
    console.log(`   - Available for use: ${stats.available}`);

    // Determine overall health status
    const healthPercentage = Math.round((stats.active / stats.total) * 100);
    console.log(`\n🏥 Overall Health: ${healthPercentage}%`);

    if (healthPercentage >= 80) {
      console.log('✅ System health is GOOD');
    } else if (healthPercentage >= 50) {
      console.log('⚠️  System health is MODERATE - consider reviewing suspended accounts');
    } else {
      console.log('❌ System health is POOR - immediate attention required!');
    }

    // Check if we have enough available accounts
    if (stats.available < 3) {
      console.log('\n⚠️  WARNING: Less than 3 accounts available!');
      console.log('   Discovery scripts may fail due to insufficient account pool.');
      console.log('   Please review and fix suspended/rate-limited accounts.');
    }

    console.log('\n✅ Health check complete!');

    // Exit with appropriate code
    if (stats.available === 0) {
      console.error('\n❌ CRITICAL: No accounts available for use!');
      process.exit(1);
    }

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Health check failed:', error.message);
    console.error('\nPlease check:');
    console.log('1. x-crawler-accounts.json exists with valid credentials');
    console.log('2. All account usernames and passwords are correct');
    console.log('3. Network connectivity is working');
    process.exit(1);
  }
}

// Run health check
checkAccountHealth().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
