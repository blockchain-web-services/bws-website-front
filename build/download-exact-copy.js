#!/usr/bin/env node

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Create directories
const createDirs = () => {
  const dirs = [
    '_site',
    '_site/assets',
    '_site/assets/css', 
    '_site/assets/js',
    '_site/assets/images',
    '_site/assets/fonts',
    '_site/marketplace',
    '_site/articles',
    '_site/industry-content'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Download file helper
const downloadFile = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(filepath);
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        return downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        console.error(`Failed to download ${url}: ${response.statusCode}`);
        resolve(); // Continue even if one file fails
        return;
      }

      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${url}`);
        resolve();
      });
    }).on('error', (err) => {
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      console.error(`Error downloading ${url}:`, err.message);
      resolve(); // Continue even if one file fails
    });

    request.setTimeout(30000, () => {
      request.abort();
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
};

// Parse HTML and extract all external resources
const extractResources = (html) => {
  const resources = {
    css: new Set(),
    js: new Set(),
    images: new Set(),
    fonts: new Set()
  };

  // CSS files
  const cssRegex = /<link[^>]*href=["']([^"']+\.css[^"']*)/gi;
  let match;
  while ((match = cssRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) {
      resources.css.add(match[1]);
    }
  }

  // JavaScript files
  const jsRegex = /<script[^>]*src=["']([^"']+)/gi;
  while ((match = jsRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) {
      resources.js.add(match[1]);
    }
  }

  // Images
  const imgRegex = /<img[^>]*src=["']([^"']+)/gi;
  while ((match = imgRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) {
      resources.images.add(match[1]);
    }
  }

  // Background images in style attributes
  const bgRegex = /url\(["']?([^"')]+)["']?\)/gi;
  while ((match = bgRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) {
      resources.images.add(match[1]);
    }
  }

  // Meta og:image and twitter:image
  const metaRegex = /<meta[^>]*(?:property=["'](?:og|twitter):image["'][^>]*content=["']([^"']+)|content=["']([^"']+)["'][^>]*property=["'](?:og|twitter):image)/gi;
  while ((match = metaRegex.exec(html)) !== null) {
    const url = match[1] || match[2];
    if (url && url.startsWith('http')) {
      resources.images.add(url);
    }
  }

  // Favicon and apple-touch-icon
  const iconRegex = /<link[^>]*(?:rel=["'](?:shortcut icon|apple-touch-icon)["'][^>]*href=["']([^"']+)|href=["']([^"']+)["'][^>]*rel=["'](?:shortcut icon|apple-touch-icon))/gi;
  while ((match = iconRegex.exec(html)) !== null) {
    const url = match[1] || match[2];
    if (url && url.startsWith('http')) {
      resources.images.add(url);
    }
  }

  // Video sources
  const videoRegex = /<(?:source|video)[^>]*src=["']([^"']+)/gi;
  while ((match = videoRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) {
      resources.images.add(match[1]); // Treat videos as images for storage
    }
  }

  // Data attributes with URLs
  const dataUrlRegex = /data-[^=]*=["']([^"']*https?:\/\/[^"']+)/gi;
  while ((match = dataUrlRegex.exec(html)) !== null) {
    const urls = match[1].split(',');
    urls.forEach(url => {
      url = url.trim();
      if (url.startsWith('http')) {
        if (url.match(/\.(mp4|webm|ogv)$/i)) {
          resources.images.add(url);
        } else if (url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
          resources.images.add(url);
        }
      }
    });
  }

  return resources;
};

// Localize URLs in HTML
const localizeHtml = (html, resourceMap) => {
  let localHtml = html;

  // Replace all mapped URLs
  for (const [originalUrl, localPath] of resourceMap.entries()) {
    // Escape special regex characters in URL
    const escapedUrl = originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedUrl, 'g');
    localHtml = localHtml.replace(regex, localPath);
  }

  return localHtml;
};

// Download and process a single page
const processPage = async (url, outputPath) => {
  console.log(`\nProcessing: ${url}`);
  
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      let html = '';
      
      response.on('data', (chunk) => {
        html += chunk;
      });
      
      response.on('end', async () => {
        // Extract resources
        const resources = extractResources(html);
        const resourceMap = new Map();
        
        console.log(`Found ${resources.css.size} CSS, ${resources.js.size} JS, ${resources.images.size} images`);
        
        // Download CSS files
        for (const cssUrl of resources.css) {
          try {
            const url = new URL(cssUrl);
            const filename = path.basename(url.pathname) || 'style.css';
            const localPath = `/assets/css/${filename}`;
            const filePath = path.join('_site', 'assets', 'css', filename);
            
            if (!fs.existsSync(filePath)) {
              await downloadFile(cssUrl, filePath);
            }
            resourceMap.set(cssUrl, localPath);
          } catch (err) {
            console.error(`Error processing CSS ${cssUrl}:`, err.message);
          }
        }
        
        // Download JS files
        for (const jsUrl of resources.js) {
          try {
            const url = new URL(jsUrl);
            let filename = path.basename(url.pathname) || 'script.js';
            
            // Handle Webflow chunks specially
            if (filename.includes('webflow')) {
              filename = filename.replace(/[?&].*/g, '');
            }
            
            const localPath = `/assets/js/${filename}`;
            const filePath = path.join('_site', 'assets', 'js', filename);
            
            if (!fs.existsSync(filePath)) {
              await downloadFile(jsUrl, filePath);
            }
            resourceMap.set(jsUrl, localPath);
          } catch (err) {
            console.error(`Error processing JS ${jsUrl}:`, err.message);
          }
        }
        
        // Download images
        for (const imgUrl of resources.images) {
          try {
            const url = new URL(imgUrl);
            let filename = decodeURIComponent(path.basename(url.pathname));
            
            // Clean filename
            filename = filename.replace(/[?&].*/g, '');
            if (!filename) filename = 'image.jpg';
            
            const localPath = `/assets/images/${filename}`;
            const filePath = path.join('_site', 'assets', 'images', filename);
            
            if (!fs.existsSync(filePath)) {
              await downloadFile(imgUrl, filePath);
            }
            resourceMap.set(imgUrl, localPath);
          } catch (err) {
            console.error(`Error processing image ${imgUrl}:`, err.message);
          }
        }
        
        // Localize HTML
        const localHtml = localizeHtml(html, resourceMap);
        
        // Save HTML
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(outputPath, localHtml);
        console.log(`Saved: ${outputPath}`);
        
        resolve();
      });
    }).on('error', reject);
  });
};

// Main function
const main = async () => {
  createDirs();
  
  const pages = [
    { url: 'https://www.bws.ninja/', output: '_site/index.html' },
    { url: 'https://www.bws.ninja/marketplace/database-immutable', output: '_site/marketplace/database-immutable.html' },
    { url: 'https://www.bws.ninja/marketplace/database-mutable', output: '_site/marketplace/database-mutable.html' },
    { url: 'https://www.bws.ninja/marketplace/ipfs-upload', output: '_site/marketplace/ipfs-upload.html' },
    { url: 'https://www.bws.ninja/marketplace/nft-zeroknwoledge', output: '_site/marketplace/nft-zeroknwoledge.html' },
    { url: 'https://www.bws.ninja/marketplace/nft-gamecube', output: '_site/marketplace/nft-gamecube.html' },
    { url: 'https://www.bws.ninja/marketplace/blockchain-badges', output: '_site/marketplace/blockchain-badges.html' },
    { url: 'https://www.bws.ninja/marketplace/esg-credits', output: '_site/marketplace/esg-credits.html' },
    { url: 'https://www.bws.ninja/marketplace/telegram-xbot', output: '_site/marketplace/telegram-xbot.html' },
    { url: 'https://www.bws.ninja/contact-us', output: '_site/contact-us.html' },
    { url: 'https://www.bws.ninja/legal-notice', output: '_site/legal-notice.html' },
    { url: 'https://www.bws.ninja/privacy-policy', output: '_site/privacy-policy.html' }
  ];
  
  for (const page of pages) {
    try {
      await processPage(page.url, page.output);
    } catch (err) {
      console.error(`Failed to process ${page.url}:`, err.message);
    }
  }
  
  console.log('\n✅ All pages processed!');
};

main().catch(console.error);