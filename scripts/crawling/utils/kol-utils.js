import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH = path.join(__dirname, '..', 'config', 'kol-config.json');
const DATA_DIR = path.join(__dirname, '..', 'data');
const DOCS_INDEX_PATH = path.join(__dirname, '..', '..', 'data', 'docs-index.json');
const PRODUCT_IMAGES_PATH = path.join(__dirname, '..', 'config', 'product-images.json');

/**
 * Load configuration from kol-config.json
 */
export function loadConfig() {
  try {
    const configData = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const config = JSON.parse(configData);

    // Validate required fields
    if (!config.discovery || !config.kolCriteria || !config.replySettings) {
      throw new Error('Invalid config structure');
    }

    console.log('✅ Configuration loaded successfully');
    return config;
  } catch (error) {
    console.error(`❌ Error loading config: ${error.message}`);
    throw error;
  }
}

/**
 * Load BWS products from docs-index.json
 */
export function loadBWSProducts() {
  try {
    const docsData = fs.readFileSync(DOCS_INDEX_PATH, 'utf-8');
    const docsIndex = JSON.parse(docsData);

    const products = {};

    // Process each page in the docs index
    docsIndex.pages.forEach(page => {
      const productName = page.product;

      // Focus on Marketplace Solutions and key Platform APIs
      const relevantProducts = [
        'Blockchain Badges',
        'ESG Credits',
        'Fan Game Cube',
        'X Bot',
        'NFT.zK',
        'Blockchain Hash',
        'Blockchain Save',
        'BWS IPFS'
      ];

      if (relevantProducts.includes(productName)) {
        // Create or update product entry
        if (!products[productName]) {
          products[productName] = {
            name: productName,
            url: page.url,
            category: page.category,
            description: page.summary || '',
            keywords: page.keywords || [],
            useCases: page.useCases || [],
            implementationSteps: page.implementationSteps || [],
            fullContent: page.fullContent || '',
            structuredContent: page.structuredContent || {}
          };
        } else {
          // If product already exists, merge additional information
          if (page.summary) {
            products[productName].description += ' ' + page.summary;
          }
          products[productName].keywords = [
            ...new Set([...products[productName].keywords, ...(page.keywords || [])])
          ];
          products[productName].useCases = [
            ...new Set([...products[productName].useCases, ...(page.useCases || [])])
          ];
        }
      }
    });

    // Load product images from product-images.json
    try {
      const imagesData = fs.readFileSync(PRODUCT_IMAGES_PATH, 'utf-8');
      const productImages = JSON.parse(imagesData);

      // Merge images into products
      Object.keys(products).forEach(productName => {
        const images = productImages.productImages[productName] || [];

        // Also check docs-index for images (from automated crawling)
        const docsImages = [];
        docsIndex.pages.forEach(page => {
          if (page.product === productName && page.images && page.images.length > 0) {
            docsImages.push(...page.images);
          }
        });

        // Combine manual mapping + automated discovery
        // Manual mapping takes priority (has better metadata)
        products[productName].images = images.length > 0 ? images : docsImages;
      });

      const productsWithImages = Object.values(products).filter(p => p.images && p.images.length > 0).length;
      console.log(`✅ Loaded ${Object.keys(products).length} BWS products from documentation`);
      console.log(`   📸 ${productsWithImages} products have images available`);
    } catch (imageError) {
      console.warn(`⚠️  Could not load product images: ${imageError.message}`);
      // Products still usable without images
    }

    return products;
  } catch (error) {
    console.error(`❌ Error loading BWS products from docs: ${error.message}`);
    console.log('⚠️  Falling back to empty products list');
    return {};
  }
}

/**
 * Load data from a JSON file, return default if not exists
 */
