# Test Failure Report - Fix Branch

**Generated:** 2025-10-04 16:15:18 UTC
**Branch:** fix/test-failures-2025-09-28T15-58-27-e2206f4
**Commit:** 047ef5e3f01414d0ffeee7da0bc2681647ef3c80
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18246418683)

## 🔁 Recurring Issues Analysis

Comparing with previous reports:
- BRANCH_ISSUES_04-10-08.md
- BRANCH_ISSUES_04-10-09.md
- BRANCH_ISSUES_04-10-15.md
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
- **Total Tests:** 78
- **✅ Passed:** 46
- **❌ Failed:** 29
- **⚠️ Flaky:** 0
- **⏭ Skipped:** 3
- **⏱ Duration:** 922695.353ms

### 🔴 Failed Tests Summary

## 🔍 Enhanced Error Diagnostics

No enhanced diagnostics available - diagnostics directory not created.

_This is expected if no tests failed or error-reporting functions weren't called._

## 📋 Detailed Test Failures

### Failure #1

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-0/40b3760a008eeca4e26ba22a7ab3fb01.webm +111ms`

**Error Details:**
```
Error: expect(received).toEqual(expected) // deep equality
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:33:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/video-1.webm
```

---

### Failure #2

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-0/40b3760a008eeca4e26ba22a7ab3fb01.webm +111ms`

**Error Details:**
```
Error: expect(received).toEqual(expected) // deep equality
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:33:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/video-1.webm
```

---

### Failure #3

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-0/40b3760a008eeca4e26ba22a7ab3fb01.webm +111ms`

**Error Details:**
```
Error: expect(received).toEqual(expected) // deep equality
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:33:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/video-1.webm
```

---

### Failure #4

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-7/b0d4fce308ec3af72074afa63b3e8dde.webm +27ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" class="top-menu-company-news-image" alt="Blockchain Founders Group logo" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

---

### Failure #5

**Test:** `image-validation-Image-Vis-184d7--visible-and-properly-sized`

**Error Details:**
```
Test timeout of 60000ms exceeded while running "beforeEach" hook.
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:251:8
    TimeoutError: page.goto: Timeout 60000ms exceeded.
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:252:16
```

---

### Failure #6

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-7/b0d4fce308ec3af72074afa63b3e8dde.webm +27ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" class="top-menu-company-news-image" alt="Blockchain Founders Group logo" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

---

### Failure #7

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-7/b0d4fce308ec3af72074afa63b3e8dde.webm +27ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" class="top-menu-company-news-image" alt="Blockchain Founders Group logo" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

---

### Failure #8

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-7/b0d4fce308ec3af72074afa63b3e8dde.webm +27ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" class="top-menu-company-news-image" alt="Blockchain Founders Group logo" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

---

### Failure #9

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-7/b0d4fce308ec3af72074afa63b3e8dde.webm +27ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" class="top-menu-company-news-image" alt="Blockchain Founders Group logo" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

---

### Failure #10

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-7/b0d4fce308ec3af72074afa63b3e8dde.webm +27ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" class="top-menu-company-news-image" alt="Blockchain Founders Group logo" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

---

### Failure #11

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-7/b0d4fce308ec3af72074afa63b3e8dde.webm +27ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" class="top-menu-company-news-image" alt="Blockchain Founders Group logo" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

---

### Failure #12

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-7/b0d4fce308ec3af72074afa63b3e8dde.webm +27ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" class="top-menu-company-news-image" alt="Blockchain Founders Group logo" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

---

### Failure #13

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-20/252b9eb901e4ceeca7e38f6cd88a8733.webm +91ms`

**Error Details:**
```
Error: expect(received).toBeGreaterThan(expected)
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility.spec.js:107:28
    test-results/image-visibility-Image-Vis-48787-visible-and-loads-correctly-chromium/test-failed-1.png
    test-results/image-visibility-Image-Vis-48787-visible-and-loads-correctly-chromium/video.webm
```

## 📄 Raw Test Output

<details>
<summary>Click to expand full test output (cleaned)</summary>

