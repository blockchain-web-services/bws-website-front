import { createReadWriteClient } from './kols/utils/twitter-client.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * TEST E: Content Variation Tests
 *
 * Since minimal replies work but production replies fail,
 * this test isolates which content elements trigger 403 errors.
 *
 * Tests in order:
 * 1. Baseline: Plain text (we know this works)
 * 2. With ONE hashtag
 * 3. With TWO hashtags
 * 4. With ONE link
 * 5. With ONE @mention
 * 6. With hashtag + link
 * 7. With @mention + hashtag
 * 8. With @mention + link
 * 9. Full production template (@mention + hashtags + link)
 *
 * Each test posts a reply and immediately deletes it.
 * We track which combinations succeed vs fail with 403.
 */

const WAIT_BETWEEN_TESTS = 3000; // 3 seconds between tests

async function runContentVariationTests() {
  console.log('🧪 TEST E: Content Variation Tests\n');
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
  console.log('   Identify which content elements trigger 403 errors');
  console.log('   Test: hashtags, links, @mentions, and combinations');
  console.log();

  try {
    // Setup
    console.log('📡 Creating Twitter client...');
    const client = createReadWriteClient();
    console.log('   ✅ Client created\n');

    console.log('🔐 Authenticating...');
    const me = await client.v2.me();
    console.log(`   ✅ Authenticated as @${me.data.username}\n`);

    console.log('🔍 Finding tweet to reply to...');
    const timeline = await client.v2.userTimeline(me.data.id, {
      max_results: 5,
      'tweet.fields': ['created_at', 'text']
    });

    let tweetToReplyTo = null;
    if (timeline.data && timeline.data.data && timeline.data.data.length > 0) {
      tweetToReplyTo = timeline.data.data[0];
      console.log(`   ✅ Using tweet: ${tweetToReplyTo.id}`);
      console.log(`   Text: ${tweetToReplyTo.text.substring(0, 80)}...`);
    } else {
      // Fallback
      tweetToReplyTo = { id: '1989252498121466203' };
      console.log(`   ⚠️  Using fallback tweet: ${tweetToReplyTo.id}`);
    }
    console.log();

    // Test variations
    const tests = [
      {
        name: 'Baseline (plain text)',
        content: 'Interesting point to consider.',
        expectSuccess: true
      },
      {
        name: 'One hashtag',
        content: 'Interesting point about #crypto here.',
        expectSuccess: null // unknown
      },
      {
        name: 'Two hashtags',
        content: 'Great insights on #crypto and #blockchain.',
        expectSuccess: null
      },
      {
        name: 'One link',
        content: 'Interesting read. More info: https://www.bws.ninja',
        expectSuccess: null
      },
      {
        name: 'One @mention',
        content: 'Good point! @BWSCommunity has similar data.',
        expectSuccess: null
      },
      {
        name: 'Hashtag + link',
        content: 'Great #crypto analysis. Check: https://www.bws.ninja',
        expectSuccess: null
      },
      {
        name: '@mention + hashtag',
        content: '@BWSCommunity tracks #microcap projects.',
        expectSuccess: null
      },
      {
        name: '@mention + link',
        content: '@BWSCommunity has more at https://docs.bws.ninja',
        expectSuccess: null
      },
      {
        name: 'Full production template',
        content: 'Interesting insights! @BWSCommunity tracks similar #microcap #crypto metrics. https://docs.bws.ninja/telegram-bots/x-bot',
        expectSuccess: false // we know this fails
      }
    ];

    const results = [];
    let successCount = 0;
    let failureCount = 0;

    console.log('🧪 Running Tests...');
    console.log('='.repeat(70));
    console.log();

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      const testNum = i + 1;

      console.log(`Test ${testNum}/${tests.length}: ${test.name}`);
      console.log(`  Content: "${test.content}"`);

      try {
        // Post reply
        const startTime = Date.now();
        const reply = await client.v2.reply(test.content, tweetToReplyTo.id);
        const duration = Date.now() - startTime;

        console.log(`  ✅ SUCCESS - Posted in ${duration}ms (ID: ${reply.data.id})`);

        // Delete immediately
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s
        await client.v2.deleteTweet(reply.data.id);
        console.log(`  🧹 Deleted`);

        results.push({
          test: test.name,
          content: test.content,
          success: true,
          duration,
          tweetId: reply.data.id
        });

        successCount++;

      } catch (error) {
        const errorCode = error.code || error.status || 'unknown';
        console.log(`  ❌ FAILED - Error ${errorCode}: ${error.message}`);

        results.push({
          test: test.name,
          content: test.content,
          success: false,
          error: errorCode,
          message: error.message
        });

        failureCount++;

        // If we get 403, log additional details
        if (errorCode === 403) {
          if (error.data) {
            console.log(`  📋 Details: ${JSON.stringify(error.data)}`);
          }
        }
      }

      console.log();

      // Wait between tests to avoid rate limiting
      if (i < tests.length - 1) {
        console.log(`  ⏸️  Waiting ${WAIT_BETWEEN_TESTS / 1000}s before next test...`);
        console.log();
        await new Promise(resolve => setTimeout(resolve, WAIT_BETWEEN_TESTS));
      }
    }

    // Summary
    console.log('='.repeat(70));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(70));
    console.log();

    console.log(`Total Tests: ${tests.length}`);
    console.log(`✅ Successes: ${successCount}`);
    console.log(`❌ Failures: ${failureCount}`);
    console.log();

    console.log('Detailed Results:');
    console.log('-'.repeat(70));

    results.forEach((result, idx) => {
      const status = result.success ? '✅' : '❌';
      console.log(`${idx + 1}. ${status} ${result.test}`);
      console.log(`   "${result.content}"`);
      if (result.success) {
        console.log(`   Duration: ${result.duration}ms | Tweet ID: ${result.tweetId}`);
      } else {
        console.log(`   Error: ${result.error} - ${result.message}`);
      }
      console.log();
    });

    // Analysis
    console.log('='.repeat(70));
    console.log('🔍 ANALYSIS');
    console.log('='.repeat(70));
    console.log();

    const hashtagTests = results.filter(r => r.test.includes('hashtag'));
    const linkTests = results.filter(r => r.test.includes('link'));
    const mentionTests = results.filter(r => r.test.includes('@mention'));

    const hashtagFail = hashtagTests.filter(r => !r.success).length;
    const linkFail = linkTests.filter(r => !r.success).length;
    const mentionFail = mentionTests.filter(r => !r.success).length;

    console.log('Trigger Analysis:');
    console.log(`  Hashtags: ${hashtagFail}/${hashtagTests.length} failed`);
    console.log(`  Links: ${linkFail}/${linkTests.length} failed`);
    console.log(`  @Mentions: ${mentionFail}/${mentionTests.length} failed`);
    console.log();

    // Determine primary triggers
    const triggers = [];
    if (hashtagFail > 0) triggers.push('hashtags');
    if (linkFail > 0) triggers.push('links');
    if (mentionFail > 0) triggers.push('@mentions');

    if (triggers.length > 0) {
      console.log('🎯 Identified Spam Triggers:');
      triggers.forEach(trigger => {
        console.log(`   → ${trigger}`);
      });
      console.log();
    }

    // Recommendations
    console.log('💡 Recommendations:');
    console.log();

    if (results[0].success && results[results.length - 1].success === false) {
      console.log('✅ Plain text works, promotional content fails');
      console.log('   → Use natural, conversational language');
      console.log('   → Avoid marketing/promotional patterns');
      console.log();
    }

    if (hashtagFail > 0) {
      console.log('❌ Hashtags trigger spam detection');
      console.log('   → Limit to 0-1 hashtag per reply');
      console.log('   → Use generic hashtags only if necessary');
      console.log();
    }

    if (linkFail > 0) {
      console.log('❌ Links trigger spam detection');
      console.log('   → Avoid links in replies');
      console.log('   → If necessary, use link shorteners or domain reputation');
      console.log();
    }

    if (mentionFail > 0) {
      console.log('❌ @Mentions trigger spam detection');
      console.log('   → Avoid @BWSCommunity mention in every reply');
      console.log('   → Mention only when naturally relevant');
      console.log();
    }

    console.log('📋 Next Steps:');
    console.log('   1. Redesign reply templates based on successful patterns');
    console.log('   2. Use natural conversation, avoid promotional language');
    console.log('   3. Build gradual engagement before adding any promotional elements');
    console.log();

    console.log('='.repeat(70));

    process.exit(failureCount > 0 ? 1 : 0);

  } catch (error) {
    console.error('\n❌ TEST FAILED: Unexpected Error\n');
    console.error('='.repeat(70));
    console.error(`Error: ${error.message}`);
    console.error();
    if (error.data) {
      console.error('API Response:', JSON.stringify(error.data, null, 2));
    }
    console.error('='.repeat(70));
    process.exit(1);
  }
}

// Run tests
runContentVariationTests().catch(error => {
  console.error('\n💥 Unhandled error:', error);
  process.exit(1);
});
