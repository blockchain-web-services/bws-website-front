# Test Failure Report - Fix Branch

**Generated:** 2025-10-02 14:45:59 UTC
**Branch:** fix/test-failures-2025-09-28T15-58-27-e2206f4
**Commit:** 982c304ed0adbadb686ef6f9c8f2ed70044bf7f5
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18196059193)

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

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-0/bf3bbb61112e2ac735fdaa3266917fba.webm +72ms`

**Error Details:**
```
Error: expect(received).toEqual(expected) // deep equality
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:32:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/video-1.webm
```

---

### Failure #2

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-0/bf3bbb61112e2ac735fdaa3266917fba.webm +72ms`

**Error Details:**
```
Error: expect(received).toEqual(expected) // deep equality
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:32:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/video-1.webm
```

---

### Failure #3

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-0/bf3bbb61112e2ac735fdaa3266917fba.webm +72ms`

**Error Details:**
```
Error: expect(received).toEqual(expected) // deep equality
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:32:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/video-1.webm
```

---

### Failure #4

**Test:** `e2e-navigation-Navigation--773da-ck-forward-navigation-works`

**Error Details:**
```
Error: expect(received).toBeLessThanOrEqual(expected)
      225 |           const expectedWidth = parseInt(image.maxWidth.replace('px', ''));
    > 227 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:227:31
```

---

### Failure #5

**Test:** `    Error: expect(received).toBeLessThanOrEqual(expected)`

**Error Details:**
```
> 227 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:227:31
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/video.webm
```

---

### Failure #6

**Test:** `e2e-navigation-Navigation--773da-ck-forward-navigation-works`

**Error Details:**
```
Error: expect(received).toBeLessThanOrEqual(expected)
      225 |           const expectedWidth = parseInt(image.maxWidth.replace('px', ''));
    > 227 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:227:31
```

---

### Failure #7

**Test:** `    Error: expect(received).toBeLessThanOrEqual(expected)`

**Error Details:**
```
> 227 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:227:31
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/video.webm
```

---

### Failure #8

**Test:** `e2e-navigation-Navigation--773da-ck-forward-navigation-works`

**Error Details:**
```
Error: expect(received).toBeLessThanOrEqual(expected)
      225 |           const expectedWidth = parseInt(image.maxWidth.replace('px', ''));
    > 227 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:227:31
```

---

### Failure #9

**Test:** `    Error: expect(received).toBeLessThanOrEqual(expected)`

**Error Details:**
```
> 227 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:227:31
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/video.webm
```

---

### Failure #10

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-14/f882fdad3c793970b05d6e07028f3c83.webm +30ms`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:45:29
    test-results/image-visibility-index-Ima-8739a-OOF-Logo-visibility-and-CSS-chromium/test-failed-1.png
    test-results/image-visibility-index-Ima-8739a-OOF-Logo-visibility-and-CSS-chromium/video.webm
```

---

### Failure #11

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-14/f882fdad3c793970b05d6e07028f3c83.webm +30ms`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:45:29
    test-results/image-visibility-index-Ima-8739a-OOF-Logo-visibility-and-CSS-chromium/test-failed-1.png
    test-results/image-visibility-index-Ima-8739a-OOF-Logo-visibility-and-CSS-chromium/video.webm
```

---

### Failure #12

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-14/f882fdad3c793970b05d6e07028f3c83.webm +30ms`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:45:29
    test-results/image-visibility-index-Ima-8739a-OOF-Logo-visibility-and-CSS-chromium/test-failed-1.png
    test-results/image-visibility-index-Ima-8739a-OOF-Logo-visibility-and-CSS-chromium/video.webm
```

---

### Failure #13

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-14/f882fdad3c793970b05d6e07028f3c83.webm +30ms`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:45:29
    test-results/image-visibility-index-Ima-8739a-OOF-Logo-visibility-and-CSS-chromium/test-failed-1.png
    test-results/image-visibility-index-Ima-8739a-OOF-Logo-visibility-and-CSS-chromium/video.webm
```

---

### Failure #14

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-14/f882fdad3c793970b05d6e07028f3c83.webm +30ms`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:45:29
    test-results/image-visibility-index-Ima-8739a-OOF-Logo-visibility-and-CSS-chromium/test-failed-1.png
    test-results/image-visibility-index-Ima-8739a-OOF-Logo-visibility-and-CSS-chromium/video.webm
