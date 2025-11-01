#!/usr/bin/env node

/**
 * Test to verify the enhanced validator would have caught the original issue
 * This uses the EXACT malformed HTML that was in the broken contact-us and legal-notice pages
 */

const fs = require('fs');
const path = require('path');

// Create the exact malformed HTML that was in the original files
const malformedContactHTML = `---
// Main content for contact-us page
---

<div class="w-embed w-iframe">
      <!-- Google Tag Manager (noscript) -->

      <!-- End Google Tag Manager (noscript) -->
    </div>
    <div class="page-wrapper hidden-overflow">

                </div>
                <div class="top-menu-column-options w-col w-col-6">
                  <div class="split-content header-center">

                      </div>
                      <div data-hover="true" data-delay="100" class="nav-link-dropdown w-dropdown">
                        <div class="nav-link w-dropdown-toggle">
                          <div class="nav-link-dropdown-text split-horizontal">Developers</div>
                        </div>

                      </div>
                      <div data-hover="true" data-delay="100" class="nav-link-dropdown w-dropdown">
                        <div class="nav-link w-dropdown-toggle">
                          <div class="nav-link-dropdown-text">Resources</div>
                        </div>

                      </div>
                      <div data-hover="true" data-delay="100" class="nav-link-dropdown w-dropdown">
                        <div class="nav-link w-dropdown-toggle"><div class="nav-link-dropdown-text">Company</div></div>

                      </div>
                    </nav>
                  </div>
                </div>
                <div class="top-menu-column-sign w-col w-col-3">
                  <div class="split-content header-left">

                    </div>
                    <a
                      data-w-id="58db7844-5919-d71b-dd74-2323ed8dfff9"
                      href="https://prod.bws.ninja/front-sign-up.html"
                      class="button-primary header-button w-button"
                      >Get started</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>`;

// Test validation
console.log('🔍 Testing Enhanced Validator Against Original Malformed HTML');
console.log('==============================================================\n');

console.log('This is the EXACT HTML that was in the broken contact-us and legal-notice pages.\n');

// Create temp file to test
const tempDir = path.join(__dirname, 'temp-test');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

const testFile = path.join(tempDir, 'malformed-contact.html');
fs.writeFileSync(testFile, malformedContactHTML);

// Test with the actual validator
const { validateHTML } = require('./html-validator');

// Temporarily override SITE_DIR for testing
const originalSiteDir = path.join(__dirname, '..', '_site');
const Module = require('module');
const originalRequire = Module.prototype.require;

// Create a custom require that modifies the validator's SITE_DIR
Module.prototype.require = function(id) {
  if (id === './html-validator') {
    const validator = originalRequire.apply(this, arguments);
    // We can't easily override SITE_DIR, so we'll test the customValidation function directly
    return validator;
  }
  return originalRequire.apply(this, arguments);
};

// Import the customValidation function directly
const validatorCode = fs.readFileSync(path.join(__dirname, 'html-validator.js'), 'utf-8');
const customValidationMatch = validatorCode.match(/function customValidation\(html, filePath\) \{[\s\S]*?^\}/m);

// Extract and evaluate the function
const cheerio = require('cheerio');
eval(validatorCode.substring(0, validatorCode.indexOf('async function validateHTML')));

console.log('📋 Testing malformed HTML that was in contact-us.html and legal-notice.html:\n');

const issues = customValidation(malformedContactHTML, 'contact-us.html');

if (issues.length > 0) {
  console.log('✅ SUCCESS! The enhanced validator WOULD HAVE CAUGHT these issues:\n');
  issues.forEach(issue => {
    if (issue.includes('CRITICAL')) {
      console.log(`   🔴 ${issue}`);
    } else {
      console.log(`   ⚠️  ${issue}`);
    }
  });

  console.log('\n📊 Summary:');
  console.log('===========');
  console.log(`Total issues detected: ${issues.length}`);
  console.log(`Critical issues: ${issues.filter(i => i.includes('CRITICAL')).length}`);
  console.log(`Warnings: ${issues.filter(i => !i.includes('CRITICAL')).length}`);

  console.log('\n🎉 The enhanced validator successfully detects the malformed HTML!');
  console.log('   This issue would not have made it to production with the enhanced checks.');
} else {
  console.log('❌ PROBLEM: The validator did NOT detect any issues!');
  console.log('   The malformed HTML would still pass validation.');
}

// Cleanup
fs.rmSync(tempDir, { recursive: true, force: true });

process.exit(issues.length > 0 ? 0 : 1);