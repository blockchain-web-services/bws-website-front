import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5500/index.html#roadmap');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  // Get Q2 elements
  const q2Elements = await page.locator('[data-quarter="2"][data-year="2025"]').first().evaluate(el => {
    return Array.from(el.children).map((child, idx) => {
      const computed = window.getComputedStyle(child);
      return {
        index: idx,
        className: child.className.split(' ')[0],
        offsetTop: child.offsetTop,
        offsetHeight: child.offsetHeight,
        marginTop: computed.marginTop,
        marginBottom: computed.marginBottom,
      };
    });
  });
  
  console.log('\n=== Q2 Elements ===');
  q2Elements.forEach(el => {
    console.log(`${el.index}. ${el.className}: offsetTop=${el.offsetTop}px, height=${el.offsetHeight}px, marginBottom=${el.marginBottom}`);
  });
  
  await browser.close();
})();
