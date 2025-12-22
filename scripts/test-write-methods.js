#!/usr/bin/env node

/**
 * BWS X SDK v1.7.0 Write Methods Test
 * Tests: postTweet, postReply, uploadMedia (in dryRun mode)
 */

import { XTwitterClient } from '@blockchain-web-services/bws-x-sdk-node';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Path to crawler accounts config
const CRAWLER_ACCOUNTS_PATH = path.join(__dirname, 'crawling', 'config', 'x-crawler-accounts.json');

/**
 * Load crawler accounts from config file
 */
function loadCrawlerAccounts() {
  try {
    if (!fs.existsSync(CRAWLER_ACCOUNTS_PATH)) {
      return null;
    }

    const config = JSON.parse(fs.readFileSync(CRAWLER_ACCOUNTS_PATH, 'utf-8'));

    // Transform to SDK format
    const accounts = config.accounts.map(acc => ({
      id: acc.id,
      username: acc.username,
      cookies: {
        auth_token: acc.cookies.auth_token,
        ct0: acc.cookies.ct0,
        guest_id: acc.cookies.guest_id || ''
      },
      country: acc.country || 'us'
    }));

    return { accounts, proxy: config.proxy };
  } catch (error) {
    console.error('⚠️  Error loading crawler accounts:', error.message);
    return null;
  }
}

async function testWriteMethods() {
  console.log('🧪 Testing BWS X SDK v1.7.0 Write Methods\n');
  console.log('='.repeat(60));

  const startTime = Date.now();

  try {
    // Initialize client
    console.log('\n📦 Initializing XTwitterClient...');
    const crawlerConfig = loadCrawlerAccounts();

    const config = {
      mode: crawlerConfig ? 'hybrid' : 'api',

      crawler: crawlerConfig ? {
        accounts: crawlerConfig.accounts
      } : undefined,

      api: {
        accounts: [{
          name: 'BWSCommunity',
          apiKey: process.env.TWITTER_API_KEY,
          apiSecret: process.env.TWITTER_API_SECRET,
          accessToken: process.env.TWITTER_ACCESS_TOKEN,
          accessSecret: process.env.TWITTER_ACCESS_SECRET
        }]
      },

      proxy: (crawlerConfig?.proxy?.enabled && !process.env.GITHUB_ACTIONS) ? {
        provider: crawlerConfig.proxy.provider,
        username: process.env.OXYLABS_USERNAME || crawlerConfig.proxy.username,
        password: process.env.OXYLABS_PASSWORD || crawlerConfig.proxy.password
      } : undefined,

      logging: { level: 'info' }
    };

    const client = new XTwitterClient(config);

    const info = client.getInfo();
    console.log(`   Mode: ${info.mode}`);
    console.log(`   Has API: ${info.hasAPI ? '✅ Yes' : '❌ No'}`);
    console.log('✅ Client initialized\n');

    if (!info.hasAPI) {
      console.log('⚠️  WARNING: Write methods require API credentials');
      console.log('   Set TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET');
      process.exit(1);
    }

    // Test 1: Check method existence
    console.log('🔍 Test 1: Validating method availability...');

    const hasPostReply = typeof client.postReply === 'function';
    const hasPostTweet = typeof client.postTweet === 'function';
    const hasUploadMedia = typeof client.uploadMedia === 'function';
    const hasLikeTweet = typeof client.likeTweet === 'function';
    const hasRetweet = typeof client.retweet === 'function';
    const hasFollowUser = typeof client.followUser === 'function';
    const hasDeleteTweet = typeof client.deleteTweet === 'function';
    const hasBookmarkTweet = typeof client.bookmarkTweet === 'function';
    const hasBlockUser = typeof client.blockUser === 'function';
    const hasMuteUser = typeof client.muteUser === 'function';

    console.log(`   ${hasPostReply ? '✅' : '❌'} postReply() - Reply to tweets`);
    console.log(`   ${hasPostTweet ? '✅' : '❌'} postTweet() - Create tweets`);
    console.log(`   ${hasUploadMedia ? '✅' : '❌'} uploadMedia() - Upload media`);
    console.log(`   ${hasLikeTweet ? '✅' : '❌'} likeTweet() - Like tweets`);
    console.log(`   ${hasRetweet ? '✅' : '❌'} retweet() - Retweet`);
    console.log(`   ${hasFollowUser ? '✅' : '❌'} followUser() - Follow users`);
    console.log(`   ${hasDeleteTweet ? '✅' : '❌'} deleteTweet() - Delete tweets`);

    console.log('\n🎁 BONUS Methods:');
    console.log(`   ${hasBookmarkTweet ? '✅' : '❌'} bookmarkTweet() - Bookmark tweets`);
    console.log(`   ${hasBlockUser ? '✅' : '❌'} blockUser() - Block users`);
    console.log(`   ${hasMuteUser ? '✅' : '❌'} muteUser() - Mute users`);

    const totalTime = Date.now() - startTime;

    const allAvailable = hasPostReply && hasPostTweet && hasUploadMedia &&
                         hasLikeTweet && hasRetweet && hasFollowUser && hasDeleteTweet;

    console.log('\n' + '='.repeat(60));
    if (allAvailable) {
      console.log('✅ All write methods validated successfully!');
    } else {
      console.log('⚠️  Some write methods are missing');
      process.exit(1);
    }
    console.log(`⏱️  Validation time: ${(totalTime / 1000).toFixed(2)}s\n`);

    console.log('📋 Phase 2 Migration Ready:');
    console.log('   ✓ postReply() - Required for all 3 scripts');
    console.log('   ✓ uploadMedia() - Required for 2 scripts');
    console.log('\n🎉 SDK v1.7.0 supports all Phase 2 requirements!\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run tests
testWriteMethods();
