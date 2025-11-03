const https = require('https');
const { URL } = require('url');

const DOMAIN = 'www.bws.ninja';
const BASE_URL = `https://${DOMAIN}`;
const visited = new Set();
const toVisit = new Set(['/']);
const allPages = new Set();

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

function extractLinks(html, baseUrl) {
  const links = new Set();
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match;
  
  while ((match = hrefRegex.exec(html)) !== null) {
    const link = match[1];
    if (link && !link.startsWith('#') && !link.startsWith('mailto:') && 
        !link.startsWith('tel:') && !link.startsWith('javascript:')) {
      try {
        const url = new URL(link, baseUrl);
        if (url.hostname === DOMAIN) {
          links.add(url.pathname);
        }
      } catch (e) {
        // Invalid URL
      }
    }
  }
  
  return links;
}

async function crawl() {
  console.log('Crawling www.bws.ninja to find all pages...\n');
  
  while (toVisit.size > 0) {
    const path = toVisit.values().next().value;
    toVisit.delete(path);
    
    if (visited.has(path)) continue;
    visited.add(path);
    
    // Skip non-page resources
    if (path.includes('.') && !path.endsWith('.html')) {
      continue;
    }
    
    console.log(`Checking: ${path}`);
    
    try {
      // Try without .html first
      let url = `${BASE_URL}${path}`;
      let html;
      
      try {
        html = await fetchPage(url);
        allPages.add(path);
      } catch (err) {
        // If it fails and doesn't end with .html, try with .html
        if (!path.endsWith('.html')) {
          try {
            url = `${BASE_URL}${path}.html`;
            html = await fetchPage(url);
            allPages.add(path);
          } catch (err2) {
            console.log(`  Not found: ${path}`);
            continue;
          }
        } else {
          console.log(`  Not found: ${path}`);
          continue;
        }
      }
      
      // Extract links from this page
      const links = extractLinks(html, url);
      for (const link of links) {
        if (!visited.has(link)) {
          toVisit.add(link);
        }
      }
      
    } catch (err) {
      console.log(`  Error: ${err.message}`);
    }
  }
  
  console.log('\n=== All Live Pages Found ===');
  const sortedPages = Array.from(allPages).sort();
  sortedPages.forEach(page => console.log(page));
  console.log(`\nTotal: ${allPages.size} pages`);
}

crawl().catch(console.error);
