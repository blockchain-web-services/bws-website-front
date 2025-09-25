#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const crawlResults = path.join(__dirname, 'crawler', 'output', 'crawl-report.json');

if (!fs.existsSync(crawlResults)) {
  console.error('❌ No crawl results found. Run npm run crawl first.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(crawlResults, 'utf-8'));

// Template mapping
const templateMap = {
  homepage: 'layouts/homepage.njk',
  'marketplace-solution': 'layouts/marketplace-solution.njk',
  'industry-content': 'layouts/industry-content.njk',
  article: 'layouts/article.njk',
  legal: 'layouts/legal.njk',
  contact: 'layouts/contact.njk'
};

// Generate pages
let pagesCreated = 0;

data.pages.forEach(page => {
  // Clean URL - remove protocol and domain
  let pageUrl = page.url;
  if (pageUrl.startsWith('http://') || pageUrl.startsWith('https://')) {
    const url = new URL(pageUrl);
    pageUrl = url.pathname + url.hash;
  }
  
  if (pageUrl === '/' || pageUrl.includes('#')) {
    // Skip index and anchor links
    return;
  }
  
  const template = page.template || 'homepage';
  const layout = templateMap[template] || 'layouts/base.njk';
  
  // Create page content
  const frontMatter = `---
layout: ${layout}
title: ${JSON.stringify(page.title || 'Untitled')}
description: ${JSON.stringify(page.meta?.description || '')}
permalink: ${pageUrl}${page.url.endsWith('/') ? 'index.html' : '.html'}
`;
  
  // Add template-specific data
  if (template === 'marketplace-solution') {
    const frontMatterData = frontMatter + `solution:
  name: ${JSON.stringify(page.title || 'Solution')}
  tagline: ${JSON.stringify(page.meta?.description || '')}
  slug: ${JSON.stringify(path.basename(pageUrl))}
`;
    const content = frontMatterData + '---\n';
    
    // Create file path
    const filePath = path.join(srcDir, pageUrl.replace(/^\//, '') + '.njk');
    const dir = path.dirname(filePath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content);
    pagesCreated++;
    
  } else if (template === 'industry-content') {
    const frontMatterData = frontMatter + `industry:
  name: ${JSON.stringify(page.title || 'Industry')}
  description: ${JSON.stringify(page.meta?.description || '')}
  slug: ${JSON.stringify(path.basename(pageUrl))}
`;
    const content = frontMatterData + '---\n';
    
    // Create file path
    const filePath = path.join(srcDir, pageUrl.replace(/^\//, '') + '.njk');
    const dir = path.dirname(filePath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content);
    pagesCreated++;
    
  } else if (template === 'contact') {
    const content = frontMatter + `zapierWebhookId: "YOUR_WEBHOOK_ID"
---\n`;
    
    // Create file path
    const filePath = path.join(srcDir, pageUrl.replace(/^\//, '') + '.njk');
    const dir = path.dirname(filePath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content);
    pagesCreated++;
    
  } else {
    // Generic page
    const content = frontMatter + '---\n## ' + (page.title || 'Page Content') + '\n\nContent coming soon.\n';
    
    // Create file path
    const filePath = path.join(srcDir, pageUrl.replace(/^\//, '') + '.njk');
    const dir = path.dirname(filePath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content);
    pagesCreated++;
  }
});

console.log(`✅ Generated ${pagesCreated} pages`);
console.log('\nPages created in: ' + srcDir);
console.log('\nRun "npm run build" to build the site');