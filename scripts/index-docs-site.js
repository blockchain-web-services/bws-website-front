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
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from worktree root
const worktreeRoot = path.join(__dirname, '..');
dotenv.config({ path: path.join(worktreeRoot, '.env') });

// Configuration
const DOCS_BASE_URL = 'https://docs.bws.ninja';
const INDEX_FILE_PATH = path.join(__dirname, 'data', 'docs-index.json');
const DOCS_IMAGES_DIR = path.join(__dirname, '..', 'public', 'assets', 'images', 'docs');
const BATCH_SIZE = 10; // Process 10 pages at a time for Claude
const MAX_CONTENT_LENGTH = 10000; // Increased from 2000 - more content for better AI analysis

// Fallback paths (used if discovered-paths.json doesn't exist)
const FALLBACK_PATHS = [
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
 * Load documentation paths from discovered-paths.json or use fallback
 */
function loadDocumentationPaths() {
  const discoveredFile = path.join(__dirname, 'data', 'discovered-paths.json');

  if (fs.existsSync(discoveredFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(discoveredFile, 'utf8'));
      console.log(`📋 Loaded ${data.paths.length} paths from auto-discovery (${data.discoveredAt})`);
      return data.paths;
    } catch (error) {
      console.warn(`⚠️  Error loading discovered paths: ${error.message}`);
      console.log(`   Using fallback paths instead (${FALLBACK_PATHS.length} pages)`);
      return FALLBACK_PATHS;
    }
  } else {
    console.log(`📋 No discovered-paths.json found, using fallback (${FALLBACK_PATHS.length} pages)`);
    console.log(`   💡 Run 'node scripts/discover-docs-pages.js' to auto-discover all pages`);
    return FALLBACK_PATHS;
  }
}

// Load paths at startup
const KNOWN_PATHS = loadDocumentationPaths();

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
 * Extract images from HTML
 */
function extractImages(html, baseUrl) {
  const images = [];

  // Extract <img> tags with src attribute
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    const fullMatch = match[0];
    let imgUrl = match[1];

    // Decode HTML entities in URL
    imgUrl = imgUrl.replace(/&amp;/g, '&')
                   .replace(/&lt;/g, '<')
                   .replace(/&gt;/g, '>')
                   .replace(/&quot;/g, '"')
                   .replace(/&#39;/g, "'");

    // Extract alt text if present
    const altMatch = fullMatch.match(/alt=["']([^"']*)["']/i);
    const alt = altMatch ? altMatch[1] : '';

    // For media-assets pages, we want ALL images (including those in gitbook image URLs)
    // Skip only if it's explicitly a logo/icon in the filename AND not in a gitbook URL
    const isGitbookImage = imgUrl.includes('gitbook.io') || imgUrl.includes('~gitbook/image');
    const isLogoInFilename = imgUrl.includes('/logo') || imgUrl.includes('/icon');

    // Skip logos/icons UNLESS they're in GitBook URLs (which are actual product screenshots)
    if (!isGitbookImage && (isLogoInFilename || alt.toLowerCase().includes('logo'))) {
      continue;
    }

    // Make URL absolute if needed
    let absoluteUrl = imgUrl;
    if (imgUrl.startsWith('/')) {
      const urlObj = new URL(baseUrl);
      absoluteUrl = `${urlObj.protocol}//${urlObj.host}${imgUrl}`;
    } else if (!imgUrl.startsWith('http')) {
      absoluteUrl = new URL(imgUrl, baseUrl).href;
    }

    images.push({
      url: absoluteUrl,
      alt: alt || 'Product screenshot',
      type: 'img-tag'
    });
  }

  return images;
}

/**
 * Download image from URL
 */
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        https.get(redirectUrl, (redirectResponse) => {
          if (redirectResponse.statusCode !== 200) {
            reject(new Error(`Failed after redirect: ${redirectResponse.statusCode}`));
            return;
          }

          redirectResponse.pipe(file);

          file.on('finish', () => {
            file.close();
            resolve();
          });

          file.on('error', (err) => {
            fs.unlink(filepath, () => {});
            reject(err);
          });
        }).on('error', reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${url}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });

      file.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Download images for a product
 */
async function downloadProductImages(images, productSlug) {
  if (!images || images.length === 0) {
    return [];
  }

  // Create product-specific directory
  const productDir = path.join(DOCS_IMAGES_DIR, productSlug);
  if (!fs.existsSync(productDir)) {
    fs.mkdirSync(productDir, { recursive: true });
  }

  const downloadedImages = [];

  for (let i = 0; i < images.length; i++) {
    const image = images[i];

    try {
      // Determine file extension from URL
      const urlPath = new URL(image.url).pathname;
      const ext = path.extname(urlPath) || '.png';
      const filename = `${productSlug}-${i}${ext}`;
      const filepath = path.join(productDir, filename);

      console.log(`      Downloading image ${i + 1}/${images.length}: ${filename}`);
      await downloadImage(image.url, filepath);

      downloadedImages.push({
        originalUrl: image.url,
        localPath: `/assets/images/docs/${productSlug}/${filename}`,
        alt: image.alt,
        type: image.type
      });

      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 300));

    } catch (error) {
      console.error(`      ⚠️  Failed to download image: ${error.message}`);
      // Continue with next image
    }
  }

  console.log(`      ✅ Downloaded ${downloadedImages.length}/${images.length} images`);
  return downloadedImages;
}

