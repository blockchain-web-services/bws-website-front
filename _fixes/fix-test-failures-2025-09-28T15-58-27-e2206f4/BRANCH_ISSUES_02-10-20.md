# Test Failure Report - Fix Branch

**Generated:** 2025-10-02 20:42:52 UTC
**Branch:** fix/test-failures-2025-09-28T15-58-27-e2206f4
**Commit:** d326f00af87a4efb6281fd42abf19ea4e6b3051d
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18204726973)

## 🔁 Recurring Issues Analysis

Comparing with previous reports:
- BRANCH_ISSUES_30-09-06.md
- BRANCH_ISSUES_30-09-08.md
- BRANCH_ISSUES_30-09-14.md

### Known Recurring Issues:
No known recurring issues detected in recent reports.

## Test Results
### ⚠️ Test Results File Not Found
test-results.json was not generated or is not accessible

## 📋 Detailed Test Failures

### Failure #1

**Test:** `[1A   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum`

**Error Details:**
```
Error: expect(received).toEqual(expected) // deep equality
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
```

---

### Failure #2

**Test:** `[1A   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum`

**Error Details:**
```
Error: expect(received).toEqual(expected) // deep equality
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
```

---

### Failure #3

**Test:** `[1A   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum`

**Error Details:**
```
Error: expect(received).toEqual(expected) // deep equality
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
```

---

### Failure #4

**Test:** `[1A   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum`

**Error Details:**
```
Error: expect(received).toHaveLength(expected)
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:195:32
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/video.webm
```

---

### Failure #5

**Test:** `[1A   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum`

**Error Details:**
```
Error: expect(received).toHaveLength(expected)
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:195:32
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/video.webm
```

---

### Failure #6

**Test:** `[1A   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum`

**Error Details:**
```
Error: expect(received).toHaveLength(expected)
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:195:32
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/video.webm
```

---

