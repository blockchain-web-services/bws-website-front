#!/usr/bin/env node

/**
 * Test file for enhanced HTML validator
 * Tests that the validator properly detects malformed HTML
 */

const fs = require('fs');
const path = require('path');

// Import the validator
const { validateHTML } = require('./html-validator');

// Test cases with malformed HTML
const testCases = {
  'test-missing-doctype.html': `<html>
    <head><title>Test</title></head>
    <body>Content without DOCTYPE</body>
  </html>`,

  'test-missing-html.html': `<!DOCTYPE html>
    <head><title>Test</title></head>
    <body>Content without html tag</body>`,

  'test-missing-body.html': `<!DOCTYPE html>
    <html>
      <head><title>Test</title></head>
      <div>Content without body tag</div>
    </html>`,

  'test-malformed-html.html': `<!DOCTYPE html>
    <html
    <head><title>Test</title></head>
    <body>Malformed HTML tag</body>
    </html>`,

  'test-fragment.html': `<div class="w-embed w-iframe">
      <!-- Google Tag Manager (noscript) -->
      <!-- End Google Tag Manager (noscript) -->
    </div>
    <div class="page-wrapper hidden-overflow">
                </div>
                <div class="top-menu-column-options w-col w-col-6">
                  <div class="split-content header-center">
                      </div>`,

  'test-valid.html': `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Valid Test Page</title>
      </head>
      <body>
        <h1>Valid HTML5 Document</h1>
        <p>This should pass all validations.</p>
      </body>
    </html>`
};

// Create a temporary test directory
const TEST_DIR = path.join(__dirname, 'test-validation-files');
const ORIGINAL_SITE_DIR = path.join(__dirname, '..', '_site');

// Create test files
console.log('🧪 Setting up test files...\n');

if (!fs.existsSync(TEST_DIR)) {
  fs.mkdirSync(TEST_DIR);
}

// Write test files
Object.entries(testCases).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(TEST_DIR, filename), content);
  console.log(`Created test file: ${filename}`);
});

// Temporarily move test files to _site for validation
const TEST_SITE_DIR = path.join(__dirname, '..', '_site_test');

console.log('\n🔍 Testing enhanced validator...\n');

// Backup existing _site and create test directory
if (fs.existsSync(ORIGINAL_SITE_DIR)) {
  if (fs.existsSync(TEST_SITE_DIR)) {
    fs.rmSync(TEST_SITE_DIR, { recursive: true, force: true });
  }
  fs.renameSync(ORIGINAL_SITE_DIR, TEST_SITE_DIR);
}

// Move test files to _site
fs.renameSync(TEST_DIR, ORIGINAL_SITE_DIR);

// Run validation
validateHTML().then(success => {
  console.log('\n📊 Test Results:');
  console.log('================\n');

  if (success) {
    console.error('❌ PROBLEM: Validator passed when it should have failed!');
    console.error('   The validator did not detect the malformed HTML test cases.');
  } else {
    console.log('✅ SUCCESS: Validator correctly detected issues!');
    console.log('   The enhanced validator is working as expected.');

    // Check if validation report was created
    const reportPath = path.join(__dirname, 'validation-report.json');
    if (fs.existsSync(reportPath)) {
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
      console.log('\nDetected issues by file:');
      report.forEach(({ file, issues }) => {
        console.log(`\n📄 ${file}:`);
        issues.forEach(issue => {
          if (issue.includes('CRITICAL')) {
            console.log(`   🔴 ${issue}`);
          } else {
            console.log(`   ⚠️  ${issue}`);
          }
        });
      });
    }
  }

  // Restore original _site
  fs.rmSync(ORIGINAL_SITE_DIR, { recursive: true, force: true });
  if (fs.existsSync(TEST_SITE_DIR)) {
    fs.renameSync(TEST_SITE_DIR, ORIGINAL_SITE_DIR);
  }

  console.log('\n✨ Test complete. Original _site directory restored.');

  // Exit with appropriate code
  process.exit(success ? 1 : 0); // Exit with error if validator didn't catch issues
}).catch(error => {
  console.error('❌ Error during testing:', error);

  // Restore original _site on error
  if (fs.existsSync(ORIGINAL_SITE_DIR)) {
    fs.rmSync(ORIGINAL_SITE_DIR, { recursive: true, force: true });
  }
  if (fs.existsSync(TEST_SITE_DIR)) {
    fs.renameSync(TEST_SITE_DIR, ORIGINAL_SITE_DIR);
  }

  process.exit(1);
});