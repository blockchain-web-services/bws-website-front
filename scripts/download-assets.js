#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Assets to download
const assets = {
  css: [
    'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/css/bws-21ce3b.webflow.shared.9162577b1.min.css'
  ],
  js: [
    'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/js/webflow.schunk.6d83011aa4f34449.js',
    'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/js/webflow.schunk.1ad200ed633c14bf.js',
    'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/js/webflow.schunk.4913f0d9ee368d76.js',
    'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/js/webflow.00c81055.72e38c471fcb0085.js'
  ],
  images: [
    'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/651c58eabcaaed235a87df6d_logo%2BBWS.svg',
    'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6546cb1c2a1b5bd337733b38_logo-for-dark-32x32.png',
    'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6546cade4aea8f975475bc03_logo-for-dark-256x256.png',
    'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/670f916b2f60627d5201850b_shutterstock_1108417201-poster-00001.jpg',
    'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics%20Allocation-letters-black.png',
    'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/670e3109244f671486edfeb7_logo-full-white.svg'
  ],
  json: [
    'https://cdn.prod.website-files.com/6474d385cfec71cb21a9236e_lottie-techplus-x-template.json'
  ]
};

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
        console.log(`Redirect: ${url} -> ${response.headers.location}`);
        return downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${url} -> ${filepath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

async function downloadAllAssets() {
  const baseDir = path.join(__dirname, '..', '_site', 'assets');
  
  // Download CSS
  for (const url of assets.css) {
    const filename = path.basename(url);
    const filepath = path.join(baseDir, 'css', 'webflow.css');
    try {
      await downloadFile(url, filepath);
    } catch (err) {
      console.error(`Failed to download CSS: ${err.message}`);
    }
  }
  
  // Download JS
  for (const url of assets.js) {
    const filename = path.basename(url);
    const filepath = path.join(baseDir, 'js', filename);
    try {
      await downloadFile(url, filepath);
    } catch (err) {
      console.error(`Failed to download JS: ${err.message}`);
    }
  }
  
  // Download images
  for (const url of assets.images) {
    const filename = decodeURIComponent(path.basename(url));
    const filepath = path.join(baseDir, 'images', filename);
    try {
      await downloadFile(url, filepath);
    } catch (err) {
      console.error(`Failed to download image: ${err.message}`);
    }
  }
  
  // Download JSON
  for (const url of assets.json) {
    const filename = path.basename(url);
    const filepath = path.join(baseDir, 'js', filename);
    try {
      await downloadFile(url, filepath);
    } catch (err) {
      console.error(`Failed to download JSON: ${err.message}`);
    }
  }
}

// Also update HTML files to use local assets
function updateHTMLFiles() {
  const htmlDir = path.join(__dirname, '..', '_site');
  
  // Get all HTML files
  function getAllHtmlFiles(dir, files = []) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        getAllHtmlFiles(fullPath, files);
      } else if (item.endsWith('.html')) {
        files.push(fullPath);
      }
    }
    return files;
  }
  
  const htmlFiles = getAllHtmlFiles(htmlDir);
  
  for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Update CSS references
    content = content.replace(
      /https:\/\/cdn\.prod\.website-files\.com\/[^"'\s]+\.css/g,
      '/assets/css/webflow.css'
    );
    
    // Update JS references
    content = content.replace(
      /https:\/\/cdn\.prod\.website-files\.com\/[^"'\s]+\/js\/([^"'\s]+\.js)/g,
      '/assets/js/$1'
    );
    
    // Update image references
    content = content.replace(
      /https:\/\/cdn\.prod\.website-files\.com\/6474d385cfec71cb21a92251\//g,
      '/assets/images/'
    );
    
    // Update other CDN paths
    content = content.replace(
      /\/assets\/cdn\/6474d385cfec71cb21a92251\//g,
      '/assets/images/'
    );
    
    // Keep external scripts as-is (Google fonts, etc)
    
    fs.writeFileSync(file, content);
    console.log(`Updated HTML: ${file}`);
  }
}

async function main() {
  console.log('Downloading assets...');
  await downloadAllAssets();
  
  console.log('\nUpdating HTML files...');
  updateHTMLFiles();
  
  console.log('\nDone! Assets downloaded and HTML files updated.');
}

main().catch(console.error);