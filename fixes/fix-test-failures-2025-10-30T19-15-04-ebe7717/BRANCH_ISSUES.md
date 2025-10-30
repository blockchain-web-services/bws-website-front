# Test Failure Report

**Generated:** 2025-10-30 19:14:51 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18951966480)
**Commit:** ebe77175ec3e19fb759acedad944f350b242c4db
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 278
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 810116.756ms

### Failed Tests

## Test Output Extract
```
  ✘   13 [chromium] › assets.spec.js:65:3 › Asset Verification Tests › Blockchain Founders Group image test (7.1s)
  ✘   18 [chromium] › assets.spec.js:65:3 › Asset Verification Tests › Blockchain Founders Group image test (retry #1) (10.1s)
  ✘   22 [chromium] › assets.spec.js:65:3 › Asset Verification Tests › Blockchain Founders Group image test (retry #2) (8.1s)
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
  ✘   28 [chromium] › image-validation.spec.js:274:3 › Image Visibility on Live Page › All critical images are visible and properly sized (5.2s)
  ✘   30 [chromium] › image-validation.spec.js:274:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #1) (8.0s)
  ✘   32 [chromium] › image-validation.spec.js:274:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (5.0s)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
  ✘   33 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (14.5s)
  ✘   31 [chromium] › image-validation.spec.js:506:3 › Image Visibility on Live Page › Take screenshots for visual verification (37.4s)
  ✘   34 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (retry #1) (17.1s)
  ✘   36 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (retry #2) (14.4s)
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
  ✘   37 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (14.6s)
  ✘   35 [chromium] › image-validation.spec.js:506:3 › Image Visibility on Live Page › Take screenshots for visual verification (retry #1) (40.5s)
  ✘   38 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (retry #1) (16.6s)
  ✘   40 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (retry #2) (14.3s)
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
  ✘   39 [chromium] › image-validation.spec.js:506:3 › Image Visibility on Live Page › Take screenshots for visual verification (retry #2) (36.1s)
    TimeoutError: locator.screenshot: Timeout 29975.87400000001ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29893.566000000006ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29963.01800000001ms exceeded.
  ✘   41 [chromium] › image-visibility-index.spec.js:140:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (14.4s)
  ✘   45 [chromium] › image-visibility-index.spec.js:140:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (retry #1) (16.2s)
  ✘   51 [chromium] › image-visibility-index.spec.js:140:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (retry #2) (14.5s)
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
  ✘   53 [chromium] › image-visibility.spec.js:185:3 › Image Visibility Tests › Screenshot critical areas for manual inspection (32.2s)
  ✘   67 [chromium] › image-visibility.spec.js:185:3 › Image Visibility Tests › Screenshot critical areas for manual inspection (retry #1) (36.1s)
  ✘   92 [chromium] › image-visibility.spec.js:185:3 › Image Visibility Tests › Screenshot critical areas for manual inspection (retry #2) (32.9s)
    TimeoutError: locator.screenshot: Timeout 30000ms exceeded.
    TimeoutError: locator.screenshot: Timeout 30000ms exceeded.
    TimeoutError: locator.screenshot: Timeout 30000ms exceeded.
  ✘  160 [chromium] › verify-news-company-menu-live.spec.js:4:3 › Live Site - Company Menu News › Company menu displays 4 news items with titles and descriptions (8.7s)
  ✘  161 [chromium] › verify-news-company-menu-live.spec.js:4:3 › Live Site - Company Menu News › Company menu displays 4 news items with titles and descriptions (retry #1) (12.1s)
  ✘  162 [chromium] › verify-news-company-menu-live.spec.js:4:3 › Live Site - Company Menu News › Company menu displays 4 news items with titles and descriptions (retry #2) (7.7s)
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
  ✘  164 [chromium] › visual/images.spec.js:12:3 › Image Visual Tests › Critical partner logos are visible and properly sized (32.1s)
  ✘  165 [chromium] › visual/images.spec.js:12:3 › Image Visual Tests › Critical partner logos are visible and properly sized (retry #1) (34.6s)
```
