#!/usr/bin/env node
/**
 * Pretty print and validate all HTML files in _site directory
 */

const fs = require('fs').promises;
const path = require('path');
const prettier = require('prettier');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m'
};

/**
 * Find all HTML files recursively in a directory
 */
async function findHtmlFiles(dir) {
  const files = [];
  const items = await fs.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...await findHtmlFiles(fullPath));
    } else if (item.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Pretty print HTML file using Prettier
 */
async function prettyPrintHtml(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');

    // Configure prettier for HTML
    const formatted = await prettier.format(content, {
      parser: 'html',
      printWidth: 120,
      tabWidth: 2,
      useTabs: false,
      singleQuote: false,
      bracketSameLine: false
    });

    await fs.writeFile(filePath, formatted, 'utf8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Validate HTML structure
 */
async function validateHtml(filePath) {
  const errors = [];
  const warnings = [];

  try {
    const content = await fs.readFile(filePath, 'utf8');

    // Check for DOCTYPE
    if (!content.trim().toLowerCase().startsWith('<!doctype')) {
      warnings.push('Missing DOCTYPE declaration');
    }

    // Check for required tags
    if (!content.includes('<html')) {
      errors.push('Missing <html> tag');
    }
    if (!content.includes('<head')) {
      errors.push('Missing <head> tag');
    }
    if (!content.includes('<title')) {
      warnings.push('Missing <title> tag');
    }
    if (!content.includes('<body')) {
      errors.push('Missing <body> tag');
    }

    // Check for matching div tags
    const openDivs = (content.match(/<div/g) || []).length;
    const closeDivs = (content.match(/<\/div>/g) || []).length;
    if (openDivs !== closeDivs) {
      warnings.push(`Mismatched div tags: ${openDivs} opening, ${closeDivs} closing`);
    }

    // Check for self-closing tags
    const selfClosingIssues = content.match(/<(img|br|hr|input|meta|link)[^>]*(?<!\/)>/g);
    if (selfClosingIssues && selfClosingIssues.length > 0) {
      warnings.push(`Found ${selfClosingIssues.length} potentially unclosed self-closing tags`);
    }

    // Check for empty alt attributes on images
    const imgTags = content.match(/<img[^>]*>/g) || [];
    let missingAlt = 0;
    imgTags.forEach(img => {
      if (!img.includes('alt=')) {
        missingAlt++;
      }
    });
    if (missingAlt > 0) {
      warnings.push(`${missingAlt} images missing alt attributes`);
    }

    // Check for duplicate IDs (excluding data-w-id and other data attributes)
    // Match id=" but not when preceded by letters or hyphen
    const idMatches = content.match(/\sid="([^"]+)"/g) || [];
    const ids = {};
    idMatches.forEach(match => {
      const id = match.trim().slice(4, -1);
      if (ids[id]) {
        errors.push(`Duplicate ID found: '${id}'`);
      }
      ids[id] = true;
    });

  } catch (error) {
    errors.push(`File reading error: ${error.message}`);
  }

  return { errors, warnings };
}

/**
 * Main function
 */
async function main() {
  const siteDir = '_site';

  console.log(`${colors.bold}Scanning for HTML files in ${siteDir}...${colors.reset}\n`);

  const htmlFiles = await findHtmlFiles(siteDir);
  console.log(`Found ${colors.blue}${htmlFiles.length}${colors.reset} HTML files\n`);
  console.log('='.repeat(80));

  const results = {
    totalFiles: htmlFiles.length,
    prettyPrinted: 0,
    validationPassed: 0,
    filesWithErrors: 0,
    filesWithWarnings: 0,
    files: []
  };

  for (const filePath of htmlFiles) {
    const relativePath = path.relative(siteDir, filePath);
    console.log(`\n${colors.bold}Processing: ${relativePath}${colors.reset}`);
    console.log('-'.repeat(40));

    const fileResult = {
      path: relativePath,
      prettyPrint: false,
      errors: [],
      warnings: []
    };

    // Pretty print
    const prettyResult = await prettyPrintHtml(filePath);
    if (prettyResult.success) {
      console.log(`  ${colors.green}✓${colors.reset} Pretty printed`);
      results.prettyPrinted++;
      fileResult.prettyPrint = true;
    } else {
      console.log(`  ${colors.red}✗${colors.reset} Pretty print failed: ${prettyResult.error}`);
    }

    // Validate
    const { errors, warnings } = await validateHtml(filePath);
    fileResult.errors = errors;
    fileResult.warnings = warnings;

    if (errors.length > 0) {
      console.log(`  ${colors.red}✗${colors.reset} Validation errors (${errors.length}):`);
      errors.slice(0, 5).forEach(error => {
        console.log(`    ${colors.red}- ${error}${colors.reset}`);
      });
      if (errors.length > 5) {
        console.log(`    ${colors.red}... and ${errors.length - 5} more errors${colors.reset}`);
      }
      results.filesWithErrors++;
    } else {
      console.log(`  ${colors.green}✓${colors.reset} Validation passed`);
      results.validationPassed++;
    }

    if (warnings.length > 0) {
      console.log(`  ${colors.yellow}⚠${colors.reset} Warnings (${warnings.length}):`);
      warnings.slice(0, 3).forEach(warning => {
        console.log(`    ${colors.yellow}- ${warning}${colors.reset}`);
      });
      if (warnings.length > 3) {
        console.log(`    ${colors.yellow}... and ${warnings.length - 3} more warnings${colors.reset}`);
      }
      results.filesWithWarnings++;
    }

    results.files.push(fileResult);
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log(`${colors.bold}SUMMARY${colors.reset}`);
  console.log('='.repeat(80));
  console.log(`Total files processed: ${colors.blue}${results.totalFiles}${colors.reset}`);
  console.log(`Successfully pretty printed: ${colors.green}${results.prettyPrinted}${colors.reset}`);
  console.log(`Validation passed: ${colors.green}${results.validationPassed}${colors.reset}`);
  console.log(`Files with errors: ${colors.red}${results.filesWithErrors}${colors.reset}`);
  console.log(`Files with warnings: ${colors.yellow}${results.filesWithWarnings}${colors.reset}`);

  // Save results to JSON
  await fs.writeFile(
    'validation-results.json',
    JSON.stringify(results, null, 2),
    'utf8'
  );
  console.log(`\n${colors.green}Detailed results saved to validation-results.json${colors.reset}`);

  // Show files with errors
  if (results.filesWithErrors > 0) {
    console.log('\n' + '='.repeat(80));
    console.log(`${colors.red}${colors.bold}FILES WITH ERRORS:${colors.reset}`);
    console.log('='.repeat(80));

    results.files.forEach(file => {
      if (file.errors.length > 0) {
        console.log(`\n${colors.red}${file.path}:${colors.reset}`);
        file.errors.forEach(error => {
          console.log(`  - ${error}`);
        });
      }
    });
  }
}

// Run the script
main().catch(console.error);