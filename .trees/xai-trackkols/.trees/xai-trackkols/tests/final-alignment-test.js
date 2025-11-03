import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:5500/index.html#roadmap', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.waitForTimeout(2000);

  // Click learnings
  await page.click('[data-quarter="1"][data-year="2025"] .roadmap-learnings-toggle');
  await page.waitForTimeout(500);
  await page.click('[data-quarter="2"][data-year="2025"] .roadmap-learnings-toggle');
  await page.waitForTimeout(500);

  // Get offsetTop which is relative to parent
  const positions = await page.evaluate(() => {
    const q1 = document.querySelector('[data-quarter="1"][data-year="2025"] .roadmap-learnings-container');
    const q2 = document.querySelector('[data-quarter="2"][data-year="2025"] .roadmap-learnings-container');
    return {
      q1Top: q1.offsetTop,
      q2Top: q2.offsetTop,
    };
  });

  console.log('Q1 offsetTop:', positions.q1Top);
  console.log('Q2 offsetTop:', positions.q2Top);
  console.log('Difference:', Math.abs(positions.q1Top - positions.q2Top), 'px');
  console.log(Math.abs(positions.q1Top - positions.q2Top) < 1 ? '✓ PERFECTLY ALIGNED!' : '✗ NOT ALIGNED');

  // Take screenshot
  await page.screenshot({ path: 'final-alignment-result.png', fullPage: true });
  console.log('\nScreenshot saved to: final-alignment-result.png');

  await browser.close();
})();
