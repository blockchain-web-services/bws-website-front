/**
 * Helper utilities for detailed test error reporting
 *
 * These functions provide comprehensive diagnostics when tests fail,
 * including actual vs expected values, element details, and actionable fixes.
 */

/**
 * Log detailed information about image loading failures
 * @param {string} imageName - Name of the image (e.g., "PROOF Logo")
 * @param {object} details - Details about the failure
 * @param {string} details.url - Expected image URL
 * @param {string} details.selector - CSS selector used to find image
 * @param {number} details.count - Number of matching elements found
 * @param {number} details.naturalWidth - Natural width of image (0 if not loaded)
 * @param {number} details.naturalHeight - Natural height of image (0 if not loaded)
 * @param {string} details.src - Actual src attribute from HTML
 * @param {string} details.status - Load status or error message
 */
export function logImageLoadFailure(imageName, details) {
  console.error('\n=== IMAGE LOAD FAILURE ===');
  console.error(`Image: ${imageName}`);
  console.error(`Expected URL: ${details.url}`);
  console.error(`Selector: ${details.selector}`);
  console.error(`Elements found: ${details.count}`);

  if (details.count > 0) {
    console.error(`Actual src: ${details.src || 'NOT SET'}`);
    console.error(`Natural dimensions: ${details.naturalWidth}x${details.naturalHeight}`);
    console.error(`Load status: ${details.status || 'FAILED'}`);
  }

  console.error('\nPossible causes:');
  console.error('1. File missing from _site/assets/images/');
  console.error('2. Incorrect src attribute in HTML');
  console.error('3. Network error (check browser console)');
  console.error('4. CORS policy blocking external image');

  if (details.url) {
    console.error('\nTo download missing image:');
    console.error(`curl -o "_site${details.url}" "https://www.bws.ninja${details.url}"`);
  }
}

/**
 * Log detailed information about CSS not being applied
 * @param {string} elementName - Name of the element (e.g., "PROOF Logo")
 * @param {object} details - Details about the CSS issue
 * @param {string} details.selector - CSS selector for the element
 * @param {string} details.expectedClass - Expected CSS class name
 * @param {boolean} details.hasClass - Whether element has the expected class
 * @param {string} details.expectedMaxWidth - Expected max-width value
 * @param {string} details.actualMaxWidth - Actual computed max-width
 * @param {string} details.inlineMaxWidth - Inline style max-width (if any)
 * @param {number} details.clientWidth - Actual rendered width
 * @param {string} details.display - Computed display value
 * @param {string} details.visibility - Computed visibility value
 * @param {string} details.opacity - Computed opacity value
 */
export function logCSSNotApplied(elementName, details) {
  console.error('\n=== CSS NOT APPLIED / WRONG VALUE ===');
  console.error(`Element: ${elementName}`);
  console.error(`Selector: ${details.selector}`);

  if (details.expectedClass) {
    console.error(`Expected class: ${details.expectedClass}`);
    console.error(`Has class: ${details.hasClass ? '✅ YES' : '❌ NO'}`);
  }

  if (details.expectedMaxWidth) {
    console.error(`\nMax-width constraint:`);
    console.error(`  Expected: ${details.expectedMaxWidth}`);
    console.error(`  Computed: ${details.actualMaxWidth || 'NONE'}`);
    if (details.inlineMaxWidth) {
      console.error(`  Inline style: ${details.inlineMaxWidth} (⚠️ May override CSS)`);
    }
  }

  if (details.clientWidth !== undefined) {
    console.error(`\nRendered dimensions:`);
    console.error(`  Width: ${details.clientWidth}px`);
  }

  console.error(`\nVisibility:`);
  console.error(`  display: ${details.display}`);
  console.error(`  visibility: ${details.visibility}`);
  console.error(`  opacity: ${details.opacity}`);

  console.error('\nPossible causes:');
  console.error('1. CSS file not loaded (check Network tab)');
  console.error('2. CSS timing issue in headless Chrome (increase waitForTimeout)');
  console.error('3. Inline styles overriding CSS (check HTML for style="...")');
  console.error('4. CSS specificity conflict (another rule winning)');
  console.error('5. Missing !important flag in styles.css');

  console.error('\nDebugging commands:');
  console.error(`grep -n "${details.expectedClass}" public/styles.css`);
  console.error(`grep -n "max-width.*none" public/styles.css | grep "${details.expectedClass}"`);
}

