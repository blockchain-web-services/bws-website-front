#!/usr/bin/env node

/**
 * Weekly X Post Generation - Production Script
 *
 * Runs daily via GitHub Actions (14:00 UTC)
 * Posts as @BWSCommunity when criteria are met:
 * - Total items (features + fixes + improvements) >= 4
 * - Days since last post >= 5
 *
 * Extends lookback window (+7 days, max 60) when insufficient content
 */

import { Octokit } from '@octokit/rest';
import { TwitterApi } from 'twitter-api-v2';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Configuration
const REPOS_CONFIG_PATH = path.join(__dirname, 'data', 'repos-to-track.json');
const STATE_FILE_PATH = path.join(__dirname, 'data', 'weekly-x-posts-state.json');
const MIN_ITEMS = 4; // Minimum items required to post
const MIN_DAYS_BETWEEN_POSTS = 5; // Minimum days between posts
const MAX_LOOKBACK_DAYS = 60; // Maximum lookback window

/**
 * Load state file
 */
function loadState() {
  try {
    const data = fs.readFileSync(STATE_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log('ℹ️  No existing state file, creating new state');
    return {
      lastPostTimestamp: null,
      lastPostUrl: null,
      lastPostId: null,
      lookbackDays: 14,
      posts: []
    };
  }
}

/**
 * Save state file
 */
function saveState(state) {
  fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(state, null, 2));
  console.log(`💾 State saved to ${STATE_FILE_PATH}`);
}

/**
 * Load repositories configuration
 */
function loadReposConfig() {
  try {
    const data = fs.readFileSync(REPOS_CONFIG_PATH, 'utf-8');
    const config = JSON.parse(data);
    return config.repositories || [];
  } catch (error) {
    console.error('⚠️  Error loading repos config:', error.message);
    return [];
  }
}

/**
 * Load docs index for product URL mapping
 */
function loadDocsIndex() {
  try {
    const indexPath = path.join(__dirname, 'data', 'docs-index.json');
    const data = fs.readFileSync(indexPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log('⚠️  Docs index not found, using hardcoded URL');
    return { productMapping: {} };
  }
}

/**
 * Get product URL and full documentation content from docs index
 */
function getProductInfo(productName, docsIndex) {
  const urls = docsIndex.productMapping[productName] || [];
  const url = urls.length > 0 ? urls[0] : 'https://docs.bws.ninja/';

  // Find all pages related to this product and extract their content
  let fullContent = '';
  if (docsIndex.pages) {
    const productPages = docsIndex.pages.filter(page => page.product === productName);

    // Concatenate relevant content from all product pages
    productPages.forEach(page => {
      if (page.summary) fullContent += page.summary + '\n';
      if (page.fullContent) fullContent += page.fullContent.substring(0, 5000) + '\n'; // Limit to avoid too much text
    });
  }

  return { url, fullContent: fullContent.trim() };
}

/**
 * Post to Twitter/X (currently configured for @BWSXBot)
 */
async function postToTwitter(postText) {
  // Dry run mode - don't actually post
  if (process.env.DRY_RUN === 'true') {
    console.log('\n🔶 DRY RUN MODE - Not posting to X');
    console.log('─'.repeat(60));
    console.log(postText);
    console.log('─'.repeat(60));
    return {
      id: 'dry-run-' + Date.now(),
      url: 'https://x.com/status/dry-run'
    };
  }

  console.log('\n🐦 Posting to X...');

  // Initialize Twitter client with OAuth 1.0a credentials
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });

  // Verify authentication
  const me = await client.v2.me();
  console.log(`✅ Authenticated as: @${me.data.username}`);

  // Post tweet
  try {
    const tweet = await client.v2.tweet({ text: postText });
    const url = `https://x.com/${me.data.username}/status/${tweet.data.id}`;

    console.log(`✅ Posted successfully: ${url}`);

    return {
      id: tweet.data.id,
      url: url
    };
  } catch (error) {
    console.error('\n❌ Failed to post tweet:');
    console.error(`   Error code: ${error.code || error.status || 'Unknown'}`);
    console.error(`   Error message: ${error.message || 'Unknown'}`);
    if (error.data) {
      console.error(`   Error details: ${JSON.stringify(error.data, null, 2)}`);
    }
    if (error.code === 403 || error.status === 403) {
      console.error('\n⚠️  HTTP 403 Forbidden - Possible causes:');
      console.error('   1. App does not have "Read and Write" permissions');
      console.error('   2. Access tokens need to be regenerated after permission change');
      console.error('   3. Twitter API tier does not allow posting (Free tier limitation)');
      console.error('   4. Rate limit exceeded');
      console.error('\n   Check: https://developer.twitter.com/en/portal/dashboard');
    }
    throw error;
  }
}

