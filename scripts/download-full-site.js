#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

// Pages to download with their proper solution names
const pages = [
  { 
    url: '/',
    file: 'index.html',
    title: 'Cutting-Edge Blockchain Solutions'
  },
  { 
    url: '/marketplace/database-immutable',
    file: 'marketplace/database-immutable.html',
    title: 'Blockchain Save',
    navTitle: 'Blockchain Save'
  },
  { 
    url: '/marketplace/database-mutable',
    file: 'marketplace/database-mutable.html',
    title: 'Blockchain Hash',
    navTitle: 'Blockchain Hash'
  },
  { 
    url: '/marketplace/ipfs-upload',
    file: 'marketplace/ipfs-upload.html',
    title: 'BWS IPFS',
    navTitle: 'BWS IPFS'
  },
  { 
    url: '/marketplace/nft-zeroknwoledge',
    file: 'marketplace/nft-zeroknwoledge.html',
    title: 'NFT.zK',
    navTitle: 'NFT.zK'
  },
  {
    url: '/marketplace/blockchain-badges',
    file: 'marketplace/blockchain-badges.html',
    title: 'Blockchain Badges',
    navTitle: 'Blockchain Badges'
  },
  {
    url: '/marketplace/telegram-xbot',
    file: 'marketplace/telegram-xbot.html',
    title: 'Telegram XBot',
    navTitle: 'Telegram XBot'
  },
  {
    url: '/industry-content/financial-services',
    file: 'industry-content/financial-services.html',
    title: 'Financial Services',
    navTitle: 'Financial Services'
  },
  {
    url: '/industry-content/content-creation',
    file: 'industry-content/content-creation.html',
    title: 'Content Creation',
    navTitle: 'Content Creation'
  },
  {
    url: '/industry-content/retail',
    file: 'industry-content/retail.html',
    title: 'Retail',
    navTitle: 'Retail'
  },
  {
    url: '/industry-content/esg',
    file: 'industry-content/esg.html',
    title: 'Environmental, Social, and Governance',
    navTitle: 'ESG'
  },
  {
    url: '/industry-content/legal',
    file: 'industry-content/legal.html',
    title: 'Legal',
    navTitle: 'Legal'
  },
  {
    url: '/industry-content/supply-chain',
    file: 'industry-content/supply-chain.html',
    title: 'Supply Chain',
    navTitle: 'Supply Chain'
  },
  {
    url: '/contact-us',
    file: 'contact-us.html',
    title: 'Contact Us'
  },
  {
    url: '/white-paper',
    file: 'white-paper.html',
    title: 'White Paper'
  },
  {
    url: '/legal-notice',
    file: 'legal-notice.html',
    title: 'Legal Notice'
  },
  {
    url: '/privacy-policy',
    file: 'privacy-policy.html',
    title: 'Privacy Policy'
  }
];

const outputDir = path.join(__dirname, '..', 'downloaded-pages');

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to download a page
function downloadPage(pageInfo) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.bws.ninja',
      path: pageInfo.url,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    https.get(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const filePath = path.join(outputDir, pageInfo.file);
        const dir = path.dirname(filePath);
        
        // Create directory if needed
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        // Process HTML to update asset URLs
        let processedHtml = data;
        
        // Update CSS URLs
        processedHtml = processedHtml.replace(
          /https:\/\/cdn\.prod\.website-files\.com\/[^"'\s]+\.css/g,
          (match) => {
            const filename = match.split('/').pop();
            return `/assets/css/${filename}`;
          }
        );
        
        // Update JS URLs
        processedHtml = processedHtml.replace(
          /https:\/\/cdn\.prod\.website-files\.com\/[^"'\s]+\.js/g,
          (match) => {
            const filename = match.split('/').pop();
            return `/assets/js/${filename}`;
          }
        );
        
        // Update image URLs to local
        processedHtml = processedHtml.replace(
          /https:\/\/cdn\.prod\.website-files\.com\/[^"'\s]+\.(png|jpg|jpeg|gif|svg|webp)/g,
          (match) => {
            const filename = match.split('/').pop();
            return `/assets/images/${filename}`;
          }
        );

        // Save the file
        fs.writeFileSync(filePath, processedHtml);
        console.log(`Downloaded: ${pageInfo.url} -> ${pageInfo.file}`);
        
        resolve({
          ...pageInfo,
          contentLength: data.length
        });
      });
    }).on('error', (err) => {
      console.error(`Error downloading ${pageInfo.url}:`, err);
      reject(err);
    });
  });
}

// Download all pages
async function downloadAll() {
  console.log('Starting download of all pages...');
  
  for (const page of pages) {
    try {
      await downloadPage(page);
      // Small delay to be respectful
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to download ${page.url}:`, error);
    }
  }
  
  // Create proper navigation.json with correct titles
  const navigation = {
    main: [
      {
        title: "Home",
        url: "/"
      },
      {
        title: "Solutions",
        url: "/#solutions",
        children: pages
          .filter(p => p.file.startsWith('marketplace/'))
          .map(p => ({
            title: p.navTitle || p.title,
            url: `/${p.file}`
          }))
      },
      {
        title: "Industries",
        url: "/industries.html",
        children: pages
          .filter(p => p.file.startsWith('industry-content/'))
          .map(p => ({
            title: p.navTitle || p.title,
            url: `/${p.file}`
          }))
      },
      {
        title: "Developers",
        url: "https://docs.bws.ninja",
        external: true
      },
      {
        title: "Contact",
        url: "/contact-us.html"
      }
    ]
  };
  
  fs.writeFileSync(
    path.join(outputDir, 'navigation.json'),
    JSON.stringify(navigation, null, 2)
  );
  
  console.log('Download complete! Saved navigation.json');
}

downloadAll().catch(console.error);