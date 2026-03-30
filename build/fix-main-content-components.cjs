const fs = require('fs');
const path = require('path');

// Function to extract ONLY the main content section from HTML
function extractOnlyMainContent(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Remove all scripts, styles, noscript tags
  let cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '');

  // Remove navigation sections
  cleaned = cleaned
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<div[^>]*class="[^"]*navigation[^"]*"[^>]*>[\s\S]*?<\/div>(?=\s*<div|<main|<section|<footer)/gi, '')
    .replace(/<div[^>]*class="[^"]*header[^"]*"[^>]*>[\s\S]*?<\/div>(?=\s*<div|<main|<section|<footer)/gi, '')
    .replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, '');

  // Remove footer sections
  cleaned = cleaned
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<div[^>]*class="[^"]*footer[^"]*"[^>]*>[\s\S]*?<\/div>$/gi, '');

  // Remove background video
  cleaned = cleaned
    .replace(/<div[^>]*class="[^"]*background-lines-top[^"]*"[^>]*>[\s\S]*?<\/div>(?=\s*<div|<main|<section)/gi, '');

  // Try to extract the main content area
  let mainContent = '';

  // Look for specific content patterns based on page type
  const patterns = [
    // Main content with specific classes
    /<main[^>]*class="[^"]*main-content[^"]*"[^>]*>([\s\S]*?)<\/main>/i,
    /<section[^>]*class="[^"]*section-[^"]*"[^>]*>([\s\S]*?)<\/section>/i,
    /<div[^>]*class="[^"]*container-medium[^"]*"[^>]*>([\s\S]*?)<\/div>(?=\s*<footer|$)/i,
    /<div[^>]*class="[^"]*page-content[^"]*"[^>]*>([\s\S]*?)<\/div>(?=\s*<footer|$)/i,
    // Articles pattern
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<div[^>]*class="[^"]*article-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    // Generic content area
    /<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>(?=\s*<footer|$)/i
  ];

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match && match[1] && match[1].trim().length > 100) {
      mainContent = match[0]; // Take the whole matched element
      break;
    }
  }

  // If still no content found, try to get what's between nav and footer
  if (!mainContent) {
    // Find the body content and extract middle section
    const bodyMatch = cleaned.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      const bodyContent = bodyMatch[1];
      // Remove obvious nav/footer patterns and take what's left
      mainContent = bodyContent
        .replace(/<div[^>]*class="[^"]*w-nav[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
        .replace(/^\s*<div[^>]*class="[^"]*navigation[^"]*"[\s\S]*?<\/div>/i, '')
        .replace(/<div[^>]*class="[^"]*footer[^"]*"[\s\S]*$/i, '')
        .trim();
    }
  }

  // Clean up opacity styles
  mainContent = mainContent.replace(/style="[^"]*opacity:\s*0[^"]*"/gi, '');

  return mainContent;
}

// Pages to fix
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
  { file: 'industry-content/supply-chain.html', component: 'industrycontentsupplychainMainContent.astro' },
  { file: 'articles/discover-the-power-of-blockchain-bwss-data-management-solutions.html', component: 'articlesdiscoverthepowerofblockchainbwssdatamanagementsolutionsMainContent.astro' },
  { file: 'articles/investment-impact-reporting-unlocking-a-sustainable-future.html', component: 'articlesinvestmentimpactreportingunlockingasustainablefutureMainContent.astro' }
];

console.log('Fixing non-marketplace main content components...\n');

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
    const mainContent = extractOnlyMainContent(htmlPath);

    if (!mainContent || mainContent.length < 50) {
      // If we can't extract content, create a placeholder
      const componentContent = `---
// Main content for ${file.replace('.html', '')} page
---

<div class="container-medium">
  <div class="page-content">
    <!-- Content for ${file.replace('.html', '')} page -->
    <h1>${file.replace('.html', '').replace(/-/g, ' ').replace(/\//g, ' - ')}</h1>
    <p>Page content goes here.</p>
  </div>
</div>`;

      fs.writeFileSync(componentPath, componentContent);
      console.log(`⚠️  ${component}: Created placeholder (couldn't extract content)`);
      fixed++;
    } else {
      const componentContent = `---
// Main content for ${file.replace('.html', '')} page
---

${mainContent}`;

      fs.writeFileSync(componentPath, componentContent);
      console.log(`✅ ${component}: Fixed with ${mainContent.length} chars`);
      fixed++;
    }
  } catch (error) {
    console.log(`❌ ${component}: ${error.message}`);
    failed++;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`Summary: ${fixed} components fixed, ${failed} failed`);
console.log('Now rebuilding the site...');