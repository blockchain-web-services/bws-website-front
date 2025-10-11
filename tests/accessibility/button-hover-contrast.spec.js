import { test, expect } from '@playwright/test';

test.describe('Button Hover State Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('All button hover states maintain proper contrast', async ({ page }) => {
    // Find all buttons on the page
    const buttons = await page.locator('a.button-primary, a.button-secondary, button.button-primary, button.button-secondary').all();

    console.log(`Found ${buttons.length} buttons to test`);

    const failures = [];

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];

      // Check if button is visible
      const isVisible = await button.isVisible();
      if (!isVisible) continue;

      try {
        // Get button text for reporting
        const buttonText = await button.textContent();

        // Get initial styles
        const initialStyles = await button.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            borderColor: computed.borderColor
          };
        });

        // Hover over the button
        await button.hover();
        await page.waitForTimeout(100); // Wait for hover transition

        // Get hover styles
        const hoverStyles = await button.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            borderColor: computed.borderColor
          };
        });

        // Calculate contrast ratio
        const contrastRatio = await button.evaluate(el => {
          const computed = window.getComputedStyle(el);
          const textColor = computed.color;
          const bgColor = computed.backgroundColor;

          // Parse RGB values
          const parseRGB = (color) => {
            const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (!match) return null;
            return {
              r: parseInt(match[1]),
              g: parseInt(match[2]),
              b: parseInt(match[3])
            };
          };

          const text = parseRGB(textColor);
          const bg = parseRGB(bgColor);

          if (!text || !bg) return null;

          // Calculate relative luminance
          const getLuminance = (rgb) => {
            const sRGB = [rgb.r, rgb.g, rgb.b].map(val => {
              val = val / 255;
              return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
          };

          const textLum = getLuminance(text);
          const bgLum = getLuminance(bg);

          // Calculate contrast ratio
          const lighter = Math.max(textLum, bgLum);
          const darker = Math.min(textLum, bgLum);
          return (lighter + 0.05) / (darker + 0.05);
        });

        // Check for white on white or transparent issues
        const isWhiteOnWhite = hoverStyles.color === 'rgb(255, 255, 255)' &&
                               (hoverStyles.backgroundColor === 'rgb(255, 255, 255)' ||
                                hoverStyles.backgroundColor === 'rgba(0, 0, 0, 0)');

        const isBlackOnBlack = hoverStyles.color === 'rgb(0, 0, 0)' &&
                               hoverStyles.backgroundColor === 'rgb(0, 0, 0)';

        // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
        const requiredRatio = 4.5;

        if (isWhiteOnWhite || isBlackOnBlack) {
          failures.push({
            text: buttonText?.trim() || 'Unknown button',
            issue: isWhiteOnWhite ? 'White text on white/transparent background' : 'Black text on black background',
            hover: hoverStyles
          });
        } else if (contrastRatio && contrastRatio < requiredRatio) {
          failures.push({
            text: buttonText?.trim() || 'Unknown button',
            issue: `Contrast ratio ${contrastRatio.toFixed(2)}:1 (requires ${requiredRatio}:1)`,
            hover: hoverStyles
          });
        }

      } catch (error) {
        console.error(`Error testing button ${i}:`, error);
      }
    }

    // Report failures
    if (failures.length > 0) {
      console.log('\\n❌ Button hover contrast failures found:');
      failures.forEach(f => {
        console.log(`  - "${f.text}": ${f.issue}`);
        console.log(`    Hover styles: color=${f.hover.color}, bg=${f.hover.backgroundColor}`);
      });
    } else {
      console.log('✅ All button hover states have proper contrast');
    }

    // Assert no failures
    expect(failures).toHaveLength(0);
  });

  test('Learn More button hover contrast on homepage', async ({ page }) => {
    // Specifically test the Learn More button mentioned by user
    const learnMoreButton = page.locator('a:has-text("Learn More")').first();

    if (await learnMoreButton.isVisible()) {
      // Get initial state
      const initial = await learnMoreButton.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          background: computed.backgroundColor
        };
      });

      console.log('Learn More button initial state:', initial);

      // Hover and check
      await learnMoreButton.hover();
      await page.waitForTimeout(100);

      const hovered = await learnMoreButton.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          background: computed.backgroundColor
        };
      });

      console.log('Learn More button hover state:', hovered);

      // Check for white on white
      const isProblematic = hovered.color === 'rgb(255, 255, 255)' &&
                           (hovered.background === 'rgb(255, 255, 255)' ||
                            hovered.background === 'rgba(0, 0, 0, 0)');

      expect(isProblematic).toBe(false);
    }
  });
});