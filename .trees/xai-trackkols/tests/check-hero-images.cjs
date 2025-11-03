#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const siteDir = path.join(__dirname, '..', '_site');
const industryDir = path.join(siteDir, 'industry-content');

// Expected hero images for each industry page
const expectedHeroImages = {
  'content-creation': {
    background: '6505db28e3925660b50a55ff_Content-Creation_320x400_Layered.jpg',
    article: '654a258bbfafadcb274d5024_The%20Future%20of%20Creative%20Ownership%20and%20Empowerment.jpg'
  },
  'esg': {
    background: '6505d9933660c5523d5f93eb_ESG-CREDITS_320x400_Layered.jpg',
    article: '654a256e853678a54e9cebdf_blockchain-accountability.jpg'
  },
  'financial-services': {
    background: '6505dc980dbf1ad68ea4e1f0_Financial-Services_320x400_Layered.jpg',
    article: '654a2597be432d1f0879bfa6_Elevating%20Financial%20Services%20and%20ESG%20Compiance.jpg'
  },
  'legal': {
    background: '6505dde3f53261fa63529ee9_Legal-320x400.jpg',
    article: '654a2515de4301ab69f9951e_Blockchain%20Trust%20in%20Legal%20Practices.jpg'
  },
  'retail': {
    background: '6505dfa0e3925660b50e279e_Retail_320x400_Layered.jpg',
    article: '654a2561e29f2df41f5bfeb8_Transform%20the%20user%20eXperience%20with%20Blockchain.jpg'
  },
  'supply-chain': {
    background: '6505e0f259aeff2f47db9530_Supply-Chain_320x400_layered.jpg',
    article: '654a25780f2320f1dc394e6a_The%20Future%20of%20Transparent%20and%20Efficient%20Supply%20Chain%20Management.jpg'
  }
};

console.log('🔍 Checking for hero images in industry-content pages...\n');
console.log('This test will FAIL if expected hero images are not properly displayed.\n');

let failedPages = [];
let missingHeroImages = [];

Object.entries(expectedHeroImages).forEach(([page, images]) => {
  const filePath = path.join(industryDir, `${page}.html`);

  console.log(`\n📄 Checking ${page}.html:`);

  if (!fs.existsSync(filePath)) {
    console.log(`   ❌ HTML file not found: ${filePath}`);
    failedPages.push(page);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  let hasIssues = false;

  // Check for background image reference
  const bgImagePath = `/assets/images/6474d385cfec71cb21a9229a/${images.background}`;
  const bgImageFile = path.join(siteDir, bgImagePath.substring(1));

  // Check multiple ways the background image might be referenced
  const bgInCSS = content.includes(`background-image:`) && content.includes(images.background);
  const bgInStyle = content.includes(`style="`) && content.includes(images.background);
  const bgAsImg = content.includes(`<img`) && content.includes(images.background);
  const bgReferenced = bgInCSS || bgInStyle || bgAsImg;

  console.log(`   Background Image: ${images.background}`);
  console.log(`   - File exists: ${fs.existsSync(bgImageFile) ? '✅' : '❌'}`);
  console.log(`   - Referenced in HTML: ${bgReferenced ? '✅' : '❌ MISSING!'}`);

  if (!bgReferenced) {
    hasIssues = true;
    missingHeroImages.push({
      page: `${page}.html`,
      type: 'background',
      image: images.background,
      path: bgImagePath
    });
  }

  // Check for article hero image
  const articleImagePath = `/assets/images/6474d385cfec71cb21a9229a/${images.article}`;
  const articleImageFile = path.join(siteDir, articleImagePath.substring(1).replace(/%20/g, ' '));
  const articleReferenced = content.includes(images.article);

  console.log(`   Article Image: ${images.article}`);
  console.log(`   - File exists: ${fs.existsSync(articleImageFile) ? '✅' : '❌'}`);
  console.log(`   - Referenced in HTML: ${articleReferenced ? '✅' : '❌ MISSING!'}`);

  if (!articleReferenced) {
    hasIssues = true;
    missingHeroImages.push({
      page: `${page}.html`,
      type: 'article',
      image: images.article,
      path: articleImagePath
    });
  }

  // Check if hero section exists
  const hasHeroSection = content.includes('hero-section') || content.includes('industry-hero');
  console.log(`   Hero Section HTML: ${hasHeroSection ? '✅' : '⚠️ No hero section found'}`);

  if (hasIssues) {
    failedPages.push(page);
    console.log(`   ❌ FAILED: Missing hero image references!`);
  } else {
    console.log(`   ✅ PASSED: All hero images properly referenced`);
  }
});

// Final report
console.log('\n\n' + '='.repeat(60));
console.log('📊 TEST RESULTS SUMMARY:');
console.log('='.repeat(60));

if (failedPages.length === 0) {
  console.log('\n✅ SUCCESS: All industry pages have proper hero images!\n');
  process.exit(0);
} else {
  console.log(`\n❌ FAILURE: ${failedPages.length} pages have missing hero images:\n`);

  failedPages.forEach(page => {
    console.log(`   • ${page}.html`);
  });

  console.log('\n📋 Missing Hero Image Details:\n');
  missingHeroImages.forEach(({ page, type, image, path }) => {
    console.log(`   ${page}:`);
    console.log(`     - Missing ${type} image: ${image}`);
    console.log(`     - Expected path: ${path}`);
  });

  console.log('\n💡 Action Required:');
  console.log('   1. These background images should be applied via CSS or inline styles');
  console.log('   2. Check if CSS classes for hero sections are properly defined');
  console.log('   3. Verify that the Astro source files include the hero image references\n');

  process.exit(1);
}