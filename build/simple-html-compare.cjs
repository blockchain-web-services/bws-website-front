const fs = require('fs');
const path = require('path');

// Function to extract text content and count elements
function analyzeHTML(html) {
  // Remove scripts, styles, and comments
  let cleanHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '');

  // Extract text content
  const textContent = cleanHtml
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Count specific elements
  const counts = {
    headings: (html.match(/<h[1-6][^>]*>/gi) || []).length,
    paragraphs: (html.match(/<p[^>]*>/gi) || []).length,
    lists: (html.match(/<(ul|ol)[^>]*>/gi) || []).length,
    links: (html.match(/<a[^>]*>/gi) || []).length,
    images: (html.match(/<img[^>]*>/gi) || []).length,
    divs: (html.match(/<div[^>]*>/gi) || []).length,
    textLength: textContent.length
  };

  // Check for specific content
  const hasContent = {
    blockchainSave: textContent.includes('Blockchain Save'),
    blockchainHash: textContent.includes('Blockchain Hash'),
    description: textContent.includes('Description'),
    features: textContent.includes('Features'),
    benefits: textContent.includes('Benefits'),
    apiDocs: /API\s+Doc/i.test(textContent),
    telegram: textContent.includes('Telegram'),
    nft: textContent.includes('NFT'),
    esg: textContent.includes('ESG'),
    ipfs: textContent.includes('IPFS')
  };

  // Check for main content sections
  const hasSections = {
    navigation: html.includes('nav-menu') || html.includes('navigation'),
    footer: html.includes('footer'),
    mainContent: html.includes('container-solution') || html.includes('main-content'),
    solutionCard: html.includes('solution-page-card'),
    integrationTabs: html.includes('integration-tabs')
  };

  return { counts, hasContent, hasSections, textLength: textContent.length };
}

// Compare two HTML files
function compareFiles(originalPath, generatedPath) {
  try {
    const original = fs.readFileSync(originalPath, 'utf8');
    const generated = fs.readFileSync(generatedPath, 'utf8');

    const origAnalysis = analyzeHTML(original);
    const genAnalysis = analyzeHTML(generated);

    const issues = [];

    // Check for significant content reduction
    if (genAnalysis.textLength < origAnalysis.textLength * 0.5) {
      issues.push(`Content reduced by ${Math.round((1 - genAnalysis.textLength/origAnalysis.textLength) * 100)}%`);
    }

    // Check element counts
    if (origAnalysis.counts.headings > 0 && genAnalysis.counts.headings < origAnalysis.counts.headings * 0.5) {
      issues.push(`Missing headings: ${genAnalysis.counts.headings}/${origAnalysis.counts.headings}`);
    }

    if (origAnalysis.counts.paragraphs > 0 && genAnalysis.counts.paragraphs < origAnalysis.counts.paragraphs * 0.5) {
      issues.push(`Missing paragraphs: ${genAnalysis.counts.paragraphs}/${origAnalysis.counts.paragraphs}`);
    }

    // Check for missing content markers
    for (const [key, value] of Object.entries(origAnalysis.hasContent)) {
      if (value && !genAnalysis.hasContent[key]) {
        issues.push(`Missing content: ${key}`);
      }
    }

    // Check for missing sections
    for (const [key, value] of Object.entries(origAnalysis.hasSections)) {
      if (value && !genAnalysis.hasSections[key]) {
        issues.push(`Missing section: ${key}`);
      }
    }

    return {
      file: path.basename(originalPath),
      issues,
      stats: {
        original: origAnalysis.counts,
        generated: genAnalysis.counts,
        textReduction: Math.round((1 - genAnalysis.textLength/origAnalysis.textLength) * 100)
      }
    };

  } catch (error) {
    return {
      file: path.basename(originalPath),
      error: error.message
    };
  }
}

// Main execution
console.log('HTML Content Comparison Report');
console.log('=' .repeat(60));

const pages = [
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
let pagesWithIssues = 0;

pages.forEach(page => {
  const origPath = path.join('_site_backup', page);
  const genPath = path.join('_site', page);

  if (fs.existsSync(origPath) && fs.existsSync(genPath)) {
    const result = compareFiles(origPath, genPath);
    results.push(result);

    if (result.issues && result.issues.length > 0) {
      pagesWithIssues++;
      console.log(`\n❌ ${result.file}`);
      result.issues.forEach(issue => console.log(`   - ${issue}`));
      if (result.stats) {
        console.log(`   Text reduction: ${result.stats.textReduction}%`);
      }
    } else if (!result.error) {
      console.log(`✅ ${result.file}`);
    }
  } else {
    console.log(`⚠️  ${page} - File missing`);
  }
});

console.log('\n' + '=' .repeat(60));
console.log(`Summary: ${pagesWithIssues}/${pages.length} pages have issues`);

// Save detailed report
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    totalPages: pages.length,
    pagesWithIssues,
    issueRate: Math.round((pagesWithIssues/pages.length) * 100) + '%'
  },
  results
};

fs.writeFileSync('content-comparison-report.json', JSON.stringify(report, null, 2));
console.log('Detailed report saved to content-comparison-report.json');

// Show worst affected pages
const worst = results
  .filter(r => r.stats && r.stats.textReduction > 0)
  .sort((a, b) => b.stats.textReduction - a.stats.textReduction)
  .slice(0, 5);

if (worst.length > 0) {
  console.log('\nMost affected pages (by content reduction):');
  worst.forEach(r => {
    console.log(`  ${r.file}: ${r.stats.textReduction}% less content`);
  });
}