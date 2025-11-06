#!/usr/bin/env node
/**
 * Quick Cookie Saver
 * Paste cookies from browser DevTools and save them
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COOKIE_FILE = path.join(__dirname, 'config/x-cookies.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function saveCookies() {
  console.log('🍪 Quick Cookie Saver for X/Twitter\n');
  console.log('📋 Instructions:');
  console.log('   1. Open x.com in Chrome (logged in)');
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

  // Save cookie data
  const cookieData = {
    capturedAt: new Date().toISOString(),
    scrapflyFormat: cookieString.trim(),
    cookieCount: cookies.length,
    method: 'manual_devtools',
    essentialCookies: {
      auth_token: cookieMap.auth_token ? '✓' : '✗',
      ct0: cookieMap.ct0 ? '✓' : '✗',
      guest_id: cookieMap.guest_id ? '✓' : '✗',
    }
  };

  await fs.writeFile(COOKIE_FILE, JSON.stringify(cookieData, null, 2));

  console.log(`\n✅ Cookies saved to: ${COOKIE_FILE}`);
  console.log(`   Total cookies: ${cookies.length}`);
  console.log(`\n🔑 Essential cookies:`);
  console.log(`   auth_token: ${cookieData.essentialCookies.auth_token}`);
  console.log(`   ct0: ${cookieData.essentialCookies.ct0}`);
  console.log(`   guest_id: ${cookieData.essentialCookies.guest_id}`);

  console.log('\n🧪 Test your cookies with:');
  console.log('   node scripts/kols/test-scrapfly-auth.js\n');

  rl.close();
  process.exit(0);
}

saveCookies().catch((error) => {
  console.error('\n❌ Error:', error.message);
  rl.close();
  process.exit(1);
});
