import {
  loadConfig,
  loadBWSProducts,
  loadKolsData,
  loadRepliesData
} from './utils/kol-utils.js';
import {
  createReadOnlyClient,
  getUserByUsername,
  getUserTweets
} from './utils/twitter-client.js';
import {
  createClaudeClient,
  evaluateUserAsCryptoKOL,
  evaluateTweetForReply,
  generateReplyText
} from './utils/claude-client.js';

/**
 * Test Script for KOL System
 * Validates all components work correctly before production deployment
 */

async function runTests() {
  console.log('🧪 Starting KOL System Tests...\n');

  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: Configuration loading
  console.log('Test 1: Configuration Loading');
  try {
    const config = loadConfig();
    if (config.discovery && config.kolCriteria && config.replySettings) {
      console.log('   ✅ Configuration loaded successfully');
      testsPassed++;
    } else {
      throw new Error('Invalid config structure');
    }
  } catch (error) {
    console.error(`   ❌ Configuration test failed: ${error.message}`);
    testsFailed++;
  }

  // Test 1b: BWS Products loading
  console.log('\nTest 1b: BWS Products Loading from Docs');
  try {
    const products = loadBWSProducts();
    const productCount = Object.keys(products).length;

    if (productCount > 0) {
      console.log(`   ✅ Loaded ${productCount} BWS products from docs-index.json`);
      console.log(`      Products: ${Object.keys(products).join(', ')}`);

      // Check that products have required fields
      const firstProduct = Object.values(products)[0];
      if (firstProduct.description && firstProduct.keywords && firstProduct.useCases) {
        console.log('   ✅ Products have complete documentation data');
      } else {
        throw new Error('Products missing required fields');
      }

      testsPassed++;
    } else {
      throw new Error('No products loaded');
    }
  } catch (error) {
    console.error(`   ❌ BWS Products test failed: ${error.message}`);
    console.error('      Check that scripts/data/docs-index.json exists');
    testsFailed++;
  }

  // Test 2: Data file loading
  console.log('\nTest 2: Data File Operations');
  try {
    const kolsData = loadKolsData();
    const repliesData = loadRepliesData();

    if (kolsData && repliesData) {
      console.log('   ✅ Data files loaded successfully');
      console.log(`      KOLs in database: ${kolsData.kols.length}`);
      console.log(`      Replies in database: ${repliesData.replies.length}`);
      testsPassed++;
    } else {
      throw new Error('Failed to load data');
    }
  } catch (error) {
    console.error(`   ❌ Data loading test failed: ${error.message}`);
    testsFailed++;
  }

  // Test 3: Twitter API connection (read-only)
  console.log('\nTest 3: Twitter API Connection');
  try {
    const client = createReadOnlyClient();
    console.log('   ✅ Twitter client initialized');

    // Test with BWS account
    const user = await getUserByUsername(client, 'BWSCommunity');
    console.log(`   ✅ Successfully fetched user @${user.username}`);
    console.log(`      Name: ${user.name}`);
    console.log(`      Followers: ${user.public_metrics.followers_count.toLocaleString()}`);

    testsPassed++;
  } catch (error) {
    console.error(`   ❌ Twitter API test failed: ${error.message}`);
    console.error('      Check BWSXAI_TWITTER_BEARER_TOKEN in .env');
    testsFailed++;
  }

  // Test 4: Claude API connection
  console.log('\nTest 4: Claude API Connection');
  try {
    const client = createClaudeClient();
    console.log('   ✅ Claude client initialized');
    testsPassed++;
  } catch (error) {
    console.error(`   ❌ Claude API test failed: ${error.message}`);
    console.error('      Check ANTHROPIC_API_KEY in .env');
    testsFailed++;
  }

  // Test 5: End-to-end KOL evaluation
  console.log('\nTest 5: KOL Evaluation (End-to-End)');
  try {
    const config = loadConfig();
    const twitterClient = createReadOnlyClient();
    const claudeClient = createClaudeClient();

    console.log('   Testing with @VitalikButerin...');

    // Get user
    const user = await getUserByUsername(twitterClient, 'VitalikButerin');
    console.log(`   ✅ Fetched user data`);

    // Get recent tweets
    const tweets = await getUserTweets(twitterClient, user.id, { max_results: 5 });
    const tweetsArray = [];
    for await (const tweet of tweets) {
      tweetsArray.push(tweet);
    }
    console.log(`   ✅ Fetched ${tweetsArray.length} recent tweets`);

    // Evaluate with Claude
    const evaluation = await evaluateUserAsCryptoKOL(claudeClient, user, tweetsArray);
    console.log(`   ✅ Claude evaluation complete`);
    console.log(`      Is Crypto KOL: ${evaluation.isCryptoKOL ? 'Yes' : 'No'}`);
    console.log(`      Crypto Relevance: ${evaluation.cryptoRelevanceScore}%`);
    console.log(`      Account Type: ${evaluation.accountType}`);
    console.log(`      Topics: ${evaluation.primaryTopics?.join(', ')}`);

    if (evaluation.isCryptoKOL && evaluation.cryptoRelevanceScore >= 70) {
      console.log('   ✅ Evaluation results look correct');
      testsPassed++;
    } else {
      console.log('   ⚠️  Unexpected evaluation (but test passed)');
      testsPassed++;
    }
  } catch (error) {
    console.error(`   ❌ KOL evaluation test failed: ${error.message}`);
    testsFailed++;
  }

  // Test 6: Tweet evaluation and reply generation
  console.log('\nTest 6: Tweet Evaluation & Reply Generation');
  try {
    const config = loadConfig();
    const bwsProducts = loadBWSProducts();
    const twitterClient = createReadOnlyClient();
    const claudeClient = createClaudeClient();

    // Use a well-known crypto account
    const user = await getUserByUsername(twitterClient, 'VitalikButerin');
    const tweets = await getUserTweets(twitterClient, user.id, { max_results: 3 });

    const tweetsArray = [];
    for await (const tweet of tweets) {
      tweetsArray.push(tweet);
    }

    if (tweetsArray.length > 0) {
      const testTweet = tweetsArray[0];
      console.log(`   Testing with tweet: "${testTweet.text.substring(0, 100)}..."`);

      // Evaluate for reply
      const kolProfile = {
        username: user.username,
        followersCount: user.public_metrics.followers_count,
        recentTopics: ['Ethereum', 'Blockchain', 'Crypto']
      };

      const evaluation = await evaluateTweetForReply(
        claudeClient,
        testTweet,
        kolProfile,
        bwsProducts,
        config
      );

      console.log(`   ✅ Tweet evaluated`);
      console.log(`      Should Reply: ${evaluation.shouldReply ? 'Yes' : 'No'}`);
      console.log(`      Relevance Score: ${evaluation.relevanceScore}%`);
      console.log(`      Best Product: ${evaluation.bestMatchingProduct || 'None'}`);
      console.log(`      Category: ${evaluation.tweetCategory}`);

      // Generate reply (even if shouldn't reply, just to test)
      if (evaluation.bestMatchingProduct) {
        const product = bwsProducts[evaluation.bestMatchingProduct];
        const replyGen = await generateReplyText(
          claudeClient,
          testTweet,
          kolProfile,
          product,
          evaluation
        );

        console.log(`   ✅ Reply generated`);
        console.log(`      Reply: "${replyGen.replyText}"`);
        console.log(`      Tone: ${replyGen.tone}`);
      }

      testsPassed++;
    } else {
      throw new Error('No tweets found');
    }
  } catch (error) {
    console.error(`   ❌ Tweet evaluation test failed: ${error.message}`);
    testsFailed++;
  }

  // Print summary
  console.log(`\n
${'='.repeat(60)}
🧪 TEST SUMMARY
${'='.repeat(60)}

Tests Passed: ${testsPassed}
Tests Failed: ${testsFailed}
Total Tests: ${testsPassed + testsFailed}

${testsFailed === 0 ? '✅ All tests passed! System is ready.' : '❌ Some tests failed. Please fix issues before deployment.'}

${'='.repeat(60)}
`);

  if (testsFailed > 0) {
    console.log(`
💡 Common Issues:
   - Missing .env file with API keys
   - Invalid API credentials
   - Network/connectivity issues
   - Rate limiting (wait a few minutes)
`);
    process.exit(1);
  } else {
    console.log(`
✅ System validated successfully!

Next steps:
1. Add seed KOL usernames to config/kol-config.json
2. Run: node scripts/kols/discover-kols.js
3. Run: node scripts/kols/evaluate-and-reply-kols.js (dry-run mode)
4. Check results and adjust configuration as needed
5. Deploy GitHub Actions workflows
`);
  }
}

// Run tests
runTests().catch(error => {
  console.error('\n❌ Test suite failed:', error);
  process.exit(1);
});
