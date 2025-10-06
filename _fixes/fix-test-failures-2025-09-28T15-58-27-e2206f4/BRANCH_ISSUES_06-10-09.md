# Test Failure Report - Fix Branch

**Generated:** 2025-10-06 09:37:06 UTC
**Branch:** fix/test-failures-2025-09-28T15-58-27-e2206f4
**Commit:** 5b079f681051ac5fee610bffd28706ce1b876e46
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18276104116)

## 🔁 Recurring Issues Analysis

Comparing with previous reports:
- BRANCH_ISSUES_06-10-08.md
- BRANCH_ISSUES_29-09-13.md
- BRANCH_ISSUES_29-09-16.md
- BRANCH_ISSUES_29-09-17.md
- BRANCH_ISSUES_30-09-06.md

### Known Recurring Issues:
- ⚠️ **WCAG Color Contrast Failures** (wcag-compliance.spec.js)
  - Appears in 4 of last 5 reports
  - Error: Color contrast violations not meeting WCAG AA 4.5:1 or AAA 3:1 standards

## Test Results
### 📊 Test Statistics
- **Total Tests:** 121
- **✅ Passed:** 88
- **❌ Failed:** 28
- **⚠️ Flaky:** 0
- **⏭ Skipped:** 5
- **⏱ Duration:** 873962.174ms

### 🔴 Failed Tests Summary

## 🔍 Enhanced Error Diagnostics

No enhanced diagnostics available - diagnostics directory not created.

_This is expected if no tests failed or error-reporting functions weren't called._

## 📋 Detailed Test Failures

### Failure #1

**Test:** `  ✘   15 [chromium] › assets.spec.js:86:3 › Asset Verification Tests › Blockchain Founders Group image test (8.5s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
```

**Screenshot:** ![Screenshot](snapshots/failure-1-test-failed-1.png)
*(Original path: `test-results/assets-Asset-Verification--05590-n-Founders-Group-image-test-chromium/test-failed-1.png`)*

---

### Failure #2

**Test:** `  ✘   19 [chromium] › assets.spec.js:86:3 › Asset Verification Tests › Blockchain Founders Group image test (retry #1) (11.3s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
```

**Screenshot:** ![Screenshot](snapshots/failure-2-test-failed-1.png)
*(Original path: `test-results/assets-Asset-Verification--05590-n-Founders-Group-image-test-chromium/test-failed-1.png`)*

---

### Failure #3

**Test:** `  ✘   24 [chromium] › assets.spec.js:86:3 › Asset Verification Tests › Blockchain Founders Group image test (retry #2) (8.4s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
```

**Screenshot:** ![Screenshot](snapshots/failure-3-test-failed-1.png)
*(Original path: `test-results/assets-Asset-Verification--05590-n-Founders-Group-image-test-chromium/test-failed-1.png`)*

---

### Failure #4

**Test:** `  ✘   31 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (9.4s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
```

**Screenshot:** ![Screenshot](snapshots/failure-4-test-failed-1.png)
*(Original path: `test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png`)*

---

### Failure #5

**Test:** `  ✘   33 [chromium] › image-validation.spec.js:499:3 › Image Visibility on Live Page › Take screenshots for visual verification (36.7s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    TimeoutError: locator.screenshot: Timeout 29991.694999999992ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29931.728000000003ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29993.937999999995ms exceeded.
```

**Screenshot:** ![Screenshot](snapshots/failure-5-test-failed-1.png)
*(Original path: `test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png`)*

---

### Failure #6

**Test:** `  ✘   34 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #1) (11.7s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
```

**Screenshot:** ![Screenshot](snapshots/failure-6-test-failed-1.png)
*(Original path: `test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png`)*

---

### Failure #7

**Test:** `  ✘   35 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (9.1s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
```

**Screenshot:** ![Screenshot](snapshots/failure-7-test-failed-1.png)
*(Original path: `test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png`)*

---

### Failure #8

