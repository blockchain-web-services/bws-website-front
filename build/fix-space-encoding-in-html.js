const fs = require('fs');
const path = require('path');

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

// Find all files with spaces in assets directory
function findFilesWithSpaces(dir) {
  const filesWithSpaces = [];

  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);

    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scan(fullPath);
      } else if (item.includes(' ')) {
        filesWithSpaces.push({
          fullPath,
          relativePath: '/' + path.relative('_site', fullPath).replace(/\\/g, '/'),
          filename: item,
          encodedFilename: encodeURIComponent(item).replace(/%2F/g, '/')
        });
      }
    });
  }

  scan(dir);
  return filesWithSpaces;
}

// Main function
function main() {
  console.log('Finding files with spaces in assets directory...\n');

  const filesWithSpaces = findFilesWithSpaces('_site/assets');
  console.log(`Found ${filesWithSpaces.length} files with spaces\n`);

  if (filesWithSpaces.length === 0) {
    console.log('No files with spaces found.');
    return;
  }

  // Group by directory
  const byDir = {};
  filesWithSpaces.forEach(file => {
    const dir = path.dirname(file.relativePath);
    if (!byDir[dir]) {
      byDir[dir] = [];
    }
    byDir[dir].push(file);
  });

  console.log('Files with spaces:');
  Object.entries(byDir).forEach(([dir, files]) => {
    console.log(`\n${dir}:`);
    files.forEach(file => {
      console.log(`  ${file.filename}`);
      if (file.filename !== file.encodedFilename) {
        console.log(`  → ${file.encodedFilename}`);
      }
    });
  });

  console.log('\n\nUpdating HTML files to use URL-encoded paths...\n');

  const htmlFiles = findHtmlFiles('_site');
  let totalUpdates = 0;
  const updatedFiles = new Set();

  htmlFiles.forEach(htmlFile => {
    let content = fs.readFileSync(htmlFile, 'utf8');
    let modified = false;

    filesWithSpaces.forEach(file => {
      // Create patterns to match the file reference
      const patterns = [
        // In src, href attributes
        new RegExp(`((?:src|href|poster)=["'])${file.relativePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(["'])`, 'g'),
        // In srcset
        new RegExp(`(srcset=["'][^"']*?)${file.relativePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'),
        // In url()
        new RegExp(`(url\\(["']?)${file.relativePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(["']?\\))`, 'g')
      ];

      patterns.forEach(pattern => {
        if (pattern.test(content)) {
          // URL encode the path (keeping the directory structure intact)
          const dir = path.dirname(file.relativePath);
          const encodedPath = dir + '/' + file.encodedFilename;

          content = content.replace(pattern, (match, prefix, suffix) => {
            if (match.includes('srcset')) {
              return prefix + encodedPath;
            }
            return prefix + encodedPath + (suffix || '');
          });

          modified = true;
          totalUpdates++;
        }
      });
    });

    if (modified) {
      fs.writeFileSync(htmlFile, content);
      updatedFiles.add(path.relative('_site', htmlFile));
    }
  });

  if (updatedFiles.size > 0) {
    console.log('Updated files:');
    updatedFiles.forEach(file => console.log(`  ✓ ${file}`));
    console.log(`\n✓ Updated ${totalUpdates} references in ${updatedFiles.size} HTML files`);
  } else {
    console.log('No updates needed - all paths are already properly encoded');
  }
}

main();