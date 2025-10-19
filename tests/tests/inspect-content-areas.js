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
  await page.locator('[data-quarter="2"][data-year="2025"] .roadmap-learnings-toggle').first().click();
  await page.waitForTimeout(500);
  
  // Get all child elements heights
  const q1Elements = await page.locator('[data-quarter="1"][data-year="2025"]').first().evaluate(el => {
    const children = Array.from(el.children);
    return children.map(child => ({
      className: child.className,
      height: child.offsetHeight,
      flex: window.getComputedStyle(child).flex,
      marginTop: window.getComputedStyle(child).marginTop,
    }));
  });
  
  const q2Elements = await page.locator('[data-quarter="2"][data-year="2025"]').first().evaluate(el => {
    const children = Array.from(el.children);
    return children.map(child => ({
      className: child.className,
      height: child.offsetHeight,
      flex: window.getComputedStyle(child).flex,
      marginTop: window.getComputedStyle(child).marginTop,
    }));
  });
  
  console.log('\n=== Q1 Card Children ===');
  q1Elements.forEach((el, i) => console.log(`${i + 1}. ${el.className}: height=${el.height}px, flex=${el.flex}, marginTop=${el.marginTop}`));
  console.log(`Total: ${q1Elements.reduce((sum, el) => sum + el.height, 0)}px`);
  
  console.log('\n=== Q2 Card Children ===');
  q2Elements.forEach((el, i) => console.log(`${i + 1}. ${el.className}: height=${el.height}px, flex=${el.flex}, marginTop=${el.marginTop}`));
  console.log(`Total: ${q2Elements.reduce((sum, el) => sum + el.height, 0)}px`);
  
  await browser.close();
})();
