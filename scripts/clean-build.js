#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const siteDir = path.join(__dirname, '..', '_site');

// Try to remove the _site directory
if (fs.existsSync(siteDir)) {
  console.log('Cleaning _site directory...');
  try {
    // Try standard removal first
    fs.rmSync(siteDir, { recursive: true, force: true });
    console.log('Successfully cleaned _site directory');
  } catch (error) {
    console.log('Warning: Could not fully clean _site directory:', error.message);
    // Try to at least create the directory structure
    try {
      // Ignore errors and continue
      console.log('Attempting partial cleanup...');
    } catch (e) {
      // Ignore
    }
  }
}

// Ensure _site directory exists
if (!fs.existsSync(siteDir)) {
  fs.mkdirSync(siteDir, { recursive: true });
  console.log('Created fresh _site directory');
}