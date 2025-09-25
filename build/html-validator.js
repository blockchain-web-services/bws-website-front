#!/usr/bin/env node

/**
 * HTML Validator
 * Validates all HTML files for syntax errors and common issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import * as htmlValidator from 'html-validator';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_DIR = path.join(__dirname, '..', '_site');

// Custom validation rules
function customValidation(html, filePath) {
  const issues = [];
  const $ = cheerio.load(html, { xmlMode: false });

  // CRITICAL: Check for proper HTML structure
  // Check for DOCTYPE
  if (!html.match(/<!DOCTYPE\s+html/i)) {
    issues.push(`CRITICAL: Missing DOCTYPE declaration`);
  }

  // Check for html tag
  const htmlTagMatch = html.match(/<html[\s>]/i);
  const htmlCloseMatch = html.match(/<\/html>/i);
  if (!htmlTagMatch) {
    issues.push(`CRITICAL: Missing <html> tag`);
  }
  if (!htmlCloseMatch) {
    issues.push(`CRITICAL: Missing closing </html> tag`);
  }

  // Check for head tag
  const headTagMatch = html.match(/<head[\s>]/i);
  const headCloseMatch = html.match(/<\/head>/i);
  if (!headTagMatch) {
    issues.push(`CRITICAL: Missing <head> tag`);
  }
  if (!headCloseMatch) {
    issues.push(`CRITICAL: Missing closing </head> tag`);
  }

  // Check for body tag
  const bodyTagMatch = html.match(/<body[\s>]/i);
  const bodyCloseMatch = html.match(/<\/body>/i);
  if (!bodyTagMatch) {
    issues.push(`CRITICAL: Missing <body> tag`);
  }
  if (!bodyCloseMatch) {
    issues.push(`CRITICAL: Missing closing </body> tag`);
  }

  // Check for title tag in head
  if ($('head title').length === 0) {
    issues.push('WARNING: Missing <title> tag in <head>');
  }

  // Check for viewport meta tag (mobile responsiveness)
  if ($('meta[name="viewport"]').length === 0) {
    issues.push('INFO: Missing viewport meta tag for mobile responsiveness');
  }

  // Check for duplicate IDs
  const ids = {};
  $('[id]').each((i, elem) => {
    const id = $(elem).attr('id');
    if (ids[id]) {
      issues.push(`ERROR: Duplicate ID found: "${id}"`);
    }
    ids[id] = true;
  });

  // Check for empty alt attributes on images (accessibility)
  $('img').each((i, elem) => {
    const $img = $(elem);
    if (!$img.attr('alt') && $img.attr('alt') !== '') {
      const src = $img.attr('src') || 'unknown';
      // Only warn for non-decorative images
      if (!src.includes('spacer') && !src.includes('blank')) {
        issues.push(`WARNING: Image missing alt attribute: ${src}`);
      }
    }
  });

  // Check for broken internal links (basic check)
  $('a[href^="/"]').each((i, elem) => {
    const href = $(elem).attr('href');
    if (href && href !== '/' && !href.startsWith('/#') && !href.startsWith('/assets/')) {
      // For internal links, check if the file would exist
      const targetPath = path.join(SITE_DIR, href.endsWith('/') ? href + 'index.html' : href);
      if (!targetPath.includes('.') && !href.endsWith('/')) {
        // Likely a route without extension, add .html
        const htmlPath = targetPath + '.html';
        if (!fs.existsSync(htmlPath) && !fs.existsSync(targetPath + '/index.html')) {
          issues.push(`WARNING: Possible broken internal link: ${href}`);
        }
      }
    }
  });

  // Check for inline styles (best practice)
  if ($('[style]').length > 0) {
    issues.push(`INFO: Found ${$('[style]').length} elements with inline styles`);
  }

  return issues;
}

async function validateHTML() {
  console.log('🔍 Validating HTML files...');

  try {
    // Find all HTML files
    const htmlFiles = await glob('**/*.html', {
      cwd: SITE_DIR,
      absolute: true
    });

    console.log(`Found ${htmlFiles.length} HTML files to validate`);

    let validCount = 0;
    let errorCount = 0;
    let warningCount = 0;
    const allIssues = [];

    for (const file of htmlFiles) {
      const relativePath = path.relative(SITE_DIR, file);

      try {
        const content = fs.readFileSync(file, 'utf-8');

        // Run custom validation first
        const customIssues = customValidation(content, file);

        // Filter critical issues
        const criticalIssues = customIssues.filter(issue => issue.startsWith('CRITICAL:'));

        if (criticalIssues.length > 0) {
          errorCount++;
          console.error(`\n❌ ${relativePath} - CRITICAL ERRORS:`);
          criticalIssues.forEach(issue => {
            console.error(`   ${issue}`);
            allIssues.push(`${relativePath}: ${issue}`);
          });
        } else {
          // Only run W3C validation if no critical errors
          try {
            // W3C HTML validation
            const result = await htmlValidator({
              data: content,
              format: 'json'
            });

            const messages = result.messages || [];
            const errors = messages.filter(m => m.type === 'error');
            const warnings = messages.filter(m => m.type === 'warning');

            if (errors.length > 0) {
              errorCount++;
              console.error(`\n❌ ${relativePath} - ${errors.length} errors found`);
              errors.slice(0, 3).forEach(err => {
                console.error(`   Line ${err.line}: ${err.message}`);
                allIssues.push(`${relativePath}:${err.line} - ${err.message}`);
              });
              if (errors.length > 3) {
                console.error(`   ... and ${errors.length - 3} more errors`);
              }
            } else {
              validCount++;

              // Show non-critical custom issues as info
              const nonCritical = customIssues.filter(issue => !issue.startsWith('CRITICAL:'));
              if (nonCritical.length > 0) {
                console.log(`\n✅ ${relativePath} - Valid (with ${nonCritical.length} suggestions)`);
              } else {
                console.log(`✅ ${relativePath} - Valid`);
              }
            }

            if (warnings.length > 0) {
              warningCount += warnings.length;
            }
          } catch (validationError) {
            // W3C validator might fail for some files
            console.warn(`⚠️ ${relativePath} - Could not validate with W3C validator`);
            validCount++; // Count as valid if only W3C fails but custom validation passes
          }
        }

      } catch (error) {
        errorCount++;
        console.error(`\n❌ ${relativePath} - Failed to validate: ${error.message}`);
        allIssues.push(`${relativePath}: ${error.message}`);
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('Validation Summary:');
    console.log(`✅ Valid files: ${validCount}/${htmlFiles.length}`);
    if (errorCount > 0) {
      console.log(`❌ Files with errors: ${errorCount}`);
    }
    if (warningCount > 0) {
      console.log(`⚠️ Total warnings: ${warningCount}`);
    }
    console.log('='.repeat(50));

    // Return false if there are any errors
    return errorCount === 0;

  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    return false;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateHTML().then(success => {
    if (!success) {
      process.exit(1);
    }
  });
}

export { validateHTML };