#!/usr/bin/env node

/**
 * Simple test for enhanced HTML validator
 * Tests validation logic without file system operations
 */

const cheerio = require('cheerio');

// Copy of the enhanced customValidation function from html-validator.js
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

  return issues;
}

// Test cases
const testCases = [
  {
    name: 'Missing DOCTYPE',
    html: `<html><head><title>Test</title></head><body>Content</body></html>`,
    shouldFail: true
  },
  {
    name: 'Missing HTML tag',
    html: `<!DOCTYPE html><head><title>Test</title></head><body>Content</body>`,
    shouldFail: true
  },
  {
    name: 'Missing BODY tag',
    html: `<!DOCTYPE html><html><head><title>Test</title></head><div>Content</div></html>`,
    shouldFail: true
  },
  {
    name: 'Fragment (like the broken contact-us page)',
    html: `<div class="w-embed w-iframe">
      <!-- Google Tag Manager (noscript) -->
    </div>
    <div class="page-wrapper hidden-overflow">
    </div>`,
    shouldFail: true
  },
  {
    name: 'Malformed HTML tag',
    html: `<!DOCTYPE html>
<html
<head><title>Test</title></head>
<body>Content</body>
</html>`,
    shouldFail: true
  },
  {
    name: 'Valid HTML5',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Valid Page</title>
</head>
<body>
  <h1>Content</h1>
</body>
</html>`,
    shouldFail: false
  }
];

console.log('🧪 Testing Enhanced HTML Validator');
console.log('===================================\n');

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);
  const issues = customValidation(testCase.html, 'test.html');

  if (testCase.shouldFail && issues.length > 0) {
    console.log(`  ✅ Correctly detected issues:`);
    issues.forEach(issue => {
      if (issue.includes('CRITICAL')) {
        console.log(`     🔴 ${issue}`);
      } else {
        console.log(`     ⚠️  ${issue}`);
      }
    });
    passed++;
  } else if (!testCase.shouldFail && issues.length === 0) {
    console.log(`  ✅ Correctly validated as clean`);
    passed++;
  } else if (testCase.shouldFail && issues.length === 0) {
    console.log(`  ❌ FAILED: Should have detected issues but found none!`);
    failed++;
  } else {
    console.log(`  ❌ FAILED: Should be valid but found issues:`);
    issues.forEach(issue => console.log(`     - ${issue}`));
    failed++;
  }
  console.log();
});

console.log('📊 Test Summary');
console.log('===============');
console.log(`✅ Passed: ${passed}/${testCases.length}`);
console.log(`❌ Failed: ${failed}/${testCases.length}`);

if (failed === 0) {
  console.log('\n🎉 All tests passed! The enhanced validator is working correctly.');
  console.log('   It will now catch malformed HTML like the contact-us/legal-notice issue.');
} else {
  console.log('\n⚠️  Some tests failed. The validator may need adjustments.');
}

process.exit(failed > 0 ? 1 : 0);