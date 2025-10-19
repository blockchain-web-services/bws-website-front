import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Disable cache to ensure fresh CSS
  await context.route('**/*', (route) => {
    const headers = route.request().headers();
    headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    route.continue({ headers });
  });

  await page.goto('http://localhost:4321/');
  await page.waitForLoadState('networkidle');

  console.log('\n=== ROADMAP TITLE COLORS CHECK ===\n');

  // Q2'2025 Gray card (use first() to get first match)
  const q2Title = page.locator('.container-head-roadmap-25-2nd .text-roadmap-title-4th').first();
  const q2Exists = await q2Title.count() > 0;

  if (q2Exists) {
    const q2Color = await q2Title.evaluate(el => window.getComputedStyle(el).color);
    const q2BgColor = await q2Title.evaluate(el => window.getComputedStyle(el).backgroundColor);
    const q2Text = await q2Title.textContent();

    console.log('Q2 2025 (Gray Card):');
    console.log('  Text:', q2Text.trim());
    console.log('  Text color:', q2Color);
    console.log('  Background:', q2BgColor);
    console.log('  Expected text: rgb(107, 107, 115)');
    console.log('  Expected bg: rgb(255, 255, 255)');
    console.log('  ✓ PASS' + (q2Color === 'rgb(107, 107, 115)' ? ' - Colors match!' : ' - COLOR MISMATCH!'));
  } else {
    console.log('Q2 2025: NOT FOUND');
  }

  console.log('');

  // Q1'2025 Rose card
  const q1Title = page.locator('.container-head-roadmap-25-1st .text-roadmap-title-2025-q1');
  const q1Exists = await q1Title.count() > 0;

  if (q1Exists) {
    const q1Color = await q1Title.evaluate(el => window.getComputedStyle(el).color);
    const q1BgColor = await q1Title.evaluate(el => window.getComputedStyle(el).backgroundColor);
    const q1Text = await q1Title.textContent();

    console.log('Q1 2025 (Rose Card):');
    console.log('  Text:', q1Text.trim());
    console.log('  Text color:', q1Color);
    console.log('  Background:', q1BgColor);
    console.log('  Expected text: rgb(196, 24, 65)');
    console.log('  Expected bg: rgb(255, 255, 255)');
    console.log('  ✓ PASS' + (q1Color === 'rgb(196, 24, 65)' ? ' - Colors match!' : ' - COLOR MISMATCH!'));
  } else {
    console.log('Q1 2025: NOT FOUND');
  }

  console.log('');

  // Q3'2025 Dark card (first)
  const q3Title = page.locator('.container-head-roadmap .text-roadmap-title').first();
  const q3Exists = await q3Title.count() > 0;

  if (q3Exists) {
    const q3Color = await q3Title.evaluate(el => window.getComputedStyle(el).color);
    const q3BgColor = await q3Title.evaluate(el => window.getComputedStyle(el).backgroundColor);
    const q3Text = await q3Title.textContent();

    console.log('Q3 2025 (Dark Card):');
    console.log('  Text:', q3Text.trim());
    console.log('  Text color:', q3Color);
    console.log('  Background:', q3BgColor);
    console.log('  Expected text: rgb(26, 27, 30)');
    console.log('  Expected bg: rgb(255, 255, 255)');
    console.log('  ✓ PASS' + (q3Color === 'rgb(26, 27, 30)' ? ' - Colors match!' : ' - COLOR MISMATCH!'));
  } else {
    console.log('Q3 2025: NOT FOUND');
  }

  console.log('\n=== END CHECK ===\n');

  await browser.close();
})();
