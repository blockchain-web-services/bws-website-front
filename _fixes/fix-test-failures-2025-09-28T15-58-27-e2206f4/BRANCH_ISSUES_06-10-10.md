# Test Failure Report - Fix Branch

**Generated:** 2025-10-06 10:02:01 UTC
**Branch:** fix/test-failures-2025-09-28T15-58-27-e2206f4
**Commit:** 0c4a4cc6e4c82da329b979b15efb72c7457bd356
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18276779433)

## 🔁 Recurring Issues Analysis

Comparing with previous reports:
- BRANCH_ISSUES_30-09-08.md
- BRANCH_ISSUES_30-09-14.md
- BRANCH_ISSUES_TEST_03-10-17.md
- BRANCH_ISSUES_05-10-19.md
- BRANCH_ISSUES_05-10-20.md

### Known Recurring Issues:
- ⚠️ **WCAG Color Contrast Failures** (wcag-compliance.spec.js)
  - Appears in 2 of last 5 reports
  - Error: Color contrast violations not meeting WCAG AA 4.5:1 or AAA 3:1 standards

## Test Results
### 📊 Test Statistics
- **Total Tests:** 122
- **✅ Passed:** 90
- **❌ Failed:** 27
- **⚠️ Flaky:** 0
- **⏭ Skipped:** 5
- **⏱ Duration:** 869050.752ms

### 🔴 Failed Tests Summary

## 🔍 Enhanced Error Diagnostics

No enhanced diagnostics available - diagnostics directory not created.

_This is expected if no tests failed or error-reporting functions weren't called._

## 📋 Detailed Test Failures

### Failure #1

**Test:** `  ✘   15 [chromium] › assets.spec.js:86:3 › Asset Verification Tests › Blockchain Founders Group image test (7.8s)`

**Error Details:**
```
    Error: BFG Logo has inline style: visibility: visible !important; opacity: 1 !important
    Error: BFG Logo has inline style: visibility: visible !important; opacity: 1 !important
    Error: BFG Logo has inline style: visibility: visible !important; opacity: 1 !important
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
```

**Screenshot:** ![Screenshot](snapshots/failure-1-test-failed-1.png)
*(Original path: `test-results/assets-Asset-Verification--05590-n-Founders-Group-image-test-chromium/test-failed-1.png`)*

---

### Failure #2

**Test:** `  ✘   21 [chromium] › assets.spec.js:86:3 › Asset Verification Tests › Blockchain Founders Group image test (retry #1) (10.5s)`

