import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5500/index.html#roadmap');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  // Click learnings
  await page.locator('[data-quarter="1"][data-year="2025"] .roadmap-learnings-toggle').first().click();
  await page.waitForTimeout(500);
  
  const children = await page.locator('[data-quarter="1"][data-year="2025"]').first().evaluate(el => {
    return Array.from(el.children).map((child, idx) => ({
      index: idx,
      tag: child.tagName,
      className: child.className,
      id: child.id,
      textContent: child.textContent.substring(0, 30),
      height: child.offsetHeight,
    }));
  });
  
  console.log('\n=== Q1 Card Children ===');
  children.forEach(child => console.log(`${child.index}. ${child.tag}.${child.className}: height=${child.height}px, text="${child.textContent}"`));
  
  await browser.close();
})();
