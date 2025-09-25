const fs = require('fs');
const crypto = require('crypto');

// Read the file
const filePath = '_site/index.html';
let content = fs.readFileSync(filePath, 'utf8');

// The duplicate ID to replace
const duplicateId = '05427ed1-27ed-d69d-326f-3d96834c8218';

// Generate unique IDs for each occurrence
const generateUniqueId = () => {
  return crypto.randomBytes(16).toString('hex').slice(0, 8) + '-' +
         crypto.randomBytes(16).toString('hex').slice(0, 4) + '-' +
         crypto.randomBytes(16).toString('hex').slice(0, 4) + '-' +
         crypto.randomBytes(16).toString('hex').slice(0, 4) + '-' +
         crypto.randomBytes(16).toString('hex').slice(0, 12);
};

// Find all occurrences and replace with unique IDs
let occurrenceCount = 0;
const regex = new RegExp(`data-w-id="${duplicateId}"`, 'g');

content = content.replace(regex, (match) => {
  occurrenceCount++;
  const newId = generateUniqueId();
  console.log(`Replacing occurrence ${occurrenceCount}: ${duplicateId} -> ${newId}`);
  return `data-w-id="${newId}"`;
});

// Write the updated content back
fs.writeFileSync(filePath, content, 'utf8');

console.log(`\nTotal replacements: ${occurrenceCount}`);
console.log('File updated successfully!');

// Verify no duplicates remain
const verifyNoDuplicates = () => {
  const idMatches = content.match(/data-w-id="([^"]+)"/g) || [];
  const ids = idMatches.map(match => match.replace(/data-w-id="([^"]+)"/, '$1'));
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

  if (duplicates.length > 0) {
    console.log('\nWarning: Still found duplicate IDs:', [...new Set(duplicates)]);
  } else {
    console.log('\n✓ No duplicate data-w-id attributes found!');
  }
};

verifyNoDuplicates();