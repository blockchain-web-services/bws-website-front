import { test, expect } from '@playwright/test';

test.describe('Content Validation Tests', () => {
  test('should not have placeholder text', async ({ page }) => {
    await page.goto('/');
    
    const bodyText = await page.locator('body').textContent();
    const placeholderPatterns = [
      /lorem ipsum/i,
      /placeholder/i,
      /test content/i,
      /sample text/i,
      /your text here/i,
      /example\.com/i,
      /\[.*?\]/,  // [placeholder] brackets
      /\{.*?\}/,  // {placeholder} braces (but allow template variables)
      /xxx+/i,    // XXX or xxxx
      /todo/i,    // TODO items
      /fixme/i    // FIXME items
    ];
    
    const foundPlaceholders: string[] = [];
    
    for (const pattern of placeholderPatterns) {
      const matches = bodyText?.match(pattern);
      if (matches) {
        // Filter out legitimate uses
        const match = matches[0];
        
        // Allow certain legitimate patterns
        if (match.toLowerCase() === 'example' && bodyText?.includes('For example')) continue;
        if (match === '{}' || match === '[]') continue; // Empty braces/brackets are okay
        
        foundPlaceholders.push(match);
      }
    }
    
    if (foundPlaceholders.length > 0) {
      console.log('Placeholder text found:', foundPlaceholders);
    }
    
    expect(foundPlaceholders).toHaveLength(0);
  });
  
  test('should have meaningful CTA button text', async ({ page }) => {
    await page.goto('/');
    
    const genericButtonTexts = [
      'click here',
      'here',
      'submit',
      'ok',
      'yes',
      'no',
      'cancel'
    ];
    
    const buttons = await page.locator('button, a.btn, [role="button"]').all();
    const problematicButtons: string[] = [];
    
    for (const button of buttons) {
      const text = (await button.textContent())?.trim().toLowerCase();
      
      if (text && genericButtonTexts.includes(text)) {
        const classes = await button.getAttribute('class');
        problematicButtons.push(`"${text}" (class: ${classes})`);
      }
      
      // Check for empty buttons
      if (!text || text === '') {
        const ariaLabel = await button.getAttribute('aria-label');
        if (!ariaLabel) {
          problematicButtons.push('Empty button with no aria-label');
        }
      }
    }
    
    if (problematicButtons.length > 0) {
      console.warn('Buttons with generic or missing text:', problematicButtons);
    }
  });
  
  test('should have proper content length', async ({ page }) => {
    await page.goto('/');
    
    // Check that page has substantial content
    const mainContent = await page.locator('main, .main-content, #content').first();
    const contentText = await mainContent.textContent();
    
    expect(contentText?.length, 
      'Main content should have substantial text'
    ).toBeGreaterThan(100);
    
    // Check paragraphs aren't too short or too long
    const paragraphs = await mainContent.locator('p').all();
    const issues: string[] = [];
    
    for (const p of paragraphs) {
      const text = await p.textContent();
      if (text) {
        const wordCount = text.trim().split(/\s+/).length;
        
        if (wordCount < 3 && text.trim().length > 0) {
          issues.push(`Very short paragraph: "${text.substring(0, 50)}..."`);
        }
        
        if (wordCount > 150) {
          issues.push(`Very long paragraph (${wordCount} words): "${text.substring(0, 50)}..."`);
        }
      }
    }
    
    if (issues.length > 0) {
      console.log('Content length issues:', issues);
    }
  });
  
  test('should not have broken content references', async ({ page }) => {
    await page.goto('/');
    
    // Check for common broken reference patterns
    const brokenPatterns = [
      /\{\{.*?\}\}/,  // Unprocessed template variables
      /\$\{.*?\}/,     // Unprocessed ES6 templates
      /undefined/i,    // Undefined values
      /null/i,         // Null values (in content)
      /\[object Object\]/,  // Stringified objects
      /404|not found/i,     // 404 errors in content
    ];
    
    const contentElements = await page.locator('p, h1, h2, h3, h4, h5, h6, li, td').all();
    const brokenReferences: string[] = [];
    
    for (const element of contentElements) {
      const text = await element.textContent();
      
      if (text) {
        for (const pattern of brokenPatterns) {
          const match = text.match(pattern);
          if (match) {
            // Filter out legitimate uses
            if (match[0].toLowerCase() === 'null' && text.includes('nullable')) continue;
            if (match[0].toLowerCase() === 'undefined' && text.includes('JavaScript')) continue;
            
            brokenReferences.push(`"${match[0]}" in: "${text.substring(0, 100)}..."`);
          }
        }
      }
    }
    
    if (brokenReferences.length > 0) {
      console.log('Potential broken references:', brokenReferences);
    }
  });
  
  test('should have consistent date formats', async ({ page }) => {
    await page.goto('/');
    
    // Find all date-like patterns
    const datePatterns = [
      /\d{1,2}\/\d{1,2}\/\d{2,4}/,  // MM/DD/YYYY or M/D/YY
      /\d{1,2}-\d{1,2}-\d{2,4}/,     // MM-DD-YYYY
      /\d{4}-\d{2}-\d{2}/,            // YYYY-MM-DD
      /\w+ \d{1,2}, \d{4}/,           // Month DD, YYYY
      /\d{1,2} \w+ \d{4}/,            // DD Month YYYY
    ];
    
    const bodyText = await page.locator('body').textContent();
    const foundFormats = new Set<string>();
    
    for (const pattern of datePatterns) {
      const matches = bodyText?.match(new RegExp(pattern, 'g'));
      if (matches) {
        matches.forEach(match => {
          // Determine format type
          if (match.includes('/')) foundFormats.add('slash');
          else if (match.includes('-')) foundFormats.add('dash');
          else if (match.match(/\w+ \d/)) foundFormats.add('month-name');
        });
      }
    }
    
    if (foundFormats.size > 1) {
      console.warn(`Multiple date formats found: ${Array.from(foundFormats).join(', ')}. Consider using consistent format.`);
    }
  });
  
  test('should not have excessive capitalization', async ({ page }) => {
    await page.goto('/');
    
    const textElements = await page.locator('p, h1, h2, h3, h4, h5, h6, a, button').all();
    const excessiveCaps: string[] = [];
    
    for (const element of textElements) {
      const text = await element.textContent();
      
      if (text && text.length > 3) {
        // Check for all caps (excluding short acronyms)
        if (text === text.toUpperCase() && text.length > 5) {
          excessiveCaps.push(`All caps: "${text.substring(0, 50)}"`);
        }
        
        // Check for random capitalization
        const words = text.split(/\s+/);
        const weirdCaps = words.filter(word => {
          if (word.length < 2) return false;
          const hasLower = /[a-z]/.test(word);
          const hasUpper = /[A-Z]/.test(word);
          const startsWithUpper = /^[A-Z]/.test(word);
          
          // Mixed case that's not TitleCase or camelCase
          return hasLower && hasUpper && !startsWithUpper && 
                 !word.match(/^[a-z]+[A-Z][a-zA-Z]*$/); // Not camelCase
        });
        
        if (weirdCaps.length > 0) {
          excessiveCaps.push(`Unusual capitalization: ${weirdCaps.join(', ')}`);
        }
      }
    }
    
    if (excessiveCaps.length > 0) {
      console.log('Capitalization issues:', excessiveCaps);
    }
  });
  
  test('should have proper email and phone formats', async ({ page }) => {
    await page.goto('/');
    
    // Check email links
    const emailLinks = await page.locator('a[href^="mailto:"]').all();
    
    for (const link of emailLinks) {
      const href = await link.getAttribute('href');
      const email = href?.replace('mailto:', '');
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email)) {
        console.warn(`Invalid email format: ${email}`);
      }
    }
    
    // Check phone links
    const phoneLinks = await page.locator('a[href^="tel:"]').all();
    
    for (const link of phoneLinks) {
      const href = await link.getAttribute('href');
      const phone = href?.replace('tel:', '');
      
      // Check for consistent phone format
      if (phone && !phone.match(/^\+?[\d\s\-\(\)]+$/)) {
        console.warn(`Invalid phone format: ${phone}`);
      }
    }
  });
  
  test('should not have console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      consoleErrors.push(error.message);
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out acceptable errors (like third-party scripts)
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('googletagmanager') &&
      !error.includes('gtag') &&
      !error.includes('analytics')
    );
    
    if (criticalErrors.length > 0) {
      console.log('Console errors:', criticalErrors);
    }
    
    expect(criticalErrors).toHaveLength(0);
  });
  
  test('should have consistent currency symbols', async ({ page }) => {
    await page.goto('/');
    
    const bodyText = await page.locator('body').textContent();
    
    // Find all currency patterns
    const currencyPatterns = [
      /\$[\d,]+\.?\d*/g,     // $100 or $100.00
      /€[\d,]+\.?\d*/g,      // €100
      /£[\d,]+\.?\d*/g,      // £100
      /[\d,]+\.?\d*\s*(USD|EUR|GBP)/g,  // 100 USD
    ];
    
    const foundCurrencies = new Set<string>();
    
    for (const pattern of currencyPatterns) {
      const matches = bodyText?.match(pattern);
      if (matches) {
        matches.forEach(match => {
          if (match.includes('$')) foundCurrencies.add('USD');
          else if (match.includes('€')) foundCurrencies.add('EUR');
          else if (match.includes('£')) foundCurrencies.add('GBP');
          else if (match.includes('USD')) foundCurrencies.add('USD');
          else if (match.includes('EUR')) foundCurrencies.add('EUR');
          else if (match.includes('GBP')) foundCurrencies.add('GBP');
        });
      }
    }
    
    if (foundCurrencies.size > 1) {
      console.log(`Multiple currencies found: ${Array.from(foundCurrencies).join(', ')}. Ensure this is intentional.`);
    }
  });
});