/**
 * Classify commit type based on message
 */
function classifyCommit(message) {
  const lowerMsg = message.toLowerCase();

  // Features
  if (/(add|feature|implement|new|introduce|create)/i.test(lowerMsg)) {
    return 'FEATURE';
  }

  // Fixes
  if (/(fix|bugfix|patch|resolve|correct|repair)/i.test(lowerMsg)) {
    return 'FIX';
  }

  // Improvements
  if (/(improve|enhance|optimize|refactor|update|upgrade)/i.test(lowerMsg)) {
    return 'IMPROVEMENT';
  }

  return 'OTHER';
}

/**
 * Fetch commits from GitHub repo with dynamic lookback window
 */
async function fetchCommits(config, lookbackDays) {
  console.log(`\n🔍 Fetching commits from ${config.owner}/${config.repo}...`);
  console.log(`   Branch: ${config.branch}`);
  console.log(`   Period: Last ${lookbackDays} days`);

  // Use PAT_GITHUB_ACTIONS for cross-repo access, fallback to GITHUB_TOKEN/GH_TOKEN
  const githubToken = process.env.PAT_GITHUB_ACTIONS || process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

  if (!githubToken) {
    console.log('   ⚠️  No GitHub token found, trying without authentication...');
  }

  const octokit = new Octokit({ auth: githubToken });

  // Calculate date range using lookbackDays
  const since = new Date();
  since.setDate(since.getDate() - lookbackDays);

  console.log(`   Since: ${since.toISOString()}`);

  try {
    // Fetch commits
    const { data: commits } = await octokit.repos.listCommits({
      owner: config.owner,
      repo: config.repo,
      sha: config.branch,
      since: since.toISOString(),
      per_page: 100
    });

    console.log(`\n✅ Found ${commits.length} commits on ${config.branch} branch`);

    if (commits.length === 0) {
      console.log('ℹ️  No commits in the specified time range');
      return [];
    }

    // Process commits
    const processedCommits = commits.map(commit => {
      const message = commit.commit.message.split('\n')[0]; // First line only
      const type = classifyCommit(message);

      return {
        sha: commit.sha.substring(0, 7),
        message: message,
        type: type,
        author: commit.commit.author.name,
        date: commit.commit.author.date,
        url: commit.html_url
      };
    });

    // Group by type
    const grouped = {
      FEATURE: processedCommits.filter(c => c.type === 'FEATURE'),
      FIX: processedCommits.filter(c => c.type === 'FIX'),
      IMPROVEMENT: processedCommits.filter(c => c.type === 'IMPROVEMENT'),
      OTHER: processedCommits.filter(c => c.type === 'OTHER')
    };

    console.log('\n📊 Commit Classification:');
    console.log(`   Features: ${grouped.FEATURE.length}`);
    console.log(`   Fixes: ${grouped.FIX.length}`);
    console.log(`   Improvements: ${grouped.IMPROVEMENT.length}`);
    console.log(`   Other: ${grouped.OTHER.length}`);

    console.log('\n📋 Commits by Type:\n');

    if (grouped.FEATURE.length > 0) {
      console.log('🆕 FEATURES:');
      grouped.FEATURE.forEach(c => {
        console.log(`   [${c.sha}] ${c.message}`);
      });
      console.log('');
    }

    if (grouped.FIX.length > 0) {
      console.log('🔧 FIXES:');
      grouped.FIX.forEach(c => {
        console.log(`   [${c.sha}] ${c.message}`);
      });
      console.log('');
    }

    if (grouped.IMPROVEMENT.length > 0) {
      console.log('⚡ IMPROVEMENTS:');
      grouped.IMPROVEMENT.forEach(c => {
        console.log(`   [${c.sha}] ${c.message}`);
      });
      console.log('');
    }

    if (grouped.OTHER.length > 0) {
      console.log('📦 OTHER:');
      grouped.OTHER.forEach(c => {
        console.log(`   [${c.sha}] ${c.message}`);
      });
      console.log('');
    }

    return processedCommits;

  } catch (error) {
    if (error.status === 404) {
      console.error(`\n❌ Repository or branch not found: ${config.owner}/${config.repo}@${config.branch}`);
      console.error('   Please verify:');
      console.error('   1. Repository exists and is accessible');
      console.error('   2. Branch "prod" exists');
      console.error('   3. GITHUB_TOKEN has proper permissions');
    } else {
      console.error(`\n❌ GitHub API Error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Generate X post using Anthropic API - supports multiple products
 */
async function generateXPost(productsData) {
  console.log('\n🤖 Generating X post with Anthropic API...');

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not found in environment variables');
  }

  // Build changes summary by product
  let productsSummary = '';
  let totalChanges = 0;

  productsData.forEach(({ product, productUrl, productDocs, commits }) => {
    const features = commits.filter(c => c.type === 'FEATURE');
    const fixes = commits.filter(c => c.type === 'FIX');
    const improvements = commits.filter(c => c.type === 'IMPROVEMENT');

    totalChanges += features.length + fixes.length + improvements.length;

    productsSummary += `\n\n=== ${product} ===\n`;
    productsSummary += `Total changes: ${commits.length} (${features.length} features, ${fixes.length} fixes, ${improvements.length} improvements)\n`;
    productsSummary += `Docs: ${productUrl}\n`;

    // Include product documentation for context
    if (productDocs) {
      productsSummary += `\nPRODUCT DOCUMENTATION:\n${productDocs.substring(0, 2000)}\n`;
    }

    if (features.length > 0) {
      productsSummary += '\nFEATURES:\n';
      features.slice(0, 15).forEach(c => {
        productsSummary += `- ${c.message}\n`;
      });
    }

    if (fixes.length > 0) {
      productsSummary += '\nFIXES:\n';
      fixes.slice(0, 15).forEach(c => {
        productsSummary += `- ${c.message}\n`;
      });
    }

    if (improvements.length > 0) {
      productsSummary += '\nIMPROVEMENTS:\n';
      improvements.slice(0, 10).forEach(c => {
        productsSummary += `- ${c.message}\n`;
      });
    }
  });

  // Get primary docs URL (from first/main product)
  const primaryDocsUrl = productsData[0]?.productUrl || 'https://docs.bws.ninja/';

  const prompt = `You are creating a weekly development update post for X (Twitter) about BWS (Blockchain Web Services) production deployments.

DEPLOYMENT SUMMARY:
- Products updated: ${productsData.length}
- Total changes deployed: ${totalChanges}
${productsSummary}

Create an engaging X post with this EXACT structure:

1. TITLE (first line): "BWS | Coding"

2. OVERVIEW SENTENCE: One long sentence describing the overall accomplishments deployed this week
   Example: "This week we deployed ${totalChanges} updates across ${productsData.length} BWS products to production, focusing on payment UX improvements, wallet integration fixes, and comprehensive documentation."

3. PRODUCT SECTIONS: For EACH product, include:

   a) Product title enclosed in brackets: "[Product Name]"

   b) Bullet list (•) of 10-15 specific updates
      - Be specific: "MetaMask wallet integration", "DM purchase privacy", "ETH swap flow"
      - NOT vague: "improvements", "enhancements", "updates"

   c) Short product description sentence (1-2 lines)
      - Generate this dynamically from the PRODUCT DOCUMENTATION provided for each product
      - Make it contextual and relevant to the updates deployed this week
      - Keep it concise but informative
      Example: "X Bot is an AI-powered Telegram analytics platform providing accurate X engagement metrics to help crypto projects measure community impact and KOLs showcase their performance."

   d) Link to product documentation
      Example: "📚 https://docs.bws.ninja/telegram-bots/x-bot"

