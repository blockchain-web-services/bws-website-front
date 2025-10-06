# Test Failure Report - Fix Branch

**Generated:** 2025-10-06 11:53:28 UTC
**Branch:** fix/test-failures-2025-09-28T15-58-27-e2206f4
**Commit:** 2cdd0d0457b83c75cc9b1026a3475dbb335c5e2b
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18279604371)

## 🔁 Recurring Issues Analysis

Comparing with previous reports:
- BRANCH_ISSUES_06-10-10.md
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
- **Total Tests:** 127
- **✅ Passed:** 100
- **❌ Failed:** 22
- **⚠️ Flaky:** 0
- **⏭ Skipped:** 5
- **⏱ Duration:** 768468.081ms

### 🔴 Failed Tests Summary

## 🔍 Enhanced Error Diagnostics

No enhanced diagnostics available - diagnostics directory not created.

_This is expected if no tests failed or error-reporting functions weren't called._

## 📋 Detailed Test Failures

### Failure #1

**Test:** `  ✘   29 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (10.6s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
```

**Screenshot:** ![Screenshot](snapshots/failure-1-test-failed-1.png)
*(Original path: `test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png`)*

---

### Failure #2

**Test:** `  ✘   31 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #1) (13.4s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
```

**Screenshot:** ![Screenshot](snapshots/failure-2-test-failed-1.png)
*(Original path: `test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png`)*

---

### Failure #3

**Test:** `  ✘   35 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (10.0s)`

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

**Screenshot:** ![Screenshot](snapshots/failure-3-test-failed-1.png)
*(Original path: `test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png`)*

---

### Failure #4

**Test:** `  ✘   37 [chromium] › image-visibility-index.spec.js:214:3 › Image Visibility on Index Page › Tokenomics Image visibility (14.6s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
```

**Screenshot:** ![Screenshot](snapshots/failure-4-test-failed-1.png)
*(Original path: `test-results/image-visibility-index-Ima-f43cc-Tokenomics-Image-visibility-chromium/test-failed-1.png`)*

---

### Failure #5

**Test:** `  ✘   41 [chromium] › image-visibility-index.spec.js:214:3 › Image Visibility on Index Page › Tokenomics Image visibility (retry #1) (17.5s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
```

**Screenshot:** ![Screenshot](snapshots/failure-5-test-failed-1.png)
*(Original path: `test-results/image-visibility-index-Ima-f43cc-Tokenomics-Image-visibility-chromium/test-failed-1.png`)*

---

### Failure #6

**Test:** `  ✘   48 [chromium] › image-visibility-index.spec.js:214:3 › Image Visibility on Index Page › Tokenomics Image visibility (retry #2) (14.6s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
```

**Screenshot:** ![Screenshot](snapshots/failure-6-test-failed-1.png)
*(Original path: `test-results/image-visibility-index-Ima-f43cc-Tokenomics-Image-visibility-chromium/test-failed-1.png`)*

---

### Failure #7

**Test:** `  ✘   82 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (1.9s)`

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

### Failure #8

**Test:** `  ✘   83 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (1.6s)`

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

### Failure #9

**Test:** `  ✘   84 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (retry #1) (3.5s)`

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

### Failure #10

**Test:** `  ✘   85 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (retry #1) (3.7s)`

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

### Failure #11

**Test:** `  ✘   86 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (retry #2) (1.9s)`

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

### Failure #12

**Test:** `  ✘   87 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (retry #2) (1.7s)`

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

### Failure #13

**Test:** `  ✘   88 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (1.7s)`

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

### Failure #14

**Test:** `  ✘   90 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (1.8s)`

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

**Test:** `  ✘   91 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (retry #1) (3.4s)`

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

**Test:** `  ✘   92 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (retry #1) (3.0s)`

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

**Test:** `  ✘   93 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (retry #2) (1.7s)`

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

**Test:** `  ✘   94 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (retry #2) (1.8s)`

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

### Failure #19

