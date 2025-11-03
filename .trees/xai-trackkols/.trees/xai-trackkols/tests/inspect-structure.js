import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5500/index.html#roadmap');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  // Get the computed heights of the columns and cards
  const q1Column = await page.locator('[data-quarter="1"][data-year="2025"]').first().evaluate(el => {
    const parent = el.parentElement;
    const parentStyles = window.getComputedStyle(parent);
    const elStyles = window.getComputedStyle(el);
    return {
      parentClass: parent.className,
      parentHeight: parent.offsetHeight,
      parentFlex: parentStyles.flex,
      parentDisplay: parentStyles.display,
      cardHeight: el.offsetHeight,
      cardFlex: elStyles.flex,
      cardDisplay: elStyles.display,
      cardFlexDirection: elStyles.flexDirection,
    };
  });
  
  const q2Column = await page.locator('[data-quarter="2"][data-year="2025"]').first().evaluate(el => {
    const parent = el.parentElement;
    const parentStyles = window.getComputedStyle(parent);
    const elStyles = window.getComputedStyle(el);
    return {
      parentClass: parent.className,
      parentHeight: parent.offsetHeight,
      parentFlex: parentStyles.flex,
      parentDisplay: parentStyles.display,
      cardHeight: el.offsetHeight,
      cardFlex: elStyles.flex,
      cardDisplay: elStyles.display,
      cardFlexDirection: elStyles.flexDirection,
    };
  });
  
  console.log('\n=== Q1 Structure ===');
  console.log(JSON.stringify(q1Column, null, 2));
  
  console.log('\n=== Q2 Structure ===');
  console.log(JSON.stringify(q2Column, null, 2));
  
  await browser.close();
})();
