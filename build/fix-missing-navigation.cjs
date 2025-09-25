const fs = require('fs');
const path = require('path');

// List of pages that need Navigation component added
const pagesToFix = [
  // Root pages
  { file: 'about.astro', dir: 'src/pages' },
  { file: 'contact-us.astro', dir: 'src/pages' },
  { file: 'industries.astro', dir: 'src/pages' },
  { file: 'legal-notice.astro', dir: 'src/pages' },
  { file: 'privacy-policy.astro', dir: 'src/pages' },
  { file: 'resources.astro', dir: 'src/pages' },

  // Industry content pages
  { file: 'content-creation.astro', dir: 'src/pages/industry-content' },
  { file: 'esg.astro', dir: 'src/pages/industry-content' },
  { file: 'financial-services.astro', dir: 'src/pages/industry-content' },
  { file: 'legal.astro', dir: 'src/pages/industry-content' },
  { file: 'retail.astro', dir: 'src/pages/industry-content' },
  { file: 'supply-chain.astro', dir: 'src/pages/industry-content' }
];

console.log('Adding Navigation component to failing pages...\n');

let fixed = 0;
let failed = 0;

pagesToFix.forEach(({ file, dir }) => {
  const filePath = path.join(dir, file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${file}: File not found at ${filePath}`);
    failed++;
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Calculate the relative path from the page to components folder
    const relativePath = dir === 'src/pages' ? '../components' : '../../components';

    // Check if Navigation is already imported
    if (!content.includes('import Navigation from')) {
      // Add Navigation import after BaseLayout import
      content = content.replace(
        /import BaseLayout from ['"]['"].*?['"]['"];/,
        `$&\nimport Navigation from '${relativePath}/Navigation.astro';`
      );
    }

    // Check if Navigation component is used in the template
    if (!content.includes('<Navigation />')) {
      // Add Navigation component after opening BaseLayout tag
      content = content.replace(
        /<BaseLayout[^>]*>\s*/,
        '$&\n  <Navigation />'
      );
    }

    fs.writeFileSync(filePath, content);
    console.log(`✅ ${dir}/${file}: Added Navigation component`);
    fixed++;
  } catch (error) {
    console.log(`❌ ${dir}/${file}: ${error.message}`);
    failed++;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`Summary: ${fixed} pages fixed, ${failed} failed`);