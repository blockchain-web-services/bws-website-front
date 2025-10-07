# Test Failure Report

**Generated:** 2025-10-07 06:51:33 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18304387650)
**Commit:** e7907f64e2b2f6c39a4d1d261e7c566899c06bd0
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 136
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 346798.8ms

### Failed Tests

## Test Output Extract
```
  ✘   24 [chromium] › image-validation.spec.js:77:3 › Image Files and CSS Validation › Check CSS classes are defined with proper rules (39ms)
  ✘   25 [chromium] › image-validation.spec.js:77:3 › Image Files and CSS Validation › Check CSS classes are defined with proper rules (retry #1) (66ms)
  ✘   26 [chromium] › image-validation.spec.js:77:3 › Image Files and CSS Validation › Check CSS classes are defined with proper rules (retry #2) (44ms)
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
  ✘   27 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (4.6s)
  ✘   30 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #1) (7.1s)
  ✘   33 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (5.4s)
    Error: expect(received).toBeLessThanOrEqual(expected)
    Error: expect(received).toBeLessThanOrEqual(expected)
    Error: expect(received).toBeLessThanOrEqual(expected)
  ✘   34 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (4.8s)
  ✘   36 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (retry #1) (6.8s)
  ✘   39 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (retry #2) (4.3s)
    Error: expect(received).toContain(expected) // indexOf
    Error: expect(received).toContain(expected) // indexOf
    Error: expect(received).toContain(expected) // indexOf
  ✘  101 [chromium] › visual/images.spec.js:12:3 › Image Visual Tests › Critical partner logos are visible and properly sized (1.9s)
  ✘  102 [chromium] › visual/images.spec.js:12:3 › Image Visual Tests › Critical partner logos are visible and properly sized (retry #1) (3.7s)
  ✘  103 [chromium] › visual/images.spec.js:12:3 › Image Visual Tests › Critical partner logos are visible and properly sized (retry #2) (2.6s)
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeLessThanOrEqual(expected)
    Error: expect(received).toBeLessThanOrEqual(expected)
    Error: expect(received).toBeLessThanOrEqual(expected)
    Error: expect(received).toContain(expected) // indexOf
    Error: expect(received).toContain(expected) // indexOf
    Error: expect(received).toContain(expected) // indexOf
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```
