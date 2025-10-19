import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:5500/index.html#roadmap', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.waitForTimeout(2000);

  // Check BEFORE expansion
  const beforeExpansion = await page.evaluate(() => {
    const q1 = document.querySelector('[data-quarter="1"][data-year="2025"] .roadmap-learnings-container');
    const q2 = document.querySelector('[data-quarter="2"][data-year="2025"] .roadmap-learnings-container');
    return {
      q1: { offsetTop: q1.offsetTop, offsetHeight: q1.offsetHeight },
      q2: { offsetTop: q2.offsetTop, offsetHeight: q2.offsetHeight },
    };
  });

  console.log('=== BEFORE EXPANSION ===');
  console.log('Q1:', beforeExpansion.q1);
  console.log('Q2:', beforeExpansion.q2);
  console.log('Difference:', Math.abs(beforeExpansion.q1.offsetTop - beforeExpansion.q2.offsetTop), 'px');

  // Click to expand
  await page.click('[data-quarter="1"][data-year="2025"] .roadmap-learnings-toggle');
  await page.waitForTimeout(500);
  await page.click('[data-quarter="2"][data-year="2025"] .roadmap-learnings-toggle');
  await page.waitForTimeout(500);

  // Check AFTER expansion
  const afterExpansion = await page.evaluate(() => {
    const q1 = document.querySelector('[data-quarter="1"][data-year="2025"] .roadmap-learnings-container');
    const q2 = document.querySelector('[data-quarter="2"][data-year="2025"] .roadmap-learnings-container');
    const q1Content = document.querySelector('[data-quarter="1"][data-year="2025"] .roadmap-learnings-content');
    const q2Content = document.querySelector('[data-quarter="2"][data-year="2025"] .roadmap-learnings-content');
    return {
      q1: { offsetTop: q1.offsetTop, offsetHeight: q1.offsetHeight, contentHeight: q1Content.offsetHeight },
      q2: { offsetTop: q2.offsetTop, offsetHeight: q2.offsetHeight, contentHeight: q2Content.offsetHeight },
    };
  });

  console.log('\n=== AFTER EXPANSION ===');
  console.log('Q1:', afterExpansion.q1);
  console.log('Q2:', afterExpansion.q2);
  console.log('Difference:', Math.abs(afterExpansion.q1.offsetTop - afterExpansion.q2.offsetTop), 'px');
  console.log('Content height difference:', Math.abs(afterExpansion.q1.contentHeight - afterExpansion.q2.contentHeight), 'px');

  await browser.close();
})();
