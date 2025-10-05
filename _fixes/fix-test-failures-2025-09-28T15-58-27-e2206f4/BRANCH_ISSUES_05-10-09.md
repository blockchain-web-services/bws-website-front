# Test Failure Report - Fix Branch

**Generated:** 2025-10-05 09:26:13 UTC
**Branch:** fix/test-failures-2025-09-28T15-58-27-e2206f4
**Commit:** 17e0d59764cc967c44c27fa56c837143000c023d
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18256697639)

## 🔁 Recurring Issues Analysis

Comparing with previous reports:
- BRANCH_ISSUES_30-09-06.md
- BRANCH_ISSUES_30-09-08.md
- BRANCH_ISSUES_30-09-14.md
- BRANCH_ISSUES_TEST_03-10-17.md
- BRANCH_ISSUES_03-10-20.md

### Known Recurring Issues:
- ⚠️ **WCAG Color Contrast Failures** (wcag-compliance.spec.js)
  - Appears in 4 of last 5 reports
  - Error: Color contrast violations not meeting WCAG AA 4.5:1 or AAA 3:1 standards

## Test Results
### 📊 Test Statistics
- **Total Tests:** 81
- **✅ Passed:** 52
- **❌ Failed:** 26
- **⚠️ Flaky:** 0
- **⏭ Skipped:** 3
- **⏱ Duration:** 856681.835ms

### 🔴 Failed Tests Summary

## 🔍 Enhanced Error Diagnostics

No enhanced diagnostics available - diagnostics directory not created.

_This is expected if no tests failed or error-reporting functions weren't called._

## 📋 Detailed Test Failures

### Failure #1

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-0/72d4ebac7eca6ef5d6e2ff12f887e589.webm +95ms`

**Error Details:**
```
Error: expect(received).toEqual(expected) // deep equality
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:33:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/video-1.webm
```

---

### Failure #2

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-0/72d4ebac7eca6ef5d6e2ff12f887e589.webm +95ms`

**Error Details:**
```
Error: expect(received).toEqual(expected) // deep equality
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:33:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/video-1.webm
```

---

### Failure #3

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-0/72d4ebac7eca6ef5d6e2ff12f887e589.webm +95ms`

**Error Details:**
```
Error: expect(received).toEqual(expected) // deep equality
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:33:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/video-1.webm
```

---

### Failure #4

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-0/d09e09a3b1db84c7881a5e30ba4ed37f.webm +88ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" alt="$BWS Token Allocation" class="image-token-allocation" src="/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

---

### Failure #5

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-0/d09e09a3b1db84c7881a5e30ba4ed37f.webm +88ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" alt="$BWS Token Allocation" class="image-token-allocation" src="/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

---

### Failure #6

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-0/d09e09a3b1db84c7881a5e30ba4ed37f.webm +88ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" alt="$BWS Token Allocation" class="image-token-allocation" src="/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

---

### Failure #7

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-0/d09e09a3b1db84c7881a5e30ba4ed37f.webm +88ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" alt="$BWS Token Allocation" class="image-token-allocation" src="/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

---

### Failure #8

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-0/d09e09a3b1db84c7881a5e30ba4ed37f.webm +88ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" alt="$BWS Token Allocation" class="image-token-allocation" src="/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

---

### Failure #9

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-0/d09e09a3b1db84c7881a5e30ba4ed37f.webm +88ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" alt="$BWS Token Allocation" class="image-token-allocation" src="/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

---

### Failure #10

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-12/7b890d507882a6b1b935b3f7f8b58f8c.webm +30ms`

**Error Details:**
```
Error: expect(received).toBeGreaterThan(expected)
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility.spec.js:107:28
    test-results/image-visibility-Image-Vis-48787-visible-and-loads-correctly-chromium/test-failed-1.png
    test-results/image-visibility-Image-Vis-48787-visible-and-loads-correctly-chromium/video.webm
```

---

### Failure #11

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-12/7b890d507882a6b1b935b3f7f8b58f8c.webm +30ms`

**Error Details:**
```
Error: expect(received).toBeGreaterThan(expected)
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility.spec.js:107:28
    test-results/image-visibility-Image-Vis-48787-visible-and-loads-correctly-chromium/test-failed-1.png
    test-results/image-visibility-Image-Vis-48787-visible-and-loads-correctly-chromium/video.webm
```

---

### Failure #12

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-12/7b890d507882a6b1b935b3f7f8b58f8c.webm +30ms`