export function loadDataFile(filename, defaultData = {}) {
  const filePath = path.join(DATA_DIR, filename);

  try {
    if (!fs.existsSync(filePath)) {
      console.log(`📝 ${filename} not found, using default data`);
      return defaultData;
    }

    const data = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    console.log(`✅ Loaded ${filename}`);
    return parsed;
  } catch (error) {
    console.error(`❌ Error loading ${filename}: ${error.message}`);
    console.log(`📝 Using default data for ${filename}`);
    return defaultData;
  }
}

/**
 * Save data to a JSON file
 */
export function saveDataFile(filename, data) {
  const filePath = path.join(DATA_DIR, filename);

  try {
    // Ensure directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Saved ${filename}`);
    return true;
  } catch (error) {
    console.error(`❌ Error saving ${filename}: ${error.message}`);
    throw error;
  }
}

/**
 * Load KOL data
 */
export function loadKolsData() {
  return loadDataFile('kols-data.json', {
    kols: [],
    metadata: {
      lastDiscoveryRun: null,
      totalKols: 0,
      activeKols: 0,
      discoveryDepth: 0,
      seedKolsCount: 0,
      lastUpdateBy: null
    }
  });
}

/**
 * Save KOL data
 */
export function saveKolsData(data) {
  data.metadata.lastUpdateBy = 'kol-system';
  data.metadata.totalKols = data.kols.length;
  data.metadata.activeKols = data.kols.filter(k => k.status === 'active').length;
  return saveDataFile('kols-data.json', data);
}

/**
 * Load reply data
 */
export function loadRepliesData() {
  return loadDataFile('kol-replies.json', {
    replies: [],
    dailyStats: {},
    metadata: {
      totalReplies: 0,
      successfulReplies: 0,
      failedReplies: 0,
      lastReplyAt: null,
      todayRepliesCount: 0,
      lastUpdateBy: null
    }
  });
}

/**
 * Save reply data
 */
