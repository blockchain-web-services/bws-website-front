/**
 * Trending Topics Generator for Dynamic Search Queries
 * Fetches daily trending crypto topics and generates ScrapFly search queries
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_FILE = path.join(__dirname, '../data/trending-cache.json');
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Crypto-related trending hashtags and topics (fallback/static list)
 */
const CRYPTO_KEYWORDS = [
  'Bitcoin', 'BTC', 'Ethereum', 'ETH', 'crypto', 'blockchain',
  'DeFi', 'NFT', 'Web3', 'altcoin', 'cryptocurrency',
];

/**
 * Check if cache is still valid
 */
async function isCacheValid() {
  try {
    const cache = JSON.parse(await fs.readFile(CACHE_FILE, 'utf-8'));
    const age = Date.now() - new Date(cache.timestamp).getTime();
    return age < CACHE_DURATION && cache.topics && cache.topics.length > 0;
  } catch {
    return false;
  }
}

/**
 * Get cached trending topics
 */
async function getCachedTopics() {
  try {
    const cache = JSON.parse(await fs.readFile(CACHE_FILE, 'utf-8'));
    return cache.topics || [];
  } catch {
    return [];
  }
}

/**
 * Save topics to cache
 */
async function saveToCache(topics) {
  const cache = {
    timestamp: new Date().toISOString(),
    topics: topics,
    expiresAt: new Date(Date.now() + CACHE_DURATION).toISOString(),
  };
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
}

/**
 * Fetch trending topics from various sources
 * This is a basic implementation - can be enhanced with actual API calls
 */
async function fetchTrendingTopics() {
  // For now, return a curated list of high-potential topics
  // TODO: Integrate with trending APIs (CoinGecko, Twitter Trends, etc.)

  const staticTopics = [
    { topic: 'AI crypto', category: 'ai_crypto', priority: 'high' },
    { topic: 'Grok token', category: 'ai_crypto', priority: 'high' },
    { topic: 'GameFi projects', category: 'gaming', priority: 'medium' },
    { topic: 'microcap altcoins', category: 'microcap', priority: 'high' },
    { topic: 'blockchain gaming', category: 'gaming', priority: 'medium' },
    { topic: 'DeFi yield', category: 'general_crypto', priority: 'medium' },
    { topic: 'crypto trading signals', category: 'general_crypto', priority: 'low' },
  ];

  return staticTopics;
}

/**
 * Generate search queries from trending topics
 */
function generateQueries(topics) {
  const queries = [];

  for (const topic of topics) {
    // Generate main query
    queries.push({
      query: `${topic.topic} lang:en -is:retweet min_faves:50`,
      tier: 'viral',
      min_likes: 50,
      min_retweets: 10,
      min_views: 5000,
      description: `Trending: ${topic.topic}`,
      category: topic.category || 'trending',
      priority: topic.priority || 'medium',
      dynamic: true,
    });

    // Generate hashtag variant if applicable
    if (!topic.topic.startsWith('#')) {
      const hashtagVersion = topic.topic.replace(/ /g, '');
      queries.push({
        query: `#${hashtagVersion} crypto lang:en -is:retweet`,
        tier: 'viral',
        min_likes: 50,
        min_retweets: 10,
        min_views: 5000,
        description: `Trending hashtag: #${hashtagVersion}`,
        category: topic.category || 'trending',
        priority: topic.priority || 'medium',
        dynamic: true,
      });
    }
  }

  return queries;
}

/**
 * Get trending queries (main export)
 * Returns array of query objects ready for ScrapFly
 */
export async function getTrendingQueries() {
  // Check cache first
  if (await isCacheValid()) {
    console.log('📦 Using cached trending topics');
    const cachedTopics = await getCachedTopics();
    return generateQueries(cachedTopics);
  }

  // Fetch fresh topics
  console.log('🔍 Fetching fresh trending topics...');
  const topics = await fetchTrendingTopics();

  // Save to cache
  await saveToCache(topics);

  // Generate and return queries
  const queries = generateQueries(topics);
  console.log(`✅ Generated ${queries.length} trending queries`);

  return queries;
}

/**
 * Force refresh trending topics (bypass cache)
 */
export async function refreshTrendingTopics() {
  console.log('🔄 Force refreshing trending topics...');
  const topics = await fetchTrendingTopics();
  await saveToCache(topics);
  return generateQueries(topics);
}

/**
 * Get trending topics summary for logging/debugging
 */
export async function getTrendingSummary() {
  const queries = await getTrendingQueries();
  return {
    count: queries.length,
    queries: queries.map(q => ({
      query: q.query,
      category: q.category,
      priority: q.priority,
    })),
    cacheValid: await isCacheValid(),
  };
}

export default {
  getTrendingQueries,
  refreshTrendingTopics,
  getTrendingSummary,
};
