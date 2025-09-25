const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Pages that need fixing (non-marketplace pages with issues)
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
  'articles/embrace-sustainability-with-esg-credits-bws-solution.html',
  'articles/investment-impact-reporting-unlocking-a-sustainable-future.html'
];

// Function to extract only the main content from HTML
function extractMainContent(html, pageName) {
  const $ = cheerio.load(html);

  // Remove the navigation
  $('.navigation').remove();
  $('.w-nav').remove();
  $('.header').remove();
  $('.nav-menu').remove();

  // Remove footer
  $('footer').remove();
  $('.footer').remove();

  // Remove scripts and noscript
  $('script').remove();
  $('noscript').remove();
  $('style').remove();

  // Remove background video
  $('.w-background-video').remove();
  $('.background-lines-top').remove();

  // For article pages, extract article content
  if (pageName.includes('articles/')) {
    const articleContent = $('.article-content').html() ||
                          $('.post-content').html() ||
                          $('.container.article').html() ||
                          $('.section-articles').html() ||
                          $('.section.article-template').html() ||
                          '';
    return articleContent;
  }

  // For industry pages, extract the industry content
  if (pageName.includes('industry-content/')) {
    const industryContent = $('.section-industry').html() ||
                           $('.industry-hero').parent().html() ||
                           $('.container-medium').html() ||
                           $('.section').first().html() ||
                           '';
    return industryContent;
  }

  // For other pages, extract main content area
  let mainContent = '';

  // Try different selectors
  if (pageName.includes('privacy-policy')) {
    mainContent = $('.section-privacy').html() || $('.container').first().html();
  } else if (pageName.includes('legal-notice')) {
    mainContent = $('.section-legal').html() || $('.container').first().html();
  } else if (pageName.includes('contact-us')) {
    mainContent = $('.section-contact').html() || $('.container-medium').html() || $('.contact-section').html();
  } else if (pageName.includes('about')) {
    mainContent = $('.section-about').html() || $('.container-medium').html() || $('.about-section').html();
  } else if (pageName.includes('resources')) {
    mainContent = $('.section-resources').html() || $('.container-medium').html() || $('.resources-section').html();
  } else if (pageName.includes('industries')) {
    mainContent = $('.section-industries').html() || $('.container-medium').html() || $('.industries-section').html();
  }

  // If still no content, try to get the main section
  if (!mainContent) {
    // Remove navigation and footer, then get what's left
    const bodyContent = $('body').html();
    mainContent = bodyContent;
  }

  return mainContent || '';
}

// Function to create component name
function createComponentName(pagePath) {
  const name = pagePath
    .replace('.html', '')
    .replace(/\//g, '')
    .replace(/-/g, '');
  return name + 'MainContent';
}

console.log('Fixing non-marketplace pages...\n');

pagesToFix.forEach(page => {
  const backupPath = path.join('_site_backup', page);
  const componentName = createComponentName(page);
  const componentPath = path.join('src/components', componentName + '.astro');

  if (!fs.existsSync(backupPath)) {
    console.log(`⚠️  ${page}: Backup file not found`);
    return;
  }

  if (!fs.existsSync(componentPath)) {
    console.log(`⚠️  ${page}: Component file not found`);
    return;
  }

  try {
    // Read the original HTML
    const originalHTML = fs.readFileSync(backupPath, 'utf8');

    // Extract just the main content
    const mainContent = extractMainContent(originalHTML, page);

    if (!mainContent || mainContent.length < 100) {
      console.log(`⚠️  ${page}: Could not extract main content`);
      return;
    }

    // Clean up the content
    let cleanContent = mainContent
      .replace(/style="[^"]*opacity:\s*0[^"]*"/g, '') // Remove opacity:0 styles
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Clean up excessive newlines
      .trim();

    // Create the new component content
    const componentContent = `---
// Main content for ${page.replace('.html', '')} page
---

${cleanContent}`;

    // Write the fixed component
    fs.writeFileSync(componentPath, componentContent);
    console.log(`✅ Fixed: ${componentName}.astro`);

  } catch (error) {
    console.log(`❌ ${page}: ${error.message}`);
  }
});

console.log('\nDone! Re-run the build to see the changes.');