**Test:** `  ✘   38 [chromium] › image-visibility-index.spec.js:157:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (13.8s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    TimeoutError: locator.screenshot: Timeout 29991.694999999992ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29931.728000000003ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29993.937999999995ms exceeded.
```

**Screenshot:** ![Screenshot](snapshots/failure-8-test-failed-1.png)
*(Original path: `test-results/image-visibility-index-Ima-8f4da-BFG-Logo-visibility-and-CSS-chromium/test-failed-1.png`)*

---

### Failure #9

**Test:** `  ✘   39 [chromium] › image-validation.spec.js:499:3 › Image Visibility on Live Page › Take screenshots for visual verification (retry #1) (37.7s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    TimeoutError: locator.screenshot: Timeout 29991.694999999992ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29931.728000000003ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29993.937999999995ms exceeded.
```

**Screenshot:** ![Screenshot](snapshots/failure-9-test-failed-1.png)
*(Original path: `test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png`)*

---

### Failure #10

**Test:** `  ✘   40 [chromium] › image-visibility-index.spec.js:157:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (retry #1) (15.4s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    TimeoutError: locator.screenshot: Timeout 29991.694999999992ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29931.728000000003ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29993.937999999995ms exceeded.
```

**Screenshot:** ![Screenshot](snapshots/failure-10-test-failed-1.png)
*(Original path: `test-results/image-visibility-index-Ima-8f4da-BFG-Logo-visibility-and-CSS-chromium/test-failed-1.png`)*

---

### Failure #11

**Test:** `  ✘   41 [chromium] › image-visibility-index.spec.js:157:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (retry #2) (14.1s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    TimeoutError: locator.screenshot: Timeout 29991.694999999992ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29931.728000000003ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29993.937999999995ms exceeded.
    Error: expect(locator).toBeVisible() failed
```

**Screenshot:** ![Screenshot](snapshots/failure-11-test-failed-1.png)
*(Original path: `test-results/image-visibility-index-Ima-8f4da-BFG-Logo-visibility-and-CSS-chromium/test-failed-1.png`)*

---

### Failure #12

**Test:** `  ✘   42 [chromium] › image-validation.spec.js:499:3 › Image Visibility on Live Page › Take screenshots for visual verification (retry #2) (36.2s)`

**Error Details:**
```
    TimeoutError: locator.screenshot: Timeout 29991.694999999992ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29931.728000000003ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29993.937999999995ms exceeded.
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
```

**Screenshot:** ![Screenshot](snapshots/failure-12-test-failed-1.png)
*(Original path: `test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png`)*

---

### Failure #13

**Test:** `  ✘   43 [chromium] › image-visibility-index.spec.js:213:3 › Image Visibility on Index Page › Tokenomics Image visibility (14.6s)`

**Error Details:**
```
    TimeoutError: locator.screenshot: Timeout 29991.694999999992ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29931.728000000003ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29993.937999999995ms exceeded.
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
```

**Screenshot:** ![Screenshot](snapshots/failure-13-test-failed-1.png)
*(Original path: `test-results/image-visibility-index-Ima-8f4da-BFG-Logo-visibility-and-CSS-chromium/test-failed-1.png`)*

---

### Failure #14

**Test:** `  ✘   44 [chromium] › image-visibility-index.spec.js:213:3 › Image Visibility on Index Page › Tokenomics Image visibility (retry #1) (15.5s)`

**Error Details:**
```
    TimeoutError: locator.screenshot: Timeout 29991.694999999992ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29931.728000000003ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29993.937999999995ms exceeded.
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
```

**Screenshot:** ![Screenshot](snapshots/failure-14-test-failed-1.png)
*(Original path: `test-results/image-visibility-index-Ima-8f4da-BFG-Logo-visibility-and-CSS-chromium/test-failed-1.png`)*

---

### Failure #15

**Test:** `  ✘   45 [chromium] › image-visibility-index.spec.js:213:3 › Image Visibility on Index Page › Tokenomics Image visibility (retry #2) (14.6s)`

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

**Screenshot:** ![Screenshot](snapshots/failure-15-test-failed-1.png)
*(Original path: `test-results/image-visibility-index-Ima-8f4da-BFG-Logo-visibility-and-CSS-chromium/test-failed-1.png`)*

