const fs = require('fs');
const path = require('path');
const https = require('https');

// Cloudfront resources to localize
const cloudfrontMappings = {
  'https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=6474d385cfec71cb21a92251': '/assets/js/jquery-3.5.1.min.js'
};

// Ensure directories exist
const jsDir = '_site/assets/js';
if (!fs.existsSync(jsDir)) {
  fs.mkdirSync(jsDir, { recursive: true });
}

// Function to download a file
function downloadFile(url, localPath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join('_site', localPath);

    // Skip if file already exists
    if (fs.existsSync(fullPath)) {
      console.log(`✓ Already exists: ${localPath}`);
      resolve();
      return;
    }

    const file = fs.createWriteStream(fullPath);

    // Remove query parameters for download
    const cleanUrl = url.split('?')[0];

    https.get(cleanUrl, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${localPath}`);
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        const redirectUrl = response.headers.location;
        console.log(`  Following redirect to: ${redirectUrl}`);
        https.get(redirectUrl, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`✓ Downloaded: ${localPath}`);
            resolve();
          });
        });
      } else {
        console.log(`✗ Failed to download (${response.statusCode}): ${url}`);
        resolve();
      }
    }).on('error', (err) => {
      console.log(`✗ Error downloading ${url}: ${err.message}`);
      resolve();
    });
  });
}

// Function to replace Cloudfront URLs in HTML files
function replaceInHtmlFiles() {
  const htmlFiles = [];

  // Find all HTML files
  function findHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        findHtmlFiles(fullPath);
      } else if (file.endsWith('.html')) {
        htmlFiles.push(fullPath);
      }
    });
  }

  findHtmlFiles('_site');

  let totalReplacements = 0;

  // Replace Cloudfront URLs in each HTML file
  htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    Object.entries(cloudfrontMappings).forEach(([cloudfrontUrl, localPath]) => {
      // Count occurrences before replacement
      const occurrences = (content.match(new RegExp(cloudfrontUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;

      if (occurrences > 0) {
        content = content.replace(new RegExp(cloudfrontUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), localPath);
        modified = true;
        totalReplacements += occurrences;
        console.log(`  Replaced ${occurrences} occurrence(s) in ${path.relative('_site', file)}`);
      }
    });

    if (modified) {
      fs.writeFileSync(file, content);
    }
  });

  return totalReplacements;
}

// Main execution
async function main() {
  console.log('Starting Cloudfront resource localization...\n');

  // Download all resources
  console.log('Downloading Cloudfront resources...');
  const downloads = Object.entries(cloudfrontMappings).map(([url, localPath]) =>
    downloadFile(url, localPath)
  );

  await Promise.all(downloads);

  console.log('\nReplacing Cloudfront URLs in HTML files...');
  const totalReplacements = replaceInHtmlFiles();

  console.log(`\n✓ Localization complete! Replaced ${totalReplacements} Cloudfront references.`);

  // Final check
  const { execSync } = require('child_process');
  const remaining = execSync('grep -r "cloudfront.net" _site/ --include="*.html" | wc -l', { encoding: 'utf8' }).trim();
  console.log(`\nRemaining Cloudfront references: ${remaining}`);

  if (remaining === '0') {
    console.log('✅ All Cloudfront references have been successfully localized!');
  } else {
    console.log(`⚠️  There are still ${remaining} Cloudfront references remaining.`);
    console.log('Run: grep -r "cloudfront.net" _site/ --include="*.html" to see them.');
  }
}

main().catch(console.error);