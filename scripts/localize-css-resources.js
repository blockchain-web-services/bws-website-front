const fs = require('fs');
const path = require('path');
const https = require('https');

// Create directories
const dirs = [
  '_site/assets/fonts',
  '_site/assets/images/icons',
  '_site/assets/images/logos'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Map CDN URLs to local paths
const resourceMappings = {
  // Font files - THICCCBOI fonts
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a922c1_THICCCBOI-Bold.ttf': '/assets/fonts/THICCCBOI-Bold.ttf',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a922c2_THICCCBOI-Medium.ttf': '/assets/fonts/THICCCBOI-Medium.ttf',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a922c3_THICCCBOI-Regular.ttf': '/assets/fonts/THICCCBOI-Regular.ttf',

  // Icons Techplus X Template font files
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a92361_Icons%20Techplus%20X%20Template.woff2': '/assets/fonts/icons-techplus-x-template.woff2',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a92369_Icons%20Techplus%20X%20Template.eot': '/assets/fonts/icons-techplus-x-template.eot',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a9236a_Icons%20Techplus%20X%20Template.woff': '/assets/fonts/icons-techplus-x-template.woff',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a9236c_Icons%20Techplus%20X%20Template.ttf': '/assets/fonts/icons-techplus-x-template.ttf',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a9236b_Icons%20Techplus%20X%20Template.svg': '/assets/fonts/icons-techplus-x-template.svg',

  // Filled icon fonts
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a923a4_filled-icon-font.eot': '/assets/fonts/filled-icon-font.eot',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a923a5_filled-icon-font.ttf': '/assets/fonts/filled-icon-font.ttf',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a923a6_filled-icon-font.woff2': '/assets/fonts/filled-icon-font.woff2',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a923a7_filled-icon-font.svg': '/assets/fonts/filled-icon-font.svg',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a923a8_filled-icon-font.woff': '/assets/fonts/filled-icon-font.woff',

  // Line rounded icons fonts
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a923a9_line-rounded-icons.eot': '/assets/fonts/line-rounded-icons.eot',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a923aa_line-rounded-icons.ttf': '/assets/fonts/line-rounded-icons.ttf',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a923ab_line-rounded-icons.woff2': '/assets/fonts/line-rounded-icons.woff2',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a923ac_line-rounded-icons.svg': '/assets/fonts/line-rounded-icons.svg',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a923ad_line-rounded-icons.woff': '/assets/fonts/line-rounded-icons.woff',

  // Line square icons fonts
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a923ae_line-square-icons.eot': '/assets/fonts/line-square-icons.eot',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a923b4_line-square-icons.woff': '/assets/fonts/line-square-icons.woff',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a923b5_line-square-icons.woff2': '/assets/fonts/line-square-icons.woff2',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a923b6_line-square-icons.svg': '/assets/fonts/line-square-icons.svg',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a923b7_line-square-icons.ttf': '/assets/fonts/line-square-icons.ttf',

  // Social icon fonts
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a923b8_social-icon-font.eot': '/assets/fonts/social-icon-font.eot',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a923b9_social-icon-font.woff': '/assets/fonts/social-icon-font.woff',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a923ba_social-icon-font.woff2': '/assets/fonts/social-icon-font.woff2',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a923bb_social-icon-font.ttf': '/assets/fonts/social-icon-font.ttf',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a923bc_social-icon-font.svg': '/assets/fonts/social-icon-font.svg',

  // Font Awesome fonts
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/647cbabb5e0046ec9b937da0_fa-v4compatibility.woff2': '/assets/fonts/fa-v4compatibility.woff2',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/650209cb9156c8ebb8bb77ce_fa-solid-900.woff': '/assets/fonts/fa-solid-900.woff',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6502b7b293b1197f48bd2075_Font%20Awesome%206%20Pro-Solid-900.otf': '/assets/fonts/font-awesome-6-pro-solid-900.otf',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/650342f48d9f51766c101fe0_Font%20Awesome%206%20Pro-Light-300.otf': '/assets/fonts/font-awesome-6-pro-light-300.otf',

  // Nohemi fonts
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6712383dae7eba830728a52d_Nohemi-Medium.woff2': '/assets/fonts/Nohemi-Medium.woff2',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6712383db24180a785a16f7e_Nohemi-Semi.woff2': '/assets/fonts/Nohemi-Semi.woff2',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6712383df808035d5b2712e6_Nohemi-Regular.woff2': '/assets/fonts/Nohemi-Regular.woff2',

  // SVG icons
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a922d3_dark-checkmark-techplus-x-template.svg': '/assets/images/icons/dark-checkmark.svg',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a92306_social-icon-instagram-techplus-x-template.svg': '/assets/images/icons/social-instagram.svg',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a92307_social-icon-whatsapp-techplus-x-template.svg': '/assets/images/icons/social-whatsapp.svg',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a92308_social-icon-linkedin-techplus-x-template.svg': '/assets/images/icons/social-linkedin.svg',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a92309_social-icon-facebook-techplus-x-template.svg': '/assets/images/icons/social-facebook.svg',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a9230a_social-icon-youtube-techplus-x-template.svg': '/assets/images/icons/social-youtube.svg',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a92314_social-icon-twitter-techplus-x-template.svg': '/assets/images/icons/social-twitter.svg',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a92323_search-techplus-x-template.svg': '/assets/images/icons/search.svg',

  // PNG images
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/647cad568a1b4d74146937ae_discord.png': '/assets/images/icons/discord.png',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6710d8dcebc9d36937f10eac_BWS-Logo-Background-Violet.png': '/assets/images/logos/bws-logo-violet.png',
  'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6710d995db577767928230a0_BWS-Logo-Background-Violet-Flying.png': '/assets/images/logos/bws-logo-violet-flying.png'
};

// Function to download a file
function downloadFile(url, localPath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join('_site', localPath);

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
        resolve();
      }
    }).on('error', (err) => {
      console.log(`✗ Error downloading ${url}: ${err.message}`);
      resolve();
    });
  });
}

