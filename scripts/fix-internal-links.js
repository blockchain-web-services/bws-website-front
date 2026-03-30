const fs = require('fs');
const path = require('path');

const SITE_DIR = path.join(__dirname, '..', '_site');

// Known pages that exist with .html extensions
const knownPages = [
  '/about',
  '/articles/discover-the-power-of-blockchain-bwss-data-management-solutions',
  '/articles/investment-impact-reporting-unlocking-a-sustainable-future',
  '/contact-us',
  '/industries',
  '/industry-content/content-creation',
  '/industry-content/esg',
  '/industry-content/financial-services',
  '/industry-content/legal',
  '/industry-content/retail',
  '/industry-content/supply-chain',
  '/legal-notice',
  '/marketplace/blockchain-badges',
  '/marketplace/database-immutable',
  '/marketplace/database-mutable',
  '/marketplace/ipfs-upload',
  '/marketplace/nft-zeroknwoledge',
  '/marketplace/telegram-xbot',
  '/privacy-policy',
  '/resources',
  '/webflow-init',
  '/white-paper'
];

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

function fixLinksInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // For each known page, replace links to it with .html version
  for (const page of knownPages) {
    // Create regex patterns for different link formats
    const patterns = [
      // href="/page" (without .html)
      new RegExp(`href="${page}"`, 'g'),
      // href='/page' (single quotes)
      new RegExp(`href='${page}'`, 'g'),
    ];
    
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        content = content.replace(pattern, (match) => {
          const quote = match.includes('"') ? '"' : "'";
          return `href=${quote}${page}.html${quote}`;
        });
        modified = true;
      }
    }
  }
  
  // Also fix root link
  content = content.replace(/href=["']\/["']/g, 'href="/index.html"');
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  
  return false;
}

console.log('=== Fixing Internal Links to Use .html Extensions ===\n');

const htmlFiles = findAllHtmlFiles(SITE_DIR);
console.log(`Found ${htmlFiles.length} HTML files to process\n`);

let fixedCount = 0;

for (const file of htmlFiles) {
  const relativePath = path.relative(SITE_DIR, file);
  process.stdout.write(`Processing: ${relativePath}...`);
  
  if (fixLinksInFile(file)) {
    console.log(' ✓ Fixed');
    fixedCount++;
  } else {
    console.log(' - No changes needed');
  }
}

console.log(`\n=== Summary ===`);
console.log(`Fixed links in ${fixedCount} files`);
console.log(`Total files processed: ${htmlFiles.length}`);
