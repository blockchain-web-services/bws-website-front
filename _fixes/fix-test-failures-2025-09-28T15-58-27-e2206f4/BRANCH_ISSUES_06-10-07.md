# Test Failure Report - Fix Branch

**Generated:** 2025-10-06 07:49:54 UTC
**Branch:** fix/test-failures-2025-09-28T15-58-27-e2206f4
**Commit:** 3d21299b6fb96664bba864c9fd7ab11d058bd771
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18273476016)

## 🔁 Recurring Issues Analysis

Comparing with previous reports:
- BRANCH_ISSUES_05-10-19.md
- BRANCH_ISSUES_05-10-20.md
- BRANCH_ISSUES_05-10-21.md
- BRANCH_ISSUES_29-09-13.md
- BRANCH_ISSUES_29-09-16.md

### Known Recurring Issues:
- ⚠️ **WCAG Color Contrast Failures** (wcag-compliance.spec.js)
  - Appears in 2 of last 5 reports
  - Error: Color contrast violations not meeting WCAG AA 4.5:1 or AAA 3:1 standards

## Test Results
### 📊 Test Statistics
- **Total Tests:** 120
- **✅ Passed:** 86
- **❌ Failed:** 29
- **⚠️ Flaky:** 0
- **⏭ Skipped:** 5
- **⏱ Duration:** 795886.906ms

### 🔴 Failed Tests Summary

## 🔍 Enhanced Error Diagnostics

No enhanced diagnostics available - diagnostics directory not created.

_This is expected if no tests failed or error-reporting functions weren't called._

## 📋 Detailed Test Failures

### Failure #1

**Test:** `  ✘   29 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (10.1s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
```

---

### Failure #2

**Test:** `  ✘   32 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #1) (13.7s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
```

---

### Failure #3

**Test:** `  ✘   35 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (10.1s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
```

---

### Failure #4

**Test:** `  ✘   37 [chromium] › image-visibility-index.spec.js:213:3 › Image Visibility on Index Page › Tokenomics Image visibility (14.4s)`

**Error Details:**
```
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
```

---

### Failure #5

**Test:** `  ✘   40 [chromium] › image-visibility-index.spec.js:213:3 › Image Visibility on Index Page › Tokenomics Image visibility (retry #1) (18.1s)`

**Error Details:**
```
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
```

---

### Failure #6

**Test:** `  ✘   44 [chromium] › image-visibility.spec.js:82:3 › Image Visibility Tests › Check BFG image is visible and loads correctly (2.7s)`

**Error Details:**
```
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
```

---

### Failure #7

**Test:** `  ✘   45 [chromium] › image-visibility.spec.js:82:3 › Image Visibility Tests › Check BFG image is visible and loads correctly (retry #1) (5.5s)`

**Error Details:**
```
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
```

---

### Failure #8

**Test:** `  ✘   46 [chromium] › image-visibility-index.spec.js:213:3 › Image Visibility on Index Page › Tokenomics Image visibility (retry #2) (14.5s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
```

---

### Failure #9

**Test:** `  ✘   47 [chromium] › image-visibility.spec.js:82:3 › Image Visibility Tests › Check BFG image is visible and loads correctly (retry #2) (2.8s)`

**Error Details:**
```
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
```

---

### Failure #10

