# Test Failure Report - Fix Branch

**Generated:** 2025-10-06 12:42:52 UTC
**Branch:** fix/test-failures-2025-09-28T15-58-27-e2206f4
**Commit:** 3c995f3c139f4bf00a2b4f575af43fb467b193a7
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18280831670)

## 🔁 Recurring Issues Analysis

Comparing with previous reports:
- BRANCH_ISSUES_06-10-07.md
- BRANCH_ISSUES_06-10-08.md
- BRANCH_ISSUES_06-10-09.md
- BRANCH_ISSUES_06-10-10.md
- BRANCH_ISSUES_06-10-11.md

### Known Recurring Issues:
✅ No recurring issues detected. All failures appear to be new or infrequent.

## Test Results
### 📊 Test Statistics
- **Total Tests:** 136
- **✅ Passed:** 118
- **❌ Failed:** 12
- **⚠️ Flaky:** 1
- **⏭ Skipped:** 5
- **⏱ Duration:** 710995.008ms

### 🔴 Failed Tests Summary

## 🔍 Enhanced Error Diagnostics

No enhanced diagnostics available - diagnostics directory not created.

_This is expected if no tests failed or error-reporting functions weren't called._

## 📋 Detailed Test Failures

### Failure #1

**Test:** `  ✘   29 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (10.2s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(locator).toBeVisible() failed
```

**Screenshot:** ![Screenshot](snapshots/failure-1-test-failed-1.png)
*(Original path: `test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png`)*

---

### Failure #2

**Test:** `  ✘   32 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #1) (13.6s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
```

**Screenshot:** ![Screenshot](snapshots/failure-2-test-failed-1.png)
*(Original path: `test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png`)*

---

### Failure #3

**Test:** `  ✘   36 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (11.1s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
```

**Screenshot:** ![Screenshot](snapshots/failure-3-test-failed-1.png)
*(Original path: `test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png`)*

---

### Failure #4

**Test:** `  ✘   37 [chromium] › image-visibility-index.spec.js:214:3 › Image Visibility on Index Page › Tokenomics Image visibility (15.4s)`

**Error Details:**
```
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
```

**Screenshot:** ![Screenshot](snapshots/failure-4-test-failed-1.png)
*(Original path: `test-results/image-visibility-index-Ima-4a16e-k-image-loading-performance-chromium/test-failed-1.png`)*

---

### Failure #5

**Test:** `  ✘   40 [chromium] › image-visibility-index.spec.js:214:3 › Image Visibility on Index Page › Tokenomics Image visibility (retry #1) (18.2s)`

**Error Details:**
```
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
```

**Screenshot:** ![Screenshot](snapshots/failure-5-test-failed-1.png)
*(Original path: `test-results/image-visibility-index-Ima-4a16e-k-image-loading-performance-chromium/test-failed-1.png`)*

---

### Failure #6

**Test:** `  ✘   41 [chromium] › image-visibility-index.spec.js:332:3 › Image Visibility on Index Page › Check image loading performance (6.0s)`

**Error Details:**
```
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
```

**Screenshot:** ![Screenshot](snapshots/failure-6-test-failed-1.png)
*(Original path: `test-results/image-visibility-index-Ima-4a16e-k-image-loading-performance-chromium/test-failed-1.png`)*

---

### Failure #7

**Test:** `  ✘   43 [chromium] › image-visibility-index.spec.js:214:3 › Image Visibility on Index Page › Tokenomics Image visibility (retry #2) (15.1s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
    Error: expect(locator).toBeVisible() failed
           - unexpected value "hidden"
```

**Screenshot:** ![Screenshot](snapshots/failure-7-test-failed-1.png)
*(Original path: `test-results/image-visibility-index-Ima-4a16e-k-image-loading-performance-chromium/test-failed-1.png`)*

---

### Failure #8

**Test:** `  ✘   96 [chromium] › tests/comprehensive-image-validator.spec.js:39:3 › Comprehensive Image Validator › should detect ALL broken images across the entire website with advanced validation (1.5m)`


---

### Failure #9

**Test:** `  ✘   98 [chromium] › tests/find-broken-images.spec.js:6:3 › Find All Broken Images › scan all pages for broken images (1.5m)`


---

### Failure #10

