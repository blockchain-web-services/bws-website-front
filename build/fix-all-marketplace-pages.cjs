const fs = require('fs');
const path = require('path');

// Map of page files to their correct component names (as they exist in filesystem)
const marketplacePageMap = {
  'database-immutable.astro': 'marketplacedatabaseimmutableMainContent',
  'database-mutable.astro': 'marketplacedatabasemutableMainContent',
  'blockchain-badges.astro': 'marketplaceblockchainbadgesMainContent',
  'ipfs-upload.astro': 'marketplaceipfsuploadMainContent',
  'nft-zeroknwoledge.astro': 'marketplacenftzeroknwoledgeMainContent',
  'telegram-xbot.astro': 'marketplacetelegramxbotMainContent'
};

console.log('Fixing all marketplace pages with correct component imports...\n');

Object.entries(marketplacePageMap).forEach(([pageFile, componentName]) => {
  const pagePath = path.join(__dirname, '..', 'src', 'pages', 'marketplace', pageFile);

  if (fs.existsSync(pagePath)) {
    // Create proper PascalCase component name for import and usage
    const pascalCaseName = componentName.charAt(0).toUpperCase() +
                          componentName.slice(1).replace(/MainContent$/, '') + 'MainContent';

    const content = `---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Navigation from '../../components/Navigation.astro';
import Footer from '../../components/Footer.astro';
import Scripts from '../../components/Scripts.astro';
import ${pascalCaseName} from '../../components/${componentName}.astro';

const pageTitle = 'BWS - ${pageFile.replace('.astro', '').replace(/-/g, ' ')}';
const pageDescription = 'BWS - Enterprise blockchain solutions';
---

<BaseLayout title={pageTitle} description={pageDescription}>
  <Navigation />
  <${pascalCaseName} />
  <Footer />

  <Fragment slot="scripts">
    <Scripts />
  </Fragment>
</BaseLayout>`;

    fs.writeFileSync(pagePath, content);
    console.log(`✓ Fixed ${pageFile}`);
  }
});

console.log('\nAll marketplace pages fixed!');