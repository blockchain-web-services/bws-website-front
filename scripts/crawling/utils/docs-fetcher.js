/**
 * Documentation Fetcher
 * Fetches product documentation from docs.bws.ninja for context in educational threads
 * Caches content for 24 hours to reduce load
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_BASE_URL = 'https://docs.bws.ninja';
const CACHE_DIR = path.join(__dirname, '..', 'data', 'docs-cache');
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Ensure cache directory exists
 */
async function ensureCacheDir() {
  try {
    await fs.access(CACHE_DIR);
  } catch {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  }
}

/**
 * Get cache file path for a product
 */
function getCacheFilePath(product) {
  const sanitized = product.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return path.join(CACHE_DIR, `${sanitized}-docs.json`);
}

/**
 * Check if cached docs are still valid
 */
async function isCacheValid(cacheFile) {
  try {
    const stats = await fs.stat(cacheFile);
    const age = Date.now() - stats.mtimeMs;
    return age < CACHE_TTL;
  } catch {
    return false;
  }
}

/**
 * Load cached docs
 */
async function loadCachedDocs(product) {
  const cacheFile = getCacheFilePath(product);

  if (!(await isCacheValid(cacheFile))) {
    return null;
  }

  try {
    const data = await fs.readFile(cacheFile, 'utf-8');
    const cached = JSON.parse(data);
    console.log(`   📦 Loaded cached docs for ${product} (age: ${Math.round((Date.now() - cached.timestamp) / (60 * 60 * 1000))}h)`);
    return cached.content;
  } catch {
    return null;
  }
}

/**
 * Save docs to cache
 */
async function saveCachedDocs(product, content) {
  await ensureCacheDir();
  const cacheFile = getCacheFilePath(product);

  const cached = {
    product,
    timestamp: Date.now(),
    content
  };

  await fs.writeFile(cacheFile, JSON.stringify(cached, null, 2));
  console.log(`   💾 Cached docs for ${product}`);
}

/**
 * Fetch product documentation from docs.bws.ninja
 *
 * Note: This is a simplified version that uses the product-highlights.json
 * as the source of truth. In a production system, you might want to
 * actually scrape the docs website or use an API if available.
 */
async function fetchProductDocs(product, docsPath) {
  console.log(`\n📚 Fetching docs for ${product}...`);

  // Check cache first
  const cached = await loadCachedDocs(product);
  if (cached) {
    return cached;
  }

  console.log(`   🌐 Fetching from ${DOCS_BASE_URL}${docsPath}`);

  // For now, we'll use the product-highlights.json as our documentation source
  // This avoids the complexity of web scraping and provides structured data
  try {
    const highlightsPath = path.join(__dirname, '..', 'config', 'product-highlights.json');
    const highlightsData = await fs.readFile(highlightsPath, 'utf-8');
    const highlights = JSON.parse(highlightsData);

    const productInfo = highlights.productHighlights[product];

    if (!productInfo) {
      throw new Error(`Product "${product}" not found in highlights`);
    }

    const docsContent = {
      product,
      docsPath,
      docsUrl: `${DOCS_BASE_URL}${docsPath}`,
      features: productInfo.specificFeatures || [],
      technicalDetails: productInfo.technicalDetails || [],
      uniqueAngles: productInfo.uniqueAngles || [],
      howToSteps: extractHowToSteps(product, productInfo),
      useCases: extractUseCases(product, productInfo)
    };

    // Cache the content
    await saveCachedDocs(product, docsContent);

    console.log(`   ✅ Fetched docs for ${product}`);
    console.log(`      - Features: ${docsContent.features.length}`);
    console.log(`      - Technical details: ${docsContent.technicalDetails.length}`);
    console.log(`      - Use cases: ${docsContent.useCases.length}`);

    return docsContent;
  } catch (error) {
    console.error(`   ❌ Error fetching docs for ${product}: ${error.message}`);
    return null;
  }
}

/**
 * Extract how-to steps from product information
 */
