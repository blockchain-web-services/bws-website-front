import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('Navigating to http://localhost:5500/index.html#roadmap...');
  await page.goto('http://localhost:5500/index.html#roadmap');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  console.log('Clicking Q1 learnings button...');
  const q1Button = await page.locator('[data-quarter="1"][data-year="2025"] .roadmap-learnings-toggle').first();
  await q1Button.click();
  await page.waitForTimeout(500);
  
  console.log('Clicking Q2 learnings button...');
  const q2Button = await page.locator('[data-quarter="2"][data-year="2025"] .roadmap-learnings-toggle').first();
  await q2Button.click();
  await page.waitForTimeout(500);
  
  console.log('Taking screenshot...');
  const screenshotPath = path.join(__dirname, 'learnings-alignment-test.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved to: ${screenshotPath}`);
  
  // Get bounding boxes of both learnings containers for analysis
  const q1Box = await page.locator('[data-quarter="1"][data-year="2025"] .roadmap-learnings-container').first().boundingBox();
  const q2Box = await page.locator('[data-quarter="2"][data-year="2025"] .roadmap-learnings-container').first().boundingBox();
  
  console.log('\n=== Alignment Analysis ===');
  console.log('Q1 Learnings Top:', q1Box?.y);
  console.log('Q2 Learnings Top:', q2Box?.y);
  console.log('Vertical Difference:', Math.abs((q1Box?.y || 0) - (q2Box?.y || 0)), 'pixels');
  
  // Check Q2 text color
  const q2TextColor = await page.locator('[data-quarter="2"][data-year="2025"] .roadmap-learnings-content p').first().evaluate(el => {
    return window.getComputedStyle(el).color;
  });
  console.log('Q2 Text Color:', q2TextColor);
  
  await browser.close();
})();
