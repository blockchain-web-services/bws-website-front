#!/usr/bin/env node

/**
 * Auto-Discover BWS Documentation Pages
 *
 * Automatically discovers all documentation pages from docs.bws.ninja
 * by parsing the GitBook navigation structure. This eliminates the need
 * for manual KNOWN_PATHS updates and ensures all pages are indexed.
 *
 * Run manually: node scripts/discover-docs-pages.js
 * Runs automatically: Daily via GitHub Actions at 2 AM UTC
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DOCS_BASE_URL = 'https://docs.bws.ninja';
const OUTPUT_FILE = path.join(__dirname, 'data', 'discovered-paths.json');

/**
 * Fetch page content from URL
 */
function fetchPageContent(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirects
        return https.get(response.headers.location, (redirectResponse) => {
          let data = '';
          redirectResponse.on('data', chunk => data += chunk);
          redirectResponse.on('end', () => resolve(data));
          redirectResponse.on('error', reject);
        }).on('error', reject);
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${url}`));
        return;
      }

      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => resolve(data));
      response.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Extract all navigation links from GitBook sidebar
 */
function extractNavigationLinks(html) {
  const links = new Set();

  // Method 1: Extract from <a> tags in navigation
  // GitBook uses <a> tags with href attributes for all pages
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    let href = match[1];

    // Clean up the href
    href = href.split('#')[0]; // Remove anchors
    href = href.split('?')[0]; // Remove query params

    // Only include relative paths (documentation pages)
    if (href.startsWith('/') && !href.startsWith('//')) {
      // Skip external links and assets
      if (!href.includes('.css') && !href.includes('.js') &&
          !href.includes('.png') && !href.includes('.jpg') &&
          !href.includes('.svg') && !href.includes('.ico')) {
        links.add(href);
      }
    }
  }

  // Method 2: Look for GitBook's embedded navigation data
  // GitBook often includes navigation in <script> tags
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  while ((match = scriptRegex.exec(html)) !== null) {
    const scriptContent = match[1];

    // Look for navigation-related paths in JSON structures
    const pathMatches = scriptContent.match(/["']\/([\w\-\/\.]+)["']/g);
    if (pathMatches) {
      pathMatches.forEach(pathMatch => {
        const path = pathMatch.replace(/["']/g, '');
        if (path.startsWith('/') && !path.startsWith('//') &&
            !path.includes('.') && !path.includes('http')) {
          links.add(path);
        }
      });
    }
  }

  return Array.from(links).sort();
}

/**
 * Recursively discover child pages by following links from parent pages
 * Crawls section pages (like /media-assets, /api-how-tos) to find sub-pages
 */
async function discoverChildPages(parentPaths, baseUrl, maxDepth = 2) {
  const allPaths = new Set(parentPaths);
  const visited = new Set();
  const toVisit = [...parentPaths];

  console.log('\n🔄 Starting recursive sub-page discovery...');

  let depth = 0;
  while (toVisit.length > 0 && depth < maxDepth) {
    depth++;
    const currentBatch = [...toVisit];
    toVisit.length = 0;

    console.log(`   Level ${depth}: Checking ${currentBatch.length} pages for sub-pages...`);

    for (const pagePath of currentBatch) {
      if (visited.has(pagePath)) continue;
      visited.add(pagePath);

      try {
        const url = `${baseUrl}${pagePath}`;
        const html = await fetchPageContent(url);
        const links = extractNavigationLinks(html);

        // Find new child pages (must start with parent path)
        links.forEach(link => {
          if (!allPaths.has(link)) {
            // Check if this is a child of current page
            if (link.startsWith(pagePath + '/') ||
                (pagePath !== '/' && link.startsWith(pagePath.split('/').slice(0, -1).join('/') + '/'))) {
              allPaths.add(link);
              toVisit.push(link);
            }
          }
        });

        // Small delay to avoid overwhelming server
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.log(`   ⚠️  Could not fetch ${pagePath}: ${error.message}`);
      }
    }

    const newPaths = allPaths.size - parentPaths.length;
    if (newPaths > 0) {
      console.log(`   ✅ Level ${depth}: Found ${newPaths} new sub-pages`);
    }
  }

  const totalNewPaths = allPaths.size - parentPaths.length;
  if (totalNewPaths > 0) {
    console.log(`🎉 Recursive discovery found ${totalNewPaths} additional pages!`);
  } else {
    console.log(`✅ No additional sub-pages found`);
  }

  return Array.from(allPaths).sort();
}

/**
 * Categorize paths by section
 */
function categorizePaths(paths) {
  const categories = {
    root: [],
    'api-how-tos': [],
    'platform-apis': [],
    'marketplace-solutions': [],
    'telegram-bots': [],
    'media-assets': [],
    other: []
  };

  paths.forEach(path => {
    if (path === '/') {
      categories.root.push(path);
    } else if (path.startsWith('/api-how-tos')) {
      categories['api-how-tos'].push(path);
    } else if (path.startsWith('/solutions')) {
      categories['platform-apis'].push(path);
    } else if (path.startsWith('/marketplace-solutions')) {
      categories['marketplace-solutions'].push(path);
    } else if (path.startsWith('/telegram-bots')) {
      categories['telegram-bots'].push(path);
    } else if (path.startsWith('/media-assets')) {
      categories['media-assets'].push(path);
    } else {
      categories.other.push(path);
    }
  });

  return categories;
}

/**
 * Main discovery function
 */
async function discoverAllPaths() {
  console.log('🔍 Starting documentation page discovery...');
  console.log(`📡 Fetching: ${DOCS_BASE_URL}`);

  try {
    // Fetch main documentation page
    const html = await fetchPageContent(DOCS_BASE_URL);
    console.log(`✅ Fetched ${(html.length / 1024).toFixed(1)}KB of HTML`);

    // Extract all navigation links from main page
    const initialPaths = extractNavigationLinks(html);
    console.log(`📋 Discovered ${initialPaths.length} unique paths from main navigation`);

    // Recursively discover child pages
    const allPaths = await discoverChildPages(initialPaths, DOCS_BASE_URL);
    console.log(`📋 Total paths after recursive discovery: ${allPaths.length}`);

    // Categorize paths
    const categories = categorizePaths(allPaths);

    // Display summary
    console.log('\n📊 Paths by category:');
    Object.entries(categories).forEach(([category, categoryPaths]) => {
      if (categoryPaths.length > 0) {
        console.log(`   ${category}: ${categoryPaths.length} pages`);
      }
    });

    // Prepare output data
    const output = {
      discoveredAt: new Date().toISOString(),
      baseUrl: DOCS_BASE_URL,
      totalPaths: allPaths.length,
      paths: allPaths,
      categories: categories,
      metadata: {
        discoveryMethod: 'recursive-link-extraction',
        htmlSize: html.length,
        initialPaths: initialPaths.length,
        recursivePaths: allPaths.length - initialPaths.length,
        version: '2.0.0'
      }
    };

    // Save to file
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`\n💾 Saved discovered paths to: ${OUTPUT_FILE}`);

    // Display detailed breakdown
    console.log('\n📁 Detailed breakdown:');
    Object.entries(categories).forEach(([category, categoryPaths]) => {
      if (categoryPaths.length > 0) {
        console.log(`\n   ${category.toUpperCase()} (${categoryPaths.length}):`);
        categoryPaths.slice(0, 5).forEach(p => console.log(`     - ${p}`));
        if (categoryPaths.length > 5) {
          console.log(`     ... and ${categoryPaths.length - 5} more`);
        }
      }
    });

    console.log('\n✨ Discovery completed successfully!');
    return output;

  } catch (error) {
    console.error('\n❌ Discovery failed:', error.message);
    throw error;
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  discoverAllPaths()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { discoverAllPaths };