**Test:** `  ✘   67 [chromium] › smoke/critical-paths.spec.js:78:3 › Critical Path Smoke Tests › Contact page loads successfully (6.6s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #11

**Test:** `  ✘   74 [chromium] › smoke/critical-paths.spec.js:78:3 › Critical Path Smoke Tests › Contact page loads successfully (retry #1) (8.1s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #12

**Test:** `  ✘   82 [chromium] › smoke/critical-paths.spec.js:78:3 › Critical Path Smoke Tests › Contact page loads successfully (retry #2) (6.8s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #13

**Test:** `  ✘   86 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (1.2s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #14

**Test:** `  ✘   87 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (retry #1) (2.8s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #15

**Test:** `  ✘   88 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (1.5s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #16

**Test:** `  ✘   89 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (retry #2) (1.9s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #17

**Test:** `  ✘   90 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (retry #1) (3.1s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #18

**Test:** `  ✘   91 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (1.8s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #19

**Test:** `  ✘   92 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (retry #2) (2.0s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #20

**Test:** `  ✘   93 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (retry #1) (3.3s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #21

**Test:** `  ✘   95 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (1.7s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #22

**Test:** `  ✘   96 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (retry #2) (1.7s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #23

**Test:** `  ✘   97 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (retry #1) (3.2s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
```

---

### Failure #24

**Test:** `  ✘   98 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (1.9s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
```

---

### Failure #25

**Test:** `  ✘   99 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (retry #1) (3.7s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
```

---

### Failure #26

**Test:** `  ✘  100 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (retry #2) (2.1s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
```

---

### Failure #27

**Test:** `  ✘  102 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (retry #2) (2.1s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
```

---

### Failure #28

**Test:** `  ✘  106 [chromium] › tests/check-all-assets.spec.js:6:3 › Comprehensive Asset Check › should find all broken images including background-images (325ms)`

**Error Details:**
```
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
```

---

### Failure #29

**Test:** `  ✘  107 [chromium] › tests/check-console-errors.spec.js:4:3 › Console Error Check › should have no JavaScript errors on homepage (365ms)`

**Error Details:**
```
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
```

---

### Failure #30

**Test:** `  ✘  108 [chromium] › tests/check-all-assets.spec.js:6:3 › Comprehensive Asset Check › should find all broken images including background-images (retry #1) (534ms)`

**Error Details:**
```
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
```

---

### Failure #31

**Test:** `  ✘  109 [chromium] › tests/check-console-errors.spec.js:4:3 › Console Error Check › should have no JavaScript errors on homepage (retry #1) (512ms)`

**Error Details:**
```
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
```

---

### Failure #32

**Test:** `  ✘  110 [chromium] › tests/check-all-assets.spec.js:6:3 › Comprehensive Asset Check › should find all broken images including background-images (retry #2) (443ms)`

**Error Details:**
```
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
```

---

### Failure #33

**Test:** `  ✘  111 [chromium] › tests/check-console-errors.spec.js:4:3 › Console Error Check › should have no JavaScript errors on homepage (retry #2) (427ms)`

**Error Details:**
```
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
```

---

### Failure #34

**Test:** `  ✘  112 [chromium] › tests/check-console-errors.spec.js:63:3 › Console Error Check › should check for 404 errors (436ms)`

**Error Details:**
```
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
```

---

### Failure #35

**Test:** `  ✘  113 [chromium] › tests/comprehensive-image-validator.spec.js:39:3 › Comprehensive Image Validator › should detect ALL broken images across the entire website with advanced validation (1.5m)`


---

### Failure #36

**Test:** `  ✘  114 [chromium] › tests/check-console-errors.spec.js:63:3 › Console Error Check › should check for 404 errors (retry #1) (469ms)`

**Error Details:**
```
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
```

---

### Failure #37

**Test:** `  ✘  115 [chromium] › tests/check-console-errors.spec.js:63:3 › Console Error Check › should check for 404 errors (retry #2) (417ms)`

**Error Details:**
```
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/
```

---

### Failure #38

**Test:** `  ✘  117 [chromium] › tests/find-broken-images.spec.js:6:3 › Find All Broken Images › scan all pages for broken images (1.5m)`


---

### Failure #39

**Test:** `  ✘  118 [chromium] › tests/comprehensive-image-validator.spec.js:39:3 › Comprehensive Image Validator › should detect ALL broken images across the entire website with advanced validation (retry #1) (1.6m)`


---

### Failure #40

**Test:** `  ✘  119 [chromium] › tests/find-broken-images.spec.js:6:3 › Find All Broken Images › scan all pages for broken images (retry #1) (1.6m)`


---

### Failure #41

**Test:** `  ✘  120 [chromium] › tests/comprehensive-image-validator.spec.js:39:3 › Comprehensive Image Validator › should detect ALL broken images across the entire website with advanced validation (retry #2) (1.5m)`

**Error Details:**
```
    Test timeout of 90000ms exceeded.
    Test timeout of 90000ms exceeded.
    Test timeout of 90000ms exceeded.
    Test timeout of 90000ms exceeded.
    Error: page.waitForTimeout: Test timeout of 90000ms exceeded.
    Test timeout of 90000ms exceeded.
    Error: page.waitForTimeout: Test timeout of 90000ms exceeded.
    Test timeout of 90000ms exceeded.
    Error: page.goto: Test timeout of 90000ms exceeded.
    Error: page.evaluate: TypeError: t is not a function
```

---

### Failure #42

**Test:** `  ✘  121 [chromium] › tests/find-broken-images.spec.js:6:3 › Find All Broken Images › scan all pages for broken images (retry #2) (1.5m)`

**Error Details:**
```
    Test timeout of 90000ms exceeded.
    Error: page.waitForTimeout: Test timeout of 90000ms exceeded.
    Test timeout of 90000ms exceeded.
    Error: page.waitForTimeout: Test timeout of 90000ms exceeded.
    Test timeout of 90000ms exceeded.
    Error: page.goto: Test timeout of 90000ms exceeded.
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
```

---

### Failure #43

**Test:** `  ✘  124 [chromium] › tests/navigation-dropdown.spec.js:12:3 › Navigation Dropdown Menu › dropdown menus should display on hover (2.4s)`

**Error Details:**
```
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
```

---

### Failure #44

**Test:** `  ✘  125 [chromium] › tests/navigation-dropdown.spec.js:12:3 › Navigation Dropdown Menu › dropdown menus should display on hover (retry #1) (4.2s)`

**Error Details:**
```
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
```

---

### Failure #45

**Test:** `  ✘  126 [chromium] › tests/navigation-dropdown.spec.js:12:3 › Navigation Dropdown Menu › dropdown menus should display on hover (retry #2) (2.7s)`

**Error Details:**
```
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
```

---

### Failure #46

**Test:** `  ✘  130 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at mobile (375x667) (6.2s)`


---

### Failure #47

**Test:** `  ✘  131 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at mobile (375x667) (retry #1) (12.7s)`


---

### Failure #48

**Test:** `  ✘  132 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at mobile (375x667) (retry #2) (6.8s)`

**Error Details:**
```
    Error: Found 24 broken images at mobile (375x667):
    expect(received).toBe(expected) // Object.is equality
    Error: Found 24 broken images at mobile (375x667):
    expect(received).toBe(expected) // Object.is equality
    Error: Found 24 broken images at mobile (375x667):
    expect(received).toBe(expected) // Object.is equality
```

---

### Failure #49

**Test:** `  ✘  133 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at tablet (768x1024) (7.0s)`


---

### Failure #50

**Test:** `  ✘  134 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at tablet (768x1024) (retry #1) (14.5s)`


---

### Failure #51

**Test:** `  ✘  135 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at desktop (1440x900) (8.7s)`


---

### Failure #52

**Test:** `  ✘  136 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at tablet (768x1024) (retry #2) (9.4s)`

**Error Details:**
```
    Error: Found 24 broken images at tablet (768x1024):
    expect(received).toBe(expected) // Object.is equality
    Error: Found 24 broken images at tablet (768x1024):
    expect(received).toBe(expected) // Object.is equality
    Error: Found 24 broken images at tablet (768x1024):
    expect(received).toBe(expected) // Object.is equality
```

---

### Failure #53

**Test:** `  ✘  137 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at desktop (1440x900) (retry #1) (16.6s)`


---

### Failure #54

**Test:** `  ✘  138 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at large (1920x1080) (9.5s)`


---

### Failure #55

**Test:** `  ✘  139 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at desktop (1440x900) (retry #2) (8.9s)`

**Error Details:**
```
    Error: Found 24 broken images at desktop (1440x900):
    expect(received).toBe(expected) // Object.is equality
    Error: Found 24 broken images at desktop (1440x900):
    expect(received).toBe(expected) // Object.is equality
    Error: Found 24 broken images at desktop (1440x900):
    expect(received).toBe(expected) // Object.is equality
```

---

### Failure #56

**Test:** `  ✘  140 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at large (1920x1080) (retry #1) (16.5s)`


---

### Failure #57

**Test:** `  ✘  143 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at large (1920x1080) (retry #2) (9.2s)`

**Error Details:**
```
    Error: Found 24 broken images at large (1920x1080):
    expect(received).toBe(expected) // Object.is equality
    Error: Found 24 broken images at large (1920x1080):
    expect(received).toBe(expected) // Object.is equality
    Error: Found 24 broken images at large (1920x1080):
    expect(received).toBe(expected) // Object.is equality
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
```

---

### Failure #58

**Test:** `  ✘  144 [chromium] › visual/images.spec.js:41:3 › Image Visual Tests › All critical images load successfully (3.1s)`

**Error Details:**
```
    Error: Found 24 broken images at large (1920x1080):
    expect(received).toBe(expected) // Object.is equality
```

---

### Failure #59

**Test:** `  ✘  145 [chromium] › visual/images.spec.js:41:3 › Image Visual Tests › All critical images load successfully (retry #1) (5.4s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(locator).toHaveClass(expected) failed
          - unexpected value "top-menu-company-news-image"
    Error: expect(locator).toHaveClass(expected) failed
          - unexpected value "top-menu-company-news-image"
```

---

### Failure #60

**Test:** `  ✘  147 [chromium] › visual/images.spec.js:41:3 › Image Visual Tests › All critical images load successfully (retry #2) (2.7s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(locator).toHaveClass(expected) failed
          - unexpected value "top-menu-company-news-image"
    Error: expect(locator).toHaveClass(expected) failed
          - unexpected value "top-menu-company-news-image"
```

---

### Failure #61

**Test:** `  ✘  148 [chromium] › visual/images.spec.js:80:3 › Image Visual Tests › Images have correct CSS classes applied (7.9s)`

**Error Details:**
```
    Error: expect(locator).toHaveClass(expected) failed
          - unexpected value "top-menu-company-news-image"
    Error: expect(locator).toHaveClass(expected) failed
          - unexpected value "top-menu-company-news-image"
    Error: expect(locator).toHaveClass(expected) failed
          - unexpected value "top-menu-company-news-image"
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
```

---

### Failure #62

**Test:** `  ✘  149 [chromium] › visual/images.spec.js:65:3 › Image Visual Tests › Visual regression - Homepage screenshots (11.0s)`

**Error Details:**
```
    Error: expect(locator).toHaveClass(expected) failed
          - unexpected value "top-menu-company-news-image"
    Error: expect(locator).toHaveClass(expected) failed
          - unexpected value "top-menu-company-news-image"
    Error: expect(locator).toHaveClass(expected) failed
          - unexpected value "top-menu-company-news-image"
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
```

---

### Failure #63

**Test:** `  ✘  150 [chromium] › visual/images.spec.js:80:3 › Image Visual Tests › Images have correct CSS classes applied (retry #1) (10.5s)`

**Error Details:**
```
    Error: expect(locator).toHaveClass(expected) failed
          - unexpected value "top-menu-company-news-image"
    Error: expect(locator).toHaveClass(expected) failed
          - unexpected value "top-menu-company-news-image"
    Error: expect(locator).toHaveClass(expected) failed
          - unexpected value "top-menu-company-news-image"
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
```

---

### Failure #64

**Test:** `  ✘  151 [chromium] › visual/images.spec.js:65:3 › Image Visual Tests › Visual regression - Homepage screenshots (retry #1) (16.0s)`

**Error Details:**
```
    Error: expect(locator).toHaveClass(expected) failed
          - unexpected value "top-menu-company-news-image"
    Error: expect(locator).toHaveClass(expected) failed
          - unexpected value "top-menu-company-news-image"
    Error: expect(locator).toHaveClass(expected) failed
          - unexpected value "top-menu-company-news-image"
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
```

---

### Failure #65

**Test:** `  ✘  152 [chromium] › visual/images.spec.js:80:3 › Image Visual Tests › Images have correct CSS classes applied (retry #2) (8.0s)`

**Error Details:**
```
    Error: expect(locator).toHaveClass(expected) failed
          - unexpected value "top-menu-company-news-image"
    Error: expect(locator).toHaveClass(expected) failed
          - unexpected value "top-menu-company-news-image"
    Error: expect(locator).toHaveClass(expected) failed
          - unexpected value "top-menu-company-news-image"
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
```

---

### Failure #66

**Test:** `  ✘  153 [chromium] › visual/images.spec.js:65:3 › Image Visual Tests › Visual regression - Homepage screenshots (retry #2) (16.0s)`

**Error Details:**
```
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #67

**Test:** `  ✘  154 [chromium] › visual/images.spec.js:91:3 › Image Visual Tests › Images display correctly at different viewport sizes (5.0s)`

**Error Details:**
```
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #68

**Test:** `  ✘  155 [chromium] › visual/images.spec.js:91:3 › Image Visual Tests › Images display correctly at different viewport sizes (retry #1) (8.2s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #69

**Test:** `  ✘  157 [chromium] › visual/images.spec.js:91:3 › Image Visual Tests › Images display correctly at different viewport sizes (retry #2) (5.4s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
```

---

### Failure #70

**Test:** `  ✘  167 [smoke] › smoke/critical-paths.spec.js:78:3 › Critical Path Smoke Tests › Contact page loads successfully (6.5s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #71

**Test:** `  ✘  172 [smoke] › smoke/critical-paths.spec.js:78:3 › Critical Path Smoke Tests › Contact page loads successfully (retry #1) (7.8s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #72

**Test:** `  ✘  181 [smoke] › smoke/critical-paths.spec.js:78:3 › Critical Path Smoke Tests › Contact page loads successfully (retry #2) (6.7s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #73

**Test:** `  ✘  186 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (1.2s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(locator).toBeVisible() failed
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #74

**Test:** `  ✘  187 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (retry #1) (3.1s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #75

**Test:** `  ✘  188 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (2.0s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #76

**Test:** `  ✘  189 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (retry #1) (3.5s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #77

**Test:** `  ✘  190 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (retry #2) (2.1s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #78

**Test:** `  ✘  191 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (1.9s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #79

**Test:** `  ✘  192 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (retry #2) (1.5s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #80

**Test:** `  ✘  193 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (retry #1) (3.6s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #81

**Test:** `  ✘  195 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (1.7s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #82

**Test:** `  ✘  196 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (retry #2) (2.1s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #83

**Test:** `  ✘  197 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (retry #1) (3.1s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
```

---

### Failure #84

**Test:** `  ✘  198 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (1.7s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
```

---

### Failure #85

**Test:** `  ✘  199 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (retry #2) (1.8s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
```

---

### Failure #86

**Test:** `  ✘  200 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (retry #1) (3.2s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
```

---

### Failure #87

**Test:** `  ✘  202 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (retry #2) (2.1s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
```

## 📄 Raw Test Output

<details>
<summary>Click to expand full test output (cleaned)</summary>

```
Running 154 tests using 2 workers
Running 154 tests using 2 workers
  ✓    1 [chromium] › accessibility/button-hover-contrast.spec.js:137:3 › Button Hover State Accessibility › Learn More button hover contrast on homepage (3.1s)
  ✓    2 [chromium] › accessibility/button-hover-contrast.spec.js:9:3 › Button Hover State Accessibility › All button hover states maintain proper contrast (6.1s)
  ✓    3 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (6.0s)
  ✓    4 [chromium] › accessibility/wcag-compliance.spec.js:36:3 › WCAG Accessibility Compliance › About page passes accessibility checks (3.8s)
  ✓    5 [chromium] › accessibility/wcag-compliance.spec.js:61:3 › WCAG Accessibility Compliance › All images have alt text (2.4s)
  ✓    6 [chromium] › accessibility/wcag-compliance.spec.js:87:3 › WCAG Accessibility Compliance › All form inputs have labels (1.7s)
  ✓    7 [chromium] › accessibility/wcag-compliance.spec.js:130:3 › WCAG Accessibility Compliance › Keyboard navigation works correctly (3.0s)
  ✓    9 [chromium] › accessibility/wcag-compliance.spec.js:198:3 › WCAG Accessibility Compliance › Page has proper heading hierarchy (2.7s)
  ✓    8 [chromium] › accessibility/wcag-compliance.spec.js:157:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (7.8s)
  ✓   10 [chromium] › accessibility/wcag-compliance.spec.js:263:3 › WCAG Accessibility Compliance › ARIA landmarks are properly used (2.5s)
  ✓   11 [chromium] › accessibility/wcag-compliance.spec.js:303:3 › WCAG Accessibility Compliance › Focus trap in modals works correctly (2.4s)
  ✓   13 [chromium] › assets.spec.js:47:3 › Asset Verification Tests › AssureDefi image size check (3.1s)
  ✓   15 [chromium] › assets.spec.js:86:3 › Asset Verification Tests › Blockchain Founders Group image test (2.4s)
  ✓   14 [chromium] › assets.spec.js:66:3 › Asset Verification Tests › Tokenomics image test (3.6s)
  ✓   16 [chromium] › assets.spec.js:105:5 › Asset Verification Tests › Layout test on Desktop (2.6s)
  ✓   17 [chromium] › assets.spec.js:105:5 › Asset Verification Tests › Layout test on Tablet (2.7s)
  ✓   18 [chromium] › assets.spec.js:105:5 › Asset Verification Tests › Layout test on Mobile (2.4s)
  ✓   20 [chromium] › e2e/navigation.spec.js:38:3 › Navigation Tests › Industry dropdown navigation works (4.9s)
  ✓   21 [chromium] › e2e/navigation.spec.js:80:3 › Navigation Tests › Footer navigation links work (5.1s)
✓ 404 handling is working correctly for static site
[1A✓ 404 handling is working correctly for static site
  ✓   23 [chromium] › e2e/navigation.spec.js:243:3 › Navigation Tests › 404 page handles non-existent routes (267ms)
  ✓   22 [chromium] › e2e/navigation.spec.js:207:3 › Navigation Tests › Logo click returns to homepage (3.0s)
  ✓   26 [chromium] › image-validation.spec.js:52:3 › Image Files and CSS Validation › Check image files exist in build directory (14ms)
  ✓   27 [chromium] › image-validation.spec.js:77:3 › Image Files and CSS Validation › Check CSS classes are defined with proper rules (11ms)
  ✓   28 [chromium] › image-validation.spec.js:150:3 › Image Files and CSS Validation › Check HTML for problematic attributes (6ms)
  ✓   24 [chromium] › e2e/navigation.spec.js:288:3 › Navigation Tests › All marketplace products are accessible (4.3s)
[1A[30/154] [chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images
  ✘   29 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (10.1s)
✅ No 404 errors detected for images
[1A[chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images
✅ No 404 errors detected for images
  ✓   30 [chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images (7.2s)
  ✓   31 [chromium] › image-validation.spec.js:499:3 › Image Visibility on Live Page › Take screenshots for visual verification (7.0s)
  ✓   33 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (4.6s)
  ✘   32 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #1) (13.7s)
  ✓   34 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (5.4s)
  ✓   36 [chromium] › image-visibility-index.spec.js:157:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (4.6s)
  ✘   35 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (10.1s)
    Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" alt="$BWS Token Allocation" class="image-token-allocation" src="/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:297:36
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
    Error Context: test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/error-context.md
    Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" alt="$BWS Token Allocation" class="image-token-allocation" src="/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:297:36
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/test-failed-1.png
    Error Context: test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/error-context.md
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/trace.zip
        npx playwright show-trace test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/trace.zip
    Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" alt="$BWS Token Allocation" class="image-token-allocation" src="/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:297:36
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry2/test-failed-1.png
    Error Context: test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry2/error-context.md
  ✓   38 [chromium] › image-visibility-index.spec.js:261:3 › Image Visibility on Index Page › Check for CSS conflicts (4.4s)
  ✘   37 [chromium] › image-visibility-index.spec.js:213:3 › Image Visibility on Index Page › Tokenomics Image visibility (14.4s)
  ✓   39 [chromium] › image-visibility-index.spec.js:306:3 › Image Visibility on Index Page › Visual regression test - take screenshots (5.6s)
  ✓   41 [chromium] › image-visibility-index.spec.js:331:3 › Image Visibility on Index Page › Check image loading performance (5.9s)
  ✓   42 [chromium] › image-visibility.spec.js:5:3 › Image Visibility Tests › Check AssureDefi image is visible and loads correctly (2.8s)
  ✓   43 [chromium] › image-visibility.spec.js:48:3 › Image Visibility Tests › Check Tokenomics image is visible and loads correctly (3.2s)
  ✘   44 [chromium] › image-visibility.spec.js:82:3 › Image Visibility Tests › Check BFG image is visible and loads correctly (2.7s)
  ✘   40 [chromium] › image-visibility-index.spec.js:213:3 › Image Visibility on Index Page › Tokenomics Image visibility (retry #1) (18.1s)
  ✘   45 [chromium] › image-visibility.spec.js:82:3 › Image Visibility Tests › Check BFG image is visible and loads correctly (retry #1) (5.5s)
  ✘   47 [chromium] › image-visibility.spec.js:82:3 › Image Visibility Tests › Check BFG image is visible and loads correctly (retry #2) (2.8s)
    Error: expect(received).toBeGreaterThan(expected)
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility.spec.js:107:28
    test-results/image-visibility-Image-Vis-48787-visible-and-loads-correctly-chromium/test-failed-1.png
    Error Context: test-results/image-visibility-Image-Vis-48787-visible-and-loads-correctly-chromium/error-context.md
    Error: expect(received).toBeGreaterThan(expected)
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility.spec.js:107:28
    test-results/image-visibility-Image-Vis-48787-visible-and-loads-correctly-chromium-retry1/test-failed-1.png
    Error Context: test-results/image-visibility-Image-Vis-48787-visible-and-loads-correctly-chromium-retry1/error-context.md
    test-results/image-visibility-Image-Vis-48787-visible-and-loads-correctly-chromium-retry1/trace.zip
        npx playwright show-trace test-results/image-visibility-Image-Vis-48787-visible-and-loads-correctly-chromium-retry1/trace.zip
    Error: expect(received).toBeGreaterThan(expected)
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility.spec.js:107:28
    test-results/image-visibility-Image-Vis-48787-visible-and-loads-correctly-chromium-retry2/test-failed-1.png
    Error Context: test-results/image-visibility-Image-Vis-48787-visible-and-loads-correctly-chromium-retry2/error-context.md
  ✓   48 [chromium] › image-visibility.spec.js:112:3 › Image Visibility Tests › Industry cards have visible background images and text (4.0s)
  ✓   49 [chromium] › image-visibility.spec.js:158:3 › Image Visibility Tests › Check all critical image HTTP responses (174ms)
Partner logos screenshot saved to test-results/partner-logos.png
Partner logos screenshot saved to test-results/partner-logos.png
Tokenomics screenshot saved to test-results/tokenomics.png
[1ATokenomics screenshot saved to test-results/tokenomics.png
  ✘   46 [chromium] › image-visibility-index.spec.js:213:3 › Image Visibility on Index Page › Tokenomics Image visibility (retry #2) (14.5s)
    Error: expect(locator).toBeVisible() failed
        14 × locator resolved to <img loading="lazy" alt="$BWS Token Allocation" class="image-token-allocation" src="/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png"/>
           - unexpected value "hidden"
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:220:30
    test-results/image-visibility-index-Ima-f43cc-Tokenomics-Image-visibility-chromium/test-failed-1.png
    Error Context: test-results/image-visibility-index-Ima-f43cc-Tokenomics-Image-visibility-chromium/error-context.md
    Error: expect(locator).toBeVisible() failed
        14 × locator resolved to <img loading="lazy" alt="$BWS Token Allocation" class="image-token-allocation" src="/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png"/>
           - unexpected value "hidden"
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:220:30
    test-results/image-visibility-index-Ima-f43cc-Tokenomics-Image-visibility-chromium-retry1/test-failed-1.png
    Error Context: test-results/image-visibility-index-Ima-f43cc-Tokenomics-Image-visibility-chromium-retry1/error-context.md
    test-results/image-visibility-index-Ima-f43cc-Tokenomics-Image-visibility-chromium-retry1/trace.zip
        npx playwright show-trace test-results/image-visibility-index-Ima-f43cc-Tokenomics-Image-visibility-chromium-retry1/trace.zip
    Error: expect(locator).toBeVisible() failed
        14 × locator resolved to <img loading="lazy" alt="$BWS Token Allocation" class="image-token-allocation" src="/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png"/>
           - unexpected value "hidden"
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:220:30
    test-results/image-visibility-index-Ima-f43cc-Tokenomics-Image-visibility-chromium-retry2/test-failed-1.png
    Error Context: test-results/image-visibility-index-Ima-f43cc-Tokenomics-Image-visibility-chromium-retry2/error-context.md
Industry cards screenshot saved to test-results/industry-cards.png
Industry cards screenshot saved to test-results/industry-cards.png
  ✓   50 [chromium] › image-visibility.spec.js:184:3 › Image Visibility Tests › Screenshot critical areas for manual inspection (4.6s)
  ✓   51 [chromium] › performance/core-web-vitals.spec.js:21:3 › Core Web Vitals Tests › Measure First Input Delay (FID) (2.6s)
  ✓   52 [chromium] › performance/core-web-vitals.spec.js:4:3 › Core Web Vitals Tests › Measure Largest Contentful Paint (LCP) (2.4s)
  ✓   54 [chromium] › performance/core-web-vitals.spec.js:68:3 › Core Web Vitals Tests › Page load performance metrics (2.4s)
  ✓   55 [chromium] › performance/core-web-vitals.spec.js:88:3 › Core Web Vitals Tests › Resource loading performance (2.1s)
  ✓   53 [chromium] › performance/core-web-vitals.spec.js:45:3 › Core Web Vitals Tests › Measure Cumulative Layout Shift (CLS) (5.8s)
  ✓   57 [chromium] › smoke/basic.spec.js:4:3 › Basic Smoke Tests › Homepage loads successfully (2.2s)
  ✓   56 [chromium] › performance/core-web-vitals.spec.js:110:3 › Core Web Vitals Tests › Bundle size check (2.9s)
  ✓   58 [chromium] › smoke/basic.spec.js:10:3 › Basic Smoke Tests › About page loads successfully (1.3s)
  ✓   59 [chromium] › smoke/basic.spec.js:17:3 › Basic Smoke Tests › Contact page loads successfully (1.6s)
  ✓   60 [chromium] › smoke/basic.spec.js:23:3 › Basic Smoke Tests › Industries page loads successfully (1.0s)
  ✓   61 [chromium] › smoke/basic.spec.js:30:3 › Basic Smoke Tests › CSS loads successfully (733ms)
  ✓   62 [chromium] › smoke/basic.spec.js:35:3 › Basic Smoke Tests › Images directory is accessible (483ms)
  ✓   63 [chromium] › smoke/critical-paths.spec.js:4:3 › Critical Path Smoke Tests › Homepage loads successfully (2.2s)
  ✓   64 [chromium] › smoke/critical-paths.spec.js:14:3 › Critical Path Smoke Tests › Critical CSS and JS files load (2.5s)
[1A[66/154] [chromium] › smoke/critical-paths.spec.js:52:3 › Critical Path Smoke Tests › No console errors on homepage
  ✓   65 [chromium] › smoke/critical-paths.spec.js:30:3 › Critical Path Smoke Tests › Main navigation pages are accessible (3.4s)
  ✓   66 [chromium] › smoke/critical-paths.spec.js:52:3 › Critical Path Smoke Tests › No console errors on homepage (3.0s)
[1A[68/154] [chromium] › smoke/critical-paths.spec.js:90:3 › Critical Path Smoke Tests › Images load without 404 errors
  ✓   68 [chromium] › smoke/critical-paths.spec.js:90:3 › Critical Path Smoke Tests › Images load without 404 errors (2.1s)
  ✓   69 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Homepage has valid HTML5 structure (1.6s)
  ✓   70 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › About has valid HTML5 structure (908ms)
  ✓   71 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Contact Us has valid HTML5 structure (1.1s)
  ✘   67 [chromium] › smoke/critical-paths.spec.js:78:3 › Critical Path Smoke Tests › Contact page loads successfully (6.6s)
  ✓   72 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal Notice has valid HTML5 structure (1.3s)
  ✓   73 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Privacy Policy has valid HTML5 structure (1.8s)
  ✓   75 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Industries has valid HTML5 structure (1.1s)
  ✓   76 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Resources has valid HTML5 structure (830ms)
  ✓   77 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Database Immutable has valid HTML5 structure (1.2s)
  ✓   78 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Database Mutable has valid HTML5 structure (1.1s)
  ✓   79 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › IPFS Upload has valid HTML5 structure (1.3s)
  ✘   74 [chromium] › smoke/critical-paths.spec.js:78:3 › Critical Path Smoke Tests › Contact page loads successfully (retry #1) (8.1s)
  ✓   80 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › NFT Zero Knowledge has valid HTML5 structure (1.4s)
```
</details>
