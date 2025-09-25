const fs = require('fs');
const path = require('path');
const https = require('https');

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

// Function to decode URL encoding
function decodeUrl(url) {
  try {
    return decodeURIComponent(url);
  } catch (e) {
    return url;
  }
}

// Function to extract ALL asset references from HTML
function extractAllAssets(htmlContent) {
  const assets = new Set();

  // Extract everything that looks like a path to /assets/
  const patterns = [
    // Standard attributes
    /(?:src|href|data-src|data-bg|poster)=["']([^"']+)["']/g,
    // srcset (multiple URLs)
    /srcset=["']([^"']+)["']/g,
    // Background images in style
    /url\(["']?([^"')]+)["']?\)/g,
    // Any /assets/ path
    /["'](\/assets\/[^"'\s>]+)["']/g
  ];

  patterns.forEach(pattern => {
    const matches = htmlContent.match(pattern) || [];
    matches.forEach(match => {
      // Extract the URL part
      let urls = [];

      if (match.includes('srcset')) {
        // Handle srcset which has multiple URLs
        const srcsetMatch = match.match(/srcset=["']([^"']+)["']/);
        if (srcsetMatch) {
          const srcsetUrls = srcsetMatch[1].split(',').map(s => s.trim().split(/\s+/)[0]);
          urls.push(...srcsetUrls);
        }
      } else {
        // Extract URL from the match
        const urlMatch = match.match(/(?:src|href|data-src|data-bg|poster)=["']([^"']+)["']/) ||
                        match.match(/url\(["']?([^"')]+)["']?\)/) ||
                        match.match(/["'](\/assets\/[^"'\s>]+)["']/);
        if (urlMatch) {
          urls.push(urlMatch[1]);
        }
      }

      urls.forEach(url => {
        if (url && (url.startsWith('/assets/') || url.startsWith('assets/'))) {
          // Normalize the path
          const normalizedUrl = url.startsWith('/') ? url : '/' + url;
          assets.add(normalizedUrl);
        }
      });
    });
  });

  return assets;
}

// Check if file exists with various encodings
function checkFileExists(basePath, urlPath) {
  const variations = [
    urlPath,
    decodeUrl(urlPath),
    urlPath.replace(/%20/g, ' '),
    urlPath.replace(/%20/g, '%20')
  ];

  for (const variation of variations) {
    const fullPath = path.join(basePath, variation);
    if (fs.existsSync(fullPath)) {
      return { exists: true, actualPath: variation };
    }
  }

  return { exists: false, actualPath: null };
}

// Main function
function main() {
  const siteDir = '_site';
  const htmlFiles = findHtmlFiles(siteDir);
  const allAssets = new Map(); // URL -> Set of files that reference it

  console.log(`Scanning ${htmlFiles.length} HTML files for assets...\n`);

  // Extract all asset references
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const assets = extractAllAssets(content);

    assets.forEach(asset => {
      if (!allAssets.has(asset)) {
        allAssets.set(asset, new Set());
      }
      allAssets.get(asset).add(path.relative(siteDir, file));
    });
  });

  console.log(`Found ${allAssets.size} unique asset references\n`);

  // Check which assets are missing
  const missingAssets = [];
  const existingAssets = [];
  const encodingIssues = [];

  allAssets.forEach((referencedBy, asset) => {
    const check = checkFileExists(siteDir, asset);

    if (check.exists) {
      if (check.actualPath !== asset) {
        encodingIssues.push({
          referenced: asset,
          actual: check.actualPath,
          files: Array.from(referencedBy)
        });
      }
      existingAssets.push(asset);
    } else {
      missingAssets.push({
        path: asset,
        decodedPath: decodeUrl(asset),
        files: Array.from(referencedBy)
      });
    }
  });

  console.log(`✓ Existing assets: ${existingAssets.length}`);
  console.log(`⚠ Encoding mismatches: ${encodingIssues.length}`);
  console.log(`✗ Missing assets: ${missingAssets.length}\n`);

  // Report encoding issues
  if (encodingIssues.length > 0) {
    console.log('=== ENCODING MISMATCHES ===');
    console.log('(HTML references URL-encoded paths but files have different encoding)\n');

    encodingIssues.forEach(issue => {
      console.log(`Referenced as: ${issue.referenced}`);
      console.log(`Actual file:   ${issue.actual}`);
      console.log(`Used in: ${issue.files.join(', ')}\n`);
    });
  }

  // Report missing assets
  if (missingAssets.length > 0) {
    console.log('=== MISSING ASSETS ===\n');

    // Group by directory
    const byDirectory = {};
    missingAssets.forEach(item => {
      const dir = path.dirname(item.path);
      if (!byDirectory[dir]) {
        byDirectory[dir] = [];
      }
      byDirectory[dir].push(item);
    });

    Object.entries(byDirectory).forEach(([dir, items]) => {
      console.log(`Directory: ${dir}`);
      items.forEach(item => {
        console.log(`  - ${path.basename(item.path)}`);
        if (item.path !== item.decodedPath) {
          console.log(`    (decoded: ${path.basename(item.decodedPath)})`);
        }
        console.log(`    Used in: ${item.files.join(', ')}`);
      });
      console.log();
    });

    // Save for further processing
    fs.writeFileSync('missing-assets-detailed.json', JSON.stringify(missingAssets, null, 2));
    console.log('✓ Detailed missing assets saved to missing-assets-detailed.json');
  }

  // Check for CDN references that should have been localized
  console.log('\n=== CHECKING FOR REMAINING CDN REFERENCES ===\n');

  let cdnReferences = 0;
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const cdnMatches = content.match(/https?:\/\/cdn\.prod\.website-files\.com[^"'\s)]*/g) || [];

    if (cdnMatches.length > 0) {
      console.log(`${path.relative(siteDir, file)}: ${cdnMatches.length} CDN references`);
      cdnReferences += cdnMatches.length;
    }
  });

  if (cdnReferences === 0) {
    console.log('✓ No CDN references found');
  } else {
    console.log(`\n⚠ Total CDN references still present: ${cdnReferences}`);
  }
}

main();