# Test Failure Report - Fix Branch

**Generated:** 2025-10-05 20:33:22 UTC
**Branch:** fix/test-failures-2025-09-28T15-58-27-e2206f4
**Commit:** 05bfe62e7c94e3ba5a9fc11bfa8f508ec2e8eeab
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18263799865)

## 🔁 Recurring Issues Analysis

Comparing with previous reports:
- BRANCH_ISSUES_30-09-08.md
- BRANCH_ISSUES_30-09-14.md
- BRANCH_ISSUES_TEST_03-10-17.md
- BRANCH_ISSUES_05-10-19.md
- BRANCH_ISSUES_29-09-13.md

### Known Recurring Issues:
- ⚠️ **WCAG Color Contrast Failures** (wcag-compliance.spec.js)
  - Appears in 3 of last 5 reports
  - Error: Color contrast violations not meeting WCAG AA 4.5:1 or AAA 3:1 standards

## Test Results
### 📊 Test Statistics
- **Total Tests:** 119
- **✅ Passed:** 84
- **❌ Failed:** 30
- **⚠️ Flaky:** 0
- **⏭ Skipped:** 5
- **⏱ Duration:** 852029.636ms

### 🔴 Failed Tests Summary

## 🔍 Enhanced Error Diagnostics

No enhanced diagnostics available - diagnostics directory not created.

_This is expected if no tests failed or error-reporting functions weren't called._

## 📋 Detailed Test Failures

### Failure #1

**Test:** `  ✘    3 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (6.5s)`


**WCAG Violations:**
```
=== WCAG Violations Detected ===
1. frame-title: Frames must have an accessible name
1. frame-title: Frames must have an accessible name
   Impact: serious
[1A   Impact: serious
   Description: Ensure <iframe> and <frame> elements have an accessible name
[1A   Description: Ensure <iframe> and <frame> elements have an accessible name
   Affected nodes: 1
[1A   Affected nodes: 1
   - Node 1: <iframe scrolling="no" frameborder="0" id="player" src="https://player.vimeo.com/video/976431707?app...
[1A   - Node 1: <iframe scrolling="no" frameborder="0" id="player" src="https://player.vimeo.com/video/976431707?app...
     Fix: Fix any of the following:
[1A     Fix: Fix any of the following:
  ✘    3 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (6.5s)
  ✓    4 [chromium] › accessibility/wcag-compliance.spec.js:36:3 › WCAG Accessibility Compliance › About page passes accessibility checks (3.7s)
  ✓    5 [chromium] › accessibility/wcag-compliance.spec.js:61:3 › WCAG Accessibility Compliance › All images have alt text (3.0s)
  ✓    7 [chromium] › accessibility/wcag-compliance.spec.js:87:3 › WCAG Accessibility Compliance › All form inputs have labels (2.0s)
  ✓    8 [chromium] › accessibility/wcag-compliance.spec.js:130:3 › WCAG Accessibility Compliance › Keyboard navigation works correctly (3.0s)
=== WCAG Violations Detected ===
=== WCAG Violations Detected ===
1. frame-title: Frames must have an accessible name
1. frame-title: Frames must have an accessible name
   Impact: serious
[1A   Impact: serious
   Description: Ensure <iframe> and <frame> elements have an accessible name
[1A   Description: Ensure <iframe> and <frame> elements have an accessible name
   Affected nodes: 1
[1A   Affected nodes: 1
   - Node 1: <iframe scrolling="no" frameborder="0" id="player" src="https://player.vimeo.com/video/976431707?app...
[1A   - Node 1: <iframe scrolling="no" frameborder="0" id="player" src="https://player.vimeo.com/video/976431707?app...
     Fix: Fix any of the following:
[1A     Fix: Fix any of the following:
  ✓    9 [chromium] › accessibility/wcag-compliance.spec.js:157:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (10.0s)
  ✘    6 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (retry #1) (15.5s)
  ✓   10 [chromium] › accessibility/wcag-compliance.spec.js:198:3 › WCAG Accessibility Compliance › Page has proper heading hierarchy (2.4s)
  ✓   11 [chromium] › accessibility/wcag-compliance.spec.js:263:3 › WCAG Accessibility Compliance › ARIA landmarks are properly used (2.8s)
  ✓   13 [chromium] › accessibility/wcag-compliance.spec.js:303:3 › WCAG Accessibility Compliance › Focus trap in modals works correctly (2.5s)
=== WCAG Violations Detected ===
=== WCAG Violations Detected ===
1. frame-title: Frames must have an accessible name
1. frame-title: Frames must have an accessible name
   Impact: serious
[1A   Impact: serious
   Description: Ensure <iframe> and <frame> elements have an accessible name
[1A   Description: Ensure <iframe> and <frame> elements have an accessible name
   Affected nodes: 1
[1A   Affected nodes: 1
   - Node 1: <iframe scrolling="no" frameborder="0" id="player" src="https://player.vimeo.com/video/976431707?app...
[1A   - Node 1: <iframe scrolling="no" frameborder="0" id="player" src="https://player.vimeo.com/video/976431707?app...
     Fix: Fix any of the following:
```

