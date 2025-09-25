const fs = require('fs');
const path = require('path');

console.log('Fixing final issues...\n');

// 1. Fix CSS for industry cards and image constraints
const cssPath = path.join(__dirname, '..', 'public', 'assets', 'css', 'bws-21ce3b.webflow.shared.9162577b1.min.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Remove the previous custom fixes that might be interfering
const customFixStart = css.indexOf('/* Custom responsive fixes');
if (customFixStart > -1) {
  css = css.substring(0, customFixStart);
}

// Add comprehensive CSS fixes
const cssFixes = `
/* Final CSS Fixes */

/* Fix AssureDefi image overflow */
.image-assure {
  max-width: 200px !important;
  width: auto !important;
  height: 80px !important;
  object-fit: contain !important;
}

/* Fix all announcement images */
.announcement-flex-logos img {
  max-width: 200px !important;
  height: auto !important;
  object-fit: contain !important;
}

/* Fix industry cards visibility */
.top-menu-industry-card {
  opacity: 1 !important;
  filter: grayscale(100%);
  background-size: cover !important;
  background-position: center !important;
  border-radius: 7px;
  width: 160px !important;
  height: 200px !important;
  position: relative;
  transition: filter 0.3s ease;
}

.top-menu-industry-card:hover {
  filter: none !important;
  opacity: 1 !important;
}

.top-menu-industry-card-wrapper {
  position: relative;
  height: 100%;
  padding: 5px 10px;
  background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 60%);
}

/* Ensure industry text is visible */
.industries-top-menu-text-wrapper {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  z-index: 2;
}

.industries-top-menu-option-tittle {
  color: #000 !important;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 5px;
}

.industries-menu-option-text {
  color: #333 !important;
  font-size: 12px;
  line-height: 1.3;
}

/* Fix dropdown visibility */
.dropdown-menu.wide,
.w-dropdown-list {
  opacity: 1 !important;
  background-color: white;
}

.industries-top-menu-collections-list {
  display: flex !important;
  gap: 10px;
}

.industries-top-menu-collection-item {
  flex: 0 0 auto;
}

/* Marketplace page padding fix */
.container-solution {
  padding-top: 80px !important;
  padding-bottom: 80px !important;
}

.solution-page-card {
  margin-top: 40px;
  margin-bottom: 40px;
}

/* Responsive adjustments */
@media screen and (max-width: 991px) {
  .w-container {
    padding-left: 20px;
    padding-right: 20px;
  }

  .container-solution {
    padding-top: 60px !important;
    padding-bottom: 60px !important;
  }
}

@media screen and (max-width: 767px) {
  .w-container {
    padding-left: 15px;
    padding-right: 15px;
  }

  .container-solution {
    padding-top: 40px !important;
    padding-bottom: 40px !important;
  }

  .top-menu-industry-card {
    width: 140px !important;
    height: 180px !important;
  }
}

@media screen and (max-width: 479px) {
  .w-container {
    padding-left: 10px;
    padding-right: 10px;
  }

  .container-solution {
    padding-top: 30px !important;
    padding-bottom: 30px !important;
  }
}
`;

// Append the fixes
css += cssFixes;
fs.writeFileSync(cssPath, css);
console.log('✓ CSS fixes applied');

// 2. Fix HTML files to ensure proper structure
function fixHtmlFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  let html = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix AssureDefi image specifically
  html = html.replace(
    /<img([^>]*src="[^"]*AssureDefi[^"]*"[^>]*)>/g,
    (match, attrs) => {
      if (!attrs.includes('class="image-assure"')) {
        attrs += ' class="image-assure"';
      }
      if (!attrs.includes('width=') && !attrs.includes('height=')) {
        attrs += ' width="200" height="80"';
      }
      modified = true;
      return `<img${attrs}>`;
    }
  );

  if (modified) {
    fs.writeFileSync(filePath, html);
    return true;
  }
  return false;
}

// Process all HTML files
console.log('\nFixing HTML files...');
const htmlDirs = [
  path.join(__dirname, '..', '_site'),
  path.join(__dirname, '..', '_site', 'marketplace'),
  path.join(__dirname, '..', '_site', 'industry-content'),
  path.join(__dirname, '..', '_site', 'articles')
];

let totalFixed = 0;
htmlDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
    files.forEach(file => {
      if (fixHtmlFile(path.join(dir, file))) {
        totalFixed++;
      }
    });
  }
});

console.log(`✓ Fixed ${totalFixed} HTML files`);

// 3. Ensure industry card images exist
const industryImages = [
  '6505dc980dbf1ad68ea4e1f0_Financial-Services_320x400_Layered.jpg',
  '6505db28e3925660b50a55ff_Content-Creation_320x400_Layered.jpg',
  '6505dfa0e3925660b50e279e_Retail_320x400_Layered.jpg',
  '6505d9933660c5523d5f93eb_ESG-CREDITS_320x400_Layered.jpg',
  '6505dde3f53261fa63529ee9_Legal-320x400.jpg',
  '6505e0f259aeff2f47db9530_Supply-Chain_320x400_layered.jpg'
];

const imageDir = path.join(__dirname, '..', 'public', 'assets', 'images', '6474d385cfec71cb21a9229a');
let missingImages = [];

industryImages.forEach(img => {
  const imgPath = path.join(imageDir, img);
  if (!fs.existsSync(imgPath)) {
    missingImages.push(img);
  }
});

if (missingImages.length > 0) {
  console.log('\n⚠ Missing industry card images:');
  missingImages.forEach(img => console.log(`  - ${img}`));
  console.log('Please ensure these images are in the assets folder.');
} else {
  console.log('✓ All industry card images present');
}

console.log('\n✅ All fixes applied successfully!');
console.log('\nSummary:');
console.log('1. AssureDefi image constrained to proper size');
console.log('2. Industry cards styled with proper visibility and hover effects');
console.log('3. Marketplace pages have proper top/bottom padding');
console.log('\nPlease refresh your browser to see the changes.');