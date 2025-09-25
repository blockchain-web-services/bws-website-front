import { promises as fs } from 'fs';
import path from 'path';
import * as prettier from 'prettier';

async function findFiles(dir, extensions) {
  const files = [];

  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }

  await walk(dir);
  return files;
}

async function validateHTML(content, filePath) {
  const errors = [];

  // Check for DOCTYPE
  if (!content.toLowerCase().includes('<!doctype html>')) {
    errors.push('Missing DOCTYPE declaration');
  }

  // Check for required tags
  const requiredTags = ['<html', '<head', '<title', '<body'];
  requiredTags.forEach(tag => {
    if (!content.toLowerCase().includes(tag)) {
      errors.push(`Missing required tag: ${tag}>`);
    }
  });

  // Check for duplicate IDs
  const idMatches = content.match(/id=["']([^"']+)["']/gi) || [];
  const ids = idMatches.map(match => match.replace(/id=["']([^"']+)["']/i, '$1'));
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length > 0) {
    errors.push(`Duplicate IDs found: ${[...new Set(duplicates)].join(', ')}`);
  }

  // Check for unclosed tags
  const openDivs = (content.match(/<div[^>]*>/gi) || []).length;
  const closeDivs = (content.match(/<\/div>/gi) || []).length;
  if (openDivs !== closeDivs) {
    errors.push(`Mismatched div tags: ${openDivs} opening, ${closeDivs} closing`);
  }

  return errors;
}

async function validateCSS(content, filePath) {
  const errors = [];

  // Basic CSS validation
  const openBraces = (content.match(/{/g) || []).length;
  const closeBraces = (content.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push(`Mismatched braces: ${openBraces} opening, ${closeBraces} closing`);
  }

  // Check for common CSS errors
  if (content.includes(';;')) {
    errors.push('Double semicolon found');
  }

  if (content.match(/:\s*;/)) {
    errors.push('Empty property value found');
  }

  return errors;
}

async function processFiles() {
  console.log('Starting HTML and CSS pretty printing and validation...\n');

  const siteDir = path.join(process.cwd(), '..', '_site');

  // Find all HTML and CSS files
  const htmlFiles = await findFiles(siteDir, ['.html']);
  const cssFiles = await findFiles(siteDir, ['.css']);

  console.log(`Found ${htmlFiles.length} HTML files and ${cssFiles.length} CSS files\n`);

  const results = {
    html: [],
    css: [],
    summary: {
      totalHtml: htmlFiles.length,
      totalCss: cssFiles.length,
      htmlPrettyPrinted: 0,
      cssPrettyPrinted: 0,
      htmlErrors: 0,
      cssErrors: 0
    }
  };

  // Process HTML files
  console.log('Processing HTML files...');
  for (const file of htmlFiles) {
    const relativePath = path.relative(process.cwd(), file);
    process.stdout.write(`  ${relativePath}...`);

    try {
      const content = await fs.readFile(file, 'utf8');
      const originalSize = content.length;

      // Validate HTML
      const validationErrors = await validateHTML(content, file);

      // Pretty print HTML
      let formatted;
      let prettyPrintSuccess = false;
      try {
        formatted = await prettier.format(content, {
          parser: 'html',
          printWidth: 120,
          tabWidth: 2,
          useTabs: false,
          htmlWhitespaceSensitivity: 'css'
        });
        prettyPrintSuccess = true;
        results.summary.htmlPrettyPrinted++;
      } catch (formatError) {
        formatted = content;
        validationErrors.push(`Pretty print failed: ${formatError.message}`);
      }

      // Save formatted content
      if (prettyPrintSuccess && formatted !== content) {
        await fs.writeFile(file, formatted, 'utf8');
      }

      const newSize = formatted.length;
      const sizeDiff = newSize - originalSize;

      results.html.push({
        file: relativePath,
        originalSize,
        newSize,
        sizeDiff,
        prettyPrinted: prettyPrintSuccess,
        errors: validationErrors
      });

      if (validationErrors.length > 0) {
        results.summary.htmlErrors++;
        console.log(` ⚠ ${validationErrors.length} issues`);
      } else {
        console.log(' ✓');
      }

    } catch (error) {
      console.log(` ✗ ${error.message}`);
      results.html.push({
        file: relativePath,
        error: error.message
      });
    }
  }

  // Process CSS files
  console.log('\nProcessing CSS files...');
  for (const file of cssFiles) {
    const relativePath = path.relative(process.cwd(), file);
    process.stdout.write(`  ${relativePath}...`);

    try {
      const content = await fs.readFile(file, 'utf8');
      const originalSize = content.length;

      // Skip minified files for pretty printing
      const isMinified = file.includes('.min.');

      // Validate CSS
      const validationErrors = await validateCSS(content, file);

      // Pretty print CSS (skip for minified files)
      let formatted = content;
      let prettyPrintSuccess = false;

      if (!isMinified) {
        try {
          formatted = await prettier.format(content, {
            parser: 'css',
            printWidth: 120,
            tabWidth: 2,
            useTabs: false
          });
          prettyPrintSuccess = true;
          results.summary.cssPrettyPrinted++;

          // Save formatted content
          if (formatted !== content) {
            await fs.writeFile(file, formatted, 'utf8');
          }
        } catch (formatError) {
          validationErrors.push(`Pretty print failed: ${formatError.message}`);
        }
      }

      const newSize = formatted.length;
      const sizeDiff = newSize - originalSize;

      results.css.push({
        file: relativePath,
        originalSize,
        newSize,
        sizeDiff,
        prettyPrinted: prettyPrintSuccess,
        skippedMinified: isMinified,
        errors: validationErrors
      });

      if (validationErrors.length > 0) {
        results.summary.cssErrors++;
        console.log(` ⚠ ${validationErrors.length} issues`);
      } else if (isMinified) {
        console.log(' (minified - skipped formatting)');
      } else {
        console.log(' ✓');
      }

    } catch (error) {
      console.log(` ✗ ${error.message}`);
      results.css.push({
        file: relativePath,
        error: error.message
      });
    }
  }

  // Save results to JSON
  await fs.writeFile(
    'pretty-print-validation-results.json',
    JSON.stringify(results, null, 2),
    'utf8'
  );

  // Print summary
  console.log('\n=== Summary ===');
  console.log(`HTML files: ${results.summary.totalHtml}`);
  console.log(`  Pretty printed: ${results.summary.htmlPrettyPrinted}`);
  console.log(`  Files with errors: ${results.summary.htmlErrors}`);
  console.log(`CSS files: ${results.summary.totalCss}`);
  console.log(`  Pretty printed: ${results.summary.cssPrettyPrinted}`);
  console.log(`  Files with errors: ${results.summary.cssErrors}`);

  // Print files with errors
  const htmlWithErrors = results.html.filter(r => r.errors && r.errors.length > 0);
  if (htmlWithErrors.length > 0) {
    console.log('\nHTML files with validation issues:');
    htmlWithErrors.forEach(r => {
      console.log(`  ${r.file}:`);
      r.errors.forEach(e => console.log(`    - ${e}`));
    });
  }

  const cssWithErrors = results.css.filter(r => r.errors && r.errors.length > 0);
  if (cssWithErrors.length > 0) {
    console.log('\nCSS files with validation issues:');
    cssWithErrors.forEach(r => {
      console.log(`  ${r.file}:`);
      r.errors.forEach(e => console.log(`    - ${e}`));
    });
  }

  console.log('\nDetailed results saved to: pretty-print-validation-results.json');
}

// Run the script
processFiles().catch(console.error);