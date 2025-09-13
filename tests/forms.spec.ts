import { test, expect } from '@playwright/test';

test.describe('Forms and Contact Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should check for Zapier form integrations', async ({ page }) => {
    // Look for forms that might have Zapier webhooks
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      for (let i = 0; i < formCount; i++) {
        const form = forms.nth(i);
        const action = await form.getAttribute('action');
        
        // Check if form has Zapier webhook URL
        if (action && action.includes('zapier')) {
          // Verify form has required fields
          const inputs = form.locator('input[required], textarea[required]');
          const inputCount = await inputs.count();
          expect(inputCount).toBeGreaterThan(0);
          
          // Check for submit button
          const submitButton = form.locator('button[type="submit"], input[type="submit"]');
          await expect(submitButton).toHaveCount(1);
        }
      }
    }
  });

  test('should not have Pipedrive integration', async ({ page }) => {
    // Ensure no Pipedrive scripts or references
    const pageContent = await page.content();
    
    expect(pageContent.toLowerCase()).not.toContain('pipedrive');
    expect(pageContent.toLowerCase()).not.toContain('leadbooster');
    
    // Check for Pipedrive-specific scripts
    const pipedriveScripts = page.locator('script[src*="pipedrive"]');
    await expect(pipedriveScripts).toHaveCount(0);
  });

  test('should validate form accessibility', async ({ page }) => {
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      for (let i = 0; i < formCount; i++) {
        const form = forms.nth(i);
        
        // Check if form inputs have labels or aria-labels
        const inputs = form.locator('input, textarea, select');
        const inputCount = await inputs.count();
        
        for (let j = 0; j < inputCount; j++) {
          const input = inputs.nth(j);
          const inputId = await input.getAttribute('id');
          const ariaLabel = await input.getAttribute('aria-label');
          const placeholder = await input.getAttribute('placeholder');
          
          // Input should have either a label, aria-label, or placeholder
          const hasAccessibility = inputId || ariaLabel || placeholder;
          expect(hasAccessibility).toBeTruthy();
        }
      }
    }
  });

  test('should handle form submission gracefully', async ({ page }) => {
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      // Check that forms have proper validation
      const form = forms.first();
      const submitButton = form.locator('button[type="submit"], input[type="submit"]');
      
      if (await submitButton.count() > 0) {
        // Check form has method and action
        const method = await form.getAttribute('method');
        const action = await form.getAttribute('action');
        
        expect(method).toBeTruthy();
        expect(action).toBeTruthy();
      }
    }
  });
});