4. CASHTAG AND HASHTAGS:
   $BWS #Web3 #Blockchain #BWS

CONTENT SECURITY & QUALITY RULES (CRITICAL):

⚠️ NEVER include or mention:
- Secrets, API keys, passwords, tokens, credentials
- IAM policies, roles, permissions (specific details)
- Deployment workflows, CI/CD pipeline details
- Infrastructure configuration details
- Security implementation specifics
- Database schema or query details
- Authentication/authorization implementation details
- Low-level architecture details

✅ AWS Services: You MAY mention AWS services in general terms (e.g., "DynamoDB optimization", "S3 integration") but NEVER explain how they work internally or configuration details

🎯 SECURITY FIXES: When mentioning security-related fixes:
- Frame positively as "enhancements" or "improvements"
- Focus on user benefits, NOT the vulnerability
- Example: Instead of "Fix SQL injection vulnerability in login" → "Enhanced login security"
- Example: Instead of "Fix exposed admin endpoint" → "Improved access control"

🎨 QUALITY PERCEPTION: Reformulate commits that might create doubt about product quality:
- Avoid mentioning multiple fixes to the same feature (looks unstable)
- Group related fixes into one positive statement
- Example: Instead of listing 5 separate MetaMask fixes → "Comprehensive MetaMask integration improvements"
- Example: Instead of "Fix critical bug" → "Enhanced reliability"
- Frame all changes as deliberate improvements, not reactions to problems