```

## 📄 Raw Test Output

<details>
<summary>Click to expand full test output (cleaned)</summary>

```
Running 110 tests using 2 workers
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/db38441c01cc777a4ae240988a399e14.webm +751ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/384292b82fe1d36724e6f85701e60b3a.webm +819ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/4e4c134ad0f639d58544123cc4a53a1a.webm +587ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/6240de7a969cbd00caffa1057dd26ce0.webm +479ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/080b58b34dca27bb2cd8fe191e04ddd4.webm +8s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/435b15e9b7c805879b23b798d4339036.webm +4s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/d89cd68450cc0d38920e7f1794ced8a6.webm +69ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/8b54c82e2acb13c1ac114e03f9703ace.webm +72ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-2/29c5165ebde3cd280fce56a35fbf2994.webm +151ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/4971e1fe6163f762c9036d2569cf8a5b.webm +48ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/bb1d08e67aaf019b357786e6c0035db0.webm +61ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-2/73746e5fbadce897c0d12acc09de1519.webm +11s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/cadfdaffc8b544be81ec11d406211a73.webm +10s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/c020dfe74f24b7ac690e6375a2010da1.webm +31ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/e956bad2ede2a621f2f45b672c590646.webm +36ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/ae06868fb82fca9607737d00cc6fa5d1.webm +34ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-3/0420e44138294f3840d62ea2533398e8.webm +48ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/e1244d518e9f98db5c2abc65ee35f550.webm +69ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/bf3bbb61112e2ac735fdaa3266917fba.webm +72ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-3/5311d15e5f6f8634497cb6e5f1a2bf41.webm +8s
    Error: expect(received).toEqual(expected) // deep equality
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:32:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/video-1.webm
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/video.webm
    Error Context: test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/error-context.md
    Error: expect(received).toEqual(expected) // deep equality
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:32:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/test-failed-1.png
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/video.webm
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/video-1.webm
    Error Context: test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/error-context.md
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/trace.zip
        npx playwright show-trace test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/trace.zip
    Error: expect(received).toEqual(expected) // deep equality
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:32:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/test-failed-1.png
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/video.webm
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/video-1.webm
    Error Context: test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/error-context.md
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/1bc38fcb6fb5eee5dad98e0153034d75.webm +20ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/b321f31e7d0e546e1fa37bcb95cecbbe.webm +69ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/d824ed1ee2ef5034aefe90201d018a45.webm +68ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/05059ed558638dc2dbce33071216bef9.webm +51ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/f48328a2a2868b5bb2050ee1d6e8a256.webm +86ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/c8cd19cdb325e719a24ccf2df706f842.webm +71ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/ea3545c18d2480b606917eaf35f0b050.webm +50ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/993a3654fd34b00a4de8a22a3ffd11a8.webm +4s
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/56d266a7d76c9b5043d2ef24031ee89f.webm +31ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/c8e8d8bfd0bce8268c2690d37e26326d.webm +52ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/ef64a7f6e664d0707574f8a0cd732dd0.webm +127ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/07c09bbf9178db51831f05d408b8eae2.webm +100ms
[1A✓ 404 handling is working correctly for static site
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/60951db24b67feee9b7646f57e4b8b54.webm +93ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/5bbd2c9919c9c9ae5dc7a0ae1cef95f3.webm +36ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-6/7a91204fbd20979c59d4644d768fe75f.webm +37ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/c13d563abf911ee9769e27acfef2d476.webm +38ms
    TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
       at page-objects/BasePage.js:120
        at HomePage.navigateViaMenu (/home/runner/work/bws-website-front/bws-website-front/tests/page-objects/BasePage.js:120:20)
        at /home/runner/work/bws-website-front/bws-website-front/tests/e2e/navigation.spec.js:16:20
    test-results/e2e-navigation-Navigation--afe6e-gation-menu-works-correctly-chromium/test-failed-1.png
    test-results/e2e-navigation-Navigation--afe6e-gation-menu-works-correctly-chromium/video.webm
    Error Context: test-results/e2e-navigation-Navigation--afe6e-gation-menu-works-correctly-chromium/error-context.md
    TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
       at page-objects/BasePage.js:120
        at HomePage.navigateViaMenu (/home/runner/work/bws-website-front/bws-website-front/tests/page-objects/BasePage.js:120:20)
        at /home/runner/work/bws-website-front/bws-website-front/tests/e2e/navigation.spec.js:16:20
    test-results/e2e-navigation-Navigation--afe6e-gation-menu-works-correctly-chromium-retry1/test-failed-1.png
    test-results/e2e-navigation-Navigation--afe6e-gation-menu-works-correctly-chromium-retry1/video.webm
    Error Context: test-results/e2e-navigation-Navigation--afe6e-gation-menu-works-correctly-chromium-retry1/error-context.md
    test-results/e2e-navigation-Navigation--afe6e-gation-menu-works-correctly-chromium-retry1/trace.zip
        npx playwright show-trace test-results/e2e-navigation-Navigation--afe6e-gation-menu-works-correctly-chromium-retry1/trace.zip
    TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
       at page-objects/BasePage.js:120
        at HomePage.navigateViaMenu (/home/runner/work/bws-website-front/bws-website-front/tests/page-objects/BasePage.js:120:20)
        at /home/runner/work/bws-website-front/bws-website-front/tests/e2e/navigation.spec.js:16:20
    test-results/e2e-navigation-Navigation--afe6e-gation-menu-works-correctly-chromium-retry2/test-failed-1.png
    test-results/e2e-navigation-Navigation--afe6e-gation-menu-works-correctly-chromium-retry2/video.webm
    Error Context: test-results/e2e-navigation-Navigation--afe6e-gation-menu-works-correctly-chromium-retry2/error-context.md
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-8/358c6281f42df80c529a4a0e0a98e8dd.webm +49ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-9/b4d8295ba775a3df0df5646c89a325f4.webm +16ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-10/558dc6bc6a5b282660d6783224238531.webm +89ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-11/542c9eec73d098c0323db26b8af2faf3.webm +53ms
    TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
       at page-objects/BasePage.js:120
        at HomePage.navigateViaMenu (/home/runner/work/bws-website-front/bws-website-front/tests/page-objects/BasePage.js:120:20)
        at /home/runner/work/bws-website-front/bws-website-front/tests/e2e/navigation.spec.js:216:20
    test-results/e2e-navigation-Navigation--773da-ck-forward-navigation-works-chromium/test-failed-1.png
    test-results/e2e-navigation-Navigation--773da-ck-forward-navigation-works-chromium/video.webm
    Error Context: test-results/e2e-navigation-Navigation--773da-ck-forward-navigation-works-chromium/error-context.md
    TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
       at page-objects/BasePage.js:120
        at HomePage.navigateViaMenu (/home/runner/work/bws-website-front/bws-website-front/tests/page-objects/BasePage.js:120:20)
        at /home/runner/work/bws-website-front/bws-website-front/tests/e2e/navigation.spec.js:216:20
    test-results/e2e-navigation-Navigation--773da-ck-forward-navigation-works-chromium-retry1/test-failed-1.png
    test-results/e2e-navigation-Navigation--773da-ck-forward-navigation-works-chromium-retry1/video.webm
    Error Context: test-results/e2e-navigation-Navigation--773da-ck-forward-navigation-works-chromium-retry1/error-context.md
    test-results/e2e-navigation-Navigation--773da-ck-forward-navigation-works-chromium-retry1/trace.zip
        npx playwright show-trace test-results/e2e-navigation-Navigation--773da-ck-forward-navigation-works-chromium-retry1/trace.zip
    TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
       at page-objects/BasePage.js:120
        at HomePage.navigateViaMenu (/home/runner/work/bws-website-front/bws-website-front/tests/page-objects/BasePage.js:120:20)
        at /home/runner/work/bws-website-front/bws-website-front/tests/e2e/navigation.spec.js:216:20
    test-results/e2e-navigation-Navigation--773da-ck-forward-navigation-works-chromium-retry2/test-failed-1.png
    test-results/e2e-navigation-Navigation--773da-ck-forward-navigation-works-chromium-retry2/video.webm
    Error Context: test-results/e2e-navigation-Navigation--773da-ck-forward-navigation-works-chromium-retry2/error-context.md
    Error: expect(received).toBeLessThanOrEqual(expected)
      225 |           const expectedWidth = parseInt(image.maxWidth.replace('px', ''));
    > 227 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:227:31
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/video.webm
    Error Context: test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/error-context.md
    Error: expect(received).toBeLessThanOrEqual(expected)
      225 |           const expectedWidth = parseInt(image.maxWidth.replace('px', ''));
    > 227 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:227:31
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/video.webm
    Error Context: test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/error-context.md
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/trace.zip
        npx playwright show-trace test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/trace.zip
    Error: expect(received).toBeLessThanOrEqual(expected)
      225 |           const expectedWidth = parseInt(image.maxWidth.replace('px', ''));
    > 227 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:227:31
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry2/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry2/video.webm
    Error Context: test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry2/error-context.md
[1A[39/110] [chromium] › image-validation.spec.js:248:3 › Image Visibility on Live Page › No 404 errors for images
[1A[chromium] › image-validation.spec.js:248:3 › Image Visibility on Live Page › No 404 errors for images
[1A[chromium] › image-validation.spec.js:248:3 › Image Visibility on Live Page › No 404 errors for images
[1A[chromium] › image-validation.spec.js:248:3 › Image Visibility on Live Page › No 404 errors for images
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-12/9581e7d9ae40b68b41af7da86a774edc.webm +90ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-13/f5026b55a3e8865023fd8c1a44c2040f.webm +51ms
[1A[chromium] › image-validation.spec.js:248:3 › Image Visibility on Live Page › No 404 errors for images
[1A[chromium] › image-validation.spec.js:248:3 › Image Visibility on Live Page › No 404 errors for images
✅ No 404 errors detected for images
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-12/30f38accf0287b409d2f0e5df3500b17.webm +64ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-14/f882fdad3c793970b05d6e07028f3c83.webm +30ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-15/6a511879ccfef8a3aeb149dedc5bb9aa.webm +38ms
    Error: expect(received).toContain(expected) // indexOf
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:45:29
    test-results/image-visibility-index-Ima-8739a-OOF-Logo-visibility-and-CSS-chromium/test-failed-1.png
    test-results/image-visibility-index-Ima-8739a-OOF-Logo-visibility-and-CSS-chromium/video.webm
    Error Context: test-results/image-visibility-index-Ima-8739a-OOF-Logo-visibility-and-CSS-chromium/error-context.md
    Error: expect(received).toContain(expected) // indexOf
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:45:29
```
</details>
