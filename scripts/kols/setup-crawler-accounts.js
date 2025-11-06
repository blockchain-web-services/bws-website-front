/**
 * Initial Setup Script for X Crawler Accounts
 * Run this once to login all accounts and save cookies
 */

import authManager from './utils/x-auth-manager.js';

async function setupAllAccounts() {
  console.log('🚀 Starting X Crawler Account Setup\n');
  console.log('This will login to all 10 accounts and save authentication cookies.\n');

  try {
    // Initialize auth manager
    await authManager.initialize();

    const results = {
      successful: [],
      failed: [],
      suspended: []
    };

    // Login to each account
    for (const account of authManager.accounts) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Processing: ${account.id} (${account.username})`);
      console.log('='.repeat(60));

      try {
        // Check if already has valid cookies
        const existingCookies = await authManager.loadCookies(account.id);

        if (existingCookies) {
          console.log(`✅ ${account.id} already has valid cookies, validating...`);

          const isValid = await authManager.validateCookies(account.id);

          if (isValid) {
            console.log(`✅ ${account.id} cookies are valid, skipping login`);
            results.successful.push(account.id);
            continue;
          } else {
            console.log(`⚠️  ${account.id} cookies invalid, re-logging in...`);
          }
        }

        // Login and save cookies
        await authManager.login(account, { headless: true });

        results.successful.push(account.id);
        console.log(`✅ ${account.id} setup complete`);

        // Small delay between logins to avoid triggering rate limits
        if (authManager.accounts.indexOf(account) < authManager.accounts.length - 1) {
          console.log(`⏳ Waiting 5 seconds before next account...`);
          await new Promise(resolve => setTimeout(resolve, 5000));
        }

      } catch (error) {
        console.error(`❌ ${account.id} setup failed:`, error.message);

        if (error.message.includes('suspended')) {
          results.suspended.push({ id: account.id, reason: error.message });
        } else {
          results.failed.push({ id: account.id, error: error.message });
        }
      }
    }

    // Print summary
    console.log(`\n\n${'='.repeat(60)}`);
    console.log('📊 SETUP SUMMARY');
    console.log('='.repeat(60));
    console.log(`\n✅ Successful: ${results.successful.length}/${authManager.accounts.length}`);
    results.successful.forEach(id => console.log(`   - ${id}`));

    if (results.suspended.length > 0) {
      console.log(`\n🚫 Suspended: ${results.suspended.length}`);
      results.suspended.forEach(({ id, reason }) =>
        console.log(`   - ${id}: ${reason}`)
      );
    }

    if (results.failed.length > 0) {
      console.log(`\n❌ Failed: ${results.failed.length}`);
      results.failed.forEach(({ id, error }) =>
        console.log(`   - ${id}: ${error}`)
      );
    }

    // Print stats
    console.log('\n📈 Account Statistics:');
    const stats = authManager.getStats();
    console.log(`   - Total accounts: ${stats.total}`);
    console.log(`   - Active accounts: ${stats.active}`);
    console.log(`   - Suspended accounts: ${stats.suspended}`);
    console.log(`   - Available for use: ${stats.available}`);

    console.log('\n✅ Setup complete! Crawler accounts are ready to use.');
    console.log('\nNext steps:');
    console.log('1. The discovery scripts will automatically use these accounts');
    console.log('2. Run: gh workflow run "KOL Discovery - Search Based"');
    console.log('3. Monitor account health with: node scripts/kols/check-crawler-accounts.js');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('\nPlease check:');
    console.log('1. x-crawler-accounts.json exists with valid credentials');
    console.log('2. All account usernames and passwords are correct');
    console.log('3. No accounts are suspended or locked');
    process.exit(1);
  }
}

// Run setup
setupAllAccounts().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
