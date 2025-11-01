const fs = require('fs');
const path = require('path');
const https = require('https');

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
        console.log(`Downloaded: ${path.basename(filepath)}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

async function findAndDownloadImages() {
  const htmlDir = path.join(__dirname, '..', '_site');
  const imageDir = path.join(__dirname, '..', '_site', 'assets', 'images');
  
  // Find all HTML files
  const htmlFiles = [];
  function findHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filepath = path.join(dir, file);
      const stat = fs.statSync(filepath);
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'assets') {
        findHtmlFiles(filepath);
      } else if (file.endsWith('.html')) {
        htmlFiles.push(filepath);
      }
    }
  }
  
  findHtmlFiles(htmlDir);
  console.log(`Found ${htmlFiles.length} HTML files`);
  
  const allImages = new Set();
  const imageMap = new Map();
  
  // Extract all CDN image URLs from HTML files
  for (const htmlFile of htmlFiles) {
    const content = fs.readFileSync(htmlFile, 'utf8');
    
    // Match various image URL patterns
    const patterns = [
      /https:\/\/cdn\.prod\.website-files\.com\/[^"'\s)]+?\.(jpg|jpeg|png|gif|svg|webp)/gi,
      /https:\/\/assets-global\.website-files\.com\/[^"'\s)]+?\.(jpg|jpeg|png|gif|svg|webp)/gi
    ];
    
    for (const pattern of patterns) {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(url => allImages.add(url));
      }
    }
  }
  
  console.log(`Found ${allImages.size} unique CDN image URLs to download`);
  
  // Download images
  let downloaded = 0;
  for (const imageUrl of allImages) {
    const filename = path.basename(imageUrl).split('?')[0];
    const localPath = path.join(imageDir, filename);
    
    if (!fs.existsSync(localPath)) {
      try {
        await downloadFile(imageUrl, localPath);
        downloaded++;
      } catch (err) {
        console.error(`Failed to download ${imageUrl}:`, err.message);
      }
    }
    
    imageMap.set(imageUrl, `/assets/images/${filename}`);
  }
  
  console.log(`Downloaded ${downloaded} new images`);
  
  // Update HTML files with local paths
  console.log('Updating HTML files with local image paths...');
  for (const htmlFile of htmlFiles) {
    let content = fs.readFileSync(htmlFile, 'utf8');
    let updated = false;
    
    for (const [cdnUrl, localPath] of imageMap.entries()) {
      if (content.includes(cdnUrl)) {
        // Escape special regex characters in URL
        const escapedUrl = cdnUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedUrl, 'g');
        content = content.replace(regex, localPath);
        updated = true;
      }
    }
    
    if (updated) {
      fs.writeFileSync(htmlFile, content);
      console.log(`Updated: ${path.relative(htmlDir, htmlFile)}`);
    }
  }
  
  console.log('Complete!');
}

findAndDownloadImages().catch(console.error);