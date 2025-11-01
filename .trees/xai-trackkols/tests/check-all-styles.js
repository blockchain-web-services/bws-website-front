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
  
  // Get all CSS rules affecting the element
  const styles = await page.locator('[data-quarter="1"][data-year="2025"] .roadmap-learnings-container').first().evaluate(el => {
    const computed = window.getComputedStyle(el);
    const allStyles = {};
    for (let i = 0; i < computed.length; i++) {
      const prop = computed[i];
      if (prop.includes('margin') || prop.includes('display') || prop.includes('flex')) {
        allStyles[prop] = computed.getPropertyValue(prop);
      }
    }
    return allStyles;
  });
  
  console.log('\n=== All Relevant CSS Properties ===');
  console.log(JSON.stringify(styles, null, 2));
  
  await browser.close();
})();
