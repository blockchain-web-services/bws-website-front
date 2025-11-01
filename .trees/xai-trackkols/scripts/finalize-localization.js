const fs = require('fs');
const path = require('path');
const https = require('https');

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(filepath);
        downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${path.basename(filepath)}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

async function finalizeLocalization() {
  const htmlDir = path.join(__dirname, '..', '_site');
  
  // Download Lottie JSON file
  const lottieUrl = 'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a9236e_lottie-techplus-x-template.json';
  const lottieLocal = path.join(htmlDir, 'assets', 'js', '6474d385cfec71cb21a9236e_lottie-techplus-x-template.json');
  
  if (!fs.existsSync(lottieLocal)) {
    console.log('Downloading Lottie animation file...');
    try {
      await downloadFile(lottieUrl, lottieLocal);
    } catch (err) {
      console.error('Failed to download Lottie file:', err.message);
    }
  }
  
  // Find all HTML files
  const htmlFiles = [];
  function findHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filepath = path.join(dir, file);
      const stat = fs.statSync(filepath);
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'assets') {
        findHtmlFiles(filepath);
      } else if (file.endsWith('.html')) {
        htmlFiles.push(filepath);
      }
    }
  }
  
  findHtmlFiles(htmlDir);
  console.log(`\nUpdating ${htmlFiles.length} HTML files...`);
  
  // Update remaining external URLs
  const replacements = [
    // Lottie JSON
    {
      from: 'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/6474d385cfec71cb21a9236e_lottie-techplus-x-template.json',
      to: '/assets/js/6474d385cfec71cb21a9236e_lottie-techplus-x-template.json'
    },
    // Video files with URL encoding
    {
      from: 'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251%2F670f916b2f60627d5201850b_shutterstock_1108417201-transcode.mp4',
      to: '/assets/images/6474d385cfec71cb21a92251/670f916b2f60627d5201850b_shutterstock_1108417201-transcode.mp4'
    },
    {
      from: 'https://cdn.prod.website-files.com/6474d385cfec71cb21a92251%2F670f916b2f60627d5201850b_shutterstock_1108417201-transcode.webm',
      to: '/assets/images/6474d385cfec71cb21a92251/670f916b2f60627d5201850b_shutterstock_1108417201-transcode.webm'
    }
  ];
  
  let totalUpdates = 0;
  
  for (const htmlFile of htmlFiles) {
    let content = fs.readFileSync(htmlFile, 'utf8');
    let updated = false;
    
    for (const replacement of replacements) {
      if (content.includes(replacement.from)) {
        const escapedFrom = replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedFrom, 'g');
        content = content.replace(regex, replacement.to);
        updated = true;
      }
    }
    
    if (updated) {
      fs.writeFileSync(htmlFile, content);
      console.log(`Updated: ${path.relative(htmlDir, htmlFile)}`);
      totalUpdates++;
    }
  }
  
  console.log(`\nFinalization complete! Updated ${totalUpdates} files.`);
  
  // Final check for any remaining external resources
  console.log('\nChecking for any remaining external resources...');
  let remainingExternal = 0;
  
  for (const htmlFile of htmlFiles) {
    const content = fs.readFileSync(htmlFile, 'utf8');
    if (content.includes('https://cdn.prod.website-files.com') || 
        content.includes('https://assets-global.website-files.com')) {
      const matches = content.match(/https:\/\/(cdn\.prod|assets-global)\.website-files\.com[^"'\s)]*/g);
      if (matches) {
        const uniqueMatches = [...new Set(matches)];
        console.log(`\nRemaining in ${path.relative(htmlDir, htmlFile)}:`);
        uniqueMatches.forEach(url => console.log(`  - ${url}`));
        remainingExternal++;
      }
    }
  }
  
  if (remainingExternal === 0) {
    console.log('✓ All external resources have been localized!');
  } else {
    console.log(`\n⚠ ${remainingExternal} files still contain external resources.`);
  }
}

finalizeLocalization().catch(console.error);