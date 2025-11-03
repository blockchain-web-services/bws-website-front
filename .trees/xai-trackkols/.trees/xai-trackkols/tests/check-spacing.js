import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5500/index.html#roadmap');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  // Get all elements and their positions
  const q1Elements = await page.locator('[data-quarter="1"][data-year="2025"]').first().evaluate(el => {
    return Array.from(el.children).map((child, idx) => {
      const computed = window.getComputedStyle(child);
      return {
        index: idx,
        className: child.className.split(' ')[0],
        offsetTop: child.offsetTop,
        offsetHeight: child.offsetHeight,
        marginTop: computed.marginTop,
        marginBottom: computed.marginBottom,
        paddingTop: computed.paddingTop,
        paddingBottom: computed.paddingBottom,
      };
    });
  });
  
  console.log('\n=== Q1 Elements with Positions ===');
  q1Elements.forEach(el => {
    console.log(`${el.index}. ${el.className}:`);
    console.log(`   offsetTop=${el.offsetTop}px, height=${el.offsetHeight}px`);
    console.log(`   margin: ${el.marginTop} / ${el.marginBottom}, padding: ${el.paddingTop} / ${el.paddingBottom}`);
  });
  
  await browser.close();
})();
