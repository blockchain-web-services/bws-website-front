import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:5500/index.html#roadmap', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.waitForTimeout(2000);

  const before = await page.evaluate(() => {
    const q1Card = document.querySelector('[data-quarter="1"][data-year="2025"]');
    const q2Card = document.querySelector('[data-quarter="2"][data-year="2025"]');
    return {
      q1Height: q1Card.offsetHeight,
      q2Height: q2Card.offsetHeight,
    };
  });

  console.log('=== BEFORE EXPANSION ===');
  console.log('Q1 card height:', before.q1Height);
  console.log('Q2 card height:', before.q2Height);

  await page.click('[data-quarter="1"][data-year="2025"] .roadmap-learnings-toggle');
  await page.waitForTimeout(500);
  await page.click('[data-quarter="2"][data-year="2025"] .roadmap-learnings-toggle');
  await page.waitForTimeout(500);

  const after = await page.evaluate(() => {
    const q1Card = document.querySelector('[data-quarter="1"][data-year="2025"]');
    const q2Card = document.querySelector('[data-quarter="2"][data-year="2025"]');
    return {
      q1Height: q1Card.offsetHeight,
      q2Height: q2Card.offsetHeight,
    };
  });

  console.log('\n=== AFTER EXPANSION ===');
  console.log('Q1 card height:', after.q1Height);
  console.log('Q2 card height:', after.q2Height);
  console.log('Difference:', Math.abs(after.q1Height - after.q2Height), 'px');

  await browser.close();
})();
