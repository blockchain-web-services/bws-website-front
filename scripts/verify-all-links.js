const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const SITE_DIR = path.join(__dirname, '..', '_site');

// Track all findings
const allPages = new Set();
const allLinks = new Map(); // link -> [pages that reference it]
const brokenLinks = new Map(); // broken link -> [pages that reference it]
const externalLinks = new Map(); // external link -> [pages that reference it]

function findAllHtmlFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'assets') {
      files.push(...findAllHtmlFiles(fullPath));
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function extractLinksFromHtml(html, pagePath) {
  const links = new Set();
  
  // Extract href links
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match;
  
  while ((match = hrefRegex.exec(html)) !== null) {
    const link = match[1];
    
    // Skip anchors, mailto, tel, and javascript
    if (link.startsWith('#') || 
        link.startsWith('mailto:') || 
        link.startsWith('tel:') || 
        link.startsWith('javascript:')) {
      continue;
    }
    
    links.add(link);
  }
  
  // Also extract src attributes for completeness
  const srcRegex = /src=["']([^"']+)["']/gi;
  while ((match = srcRegex.exec(html)) !== null) {
    const link = match[1];
    if (!link.startsWith('data:')) {
      links.add(link);
    }
  }
  
  return links;
}

function normalizeLink(link, fromPage) {
  // Handle absolute URLs
  if (link.startsWith('http://') || link.startsWith('https://')) {
    return link;
  }
  
  // Handle root-relative URLs
  if (link.startsWith('/')) {
    return link;
  }
  
  // Handle relative URLs
  const dir = path.dirname(fromPage);
  const resolved = path.join(dir, link);
  return '/' + path.relative(SITE_DIR, resolved).replace(/\\/g, '/');
}

function checkLink(link, fromPage) {
  // Check if it's an external link
  if (link.startsWith('http://') || link.startsWith('https://')) {
    return { type: 'external', exists: null };
  }
  
  // For internal links, check if the file exists
  let filePath;
  
  if (link.startsWith('/')) {
    // Root-relative link
    filePath = path.join(SITE_DIR, link);
  } else {
    // Relative link
    const dir = path.dirname(fromPage);
    filePath = path.join(dir, link);
  }
  
  // If it's a directory or no extension, try adding index.html or .html
  if (!path.extname(filePath) || filePath.endsWith('/')) {
    if (filePath.endsWith('/')) {
      filePath = path.join(filePath, 'index.html');
    } else {
      // Try with .html extension first
      const htmlPath = filePath + '.html';
      if (fs.existsSync(htmlPath)) {
        return { type: 'internal', exists: true };
      }
      // Try as directory with index.html
      const indexPath = path.join(filePath, 'index.html');
      if (fs.existsSync(indexPath)) {
        return { type: 'internal', exists: true };
      }
    }
  }
  
  const exists = fs.existsSync(filePath);
  return { type: 'internal', exists };
}

function analyzeLinks() {
  console.log('=== BWS Website Link Verification ===\n');
  
  // Find all HTML files
  const htmlFiles = findAllHtmlFiles(SITE_DIR);
  console.log(`Found ${htmlFiles.length} HTML files\n`);
  
  // Analyze each file
  for (const htmlFile of htmlFiles) {
    const relativePath = path.relative(SITE_DIR, htmlFile);
    allPages.add(relativePath);
    
    const content = fs.readFileSync(htmlFile, 'utf8');
    const links = extractLinksFromHtml(content, htmlFile);
    
    for (const link of links) {
      const normalizedLink = normalizeLink(link, htmlFile);
      
      // Track this link
      if (!allLinks.has(normalizedLink)) {
        allLinks.set(normalizedLink, []);
      }
      allLinks.get(normalizedLink).push(relativePath);
      
      // Check if link is valid
      const checkResult = checkLink(link, htmlFile);
      
      if (checkResult.type === 'external') {
        if (!externalLinks.has(normalizedLink)) {
          externalLinks.set(normalizedLink, []);
        }
        externalLinks.get(normalizedLink).push(relativePath);
      } else if (checkResult.type === 'internal' && !checkResult.exists) {
        if (!brokenLinks.has(normalizedLink)) {
          brokenLinks.set(normalizedLink, []);
        }
        brokenLinks.get(normalizedLink).push(relativePath);
      }
    }
  }
  
  // Report findings
  console.log('=== Summary ===');
  console.log(`Total pages: ${allPages.size}`);
  console.log(`Total unique links: ${allLinks.size}`);
  console.log(`External links: ${externalLinks.size}`);
  console.log(`Broken internal links: ${brokenLinks.size}`);
  
  if (brokenLinks.size > 0) {
    console.log('\n=== Broken Internal Links ===');
    for (const [link, sources] of brokenLinks.entries()) {
      console.log(`\n❌ ${link}`);
      console.log(`   Referenced from:`);
      sources.forEach(source => console.log(`   - ${source}`));
    }
  } else {
    console.log('\n✅ All internal links are valid!');
  }
  
  // Check for external resources that should be localized
  const cdnLinks = Array.from(externalLinks.keys()).filter(link => 
    link.includes('cdn.prod.website-files.com') || 
    link.includes('assets-global.website-files.com')
  );
  
  if (cdnLinks.length > 0) {
    console.log('\n=== External CDN Resources (should be localized) ===');
    cdnLinks.forEach(link => {
      console.log(`\n⚠️  ${link}`);
      const sources = externalLinks.get(link);
      console.log(`   Used in:`);
      sources.forEach(source => console.log(`   - ${source}`));
    });
  }
  
  // List all external links for review
  console.log('\n=== All External Links ===');
  const groupedExternal = {};
  
  for (const [link, sources] of externalLinks.entries()) {
    if (!cdnLinks.includes(link)) {
      try {
        const url = new URL(link);
        const domain = url.hostname;
        if (!groupedExternal[domain]) {
          groupedExternal[domain] = new Set();
        }
        groupedExternal[domain].add(link);
      } catch (e) {
        // Invalid URL
      }
    }
  }
  
  for (const [domain, links] of Object.entries(groupedExternal)) {
    console.log(`\n${domain}:`);
    Array.from(links).slice(0, 5).forEach(link => console.log(`  - ${link}`));
    if (links.size > 5) {
      console.log(`  ... and ${links.size - 5} more`);
    }
  }
  
  // List all pages for verification
  console.log('\n=== All Pages ===');
  const sortedPages = Array.from(allPages).sort();
  sortedPages.forEach(page => console.log(`  ✓ ${page}`));
}

analyzeLinks();