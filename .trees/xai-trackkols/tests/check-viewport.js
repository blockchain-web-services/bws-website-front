import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5500/index.html#roadmap');
  await page.waitForLoadState('networkidle');
  
  // Get viewport size
  const viewport = page.viewportSize();
  console.log('\n=== Viewport Size ===');
  console.log(JSON.stringify(viewport, null, 2));
  
  await browser.close();
})();