---

### Failure #2

**Test:** `  ✘    6 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (retry #1) (15.5s)`


**WCAG Violations:**
```
=== WCAG Violations Detected ===
1. frame-title: Frames must have an accessible name
1. frame-title: Frames must have an accessible name
   Impact: serious
[1A   Impact: serious
   Description: Ensure <iframe> and <frame> elements have an accessible name
[1A   Description: Ensure <iframe> and <frame> elements have an accessible name
   Affected nodes: 1
[1A   Affected nodes: 1
   - Node 1: <iframe scrolling="no" frameborder="0" id="player" src="https://player.vimeo.com/video/976431707?app...
[1A   - Node 1: <iframe scrolling="no" frameborder="0" id="player" src="https://player.vimeo.com/video/976431707?app...
     Fix: Fix any of the following:
[1A     Fix: Fix any of the following:
  ✘    3 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (6.5s)
  ✓    4 [chromium] › accessibility/wcag-compliance.spec.js:36:3 › WCAG Accessibility Compliance › About page passes accessibility checks (3.7s)
  ✓    5 [chromium] › accessibility/wcag-compliance.spec.js:61:3 › WCAG Accessibility Compliance › All images have alt text (3.0s)
  ✓    7 [chromium] › accessibility/wcag-compliance.spec.js:87:3 › WCAG Accessibility Compliance › All form inputs have labels (2.0s)
  ✓    8 [chromium] › accessibility/wcag-compliance.spec.js:130:3 › WCAG Accessibility Compliance › Keyboard navigation works correctly (3.0s)
=== WCAG Violations Detected ===
=== WCAG Violations Detected ===
1. frame-title: Frames must have an accessible name
1. frame-title: Frames must have an accessible name
   Impact: serious
[1A   Impact: serious
   Description: Ensure <iframe> and <frame> elements have an accessible name
[1A   Description: Ensure <iframe> and <frame> elements have an accessible name
   Affected nodes: 1
[1A   Affected nodes: 1
   - Node 1: <iframe scrolling="no" frameborder="0" id="player" src="https://player.vimeo.com/video/976431707?app...
[1A   - Node 1: <iframe scrolling="no" frameborder="0" id="player" src="https://player.vimeo.com/video/976431707?app...
     Fix: Fix any of the following:
[1A     Fix: Fix any of the following:
  ✓    9 [chromium] › accessibility/wcag-compliance.spec.js:157:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (10.0s)
  ✘    6 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (retry #1) (15.5s)
  ✓   10 [chromium] › accessibility/wcag-compliance.spec.js:198:3 › WCAG Accessibility Compliance › Page has proper heading hierarchy (2.4s)
  ✓   11 [chromium] › accessibility/wcag-compliance.spec.js:263:3 › WCAG Accessibility Compliance › ARIA landmarks are properly used (2.8s)
  ✓   13 [chromium] › accessibility/wcag-compliance.spec.js:303:3 › WCAG Accessibility Compliance › Focus trap in modals works correctly (2.5s)
=== WCAG Violations Detected ===
=== WCAG Violations Detected ===
1. frame-title: Frames must have an accessible name
1. frame-title: Frames must have an accessible name
   Impact: serious
[1A   Impact: serious
   Description: Ensure <iframe> and <frame> elements have an accessible name
[1A   Description: Ensure <iframe> and <frame> elements have an accessible name
   Affected nodes: 1
[1A   Affected nodes: 1
   - Node 1: <iframe scrolling="no" frameborder="0" id="player" src="https://player.vimeo.com/video/976431707?app...
[1A   - Node 1: <iframe scrolling="no" frameborder="0" id="player" src="https://player.vimeo.com/video/976431707?app...
     Fix: Fix any of the following:
```

