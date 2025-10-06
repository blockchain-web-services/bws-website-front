# Test Failure Report - Fix Branch

**Generated:** 2025-10-06 14:09:21 UTC
**Branch:** fix/test-failures-2025-09-28T15-58-27-e2206f4
**Commit:** 252640630772ec68d6f5907925f1409fd5aa6161
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18283296592)

## 🔁 Recurring Issues Analysis

Comparing with previous reports:
- BRANCH_ISSUES_06-10-12.md
- BRANCH_ISSUES_06-10-13.md
- BRANCH_ISSUES_29-09-13.md
- BRANCH_ISSUES_29-09-16.md
- BRANCH_ISSUES_29-09-17.md

### Known Recurring Issues:
- ⚠️ **WCAG Color Contrast Failures** (wcag-compliance.spec.js)
  - Appears in 3 of last 5 reports
  - Error: Color contrast violations not meeting WCAG AA 4.5:1 or AAA 3:1 standards

## Test Results
### 📊 Test Statistics
- **Total Tests:** 140
- **✅ Passed:** 126
- **❌ Failed:** 4
- **⚠️ Flaky:** 0
- **⏭ Skipped:** 10
- **⏱ Duration:** 708184.582ms

### 🔴 Failed Tests Summary

## 🔍 Enhanced Error Diagnostics

No enhanced diagnostics available - diagnostics directory not created.

_This is expected if no tests failed or error-reporting functions weren't called._

## 📋 Detailed Test Failures

### Failure #1

**Test:** `  ✘   91 [chromium] › tests/comprehensive-image-validator.spec.js:39:3 › Comprehensive Image Validator › should detect ALL broken images across the entire website with advanced validation (3.0m)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(page).toHaveScreenshot(expected) failed
```

---

### Failure #2

**Test:** `  ✘   95 [chromium] › tests/comprehensive-image-validator.spec.js:39:3 › Comprehensive Image Validator › should detect ALL broken images across the entire website with advanced validation (retry #1) (3.2m)`

**Error Details:**
```
  ⚠️ Error checking page: page.waitForTimeout: Test timeout of 180000ms exceeded.
[1A  ⚠️ Error checking page: page.waitForTimeout: Test timeout of 180000ms exceeded.
    Test timeout of 180000ms exceeded.
    Test timeout of 180000ms exceeded.
    Test timeout of 180000ms exceeded.
```

---

### Failure #3

**Test:** `  ✘  107 [chromium] › visual/images.spec.js:41:3 › Image Visual Tests › All critical images load successfully (2.3s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
```

---

### Failure #4

**Test:** `  ✘  108 [chromium] › visual/images.spec.js:41:3 › Image Visual Tests › All critical images load successfully (retry #1) (5.0s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
```

---

### Failure #5

**Test:** `  ✘  109 [chromium] › visual/images.spec.js:41:3 › Image Visual Tests › All critical images load successfully (retry #2) (2.4s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
    Error: expect(page).toHaveScreenshot(expected) failed
```

---

### Failure #6

**Test:** `  ✘  111 [chromium] › visual/images.spec.js:65:3 › Image Visual Tests › Visual regression - Homepage screenshots (9.4s)`

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

### Failure #7

**Test:** `  ✘  112 [chromium] › visual/images.spec.js:65:3 › Image Visual Tests › Visual regression - Homepage screenshots (retry #1) (12.2s)`

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

### Failure #8

**Test:** `  ✘  113 [chromium] › visual/images.spec.js:65:3 › Image Visual Tests › Visual regression - Homepage screenshots (retry #2) (9.3s)`

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

### Failure #9

