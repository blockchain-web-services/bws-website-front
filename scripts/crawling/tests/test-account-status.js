import { createReadWriteClient } from './kols/utils/twitter-client.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * PHASE 6: Account Status Check
 *
 * This script retrieves detailed account information to check for restrictions,
 * verified status, and other indicators that might affect posting.
 *
 * Purpose: Identify if account has restrictions preventing posting
 */
async function testAccountStatus() {
  console.log('🔍 PHASE 6: Account Status Check\n');
  console.log('='.repeat(70));

  const isCI = process.env.CI === 'true';
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
  const hasOxylabs = !!(process.env.OXYLABS_USERNAME && process.env.OXYLABS_PASSWORD);

  console.log('📋 Environment:');
  console.log(`   CI: ${isCI ? '✅ Yes' : '❌ No'}`);
  console.log(`   GitHub Actions: ${isGitHubActions ? '✅ Yes' : '❌ No'}`);
  console.log(`   Proxy: ${isCI && hasOxylabs ? '✅ Enabled' : '❌ Disabled'}`);
  console.log();

  try {
    console.log('📡 Creating Twitter client...');
    const client = createReadWriteClient();
    console.log('   ✅ Client created\n');

    console.log('🔐 Fetching account information...');

    // Get detailed user info
    const me = await client.v2.me({
      'user.fields': [
        'created_at',
        'description',
        'public_metrics',
        'verified',
        'verified_type',
        'protected',
        'location',
        'url',
        'profile_image_url'
      ]
    });

    const user = me.data;

    console.log('   ✅ Account information retrieved\n');

    console.log('='.repeat(70));
    console.log('👤 ACCOUNT DETAILS');
    console.log('='.repeat(70));
    console.log();

    console.log('Basic Information:');
    console.log(`   Username: @${user.username}`);
    console.log(`   Display Name: ${user.name}`);
    console.log(`   User ID: ${user.id}`);
    console.log(`   Created: ${user.created_at || 'N/A'}`);
    console.log();

    console.log('Account Status:');
    console.log(`   Verified: ${user.verified ? '✅ Yes' : '❌ No'}`);
    if (user.verified_type) {
      console.log(`   Verification Type: ${user.verified_type}`);
    }
    console.log(`   Protected (Private): ${user.protected ? '⚠️  Yes' : '✅ No'}`);
    console.log();

    if (user.description) {
      console.log('Bio:');
      console.log(`   ${user.description}`);
      console.log();
    }

    if (user.location) {
      console.log(`Location: ${user.location}`);
      console.log();
    }

    if (user.url) {
      console.log(`Website: ${user.url}`);
      console.log();
    }

    if (user.public_metrics) {
      console.log('Public Metrics:');
      console.log(`   Followers: ${user.public_metrics.followers_count}`);
      console.log(`   Following: ${user.public_metrics.following_count}`);
      console.log(`   Tweets: ${user.public_metrics.tweet_count}`);
      console.log(`   Listed: ${user.public_metrics.listed_count}`);
      console.log();
    }

    // Check for potential issues
    console.log('='.repeat(70));
    console.log('🔍 STATUS ANALYSIS');
    console.log('='.repeat(70));
    console.log();

    const issues = [];
    const warnings = [];

    if (user.protected) {
      warnings.push('Account is protected (private) - this may affect API operations');
    }

    if (!user.verified && user.public_metrics && user.public_metrics.followers_count < 100) {
      warnings.push('Low follower count - may be subject to stricter rate limits');
    }

    const accountAge = user.created_at ? new Date() - new Date(user.created_at) : null;
    const accountAgeDays = accountAge ? Math.floor(accountAge / (1000 * 60 * 60 * 24)) : null;

    if (accountAgeDays !== null && accountAgeDays < 30) {
      warnings.push(`New account (${accountAgeDays} days old) - may have restrictions`);
    }

    if (issues.length === 0) {
      console.log('✅ No critical issues detected');
      console.log();
    } else {
      console.log('❌ CRITICAL ISSUES:');
      issues.forEach((issue, i) => {
        console.log(`   ${i + 1}. ${issue}`);
      });
      console.log();
    }

    if (warnings.length > 0) {
      console.log('⚠️  WARNINGS:');
      warnings.forEach((warning, i) => {
        console.log(`   ${i + 1}. ${warning}`);
      });
      console.log();
    } else {
      console.log('✅ No warnings');
      console.log();
    }

    // Rate limit information
    console.log('='.repeat(70));
    console.log('⏱️  RATE LIMIT CHECK');
    console.log('='.repeat(70));
    console.log();

    console.log('Attempting to fetch rate limit status...');
    try {
      // Make a simple API call to check rate limits
      const rateLimitResponse = await client.v1.get('application/rate_limit_status.json', {
        resources: 'statuses,users,tweets'
      });

      console.log('✅ Rate limit information retrieved');
      console.log();

      if (rateLimitResponse.resources) {
        if (rateLimitResponse.resources.statuses) {
          const statusesUpdate = rateLimitResponse.resources.statuses['/statuses/update'];
          if (statusesUpdate) {
            console.log('Tweet Posting Limits (/statuses/update):');
            console.log(`   Limit: ${statusesUpdate.limit} requests per window`);
            console.log(`   Remaining: ${statusesUpdate.remaining}`);
            console.log(`   Resets: ${new Date(statusesUpdate.reset * 1000).toISOString()}`);
            console.log();

            if (statusesUpdate.remaining === 0) {
              issues.push('Tweet posting rate limit exhausted!');
              console.log('   ⚠️  Rate limit exhausted - wait for reset');
              console.log();
            }
          }
        }
      }
    } catch (error) {
      console.log('⚠️  Could not fetch rate limit info (not critical)');
      console.log(`   Error: ${error.message}`);
      console.log();
    }

    // Final summary
    console.log('='.repeat(70));
    if (issues.length > 0) {
      console.log('❌ PHASE 6 TEST FAILED: Critical issues found');
      console.log('='.repeat(70));
      console.log();
      console.log('Summary:');
      console.log('  ✅ Account accessible');
      console.log(`  ❌ ${issues.length} critical issue(s) detected`);
      console.log();
      console.log('Recommended actions:');
      issues.forEach((issue, i) => {
        console.log(`  ${i + 1}. Address: ${issue}`);
      });
      process.exit(1);
    } else {
      console.log('✅ PHASE 6 TEST PASSED: Account Status Normal');
      console.log('='.repeat(70));
      console.log();
      console.log('Summary:');
      console.log('  ✅ Account accessible');
      console.log('  ✅ No critical restrictions detected');
      console.log(`  ${warnings.length > 0 ? '⚠️ ' : '✅'} ${warnings.length} warning(s)`);
      console.log();

      if (warnings.length > 0) {
        console.log('Note: Warnings do not prevent operation but may affect behavior');
      }

      console.log(`Environment: ${isCI ? 'CI (with proxy)' : 'Local (direct connection)'}`);
      console.log();
      console.log('🎯 Account appears healthy for posting operations');
      console.log();
    }

  } catch (error) {
    console.error('\n❌ PHASE 6 TEST FAILED: Cannot Access Account\n');
    console.error('='.repeat(70));
    console.error('Error Details:');
    console.error(`  Type: ${error.constructor.name}`);
    console.error(`  Code: ${error.code || error.status || 'unknown'}`);
    console.error(`  Message: ${error.message}`);
    console.error();

    if (error.data) {
      console.error('  API Response:');
      console.error(`  ${JSON.stringify(error.data, null, 2)}`);
      console.error();
    }

    console.error('='.repeat(70));
    console.error();
    console.error('Cannot retrieve account information - authentication may have failed');
    console.error('Run PHASE 1 (test-minimal-auth.js) first to verify credentials');
    console.error();

    process.exit(1);
  }
}

// Run test
testAccountStatus().catch(error => {
  console.error('\n💥 Unhandled error in test:', error);
  process.exit(1);
});