function extractHowToSteps(product, productInfo) {
  // Product-specific how-to steps
  const howToGuides = {
    'Blockchain Badges': [
      'Connect your LMS or HR system via API',
      'Design badge templates using the visual designer',
      'Issue credentials to recipients (individual or bulk)',
      'Recipients receive verification links to share',
      'Employers can verify credentials instantly via blockchain'
    ],
    'BWS IPFS': [
      'Get your BWS API key from the dashboard',
      'Upload files via simple REST API call',
      'Receive IPFS hash (CID) for your content',
      'Access files via BWS gateway or any IPFS node',
      'Content is permanently stored on decentralized network'
    ],
    'NFT.zK': [
      'Create NFT collection via BWS dashboard',
      'Upload metadata and images to IPFS',
      'Generate claim codes or bulk mint NFTs',
      'Distribute codes to users (no wallet required)',
      'Users claim NFTs through simple web interface'
    ],
    'Blockchain Hash': [
      'Integrate BWS Blockchain Hash API',
      'Save data via single REST API call',
      'BWS handles wallet management and gas fees',
      'Update saved data anytime (mutable storage)',
      'Retrieve data via blockchain explorer or API'
    ]
  };

  return howToGuides[product] || [];
}

/**
 * Extract use cases from product information
 */
function extractUseCases(product, productInfo) {
  // Product-specific use cases
  const useCasesMap = {
    'Blockchain Badges': [
      'Universities issuing tamper-proof degrees and certificates',
      'Professional certification bodies providing verifiable credentials',
      'Companies issuing employee training certificates',
      'Event organizers issuing attendance credentials',
      'Skills platforms issuing course completion badges'
    ],
    'BWS IPFS': [
      'NFT projects storing metadata permanently',
      'dApps hosting frontend files on decentralized storage',
      'Content creators distributing censorship-resistant media',
      'Document verification systems storing file hashes',
      'Web3 platforms ensuring long-term data availability'
    ],
    'NFT.zK': [
      'Brands distributing NFT loyalty rewards to customers',
      'Event organizers issuing NFT tickets',
      'Sports teams offering digital collectibles to fans',
      'Gaming companies distributing in-game assets',
      'Membership platforms using NFTs as access passes'
    ],
    'Blockchain Hash': [
      'dApps storing user data without wallet complexity',
      'Analytics platforms saving on-chain metrics',
      'Gaming leaderboards with verifiable scores',
      'Supply chain systems tracking product data',
      'IoT systems logging device states on blockchain'
    ]
  };

  return useCasesMap[product] || [];
}

/**
 * Clear cache for a specific product or all products
 */
async function clearCache(product = null) {
  await ensureCacheDir();

  if (product) {
    const cacheFile = getCacheFilePath(product);
    try {
      await fs.unlink(cacheFile);
      console.log(`🗑️  Cleared cache for ${product}`);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  } else {
    // Clear all cache
    const files = await fs.readdir(CACHE_DIR);
    for (const file of files) {
      if (file.endsWith('-docs.json')) {
        await fs.unlink(path.join(CACHE_DIR, file));
      }
    }
    console.log(`🗑️  Cleared all docs cache (${files.length} files)`);
  }
}

/**
 * Get cache status
 */
async function getCacheStatus() {
  await ensureCacheDir();

  const files = await fs.readdir(CACHE_DIR);
  const cacheFiles = files.filter(f => f.endsWith('-docs.json'));

  const status = [];

  for (const file of cacheFiles) {
    const filePath = path.join(CACHE_DIR, file);
    const stats = await fs.stat(filePath);
    const age = Date.now() - stats.mtimeMs;
    const ageHours = Math.round(age / (60 * 60 * 1000));
    const isValid = age < CACHE_TTL;

    const data = await fs.readFile(filePath, 'utf-8');
    const cached = JSON.parse(data);

    status.push({
      product: cached.product,
      file: file,
      ageHours,
      isValid,
      timestamp: new Date(cached.timestamp).toISOString()
    });
  }

  return status;
}

export {
  fetchProductDocs,
  clearCache,
  getCacheStatus
};
