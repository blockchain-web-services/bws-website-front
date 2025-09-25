const fs = require('fs');
const path = require('path');

console.log('Fixing industry card images...\n');

// Map missing images to existing alternatives
const imageMapping = {
  '6505dc980dbf1ad68ea4e1f0_Financial-Services_320x400_Layered.jpg': '654a2597be432d1f0879bfa6_Elevating Financial Services and ESG Compiance.jpg',
  '6505db28e3925660b50a55ff_Content-Creation_320x400_Layered.jpg': '6474d385cfec71cb21a92288_image-hero-about-techplus-x-template.jpg',
  '6505dfa0e3925660b50e279e_Retail_320x400_Layered.jpg': '654a2549ca75c4c6dc08f8d2_Blockchain in Retail.jpg',
  '6505d9933660c5523d5f93eb_ESG-CREDITS_320x400_Layered.jpg': '65061a656980df26769cd4ee_ESG-Credits_400x300.jpg',
  '6505dde3f53261fa63529ee9_Legal-320x400.jpg': '654a2515de4301ab69f9951e_Blockchain Trust in Legal Practices.jpg',
  '6505e0f259aeff2f47db9530_Supply-Chain_320x400_layered.jpg': '654a256b82cf5e3e3e0819dd_Revolutionizing Supply Chain with Blockchain.jpg'
};

const sourceDir = path.join(__dirname, '..', '_site_backup', 'assets', 'images', '6474d385cfec71cb21a9229a');
const targetDir = path.join(__dirname, '..', 'public', 'assets', 'images', '6474d385cfec71cb21a9229a');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

let copiedCount = 0;
let updatedHtml = 0;

// Copy alternative images with the expected names
Object.entries(imageMapping).forEach(([targetName, sourceName]) => {
  const sourcePath = path.join(sourceDir, sourceName);
  const targetPath = path.join(targetDir, targetName);

  // Try different variations of the source name
  const sourceVariations = [
    sourceName,
    sourceName.replace(/ /g, '%20'),
    sourceName.replace(/ /g, '%2520')
  ];

  let copied = false;
  for (const variation of sourceVariations) {
    const varPath = path.join(sourceDir, variation);
    if (fs.existsSync(varPath)) {
      fs.copyFileSync(varPath, targetPath);
      console.log(`✓ Copied ${variation} -> ${targetName}`);
      copiedCount++;
      copied = true;
      break;
    }
  }

  if (!copied) {
    // Look for any similar image to use as placeholder
    const files = fs.existsSync(sourceDir) ? fs.readdirSync(sourceDir) : [];
    const jpgFiles = files.filter(f => f.endsWith('.jpg') && !f.includes('%20'));
    if (jpgFiles.length > 0) {
      const fallback = jpgFiles[0];
      fs.copyFileSync(path.join(sourceDir, fallback), targetPath);
      console.log(`✓ Used fallback ${fallback} -> ${targetName}`);
      copiedCount++;
    }
  }
});

// Also update HTML files to use correct image paths
function updateHtmlImages(filePath) {
  if (!fs.existsSync(filePath)) return false;

  let html = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Ensure industry card images use correct paths
  Object.keys(imageMapping).forEach(imageName => {
    const pattern = new RegExp(imageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    if (html.includes(imageName)) {
      // Image reference exists, make sure file is available
      modified = true;
    }
  });

  // Fix industry card structure to ensure visibility
  html = html.replace(
    /class="top-menu-industry-card"/g,
    'class="top-menu-industry-card" style="opacity: 1"'
  );

  if (modified || html.includes('style="opacity: 1"')) {
    fs.writeFileSync(filePath, html);
    return true;
  }
  return false;
}

// Update all HTML files
const htmlDirs = [
  path.join(__dirname, '..', '_site'),
  path.join(__dirname, '..', '_site', 'marketplace'),
  path.join(__dirname, '..', '_site', 'industry-content'),
  path.join(__dirname, '..', '_site', 'articles')
];

htmlDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
    files.forEach(file => {
      if (updateHtmlImages(path.join(dir, file))) {
        updatedHtml++;
      }
    });
  }
});

console.log(`\n✅ Fixed industry images:`);
console.log(`   - Copied/created ${copiedCount} images`);
console.log(`   - Updated ${updatedHtml} HTML files`);
console.log('\nIndustry cards should now display properly with images and text.');