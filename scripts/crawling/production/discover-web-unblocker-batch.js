/**
 * KOL Discovery with Web Unblocker - BATCHED PROCESSING
 *
 * Processes 10 candidates at a time:
 * - Fetches profiles using Web Unblocker
 * - Saves successful profiles to kols-data.json
 * - Removes processed candidates from kol-candidates.json
 * - Designed for incremental progress over multiple runs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchProfiles } from '../crawlers/twitter-crawler-web-unblocker-optimized.js';
import { loadConfig, loadKolsData, saveKolsData, updateReadmeKolStats } from '../utils/kol-utils.js';
import { sendDiscoveryNotification } from '../utils/zapier-webhook.js';
import { logMorningDiscovery } from '../utils/execution-logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BATCH_SIZE = 10;  // Process 10 profiles per run

/**
 * Load candidate usernames from config file
 */
function loadCandidates() {
  const candidatesPath = path.join(__dirname, '../config/kol-candidates.json');

  try {
    const data = fs.readFileSync(candidatesPath, 'utf-8');
    const config = JSON.parse(data);

    // Flatten all tiers into a single array
    const candidates = [];
    for (const tier of Object.values(config.candidatesByTier)) {
      candidates.push(...tier);
    }

    return {
      candidates,
      config
    };
  } catch (error) {
    console.error(`Error loading candidates: ${error.message}`);
    throw error;
  }
}

/**
 * Save updated candidates list (with processed candidates removed)
 */
function saveCandidates(config, removedUsernames) {
  const candidatesPath = path.join(__dirname, '../config/kol-candidates.json');

  try {
    // Remove processed candidates from all tiers
    const removedSet = new Set(removedUsernames.map(u => u.toLowerCase()));

    for (const [tierName, tierCandidates] of Object.entries(config.candidatesByTier)) {
      config.candidatesByTier[tierName] = tierCandidates.filter(
        username => !removedSet.has(username.toLowerCase())
      );
    }

    // Update metadata
    const totalCandidates = Object.values(config.candidatesByTier).reduce(
      (sum, tier) => sum + tier.length,
      0
    );
    config.totalCandidates = totalCandidates;
    config.lastUpdated = new Date().toISOString();

    fs.writeFileSync(candidatesPath, JSON.stringify(config, null, 2));
    console.log(`\n📝 Updated candidates list: ${removedUsernames.length} processed, ${totalCandidates} remaining`);
  } catch (error) {
    console.error(`Error saving candidates: ${error.message}`);
    throw error;
  }
}

