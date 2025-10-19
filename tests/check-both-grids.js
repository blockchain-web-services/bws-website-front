import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:5500/index.html#roadmap');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const q1Grid = await page.locator('[data-quarter="1"][data-year="2025"]').first().evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      gridTemplateRows: computed.gridTemplateRows,
      height: el.offsetHeight,
    };
  });

  const q2Grid = await page.locator('[data-quarter="2"][data-year="2025"]').first().evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      gridTemplateRows: computed.gridTemplateRows,
      height: el.offsetHeight,
    };
  });

  console.log('\n=== Q1 Grid ===');
  console.log(JSON.stringify(q1Grid, null, 2));

  console.log('\n=== Q2 Grid ===');
  console.log(JSON.stringify(q2Grid, null, 2));

  await browser.close();
})();
