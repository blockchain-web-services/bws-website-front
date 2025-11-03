/**
 * Test Zapier Webhook Integration
 * Sends test messages to verify Zapier configuration
 */

import {
  sendToZapier,
  sendDiscoveryNotification,
  sendReplyNotification,
  sendErrorNotification
} from './utils/zapier-webhook.js';

async function testWebhook() {
  console.log('🧪 Testing Zapier Webhook Integration...\n');

  // Test 1: Simple raw message
  console.log('Test 1: Sending simple test message...');
  try {
    const result1 = await sendToZapier({
      type: 'test',
      message: 'Hello from BWS KOL System!',
      timestamp: new Date().toISOString(),
      test_field_1: 'This is a test string',
      test_field_2: 123,
      test_field_3: true,
      test_nested: {
        nested_field: 'nested value',
        nested_number: 456
      }
    });
    console.log('✅ Test 1 Success:', result1);
  } catch (error) {
    console.error('❌ Test 1 Failed:', error.message);
  }

  console.log('\n---\n');

  // Test 2: KOL Discovery notification
  console.log('Test 2: Sending KOL Discovery notification...');
  try {
    const result2 = await sendDiscoveryNotification({
      scriptName: 'KOL Discovery - TEST',
      success: true,
      totalQueries: 6,
      tweetsFound: 150,
      kolsAdded: 3,
      totalKols: 4,
      apiStats: {
        overall: {
          totalCalls: 10,
          successfulCalls: 8,
          failedCalls: 2,
          totalItemsFetched: 150,
          duration: '12.5',
          callsPerMinute: '48.0'
        },
        byEndpoint: {
          'tweets/search/recent': {
            totalCalls: 6,
            successfulCalls: 4,
            failedCalls: 2,
            totalItemsFetched: 100,
            errors: ['Rate limit (429)']
          },
          'users/lookup': {
            totalCalls: 4,
            successfulCalls: 4,
            failedCalls: 0,
            totalItemsFetched: 50,
            errors: []
          }
        }
      },
      runUrl: 'https://github.com/blockchain-web-services/bws-website-front/actions/runs/12345'
    });
    console.log('✅ Test 2 Success:', result2);
  } catch (error) {
    console.error('❌ Test 2 Failed:', error.message);
  }

  console.log('\n---\n');

  // Test 3: KOL Reply notification
  console.log('Test 3: Sending KOL Reply notification...');
  try {
    const result3 = await sendReplyNotification({
      success: true,
      tweetsEvaluated: 15,
      tweetsSkipped: 12,
      repliesPosted: 3,
      todayReplies: 5,
      maxRepliesPerDay: 7,
      totalReplies: 42,
      dryRun: false,
      apiStats: {
        overall: {
          totalCalls: 5,
          successfulCalls: 5,
          failedCalls: 0,
          totalItemsFetched: 15,
          duration: '8.2',
          callsPerMinute: '36.6'
        },
        byEndpoint: {
          'tweets/search/recent': {
            totalCalls: 3,
            successfulCalls: 3,
            failedCalls: 0,
            totalItemsFetched: 15,
            errors: []
          },
          'tweets/reply': {
            totalCalls: 2,
            successfulCalls: 2,
            failedCalls: 0,
            totalItemsFetched: 2,
            errors: []
          }
        }
      },
      runUrl: 'https://github.com/blockchain-web-services/bws-website-front/actions/runs/12346'
    });
    console.log('✅ Test 3 Success:', result3);
  } catch (error) {
    console.error('❌ Test 3 Failed:', error.message);
  }

  console.log('\n---\n');

  // Test 4: Error notification
  console.log('Test 4: Sending Error notification...');
  try {
    const testError = new Error('Test error: API rate limit exceeded');
    testError.stack = 'Error: Test error: API rate limit exceeded\n    at testFunction (test.js:123:45)';

    const result4 = await sendErrorNotification({
      scriptName: 'KOL Discovery - TEST',
      error: testError,
      context: {
        phase: 'Search queries',
        query_count: 6,
        failed_at: 'Query 3/6',
        kols_processed: 2
      },
      runUrl: 'https://github.com/blockchain-web-services/bws-website-front/actions/runs/12347'
    });
    console.log('✅ Test 4 Success:', result4);
  } catch (error) {
    console.error('❌ Test 4 Failed:', error.message);
  }

  console.log('\n---\n');

  // Test 5: Failed discovery notification
  console.log('Test 5: Sending Failed Discovery notification...');
  try {
    const result5 = await sendDiscoveryNotification({
      scriptName: 'KOL Discovery - TEST FAILURE',
      success: false,
      totalQueries: 3,
      tweetsFound: 0,
      kolsAdded: 0,
      totalKols: 1,
      error: 'Request failed with code 429 - Rate limit exceeded',
      apiStats: {
        overall: {
          totalCalls: 6,
          successfulCalls: 0,
          failedCalls: 6,
          totalItemsFetched: 0,
          duration: '0.8',
          callsPerMinute: '450.0'
        },
        byEndpoint: {
          'tweets/search/recent': {
            totalCalls: 6,
            successfulCalls: 0,
            failedCalls: 6,
            totalItemsFetched: 0,
            errors: ['Rate limit (429)', 'Rate limit (429)', 'Rate limit (429)']
          }
        }
      },
      runUrl: 'https://github.com/blockchain-web-services/bws-website-front/actions/runs/12348'
    });
    console.log('✅ Test 5 Success:', result5);
  } catch (error) {
    console.error('❌ Test 5 Failed:', error.message);
  }

  console.log('\n✅ All webhook tests completed!\n');
  console.log('📋 Check your Zapier webhook to see all test messages and configure your Zap accordingly.');
  console.log('\n💡 JSON fields you can use in Zapier:');
  console.log('   - type: Message type (test, kol_discovery, kol_reply, error)');
  console.log('   - status: Status (completed, failed)');
  console.log('   - script: Script name');
  console.log('   - timestamp: ISO timestamp');
  console.log('   - text: Formatted message for Slack');
  console.log('   - summary: Object with key metrics');
  console.log('   - error: Error message (if failed)');
  console.log('   - run_url: GitHub Actions workflow URL');
  console.log('\n📊 For API stats:');
  console.log('   - summary.queries, summary.tweets_found, summary.kols_added, etc.');
}

// Run tests
testWebhook().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
