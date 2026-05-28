# Test Failure Report

**Generated:** 2025-12-10 18:14:45 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/20108295484)
**Commit:** c69e6cc67f5f9f6d57b7381c969613d9780241ce
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 417
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 1001343.2069999999ms

### Failed Tests

## Test Output Extract
```
  ✘  275 [chromium] › test-articles.spec.js:121:3 › Articles Pages › Article pages have no 404 image errors (1.5m)
  ✘  276 [chromium] › test-articles.spec.js:121:3 › Articles Pages › Article pages have no 404 image errors (retry #1) (1.6m)
  ✘  296 [chromium] › test-articles.spec.js:121:3 › Articles Pages › Article pages have no 404 image errors (retry #2) (1.5m)
    Error: page.waitForTimeout: Test timeout of 90000ms exceeded.
    Error: page.goto: Test timeout of 90000ms exceeded.
    Error: page.waitForTimeout: Test timeout of 90000ms exceeded.
  ✘  304 [chromium] › visual/snapshots.spec.js:58:7 › Visual Snapshots for All Pages › contact-us - iphone-se (1.0m)
    TimeoutError: page.waitForLoadState: Timeout 60000ms exceeded.
  ✘  305 [chromium] › test-articles.spec.js:181:3 › Articles Pages › Article images are visible and properly loaded (1.5m)
  ✘  317 [chromium] › test-articles.spec.js:181:3 › Articles Pages › Article images are visible and properly loaded (retry #1) (1.7m)
  ✘  350 [chromium] › test-articles.spec.js:181:3 › Articles Pages › Article images are visible and properly loaded (retry #2) (1.5m)
    Error: page.waitForTimeout: Test timeout of 90000ms exceeded.
    Error: page.waitForTimeout: Test timeout of 90000ms exceeded.
    Error: locator.evaluate: Test timeout of 90000ms exceeded.
  ✘  382 [chromium] › test-articles.spec.js:236:3 › Articles Pages › Article images have descriptive captions (2.5s)
  ✘  384 [chromium] › test-articles.spec.js:236:3 › Articles Pages › Article images have descriptive captions (retry #1) (4.6s)
  ✘  386 [chromium] › test-articles.spec.js:236:3 › Articles Pages › Article images have descriptive captions (retry #2) (3.0s)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: page.waitForTimeout: Test timeout of 90000ms exceeded.
    Error: page.goto: Test timeout of 90000ms exceeded.
    Error: page.waitForTimeout: Test timeout of 90000ms exceeded.
    Error: page.waitForTimeout: Test timeout of 90000ms exceeded.
    Error: page.waitForTimeout: Test timeout of 90000ms exceeded.
    Error: locator.evaluate: Test timeout of 90000ms exceeded.
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    TimeoutError: page.waitForLoadState: Timeout 60000ms exceeded.
```
