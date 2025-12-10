const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Loading fan-game-cube article...');
  await page.goto('https://www.bws.ninja/articles/fan-game-cube-2025-12-09.html', {
    waitUntil: 'networkidle'
  });

  // Wait a bit for images to load
  await page.waitForTimeout(3000);

  // Check for grid layout
  const gridLayout = await page.locator('div[style*="grid-template-columns: 1fr 1fr"]').count();
  console.log(`Grid layout found: ${gridLayout > 0 ? 'YES' : 'NO'} (count: ${gridLayout})`);

  // Check for images
  const images = await page.locator('img[src*="/assets/images/docs/fan-game-cube"]').all();
  console.log(`\nImages with docs path: ${images.length}`);

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const src = await img.getAttribute('src');
    const visible = await img.isVisible();
    const width = await img.evaluate(el => el.naturalWidth);
    const height = await img.evaluate(el => el.naturalHeight);

    console.log(`\nImage ${i+1}:`);
    console.log(`  src: ${src}`);
    console.log(`  visible: ${visible}`);
    console.log(`  dimensions: ${width}x${height}`);
    console.log(`  loaded: ${width > 0 && height > 0 ? 'YES' : 'NO'}`);
  }

  // Take screenshot
  await page.screenshot({
    path: 'fan-game-cube-screenshot.png',
    fullPage: true
  });
  console.log('\nScreenshot saved to: fan-game-cube-screenshot.png');

  // Check all article images
  console.log('\n\n=== CHECKING ALL 4 ARTICLES ===\n');

  const articles = [
    'esg-credits-2025-12-09',
    'blockchain-badges-2025-12-09',
    'fan-game-cube-2025-12-09',
    'x-bot-2025-12-09'
  ];

  for (const article of articles) {
    await page.goto(`https://www.bws.ninja/articles/${article}.html`, {
      waitUntil: 'networkidle'
    });
    await page.waitForTimeout(2000);

    const productName = article.replace('-2025-12-09', '');
    const docsImages = await page.locator(`img[src*="/assets/images/docs/${productName}"]`).all();

    console.log(`${article}:`);
    console.log(`  Docs images found: ${docsImages.length}`);

    if (docsImages.length > 0) {
      const firstImg = docsImages[0];
      const width = await firstImg.evaluate(el => el.naturalWidth);
      const height = await firstImg.evaluate(el => el.naturalHeight);
      console.log(`  First image loaded: ${width > 0 && height > 0 ? 'YES' : 'NO'} (${width}x${height})`);
    }
  }

  await browser.close();
  console.log('\nTest completed!');
})();
