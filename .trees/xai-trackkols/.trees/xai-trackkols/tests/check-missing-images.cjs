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

console.log('Checking for missing images in industry-content pages...\n');

let missingImages = [];

industryPages.forEach(page => {
  const filePath = path.join(industryDir, `${page}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract all image references
  const imgRegex = /(?:src|srcset)="([^"]+\.(jpg|png|svg|webp|gif))"/gi;
  const bgRegex = /background-image:\s*url\(["']?([^"')]+\.(jpg|png|svg|webp|gif))["']?\)/gi;

  const images = new Set();

  // Find img src/srcset
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    // Handle srcset by splitting on comma and extracting first part
    const imgPath = match[1].split(/\s+/)[0].split(',')[0];
    if (imgPath.startsWith('/')) {
      images.add(imgPath);
    }
  }

  // Find background-images
  while ((match = bgRegex.exec(content)) !== null) {
    const imgPath = match[1];
    if (imgPath.startsWith('/')) {
      images.add(imgPath);
    }
  }

  console.log(`\n📄 ${page}.html:`);
  console.log(`   Found ${images.size} unique image references`);

  // Check if images exist
  let pageMissing = [];
  images.forEach(img => {
    const fullPath = path.join(siteDir, img.substring(1)); // Remove leading slash
    if (!fs.existsSync(fullPath)) {
      console.log(`   ❌ Missing: ${img}`);
      pageMissing.push(img);
      missingImages.push({ page: `${page}.html`, image: img });
    }
  });

  if (pageMissing.length === 0) {
    console.log(`   ✅ All images found`);
  } else {
    console.log(`   ⚠️  ${pageMissing.length} images missing!`);
  }
});

// Also check for the industry background images that should be there
console.log('\n\n🖼️  Checking for expected industry background images...\n');

const expectedImages = {
  'content-creation': '6505db28e3925660b50a55ff_Content-Creation_320x400_Layered.jpg',
  'esg': '6505d9933660c5523d5f93eb_ESG-CREDITS_320x400_Layered.jpg',
  'financial-services': '6505dc980dbf1ad68ea4e1f0_Financial-Services_320x400_Layered.jpg',
  'legal': '6505dde3f53261fa63529ee9_Legal-320x400.jpg',
  'retail': '6505dfa0e3925660b50e279e_Retail_320x400_Layered.jpg',
  'supply-chain': '6505e0f259aeff2f47db9530_Supply-Chain_320x400_layered.jpg'
};

Object.entries(expectedImages).forEach(([page, imgName]) => {
  const imgPath = path.join(siteDir, 'assets', 'images', '6474d385cfec71cb21a9229a', imgName);

  if (fs.existsSync(imgPath)) {
    console.log(`✅ ${page}: ${imgName} exists`);
  } else {
    console.log(`❌ ${page}: ${imgName} MISSING!`);
    missingImages.push({ page: `${page}.html`, image: `/assets/images/6474d385cfec71cb21a9229a/${imgName}` });
  }
});

// Summary
console.log('\n\n📊 SUMMARY:');
if (missingImages.length === 0) {
  console.log('✅ All images found!');
  process.exit(0);
} else {
  console.log(`❌ ${missingImages.length} missing images found:\n`);
  missingImages.forEach(({ page, image }) => {
    console.log(`   ${page}: ${image}`);
  });
  process.exit(1);
}