// Function to replace CDN URLs in CSS files
function replaceInCssFiles() {
  const cssFiles = [
    '_site/assets/css/webflow.css',
    '_site/assets/css/bws-21ce3b.webflow.shared.9162577b1.min.css',
    '_site/assets/css/main.css'
  ];

  let totalReplacements = 0;

  cssFiles.forEach(file => {
    if (!fs.existsSync(file)) return;

    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    Object.entries(resourceMappings).forEach(([cdnUrl, localPath]) => {
      // Replace full URLs
      const fullUrlPattern = new RegExp(cdnUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      if (content.match(fullUrlPattern)) {
        content = content.replace(fullUrlPattern, localPath);
        modified = true;
        totalReplacements++;
      }

      // Replace protocol-relative URLs (//cdn...)
      const relativeUrl = cdnUrl.replace('https:', '');
      const relativeUrlPattern = new RegExp(relativeUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      if (content.match(relativeUrlPattern)) {
        content = content.replace(relativeUrlPattern, localPath);
        modified = true;
        totalReplacements++;
      }
    });

    if (modified) {
      fs.writeFileSync(file, content);
      console.log(`✓ Updated: ${path.basename(file)}`);
    }
  });

  return totalReplacements;
}

// Main execution
async function main() {
  console.log('Starting CSS resource localization...\n');

  // Download all resources
  console.log('Downloading CSS resources (fonts, icons, images)...');
  const downloads = Object.entries(resourceMappings).map(([url, localPath]) =>
    downloadFile(url, localPath)
  );

  await Promise.all(downloads);

  console.log('\nReplacing CDN URLs in CSS files...');
  const totalReplacements = replaceInCssFiles();

  console.log(`\n✓ Localization complete! Replaced ${totalReplacements} CDN references in CSS.`);

  // Final check
  const { execSync } = require('child_process');
  const remaining = execSync('grep -c "cdn.prod.website-files.com" _site/assets/css/*.css 2>/dev/null | grep -v ":0" | wc -l', { encoding: 'utf8' }).trim();

  if (remaining === '0') {
    console.log('✅ All CSS CDN references have been successfully localized!');
  } else {
    console.log(`⚠️  Some CSS files may still have CDN references.`);
    console.log('Run: grep "cdn.prod.website-files.com" _site/assets/css/*.css to check.');
  }
}

main().catch(console.error);