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
  
  // Check structure
  const structure = await page.locator('[data-quarter="1"][data-year="2025"] .roadmap-learnings-container').first().evaluate(el => {
    const button = el.querySelector('.roadmap-learnings-toggle');
    const content = el.querySelector('.roadmap-learnings-content');
    const buttonStyles = window.getComputedStyle(button);
    const contentStyles = window.getComputedStyle(content);
    
    return {
      containerHeight: el.offsetHeight,
      button: {
        height: button.offsetHeight,
        position: buttonStyles.position,
      },
      content: {
        height: content.offsetHeight,
        position: contentStyles.position,
        display: contentStyles.display,
        maxHeight: contentStyles.maxHeight,
      }
    };
  });
  
  console.log('\n=== Learnings Structure ===');
  console.log(JSON.stringify(structure, null, 2));
  
  await browser.close();
})();
