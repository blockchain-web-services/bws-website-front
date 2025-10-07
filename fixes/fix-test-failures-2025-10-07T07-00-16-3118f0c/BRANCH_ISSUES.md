# Test Failure Report

**Generated:** 2025-10-07 07:00:07 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18304549568)
**Commit:** 3118f0cf51a07ed076e27a19f4221c42e283d01f
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 135
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 363635.981ms

### Failed Tests

## Test Output Extract
```
  ✘   24 [chromium] › image-validation.spec.js:77:3 › Image Files and CSS Validation › Check CSS classes are defined with proper rules (37ms)
  ✘   25 [chromium] › image-validation.spec.js:77:3 › Image Files and CSS Validation › Check CSS classes are defined with proper rules (retry #1) (48ms)
  ✘   28 [chromium] › image-validation.spec.js:77:3 › Image Files and CSS Validation › Check CSS classes are defined with proper rules (retry #2) (33ms)
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
  ✘   27 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (4.5s)
  ✘   30 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #1) (7.2s)
  ✘   32 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (4.8s)
    Error: expect(received).toBeLessThanOrEqual(expected)
    Error: expect(received).toBeLessThanOrEqual(expected)
    Error: expect(received).toBeLessThanOrEqual(expected)
  ✘   33 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (4.7s)
  ✘   34 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (5.2s)
  ✘   35 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (retry #1) (7.5s)
  ✘   36 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (retry #1) (8.4s)
  ✘   37 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (retry #2) (5.8s)
    Error: expect(received).toContain(expected) // indexOf
    Error: expect(received).toContain(expected) // indexOf
    Error: expect(received).toContain(expected) // indexOf
  ✘   38 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (retry #2) (5.1s)
    Error: expect(received).toContain(expected) // indexOf
    Error: expect(received).toContain(expected) // indexOf
    Error: expect(received).toContain(expected) // indexOf
  ✘  103 [chromium] › visual/images.spec.js:12:3 › Image Visual Tests › Critical partner logos are visible and properly sized (2.0s)
  ✘  104 [chromium] › visual/images.spec.js:12:3 › Image Visual Tests › Critical partner logos are visible and properly sized (retry #1) (3.7s)
  ✘  105 [chromium] › visual/images.spec.js:12:3 › Image Visual Tests › Critical partner logos are visible and properly sized (retry #2) (2.6s)
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
    Error: expect(received).toContain(expected) // indexOf
    Error: expect(received).toContain(expected) // indexOf
    Error: expect(received).toContain(expected) // indexOf
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```
