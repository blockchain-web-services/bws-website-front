const fs = require('fs');
const path = require('path');
const https = require('https');

// Create assets directories if they don't exist
const dirs = [
  '_site/assets/images',
  '_site/assets/images/articles',
  '_site/assets/images/industry'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Map of CDN URLs to local paths
const cdnMappings = {
  // Logo and favicon
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6546cade4aea8f975475bc03_logo-for-dark-256x256.png': '/assets/images/logo-256x256.png',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6546cb1c2a1b5bd337733b38_logo-for-dark-32x32.png': '/assets/images/favicon-32x32.png',

  // Main images
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/647d8795035ce3831ed2b848_Website%20Top.png': '/assets/images/website-top.png',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6731e7a5d7e59b65fb1282e6_BWS%20Cover_landing_1200x630.jpg': '/assets/images/bws-cover.jpg',

  // Blob images (different sizes)
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template-p-500.png': '/assets/images/blob-techplus-500.png',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template-p-800.png': '/assets/images/blob-techplus-800.png',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template-p-1080.png': '/assets/images/blob-techplus-1080.png',

  // Video poster
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251%2F670f916b2f60627d5201850b_shutterstock_1108417201-poster-00001.jpg': '/assets/images/video-poster.jpg',

  // Partner logos
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6707f1c5c0856eff6c22300e_AssureDefi-p-500.png': '/assets/images/assuredefi-500.png',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6707f1c5c0856eff6c22300e_AssureDefi-p-800.png': '/assets/images/assuredefi-800.png',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/670f82f9b05322735f72cbcc_PROOF-logo-lightBG-p-500.png': '/assets/images/proof-logo-500.png',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/670f82f9b05322735f72cbcc_PROOF-logo-lightBG-p-800.png': '/assets/images/proof-logo-800.png',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/670f82f9b05322735f72cbcc_PROOF-logo-lightBG-p-1080.png': '/assets/images/proof-logo-1080.png',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/670f82f9b05322735f72cbcc_PROOF-logo-lightBG-p-1600.png': '/assets/images/proof-logo-1600.png',

  // Tokenomics images
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics%20Allocation-letters-black-p-500.png': '/assets/images/tokenomics-500.png',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics%20Allocation-letters-black-p-800.png': '/assets/images/tokenomics-800.png',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics%20Allocation-letters-black-p-1080.png': '/assets/images/tokenomics-1080.png',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics%20Allocation-letters-black-p-1600.png': '/assets/images/tokenomics-1600.png',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics%20Allocation-letters-black-p-2000.png': '/assets/images/tokenomics-2000.png',

  // Football cubes
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6708d536ef7b294fa972098e_football-cubes-selection-p-500.png': '/assets/images/football-cubes-500.png',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6708d536ef7b294fa972098e_football-cubes-selection-p-800.png': '/assets/images/football-cubes-800.png',

  // Article images
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a9229a/64e5def42c4c76f5e9ebd33f_DataBase%20Post.jpeg': '/assets/images/articles/database-post.jpeg',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a9229a/64d51ca4958bb0587e6ceea8_Oak-Tree-in-a-grass-field%2BESG-icon_768x427.png': '/assets/images/articles/oak-tree-esg.png',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a9229a/64dc8e25eb503ec2ab319b51_markus-winkler-LNzuOK1GxRU-unsplash.jpg': '/assets/images/articles/markus-winkler.jpg',

  // NFT images
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a9229a/65061646ead0751dc83790e1_NFT_1200x628-p-500.jpg': '/assets/images/nft-500.jpg',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a9229a/65061646ead0751dc83790e1_NFT_1200x628-p-800.jpg': '/assets/images/nft-800.jpg',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a9229a/65061646ead0751dc83790e1_NFT_1200x628-p-1080.jpg': '/assets/images/nft-1080.jpg',

  // Industry images
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a9229a/6505dc980dbf1ad68ea4e1f0_Financial-Services_320x400_Layered.jpg': '/assets/images/industry/financial-services.jpg',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a9229a/6505db28e3925660b50a55ff_Content-Creation_320x400_Layered.jpg': '/assets/images/industry/content-creation.jpg',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a9229a/6505dfa0e3925660b50e279e_Retail_320x400_Layered.jpg': '/assets/images/industry/retail.jpg',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a9229a/6505dde3f53261fa63529ee9_Legal-320x400.jpg': '/assets/images/industry/legal.jpg',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a9229a/6505e0f259aeff2f47db9530_Supply-Chain_320x400_layered.jpg': '/assets/images/industry/supply-chain.jpg',

  // Additional industry article images
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a9229a/654a2515de4301ab69f9951e_Blockchain%20Trust.png': '/assets/images/articles/blockchain-trust.png',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a9229a/654a2561e29f2df41f5bfeb8_Transparency.png': '/assets/images/articles/transparency.png',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a9229a/654a256e853678a54e9cebdf_Blockchain%20in%20art.png': '/assets/images/articles/blockchain-art.png',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a9229a/654a25780f2320f1dc394e6a_The%20Future%20of%20Transparent%20Sustainability.png': '/assets/images/articles/transparent-sustainability.png',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a9229a/654a258bbfafadcb274d5024_The%20Future%20of%20Creative%20Ownership.png': '/assets/images/articles/creative-ownership.png',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a9229a/654a2597be432d1f0879bfa6_Elevating%20Financial%20Services.png': '/assets/images/articles/elevating-financial.png'
};

// Function to download a file
function downloadFile(url, localPath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join('_site', localPath);
    const dir = path.dirname(fullPath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Skip if file already exists
    if (fs.existsSync(fullPath)) {
      console.log(`✓ Already exists: ${localPath}`);
      resolve();
      return;
    }

    const file = fs.createWriteStream(fullPath);

    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${localPath}`);
          resolve();
        });
      } else {
        console.log(`✗ Failed to download (${response.statusCode}): ${url}`);
        resolve(); // Continue even if one fails
      }
    }).on('error', (err) => {
      console.log(`✗ Error downloading ${url}: ${err.message}`);
      resolve(); // Continue even if one fails
    });
  });
}

// Function to replace CDN URLs in HTML files
function replaceInHtmlFiles() {
  const htmlFiles = [];

  // Find all HTML files
  function findHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        findHtmlFiles(fullPath);
      } else if (file.endsWith('.html')) {
        htmlFiles.push(fullPath);
      }
    });
  }

  findHtmlFiles('_site');

  // Replace CDN URLs in each HTML file
  htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    Object.entries(cdnMappings).forEach(([cdnUrl, localPath]) => {
      // Replace exact matches
      if (content.includes(cdnUrl)) {
        content = content.replace(new RegExp(cdnUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), localPath);
        modified = true;
      }

      // Also replace URL-encoded versions
      const encodedUrl = cdnUrl.replace(/%20/g, ' ');
      if (content.includes(encodedUrl)) {
        content = content.replace(new RegExp(encodedUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), localPath);
        modified = true;
      }

      // Handle &quot; wrapped URLs
      const quotUrl = cdnUrl + '&quot;';
      if (content.includes(quotUrl)) {
        content = content.replace(new RegExp(quotUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), localPath + '"');
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(file, content);
      console.log(`✓ Updated: ${path.relative('_site', file)}`);
    }
  });
}

// Main execution
async function main() {
  console.log('Starting CDN resource localization...\n');

  // Download all resources
  console.log('Downloading CDN resources...');
  const downloads = Object.entries(cdnMappings).map(([url, localPath]) =>
    downloadFile(url, localPath)
  );

  await Promise.all(downloads);

  console.log('\nReplacing CDN URLs in HTML files...');
  replaceInHtmlFiles();

  console.log('\n✓ Localization complete!');
}

main().catch(console.error);