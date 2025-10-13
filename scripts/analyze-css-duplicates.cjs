#!/usr/bin/env node

/**
 * CSS Duplicate Analysis Script
 * Analyzes styles.css for duplicate selectors and media queries
 */

const fs = require('fs');
const path = require('path');

const CSS_FILE = path.join(__dirname, '../public/styles.css');
const OUTPUT_FILE = path.join(__dirname, '../css-analysis-report.json');

console.log('🔍 Analyzing CSS for duplicates...\n');

// Read CSS file
const cssContent = fs.readFileSync(CSS_FILE, 'utf8');
const lines = cssContent.split('\n');

// Data structures
const selectorIndex = new Map(); // selector -> [{ line, inMediaQuery, mediaQuery, properties }]
const mediaQueries = new Map(); // mediaQuery -> { line, selectors: Set }
const propertyConflicts = [];

// Parse state
let currentMediaQuery = null;
let mediaQueryStack = [];
let currentSelector = null;
let currentProperties = [];
let lineNumber = 0;
let braceDepth = 0;

// Helper to normalize selectors
function normalizeSelector(selector) {
  return selector.trim().replace(/\s+/g, ' ');
}

// Helper to track brace depth
function updateBraceDepth(line) {
  const openBraces = (line.match(/{/g) || []).length;
  const closeBraces = (line.match(/}/g) || []).length;
  return openBraces - closeBraces;
}

