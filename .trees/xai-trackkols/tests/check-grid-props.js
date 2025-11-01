import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5500/index.html#roadmap');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  const gridProps = await page.locator('[data-quarter="1"][data-year="2025"]').first().evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      display: computed.display,
      gridTemplateRows: computed.gridTemplateRows,
      gridRowGap: computed.gridRowGap,
      rowGap: computed.rowGap,
      gridGap: computed.gridGap,
      gap: computed.gap,
    };
  });
  
  console.log('\n=== Grid Properties ===');
  console.log(JSON.stringify(gridProps, null, 2));
  
  await browser.close();
})();
