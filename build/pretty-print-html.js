const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SITE_DIR = path.join(__dirname, '..', '_site');

function findAllHtmlFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'assets') {
      files.push(...findAllHtmlFiles(fullPath));
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function formatHtml(html) {
  // Basic HTML formatting
  let formatted = html;
  
  // Add newlines before major tags
  formatted = formatted.replace(/(<(?:head|body|footer|section|div|nav|header|article|main|aside|script|style|link|meta)(?:\s[^>]*)?>)/gi, '\n$1');
  
  // Add newlines after closing tags
  formatted = formatted.replace(/(<\/(?:head|body|footer|section|div|nav|header|article|main|aside|script|style)>)/gi, '$1\n');
  
  // Fix multiple newlines
  formatted = formatted.replace(/\n\n+/g, '\n\n');
  
  // Trim whitespace
  formatted = formatted.trim();
  
  return formatted;
}

console.log('=== Pretty Printing and Validating HTML Files ===\n');

const htmlFiles = findAllHtmlFiles(SITE_DIR);
console.log(`Found ${htmlFiles.length} HTML files\n`);

let errorCount = 0;
const errors = [];

for (const file of htmlFiles) {
  const relativePath = path.relative(SITE_DIR, file);
  process.stdout.write(`Processing: ${relativePath}...`);
  
  try {
    let content = fs.readFileSync(file, 'utf8');
    
    // Format the HTML
    const formatted = formatHtml(content);
    
    // Write back formatted content
    fs.writeFileSync(file, formatted);
    
    // Basic syntax checks
    const issues = [];
    
    // Check for unclosed tags
    const openTags = content.match(/<([a-z]+)(?:\s[^>]*)?>(?!.*<\/\1>)/gi) || [];
    const selfClosing = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
    
    // Check for basic HTML structure
    if (!content.includes('<!DOCTYPE') && !content.includes('<!doctype')) {
      issues.push('Missing DOCTYPE declaration');
    }
    if (!content.includes('<html')) {
      issues.push('Missing <html> tag');
    }
    if (!content.includes('<head')) {
      issues.push('Missing <head> tag');
    }
    if (!content.includes('<body')) {
      issues.push('Missing <body> tag');
    }
    if (!content.includes('<title')) {
      issues.push('Missing <title> tag');
    }
    
    // Check for duplicate IDs (basic check)
    const idMatches = content.match(/id=["']([^"']+)["']/gi) || [];
    const ids = idMatches.map(match => match.replace(/id=["']([^"']+)["']/i, '$1'));
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      const uniqueDuplicates = Array.from(new Set(duplicateIds));
      issues.push(`Duplicate IDs found: ${uniqueDuplicates.join(', ')}`);
    }
    
    if (issues.length > 0) {
      console.log(` ⚠ Issues found:`);
      issues.forEach(issue => console.log(`    - ${issue}`));
      errors.push({ file: relativePath, issues });
      errorCount++;
    } else {
      console.log(' ✓ Formatted');
    }
    
  } catch (err) {
    console.log(` ✗ Error: ${err.message}`);
    errors.push({ file: relativePath, error: err.message });
    errorCount++;
  }
}

console.log(`\n=== Summary ===`);
console.log(`Processed: ${htmlFiles.length} files`);
console.log(`Issues found: ${errorCount} files with issues`);

if (errors.length > 0) {
  console.log('\n=== Files with Issues ===');
  errors.forEach(({ file, issues, error }) => {
    console.log(`\n${file}:`);
    if (issues) {
      issues.forEach(issue => console.log(`  - ${issue}`));
    }
    if (error) {
      console.log(`  Error: ${error}`);
    }
  });
}