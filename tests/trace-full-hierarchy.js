import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:5500/index.html#roadmap', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.waitForTimeout(2000);

  await page.click('[data-quarter="1"][data-year="2025"] .roadmap-learnings-toggle');
  await page.waitForTimeout(500);
  await page.click('[data-quarter="2"][data-year="2025"] .roadmap-learnings-toggle');
  await page.waitForTimeout(500);

  const data = await page.evaluate(() => {
    const q1Learnings = document.querySelector('[data-quarter="1"][data-year="2025"] .roadmap-learnings-container');
    const q2Learnings = document.querySelector('[data-quarter="2"][data-year="2025"] .roadmap-learnings-container');

    // Get all ancestors and their offsetTops
    function getHierarchy(el) {
      const hierarchy = [];
      let current = el;
      while (current && current !== document.body) {
        hierarchy.push({
          tag: current.tagName,
          class: current.className.split(' ')[0],
          offsetTop: current.offsetTop,
          offsetParent: current.offsetParent ? current.offsetParent.className.split(' ')[0] : 'null',
        });
        current = current.parentElement;
      }
      return hierarchy;
    }

    return {
      q1: getHierarchy(q1Learnings),
      q2: getHierarchy(q2Learnings),
    };
  });

  console.log('=== Q1 Hierarchy (bottom to top) ===');
  data.q1.forEach((item, i) => console.log(`${i}. ${item.tag}.${item.class}: offsetTop=${item.offsetTop}, offsetParent=${item.offsetParent}`));

  console.log('\n=== Q2 Hierarchy (bottom to top) ===');
  data.q2.forEach((item, i) => console.log(`${i}. ${item.tag}.${item.class}: offsetTop=${item.offsetTop}, offsetParent=${item.offsetParent}`));

  await browser.close();
})();
