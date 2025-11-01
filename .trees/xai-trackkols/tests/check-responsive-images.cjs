#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const siteDir = path.join(__dirname, '..', '_site');
const industryDir = path.join(siteDir, 'industry-content');

const industryPages = [
  'content-creation',
  'esg',
  'financial-services',
  'legal',
  'retail',
  'supply-chain'
];

console.log('🔍 Checking for missing responsive images in industry-content pages...\n');
console.log('This test checks ALL image variants referenced in srcset attributes.\n');

let totalMissingImages = 0;
let allMissingImages = [];

industryPages.forEach(page => {
  const filePath = path.join(industryDir, `${page}.html`);

  console.log(`📄 Checking ${page}.html:`);

  if (!fs.existsSync(filePath)) {
    console.log(`   ❌ HTML file not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract all srcset references
  const srcsetRegex = /srcset="([^"]+)"/gi;
  const imgSrcRegex = /src="([^"]+\.(jpg|png|svg|webp|gif))"/gi;

  const allImageUrls = new Set();
  let missingCount = 0;

  // Check main src attributes
  let match;
  while ((match = imgSrcRegex.exec(content)) !== null) {
    const imgPath = match[1];
    if (imgPath.startsWith('/')) {
      allImageUrls.add(imgPath);
    }
  }

  // Check srcset attributes
  const srcsetRegexGlobal = /srcset="([^"]+)"/gi;
  while ((match = srcsetRegexGlobal.exec(content)) !== null) {
    const srcsetValue = match[1];

    // Parse srcset: "url1 width1, url2 width2, url3 width3"
    const srcsetParts = srcsetValue.split(',').map(part => part.trim());

    srcsetParts.forEach(part => {
      const urlMatch = part.match(/^([^\s]+)/);
      if (urlMatch) {
        const url = urlMatch[1];
        if (url.startsWith('/')) {
          allImageUrls.add(url);
        }
      }
    });
  }

  // Check background images
  const bgRegex = /background-image:\s*url\(['"]?([^'")]+\.(jpg|png|svg|webp|gif))['"]?\)/gi;
  while ((match = bgRegex.exec(content)) !== null) {
    const imgPath = match[1];
    if (imgPath.startsWith('/')) {
      allImageUrls.add(imgPath);
    }
  }

  console.log(`   Found ${allImageUrls.size} unique image URLs (including responsive variants)`);

  // Check each image URL
  allImageUrls.forEach(imgUrl => {
    const fullPath = path.join(siteDir, imgUrl.substring(1)); // Remove leading slash
    const decodedPath = decodeURIComponent(fullPath);

    const exists = fs.existsSync(fullPath) || fs.existsSync(decodedPath);

    if (!exists) {
      console.log(`   ❌ Missing: ${imgUrl}`);
      console.log(`      Checked: ${fullPath}`);
      console.log(`      Also checked: ${decodedPath}`);
      missingCount++;
      allMissingImages.push({ page: `${page}.html`, image: imgUrl, checkedPaths: [fullPath, decodedPath] });
    }
  });

  if (missingCount === 0) {
    console.log(`   ✅ All ${allImageUrls.size} images found`);
  } else {
    console.log(`   ❌ ${missingCount} images missing!`);
    totalMissingImages += missingCount;
  }

  console.log(''); // Empty line between pages
});

// Summary
console.log('='.repeat(60));
console.log('📊 RESPONSIVE IMAGES CHECK SUMMARY:');
console.log('='.repeat(60));

if (totalMissingImages === 0) {
  console.log('✅ SUCCESS: All responsive images found!\n');
  process.exit(0);
} else {
  console.log(`❌ FAILURE: ${totalMissingImages} missing images found:\n`);

  // Group by page
  const groupedByPage = allMissingImages.reduce((acc, item) => {
    if (!acc[item.page]) acc[item.page] = [];
    acc[item.page].push(item);
    return acc;
  }, {});

  Object.entries(groupedByPage).forEach(([page, items]) => {
    console.log(`${page}:`);
    items.forEach(({ image, checkedPaths }) => {
      console.log(`  - ${image}`);
      console.log(`    (checked: ${checkedPaths.map(p => path.basename(p)).join(', ')})`);
    });
    console.log('');
  });

  console.log('💡 Action Required:');
  console.log('   1. Generate missing responsive image variants');
  console.log('   2. Check URL encoding issues (spaces vs %20)');
  console.log('   3. Remove srcset references if responsive variants are not available\n');

  process.exit(1);
}