**Error Details:**
```
    Error: BFG Logo has inline style: visibility: visible !important; opacity: 1 !important
    Error: BFG Logo has inline style: visibility: visible !important; opacity: 1 !important
    Error: BFG Logo has inline style: visibility: visible !important; opacity: 1 !important
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
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

**Test:** `  ✘   30 [chromium] › image-validation.spec.js:150:3 › Image Files and CSS Validation › Check HTML for problematic attributes (4ms)`

**Error Details:**
```
    Error: BFG Logo has inline style: visibility: visible !important; opacity: 1 !important
    Error: BFG Logo has inline style: visibility: visible !important; opacity: 1 !important
    Error: BFG Logo has inline style: visibility: visible !important; opacity: 1 !important
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
```

**Trace Available:** `npx playwright show-trace test-results/image-validation-Image-Fil-2827f--for-problematic-attributes-chromium-retry1/trace.zip`

---

### Failure #5

**Test:** `  ✘   31 [chromium] › image-validation.spec.js:150:3 › Image Files and CSS Validation › Check HTML for problematic attributes (retry #1) (12ms)`

**Error Details:**
```
    Error: BFG Logo has inline style: visibility: visible !important; opacity: 1 !important
    Error: BFG Logo has inline style: visibility: visible !important; opacity: 1 !important
    Error: BFG Logo has inline style: visibility: visible !important; opacity: 1 !important
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
```

**Trace Available:** `npx playwright show-trace test-results/image-validation-Image-Fil-2827f--for-problematic-attributes-chromium-retry1/trace.zip`

---

### Failure #6

**Test:** `  ✘   32 [chromium] › image-validation.spec.js:150:3 › Image Files and CSS Validation › Check HTML for problematic attributes (retry #2) (13ms)`

**Error Details:**
```
    Error: BFG Logo has inline style: visibility: visible !important; opacity: 1 !important
    Error: BFG Logo has inline style: visibility: visible !important; opacity: 1 !important
    Error: BFG Logo has inline style: visibility: visible !important; opacity: 1 !important
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
```

**Trace Available:** `npx playwright show-trace test-results/image-validation-Image-Fil-2827f--for-problematic-attributes-chromium-retry1/trace.zip`

---

### Failure #7

**Test:** `  ✘   33 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (10.0s)`

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

**Trace Available:** `npx playwright show-trace test-results/image-validation-Image-Fil-2827f--for-problematic-attributes-chromium-retry1/trace.zip`

---

### Failure #8

**Test:** `  ✘   35 [chromium] › image-validation.spec.js:499:3 › Image Visibility on Live Page › Take screenshots for visual verification (35.9s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    TimeoutError: locator.screenshot: Timeout 29988.79800000001ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29977.028000000006ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29993.757000000012ms exceeded.
```

**Trace Available:** `npx playwright show-trace test-results/image-validation-Image-Fil-2827f--for-problematic-attributes-chromium-retry1/trace.zip`

---

### Failure #9

**Test:** `  ✘   36 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #1) (11.2s)`

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

**Trace Available:** `npx playwright show-trace test-results/image-validation-Image-Fil-2827f--for-problematic-attributes-chromium-retry1/trace.zip`

---

### Failure #10

**Test:** `  ✘   37 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (9.1s)`

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

**Trace Available:** `npx playwright show-trace test-results/image-validation-Image-Fil-2827f--for-problematic-attributes-chromium-retry1/trace.zip`

---

### Failure #11

**Test:** `  ✘   40 [chromium] › image-visibility-index.spec.js:157:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (13.9s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    TimeoutError: locator.screenshot: Timeout 29988.79800000001ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29977.028000000006ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29993.757000000012ms exceeded.
```

**Screenshot:** ![Screenshot](snapshots/failure-11-test-failed-1.png)
*(Original path: `test-results/image-visibility-index-Ima-8f4da-BFG-Logo-visibility-and-CSS-chromium/test-failed-1.png`)*

---

### Failure #12

**Test:** `  ✘   41 [chromium] › image-validation.spec.js:499:3 › Image Visibility on Live Page › Take screenshots for visual verification (retry #1) (37.6s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    TimeoutError: locator.screenshot: Timeout 29988.79800000001ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29977.028000000006ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29993.757000000012ms exceeded.
```

**Trace Available:** `npx playwright show-trace test-results/image-validation-Image-Fil-2827f--for-problematic-attributes-chromium-retry1/trace.zip`

---

### Failure #13

**Test:** `  ✘   42 [chromium] › image-visibility-index.spec.js:157:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (retry #1) (15.5s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    TimeoutError: locator.screenshot: Timeout 29988.79800000001ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29977.028000000006ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29993.757000000012ms exceeded.
```

**Screenshot:** ![Screenshot](snapshots/failure-13-test-failed-1.png)
*(Original path: `test-results/image-visibility-index-Ima-8f4da-BFG-Logo-visibility-and-CSS-chromium/test-failed-1.png`)*

---

### Failure #14

**Test:** `  ✘   43 [chromium] › image-visibility-index.spec.js:157:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (retry #2) (14.3s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    TimeoutError: locator.screenshot: Timeout 29988.79800000001ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29977.028000000006ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29993.757000000012ms exceeded.
    Error: expect(locator).toBeVisible() failed
```

**Screenshot:** ![Screenshot](snapshots/failure-14-test-failed-1.png)
*(Original path: `test-results/image-visibility-index-Ima-8f4da-BFG-Logo-visibility-and-CSS-chromium/test-failed-1.png`)*

---

### Failure #15

**Test:** `  ✘   44 [chromium] › image-validation.spec.js:499:3 › Image Visibility on Live Page › Take screenshots for visual verification (retry #2) (36.1s)`

**Error Details:**
```
    TimeoutError: locator.screenshot: Timeout 29988.79800000001ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29977.028000000006ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29993.757000000012ms exceeded.
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
```

**Trace Available:** `npx playwright show-trace test-results/image-validation-Image-Fil-2827f--for-problematic-attributes-chromium-retry1/trace.zip`

---

### Failure #16

**Test:** `  ✘   45 [chromium] › image-visibility-index.spec.js:213:3 › Image Visibility on Index Page › Tokenomics Image visibility (14.4s)`

**Error Details:**
```
    TimeoutError: locator.screenshot: Timeout 29988.79800000001ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29977.028000000006ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29993.757000000012ms exceeded.
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
```

**Screenshot:** ![Screenshot](snapshots/failure-16-test-failed-1.png)
*(Original path: `test-results/image-visibility-index-Ima-8f4da-BFG-Logo-visibility-and-CSS-chromium/test-failed-1.png`)*

---

### Failure #17

**Test:** `  ✘   46 [chromium] › image-visibility-index.spec.js:213:3 › Image Visibility on Index Page › Tokenomics Image visibility (retry #1) (15.6s)`

**Error Details:**
```
    TimeoutError: locator.screenshot: Timeout 29988.79800000001ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29977.028000000006ms exceeded.
    TimeoutError: locator.screenshot: Timeout 29993.757000000012ms exceeded.
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
```

**Screenshot:** ![Screenshot](snapshots/failure-17-test-failed-1.png)
*(Original path: `test-results/image-visibility-index-Ima-8f4da-BFG-Logo-visibility-and-CSS-chromium/test-failed-1.png`)*

---

### Failure #18

**Test:** `  ✘   47 [chromium] › image-visibility-index.spec.js:213:3 › Image Visibility on Index Page › Tokenomics Image visibility (retry #2) (15.0s)`

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

**Screenshot:** ![Screenshot](snapshots/failure-18-test-failed-1.png)
*(Original path: `test-results/image-visibility-index-Ima-8f4da-BFG-Logo-visibility-and-CSS-chromium/test-failed-1.png`)*

---

### Failure #19

**Test:** `  ✘   53 [chromium] › image-visibility.spec.js:82:3 › Image Visibility Tests › Check BFG image is visible and loads correctly (3.2s)`

**Error Details:**
```
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
```

**Screenshot:** ![Screenshot](snapshots/failure-19-test-failed-1.png)
*(Original path: `test-results/image-visibility-Image-Vis-48787-visible-and-loads-correctly-chromium/test-failed-1.png`)*

---

### Failure #20

**Test:** `  ✘   55 [chromium] › image-visibility.spec.js:82:3 › Image Visibility Tests › Check BFG image is visible and loads correctly (retry #1) (7.2s)`

**Error Details:**
```
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
```

**Screenshot:** ![Screenshot](snapshots/failure-20-test-failed-1.png)
*(Original path: `test-results/image-visibility-Image-Vis-48787-visible-and-loads-correctly-chromium/test-failed-1.png`)*

---

### Failure #21

**Test:** `  ✘   58 [chromium] › image-visibility.spec.js:82:3 › Image Visibility Tests › Check BFG image is visible and loads correctly (retry #2) (4.6s)`

**Error Details:**
```
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
    Error: expect(received).toBeGreaterThan(expected)
```

**Screenshot:** ![Screenshot](snapshots/failure-21-test-failed-1.png)
*(Original path: `test-results/image-visibility-Image-Vis-48787-visible-and-loads-correctly-chromium/test-failed-1.png`)*

---

### Failure #22

**Test:** `  ✘   92 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (1.9s)`

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

**Test:** `  ✘   93 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (1.5s)`

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

**Test:** `  ✘   94 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (retry #1) (3.7s)`

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

**Test:** `  ✘   95 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (retry #1) (3.1s)`

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

**Test:** `  ✘   96 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (retry #2) (2.0s)`

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

**Test:** `  ✘   97 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (retry #2) (1.8s)`

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

**Test:** `  ✘   98 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (2.0s)`

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

**Test:** `  ✘  100 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (1.5s)`

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

**Test:** `  ✘  101 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (retry #1) (3.5s)`

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

**Test:** `  ✘  102 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (retry #1) (3.3s)`

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

**Test:** `  ✘  103 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (retry #2) (1.8s)`

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

### Failure #33

**Test:** `  ✘  104 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (retry #2) (1.7s)`

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

**Test:** `  ✘  105 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (1.7s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #35

**Test:** `  ✘  107 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (retry #1) (3.6s)`

**Error Details:**
```
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
    Error: page.waitForTimeout: Test timeout of 90000ms exceeded.
    Test timeout of 90000ms exceeded.
    Error: page.evaluate: Test timeout of 90000ms exceeded.
    Test timeout of 90000ms exceeded.
    Error: page.waitForTimeout: Test timeout of 90000ms exceeded.
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
    Error: page.evaluate: Test timeout of 90000ms exceeded.
    Test timeout of 90000ms exceeded.
    Error: page.waitForTimeout: Test timeout of 90000ms exceeded.
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
```

---

### Failure #43

**Test:** `  ✘  124 [chromium] › tests/navigation-dropdown.spec.js:12:3 › Navigation Dropdown Menu › dropdown menus should display on hover (2.5s)`

**Error Details:**
```
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
```

---

### Failure #44

**Test:** `  ✘  125 [chromium] › tests/navigation-dropdown.spec.js:12:3 › Navigation Dropdown Menu › dropdown menus should display on hover (retry #1) (4.9s)`

**Error Details:**
```
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
```

---

### Failure #45

**Test:** `  ✘  126 [chromium] › tests/navigation-dropdown.spec.js:12:3 › Navigation Dropdown Menu › dropdown menus should display on hover (retry #2) (2.6s)`

**Error Details:**
```
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
```

---

### Failure #46

**Test:** `  ✘  130 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at mobile (375x667) (6.3s)`


---

### Failure #47

**Test:** `  ✘  131 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at mobile (375x667) (retry #1) (12.7s)`


---

### Failure #48

**Test:** `  ✘  132 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at mobile (375x667) (retry #2) (7.2s)`

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

**Test:** `  ✘  133 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at tablet (768x1024) (7.2s)`


---

### Failure #50

**Test:** `  ✘  134 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at tablet (768x1024) (retry #1) (14.6s)`


---

### Failure #51

**Test:** `  ✘  135 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at desktop (1440x900) (8.4s)`


---

### Failure #52

**Test:** `  ✘  136 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at tablet (768x1024) (retry #2) (9.7s)`

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

**Test:** `  ✘  137 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at desktop (1440x900) (retry #1) (17.5s)`


---

### Failure #54

**Test:** `  ✘  138 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at large (1920x1080) (10.4s)`


---

### Failure #55

**Test:** `  ✘  139 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at large (1920x1080) (retry #1) (17.3s)`


---

### Failure #56

**Test:** `  ✘  140 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at desktop (1440x900) (retry #2) (9.9s)`

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

**Test:** `  ✘  144 [chromium] › visual/images.spec.js:41:3 › Image Visual Tests › All critical images load successfully (3.0s)`

**Error Details:**
```
    Error: Found 24 broken images at large (1920x1080):
    expect(received).toBe(expected) // Object.is equality
```

---

### Failure #59

**Test:** `  ✘  145 [chromium] › visual/images.spec.js:41:3 › Image Visual Tests › All critical images load successfully (retry #1) (5.2s)`

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

**Test:** `  ✘  147 [chromium] › visual/images.spec.js:41:3 › Image Visual Tests › All critical images load successfully (retry #2) (2.9s)`

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

**Test:** `  ✘  148 [chromium] › visual/images.spec.js:65:3 › Image Visual Tests › Visual regression - Homepage screenshots (14.7s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
```

---

### Failure #62

**Test:** `  ✘  150 [chromium] › visual/images.spec.js:91:3 › Image Visual Tests › Images display correctly at different viewport sizes (5.3s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
```

---

### Failure #63

**Test:** `  ✘  151 [chromium] › visual/images.spec.js:91:3 › Image Visual Tests › Images display correctly at different viewport sizes (retry #1) (7.9s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
```

---

### Failure #64

**Test:** `  ✘  152 [chromium] › visual/images.spec.js:65:3 › Image Visual Tests › Visual regression - Homepage screenshots (retry #1) (17.2s)`

**Error Details:**
```
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
```

---

### Failure #65

**Test:** `  ✘  153 [chromium] › visual/images.spec.js:91:3 › Image Visual Tests › Images display correctly at different viewport sizes (retry #2) (6.0s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
```

---

### Failure #66

**Test:** `  ✘  158 [chromium] › visual/images.spec.js:65:3 › Image Visual Tests › Visual regression - Homepage screenshots (retry #2) (14.7s)`

**Error Details:**
```
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(received).toBeTruthy()
```

---

### Failure #67

**Test:** `  ✘  182 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (1.7s)`

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

### Failure #68

**Test:** `  ✘  183 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (1.8s)`

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

### Failure #69

**Test:** `  ✘  184 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (retry #1) (4.2s)`

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

### Failure #70

**Test:** `  ✘  185 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (retry #1) (3.8s)`

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

### Failure #71

**Test:** `  ✘  186 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (retry #2) (1.9s)`

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

**Test:** `  ✘  187 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (retry #2) (2.0s)`

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

**Test:** `  ✘  188 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (2.0s)`

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

**Test:** `  ✘  190 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (1.5s)`

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

**Test:** `  ✘  191 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (retry #1) (3.8s)`

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

**Test:** `  ✘  192 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (retry #1) (3.2s)`

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

**Test:** `  ✘  193 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (retry #2) (1.9s)`

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

**Test:** `  ✘  194 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (retry #2) (1.8s)`

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

### Failure #79

**Test:** `  ✘  195 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (1.9s)`

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
```

---

### Failure #80

**Test:** `  ✘  197 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (retry #1) (4.1s)`

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
    Error: BFG Logo has inline style: visibility: visible !important; opacity: 1 !important
```

---

### Failure #81

**Test:** `  ✘  198 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (retry #2) (2.1s)`

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
    Error: BFG Logo has inline style: visibility: visible !important; opacity: 1 !important
```

## 📄 Raw Test Output

<details>
<summary>Click to expand full test output (cleaned)</summary>

```
Running 154 tests using 2 workers
Running 154 tests using 2 workers
  ✓    2 [chromium] › accessibility/button-hover-contrast.spec.js:137:3 › Button Hover State Accessibility › Learn More button hover contrast on homepage (3.7s)
  ✓    1 [chromium] › accessibility/button-hover-contrast.spec.js:9:3 › Button Hover State Accessibility › All button hover states maintain proper contrast (6.4s)
  ✓    3 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (6.2s)
  ✓    4 [chromium] › accessibility/wcag-compliance.spec.js:36:3 › WCAG Accessibility Compliance › About page passes accessibility checks (3.7s)
  ✓    6 [chromium] › accessibility/wcag-compliance.spec.js:87:3 › WCAG Accessibility Compliance › All form inputs have labels (1.8s)
  ✓    5 [chromium] › accessibility/wcag-compliance.spec.js:61:3 › WCAG Accessibility Compliance › All images have alt text (2.7s)
  ✓    7 [chromium] › accessibility/wcag-compliance.spec.js:130:3 › WCAG Accessibility Compliance › Keyboard navigation works correctly (2.9s)
  ✓    9 [chromium] › accessibility/wcag-compliance.spec.js:198:3 › WCAG Accessibility Compliance › Page has proper heading hierarchy (2.8s)
  ✓   10 [chromium] › accessibility/wcag-compliance.spec.js:263:3 › WCAG Accessibility Compliance › ARIA landmarks are properly used (2.5s)
  ✓    8 [chromium] › accessibility/wcag-compliance.spec.js:157:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (8.4s)
  ✓   11 [chromium] › accessibility/wcag-compliance.spec.js:303:3 › WCAG Accessibility Compliance › Focus trap in modals works correctly (2.5s)
  ✓   13 [chromium] › assets.spec.js:47:3 › Asset Verification Tests › AssureDefi image size check (3.0s)
  ✓   14 [chromium] › assets.spec.js:66:3 › Asset Verification Tests › Tokenomics image test (3.7s)
  ✓   16 [chromium] › assets.spec.js:105:5 › Asset Verification Tests › Layout test on Desktop (2.1s)
  ✓   17 [chromium] › assets.spec.js:105:5 › Asset Verification Tests › Layout test on Tablet (1.9s)
  ✘   15 [chromium] › assets.spec.js:86:3 › Asset Verification Tests › Blockchain Founders Group image test (7.8s)
  ✓   18 [chromium] › assets.spec.js:105:5 › Asset Verification Tests › Layout test on Mobile (2.1s)
  ✓   20 [chromium] › e2e/navigation.spec.js:38:3 › Navigation Tests › Industry dropdown navigation works (5.6s)
  ✓   22 [chromium] › e2e/navigation.spec.js:80:3 › Navigation Tests › Footer navigation links work (5.5s)
  ✘   21 [chromium] › assets.spec.js:86:3 › Asset Verification Tests › Blockchain Founders Group image test (retry #1) (10.5s)
  ✓   23 [chromium] › e2e/navigation.spec.js:207:3 › Navigation Tests › Logo click returns to homepage (2.6s)
✓ 404 handling is working correctly for static site
[1A✓ 404 handling is working correctly for static site
  ✓   25 [chromium] › e2e/navigation.spec.js:243:3 › Navigation Tests › 404 page handles non-existent routes (241ms)
  ✓   26 [chromium] › e2e/navigation.spec.js:288:3 › Navigation Tests › All marketplace products are accessible (4.1s)
  ✓   28 [chromium] › image-validation.spec.js:52:3 › Image Files and CSS Validation › Check image files exist in build directory (6ms)
  ✓   29 [chromium] › image-validation.spec.js:77:3 › Image Files and CSS Validation › Check CSS classes are defined with proper rules (12ms)
  ✘   30 [chromium] › image-validation.spec.js:150:3 › Image Files and CSS Validation › Check HTML for problematic attributes (4ms)
  ✘   31 [chromium] › image-validation.spec.js:150:3 › Image Files and CSS Validation › Check HTML for problematic attributes (retry #1) (12ms)
  ✘   32 [chromium] › image-validation.spec.js:150:3 › Image Files and CSS Validation › Check HTML for problematic attributes (retry #2) (13ms)
    Error: BFG Logo has inline style: visibility: visible !important; opacity: 1 !important
      215 |             console.error('Remove the style attribute and use CSS classes instead.');
      216 |             console.error(`Check src/components/*.astro files and remove style="..." from ${image.name}`);
    > 217 |             throw new Error(`${image.name} has inline style: ${styleMatch[1]}`);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:217:19
    Error: BFG Logo has inline style: visibility: visible !important; opacity: 1 !important
      215 |             console.error('Remove the style attribute and use CSS classes instead.');
      216 |             console.error(`Check src/components/*.astro files and remove style="..." from ${image.name}`);
    > 217 |             throw new Error(`${image.name} has inline style: ${styleMatch[1]}`);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:217:19
    test-results/image-validation-Image-Fil-2827f--for-problematic-attributes-chromium-retry1/trace.zip
        npx playwright show-trace test-results/image-validation-Image-Fil-2827f--for-problematic-attributes-chromium-retry1/trace.zip
    Error: BFG Logo has inline style: visibility: visible !important; opacity: 1 !important
      215 |             console.error('Remove the style attribute and use CSS classes instead.');
      216 |             console.error(`Check src/components/*.astro files and remove style="..." from ${image.name}`);
    > 217 |             throw new Error(`${image.name} has inline style: ${styleMatch[1]}`);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:217:19
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
[1A[34/154] [chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images
[1A[chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images
✅ No 404 errors detected for images
[1A[chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images
✅ No 404 errors detected for images
  ✓   34 [chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images (7.5s)
  ✘   33 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (10.0s)
  ✘   36 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #1) (11.2s)
  ✘   37 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (9.1s)
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
  ✓   38 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (3.8s)
  ✓   39 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (3.7s)
  ✘   35 [chromium] › image-validation.spec.js:499:3 › Image Visibility on Live Page › Take screenshots for visual verification (35.9s)
  ✘   40 [chromium] › image-visibility-index.spec.js:157:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (13.9s)
  ✘   42 [chromium] › image-visibility-index.spec.js:157:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (retry #1) (15.5s)
  ✘   41 [chromium] › image-validation.spec.js:499:3 › Image Visibility on Live Page › Take screenshots for visual verification (retry #1) (37.6s)
  ✘   43 [chromium] › image-visibility-index.spec.js:157:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (retry #2) (14.3s)
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
  ✘   45 [chromium] › image-visibility-index.spec.js:213:3 › Image Visibility on Index Page › Tokenomics Image visibility (14.4s)
  ✘   46 [chromium] › image-visibility-index.spec.js:213:3 › Image Visibility on Index Page › Tokenomics Image visibility (retry #1) (15.6s)
  ✘   44 [chromium] › image-validation.spec.js:499:3 › Image Visibility on Live Page › Take screenshots for visual verification (retry #2) (36.1s)
    TimeoutError: locator.screenshot: Timeout 29988.79800000001ms exceeded.
        2 × waiting for element to be stable
        2 × waiting for element to be stable
        56 × waiting for element to be stable
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:517:26
    test-results/image-validation-Image-Vis-fe53a-ots-for-visual-verification-chromium/test-failed-1.png
    Error Context: test-results/image-validation-Image-Vis-fe53a-ots-for-visual-verification-chromium/error-context.md
    TimeoutError: locator.screenshot: Timeout 29977.028000000006ms exceeded.
        2 × waiting for element to be stable
        2 × waiting for element to be stable
        56 × waiting for element to be stable
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:517:26
    test-results/image-validation-Image-Vis-fe53a-ots-for-visual-verification-chromium-retry1/test-failed-1.png
    Error Context: test-results/image-validation-Image-Vis-fe53a-ots-for-visual-verification-chromium-retry1/error-context.md
    test-results/image-validation-Image-Vis-fe53a-ots-for-visual-verification-chromium-retry1/trace.zip
```
</details>
