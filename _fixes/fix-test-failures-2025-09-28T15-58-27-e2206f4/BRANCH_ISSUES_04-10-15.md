# Test Failure Report - Fix Branch

**Generated:** 2025-10-04 15:12:13 UTC
**Branch:** fix/test-failures-2025-09-28T15-58-27-e2206f4
**Commit:** f8dbcaf8f59545aff48bf910ca03139782ad69ba
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18245823127)

## 🔁 Recurring Issues Analysis

Comparing with previous reports:
- BRANCH_ISSUES_03-10-20.md
- BRANCH_ISSUES_04-10-08.md
- BRANCH_ISSUES_04-10-09.md
- BRANCH_ISSUES_29-09-13.md
- BRANCH_ISSUES_29-09-16.md

### Known Recurring Issues:
- ⚠️ **WCAG Color Contrast Failures** (wcag-compliance.spec.js)
  - Appears in 5 of last 5 reports
  - Error: Color contrast violations not meeting WCAG AA 4.5:1 or AAA 3:1 standards
- ⚠️ **BFG Logo Visibility Hidden** (image-visibility-index.spec.js:161)
  - Appears in 3 of last 5 reports
  - Error: Blockchain Founders Group logo has visibility:hidden in computed styles

## Test Results
### 📊 Test Statistics
- **Total Tests:** 77
- **✅ Passed:** 44
- **❌ Failed:** 30
- **⚠️ Flaky:** 0
- **⏭ Skipped:** 3
- **⏱ Duration:** 900856.9110000001ms

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
  Foreground: #a01030
  Background: #6b6b73
  Actual ratio: 1.52:1
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

No enhanced diagnostics available for this test run.

_Diagnostic files are created when tests call error-reporting functions with testInfo parameter._

## 📋 Detailed Test Failures

### Failure #1

**Test:** `   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum`

**Error Details:**
```
Error: expect(received).toEqual(expected) // deep equality
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
```

---

### Failure #2

**Test:** `   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum`

**Error Details:**
```
Error: expect(received).toEqual(expected) // deep equality
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
```

---

### Failure #3

**Test:** `   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum`

**Error Details:**
```
Error: expect(received).toEqual(expected) // deep equality
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
```

---

### Failure #4

**Test:** `   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum`

**Error Details:**
```
Error: expect(received).toHaveLength(expected)
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:195:32
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/video-1.webm
```

---

### Failure #5

**Test:** `   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum`

**Error Details:**
```
Error: expect(received).toHaveLength(expected)
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:195:32
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/video-1.webm
```

---

### Failure #6

**Test:** `   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum`

**Error Details:**
```
Error: expect(received).toHaveLength(expected)
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:195:32
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/video-1.webm
```

---

### Failure #7

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-9/6377ca318ac76e2349298b7cff2ec052.webm +32ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" class="top-menu-company-news-image" alt="Blockchain Founders Group logo" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

---

### Failure #8

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-9/6377ca318ac76e2349298b7cff2ec052.webm +32ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" class="top-menu-company-news-image" alt="Blockchain Founders Group logo" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

---

### Failure #9

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-9/6377ca318ac76e2349298b7cff2ec052.webm +32ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" class="top-menu-company-news-image" alt="Blockchain Founders Group logo" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

---

### Failure #10

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-9/6377ca318ac76e2349298b7cff2ec052.webm +32ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" class="top-menu-company-news-image" alt="Blockchain Founders Group logo" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

---

### Failure #11

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-9/6377ca318ac76e2349298b7cff2ec052.webm +32ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" class="top-menu-company-news-image" alt="Blockchain Founders Group logo" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

---

### Failure #12

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-9/6377ca318ac76e2349298b7cff2ec052.webm +32ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" class="top-menu-company-news-image" alt="Blockchain Founders Group logo" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

---

### Failure #13

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-9/6377ca318ac76e2349298b7cff2ec052.webm +32ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" class="top-menu-company-news-image" alt="Blockchain Founders Group logo" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

---

