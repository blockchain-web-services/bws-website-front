const fs = require('fs');
const path = require('path');

// Function to find all HTML files
function findHtmlFiles(dir) {
  const htmlFiles = [];
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      htmlFiles.push(...findHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  });

  return htmlFiles;
}

// Function to extract all asset references from HTML
function extractAssetReferences(htmlContent) {
  const assets = new Set();

  // Match src attributes
  const srcMatches = htmlContent.match(/src=["']([^"']+)["']/g) || [];
  srcMatches.forEach(match => {
    const url = match.match(/src=["']([^"']+)["']/)[1];
    if (url.startsWith('/assets/') || url.startsWith('assets/')) {
      assets.add(url.startsWith('/') ? url : '/' + url);
    }
  });

  // Match href attributes (for CSS, images, etc.)
  const hrefMatches = htmlContent.match(/href=["']([^"']+)["']/g) || [];
  hrefMatches.forEach(match => {
    const url = match.match(/href=["']([^"']+)["']/)[1];
    if (url.startsWith('/assets/') || url.startsWith('assets/')) {
      assets.add(url.startsWith('/') ? url : '/' + url);
    }
  });

  // Match srcset attributes
  const srcsetMatches = htmlContent.match(/srcset=["']([^"']+)["']/g) || [];
  srcsetMatches.forEach(match => {
    const srcset = match.match(/srcset=["']([^"']+)["']/)[1];
    const urls = srcset.split(',').map(s => s.trim().split(/\s+/)[0]);
    urls.forEach(url => {
      if (url.startsWith('/assets/') || url.startsWith('assets/')) {
        assets.add(url.startsWith('/') ? url : '/' + url);
      }
    });
  });

  // Match background-image in inline styles
  const bgMatches = htmlContent.match(/background-image:\s*url\(['"]*([^'")]+)['"]*\)/g) || [];
  bgMatches.forEach(match => {
    const url = match.match(/url\(['"]*([^'")]+)['"]*\)/)[1];
    if (url.startsWith('/assets/') || url.startsWith('assets/')) {
      assets.add(url.startsWith('/') ? url : '/' + url);
    }
  });

  // Match data-bg or data-src attributes (lazy loading)
  const dataMatches = htmlContent.match(/data-(bg|src)=["']([^"']+)["']/g) || [];
  dataMatches.forEach(match => {
    const url = match.match(/data-(bg|src)=["']([^"']+)["']/)[2];
    if (url.startsWith('/assets/') || url.startsWith('assets/')) {
      assets.add(url.startsWith('/') ? url : '/' + url);
    }
  });

  return assets;
}

// Main function
function main() {
  const siteDir = '_site';
  const htmlFiles = findHtmlFiles(siteDir);
  const allAssets = new Set();
  const assetsByFile = {};

  console.log(`Found ${htmlFiles.length} HTML files\n`);

  // Extract all asset references
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const assets = extractAssetReferences(content);

    if (assets.size > 0) {
      assetsByFile[file] = Array.from(assets);
      assets.forEach(asset => allAssets.add(asset));
    }
  });

  console.log(`Total unique asset references: ${allAssets.size}\n`);

  // Check which assets are missing
  const missingAssets = [];
  const existingAssets = [];

  allAssets.forEach(asset => {
    const fullPath = path.join(siteDir, asset);
    if (!fs.existsSync(fullPath)) {
      missingAssets.push(asset);
    } else {
      existingAssets.push(asset);
    }
  });

  console.log(`✓ Existing assets: ${existingAssets.length}`);
  console.log(`✗ Missing assets: ${missingAssets.length}\n`);

  if (missingAssets.length > 0) {
    console.log('Missing assets:');

    // Group missing assets by type
    const missingByType = {
      images: [],
      css: [],
      js: [],
      fonts: [],
      other: []
    };

    missingAssets.forEach(asset => {
      if (asset.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i)) {
        missingByType.images.push(asset);
      } else if (asset.match(/\.css$/i)) {
        missingByType.css.push(asset);
      } else if (asset.match(/\.js$/i)) {
        missingByType.js.push(asset);
      } else if (asset.match(/\.(woff|woff2|ttf|eot|otf)$/i)) {
        missingByType.fonts.push(asset);
      } else {
        missingByType.other.push(asset);
      }
    });

    Object.entries(missingByType).forEach(([type, assets]) => {
      if (assets.length > 0) {
        console.log(`\n${type.toUpperCase()} (${assets.length}):`);
        assets.forEach(asset => console.log(`  - ${asset}`));
      }
    });

    // Save missing assets to file for processing
    fs.writeFileSync('missing-assets.json', JSON.stringify(missingAssets, null, 2));
    console.log('\n✓ Missing assets list saved to missing-assets.json');
  }

  // Find files that reference missing assets
  if (missingAssets.length > 0) {
    console.log('\nFiles with missing assets:');

    Object.entries(assetsByFile).forEach(([file, assets]) => {
      const missing = assets.filter(asset => missingAssets.includes(asset));
      if (missing.length > 0) {
        console.log(`\n${path.relative(siteDir, file)}:`);
        missing.forEach(asset => console.log(`  - ${asset}`));
      }
    });
  }
}

main();