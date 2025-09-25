const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');
const { URL } = require('url');

class WebsiteCrawler {
  constructor(config = {}) {
    this.startUrl = config.startUrl || 'https://www.bws.ninja/index.html';
    this.baseUrl = new URL(this.startUrl).origin;
    this.maxDepth = config.maxDepth || 5;
    this.visited = new Set();
    this.queue = [];
    this.pages = [];
    this.linkGraph = new Map();
    this.errors = [];
  }

  async crawl() {
    console.log(`Starting crawl from: ${this.startUrl}`);
    this.queue.push({ url: this.startUrl, depth: 0 });
    
    while (this.queue.length > 0) {
      const { url, depth } = this.queue.shift();
      
      if (this.visited.has(url) || depth > this.maxDepth) {
        continue;
      }
      
      try {
        console.log(`Crawling: ${url} (depth: ${depth})`);
        const pageData = await this.fetchPage(url);
        
        if (pageData) {
          const links = this.extractLinks(pageData.html, url);
          this.linkGraph.set(url, links);
          
          // Add page data
          this.pages.push({
            url,
            title: pageData.title,
            metaDescription: pageData.metaDescription,
            links: links.internal,
            externalLinks: links.external,
            assets: pageData.assets,
            depth,
            timestamp: new Date().toISOString()
          });
          
          // Queue internal links
          links.internal.forEach(link => {
            if (!this.visited.has(link) && this.shouldCrawl(link)) {
              this.queue.push({ url: link, depth: depth + 1 });
            }
          });
          
          this.visited.add(url);
        }
      } catch (error) {
        console.error(`Error crawling ${url}:`, error.message);
        this.errors.push({ url, error: error.message });
      }
      
      // Rate limiting
      await this.delay(500);
    }
    
    return this.generateReport();
  }

  async fetchPage(url) {
    try {
      const fetch = (await import('node-fetch')).default;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'BWS-Crawler/1.0'
        },
        timeout: 10000
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      return {
        html,
        title: $('title').text() || '',
        metaDescription: $('meta[name="description"]').attr('content') || '',
        assets: this.extractAssets($, url)
      };
    } catch (error) {
      throw error;
    }
  }

  extractLinks(html, baseUrl) {
    const $ = cheerio.load(html);
    const links = {
      internal: new Set(),
      external: new Set(),
      anchors: new Set()
    };
    
    $('a[href]').each((_, element) => {
      const href = $(element).attr('href');
      
      if (!href) return;
      
      if (href.startsWith('#')) {
        links.anchors.add(href);
      } else if (href.startsWith('http://') || href.startsWith('https://')) {
        const url = new URL(href);
        if (url.origin === this.baseUrl) {
          links.internal.add(href);
        } else {
          links.external.add(href);
        }
      } else if (href.startsWith('/')) {
        links.internal.add(new URL(href, baseUrl).href);
      } else if (!href.startsWith('mailto:') && !href.startsWith('tel:')) {
        links.internal.add(new URL(href, baseUrl).href);
      }
    });
    
    return {
      internal: Array.from(links.internal),
      external: Array.from(links.external),
      anchors: Array.from(links.anchors)
    };
  }

  extractAssets($, baseUrl) {
    const assets = {
      images: [],
      stylesheets: [],
      scripts: [],
      fonts: []
    };
    
    // Images
    $('img[src]').each((_, element) => {
      const src = $(element).attr('src');
      if (src && !src.startsWith('data:')) {
        assets.images.push(this.resolveUrl(src, baseUrl));
      }
    });
    
    // Stylesheets
    $('link[rel="stylesheet"]').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        assets.stylesheets.push(this.resolveUrl(href, baseUrl));
      }
    });
    
    // Scripts
    $('script[src]').each((_, element) => {
      const src = $(element).attr('src');
      if (src) {
        assets.scripts.push(this.resolveUrl(src, baseUrl));
      }
    });
    
    // Fonts (from preconnect and preload)
    $('link[rel="preload"][as="font"], link[rel="preconnect"]').each((_, element) => {
      const href = $(element).attr('href');
      if (href && (href.includes('font') || href.includes('typekit'))) {
        assets.fonts.push(href);
      }
    });
    
    return assets;
  }

  resolveUrl(url, baseUrl) {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('//')) {
      return 'https:' + url;
    }
    return new URL(url, baseUrl).href;
  }

  shouldCrawl(url) {
    // Skip certain file types
    const skipExtensions = ['.pdf', '.zip', '.exe', '.dmg', '.mp4', '.mp3'];
    const urlLower = url.toLowerCase();
    
    for (const ext of skipExtensions) {
      if (urlLower.endsWith(ext)) {
        return false;
      }
    }
    
    // Skip certain patterns
    const skipPatterns = [
      /\/cdn\.prod\.website-files\.com\//,
      /\/#/,
      /\/wp-admin\//,
      /\/admin\//
    ];
    
    for (const pattern of skipPatterns) {
      if (pattern.test(url)) {
        return false;
      }
    }
    
    // Only crawl same domain
    try {
      const urlObj = new URL(url);
      return urlObj.origin === this.baseUrl;
    } catch {
      return false;
    }
  }

  generateReport() {
    // Find orphan pages
    const allLinkedPages = new Set();
    this.linkGraph.forEach((links) => {
      links.internal.forEach(link => allLinkedPages.add(link));
    });
    
    const orphanPages = [];
    this.visited.forEach(page => {
      if (page !== this.startUrl && !allLinkedPages.has(page)) {
        orphanPages.push(page);
      }
    });
    
    // Count statistics
    const stats = {
      totalPages: this.pages.length,
      totalLinks: 0,
      totalExternalLinks: 0,
      totalAssets: {
        images: 0,
        stylesheets: 0,
        scripts: 0
      }
    };
    
    this.pages.forEach(page => {
      stats.totalLinks += page.links.length;
      stats.totalExternalLinks += page.externalLinks.length;
      stats.totalAssets.images += page.assets.images.length;
      stats.totalAssets.stylesheets += page.assets.stylesheets.length;
      stats.totalAssets.scripts += page.assets.scripts.length;
    });
    
    return {
      crawlDate: new Date().toISOString(),
      startUrl: this.startUrl,
      stats,
      orphanPages,
      errors: this.errors,
      pages: this.pages,
      linkGraph: Array.from(this.linkGraph.entries()).map(([source, targets]) => ({
        source,
        targets
      }))
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async saveResults(report) {
    const outputDir = path.join(__dirname, 'output');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Save full report
    await fs.writeFile(
      path.join(outputDir, 'crawl-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    // Save pages list
    await fs.writeFile(
      path.join(outputDir, 'pages.json'),
      JSON.stringify(report.pages, null, 2)
    );
    
    // Save link report
    await fs.writeFile(
      path.join(outputDir, 'link-report.json'),
      JSON.stringify({
        orphanPages: report.orphanPages,
        linkGraph: report.linkGraph,
        errors: report.errors
      }, null, 2)
    );
    
    console.log(`\nCrawl complete!`);
    console.log(`- Total pages: ${report.stats.totalPages}`);
    console.log(`- Orphan pages: ${report.orphanPages.length}`);
    console.log(`- Errors: ${report.errors.length}`);
    console.log(`\nResults saved to: ${outputDir}`);
  }
}

// Run the crawler
async function main() {
  const crawler = new WebsiteCrawler({
    startUrl: 'https://www.bws.ninja/index.html',
    maxDepth: 5
  });
  
  try {
    const report = await crawler.crawl();
    await crawler.saveResults(report);
  } catch (error) {
    console.error('Crawler failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = WebsiteCrawler;