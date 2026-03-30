const fs = require('fs');
const path = require('path');

// Fix all marketplace page imports to use proper PascalCase
const marketplacePages = [
  'database-immutable.astro',
  'database-mutable.astro',
  'blockchain-badges.astro',
  'ipfs-upload.astro',
  'nft-zeroknwoledge.astro',
  'telegram-xbot.astro'
];

console.log('Fixing marketplace page imports...\n');

marketplacePages.forEach(pageFile => {
  const pagePath = path.join(__dirname, '..', 'src', 'pages', 'marketplace', pageFile);

  if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf8');
    const originalContent = content;

    // Fix the import statement to use PascalCase
    const baseName = pageFile.replace('.astro', '').replace(/-/g, '');
    const lowercaseImport = `marketplace${baseName}MainContent.astro`;
    const properImport = baseName.charAt(0).toUpperCase() + baseName.slice(1);
    const pascalCaseImport = `Marketplace${properImport}MainContent.astro`;

    // Fix the import line
    content = content.replace(
      new RegExp(`from '../../components/${lowercaseImport}'`, 'i'),
      `from '../../components/${pascalCaseImport}'`
    );

    // Also fix the component usage
    const lowercaseComponent = `Marketplace${properImport}MainContent`;
    content = content.replace(
      new RegExp(`<${lowercaseComponent}`, 'gi'),
      `<Marketplace${properImport}MainContent`
    );

    if (content !== originalContent) {
      fs.writeFileSync(pagePath, content);
      console.log(`✓ Fixed imports in ${pageFile}`);
    } else {
      console.log(`  No changes needed for ${pageFile}`);
    }
  }
});

console.log('\nMarketplace import fixes completed!');