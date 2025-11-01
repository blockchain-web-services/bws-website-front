const fs = require('fs');
const path = require('path');

// List of all non-marketplace pages
const nonMarketplacePages = [
  // Root pages
  { file: 'about.astro', dir: 'src/pages', componentSnake: 'aboutMainContent', componentPascal: 'AboutMainContent' },
  { file: 'contact-us.astro', dir: 'src/pages', componentSnake: 'contactusMainContent', componentPascal: 'ContactUsMainContent' },
  { file: 'industries.astro', dir: 'src/pages', componentSnake: 'industriesMainContent', componentPascal: 'IndustriesMainContent' },
  { file: 'legal-notice.astro', dir: 'src/pages', componentSnake: 'legalnoticeMainContent', componentPascal: 'LegalNoticeMainContent' },
  { file: 'privacy-policy.astro', dir: 'src/pages', componentSnake: 'privacypolicyMainContent', componentPascal: 'PrivacyPolicyMainContent' },
  { file: 'resources.astro', dir: 'src/pages', componentSnake: 'resourcesMainContent', componentPascal: 'ResourcesMainContent' },

  // Industry content pages
  { file: 'content-creation.astro', dir: 'src/pages/industry-content', componentSnake: 'industrycontentcontentcreationMainContent', componentPascal: 'IndustryContentContentCreationMainContent' },
  { file: 'esg.astro', dir: 'src/pages/industry-content', componentSnake: 'industrycontentesgMainContent', componentPascal: 'IndustryContentEsgMainContent' },
  { file: 'financial-services.astro', dir: 'src/pages/industry-content', componentSnake: 'industrycontentfinancialservicesMainContent', componentPascal: 'IndustryContentFinancialServicesMainContent' },
  { file: 'legal.astro', dir: 'src/pages/industry-content', componentSnake: 'industrycontentlegalMainContent', componentPascal: 'IndustryContentLegalMainContent' },
  { file: 'retail.astro', dir: 'src/pages/industry-content', componentSnake: 'industrycontentretailMainContent', componentPascal: 'IndustryContentRetailMainContent' },
  { file: 'supply-chain.astro', dir: 'src/pages/industry-content', componentSnake: 'industrycontentsupplychainMainContent', componentPascal: 'IndustryContentSupplyChainMainContent' },

  // Articles pages
  { file: 'discover-the-power-of-blockchain-bwss-data-management-solutions.astro', dir: 'src/pages/articles', componentSnake: 'articlesdiscoverthepowerofblockchainbwssdatamanagementsolutionsMainContent', componentPascal: 'ArticlesDiscoverThePowerOfBlockchainBwssDataManagementSolutionsMainContent' },
  { file: 'embrace-sustainability-with-esg-credits-bws-solution.astro', dir: 'src/pages/articles', componentSnake: 'articlesembracesustainabilitywithesgcreditsbwssolutionMainContent', componentPascal: 'ArticlesEmbraceSustainabilityWithEsgCreditsBwsSolutionMainContent' },
  { file: 'investment-impact-reporting-unlocking-a-sustainable-future.astro', dir: 'src/pages/articles', componentSnake: 'articlesinvestmentimpactreportingunlockingasustainablefutureMainContent', componentPascal: 'ArticlesInvestmentImpactReportingUnlockingASustainableFutureMainContent' }
];

console.log('Fixing non-marketplace component usage in Astro pages...\n');

let fixed = 0;
let failed = 0;

nonMarketplacePages.forEach(({ file, dir, componentSnake, componentPascal }) => {
  const filePath = path.join(dir, file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${file}: File not found at ${filePath}`);
    failed++;
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Calculate the relative path from the page to components folder
    const relativePath = dir === 'src/pages' ? '../components' : '../../components';

    // Fix the import statement
    const importRegex = new RegExp(`import ${componentSnake} from '${relativePath}/${componentSnake}.astro';`, 'g');
    if (content.includes(`import ${componentSnake}`)) {
      content = content.replace(importRegex, `import ${componentPascal} from '${relativePath}/${componentSnake}.astro';`);
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
      console.log(`✅ ${dir}/${file}: Fixed component import and usage`);
      fixed++;
    } else {
      console.log(`ℹ️  ${dir}/${file}: Already using PascalCase or different structure`);
    }
  } catch (error) {
    console.log(`❌ ${dir}/${file}: ${error.message}`);
    failed++;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`Summary: ${fixed} pages fixed, ${failed} failed`);