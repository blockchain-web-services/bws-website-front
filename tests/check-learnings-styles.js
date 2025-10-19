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

  // Check computed styles
  const q1Styles = await page.locator('[data-quarter="1"][data-year="2025"] .roadmap-learnings-container').first().evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      marginTop: computed.marginTop,
      marginBottom: computed.marginBottom,
      paddingTop: computed.paddingTop,
      display: computed.display,
      position: computed.position,
    };
  });

  console.log('\n=== Q1 Learnings Container Styles ===');
  console.log(JSON.stringify(q1Styles, null, 2));

  await browser.close();
})();
