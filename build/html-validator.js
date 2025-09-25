#!/usr/bin/env node

/**
 * HTML Validator
 * Validates all HTML files for syntax errors and common issues
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const htmlValidator = require('html-validator');
const cheerio = require('cheerio');

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
  if (!$('head title').length) {
    issues.push(`Missing <title> tag in <head>`);
  }

  // Check for charset meta tag
  if (!$('head meta[charset]').length) {
    issues.push(`Missing charset meta tag in <head>`);
  }

  // Check for viewport meta tag (important for responsive design)
  if (!$('head meta[name="viewport"]').length) {
    issues.push(`Missing viewport meta tag in <head>`);
  }

  // Check for malformed HTML tag (e.g., unclosed angle bracket)
  if (html.match(/<html\s*$/m)) {
    issues.push(`CRITICAL: Malformed <html> tag (not properly closed with >)`);
  }

  // Check for unclosed tags
  const selfClosingTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

  // Check for duplicate IDs
  const ids = {};
  $('[id]').each((i, elem) => {
    const id = $(elem).attr('id');
    if (ids[id]) {
      issues.push(`Duplicate ID found: "${id}"`);
    }
    ids[id] = true;
  });

  // Check for empty alt attributes on images
  $('img').each((i, elem) => {
    const alt = $(elem).attr('alt');
    if (alt === undefined) {
      const src = $(elem).attr('src') || 'unknown';
      issues.push(`Image missing alt attribute: ${src}`);
    }
  });

  // Check for broken internal links
  $('a[href^="/"]').each((i, elem) => {
    const href = $(elem).attr('href');
    if (href && !href.startsWith('//') && !href.startsWith('http')) {
      const linkedFile = path.join(SITE_DIR, href.endsWith('/') ? href + 'index.html' : href);
      if (!href.includes('#') && !href.includes('?') &&
          !fs.existsSync(linkedFile) && !fs.existsSync(linkedFile + '.html')) {
        issues.push(`Broken internal link: ${href}`);
      }
    }
  });

  // Check for missing closing tags (including custom elements with hyphens)
  const openTags = html.match(/<([a-z][a-z0-9-]*)\b[^>]*>/gi) || [];
  const closeTags = html.match(/<\/([a-z][a-z0-9-]*)\s*>/gi) || [];

  const openCount = {};
  const closeCount = {};

  openTags.forEach(tag => {
    const match = tag.match(/^<([a-z][a-z0-9-]*)/i);
    if (match) {
      const tagName = match[1].toLowerCase();
      // Skip self-closing tags and tags that end with />
      if (!selfClosingTags.includes(tagName) && !tag.endsWith('/>')) {
        openCount[tagName] = (openCount[tagName] || 0) + 1;
      }
    }
  });

  closeTags.forEach(tag => {
    const match = tag.match(/^<\/([a-z][a-z0-9-]*)/i);
    if (match) {
      const tagName = match[1].toLowerCase();
      closeCount[tagName] = (closeCount[tagName] || 0) + 1;
    }
  });

  Object.keys(openCount).forEach(tag => {
    if (openCount[tag] !== (closeCount[tag] || 0)) {
      issues.push(`Mismatched tags: <${tag}> opened ${openCount[tag]} times but closed ${closeCount[tag] || 0} times`);
    }
  });

  return issues;
}

async function validateHTML() {
  console.log('🔍 Validating HTML files...');

  try {
    // Find all HTML files in the build directory
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
      process.stdout.write(`\r  Validating: ${relativePath}...`);

      try {
        const content = fs.readFileSync(file, 'utf-8');

        // Custom validation
        const customIssues = customValidation(content, file);

        // W3C validation (using local validation to avoid rate limits)
        const options = {
          data: content,
          format: 'json'
        };

        // For now, we'll use custom validation only to avoid external dependencies
        // const result = await htmlValidator(options);

        if (customIssues.length > 0) {
          errorCount++;
          allIssues.push({
            file: relativePath,
            issues: customIssues
          });
        } else {
          validCount++;
        }

      } catch (error) {
        errorCount++;
        allIssues.push({
          file: relativePath,
          issues: [`Validation error: ${error.message}`]
        });
      }
    }

    console.log('\n'); // New line after progress

    // Report results
    if (allIssues.length > 0) {
      console.error(`\n❌ Found issues in ${allIssues.length} files:\n`);

      // Save detailed report
      const reportPath = path.join(__dirname, 'validation-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(allIssues, null, 2));

      // Show summary
      allIssues.slice(0, 10).forEach(({ file, issues }) => {
        console.error(`📄 ${file}:`);
        issues.slice(0, 3).forEach(issue => {
          console.error(`   - ${issue}`);
        });
        if (issues.length > 3) {
          console.error(`   ... and ${issues.length - 3} more issues`);
        }
      });

      if (allIssues.length > 10) {
        console.error(`\n... and ${allIssues.length - 10} more files with issues`);
      }

      console.error(`\n📊 Full report saved to: ${reportPath}`);
      return false;
    }

    console.log(`✅ All ${validCount} HTML files passed validation`);
    return true;

  } catch (error) {
    console.error('❌ Error during validation:', error);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  validateHTML().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { validateHTML };