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
    const q1Card = document.querySelector('[data-quarter="1"][data-year="2025"]');
    const q2Card = document.querySelector('[data-quarter="2"][data-year="2025"]');
    const q1Column = q1Card.parentElement;
    const q2Column = q2Card.parentElement;

    return {
      q1Column: {
        offsetTop: q1Column.offsetTop,
        offsetHeight: q1Column.offsetHeight,
      },
      q2Column: {
        offsetTop: q2Column.offsetTop,
        offsetHeight: q2Column.offsetHeight,
      },
      q1Card: {
        offsetTop: q1Card.offsetTop,
        offsetHeight: q1Card.offsetHeight,
      },
      q2Card: {
        offsetTop: q2Card.offsetTop,
        offsetHeight: q2Card.offsetHeight,
      },
    };
  });

  console.log('=== Parent Columns ===');
  console.log('Q1 column:', data.q1Column);
  console.log('Q2 column:', data.q2Column);
  console.log('Column height difference:', Math.abs(data.q1Column.offsetHeight - data.q2Column.offsetHeight), 'px');

  console.log('\n=== Cards ===');
  console.log('Q1 card:', data.q1Card);
  console.log('Q2 card:', data.q2Card);

  await browser.close();
})();
