# Test Failure Report - Fix Branch

**Generated:** 2025-10-04 09:59:28 UTC
**Branch:** fix/test-failures-2025-09-28T15-58-27-e2206f4
**Commit:** 167fe89d76e2bc6ee6a50bd7c776244c759a5d6b
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18242679760)

## 🔁 Recurring Issues Analysis

Comparing with previous reports:
- BRANCH_ISSUES_29-09-17.md
- BRANCH_ISSUES_30-09-06.md
- BRANCH_ISSUES_30-09-08.md
- BRANCH_ISSUES_30-09-14.md
- BRANCH_ISSUES_TEST_03-10-17.md

### Known Recurring Issues:
- ⚠️ **WCAG Color Contrast Failures** (wcag-compliance.spec.js)
  - Appears in 4 of last 5 reports
  - Error: Color contrast violations not meeting WCAG AA 4.5:1 or AAA 3:1 standards

## Test Results
### 📊 Test Statistics
- **Total Tests:** 72
- **✅ Passed:** 34
- **❌ Failed:** 32
- **⚠️ Flaky:** 3
- **⏭ Skipped:** 3
- **⏱ Duration:** 1062818.3590000002ms

### 🔴 Failed Tests Summary

## 🔍 Enhanced Error Diagnostics

### contrast-violation (1 occurrence(s))

<details>
<summary>View diagnostic details</summary>

```
=== WCAG COLOR CONTRAST VIOLATION ===
Rule ID: color-contrast
Impact: serious
Help: Elements must meet minimum color contrast ratio thresholds
Help URL: https://dequeuniversity.com/rules/axe/4.10/color-contrast?application=playwright

Element:
<div class="text-roadmap-title-4th">Token Integration</div>

Selector:
.container-head-roadmap-25-2nd > .text-roadmap-title-4th

Color details:
  Foreground: #e34560
  Background: #6b6b73
  Actual ratio: 1.32:1
  Required ratio: 3:1
  Font size: 18.0pt (24px)
  Font weight: normal

How to fix:
1. Find the element in public/styles.css using the selector above
2. Calculate contrast ratio: https://webaim.org/resources/contrastchecker/
3. Adjust foreground or background color to meet WCAG AA:
   - Normal text: 4.5:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
4. Add CSS fix with !important flag if needed

Useful commands:
grep -n "container-head-roadmap-25-2nd" public/styles.css```
</details>

### size-constraint-violation (2 occurrence(s))

<details>
<summary>View diagnostic details</summary>

```
=== IMAGE SIZE CONSTRAINT VIOLATION ===
Image: AssureDefi Logo
Selector: img[src*="AssureDefi"]
Constraint: height

Expected vs Actual:
  Expected height: 40px
  Actual height: 50px

Image dimensions:
  Natural: 1000x1000
  Rendered: 80x50

Computed styles:
  max-width: 80px
  height: 50px
  object-fit: contain

Possible causes:
1. CSS max-width not applied (timing issue in headless Chrome)
2. Inline style overriding CSS
3. Parent container forcing larger size
4. CSS specificity conflict
5. Image aspect ratio causing unexpected dimensions

Debugging:
Check CSS in public/styles.css:

Check for inline styles:
  grep -n "style=" _site/index.html | grep -i "assuredefi logo"
Check for conflicting rules:
  Look for "max-width: none" or "width: 100%" in styles.css```
</details>

<details>
<summary>View diagnostic details</summary>

```
=== IMAGE SIZE CONSTRAINT VIOLATION ===
Image: AssureDefi Logo
Selector: img[src*="AssureDefi"]
Constraint: height

Expected vs Actual:
  Expected height: 40px
  Actual height: 50px

Image dimensions:
  Natural: 1000x1000
  Rendered: 80x50

Computed styles:
  max-width: 80px
  height: 50px


Possible causes:
1. CSS max-width not applied (timing issue in headless Chrome)
2. Inline style overriding CSS
3. Parent container forcing larger size
4. CSS specificity conflict
5. Image aspect ratio causing unexpected dimensions

Debugging:
Check CSS in public/styles.css:

Check for inline styles:
  grep -n "style=" _site/index.html | grep -i "assuredefi logo"
Check for conflicting rules:
  Look for "max-width: none" or "width: 100%" in styles.css```
</details>

No enhanced diagnostics available for this test run.

_Diagnostic files are created when tests call error-reporting functions with testInfo parameter._

## 📋 Detailed Test Failures

### Failure #1

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-3/cf0e4117fc645561e277979c9f83591b.webm +8s`

**Error Details:**
```
Error: expect(received).toEqual(expected) // deep equality
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
```

---

### Failure #2

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-3/cf0e4117fc645561e277979c9f83591b.webm +8s`

