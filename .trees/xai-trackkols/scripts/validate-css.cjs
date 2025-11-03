#!/usr/bin/env node

/**
 * CSS Validation Script
 * Validates CSS file structure (balanced braces, no orphaned rules)
 */

const fs = require('fs');
const path = require('path');

const cssFile = process.argv[2] || path.join(__dirname, '../public/styles-consolidated.css');

console.log(`🔍 Validating CSS file: ${cssFile}\n`);

const cssContent = fs.readFileSync(cssFile, 'utf8');
const lines = cssContent.split('\n');

let braceDepth = 0;
let maxDepth = 0;
let errors = [];
let warnings = [];

// Track brace balance
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const lineNum = i + 1;

  // Count braces
  const openBraces = (line.match(/{/g) || []).length;
  const closeBraces = (line.match(/}/g) || []).length;

  braceDepth += openBraces - closeBraces;

  if (braceDepth > maxDepth) {
    maxDepth = braceDepth;
  }

  if (braceDepth < 0) {
    errors.push(`Line ${lineNum}: Unmatched closing brace (depth: ${braceDepth})`);
  }

  // Check for potential issues
  if (line.trim().startsWith('}') && line.trim().length > 1 && !line.includes('/*')) {
    warnings.push(`Line ${lineNum}: Content after closing brace: ${line.trim().substring(0, 50)}`);
  }
}

// Final validation
console.log('📊 Validation Results:');
console.log(`   Total lines: ${lines.length}`);
console.log(`   Max nesting depth: ${maxDepth}`);
console.log(`   Final brace depth: ${braceDepth}`);
console.log(`   Errors: ${errors.length}`);
console.log(`   Warnings: ${warnings.length}`);

if (braceDepth !== 0) {
  errors.push(`Final brace depth is ${braceDepth} (should be 0)`);
}

if (errors.length > 0) {
  console.log('\n❌ Errors found:');
  errors.forEach(err => console.log(`   ${err}`));
  process.exit(1);
} else {
  console.log('\n✅ CSS structure is valid!');
  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.slice(0, 5).forEach(warn => console.log(`   ${warn}`));
    if (warnings.length > 5) {
      console.log(`   ... and ${warnings.length - 5} more warnings`);
    }
  }
  process.exit(0);
}
