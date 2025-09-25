#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const navPath = path.join(__dirname, '..', 'src', '_data', 'navigation.json');

// Read navigation file
const navigation = JSON.parse(fs.readFileSync(navPath, 'utf-8'));

// Function to fix URLs
function fixUrl(url) {
  if (!url) return url;
  
  // Skip external URLs, anchors, and root
  if (url.startsWith('http://') || 
      url.startsWith('https://') || 
      url.startsWith('#') ||
      url === '/') {
    return url;
  }
  
  // Skip if already has .html
  if (url.endsWith('.html')) {
    return url;
  }
  
  // Add .html extension
  return url + '.html';
}

// Fix URLs recursively
function fixNavigationUrls(items) {
  if (!items) return;
  
  items.forEach(item => {
    if (item.url) {
      item.url = fixUrl(item.url);
    }
    
    if (item.children) {
      fixNavigationUrls(item.children);
    }
  });
}

// Fix main navigation
if (navigation.main) {
  fixNavigationUrls(navigation.main);
}

// Fix footer navigation
if (navigation.footer) {
  if (navigation.footer.solutions) {
    fixNavigationUrls(navigation.footer.solutions);
  }
  if (navigation.footer.company) {
    fixNavigationUrls(navigation.footer.company);
  }
  if (navigation.footer.resources) {
    fixNavigationUrls(navigation.footer.resources);
  }
  if (navigation.footer.legal) {
    fixNavigationUrls(navigation.footer.legal);
  }
}

// Write back
fs.writeFileSync(navPath, JSON.stringify(navigation, null, 2));

console.log('✅ Fixed navigation URLs - added .html extension where needed');
console.log('Navigation file updated:', navPath);