#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function analyzePages() {
  const pagesFile = path.join(__dirname, 'output', 'pages.json');
  
  if (!fs.existsSync(pagesFile)) {
    console.error('Please run crawler first to generate pages.json');
    process.exit(1);
  }
  
  const pages = JSON.parse(fs.readFileSync(pagesFile, 'utf8'));
  
  // Categorize pages by URL pattern
  const templates = {
    'homepage': [],
    'marketplace-solution': [],
    'industry-content': [],
    'article': [],
    'legal': [],
    'contact': [],
    'other': []
  };
  
  pages.forEach(page => {
    const url = page.url;
    
    if (url === 'https://www.bws.ninja/' || url.endsWith('/#solutions')) {
      templates.homepage.push(url);
    } else if (url.includes('/marketplace/')) {
      templates['marketplace-solution'].push(url);
    } else if (url.includes('/industry-content/')) {
      templates['industry-content'].push(url);
    } else if (url.includes('/articles/')) {
      templates.article.push(url);
    } else if (url.includes('legal') || url.includes('privacy') || url.includes('white-paper')) {
      templates.legal.push(url);
    } else if (url.includes('contact')) {
      templates.contact.push(url);
    } else {
      templates.other.push(url);
    }
  });
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    totalPages: pages.length,
    templates: {}
  };
  
  Object.keys(templates).forEach(templateName => {
    if (templates[templateName].length > 0) {
      report.templates[templateName] = {
        count: templates[templateName].length,
        pages: templates[templateName]
      };
    }
  });
  
  // Save results
  const outputDir = path.join(__dirname, 'output');
  
  fs.writeFileSync(
    path.join(outputDir, 'templates.json'),
    JSON.stringify(report, null, 2)
  );
  
  fs.writeFileSync(
    path.join(outputDir, 'page-templates.json'),
    JSON.stringify(pages.map(page => ({
      url: page.url,
      title: page.title,
      template: getTemplate(page.url),
      metaDescription: page.metaDescription
    })), null, 2)
  );
  
  console.log('\n=== Template Analysis Complete ===');
  console.log(`Total pages analyzed: ${pages.length}`);
  console.log('\nTemplates found:');
  
  Object.entries(report.templates).forEach(([template, data]) => {
    console.log(`  ${template}: ${data.count} pages`);
  });
  
  console.log('\nTemplate Distribution:');
  Object.entries(report.templates).forEach(([template, data]) => {
    const percentage = ((data.count / pages.length) * 100).toFixed(1);
    console.log(`  ${template}: ${percentage}%`);
  });
  
  return report;
}

function getTemplate(url) {
  if (url === 'https://www.bws.ninja/' || url.endsWith('/#solutions')) {
    return 'homepage';
  } else if (url.includes('/marketplace/')) {
    return 'marketplace-solution';
  } else if (url.includes('/industry-content/')) {
    return 'industry-content';
  } else if (url.includes('/articles/')) {
    return 'article';
  } else if (url.includes('legal') || url.includes('privacy') || url.includes('white-paper')) {
    return 'legal';
  } else if (url.includes('contact')) {
    return 'contact';
  } else {
    return 'other';
  }
}

// Run if called directly
if (require.main === module) {
  analyzePages();
}

module.exports = analyzePages;