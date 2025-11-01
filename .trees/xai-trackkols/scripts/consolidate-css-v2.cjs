#!/usr/bin/env node

/**
 * CSS Consolidation Script V2
 * Removes duplicate Webflow framework section from styles.css
 * Based on precise line number analysis
 */

const fs = require('fs');
const path = require('path');

const CSS_FILE = path.join(__dirname, '../public/styles.css');
const OUTPUT_FILE = path.join(__dirname, '../public/styles-consolidated.css');
const REPORT_FILE = path.join(__dirname, '../css-consolidation-report.json');

console.log('🔧 Starting CSS consolidation (V2)...\n');

// Read CSS file
const cssContent = fs.readFileSync(CSS_FILE, 'utf8');
const lines = cssContent.split('\n');

console.log(`   Original file: ${lines.length} lines`);

// Based on analysis:
// - First Webflow section: lines 869-3207 (keep this)
// - Duplicate Webflow section: lines 20846-23184 (remove this)
// - The duplicate ends right before the second "body {" selector

const DUPLICATE_START = 20845; // Line 20846 in 1-indexed (array is 0-indexed)
const DUPLICATE_END = 23184;   // Line 23184 in 1-indexed

console.log(`   Removing duplicate section:`);
console.log(`   - Start: line ${DUPLICATE_START + 1} (0-indexed: ${DUPLICATE_START})`);
console.log(`   - End: line ${DUPLICATE_END} (0-indexed: ${DUPLICATE_END - 1})`);
console.log(`   - Total lines to remove: ${DUPLICATE_END - DUPLICATE_START}`);

// Verify we're removing the right section
console.log(`\n   Verification:`);
console.log(`   - Line ${DUPLICATE_START + 1}: ${lines[DUPLICATE_START].substring(0, 50)}`);
console.log(`   - Line ${DUPLICATE_END}: ${lines[DUPLICATE_END - 1].substring(0, 50)}`);
console.log(`   - Line after removal: ${lines[DUPLICATE_END].substring(0, 50)}`);

// Create consolidated CSS
const consolidatedLines = [
  ...lines.slice(0, DUPLICATE_START),  // Everything before duplicate
  ...lines.slice(DUPLICATE_END)         // Everything after duplicate
];

const removedLines = DUPLICATE_END - DUPLICATE_START;

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
    startLine: DUPLICATE_START + 1,
    endLine: DUPLICATE_END,
    totalLines: removedLines,
    percentage: ((removedLines / lines.length) * 100).toFixed(1)
  },
  verification: {
    removedSectionStart: lines[DUPLICATE_START].substring(0, 100),
    removedSectionEnd: lines[DUPLICATE_END - 1].substring(0, 100),
    lineAfterRemoval: lines[DUPLICATE_END].substring(0, 100)
  }
};

fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

console.log(`\n✅ CSS consolidation complete!`);
console.log(`   Original: ${lines.length} lines`);
console.log(`   Consolidated: ${consolidatedLines.length} lines`);
console.log(`   Output saved to: ${OUTPUT_FILE}`);
console.log(`   Report saved to: ${REPORT_FILE}`);
console.log(`\n   ⚠️  Review the consolidated file before replacing the original!`);
