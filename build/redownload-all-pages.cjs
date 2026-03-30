const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const DOMAIN = 'www.bws.ninja';
const BASE_URL = `https://${DOMAIN}`;
const OUTPUT_DIR = path.join(__dirname, '..', '_site');

// All pages we need to download
const pagesToDownload = [
  '/',
  '/articles/discover-the-power-of-blockchain-bwss-data-management-solutions',
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
  '/marketplace/ipfs-upload',
  '/marketplace/nft-zeroknwoledge',
  '/marketplace/telegram-xbot',
  '/privacy-policy',
  '/white-paper'
];

// Resource map for localization
const resourceMap = new Map();

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        fetchPage(response.headers.location).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }
      
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

function extractResources(html) {
  const resources = {
    css: new Set(),
    js: new Set(),
    images: new Set(),
    videos: new Set(),
    fonts: new Set(),
    json: new Set()
  };
  
  // CSS files
  const cssRegex = /href=["']([^"']+\.css[^"']*?)["']/gi;
  let match;
  while ((match = cssRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) resources.css.add(match[1]);
  }
  
  // JS files
  const jsRegex = /src=["']([^"']+\.js[^"']*?)["']/gi;
  while ((match = jsRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) resources.js.add(match[1]);
  }
  
  // Images
  const imgRegex = /(?:src|srcset|data-src|poster)=["']([^"']+\.(?:jpg|jpeg|png|gif|svg|webp|ico)[^"']*?)["']/gi;
  while ((match = imgRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) resources.images.add(match[1]);
  }
  
  // Background images
  const bgRegex = /url\(["']?([^"')]+\.(?:jpg|jpeg|png|gif|svg|webp)[^"')]*?)["']?\)/gi;
  while ((match = bgRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) resources.images.add(match[1]);
  }
  
  // Videos
  const videoRegex = /(?:src|data-video-urls)=["']([^"']+\.(?:mp4|webm|ogg)[^"']*?)["']/gi;
  while ((match = videoRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) {
      const urls = match[1].split(',');
      urls.forEach(url => resources.videos.add(url.trim()));
    }
  }
  
  // JSON files
  const jsonRegex = /(?:src|data-src)=["']([^"']+\.json[^"']*?)["']/gi;
  while ((match = jsonRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) resources.json.add(match[1]);
  }
  
  // Fonts
  const fontRegex = /url\(["']?([^"')]+\.(?:woff|woff2|ttf|otf|eot)[^"')]*?)["']?\)/gi;
  while ((match = fontRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) resources.fonts.add(match[1]);
  }
  
  return resources;
}

async function downloadResources(resources) {
  for (const [type, urls] of Object.entries(resources)) {
    if (urls.size === 0) continue;
    
    for (const url of urls) {
      if (resourceMap.has(url)) continue;
      
      try {
        const urlObj = new URL(url);
        const filename = path.basename(urlObj.pathname) || 'index';
        
        let localDir;
        if (type === 'css') localDir = 'css';
        else if (type === 'js') localDir = 'js';
        else if (type === 'json') localDir = 'js';
        else if (type === 'images' || type === 'videos') {
          const pathParts = urlObj.pathname.split('/');
          if (pathParts.length > 2 && pathParts[pathParts.length - 2]) {
            localDir = `images/${pathParts[pathParts.length - 2]}`;
          } else {
            localDir = 'images';
          }
        }
        else if (type === 'fonts') localDir = 'fonts';
        else localDir = 'assets';
        
        const localPath = `/assets/${localDir}/${filename}`;
        const fullPath = path.join(OUTPUT_DIR, 'assets', localDir, filename);
        
        if (!fs.existsSync(fullPath)) {
          await downloadFile(url, fullPath);
          console.log(`    Downloaded: ${filename}`);
        }
        
        resourceMap.set(url, localPath);
      } catch (err) {
        console.error(`    Failed to download ${url}: ${err.message}`);
      }
    }
  }
}

function localizeHtml(html) {
  let localHtml = html;
  
  // Replace all mapped resources
  for (const [originalUrl, localPath] of resourceMap.entries()) {
    const escapedUrl = originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedUrl, 'g');
    localHtml = localHtml.replace(regex, localPath);
  }
  
  // Fix internal links to add .html
  const internalPages = [
    '/about',
    '/articles/discover-the-power-of-blockchain-bwss-data-management-solutions',
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
    '/marketplace/ipfs-upload',
    '/marketplace/nft-zeroknwoledge',
    '/marketplace/telegram-xbot',
    '/privacy-policy',
    '/resources',
    '/white-paper'
  ];
  
  for (const page of internalPages) {
    const patterns = [
      new RegExp(`href="${page}"`, 'g'),
      new RegExp(`href='${page}'`, 'g'),
    ];
    
    for (const pattern of patterns) {
      localHtml = localHtml.replace(pattern, (match) => {
        const quote = match.includes('"') ? '"' : "'";
        return `href=${quote}${page}.html${quote}`;
      });
    }
  }
  
  // Fix root link
  localHtml = localHtml.replace(/href=["']\/["']/g, 'href="/index.html"');
  
  return localHtml;
}

async function downloadAndProcessPage(pagePath) {
  console.log(`\nDownloading: ${pagePath}`);
  
  try {
    // Build the URL - don't add .html for fetching
    const url = `${BASE_URL}${pagePath}`;
    
    console.log(`  Fetching from: ${url}`);
    const html = await fetchPage(url);
    
    // Check if we got actual content
    if (!html || html.length < 1000) {
      console.log(`  Warning: Page seems too small (${html.length} bytes)`);
    }
    
    // Extract and download resources
    console.log(`  Extracting resources...`);
    const resources = extractResources(html);
    
    const totalResources = Object.values(resources).reduce((sum, set) => sum + set.size, 0);
    console.log(`  Found ${totalResources} external resources`);
    
    await downloadResources(resources);
    
    // Localize HTML
    const localizedHtml = localizeHtml(html);
    
    // Save the page
    let outputPath;
    if (pagePath === '/') {
      outputPath = path.join(OUTPUT_DIR, 'index.html');
    } else {
      outputPath = path.join(OUTPUT_DIR, pagePath + '.html');
    }
    
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, localizedHtml);
    console.log(`  ✓ Saved to: ${outputPath}`);
    
    // Check title
    const titleMatch = localizedHtml.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
      console.log(`  Title: "${titleMatch[1]}"`);
    }
    
    return true;
  } catch (err) {
    console.error(`  ✗ Failed: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('=== Re-downloading All Pages with Correct Content ===\n');
  console.log(`Will download ${pagesToDownload.length} pages from ${BASE_URL}\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const page of pagesToDownload) {
    const success = await downloadAndProcessPage(page);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  console.log('\n=== Summary ===');
  console.log(`Successfully downloaded: ${successCount} pages`);
  console.log(`Failed: ${failCount} pages`);
  
  if (failCount === 0) {
    console.log('\n✓ All pages downloaded successfully!');
  }
}

main().catch(console.error);