**Test:** `  ✘  115 [chromium] › visual/images.spec.js:91:3 › Image Visual Tests › Images display correctly at different viewport sizes (3.9s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #10

**Test:** `  ✘  116 [chromium] › visual/images.spec.js:91:3 › Image Visual Tests › Images display correctly at different viewport sizes (retry #1) (5.3s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #11

**Test:** `  ✘  117 [chromium] › visual/images.spec.js:91:3 › Image Visual Tests › Images display correctly at different viewport sizes (retry #2) (4.8s)`

**Error Details:**
```
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
    Error: expect(received).toBeTruthy()
```

---

### Failure #12

**Test:** `  ✘  153 [chromium] › tests/comprehensive-image-validator.spec.js:39:3 › Comprehensive Image Validator › should detect ALL broken images across the entire website with advanced validation (retry #2) (3.0m)`

**Error Details:**
```
    Test timeout of 180000ms exceeded.
    Test timeout of 180000ms exceeded.
    Test timeout of 180000ms exceeded.
    Test timeout of 180000ms exceeded.
    Test timeout of 180000ms exceeded.
    Test timeout of 180000ms exceeded.
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
    Error: expect(received).toBeTruthy()
    > 52 |       expect(isLoaded).toBeTruthy();
```

## 📄 Raw Test Output

<details>
<summary>Click to expand full test output (cleaned)</summary>

```
Running 154 tests using 2 workers
Running 154 tests using 2 workers
  ✓    1 [chromium] › accessibility/button-hover-contrast.spec.js:137:3 › Button Hover State Accessibility › Learn More button hover contrast on homepage (3.1s)
  ✓    2 [chromium] › accessibility/button-hover-contrast.spec.js:9:3 › Button Hover State Accessibility › All button hover states maintain proper contrast (6.5s)
  ✓    3 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (5.8s)
  ✓    4 [chromium] › accessibility/wcag-compliance.spec.js:36:3 › WCAG Accessibility Compliance › About page passes accessibility checks (3.8s)
  ✓    5 [chromium] › accessibility/wcag-compliance.spec.js:61:3 › WCAG Accessibility Compliance › All images have alt text (2.4s)
  ✓    6 [chromium] › accessibility/wcag-compliance.spec.js:87:3 › WCAG Accessibility Compliance › All form inputs have labels (1.9s)
  ✓    7 [chromium] › accessibility/wcag-compliance.spec.js:130:3 › WCAG Accessibility Compliance › Keyboard navigation works correctly (2.6s)
  ✓    9 [chromium] › accessibility/wcag-compliance.spec.js:198:3 › WCAG Accessibility Compliance › Page has proper heading hierarchy (2.5s)
  ✓   10 [chromium] › accessibility/wcag-compliance.spec.js:263:3 › WCAG Accessibility Compliance › ARIA landmarks are properly used (2.7s)
  ✓    8 [chromium] › accessibility/wcag-compliance.spec.js:157:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (8.1s)
  ✓   11 [chromium] › accessibility/wcag-compliance.spec.js:303:3 › WCAG Accessibility Compliance › Focus trap in modals works correctly (2.7s)
  ✓   13 [chromium] › assets.spec.js:47:3 › Asset Verification Tests › AssureDefi image size check (2.8s)
  ✓   15 [chromium] › assets.spec.js:86:3 › Asset Verification Tests › Blockchain Founders Group image test (2.3s)
  ✓   14 [chromium] › assets.spec.js:66:3 › Asset Verification Tests › Tokenomics image test (3.5s)
  ✓   16 [chromium] › assets.spec.js:99:5 › Asset Verification Tests › Layout test on Desktop (2.6s)
  ✓   17 [chromium] › assets.spec.js:99:5 › Asset Verification Tests › Layout test on Tablet (2.5s)
  ✓   18 [chromium] › assets.spec.js:99:5 › Asset Verification Tests › Layout test on Mobile (2.3s)
  ✓   20 [chromium] › e2e/navigation.spec.js:38:3 › Navigation Tests › Industry dropdown navigation works (5.1s)
  ✓   21 [chromium] › e2e/navigation.spec.js:80:3 › Navigation Tests › Footer navigation links work (5.2s)
✓ 404 handling is working correctly for static site
[1A✓ 404 handling is working correctly for static site
  ✓   23 [chromium] › e2e/navigation.spec.js:243:3 › Navigation Tests › 404 page handles non-existent routes (284ms)
  ✓   22 [chromium] › e2e/navigation.spec.js:207:3 › Navigation Tests › Logo click returns to homepage (3.1s)
  ✓   26 [chromium] › image-validation.spec.js:52:3 › Image Files and CSS Validation › Check image files exist in build directory (8ms)
  ✓   27 [chromium] › image-validation.spec.js:77:3 › Image Files and CSS Validation › Check CSS classes are defined with proper rules (29ms)
  ✓   28 [chromium] › image-validation.spec.js:150:3 › Image Files and CSS Validation › Check HTML for problematic attributes (5ms)
  ✓   24 [chromium] › e2e/navigation.spec.js:288:3 › Navigation Tests › All marketplace products are accessible (4.1s)
[1A[30/154] [chromium] › image-validation.spec.js:460:3 › Image Visibility on Live Page › No 404 errors for images
  ✓   29 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (6.0s)
✅ No 404 errors detected for images
[1A[chromium] › image-validation.spec.js:460:3 › Image Visibility on Live Page › No 404 errors for images
✅ No 404 errors detected for images
  ✓   30 [chromium] › image-validation.spec.js:460:3 › Image Visibility on Live Page › No 404 errors for images (7.4s)
  ✓   31 [chromium] › image-validation.spec.js:505:3 › Image Visibility on Live Page › Take screenshots for visual verification (6.0s)
  ✓   32 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (4.3s)
  ✓   33 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (4.5s)
  ✓   34 [chromium] › image-visibility-index.spec.js:157:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (4.4s)
  ✓   35 [chromium] › image-visibility-index.spec.js:214:3 › Image Visibility on Index Page › Tokenomics Image visibility (5.1s)
  ✓   36 [chromium] › image-visibility-index.spec.js:266:3 › Image Visibility on Index Page › Check for CSS conflicts (4.2s)
  ✓   37 [chromium] › image-visibility-index.spec.js:311:3 › Image Visibility on Index Page › Visual regression test - take screenshots (6.4s)
  ✓   38 [chromium] › image-visibility-index.spec.js:336:3 › Image Visibility on Index Page › Check image loading performance (5.8s)
  ✓   39 [chromium] › image-visibility.spec.js:5:3 › Image Visibility Tests › Check AssureDefi image is visible and loads correctly (3.8s)
  ✓   40 [chromium] › image-visibility.spec.js:48:3 › Image Visibility Tests › Check Tokenomics image is visible and loads correctly (4.3s)
  ✓   41 [chromium] › image-visibility.spec.js:82:3 › Image Visibility Tests › Check BFG image is visible and loads correctly (2.9s)
  ✓   43 [chromium] › image-visibility.spec.js:159:3 › Image Visibility Tests › Check all critical image HTTP responses (329ms)
Partner logos screenshot saved to test-results/partner-logos.png
Partner logos screenshot saved to test-results/partner-logos.png
  ✓   42 [chromium] › image-visibility.spec.js:113:3 › Image Visibility Tests › Industry cards have visible background images and text (4.6s)
Tokenomics screenshot saved to test-results/tokenomics.png
Tokenomics screenshot saved to test-results/tokenomics.png
  ✓   45 [chromium] › performance/core-web-vitals.spec.js:4:3 › Core Web Vitals Tests › Measure Largest Contentful Paint (LCP) (1.8s)
Industry cards screenshot saved to test-results/industry-cards.png
[1AIndustry cards screenshot saved to test-results/industry-cards.png
  ✓   44 [chromium] › image-visibility.spec.js:185:3 › Image Visibility Tests › Screenshot critical areas for manual inspection (6.0s)
  ✓   46 [chromium] › performance/core-web-vitals.spec.js:21:3 › Core Web Vitals Tests › Measure First Input Delay (FID) (3.0s)
  ✓   48 [chromium] › performance/core-web-vitals.spec.js:68:3 › Core Web Vitals Tests › Page load performance metrics (2.8s)
  ✓   47 [chromium] › performance/core-web-vitals.spec.js:45:3 › Core Web Vitals Tests › Measure Cumulative Layout Shift (CLS) (6.1s)
  ✓   49 [chromium] › performance/core-web-vitals.spec.js:88:3 › Core Web Vitals Tests › Resource loading performance (3.1s)
  ✓   50 [chromium] › performance/core-web-vitals.spec.js:110:3 › Core Web Vitals Tests › Bundle size check (3.0s)
  ✓   52 [chromium] › smoke/basic.spec.js:10:3 › Basic Smoke Tests › About page loads successfully (1.6s)
  ✓   51 [chromium] › smoke/basic.spec.js:4:3 › Basic Smoke Tests › Homepage loads successfully (3.0s)
  ✓   53 [chromium] › smoke/basic.spec.js:17:3 › Basic Smoke Tests › Contact page loads successfully (1.8s)
  ✓   54 [chromium] › smoke/basic.spec.js:23:3 › Basic Smoke Tests › Industries page loads successfully (1.5s)
  ✓   56 [chromium] › smoke/basic.spec.js:35:3 › Basic Smoke Tests › Images directory is accessible (465ms)
  ✓   55 [chromium] › smoke/basic.spec.js:30:3 › Basic Smoke Tests › CSS loads successfully (617ms)
  ✓   57 [chromium] › smoke/critical-paths.spec.js:4:3 › Critical Path Smoke Tests › Homepage loads successfully (2.8s)
  ✓   58 [chromium] › smoke/critical-paths.spec.js:14:3 › Critical Path Smoke Tests › Critical CSS and JS files load (3.6s)
[1A[60/154] [chromium] › smoke/critical-paths.spec.js:52:3 › Critical Path Smoke Tests › No console errors on homepage
  ✓   60 [chromium] › smoke/critical-paths.spec.js:52:3 › Critical Path Smoke Tests › No console errors on homepage (3.3s)
  ✓   59 [chromium] › smoke/critical-paths.spec.js:30:3 › Critical Path Smoke Tests › Main navigation pages are accessible (4.3s)
[1A[62/154] [chromium] › smoke/critical-paths.spec.js:90:3 › Critical Path Smoke Tests › Images load without 404 errors
  ✓   61 [chromium] › smoke/critical-paths.spec.js:78:3 › Critical Path Smoke Tests › Contact page loads successfully (1.9s)
  ✓   62 [chromium] › smoke/critical-paths.spec.js:90:3 › Critical Path Smoke Tests › Images load without 404 errors (3.4s)
  ✓   63 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Homepage has valid HTML5 structure (3.1s)
  ✓   64 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › About has valid HTML5 structure (1.7s)
  ✓   65 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Contact Us has valid HTML5 structure (1.5s)
  ✓   66 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal Notice has valid HTML5 structure (1.7s)
  ✓   67 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Privacy Policy has valid HTML5 structure (1.6s)
  ✓   68 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Industries has valid HTML5 structure (1.3s)
  ✓   69 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Resources has valid HTML5 structure (1.3s)
  ✓   70 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Database Immutable has valid HTML5 structure (1.7s)
  ✓   71 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Database Mutable has valid HTML5 structure (1.6s)
  ✓   72 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › IPFS Upload has valid HTML5 structure (1.6s)
  ✓   73 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › NFT Zero Knowledge has valid HTML5 structure (1.5s)
  ✓   74 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › NFT GameCube has valid HTML5 structure (1.6s)
  ✓   75 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Blockchain Badges has valid HTML5 structure (1.4s)
  ✓   76 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › ESG Credits has valid HTML5 structure (1.6s)
  ✓   77 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Telegram XBot has valid HTML5 structure (1.6s)
  ✓   78 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (1.9s)
  ✓   79 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (1.8s)
  ✓   80 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (1.7s)
  ✓   81 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › ESG has valid HTML5 structure (1.8s)
  ✓   82 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (1.8s)
  ✓   83 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (1.8s)
  ✓   84 [chromium] › smoke/html-structure-validation.spec.js:74:3 › HTML Structure Validation › All pages have proper closing tags (10.4s)
  ✓   85 [chromium] › smoke/html-structure-validation.spec.js:88:3 › HTML Structure Validation › No pages have malformed HTML tags (10.6s)
  ✓   87 [chromium] › smoke/html-structure-validation.spec.js:132:3 › Prevent Regression - Malformed HTML Detection › Validator rejects malformed HTML fragments (1.3s)
  ✓   86 [chromium] › smoke/html-structure-validation.spec.js:107:3 › HTML Structure Validation › Critical pages have navigation menu (2.8s)
[1A[89/154] [chromium] › tests/check-console-errors.spec.js:4:3 › Console Error Check › should have no JavaScript errors on homepage
✅ No console errors found!
[1A[chromium] › tests/check-console-errors.spec.js:4:3 › Console Error Check › should have no JavaScript errors on homepage
✅ No console errors found!
  ✓   89 [chromium] › tests/check-console-errors.spec.js:4:3 › Console Error Check › should have no JavaScript errors on homepage (4.4s)
[1A[90/154] [chromium] › tests/check-console-errors.spec.js:63:3 › Console Error Check › should check for 404 errors
✅ No 404 errors found!
[1A[chromium] › tests/check-console-errors.spec.js:63:3 › Console Error Check › should check for 404 errors
✅ No 404 errors found!
  ✓   90 [chromium] › tests/check-console-errors.spec.js:63:3 › Console Error Check › should check for 404 errors (3.9s)
  ✓   88 [chromium] › tests/check-all-assets.spec.js:6:3 › Comprehensive Asset Check › should find all broken images including background-images (13.8s)
  ✓   92 [chromium] › tests/dropdown-css-hover.spec.js:9:3 › Dropdown CSS Hover › dropdowns should be visible on CSS hover (3.6s)
  ✓ OK: /assets/images/6474d385cfec71cb21a92251/651c58eabcaaed235a87df6d_logo_plus_BWS.svg
  ✓ OK: /assets/images/6474d385cfec71cb21a92251/651c58eabcaaed235a87df6d_logo_plus_BWS.svg
  ✓ OK: /assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg
[1A  ✓ OK: /assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg
  ✓ OK: /assets/images/6474d385cfec71cb21a92251/670f82f9b05322735f72cbcc_PROOF-logo-lightBG.png
[1A  ✓ OK: /assets/images/6474d385cfec71cb21a92251/670f82f9b05322735f72cbcc_PROOF-logo-lightBG.png
  ✓ OK: /assets/images/6474d385cfec71cb21a92251/6707f1c5c0856eff6c22300e_AssureDefi.png
[1A  ✓ OK: /assets/images/6474d385cfec71cb21a92251/6707f1c5c0856eff6c22300e_AssureDefi.png
  ✓ OK: /assets/images/6474d385cfec71cb21a92251/64e738258afae2bb6f4d56bf_logo-blockchain-founders-group-background-transparent-large.svg
[1A  ✓ OK: /assets/images/6474d385cfec71cb21a92251/64e738258afae2bb6f4d56bf_logo-blockchain-founders-group-background-transparent-large.svg
  ✓ OK: /assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template.png
[1A  ✓ OK: /assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template.png
  ✓ OK: /assets/images/6474d385cfec71cb21a92251/6708d536ef7b294fa972098e_football-cubes-selection.png
[1A  ✓ OK: /assets/images/6474d385cfec71cb21a92251/6708d536ef7b294fa972098e_football-cubes-selection.png
  ✓ OK: /assets/images/6474d385cfec71cb21a9229a/65061f550fd7be777e64f36f_Save_400x300.jpg
[1A  ✓ OK: /assets/images/6474d385cfec71cb21a9229a/65061f550fd7be777e64f36f_Save_400x300.jpg
  ✓ OK: /assets/images/6474d385cfec71cb21a9229a/65061ebf5608b7584d9def34_Hash_400x300.jpg
[1A  ✓ OK: /assets/images/6474d385cfec71cb21a9229a/65061ebf5608b7584d9def34_Hash_400x300.jpg
  ✓ OK: /assets/images/6474d385cfec71cb21a9229a/655b1a1220eb4c16ccfcab4b_BWS.IPFS.Upload_400x300.jpg
[1A  ✓ OK: /assets/images/6474d385cfec71cb21a9229a/655b1a1220eb4c16ccfcab4b_BWS.IPFS.Upload_400x300.jpg
  ✓ OK: /assets/images/6474d385cfec71cb21a9229a/65061646ead0751dc83790e1_NFT_1200x628.jpg
[1A  ✓ OK: /assets/images/6474d385cfec71cb21a9229a/65061646ead0751dc83790e1_NFT_1200x628.jpg
  ✓ OK: /assets/images/6474d385cfec71cb21a9229a/66842c0750c2f76ef6ee8a4a_raibow-colors.jpg
[1A  ✓ OK: /assets/images/6474d385cfec71cb21a9229a/66842c0750c2f76ef6ee8a4a_raibow-colors.jpg
  ✓ OK: /assets/images/6474d385cfec71cb21a9229a/65061830bf101fe685a48e2f_NFT-Marketplace_400x300.jpg
[1A  ✓ OK: /assets/images/6474d385cfec71cb21a9229a/65061830bf101fe685a48e2f_NFT-Marketplace_400x300.jpg
  ✓ OK: /assets/images/6474d385cfec71cb21a9229a/65061a656980df26769cd4ee_ESG-Credits_400x300.jpg
[1A  ✓ OK: /assets/images/6474d385cfec71cb21a9229a/65061a656980df26769cd4ee_ESG-Credits_400x300.jpg
  ✓ OK: /assets/images/6474d385cfec71cb21a9229a/6806a0111f7e6589d65385a6_Telegram-X-Bot.png
[1A  ✓ OK: /assets/images/6474d385cfec71cb21a9229a/6806a0111f7e6589d65385a6_Telegram-X-Bot.png
  ✓ OK: /assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png
[1A  ✓ OK: /assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png
  ✓ OK: /assets/images/6474d385cfec71cb21a92251/670e3109244f671486edfeb7_logo-full-white.svg
[1A  ✓ OK: /assets/images/6474d385cfec71cb21a92251/670e3109244f671486edfeb7_logo-full-white.svg
  ✓ OK: /assets/images/6474d385cfec71cb21a92251/670e1c014d33c13aeb2b78f0_discord-white.svg
[1A  ✓ OK: /assets/images/6474d385cfec71cb21a92251/670e1c014d33c13aeb2b78f0_discord-white.svg
  ✓ OK: /assets/images/6474d385cfec71cb21a92251/670e205d822e237fb9cdffcc_telegram-white.svg
[1A  ✓ OK: /assets/images/6474d385cfec71cb21a92251/670e205d822e237fb9cdffcc_telegram-white.svg
```
</details>