```
Running 110 tests using 2 workers
Running 110 tests using 2 workers
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/2b95a3aa7132f239249264331b0bbb30.webm +409ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/2b95a3aa7132f239249264331b0bbb30.webm +409ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/bfac60e02fcb9f17682211df9dd907e8.webm +431ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/bfac60e02fcb9f17682211df9dd907e8.webm +431ms
  ✓    1 [chromium] › accessibility/button-hover-contrast.spec.js:137:3 › Button Hover State Accessibility › Learn More button hover contrast on homepage (5.2s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/5f907165e7b827ee18c02fc99150cd22.webm +566ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/5f907165e7b827ee18c02fc99150cd22.webm +566ms
  ✓    2 [chromium] › accessibility/button-hover-contrast.spec.js:9:3 › Button Hover State Accessibility › All button hover states maintain proper contrast (9.4s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/4e8a00546e3e65e17636d5911f32ccf7.webm +593ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/4e8a00546e3e65e17636d5911f32ccf7.webm +593ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/9ae479185a8a2af4651de05bba04c9b7.webm +7s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/9ae479185a8a2af4651de05bba04c9b7.webm +7s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/7b70d26cffccf6c113fe0e72a22ee1c3.webm +3s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/7b70d26cffccf6c113fe0e72a22ee1c3.webm +3s
  ✓    4 [chromium] › accessibility/wcag-compliance.spec.js:36:3 › WCAG Accessibility Compliance › About page passes accessibility checks (5.8s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/80c3f645f1a593b2d70843163f5d5bb6.webm +91ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/80c3f645f1a593b2d70843163f5d5bb6.webm +91ms
  ✘    3 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (10.4s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-2/59a21804dbd8fdd37c0d03fb4f0f2073.webm +73ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-2/59a21804dbd8fdd37c0d03fb4f0f2073.webm +73ms
  ✓    5 [chromium] › accessibility/wcag-compliance.spec.js:61:3 › WCAG Accessibility Compliance › All images have alt text (2.9s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/d7c637998f369bd0b383904dd323ddbd.webm +68ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/d7c637998f369bd0b383904dd323ddbd.webm +68ms
  ✓    7 [chromium] › accessibility/wcag-compliance.spec.js:87:3 › WCAG Accessibility Compliance › All form inputs have labels (2.8s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/e63be18a90dbe917ff6f218840d80e44.webm +79ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/e63be18a90dbe917ff6f218840d80e44.webm +79ms
  ✓    8 [chromium] › accessibility/wcag-compliance.spec.js:130:3 › WCAG Accessibility Compliance › Keyboard navigation works correctly (3.9s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/4f471da7a6067fc76fbff52ce86f2b86.webm +46ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/4f471da7a6067fc76fbff52ce86f2b86.webm +46ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-2/d16c701df46055d20070346804ff80af.webm +10s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-2/d16c701df46055d20070346804ff80af.webm +10s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/7e49cff39c5a97b5946ee14b725192f8.webm +11s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/7e49cff39c5a97b5946ee14b725192f8.webm +11s
  ✓    9 [chromium] › accessibility/wcag-compliance.spec.js:157:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (13.2s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/0a44d8650d3c941793b98021f8a3fa72.webm +67ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/0a44d8650d3c941793b98021f8a3fa72.webm +67ms
  ✘    6 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (retry #1) (17.6s)
  ✓   10 [chromium] › accessibility/wcag-compliance.spec.js:198:3 › WCAG Accessibility Compliance › Page has proper heading hierarchy (2.8s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/18d0405d395836eec77007f77015d286.webm +29ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/18d0405d395836eec77007f77015d286.webm +29ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-3/fffcb0f37c5f50d37b7636c3c4bd5b36.webm +71ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-3/fffcb0f37c5f50d37b7636c3c4bd5b36.webm +71ms
  ✓   11 [chromium] › accessibility/wcag-compliance.spec.js:263:3 › WCAG Accessibility Compliance › ARIA landmarks are properly used (3.4s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/c91323d267937d22c4a18b39ac5b94d9.webm +74ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/c91323d267937d22c4a18b39ac5b94d9.webm +74ms
  ✓   13 [chromium] › accessibility/wcag-compliance.spec.js:303:3 › WCAG Accessibility Compliance › Focus trap in modals works correctly (3.7s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/9bd7fd4ff27aff11090348038f392cb6.webm +104ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/9bd7fd4ff27aff11090348038f392cb6.webm +104ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-3/77e48415fda9953f3ff35f2957c8bbf2.webm +9s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-3/77e48415fda9953f3ff35f2957c8bbf2.webm +9s
  ✓   15 [chromium] › assets.spec.js:47:3 › Asset Verification Tests › AssureDefi image size check (4.5s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/40b3760a008eeca4e26ba22a7ab3fb01.webm +111ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/40b3760a008eeca4e26ba22a7ab3fb01.webm +111ms
  ✘   12 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (retry #2) (11.5s)
    Error: expect(received).toEqual(expected) // deep equality
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:33:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/video-1.webm
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/video.webm
    Error Context: test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/error-context.md
    Error: expect(received).toEqual(expected) // deep equality
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:33:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/test-failed-1.png
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/video.webm
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/video-1.webm
    Error Context: test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/error-context.md
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/trace.zip
        npx playwright show-trace test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/trace.zip
    Error: expect(received).toEqual(expected) // deep equality
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:33:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/test-failed-1.png
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/video-1.webm
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/video.webm
    Error Context: test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/error-context.md
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/854b538f8dc79ad102907d5cc731082d.webm +33ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/854b538f8dc79ad102907d5cc731082d.webm +33ms
  ✓   16 [chromium] › assets.spec.js:66:3 › Asset Verification Tests › Tokenomics image test (4.3s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/5f33f7f45286350f7da7e033b90bdf87.webm +66ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/5f33f7f45286350f7da7e033b90bdf87.webm +66ms
  ✓   17 [chromium] › assets.spec.js:86:3 › Asset Verification Tests › Blockchain Founders Group image test (3.6s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/8e8351c07b989d0c961cb0c588d351ef.webm +98ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/8e8351c07b989d0c961cb0c588d351ef.webm +98ms
  ✓   18 [chromium] › assets.spec.js:105:5 › Asset Verification Tests › Layout test on Desktop (4.0s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/02e3fc642341f36a374cec5389090d34.webm +58ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/02e3fc642341f36a374cec5389090d34.webm +58ms
  ✓   19 [chromium] › assets.spec.js:105:5 › Asset Verification Tests › Layout test on Tablet (3.6s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/6fde1f9e4a04bc5918aeb073e84a1332.webm +129ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/6fde1f9e4a04bc5918aeb073e84a1332.webm +129ms
  ✓   20 [chromium] › assets.spec.js:105:5 › Asset Verification Tests › Layout test on Mobile (3.1s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/b1670789dbb4b83e306e4239cec7d958.webm +99ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/b1670789dbb4b83e306e4239cec7d958.webm +99ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/303c663080df2f2e2bc79ffdb792d8d0.webm +4s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/303c663080df2f2e2bc79ffdb792d8d0.webm +4s
  ✓   22 [chromium] › e2e/navigation.spec.js:38:3 › Navigation Tests › Industry dropdown navigation works (6.6s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/58f47d1f8f33be788970e9f70ab33c48.webm +119ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/58f47d1f8f33be788970e9f70ab33c48.webm +119ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/9ca5307929924791d055c174d8d49dc9.webm +73ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/9ca5307929924791d055c174d8d49dc9.webm +73ms
  ✓   23 [chromium] › e2e/navigation.spec.js:80:3 › Navigation Tests › Footer navigation links work (7.6s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/892e1a646d433011ec8dd4097c682e35.webm +71ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/892e1a646d433011ec8dd4097c682e35.webm +71ms
✓ 404 handling is working correctly for static site
[1A✓ 404 handling is working correctly for static site
  ✓   25 [chromium] › e2e/navigation.spec.js:243:3 › Navigation Tests › 404 page handles non-existent routes (477ms)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/fcf37235889afbe41b855d18594a6b0e.webm +61ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/fcf37235889afbe41b855d18594a6b0e.webm +61ms
  ✓   24 [chromium] › e2e/navigation.spec.js:207:3 › Navigation Tests › Logo click returns to homepage (4.2s)
  ✓   28 [chromium] › image-validation.spec.js:52:3 › Image Files and CSS Validation › Check image files exist in build directory (35ms)
  ✓   29 [chromium] › image-validation.spec.js:77:3 › Image Files and CSS Validation › Check CSS classes are defined with proper rules (27ms)
  ✓   30 [chromium] › image-validation.spec.js:150:3 › Image Files and CSS Validation › Check HTML for problematic attributes (4ms)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/84dcd6d0b5a4493cc7f7b0c8e98905a7.webm +296ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/84dcd6d0b5a4493cc7f7b0c8e98905a7.webm +296ms
  ✓   26 [chromium] › e2e/navigation.spec.js:288:3 › Navigation Tests › All marketplace products are accessible (6.2s)
[1A[32/110] [chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/3289cdbf31fdb590db7e168d7837661b.webm +88ms
[1A[chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/3289cdbf31fdb590db7e168d7837661b.webm +88ms
  ✘   31 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (11.9s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/070baa7048488d2f8779d434e883dea5.webm +47ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/070baa7048488d2f8779d434e883dea5.webm +47ms
✅ No 404 errors detected for images
[1A[chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images
✅ No 404 errors detected for images
  ✓   32 [chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images (9.1s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/1d1d838f7b4135d598494c0826588d1a.webm +56ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/1d1d838f7b4135d598494c0826588d1a.webm +56ms
  ✘   34 [chromium] › image-validation.spec.js:499:3 › Image Visibility on Live Page › Take screenshots for visual verification (41.8s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-6/ad7532befff1e5d4cef4d2867a41ddcc.webm +69ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-6/ad7532befff1e5d4cef4d2867a41ddcc.webm +69ms
  ✘   33 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #1) (1.1m)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/b0d4fce308ec3af72074afa63b3e8dde.webm +27ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/b0d4fce308ec3af72074afa63b3e8dde.webm +27ms
  ✘   36 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (9.9s)
    Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" class="top-menu-company-news-image" alt="Blockchain Founders Group logo" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:297:36
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/video.webm
    Error Context: test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/error-context.md
    Test timeout of 60000ms exceeded while running "beforeEach" hook.
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:251:8
    TimeoutError: page.goto: Timeout 60000ms exceeded.
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:252:16
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/video.webm
    Error Context: test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/error-context.md
```
</details>
