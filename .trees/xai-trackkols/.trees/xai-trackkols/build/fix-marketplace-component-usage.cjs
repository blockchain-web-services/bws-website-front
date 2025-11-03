const fs = require('fs');
const path = require('path');

// List of all marketplace pages and their component names
const marketplacePages = [
  { file: 'database-immutable.astro', componentSnake: 'marketplacedatabaseimmutableMainContent', componentPascal: 'MarketplaceDatabaseImmutableMainContent' },
  { file: 'nft-gamecube.astro', componentSnake: 'marketplacenftgamecubeMainContent', componentPascal: 'MarketplaceNftGamecubeMainContent' },
  { file: 'supply-chain-transparency-product.astro', componentSnake: 'marketplacesupplychaintransparencyproductMainContent', componentPascal: 'MarketplaceSupplyChainTransparencyProductMainContent' },
  { file: 'third-party-risk-manager.astro', componentSnake: 'marketplacethirdpartyriskmanagerMainContent', componentPascal: 'MarketplaceThirdPartyRiskManagerMainContent' },
  { file: 'transparency-one.astro', componentSnake: 'marketplacetransparencyoneMainContent', componentPascal: 'MarketplaceTransparencyOneMainContent' },
  { file: 'usp-universal-standard-products.astro', componentSnake: 'marketplaceuspuniversalstandardproductsMainContent', componentPascal: 'MarketplaceUspUniversalStandardProductsMainContent' },
  { file: 'valid8me-credential-verification.astro', componentSnake: 'marketplacevalid8mecredentialverificationMainContent', componentPascal: 'MarketplaceValid8meCredentialVerificationMainContent' }
];

console.log('Fixing marketplace component usage in Astro pages...\n');

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

    // Fix the import statement
    const importRegex = new RegExp(`import ${componentSnake} from '../../components/${componentSnake}.astro';`, 'g');
    content = content.replace(importRegex, `import ${componentPascal} from '../../components/${componentSnake}.astro';`);

    // Fix the component usage
    const usageRegex = new RegExp(`<${componentSnake} />`, 'g');
    content = content.replace(usageRegex, `<${componentPascal} />`);

    fs.writeFileSync(filePath, content);
    console.log(`✅ ${file}: Fixed component import and usage`);
    fixed++;
  } catch (error) {
    console.log(`❌ ${file}: ${error.message}`);
    failed++;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`Summary: ${fixed} pages fixed, ${failed} failed`);