const fs = require('fs');
const path = require('path');

// Function to extract main content between navigation and footer
function extractMainContentSimple(html) {
  // Remove scripts, styles, noscript
  let cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '');

  // Try to find content between navigation end and footer start
  let mainContent = '';

  // Method 1: Find content after </nav> or </header> and before <footer>
  const navEndMatch = cleaned.match(/<\/(nav|header|div[^>]*class="[^"]*nav[^"]*"[^>]*)>[\s\S]*?<footer/i);
  if (navEndMatch) {
    const afterNav = cleaned.indexOf(navEndMatch[0]) + navEndMatch[0].indexOf('>') + 1;
    const beforeFooter = cleaned.indexOf('<footer', afterNav);
    if (beforeFooter > afterNav) {
      mainContent = cleaned.substring(afterNav, beforeFooter);
    }
  }

  // Method 2: If no footer, try to get content after navigation
  if (!mainContent) {
    const navEnd = cleaned.search(/<\/nav>|<\/header>|<\/div[^>]*class="[^"]*header[^"]*"[^>]*>/i);
    if (navEnd > 0) {
      const footerStart = cleaned.indexOf('<footer');
      if (footerStart > navEnd) {
        mainContent = cleaned.substring(navEnd, footerStart);
      } else {
        // No footer found, get rest of content
        mainContent = cleaned.substring(navEnd);
      }
    }
  }

  // Method 3: Try to extract specific section classes
  if (!mainContent || mainContent.length < 500) {
    const sectionMatch = cleaned.match(/<(section|div)[^>]*class="[^"]*(section-|container-medium|main-content)[^"]*"[^>]*>[\s\S]*?<\/(section|div)>/i);
    if (sectionMatch) {
      mainContent = sectionMatch[0];
    }
  }

  // Clean up the extracted content
  mainContent = mainContent
    .replace(/^\s*<\/[^>]+>/, '') // Remove any closing tags at the start
    .replace(/<footer[\s\S]*$/i, '') // Remove any footer that might be included
    .replace(/style="[^"]*opacity:\s*0[^"]*"/gi, '') // Remove opacity:0 styles
    .trim();

  return mainContent;
}

// Function to create component name
function createComponentName(pagePath) {
  const name = pagePath
    .replace('.html', '')
    .replace(/\//g, '')
    .replace(/-/g, '');
  return name + 'MainContent';
}

// Pages to re-extract
const pagesToFix = [
  'about.html',
  'contact-us.html',
  'industries.html',
  'legal-notice.html',
  'privacy-policy.html',
  'resources.html',
  'industry-content/content-creation.html',
  'industry-content/esg.html',
  'industry-content/financial-services.html',
  'industry-content/legal.html',
  'industry-content/retail.html',
  'industry-content/supply-chain.html',
  'articles/discover-the-power-of-blockchain-bwss-data-management-solutions.html',
  'articles/investment-impact-reporting-unlocking-a-sustainable-future.html'
];

console.log('Re-extracting main content for affected pages...\n');

let fixed = 0;
let failed = 0;

pagesToFix.forEach(page => {
  const backupPath = path.join('_site_backup', page);
  const componentName = createComponentName(page);
  const componentPath = path.join('src/components', componentName + '.astro');

  if (!fs.existsSync(backupPath)) {
    console.log(`⚠️  ${page}: Backup file not found`);
    failed++;
    return;
  }

  try {
    // Read the original HTML
    const originalHTML = fs.readFileSync(backupPath, 'utf8');

    // Extract main content
    let mainContent = extractMainContentSimple(originalHTML);

    // If we couldn't extract much content, there's a problem
    if (!mainContent || mainContent.length < 200) {
      // As a fallback, try to get the body content minus obvious navigation/footer
      const bodyMatch = originalHTML.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      if (bodyMatch) {
        mainContent = bodyMatch[1]
          .replace(/<nav[\s\S]*?<\/nav>/gi, '')
          .replace(/<header[\s\S]*?<\/header>/gi, '')
          .replace(/<footer[\s\S]*?<\/footer>/gi, '')
          .replace(/<div[^>]*class="[^"]*navigation[^"]*"[\s\S]*?<\/div>/gi, '')
          .replace(/<div[^>]*class="[^"]*footer[^"]*"[\s\S]*?<\/div>/gi, '')
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '')
          .replace(/style="[^"]*opacity:\s*0[^"]*"/gi, '')
          .trim();
      }
    }

    if (!mainContent || mainContent.length < 100) {
      console.log(`⚠️  ${page}: Could not extract sufficient content (${mainContent ? mainContent.length : 0} chars)`);
      failed++;
      return;
    }

    // Create the component content
    const componentContent = `---
// Main content for ${page.replace('.html', '')} page
---

${mainContent}`;

    // Write the component
    fs.writeFileSync(componentPath, componentContent);
    console.log(`✅ Fixed: ${componentName}.astro (${mainContent.length} chars)`);
    fixed++;

  } catch (error) {
    console.log(`❌ ${page}: ${error.message}`);
    failed++;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`Summary: ${fixed} pages fixed, ${failed} failed`);
console.log('Run npm run build to rebuild the site with the fixed content.');