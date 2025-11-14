import { createReadWriteClient } from './kols/utils/twitter-client.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * TEST B: Minimal Automated Reply Test
 *
 * Since manual replies work but automated replies fail with 403,
 * this test attempts the simplest possible automated reply to determine
 * if ANY automated reply can succeed.
 *
 * Test Strategy:
 * 1. Reply to a specific tweet with minimal, natural content
 * 2. No hashtags, no links, no promotional language
 * 3. Just natural conversation text
 * 4. If this works: Content/pattern is the issue
 * 5. If this fails: Automation itself is blocked (need warm-up period)
 */
async function testMinimalReply() {
  console.log('🔍 TEST B: Minimal Automated Reply Test\n');
  console.log('='.repeat(70));

  // Environment detection
  const isCI = process.env.CI === 'true';
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
  const hasOxylabs = !!(process.env.OXYLABS_USERNAME && process.env.OXYLABS_PASSWORD);

  console.log('📋 Environment:');
  console.log(`   CI: ${isCI ? '✅ Yes' : '❌ No'}`);
  console.log(`   GitHub Actions: ${isGitHubActions ? '✅ Yes' : '❌ No'}`);
  console.log(`   Proxy: ${isCI && hasOxylabs ? '✅ Enabled' : '❌ Disabled'}`);
  console.log();

  console.log('🎯 Test Objective:');
  console.log('   Determine if ANY automated reply can succeed');
  console.log('   Using minimal, natural content (no hashtags/links/mentions)');
  console.log();

  try {
    // Step 1: Create client
    console.log('📡 Creating Twitter client...');
    const client = createReadWriteClient();
    console.log('   ✅ Client created\n');

    // Step 2: Authenticate
    console.log('🔐 Authenticating...');
    const me = await client.v2.me();
    console.log(`   ✅ Authenticated as @${me.data.username}\n`);

    // Step 3: Find a recent tweet to reply to
    // We'll use a tweet from @BWSXAI's own timeline if possible,
    // or a well-known crypto account
    console.log('🔍 Finding a tweet to reply to...');

    // First, try to get our own latest tweet to reply to
    const timeline = await client.v2.userTimeline(me.data.id, {
      max_results: 5,
      'tweet.fields': ['created_at', 'text']
    });

    let tweetToReplyTo = null;
    if (timeline.data && timeline.data.data && timeline.data.data.length > 0) {
      tweetToReplyTo = timeline.data.data[0];
      console.log(`   ✅ Found our own tweet: ${tweetToReplyTo.id}`);
      console.log(`   Text: ${tweetToReplyTo.text.substring(0, 80)}...`);
    } else {
      // Fallback: use a specific known tweet ID
      // This is a tweet from a public crypto account (replace with actual tweet ID)
      const fallbackTweetId = '1989041803824361783'; // Our own test tweet from Phase 3
      console.log(`   ⚠️  No timeline tweets found, using fallback tweet: ${fallbackTweetId}`);
      tweetToReplyTo = { id: fallbackTweetId };
    }
    console.log();

    // Step 4: Generate minimal, natural reply content
    // Multiple variations to test
    const minimalReplies = [
      "Interesting perspective on this topic.",
      "Thanks for sharing your insights.",
      "Good point to consider.",
      "Appreciate the update.",
      "Valuable information, thank you."
    ];

    // Pick a random one to appear more natural
    const replyText = minimalReplies[Math.floor(Math.random() * minimalReplies.length)];

    console.log('💬 Reply Content:');
    console.log(`   "${replyText}"`);
    console.log('   (Minimal, natural, no hashtags/links/mentions)');
    console.log();

    // Step 5: Attempt the reply
    console.log('📤 Posting reply...');
    const startTime = Date.now();

    const replyResult = await client.v2.reply(
      replyText,
      tweetToReplyTo.id
    );

    const duration = Date.now() - startTime;

    console.log(`   ✅ Reply posted successfully! (${duration}ms)\n`);

    console.log('📄 Reply Details:');
    console.log(`   Reply Tweet ID: ${replyResult.data.id}`);
    console.log(`   In reply to: ${tweetToReplyTo.id}`);
    console.log(`   Text: ${replyResult.data.text}`);
    console.log();

    // Step 6: Wait a moment, then delete the test reply
    console.log('🧹 Cleaning up test reply...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

    await client.v2.deleteTweet(replyResult.data.id);
    console.log('   ✅ Test reply deleted\n');

    // Final summary
    console.log('='.repeat(70));
    console.log('✅ TEST B PASSED: Minimal Automated Reply Successful!');
    console.log('='.repeat(70));
    console.log();
    console.log('🎉 Key Findings:');
    console.log('   ✅ Automated replies CAN work');
    console.log('   ✅ OAuth permissions are correct');
    console.log('   ✅ Account is NOT blocked from automated replies');
    console.log();
    console.log('💡 Implications:');
    console.log('   → The 403 errors are triggered by CONTENT, not automation itself');
    console.log('   → Likely triggers: hashtags, links, promotional language, @mentions');
    console.log('   → Solution: Modify reply templates to be more natural/conversational');
    console.log();
    console.log('📋 Next Steps:');
    console.log('   1. Test replies WITH hashtags (to confirm they trigger 403)');
    console.log('   2. Test replies WITH links (to confirm they trigger 403)');
    console.log('   3. Test replies WITH @mentions (to confirm they trigger 403)');
    console.log('   4. Redesign reply templates to avoid spam triggers');
    console.log();

    process.exit(0);

  } catch (error) {
    console.error('\n❌ TEST B FAILED: Minimal Automated Reply Error\n');
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

    if (error.errors && Array.isArray(error.errors)) {
      console.error('  Twitter Errors:');
      error.errors.forEach((err, idx) => {
        console.error(`  ${idx + 1}. ${err.message || err.detail || JSON.stringify(err)}`);
      });
      console.error();
    }

    console.error('='.repeat(70));
    console.error('Diagnostics:\n');

    if (error.code === 403) {
      console.error('🔴 403 FORBIDDEN on MINIMAL reply:');
      console.error('   → Automated replies are BLOCKED for this account');
      console.error('   → This is NOT about content - even minimal replies fail');
      console.error('   → Account may need "warm-up period" with manual activity');
      console.error('   → Or OAuth app needs additional permissions');
      console.error();
      console.error('💡 Recommended Actions:');
      console.error('   1. Review OAuth app permissions at developer.twitter.com');
      console.error('   2. Check if app is approved for automated replies');
      console.error('   3. Consider 7-day manual activity warm-up period');
      console.error('   4. Contact Twitter support for account review');
    } else if (error.code === 401) {
      console.error('🔴 401 UNAUTHORIZED:');
      console.error('   → Invalid credentials (but earlier tests passed?)');
      console.error('   → Tokens may have been revoked');
    } else if (error.code === 429) {
      console.error('🔴 429 RATE LIMIT:');
      console.error('   → Too many requests');
      console.error('   → Wait 15 minutes and retry');
    } else if (error.message?.includes('ECONNREFUSED') || error.message?.includes('ETIMEDOUT')) {
      console.error('🔴 NETWORK ERROR:');
      console.error('   → Cannot reach Twitter API');
      if (isCI && hasOxylabs) {
        console.error('   → Proxy connection issue');
      }
    }

    console.error();
    console.error(`Test failed in ${isCI ? 'CI' : 'local'} environment`);
    console.error();

    process.exit(1);
  }
}

// Run test
testMinimalReply().catch(error => {
  console.error('\n💥 Unhandled error in test:', error);
  process.exit(1);
});