---

### Failure #3

**Test:** `  ✘   12 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (retry #2) (8.8s)`


**WCAG Violations:**
```
=== WCAG Violations Detected ===
1. frame-title: Frames must have an accessible name
1. frame-title: Frames must have an accessible name
   Impact: serious
[1A   Impact: serious
   Description: Ensure <iframe> and <frame> elements have an accessible name
[1A   Description: Ensure <iframe> and <frame> elements have an accessible name
   Affected nodes: 1
[1A   Affected nodes: 1
   - Node 1: <iframe scrolling="no" frameborder="0" id="player" src="https://player.vimeo.com/video/976431707?app...
[1A   - Node 1: <iframe scrolling="no" frameborder="0" id="player" src="https://player.vimeo.com/video/976431707?app...
     Fix: Fix any of the following:
[1A     Fix: Fix any of the following:
  ✘    3 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (6.5s)
  ✓    4 [chromium] › accessibility/wcag-compliance.spec.js:36:3 › WCAG Accessibility Compliance › About page passes accessibility checks (3.7s)
  ✓    5 [chromium] › accessibility/wcag-compliance.spec.js:61:3 › WCAG Accessibility Compliance › All images have alt text (3.0s)
  ✓    7 [chromium] › accessibility/wcag-compliance.spec.js:87:3 › WCAG Accessibility Compliance › All form inputs have labels (2.0s)
  ✓    8 [chromium] › accessibility/wcag-compliance.spec.js:130:3 › WCAG Accessibility Compliance › Keyboard navigation works correctly (3.0s)
=== WCAG Violations Detected ===
=== WCAG Violations Detected ===
1. frame-title: Frames must have an accessible name
1. frame-title: Frames must have an accessible name
   Impact: serious
[1A   Impact: serious
   Description: Ensure <iframe> and <frame> elements have an accessible name
[1A   Description: Ensure <iframe> and <frame> elements have an accessible name
   Affected nodes: 1
[1A   Affected nodes: 1
   - Node 1: <iframe scrolling="no" frameborder="0" id="player" src="https://player.vimeo.com/video/976431707?app...
[1A   - Node 1: <iframe scrolling="no" frameborder="0" id="player" src="https://player.vimeo.com/video/976431707?app...
     Fix: Fix any of the following:
[1A     Fix: Fix any of the following:
  ✓    9 [chromium] › accessibility/wcag-compliance.spec.js:157:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (10.0s)
  ✘    6 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (retry #1) (15.5s)
  ✓   10 [chromium] › accessibility/wcag-compliance.spec.js:198:3 › WCAG Accessibility Compliance › Page has proper heading hierarchy (2.4s)
  ✓   11 [chromium] › accessibility/wcag-compliance.spec.js:263:3 › WCAG Accessibility Compliance › ARIA landmarks are properly used (2.8s)
  ✓   13 [chromium] › accessibility/wcag-compliance.spec.js:303:3 › WCAG Accessibility Compliance › Focus trap in modals works correctly (2.5s)
=== WCAG Violations Detected ===
=== WCAG Violations Detected ===
1. frame-title: Frames must have an accessible name
1. frame-title: Frames must have an accessible name
   Impact: serious
[1A   Impact: serious
   Description: Ensure <iframe> and <frame> elements have an accessible name
[1A   Description: Ensure <iframe> and <frame> elements have an accessible name
   Affected nodes: 1
[1A   Affected nodes: 1
   - Node 1: <iframe scrolling="no" frameborder="0" id="player" src="https://player.vimeo.com/video/976431707?app...
[1A   - Node 1: <iframe scrolling="no" frameborder="0" id="player" src="https://player.vimeo.com/video/976431707?app...
     Fix: Fix any of the following:
```

---

### Failure #4

**Test:** `  ✘   31 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (10.7s)`


---

### Failure #5

**Test:** `  ✘   34 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #1) (14.8s)`


---

### Failure #6

**Test:** `  ✘   37 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (11.0s)`


---

### Failure #7

**Test:** `  ✘   39 [chromium] › image-visibility-index.spec.js:213:3 › Image Visibility on Index Page › Tokenomics Image visibility (14.8s)`


---

### Failure #8

**Test:** `  ✘   42 [chromium] › image-visibility-index.spec.js:213:3 › Image Visibility on Index Page › Tokenomics Image visibility (retry #1) (18.9s)`


---

### Failure #9

