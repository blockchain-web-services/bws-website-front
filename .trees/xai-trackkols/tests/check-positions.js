import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:5500/index.html#roadmap');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Click learnings
  await page.locator('[data-quarter="1"][data-year="2025"] .roadmap-learnings-toggle').first().click();
  await page.waitForTimeout(500);
  await page.locator('[data-quarter="2"][data-year="2025"] .roadmap-learnings-toggle').first().click();
  await page.waitForTimeout(500);

  // Get card positions
  const q1Card = await page.locator('[data-quarter="1"][data-year="2025"]').first().boundingBox();
  const q2Card = await page.locator('[data-quarter="2"][data-year="2025"]').first().boundingBox();

  // Get learnings positions
  const q1Learnings = await page.locator('[data-quarter="1"][data-year="2025"] .roadmap-learnings-container').first().boundingBox();
  const q2Learnings = await page.locator('[data-quarter="2"][data-year="2025"] .roadmap-learnings-container').first().boundingBox();

  console.log('\n=== Positions ===');
  console.log('Q1 Card:', q1Card);
  console.log('Q1 Learnings:', q1Learnings);
  console.log('Q1 Learnings relative to card:', q1Learnings.y - q1Card.y);
  console.log('');
  console.log('Q2 Card:', q2Card);
  console.log('Q2 Learnings:', q2Learnings);
  console.log('Q2 Learnings relative to card:', q2Learnings.y - q2Card.y);

  await browser.close();
})();