async function discoverWithWebUnblocker() {
  console.log('🔍 KOL DISCOVERY - WEB UNBLOCKER BATCH MODE');
  console.log('='.repeat(60));
  console.log(`📦 Batch size: ${BATCH_SIZE} profiles per run`);
  console.log('='.repeat(60));

  const startTime = Date.now();

  // Load candidates from config file
  const { candidates: candidateUsernames, config: candidatesConfig } = loadCandidates();

  const results = {
    candidatesStart: candidateUsernames.length,
    batchSize: BATCH_SIZE,
    candidatesChecked: 0,
    profilesRetrieved: 0,
    kolsAdded: 0,
    errors: [],
    discovered: [],
    processedUsernames: [],  // Track ALL processed candidates for removal (success or failure)
    discardedKols: [],  // Track discards with reasons: { username, reason }
    topDiscovery: null,
    candidatesRemaining: 0
  };

  // Load existing KOLs
  const kolsData = loadKolsData();
  const existingUsernames = new Set(kolsData.kols.map(k => k.username.toLowerCase()));
  const config = loadConfig();

  console.log(`\n📋 Total candidates: ${candidateUsernames.length}`);
  console.log(`📊 Existing KOLs in database: ${kolsData.kols.length}`);
  console.log(`📏 Min followers required: ${config.kolCriteria.minFollowers.toLocaleString()}\n`);

  // Filter out candidates already in database
  const candidatesToFetch = candidateUsernames.filter(username => {
    if (existingUsernames.has(username.toLowerCase())) {
      console.log(`⏭️  Skipping @${username} - already in database`);
      results.processedUsernames.push(username);
      return false;
    }
    return true;
  });

  // Take only BATCH_SIZE candidates for this run
  const batchCandidates = candidatesToFetch.slice(0, BATCH_SIZE);

  if (batchCandidates.length === 0) {
    console.log('\n✅ No new candidates to process!');
    console.log('All candidates have been checked or are already in the database.\n');
    return results;
  }

  console.log(`\n📦 Processing batch: ${batchCandidates.length} profiles`);
  console.log(`   Remaining after this batch: ${candidatesToFetch.length - batchCandidates.length}\n`);

  // Fetch profiles using Web Unblocker
  let profiles = [];
  try {
    profiles = await fetchProfiles(batchCandidates);
    console.log(`\n✅ Batch complete! Retrieved ${profiles.length}/${batchCandidates.length} profiles\n`);
  } catch (error) {
    console.error(`\n❌ Batch fetch error: ${error.message}\n`);
    results.errors.push(`Batch fetch failed: ${error.message}`);
  }

  // Create a map of fetched profiles
  const profileMap = new Map();
  profiles.forEach(profile => {
    if (profile && profile.username) {
      profileMap.set(profile.username.toLowerCase(), profile);
    }
  });

  // Process each candidate in the batch
  for (const username of batchCandidates) {
    results.candidatesChecked++;
    results.processedUsernames.push(username);  // Mark as processed regardless of outcome

    console.log(`\n[${results.candidatesChecked}/${batchCandidates.length}] Processing @${username}...`);

    const profile = profileMap.get(username.toLowerCase());

    if (!profile) {
      console.log(`   ❌ Profile not retrieved`);
      results.errors.push(`@${username}: Profile not retrieved`);
      results.discardedKols.push({ username, reason: 'Profile not found' });
      continue;
    }

    try {
      results.profilesRetrieved++;

      const followers = profile.public_metrics?.followers_count || 0;
      const verified = profile.verified || false;
      const bio = profile.description || '';

      console.log(`   ✅ Profile retrieved`);
      console.log(`      Followers: ${followers.toLocaleString()}`);
      console.log(`      Verified: ${verified ? '✅' : '❌'}`);
      console.log(`      Bio: ${bio.substring(0, 80)}${bio.length > 80 ? '...' : ''}`);

      // Check if meets minimum criteria
      if (followers < config.kolCriteria.minFollowers) {
        console.log(`   ⏭️  Below minimum followers (${config.kolCriteria.minFollowers.toLocaleString()})`);
        results.discardedKols.push({ username, reason: `Below ${config.kolCriteria.minFollowers.toLocaleString()} followers` });
        continue;
      }

      // Check if exceeds maximum followers
      if (config.kolCriteria.maxFollowers && followers > config.kolCriteria.maxFollowers) {
        console.log(`   ⏭️  Above maximum followers (${config.kolCriteria.maxFollowers.toLocaleString()})`);
        results.discardedKols.push({ username, reason: `Above ${config.kolCriteria.maxFollowers.toLocaleString()} followers` });
        continue;
      }

      // Check for crypto keywords in bio
      const cryptoKeywords = ['crypto', 'bitcoin', 'btc', 'eth', 'ethereum', 'blockchain', 'defi', 'web3', 'nft', 'dao', 'degen'];
      const bioLower = bio.toLowerCase();
      const hasCryptoKeyword = cryptoKeywords.some(kw => bioLower.includes(kw));

      // Known crypto influencers
      const knownCryptoUsernames = [
        'vitalikbuterin', 'cz_binance', 'aantonop', 'naval',
        'balajis', 'apompliano', 'documentingbtc', 'defidad', 'sassal0x',
        'elonmusk', 'satoshilite', 'justinsuntron', 'cobie', 'incomesharks'
      ];
      const isKnownCryptoKOL = knownCryptoUsernames.includes(username.toLowerCase());

      const passesFilter = hasCryptoKeyword || isKnownCryptoKOL || (verified && followers > 500000);

      if (!passesFilter) {
        console.log(`   ⏭️  Does not meet crypto relevance criteria`);
        results.discardedKols.push({ username, reason: 'Not crypto relevant' });
        continue;
      }

      // Add to KOLs database
      const newKol = {
        username: profile.username,
        name: profile.name,
        followers_count: followers,
        following_count: profile.public_metrics?.following_count || 0,
        verified: verified,
        description: bio,
        url: profile.url || '',
        location: profile.location || '',
        created_at: profile.created_at || '',
        profile_image_url: profile.profile_image_url || '',
        discovered_at: new Date().toISOString(),
        source: 'web-unblocker-batch',
        tier: determineTier(followers)
      };

      kolsData.kols.push(newKol);
      results.discovered.push(newKol);
      results.kolsAdded++;

      console.log(`   🎉 Added to KOLs database! (Tier: ${newKol.tier})`);

      // Track top discovery
      if (!results.topDiscovery || followers > results.topDiscovery.followers_count) {
        results.topDiscovery = newKol;
      }

    } catch (error) {
      console.log(`   ❌ Error processing profile: ${error.message}`);
      results.errors.push(`@${username}: ${error.message}`);
    }
  }

  // Save updated KOLs data
  if (results.kolsAdded > 0) {
    saveKolsData(kolsData);
    updateReadmeKolStats(kolsData.kols.length);
    console.log(`\n✅ Saved ${results.kolsAdded} new KOLs to database`);
  }

  // Remove processed candidates from candidates list
  if (results.processedUsernames.length > 0) {
    saveCandidates(candidatesConfig, results.processedUsernames);
    results.candidatesRemaining = candidatesConfig.totalCandidates;
  }

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 BATCH SUMMARY');
  console.log('='.repeat(60));
  console.log(`⏱️  Duration: ${duration} minutes`);
  console.log(`📋 Candidates processed: ${results.candidatesChecked}/${results.batchSize}`);
  console.log(`✅ Profiles retrieved: ${results.profilesRetrieved}`);
  console.log(`🎯 KOLs added: ${results.kolsAdded}`);
  console.log(`❌ Errors: ${results.errors.length}`);
  console.log(`📊 Candidates remaining: ${results.candidatesRemaining}`);

  if (results.topDiscovery) {
    console.log(`\n🏆 Top Discovery:`);
    console.log(`   @${results.topDiscovery.username}`);
    console.log(`   ${results.topDiscovery.followers_count.toLocaleString()} followers`);
  }

  if (results.discovered.length > 0) {
    console.log(`\n🎉 Discovered KOLs:`);
    results.discovered.forEach((kol, i) => {
      console.log(`   ${i + 1}. @${kol.username} (${kol.followers_count.toLocaleString()} followers)`);
    });
  }

  console.log();

  // Log execution
  await logMorningDiscovery(results);

  // Send notification
  try {
    await sendDiscoveryNotification({
      scriptName: 'KOL Discovery (Morning)',
      success: true,
      kolsAdded: results.kolsAdded,
      totalKols: kolsData.kols.length,
      method: 'Web Unblocker',
      duration: Math.round((Date.now() - startTime) / 1000),
      discardedKols: results.discardedKols,
      candidatesProcessed: results.candidatesChecked
    });
  } catch (error) {
    console.log(`⚠️  Webhook notification failed: ${error.message}`);
  }

  return results;
}

/**
 * Determine KOL tier based on followers
 */
function determineTier(followers) {
  if (followers >= 1000000) return 'mega';
  if (followers >= 100000) return 'macro';
  if (followers >= 10000) return 'micro';
  return 'nano';
}

// Run discovery
discoverWithWebUnblocker()
  .then(results => {
    console.log('✅ Discovery complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Discovery failed:', error);
    process.exit(1);
  });