💡 POSITIVE FRAMING:
- "Bug fix" → "Enhancement" or "Improvement"
- "Critical error" → "Reliability improvement"
- "Broken feature" → "Feature optimization"
- "Security vulnerability" → "Security enhancement"

GENERAL RULES:
- NO character limit - be comprehensive
- List ALL significant changes by product (after filtering/reformulating)
- Use bullet points (•) for update lists
- Be specific with technical terms (but NOT security-sensitive details)
- Include product description for EACH product
- Include docs link for EACH product
- End with $BWS cashtag and hashtags

EXAMPLE FORMAT:
"BWS | Coding

This week we deployed 76 updates to X Bot in production, delivering major improvements to crypto purchase flows, MetaMask wallet integration, and comprehensive platform documentation.

[X Bot]
• Private notification system for account monitoring
• Enhanced purchase privacy with DM routing
• MetaMask transaction flow improvements
• Payment confirmation visibility enhancements
• Chat-specific analytics filtering
• Advanced validation logic
• AWS SDK v3 compatibility upgrade
• Database optimization for chat operations
• Documentation infrastructure improvements
• Enhanced permissions management
• Comprehensive platform documentation

X Bot is an AI-powered Telegram analytics platform providing accurate X (Twitter) engagement metrics using the official X API, helping crypto projects measure community impact, KOLs showcase their performance, and investors discover authentic projects with real traction.

📚 https://docs.bws.ninja/telegram-bots/x-bot

$BWS #Web3 #Blockchain #BWS"

