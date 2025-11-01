import { test, expect } from '@playwright/test';

test.describe('Core Web Vitals Tests', () => {
  test('Measure Largest Contentful Paint (LCP)', async ({ page }) => {
    await page.goto('/');

    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      });
    });

    // LCP should be under 2.5s for good performance
    expect(Number(lcp)).toBeLessThan(2500);
  });

  test('Measure First Input Delay (FID)', async ({ page }) => {
    await page.goto('/');

    // Simulate user interaction
    await page.click('body');

    const fid = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            resolve(entries[0].processingStart - entries[0].startTime);
          }
        }).observe({ type: 'first-input', buffered: true });

        // Fallback if no input detected
        setTimeout(() => resolve(0), 1000);
      });
    });

    // FID should be under 100ms for good performance
    expect(Number(fid)).toBeLessThan(100);
  });

  test('Measure Cumulative Layout Shift (CLS)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsScore = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsScore += entry.value;
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });

        setTimeout(() => resolve(clsScore), 3000);
      });
    });

    // CLS should be under 0.1 for good performance
    expect(Number(cls)).toBeLessThan(0.1);
  });

  test('Page load performance metrics', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const performanceMetrics = await page.evaluate(() => {
      const timing = performance.timing;
      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
      };
    });

    // Performance thresholds
    expect(performanceMetrics.domContentLoaded).toBeLessThan(3000);
    expect(performanceMetrics.loadComplete).toBeLessThan(5000);
    expect(performanceMetrics.firstContentfulPaint).toBeLessThan(1800);
  });

  test('Resource loading performance', async ({ page }) => {
    const resourceTimings = [];

    page.on('response', async response => {
      const url = response.url();
      const timing = await response.request().timing();
      if (timing) {
        resourceTimings.push({
          url: url.substring(url.lastIndexOf('/') + 1),
          duration: timing.responseEnd || 0
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for slow resources (over 1 second)
    const slowResources = resourceTimings.filter(r => r.duration > 1000);
    expect(slowResources.length).toBe(0);
  });

  test('Bundle size check', async ({ page }) => {
    const bundleSizes = {};

    page.on('response', async response => {
      const url = response.url();
      if (url.endsWith('.js') || url.endsWith('.css')) {
        const size = Number(response.headers()['content-length'] || 0);
        const filename = url.substring(url.lastIndexOf('/') + 1);
        bundleSizes[filename] = size;
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check total bundle size
    const totalSize = Object.values(bundleSizes).reduce((a, b) => a + b, 0);
    const totalSizeMB = totalSize / (1024 * 1024);

    // Total JS/CSS should be under 2MB
    expect(totalSizeMB).toBeLessThan(2);
  });
});