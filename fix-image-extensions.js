#!/usr/bin/env node

/**
 * Fix image file extensions based on actual file type
 *
 * Problem: Many images are named .png but are actually SVG or JPEG
 * Solution: Rename files to correct extensions
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_IMAGES_DIR = path.join(__dirname, 'public', 'assets', 'images', 'docs');

function getActualFileType(filepath) {
  try {
    const result = execSync(`file "${filepath}"`, { encoding: 'utf-8' });

    if (result.includes('SVG')) {
      return 'svg';
    } else if (result.includes('JPEG')) {
      return 'jpg';
    } else if (result.includes('PNG')) {
      return 'png';
    }

    return null;
  } catch (error) {
    console.error(`Error checking file type for ${filepath}:`, error.message);
    return null;
  }
}

function findAllPngFiles(dir) {
  const files = [];

  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.png')) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

async function main() {
  console.log('🔧 Fixing image file extensions...\n');

  // Find all .png files
  const pngFiles = findAllPngFiles(DOCS_IMAGES_DIR);
  console.log(`Found ${pngFiles.length} .png files\n`);

  const renames = {
    svg: [],
    jpg: [],
    png: [],
    unknown: []
  };

  // Check each file and rename if needed
  for (const filepath of pngFiles) {
    const actualType = getActualFileType(filepath);

    if (!actualType) {
      renames.unknown.push(filepath);
      continue;
    }

    const currentExt = path.extname(filepath);
    const correctExt = `.${actualType}`;

    if (currentExt !== correctExt) {
      const newPath = filepath.replace(/\.png$/, correctExt);

      console.log(`Renaming: ${path.basename(filepath)} -> ${path.basename(newPath)}`);
      fs.renameSync(filepath, newPath);

      renames[actualType].push({
        old: filepath,
        new: newPath
      });
    } else {
      renames[actualType].push({ old: filepath, new: filepath }); // No change needed
    }
  }

  console.log(`\n✅ Complete!`);
  console.log(`   SVG files: ${renames.svg.length}`);
  console.log(`   JPEG files: ${renames.jpg.length}`);
  console.log(`   PNG files: ${renames.png.length}`);
  console.log(`   Unknown: ${renames.unknown.length}`);

  // Save mapping for updating references
  const mappingFile = path.join(__dirname, 'image-rename-mapping.json');
  fs.writeFileSync(mappingFile, JSON.stringify(renames, null, 2));
  console.log(`\n📝 Saved rename mapping to: ${mappingFile}`);
}

main().catch(console.error);
