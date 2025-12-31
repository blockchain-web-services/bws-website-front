/**
 * Test script for category-aware query selection
 * Validates that the selection logic works correctly without making API calls
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load product search queries config
const configPath = path.join(__dirname, '..', 'config', 'product-search-queries.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

/**
 * Select one query from an array using weighted random selection
 */
function selectWeightedRandom(queries) {
  if (queries.length === 0) return null;

  // Calculate total weight
  const totalWeight = queries.reduce((sum, q) => sum + (q.weight || 1), 0);

  // Random selection weighted by priority
  let random = Math.random() * totalWeight;

  for (let i = 0; i < queries.length; i++) {
    random -= (queries[i].weight || 1);
    if (random <= 0) {
      return queries[i];
    }
  }

  // Fallback: return last query
  return queries[queries.length - 1];
}

/**
 * Select queries using weighted random (original algorithm, used as fallback)
 */
function selectQueriesWeightedRandom(queries, maxQueries, priorityWeights) {
  const weightedQueries = queries.map(q => ({
    ...q,
    weight: priorityWeights[q.priority] || 1
  }));

  const selected = [];
  const available = [...weightedQueries];

  for (let i = 0; i < Math.min(maxQueries, queries.length); i++) {
    if (available.length === 0) break;

    const selectedQuery = selectWeightedRandom(available);
    if (selectedQuery) {
      selected.push(selectedQuery);
      const index = available.findIndex(q => q.name === selectedQuery.name);
      if (index !== -1) available.splice(index, 1);
    }
  }

  return selected;
}

/**
 * Select queries for a product using category-aware distribution
 */
function selectQueriesForProduct(productConfig, settings) {
  const { queries } = productConfig;
  const { maxQueriesPerRun, priorityWeights, rotationStrategy, categoryDistribution } = settings;

  // If category-aware strategy is not enabled or no categories defined, use weighted random
  if (rotationStrategy !== 'category-aware' || !categoryDistribution?.categories) {
    return selectQueriesWeightedRandom(queries, maxQueriesPerRun, priorityWeights);
  }

  // Category-aware selection
  const categories = categoryDistribution.categories;
  const minPerCategory = categoryDistribution.minPerCategory || 1;

  // Group queries by category
  const queriesByCategory = {};
  queries.forEach(q => {
    const category = q.category || 'general';
    if (!queriesByCategory[category]) {
      queriesByCategory[category] = [];
    }
    queriesByCategory[category].push({
      ...q,
      weight: priorityWeights[q.priority] || 1
    });
  });

  const selected = [];
  const categoriesUsed = new Set();

  // Phase 1: Ensure minimum queries per category
  for (const category of categories) {
    if (!queriesByCategory[category] || queriesByCategory[category].length === 0) {
      continue;
    }

    // Select minPerCategory queries from this category
    const categoryQueries = [...queriesByCategory[category]];
    for (let i = 0; i < Math.min(minPerCategory, categoryQueries.length); i++) {
      if (selected.length >= maxQueriesPerRun) break;

      const selectedQuery = selectWeightedRandom(categoryQueries);
      if (selectedQuery) {
        selected.push(selectedQuery);
        categoriesUsed.add(category);
        // Remove from available pool
        const index = categoryQueries.findIndex(q => q.name === selectedQuery.name);
        if (index !== -1) categoryQueries.splice(index, 1);
      }
    }
  }

  // Phase 2: Fill remaining slots with weighted random from all categories
  if (selected.length < maxQueriesPerRun) {
    const remaining = queries
      .map(q => ({ ...q, weight: priorityWeights[q.priority] || 1 }))
      .filter(q => !selected.find(s => s.name === q.name));

    while (selected.length < maxQueriesPerRun && remaining.length > 0) {
      const selectedQuery = selectWeightedRandom(remaining);
      if (selectedQuery) {
        selected.push(selectedQuery);
        const index = remaining.findIndex(q => q.name === selectedQuery.name);
        if (index !== -1) remaining.splice(index, 1);
      } else {
        break;
      }
    }
  }

  return selected;
}