**Error Details:**
```
Error: expect(received).toEqual(expected) // deep equality
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
```

---

### Failure #3

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-3/cf0e4117fc645561e277979c9f83591b.webm +8s`

**Error Details:**
```
Error: expect(received).toEqual(expected) // deep equality
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
```

---

### Failure #4

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-4/c9d215702627703b80663c9e7e55acf4.webm +35ms`

**Error Details:**
```
Test timeout of 60000ms exceeded while running "beforeEach" hook.
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/button-hover-contrast.spec.js:4:8
    Error: page.waitForLoadState: Test timeout of 60000ms exceeded.
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/button-hover-contrast.spec.js:6:16
```

---

### Failure #5

**Test:** `    Test timeout of 60000ms exceeded while running "beforeEach" hook.`

**Error Details:**
```
Error: page.waitForLoadState: Test timeout of 60000ms exceeded.
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/button-hover-contrast.spec.js:6:16
    test-results/accessibility-button-hover-5d172--hover-contrast-on-homepage-chromium/test-failed-1.png
    test-results/accessibility-button-hover-5d172--hover-contrast-on-homepage-chromium/video.webm
```

---

### Failure #6

**Test:** `   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum`

**Error Details:**
```
Error: expect(received).toHaveLength(expected)
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:195:32
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/video.webm
```

---

### Failure #7

**Test:** `   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum`

**Error Details:**
```
Error: expect(received).toHaveLength(expected)
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:195:32
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/video.webm
```

---

### Failure #8

**Test:** `   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum`

**Error Details:**
```
Error: expect(received).toHaveLength(expected)
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:195:32
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/video.webm
```

---

### Failure #9

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-4/c9d215702627703b80663c9e7e55acf4.webm +35ms`

**Error Details:**
```
Test timeout of 60000ms exceeded.
    Error: page.waitForLoadState: Test timeout of 60000ms exceeded.
        at /home/runner/work/bws-website-front/bws-website-front/tests/assets.spec.js:108:18
    test-results/assets-Asset-Verification-Tests-Layout-test-on-Desktop-chromium/test-failed-1.png
```

**Screenshot:** `    test-results/tests-comprehensive-image--224cf-te-with-advanced-validation-chromium/test-failed-1.png`

---

### Failure #10

**Test:** `    Test timeout of 60000ms exceeded while running "beforeEach" hook.`

**Error Details:**
```
Error: page.waitForLoadState: Test timeout of 60000ms exceeded.
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/button-hover-contrast.spec.js:6:16
    test-results/accessibility-button-hover-5d172--hover-contrast-on-homepage-chromium/test-failed-1.png
    test-results/accessibility-button-hover-5d172--hover-contrast-on-homepage-chromium/video.webm
```

---

### Failure #11

**Test:** `5. Image aspect ratio causing unexpected dimensions`

**Error Details:**
```
Error: expect(received).toBeLessThanOrEqual(expected)
    > 424 |           expect(actualHeight).toBeLessThanOrEqual(expectedHeight);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:424:32
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
```

---

### Failure #12

**Test:** `  ✘   38 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (7.1s)`

**Error Details:**
```
> 424 |           expect(actualHeight).toBeLessThanOrEqual(expectedHeight);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:424:32
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/video.webm
```

---

### Failure #13

**Test:** `5. Image aspect ratio causing unexpected dimensions`

**Error Details:**
```
Error: expect(received).toBeLessThanOrEqual(expected)
    > 424 |           expect(actualHeight).toBeLessThanOrEqual(expectedHeight);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:424:32
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
```

---

### Failure #14

**Test:** `  ✘   38 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (7.1s)`

**Error Details:**
```
> 424 |           expect(actualHeight).toBeLessThanOrEqual(expectedHeight);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:424:32
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/video.webm
```

---

### Failure #15

**Test:** `5. Image aspect ratio causing unexpected dimensions`

**Error Details:**
```
Error: expect(received).toBeLessThanOrEqual(expected)
    > 424 |           expect(actualHeight).toBeLessThanOrEqual(expectedHeight);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:424:32
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
```

---

### Failure #16

**Test:** `  ✘   38 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (7.1s)`

**Error Details:**
```
> 424 |           expect(actualHeight).toBeLessThanOrEqual(expectedHeight);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:424:32
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/video.webm
```

---

### Failure #17

**Test:** `5. Image aspect ratio causing unexpected dimensions`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:151:27
    test-results/image-visibility-index-Ima-549b7-efi-Logo-visibility-and-CSS-chromium/test-failed-1.png
    test-results/image-visibility-index-Ima-549b7-efi-Logo-visibility-and-CSS-chromium/video.webm
```

---

### Failure #18