/**
 * Extract structured content (headings, paragraphs, lists)
 */
function extractStructuredContent(html) {
  const structure = {
    headings: [],
    paragraphs: [],
    lists: []
  };

  // Extract headings (h1, h2, h3)
  const headingRegex = /<h[123][^>]*>([^<]+)<\/h[123]>/gi;
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    const heading = match[1].trim();
    if (heading && !heading.includes('BWS') && heading.length > 2) {
      structure.headings.push(heading);
    }
  }

  // Extract paragraphs
  const pRegex = /<p[^>]*>([^<]+)<\/p>/gi;
  while ((match = pRegex.exec(html)) !== null) {
    const paragraph = match[1].trim();
    if (paragraph && paragraph.length > 20) {
      structure.paragraphs.push(paragraph);
    }
  }

  // Extract list items
  const liRegex = /<li[^>]*>([^<]+)<\/li>/gi;
  while ((match = liRegex.exec(html)) !== null) {
    const listItem = match[1].trim();
    if (listItem && listItem.length > 5) {
      structure.lists.push(listItem);
    }
  }

  return structure;
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

  // Store both full and truncated content
  const fullContent = text;
  const truncatedContent = text.length > MAX_CONTENT_LENGTH
    ? text.substring(0, MAX_CONTENT_LENGTH) + '...'
    : text;

  return {
    title,
    content: truncatedContent, // For Claude prompt (length-limited)
    fullContent: fullContent,  // Complete content (no truncation)
    contentLength: fullContent.length,
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

      // Extract images from the page
      const images = extractImages(html, fullUrl);
      console.log(`     Found ${images.length} images`);

      // Extract structured content
      const structuredContent = extractStructuredContent(html);

      pages.push({
        url: fullUrl,
        path: urlPath,
        title: pageData.title,
        content: pageData.content,
        fullContent: pageData.fullContent,
        contentLength: pageData.contentLength,
        rawImages: images, // Store for later download
        structuredContent: structuredContent
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

NOTE: You now have access to FULL page content (up to 10,000 characters per page, increased from previous 2,000 limit). Use this comprehensive information to provide detailed, accurate analysis.

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
            fullContent: page.fullContent,
            structuredContent: page.structuredContent,
            rawImages: page.rawImages, // Will download later
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
          fullContent: page.fullContent,
          structuredContent: page.structuredContent,
          rawImages: page.rawImages,
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
 * Download images organized by product
 */
async function downloadImagesByProduct(pages) {
  console.log('\n📥 Downloading images organized by product...');

  // Create base docs images directory
  if (!fs.existsSync(DOCS_IMAGES_DIR)) {
    fs.mkdirSync(DOCS_IMAGES_DIR, { recursive: true });
  }

  // Group pages by product
  const pagesByProduct = {};
  pages.forEach(page => {
    if (page.product && page.product !== 'General Documentation') {
      if (!pagesByProduct[page.product]) {
        pagesByProduct[page.product] = [];
      }
      pagesByProduct[page.product].push(page);
    }
  });

  // Download images for each product
  for (const [product, productPages] of Object.entries(pagesByProduct)) {
    console.log(`\n   Processing ${product}...`);

    // Collect all images for this product
    const allImages = [];
    productPages.forEach(page => {
      if (page.rawImages && page.rawImages.length > 0) {
        allImages.push(...page.rawImages);
      }
    });

    if (allImages.length === 0) {
      console.log(`     No images found for ${product}`);
      continue;
    }

    // Create product slug for directory name
    const productSlug = product.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Download images
    const downloadedImages = await downloadProductImages(allImages, productSlug);

    // Update pages with downloaded image paths
    productPages.forEach(page => {
      page.images = downloadedImages;
      delete page.rawImages; // Remove temporary field
    });
  }

  // Clean up rawImages from all pages
  pages.forEach(page => {
    if (page.rawImages) {
      page.images = []; // No images for general docs
      delete page.rawImages;
    }
  });

  console.log(`\n✅ Image download completed`);
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

    // Step 3: Download images organized by product
    await downloadImagesByProduct(summarizedPages);

    // Step 4: Build product mapping
    const productMapping = buildProductMapping(summarizedPages);

    // Step 5: Save to file
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
