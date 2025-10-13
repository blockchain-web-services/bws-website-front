import { test } from '@playwright/test';

test('debug announcement-box styles', async ({ page }) => {
  await page.goto('http://localhost:5500/index.html');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  const boxStyles = await page.evaluate(() => {
    const box = document.querySelector('.announcement-box');
    if (!box) return null;

    const computed = window.getComputedStyle(box);
    const allRules = [];

    // Get all CSS rules that apply to this element
    const sheets = Array.from(document.styleSheets);
    for (const sheet of sheets) {
      try {
        const rules = Array.from(sheet.cssRules || []);
        for (const rule of rules) {
          if (rule.type === 1 && box.matches(rule.selectorText)) {
            const style = rule.style;
            if (style.width || style.maxWidth || style.minWidth) {
              allRules.push({
                selector: rule.selectorText,
                width: style.width,
                maxWidth: style.maxWidth,
                minWidth: style.minWidth,
                sheet: sheet.href || 'inline'
              });
            }
          }
        }
      } catch (e) {
        // Skip CORS-protected stylesheets
      }
    }

    return {
      computed: {
        width: computed.width,
        maxWidth: computed.maxWidth,
        minWidth: computed.minWidth,
        boxSizing: computed.boxSizing,
        paddingLeft: computed.paddingLeft,
        paddingRight: computed.paddingRight
      },
      rules: allRules,
      classes: Array.from(box.classList),
      actualWidth: box.offsetWidth
    };
  });

  console.log('Box styles:', JSON.stringify(boxStyles, null, 2));
});
