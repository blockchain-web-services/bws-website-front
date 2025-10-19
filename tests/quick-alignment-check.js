import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:5500/index.html#roadmap', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(2000);

    // Click learnings
    await page.click('[data-quarter="1"][data-year="2025"] .roadmap-learnings-toggle');
    await page.waitForTimeout(500);
    await page.click('[data-quarter="2"][data-year="2025"] .roadmap-learnings-toggle');
    await page.waitForTimeout(500);

    // Get positions
    const q1Pos = await page.locator('[data-quarter="1"][data-year="2025"] .roadmap-learnings-container').first().boundingBox();
    const q2Pos = await page.locator('[data-quarter="2"][data-year="2025"] .roadmap-learnings-container').first().boundingBox();

    const diff = Math.abs(q1Pos.y - q2Pos.y);
    console.log('Q1 Y:', q1Pos.y);
    console.log('Q2 Y:', q2Pos.y);
    console.log('Difference:', diff, 'px');
    console.log(diff < 1 ? '✓ ALIGNED!' : '✗ NOT ALIGNED');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
