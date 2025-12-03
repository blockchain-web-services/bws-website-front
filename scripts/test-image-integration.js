#!/usr/bin/env node

/**
 * Test Script: Image Integration Test
 * Tests product image loading and selection functionality
 */

import { loadBWSProducts } from './crawling/utils/kol-utils.js';
import { selectProductImage } from './crawling/utils/claude-client.js';

console.log('🧪 Testing Image Integration...\n');

// Load products
console.log('1️⃣ Loading BWS products...');
const products = loadBWSProducts();
console.log(`   ✅ Loaded ${Object.keys(products).length} products\n`);

// Test each product
console.log('2️⃣ Testing image selection for each product:\n');

Object.entries(products).forEach(([name, product]) => {
  console.log(`📦 ${name}:`);
  console.log(`   Images available: ${product.images?.length || 0}`);

  if (product.images && product.images.length > 0) {
    const selectedImage = selectProductImage(product);
    console.log(`   ✅ Selected: ${selectedImage.localPath}`);
    console.log(`   Priority: ${selectedImage.priority}`);
    if (selectedImage.alt) {
      console.log(`   Alt text: ${selectedImage.alt}`);
    }
  } else {
    console.log(`   ⚠️  No images available`);
  }
  console.log('');
});

// Summary
const productsWithImages = Object.values(products).filter(p => p.images && p.images.length > 0);
const totalImages = Object.values(products).reduce((sum, p) => sum + (p.images?.length || 0), 0);

console.log('📊 Summary:');
console.log(`   Total products: ${Object.keys(products).length}`);
console.log(`   Products with images: ${productsWithImages.length}`);
console.log(`   Total images: ${totalImages}`);
console.log(`   Products without images: ${Object.keys(products).length - productsWithImages.length}`);

console.log('\n✅ Image integration test complete!');
