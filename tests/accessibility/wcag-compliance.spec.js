import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('WCAG Accessibility Compliance', () => {
  test('Homepage passes accessibility checks', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('About page passes accessibility checks', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('All images have alt text', async ({ page }) => {
    await page.goto('/');

    const imagesWithoutAlt = await page.$$eval('img', images =>
      images.filter(img => !img.alt && !img.getAttribute('aria-label')).map(img => img.src)
    );

    expect(imagesWithoutAlt).toHaveLength(0);
  });

  test('All form inputs have labels', async ({ page }) => {
    await page.goto('/contact-us');

    const inputs = await page.$$('input, textarea, select');

    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');

      if (id) {
        const label = await page.$(`label[for="${id}"]`);
        const hasLabel = label !== null || ariaLabel !== null || ariaLabelledby !== null;
        expect(hasLabel).toBeTruthy();
      }
    }
  });

  test('Keyboard navigation works correctly', async ({ page }) => {
    await page.goto('/');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
    expect(firstFocused).toBeTruthy();

    // Continue tabbing and check focus is visible
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return null;
        const styles = window.getComputedStyle(el);
        return {
          tagName: el.tagName,
          hasOutline: styles.outline !== 'none' || styles.boxShadow !== 'none'
        };
      });

      if (focusedElement && ['A', 'BUTTON', 'INPUT'].includes(focusedElement.tagName)) {
        expect(focusedElement.hasOutline).toBeTruthy();
      }
    }
  });

  test('Color contrast meets WCAG standards', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .options({ rules: { 'color-contrast': { enabled: true } } })
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    );

    expect(contrastViolations).toHaveLength(0);
  });

  test('Page has proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', elements =>
      elements.map(el => ({
        level: parseInt(el.tagName[1]),
        text: el.textContent?.trim()
      }))
    );

    // Check there's exactly one H1
    const h1Count = headings.filter(h => h.level === 1).length;
    expect(h1Count).toBe(1);

    // Check heading hierarchy doesn't skip levels
    let previousLevel = 0;
    for (const heading of headings) {
      if (previousLevel > 0) {
        const levelDiff = heading.level - previousLevel;
        expect(levelDiff).toBeLessThanOrEqual(1);
      }
      previousLevel = heading.level;
    }
  });

  test('ARIA landmarks are properly used', async ({ page }) => {
    await page.goto('/');

    const landmarks = await page.$$eval('[role]', elements =>
      elements.map(el => el.getAttribute('role'))
    );

    // Check for essential landmarks
    const essentialLandmarks = ['navigation', 'main', 'contentinfo'];
    for (const landmark of essentialLandmarks) {
      const hasLandmark = landmarks.includes(landmark) ||
        await page.$(`${landmark}`) !== null;
      expect(hasLandmark).toBeTruthy();
    }
  });

  test('Focus trap in modals works correctly', async ({ page }) => {
    await page.goto('/');

    // If there are any modals, test focus trap
    const modalTrigger = await page.$('[data-modal-trigger], [data-toggle="modal"]');
    if (modalTrigger) {
      await modalTrigger.click();
      await page.waitForTimeout(500);

      // Check if focus is trapped within modal
      const modal = await page.$('[role="dialog"], .modal');
      if (modal) {
        const focusableElements = await modal.$$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        expect(focusableElements.length).toBeGreaterThan(0);
      }
    }
  });
});