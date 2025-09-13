#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Simple HTML parser without external dependencies
function extractLinks(html, baseUrl) {
  const links = {
    internal: [],
    external: [],
    anchors: []
  };
  
  // Extract href attributes with regex
  const hrefRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
  let match;
  
  while ((match = hrefRegex.exec(html)) !== null) {
    const href = match[1];
    
    if (href.startsWith('#')) {
      links.anchors.push(href);
    } else if (href.startsWith('http://') || href.startsWith('https://')) {
      try {
        const url = new URL(href);
        if (url.hostname === 'www.bws.ninja' || url.hostname === 'bws.ninja') {
          links.internal.push(href);
        } else {
          links.external.push(href);
        }
      } catch (e) {
        // Invalid URL
      }
    } else if (href.startsWith('/')) {
      links.internal.push(new URL(href, baseUrl).href);
    } else if (!href.startsWith('mailto:') && !href.startsWith('tel:')) {
      try {
        links.internal.push(new URL(href, baseUrl).href);
      } catch (e) {
        // Invalid URL
      }
    }
  }
  
  return links;
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : '';
}

function extractMetaDescription(html) {
  const match = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  return match ? match[1].trim() : '';
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      headers: {
        'User-Agent': 'BWS-Crawler/1.0',
        'Accept': 'text/html'
      }
    };
    
    https.get(options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Handle redirect
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          fetchPage(redirectUrl).then(resolve).catch(reject);
          return;
        }
      }
      
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          html: data,
          title: extractTitle(data),
          metaDescription: extractMetaDescription(data)
        });
      });
    }).on('error', reject);
  });
}

async function crawl() {
  const startUrl = 'https://www.bws.ninja/';
  const visited = new Set();
  const queue = [{ url: startUrl, depth: 0 }];
  const pages = [];
  const linkGraph = new Map();
  const errors = [];
  const maxPages = 30; // Limit pages to crawl
  const maxDepth = 2;  // Limit depth
  
  console.log('Starting crawler...');
  console.log(`Start URL: ${startUrl}`);
  console.log(`Max pages: ${maxPages}`);
  console.log(`Max depth: ${maxDepth}`);
  console.log('---');
  
  while (queue.length > 0 && pages.length < maxPages) {
    const { url, depth } = queue.shift();
    
    if (visited.has(url) || depth > maxDepth) {
      continue;
    }
    
    try {
      console.log(`[${pages.length + 1}/${maxPages}] Crawling: ${url} (depth: ${depth})`);
      
      const pageData = await fetchPage(url);
      const links = extractLinks(pageData.html, url);
      
      visited.add(url);
      linkGraph.set(url, links);
      
      pages.push({
        url,
        title: pageData.title,
        metaDescription: pageData.metaDescription,
        links: links.internal,
        externalLinks: links.external,
        depth,
        timestamp: new Date().toISOString()
      });
      
      // Queue new internal links
      for (const link of links.internal) {
        if (!visited.has(link) && !queue.some(q => q.url === link)) {
          // Only crawl bws.ninja domain
          if (link.includes('bws.ninja') && !link.includes('cdn.')) {
            queue.push({ url: link, depth: depth + 1 });
          }
        }
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`  Error: ${error.message}`);
      errors.push({ url, error: error.message });
    }
  }
  
  // Find orphan pages
  const allLinkedPages = new Set();
  linkGraph.forEach((links) => {
    links.internal.forEach(link => allLinkedPages.add(link));
  });
  
  const orphanPages = [];
  visited.forEach(page => {
    if (page !== startUrl && !allLinkedPages.has(page)) {
      orphanPages.push(page);
    }
  });
  
  // Generate report
  const report = {
    crawlDate: new Date().toISOString(),
    startUrl,
    stats: {
      totalPages: pages.length,
      orphanPages: orphanPages.length,
      errors: errors.length
    },
    orphanPages,
    errors,
    pages,
    linkGraph: Array.from(linkGraph.entries()).map(([source, targets]) => ({
      source,
      targets
    }))
  };
  
  // Save results
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(outputDir, 'crawl-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  fs.writeFileSync(
    path.join(outputDir, 'pages.json'),
    JSON.stringify(report.pages, null, 2)
  );
  
  fs.writeFileSync(
    path.join(outputDir, 'link-report.json'),
    JSON.stringify({
      orphanPages: report.orphanPages,
      linkGraph: report.linkGraph,
      errors: report.errors
    }, null, 2)
  );
  
  console.log('\n=== Crawl Complete ===');
  console.log(`Total pages crawled: ${report.stats.totalPages}`);
  console.log(`Orphan pages found: ${report.stats.orphanPages}`);
  console.log(`Errors encountered: ${report.stats.errors}`);
  console.log(`\nResults saved to: ${outputDir}`);
  
  return report;
}

// Run if called directly
if (require.main === module) {
  crawl().catch(error => {
    console.error('Crawler failed:', error);
    process.exit(1);
  });
}

module.exports = crawl;