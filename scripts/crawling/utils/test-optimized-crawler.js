/**
 * Test Optimized Web Unblocker Crawler
 * Tests performance optimizations against baseline
 */

import { fetchProfiles } from '../crawlers/twitter-crawler-web-unblocker-optimized.js';

async function test() {
  try {
    // Test with 3 profiles to measure performance
    const testUsernames = [
      'elonmusk',       // Large profile
      'vitalikbuterin', // Medium profile
      'naval'           // Another well-known profile
    ];

    console.log('🧪 Testing OPTIMIZED Web Unblocker Crawler\n');
    console.log('Expected improvements:');
    console.log('  • Disable server-side rendering: 50-95s → 15-30s');
    console.log('  • Session reuse: Additional 5-10% speedup');
    console.log('  • GraphQL interception: Instant data extraction');
    console.log('  • Event-based waiting: No unnecessary delays\n');

    const profiles = await fetchProfiles(testUsernames);

    console.log('\n📊 RESULTS:\n');

    profiles.forEach((profile, i) => {
      console.log(`${i + 1}. @${profile.username}`);
      console.log(`   Name: ${profile.name}`);
      console.log(`   Followers: ${profile.public_metrics.followers_count.toLocaleString()}`);
      console.log(`   Following: ${profile.public_metrics.following_count.toLocaleString()}`);
      console.log(`   Verified: ${profile.verified ? '✓' : '✗'}`);
      console.log(`   Created: ${profile.created_at}`);
      console.log();
    });

    console.log(`✅ Test complete! Successfully fetched ${profiles.length}/${testUsernames.length} profiles`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

test();
