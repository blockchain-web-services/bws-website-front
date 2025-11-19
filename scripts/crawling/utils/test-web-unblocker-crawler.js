/**
 * Test Web Unblocker Crawler
 * Tests the new HTML-based crawler with a few known profiles
 */

import { fetchProfiles } from '../crawlers/twitter-crawler-web-unblocker.js';

async function test() {
  try {
    // Test with a few well-known crypto profiles
    const testUsernames = [
      'elonmusk',      // Should exist
      'vitalikbuterin', // Should exist
      'CryptoCobain'   // May not exist
    ];

    console.log('🧪 Testing Web Unblocker Crawler\n');

    const profiles = await fetchProfiles(testUsernames);

    console.log('\n📊 RESULTS:\n');

    profiles.forEach((profile, i) => {
      console.log(`${i + 1}. @${profile.username}`);
      console.log(`   Name: ${profile.name}`);
      console.log(`   Followers: ${profile.public_metrics.followers_count.toLocaleString()}`);
      console.log(`   Following: ${profile.public_metrics.following_count.toLocaleString()}`);
      console.log(`   Verified: ${profile.verified ? '✓' : '✗'}`);
      console.log(`   Bio: ${profile.description.substring(0, 100)}${profile.description.length > 100 ? '...' : ''}`);
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
