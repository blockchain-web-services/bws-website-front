const fs = require('fs');
const path = require('path');

// Function to extract main content from HTML
function extractMainContent(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Remove scripts, styles, noscript tags
  let cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '');

  // Remove navigation sections
  cleaned = cleaned
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<div[^>]*class="[^"]*w-nav[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="[^"]*navigation[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, '');

  // Remove footer sections
  cleaned = cleaned
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<div[^>]*class="[^"]*footer[^"]*"[^>]*>[\s\S]*?<\/div>$/gi, '');

  // Remove background video
  cleaned = cleaned.replace(/<div[^>]*class="[^"]*background-lines-top[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');

  // Try to find the main content area
  let mainContent = '';

  // Look for main content patterns (all with global flag)
  const patterns = [
    /<main[^>]*class="[^"]*main-content[^"]*"[^>]*>([\s\S]*?)<\/main>/gi,
    /<section[^>]*class="[^"]*section-[^"]*"[^>]*>([\s\S]*?)<\/section>/gi,
    /<div[^>]*class="[^"]*container-medium[^"]*"[^>]*>([\s\S]*?)<\/div>(?=\s*<footer|$)/gi,
    /<div[^>]*class="[^"]*page-content[^"]*"[^>]*>([\s\S]*?)<\/div>(?=\s*<footer|$)/gi,
    /<article[^>]*>([\s\S]*?)<\/article>/gi,
    /<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>(?=\s*<footer|$)/gi
  ];

  for (const pattern of patterns) {
    const matches = [...cleaned.matchAll(pattern)];
    for (const match of matches) {
      if (match[0] && match[0].trim().length > 100) {
        mainContent += match[0];
      }
    }
    if (mainContent) break;
  }

  // If no main content found, get what's between body tags after cleaning
  if (!mainContent) {
    const bodyMatch = cleaned.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      mainContent = bodyMatch[1].trim();
    }
  }

  // Clean up opacity styles
  mainContent = mainContent.replace(/style="[^"]*opacity:\s*0[^"]*"/gi, '');

  // Replace CDN URLs
  mainContent = mainContent.replace(/https:\/\/cdn\.prod\.website-files\.com\//g, '/assets/images/');

  return mainContent;
}

// Pages to re-extract
const pagesToFix = [
  { file: 'about.html', component: 'aboutMainContent.astro' },
  { file: 'contact-us.html', component: 'contactusMainContent.astro' },
  { file: 'industries.html', component: 'industriesMainContent.astro' },
  { file: 'legal-notice.html', component: 'legalnoticeMainContent.astro' },
  { file: 'privacy-policy.html', component: 'privacypolicyMainContent.astro' },
  { file: 'resources.html', component: 'resourcesMainContent.astro' },
  { file: 'industry-content/content-creation.html', component: 'industrycontentcontentcreationMainContent.astro' },
  { file: 'industry-content/esg.html', component: 'industrycontentesgMainContent.astro' },
  { file: 'industry-content/financial-services.html', component: 'industrycontentfinancialservicesMainContent.astro' },
  { file: 'industry-content/legal.html', component: 'industrycontentlegalMainContent.astro' },
  { file: 'industry-content/retail.html', component: 'industrycontentretailMainContent.astro' },
  { file: 'industry-content/supply-chain.html', component: 'industrycontentsupplychainMainContent.astro' }
];

console.log('Re-extracting non-marketplace main content components...\n');

let fixed = 0;
let failed = 0;

pagesToFix.forEach(({ file, component }) => {
  const htmlPath = path.join('_site_backup', file);
  const componentPath = path.join('src/components', component);

  if (!fs.existsSync(htmlPath)) {
    console.log(`⚠️  ${file}: HTML file not found`);
    failed++;
    return;
  }

  try {
    const mainContent = extractMainContent(htmlPath);

    if (!mainContent || mainContent.length < 50) {
      console.log(`⚠️  ${component}: Couldn't extract sufficient content (${mainContent.length} chars)`);
      failed++;
    } else {
      const componentContent = `---
// Main content for ${file.replace('.html', '')} page
---

${mainContent}`;

      fs.writeFileSync(componentPath, componentContent);
      console.log(`✅ ${component}: Re-extracted with ${mainContent.length} chars`);
      fixed++;
    }
  } catch (error) {
    console.log(`❌ ${component}: ${error.message}`);
    failed++;
  }
});

// Also fix the articles pages which had similar issues
const articlePages = [
  {
    file: 'articles/discover-the-power-of-blockchain-bwss-data-management-solutions.html',
    component: 'articlesdiscoverthepowerofblockchainbwssdatamanagementsolutionsMainContent.astro'
  },
  {
    file: 'articles/investment-impact-reporting-unlocking-a-sustainable-future.html',
    component: 'articlesinvestmentimpactreportingunlockingasustainablefutureMainContent.astro'
  }
];

console.log('\nFixing article pages...');

articlePages.forEach(({ file, component }) => {
  const htmlPath = path.join('_site_backup', file);
  const componentPath = path.join('src/components', component);

  if (!fs.existsSync(htmlPath)) {
    console.log(`⚠️  ${file}: HTML file not found`);
    failed++;
    return;
  }

  try {
    const mainContent = extractMainContent(htmlPath);

    if (!mainContent || mainContent.length < 50) {
      console.log(`⚠️  ${component}: Couldn't extract sufficient content (${mainContent.length} chars)`);
      failed++;
    } else {
      const componentContent = `---
// Main content for ${file.replace('.html', '')} page
---

${mainContent}`;

      fs.writeFileSync(componentPath, componentContent);
      console.log(`✅ ${component}: Re-extracted with ${mainContent.length} chars`);
      fixed++;
    }
  } catch (error) {
    console.log(`❌ ${component}: ${error.message}`);
    failed++;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`Summary: ${fixed} components re-extracted, ${failed} failed`);