### Failure #14

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-9/6377ca318ac76e2349298b7cff2ec052.webm +32ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" class="top-menu-company-news-image" alt="Blockchain Founders Group logo" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

---

### Failure #15

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-9/6377ca318ac76e2349298b7cff2ec052.webm +32ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" class="top-menu-company-news-image" alt="Blockchain Founders Group logo" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

## 📄 Raw Test Output

<details>
<summary>Click to expand full test output (cleaned)</summary>

```
Running 110 tests using 2 workers
Running 110 tests using 2 workers
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/360317cb6a9070bc1a1e24d4163bb5f5.webm +254ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/360317cb6a9070bc1a1e24d4163bb5f5.webm +254ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/12301eba2151e0353f2d8f8fd254a3b8.webm +250ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/12301eba2151e0353f2d8f8fd254a3b8.webm +250ms
  ✓    2 [chromium] › accessibility/button-hover-contrast.spec.js:137:3 › Button Hover State Accessibility › Learn More button hover contrast on homepage (5.3s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/f43815d284d2ed7dd5e5097871b97a61.webm +615ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/f43815d284d2ed7dd5e5097871b97a61.webm +615ms
  ✓    1 [chromium] › accessibility/button-hover-contrast.spec.js:9:3 › Button Hover State Accessibility › All button hover states maintain proper contrast (9.1s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/ca4798058b01152b7980c7f106f96ab9.webm +590ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/ca4798058b01152b7980c7f106f96ab9.webm +590ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/a3431bc2afe2d994be247277ad9a915e.webm +4s
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/a3431bc2afe2d994be247277ad9a915e.webm +4s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/3464a84939a80e3bfe6ca838ce805d46.webm +7s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/3464a84939a80e3bfe6ca838ce805d46.webm +7s
  ✓    4 [chromium] › accessibility/wcag-compliance.spec.js:36:3 › WCAG Accessibility Compliance › About page passes accessibility checks (5.3s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/1826694a437fb01fc8a0b77423667d5f.webm +120ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/1826694a437fb01fc8a0b77423667d5f.webm +120ms
  ✘    3 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (10.3s)
  ✓    5 [chromium] › accessibility/wcag-compliance.spec.js:61:3 › WCAG Accessibility Compliance › All images have alt text (2.9s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/25821fe352edaf4c863b2dd93ac03d7b.webm +49ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/25821fe352edaf4c863b2dd93ac03d7b.webm +49ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-2/9e4ebcd14ad4f57f3d6ea4b9c80f8025.webm +75ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-2/9e4ebcd14ad4f57f3d6ea4b9c80f8025.webm +75ms
  ✓    6 [chromium] › accessibility/wcag-compliance.spec.js:87:3 › WCAG Accessibility Compliance › All form inputs have labels (2.6s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/902a081ab9e98771f1dd154f944a6d36.webm +107ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/902a081ab9e98771f1dd154f944a6d36.webm +107ms
  ✓    8 [chromium] › accessibility/wcag-compliance.spec.js:130:3 › WCAG Accessibility Compliance › Keyboard navigation works correctly (3.9s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/3e8c8f3999bfa8abb18e9e644c161d3e.webm +79ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/3e8c8f3999bfa8abb18e9e644c161d3e.webm +79ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-2/4c595fd56c2aed604048392f04da94c4.webm +10s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-2/4c595fd56c2aed604048392f04da94c4.webm +10s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/813533436fd394940b55ad28964a8eb5.webm +10s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/813533436fd394940b55ad28964a8eb5.webm +10s
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
  ✘    9 [chromium] › accessibility/wcag-compliance.spec.js:157:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (14.1s)
  ✘    7 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (retry #1) (17.9s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-3/04f4435ca9fddb3d3e5400dd9626555e.webm +88ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-3/04f4435ca9fddb3d3e5400dd9626555e.webm +88ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/0ef038b3aae7425bd475a7b5cf0d0994.webm +65ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/0ef038b3aae7425bd475a7b5cf0d0994.webm +65ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-3/e3b5a44c28d41a940f5e5a25ddde884c.webm +11s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-3/e3b5a44c28d41a940f5e5a25ddde884c.webm +11s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/c7b5522b26b7c95a1805cccf5277e1e1.webm +10s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/c7b5522b26b7c95a1805cccf5277e1e1.webm +10s
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
  ✘   11 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (retry #2) (13.4s)
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
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/b725bc84a09e07ef5307d983a9d6ca38.webm +66ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/b725bc84a09e07ef5307d983a9d6ca38.webm +66ms
  ✓   12 [chromium] › accessibility/wcag-compliance.spec.js:198:3 › WCAG Accessibility Compliance › Page has proper heading hierarchy (2.9s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/2267b5ad54e28e427f3bf889ea860c79.webm +76ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/2267b5ad54e28e427f3bf889ea860c79.webm +76ms
  ✘   10 [chromium] › accessibility/wcag-compliance.spec.js:157:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (retry #1) (18.6s)
  ✓   13 [chromium] › accessibility/wcag-compliance.spec.js:263:3 › WCAG Accessibility Compliance › ARIA landmarks are properly used (2.7s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/660f65759f4127769cf4d19e3730c901.webm +44ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/660f65759f4127769cf4d19e3730c901.webm +44ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-6/1d4aca2b6c0850f0212c1e8f85ac2b14.webm +54ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-6/1d4aca2b6c0850f0212c1e8f85ac2b14.webm +54ms
  ✓   14 [chromium] › accessibility/wcag-compliance.spec.js:303:3 › WCAG Accessibility Compliance › Focus trap in modals works correctly (3.6s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/13b96df16ff4f5a09fc5f4dc6c312449.webm +105ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/13b96df16ff4f5a09fc5f4dc6c312449.webm +105ms
  ✓   17 [chromium] › assets.spec.js:47:3 › Asset Verification Tests › AssureDefi image size check (4.4s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/ea05a9fb45135994d75b6770baae1ef3.webm +43ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/ea05a9fb45135994d75b6770baae1ef3.webm +43ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-6/ef6e2ad4d9ab6a49369aa4ab62d415ea.webm +9s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-6/ef6e2ad4d9ab6a49369aa4ab62d415ea.webm +9s
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
  ✘   15 [chromium] › accessibility/wcag-compliance.spec.js:157:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (retry #2) (12.2s)
    Error: expect(received).toHaveLength(expected)
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:195:32
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/video-1.webm
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/video.webm
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
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium-retry2/video-1.webm
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium-retry2/video.webm
    Error Context: test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium-retry2/error-context.md
  ✓   18 [chromium] › assets.spec.js:66:3 › Asset Verification Tests › Tokenomics image test (5.0s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/40597b4711b61da606627a5bdfa79a94.webm +62ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/40597b4711b61da606627a5bdfa79a94.webm +62ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/d3e60237e2a606d183471630f74fb16b.webm +134ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/d3e60237e2a606d183471630f74fb16b.webm +134ms
  ✓   19 [chromium] › assets.spec.js:105:5 › Asset Verification Tests › Layout test on Desktop (3.3s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/8d6375bf112671441fc101012bbe365d.webm +68ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/8d6375bf112671441fc101012bbe365d.webm +68ms
  ✓   20 [chromium] › assets.spec.js:86:3 › Asset Verification Tests › Blockchain Founders Group image test (4.3s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/d71850d6f928fa3ec4f760a26fa8a136.webm +78ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/d71850d6f928fa3ec4f760a26fa8a136.webm +78ms
  ✓   21 [chromium] › assets.spec.js:105:5 › Asset Verification Tests › Layout test on Tablet (3.6s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/4a2780ed9601485251eba9948af2f9b8.webm +96ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/4a2780ed9601485251eba9948af2f9b8.webm +96ms
  ✓   22 [chromium] › assets.spec.js:105:5 › Asset Verification Tests › Layout test on Mobile (2.9s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/4aa188e77c8703186bae2607b33e5fe9.webm +157ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/4aa188e77c8703186bae2607b33e5fe9.webm +157ms
```
</details>
