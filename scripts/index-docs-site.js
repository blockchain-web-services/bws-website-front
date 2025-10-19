#!/usr/bin/env node

/**
 * Index BWS Documentation Site
 *
 * Crawls docs.bws.ninja, generates AI summaries for each page using Claude,
 * and creates a searchable index for intelligent article generation.
 *
 * Run manually: node scripts/index-docs-site.js
 * Runs automatically: Weekly via GitHub Actions
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DOCS_BASE_URL = 'https://docs.bws.ninja';
const INDEX_FILE_PATH = path.join(__dirname, 'data', 'docs-index.json');
const BATCH_SIZE = 10; // Process 10 pages at a time for Claude
const MAX_CONTENT_LENGTH = 2000; // Max chars to send to Claude per page

// Known documentation paths (comprehensive list from site navigation)
const KNOWN_PATHS = [
  // Main pages
  '/',
  '/quick-start',
  '/platform-fees',
  '/api-how-tos',
  '/certificate-of-trust',
  '/media-assets',

  // Platform APIs - BWS.IPFS.Upload
  '/solutions/bws.ipfs.upload',
  '/solutions/bws.ipfs.upload/solution-overview',
  '/solutions/bws.ipfs.upload/operations',

  // Platform APIs - BWS.Blockchain.Save
  '/solutions/bws.blockchain.save',
  '/solutions/bws.blockchain.save/solution-overview',
  '/solutions/bws.blockchain.save/operations',

  // Platform APIs - BWS.Blockchain.Hash
  '/solutions/bws.blockchain.hash',
  '/solutions/bws.blockchain.hash/solution-overview',
  '/solutions/bws.blockchain.hash/operations',

  // Platform APIs - BWS.NFT.zK
  '/solutions/bws.nft.zk',
  '/solutions/bws.nft.zk/solution-overview',
  '/solutions/bws.nft.zk/operations',
  '/solutions/bws.nft.zk/nft-attributes-traits',

  // API How-Tos
  '/api-how-tos/api-endpoint',
  '/api-how-tos/authentication',
  '/api-how-tos/authentication/get-your-api-key',
  '/api-how-tos/main-api-methods',
  '/api-how-tos/main-api-methods/call-api-method',
  '/api-how-tos/main-api-methods/fetch-api-method',
  '/api-how-tos/api-responses',
  '/api-how-tos/api-responses/error-status-codes',

  // Media Assets
  '/media-assets/bws-logo',
  '/media-assets/snapshots',
  '/media-assets/snapshots/bws.ipfs.upload',

  // Marketplace Solutions - Blockchain Badges
  '/marketplace-solutions/bws.blockchain.badges',
  '/marketplace-solutions/bws.blockchain.badges/badges-user-interface',

  // Marketplace Solutions - ESG Credits
  '/marketplace-solutions/bws.esg.credits',

  // Marketplace Solutions - NFT Game Cube
  '/marketplace-solutions/bws.nft.gamecube',

  // Telegram Bots
  '/telegram-bots/x-bot'
];

/**
 * Fetch page content from URL
 */
function fetchPageContent(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${url}`));
        return;
      }

      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        resolve(data);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Extract text content and title from HTML
 */
function extractPageData(html, url) {
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Untitled';

  // Remove script tags, style tags, and HTML comments
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  // Extract text from body
  const bodyMatch = text.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    text = bodyMatch[1];
  }

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ');

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Clean up whitespace
  text = text
    .replace(/\s+/g, ' ')
    .trim();

  // Truncate to max length
  if (text.length > MAX_CONTENT_LENGTH) {
    text = text.substring(0, MAX_CONTENT_LENGTH) + '...';
  }

  return {
    title,
    content: text,
    contentLength: text.length,
    url
  };
}

/**
 * Fetch all documentation pages
 */
async function fetchAllPages() {
  console.log(`📥 Fetching ${KNOWN_PATHS.length} documentation pages...`);

  const pages = [];
  let successCount = 0;
  let failCount = 0;

  for (const urlPath of KNOWN_PATHS) {
    const fullUrl = `${DOCS_BASE_URL}${urlPath}`;

    try {
      console.log(`   Fetching: ${urlPath}`);
      const html = await fetchPageContent(fullUrl);
      const pageData = extractPageData(html, fullUrl);

      pages.push({
        url: fullUrl,
        path: urlPath,
        title: pageData.title,
        content: pageData.content,
        contentLength: pageData.contentLength
      });

      successCount++;
    } catch (error) {
      console.error(`   ❌ Failed to fetch ${urlPath}: ${error.message}`);
      failCount++;
    }

    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`✅ Fetched ${successCount} pages successfully`);
  if (failCount > 0) {
    console.log(`⚠️  Failed to fetch ${failCount} pages`);
  }

  return pages;
}

/**
 * Generate summaries for pages using Claude
 */
async function generatePageSummaries(pages) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required');
  }

  console.log(`\n🤖 Generating AI summaries for ${pages.length} pages...`);

  const anthropic = new Anthropic({ apiKey });
  const summarizedPages = [];

  // Process in batches
  for (let i = 0; i < pages.length; i += BATCH_SIZE) {
    const batch = pages.slice(i, i + BATCH_SIZE);
    console.log(`   Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(pages.length / BATCH_SIZE)} (${batch.length} pages)...`);

    const prompt = `You are analyzing documentation pages from docs.bws.ninja (Blockchain Web Services API documentation).

For each page below, generate:

