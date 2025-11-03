import { Page } from '@playwright/test';

/**
 * Wait for all images on the page to load
 */
export async function waitForImages(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images.every(img => img.complete && img.naturalHeight !== 0);
  });
}

/**
 * Get performance metrics from the page
 */
export async function getPerformanceMetrics(page: Page) {
  return await page.evaluate(() => {
    const timing = performance.timing;
    const paintMetrics = performance.getEntriesByType('paint');

    return {
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      loadComplete: timing.loadEventEnd - timing.navigationStart,
      firstPaint: paintMetrics.find(m => m.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paintMetrics.find(m => m.name === 'first-contentful-paint')?.startTime || 0,
    };
  });
}

/**
 * Check if element is in viewport
 */
export async function isInViewport(page: Page, selector: string): Promise<boolean> {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }, selector);
}

/**
 * Scroll element into view and wait
 */
export async function scrollIntoView(page: Page, selector: string): Promise<void> {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.waitForTimeout(500); // Wait for scroll animation
}

/**
 * Take a full page screenshot with timestamp
 */
export async function takeFullPageScreenshot(page: Page, name: string): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({
    path: `tests/screenshots/${name}-${timestamp}.png`,
    fullPage: true
  });
}

/**
 * Check for broken links on the page
 */
export async function checkBrokenLinks(page: Page): Promise<string[]> {
  const brokenLinks: string[] = [];

  const links = await page.$$eval('a[href]', anchors =>
    anchors.map(a => a.getAttribute('href')).filter(href => href && !href.startsWith('#'))
  );

  for (const link of links) {
    if (link) {
      try {
        const response = await page.request.get(link);
        if (response.status() >= 400) {
          brokenLinks.push(`${link} - Status: ${response.status()}`);
        }
      } catch (error) {
        brokenLinks.push(`${link} - Error: ${error}`);
      }
    }
  }

  return brokenLinks;
}

/**
 * Get all console messages of a specific type
 */
export function collectConsoleMessages(page: Page, type: 'error' | 'warning' | 'log' = 'error'): string[] {
  const messages: string[] = [];

  page.on('console', msg => {
    if (msg.type() === type) {
      messages.push(msg.text());
    }
  });

  return messages;
}

/**
 * Mock API responses
 */
export async function mockAPIResponse(page: Page, url: string, response: any): Promise<void> {
  await page.route(url, route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response)
    });
  });
}

/**
 * Generate random test data
 */
export function generateTestData() {
  return {
    email: `test-${Date.now()}@example.com`,
    name: `Test User ${Date.now()}`,
    message: `Test message generated at ${new Date().toISOString()}`
  };
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError;
}