Output ONLY the post text, nothing else.`;

  try {
    const anthropic = new Anthropic({ apiKey });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 3000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const postText = message.content[0].text.trim();

    console.log('\n✅ Generated X Post:\n');
    console.log('─'.repeat(60));
    console.log(postText);
    console.log('─'.repeat(60));
    console.log(`\n📏 Character count: ${postText.length}`);

    // Validate required elements
    const validations = [];

    if (!postText.startsWith('BWS | Coding')) {
      validations.push('⚠️  Warning: Post does not start with "BWS | Coding" title!');
    }

    if (!postText.includes('$BWS')) {
      validations.push('⚠️  Warning: $BWS cashtag not included in post!');
    }

    const primaryUrl = productsData[0]?.productUrl || '';
    if (!postText.includes(primaryUrl) && !postText.includes('docs.bws.ninja')) {
      validations.push('⚠️  Warning: Docs URL not included in post!');
    }

    if (validations.length > 0) {
      validations.forEach(v => console.log(v));
    }

    return postText;

  } catch (error) {
    console.error(`\n❌ Anthropic API Error: ${error.message}`);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Weekly X Post Generation');
  console.log('═'.repeat(60));

  // Load state and configuration
  const state = loadState();
  const docsIndex = loadDocsIndex();
  const repos = loadReposConfig();

  if (repos.length === 0) {
    console.error('\n❌ No repositories configured in repos-to-track.json');
    process.exit(1);
  }

  // Get lookback window from state
  const lookbackDays = state.lookbackDays || 14;

  console.log(`\n📦 Configuration:`);
  console.log(`   Repositories: ${repos.length}`);
  console.log(`   Lookback window: ${lookbackDays} days`);
  if (state.lastPostTimestamp) {
    console.log(`   Last post: ${new Date(state.lastPostTimestamp).toLocaleString()}`);
    console.log(`   Last post URL: ${state.lastPostUrl}`);
  } else {
    console.log(`   Last post: Never (first run)`);
  }

  try {
    // Fetch commits from all repos
    const productsData = [];

    for (const repo of repos) {
      // Get product URL and documentation from docs index
      const productInfo = getProductInfo(repo.product, docsIndex);
      repo.productUrl = productInfo.url;
      repo.productDocs = productInfo.fullContent;

      console.log(`\n${'─'.repeat(60)}`);
      console.log(`📦 ${repo.product}`);
      console.log(`   Repository: ${repo.owner}/${repo.repo}`);
      console.log(`   Branch: ${repo.branch}`);
      console.log(`   Docs URL: ${repo.productUrl}`);

      // Fetch commits for this repo with dynamic lookback window
      const commits = await fetchCommits(repo, lookbackDays);

      if (commits.length === 0) {
        console.log('   ℹ️  No commits found for this repository');
        continue;
      }

      productsData.push({
        product: repo.product,
        productUrl: repo.productUrl,
        productDocs: repo.productDocs,
        repository: `${repo.owner}/${repo.repo}`,
        branch: repo.branch,
        commits: commits
      });
    }

    // Calculate total items (features + fixes + improvements)
    const totalItems = productsData.reduce((sum, p) => {
      const items = p.commits.filter(c =>
        c.type === 'FEATURE' || c.type === 'FIX' || c.type === 'IMPROVEMENT'
      );
      return sum + items.length;
    }, 0);

    // Calculate days since last post
    const daysSinceLastPost = state.lastPostTimestamp
      ? (Date.now() - new Date(state.lastPostTimestamp)) / (1000 * 60 * 60 * 24)
      : 999; // First post always qualifies

    console.log(`\n${'═'.repeat(60)}`);
    console.log(`\n📊 Decision Criteria:`);
    console.log(`   Total items (F+F+I): ${totalItems} (need ${MIN_ITEMS})`);
    console.log(`   Days since last post: ${daysSinceLastPost.toFixed(1)} (need ${MIN_DAYS_BETWEEN_POSTS})`);

    // DECISION LOGIC
    if (totalItems < MIN_ITEMS) {
      // Not enough content - extend lookback window
      const newLookback = Math.min(lookbackDays + 7, MAX_LOOKBACK_DAYS);
      console.log(`\n⏭️  SKIP: Not enough items (${totalItems} < ${MIN_ITEMS})`);
      console.log(`   Extending lookback window: ${lookbackDays} → ${newLookback} days`);

      state.lookbackDays = newLookback;
      saveState(state);

      console.log('\n✨ Workflow completed (no post)');
      return;
    }

    if (daysSinceLastPost < MIN_DAYS_BETWEEN_POSTS) {
      // Too soon since last post
      console.log(`\n⏭️  SKIP: Too soon since last post (${daysSinceLastPost.toFixed(1)} < ${MIN_DAYS_BETWEEN_POSTS} days)`);
      console.log('\n✨ Workflow completed (no post)');
      return;
    }

    // ✅ CRITERIA MET - GENERATE AND POST!
    console.log(`\n✅ CRITERIA MET - Proceeding with post!`);

    if (productsData.length === 0) {
      console.log('\n⚠️  No products with commits found. Exiting.');
      return;
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Products with updates: ${productsData.length}`);
    console.log(`   Total commits: ${productsData.reduce((sum, p) => sum + p.commits.length, 0)}`);

    // Generate X post with all products
    const xPost = await generateXPost(productsData);

    // Post to X (or dry run)
    const tweetResult = await postToTwitter(xPost);

    // Update state
    state.lastPostTimestamp = new Date().toISOString();
    state.lastPostUrl = tweetResult.url;
    state.lastPostId = tweetResult.id;
    state.lookbackDays = 14; // Reset to default

    // Save post record
    state.posts.push({
      timestamp: state.lastPostTimestamp,
      postId: tweetResult.id,
      url: tweetResult.url,
      repositories: productsData.map(p => ({
        repo: p.repository,
        product: p.product,
        commits: p.commits.length,
        features: p.commits.filter(c => c.type === 'FEATURE').length,
        fixes: p.commits.filter(c => c.type === 'FIX').length,
        improvements: p.commits.filter(c => c.type === 'IMPROVEMENT').length
      })),
      totalItems,
      daysSinceLastPost: Math.round(daysSinceLastPost * 10) / 10,
      lookbackDays,
      characterCount: xPost.length
    });

    // Save updated state
    saveState(state);

    console.log('\n✨ Workflow completed successfully!');

    // Save results to file for review
    const results = {
      timestamp: new Date().toISOString(),
      productsUpdated: productsData.length,
      totalCommits: productsData.reduce((sum, p) => sum + p.commits.length, 0),
      products: productsData.map(p => ({
        product: p.product,
        repository: p.repository,
        branch: p.branch,
        productUrl: p.productUrl,
        commitsCount: p.commits.length,
        commits: p.commits
      })),
      generatedPost: xPost,
      characterCount: xPost.length
    };

    const outputPath = path.join(__dirname, 'data', 'test-weekly-x-post-results.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\n💾 Results saved to: ${outputPath}`);

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
