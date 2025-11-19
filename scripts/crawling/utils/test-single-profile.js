import { fetchProfiles } from '../crawlers/twitter-crawler-web-unblocker-optimized.js';

async function test() {
  const profiles = await fetchProfiles(['elonmusk']);
  console.log('Result:', profiles.length > 0 ? profiles[0] : 'FAILED');
}

test().catch(console.error);
