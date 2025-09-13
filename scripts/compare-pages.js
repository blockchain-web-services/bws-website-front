const fs = require('fs');
const path = require('path');

const livePages = [
  '/',
  '/articles/discover-the-power-of-blockchain-bwss-data-management-solutions',
  '/articles/embrace-sustainability-with-esg-credits-bws-solution',
  '/articles/investment-impact-reporting-unlocking-a-sustainable-future',
  '/contact-us',
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
  '/marketplace/esg-credits',
  '/marketplace/ipfs-upload',
  '/marketplace/nft-gamecube',
  '/marketplace/nft-zeroknwoledge',
  '/marketplace/telegram-xbot',
  '/privacy-policy',
  '/white-paper'
];

const SITE_DIR = path.join(__dirname, '..', '_site');

console.log('Checking which pages we have locally...\n');

const missing = [];
const existing = [];

for (const page of livePages) {
  let localPath;
  
  if (page === '/') {
    localPath = path.join(SITE_DIR, 'index.html');
  } else {
    localPath = path.join(SITE_DIR, page + '.html');
  }
  
  if (fs.existsSync(localPath)) {
    existing.push(page);
  } else {
    missing.push(page);
  }
}

console.log(`✓ Have ${existing.length} pages locally`);
console.log(`✗ Missing ${missing.length} pages\n`);

if (missing.length > 0) {
  console.log('Missing pages:');
  missing.forEach(page => console.log(`  - ${page}`));
}

// Also check for extra pages we have that aren't on live
const findHtmlFiles = (dir, base = '') => {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'assets') {
      files.push(...findHtmlFiles(fullPath, path.join(base, item)));
    } else if (item.endsWith('.html')) {
      const relativePath = path.join(base, item);
      let urlPath = '/' + relativePath.replace(/\\/g, '/');
      if (urlPath.endsWith('/index.html')) {
        urlPath = urlPath.slice(0, -11) || '/';
      } else if (urlPath.endsWith('.html')) {
        urlPath = urlPath.slice(0, -5);
      }
      files.push(urlPath);
    }
  }
  
  return files;
};

const localFiles = findHtmlFiles(SITE_DIR);
const extraPages = localFiles.filter(p => !livePages.includes(p));

if (extraPages.length > 0) {
  console.log('\nExtra pages we have locally (not on live site):');
  extraPages.forEach(page => console.log(`  + ${page}`));
}
