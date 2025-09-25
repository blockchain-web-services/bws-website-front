#!/usr/bin/env node

/**
 * HTML Prettifier
 * Formats all HTML files in the build output for better readability
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import * as prettier from 'prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_DIR = path.join(__dirname, '..', '_site');

async function prettifyHTML() {
  console.log('🎨 Prettifying HTML files...');

  try {
    // Find all HTML files in the build directory
    const htmlFiles = await glob('**/*.html', {
      cwd: SITE_DIR,
      absolute: true
    });

    console.log(`Found ${htmlFiles.length} HTML files to prettify`);

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const file of htmlFiles) {
      try {
        // Read the file
        const content = fs.readFileSync(file, 'utf-8');

        // Format with Prettier
        const formatted = await prettier.format(content, {
          parser: 'html',
          printWidth: 120,
          tabWidth: 2,
          useTabs: false,
          singleQuote: false,
          bracketSameLine: false,
          htmlWhitespaceSensitivity: 'css',
          endOfLine: 'lf'
        });

        // Write the formatted content back
        fs.writeFileSync(file, formatted, 'utf-8');
        successCount++;
      } catch (error) {
        errorCount++;
        const relativePath = path.relative(SITE_DIR, file);
        errors.push(`${relativePath}: ${error.message}`);
        console.error(`❌ Error prettifying ${relativePath}:`, error.message);
      }
    }

    console.log(`\n✅ Prettified ${successCount} HTML files`);
    if (errorCount > 0) {
      console.log(`⚠️ Failed to prettify ${errorCount} files`);
      errors.forEach(err => console.log(`   - ${err}`));
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Failed to prettify HTML files:', error.message);
    return false;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  prettifyHTML().then(success => {
    if (!success) {
      process.exit(1);
    }
  });
}

export { prettifyHTML };