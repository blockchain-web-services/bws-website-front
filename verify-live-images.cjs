const { chromium } = require('playwright');

(async () => {
  console.log('🧪 Verifying images on live site...\n');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const articles = [
    'fan-game-cube-2025-12-09',
    'esg-credits-2025-12-09',
    'blockchain-badges-2025-12-09',
    'x-bot-2025-12-09'
  ];

  let allPassed = true;

  for (const article of articles) {
    const url = `https://www.bws.ninja/articles/${article}.html`;
    console.log(`\n📄 Testing: ${url}`);

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);

      const productName = article.replace('-2025-12-09', '');
      const images = await page.locator(`img[src*="/assets/images/docs/${productName}"]`).all();

      console.log(`   Images found: ${images.length}`);

      if (images.length === 0) {
        console.log(`   ❌ No images found!`);
        allPassed = false;
        continue;
      }

      const img = images[0];
      const src = await img.getAttribute('src');
      const visible = await img.isVisible();
      const naturalWidth = await img.evaluate(el => el.naturalWidth);
      const naturalHeight = await img.evaluate(el => el.naturalHeight);
      const clientWidth = await img.evaluate(el => el.clientWidth);
      const clientHeight = await img.evaluate(el => el.clientHeight);

      console.log(`   First image: ${src}`);
      console.log(`   Visible: ${visible}`);
      console.log(`   Natural dimensions: ${naturalWidth}x${naturalHeight}`);
      console.log(`   Rendered dimensions: ${clientWidth}x${clientHeight}`);

      if (clientWidth > 0 && clientHeight > 0) {
        console.log(`   ✅ IMAGE IS DISPLAYING CORRECTLY!`);
      } else {
        console.log(`   ❌ Image not displaying (0x0 dimensions)`);
        allPassed = false;
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      allPassed = false;
    }
  }

  await browser.close();

  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('✅ ALL IMAGES ARE DISPLAYING CORRECTLY ON LIVE SITE!');
    console.log('='.repeat(50));
    process.exit(0);
  } else {
    console.log('❌ SOME IMAGES FAILED TO DISPLAY');
    console.log('='.repeat(50));
    process.exit(1);
  }
})();