**Test:** `5. Image aspect ratio causing unexpected dimensions`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:151:27
    test-results/image-visibility-index-Ima-549b7-efi-Logo-visibility-and-CSS-chromium/test-failed-1.png
    test-results/image-visibility-index-Ima-549b7-efi-Logo-visibility-and-CSS-chromium/video.webm
```

---

### Failure #19

**Test:** `5. Image aspect ratio causing unexpected dimensions`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:151:27
    test-results/image-visibility-index-Ima-549b7-efi-Logo-visibility-and-CSS-chromium/test-failed-1.png
    test-results/image-visibility-index-Ima-549b7-efi-Logo-visibility-and-CSS-chromium/video.webm
```

---

### Failure #20

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-18/05d3603454fc4af5aa656b25eaaa2325.webm +48ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        13 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" class="top-menu-company-news-image" alt="Blockchain Founders Group logo" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
           - unexpected value "hidden"
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:161:26
```

## 📄 Raw Test Output

<details>
<summary>Click to expand full test output (cleaned)</summary>

```
Running 110 tests using 2 workers
Running 110 tests using 2 workers
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/5c05a1e835f6e42bca2e9e3099ba30ca.webm +433ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/5c05a1e835f6e42bca2e9e3099ba30ca.webm +433ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/abd1262f946c020ea4d5ef1a4b108fa3.webm +488ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/abd1262f946c020ea4d5ef1a4b108fa3.webm +488ms
  ✓    2 [chromium] › accessibility/button-hover-contrast.spec.js:9:3 › Button Hover State Accessibility › All button hover states maintain proper contrast (9.8s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/1a8ff6b2bb278a6bf0109d71dacfc677.webm +489ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/1a8ff6b2bb278a6bf0109d71dacfc677.webm +489ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/30c84e863d7b0fc8d8a0d88af2352031.webm +8s
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/30c84e863d7b0fc8d8a0d88af2352031.webm +8s
  ✘    3 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (10.7s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-2/1ab4d1e24f94d8927266a81490073b15.webm +109ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-2/1ab4d1e24f94d8927266a81490073b15.webm +109ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-2/0305d81f8e216e4157e86be6f392970a.webm +10s
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-2/0305d81f8e216e4157e86be6f392970a.webm +10s
  ✘    4 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (retry #1) (17.3s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-3/ec71f17f856be219c5c0645a4d13b944.webm +79ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-3/ec71f17f856be219c5c0645a4d13b944.webm +79ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-3/cf0e4117fc645561e277979c9f83591b.webm +8s
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-3/cf0e4117fc645561e277979c9f83591b.webm +8s
  ✘    5 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (retry #2) (10.9s)
    Error: expect(received).toEqual(expected) // deep equality
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:33:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/video.webm
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/video-1.webm
    Error Context: test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/error-context.md
    Error: expect(received).toEqual(expected) // deep equality
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:33:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/test-failed-1.png
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/video.webm
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/video-1.webm
    Error Context: test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/error-context.md
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/trace.zip
        npx playwright show-trace test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/trace.zip
    Error: expect(received).toEqual(expected) // deep equality
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:33:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/test-failed-1.png
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/video.webm
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/video-1.webm
    Error Context: test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/error-context.md
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/fd7cd4604e9a8b4246dc3796761ef742.webm +62ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/fd7cd4604e9a8b4246dc3796761ef742.webm +62ms
  ✘    1 [chromium] › accessibility/button-hover-contrast.spec.js:137:3 › Button Hover State Accessibility › Learn More button hover contrast on homepage (1.0m)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/dbaafed74073d8380257dcc17e9c9e5a.webm +4s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/dbaafed74073d8380257dcc17e9c9e5a.webm +4s
  ✓    6 [chromium] › accessibility/wcag-compliance.spec.js:36:3 › WCAG Accessibility Compliance › About page passes accessibility checks (5.0s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/4bf3d89e55090ff1c19d25bb8a7e5513.webm +97ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/4bf3d89e55090ff1c19d25bb8a7e5513.webm +97ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/24fdf14045be0175218ddf284b92a354.webm +19ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/24fdf14045be0175218ddf284b92a354.webm +19ms
  ✓    7 [chromium] › accessibility/wcag-compliance.spec.js:61:3 › WCAG Accessibility Compliance › All images have alt text (4.1s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/131113874ac4bcd57558a697c0838714.webm +102ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/131113874ac4bcd57558a697c0838714.webm +102ms
  ✓    9 [chromium] › accessibility/wcag-compliance.spec.js:87:3 › WCAG Accessibility Compliance › All form inputs have labels (3.3s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/b6d1a297321ae8822982de695bf949e0.webm +66ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/b6d1a297321ae8822982de695bf949e0.webm +66ms
  ✓   10 [chromium] › accessibility/wcag-compliance.spec.js:130:3 › WCAG Accessibility Compliance › Keyboard navigation works correctly (3.7s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/c9d215702627703b80663c9e7e55acf4.webm +35ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/c9d215702627703b80663c9e7e55acf4.webm +35ms
  ✓    8 [chromium] › accessibility/button-hover-contrast.spec.js:137:3 › Button Hover State Accessibility › Learn More button hover contrast on homepage (retry #1) (9.8s)
    Test timeout of 60000ms exceeded while running "beforeEach" hook.
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/button-hover-contrast.spec.js:4:8
    Error: page.waitForLoadState: Test timeout of 60000ms exceeded.
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/button-hover-contrast.spec.js:6:16
    test-results/accessibility-button-hover-5d172--hover-contrast-on-homepage-chromium/test-failed-1.png
    test-results/accessibility-button-hover-5d172--hover-contrast-on-homepage-chromium/video.webm
    Error Context: test-results/accessibility-button-hover-5d172--hover-contrast-on-homepage-chromium/error-context.md
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/a70ba1924af72d632d92fa55706f9ce6.webm +2s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/a70ba1924af72d632d92fa55706f9ce6.webm +2s
  ✓   12 [chromium] › accessibility/wcag-compliance.spec.js:198:3 › WCAG Accessibility Compliance › Page has proper heading hierarchy (4.5s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/1d13c38e87a5f3c3ccb216fc8123a4f8.webm +95ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/1d13c38e87a5f3c3ccb216fc8123a4f8.webm +95ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/648abc284fae58f2bf915b1c17b2d4f0.webm +9s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/648abc284fae58f2bf915b1c17b2d4f0.webm +9s
  ✓   13 [chromium] › accessibility/wcag-compliance.spec.js:263:3 › WCAG Accessibility Compliance › ARIA landmarks are properly used (4.5s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/a95b32fd2bb2d1393cf6944f8781281f.webm +90ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/a95b32fd2bb2d1393cf6944f8781281f.webm +90ms
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
  ✘   11 [chromium] › accessibility/wcag-compliance.spec.js:157:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (12.5s)
  ✓   14 [chromium] › accessibility/wcag-compliance.spec.js:303:3 › WCAG Accessibility Compliance › Focus trap in modals works correctly (3.7s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/b0c375b68331cc63a29556bcc8bd08c5.webm +58ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/b0c375b68331cc63a29556bcc8bd08c5.webm +58ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-6/8c4680eb46f11486af94e0abd73558ce.webm +67ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-6/8c4680eb46f11486af94e0abd73558ce.webm +67ms
  ✓   16 [chromium] › assets.spec.js:47:3 › Asset Verification Tests › AssureDefi image size check (4.2s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/0f1d7e447f11dc4c2d339f4e96800652.webm +106ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/0f1d7e447f11dc4c2d339f4e96800652.webm +106ms
  ✓   18 [chromium] › assets.spec.js:66:3 › Asset Verification Tests › Tokenomics image test (5.4s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/863fb9a51ce60246af1d923c4d712808.webm +70ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/863fb9a51ce60246af1d923c4d712808.webm +70ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-6/9aa960910c12bd39247f55f14cfea3b4.webm +11s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-6/9aa960910c12bd39247f55f14cfea3b4.webm +11s
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
  ✓   19 [chromium] › assets.spec.js:86:3 › Asset Verification Tests › Blockchain Founders Group image test (4.9s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/52ab786b6e049ef93a5f3acf0328aa70.webm +94ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/52ab786b6e049ef93a5f3acf0328aa70.webm +94ms
  ✘   17 [chromium] › accessibility/wcag-compliance.spec.js:157:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (retry #1) (18.2s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/1a37a33579985456c20fc74f47a3042e.webm +76ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/1a37a33579985456c20fc74f47a3042e.webm +76ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/1b5b3728c60150f4b1e359b47aa2812c.webm +8s
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/1b5b3728c60150f4b1e359b47aa2812c.webm +8s
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
  ✘   21 [chromium] › accessibility/wcag-compliance.spec.js:157:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (retry #2) (12.4s)
    Error: expect(received).toHaveLength(expected)
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:195:32
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/video.webm
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/video-1.webm
    Error Context: test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/error-context.md
    Error: expect(received).toHaveLength(expected)
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:195:32
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium-retry1/test-failed-1.png
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium-retry1/video.webm
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium-retry1/video-1.webm
    Error Context: test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium-retry1/error-context.md
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium-retry1/trace.zip
        npx playwright show-trace test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium-retry1/trace.zip
    Error: expect(received).toHaveLength(expected)
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:195:32
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium-retry2/test-failed-1.png
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium-retry2/video.webm
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium-retry2/video-1.webm
    Error Context: test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium-retry2/error-context.md
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-8/42d5d7e20f655a7154aafd67add4243c.webm +108ms
```
</details>