**Error Details:**
```
Error: expect(received).toBeGreaterThan(expected)
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility.spec.js:107:28
    test-results/image-visibility-Image-Vis-48787-visible-and-loads-correctly-chromium/test-failed-1.png
    test-results/image-visibility-Image-Vis-48787-visible-and-loads-correctly-chromium/video.webm
```

---

### Failure #13

**Test:** `    TypeError: response.timing is not a function`

**Error Details:**
```
Error: page.goto: Test ended.
      105 |     // Check for slow resources (over 1 second)
        at /home/runner/work/bws-website-front/bws-website-front/tests/performance/core-web-vitals.spec.js:102:16
    test-results/performance-core-web-vital-3105a-esource-loading-performance-chromium/test-failed-1.png
```

---

### Failure #14

**Test:** `    TypeError: response.timing is not a function`

**Error Details:**
```
Error: page.waitForLoadState: Test ended.
      105 |     // Check for slow resources (over 1 second)
        at /home/runner/work/bws-website-front/bws-website-front/tests/performance/core-web-vitals.spec.js:103:16
    test-results/performance-core-web-vital-3105a-esource-loading-performance-chromium-retry1/test-failed-1.png
```

---

### Failure #15

**Test:** `    TypeError: response.timing is not a function`

**Error Details:**
```
Error: page.waitForLoadState: Test ended.
      105 |     // Check for slow resources (over 1 second)
        at /home/runner/work/bws-website-front/bws-website-front/tests/performance/core-web-vitals.spec.js:103:16
    test-results/performance-core-web-vital-3105a-esource-loading-performance-chromium-retry1/test-failed-1.png
```

---

### Failure #16

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-0/d09e09a3b1db84c7881a5e30ba4ed37f.webm +88ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" alt="$BWS Token Allocation" class="image-token-allocation" src="/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

---

