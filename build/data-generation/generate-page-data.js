#!/usr/bin/env node

/**
 * Generate Eleventy data files from crawl results
 * This script converts the crawler output into structured data files for Eleventy
 */

const fs = require('fs');
const path = require('path');

// Load crawl results
const crawlerOutputDir = path.join(__dirname, '../crawler/output');
const pages = JSON.parse(fs.readFileSync(path.join(crawlerOutputDir, 'pages.json'), 'utf8'));
const templates = JSON.parse(fs.readFileSync(path.join(crawlerOutputDir, 'page-templates.json'), 'utf8'));

// Output directories
const dataDir = path.join(__dirname, '../../src/_data');
const pagesDataDir = path.join(dataDir, 'pages');

// Ensure directories exist
[dataDir, pagesDataDir, 
 path.join(pagesDataDir, 'marketplace'),
 path.join(pagesDataDir, 'articles'),
 path.join(pagesDataDir, 'industry')
].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Helper function to generate slug from URL
function getSlugFromUrl(url) {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  
  if (pathname === '/') return 'index';
  
  return pathname
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .replace(/\//g, '-')
    .replace(/[^a-z0-9-]/gi, '-')
    .toLowerCase();
}

// Helper function to extract clean title
function cleanTitle(title) {
  if (!title) return 'Untitled Page';
  return title.replace(/\s*\|\s*.*$/, '').trim();
}

// Process each page
const pageDataMap = {};
const navigationData = {
  main: [],
  marketplace: [],
  industry: [],
  articles: [],
  footer: []
};

templates.forEach(page => {
  const pageUrl = page.url;
  const template = page.template;
  const slug = getSlugFromUrl(pageUrl);
  
  // Find full page data
  const fullPageData = pages.find(p => p.url === pageUrl) || {};
  
  // Generate page data
  const pageData = {
    url: pageUrl,
    slug: slug,
    title: cleanTitle(page.title || 'Untitled'),
    metaDescription: page.metaDescription || generateDescription(page.title),
    template: template,
    permalink: pageUrl.replace('https://www.bws.ninja', ''),
    layout: `layouts/${template}.njk`,
    tags: [template],
    breadcrumbs: generateBreadcrumbs(pageUrl),
    lastModified: new Date().toISOString(),
    internalLinks: fullPageData.links || [],
    externalLinks: fullPageData.externalLinks || []
  };
  
  // Add template-specific data
  switch(template) {
    case 'marketplace-solution':
      const solutionName = pageUrl.split('/').pop();
      pageData.solution = {
        name: pageData.title,
        slug: solutionName,
        category: 'blockchain',
        features: generateFeatures(solutionName),
        benefits: generateBenefits(solutionName),
        apiDocLink: `https://docs.bws.ninja/api/${solutionName}`,
        contactLink: '/contact-us?solution=' + solutionName
      };
      navigationData.marketplace.push({
        title: pageData.title,
        url: pageData.permalink
      });
      break;
      
    case 'industry-content':
      const industryName = pageUrl.split('/').pop();
      pageData.industry = {
        name: pageData.title || formatIndustryName(industryName),
        slug: industryName,
        description: generateIndustryDescription(industryName)
      };
      navigationData.industry.push({
        title: pageData.industry.name,
        url: pageData.permalink
      });
      break;
      
    case 'article':
      pageData.article = {
        publishDate: new Date().toISOString(),
        author: 'BWS Team',
        readTime: '5 min read',
        tags: extractArticleTags(pageData.title)
      };
      navigationData.articles.push({
        title: pageData.title,
        url: pageData.permalink
      });
      break;
      
    case 'homepage':
      pageData.hero = {
        title: 'Cutting-Edge Blockchain Solutions',
        subtitle: 'A Blockchain Solutions Marketplace for innovative and easy-to-use blockchain solutions',
        ctaPrimary: {
          text: 'Get Started',
          href: '#solutions'
        },
        ctaSecondary: {
          text: 'Learn More',
          href: '/white-paper'
        }
      };
      break;
  }
  
  pageDataMap[slug] = pageData;
});

// Generate navigation.json
const navigationJson = {
  main: [
    { title: 'Home', url: '/' },
    { title: 'Solutions', url: '/#solutions', children: navigationData.marketplace },
    { title: 'Industries', url: '/industries', children: navigationData.industry },
    { title: 'Resources', url: '/resources', children: navigationData.articles },
    { title: 'Contact', url: '/contact-us' }
  ],
  footer: {
    solutions: navigationData.marketplace.slice(0, 5),
    company: [
      { title: 'About', url: '/about' },
      { title: 'White Paper', url: '/white-paper' },
      { title: 'Contact', url: '/contact-us' }
    ],
    legal: [
      { title: 'Privacy Policy', url: '/privacy-policy' },
      { title: 'Legal Notice', url: '/legal-notice' }
    ],
    social: [
      { title: 'LinkedIn', url: 'https://www.linkedin.com/company/bws', icon: 'linkedin' },
      { title: 'Twitter', url: 'https://twitter.com/bws', icon: 'twitter' },
      { title: 'Telegram', url: 'https://t.me/bws', icon: 'telegram' }
    ]
  }
};

// Save navigation data
fs.writeFileSync(
  path.join(dataDir, 'navigation.json'),
  JSON.stringify(navigationJson, null, 2)
);

// Save individual page data files
Object.entries(pageDataMap).forEach(([slug, data]) => {
  let outputPath;
  
  if (data.template === 'marketplace-solution') {
    outputPath = path.join(pagesDataDir, 'marketplace', `${slug}.json`);
  } else if (data.template === 'article') {
    outputPath = path.join(pagesDataDir, 'articles', `${slug}.json`);
  } else if (data.template === 'industry-content') {
    outputPath = path.join(pagesDataDir, 'industry', `${slug}.json`);
  } else {
    outputPath = path.join(pagesDataDir, `${slug}.json`);
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
});

// Save global pages index
fs.writeFileSync(
  path.join(dataDir, 'allPages.json'),
  JSON.stringify(Object.values(pageDataMap), null, 2)
);

// Helper functions
function generateDescription(title) {
  return `Learn more about ${title} - Blockchain Web Services solution for modern businesses.`;
}

function generateBreadcrumbs(url) {
  const parts = url.replace('https://www.bws.ninja/', '').split('/').filter(Boolean);
  const breadcrumbs = [{ title: 'Home', url: '/' }];
  
  let currentPath = '';
  parts.forEach((part, index) => {
    currentPath += '/' + part;
    breadcrumbs.push({
      title: formatBreadcrumbTitle(part),
      url: currentPath
    });
  });
  
  return breadcrumbs;
}

function formatBreadcrumbTitle(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatIndustryName(slug) {
  const names = {
    'financial-services': 'Financial Services',
    'content-creation': 'Content Creation',
    'retail': 'Retail',
    'esg': 'ESG',
    'legal': 'Legal',
    'supply-chain': 'Supply Chain'
  };
  return names[slug] || formatBreadcrumbTitle(slug);
}

function generateFeatures(solutionName) {
  const features = {
    'database-immutable': [
      { title: 'Immutable Storage', description: 'Data cannot be altered once written' },
      { title: 'Blockchain Security', description: 'Cryptographically secured on blockchain' },
      { title: 'Audit Trail', description: 'Complete history of all transactions' }
    ],
    'database-mutable': [
      { title: 'Flexible Updates', description: 'Update data while maintaining history' },
      { title: 'Version Control', description: 'Track all changes over time' },
      { title: 'Smart Contracts', description: 'Automated data management rules' }
    ],
    'ipfs-upload': [
      { title: 'Distributed Storage', description: 'Files stored across IPFS network' },
      { title: 'Content Addressing', description: 'Access files by content hash' },
      { title: 'Permanent URLs', description: 'Files always accessible at same address' }
    ],
    'nft-zeroknwoledge': [
      { title: 'Privacy Preserving', description: 'Zero-knowledge proof technology' },
      { title: 'NFT Creation', description: 'Mint unique digital assets' },
      { title: 'Secure Trading', description: 'Trade without revealing identity' }
    ],
    'nft-gamecube': [
      { title: 'Gaming NFTs', description: 'Create in-game digital assets' },
      { title: 'Cross-game Compatibility', description: 'Use NFTs across multiple games' },
      { title: 'Player Ownership', description: 'True ownership of game items' }
    ],
    'blockchain-badges': [
      { title: 'Digital Credentials', description: 'Issue verifiable digital badges' },
      { title: 'Tamper-proof', description: 'Badges cannot be forged' },
      { title: 'Portable', description: 'Use badges across platforms' }
    ],
    'esg-credits': [
      { title: 'Carbon Credits', description: 'Track and trade carbon offsets' },
      { title: 'Transparency', description: 'Full visibility into ESG metrics' },
      { title: 'Compliance', description: 'Meet regulatory requirements' }
    ],
    'telegram-xbot': [
      { title: 'Bot Integration', description: 'Easy Telegram bot setup' },
      { title: 'Blockchain Commands', description: 'Execute blockchain operations via chat' },
      { title: 'Multi-language', description: 'Support for multiple languages' }
    ]
  };
  
  return features[solutionName] || [
    { title: 'Blockchain Integration', description: 'Seamless blockchain connectivity' },
    { title: 'Security', description: 'Enterprise-grade security' },
    { title: 'Scalability', description: 'Scales with your business' }
  ];
}

function generateBenefits(solutionName) {
  return [
    { title: 'Cost Effective', description: 'Reduce operational costs' },
    { title: 'Fast Implementation', description: 'Quick and easy to deploy' },
    { title: 'Expert Support', description: '24/7 technical support' }
  ];
}

function generateIndustryDescription(industryName) {
  const descriptions = {
    'financial-services': 'Blockchain solutions for banks, insurance, and financial institutions',
    'content-creation': 'Protect and monetize digital content with blockchain',
    'retail': 'Transform retail operations with blockchain technology',
    'esg': 'Track and verify ESG metrics on blockchain',
    'legal': 'Smart contracts and digital signatures for legal industry',
    'supply-chain': 'End-to-end supply chain transparency on blockchain'
  };
  return descriptions[industryName] || 'Blockchain solutions for your industry';
}

function extractArticleTags(title) {
  const tags = [];
  if (title.toLowerCase().includes('blockchain')) tags.push('blockchain');
  if (title.toLowerCase().includes('data')) tags.push('data-management');
  if (title.toLowerCase().includes('esg')) tags.push('esg');
  if (title.toLowerCase().includes('sustainability')) tags.push('sustainability');
  if (tags.length === 0) tags.push('general');
  return tags;
}

// Summary
console.log('\n=== Data Generation Complete ===');
console.log(`Generated data for ${Object.keys(pageDataMap).length} pages`);
console.log(`Navigation structure created`);
console.log(`\nData files saved to: ${dataDir}`);
console.log('\nPage types generated:');
Object.values(pageDataMap).reduce((acc, page) => {
  acc[page.template] = (acc[page.template] || 0) + 1;
  return acc;
}, {});

Object.entries(
  Object.values(pageDataMap).reduce((acc, page) => {
    acc[page.template] = (acc[page.template] || 0) + 1;
    return acc;
  }, {})
).forEach(([template, count]) => {
  console.log(`  - ${template}: ${count} pages`);
});