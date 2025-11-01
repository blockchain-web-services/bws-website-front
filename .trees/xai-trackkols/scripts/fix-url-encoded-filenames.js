const fs = require('fs');
const path = require('path');

// Find all files in a directory recursively
function findAllFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  });

  return files;
}

// Decode URL encoding
function decodeFilename(filename) {
  try {
    return decodeURIComponent(filename);
  } catch (e) {
    // If decoding fails, try simple replacements
    return filename
      .replace(/%20/g, ' ')
      .replace(/%27/g, "'")
      .replace(/%28/g, '(')
      .replace(/%29/g, ')')
      .replace(/%2B/g, '+')
      .replace(/%2C/g, ',')
      .replace(/%2F/g, '/')
      .replace(/%3A/g, ':')
      .replace(/%3B/g, ';')
      .replace(/%3D/g, '=')
      .replace(/%40/g, '@');
  }
}

// Main function
function main() {
  const assetsDir = '_site/assets';
  console.log('Scanning for URL-encoded filenames...\n');

  const files = findAllFiles(assetsDir);
  const filesToRename = [];

  // Find files with URL encoding
  files.forEach(file => {
    const basename = path.basename(file);

    // Check if filename contains URL encoding
    if (basename.includes('%20') || basename.includes('%27') || basename.includes('%28') ||
        basename.includes('%29') || basename.includes('%2F') || basename.includes('%2B')) {

      const decodedName = decodeFilename(basename);
      if (decodedName !== basename) {
        filesToRename.push({
          oldPath: file,
          newPath: path.join(path.dirname(file), decodedName),
          oldName: basename,
          newName: decodedName
        });
      }
    }
  });

  if (filesToRename.length === 0) {
    console.log('✓ No URL-encoded filenames found');
    return;
  }

  console.log(`Found ${filesToRename.length} files with URL-encoded names:\n`);

  // Group by directory for better display
  const byDirectory = {};
  filesToRename.forEach(item => {
    const dir = path.dirname(item.oldPath);
    if (!byDirectory[dir]) {
      byDirectory[dir] = [];
    }
    byDirectory[dir].push(item);
  });

  // Display and rename files
  Object.entries(byDirectory).forEach(([dir, items]) => {
    console.log(`Directory: ${path.relative('_site', dir)}`);

    items.forEach(item => {
      console.log(`  ${item.oldName}`);
      console.log(`  → ${item.newName}`);

      // Check if target file already exists
      if (fs.existsSync(item.newPath)) {
        console.log(`    ⚠ Target file already exists, skipping`);
      } else {
        try {
          fs.renameSync(item.oldPath, item.newPath);
          console.log(`    ✓ Renamed successfully`);
        } catch (err) {
          console.log(`    ✗ Error: ${err.message}`);
        }
      }
    });
    console.log();
  });

  // Now update HTML files to use decoded paths
  console.log('Updating HTML files to use decoded paths...\n');

  const htmlFiles = findAllFiles('_site').filter(f => f.endsWith('.html'));
  let totalUpdates = 0;

  htmlFiles.forEach(htmlFile => {
    let content = fs.readFileSync(htmlFile, 'utf8');
    let modified = false;

    filesToRename.forEach(item => {
      const oldRelativePath = '/' + path.relative('_site', item.oldPath).replace(/\\/g, '/');
      const newRelativePath = '/' + path.relative('_site', item.newPath).replace(/\\/g, '/');

      // Replace the encoded path with decoded path
      if (content.includes(oldRelativePath)) {
        content = content.replace(new RegExp(oldRelativePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newRelativePath);
        modified = true;
        totalUpdates++;
      }

      // Also check for the filename without the full path
      if (content.includes(item.oldName)) {
        // Only replace if it's part of an asset path
        const regex = new RegExp(`(/assets/[^"']*/)${item.oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
        if (regex.test(content)) {
          content = content.replace(regex, `$1${item.newName}`);
          modified = true;
          totalUpdates++;
        }
      }
    });

    if (modified) {
      fs.writeFileSync(htmlFile, content);
      console.log(`✓ Updated: ${path.relative('_site', htmlFile)}`);
    }
  });

  console.log(`\n✓ Renamed ${filesToRename.length} files`);
  console.log(`✓ Updated ${totalUpdates} references in HTML files`);
}

main();