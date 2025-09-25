const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const DOMAIN = 'www.bws.ninja';
const BASE_URL = `https://${DOMAIN}`;
const OUTPUT_DIR = path.join(__dirname, '..', '_site');

// Set to track discovered pages
const discoveredPages = new Set();
const downloadedPages = new Set();
const failedPages = new Set();

// Resource map for localization
const resourceMap = new Map();

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
        fs.unlinkSync(filepath);
        downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        fetchPage(response.headers.location).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function tryFetchPage(baseUrl, path) {
  // Try URL as-is first (without .html)
  const urlWithoutHtml = `${baseUrl}${path}`;
  
  return fetchPage(urlWithoutHtml).catch(() => {
    // If that fails and doesn't already end with .html, try with .html
    if (!path.endsWith('.html')) {
      const urlWithHtml = `${baseUrl}${path}.html`;
      return fetchPage(urlWithHtml);
    }
    throw new Error(`Failed to fetch ${path}`);
  });
}

function extractLinksFromHtml(html, baseUrl) {
  const links = new Set();
  
  // Extract href links
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    const link = match[1];
    if (link && !link.startsWith('#') && !link.startsWith('mailto:') && !link.startsWith('tel:')) {
      try {
        const url = new URL(link, baseUrl);
        if (url.hostname === DOMAIN || url.hostname === `www.${DOMAIN}`) {
          // Keep original pathname but normalize for storage
          let pathname = url.pathname;
          if (pathname === '/') {
            pathname = '/index.html';
          } else if (!pathname.includes('.')) {
            // For paths without extension, we'll store with .html
            pathname = pathname.endsWith('/') ? pathname + 'index.html' : pathname + '.html';
          }
          links.add(pathname);
        }
      } catch (e) {
        // Invalid URL, skip
      }
    }
  }
  
  return links;
}

function extractResourcesFromHtml(html) {
  const resources = {
    css: new Set(),
    js: new Set(),
    images: new Set(),
    videos: new Set(),
    fonts: new Set(),
    json: new Set()
  };
  
  // CSS files
  const cssRegex = /href=["']([^"']+\.css[^"']*)["']/gi;
  let match;
  while ((match = cssRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) resources.css.add(match[1]);
  }
  
  // JS files
  const jsRegex = /src=["']([^"']+\.js[^"']*)["']/gi;
  while ((match = jsRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) resources.js.add(match[1]);
  }
  
  // Images
  const imgRegex = /(?:src|srcset|data-src|poster)=["']([^"']+\.(?:jpg|jpeg|png|gif|svg|webp|ico)[^"']*)["']/gi;
  while ((match = imgRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) resources.images.add(match[1]);
  }
  
  // Also check background images in styles
  const bgRegex = /url\(["']?([^"')]+\.(?:jpg|jpeg|png|gif|svg|webp)[^"')]*)["']?\)/gi;
  while ((match = bgRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) resources.images.add(match[1]);
  }
  
  // Videos
  const videoRegex = /(?:src|data-video-urls)=["']([^"']+\.(?:mp4|webm|ogg)[^"']*)["']/gi;
  while ((match = videoRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) {
      // Handle comma-separated video URLs
      const urls = match[1].split(',');
      urls.forEach(url => resources.videos.add(url.trim()));
    }
  }
  
  // JSON files (like Lottie)
  const jsonRegex = /(?:src|data-src)=["']([^"']+\.json[^"']*)["']/gi;
  while ((match = jsonRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) resources.json.add(match[1]);
  }
  
  // Fonts
  const fontRegex = /url\(["']?([^"')]+\.(?:woff|woff2|ttf|otf|eot)[^"')]*)["']?\)/gi;
  while ((match = fontRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) resources.fonts.add(match[1]);
  }
  
  return resources;
}

