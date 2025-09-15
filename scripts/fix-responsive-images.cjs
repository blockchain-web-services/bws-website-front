const fs = require('fs');
const path = require('path');

// Function to update srcset to use only existing images
function fixSrcsetInFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changeCount = 0;

  // Find all srcset attributes and fix them
  content = content.replace(/srcset="([^"]*)"/g, (match, srcsetValue) => {
    // Parse the srcset value
    const sources = srcsetValue.split(',').map(s => s.trim());
    const validSources = [];

    sources.forEach(source => {
      const parts = source.split(' ');
      if (parts.length >= 1) {
        const imagePath = parts[0];
        // Remove the responsive variant suffixes if the files don't exist
        // Just use the base image for all sizes
        if (imagePath.includes('-p-500') || imagePath.includes('-p-800') ||
            imagePath.includes('-p-1080') || imagePath.includes('-p-1600')) {
          // Replace with base image (remove -p-XXX suffix)
          const baseImage = imagePath.replace(/-p-\d+/, '');
          if (!validSources.some(s => s.includes(baseImage))) {
            validSources.push(baseImage + ' ' + (parts[1] || ''));
          }
        } else {
          validSources.push(source);
        }
      }
    });

    if (validSources.length > 0) {
      changeCount++;
      // Return simplified srcset with base image only
      return `srcset="${validSources[0].split(' ')[0]}"`;
    }
    return match;
  });

  // Also ensure all img tags have proper fallback src
  content = content.replace(/<img([^>]*srcset="[^"]*"[^>]*)>/g, (match, attrs) => {
    // Check if there's already a src attribute
    if (!attrs.includes('src=')) {
      // Extract the first image from srcset as fallback
      const srcsetMatch = attrs.match(/srcset="([^"]*?)"/);
      if (srcsetMatch) {
        const firstImage = srcsetMatch[1].split(',')[0].trim().split(' ')[0];
        // Add src attribute
        return `<img${attrs} src="${firstImage}">`;
      }
    }
    return match;
  });

  if (changeCount > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${changeCount} srcset attributes in ${path.basename(filePath)}`);
  }
}

// Fix all HTML files in _site directory
function fixAllHtmlFiles() {
  const siteDir = path.join(__dirname, '..', '_site');

  console.log('Fixing responsive images in HTML files...');

  // Process root HTML files
  const rootFiles = fs.readdirSync(siteDir).filter(f => f.endsWith('.html'));
  rootFiles.forEach(file => {
    fixSrcsetInFile(path.join(siteDir, file));
  });

  // Process marketplace HTML files
  const marketplaceDir = path.join(siteDir, 'marketplace');
  if (fs.existsSync(marketplaceDir)) {
    const marketplaceFiles = fs.readdirSync(marketplaceDir).filter(f => f.endsWith('.html'));
    marketplaceFiles.forEach(file => {
      fixSrcsetInFile(path.join(marketplaceDir, file));
    });
  }

  // Process industry-content HTML files
  const industryDir = path.join(siteDir, 'industry-content');
  if (fs.existsSync(industryDir)) {
    const industryFiles = fs.readdirSync(industryDir).filter(f => f.endsWith('.html'));
    industryFiles.forEach(file => {
      fixSrcsetInFile(path.join(industryDir, file));
    });
  }

  // Process articles HTML files
  const articlesDir = path.join(siteDir, 'articles');
  if (fs.existsSync(articlesDir)) {
    const articleFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.html'));
    articleFiles.forEach(file => {
      fixSrcsetInFile(path.join(articlesDir, file));
    });
  }
}

// Run the fix
fixAllHtmlFiles();
console.log('Responsive image fixes completed!');