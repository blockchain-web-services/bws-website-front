const fs = require('fs');
const path = require('path');
const http = require('http');

// Find all HTML files
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

// Extract asset references from HTML
function extractAssets(htmlContent) {
  const assets = new Set();

  // Match various asset patterns
  const patterns = [
    /(?:src|href|poster)=["']([^"']+)["']/g,
    /srcset=["']([^"']+)["']/g,
    /url\(["']?([^"')]+)["']?\)/g
  ];

  patterns.forEach(pattern => {
    const matches = htmlContent.match(pattern) || [];
    matches.forEach(match => {
      // Extract URLs
      if (match.includes('srcset')) {
        const srcsetMatch = match.match(/srcset=["']([^"']+)["']/);
        if (srcsetMatch) {
          const urls = srcsetMatch[1].split(',').map(s => s.trim().split(/\s+/)[0]);
          urls.forEach(url => {
            if (url.startsWith('/assets/')) {
              assets.add(url);
            }
          });
        }
      } else {
        const urlMatch = match.match(/(?:src|href|poster)=["']([^"']+)["']/) ||
                        match.match(/url\(["']?([^"')]+)["']?\)/);
        if (urlMatch && urlMatch[1].startsWith('/assets/')) {
          assets.add(urlMatch[1]);
        }
      }
    });
  });

  return Array.from(assets);
}

// Test HTTP access
function testHttpAccess(url) {
  return new Promise((resolve) => {
    http.get(`http://localhost:8000${url}`, (res) => {
      resolve({
        url,
        status: res.statusCode,
        ok: res.statusCode === 200
      });
    }).on('error', (err) => {
      resolve({
        url,
        status: 0,
        ok: false,
        error: err.message
      });
    });
  });
}

// Main function
async function main() {
  const siteDir = '_site';
  const htmlFiles = findHtmlFiles(siteDir);
  const allAssets = new Set();

  console.log(`Testing asset accessibility via HTTP...\n`);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  // Extract all unique assets
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const assets = extractAssets(content);
    assets.forEach(asset => allAssets.add(asset));
  });

  console.log(`Testing ${allAssets.size} unique asset URLs...\n`);

  // Test each asset
  const results = [];
  const batchSize = 10;
  const assetsArray = Array.from(allAssets);

  for (let i = 0; i < assetsArray.length; i += batchSize) {
    const batch = assetsArray.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(testHttpAccess));
    results.push(...batchResults);

    // Show progress
    process.stdout.write(`\rProgress: ${Math.min(i + batchSize, assetsArray.length)}/${assetsArray.length}`);
  }

  console.log('\n\n=== RESULTS ===\n');

  const successful = results.filter(r => r.ok);
  const failed = results.filter(r => !r.ok);

  console.log(`✓ Accessible: ${successful.length}/${results.length}`);
  console.log(`✗ Failed: ${failed.length}/${results.length}\n`);

  if (failed.length > 0) {
    console.log('Failed assets:');

    // Group by status code
    const byStatus = {};
    failed.forEach(item => {
      const status = item.status || 'Error';
      if (!byStatus[status]) {
        byStatus[status] = [];
      }
      byStatus[status].push(item);
    });

    Object.entries(byStatus).forEach(([status, items]) => {
      console.log(`\nStatus ${status} (${items.length}):`);
      items.slice(0, 10).forEach(item => {
        console.log(`  - ${item.url}`);
        if (item.error) {
          console.log(`    Error: ${item.error}`);
        }
      });
      if (items.length > 10) {
        console.log(`  ... and ${items.length - 10} more`);
      }
    });

    // Save failed assets
    fs.writeFileSync('failed-assets.json', JSON.stringify(failed, null, 2));
    console.log('\n✓ Failed assets saved to failed-assets.json');
  } else {
    console.log('✅ All assets are accessible!');
  }
}

main().catch(console.error);