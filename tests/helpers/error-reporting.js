/**
 * Helper utilities for detailed test error reporting
 *
 * These functions provide comprehensive diagnostics when tests fail,
 * including actual vs expected values, element details, and actionable fixes.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Write diagnostic content to both testInfo.attach() and a dedicated file
 * This ensures diagnostics are available in both HTML reports (local) and CI extraction
 */
function writeDiagnostic(testInfo, name, content) {
  // 1. Attach for HTML reporter (local development)
  testInfo?.attach?.(name, {
    body: content,
    contentType: 'text/plain'
  });

  // 2. Write to file for CI extraction
  if (testInfo?.testId) {
    try {
      const diagnosticsDir = path.join(__dirname, '..', 'test-results', 'diagnostics');
      fs.mkdirSync(diagnosticsDir, { recursive: true });

      const safeTestId = testInfo.testId.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${safeTestId}-${name}.md`;
      const filepath = path.join(diagnosticsDir, filename);

      fs.writeFileSync(filepath, content, 'utf-8');
    } catch (error) {
      // Silently fail - don't break tests if diagnostic file writing fails
      console.warn(`Warning: Could not write diagnostic file: ${error.message}`);
    }
  }

  // 3. Also log to console for immediate feedback
  console.error('\n' + content);
}

/**
 * Log detailed information about image loading failures
 * @param {import('@playwright/test').TestInfo} testInfo - Playwright test info object for attachments
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
export function logImageLoadFailure(testInfo, imageName, details) {
  const errorReport = `
=== IMAGE LOAD FAILURE ===
Image: ${imageName}
Expected URL: ${details.url}
Selector: ${details.selector}
Elements found: ${details.count}
${details.count > 0 ? `
Actual src: ${details.src || 'NOT SET'}
Natural dimensions: ${details.naturalWidth}x${details.naturalHeight}
Load status: ${details.status || 'FAILED'}` : ''}

Possible causes:
1. File missing from _site/assets/images/
2. Incorrect src attribute in HTML
3. Network error (check browser console)
4. CORS policy blocking external image

${details.url ? `To download missing image:
curl -o "_site${details.url}" "https://www.bws.ninja${details.url}"` : ''}
`.trim();

  writeDiagnostic(testInfo, 'image-load-failure', errorReport);
}

/**
 * Log detailed information about CSS not being applied
 * @param {import('@playwright/test').TestInfo} testInfo - Playwright test info object
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
export function logCSSNotApplied(testInfo, elementName, details) {
  const errorReport = `
=== CSS NOT APPLIED / WRONG VALUE ===
Element: ${elementName}
Selector: ${details.selector}
${details.expectedClass ? `
Expected class: ${details.expectedClass}
Has class: ${details.hasClass ? '✅ YES' : '❌ NO'}` : ''}
${details.expectedMaxWidth ? `
Max-width constraint:
  Expected: ${details.expectedMaxWidth}
  Computed: ${details.actualMaxWidth || 'NONE'}${details.inlineMaxWidth ? `
  Inline style: ${details.inlineMaxWidth} (⚠️ May override CSS)` : ''}` : ''}
${details.clientWidth !== undefined ? `
Rendered dimensions:
  Width: ${details.clientWidth}px` : ''}

Visibility:
  display: ${details.display}
  visibility: ${details.visibility}
  opacity: ${details.opacity}

Possible causes:
1. CSS file not loaded (check Network tab)
2. CSS timing issue in headless Chrome (increase waitForTimeout)
3. Inline styles overriding CSS (check HTML for style="...")
4. CSS specificity conflict (another rule winning)
5. Missing !important flag in styles.css

Debugging commands:
grep -n "${details.expectedClass}" public/styles.css
grep -n "max-width.*none" public/styles.css | grep "${details.expectedClass}"
`.trim();

  writeDiagnostic(testInfo, 'css-not-applied', errorReport);
}

/**
 * Log detailed information about 404 errors
 * @param {import('@playwright/test').TestInfo} testInfo - Playwright test info object
 * @param {string} url - URL that returned 404
 * @param {object} context - Context about the request
 * @param {string} context.page - Page where the resource was requested
 * @param {string} context.type - Resource type (image, script, stylesheet, etc.)
 * @param {string} context.referrer - Referrer URL
 * @param {number} context.status - HTTP status code
 */
export function log404Error(testInfo, url, context = {}) {
  const urlObj = new URL(url, 'http://localhost');
  const filePath = urlObj.pathname;

  const errorReport = `
=== 404 ERROR ===
URL: ${url}
Status: ${context.status || 404}
Type: ${context.type || 'unknown'}
${context.page ? `Requested from: ${context.page}` : ''}
${context.referrer ? `Referrer: ${context.referrer}` : ''}

Expected file location:
_site${filePath}

Possible causes:
1. File not copied during build (check astro.config.mjs public assets)
2. Incorrect path in HTML (check src/components/*.astro)
3. URL encoding mismatch (check for %20 vs spaces)
4. File exists but server not serving it (check webServer config)

To download missing resource:
curl -o "_site${filePath}" "https://www.bws.ninja${filePath}"

To verify local file:
ls -lh "_site${filePath}"
file "_site${filePath}"
`.trim();

  writeDiagnostic(testInfo, '404-error', errorReport);
}

/**
 * Log detailed information about WCAG color contrast violations
 * @param {import('@playwright/test').TestInfo} testInfo - Playwright test info object
 * @param {object} violation - Axe-core violation object
 * @param {object} node - Specific node with violation
 * @param {string} node.html - HTML snippet of the element
 * @param {string[]} node.target - CSS selector path to element
 * @param {object} node.any - Violation details
 */
export function logContrastViolation(testInfo, violation, node) {
  let colorDetails = '';
  if (node.any && node.any.length > 0) {
    const data = node.any[0].data;
    if (data) {
      const parts = [];
      if (data.fgColor) parts.push(`Foreground: ${data.fgColor}`);
      if (data.bgColor) parts.push(`Background: ${data.bgColor}`);
      if (data.contrastRatio) parts.push(`Actual ratio: ${data.contrastRatio}:1`);
      if (data.expectedContrastRatio) parts.push(`Required ratio: ${data.expectedContrastRatio}`);
      if (data.fontSize) parts.push(`Font size: ${data.fontSize}`);
      if (data.fontWeight) parts.push(`Font weight: ${data.fontWeight}`);
      if (parts.length > 0) {
        colorDetails = `\nColor details:\n  ${parts.join('\n  ')}`;
      }
    }
  }

  const selector = node.target[0] || '';
  let grepCommand = '';
  if (selector) {
    const match = selector.match(/\.([a-zA-Z0-9_-]+)|#([a-zA-Z0-9_-]+)/);
    if (match) {
      const identifier = match[1] || match[2];
      grepCommand = `\nUseful commands:\ngrep -n "${identifier}" public/styles.css`;
    }
  }

  const errorReport = `
=== WCAG COLOR CONTRAST VIOLATION ===
Rule ID: ${violation.id}
Impact: ${node.impact || violation.impact}
Help: ${violation.help}
Help URL: ${violation.helpUrl}

Element:
${node.html.substring(0, 200)}${node.html.length > 200 ? '...' : ''}

Selector:
${node.target.join(' > ')}
${colorDetails}

How to fix:
1. Find the element in public/styles.css using the selector above
2. Calculate contrast ratio: https://webaim.org/resources/contrastchecker/
3. Adjust foreground or background color to meet WCAG AA:
   - Normal text: 4.5:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
4. Add CSS fix with !important flag if needed
${grepCommand}
`.trim();

  writeDiagnostic(testInfo, 'contrast-violation', errorReport);
}

/**
 * Log detailed information about navigation failures
 * @param {import('@playwright/test').TestInfo} testInfo - Playwright test info object
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
export function logNavigationFailure(testInfo, details) {
  const errorReport = `
=== NAVIGATION FAILURE ===
From: ${details.from}
Expected: ${details.to}
${details.actual ? `Actual: ${details.actual}` : ''}

Link details:
  Selector: ${details.selector}
  Text: ${details.text || 'N/A'}
  href: ${details.href || 'NOT SET'}
  target: ${details.target || 'NOT SET'}
${details.error ? `\nError: ${details.error}` : ''}

Possible causes:
1. Incorrect href attribute in HTML
2. JavaScript redirect interfering
3. Link has target="_blank" (opens in new tab)
4. Page not found (404)
5. Route not configured in Astro

Debugging:
${details.href ? `Check file exists: ls -la "_site${details.href}"` : ''}
Check HTML: grep -r "href=" src/components/Navigation.astro
`.trim();

  writeDiagnostic(testInfo, 'navigation-failure', errorReport);
}

/**
 * Log detailed information about image size constraint violations
 * @param {import('@playwright/test').TestInfo} testInfo - Playwright test info object
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
export function logSizeConstraintViolation(testInfo, imageName, details) {
  const match = details.selector.match(/\.([a-zA-Z0-9_-]+)/);
  const className = match && match[1] ? match[1] : '';

  const errorReport = `
=== IMAGE SIZE CONSTRAINT VIOLATION ===
Image: ${imageName}
Selector: ${details.selector}
Constraint: ${details.constraint}

Expected vs Actual:
  Expected ${details.constraint}: ${details.expected}
  Actual ${details.constraint}: ${details.actual}

Image dimensions:
  Natural: ${details.naturalWidth}x${details.naturalHeight}
  Rendered: ${details.clientWidth}x${details.clientHeight}

Computed styles:
${details.computedMaxWidth ? `  max-width: ${details.computedMaxWidth}` : ''}
${details.computedHeight ? `  height: ${details.computedHeight}` : ''}
${details.objectFit ? `  object-fit: ${details.objectFit}` : ''}

Possible causes:
1. CSS max-width not applied (timing issue in headless Chrome)
2. Inline style overriding CSS
3. Parent container forcing larger size
4. CSS specificity conflict
5. Image aspect ratio causing unexpected dimensions

Debugging:
Check CSS in public/styles.css:
${className ? `  grep -n "${className}" public/styles.css` : ''}
Check for inline styles:
  grep -n "style=" _site/index.html | grep -i "${imageName.toLowerCase()}"
Check for conflicting rules:
  Look for "max-width: none" or "width: 100%" in styles.css
`.trim();

  writeDiagnostic(testInfo, 'size-constraint-violation', errorReport);
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