---

### Failure #16

**Test:** `  ✘   51 [chromium] › image-visibility.spec.js:82:3 › Image Visibility Tests › Check BFG image is visible and loads correctly (2.9s)`

**Error Details:**
```
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
```

**Screenshot:** ![Screenshot](snapshots/failure-16-test-failed-1.png)
*(Original path: `test-results/image-visibility-Image-Vis-48787-visible-and-loads-correctly-chromium/test-failed-1.png`)*

---

### Failure #17

**Test:** `  ✘   53 [chromium] › image-visibility.spec.js:82:3 › Image Visibility Tests › Check BFG image is visible and loads correctly (retry #1) (5.6s)`

**Error Details:**
```
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
```

**Screenshot:** ![Screenshot](snapshots/failure-17-test-failed-1.png)
*(Original path: `test-results/image-visibility-Image-Vis-48787-visible-and-loads-correctly-chromium/test-failed-1.png`)*

---

### Failure #18

**Test:** `  ✘   56 [chromium] › image-visibility.spec.js:82:3 › Image Visibility Tests › Check BFG image is visible and loads correctly (retry #2) (3.1s)`

**Error Details:**
```
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
```

**Screenshot:** ![Screenshot](snapshots/failure-18-test-failed-1.png)
*(Original path: `test-results/image-visibility-Image-Vis-48787-visible-and-loads-correctly-chromium/test-failed-1.png`)*

---

### Failure #19

**Test:** `  ✘   73 [chromium] › smoke/critical-paths.spec.js:78:3 › Critical Path Smoke Tests › Contact page loads successfully (6.5s)`

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

### Failure #20

**Test:** `  ✘   80 [chromium] › smoke/critical-paths.spec.js:78:3 › Critical Path Smoke Tests › Contact page loads successfully (retry #1) (8.1s)`

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

### Failure #21

**Test:** `  ✘   89 [chromium] › smoke/critical-paths.spec.js:78:3 › Critical Path Smoke Tests › Contact page loads successfully (retry #2) (6.7s)`

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

### Failure #22

**Test:** `  ✘   92 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (1.1s)`

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

### Failure #23

**Test:** `  ✘   93 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (retry #1) (2.8s)`

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

### Failure #24

**Test:** `  ✘   94 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (1.6s)`

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

### Failure #25

**Test:** `  ✘   95 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (retry #2) (1.7s)`

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

### Failure #26

**Test:** `  ✘   96 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (retry #1) (3.3s)`

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

### Failure #27

**Test:** `  ✘   97 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (1.9s)`

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

### Failure #28

**Test:** `  ✘   98 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (retry #1) (3.5s)`

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

### Failure #29

**Test:** `  ✘   99 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (retry #2) (2.1s)`

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

### Failure #30

**Test:** `  ✘  101 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (1.7s)`

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

### Failure #31

**Test:** `  ✘  102 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (retry #2) (1.9s)`

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

### Failure #32

