/**
 * KOL Discovery using Crawlee - Direct Profile Fetching
 * Fetches profiles of known crypto influencers directly
 */

import { getUserProfile } from './crawlers/twitter-crawler.js';
import { loadConfig, loadKolsData, saveKolsData } from './utils/kol-utils.js';
import { sendDiscoveryNotification } from './utils/zapier-webhook.js';

async function discoverWithCrawlee() {
  console.log('🔍 KOL DISCOVERY - CRAWLEE MODE');
  console.log('='.repeat(60));

  const startTime = Date.now();

  // Known crypto KOLs to discover
  // Organized by follower tiers for optimal engagement
  const candidateUsernames = [
    // Tier 1: 100K-500K followers (high reach, moderate engagement)
    'IncomeSharks',
    'AltcoinSherpa',
    'cobie',
    'CryptoKaleo',
    'CryptoHayes',
    'WuBlockchain',
    'CryptoCobain',
    'CryptoRover',
    'CryptoWendyO',
    'TheWolfOfAllSt',
    'CryptosR_Us',
    'Pentosh1',
    'CryptoCapo_',
    'CryptoMessiah',
    'GiganticRebirth',
    'MMCrypto',
    'AltcoinGordon',
    'CryptoDonAlt',
    'CryptoWhale',
    'DocumentingBTC',

    // Tier 2: 50K-100K followers (balanced reach/engagement)
    'CryptoYoda1338',
    'TraderMayne',
    'CryptoGodJohn',
    'ImBagsy',
    'CryptoPosedon',
    'BTC_Archive',
    'thedefiedge',
    'MacroScope17',
    'DefiIgnas',
    'DeFi_Dad',
    'sassal0x',
    'ChainLinkGod',
    'NansenAI',
    'DuneAnalytics',
    'CryptoMichNL',

    // Tier 3: 10K-50K followers (high engagement, niche audiences)
    'MilesDeutscher',
    'LomahCrypto',
    'AdamScochran',
    'CryptoCred',
    'TheCryptoDog',
    'cryptoyieldinfo',
    'CryptoGainz1',
    'SmartContracter',
    'KoroushAK',
    'TheCryptoCactus',
    'AltcoinPsycho',
    'DoveyWan',
    'Defi_gazer',
    'AltcoinDailyio',
    'coinbureau'
  ];

  const results = {
    candidatesChecked: 0,
    profilesRetrieved: 0,
    kolsAdded: 0,
    errors: [],
    discovered: []
  };

  // Load existing KOLs
  const kolsData = loadKolsData();
  const existingUsernames = new Set(kolsData.kols.map(k => k.username.toLowerCase()));
  const config = loadConfig();

  console.log(`📋 Candidates to check: ${candidateUsernames.length}`);
  console.log(`📊 Existing KOLs in database: ${kolsData.kols.length}`);
  console.log(`📏 Min followers required: ${config.kolCriteria.minFollowers.toLocaleString()}\n`);

  // Process each candidate
  for (const username of candidateUsernames) {
    results.candidatesChecked++;

    console.log(`\n[${results.candidatesChecked}/${candidateUsernames.length}] Checking @${username}...`);

    // Skip if already in database
    if (existingUsernames.has(username.toLowerCase())) {
      console.log(`   ⏭️  Already in database`);
      continue;
    }

    try {
      // Fetch profile
      const profile = await getUserProfile(username);

      if (!profile) {
        console.log(`   ❌ Profile not found`);
        results.errors.push(`@${username}: Profile not found`);
        continue;
      }

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
        continue;
      }

      // Check if exceeds maximum followers (avoid mega accounts)
      if (config.kolCriteria.maxFollowers && followers > config.kolCriteria.maxFollowers) {
        console.log(`   ⏭️  Above maximum followers (${config.kolCriteria.maxFollowers.toLocaleString()}) - Too large for effective engagement`);
        continue;
      }

      // Check for crypto keywords in bio (relaxed rules)
      const cryptoKeywords = ['crypto', 'bitcoin', 'btc', 'eth', 'ethereum', 'blockchain', 'defi', 'web3', 'nft', 'web3', 'dao', 'degen'];
      const bioLower = bio.toLowerCase();
      const hasCryptoKeyword = cryptoKeywords.some(kw => bioLower.includes(kw));

      // Known crypto influencer usernames (even without crypto keywords in bio)
      const knownCryptoUsernames = [
        'vitalikbuterin', 'cz_binance', 'sbf_ftx', 'aantonop', 'naval',
        'balajis', 'apompliano', 'documentingbtc', 'defidad', 'sassal0x',
        'elonmusk', 'satoshilite', 'justinsuntron', 'cobie', 'incomesharks'
      ];
      const isKnownCryptoKOL = knownCryptoUsernames.includes(username.toLowerCase());

      // More lenient: Accept if has crypto keywords OR is known crypto KOL OR verified with high followers
      const passesFilter = hasCryptoKeyword || isKnownCryptoKOL || (verified && followers > 500000);

      if (!passesFilter) {
        console.log(`   ⏭️  Not identified as crypto KOL (no keywords, not in known list, not high-profile verified)`);
        continue;
      }

      const confidenceScore = hasCryptoKeyword ? 90 : isKnownCryptoKOL ? 85 : 70;

      // Add to KOLs
      const newKol = {
        id: profile.id || `crawlee_${username}`,
        username: profile.username || username,
        name: profile.name || username,
        bio: bio,
        followersCount: followers,
        followingCount: profile.public_metrics?.following_count || 0,
        tweetCount: profile.public_metrics?.tweet_count || 0,
        isVerified: verified,
        cryptoRelevanceScore: confidenceScore,
        engagementRate: 0,
        avgLikes: 0,
        avgViews: 0,
        discoveredAt: new Date().toISOString(),
        lastChecked: new Date().toISOString(),
        discoveredThrough: 'crawlee-direct',
        discoveryLevel: 0,
        engagementHistory: {
          totalPostsAnalyzed: 0,
          repliedTo: 0,
          lastEngagement: null,
          successfulReplies: 0,
          failedReplies: 0
        },
        relationships: {
          follows: [],
          followedBy: []
        },
        recentTopics: [],
        cryptoProjects: [],
        sentimentTowardsCrypto: 'positive',
        accountType: 'person',
        lastTweetAnalyzed: null,
        status: 'active'
      };

      kolsData.kols.push(newKol);
      results.kolsAdded++;
      results.discovered.push({
        username: newKol.username,
        followers: followers,
        verified: verified
      });

      console.log(`   ✅ Added to KOLs database!`);

      // Save after each addition
      saveKolsData(kolsData);

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      results.errors.push(`@${username}: ${error.message}`);
    }

    // Rate limiting - wait between requests
    if (results.candidatesChecked < candidateUsernames.length) {
      console.log(`   ⏸️  Waiting 3s...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Final save
  if (results.kolsAdded > 0) {
    kolsData.metadata.lastDiscoveryRun = new Date().toISOString();
    kolsData.metadata.discoveryMethod = 'crawlee-direct';
    saveKolsData(kolsData);
  }

  const duration = Math.round((Date.now() - startTime) / 1000);

  // Print results
  console.log('\n' + '='.repeat(60));
  console.log('📊 CRAWLEE DISCOVERY RESULTS');
  console.log('='.repeat(60));
  console.log(`\nExecution:`);
  console.log(`  Duration: ${duration}s (${Math.round(duration/60)}m ${duration%60}s)`);
  console.log(`  Candidates Checked: ${results.candidatesChecked}`);
  console.log(`  Profiles Retrieved: ${results.profilesRetrieved}`);
  console.log(`  KOLs Added: ${results.kolsAdded}`);
  console.log(`  Errors: ${results.errors.length}`);

  console.log(`\nDatabase:`);
  console.log(`  Total KOLs: ${kolsData.kols.length}`);
  console.log(`  Active KOLs: ${kolsData.kols.filter(k => k.status === 'active').length}`);

  if (results.discovered.length > 0) {
    console.log(`\n✨ Discovered KOLs:`);
    results.discovered.forEach((kol, i) => {
      console.log(`  ${i + 1}. @${kol.username}`);
      console.log(`     Followers: ${kol.followers.toLocaleString()}`);
      console.log(`     Verified: ${kol.verified ? '✅' : '❌'}`);
    });
  }

  if (results.errors.length > 0) {
    console.log(`\n❌ Errors (${results.errors.length}):`);
    results.errors.slice(0, 5).forEach((err, i) => {
      console.log(`  ${i + 1}. ${err}`);
    });
    if (results.errors.length > 5) {
      console.log(`  ... and ${results.errors.length - 5} more`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Discovery complete! Added ${results.kolsAdded} new KOLs`);
  console.log('='.repeat(60) + '\n');

  // Send Zapier notification
  console.log('\n🔔 Sending Zapier notification...');
  try {
    await sendDiscoveryNotification({
      scriptName: 'KOL Discovery (Crawlee)',
      success: true,
      totalQueries: results.candidatesChecked,
      tweetsFound: 0, // Not applicable for profile discovery
      kolsAdded: results.kolsAdded,
      totalKols: kolsData.kols.length,
      runUrl: process.env.GITHUB_RUN_URL || null
    });
    console.log('✅ Zapier notification sent successfully');
  } catch (notificationError) {
    console.error('⚠️  Failed to send Zapier notification:', notificationError.message);
    console.error('   Error stack:', notificationError.stack);
    // Don't fail the whole script if notification fails
  }

  return results;
}

// Run discovery
discoverWithCrawlee().then(results => {
  process.exit(results.kolsAdded > 0 ? 0 : 1);
}).catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
