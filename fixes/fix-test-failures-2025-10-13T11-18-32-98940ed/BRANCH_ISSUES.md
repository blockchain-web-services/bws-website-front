# Test Failure Report

**Generated:** 2025-10-13 11:18:18 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18463709653)
**Commit:** 98940ed78ef1cc7263a8f9f90d7fb0abdcb3b022
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 143
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 706099.974ms

### Failed Tests

## Test Output Extract
```
  ✘   12 [chromium] › assets.spec.js:25:3 › Asset Verification Tests › AssureDefi image size check (8.3s)
  ✘   16 [chromium] › assets.spec.js:25:3 › Asset Verification Tests › AssureDefi image size check (retry #1) (10.6s)
  ✘   21 [chromium] › assets.spec.js:25:3 › Asset Verification Tests › AssureDefi image size check (retry #2) (8.0s)
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
  ✘   29 [chromium] › image-validation.spec.js:274:3 › Image Visibility on Live Page › All critical images are visible and properly sized (10.3s)
  ✘   32 [chromium] › image-validation.spec.js:274:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #1) (12.0s)
  ✘   33 [chromium] › image-validation.spec.js:274:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (9.6s)
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
  ✘   31 [chromium] › image-validation.spec.js:506:3 › Image Visibility on Live Page › Take screenshots for visual verification (35.8s)
  ✘   34 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (14.5s)
  ✘   36 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (retry #1) (17.4s)
  ✘   37 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (retry #2) (15.2s)
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
  ✘   35 [chromium] › image-validation.spec.js:506:3 › Image Visibility on Live Page › Take screenshots for visual verification (retry #1) (40.5s)
  ✘   38 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (15.4s)
  ✘   40 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (retry #1) (16.9s)
  ✘   39 [chromium] › image-validation.spec.js:506:3 › Image Visibility on Live Page › Take screenshots for visual verification (retry #2) (37.2s)
    TimeoutError: locator.screenshot: Timeout 29965.655ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29918.859999999986ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29961.5ms exceeded.
  ✘   41 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (retry #2) (14.6s)
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
  ✘   47 [chromium] › image-visibility.spec.js:5:3 › Image Visibility Tests › Check AssureDefi image is visible and loads correctly (3.0s)
  ✘   48 [chromium] › image-visibility.spec.js:5:3 › Image Visibility Tests › Check AssureDefi image is visible and loads correctly (retry #1) (5.0s)
  ✘   49 [chromium] › image-visibility.spec.js:5:3 › Image Visibility Tests › Check AssureDefi image is visible and loads correctly (retry #2) (3.1s)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
  ✘   45 [chromium] › image-visibility-index.spec.js:294:3 › Image Visibility on Index Page › Visual regression test - take screenshots (37.6s)
  ✘   55 [chromium] › image-visibility-index.spec.js:294:3 › Image Visibility on Index Page › Visual regression test - take screenshots (retry #1) (40.2s)
  ✘   76 [chromium] › image-visibility-index.spec.js:294:3 › Image Visibility on Index Page › Visual regression test - take screenshots (retry #2) (37.0s)
    TimeoutError: locator.screenshot: Timeout 29977.75900000002ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29905.454999999987ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29956.59599999996ms exceeded.
  ✘  109 [chromium] › tests/check-all-assets.spec.js:6:3 › Comprehensive Asset Check › should find all broken images including background-images (14.1s)
  ✘  114 [chromium] › tests/check-all-assets.spec.js:6:3 › Comprehensive Asset Check › should find all broken images including background-images (retry #1) (16.0s)
  ✘  115 [chromium] › tests/check-all-assets.spec.js:6:3 › Comprehensive Asset Check › should find all broken images including background-images (retry #2) (13.2s)
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(received).toBe(expected) // Object.is equality
  ✘  116 [chromium] › tests/full-site-image-check.spec.js:39:3 › Full Site Image Check › should check ALL images across entire website (1.6m)
  ✘  117 [chromium] › tests/full-site-image-check.spec.js:39:3 › Full Site Image Check › should check ALL images across entire website (retry #1) (2.0m)
```
