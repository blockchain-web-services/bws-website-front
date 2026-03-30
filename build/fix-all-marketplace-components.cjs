const fs = require('fs');
const path = require('path');

// List of all marketplace pages based on actual files in directory
const marketplacePages = [
  { file: 'blockchain-badges.astro', componentSnake: 'marketplaceblockchainbadgesMainContent', componentPascal: 'MarketplaceBlockchainBadgesMainContent' },
  { file: 'database-immutable.astro', componentSnake: 'marketplacedatabaseimmutableMainContent', componentPascal: 'MarketplaceDatabaseImmutableMainContent' },
  { file: 'database-mutable.astro', componentSnake: 'marketplacedatabasemutableMainContent', componentPascal: 'MarketplaceDatabaseMutableMainContent' },
  { file: 'ipfs-upload.astro', componentSnake: 'marketplaceipfsuploadMainContent', componentPascal: 'MarketplaceIpfsUploadMainContent' },
  { file: 'nft-zeroknwoledge.astro', componentSnake: 'marketplacenftzeroknwoledgeMainContent', componentPascal: 'MarketplaceNftZeroknwoledgeMainContent' },
  { file: 'telegram-xbot.astro', componentSnake: 'marketplacetelegramxbotMainContent', componentPascal: 'MarketplaceTelegramXbotMainContent' }
];

console.log('Fixing all marketplace component usage in Astro pages...\n');

let fixed = 0;
let failed = 0;

marketplacePages.forEach(({ file, componentSnake, componentPascal }) => {
  const filePath = path.join('src/pages/marketplace', file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${file}: File not found`);
    failed++;
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Fix the import statement
    const importRegex = new RegExp(`import ${componentSnake} from '../../components/${componentSnake}.astro';`, 'g');
    if (content.includes(`import ${componentSnake}`)) {
      content = content.replace(importRegex, `import ${componentPascal} from '../../components/${componentSnake}.astro';`);
      changed = true;
    }

    // Fix the component usage
    const usageRegex = new RegExp(`<${componentSnake} />`, 'g');
    if (content.includes(`<${componentSnake} />`)) {
      content = content.replace(usageRegex, `<${componentPascal} />`);
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ ${file}: Fixed component import and usage`);
      fixed++;
    } else {
      console.log(`ℹ️  ${file}: Already using PascalCase or different structure`);
    }
  } catch (error) {
    console.log(`❌ ${file}: ${error.message}`);
    failed++;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`Summary: ${fixed} pages fixed, ${failed} failed`);