### Failure #7

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-9/eb8187a01cf781bde4516a736557498c.webm +32ms`

**Error Details:**
```
Error: expect(received).toBeLessThanOrEqual(expected)
    > 403 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:403:31
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
```

---

### Failure #8

**Test:** `[1A5. Image aspect ratio causing unexpected dimensions`

**Error Details:**
```
> 403 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:403:31
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/video.webm
```

---

### Failure #9

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-9/eb8187a01cf781bde4516a736557498c.webm +32ms`

**Error Details:**
```
Error: expect(received).toBeLessThanOrEqual(expected)
    > 403 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:403:31
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
```

---

### Failure #10

**Test:** `[1A5. Image aspect ratio causing unexpected dimensions`

**Error Details:**
```
> 403 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:403:31
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/video.webm
```

---

### Failure #11

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-9/eb8187a01cf781bde4516a736557498c.webm +32ms`

**Error Details:**
```
Error: expect(received).toBeLessThanOrEqual(expected)
    > 403 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:403:31
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
```

---

### Failure #12

**Test:** `[1A5. Image aspect ratio causing unexpected dimensions`

**Error Details:**
```
> 403 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:403:31
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/video.webm
```

---

### Failure #13

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-12/c1392f7ba5cbbf0511a8d1261bc3f2ac.webm +32ms`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
      68 |       console.error('If tests pass locally but fail in CI, increase waitForTimeout in beforeEach.');
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:70:29
    test-results/image-visibility-index-Ima-8739a-OOF-Logo-visibility-and-CSS-chromium/test-failed-1.png
```

---

### Failure #14

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-12/c1392f7ba5cbbf0511a8d1261bc3f2ac.webm +32ms`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
      68 |       console.error('If tests pass locally but fail in CI, increase waitForTimeout in beforeEach.');
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:70:29
    test-results/image-visibility-index-Ima-8739a-OOF-Logo-visibility-and-CSS-chromium/test-failed-1.png
```

---

### Failure #15

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-12/c1392f7ba5cbbf0511a8d1261bc3f2ac.webm +32ms`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
      68 |       console.error('If tests pass locally but fail in CI, increase waitForTimeout in beforeEach.');
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:70:29
    test-results/image-visibility-index-Ima-8739a-OOF-Logo-visibility-and-CSS-chromium/test-failed-1.png
```

---

### Failure #16

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-12/c1392f7ba5cbbf0511a8d1261bc3f2ac.webm +32ms`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
      68 |       console.error('If tests pass locally but fail in CI, increase waitForTimeout in beforeEach.');
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:70:29
    test-results/image-visibility-index-Ima-8739a-OOF-Logo-visibility-and-CSS-chromium/test-failed-1.png
```

---

### Failure #17

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-12/c1392f7ba5cbbf0511a8d1261bc3f2ac.webm +32ms`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
      68 |       console.error('If tests pass locally but fail in CI, increase waitForTimeout in beforeEach.');
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:70:29
    test-results/image-visibility-index-Ima-8739a-OOF-Logo-visibility-and-CSS-chromium/test-failed-1.png
```

---

### Failure #18

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-12/c1392f7ba5cbbf0511a8d1261bc3f2ac.webm +32ms`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
      68 |       console.error('If tests pass locally but fail in CI, increase waitForTimeout in beforeEach.');
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:70:29
    test-results/image-visibility-index-Ima-8739a-OOF-Logo-visibility-and-CSS-chromium/test-failed-1.png
```

---

### Failure #19

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-19/600a0640bb9a557f29a2054817f74060.webm +57ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        14 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" class="top-menu-company-news-image" alt="Blockchain Founders Group logo" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
           - unexpected value "hidden"
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:161:26
```

---

### Failure #20

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-19/600a0640bb9a557f29a2054817f74060.webm +57ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        14 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" class="top-menu-company-news-image" alt="Blockchain Founders Group logo" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
           - unexpected value "hidden"
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:161:26
```

## 📄 Raw Test Output

<details>
<summary>Click to expand full test output (cleaned)</summary>

```
Running 110 tests using 2 workers
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/4c05e7814a8f5b42852863169926f4b0.webm +1s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/5c2d873d3a7abf062b9981d1b8f2d053.webm +1s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/19594676aa1868163b5e1ae10832691d.webm +642ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/3eaf4f345aa252bf0f7406ddb0b5e40b.webm +793ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/bf6696989a6c56ce75c05a02435d1839.webm +7s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/9641db5badcb3be8cf9dbddbc3ed23d7.webm +4s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/d5965e2b07ed9b293e2f6bfcff800fe2.webm +35ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-2/9726a37d4c7b058d1ff8b381ce3c3840.webm +144ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/d828f1680d08c88ef7be06a6ec1dc007.webm +67ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/6ab41d7117b944eb1d20db59d98167a8.webm +75ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/43f91c44438c42786c8872bdd7760ad1.webm +114ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-2/a47d200bece79de040c55bfbd6274768.webm +11s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/e077d63453a82e6e61fe1d42dcaf76b7.webm +11s
[1A   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
[1A   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
[1A   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
[1A   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-3/58c64bb0b1378dfcd4e676b53c1ddeb9.webm +58ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/4b95ddc152a56e6246af47caca9e21fb.webm +118ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-3/e39f20440db00a4f4b65eed4bed38272.webm +11s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/23705bb47557c237736cfdcd1b0f8016.webm +10s
[1A   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
[1A   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
[1A   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
[1A   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
    Error: expect(received).toEqual(expected) // deep equality
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:33:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/video-1.webm
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/video.webm
    Error Context: test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/error-context.md
    Error: expect(received).toEqual(expected) // deep equality
    +               "expectedContrastRatio": "3:1",
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
    +               "expectedContrastRatio": "3:1",
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:33:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/test-failed-1.png
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/video.webm
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/video-1.webm
    Error Context: test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/error-context.md
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/e72cae415d084f7f1571d2ecbb975542.webm +69ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/5fcc0e5631c63b95bafe087f20c9da41.webm +76ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/f463ed312b9e4c987fb88b2314ee21b2.webm +71ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-6/632f9f138e88bbf3b5614b2f00134217.webm +102ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/9d101325dcf022318e7f4d334a34f236.webm +166ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/0d7ba7b2c9692514a61e699cc2a73ca9.webm +98ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-6/b1c48b3c102ccec58ec44d5b312256d3.webm +11s
[1A   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
[1A   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
[1A   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
[1A   - Large text (18pt/24px or 14pt/18.66px bold): 3:1 minimum
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/57982812ba13b38b200995432e1072ac.webm +108ms
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
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/5491daf073943e834f21ffb34da72d55.webm +68ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/aaefb2d3ba0655ba82866449b9d24a83.webm +69ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/4ec513f93fb1db14125a3beefe26b2c7.webm +112ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/30a0355590ebf16f73c64e9be7ea309d.webm +179ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/d7ac9275a1cd42d34cd2a9f6885e0461.webm +166ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/b8bfb6d04294dc3c9ebe9d6538084e05.webm +5s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/6bf7f3556920e7c87e4574cba14af0b5.webm +146ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/68d8e5be6bb035781f005a178f89aace.webm +115ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/3ad4b609322f6b1fccc7b9e9d6bf554e.webm +118ms
[1A✓ 404 handling is working correctly for static site
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/25ef69049411b91d509cc4794e3d48c8.webm +92ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/65ec461392b2cdf430181afcc8f9b9d4.webm +338ms
[1A5. Image aspect ratio causing unexpected dimensions
[1A[34/110] [chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images
[1A[chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/6b4c91cb4f86c159cebdf7327064a682.webm +167ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-8/52f58a7e36629606667da82abeb2d4e1.webm +118ms
[1A[chromium] › image-validation.spec.js:454:3 › Image Visibility on Live Page › No 404 errors for images
✅ No 404 errors detected for images
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/355b32cc503b9d230dfaf03a2121b05a.webm +90ms
[1A5. Image aspect ratio causing unexpected dimensions
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-9/eb8187a01cf781bde4516a736557498c.webm +32ms
[1A5. Image aspect ratio causing unexpected dimensions
    Error: expect(received).toBeLessThanOrEqual(expected)
    > 403 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:403:31
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/video.webm
    Error Context: test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/error-context.md
    Error: expect(received).toBeLessThanOrEqual(expected)
    > 403 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:403:31
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/video.webm
    Error Context: test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/error-context.md
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/trace.zip
        npx playwright show-trace test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/trace.zip
    Error: expect(received).toBeLessThanOrEqual(expected)
    > 403 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:403:31
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry2/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry2/video.webm
    Error Context: test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry2/error-context.md
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-10/a3137fbee332018373399d44ce6f7bb4.webm +29ms
[1AIf tests pass locally but fail in CI, increase waitForTimeout in beforeEach.
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-11/11aab996e6152d138cb69a21b4d05e4c.webm +32ms
[1AIf tests pass locally but fail in CI, increase waitForTimeout in beforeEach.
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-12/c1392f7ba5cbbf0511a8d1261bc3f2ac.webm +32ms
[1AIf tests pass locally but fail in CI, increase waitForTimeout in beforeEach.
    Error: expect(received).toContain(expected) // indexOf
      68 |       console.error('If tests pass locally but fail in CI, increase waitForTimeout in beforeEach.');
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:70:29
    test-results/image-visibility-index-Ima-8739a-OOF-Logo-visibility-and-CSS-chromium/test-failed-1.png
    test-results/image-visibility-index-Ima-8739a-OOF-Logo-visibility-and-CSS-chromium/video.webm
    Error Context: test-results/image-visibility-index-Ima-8739a-OOF-Logo-visibility-and-CSS-chromium/error-context.md
    Error: expect(received).toContain(expected) // indexOf
      68 |       console.error('If tests pass locally but fail in CI, increase waitForTimeout in beforeEach.');
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:70:29
    test-results/image-visibility-index-Ima-8739a-OOF-Logo-visibility-and-CSS-chromium-retry1/test-failed-1.png
    test-results/image-visibility-index-Ima-8739a-OOF-Logo-visibility-and-CSS-chromium-retry1/video.webm
```
</details>
