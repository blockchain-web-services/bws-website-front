#!/usr/bin/env node

/**
 * Test the API usage logger
 * Simulates logging rate limit errors to verify the system works
 */

import usageLogger from './utils/api-usage-logger.js';

async function test() {
  console.log('🧪 Testing API Usage Logger\n');

  // Test 1: Log a rate limit error
  console.log('1️⃣ Logging simulated rate limit error...');
  await usageLogger.logRateLimitError({
    tweetId: '1234567890',
    limit: 100,
    remaining: 0,
    used: 100,
    reset: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
  });
  console.log('✅ Rate limit error logged\n');

  // Test 2: Log a successful post
  console.log('2️⃣ Logging simulated successful post...');
  await usageLogger.logSuccessfulPost({
    tweetId: '9876543210',
    replyId: '1111111111',
    replyText: 'Test reply message',
    rateLimit: {
      limit: 100,
      remaining: 77,
      reset: Math.floor(Date.now() / 1000) + 3600
    }
  });
  console.log('✅ Successful post logged\n');

  // Test 3: Display today's usage
  console.log('3️⃣ Displaying today\'s usage summary...');
  await usageLogger.displayTodayUsage();

  // Test 4: Show recent entries
  console.log('\n4️⃣ Recent log entries:');
  const recent = await usageLogger.getRecentEntries(5);
  console.log(`   Found ${recent.length} entries`);

  console.log('\n✅ All tests passed!');
  console.log('\n📂 Log files created:');
  console.log('   - scripts/kols/data/api-usage-log.json');
  console.log('   - scripts/kols/data/api-usage-daily.json');
}

test().catch(error => {
  console.error('❌ Test failed:', error.message);
  console.error(error.stack);
  process.exit(1);
});