**Test:** `  ✘   46 [chromium] › image-visibility.spec.js:82:3 › Image Visibility Tests › Check BFG image is visible and loads correctly (4.0s)`


---

### Failure #10

**Test:** `  ✘   47 [chromium] › image-visibility.spec.js:82:3 › Image Visibility Tests › Check BFG image is visible and loads correctly (retry #1) (6.2s)`


---

### Failure #11

**Test:** `  ✘   48 [chromium] › image-visibility-index.spec.js:213:3 › Image Visibility on Index Page › Tokenomics Image visibility (retry #2) (15.8s)`


---

### Failure #12

**Test:** `  ✘   49 [chromium] › image-visibility.spec.js:82:3 › Image Visibility Tests › Check BFG image is visible and loads correctly (retry #2) (3.3s)`


---

### Failure #13

**Test:** `  ✘   69 [chromium] › smoke/critical-paths.spec.js:78:3 › Critical Path Smoke Tests › Contact page loads successfully (6.7s)`


---

### Failure #14

**Test:** `  ✘   75 [chromium] › smoke/critical-paths.spec.js:78:3 › Critical Path Smoke Tests › Contact page loads successfully (retry #1) (8.1s)`


---

### Failure #15

**Test:** `  ✘   83 [chromium] › smoke/critical-paths.spec.js:78:3 › Critical Path Smoke Tests › Contact page loads successfully (retry #2) (6.8s)`


---

### Failure #16

**Test:** `  ✘   88 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (1.2s)`


---

### Failure #17

**Test:** `  ✘   89 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (retry #1) (3.4s)`


---

### Failure #18

**Test:** `  ✘   90 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (2.1s)`


---

### Failure #19

**Test:** `  ✘   91 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (retry #1) (3.6s)`


---

### Failure #20

**Test:** `  ✘   92 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (retry #2) (2.1s)`


---

### Failure #21

**Test:** `  ✘   93 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (1.6s)`


---

### Failure #22

**Test:** `  ✘   94 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (retry #2) (1.8s)`


---

### Failure #23

**Test:** `  ✘   95 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (retry #1) (3.7s)`


---

### Failure #24

**Test:** `  ✘   97 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (1.6s)`


---

### Failure #25

**Test:** `  ✘   98 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (retry #2) (2.1s)`


---

### Failure #26

**Test:** `  ✘   99 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (retry #1) (3.5s)`


---

### Failure #27

**Test:** `  ✘  100 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (1.8s)`


---

### Failure #28

**Test:** `  ✘  101 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (retry #2) (2.3s)`


---

### Failure #29

**Test:** `  ✘  102 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (retry #1) (3.5s)`


---

### Failure #30

**Test:** `  ✘  104 [chromium] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (retry #2) (2.1s)`


---

### Failure #31

**Test:** `  ✘  108 [chromium] › tests/check-all-assets.spec.js:6:3 › Comprehensive Asset Check › should find all broken images including background-images (414ms)`


---

### Failure #32

**Test:** `  ✘  109 [chromium] › tests/check-console-errors.spec.js:4:3 › Console Error Check › should have no JavaScript errors on homepage (353ms)`


---

### Failure #33

**Test:** `  ✘  110 [chromium] › tests/check-all-assets.spec.js:6:3 › Comprehensive Asset Check › should find all broken images including background-images (retry #1) (607ms)`


---

### Failure #34

**Test:** `  ✘  111 [chromium] › tests/check-console-errors.spec.js:4:3 › Console Error Check › should have no JavaScript errors on homepage (retry #1) (553ms)`


---

### Failure #35

**Test:** `  ✘  112 [chromium] › tests/check-all-assets.spec.js:6:3 › Comprehensive Asset Check › should find all broken images including background-images (retry #2) (416ms)`


---

### Failure #36

**Test:** `  ✘  113 [chromium] › tests/check-console-errors.spec.js:4:3 › Console Error Check › should have no JavaScript errors on homepage (retry #2) (427ms)`


---

### Failure #37

**Test:** `  ✘  114 [chromium] › tests/check-console-errors.spec.js:63:3 › Console Error Check › should check for 404 errors (482ms)`


---

### Failure #38

**Test:** `  ✘  115 [chromium] › tests/comprehensive-image-validator.spec.js:39:3 › Comprehensive Image Validator › should detect ALL broken images across the entire website with advanced validation (1.5m)`


---

### Failure #39

