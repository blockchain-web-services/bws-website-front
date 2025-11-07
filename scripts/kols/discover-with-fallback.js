/**
 * Unified KOL Discovery
 * Uses Crawlee directly (ScrapFly suppressed - cheaper and more flexible)
 */

// Load environment variables from .env file (local dev only, GitHub Actions uses secrets)
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __scriptsDir = path.dirname(__filename);
const worktreeRoot = path.resolve(__scriptsDir, '../..');
dotenv.config({ path: path.join(worktreeRoot, '.env') });

import { discover as discoverScrapfly } from './discover-by-search-scrapfly.js';
import { sendDiscoveryNotification } from './utils/zapier-webhook.js';
import fs from 'fs/promises';
import { spawn } from 'child_process';

const __dirname = __scriptsDir;
const PROCESSED_POSTS_PATH = path.join(__dirname, 'data/processed-posts.json');

/**
 * Run Crawlee discovery
 */
async function runCrawleeDiscovery() {
  console.log('\n🔄 Running Crawlee discovery...\n');

  return new Promise((resolve, reject) => {
    // Run discover-by-engagement-crawlee.js
    const crawleeScript = path.join(__dirname, 'discover-by-engagement-crawlee.js');

    const child = spawn('node', [crawleeScript], {
      stdio: 'inherit',
      cwd: __dirname,
      env: process.env,  // Explicitly pass environment variables to child
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ Crawlee discovery completed successfully');
        resolve({ method: 'crawlee', success: true });
      } else {
        console.error('\n❌ Crawlee discovery also failed');
        reject(new Error(`Crawlee discovery failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      console.error('\n❌ Failed to start Crawlee discovery:', error);
      reject(error);
    });
  });
}

/**
 * Get ScrapFly status
 */
async function getScrapFlyStatus() {
  try {
    const data = JSON.parse(await fs.readFile(PROCESSED_POSTS_PATH, 'utf-8'));
    return data.scrapflyStatus || { enabled: true, fallbackActive: false };
  } catch {
    return { enabled: true, fallbackActive: false };
  }
}

/**
 * Main discovery function
 */
async function discoverWithFallback() {
  console.log('🚀 Starting KOL Discovery (Crawlee)');
  console.log(`📍 Script: discover-with-fallback.js\n`);

  const startTime = Date.now();
  let method = 'scrapfly';
  let success = false;
  let stats = null;
  let error = null;
  let currentPhase = 'initialization';

  // ScrapFly is now suppressed - use Crawlee directly (cheaper and more flexible)
  console.log('🔍 Using Crawlee discovery (ScrapFly suppressed)');
  console.log('   ✓ Free (no API costs)');
  console.log('   ✓ Authenticated with cookies');
  console.log('   ✓ Proxy support on CI environments\n');

  method = 'crawlee';
  currentPhase = 'crawlee_discovery';

  try {
    await runCrawleeDiscovery();
    success = true;
  } catch (err) {
    console.error(`\n❌ Crawlee discovery failed in phase: ${currentPhase}`);
    console.error(`   Error: ${err.message}`);
    if (err.stack) {
      console.error(`   Stack: ${err.stack.substring(0, 200)}`);
    }
    error = err;
  }

  // Calculate duration
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  // Send Zapier notification
  try {
    const notificationData = {
      success: success,
      method: method,
      duration: duration,
      stats: stats || {},
      error: error ? error.message : null,
      timestamp: new Date().toISOString(),
    };

    // Load KOL data for counts
    let totalKOLs = 0;
    let newKOLs = stats?.kolsFound || 0;
    try {
      const kolsData = JSON.parse(await fs.readFile(path.join(__dirname, 'data/kols-data.json'), 'utf-8'));
      totalKOLs = kolsData.length || 0;
    } catch {
      // Ignore
    }

    // Load engaging posts for counts
    let totalPosts = 0;
    let newPosts = stats?.engagingPostsFound || 0;
    try {
      const postsData = JSON.parse(await fs.readFile(path.join(__dirname, 'data/engaging-posts.json'), 'utf-8'));
      totalPosts = postsData.posts?.length || 0;
    } catch {
      // Ignore
    }

    await sendDiscoveryNotification({
      scriptName: 'KOL Discovery - Crawlee',
      success: success,
      queriesExecuted: stats?.queriesExecuted || 0,
      tweetsFound: stats?.tweetsFound || 0,
      kolsAdded: newKOLs,
      totalKOLs: totalKOLs,
      engagingPostsFound: newPosts,
      totalPosts: totalPosts,
      method: method,
      duration: duration,
      apiCalls: {
        total: stats?.queriesExecuted || 0,
        successful: success ? (stats?.queriesExecuted || 0) - (stats?.errors || 0) : 0,
        failed: stats?.errors || (success ? 0 : 1),
      },
      error: error ? {
        message: error.message,
        phase: currentPhase,
        stack: error.stack ? error.stack.substring(0, 500) : null,
      } : null,
    });

  } catch (notificationError) {
    console.error('Failed to send notification:', notificationError.message);
  }

  // Print summary
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Discovery Summary`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Method: ${method}`);
  console.log(`Success: ${success ? 'Yes ✅' : 'No ❌'}`);
  console.log(`Duration: ${duration}s`);
  if (stats) {
    console.log(`Queries: ${stats.queriesExecuted}`);
    console.log(`Tweets found: ${stats.tweetsFound}`);
    console.log(`New KOLs: ${stats.kolsFound || 0}`);
    console.log(`New posts: ${stats.engagingPostsFound || 0}`);
  }
  if (error) {
    console.log(`Error: ${error.message}`);
  }
  console.log(`${'='.repeat(60)}\n`);

  if (!success) {
    throw new Error(`All discovery methods failed. Last error: ${error?.message}`);
  }

  return { method, success, stats, duration };
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  discoverWithFallback()
    .then((result) => {
      console.log('✅ Discovery completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fatal error:', error.message);
      process.exit(1);
    });
}

export default discoverWithFallback;
