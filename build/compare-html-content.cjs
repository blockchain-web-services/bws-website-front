const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Function to extract main content from HTML
function extractMainContent(html) {
  const $ = cheerio.load(html);

  // Remove scripts and styles for comparison
  $('script').remove();
  $('style').remove();
  $('noscript').remove();

  // Get the main content area (between nav and footer)
  const mainContent = $('.container-medium.container-solution').html() ||
                      $('.section-solution').html() ||
                      $('.main-content').html() ||
                      $('main').html() ||
                      '';

  // Extract text content for comparison
  const textContent = $('body').text()
    .replace(/\s+/g, ' ')
    .trim();

  // Count specific elements
  const counts = {
    headings: $('h1, h2, h3, h4, h5, h6').length,
    paragraphs: $('p').length,
    lists: $('ul, ol').length,
    links: $('a').length,
    images: $('img').length,
    divs: $('div').length,
    mainContentLength: mainContent.length,
    textContentLength: textContent.length
  };

  // Extract specific content markers
  const markers = {
    hasBlockchainSave: textContent.includes('Blockchain Save'),
    hasBlockchainHash: textContent.includes('Blockchain Hash'),
    hasDescription: textContent.includes('Description'),
    hasFeatures: textContent.includes('Features'),
    hasBenefits: textContent.includes('Benefits'),
    hasAPIDoc: textContent.includes('API Doc'),
    hasTelegramBot: textContent.includes('Telegram'),
    hasNFT: textContent.includes('NFT')
  };

  return { counts, markers, textContent, mainContent };
}

// Function to compare two HTML files
function compareHTMLFiles(originalPath, generatedPath) {
  try {
    const originalHTML = fs.readFileSync(originalPath, 'utf8');
    const generatedHTML = fs.readFileSync(generatedPath, 'utf8');

    const original = extractMainContent(originalHTML);
    const generated = extractMainContent(generatedHTML);

    const issues = [];

    // Compare counts
    if (Math.abs(original.counts.headings - generated.counts.headings) > 2) {
      issues.push(`Heading count mismatch: ${original.counts.headings} vs ${generated.counts.headings}`);
    }

    if (Math.abs(original.counts.paragraphs - generated.counts.paragraphs) > 5) {
      issues.push(`Paragraph count mismatch: ${original.counts.paragraphs} vs ${generated.counts.paragraphs}`);
    }

    if (original.counts.mainContentLength > 0 && generated.counts.mainContentLength < original.counts.mainContentLength * 0.5) {
      issues.push(`Main content significantly shorter: ${generated.counts.mainContentLength} vs ${original.counts.mainContentLength} chars`);
    }

    if (original.counts.textContentLength > 0 && generated.counts.textContentLength < original.counts.textContentLength * 0.7) {
      issues.push(`Text content significantly shorter: ${generated.counts.textContentLength} vs ${original.counts.textContentLength} chars`);
    }

    // Check for missing content markers
    for (const [key, value] of Object.entries(original.markers)) {
      if (value && !generated.markers[key]) {
        issues.push(`Missing content marker: ${key}`);
      }
    }

    // Special check for marketplace pages
    if (originalPath.includes('marketplace')) {
      // Check if main content exists
      const $orig = cheerio.load(originalHTML);
      const $gen = cheerio.load(generatedHTML);

      const origSolutionCard = $orig('.solution-page-card').length;
      const genSolutionCard = $gen('.solution-page-card').length;

      if (origSolutionCard > 0 && genSolutionCard === 0) {
        issues.push('Missing solution-page-card structure');
      }

      // Check for tabs content
      const origTabs = $orig('.integration-tabs').length;
      const genTabs = $gen('.integration-tabs').length;

      if (origTabs > 0 && genTabs === 0) {
        issues.push('Missing integration tabs');
      }
    }

    return {
      file: path.basename(originalPath),
      issues,
      original: original.counts,
      generated: generated.counts
    };

  } catch (error) {
    return {
      file: path.basename(originalPath),
      error: error.message
    };
  }
}

// Main comparison
console.log('Starting HTML content comparison...\n');

const pagesToCompare = [
  'index.html',
  'about.html',
  'contact-us.html',
  'industries.html',
  'legal-notice.html',
  'privacy-policy.html',
  'resources.html',
  'marketplace/blockchain-badges.html',
  'marketplace/database-immutable.html',
  'marketplace/database-mutable.html',
  'marketplace/ipfs-upload.html',
  'marketplace/nft-zeroknwoledge.html',
  'marketplace/telegram-xbot.html',
  'industry-content/content-creation.html',
  'industry-content/esg.html',
  'industry-content/financial-services.html',
  'industry-content/legal.html',
  'industry-content/retail.html',
  'industry-content/supply-chain.html',
  'articles/discover-the-power-of-blockchain-bwss-data-management-solutions.html',
  'articles/investment-impact-reporting-unlocking-a-sustainable-future.html'
];

const results = [];
let totalIssues = 0;

pagesToCompare.forEach(page => {
  const originalPath = path.join('_site_backup', page);
  const generatedPath = path.join('_site', page);

  if (fs.existsSync(originalPath) && fs.existsSync(generatedPath)) {
    const result = compareHTMLFiles(originalPath, generatedPath);
    results.push(result);

    if (result.issues && result.issues.length > 0) {
      totalIssues += result.issues.length;
      console.log(`\n❌ ${result.file}:`);
      result.issues.forEach(issue => console.log(`   - ${issue}`));
      console.log(`   Original counts:`, result.original);
      console.log(`   Generated counts:`, result.generated);
    } else if (!result.error) {
      console.log(`✅ ${result.file}: No major issues found`);
    } else {
      console.log(`⚠️  ${result.file}: ${result.error}`);
    }
  } else {
    console.log(`⚠️  ${page}: File not found in one of the directories`);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`Summary: Found ${totalIssues} total issues across ${results.length} pages`);

// Write detailed report
const report = {
  timestamp: new Date().toISOString(),
  totalPages: results.length,
  totalIssues,
  results
};

fs.writeFileSync('html-comparison-report.json', JSON.stringify(report, null, 2));
console.log('\nDetailed report saved to html-comparison-report.json');

// List pages with most issues
const sortedResults = results
  .filter(r => r.issues && r.issues.length > 0)
  .sort((a, b) => b.issues.length - a.issues.length);

if (sortedResults.length > 0) {
  console.log('\nPages with most issues:');
  sortedResults.slice(0, 5).forEach(r => {
    console.log(`  ${r.file}: ${r.issues.length} issues`);
  });
}