**Test:** `  ✘   99 [chromium] › tests/comprehensive-image-validator.spec.js:39:3 › Comprehensive Image Validator › should detect ALL broken images across the entire website with advanced validation (retry #1) (1.6m)`


---

### Failure #11

**Test:** `  ✘  100 [chromium] › tests/find-broken-images.spec.js:6:3 › Find All Broken Images › scan all pages for broken images (retry #1) (1.6m)`


---

### Failure #12

**Test:** `  ✘  101 [chromium] › tests/comprehensive-image-validator.spec.js:39:3 › Comprehensive Image Validator › should detect ALL broken images across the entire website with advanced validation (retry #2) (1.5m)`

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
    Error: page.goto: Test timeout of 90000ms exceeded.
    Error: page.evaluate: TypeError: t is not a function
```

---

### Failure #13

**Test:** `  ✘  102 [chromium] › tests/find-broken-images.spec.js:6:3 › Find All Broken Images › scan all pages for broken images (retry #2) (1.5m)`

**Error Details:**
```
    Test timeout of 90000ms exceeded.
    Error: page.goto: Test timeout of 90000ms exceeded.
    Test timeout of 90000ms exceeded.
    Error: page.evaluate: Test timeout of 90000ms exceeded.
    Test timeout of 90000ms exceeded.
    Error: page.goto: Test timeout of 90000ms exceeded.
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
```

---

### Failure #14

**Test:** `  ✘  105 [chromium] › tests/navigation-dropdown.spec.js:12:3 › Navigation Dropdown Menu › dropdown menus should display on hover (2.5s)`

**Error Details:**
```
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
```

---

### Failure #15

**Test:** `  ✘  106 [chromium] › tests/navigation-dropdown.spec.js:12:3 › Navigation Dropdown Menu › dropdown menus should display on hover (retry #1) (4.2s)`

**Error Details:**
```
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
```

---

### Failure #16

**Test:** `  ✘  107 [chromium] › tests/navigation-dropdown.spec.js:12:3 › Navigation Dropdown Menu › dropdown menus should display on hover (retry #2) (2.5s)`

**Error Details:**
```
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
    Error: page.evaluate: TypeError: t is not a function
```

---

### Failure #17

**Test:** `  ✘  111 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at mobile (375x667) (6.1s)`


---

### Failure #18

**Test:** `  ✘  112 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at mobile (375x667) (retry #1) (13.5s)`


---

### Failure #19

**Test:** `  ✘  113 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at mobile (375x667) (retry #2) (7.0s)`

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

### Failure #20

**Test:** `  ✘  114 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at tablet (768x1024) (7.4s)`


---

### Failure #21

**Test:** `  ✘  115 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at tablet (768x1024) (retry #1) (16.0s)`


---

### Failure #22

**Test:** `  ✘  116 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at desktop (1440x900) (9.2s)`


---

### Failure #23

**Test:** `  ✘  117 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at desktop (1440x900) (retry #1) (17.6s)`


---

### Failure #24

**Test:** `  ✘  118 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at tablet (768x1024) (retry #2) (10.3s)`

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

### Failure #25

**Test:** `  ✘  119 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at large (1920x1080) (9.7s)`


---

### Failure #26

**Test:** `  ✘  120 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at desktop (1440x900) (retry #2) (10.1s)`

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

### Failure #27

**Test:** `  ✘  121 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at large (1920x1080) (retry #1) (17.3s)`


---

### Failure #28

**Test:** `  ✘  124 [chromium] › visual/images.spec.js:41:3 › Image Visual Tests › All critical images load successfully (3.0s)`


---

### Failure #29

**Test:** `  ✘  125 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at large (1920x1080) (retry #2) (10.1s)`

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

### Failure #30

**Test:** `  ✘  126 [chromium] › visual/images.spec.js:41:3 › Image Visual Tests › All critical images load successfully (retry #1) (5.8s)`

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

### Failure #31

**Test:** `  ✘  127 [chromium] › visual/images.spec.js:41:3 › Image Visual Tests › All critical images load successfully (retry #2) (3.4s)`

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

### Failure #32

**Test:** `  ✘  129 [chromium] › visual/images.spec.js:65:3 › Image Visual Tests › Visual regression - Homepage screenshots (14.6s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #33

**Test:** `  ✘  131 [chromium] › visual/images.spec.js:91:3 › Image Visual Tests › Images display correctly at different viewport sizes (5.4s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #34

**Test:** `  ✘  132 [chromium] › visual/images.spec.js:91:3 › Image Visual Tests › Images display correctly at different viewport sizes (retry #1) (8.8s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #35

**Test:** `  ✘  133 [chromium] › visual/images.spec.js:65:3 › Image Visual Tests › Visual regression - Homepage screenshots (retry #1) (12.9s)`

**Error Details:**
```
    Error: expect(locator).toBeVisible() failed
          - unexpected value "hidden"
```

---

### Failure #36

**Test:** `  ✘  134 [chromium] › visual/images.spec.js:91:3 › Image Visual Tests › Images display correctly at different viewport sizes (retry #2) (5.1s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

## 📄 Raw Test Output

<details>
<summary>Click to expand full test output (cleaned)</summary>

```
Running 154 tests using 2 workers
Running 154 tests using 2 workers
  ✓    2 [chromium] › accessibility/button-hover-contrast.spec.js:137:3 › Button Hover State Accessibility › Learn More button hover contrast on homepage (3.1s)
  ✓    1 [chromium] › accessibility/button-hover-contrast.spec.js:9:3 › Button Hover State Accessibility › All button hover states maintain proper contrast (6.5s)
  ✓    3 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (5.7s)
  ✓    4 [chromium] › accessibility/wcag-compliance.spec.js:36:3 › WCAG Accessibility Compliance › About page passes accessibility checks (3.8s)
  ✓    5 [chromium] › accessibility/wcag-compliance.spec.js:61:3 › WCAG Accessibility Compliance › All images have alt text (2.3s)
  ✓    6 [chromium] › accessibility/wcag-compliance.spec.js:87:3 › WCAG Accessibility Compliance › All form inputs have labels (1.9s)
  ✓    7 [chromium] › accessibility/wcag-compliance.spec.js:130:3 › WCAG Accessibility Compliance › Keyboard navigation works correctly (2.6s)
  ✓    9 [chromium] › accessibility/wcag-compliance.spec.js:198:3 › WCAG Accessibility Compliance › Page has proper heading hierarchy (2.7s)
  ✓   10 [chromium] › accessibility/wcag-compliance.spec.js:263:3 › WCAG Accessibility Compliance › ARIA landmarks are properly used (2.6s)
  ✓    8 [chromium] › accessibility/wcag-compliance.spec.js:157:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (8.3s)
  ✓   11 [chromium] › accessibility/wcag-compliance.spec.js:303:3 › WCAG Accessibility Compliance › Focus trap in modals works correctly (2.4s)
  ✓   13 [chromium] › assets.spec.js:47:3 › Asset Verification Tests › AssureDefi image size check (3.0s)
  ✓   14 [chromium] › assets.spec.js:66:3 › Asset Verification Tests › Tokenomics image test (3.3s)
  ✓   15 [chromium] › assets.spec.js:86:3 › Asset Verification Tests › Blockchain Founders Group image test (2.3s)
  ✓   16 [chromium] › assets.spec.js:99:5 › Asset Verification Tests › Layout test on Desktop (2.8s)
  ✓   17 [chromium] › assets.spec.js:99:5 › Asset Verification Tests › Layout test on Tablet (2.3s)
  ✓   18 [chromium] › assets.spec.js:99:5 › Asset Verification Tests › Layout test on Mobile (2.3s)
  ✓   20 [chromium] › e2e/navigation.spec.js:38:3 › Navigation Tests › Industry dropdown navigation works (5.1s)
  ✓   21 [chromium] › e2e/navigation.spec.js:80:3 › Navigation Tests › Footer navigation links work (4.9s)
✓ 404 handling is working correctly for static site
[1A✓ 404 handling is working correctly for static site
  ✓   23 [chromium] › e2e/navigation.spec.js:243:3 › Navigation Tests › 404 page handles non-existent routes (313ms)
  ✓   22 [chromium] › e2e/navigation.spec.js:207:3 › Navigation Tests › Logo click returns to homepage (3.1s)
  ✓   26 [chromium] › image-validation.spec.js:52:3 › Image Files and CSS Validation › Check image files exist in build directory (12ms)
  ✓   27 [chromium] › image-validation.spec.js:77:3 › Image Files and CSS Validation › Check CSS classes are defined with proper rules (24ms)
  ✓   28 [chromium] › image-validation.spec.js:150:3 › Image Files and CSS Validation › Check HTML for problematic attributes (15ms)
  ✓   24 [chromium] › e2e/navigation.spec.js:288:3 › Navigation Tests › All marketplace products are accessible (4.6s)
[1A[30/154] [chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images
✅ No 404 errors detected for images
[1A[chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images
✅ No 404 errors detected for images
  ✘   29 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (10.2s)
  ✓   30 [chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images (7.2s)
  ✓   31 [chromium] › image-validation.spec.js:499:3 › Image Visibility on Live Page › Take screenshots for visual verification (5.9s)
  ✓   33 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (4.7s)
  ✓   34 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (4.7s)
  ✘   32 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #1) (13.6s)
  ✓   35 [chromium] › image-visibility-index.spec.js:157:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (5.1s)
  ✘   36 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (11.1s)
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
  ✘   37 [chromium] › image-visibility-index.spec.js:214:3 › Image Visibility on Index Page › Tokenomics Image visibility (15.4s)
  ✓   38 [chromium] › image-visibility-index.spec.js:262:3 › Image Visibility on Index Page › Check for CSS conflicts (5.1s)
  ✓   39 [chromium] › image-visibility-index.spec.js:307:3 › Image Visibility on Index Page › Visual regression test - take screenshots (7.4s)
❌ Image failed to load: 670f916b2f60627d5201850b_shutterstock_1108417201-transcode.mp4
❌ Image failed to load: 670f916b2f60627d5201850b_shutterstock_1108417201-transcode.mp4
  ✘   41 [chromium] › image-visibility-index.spec.js:332:3 › Image Visibility on Index Page › Check image loading performance (6.0s)
  ✘   40 [chromium] › image-visibility-index.spec.js:214:3 › Image Visibility on Index Page › Tokenomics Image visibility (retry #1) (18.2s)
  ✓   42 [chromium] › image-visibility-index.spec.js:332:3 › Image Visibility on Index Page › Check image loading performance (retry #1) (7.9s)
    Error: expect(received).toBe(expected) // Object.is equality
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:364:26
    test-results/image-visibility-index-Ima-4a16e-k-image-loading-performance-chromium/test-failed-1.png
    Error Context: test-results/image-visibility-index-Ima-4a16e-k-image-loading-performance-chromium/error-context.md
  ✓   44 [chromium] › image-visibility.spec.js:5:3 › Image Visibility Tests › Check AssureDefi image is visible and loads correctly (2.9s)
  ✓   45 [chromium] › image-visibility.spec.js:48:3 › Image Visibility Tests › Check Tokenomics image is visible and loads correctly (3.1s)
  ✓   46 [chromium] › image-visibility.spec.js:82:3 › Image Visibility Tests › Check BFG image is visible and loads correctly (2.3s)
  ✓   47 [chromium] › image-visibility.spec.js:113:3 › Image Visibility Tests › Industry cards have visible background images and text (3.5s)
  ✓   48 [chromium] › image-visibility.spec.js:159:3 › Image Visibility Tests › Check all critical image HTTP responses (162ms)
  ✘   43 [chromium] › image-visibility-index.spec.js:214:3 › Image Visibility on Index Page › Tokenomics Image visibility (retry #2) (15.1s)
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
Partner logos screenshot saved to test-results/partner-logos.png
Partner logos screenshot saved to test-results/partner-logos.png
Tokenomics screenshot saved to test-results/tokenomics.png
Tokenomics screenshot saved to test-results/tokenomics.png
  ✓   50 [chromium] › performance/core-web-vitals.spec.js:4:3 › Core Web Vitals Tests › Measure Largest Contentful Paint (LCP) (1.4s)
Industry cards screenshot saved to test-results/industry-cards.png
[1AIndustry cards screenshot saved to test-results/industry-cards.png
  ✓   49 [chromium] › image-visibility.spec.js:185:3 › Image Visibility Tests › Screenshot critical areas for manual inspection (4.8s)
  ✓   51 [chromium] › performance/core-web-vitals.spec.js:21:3 › Core Web Vitals Tests › Measure First Input Delay (FID) (2.4s)
  ✓   53 [chromium] › performance/core-web-vitals.spec.js:68:3 › Core Web Vitals Tests › Page load performance metrics (2.2s)
  ✓   52 [chromium] › performance/core-web-vitals.spec.js:45:3 › Core Web Vitals Tests › Measure Cumulative Layout Shift (CLS) (5.6s)
  ✓   54 [chromium] › performance/core-web-vitals.spec.js:88:3 › Core Web Vitals Tests › Resource loading performance (2.3s)
  ✓   55 [chromium] › performance/core-web-vitals.spec.js:110:3 › Core Web Vitals Tests › Bundle size check (2.9s)
  ✓   56 [chromium] › smoke/basic.spec.js:4:3 › Basic Smoke Tests › Homepage loads successfully (2.3s)
  ✓   57 [chromium] › smoke/basic.spec.js:10:3 › Basic Smoke Tests › About page loads successfully (1.3s)
  ✓   58 [chromium] › smoke/basic.spec.js:17:3 › Basic Smoke Tests › Contact page loads successfully (1.3s)
  ✓   60 [chromium] › smoke/basic.spec.js:30:3 › Basic Smoke Tests › CSS loads successfully (771ms)
  ✓   59 [chromium] › smoke/basic.spec.js:23:3 › Basic Smoke Tests › Industries page loads successfully (1.0s)
  ✓   61 [chromium] › smoke/basic.spec.js:35:3 › Basic Smoke Tests › Images directory is accessible (577ms)
  ✓   62 [chromium] › smoke/critical-paths.spec.js:4:3 › Critical Path Smoke Tests › Homepage loads successfully (2.3s)
  ✓   63 [chromium] › smoke/critical-paths.spec.js:14:3 › Critical Path Smoke Tests › Critical CSS and JS files load (2.7s)
[1A[65/154] [chromium] › smoke/critical-paths.spec.js:52:3 › Critical Path Smoke Tests › No console errors on homepage
  ✓   65 [chromium] › smoke/critical-paths.spec.js:52:3 › Critical Path Smoke Tests › No console errors on homepage (2.5s)
  ✓   64 [chromium] › smoke/critical-paths.spec.js:30:3 › Critical Path Smoke Tests › Main navigation pages are accessible (3.7s)
[1A[67/154] [chromium] › smoke/critical-paths.spec.js:90:3 › Critical Path Smoke Tests › Images load without 404 errors
  ✓   66 [chromium] › smoke/critical-paths.spec.js:78:3 › Critical Path Smoke Tests › Contact page loads successfully (1.5s)
  ✓   67 [chromium] › smoke/critical-paths.spec.js:90:3 › Critical Path Smoke Tests › Images load without 404 errors (2.7s)
  ✓   68 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Homepage has valid HTML5 structure (2.3s)
  ✓   69 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › About has valid HTML5 structure (1.3s)
  ✓   70 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Contact Us has valid HTML5 structure (1.4s)
  ✓   71 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal Notice has valid HTML5 structure (1.6s)
  ✓   72 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Privacy Policy has valid HTML5 structure (1.5s)
  ✓   73 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Industries has valid HTML5 structure (1.3s)
  ✓   74 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Resources has valid HTML5 structure (1.3s)
  ✓   75 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Database Immutable has valid HTML5 structure (1.6s)
  ✓   76 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Database Mutable has valid HTML5 structure (1.6s)
  ✓   77 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › IPFS Upload has valid HTML5 structure (1.5s)
  ✓   78 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › NFT Zero Knowledge has valid HTML5 structure (1.5s)
  ✓   79 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › NFT GameCube has valid HTML5 structure (1.4s)
  ✓   80 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Blockchain Badges has valid HTML5 structure (1.5s)
  ✓   81 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › ESG Credits has valid HTML5 structure (1.6s)
  ✓   82 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Telegram XBot has valid HTML5 structure (1.6s)
  ✓   83 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (1.6s)
  ✓   84 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (1.6s)
  ✓   85 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (1.9s)
  ✓   86 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › ESG has valid HTML5 structure (1.6s)
  ✓   87 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (1.4s)
  ✓   88 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (1.6s)
```
</details>
