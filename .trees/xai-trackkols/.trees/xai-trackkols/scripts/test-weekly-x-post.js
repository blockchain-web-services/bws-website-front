#!/usr/bin/env node

/**
 * Test script for weekly X post generation
 * Fetches commits from bws-api-telegram-xbot prod branch (last 2 weeks)
 * and generates X post content using Anthropic API
 */

import { Octokit } from '@octokit/rest';
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
const DAYS_TO_FETCH = 14; // Last 2 weeks
const REPOS_CONFIG_PATH = path.join(__dirname, 'data', 'repos-to-track.json');

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
 * Fetch commits from GitHub repo
 */
async function fetchCommits(config) {
  console.log(`\n🔍 Fetching commits from ${config.owner}/${config.repo}...`);
  console.log(`   Branch: ${config.branch}`);
  console.log(`   Period: Last ${DAYS_TO_FETCH} days`);

  // Try to get token from GH_TOKEN env var first (from gh auth token), fallback to GITHUB_TOKEN
  const githubToken = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';

  if (!githubToken) {
    console.log('   ⚠️  No GitHub token found, trying without authentication...');
  }

  const octokit = new Octokit({ auth: githubToken });

  // Calculate date range
  const since = new Date();
  since.setDate(since.getDate() - DAYS_TO_FETCH);

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

RULES:
- NO character limit - be comprehensive
- List ALL significant changes by product
- Use bullet points (•) for update lists
- Be specific with technical terms
- Include product description for EACH product
- Include docs link for EACH product
- End with $BWS cashtag and hashtags

EXAMPLE FORMAT:
"BWS | Coding

This week we deployed 76 updates to X Bot in production, delivering major improvements to crypto purchase flows, MetaMask wallet integration, and comprehensive platform documentation.

[X Bot]
• Admin private notification system for credit exhaustion
• MetaMask transaction cancellation error feedback
• DM purchase privacy - messages route to private chat
• ETH payment confirmation visibility until blockchain confirms
• Chat-specific tag leaderboard filtering
• Cashtag validation with enforced AND logic
• AWS SDK v3 compatibility with JavaScript Set
• DynamoDB StringSet fix for CHAT_IDS
• IAM policy simplification to fix size limit
• CodePipeline and CodeBuild read permissions
• Comprehensive documentation published

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
  console.log('🚀 Testing Weekly X Post Generation');
  console.log('═'.repeat(60));

  // Load configuration
  const docsIndex = loadDocsIndex();
  const repos = loadReposConfig();

  if (repos.length === 0) {
    console.error('\n❌ No repositories configured in repos-to-track.json');
    process.exit(1);
  }

  console.log(`\n📦 Test Configuration:`);
  console.log(`   Repositories: ${repos.length}`);
  console.log(`   Period: Last ${DAYS_TO_FETCH} days\n`);

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

      // Fetch commits for this repo
      const commits = await fetchCommits(repo);

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

    if (productsData.length === 0) {
      console.log('\nℹ️  No commits found across all repositories. Exiting.');
      return;
    }

    console.log(`\n${'═'.repeat(60)}`);
    console.log(`\n📊 Summary:`);
    console.log(`   Products with updates: ${productsData.length}`);
    console.log(`   Total commits: ${productsData.reduce((sum, p) => sum + p.commits.length, 0)}`);

    // Generate X post with all products
    const xPost = await generateXPost(productsData);

    console.log('\n✨ Test completed successfully!');

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
