#!/usr/bin/env node

/**
 * HTML Prettifier
 * Formats all HTML files in the build output for better readability
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const prettier = require('prettier');

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

        // Show progress
        process.stdout.write(`\r  ✓ Formatted ${successCount}/${htmlFiles.length} files`);
      } catch (error) {
        errorCount++;
        errors.push({
          file: path.relative(SITE_DIR, file),
          error: error.message
        });
      }
    }

    console.log(''); // New line after progress

    if (errorCount > 0) {
      console.error(`\n❌ Failed to prettify ${errorCount} files:`);
      errors.forEach(({ file, error }) => {
        console.error(`  - ${file}: ${error}`);
      });
      return false;
    }

    console.log(`✅ Successfully prettified all ${successCount} HTML files`);
    return true;

  } catch (error) {
    console.error('❌ Error during prettification:', error);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  prettifyHTML().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { prettifyHTML };