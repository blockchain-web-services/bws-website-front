import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:5500/index.html#roadmap', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.waitForTimeout(2000);

  const children = await page.locator('[data-quarter="1"][data-year="2025"]').first().evaluate(el => {
    return Array.from(el.children).map(child => ({
      className: child.className,
      offsetHeight: child.offsetHeight,
    }));
  });

  console.log('\n=== Q1 Card Children ===');
  children.forEach((c, i) => console.log(`${i}. ${c.className}: ${c.offsetHeight}px`));

  await browser.close();
})();
