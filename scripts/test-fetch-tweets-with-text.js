#!/usr/bin/env node

/**
 * Test script to fetch tweets and display their text
 * For account findings report
 */

import { XTwitterClient } from '@blockchain-web-services/bws-x-sdk-node';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function fetchAndDisplayTweets() {
  console.log('🔍 Fetching tweets from @BWSCommunity with hybrid mode...\n');

  try {
    // Load crawler accounts from config file
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
      proxy: crawlerConfig?.proxy?.enabled ? {
        provider: crawlerConfig.proxy.provider,
        username: process.env.OXYLABS_USERNAME || crawlerConfig.proxy.username,
        password: process.env.OXYLABS_PASSWORD || crawlerConfig.proxy.password
      } : undefined,
      logging: {
        level: 'warn'  // Reduce noise
      }
    };

    const client = new XTwitterClient(config);
    const info = client.getInfo();

    console.log(`Mode: ${info.mode}`);
    console.log(`Crawler: ${info.hasCrawler ? '✅' : '❌'}`);
    console.log(`API: ${info.hasAPI ? '✅' : '❌'}\n`);

    console.log('📥 Fetching last 20 tweets...\n');

    const tweets = await client.getUserTweets('BWSCommunity', {
      maxResults: 20,
      excludeReplies: false,
      excludeRetweets: true
    });

    console.log(`✅ Retrieved ${tweets.length} tweets\n`);
    console.log('='.repeat(80));
    console.log('\n📝 TWEETS:\n');

    tweets.forEach((tweet, index) => {
      console.log(`${index + 1}. Tweet ID: ${tweet.id}`);
      console.log(`   Author: @${tweet.author?.username || 'unknown'}`);
      console.log(`   Created: ${tweet.createdAt}`);
      console.log(`   Likes: ${tweet.metrics?.likes || 0} | Retweets: ${tweet.metrics?.retweets || 0}`);
      console.log(`   Text: ${tweet.text}`);
      console.log('   ' + '-'.repeat(76));
      console.log('');
    });

    console.log('='.repeat(80));
    console.log(`\n✅ Total: ${tweets.length} tweets displayed\n`);

    // Output JSON for easy parsing
    console.log('\n📊 JSON OUTPUT (for report):\n');
    const tweetData = tweets.map(t => ({
      id: t.id,
      author: t.author?.username || 'unknown',
      text: t.text,
      createdAt: t.createdAt,
      likes: t.metrics?.likes || 0,
      retweets: t.metrics?.retweets || 0
    }));
    console.log(JSON.stringify(tweetData, null, 2));

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

fetchAndDisplayTweets();
