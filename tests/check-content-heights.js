import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5500/index.html#roadmap');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  const q1Content = await page.locator('[data-quarter="1"][data-year="2025"] .container-roadmap-content').first().evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      height: el.offsetHeight,
      minHeight: computed.minHeight,
    };
  });
  
  const q2Content = await page.locator('[data-quarter="2"][data-year="2025"] .container-roadmap-content').first().evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      height: el.offsetHeight,
      minHeight: computed.minHeight,
    };
  });
  
  console.log('\n=== Content Areas ===');
  console.log('Q1:', q1Content);
  console.log('Q2:', q2Content);
  console.log('Difference:', Math.abs(q1Content.height - q2Content.height), 'px');
  
  await browser.close();
})();
