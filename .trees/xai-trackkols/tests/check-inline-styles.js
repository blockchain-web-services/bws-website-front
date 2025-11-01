import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5500/index.html#roadmap');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  // Click to expand learnings
  await page.locator('[data-quarter="1"][data-year="2025"] .roadmap-learnings-toggle').first().click();
  await page.waitForTimeout(500);
  
  // Check for inline styles
  const inlineStyle = await page.locator('[data-quarter="1"][data-year="2025"] .roadmap-learnings-container').first().evaluate(el => {
    return {
      inlineStyle: el.getAttribute('style'),
      className: el.className,
      outerHTML: el.outerHTML.substring(0, 200),
    };
  });
  
  console.log('\n=== Element Attributes ===');
  console.log(JSON.stringify(inlineStyle, null, 2));
  
  await browser.close();
})();