**Test:** `  ✘  103 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (retry #1) (3.8s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #33

**Test:** `  ✘  104 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (2.2s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #34

**Test:** `  ✘  105 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (retry #1) (3.3s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #35

**Test:** `  ✘  106 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (retry #2) (1.9s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #36

**Test:** `  ✘  108 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (retry #2) (2.1s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #37

**Test:** `  ✘  115 [chromium] › tests/comprehensive-image-validator.spec.js:39:3 › Comprehensive Image Validator › should detect ALL broken images across the entire website with advanced validation (1.5m)`


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
    Error: page.goto: Test timeout of 90000ms exceeded.
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
    Error: page.goto: Test timeout of 90000ms exceeded.
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

**Test:** `  ✘  125 [chromium] › tests/navigation-dropdown.spec.js:12:3 › Navigation Dropdown Menu › dropdown menus should display on hover (retry #1) (4.0s)`

**Error Details:**
```
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
```

---

### Failure #45

**Test:** `  ✘  126 [chromium] › tests/navigation-dropdown.spec.js:12:3 › Navigation Dropdown Menu › dropdown menus should display on hover (retry #2) (2.4s)`

**Error Details:**
```
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
```

---

### Failure #46

**Test:** `  ✘  130 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at mobile (375x667) (6.1s)`


---

### Failure #47

**Test:** `  ✘  131 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at mobile (375x667) (retry #1) (12.6s)`


---

### Failure #48

**Test:** `  ✘  132 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at mobile (375x667) (retry #2) (6.9s)`

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

**Test:** `  ✘  133 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at tablet (768x1024) (7.3s)`


---

### Failure #50

**Test:** `  ✘  134 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at tablet (768x1024) (retry #1) (14.1s)`


---

### Failure #51

**Test:** `  ✘  135 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at desktop (1440x900) (8.5s)`


---

### Failure #52

**Test:** `  ✘  136 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at tablet (768x1024) (retry #2) (9.0s)`

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

**Test:** `  ✘  137 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at desktop (1440x900) (retry #1) (17.3s)`


---

### Failure #54

**Test:** `  ✘  138 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at large (1920x1080) (9.8s)`


---

### Failure #55

**Test:** `  ✘  139 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at large (1920x1080) (retry #1) (16.2s)`


---

### Failure #56

**Test:** `  ✘  140 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at desktop (1440x900) (retry #2) (10.0s)`

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

### Failure #57

**Test:** `  ✘  143 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at large (1920x1080) (retry #2) (8.3s)`

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

**Test:** `  ✘  144 [chromium] › visual/images.spec.js:41:3 › Image Visual Tests › All critical images load successfully (2.9s)`

**Error Details:**
```
    Error: Found 24 broken images at large (1920x1080):
    expect(received).toBe(expected) // Object.is equality
    Error: Found 24 broken images at large (1920x1080):
    expect(received).toBe(expected) // Object.is equality
    Error: Found 24 broken images at large (1920x1080):
    expect(received).toBe(expected) // Object.is equality
```

---

### Failure #59

**Test:** `  ✘  145 [chromium] › visual/images.spec.js:41:3 › Image Visual Tests › All critical images load successfully (retry #1) (5.6s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #60

**Test:** `  ✘  147 [chromium] › visual/images.spec.js:41:3 › Image Visual Tests › All critical images load successfully (retry #2) (3.1s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #61

**Test:** `  ✘  148 [chromium] › visual/images.spec.js:65:3 › Image Visual Tests › Visual regression - Homepage screenshots (14.6s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: A snapshot doesn't exist at /home/runner/work/bws-website-front/bws-website-front/tests/visual/images.spec.js-snapshots/homepage-full-chromium-linux.png, writing actual.
    Error: expect.toHaveScreenshot(partner-logos.png): Error: strict mode violation: locator('.announcement-flex-logos') resolved to 2 elements:
```

---

### Failure #62

**Test:** `  ✘  150 [chromium] › visual/images.spec.js:91:3 › Image Visual Tests › Images display correctly at different viewport sizes (5.2s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: A snapshot doesn't exist at /home/runner/work/bws-website-front/bws-website-front/tests/visual/images.spec.js-snapshots/homepage-full-chromium-linux.png, writing actual.
    Error: expect.toHaveScreenshot(partner-logos.png): Error: strict mode violation: locator('.announcement-flex-logos') resolved to 2 elements:
```

---

### Failure #63

**Test:** `  ✘  151 [chromium] › visual/images.spec.js:91:3 › Image Visual Tests › Images display correctly at different viewport sizes (retry #1) (8.0s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: A snapshot doesn't exist at /home/runner/work/bws-website-front/bws-website-front/tests/visual/images.spec.js-snapshots/homepage-full-chromium-linux.png, writing actual.
    Error: expect.toHaveScreenshot(partner-logos.png): Error: strict mode violation: locator('.announcement-flex-logos') resolved to 2 elements:
```

---

### Failure #64

**Test:** `  ✘  152 [chromium] › visual/images.spec.js:65:3 › Image Visual Tests › Visual regression - Homepage screenshots (retry #1) (17.0s)`

**Error Details:**
```
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: A snapshot doesn't exist at /home/runner/work/bws-website-front/bws-website-front/tests/visual/images.spec.js-snapshots/homepage-full-chromium-linux.png, writing actual.
    Error: expect.toHaveScreenshot(partner-logos.png): Error: strict mode violation: locator('.announcement-flex-logos') resolved to 2 elements:
```

---

### Failure #65

**Test:** `  ✘  153 [chromium] › visual/images.spec.js:91:3 › Image Visual Tests › Images display correctly at different viewport sizes (retry #2) (5.4s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: A snapshot doesn't exist at /home/runner/work/bws-website-front/bws-website-front/tests/visual/images.spec.js-snapshots/homepage-full-chromium-linux.png, writing actual.
    Error: expect.toHaveScreenshot(partner-logos.png): Error: strict mode violation: locator('.announcement-flex-logos') resolved to 2 elements:
```

---

### Failure #66

**Test:** `  ✘  157 [chromium] › visual/images.spec.js:65:3 › Image Visual Tests › Visual regression - Homepage screenshots (retry #2) (8.5s)`

**Error Details:**
```
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: A snapshot doesn't exist at /home/runner/work/bws-website-front/bws-website-front/tests/visual/images.spec.js-snapshots/homepage-full-chromium-linux.png, writing actual.
    Error: expect.toHaveScreenshot(partner-logos.png): Error: strict mode violation: locator('.announcement-flex-logos') resolved to 2 elements:
    Error: expect(locator).toBeVisible() failed
```

---

### Failure #67

**Test:** `  ✘  165 [smoke] › smoke/critical-paths.spec.js:78:3 › Critical Path Smoke Tests › Contact page loads successfully (6.6s)`

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

### Failure #68

**Test:** `  ✘  170 [smoke] › smoke/critical-paths.spec.js:78:3 › Critical Path Smoke Tests › Contact page loads successfully (retry #1) (7.9s)`

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

### Failure #69

**Test:** `  ✘  179 [smoke] › smoke/critical-paths.spec.js:78:3 › Critical Path Smoke Tests › Contact page loads successfully (retry #2) (6.6s)`

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

### Failure #70

**Test:** `  ✘  184 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (1.2s)`

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

### Failure #71

**Test:** `  ✘  185 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (retry #1) (3.3s)`

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

### Failure #72

**Test:** `  ✘  186 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (2.1s)`

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

### Failure #73

**Test:** `  ✘  187 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (retry #1) (3.6s)`

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

### Failure #74

**Test:** `  ✘  188 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (retry #2) (2.0s)`

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

**Test:** `  ✘  189 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (1.7s)`

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

**Test:** `  ✘  190 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (retry #2) (1.6s)`

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

**Test:** `  ✘  191 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (retry #1) (3.6s)`

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

**Test:** `  ✘  193 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (1.7s)`

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

**Test:** `  ✘  194 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (retry #1) (3.3s)`

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

### Failure #80

**Test:** `  ✘  195 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (retry #2) (2.1s)`

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

**Test:** `  ✘  196 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (1.6s)`

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

### Failure #82

**Test:** `  ✘  197 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (retry #2) (1.5s)`

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

### Failure #83

**Test:** `  ✘  198 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (retry #1) (3.2s)`

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

### Failure #84

**Test:** `  ✘  200 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (retry #2) (1.9s)`

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
  ✓    1 [chromium] › accessibility/button-hover-contrast.spec.js:137:3 › Button Hover State Accessibility › Learn More button hover contrast on homepage (3.7s)
  ✓    2 [chromium] › accessibility/button-hover-contrast.spec.js:9:3 › Button Hover State Accessibility › All button hover states maintain proper contrast (6.3s)
  ✓    3 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (5.8s)
  ✓    4 [chromium] › accessibility/wcag-compliance.spec.js:36:3 › WCAG Accessibility Compliance › About page passes accessibility checks (3.9s)
  ✓    6 [chromium] › accessibility/wcag-compliance.spec.js:87:3 › WCAG Accessibility Compliance › All form inputs have labels (1.5s)
  ✓    5 [chromium] › accessibility/wcag-compliance.spec.js:61:3 › WCAG Accessibility Compliance › All images have alt text (2.4s)
  ✓    7 [chromium] › accessibility/wcag-compliance.spec.js:130:3 › WCAG Accessibility Compliance › Keyboard navigation works correctly (2.8s)
  ✓    9 [chromium] › accessibility/wcag-compliance.spec.js:198:3 › WCAG Accessibility Compliance › Page has proper heading hierarchy (3.5s)
  ✓   10 [chromium] › accessibility/wcag-compliance.spec.js:263:3 › WCAG Accessibility Compliance › ARIA landmarks are properly used (3.1s)
  ✓    8 [chromium] › accessibility/wcag-compliance.spec.js:157:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (9.7s)
  ✓   11 [chromium] › accessibility/wcag-compliance.spec.js:303:3 › WCAG Accessibility Compliance › Focus trap in modals works correctly (2.8s)
  ✓   13 [chromium] › assets.spec.js:47:3 › Asset Verification Tests › AssureDefi image size check (3.5s)
  ✓   14 [chromium] › assets.spec.js:66:3 › Asset Verification Tests › Tokenomics image test (4.2s)
  ✓   16 [chromium] › assets.spec.js:105:5 › Asset Verification Tests › Layout test on Desktop (2.9s)
  ✘   15 [chromium] › assets.spec.js:86:3 › Asset Verification Tests › Blockchain Founders Group image test (8.5s)
  ✓   17 [chromium] › assets.spec.js:105:5 › Asset Verification Tests › Layout test on Tablet (2.7s)
  ✓   18 [chromium] › assets.spec.js:105:5 › Asset Verification Tests › Layout test on Mobile (2.4s)
  ✓   21 [chromium] › e2e/navigation.spec.js:38:3 › Navigation Tests › Industry dropdown navigation works (6.5s)
  ✓   22 [chromium] › e2e/navigation.spec.js:80:3 › Navigation Tests › Footer navigation links work (5.8s)
  ✘   19 [chromium] › assets.spec.js:86:3 › Asset Verification Tests › Blockchain Founders Group image test (retry #1) (11.3s)
  ✓   23 [chromium] › e2e/navigation.spec.js:207:3 › Navigation Tests › Logo click returns to homepage (3.6s)
✓ 404 handling is working correctly for static site
[1A✓ 404 handling is working correctly for static site
  ✓   25 [chromium] › e2e/navigation.spec.js:243:3 › Navigation Tests › 404 page handles non-existent routes (354ms)
  ✓   26 [chromium] › e2e/navigation.spec.js:288:3 › Navigation Tests › All marketplace products are accessible (4.2s)
  ✓   28 [chromium] › image-validation.spec.js:52:3 › Image Files and CSS Validation › Check image files exist in build directory (17ms)
  ✓   29 [chromium] › image-validation.spec.js:77:3 › Image Files and CSS Validation › Check CSS classes are defined with proper rules (10ms)
  ✓   30 [chromium] › image-validation.spec.js:150:3 › Image Files and CSS Validation › Check HTML for problematic attributes (4ms)
  ✘   24 [chromium] › assets.spec.js:86:3 › Asset Verification Tests › Blockchain Founders Group image test (retry #2) (8.4s)
    Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" alt="Blockchain Founders Group logo" class="image-bfg top-menu-company-news-image" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
          - unexpected value "hidden"
      100 |       console.error('❌ No BFG images found in DOM');
        at /home/runner/work/bws-website-front/bws-website-front/tests/assets.spec.js:97:25
    test-results/assets-Asset-Verification--05590-n-Founders-Group-image-test-chromium/test-failed-1.png
    Error Context: test-results/assets-Asset-Verification--05590-n-Founders-Group-image-test-chromium/error-context.md
    Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" alt="Blockchain Founders Group logo" class="image-bfg top-menu-company-news-image" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
          - unexpected value "hidden"
      100 |       console.error('❌ No BFG images found in DOM');
        at /home/runner/work/bws-website-front/bws-website-front/tests/assets.spec.js:97:25
    test-results/assets-Asset-Verification--05590-n-Founders-Group-image-test-chromium-retry1/test-failed-1.png
    Error Context: test-results/assets-Asset-Verification--05590-n-Founders-Group-image-test-chromium-retry1/error-context.md
    test-results/assets-Asset-Verification--05590-n-Founders-Group-image-test-chromium-retry1/trace.zip
        npx playwright show-trace test-results/assets-Asset-Verification--05590-n-Founders-Group-image-test-chromium-retry1/trace.zip
    Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" alt="Blockchain Founders Group logo" class="image-bfg top-menu-company-news-image" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
          - unexpected value "hidden"
      100 |       console.error('❌ No BFG images found in DOM');
        at /home/runner/work/bws-website-front/bws-website-front/tests/assets.spec.js:97:25
    test-results/assets-Asset-Verification--05590-n-Founders-Group-image-test-chromium-retry2/test-failed-1.png
    Error Context: test-results/assets-Asset-Verification--05590-n-Founders-Group-image-test-chromium-retry2/error-context.md
[1A[32/154] [chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images
[1A[chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images
  ✘   31 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (9.4s)
✅ No 404 errors detected for images
[1A[chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images
✅ No 404 errors detected for images
  ✓   32 [chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images (7.3s)
  ✘   34 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #1) (11.7s)
  ✘   35 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (9.1s)
    Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" alt="Blockchain Founders Group logo" class="image-bfg top-menu-company-news-image" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:297:36
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
    Error Context: test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/error-context.md
    Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" alt="Blockchain Founders Group logo" class="image-bfg top-menu-company-news-image" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:297:36
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/test-failed-1.png
    Error Context: test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/error-context.md
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/trace.zip
        npx playwright show-trace test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/trace.zip
    Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" alt="Blockchain Founders Group logo" class="image-bfg top-menu-company-news-image" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:297:36
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry2/test-failed-1.png
    Error Context: test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry2/error-context.md
  ✓   36 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (3.9s)
  ✓   37 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (3.8s)
  ✘   33 [chromium] › image-validation.spec.js:499:3 › Image Visibility on Live Page › Take screenshots for visual verification (36.7s)
  ✘   38 [chromium] › image-visibility-index.spec.js:157:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (13.8s)
  ✘   40 [chromium] › image-visibility-index.spec.js:157:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (retry #1) (15.4s)
  ✘   39 [chromium] › image-validation.spec.js:499:3 › Image Visibility on Live Page › Take screenshots for visual verification (retry #1) (37.7s)
  ✘   41 [chromium] › image-visibility-index.spec.js:157:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (retry #2) (14.1s)
    Error: expect(locator).toBeVisible() failed
        14 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" alt="Blockchain Founders Group logo" class="image-bfg top-menu-company-news-image" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
           - unexpected value "hidden"
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:162:26
    test-results/image-visibility-index-Ima-8f4da-BFG-Logo-visibility-and-CSS-chromium/test-failed-1.png
    Error Context: test-results/image-visibility-index-Ima-8f4da-BFG-Logo-visibility-and-CSS-chromium/error-context.md
    Error: expect(locator).toBeVisible() failed
        14 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" alt="Blockchain Founders Group logo" class="image-bfg top-menu-company-news-image" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
           - unexpected value "hidden"
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:162:26
    test-results/image-visibility-index-Ima-8f4da-BFG-Logo-visibility-and-CSS-chromium-retry1/test-failed-1.png
    Error Context: test-results/image-visibility-index-Ima-8f4da-BFG-Logo-visibility-and-CSS-chromium-retry1/error-context.md
    test-results/image-visibility-index-Ima-8f4da-BFG-Logo-visibility-and-CSS-chromium-retry1/trace.zip
        npx playwright show-trace test-results/image-visibility-index-Ima-8f4da-BFG-Logo-visibility-and-CSS-chromium-retry1/trace.zip
    Error: expect(locator).toBeVisible() failed
        14 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" alt="Blockchain Founders Group logo" class="image-bfg top-menu-company-news-image" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
           - unexpected value "hidden"
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:162:26
    test-results/image-visibility-index-Ima-8f4da-BFG-Logo-visibility-and-CSS-chromium-retry2/test-failed-1.png
    Error Context: test-results/image-visibility-index-Ima-8f4da-BFG-Logo-visibility-and-CSS-chromium-retry2/error-context.md
  ✘   43 [chromium] › image-visibility-index.spec.js:213:3 › Image Visibility on Index Page › Tokenomics Image visibility (14.6s)
  ✘   44 [chromium] › image-visibility-index.spec.js:213:3 › Image Visibility on Index Page › Tokenomics Image visibility (retry #1) (15.5s)
  ✘   42 [chromium] › image-validation.spec.js:499:3 › Image Visibility on Live Page › Take screenshots for visual verification (retry #2) (36.2s)
    TimeoutError: locator.screenshot: Timeout 29991.694999999992ms exceeded.
        2 × waiting for element to be stable
        2 × waiting for element to be stable
        56 × waiting for element to be stable
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:517:26
    test-results/image-validation-Image-Vis-fe53a-ots-for-visual-verification-chromium/test-failed-1.png
    Error Context: test-results/image-validation-Image-Vis-fe53a-ots-for-visual-verification-chromium/error-context.md
    TimeoutError: locator.screenshot: Timeout 29931.728000000003ms exceeded.
        2 × waiting for element to be stable
        2 × waiting for element to be stable
        56 × waiting for element to be stable
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:517:26
    test-results/image-validation-Image-Vis-fe53a-ots-for-visual-verification-chromium-retry1/test-failed-1.png
    Error Context: test-results/image-validation-Image-Vis-fe53a-ots-for-visual-verification-chromium-retry1/error-context.md
    test-results/image-validation-Image-Vis-fe53a-ots-for-visual-verification-chromium-retry1/trace.zip
        npx playwright show-trace test-results/image-validation-Image-Vis-fe53a-ots-for-visual-verification-chromium-retry1/trace.zip
    TimeoutError: locator.screenshot: Timeout 29993.937999999995ms exceeded.
        2 × waiting for element to be stable
        2 × waiting for element to be stable
        56 × waiting for element to be stable
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:517:26
    test-results/image-validation-Image-Vis-fe53a-ots-for-visual-verification-chromium-retry2/test-failed-1.png
    Error Context: test-results/image-validation-Image-Vis-fe53a-ots-for-visual-verification-chromium-retry2/error-context.md
  ✓   46 [chromium] › image-visibility-index.spec.js:261:3 › Image Visibility on Index Page › Check for CSS conflicts (4.4s)
  ✓   47 [chromium] › image-visibility-index.spec.js:306:3 › Image Visibility on Index Page › Visual regression test - take screenshots (5.3s)
  ✘   45 [chromium] › image-visibility-index.spec.js:213:3 › Image Visibility on Index Page › Tokenomics Image visibility (retry #2) (14.6s)
    Error: expect(locator).toBeVisible() failed
        14 × locator resolved to <img loading="lazy" alt="$BWS Token Allocation" class="image-token-allocation" src="/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png"/>
           - unexpected value "hidden"
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:220:30
    test-results/image-visibility-index-Ima-f43cc-Tokenomics-Image-visibility-chromium/test-failed-1.png
    Error Context: test-results/image-visibility-index-Ima-f43cc-Tokenomics-Image-visibility-chromium/error-context.md
    Error: expect(locator).toBeVisible() failed
        14 × locator resolved to <img loading="lazy" alt="$BWS Token Allocation" class="image-token-allocation" src="/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png"/>
```
</details>
