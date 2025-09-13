import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('should pass WCAG 2.1 AA standards', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    // Log violations for debugging
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Accessibility violations found:');
      accessibilityScanResults.violations.forEach(violation => {
        console.log(`- ${violation.id}: ${violation.description}`);
        console.log(`  Impact: ${violation.impact}`);
        console.log(`  Affected elements: ${violation.nodes.length}`);
        violation.nodes.forEach(node => {
          console.log(`    - ${node.target.join(' ')}`);
        });
      });
    }
    
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });
  
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');
    
    // Check navigation has aria-label
    const nav = page.locator('nav').first();
    if (await nav.count() > 0) {
      const ariaLabel = await nav.getAttribute('aria-label');
      const role = await nav.getAttribute('role');
      
      expect(ariaLabel || role, 
        'Navigation should have aria-label or role attribute'
      ).toBeTruthy();
    }
    
    // Check main content area
    const main = page.locator('main, [role="main"]').first();
    expect(await main.count(), 
      'Page should have a main content area'
    ).toBeGreaterThan(0);
    
    // Check buttons have accessible text
    const buttons = await page.locator('button, [role="button"]').all();
    
    for (const button of buttons) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const ariaLabelledby = await button.getAttribute('aria-labelledby');
      
      expect(text || ariaLabel || ariaLabelledby,
        'Button should have accessible text'
      ).toBeTruthy();
    }
  });
  
  test('should have proper form labels', async ({ page }) => {
    await page.goto('/');
    
    const inputs = await page.locator('input, textarea, select').all();
    
    for (const input of inputs) {
      const type = await input.getAttribute('type');
      
      // Skip hidden inputs
      if (type === 'hidden') continue;
      
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');
      const placeholder = await input.getAttribute('placeholder');
      
      // Check for associated label
      let hasLabel = false;
      if (id) {
        const label = await page.locator(`label[for="${id}"]`).count();
        hasLabel = label > 0;
      }
      
      // Input should have some form of labeling
      expect(hasLabel || ariaLabel || ariaLabelledby,
        `Form input should have proper labeling (found only placeholder: "${placeholder}")`
      ).toBeTruthy();
      
      // Placeholder alone is not sufficient for accessibility
      if (!hasLabel && !ariaLabel && !ariaLabelledby && placeholder) {
        console.warn(`Input relies only on placeholder for labeling: ${placeholder}`);
      }
    }
  });
  
  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    
    const contrastResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .options({
        rules: {
          'color-contrast': { enabled: true }
        }
      })
      .analyze();
    
    const contrastViolations = contrastResults.violations.filter(v => v.id === 'color-contrast');
    
    if (contrastViolations.length > 0) {
      console.log('Color contrast issues:');
      contrastViolations[0].nodes.forEach(node => {
        console.log(`- ${node.target.join(' ')}`);
      });
    }
    
    expect(contrastViolations).toHaveLength(0);
  });
  
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Check tab order for interactive elements
    const interactiveElements = await page.locator('a, button, input, textarea, select, [tabindex]').all();
    const invalidTabIndex: string[] = [];
    
    for (const element of interactiveElements) {
      const tabindex = await element.getAttribute('tabindex');
      
      // Positive tabindex values should be avoided
      if (tabindex && parseInt(tabindex) > 0) {
        const tagName = await element.evaluate(el => el.tagName);
        const text = await element.textContent();
        invalidTabIndex.push(`${tagName}: "${text}" has tabindex="${tabindex}"`);
      }
    }
    
    if (invalidTabIndex.length > 0) {
      console.warn('Elements with positive tabindex (avoid for proper tab order):', invalidTabIndex);
    }
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
    expect(firstFocused).toBeTruthy();
    
    // Tab through first few elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => ({
        tag: document.activeElement?.tagName,
        visible: document.activeElement ? 
          window.getComputedStyle(document.activeElement).visibility !== 'hidden' : false
      }));
      
      // Focused element should be visible
      if (focused.tag && focused.tag !== 'BODY') {
        expect(focused.visible, 
          `Focused element ${focused.tag} should be visible`
        ).toBeTruthy();
      }
    }
  });
  
  test('should have skip navigation link', async ({ page }) => {
    await page.goto('/');
    
    // Check for skip navigation link (usually hidden but accessible via keyboard)
    const skipLink = await page.locator('a[href="#main"], a[href="#content"], .skip-link, .skip-navigation').first();
    
    if (await skipLink.count() === 0) {
      console.warn('No skip navigation link found - consider adding for keyboard users');
    } else {
      // If skip link exists, check it works
      const href = await skipLink.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        const target = await page.locator(`#${targetId}`).count();
        expect(target, `Skip link target "${href}" not found`).toBeGreaterThan(0);
      }
    }
  });
  
  test('should have proper focus indicators', async ({ page }) => {
    await page.goto('/');
    
    // Check that focus is visible on interactive elements
    const link = page.locator('a').first();
    
    if (await link.count() > 0) {
      await link.focus();
      
      const focusStyle = await link.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          boxShadow: styles.boxShadow,
          border: styles.border
        };
      });
      
      // Should have some visual focus indicator
      const hasVisualFocus = 
        (focusStyle.outline && focusStyle.outline !== 'none') ||
        (focusStyle.boxShadow && focusStyle.boxShadow !== 'none') ||
        (focusStyle.border && focusStyle.border !== 'none');
      
      if (!hasVisualFocus) {
        console.warn('Links may not have visible focus indicators');
      }
    }
  });
  
  test('should have descriptive link text', async ({ page }) => {
    await page.goto('/');
    
    const links = await page.locator('a').all();
    const genericLinkTexts = ['click here', 'here', 'read more', 'more', 'link'];
    const problematicLinks: string[] = [];
    
    for (const link of links) {
      const text = (await link.textContent())?.trim().toLowerCase();
      const ariaLabel = await link.getAttribute('aria-label');
      
      if (text && genericLinkTexts.includes(text) && !ariaLabel) {
        const href = await link.getAttribute('href');
        problematicLinks.push(`"${text}" -> ${href}`);
      }
    }
    
    if (problematicLinks.length > 0) {
      console.warn('Links with generic text (consider more descriptive text):', problematicLinks);
    }
  });
  
  test('should have proper media alternatives', async ({ page }) => {
    await page.goto('/');
    
    // Check videos have captions
    const videos = await page.locator('video').all();
    
    for (const video of videos) {
      const tracks = await video.locator('track[kind="captions"], track[kind="subtitles"]').count();
      
      if (tracks === 0) {
        console.warn('Video element found without captions track');
      }
    }
    
    // Check audio has transcripts
    const audios = await page.locator('audio').all();
    
    if (audios.length > 0) {
      console.log(`Found ${audios.length} audio elements - ensure transcripts are available`);
    }
  });
  
  test('should have proper document structure', async ({ page }) => {
    await page.goto('/');
    
    // Check for landmarks
    const landmarks = {
      header: await page.locator('header, [role="banner"]').count(),
      nav: await page.locator('nav, [role="navigation"]').count(),
      main: await page.locator('main, [role="main"]').count(),
      footer: await page.locator('footer, [role="contentinfo"]').count()
    };
    
    expect(landmarks.header, 'Page should have header landmark').toBeGreaterThan(0);
    expect(landmarks.nav, 'Page should have navigation landmark').toBeGreaterThan(0);
    expect(landmarks.main, 'Page should have main landmark').toBeGreaterThan(0);
    expect(landmarks.footer, 'Page should have footer landmark').toBeGreaterThan(0);
    
    // Check for only one main landmark
    expect(landmarks.main, 'Page should have exactly one main landmark').toBe(1);
  });
});