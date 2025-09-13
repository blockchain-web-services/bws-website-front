#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '..', '_site');
const SCRIPTS_DIR = path.join(__dirname);

console.log('🔨 Starting build process...');

try {
  // Clean build directory
  console.log('📦 Cleaning build directory...');
  if (fs.existsSync(BUILD_DIR)) {
    fs.rmSync(BUILD_DIR, { recursive: true, force: true });
  }
  
  // Run data generation
  console.log('📊 Generating page data from crawl results...');
  execSync('node scripts/data-generation/generate-page-data.js', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  // Build with Eleventy
  console.log('🚀 Building with Eleventy...');
  execSync('npx eleventy', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  // Copy static assets
  console.log('📁 Copying static assets...');
  const assetsSource = path.join(__dirname, '..', 'src', 'assets');
  const assetsDest = path.join(BUILD_DIR, 'assets');
  
  if (fs.existsSync(assetsSource)) {
    execSync(`cp -r "${assetsSource}" "${assetsDest}"`, { stdio: 'inherit' });
  }
  
  // Create CNAME file for custom domain
  console.log('🌐 Creating CNAME file...');
  fs.writeFileSync(path.join(BUILD_DIR, 'CNAME'), 'www.bws.ninja\n');
  
  // Create .nojekyll file to bypass Jekyll processing
  console.log('📝 Creating .nojekyll file...');
  fs.writeFileSync(path.join(BUILD_DIR, '.nojekyll'), '');
  
  // Generate sitemap.xml
  console.log('🗺️ Generating sitemap...');
  const sitemap = generateSitemap();
  fs.writeFileSync(path.join(BUILD_DIR, 'sitemap.xml'), sitemap);
  
  // Generate robots.txt
  console.log('🤖 Generating robots.txt...');
  const robots = `User-agent: *
Allow: /

Sitemap: https://www.bws.ninja/sitemap.xml
`;
  fs.writeFileSync(path.join(BUILD_DIR, 'robots.txt'), robots);
  
  console.log('✅ Build completed successfully!');
  console.log(`📂 Output directory: ${BUILD_DIR}`);
  
  // Show build stats
  const stats = getBuildStats(BUILD_DIR);
  console.log('\n📊 Build Statistics:');
  console.log(`   Pages: ${stats.html} HTML files`);
  console.log(`   Styles: ${stats.css} CSS files`);
  console.log(`   Scripts: ${stats.js} JS files`);
  console.log(`   Total Size: ${formatBytes(stats.totalSize)}`);
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

function generateSitemap() {
  const baseUrl = 'https://www.bws.ninja';
  const pages = [];
  
  // Read all generated HTML files
  function scanDirectory(dir, baseDir = '') {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'assets') {
        scanDirectory(filePath, path.join(baseDir, file));
      } else if (file.endsWith('.html')) {
        const urlPath = path.join(baseDir, file === 'index.html' ? '' : file.replace('.html', ''));
        pages.push(urlPath.replace(/\\/g, '/'));
      }
    }
  }
  
  scanDirectory(BUILD_DIR);
  
  // Generate XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  pages.forEach(page => {
    const url = page ? `${baseUrl}/${page}` : baseUrl;
    const priority = page === '' ? '1.0' : page.includes('marketplace') ? '0.8' : '0.6';
    
    xml += '  <url>\n';
    xml += `    <loc>${url}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>\n';
  return xml;
}

function getBuildStats(dir) {
  let stats = {
    html: 0,
    css: 0,
    js: 0,
    totalSize: 0
  };
  
  function scanDir(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDir(filePath);
      } else {
        stats.totalSize += stat.size;
        
        if (file.endsWith('.html')) stats.html++;
        else if (file.endsWith('.css')) stats.css++;
        else if (file.endsWith('.js')) stats.js++;
      }
    }
  }
  
  scanDir(dir);
  return stats;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}