/**
 * Log detailed information about 404 errors
 * @param {string} url - URL that returned 404
 * @param {object} context - Context about the request
 * @param {string} context.page - Page where the resource was requested
 * @param {string} context.type - Resource type (image, script, stylesheet, etc.)
 * @param {string} context.referrer - Referrer URL
 * @param {number} context.status - HTTP status code
 */
export function log404Error(url, context = {}) {
  console.error('\n=== 404 ERROR ===');
  console.error(`URL: ${url}`);
  console.error(`Status: ${context.status || 404}`);
  console.error(`Type: ${context.type || 'unknown'}`);

  if (context.page) {
    console.error(`Requested from: ${context.page}`);
  }

  if (context.referrer) {
    console.error(`Referrer: ${context.referrer}`);
  }

  // Extract file path from URL
  const urlObj = new URL(url, 'http://localhost');
  const filePath = urlObj.pathname;

  console.error('\nExpected file location:');
  console.error(`_site${filePath}`);

  console.error('\nPossible causes:');
  console.error('1. File not copied during build (check astro.config.mjs public assets)');
  console.error('2. Incorrect path in HTML (check src/components/*.astro)');
  console.error('3. URL encoding mismatch (check for %20 vs spaces)');
  console.error('4. File exists but server not serving it (check webServer config)');

  console.error('\nTo download missing resource:');
  console.error(`curl -o "_site${filePath}" "https://www.bws.ninja${filePath}"`);

  console.error('\nTo verify local file:');
  console.error(`ls -lh "_site${filePath}"`);
  console.error(`file "_site${filePath}"`);
}

/**
 * Log detailed information about WCAG color contrast violations
 * @param {object} violation - Axe-core violation object
 * @param {object} node - Specific node with violation
 * @param {string} node.html - HTML snippet of the element
 * @param {string[]} node.target - CSS selector path to element
 * @param {object} node.any - Violation details
 */
