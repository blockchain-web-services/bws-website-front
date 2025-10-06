import { test, expect } from '@playwright/test';

test.describe('Navigation Dropdown Menu', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the home page
    await page.goto('http://localhost:4321');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('check dropdown structure and classes', async ({ page }) => {
    // Check if dropdown structure exists
    const dropdowns = await page.locator('.w-dropdown').count();
    console.log(`Number of dropdown containers: ${dropdowns}`);

    // Check each dropdown structure
    for (let i = 0; i < dropdowns; i++) {
      const dropdown = page.locator('.w-dropdown').nth(i);
      const toggle = await dropdown.locator('.w-dropdown-toggle').count();
      const list = await dropdown.locator('.w-dropdown-list').count();

      console.log(`Dropdown ${i}: has toggle: ${toggle > 0}, has list: ${list > 0}`);

      // Check for w--open class on hover
      if (toggle > 0) {
        const toggleEl = dropdown.locator('.w-dropdown-toggle').first();
        await toggleEl.hover();
        await page.waitForTimeout(300);

        const hasOpenClass = await dropdown.evaluate(el =>
          el.classList.contains('w--open')
        );
        console.log(`Dropdown ${i} has w--open class after hover: ${hasOpenClass}`);
      }
    }
  });

  test('verify dropdown interaction with manual triggering', async ({ page }) => {
    // Wait for Webflow to be ready
    await page.waitForFunction(() => {
      return window.Webflow && window.Webflow.ready;
    }, { timeout: 5000 }).catch(() => console.log('Webflow not ready after 5s'));

    // Try manual dropdown triggering with JavaScript
    const result = await page.evaluate(() => {
      const dropdowns = document.querySelectorAll('.w-dropdown');
      const results = [];

      dropdowns.forEach((dropdown, index) => {
        const toggle = dropdown.querySelector('.w-dropdown-toggle');
        const list = dropdown.querySelector('.w-dropdown-list');

        if (toggle && list) {
          // Simulate mouse enter
          const mouseEnter = new MouseEvent('mouseenter', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          toggle.dispatchEvent(mouseEnter);

          // Check if the dropdown opened
          const isOpen = dropdown.classList.contains('w--open');
          const listDisplay = window.getComputedStyle(list).display;

          results.push({
            index,
            isOpen,
            listDisplay,
            toggleText: toggle.textContent.trim()
          });

          // Simulate mouse leave to clean up
          const mouseLeave = new MouseEvent('mouseleave', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          toggle.dispatchEvent(mouseLeave);
        }
      });

      return results;
    });

    console.log('Manual dropdown triggering results:', JSON.stringify(result, null, 2));

    // Test if at least one dropdown can be opened
    const anyDropdownOpens = result.some(r => r.isOpen || r.listDisplay !== 'none');
    console.log(`At least one dropdown opens: ${anyDropdownOpens}`);
  });

  test('check JavaScript errors and network issues', async ({ page }) => {
    const errors = [];
    const failed = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('requestfailed', request => {
      failed.push(request.url());
    });

    // Navigate and interact
    await page.goto('http://localhost:4321');
    await page.waitForLoadState('networkidle');

    // Try to trigger dropdowns
    const dropdownToggles = page.locator('.w-dropdown-toggle');
    const count = await dropdownToggles.count();

    for (let i = 0; i < count; i++) {
      await dropdownToggles.nth(i).hover();
      await page.waitForTimeout(200);
    }

    console.log('JavaScript errors:', errors.length > 0 ? errors : 'None');
    console.log('Failed requests:', failed.length > 0 ? failed : 'None');

    // Check specific files
    const criticalFiles = [
      '/assets/js/jquery-3.5.1.min.dc5e7f18c8.js',
      '/assets/js/webflow.schunk.6d83011aa4f34449.js',
      '/assets/js/webflow.schunk.1ad200ed633c14bf.js',
      '/assets/js/webflow.schunk.4913f0d9ee368d76.js',
      '/assets/js/webflow.00c81055.72e38c471fcb0085.js'
    ];

    for (const file of criticalFiles) {
      const response = await page.request.get(`http://localhost:4321${file}`);
      console.log(`${file}: ${response.status()}`);
    }
  });
});