**Test:** `  ✘  116 [chromium] › tests/check-console-errors.spec.js:63:3 › Console Error Check › should check for 404 errors (retry #1) (814ms)`


---

### Failure #40

**Test:** `  ✘  117 [chromium] › tests/check-console-errors.spec.js:63:3 › Console Error Check › should check for 404 errors (retry #2) (415ms)`


---

### Failure #41

**Test:** `  ✘  119 [chromium] › tests/find-broken-images.spec.js:6:3 › Find All Broken Images › scan all pages for broken images (1.5m)`


---

### Failure #42

**Test:** `  ✘  120 [chromium] › tests/comprehensive-image-validator.spec.js:39:3 › Comprehensive Image Validator › should detect ALL broken images across the entire website with advanced validation (retry #1) (1.6m)`


---

### Failure #43

**Test:** `  ✘  121 [chromium] › tests/find-broken-images.spec.js:6:3 › Find All Broken Images › scan all pages for broken images (retry #1) (1.6m)`


---

### Failure #44

**Test:** `  ✘  122 [chromium] › tests/comprehensive-image-validator.spec.js:39:3 › Comprehensive Image Validator › should detect ALL broken images across the entire website with advanced validation (retry #2) (1.5m)`


---

### Failure #45

**Test:** `  ✘  123 [chromium] › tests/find-broken-images.spec.js:6:3 › Find All Broken Images › scan all pages for broken images (retry #2) (1.5m)`


---

### Failure #46

**Test:** `  ✘  126 [chromium] › tests/navigation-dropdown.spec.js:12:3 › Navigation Dropdown Menu › dropdown menus should display on hover (2.8s)`


---

### Failure #47

**Test:** `  ✘  127 [chromium] › tests/navigation-dropdown.spec.js:12:3 › Navigation Dropdown Menu › dropdown menus should display on hover (retry #1) (4.8s)`


---

### Failure #48

**Test:** `  ✘  128 [chromium] › tests/navigation-dropdown.spec.js:12:3 › Navigation Dropdown Menu › dropdown menus should display on hover (retry #2) (2.9s)`


---

### Failure #49

**Test:** `  ✘  132 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at mobile (375x667) (6.2s)`


---

### Failure #50

**Test:** `  ✘  133 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at mobile (375x667) (retry #1) (12.9s)`


---

### Failure #51

**Test:** `  ✘  134 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at mobile (375x667) (retry #2) (7.0s)`


---

### Failure #52

**Test:** `  ✘  135 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at tablet (768x1024) (8.0s)`


---

### Failure #53

**Test:** `  ✘  136 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at tablet (768x1024) (retry #1) (16.0s)`


---

### Failure #54

**Test:** `  ✘  137 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at desktop (1440x900) (9.9s)`


---

### Failure #55

**Test:** `  ✘  138 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at desktop (1440x900) (retry #1) (17.5s)`


---

### Failure #56

**Test:** `  ✘  139 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at tablet (768x1024) (retry #2) (10.4s)`


---

### Failure #57

**Test:** `  ✘  140 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at large (1920x1080) (9.6s)`


---

### Failure #58

**Test:** `  ✘  141 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at desktop (1440x900) (retry #2) (9.6s)`


---

### Failure #59

**Test:** `  ✘  142 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at large (1920x1080) (retry #1) (15.6s)`


---

### Failure #60

**Test:** `  ✘  145 [chromium] › visual/images.spec.js:41:3 › Image Visual Tests › All critical images load successfully (3.3s)`


---

### Failure #61

**Test:** `  ✘  146 [chromium] › tests/responsive-image-check.spec.js:23:5 › Responsive Image Validation › should load all images correctly at large (1920x1080) (retry #2) (9.9s)`


---

### Failure #62

**Test:** `  ✘  147 [chromium] › visual/images.spec.js:41:3 › Image Visual Tests › All critical images load successfully (retry #1) (6.4s)`


---

### Failure #63

**Test:** `  ✘  149 [chromium] › visual/images.spec.js:41:3 › Image Visual Tests › All critical images load successfully (retry #2) (3.6s)`


---

### Failure #64

**Test:** `  ✘  150 [chromium] › visual/images.spec.js:65:3 › Image Visual Tests › Visual regression - Homepage screenshots (12.2s)`


---

### Failure #65

**Test:** `  ✘  151 [chromium] › visual/images.spec.js:80:3 › Image Visual Tests › Images have correct CSS classes applied (8.7s)`


---

### Failure #66