// Parse CSS line by line
for (const line of lines) {
  lineNumber++;
  const trimmedLine = line.trim();

  // Track brace depth for media query context
  const braceChange = updateBraceDepth(line);

  // Detect media query start
  if (trimmedLine.startsWith('@media')) {
    const mqMatch = trimmedLine.match(/@media\s+([^{]+)/);
    if (mqMatch) {
      const mediaQuery = mqMatch[1].trim();
      mediaQueryStack.push({ query: mediaQuery, line: lineNumber, depth: braceDepth });
      currentMediaQuery = mediaQuery;

      if (!mediaQueries.has(mediaQuery)) {
        mediaQueries.set(mediaQuery, { lines: [], selectors: new Set() });
      }
      mediaQueries.get(mediaQuery).lines.push(lineNumber);
    }
  }

  // Detect selector (starts with . or # or element, not @)
  if (trimmedLine && !trimmedLine.startsWith('@') && !trimmedLine.startsWith('/*') &&
      trimmedLine.match(/^[.#a-zA-Z]/) && trimmedLine.includes('{')) {
    const selectorMatch = trimmedLine.match(/^([^{]+)\s*{/);
    if (selectorMatch) {
      currentSelector = normalizeSelector(selectorMatch[1]);
      currentProperties = [];

      // Record selector
      if (!selectorIndex.has(currentSelector)) {
        selectorIndex.set(currentSelector, []);
      }
    }
  }

  // Detect property
  if (currentSelector && trimmedLine.includes(':') && !trimmedLine.startsWith('@') && !trimmedLine.startsWith('/*')) {
    const propMatch = trimmedLine.match(/^\s*([a-z-]+)\s*:\s*([^;]+);?/);
    if (propMatch) {
      currentProperties.push({
        property: propMatch[1].trim(),
        value: propMatch[2].trim()
      });
    }
  }

  // Detect selector end
  if (currentSelector && trimmedLine.includes('}') && braceDepth === (currentMediaQuery ? mediaQueryStack[mediaQueryStack.length - 1]?.depth + 1 : 0)) {
    selectorIndex.get(currentSelector).push({
      line: lineNumber - currentProperties.length - 1,
      inMediaQuery: currentMediaQuery !== null,
      mediaQuery: currentMediaQuery,
      properties: [...currentProperties]
    });

    if (currentMediaQuery) {
      mediaQueries.get(currentMediaQuery).selectors.add(currentSelector);
    }

    currentSelector = null;
    currentProperties = [];
  }

  // Update brace depth after processing
  braceDepth += braceChange;

  // Detect media query end
  if (mediaQueryStack.length > 0 && braceDepth <= mediaQueryStack[mediaQueryStack.length - 1].depth) {
    mediaQueryStack.pop();
    currentMediaQuery = mediaQueryStack.length > 0 ? mediaQueryStack[mediaQueryStack.length - 1].query : null;
  }
}

// Analyze duplicates
const duplicateSelectors = [];
const duplicateMediaQueries = [];

// Find duplicate selectors
for (const [selector, occurrences] of selectorIndex.entries()) {
  if (occurrences.length > 1) {
    // Check for property conflicts
    const baseOccurrences = occurrences.filter(o => !o.inMediaQuery);
    const mqOccurrences = occurrences.filter(o => o.inMediaQuery);

    if (baseOccurrences.length > 1) {
      // Multiple base definitions
      const conflicts = findPropertyConflicts(selector, baseOccurrences);
      duplicateSelectors.push({
        selector,
        count: baseOccurrences.length,
        lines: baseOccurrences.map(o => o.line),
        context: 'base',
        conflicts
      });
    }

    // Group by media query
    const mqGroups = new Map();
    for (const occ of mqOccurrences) {
      if (!mqGroups.has(occ.mediaQuery)) {
        mqGroups.set(occ.mediaQuery, []);
      }
      mqGroups.get(occ.mediaQuery).push(occ);
    }

    for (const [mq, occs] of mqGroups.entries()) {
      if (occs.length > 1) {
        const conflicts = findPropertyConflicts(selector, occs);
        duplicateSelectors.push({
          selector,
          count: occs.length,
          lines: occs.map(o => o.line),
          context: `media query: ${mq}`,
          conflicts
        });
      }
    }
  }
}

// Find duplicate media queries
for (const [mediaQuery, data] of mediaQueries.entries()) {
  if (data.lines.length > 1) {
    duplicateMediaQueries.push({
      mediaQuery,
      count: data.lines.length,
      lines: data.lines,
      selectorCount: data.selectors.size,
      selectors: Array.from(data.selectors).slice(0, 10) // Sample
    });
  }
}

// Helper to find property conflicts
function findPropertyConflicts(selector, occurrences) {
  const propertyMap = new Map();
  const conflicts = [];

  for (const occ of occurrences) {
    for (const prop of occ.properties) {
      if (!propertyMap.has(prop.property)) {
        propertyMap.set(prop.property, []);
      }
      propertyMap.get(prop.property).push({
        value: prop.value,
        line: occ.line
      });
    }
  }

  for (const [property, values] of propertyMap.entries()) {
    const uniqueValues = new Set(values.map(v => v.value));
    if (uniqueValues.size > 1) {
      conflicts.push({
        property,
        values: Array.from(uniqueValues),
        occurrences: values
      });
    }
  }

  return conflicts;
}

// Generate report
const report = {
  summary: {
    totalLines: lines.length,
    totalSelectors: selectorIndex.size,
    duplicateSelectors: duplicateSelectors.length,
    duplicateMediaQueries: duplicateMediaQueries.length,
    analysisDate: new Date().toISOString()
  },
  duplicateSelectors: duplicateSelectors.sort((a, b) => b.count - a.count).slice(0, 50),
  duplicateMediaQueries: duplicateMediaQueries.sort((a, b) => b.count - a.count),
  topDuplicates: duplicateSelectors.sort((a, b) => b.count - a.count).slice(0, 10),
  mediaQueryBreakdown: Array.from(mediaQueries.entries()).map(([mq, data]) => ({
    mediaQuery: mq,
    occurrences: data.lines.length,
    lines: data.lines,
    selectorsCount: data.selectors.size
  })).sort((a, b) => b.occurrences - a.occurrences)
};

// Write report
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));

// Console summary
console.log('📊 Analysis Summary:');
console.log(`   Total lines: ${report.summary.totalLines}`);
console.log(`   Total unique selectors: ${report.summary.totalSelectors}`);
console.log(`   Duplicate selectors: ${report.summary.duplicateSelectors}`);
console.log(`   Duplicate media queries: ${report.summary.duplicateMediaQueries}`);
console.log('');
console.log('🔝 Top 10 Most Duplicated Selectors:');
report.topDuplicates.forEach((dup, i) => {
  console.log(`   ${i + 1}. ${dup.selector} (${dup.count}x) - ${dup.context}`);
  console.log(`      Lines: ${dup.lines.join(', ')}`);
  if (dup.conflicts.length > 0) {
    console.log(`      ⚠️  ${dup.conflicts.length} property conflict(s)`);
  }
});
console.log('');
console.log('📱 Media Query Breakdown:');
report.mediaQueryBreakdown.forEach(mq => {
  console.log(`   ${mq.mediaQuery}: ${mq.occurrences}x occurrences, ${mq.selectorsCount} selectors`);
});
console.log('');
console.log(`✅ Full report saved to: ${OUTPUT_FILE}`);
