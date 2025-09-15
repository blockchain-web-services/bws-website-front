const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to remove opacity: 0 and transform styles
function removeOpacityStyles(content) {
  // Regular expression to match style attributes with opacity: 0 and transforms
  const styleRegex = /style="[^"]*opacity:\s*0[^"]*"/g;

  // Replace style attributes that contain opacity: 0
  content = content.replace(styleRegex, (match) => {
    // If the style only contains animation-related properties, remove it entirely
    if (match.includes('opacity: 0') &&
        (match.includes('transform') || match.includes('-webkit-transform') ||
         match.includes('-moz-transform') || match.includes('-ms-transform'))) {
      return ''; // Remove the entire style attribute
    }
    // Otherwise, just remove the opacity and transform properties
    return match
      .replace(/opacity:\s*0;?\s*/g, '')
      .replace(/-webkit-transform:[^;]+;?\s*/g, '')
      .replace(/-moz-transform:[^;]+;?\s*/g, '')
      .replace(/-ms-transform:[^;]+;?\s*/g, '')
      .replace(/transform:[^;]+;?\s*/g, '')
      .replace(/style="\s*"/g, ''); // Remove empty style attributes
  });

  // Clean up any resulting double spaces or line breaks
  content = content.replace(/\n\s*style="\s*"\s*\n/g, '\n');
  content = content.replace(/style="\s*"/g, '');

  return content;
}

// Find all component files
const componentFiles = glob.sync('src/components/**/*.astro');

console.log('Fixing opacity styles in components...');

componentFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const updatedContent = removeOpacityStyles(content);

  if (content !== updatedContent) {
    fs.writeFileSync(file, updatedContent);
    console.log(`✓ Fixed: ${path.basename(file)}`);
  }
});

console.log('Done! All opacity animation styles have been removed.');