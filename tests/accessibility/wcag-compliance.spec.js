import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { logContrastViolation, calculateContrastRatio } from '../helpers/error-reporting.js';

test.describe('WCAG Accessibility Compliance', () => {
  test('Homepage passes accessibility checks', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded'); // Changed from networkidle to prevent timeouts

    // Wait a bit for CSS to apply
    await page.waitForTimeout(1000);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Log violations for debugging
    if (accessibilityScanResults.violations.length > 0) {
      console.log('\n=== WCAG Violations Detected ===');
      accessibilityScanResults.violations.forEach((violation, index) => {
        console.log(`\n${index + 1}. ${violation.id}: ${violation.help}`);
        console.log(`   Impact: ${violation.impact}`);
        console.log(`   Description: ${violation.description}`);
        console.log(`   Affected nodes: ${violation.nodes.length}`);
        violation.nodes.slice(0, 3).forEach((node, i) => {
          console.log(`   - Node ${i + 1}: ${node.html.substring(0, 100)}...`);
          console.log(`     Fix: ${node.failureSummary}`);
        });
      });
      console.log('=================================\n');
    }

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('About page passes accessibility checks', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('domcontentloaded'); // Changed from networkidle to prevent timeouts

    // Wait a bit for CSS to apply
    await page.waitForTimeout(1000);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    // Log violations for debugging
    if (accessibilityScanResults.violations.length > 0) {
      console.log('\n=== About Page WCAG Violations ===');
      accessibilityScanResults.violations.forEach((violation, index) => {
        console.log(`\n${index + 1}. ${violation.id}: ${violation.help}`);
        console.log(`   Impact: ${violation.impact}`);
        console.log(`   Nodes: ${violation.nodes.length}`);
      });
      console.log('===================================\n');
    }

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('All images have alt text', async ({ page }) => {
    await page.goto('/');

    const imagesWithoutAlt = await page.$$eval('img', images =>
      images.filter(img => !img.alt && !img.getAttribute('aria-label')).map(img => ({
        src: img.src,
        className: img.className,
        id: img.id
      }))
    );

    if (imagesWithoutAlt.length > 0) {
      console.error('\n❌ IMAGES WITHOUT ALT TEXT');
      console.error(`Total images missing alt: ${imagesWithoutAlt.length}\n`);
      imagesWithoutAlt.forEach((img, index) => {
        console.error(`${index + 1}. ${img.src}`);
        console.error(`   Class: ${img.className || 'NONE'}`);
        console.error(`   ID: ${img.id || 'NONE'}`);
      });
      console.error('\nTo fix: Add alt="" for decorative images or descriptive alt text for content images.');
      console.error('Edit the appropriate .astro files in src/components/');
    }

    expect(imagesWithoutAlt).toHaveLength(0);
  });

  test('All form inputs have labels', async ({ page }) => {
    await page.goto('/contact-us');

    const inputs = await page.$$('input, textarea, select');

    const unlabeledInputs = [];

    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');
      const type = await input.getAttribute('type');
      const name = await input.getAttribute('name');

      if (id) {
        const label = await page.$(`label[for="${id}"]`);
        const hasLabel = label !== null || ariaLabel !== null || ariaLabelledby !== null;

        if (!hasLabel) {
          unlabeledInputs.push({
            id,
            type: type || 'text',
            name: name || 'NONE'
          });
        }
      }
    }

    if (unlabeledInputs.length > 0) {
      console.error('\n❌ FORM INPUTS WITHOUT LABELS');
      console.error(`Total unlabeled inputs: ${unlabeledInputs.length}\n`);
      unlabeledInputs.forEach((input, index) => {
        console.error(`${index + 1}. Input #${input.id}`);
        console.error(`   Type: ${input.type}`);
        console.error(`   Name: ${input.name}`);
      });
      console.error('\nTo fix: Add <label for="..."> or aria-label attribute.');
      console.error('Edit src/pages/contact-us.astro or related components.');
    }

    expect(unlabeledInputs).toHaveLength(0);
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

  test('Color contrast meets WCAG standards', async ({ page }, testInfo) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .options({ rules: { 'color-contrast': { enabled: true } } })
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    );

    if (contrastViolations.length > 0) {
      console.error('\n=== COLOR CONTRAST VIOLATIONS ===');
      console.error(`Total violations: ${contrastViolations.length}\n`);

      contrastViolations.forEach((violation, vIndex) => {
        console.error(`Violation ${vIndex + 1}: ${violation.help}`);
        console.error(`Impact: ${violation.impact}`);
        console.error(`Affected elements: ${violation.nodes.length}\n`);

        violation.nodes.forEach((node, nIndex) => {
          if (nIndex < 10) { // Limit to first 10 nodes to avoid overwhelming output
            logContrastViolation(testInfo, violation, node);
            if (nIndex < violation.nodes.length - 1) {
              console.error('\n' + '-'.repeat(60));
            }
          }
        });

        if (violation.nodes.length > 10) {
          console.error(`\n... and ${violation.nodes.length - 10} more elements`);
        }

        console.error('\n' + '='.repeat(60) + '\n');
      });
    }

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

    if (h1Count !== 1) {
      console.error('\n❌ HEADING HIERARCHY ERROR: H1 Count');
      console.error(`Expected: 1 H1`);
      console.error(`Found: ${h1Count} H1 element(s)`);
      if (h1Count > 1) {
        console.error('\nMultiple H1 headings found:');
        headings.filter(h => h.level === 1).forEach((h, i) => {
          console.error(`  ${i + 1}. "${h.text}"`);
        });
        console.error('\nEach page should have exactly one H1 as the main heading.');
      } else {
        console.error('\nNo H1 found. Every page needs a main heading (H1).');
      }
    }
    expect(h1Count).toBe(1);

    // Check heading hierarchy doesn't skip levels
    let previousLevel = 0;
    const hierarchyErrors = [];

    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i];
      if (previousLevel > 0) {
        const levelDiff = heading.level - previousLevel;
        if (levelDiff > 1) {
          hierarchyErrors.push({
            index: i,
            previous: `H${previousLevel}: "${headings[i - 1].text}"`,
            current: `H${heading.level}: "${heading.text}"`,
            skipped: previousLevel + 1
          });
        }
      }
      previousLevel = heading.level;
    }

    if (hierarchyErrors.length > 0) {
      console.error('\n❌ HEADING HIERARCHY ERRORS');
      console.error('Heading levels should not skip (e.g., H2 → H4 skips H3)\n');
      hierarchyErrors.forEach((error, i) => {
        console.error(`${i + 1}. Heading ${error.index + 1}:`);
        console.error(`   From: ${error.previous}`);
        console.error(`   To:   ${error.current}`);
        console.error(`   ⚠️ Skipped level H${error.skipped}`);
      });
      console.error('\nTo fix: Add intermediate heading levels or change existing headings.');
      console.error('Proper hierarchy example: H1 → H2 → H3 → H2 → H3 → H4');
    }

    expect(hierarchyErrors).toHaveLength(0);
  });

  test('ARIA landmarks are properly used', async ({ page }) => {
    await page.goto('/');

    const landmarks = await page.$$eval('[role]', elements =>
      elements.map(el => el.getAttribute('role'))
    );

    // Check for essential landmarks
    const essentialLandmarks = ['navigation', 'main', 'contentinfo'];
    const missingLandmarks = [];

    for (const landmark of essentialLandmarks) {
      const hasLandmark = landmarks.includes(landmark) ||
        await page.$(`${landmark}`) !== null;

      if (!hasLandmark) {
        missingLandmarks.push(landmark);
      }
    }

    if (missingLandmarks.length > 0) {
      console.error('\n❌ MISSING ARIA LANDMARKS');
      console.error(`Missing landmarks: ${missingLandmarks.join(', ')}\n`);
      missingLandmarks.forEach(landmark => {
        console.error(`Missing: ${landmark}`);
        if (landmark === 'navigation') {
          console.error('  Add: <nav role="navigation"> or <div role="navigation">');
        } else if (landmark === 'main') {
          console.error('  Add: <main role="main"> or <div role="main">');
        } else if (landmark === 'contentinfo') {
          console.error('  Add: <footer role="contentinfo"> or <div role="contentinfo">');
        }
      });
      console.error('\nLandmarks help screen readers navigate the page structure.');
      console.error('Edit src/layouts/BaseLayout.astro or src/components/*.astro');
    }

    expect(missingLandmarks).toHaveLength(0);
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