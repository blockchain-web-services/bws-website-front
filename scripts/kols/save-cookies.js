#!/usr/bin/env node
/**
 * Cookie Updater for Crawler Accounts
 * Updates cookies in x-crawler-accounts.json
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ACCOUNTS_FILE = path.join(__dirname, 'config/x-crawler-accounts.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function saveCookies() {
  console.log('🍪 Cookie Updater for X/Twitter Crawler Accounts\n');

  // Load current accounts
  let accountsConfig;
  try {
    const fileContent = await fs.readFile(ACCOUNTS_FILE, 'utf-8');
    accountsConfig = JSON.parse(fileContent);
  } catch (error) {
    console.error(`❌ Failed to load ${ACCOUNTS_FILE}`);
    console.error(`   Error: ${error.message}`);
    process.exit(1);
  }

  // Show available accounts
  console.log('📋 Available accounts:\n');
  accountsConfig.accounts.forEach((acc, index) => {
    const cookieStatus = acc.cookies ? '🍪 Has cookies' : '❌ No cookies';
    console.log(`   ${index + 1}. @${acc.username} (${acc.id}) - ${cookieStatus}`);
  });

  console.log('\n');
  const accountChoice = await question('Which account to update? (enter number): ');
  const accountIndex = parseInt(accountChoice) - 1;

  if (accountIndex < 0 || accountIndex >= accountsConfig.accounts.length) {
    console.error('❌ Invalid account number!');
    process.exit(1);
  }

  const selectedAccount = accountsConfig.accounts[accountIndex];
  console.log(`\n✓ Selected: @${selectedAccount.username}\n`);

  console.log('📋 Instructions:');
  console.log(`   1. Open x.com in Chrome (logged in as @${selectedAccount.username})`);
  console.log('   2. Press F12 → Console tab');
  console.log('   3. Type: document.cookie');
  console.log('   4. Copy the entire output (it\'s one long string)');
  console.log('   5. Paste it below\n');

  const cookieString = await question('Paste your cookies here: ');

  if (!cookieString || cookieString.length < 50) {
    console.error('\n❌ Cookie string seems too short. Make sure you copied everything!');
    process.exit(1);
  }

  // Parse and validate cookies
  const cookies = cookieString.split(';').map(c => c.trim());
  const cookieMap = {};
  cookies.forEach(cookie => {
    const [name, ...valueParts] = cookie.split('=');
    cookieMap[name.trim()] = valueParts.join('=');
  });

  // Check for essential cookies
  const essential = ['auth_token', 'ct0'];
  const missing = essential.filter(name => !cookieMap[name]);

  if (missing.length > 0) {
    console.warn(`\n⚠️  Warning: Missing essential cookies: ${missing.join(', ')}`);
    console.warn('   Authentication may not work properly.\n');

    const proceed = await question('Continue anyway? (y/n): ');
    if (proceed.toLowerCase() !== 'y') {
      console.log('Aborted.');
      process.exit(0);
    }
  }

  // Update account cookies
  selectedAccount.cookies = {
    auth_token: cookieMap.auth_token || '',
    ct0: cookieMap.ct0 || '',
    guest_id: cookieMap.guest_id || cookieMap.guest_id_marketing || cookieMap.guest_id_ads || ''
  };

  // Save updated config
  await fs.writeFile(ACCOUNTS_FILE, JSON.stringify(accountsConfig, null, 2));

  console.log(`\n✅ Cookies updated for @${selectedAccount.username}`);
  console.log(`   File: ${ACCOUNTS_FILE}`);
  console.log(`\n🔑 Essential cookies:`);
  console.log(`   auth_token: ${selectedAccount.cookies.auth_token ? '✓ Present' : '✗ Missing'}`);
  console.log(`   ct0: ${selectedAccount.cookies.ct0 ? '✓ Present' : '✗ Missing'}`);
  console.log(`   guest_id: ${selectedAccount.cookies.guest_id ? '✓ Present' : '✗ Missing'}`);

  console.log('\n🧪 Test your cookies with:');
  console.log('   node scripts/kols/discover-with-fallback.js\n');

  rl.close();
  process.exit(0);
}

saveCookies().catch((error) => {
  console.error('\n❌ Error:', error.message);
  rl.close();
  process.exit(1);
});
