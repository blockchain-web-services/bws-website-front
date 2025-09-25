#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function validateCrawlResults() {
  console.log('\n=== Crawl Results Validation ===\n');
  
  const outputDir = path.join(__dirname, 'output');
  
  // Load all result files
  const crawlReport = JSON.parse(fs.readFileSync(path.join(outputDir, 'crawl-report.json'), 'utf8'));
  const pages = JSON.parse(fs.readFileSync(path.join(outputDir, 'pages.json'), 'utf8'));
  const linkReport = JSON.parse(fs.readFileSync(path.join(outputDir, 'link-report.json'), 'utf8'));
  const templates = JSON.parse(fs.readFileSync(path.join(outputDir, 'templates.json'), 'utf8'));
  
  let passed = 0;
  let failed = 0;
  let warnings = 0;
  
  // Test 1: Check for orphan pages
  console.log('1. Orphan Page Check:');
  if (linkReport.orphanPages.length === 0) {
    console.log('   ✅ No orphan pages found');
    passed++;
  } else {
    console.log(`   ⚠️  ${linkReport.orphanPages.length} orphan pages found:`);
    linkReport.orphanPages.forEach(page => console.log(`      - ${page}`));
    warnings++;
  }
  
  // Test 2: Check all pages have titles
  console.log('\n2. Page Title Check:');
  const pagesWithoutTitles = pages.filter(p => !p.title || p.title.trim() === '');
  if (pagesWithoutTitles.length === 0) {
    console.log('   ✅ All pages have titles');
    passed++;
  } else {
    console.log(`   ❌ ${pagesWithoutTitles.length} pages without titles:`);
    pagesWithoutTitles.forEach(p => console.log(`      - ${p.url}`));
    failed++;
  }
  
  // Test 3: Check all pages have meta descriptions
  console.log('\n3. Meta Description Check:');
  const pagesWithoutDesc = pages.filter(p => !p.metaDescription || p.metaDescription.trim() === '');
  if (pagesWithoutDesc.length === 0) {
    console.log('   ✅ All pages have meta descriptions');
    passed++;
  } else {
    console.log(`   ⚠️  ${pagesWithoutDesc.length} pages without meta descriptions:`);
    pagesWithoutDesc.forEach(p => console.log(`      - ${p.url}`));
    warnings++;
  }
  
  // Test 4: Check for broken internal links
  console.log('\n4. Internal Link Consistency:');
  const allInternalLinks = new Set();
  const allCrawledUrls = new Set(pages.map(p => p.url));
  
  pages.forEach(page => {
    page.links.forEach(link => {
      // Normalize link
      const normalizedLink = link.replace(/#.*$/, '').replace(/\/$/, '');
      if (normalizedLink) {
        allInternalLinks.add(normalizedLink);
      }
    });
  });
  
  const brokenInternalLinks = [];
  allInternalLinks.forEach(link => {
    const normalized = link.replace(/#.*$/, '').replace(/\/$/, '');
    let found = false;
    
    allCrawledUrls.forEach(url => {
      const normalizedUrl = url.replace(/#.*$/, '').replace(/\/$/, '');
      if (normalizedUrl === normalized) {
        found = true;
      }
    });
    
    if (!found && link.includes('bws.ninja')) {
      brokenInternalLinks.push(link);
    }
  });
  
  if (brokenInternalLinks.length === 0) {
    console.log('   ✅ All internal links point to existing pages');
    passed++;
  } else {
    console.log(`   ⚠️  ${brokenInternalLinks.length} potentially broken internal links:`);
    brokenInternalLinks.slice(0, 5).forEach(link => console.log(`      - ${link}`));
    if (brokenInternalLinks.length > 5) {
      console.log(`      ... and ${brokenInternalLinks.length - 5} more`);
    }
    warnings++;
  }
  
  // Test 5: Template coverage
  console.log('\n5. Template Coverage:');
  const totalPages = pages.length;
  Object.entries(templates.templates).forEach(([template, data]) => {
    const percentage = ((data.count / totalPages) * 100).toFixed(1);
    console.log(`   📄 ${template}: ${data.count} pages (${percentage}%)`);
  });
  passed++;
  
  // Test 6: Check for duplicate titles
  console.log('\n6. Duplicate Title Check:');
  const titleMap = {};
  pages.forEach(page => {
    if (page.title) {
      if (!titleMap[page.title]) {
        titleMap[page.title] = [];
      }
      titleMap[page.title].push(page.url);
    }
  });
  
  const duplicateTitles = Object.entries(titleMap).filter(([title, urls]) => urls.length > 1);
  if (duplicateTitles.length === 0) {
    console.log('   ✅ No duplicate page titles found');
    passed++;
  } else {
    console.log(`   ⚠️  ${duplicateTitles.length} duplicate titles found:`);
    duplicateTitles.slice(0, 3).forEach(([title, urls]) => {
      console.log(`      "${title}" used by:`);
      urls.forEach(url => console.log(`         - ${url}`));
    });
    warnings++;
  }
  
  // Test 7: External links check
  console.log('\n7. External Links Summary:');
  const allExternalLinks = new Set();
  pages.forEach(page => {
    page.externalLinks.forEach(link => allExternalLinks.add(link));
  });
  console.log(`   📊 Total unique external links: ${allExternalLinks.size}`);
  
  const commonDomains = {};
  allExternalLinks.forEach(link => {
    try {
      const url = new URL(link);
      const domain = url.hostname;
      commonDomains[domain] = (commonDomains[domain] || 0) + 1;
    } catch (e) {
      // Invalid URL
    }
  });
  
  console.log('   📌 External domains referenced:');
  Object.entries(commonDomains)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([domain, count]) => {
      console.log(`      - ${domain}: ${count} links`);
    });
  passed++;
  
  // Test 8: Page depth analysis
  console.log('\n8. Page Depth Analysis:');
  const depthCounts = {};
  pages.forEach(page => {
    const depth = page.depth || 0;
    depthCounts[depth] = (depthCounts[depth] || 0) + 1;
  });
  
  Object.entries(depthCounts)
    .sort((a, b) => a[0] - b[0])
    .forEach(([depth, count]) => {
      console.log(`   📊 Depth ${depth}: ${count} pages`);
    });
  passed++;
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('VALIDATION SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`⚠️  Warnings: ${warnings}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('\nOverall Status:', failed === 0 ? '✅ PASSED' : '❌ FAILED');
  
  // Key findings
  console.log('\nKEY FINDINGS:');
  console.log(`📄 Total pages crawled: ${pages.length}`);
  console.log(`🔗 Total internal links: ${allInternalLinks.size}`);
  console.log(`🌐 Total external links: ${allExternalLinks.size}`);
  console.log(`📑 Template types identified: ${Object.keys(templates.templates).length}`);
  console.log(`🔍 Most common template: ${Object.entries(templates.templates)
    .sort((a, b) => b[1].count - a[1].count)[0][0]}`);
  
  return {
    passed,
    warnings,
    failed,
    totalPages: pages.length,
    templates: templates.templates,
    orphanPages: linkReport.orphanPages
  };
}

// Run if called directly
if (require.main === module) {
  validateCrawlResults();
}

module.exports = validateCrawlResults;