1. **Product Name**: Which BWS product this page documents. Choose from:
   - "X Bot" (Telegram bot for community management)
   - "Blockchain Badges" (Digital credentials on blockchain)
   - "ESG Credits" (Environmental impact reporting)
   - "Fan Game Cube" (NFT-based fan engagement)
   - "BWS IPFS" (IPFS file upload service)
   - "Blockchain Save" (Immutable blockchain data storage)
   - "Blockchain Hash" (Mutable blockchain data storage)
   - "NFT.zK" (Zero-knowledge NFT creation)
   - "General Documentation" (if not product-specific)

2. **Category**: Choose one:
   - "Platform API" (core API services)
   - "Marketplace Solution" (marketplace products)
   - "Guide" (how-to, tutorial, getting started)
   - "Reference" (API reference, specifications)
   - "Media" (logos, images, brand assets)

3. **Summary**: Write 2-3 sentences (40-60 words) describing what this page covers. Be specific and informative.

4. **Keywords**: List 5-8 relevant search terms (lowercase, comma-separated)

5. **Code Examples**: Extract 0-3 code examples from the page content. For each code snippet:
   - Identify the language (curl, javascript, json, etc.)
   - Extract the complete code (curl commands, API calls, JSON examples)
   - Provide a brief description of what the code does
   If no code examples exist, use empty array []

6. **Use Cases**: List 3-5 real-world use cases or applications mentioned on this page.
   Examples: "Save patient medical records to blockchain", "Upload NFT images to IPFS", "Track ESG carbon credits"
   If no use cases are clear, provide general applications based on the product

7. **Implementation Steps**: Extract step-by-step instructions if present on the page.
   Each step should have a title and description. Limit to 3-5 key steps.
   If no clear steps exist, leave empty array []

Pages to analyze:
${batch.map((page, idx) => `
Page ${idx + 1}:
URL: ${page.url}
Title: ${page.title}
Content excerpt: ${page.content}
`).join('\n')}

Output ONLY a JSON array with exactly ${batch.length} objects, one for each page in order:
[
  {
    "product": "product name from list above",
    "category": "category from list above",
    "summary": "2-3 sentence description",
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
    "codeExamples": [
      {
        "language": "curl",
        "code": "curl command here",
        "description": "What this code does"
      }
    ],
    "useCases": ["use case 1", "use case 2", "use case 3"],
    "implementationSteps": [
      {
        "title": "Step title",
        "description": "Step description"
      }
    ]
  }
]`;

    try {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 8000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const responseText = message.content[0].text.trim();

      // Extract JSON from response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Could not parse JSON response from Claude');
      }

      const summaries = JSON.parse(jsonMatch[0]);

      if (summaries.length !== batch.length) {
        console.warn(`   ⚠️  Expected ${batch.length} summaries, got ${summaries.length}`);
      }

      // Merge summaries with page data
      batch.forEach((page, idx) => {
        if (summaries[idx]) {
          summarizedPages.push({
            url: page.url,
            path: page.path,
            title: page.title,
            product: summaries[idx].product,
            category: summaries[idx].category,
            summary: summaries[idx].summary,
            keywords: summaries[idx].keywords || [],
            codeExamples: summaries[idx].codeExamples || [],
            useCases: summaries[idx].useCases || [],
            implementationSteps: summaries[idx].implementationSteps || [],
            contentLength: page.contentLength,
            lastIndexed: new Date().toISOString()
          });
        }
      });

      console.log(`   ✅ Processed batch ${Math.floor(i / BATCH_SIZE) + 1}`);

    } catch (error) {
      console.error(`   ❌ Claude API error for batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`);

      // Add pages without summaries (fallback)
      batch.forEach(page => {
        summarizedPages.push({
          url: page.url,
          path: page.path,
          title: page.title,
          product: 'General Documentation',
          category: 'Reference',
          summary: page.title,
          keywords: [],
          codeExamples: [],
          useCases: [],
          implementationSteps: [],
          contentLength: page.contentLength,
          lastIndexed: new Date().toISOString()
        });
      });
    }

    // Small delay between batches
    if (i + BATCH_SIZE < pages.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`✅ Generated summaries for ${summarizedPages.length} pages`);
  return summarizedPages;
}

/**
 * Build product-to-URL mapping
 */
function buildProductMapping(pages) {
  console.log('\n🔗 Building product-to-URL mappings...');

  const mapping = {};

  pages.forEach(page => {
    if (page.product && page.product !== 'General Documentation') {
      if (!mapping[page.product]) {
        mapping[page.product] = [];
      }
      mapping[page.product].push(page.url);
    }
  });

  // Log mappings
  Object.entries(mapping).forEach(([product, urls]) => {
    console.log(`   ${product}: ${urls.length} pages`);
  });

  return mapping;
}

/**
 * Save index to JSON file
 */
function saveIndex(pages, productMapping) {
  console.log('\n💾 Saving documentation index...');

  const index = {
    lastCrawl: new Date().toISOString(),
    totalPages: pages.length,
    pages,
    productMapping
  };

  // Ensure data directory exists
  const dataDir = path.dirname(INDEX_FILE_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(INDEX_FILE_PATH, JSON.stringify(index, null, 2));
  console.log(`✅ Saved index to ${INDEX_FILE_PATH}`);
  console.log(`   Total pages: ${pages.length}`);
  console.log(`   Products mapped: ${Object.keys(productMapping).length}`);
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting documentation site indexing...');
  console.log(`📅 ${new Date().toISOString()}\n`);

  try {
    // Step 1: Fetch all pages
    const pages = await fetchAllPages();

    if (pages.length === 0) {
      throw new Error('No pages were successfully fetched');
    }

    // Step 2: Generate summaries with Claude
    const summarizedPages = await generatePageSummaries(pages);

    // Step 3: Build product mapping
    const productMapping = buildProductMapping(summarizedPages);

    // Step 4: Save to file
    saveIndex(summarizedPages, productMapping);

    console.log('\n✨ Documentation indexing completed successfully!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
