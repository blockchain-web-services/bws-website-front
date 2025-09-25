const fs = require('fs');
const path = require('path');

// Function to extract ONLY the industry page main content
function extractIndustryContent(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Look for the industry page hero image and everything after it
  const heroImageRegex = /<img[^>]*class="industry-page-hero-image"[^>]*>/i;
  const heroMatch = html.match(heroImageRegex);

  if (!heroMatch) {
    console.log(`⚠️  No hero image found in ${htmlPath}`);
    return null;
  }

  // Get everything from the hero image onwards
  const startIndex = heroMatch.index;
  let contentAfterHero = html.substring(startIndex);

  // Find the end of the main content (before footer)
  const footerRegex = /<footer|<div[^>]*class="[^"]*footer[^"]*"|<!-- Footer -->/i;
  const footerMatch = contentAfterHero.match(footerRegex);

  let mainContent = contentAfterHero;
  if (footerMatch) {
    mainContent = contentAfterHero.substring(0, footerMatch.index);
  }

  // Clean up any remaining navigation fragments
  mainContent = mainContent
    .replace(/<nav[^>]*class="[^"]*nav[^"]*"[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<div[^>]*class="[^"]*menu[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/style="opacity:\s*0[^"]*"/gi, '');

  // Ensure CDN URLs are replaced
  mainContent = mainContent.replace(/https:\/\/cdn\.prod\.website-files\.com\//g, '/assets/images/');

  return mainContent.trim();
}

// Industry content pages to fix
const industryPages = [
  { file: 'industry-content/content-creation.html', component: 'industrycontentcontentcreationMainContent.astro' },
  { file: 'industry-content/esg.html', component: 'industrycontentesgMainContent.astro' },
  { file: 'industry-content/financial-services.html', component: 'industrycontentfinancialservicesMainContent.astro' },
  { file: 'industry-content/legal.html', component: 'industrycontentlegalMainContent.astro' },
  { file: 'industry-content/retail.html', component: 'industrycontentretailMainContent.astro' },
  { file: 'industry-content/supply-chain.html', component: 'industrycontentsupplychainMainContent.astro' }
];

console.log('Fixing industry content extraction...\n');

let fixed = 0;
let failed = 0;

industryPages.forEach(({ file, component }) => {
  const htmlPath = path.join('_site_backup', file);
  const componentPath = path.join('src/components', component);

  if (!fs.existsSync(htmlPath)) {
    console.log(`⚠️  ${file}: HTML file not found`);
    failed++;
    return;
  }

  try {
    const mainContent = extractIndustryContent(htmlPath);

    if (!mainContent || mainContent.length < 100) {
      console.log(`⚠️  ${component}: Couldn't extract sufficient content`);
      failed++;
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