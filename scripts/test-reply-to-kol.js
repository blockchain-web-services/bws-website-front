import { createReadWriteClient } from './kols/utils/twitter-client.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * TEST F: Reply to Actual KOL Tweet
 *
 * CRITICAL TEST - This confirms the real root cause!
 *
 * Previous tests showed:
 * - Replying to OUR OWN tweets: ALL content works (even promotional)
 * - Production replying to KOL tweets: ALL fail with 403
 *
 * This test will:
 * 1. Find a recent tweet from a real KOL
 * 2. Post a minimal, natural reply (same as worked in Test B)
 * 3. Immediately delete it
 * 4. Determine if 403 is triggered by "replying to strangers" vs content
 */
async function testReplyToKOL() {
  console.log('🔍 TEST F: Reply to Actual KOL Tweet\n');
  console.log('='.repeat(70));

  const isCI = process.env.CI === 'true';
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
  const hasOxylabs = !!(process.env.OXYLABS_USERNAME && process.env.OXYLABS_PASSWORD);

  console.log('📋 Environment:');
  console.log(`   CI: ${isCI ? '✅ Yes' : '❌ No'}`);
  console.log(`   GitHub Actions: ${isGitHubActions ? '✅ Yes' : '❌ No'}`);
  console.log(`   Proxy: ${isCI && hasOxylabs ? '✅ Enabled' : '❌ Disabled'}`);
  console.log();

  console.log('🎯 Test Objective:');
  console.log('   Determine if 403 errors are triggered by:');
  console.log('   A) Content patterns (hashtags/links/@mentions) OR');
  console.log('   B) Replying to strangers/KOLs (not mutual followers)');
  console.log();

  console.log('🧪 Hypothesis:');
  console.log('   If minimal reply to KOL fails with 403 → Issue is "stranger replies"');
  console.log('   If minimal reply to KOL succeeds → Issue is content patterns');
  console.log();

  try {
    console.log('📡 Creating Twitter client...');
    const client = createReadWriteClient();
    console.log('   ✅ Client created\n');

    console.log('🔐 Authenticating...');
    const me = await client.v2.me();
    console.log(`   ✅ Authenticated as @${me.data.username}\n`);

    // Find a KOL from our seed list
    const seedKOLs = [
      'AltcoinSherpa',
      'AltcoinDailyio',
      'cobie',
      'DoveyWan',
      'CryptoMichNL'
    ];

    console.log('🔍 Finding a recent KOL tweet to reply to...');
    console.log(`   Checking KOLs: ${seedKOLs.join(', ')}`);
    console.log();

    let kolTweetFound = null;
    let kolUsername = null;

    for (const username of seedKOLs) {
      try {
        console.log(`   Checking @${username}...`);

        // Get user
        const user = await client.v2.userByUsername(username, {
          'user.fields': ['public_metrics']
        });

        if (!user.data) {
          console.log(`     ⚠️  User not found`);
          continue;
        }

        console.log(`     ✅ Found user (${user.data.public_metrics.followers_count.toLocaleString()} followers)`);

        // Get recent tweets
        const timeline = await client.v2.userTimeline(user.data.id, {
          max_results: 5,
          'tweet.fields': ['created_at', 'public_metrics', 'text']
        });

        if (timeline.data && timeline.data.data && timeline.data.data.length > 0) {
          kolTweetFound = timeline.data.data[0];
          kolUsername = username;
          console.log(`     ✅ Found recent tweet: ${kolTweetFound.id}`);
          console.log(`        Text: ${kolTweetFound.text.substring(0, 80)}...`);
          console.log(`        Likes: ${kolTweetFound.public_metrics?.like_count || 0} | Retweets: ${kolTweetFound.public_metrics?.retweet_count || 0}`);
          break;
        }
      } catch (error) {
        console.log(`     ❌ Error: ${error.message}`);
        continue;
      }
    }

    if (!kolTweetFound) {
      throw new Error('Could not find any KOL tweets to test with');
    }

    console.log();
    console.log('🎯 Target Tweet:');
    console.log(`   KOL: @${kolUsername}`);
    console.log(`   Tweet ID: ${kolTweetFound.id}`);
    console.log(`   Created: ${kolTweetFound.created_at}`);
    console.log();

    // Generate minimal, natural reply (same as Test B that worked)
    const minimalReplies = [
      "Interesting perspective on this.",
      "Thanks for sharing your insights.",
      "Good point to consider.",
      "Appreciate the update.",
      "Valuable information, thank you."
    ];

    const replyText = minimalReplies[Math.floor(Math.random() * minimalReplies.length)];

    console.log('💬 Reply Content:');
    console.log(`   "${replyText}"`);
    console.log('   (Same minimal, natural content that worked in Test B)');
    console.log();

    console.log('📤 Posting reply to KOL tweet...');
    const startTime = Date.now();

    try {
      const reply = await client.v2.reply(replyText, kolTweetFound.id);
      const duration = Date.now() - startTime;

      console.log(`   ✅ REPLY POSTED SUCCESSFULLY! (${duration}ms)\n`);

      console.log('📄 Reply Details:');
      console.log(`   Reply Tweet ID: ${reply.data.id}`);
      console.log(`   In reply to: @${kolUsername} (${kolTweetFound.id})`);
      console.log(`   Text: ${reply.data.text}`);
      console.log();

      // Wait a moment, then delete
      console.log('🧹 Cleaning up test reply...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      try {
        await client.v2.deleteTweet(reply.data.id);
        console.log('   ✅ Test reply deleted\n');
      } catch (deleteError) {
        console.log(`   ⚠️  Delete failed (${deleteError.code}): ${deleteError.message}`);
        console.log('   (Reply was posted but cleanup failed - not critical)\n');
      }

      // Success!
      console.log('='.repeat(70));
      console.log('✅ TEST F PASSED: Reply to KOL Succeeded!');
      console.log('='.repeat(70));
      console.log();
      console.log('🎉 KEY FINDINGS:');
      console.log('   ✅ Replying to KOL tweets WORKS');
      console.log('   ✅ OAuth permissions are correct');
      console.log('   ✅ Account can reply to strangers');
      console.log();
      console.log('💡 IMPLICATIONS:');
      console.log('   → Production 403 errors are NOT from "stranger replies"');
      console.log('   → Must be a different trigger we haven\'t identified yet');
      console.log('   → Possible causes:');
      console.log('      • Reply frequency/volume in production');
      console.log('      • Specific KOL accounts that are protected');
      console.log('      • Time-based restrictions after repeated failures');
      console.log('      • Combination of factors not present in isolated tests');
      console.log();
      console.log('📋 NEXT STEPS:');
      console.log('   1. Review production workflow to identify what\'s different');
      console.log('   2. Check if account has accumulated "bad reputation" from failures');
      console.log('   3. Consider gradual rollout with VERY conservative limits');
      console.log('   4. Monitor for patterns in which specific KOLs trigger 403');
      console.log();

      process.exit(0);

    } catch (postError) {
      const duration = Date.now() - startTime;
      const errorCode = postError.code || postError.status || 'unknown';

      console.log(`   ❌ REPLY FAILED (${duration}ms)\n`);
      console.log('Error Details:');
      console.log(`   Code: ${errorCode}`);
      console.log(`   Message: ${postError.message}`);

      if (postError.data) {
        console.log(`   API Response: ${JSON.stringify(postError.data, null, 2)}`);
      }

      if (postError.errors && Array.isArray(postError.errors)) {
        console.log('   Twitter Errors:');
        postError.errors.forEach((err, idx) => {
          console.log(`     ${idx + 1}. ${err.message || err.detail || JSON.stringify(err)}`);
        });
      }
      console.log();

      console.log('='.repeat(70));

      if (errorCode === 403) {
        console.log('❌ TEST F FAILED: 403 FORBIDDEN on KOL Reply');
        console.log('='.repeat(70));
        console.log();
        console.log('🎯 ROOT CAUSE CONFIRMED:');
        console.log('   ✅ Replying to own tweets: WORKS');
        console.log('   ❌ Replying to KOL tweets: FAILS with 403');
        console.log();
        console.log('💡 DIAGNOSIS:');
        console.log('   → Account is RESTRICTED from replying to non-followers');
        console.log('   → This is a Twitter account-level restriction');
        console.log('   → NOT related to OAuth permissions or content');
        console.log();
        console.log('🔧 SOLUTIONS:');
        console.log('   1. **Account Warm-Up (REQUIRED)**');
        console.log('      • Post 2-3 original tweets daily (manual or automated)');
        console.log('      • Manually like and retweet KOL content');
        console.log('      • Build follower count organically');
        console.log('      • Wait 7-14 days before automated replies');
        console.log();
        console.log('   2. **Get Mutual Follows First**');
        console.log('      • Follow target KOLs');
        console.log('      • Wait for follow-backs');
        console.log('      • Only reply to mutual followers initially');
        console.log();
        console.log('   3. **Request Twitter Review**');
        console.log('      • Contact Twitter support');
        console.log('      • Explain legitimate business use case');
        console.log('      • Request removal of reply restriction');
        console.log();
        console.log('   4. **Alternative Approach**');
        console.log('      • Use quote tweets instead of replies');
        console.log('      • Focus on original content with @mentions');
        console.log('      • Build engagement before direct replies');
        console.log();
        console.log('⚠️  IMMEDIATE ACTION:');
        console.log('   → PAUSE all automated reply workflows');
        console.log('   → Start account warm-up period TODAY');
        console.log('   → Post original content for 7-14 days');
        console.log('   → Retest after warm-up period');
        console.log();
      } else if (errorCode === 429) {
        console.log('⚠️  TEST F INCONCLUSIVE: Rate Limited');
        console.log('='.repeat(70));
        console.log();
        console.log('   Cannot determine root cause - hit rate limit');
        console.log('   Wait 15 minutes and retry test');
        console.log();
      } else {
        console.log(`❌ TEST F FAILED: Unexpected Error (${errorCode})`);
        console.log('='.repeat(70));
        console.log();
        console.log('   See error details above');
        console.log();
      }

      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ TEST FAILED: Unexpected Error\n');
    console.error('='.repeat(70));
    console.error(`Error: ${error.message}`);
    console.error();
    if (error.data) {
      console.error('API Response:', JSON.stringify(error.data, null, 2));
    }
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    console.error('='.repeat(70));
    process.exit(1);
  }
}

// Run test
testReplyToKOL().catch(error => {
  console.error('\n💥 Unhandled error:', error);
  process.exit(1);
});