export function logContrastViolation(violation, node) {
  console.error('\n=== WCAG COLOR CONTRAST VIOLATION ===');
  console.error(`Rule ID: ${violation.id}`);
  console.error(`Impact: ${node.impact || violation.impact}`);
  console.error(`Help: ${violation.help}`);
  console.error(`Help URL: ${violation.helpUrl}`);

  console.error('\nElement:');
  console.error(`${node.html.substring(0, 200)}${node.html.length > 200 ? '...' : ''}`);

  console.error('\nSelector:');
  console.error(`${node.target.join(' > ')}`);

  // Try to extract color information from the node
  if (node.any && node.any.length > 0) {
    const data = node.any[0].data;
    if (data) {
      console.error('\nColor details:');
      if (data.fgColor) console.error(`  Foreground: ${data.fgColor}`);
      if (data.bgColor) console.error(`  Background: ${data.bgColor}`);
      if (data.contrastRatio) {
        console.error(`  Actual ratio: ${data.contrastRatio}:1`);
      }
      if (data.expectedContrastRatio) {
        console.error(`  Required ratio: ${data.expectedContrastRatio}`);
      }
      if (data.fontSize) console.error(`  Font size: ${data.fontSize}`);
      if (data.fontWeight) console.error(`  Font weight: ${data.fontWeight}`);
    }
  }

  console.error('\nHow to fix:');
  console.error('1. Find the element in public/styles.css using the selector above');
  console.error('2. Calculate contrast ratio: https://webaim.org/resources/contrastchecker/');
  console.error('3. Adjust foreground or background color to meet WCAG AA:');
  console.error('   - Normal text: 4.5:1 minimum');
  console.error('   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum');
  console.error('4. Add CSS fix with !important flag if needed');

  console.error('\nUseful commands:');
  const selector = node.target[0] || '';
  if (selector) {
    // Extract class or ID from selector
    const match = selector.match(/\.([a-zA-Z0-9_-]+)|#([a-zA-Z0-9_-]+)/);
    if (match) {
      const identifier = match[1] || match[2];
      console.error(`grep -n "${identifier}" public/styles.css`);
    }
  }
}

/**
 * Log detailed information about navigation failures
 * @param {object} details - Details about the navigation failure
 * @param {string} details.from - Starting page/URL
 * @param {string} details.to - Expected destination URL
 * @param {string} details.actual - Actual destination URL (if different)
 * @param {string} details.selector - Selector for the link/button clicked
 * @param {string} details.text - Link text
 * @param {string} details.href - href attribute value
 * @param {string} details.target - target attribute value
 * @param {string} details.error - Error message or reason for failure
 */
export function logNavigationFailure(details) {
  console.error('\n=== NAVIGATION FAILURE ===');
  console.error(`From: ${details.from}`);
  console.error(`Expected: ${details.to}`);

  if (details.actual) {
    console.error(`Actual: ${details.actual}`);
  }

  console.error('\nLink details:');
  console.error(`  Selector: ${details.selector}`);
  console.error(`  Text: ${details.text || 'N/A'}`);
  console.error(`  href: ${details.href || 'NOT SET'}`);
  console.error(`  target: ${details.target || 'NOT SET'}`);

  if (details.error) {
    console.error(`\nError: ${details.error}`);
  }

  console.error('\nPossible causes:');
  console.error('1. Incorrect href attribute in HTML');
  console.error('2. JavaScript redirect interfering');
  console.error('3. Link has target="_blank" (opens in new tab)');
  console.error('4. Page not found (404)');
  console.error('5. Route not configured in Astro');

  console.error('\nDebugging:');
  if (details.href) {
    console.error(`Check file exists: ls -la "_site${details.href}"`);
  }
  console.error('Check HTML: grep -r "href=" src/components/Navigation.astro');
}

/**
 * Log detailed information about image size constraint violations
 * @param {string} imageName - Name of the image
 * @param {object} details - Details about the size violation
 * @param {string} details.selector - CSS selector for the image
 * @param {string} details.constraint - Type of constraint (maxWidth, height, etc.)
 * @param {string} details.expected - Expected value
 * @param {string} details.actual - Actual computed value
 * @param {number} details.clientWidth - Rendered width
 * @param {number} details.clientHeight - Rendered height
 * @param {number} details.naturalWidth - Natural image width
 * @param {number} details.naturalHeight - Natural image height
 * @param {string} details.computedMaxWidth - Computed max-width
 * @param {string} details.computedHeight - Computed height
 * @param {string} details.objectFit - Computed object-fit value
 */
export function logSizeConstraintViolation(imageName, details) {
  console.error('\n=== IMAGE SIZE CONSTRAINT VIOLATION ===');
  console.error(`Image: ${imageName}`);
  console.error(`Selector: ${details.selector}`);
  console.error(`Constraint: ${details.constraint}`);

  console.error('\nExpected vs Actual:');
  console.error(`  Expected ${details.constraint}: ${details.expected}`);
  console.error(`  Actual ${details.constraint}: ${details.actual}`);

  console.error('\nImage dimensions:');
  console.error(`  Natural: ${details.naturalWidth}x${details.naturalHeight}`);
  console.error(`  Rendered: ${details.clientWidth}x${details.clientHeight}`);

  console.error('\nComputed styles:');
  if (details.computedMaxWidth) {
    console.error(`  max-width: ${details.computedMaxWidth}`);
  }
  if (details.computedHeight) {
    console.error(`  height: ${details.computedHeight}`);
  }
  if (details.objectFit) {
    console.error(`  object-fit: ${details.objectFit}`);
  }

  console.error('\nPossible causes:');
  console.error('1. CSS max-width not applied (timing issue in headless Chrome)');
  console.error('2. Inline style overriding CSS');
  console.error('3. Parent container forcing larger size');
  console.error('4. CSS specificity conflict');
  console.error('5. Image aspect ratio causing unexpected dimensions');

  console.error('\nDebugging:');
  console.error('Check CSS in public/styles.css:');
  const match = details.selector.match(/\.([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    console.error(`  grep -n "${match[1]}" public/styles.css`);
  }
  console.error('Check for inline styles:');
  console.error(`  grep -n "style=" _site/index.html | grep -i "${imageName.toLowerCase()}"`);
  console.error('Check for conflicting rules:');
  console.error('  Look for "max-width: none" or "width: 100%" in styles.css');
}

/**
 * Format bytes to human-readable size
 * @param {number} bytes - Number of bytes
 * @returns {string} Formatted size
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Calculate color contrast ratio between two colors
 * @param {string} fg - Foreground color (hex)
 * @param {string} bg - Background color (hex)
 * @returns {number} Contrast ratio
 */
export function calculateContrastRatio(fg, bg) {
  const getLuminance = (hex) => {
    const rgb = parseInt(hex.replace('#', ''), 16);
    const r = ((rgb >> 16) & 0xff) / 255;
    const g = ((rgb >> 8) & 0xff) / 255;
    const b = ((rgb >> 0) & 0xff) / 255;

    const [rs, gs, bs] = [r, g, b].map(c =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(fg);
  const l2 = getLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}
