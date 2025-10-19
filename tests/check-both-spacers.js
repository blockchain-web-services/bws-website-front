import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:5500/index.html#roadmap', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.waitForTimeout(2000);

  const q1Children = await page.locator('[data-quarter="1"][data-year="2025"]').first().evaluate(el => {
    return Array.from(el.children).map(child => ({
      className: child.className,
      offsetHeight: child.offsetHeight,
    }));
  });

  const q2Children = await page.locator('[data-quarter="2"][data-year="2025"]').first().evaluate(el => {
    return Array.from(el.children).map(child => ({
      className: child.className,
      offsetHeight: child.offsetHeight,
    }));
  });

  console.log('\n=== Q1 Card Children ===');
  q1Children.forEach((c, i) => console.log(`${i}. ${c.className}: ${c.offsetHeight}px`));
  const q1Spacer = q1Children.find(c => c.className === 'roadmap-flex-spacer');

  console.log('\n=== Q2 Card Children ===');
  q2Children.forEach((c, i) => console.log(`${i}. ${c.className}: ${c.offsetHeight}px`));
  const q2Spacer = q2Children.find(c => c.className === 'roadmap-flex-spacer');

  console.log('\nSpacer difference:', Math.abs((q1Spacer?.offsetHeight || 0) - (q2Spacer?.offsetHeight || 0)), 'px');

  await browser.close();
})();