async function downloadResources(resources) {
  console.log('Downloading resources...');
  
  for (const [type, urls] of Object.entries(resources)) {
    if (urls.size === 0) continue;
    
    console.log(`  ${type}: ${urls.size} files`);
    for (const url of urls) {
      if (resourceMap.has(url)) continue;
      
      try {
        const urlObj = new URL(url);
        const filename = path.basename(urlObj.pathname);
        
        let localDir;
        if (type === 'css') localDir = 'css';
        else if (type === 'js' || type === 'json') localDir = 'js';
        else if (type === 'images' || type === 'videos') {
          // Preserve subdirectory structure for images/videos
          const pathParts = urlObj.pathname.split('/');
          if (pathParts.length > 2) {
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
  let localizedHtml = html;
  
  // Replace all mapped resources
  for (const [originalUrl, localPath] of resourceMap.entries()) {
    const escapedUrl = originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedUrl, 'g');
    localizedHtml = localizedHtml.replace(regex, localPath);
  }
  
  // Also handle URL-encoded versions
  for (const [originalUrl, localPath] of resourceMap.entries()) {
    const encodedUrl = originalUrl.replace(/\//g, '%2F');
    const escapedUrl = encodedUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedUrl, 'g');
    localizedHtml = localizedHtml.replace(regex, localPath);
  }
  
  return localizedHtml;
}

async function downloadAndProcessPage(pagePath) {
  if (downloadedPages.has(pagePath)) {
    return;
  }
  
  console.log(`\nProcessing: ${pagePath}`);
  
  try {
    // Remove .html extension if present for fetching
    let fetchPath = pagePath;
    if (pagePath.endsWith('.html') && pagePath !== '/index.html') {
      fetchPath = pagePath.slice(0, -5);
    }
    
    const html = await tryFetchPage(BASE_URL, fetchPath);
    
    // Extract all links from this page
    const links = extractLinksFromHtml(html, url);
    links.forEach(link => discoveredPages.add(link));
    
    // Extract all resources
    const resources = extractResourcesFromHtml(html);
    await downloadResources(resources);
    
    // Localize HTML
    const localizedHtml = localizeHtml(html);
    
    // Save the page
    const outputPath = path.join(OUTPUT_DIR, pagePath);
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, localizedHtml);
    downloadedPages.add(pagePath);
    console.log(`  ✓ Saved: ${pagePath}`);
    
  } catch (err) {
    console.error(`  ✗ Failed: ${err.message}`);
    failedPages.add(pagePath);
  }
}

async function discoverAllPages() {
  console.log('Starting page discovery from sitemap and homepage...\n');
  
  // Start with known pages
  const initialPages = [
    '/index.html',
    '/contact-us.html',
    '/legal-notice.html',
    '/privacy-policy.html',
    '/white-paper.html'
  ];
  
  initialPages.forEach(page => discoveredPages.add(page));
  
  // Try to fetch sitemap
  try {
    const sitemapUrl = `${BASE_URL}/sitemap.xml`;
    const sitemap = await fetchPage(sitemapUrl);
    
    // Extract URLs from sitemap
    const urlRegex = /<loc>([^<]+)<\/loc>/gi;
    let match;
    while ((match = urlRegex.exec(sitemap)) !== null) {
      try {
        const url = new URL(match[1]);
        if (url.hostname === DOMAIN) {
          let pathname = url.pathname;
          if (pathname === '/') {
            pathname = '/index.html';
          } else if (!pathname.endsWith('.html') && !pathname.includes('.')) {
            pathname = pathname.endsWith('/') ? pathname + 'index.html' : pathname + '.html';
          }
          discoveredPages.add(pathname);
        }
      } catch (e) {
        // Invalid URL
      }
    }
    console.log(`Found ${discoveredPages.size} pages in sitemap`);
  } catch (err) {
    console.log('No sitemap found, will discover pages through crawling');
  }
  
  // Process all discovered pages
  let previousCount = 0;
  while (discoveredPages.size > previousCount) {
    previousCount = discoveredPages.size;
    
    const pagesToProcess = Array.from(discoveredPages).filter(p => !downloadedPages.has(p));
    
    for (const page of pagesToProcess) {
      await downloadAndProcessPage(page);
    }
    
    console.log(`\nProgress: ${downloadedPages.size} downloaded, ${discoveredPages.size} discovered`);
  }
}

async function verifyAllLinks() {
  console.log('\n=== Verifying all internal links ===\n');
  
  const brokenLinks = new Map();
  
  for (const pagePath of downloadedPages) {
    const fullPath = path.join(OUTPUT_DIR, pagePath);
    const html = fs.readFileSync(fullPath, 'utf8');
    const links = extractLinksFromHtml(html, `${BASE_URL}${pagePath}`);
    
    for (const link of links) {
      const linkPath = path.join(OUTPUT_DIR, link);
      if (!fs.existsSync(linkPath)) {
        if (!brokenLinks.has(link)) {
          brokenLinks.set(link, []);
        }
        brokenLinks.get(link).push(pagePath);
      }
    }
  }
  
  if (brokenLinks.size > 0) {
    console.log('Found broken/missing links:');
    for (const [link, sources] of brokenLinks.entries()) {
      console.log(`  ${link}`);
      console.log(`    Referenced from: ${sources.join(', ')}`);
      
      // Try to download the missing page
      if (!failedPages.has(link)) {
        await downloadAndProcessPage(link);
      }
    }
  } else {
    console.log('✓ All internal links verified successfully!');
  }
  
  return brokenLinks.size === 0;
}

async function main() {
  console.log('=== BWS Website Complete Download ===\n');
  
  // Discover and download all pages
  await discoverAllPages();
  
  // Verify all links
  let allLinksValid = false;
  let attempts = 0;
  
  while (!allLinksValid && attempts < 3) {
    attempts++;
    console.log(`\n=== Verification attempt ${attempts} ===`);
    allLinksValid = await verifyAllLinks();
  }
  
  // Final report
  console.log('\n=== Final Report ===');
  console.log(`Total pages discovered: ${discoveredPages.size}`);
  console.log(`Successfully downloaded: ${downloadedPages.size}`);
  console.log(`Failed downloads: ${failedPages.size}`);
  
  if (failedPages.size > 0) {
    console.log('\nFailed pages:');
    failedPages.forEach(page => console.log(`  - ${page}`));
  }
  
  console.log('\nDownloaded pages:');
  const sortedPages = Array.from(downloadedPages).sort();
  sortedPages.forEach(page => console.log(`  ✓ ${page}`));
  
  console.log('\n✓ Complete!');
}

main().catch(console.error);