### Failure #17

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-0/d09e09a3b1db84c7881a5e30ba4ed37f.webm +88ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" alt="$BWS Token Allocation" class="image-token-allocation" src="/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
```

## 📄 Raw Test Output

<details>
<summary>Click to expand full test output (cleaned)</summary>

```
Running 110 tests using 2 workers
Running 110 tests using 2 workers
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/3b2ffe34d61ed2bf88ae3dffe531b1e9.webm +2s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/3b2ffe34d61ed2bf88ae3dffe531b1e9.webm +2s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/8e33f3922f574527b4fed43c698048c6.webm +2s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/8e33f3922f574527b4fed43c698048c6.webm +2s
  ✓    2 [chromium] › accessibility/button-hover-contrast.spec.js:137:3 › Button Hover State Accessibility › Learn More button hover contrast on homepage (5.2s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/81d700108efa8736035bacdc3eda46dd.webm +614ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/81d700108efa8736035bacdc3eda46dd.webm +614ms
  ✓    1 [chromium] › accessibility/button-hover-contrast.spec.js:9:3 › Button Hover State Accessibility › All button hover states maintain proper contrast (9.4s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/7e0100c33e62052bc521a0ecffd1bc80.webm +480ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/7e0100c33e62052bc521a0ecffd1bc80.webm +480ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/bc0c2f61b9f93bf4ddb4f0a74465c98c.webm +3s
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/bc0c2f61b9f93bf4ddb4f0a74465c98c.webm +3s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/8b5d35622e05032db3c7641857f7dac1.webm +8s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/8b5d35622e05032db3c7641857f7dac1.webm +8s
  ✓    4 [chromium] › accessibility/wcag-compliance.spec.js:36:3 › WCAG Accessibility Compliance › About page passes accessibility checks (5.6s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/3774155dedd671f42f6fa20311f3cbd7.webm +40ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/3774155dedd671f42f6fa20311f3cbd7.webm +40ms
  ✘    3 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (11.1s)
  ✓    5 [chromium] › accessibility/wcag-compliance.spec.js:61:3 › WCAG Accessibility Compliance › All images have alt text (2.9s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/3d603225453301c14e50b7375873e97d.webm +41ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/3d603225453301c14e50b7375873e97d.webm +41ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-2/811ecd10e1b374bc575afa512def25c8.webm +143ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-2/811ecd10e1b374bc575afa512def25c8.webm +143ms
  ✓    6 [chromium] › accessibility/wcag-compliance.spec.js:87:3 › WCAG Accessibility Compliance › All form inputs have labels (2.2s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/18308ba8b8b5f715c98f853ff93ffc09.webm +65ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/18308ba8b8b5f715c98f853ff93ffc09.webm +65ms
  ✓    8 [chromium] › accessibility/wcag-compliance.spec.js:130:3 › WCAG Accessibility Compliance › Keyboard navigation works correctly (3.9s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/188bf6bb70de0e0380b8504083c64ca9.webm +88ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/188bf6bb70de0e0380b8504083c64ca9.webm +88ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-2/772f1a686aa36409eec93b344ccef0b2.webm +10s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-2/772f1a686aa36409eec93b344ccef0b2.webm +10s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/17178674c8c4146020b6556f273b480d.webm +10s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/17178674c8c4146020b6556f273b480d.webm +10s
  ✓    9 [chromium] › accessibility/wcag-compliance.spec.js:157:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (14.1s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/188e0c0b0d5815bcf9a39dec86f41754.webm +36ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/188e0c0b0d5815bcf9a39dec86f41754.webm +36ms
  ✘    7 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (retry #1) (18.6s)
  ✓   10 [chromium] › accessibility/wcag-compliance.spec.js:198:3 › WCAG Accessibility Compliance › Page has proper heading hierarchy (2.7s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/2e9046296399b72c493d45743e262afc.webm +49ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/2e9046296399b72c493d45743e262afc.webm +49ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-3/9ed218ee48e3bc3041e0cab711b565da.webm +96ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-3/9ed218ee48e3bc3041e0cab711b565da.webm +96ms
  ✓   11 [chromium] › accessibility/wcag-compliance.spec.js:263:3 › WCAG Accessibility Compliance › ARIA landmarks are properly used (2.5s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/09ae3b75ece53b84a326e578cc2aeebe.webm +82ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/09ae3b75ece53b84a326e578cc2aeebe.webm +82ms
  ✓   13 [chromium] › accessibility/wcag-compliance.spec.js:303:3 › WCAG Accessibility Compliance › Focus trap in modals works correctly (3.5s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/6f1351d0c0872a76977face3dc0dadaf.webm +59ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/6f1351d0c0872a76977face3dc0dadaf.webm +59ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-3/753adc6b92e1b5a3fb2e62cbecc50546.webm +8s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-3/753adc6b92e1b5a3fb2e62cbecc50546.webm +8s
  ✓   15 [chromium] › assets.spec.js:47:3 › Asset Verification Tests › AssureDefi image size check (4.8s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/72d4ebac7eca6ef5d6e2ff12f887e589.webm +95ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/72d4ebac7eca6ef5d6e2ff12f887e589.webm +95ms
  ✘   12 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (retry #2) (11.6s)
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
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/video.webm
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/video-1.webm
    Error Context: test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/error-context.md
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/a86ef3cb2a62e45972faa698a7542aa5.webm +48ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/a86ef3cb2a62e45972faa698a7542aa5.webm +48ms
  ✓   16 [chromium] › assets.spec.js:66:3 › Asset Verification Tests › Tokenomics image test (4.8s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/b4b3f645ab2f76c1e9448d2cecd9059c.webm +52ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/b4b3f645ab2f76c1e9448d2cecd9059c.webm +52ms
  ✓   17 [chromium] › assets.spec.js:86:3 › Asset Verification Tests › Blockchain Founders Group image test (4.2s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/6f3fb0484d6f75df5c06f463686e6ccd.webm +70ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/6f3fb0484d6f75df5c06f463686e6ccd.webm +70ms
  ✓   18 [chromium] › assets.spec.js:105:5 › Asset Verification Tests › Layout test on Desktop (4.1s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/887b27829de18b063979c147c1b935c0.webm +65ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/887b27829de18b063979c147c1b935c0.webm +65ms
  ✓   19 [chromium] › assets.spec.js:105:5 › Asset Verification Tests › Layout test on Tablet (3.4s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/4499a118416d2caf11148301322b885c.webm +86ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/4499a118416d2caf11148301322b885c.webm +86ms
  ✓   20 [chromium] › assets.spec.js:105:5 › Asset Verification Tests › Layout test on Mobile (3.2s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/f8c627b801612b40845050766bb63507.webm +84ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/f8c627b801612b40845050766bb63507.webm +84ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/4d54355f2f2c7f7bbd70d13f1f8c82cb.webm +4s
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/4d54355f2f2c7f7bbd70d13f1f8c82cb.webm +4s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/515f7227f29f19760a8f0430df8a8256.webm +159ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/515f7227f29f19760a8f0430df8a8256.webm +159ms
  ✓   22 [chromium] › e2e/navigation.spec.js:38:3 › Navigation Tests › Industry dropdown navigation works (7.4s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/5f3d454d700139126d2173884099fa93.webm +44ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/5f3d454d700139126d2173884099fa93.webm +44ms
  ✓   23 [chromium] › e2e/navigation.spec.js:80:3 › Navigation Tests › Footer navigation links work (7.4s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/25ec03806f23ec172031f74784857456.webm +54ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/25ec03806f23ec172031f74784857456.webm +54ms
✓ 404 handling is working correctly for static site
[1A✓ 404 handling is working correctly for static site
  ✓   25 [chromium] › e2e/navigation.spec.js:243:3 › Navigation Tests › 404 page handles non-existent routes (395ms)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/b76bc688a194dd6964ce7386fd110246.webm +69ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/b76bc688a194dd6964ce7386fd110246.webm +69ms
  ✓   24 [chromium] › e2e/navigation.spec.js:207:3 › Navigation Tests › Logo click returns to homepage (4.9s)
  ✓   28 [chromium] › image-validation.spec.js:52:3 › Image Files and CSS Validation › Check image files exist in build directory (16ms)
  ✓   29 [chromium] › image-validation.spec.js:77:3 › Image Files and CSS Validation › Check CSS classes are defined with proper rules (21ms)
  ✓   30 [chromium] › image-validation.spec.js:150:3 › Image Files and CSS Validation › Check HTML for problematic attributes (10ms)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/9e98f1af17f385c652454d419c1d6f84.webm +259ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/9e98f1af17f385c652454d419c1d6f84.webm +259ms
  ✓   26 [chromium] › e2e/navigation.spec.js:288:3 › Navigation Tests › All marketplace products are accessible (7.1s)
[1A[32/110] [chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/12aeeca389004d99ac33f6825f09a80e.webm +108ms
[1A[chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/12aeeca389004d99ac33f6825f09a80e.webm +108ms
✅ No 404 errors detected for images
[1A[chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images
✅ No 404 errors detected for images
  ✘   31 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (11.8s)
[1A[chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images
  ✓   32 [chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images (9.1s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/a1c0ba2dd0e877182b654b638e57b371.webm +45ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/a1c0ba2dd0e877182b654b638e57b371.webm +45ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/ec729e9f891a37f4a6ba9d44670b0593.webm +89ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/ec729e9f891a37f4a6ba9d44670b0593.webm +89ms
  ✓   33 [chromium] › image-validation.spec.js:499:3 › Image Visibility on Live Page › Take screenshots for visual verification (9.6s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/f4902e766b9f2c8560a38c56e49e457e.webm +133ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/f4902e766b9f2c8560a38c56e49e457e.webm +133ms
  ✓   35 [chromium] › image-visibility-index.spec.js:17:3 › Image Visibility on Index Page › PROOF Logo visibility and CSS (7.0s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/1b89f705aa6801b3d3f13586ea8ff005.webm +88ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/1b89f705aa6801b3d3f13586ea8ff005.webm +88ms
  ✘   34 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #1) (17.5s)
  ✓   36 [chromium] › image-visibility-index.spec.js:73:3 › Image Visibility on Index Page › AssureDefi Logo visibility and CSS (6.9s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/269dba142b364f3ef702cbc6f43265e8.webm +63ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/269dba142b364f3ef702cbc6f43265e8.webm +63ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-6/ca49dd2708f4cdcff240d9634382b336.webm +92ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-6/ca49dd2708f4cdcff240d9634382b336.webm +92ms
  ✓   37 [chromium] › image-visibility-index.spec.js:157:3 › Image Visibility on Index Page › BFG Logo visibility and CSS (6.4s)
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/d09e09a3b1db84c7881a5e30ba4ed37f.webm +88ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/d09e09a3b1db84c7881a5e30ba4ed37f.webm +88ms
  ✘   38 [chromium] › image-validation.spec.js:273:3 › Image Visibility on Live Page › All critical images are visible and properly sized (retry #2) (13.2s)
    Error: expect(locator).toBeVisible() failed
        9 × locator resolved to <img loading="lazy" alt="$BWS Token Allocation" class="image-token-allocation" src="/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png"/>
          - unexpected value "hidden"
      298 |         } catch (error) {
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:297:36
```
</details>
