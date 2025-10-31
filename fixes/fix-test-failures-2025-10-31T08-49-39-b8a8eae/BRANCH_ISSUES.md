# Test Failure Report

**Generated:** 2025-10-31 08:49:26 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18967151383)
**Commit:** b8a8eae26ffa0e75a39c9ad5eb12dc8887dd8c7b
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 278
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 811852.871ms

### Failed Tests

## Test Output Extract
```
  ✘   13 [chromium] › assets.spec.js:65:3 › Asset Verification Tests › Blockchain Founders Group image test (8.3s)
  ✘   17 [chromium] › assets.spec.js:65:3 › Asset Verification Tests › Blockchain Founders Group image test (retry #1) (11.3s)
  ✘   21 [chromium] › assets.spec.js:65:3 › Asset Verification Tests › Blockchain Founders Group image test (retry #2) (8.4s)
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
  ✘   28 [chromium] › image-validation.spec.js:274:3 › Image Visibility on Live Page › All critical images are visible and properly sized (4.8s)
  ✘   30 [chromium] › image-validation.spec.js:274:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #1) (6.9s)
  ✘   32 [chromium] › image-validation.spec.js:274:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (4.3s)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
  ✘   33 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (14.1s)
  ✘   31 [chromium] › image-validation.spec.js:506:3 › Image Visibility on Live Page › Take screenshots for visual verification (36.6s)
  ✘   34 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (retry #1) (17.2s)
  ✘   36 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (retry #2) (14.3s)
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
  ✘   37 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (14.7s)
  ✘   35 [chromium] › image-validation.spec.js:506:3 › Image Visibility on Live Page › Take screenshots for visual verification (retry #1) (40.2s)
  ✘   38 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (retry #1) (15.8s)
  ✘   40 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (retry #2) (14.3s)
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
  ✘   39 [chromium] › image-validation.spec.js:506:3 › Image Visibility on Live Page › Take screenshots for visual verification (retry #2) (35.5s)
    TimeoutError: locator.screenshot: Timeout 29986.562000000005ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29851.83ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29975.921000000002ms exceeded.
  ✘   41 [chromium] › image-visibility-index.spec.js:140:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (14.2s)
  ✘   45 [chromium] › image-visibility-index.spec.js:140:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (retry #1) (16.2s)
  ✘   51 [chromium] › image-visibility-index.spec.js:140:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (retry #2) (14.3s)
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
  ✘   53 [chromium] › image-visibility.spec.js:185:3 › Image Visibility Tests › Screenshot critical areas for manual inspection (32.0s)
  ✘   66 [chromium] › image-visibility.spec.js:185:3 › Image Visibility Tests › Screenshot critical areas for manual inspection (retry #1) (36.3s)
  ✘   89 [chromium] › image-visibility.spec.js:185:3 › Image Visibility Tests › Screenshot critical areas for manual inspection (retry #2) (33.0s)
    TimeoutError: locator.screenshot: Timeout 30000ms exceeded.
    TimeoutError: locator.screenshot: Timeout 30000ms exceeded.
    TimeoutError: locator.screenshot: Timeout 30000ms exceeded.
  ✘  160 [chromium] › verify-news-company-menu-live.spec.js:4:3 › Live Site - Company Menu News › Company menu displays 4 news items with titles and descriptions (8.2s)
  ✘  161 [chromium] › verify-news-company-menu-live.spec.js:4:3 › Live Site - Company Menu News › Company menu displays 4 news items with titles and descriptions (retry #1) (11.7s)
  ✘  162 [chromium] › verify-news-company-menu-live.spec.js:4:3 › Live Site - Company Menu News › Company menu displays 4 news items with titles and descriptions (retry #2) (8.3s)
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
  ✘  164 [chromium] › visual/images.spec.js:12:3 › Image Visual Tests › Critical partner logos are visible and properly sized (31.9s)
  ✘  165 [chromium] › visual/images.spec.js:12:3 › Image Visual Tests › Critical partner logos are visible and properly sized (retry #1) (35.2s)
```
