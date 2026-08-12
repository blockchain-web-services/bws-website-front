# Test Failure Report

**Generated:** 2025-10-30 17:36:09 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18949287471)
**Commit:** 456610c2fa4247e0c79c6d229232fe30313e4d38
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 278
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 822712.588ms

### Failed Tests

## Test Output Extract
```
  ✘   13 [chromium] › assets.spec.js:65:3 › Asset Verification Tests › Blockchain Founders Group image test (7.0s)
  ✘   18 [chromium] › assets.spec.js:65:3 › Asset Verification Tests › Blockchain Founders Group image test (retry #1) (10.2s)
  ✘   22 [chromium] › assets.spec.js:65:3 › Asset Verification Tests › Blockchain Founders Group image test (retry #2) (8.1s)
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
  ✘   27 [chromium] › image-validation.spec.js:274:3 › Image Visibility on Live Page › All critical images are visible and properly sized (4.5s)
  ✘   30 [chromium] › image-validation.spec.js:274:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #1) (6.4s)
  ✘   32 [chromium] › image-validation.spec.js:274:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (4.3s)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
  ✘   33 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (14.2s)
  ✘   31 [chromium] › image-validation.spec.js:506:3 › Image Visibility on Live Page › Take screenshots for visual verification (36.2s)
  ✘   34 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (retry #1) (17.3s)
  ✘   36 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (retry #2) (14.5s)
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
  ✘   37 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (14.7s)
  ✘   35 [chromium] › image-validation.spec.js:506:3 › Image Visibility on Live Page › Take screenshots for visual verification (retry #1) (40.8s)
  ✘   38 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (retry #1) (17.0s)
  ✘   40 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (retry #2) (14.2s)
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
  ✘   39 [chromium] › image-validation.spec.js:506:3 › Image Visibility on Live Page › Take screenshots for visual verification (retry #2) (36.1s)
    TimeoutError: locator.screenshot: Timeout 29976.588999999993ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29919.531999999992ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29960.39500000002ms exceeded.
  ✘   41 [chromium] › image-visibility-index.spec.js:140:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (14.2s)
  ✘   45 [chromium] › image-visibility-index.spec.js:140:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (retry #1) (15.9s)
  ✘   51 [chromium] › image-visibility-index.spec.js:140:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (retry #2) (14.3s)
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
  ✘   53 [chromium] › image-visibility.spec.js:185:3 › Image Visibility Tests › Screenshot critical areas for manual inspection (32.3s)
  ✘   66 [chromium] › image-visibility.spec.js:185:3 › Image Visibility Tests › Screenshot critical areas for manual inspection (retry #1) (36.5s)
  ✘   88 [chromium] › image-visibility.spec.js:185:3 › Image Visibility Tests › Screenshot critical areas for manual inspection (retry #2) (33.0s)
    TimeoutError: locator.screenshot: Timeout 30000ms exceeded.
    TimeoutError: locator.screenshot: Timeout 30000ms exceeded.
    TimeoutError: locator.screenshot: Timeout 30000ms exceeded.
  ✘  160 [chromium] › verify-news-company-menu-live.spec.js:4:3 › Live Site - Company Menu News › Company menu displays 4 news items with titles and descriptions (8.2s)
  ✘  161 [chromium] › verify-news-company-menu-live.spec.js:4:3 › Live Site - Company Menu News › Company menu displays 4 news items with titles and descriptions (retry #1) (11.9s)
  ✘  162 [chromium] › verify-news-company-menu-live.spec.js:4:3 › Live Site - Company Menu News › Company menu displays 4 news items with titles and descriptions (retry #2) (8.3s)
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
  ✘  164 [chromium] › visual/images.spec.js:12:3 › Image Visual Tests › Critical partner logos are visible and properly sized (32.1s)
  ✘  165 [chromium] › visual/images.spec.js:12:3 › Image Visual Tests › Critical partner logos are visible and properly sized (retry #1) (34.5s)
```
