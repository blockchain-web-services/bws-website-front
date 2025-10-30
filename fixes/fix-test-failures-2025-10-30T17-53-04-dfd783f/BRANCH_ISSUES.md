# Test Failure Report

**Generated:** 2025-10-30 17:52:52 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18949811482)
**Commit:** dfd783f07c00e206b76d612e84b3b11bb05890e5
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 278
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 824806.36ms

### Failed Tests

## Test Output Extract
```
  ✘   13 [chromium] › assets.spec.js:65:3 › Asset Verification Tests › Blockchain Founders Group image test (7.0s)
  ✘   18 [chromium] › assets.spec.js:65:3 › Asset Verification Tests › Blockchain Founders Group image test (retry #1) (10.2s)
  ✘   21 [chromium] › assets.spec.js:65:3 › Asset Verification Tests › Blockchain Founders Group image test (retry #2) (7.9s)
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
  ✘   28 [chromium] › image-validation.spec.js:274:3 › Image Visibility on Live Page › All critical images are visible and properly sized (4.4s)
  ✘   30 [chromium] › image-validation.spec.js:274:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #1) (7.4s)
  ✘   32 [chromium] › image-validation.spec.js:274:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (4.6s)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
  ✘   33 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (14.3s)
  ✘   31 [chromium] › image-validation.spec.js:506:3 › Image Visibility on Live Page › Take screenshots for visual verification (36.5s)
  ✘   34 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (retry #1) (17.8s)
  ✘   36 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (retry #2) (15.3s)
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
  ✘   35 [chromium] › image-validation.spec.js:506:3 › Image Visibility on Live Page › Take screenshots for visual verification (retry #1) (42.3s)
  ✘   37 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (15.3s)
  ✘   39 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (retry #1) (16.8s)
  ✘   40 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (retry #2) (14.2s)
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
  ✘   38 [chromium] › image-validation.spec.js:506:3 › Image Visibility on Live Page › Take screenshots for visual verification (retry #2) (36.7s)
    TimeoutError: locator.screenshot: Timeout 29984.251000000004ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29888.56599999999ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29938.129000000015ms exceeded.
  ✘   41 [chromium] › image-visibility-index.spec.js:140:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (14.5s)
  ✘   45 [chromium] › image-visibility-index.spec.js:140:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (retry #1) (16.7s)
  ✘   51 [chromium] › image-visibility-index.spec.js:140:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (retry #2) (14.6s)
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
  ✘   53 [chromium] › image-visibility.spec.js:185:3 › Image Visibility Tests › Screenshot critical areas for manual inspection (32.5s)
  ✘   66 [chromium] › image-visibility.spec.js:185:3 › Image Visibility Tests › Screenshot critical areas for manual inspection (retry #1) (36.7s)
  ✘   90 [chromium] › image-visibility.spec.js:185:3 › Image Visibility Tests › Screenshot critical areas for manual inspection (retry #2) (32.8s)
    TimeoutError: locator.screenshot: Timeout 30000ms exceeded.
    TimeoutError: locator.screenshot: Timeout 30000ms exceeded.
    TimeoutError: locator.screenshot: Timeout 30000ms exceeded.
  ✘  160 [chromium] › verify-news-company-menu-live.spec.js:4:3 › Live Site - Company Menu News › Company menu displays 4 news items with titles and descriptions (8.7s)
  ✘  161 [chromium] › verify-news-company-menu-live.spec.js:4:3 › Live Site - Company Menu News › Company menu displays 4 news items with titles and descriptions (retry #1) (12.8s)
  ✘  162 [chromium] › verify-news-company-menu-live.spec.js:4:3 › Live Site - Company Menu News › Company menu displays 4 news items with titles and descriptions (retry #2) (7.8s)
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
  ✘  164 [chromium] › visual/images.spec.js:12:3 › Image Visual Tests › Critical partner logos are visible and properly sized (31.8s)
  ✘  165 [chromium] › visual/images.spec.js:12:3 › Image Visual Tests › Critical partner logos are visible and properly sized (retry #1) (34.6s)
```