**Test:** `  ✘   95 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (1.9s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #20

**Test:** `  ✘   97 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (retry #1) (3.5s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #21

**Test:** `  ✘   98 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (retry #2) (2.0s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #22

**Test:** `  ✘  105 [chromium] › tests/comprehensive-image-validator.spec.js:39:3 › Comprehensive Image Validator › should detect ALL broken images across the entire website with advanced validation (1.5m)`


---

### Failure #23

**Test:** `  ✘  107 [chromium] › tests/find-broken-images.spec.js:6:3 › Find All Broken Images › scan all pages for broken images (1.5m)`


---

### Failure #24

**Test:** `  ✘  108 [chromium] › tests/comprehensive-image-validator.spec.js:39:3 › Comprehensive Image Validator › should detect ALL broken images across the entire website with advanced validation (retry #1) (1.6m)`


---

### Failure #25

**Test:** `  ✘  109 [chromium] › tests/find-broken-images.spec.js:6:3 › Find All Broken Images › scan all pages for broken images (retry #1) (1.6m)`


---

### Failure #26

**Test:** `  ✘  110 [chromium] › tests/comprehensive-image-validator.spec.js:39:3 › Comprehensive Image Validator › should detect ALL broken images across the entire website with advanced validation (retry #2) (1.5m)`

**Error Details:**
```
    Test timeout of 90000ms exceeded.
    Test timeout of 90000ms exceeded.
    Test timeout of 90000ms exceeded.
    Test timeout of 90000ms exceeded.
    Error: page.goto: Test timeout of 90000ms exceeded.
    Test timeout of 90000ms exceeded.
    Error: page.evaluate: Test timeout of 90000ms exceeded.
    Test timeout of 90000ms exceeded.
    Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
    Error: page.evaluate: TypeError: t is not a function
```

---

### Failure #27

**Test:** `  ✘  111 [chromium] › tests/find-broken-images.spec.js:6:3 › Find All Broken Images › scan all pages for broken images (retry #2) (1.5m)`

**Error Details:**
```
    Test timeout of 90000ms exceeded.
    Error: page.goto: Test timeout of 90000ms exceeded.
    Test timeout of 90000ms exceeded.
    Error: page.evaluate: Test timeout of 90000ms exceeded.
    Test timeout of 90000ms exceeded.
    Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
```

---

### Failure #28

**Test:** `  ✘  114 [chromium] › tests/navigation-dropdown.spec.js:12:3 › Navigation Dropdown Menu › dropdown menus should display on hover (2.6s)`

**Error Details:**
```
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
```

---

### Failure #29

**Test:** `  ✘  115 [chromium] › tests/navigation-dropdown.spec.js:12:3 › Navigation Dropdown Menu › dropdown menus should display on hover (retry #1) (4.3s)`

**Error Details:**
```
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
```

---

### Failure #30

**Test:** `  ✘  116 [chromium] › tests/navigation-dropdown.spec.js:12:3 › Navigation Dropdown Menu › dropdown menus should display on hover (retry #2) (2.5s)`

**Error Details:**
```
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
```

---

### Failure #31

**Test:** `  ✘  120 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at mobile (375x667) (6.2s)`


---

### Failure #32

**Test:** `  ✘  121 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at mobile (375x667) (retry #1) (12.4s)`


---

### Failure #33

**Test:** `  ✘  122 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at mobile (375x667) (retry #2) (7.0s)`

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

### Failure #34

**Test:** `  ✘  123 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at tablet (768x1024) (6.9s)`


---

### Failure #35

**Test:** `  ✘  124 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at tablet (768x1024) (retry #1) (13.4s)`


---

### Failure #36

**Test:** `  ✘  125 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at desktop (1440x900) (8.8s)`

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

### Failure #37

**Test:** `  ✘  126 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at tablet (768x1024) (retry #2) (8.8s)`

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

### Failure #38

**Test:** `  ✘  127 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at desktop (1440x900) (retry #1) (16.4s)`


---

### Failure #39

**Test:** `  ✘  128 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at large (1920x1080) (10.2s)`


---

### Failure #40

**Test:** `  ✘  129 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at large (1920x1080) (retry #1) (15.9s)`


---

### Failure #41

**Test:** `  ✘  130 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at desktop (1440x900) (retry #2) (9.7s)`

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

### Failure #42

**Test:** `  ✘  132 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at large (1920x1080) (retry #2) (8.8s)`

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

### Failure #43

**Test:** `  ✘  134 [chromium] › visual/images.spec.js:41:3 › Image Visual Tests › All critical images load successfully (3.3s)`

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

### Failure #44

**Test:** `  ✘  136 [chromium] › visual/images.spec.js:41:3 › Image Visual Tests › All critical images load successfully (retry #1) (5.3s)`

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

### Failure #45

**Test:** `  ✘  137 [chromium] › visual/images.spec.js:65:3 › Image Visual Tests › Visual regression - Homepage screenshots (14.2s)`

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

### Failure #46

**Test:** `  ✘  138 [chromium] › visual/images.spec.js:41:3 › Image Visual Tests › All critical images load successfully (retry #2) (3.6s)`

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

### Failure #47

**Test:** `  ✘  140 [chromium] › visual/images.spec.js:91:3 › Image Visual Tests › Images display correctly at different viewport sizes (5.0s)`

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

### Failure #48

**Test:** `  ✘  141 [chromium] › visual/images.spec.js:65:3 › Image Visual Tests › Visual regression - Homepage screenshots (retry #1) (18.3s)`

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

### Failure #49

**Test:** `  ✘  142 [chromium] › visual/images.spec.js:91:3 › Image Visual Tests › Images display correctly at different viewport sizes (retry #1) (8.7s)`

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

### Failure #50

**Test:** `  ✘  143 [chromium] › visual/images.spec.js:91:3 › Image Visual Tests › Images display correctly at different viewport sizes (retry #2) (5.0s)`

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

### Failure #51

**Test:** `  ✘  144 [chromium] › visual/images.spec.js:65:3 › Image Visual Tests › Visual regression - Homepage screenshots (retry #2) (13.8s)`

**Error Details:**
```
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
```

---

### Failure #52

**Test:** `  ✘  172 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (1.9s)`

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

### Failure #53

**Test:** `  ✘  173 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (1.7s)`

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

### Failure #54

**Test:** `  ✘  174 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (retry #1) (4.0s)`

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

### Failure #55

**Test:** `  ✘  175 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (retry #1) (3.7s)`

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

### Failure #56

**Test:** `  ✘  176 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (retry #2) (2.0s)`

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

### Failure #57

**Test:** `  ✘  177 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (retry #2) (1.9s)`

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

### Failure #58

**Test:** `  ✘  178 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (2.1s)`

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

### Failure #59

**Test:** `  ✘  180 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (1.4s)`

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

### Failure #60

**Test:** `  ✘  181 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (retry #1) (3.6s)`

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

### Failure #61

**Test:** `  ✘  182 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (retry #1) (3.5s)`

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

### Failure #62

**Test:** `  ✘  183 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (retry #2) (2.0s)`

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

### Failure #63

**Test:** `  ✘  184 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (retry #2) (1.6s)`

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

### Failure #64

**Test:** `  ✘  185 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (1.9s)`

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

### Failure #65

**Test:** `  ✘  187 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (retry #1) (4.1s)`

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

### Failure #66

**Test:** `  ✘  188 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (retry #2) (2.3s)`

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
  ✓    1 [chromium] › accessibility/button-hover-contrast.spec.js:137:3 › Button Hover State Accessibility › Learn More button hover contrast on homepage (3.5s)
  ✓    2 [chromium] › accessibility/button-hover-contrast.spec.js:9:3 › Button Hover State Accessibility › All button hover states maintain proper contrast (6.2s)
  ✓    3 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (6.0s)
  ✓    4 [chromium] › accessibility/wcag-compliance.spec.js:36:3 › WCAG Accessibility Compliance › About page passes accessibility checks (4.3s)
  ✓    5 [chromium] › accessibility/wcag-compliance.spec.js:61:3 › WCAG Accessibility Compliance › All images have alt text (3.0s)
  ✓    6 [chromium] › accessibility/wcag-compliance.spec.js:87:3 › WCAG Accessibility Compliance › All form inputs have labels (2.3s)
  ✓    7 [chromium] › accessibility/wcag-compliance.spec.js:130:3 › WCAG Accessibility Compliance › Keyboard navigation works correctly (2.9s)
  ✓    9 [chromium] › accessibility/wcag-compliance.spec.js:198:3 › WCAG Accessibility Compliance › Page has proper heading hierarchy (3.3s)
  ✓   10 [chromium] › accessibility/wcag-compliance.spec.js:263:3 › WCAG Accessibility Compliance › ARIA landmarks are properly used (3.2s)
  ✓    8 [chromium] › accessibility/wcag-compliance.spec.js:157:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (9.9s)
  ✓   11 [chromium] › accessibility/wcag-compliance.spec.js:303:3 › WCAG Accessibility Compliance › Focus trap in modals works correctly (3.0s)
  ✓   13 [chromium] › assets.spec.js:47:3 › Asset Verification Tests › AssureDefi image size check (3.3s)
  ✓   15 [chromium] › assets.spec.js:86:3 › Asset Verification Tests › Blockchain Founders Group image test (2.7s)
  ✓   14 [chromium] › assets.spec.js:66:3 › Asset Verification Tests › Tokenomics image test (4.2s)
  ✓   16 [chromium] › assets.spec.js:99:5 › Asset Verification Tests › Layout test on Desktop (3.5s)
  ✓   17 [chromium] › assets.spec.js:99:5 › Asset Verification Tests › Layout test on Tablet (3.2s)
  ✓   18 [chromium] › assets.spec.js:99:5 › Asset Verification Tests › Layout test on Mobile (2.5s)
  ✓   20 [chromium] › e2e/navigation.spec.js:38:3 › Navigation Tests › Industry dropdown navigation works (5.9s)
  ✓   21 [chromium] › e2e/navigation.spec.js:80:3 › Navigation Tests › Footer navigation links work (6.2s)
✓ 404 handling is working correctly for static site
[1A✓ 404 handling is working correctly for static site
  ✓   23 [chromium] › e2e/navigation.spec.js:243:3 › Navigation Tests › 404 page handles non-existent routes (327ms)
  ✓   22 [chromium] › e2e/navigation.spec.js:207:3 › Navigation Tests › Logo click returns to homepage (3.6s)
  ✓   26 [chromium] › image-validation.spec.js:52:3 › Image Files and CSS Validation › Check image files exist in build directory (18ms)
  ✓   27 [chromium] › image-validation.spec.js:77:3 › Image Files and CSS Validation › Check CSS classes are defined with proper rules (26ms)
  ✓   28 [chromium] › image-validation.spec.js:150:3 › Image Files and CSS Validation › Check HTML for problematic attributes (4ms)
  ✓   24 [chromium] › e2e/navigation.spec.js:288:3 › Navigation Tests › All marketplace products are accessible (5.5s)
[1A[30/154] [chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images
  ✘   29 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (10.6s)
✅ No 404 errors detected for images
[1A[chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images
✅ No 404 errors detected for images
  ✓   30 [chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images (7.9s)
  ✓   32 [chromium] › image-validation.spec.js:499:3 › Image Visibility on Live Page › Take screenshots for visual verification (6.7s)
  ✓   33 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (4.6s)
  ✘   31 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #1) (13.4s)
  ✓   34 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (4.9s)
  ✓   36 [chromium] › image-visibility-index.spec.js:157:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (4.4s)
  ✘   35 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (10.0s)
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
  ✓   38 [chromium] › image-visibility-index.spec.js:262:3 › Image Visibility on Index Page › Check for CSS conflicts (4.5s)
  ✘   37 [chromium] › image-visibility-index.spec.js:214:3 › Image Visibility on Index Page › Tokenomics Image visibility (14.6s)
  ✓   39 [chromium] › image-visibility-index.spec.js:307:3 › Image Visibility on Index Page › Visual regression test - take screenshots (5.7s)
  ✓   40 [chromium] › image-visibility-index.spec.js:332:3 › Image Visibility on Index Page › Check image loading performance (5.9s)
  ✓   42 [chromium] › image-visibility.spec.js:5:3 › Image Visibility Tests › Check AssureDefi image is visible and loads correctly (2.9s)
  ✓   43 [chromium] › image-visibility.spec.js:48:3 › Image Visibility Tests › Check Tokenomics image is visible and loads correctly (3.3s)
  ✓   44 [chromium] › image-visibility.spec.js:82:3 › Image Visibility Tests › Check BFG image is visible and loads correctly (2.4s)
  ✓   45 [chromium] › image-visibility.spec.js:113:3 › Image Visibility Tests › Industry cards have visible background images and text (4.1s)
  ✓   46 [chromium] › image-visibility.spec.js:159:3 › Image Visibility Tests › Check all critical image HTTP responses (184ms)
  ✘   41 [chromium] › image-visibility-index.spec.js:214:3 › Image Visibility on Index Page › Tokenomics Image visibility (retry #1) (17.5s)
Partner logos screenshot saved to test-results/partner-logos.png
Partner logos screenshot saved to test-results/partner-logos.png
Tokenomics screenshot saved to test-results/tokenomics.png
Tokenomics screenshot saved to test-results/tokenomics.png
Industry cards screenshot saved to test-results/industry-cards.png
[1AIndustry cards screenshot saved to test-results/industry-cards.png
  ✓   47 [chromium] › image-visibility.spec.js:185:3 › Image Visibility Tests › Screenshot critical areas for manual inspection (4.8s)
  ✓   49 [chromium] › performance/core-web-vitals.spec.js:4:3 › Core Web Vitals Tests › Measure Largest Contentful Paint (LCP) (1.8s)
  ✓   50 [chromium] › performance/core-web-vitals.spec.js:21:3 › Core Web Vitals Tests › Measure First Input Delay (FID) (1.8s)
  ✓   51 [chromium] › performance/core-web-vitals.spec.js:45:3 › Core Web Vitals Tests › Measure Cumulative Layout Shift (CLS) (5.1s)
  ✓   52 [chromium] › performance/core-web-vitals.spec.js:68:3 › Core Web Vitals Tests › Page load performance metrics (2.1s)
  ✘   48 [chromium] › image-visibility-index.spec.js:214:3 › Image Visibility on Index Page › Tokenomics Image visibility (retry #2) (14.6s)
    Error: expect(locator).toBeVisible() failed
        14 × locator resolved to <img loading="lazy" alt="$BWS Token Allocation" class="image-token-allocation" src="/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png"/>
           - unexpected value "hidden"
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:221:30
    test-results/image-visibility-index-Ima-f43cc-Tokenomics-Image-visibility-chromium/test-failed-1.png
    Error Context: test-results/image-visibility-index-Ima-f43cc-Tokenomics-Image-visibility-chromium/error-context.md
    Error: expect(locator).toBeVisible() failed
        14 × locator resolved to <img loading="lazy" alt="$BWS Token Allocation" class="image-token-allocation" src="/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png"/>
           - unexpected value "hidden"
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:221:30
    test-results/image-visibility-index-Ima-f43cc-Tokenomics-Image-visibility-chromium-retry1/test-failed-1.png
    Error Context: test-results/image-visibility-index-Ima-f43cc-Tokenomics-Image-visibility-chromium-retry1/error-context.md
    test-results/image-visibility-index-Ima-f43cc-Tokenomics-Image-visibility-chromium-retry1/trace.zip
        npx playwright show-trace test-results/image-visibility-index-Ima-f43cc-Tokenomics-Image-visibility-chromium-retry1/trace.zip
    Error: expect(locator).toBeVisible() failed
        14 × locator resolved to <img loading="lazy" alt="$BWS Token Allocation" class="image-token-allocation" src="/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png"/>
           - unexpected value "hidden"
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:221:30
    test-results/image-visibility-index-Ima-f43cc-Tokenomics-Image-visibility-chromium-retry2/test-failed-1.png
    Error Context: test-results/image-visibility-index-Ima-f43cc-Tokenomics-Image-visibility-chromium-retry2/error-context.md
  ✓   53 [chromium] › performance/core-web-vitals.spec.js:88:3 › Core Web Vitals Tests › Resource loading performance (2.6s)
  ✓   55 [chromium] › smoke/basic.spec.js:4:3 › Basic Smoke Tests › Homepage loads successfully (2.5s)
  ✓   54 [chromium] › performance/core-web-vitals.spec.js:110:3 › Core Web Vitals Tests › Bundle size check (2.9s)
  ✓   56 [chromium] › smoke/basic.spec.js:10:3 › Basic Smoke Tests › About page loads successfully (1.3s)
  ✓   57 [chromium] › smoke/basic.spec.js:17:3 › Basic Smoke Tests › Contact page loads successfully (1.6s)
  ✓   58 [chromium] › smoke/basic.spec.js:23:3 › Basic Smoke Tests › Industries page loads successfully (1.0s)
  ✓   59 [chromium] › smoke/basic.spec.js:30:3 › Basic Smoke Tests › CSS loads successfully (684ms)
  ✓   60 [chromium] › smoke/basic.spec.js:35:3 › Basic Smoke Tests › Images directory is accessible (478ms)
  ✓   61 [chromium] › smoke/critical-paths.spec.js:4:3 › Critical Path Smoke Tests › Homepage loads successfully (2.4s)
  ✓   62 [chromium] › smoke/critical-paths.spec.js:14:3 › Critical Path Smoke Tests › Critical CSS and JS files load (2.7s)
[1A[64/154] [chromium] › smoke/critical-paths.spec.js:52:3 › Critical Path Smoke Tests › No console errors on homepage
  ✓   64 [chromium] › smoke/critical-paths.spec.js:52:3 › Critical Path Smoke Tests › No console errors on homepage (2.5s)
  ✓   63 [chromium] › smoke/critical-paths.spec.js:30:3 › Critical Path Smoke Tests › Main navigation pages are accessible (3.4s)
[1A[66/154] [chromium] › smoke/critical-paths.spec.js:90:3 › Critical Path Smoke Tests › Images load without 404 errors
  ✓   65 [chromium] › smoke/critical-paths.spec.js:78:3 › Critical Path Smoke Tests › Contact page loads successfully (1.6s)
  ✓   66 [chromium] › smoke/critical-paths.spec.js:90:3 › Critical Path Smoke Tests › Images load without 404 errors (2.8s)
  ✓   67 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Homepage has valid HTML5 structure (2.4s)
  ✓   68 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › About has valid HTML5 structure (1.4s)
  ✓   69 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Contact Us has valid HTML5 structure (1.5s)
  ✓   70 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal Notice has valid HTML5 structure (1.7s)
  ✓   71 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Privacy Policy has valid HTML5 structure (1.6s)
  ✓   72 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Industries has valid HTML5 structure (1.4s)
  ✓   73 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Resources has valid HTML5 structure (1.4s)
  ✓   74 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Database Immutable has valid HTML5 structure (1.6s)
  ✓   75 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Database Mutable has valid HTML5 structure (1.6s)
  ✓   76 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › IPFS Upload has valid HTML5 structure (1.6s)
  ✓   77 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › NFT Zero Knowledge has valid HTML5 structure (1.5s)
  ✓   78 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › NFT GameCube has valid HTML5 structure (1.7s)
  ✓   79 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Blockchain Badges has valid HTML5 structure (1.6s)
  ✓   80 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › ESG Credits has valid HTML5 structure (1.7s)
  ✓   81 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Telegram XBot has valid HTML5 structure (1.6s)
  ✘   82 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (1.9s)
  ✘   83 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (1.6s)
  ✘   84 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (retry #1) (3.5s)
  ✘   85 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (retry #1) (3.7s)
  ✘   86 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (retry #2) (1.9s)
    Error: expect(received).toBeTruthy()
        at /home/runner/work/bws-website-front/bws-website-front/tests/smoke/html-structure-validation.spec.js:62:21
    test-results/smoke-html-structure-valid-23fae-s-has-valid-HTML5-structure-chromium/test-failed-1.png
    Error Context: test-results/smoke-html-structure-valid-23fae-s-has-valid-HTML5-structure-chromium/error-context.md
    Error: expect(received).toBeTruthy()
        at /home/runner/work/bws-website-front/bws-website-front/tests/smoke/html-structure-validation.spec.js:62:21
    test-results/smoke-html-structure-valid-23fae-s-has-valid-HTML5-structure-chromium-retry1/test-failed-1.png
    Error Context: test-results/smoke-html-structure-valid-23fae-s-has-valid-HTML5-structure-chromium-retry1/error-context.md
```
</details>