export function saveRepliesData(data) {
  data.metadata.lastUpdateBy = 'kol-system';
  data.metadata.totalReplies = data.replies.length;
  data.metadata.successfulReplies = data.replies.filter(r => r.status === 'posted').length;
  data.metadata.failedReplies = data.replies.filter(r => r.status === 'failed').length;

  if (data.replies.length > 0) {
    const sortedReplies = [...data.replies].sort((a, b) =>
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    data.metadata.lastReplyAt = sortedReplies[0].timestamp;
  }

  return saveDataFile('kol-replies.json', data);
}

/**
 * Load processed posts
 */
export function loadProcessedPosts() {
  const data = loadDataFile('processed-posts.json', {
    repliedTweetIds: [],
    skippedTweetIds: [],
    productRotation: {
      priorityProducts: ['X Bot', 'Fan Game Cube'],
      otherProducts: ['Blockchain Badges', 'ESG Credits', 'Blockchain Hash', 'Blockchain Save', 'BWS IPFS', 'NFT.zK'],
      priorityIndex: 0,
      otherIndex: 0,
      replyCount: 0
    },
    metadata: {
      lastCheck: null,
      totalReplied: 0,
      totalSkipped: 0,
      lastUpdateBy: null
    }
  });

  // Backward compatibility: if old format exists, migrate it
  if (data.processedTweetIds && !data.repliedTweetIds) {
    console.log('⚠️  Migrating old processed-posts.json format to new format');

    // Load replies to determine which processed tweets were actual replies
    const repliesData = loadRepliesData();
    const actualRepliedIds = new Set(
      repliesData.replies
        .filter(r => r.status === 'posted' || r.status === 'dry-run')
        .map(r => r.tweetId)
    );

    // Separate replied tweets from skipped tweets
    const repliedTweetIds = data.processedTweetIds.filter(id => actualRepliedIds.has(id));
    const skippedTweetIds = data.processedTweetIds.filter(id => !actualRepliedIds.has(id));

    console.log(`   Migrated: ${repliedTweetIds.length} replied, ${skippedTweetIds.length} skipped`);

    return {
      repliedTweetIds,
      skippedTweetIds,
      productRotation: {
        priorityProducts: ['X Bot', 'Fan Game Cube'],
        otherProducts: ['Blockchain Badges', 'ESG Credits', 'Blockchain Hash', 'Blockchain Save', 'BWS IPFS', 'NFT.zK'],
        priorityIndex: 0,
        otherIndex: 0,
        replyCount: 0
      },
      metadata: {
        lastCheck: data.metadata?.lastCheck || null,
        totalReplied: repliedTweetIds.length,
        totalSkipped: skippedTweetIds.length,
        lastUpdateBy: 'kol-system'
      }
    };
  }

  // Ensure productRotation exists
  if (!data.productRotation) {
    data.productRotation = {
      priorityProducts: ['X Bot', 'Fan Game Cube'],
      otherProducts: ['Blockchain Badges', 'ESG Credits', 'Blockchain Hash', 'Blockchain Save', 'BWS IPFS', 'NFT.zK'],
      priorityIndex: 0,
      otherIndex: 0,
      replyCount: 0
    };
  }

  // Ensure metadata exists
  if (!data.metadata) {
    data.metadata = {
      lastCheck: null,
      totalReplied: data.repliedTweetIds?.length || 0,
      totalSkipped: data.skippedTweetIds?.length || 0,
      lastUpdateBy: null
    };
  }

  return data;
}

/**
 * Save processed posts
 */
export function saveProcessedPosts(data) {
  data.metadata.lastUpdateBy = 'kol-system';
  data.metadata.totalReplied = data.repliedTweetIds.length;
  data.metadata.totalSkipped = data.skippedTweetIds.length;
  data.metadata.lastCheck = new Date().toISOString();
  return saveDataFile('processed-posts.json', data);
}

/**
 * Load metrics data
 */
export function loadMetricsData() {
  return loadDataFile('kol-metrics.json', {
    weeklyReports: [],
    overallMetrics: {
      totalKols: 0,
      activeKols: 0,
      totalReplies: 0,
      successRate: 0,
      averageEngagement: 0,
      spamScore: 0,
      lastCalculated: null
    },
    metadata: {
      lastAnalysisRun: null,
      lastUpdateBy: null
    }
  });
}

/**
 * Save metrics data
 */
export function saveMetricsData(data) {
  data.metadata.lastUpdateBy = 'kol-system';
  data.metadata.lastAnalysisRun = new Date().toISOString();
  return saveDataFile('kol-metrics.json', data);
}

/**
 * Rate limiter class
 */
export class RateLimiter {
  constructor(maxCallsPerMinute) {
    this.maxCallsPerMinute = maxCallsPerMinute;
    this.calls = [];
    this.lastCallTime = 0;
    // Calculate minimum delay between calls in ms
    this.minDelayBetweenCalls = Math.ceil(60000 / maxCallsPerMinute);
  }

  /**
   * Wait if necessary to respect rate limit
   * Enforces BOTH:
   * 1. Minimum delay between consecutive calls (prevents bursts)
   * 2. Maximum calls per rolling 60-second window
   */
  async throttle() {
    const now = Date.now();

    // FIRST: Enforce minimum delay between consecutive calls (steady pacing)
    const timeSinceLastCall = now - this.lastCallTime;
    if (timeSinceLastCall < this.minDelayBetweenCalls && this.lastCallTime > 0) {
      const delayNeeded = this.minDelayBetweenCalls - timeSinceLastCall;
      console.log(`   ⏳ Spacing calls: waiting ${(delayNeeded / 1000).toFixed(1)}s (min ${(this.minDelayBetweenCalls / 1000).toFixed(1)}s between calls)`);
      await new Promise(resolve => setTimeout(resolve, delayNeeded));
    }

    // SECOND: Check rolling window limit (safety check)
    const oneMinuteAgo = Date.now() - 60000; // Recalculate after potential delay
    this.calls = this.calls.filter(time => time > oneMinuteAgo);

    if (this.calls.length >= this.maxCallsPerMinute) {
      const oldestCall = this.calls[0];
      const waitTime = 60000 - (Date.now() - oldestCall) + 1000; // Add 1s buffer

      console.log(`   ⏳ Rolling window limit reached (${this.calls.length}/${this.maxCallsPerMinute}). Waiting ${Math.ceil(waitTime / 1000)}s...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));

      // Recursive call after waiting
      return this.throttle();
    }

    // Record this call
    const callTime = Date.now();
    this.calls.push(callTime);
    this.lastCallTime = callTime;
  }
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Calculate KOL priority score
 */
export function calculateKolPriority(kol) {
  return (kol.engagementRate || 0) * (kol.cryptoRelevanceScore || 0);
}

/**
 * Prioritize KOLs with stratified randomization
 * Groups KOLs by priority tier, randomizes within each tier
 * @param {Array} kols - Array of KOL objects
 * @returns {Array} - Prioritized and randomized array
 */
export function prioritizeKolsWithRandomization(kols) {
  // Calculate priority scores
  const kolsWithPriority = kols.map(kol => ({
    ...kol,
    priorityScore: calculateKolPriority(kol)
  }));

  // Define tier thresholds
  const HIGH_TIER_THRESHOLD = 3.0;
  const MID_TIER_THRESHOLD = 1.5;

  // Group into tiers
  const highTier = kolsWithPriority.filter(k => k.priorityScore >= HIGH_TIER_THRESHOLD);
  const midTier = kolsWithPriority.filter(k => k.priorityScore >= MID_TIER_THRESHOLD && k.priorityScore < HIGH_TIER_THRESHOLD);
  const lowTier = kolsWithPriority.filter(k => k.priorityScore < MID_TIER_THRESHOLD);

  // Randomize within each tier, then concatenate
  const prioritized = [
    ...shuffleArray(highTier),
    ...shuffleArray(midTier),
    ...shuffleArray(lowTier)
  ];

  return prioritized;
}

/**
 * Calculate engagement rate
 */
export function calculateEngagementRate(likes, retweets, replies, followers) {
  if (!followers || followers === 0) return 0;
  const totalEngagement = (likes || 0) + (retweets || 0) + (replies || 0);
  return (totalEngagement / followers) * 100;
}

/**
 * Check if user meets KOL criteria
 */
export function meetsKolCriteria(user, config, cryptoRelevanceScore, engagementMetrics) {
  const criteria = config.kolCriteria;

  // Check followers
  if (user.public_metrics.followers_count < criteria.minFollowers) {
    return { meets: false, reason: 'Below minimum followers' };
  }

  // Check crypto relevance
  if (cryptoRelevanceScore < criteria.minCryptoRelevance) {
    return { meets: false, reason: 'Below minimum crypto relevance' };
  }

  // Check engagement rate
  if (engagementMetrics.avgEngagementRate < criteria.minEngagementRate) {
    return { meets: false, reason: 'Below minimum engagement rate' };
  }

  // Check average likes
  if (engagementMetrics.avgLikes < criteria.minAverageLikes) {
    return { meets: false, reason: 'Below minimum average likes' };
  }

  // Check average views - DISABLED: userTimeline API doesn't return impression_count
  // Without elevated X API access, avgViews is always 0, causing all candidates to fail
  // if (engagementMetrics.avgViews < criteria.minAverageViews) {
  //   return { meets: false, reason: 'Below minimum average views' };
  // }

  // Check verification if required
  if (criteria.requireVerified && !user.verified) {
    return { meets: false, reason: 'Not verified' };
  }

  return { meets: true, reason: 'Meets all criteria' };
}

/**
 * Get today's date string (YYYY-MM-DD)
 */
export function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get tweet age in hours
 * @param {Object} post - Post object with created_at or addedAt timestamp
 * @returns {number} Age in hours
 */
export function getTweetAgeHours(post) {
  const now = Date.now();
  const createdAt = post.created_at
    ? new Date(post.created_at).getTime()
    : new Date(post.addedAt).getTime();
  return (now - createdAt) / (60 * 60 * 1000);
}

/**
 * Check if post is fresh enough to reply (default: 24 hours)
 * @param {Object} post - Post object with created_at or addedAt timestamp
 * @param {number} maxAgeHours - Maximum age in hours (default: 24)
 * @returns {boolean} True if post is fresh enough
 */
export function isPostFresh(post, maxAgeHours = 24) {
  return getTweetAgeHours(post) <= maxAgeHours;
}

/**
 * Check if post should be removed from engaging-posts (default: 48 hours)
 * @param {Object} post - Post object with created_at or addedAt timestamp
 * @param {number} cleanupThresholdHours - Cleanup threshold in hours (default: 48)
 * @returns {boolean} True if post should be removed
 */
export function isPostStale(post, cleanupThresholdHours = 48) {
  return getTweetAgeHours(post) > cleanupThresholdHours;
}

/**
 * Check if we've reached the daily reply limit
 */
export function hasReachedDailyLimit(repliesData, maxRepliesPerDay) {
  const today = getTodayDateString();
  const todayStats = repliesData.dailyStats[today];

  if (!todayStats) return false;

  const todayReplies = todayStats.repliesPosted || 0;
  return todayReplies >= maxRepliesPerDay;
}

/**
 * Check if we've replied to this KOL recently
 */
export function hasRepliedRecentlyToKol(repliesData, kolId, maxRepliesPerWeek = 1) {
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

  const recentReplies = repliesData.replies.filter(reply =>
    reply.kolId === kolId &&
    new Date(reply.timestamp) > oneWeekAgo &&
    reply.status === 'posted'
  );

  return recentReplies.length >= maxRepliesPerWeek;
}

/**
 * Sleep utility
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format number with commas
 */
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Calculate days since date
 */
export function daysSince(date) {
  const now = Date.now();
  const then = new Date(date).getTime();
  return Math.floor((now - then) / (24 * 60 * 60 * 1000));
}

/**
 * Get next product(s) to feature using simple round-robin
 * All products get equal rotation (no priority/other split)
 * Returns product names to filter from BWS products catalog
 */
export function getNextFeaturedProducts(processedPosts, bwsProducts, config) {
  const rotation = processedPosts.productRotation;
  const diversityConfig = config.contentDiversity || {};
  const preventConsecutive = diversityConfig.preventConsecutiveSameProduct !== false;
  const specialNoteProbability = diversityConfig.specialNotesProbability || 0.33;

  // Support both old format (priorityProducts/otherProducts) and new format (allProducts)
  let allProducts;
  let currentIndex;

  if (rotation.allProducts) {
    // New format: simple list of all products
    allProducts = rotation.allProducts;
    currentIndex = rotation.currentIndex || 0;
  } else {
    // Old format: merge priority and other products
    allProducts = [...(rotation.priorityProducts || []), ...(rotation.otherProducts || [])];
    currentIndex = rotation.priorityIndex || 0;
  }

  let selectedProductNames = [];
  let specialNotes = '';
  let attempts = 0;
  const maxAttempts = allProducts.length + 1; // Try all products once

  // Simple round-robin with consecutive prevention
  while (attempts < maxAttempts) {
    attempts++;

    const productName = allProducts[currentIndex % allProducts.length];

    // Check if this is the same as last product used
    if (preventConsecutive && rotation.lastProductUsed === productName && allProducts.length > 1) {
      // Skip to next product
      currentIndex = (currentIndex + 1) % allProducts.length;
      continue; // Try again
    }

    selectedProductNames.push(productName);

    // Add special note for Fan Game Cube about iGaming (conditional based on probability)
    if (productName === 'Fan Game Cube' && Math.random() < specialNoteProbability) {
      specialNotes = '**IMPORTANT**: Fan Game Cube is expanding into the iGaming domain. Mention this future direction when relevant.';
    }

    // Move to next product
    currentIndex = (currentIndex + 1) % allProducts.length;
    break;
  }

  // If we somehow failed to select a product (shouldn't happen), fallback to first available
  if (selectedProductNames.length === 0) {
    selectedProductNames.push(allProducts[0]);
    currentIndex = 1;
  }

  // Update rotation state
  rotation.lastProductUsed = selectedProductNames[0];
  if (rotation.allProducts) {
    rotation.currentIndex = currentIndex;
  } else {
    rotation.priorityIndex = currentIndex; // For backward compatibility
  }

  // Get positioning phrase
  const positioningPhrases = config.positioningPhrases || [
    "microcap opportunity with real fundamentals"
  ];
  const positioningPhrase = positioningPhrases[rotation.positioningPhraseIndex % positioningPhrases.length];

  // Move to next positioning phrase
  rotation.positioningPhraseIndex = (rotation.positioningPhraseIndex + 1) % positioningPhrases.length;

  // Increment reply count
  rotation.replyCount++;

  // Filter BWS products to only include selected ones
  const featuredProducts = {};
  for (const name of selectedProductNames) {
    if (bwsProducts[name]) {
      featuredProducts[name] = bwsProducts[name];
    }
  }

  return {
    products: featuredProducts,
    productNames: selectedProductNames,
    specialNotes,
    isPriority: false, // No more priority distinction
    positioningPhrase
  };
}

/**
 * Update README.md with current KOL database statistics
 * Updates the "Current KOL Database Status" table in section 2.1
 */
export function updateReadmeKolStats() {
  try {
    const readmePath = path.join(__dirname, '..', '..', '..', 'README.md');

    // Check if README exists
    if (!fs.existsSync(readmePath)) {
      console.log('⚠️  README.md not found, skipping stats update');
      return false;
    }

    // Load current KOL data
    const kolsData = loadKolsData();
    const totalKols = kolsData.kols.length;
    const activeKols = kolsData.kols.filter(k => k.status === 'active').length;
    const lastUpdated = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC';

    // Read README
    let readmeContent = fs.readFileSync(readmePath, 'utf-8');

    // Find and replace the KOL Database Status table
    // Pattern: | _14_ | _14_ | _2025-11-17 18:30 UTC_ |
    const tablePattern = /(\| Total KOLs \| Active KOLs \| Last Updated \|\n\|[-|]+\|\n)\| _\d+_ \| _\d+_ \| _[^|]+_ \|/;

    const replacement = `$1| _${totalKols}_ | _${activeKols}_ | _${lastUpdated}_ |`;

    if (tablePattern.test(readmeContent)) {
      readmeContent = readmeContent.replace(tablePattern, replacement);
      fs.writeFileSync(readmePath, readmeContent, 'utf-8');
      console.log(`✅ Updated README.md KOL stats: ${totalKols} total, ${activeKols} active`);
      return true;
    } else {
      console.log('⚠️  Could not find KOL Database Status table in README.md');
      return false;
    }
  } catch (error) {
    console.error(`❌ Error updating README stats: ${error.message}`);
    return false;
  }
}

export default {
  loadConfig,
  loadBWSProducts,
  loadDataFile,
  saveDataFile,
  loadKolsData,
  saveKolsData,
  loadRepliesData,
  saveRepliesData,
  loadProcessedPosts,
  saveProcessedPosts,
  loadMetricsData,
  saveMetricsData,
  RateLimiter,
  calculateEngagementRate,
  meetsKolCriteria,
  getTodayDateString,
  hasReachedDailyLimit,
  hasRepliedRecentlyToKol,
  sleep,
  formatNumber,
  daysSince,
  getNextFeaturedProducts,
  updateReadmeKolStats
};
