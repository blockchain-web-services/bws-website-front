#!/usr/bin/env node

/**
 * Update article component references from .png to correct extensions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTICLES_DIR = path.join(__dirname, 'src', 'components', 'articles');
const MAPPING_FILE = path.join(__dirname, 'image-rename-mapping.json');

async function main() {
  console.log('🔧 Updating article component references...\n');

  // Load rename mapping
  const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));

  // Build replacement map: old path -> new path
  const replacements = {};

  for (const [type, files] of Object.entries(mapping)) {
    if (type === 'unknown') continue;

    for (const { old: oldPath, new: newPath } of files) {
      if (oldPath !== newPath) {
        // Convert absolute paths to web paths
        const oldWebPath = oldPath
          .replace(/^.*\/public/, '')
          .replace(/\\/g, '/');
        const newWebPath = newPath
          .replace(/^.*\/public/, '')
          .replace(/\\/g, '/');

        replacements[oldWebPath] = newWebPath;
      }
    }
  }

  console.log(`Found ${Object.keys(replacements).length} path replacements\n`);

  // Find all article component files
  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.astro'));

  let totalReplacements = 0;

  for (const file of files) {
    const filepath = path.join(ARTICLES_DIR, file);
    let content = fs.readFileSync(filepath, 'utf-8');
    let fileReplacements = 0;

    // Replace each old path with new path
    for (const [oldPath, newPath] of Object.entries(replacements)) {
      const oldPathPattern = oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(oldPathPattern, 'g');

      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, newPath);
        fileReplacements += matches.length;
      }
    }

    if (fileReplacements > 0) {
      fs.writeFileSync(filepath, content);
      console.log(`✓ ${file}: ${fileReplacements} replacements`);
      totalReplacements += fileReplacements;
    }
  }

  console.log(`\n✅ Complete! Made ${totalReplacements} replacements across ${files.length} files`);
}

main().catch(console.error);
