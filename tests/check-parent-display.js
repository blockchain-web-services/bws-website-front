import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5500/index.html#roadmap');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  // Check parent (card) display
  const cardDisplay = await page.locator('[data-quarter="1"][data-year="2025"]').first().evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      display: computed.display,
      flexDirection: computed.flexDirection,
      className: el.className,
    };
  });
  
  console.log('\n=== Q1 Card Display ===');
  console.log(JSON.stringify(cardDisplay, null, 2));
  
  await browser.close();
})();