**Test:** `  ✘  152 [chromium] › visual/images.spec.js:80:3 › Image Visual Tests › Images have correct CSS classes applied (retry #1) (11.7s)`


---

### Failure #67

**Test:** `  ✘  153 [chromium] › visual/images.spec.js:65:3 › Image Visual Tests › Visual regression - Homepage screenshots (retry #1) (16.9s)`


---

### Failure #68

**Test:** `  ✘  154 [chromium] › visual/images.spec.js:80:3 › Image Visual Tests › Images have correct CSS classes applied (retry #2) (8.7s)`


---

### Failure #69

**Test:** `  ✘  155 [chromium] › visual/images.spec.js:65:3 › Image Visual Tests › Visual regression - Homepage screenshots (retry #2) (15.1s)`


---

### Failure #70

**Test:** `  ✘  156 [chromium] › visual/images.spec.js:91:3 › Image Visual Tests › Images display correctly at different viewport sizes (5.7s)`


---

### Failure #71

**Test:** `  ✘  157 [chromium] › visual/images.spec.js:91:3 › Image Visual Tests › Images display correctly at different viewport sizes (retry #1) (9.5s)`


---

### Failure #72

**Test:** `  ✘  163 [chromium] › visual/images.spec.js:91:3 › Image Visual Tests › Images display correctly at different viewport sizes (retry #2) (5.8s)`


---

### Failure #73

**Test:** `  ✘  169 [smoke] › smoke/critical-paths.spec.js:78:3 › Critical Path Smoke Tests › Contact page loads successfully (6.5s)`


---

### Failure #74

**Test:** `  ✘  175 [smoke] › smoke/critical-paths.spec.js:78:3 › Critical Path Smoke Tests › Contact page loads successfully (retry #1) (8.3s)`


---

### Failure #75

**Test:** `  ✘  184 [smoke] › smoke/critical-paths.spec.js:78:3 › Critical Path Smoke Tests › Contact page loads successfully (retry #2) (6.6s)`


---

### Failure #76

**Test:** `  ✘  188 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (1.2s)`


---

### Failure #77

**Test:** `  ✘  189 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (retry #1) (3.5s)`


---

### Failure #78

**Test:** `  ✘  190 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (1.8s)`


---

### Failure #79

**Test:** `  ✘  191 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (retry #1) (3.8s)`


---

### Failure #80

**Test:** `  ✘  192 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Financial Services has valid HTML5 structure (retry #2) (2.1s)`


---

### Failure #81

**Test:** `  ✘  193 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (1.8s)`


---

### Failure #82

**Test:** `  ✘  194 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Content Creation has valid HTML5 structure (retry #2) (1.5s)`


---

### Failure #83

**Test:** `  ✘  195 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (retry #1) (3.6s)`


---

### Failure #84

**Test:** `  ✘  197 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (1.5s)`


---

### Failure #85

**Test:** `  ✘  198 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Retail has valid HTML5 structure (retry #2) (2.1s)`


---

### Failure #86

**Test:** `  ✘  199 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (retry #1) (3.0s)`


---

### Failure #87

**Test:** `  ✘  200 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (1.7s)`


---

### Failure #88

**Test:** `  ✘  201 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Legal has valid HTML5 structure (retry #2) (1.9s)`


---

### Failure #89

**Test:** `  ✘  202 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (retry #1) (3.5s)`


---

### Failure #90

**Test:** `  ✘  204 [smoke] › smoke/html-structure-validation.spec.js:35:5 › HTML Structure Validation › Supply Chain has valid HTML5 structure (retry #2) (2.1s)`


## 📄 Raw Test Output

<details>
<summary>Click to expand full test output (cleaned)</summary>

