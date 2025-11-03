#!/usr/bin/env node

/**
 * CSS Consolidation Script
 * Removes duplicate Webflow framework section from styles.css
 */

const fs = require('fs');
const path = require('path');

const CSS_FILE = path.join(__dirname, '../public/styles.css');
const OUTPUT_FILE = path.join(__dirname, '../public/styles.css');
const REPORT_FILE = path.join(__dirname, '../css-consolidation-report.json');

console.log('🔧 Starting CSS consolidation...\n');

// Read CSS file
const cssContent = fs.readFileSync(CSS_FILE, 'utf8');
const lines = cssContent.split('\n');

console.log(`   Original file: ${lines.length} lines`);

// Strategy: Find where the duplicate Webflow framework starts
// Based on analysis, duplicates occur around lines 20,000-40,000
// We'll identify the duplicate section by finding repeated Webflow class patterns

// Key markers from the analysis report:
// First Webflow section: lines ~869-3205 (w-col-stack, w-col-small-12, etc.)
// Duplicate section starts around: line ~20,846-23,182

const DUPLICATE_START_MARKER = 20800; // Start scanning from here
const DUPLICATE_END_MARKER = 23200; // End scanning here

// More precise approach: Find the exact duplicate pattern
// Looking for the second occurrence of distinctive Webflow framework selectors

let firstWebflowSectionStart = -1;
let firstWebflowSectionEnd = -1;
let secondWebflowSectionStart = -1;
let secondWebflowSectionEnd = -1;

// Find first occurrence of Webflow framework (should be around line 869)
for (let i = 0; i < Math.min(lines.length, 5000); i++) {
  if (lines[i].includes('@media screen and (max-width: 991px)') &&
      i < 1000 &&
      lines[i + 5]?.includes('.w-col-stack')) {
    firstWebflowSectionStart = i;
    console.log(`   Found first Webflow section start at line ${i + 1}`);
    break;
  }
}

// Find where first section ends (look for non-Webflow custom classes)
if (firstWebflowSectionStart !== -1) {
  for (let i = firstWebflowSectionStart + 100; i < Math.min(lines.length, 15000); i++) {
    // Look for end of Webflow classes section
    if (lines[i].includes('.hero-section') ||
        lines[i].includes('.container-head') ||
        (lines[i].includes('.') && !lines[i].includes('.w-'))) {
      firstWebflowSectionEnd = i - 1;
      console.log(`   First Webflow section ends around line ${i}`);
      break;
    }
  }
}

// Find second occurrence of the same pattern (should be around line 20,846)
for (let i = DUPLICATE_START_MARKER; i < Math.min(lines.length, DUPLICATE_END_MARKER); i++) {
  if (lines[i].includes('@media screen and (max-width: 991px)') &&
      lines[i + 5]?.includes('.w-col-stack')) {
    secondWebflowSectionStart = i;
    console.log(`   Found duplicate Webflow section start at line ${i + 1}`);
    break;
  }
}

// Find where duplicate section ends
if (secondWebflowSectionStart !== -1) {
  for (let i = secondWebflowSectionStart + 100; i < Math.min(lines.length, 35000); i++) {
    // Look for end of duplicate Webflow classes section
    if (lines[i].includes('.hero-section') ||
        lines[i].includes('.container-head') ||
        lines[i].includes('.industry-page-hero-image') ||
        (lines[i].includes('.') && !lines[i].includes('.w-') && !lines[i].includes('@media'))) {
      secondWebflowSectionEnd = i - 1;
      console.log(`   Duplicate Webflow section ends around line ${i}`);
      break;
    }
  }
}

// Create consolidated CSS by removing the duplicate section
let consolidatedLines = [];
let removedLines = 0;

if (secondWebflowSectionStart !== -1 && secondWebflowSectionEnd !== -1) {
  console.log(`\n   Removing lines ${secondWebflowSectionStart + 1} to ${secondWebflowSectionEnd + 1}`);
  console.log(`   Total lines to remove: ${secondWebflowSectionEnd - secondWebflowSectionStart + 1}`);

  // Copy everything before the duplicate section
  consolidatedLines = lines.slice(0, secondWebflowSectionStart);

  // Skip the duplicate section
  removedLines = secondWebflowSectionEnd - secondWebflowSectionStart + 1;

  // Copy everything after the duplicate section
  consolidatedLines = consolidatedLines.concat(lines.slice(secondWebflowSectionEnd + 1));

  console.log(`\n   Consolidated file: ${consolidatedLines.length} lines`);
  console.log(`   Reduction: ${removedLines} lines (${((removedLines / lines.length) * 100).toFixed(1)}%)`);

  // Write consolidated CSS
  fs.writeFileSync(OUTPUT_FILE, consolidatedLines.join('\n'));

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    original: {
      file: CSS_FILE,
      lines: lines.length
    },
    consolidated: {
      file: OUTPUT_FILE,
      lines: consolidatedLines.length
    },
    removed: {
      startLine: secondWebflowSectionStart + 1,
      endLine: secondWebflowSectionEnd + 1,
      totalLines: removedLines,
      percentage: ((removedLines / lines.length) * 100).toFixed(1)
    },
    firstWebflowSection: {
      startLine: firstWebflowSectionStart + 1,
      endLine: firstWebflowSectionEnd + 1
    },
    duplicateSection: {
      startLine: secondWebflowSectionStart + 1,
      endLine: secondWebflowSectionEnd + 1
    }
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

  console.log(`\n✅ CSS consolidation complete!`);
  console.log(`   Original: ${lines.length} lines`);
  console.log(`   Consolidated: ${consolidatedLines.length} lines`);
  console.log(`   Report saved to: ${REPORT_FILE}`);
} else {
  console.log('\n❌ Could not identify duplicate section boundaries');
  console.log('   No changes made to CSS file');
  process.exit(1);
}
