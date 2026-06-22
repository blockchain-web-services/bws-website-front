# Test Failure Report

**Generated:** 2026-04-21 16:22:30 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/24733344008)
**Commit:** 6f0765f21308dbebea043a245e295622b6c9b616
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 225
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 386929.08499999996ms

### Failed Tests

## Test Output Extract
```
  ✘   26 [chromium] › image-validation.spec.js:255:3 › Image Visibility on Live Page › All critical images are visible and properly sized (4.6s)
  ✘   28 [chromium] › image-validation.spec.js:255:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #1) (5.4s)
  ✘   34 [chromium] › image-validation.spec.js:255:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (4.7s)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
  ✘   97 [chromium] › tests/carousel-debug.spec.js:4:3 › Carousel Debug › check carousel cards size and buttons (33.7s)
  ✘  106 [chromium] › tests/carousel-debug.spec.js:4:3 › Carousel Debug › check carousel cards size and buttons (retry #1) (34.6s)
  ✘  107 [chromium] › tests/carousel-debug.spec.js:4:3 › Carousel Debug › check carousel cards size and buttons (retry #2) (33.5s)
    TimeoutError: locator.scrollIntoViewIfNeeded: Timeout 30000ms exceeded.
    TimeoutError: locator.scrollIntoViewIfNeeded: Timeout 30000ms exceeded.
    TimeoutError: locator.scrollIntoViewIfNeeded: Timeout 30000ms exceeded.
  ✘  120 [chromium] › visual/images.spec.js:32:3 › Image Visual Tests › Tokenomics image loads and displays correctly (3.4s)
  ✘  121 [chromium] › visual/images.spec.js:32:3 › Image Visual Tests › Tokenomics image loads and displays correctly (retry #1) (4.3s)
  ✘  122 [chromium] › visual/images.spec.js:32:3 › Image Visual Tests › Tokenomics image loads and displays correctly (retry #2) (3.5s)
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    TimeoutError: locator.scrollIntoViewIfNeeded: Timeout 30000ms exceeded.
    TimeoutError: locator.scrollIntoViewIfNeeded: Timeout 30000ms exceeded.
    TimeoutError: locator.scrollIntoViewIfNeeded: Timeout 30000ms exceeded.
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```
