import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:5500/index.html#roadmap', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.waitForTimeout(2000);

  const q1Data = await page.locator('[data-quarter="1"][data-year="2025"]').first().evaluate(el => {
    const children = Array.from(el.children);
    return {
      cardTop: el.offsetTop,
      children: children.map(child => ({
        className: child.className.split(' ')[0],
        offsetTop: child.offsetTop,
        offsetHeight: child.offsetHeight,
        marginTop: window.getComputedStyle(child).marginTop,
        marginBottom: window.getComputedStyle(child).marginBottom,
      }))
    };
  });

  const q2Data = await page.locator('[data-quarter="2"][data-year="2025"]').first().evaluate(el => {
    const children = Array.from(el.children);
    return {
      cardTop: el.offsetTop,
      children: children.map(child => ({
        className: child.className.split(' ')[0],
        offsetTop: child.offsetTop,
        offsetHeight: child.offsetHeight,
        marginTop: window.getComputedStyle(child).marginTop,
        marginBottom: window.getComputedStyle(child).marginBottom,
      }))
    };
  });

  console.log('\n=== Q1 Elements ===');
  q1Data.children.forEach(c => {
    console.log(`${c.className}: top=${c.offsetTop}px, h=${c.offsetHeight}px, mt=${c.marginTop}, mb=${c.marginBottom}`);
  });

  console.log('\n=== Q2 Elements ===');
  q2Data.children.forEach(c => {
    console.log(`${c.className}: top=${c.offsetTop}px, h=${c.offsetHeight}px, mt=${c.marginTop}, mb=${c.marginBottom}`);
  });

  await browser.close();
})();