```
Running 154 tests using 2 workers
Running 154 tests using 2 workers
  ✓    2 [chromium] › accessibility/button-hover-contrast.spec.js:137:3 › Button Hover State Accessibility › Learn More button hover contrast on homepage (4.1s)
  ✓    1 [chromium] › accessibility/button-hover-contrast.spec.js:9:3 › Button Hover State Accessibility › All button hover states maintain proper contrast (7.4s)
=== WCAG Violations Detected ===
=== WCAG Violations Detected ===
1. frame-title: Frames must have an accessible name
1. frame-title: Frames must have an accessible name
   Impact: serious
[1A   Impact: serious
   Description: Ensure <iframe> and <frame> elements have an accessible name
[1A   Description: Ensure <iframe> and <frame> elements have an accessible name
   Affected nodes: 1
[1A   Affected nodes: 1
   - Node 1: <iframe scrolling="no" frameborder="0" id="player" src="https://player.vimeo.com/video/976431707?app...
[1A   - Node 1: <iframe scrolling="no" frameborder="0" id="player" src="https://player.vimeo.com/video/976431707?app...
  ✘    3 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (6.5s)
  ✓    4 [chromium] › accessibility/wcag-compliance.spec.js:36:3 › WCAG Accessibility Compliance › About page passes accessibility checks (3.7s)
  ✓    5 [chromium] › accessibility/wcag-compliance.spec.js:61:3 › WCAG Accessibility Compliance › All images have alt text (3.0s)
  ✓    7 [chromium] › accessibility/wcag-compliance.spec.js:87:3 › WCAG Accessibility Compliance › All form inputs have labels (2.0s)
  ✓    8 [chromium] › accessibility/wcag-compliance.spec.js:130:3 › WCAG Accessibility Compliance › Keyboard navigation works correctly (3.0s)
=== WCAG Violations Detected ===
=== WCAG Violations Detected ===
1. frame-title: Frames must have an accessible name
1. frame-title: Frames must have an accessible name
   Impact: serious
[1A   Impact: serious
   Description: Ensure <iframe> and <frame> elements have an accessible name
[1A   Description: Ensure <iframe> and <frame> elements have an accessible name
   Affected nodes: 1
[1A   Affected nodes: 1
   - Node 1: <iframe scrolling="no" frameborder="0" id="player" src="https://player.vimeo.com/video/976431707?app...
[1A   - Node 1: <iframe scrolling="no" frameborder="0" id="player" src="https://player.vimeo.com/video/976431707?app...
  ✓    9 [chromium] › accessibility/wcag-compliance.spec.js:157:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (10.0s)
  ✘    6 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (retry #1) (15.5s)
  ✓   10 [chromium] › accessibility/wcag-compliance.spec.js:198:3 › WCAG Accessibility Compliance › Page has proper heading hierarchy (2.4s)
  ✓   11 [chromium] › accessibility/wcag-compliance.spec.js:263:3 › WCAG Accessibility Compliance › ARIA landmarks are properly used (2.8s)
  ✓   13 [chromium] › accessibility/wcag-compliance.spec.js:303:3 › WCAG Accessibility Compliance › Focus trap in modals works correctly (2.5s)
=== WCAG Violations Detected ===
=== WCAG Violations Detected ===
1. frame-title: Frames must have an accessible name
1. frame-title: Frames must have an accessible name
   Impact: serious
[1A   Impact: serious
   Description: Ensure <iframe> and <frame> elements have an accessible name
[1A   Description: Ensure <iframe> and <frame> elements have an accessible name
   Affected nodes: 1
[1A   Affected nodes: 1
   - Node 1: <iframe scrolling="no" frameborder="0" id="player" src="https://player.vimeo.com/video/976431707?app...
[1A   - Node 1: <iframe scrolling="no" frameborder="0" id="player" src="https://player.vimeo.com/video/976431707?app...
  ✓   15 [chromium] › assets.spec.js:47:3 › Asset Verification Tests › AssureDefi image size check (3.6s)
  ✘   12 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (retry #2) (8.8s)
    Error: expect(received).toEqual(expected) // deep equality
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:33:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/test-failed-1.png
    Error Context: test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/error-context.md
    Error: expect(received).toEqual(expected) // deep equality
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:33:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/test-failed-1.png
    Error Context: test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/error-context.md
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/trace.zip
        npx playwright show-trace test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/trace.zip
    Error: expect(received).toEqual(expected) // deep equality
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:33:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/test-failed-1.png
    Error Context: test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/error-context.md
  ✓   16 [chromium] › assets.spec.js:66:3 › Asset Verification Tests › Tokenomics image test (3.9s)
  ✓   17 [chromium] › assets.spec.js:86:3 › Asset Verification Tests › Blockchain Founders Group image test (2.7s)
  ✓   18 [chromium] › assets.spec.js:105:5 › Asset Verification Tests › Layout test on Desktop (3.4s)
  ✓   19 [chromium] › assets.spec.js:105:5 › Asset Verification Tests › Layout test on Tablet (3.2s)
  ✓   20 [chromium] › assets.spec.js:105:5 › Asset Verification Tests › Layout test on Mobile (2.6s)
  ✓   22 [chromium] › e2e/navigation.spec.js:38:3 › Navigation Tests › Industry dropdown navigation works (5.5s)
  ✓   23 [chromium] › e2e/navigation.spec.js:80:3 › Navigation Tests › Footer navigation links work (5.4s)
✓ 404 handling is working correctly for static site
[1A✓ 404 handling is working correctly for static site
  ✓   25 [chromium] › e2e/navigation.spec.js:243:3 › Navigation Tests › 404 page handles non-existent routes (360ms)
  ✓   24 [chromium] › e2e/navigation.spec.js:207:3 › Navigation Tests › Logo click returns to homepage (3.4s)
  ✓   28 [chromium] › image-validation.spec.js:52:3 › Image Files and CSS Validation › Check image files exist in build directory (14ms)
  ✓   29 [chromium] › image-validation.spec.js:77:3 › Image Files and CSS Validation › Check CSS classes are defined with proper rules (18ms)
  ✓   30 [chromium] › image-validation.spec.js:150:3 › Image Files and CSS Validation › Check HTML for problematic attributes (9ms)
  ✓   26 [chromium] › e2e/navigation.spec.js:288:3 › Navigation Tests › All marketplace products are accessible (5.0s)
[1A[32/154] [chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images
  ✘   31 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (10.7s)
✅ No 404 errors detected for images
[1A[chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images
✅ No 404 errors detected for images
  ✓   32 [chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images (7.9s)
  ✓   33 [chromium] › image-validation.spec.js:499:3 › Image Visibility on Live Page › Take screenshots for visual verification (7.6s)
  ✓   35 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (5.0s)
  ✘   34 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #1) (14.8s)
  ✓   36 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (5.8s)
  ✓   38 [chromium] › image-visibility-index.spec.js:157:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (5.1s)
  ✘   37 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (11.0s)
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
  ✓   40 [chromium] › image-visibility-index.spec.js:261:3 › Image Visibility on Index Page › Check for CSS conflicts (4.8s)
  ✘   39 [chromium] › image-visibility-index.spec.js:213:3 › Image Visibility on Index Page › Tokenomics Image visibility (14.8s)
  ✓   41 [chromium] › image-visibility-index.spec.js:306:3 › Image Visibility on Index Page › Visual regression test - take screenshots (6.7s)
  ✓   43 [chromium] › image-visibility-index.spec.js:331:3 › Image Visibility on Index Page › Check image loading performance (6.6s)
  ✓   44 [chromium] › image-visibility.spec.js:5:3 › Image Visibility Tests › Check AssureDefi image is visible and loads correctly (3.3s)
  ✓   45 [chromium] › image-visibility.spec.js:48:3 › Image Visibility Tests › Check Tokenomics image is visible and loads correctly (3.6s)
  ✘   46 [chromium] › image-visibility.spec.js:82:3 › Image Visibility Tests › Check BFG image is visible and loads correctly (4.0s)
  ✘   42 [chromium] › image-visibility-index.spec.js:213:3 › Image Visibility on Index Page › Tokenomics Image visibility (retry #1) (18.9s)
  ✘   47 [chromium] › image-visibility.spec.js:82:3 › Image Visibility Tests › Check BFG image is visible and loads correctly (retry #1) (6.2s)
  ✘   49 [chromium] › image-visibility.spec.js:82:3 › Image Visibility Tests › Check BFG image is visible and loads correctly (retry #2) (3.3s)
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
  ✓   50 [chromium] › image-visibility.spec.js:112:3 › Image Visibility Tests › Industry cards have visible background images and text (4.5s)
  ✓   51 [chromium] › image-visibility.spec.js:158:3 › Image Visibility Tests › Check all critical image HTTP responses (206ms)
  ✘   48 [chromium] › image-visibility-index.spec.js:213:3 › Image Visibility on Index Page › Tokenomics Image visibility (retry #2) (15.8s)
    Error: expect(locator).toBeVisible() failed
        14 × locator resolved to <img loading="lazy" alt="$BWS Token Allocation" class="image-token-allocation" src="/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png"/>
           - unexpected value "hidden"
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:220:30
    test-results/image-visibility-index-Ima-f43cc-Tokenomics-Image-visibility-chromium/test-failed-1.png
    Error Context: test-results/image-visibility-index-Ima-f43cc-Tokenomics-Image-visibility-chromium/error-context.md
    Error: expect(locator).toBeVisible() failed
```
</details>
