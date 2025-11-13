import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

/**
 * PHASE 5: Secret Values Verification Test
 *
 * This script creates SHA-256 hashes of credentials to verify they match
 * between local and CI environments WITHOUT exposing the actual values.
 *
 * Purpose: Detect credential mismatches between GitHub Secrets and local .env
 */
function hashValue(value) {
  if (!value) return 'MISSING';
  return crypto.createHash('sha256').update(value).digest('hex').substring(0, 16);
}

function getCredentialInfo() {
  const credentials = {
    BWSXAI_TWITTER_API_KEY: process.env.BWSXAI_TWITTER_API_KEY,
    BWSXAI_TWITTER_API_SECRET: process.env.BWSXAI_TWITTER_API_SECRET,
    BWSXAI_TWITTER_ACCESS_TOKEN: process.env.BWSXAI_TWITTER_ACCESS_TOKEN,
    BWSXAI_TWITTER_ACCESS_SECRET: process.env.BWSXAI_TWITTER_ACCESS_SECRET,
    OXYLABS_USERNAME: process.env.OXYLABS_USERNAME,
    OXYLABS_PASSWORD: process.env.OXYLABS_PASSWORD,
  };

  const info = {};

  for (const [key, value] of Object.entries(credentials)) {
    info[key] = {
      present: !!value,
      hash: hashValue(value),
      length: value ? value.length : 0,
      firstChar: value ? value[0] : 'N/A',
      lastChar: value ? value[value.length - 1] : 'N/A'
    };
  }

  return info;
}

async function testSecretValues() {
  console.log('🔍 PHASE 5: Secret Values Verification Test\n');
  console.log('='.repeat(70));

  const isCI = process.env.CI === 'true';
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

  console.log('📋 Environment:');
  console.log(`   CI: ${isCI ? '✅ Yes' : '❌ No'}`);
  console.log(`   GitHub Actions: ${isGitHubActions ? '✅ Yes' : '❌ No'}`);
  console.log();

  console.log('🔐 Credential Analysis (Hashed for Security):');
  console.log('='.repeat(70));
  console.log();

  const credInfo = getCredentialInfo();

  // Display credential info
  for (const [key, info] of Object.entries(credInfo)) {
    console.log(`${key}:`);
    console.log(`   Present: ${info.present ? '✅' : '❌'}`);
    if (info.present) {
      console.log(`   Hash (first 16 chars): ${info.hash}`);
      console.log(`   Length: ${info.length} characters`);
      console.log(`   First char: '${info.firstChar}'`);
      console.log(`   Last char: '${info.lastChar}'`);
    }
    console.log();
  }

  console.log('='.repeat(70));
  console.log('📊 VERIFICATION CHECKLIST');
  console.log('='.repeat(70));
  console.log();

  // Required Twitter credentials
  const requiredTwitterCreds = [
    'BWSXAI_TWITTER_API_KEY',
    'BWSXAI_TWITTER_API_SECRET',
    'BWSXAI_TWITTER_ACCESS_TOKEN',
    'BWSXAI_TWITTER_ACCESS_SECRET'
  ];

  let allPresent = true;
  for (const cred of requiredTwitterCreds) {
    const present = credInfo[cred].present;
    console.log(`${present ? '✅' : '❌'} ${cred}`);
    if (!present) allPresent = false;
  }
  console.log();

  // Oxylabs credentials (optional but recommended for CI)
  const oxylabsPresent = credInfo.OXYLABS_USERNAME.present && credInfo.OXYLABS_PASSWORD.present;
  console.log(`${oxylabsPresent ? '✅' : '⚠️ '} Oxylabs Proxy Credentials`);
  if (isCI && !oxylabsPresent) {
    console.log('   ⚠️  Recommended for CI environment');
  }
  console.log();

  console.log('='.repeat(70));
  console.log('🔍 INSTRUCTIONS FOR COMPARISON');
  console.log('='.repeat(70));
  console.log();
  console.log('To verify credentials match between local and CI:');
  console.log();
  console.log('1. Run this script locally:');
  console.log('   node scripts/test-secret-values.js > local-hashes.txt');
  console.log();
  console.log('2. Run this script in CI (via GitHub Actions)');
  console.log();
  console.log('3. Compare the hash values:');
  console.log('   - If hashes MATCH → credentials are identical ✅');
  console.log('   - If hashes DIFFER → credentials are different ❌');
  console.log();
  console.log('4. Common issues if hashes differ:');
  console.log('   - Extra spaces in GitHub Secrets');
  console.log('   - Line breaks in values');
  console.log('   - Copy/paste errors');
  console.log('   - Wrong secret name');
  console.log('   - Old tokens not updated');
  console.log();

  console.log('='.repeat(70));
  console.log('🎯 COMPARISON READY');
  console.log('='.repeat(70));
  console.log();
  console.log('Environment: ' + (isCI ? 'CI (GitHub Actions)' : 'Local'));
  console.log();

  if (isCI) {
    console.log('✅ Running in CI - these are the GitHub Secret values');
  } else {
    console.log('✅ Running locally - these are the .env file values');
  }
  console.log();

  console.log('Copy the hashes above to compare with the other environment.');
  console.log();

  // JSON output for easier comparison
  console.log('='.repeat(70));
  console.log('📋 JSON FORMAT (for programmatic comparison):');
  console.log('='.repeat(70));
  console.log();

  const output = {
    environment: isCI ? 'ci' : 'local',
    timestamp: new Date().toISOString(),
    credentials: {}
  };

  for (const [key, info] of Object.entries(credInfo)) {
    output.credentials[key] = {
      present: info.present,
      hash: info.hash,
      length: info.length
    };
  }

  console.log(JSON.stringify(output, null, 2));
  console.log();

  console.log('='.repeat(70));

  if (!allPresent) {
    console.log('❌ PHASE 5 TEST FAILED: Missing required credentials');
    process.exit(1);
  } else {
    console.log('✅ PHASE 5 TEST PASSED: All credentials present');
    console.log();
    console.log('   Note: This test only verifies presence, not correctness.');
    console.log('   Compare hashes between local and CI to verify they match.');
    process.exit(0);
  }
}

// Run test
testSecretValues().catch(error => {
  console.error('\n💥 Unhandled error in test:', error);
  process.exit(1);
});
