const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Simple static file server for _site directory
function startServer() {
  const PORT = 3456;
  const SITE_DIR = path.join(__dirname, '_site');

  const server = http.createServer((req, res) => {
    let filePath = path.join(SITE_DIR, req.url === '/' ? 'index.html' : req.url);

    // Set content type based on extension
    const ext = path.extname(filePath);
    const contentTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.svg': 'image/svg+xml',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.json': 'application/json'
    };

    const contentType = contentTypes[ext] || 'text/plain';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404);
          res.end('Not found');
        } else {
          res.writeHead(500);
          res.end('Server error');
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`\n🌐 Local server started at http://localhost:${PORT}`);
      resolve({ server, url: `http://localhost:${PORT}` });
    });
  });
}

(async () => {
  console.log('🧪 Testing local build with Playwright...\n');

  const { server, url } = await startServer();

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('📄 Loading fan-game-cube article...');
    await page.goto(`${url}/articles/fan-game-cube-2025-12-09.html`, {
      waitUntil: 'networkidle'
    });

    await page.waitForTimeout(2000);

    // Check for images with .svg extension
    const svgImages = await page.locator('img[src*="/assets/images/docs/fan-game-cube"][src$=".svg"]').all();
    console.log(`\n✅ Found ${svgImages.length} SVG images in the article`);

    if (svgImages.length > 0) {
      const img = svgImages[0];
      const src = await img.getAttribute('src');
      const visible = await img.isVisible();
      const naturalWidth = await img.evaluate(el => el.naturalWidth);
      const naturalHeight = await img.evaluate(el => el.naturalHeight);
      const clientWidth = await img.evaluate(el => el.clientWidth);
      const clientHeight = await img.evaluate(el => el.clientHeight);

      console.log(`\nFirst SVG Image:`);
      console.log(`  src: ${src}`);
      console.log(`  visible: ${visible}`);
      console.log(`  naturalWidth: ${naturalWidth}`);
      console.log(`  naturalHeight: ${naturalHeight}`);
      console.log(`  clientWidth: ${clientWidth}`);
      console.log(`  clientHeight: ${clientHeight}`);

      if (clientWidth > 0 && clientHeight > 0) {
        console.log(`\n✅ IMAGE IS DISPLAYING! (rendered dimensions: ${clientWidth}x${clientHeight})`);
      } else {
        console.log(`\n❌ Image not rendering (0x0 dimensions)`);
      }
    }

    // Check all 4 products
    console.log(`\n\n=== CHECKING ALL 4 ARTICLES ===\n`);

    const articles = [
      'esg-credits-2025-12-09',
      'blockchain-badges-2025-12-09',
      'fan-game-cube-2025-12-09',
      'x-bot-2025-12-09'
    ];

    for (const article of articles) {
      await page.goto(`${url}/articles/${article}.html`, {
        waitUntil: 'networkidle'
      });
      await page.waitForTimeout(1000);

      const productName = article.replace('-2025-12-09', '');
      const docsImages = await page.locator(`img[src*="/assets/images/docs/${productName}"]`).all();

      console.log(`${article}:`);
      console.log(`  Images found: ${docsImages.length}`);

      if (docsImages.length > 0) {
        const firstImg = docsImages[0];
        const src = await firstImg.getAttribute('src');
        const clientWidth = await firstImg.evaluate(el => el.clientWidth);
        const clientHeight = await firstImg.evaluate(el => el.clientHeight);
        const ext = path.extname(src);

        console.log(`  First image: ${path.basename(src)}`);
        console.log(`  Extension: ${ext}`);
        console.log(`  Displaying: ${clientWidth > 0 && clientHeight > 0 ? 'YES' : 'NO'} (${clientWidth}x${clientHeight})`);
      }
    }

    await page.screenshot({
      path: 'fan-game-cube-fixed-screenshot.png',
      fullPage: true
    });

    console.log(`\n📸 Screenshot saved: fan-game-cube-fixed-screenshot.png`);

  } finally {
    await browser.close();
    server.close();
    console.log('\n✅ Test completed!');
  }
})();