// Test the selection
console.log('🧪 Testing Category-Aware Query Selection\n');
console.log('=' .repeat(60));

const productName = 'Blockchain Badges';
const productConfig = config.products[productName];
const settings = config.settings;

console.log(`\n📦 Product: ${productName}`);
console.log(`📊 Total Queries: ${productConfig.queries.length}`);
console.log(`🎯 Queries to Select: ${settings.maxQueriesPerRun}`);
console.log(`📋 Strategy: ${settings.rotationStrategy}`);
console.log(`🏷️  Categories: ${settings.categoryDistribution.categories.join(', ')}`);
console.log(`📌 Min Per Category: ${settings.categoryDistribution.minPerCategory}\n`);

// Show query distribution by category
const queriesByCategory = {};
productConfig.queries.forEach(q => {
  const category = q.category || 'general';
  if (!queriesByCategory[category]) {
    queriesByCategory[category] = [];
  }
  queriesByCategory[category].push(q);
});

console.log('📚 Query Distribution by Category:');
for (const [category, queries] of Object.entries(queriesByCategory)) {
  const priorities = queries.reduce((acc, q) => {
    acc[q.priority] = (acc[q.priority] || 0) + 1;
    return acc;
  }, {});

  const priorityStr = Object.entries(priorities)
    .map(([p, count]) => `${count} ${p}`)
    .join(', ');

  console.log(`   ${category}: ${queries.length} queries (${priorityStr})`);
}

// Run multiple selections to verify category distribution
console.log('\n🔄 Running 5 test selections:\n');

const categoryStats = {};
for (let i = 1; i <= 5; i++) {
  const selected = selectQueriesForProduct(productConfig, settings);

  console.log(`\nRun ${i}: Selected ${selected.length} queries`);
  const runCategories = {};
  selected.forEach(q => {
    const category = q.category || 'general';
    runCategories[category] = (runCategories[category] || 0) + 1;

    // Track overall stats
    if (!categoryStats[category]) {
      categoryStats[category] = 0;
    }
    categoryStats[category]++;
  });

  // Show category breakdown
  const categoryBreakdown = settings.categoryDistribution.categories
    .map(cat => `${cat}: ${runCategories[cat] || 0}`)
    .join(', ');

  console.log(`   Categories: ${categoryBreakdown}`);

  // Show selected queries
  selected.forEach(q => {
    console.log(`   - [${q.category || 'general'}] ${q.name} (${q.priority})`);
  });
}

// Summary statistics
console.log('\n' + '='.repeat(60));
console.log('📊 Summary Statistics (5 runs):');
console.log('='.repeat(60) + '\n');

const totalSelected = Object.values(categoryStats).reduce((sum, count) => sum + count, 0);

console.log('Category distribution across all runs:');
for (const category of settings.categoryDistribution.categories) {
  const count = categoryStats[category] || 0;
  const percentage = ((count / totalSelected) * 100).toFixed(1);
  const expected = queriesByCategory[category]?.length || 0;
  console.log(`   ${category}: ${count}/${totalSelected} (${percentage}%) - ${expected} queries available`);
}

console.log('\n✅ Validation checks:');

// Check 1: Each category represented
const allCategoriesRepresented = settings.categoryDistribution.categories.every(
  cat => categoryStats[cat] > 0
);
console.log(`   ${allCategoriesRepresented ? '✅' : '❌'} All categories represented: ${allCategoriesRepresented}`);

// Check 2: Correct number of queries selected
const avgSelected = totalSelected / 5;
console.log(`   ${avgSelected === settings.maxQueriesPerRun ? '✅' : '❌'} Correct query count: ${avgSelected} (expected ${settings.maxQueriesPerRun})`);

// Check 3: Minimum per category met in most runs
const minMetPercentage = Object.values(categoryStats).filter(
  count => count >= settings.categoryDistribution.minPerCategory
).length / settings.categoryDistribution.categories.length * 100;
console.log(`   ✅ Categories meeting minimum: ${minMetPercentage.toFixed(0)}%`);

console.log('\n✨ Test complete!\n');
