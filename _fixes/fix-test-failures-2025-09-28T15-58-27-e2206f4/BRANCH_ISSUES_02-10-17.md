# Test Failure Report - Fix Branch

**Generated:** 2025-10-02 17:40:41 UTC
**Branch:** fix/test-failures-2025-09-28T15-58-27-e2206f4
**Commit:** 619e126eee0facc4b1a3376e303229db840ba00b
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18200351119)

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

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-3/4922174b1ff254cb36e2cc1f7af6dcf9.webm +10s`

**Error Details:**
```
Error: expect(received).toEqual(expected) // deep equality
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
```

---

### Failure #2

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-3/4922174b1ff254cb36e2cc1f7af6dcf9.webm +10s`

**Error Details:**
```
Error: expect(received).toEqual(expected) // deep equality
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
```

---

### Failure #3

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-3/4922174b1ff254cb36e2cc1f7af6dcf9.webm +10s`

**Error Details:**
```
Error: expect(received).toEqual(expected) // deep equality
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
```

---

### Failure #4

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-6/d1194ad12a62732a427ed824e58c598f.webm +11s`

**Error Details:**
```
Error: expect(received).toHaveLength(expected)
      Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1", "html": "<h4 class=\"roadmap-description-title\">Blockchain Badges</h4>", "impact": "serious", "none": [], "target": [".container-head-roadmap-25-1st > .container-roadmap-content.w-layout-blockcontainer.w-container > .w-richtext:nth-child(3) > h4"]}], "tags": ["cat.color", "wcag2aa", "wcag143", "TTv5", "TT13.c", "EN-301-549", "EN-9.1.4.3", "ACT"]}]
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:127:32
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/test-failed-1.png
```

---

### Failure #5

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-6/d1194ad12a62732a427ed824e58c598f.webm +11s`

**Error Details:**
```
Error: expect(received).toHaveLength(expected)
      Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1", "html": "<h4 class=\"roadmap-description-title\">Blockchain Badges</h4>", "impact": "serious", "none": [], "target": [".container-head-roadmap-25-1st > .container-roadmap-content.w-layout-blockcontainer.w-container > .w-richtext:nth-child(3) > h4"]}], "tags": ["cat.color", "wcag2aa", "wcag143", "TTv5", "TT13.c", "EN-301-549", "EN-9.1.4.3", "ACT"]}]
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:127:32
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/test-failed-1.png
```

---

### Failure #6

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-6/d1194ad12a62732a427ed824e58c598f.webm +11s`

**Error Details:**
```
Error: expect(received).toHaveLength(expected)
      Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1", "html": "<h4 class=\"roadmap-description-title\">Blockchain Badges</h4>", "impact": "serious", "none": [], "target": [".container-head-roadmap-25-1st > .container-roadmap-content.w-layout-blockcontainer.w-container > .w-richtext:nth-child(3) > h4"]}], "tags": ["cat.color", "wcag2aa", "wcag143", "TTv5", "TT13.c", "EN-301-549", "EN-9.1.4.3", "ACT"]}]
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:127:32
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/test-failed-1.png
```

---

### Failure #7

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-5/3da2de8a52bb51c1b1aae63ef1b456b8.webm +123ms`

**Error Details:**
```
Error: expect(received).toBeLessThanOrEqual(expected)
      242 |           const expectedWidth = parseInt(image.maxWidth.replace('px', ''));
    > 244 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:244:31
```

---

### Failure #8

**Test:** `    Error: expect(received).toBeLessThanOrEqual(expected)`

**Error Details:**
```
> 244 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:244:31
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/video.webm
```

---

### Failure #9

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-5/3da2de8a52bb51c1b1aae63ef1b456b8.webm +123ms`

**Error Details:**
```
Error: expect(received).toBeLessThanOrEqual(expected)
      242 |           const expectedWidth = parseInt(image.maxWidth.replace('px', ''));
    > 244 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:244:31
```

---

### Failure #10

**Test:** `    Error: expect(received).toBeLessThanOrEqual(expected)`

**Error Details:**
```
> 244 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:244:31
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/video.webm
```

---

### Failure #11

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-5/3da2de8a52bb51c1b1aae63ef1b456b8.webm +123ms`

**Error Details:**
```
Error: expect(received).toBeLessThanOrEqual(expected)
      242 |           const expectedWidth = parseInt(image.maxWidth.replace('px', ''));
    > 244 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:244:31
```

---

### Failure #12

**Test:** `    Error: expect(received).toBeLessThanOrEqual(expected)`

**Error Details:**
```
> 244 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:244:31
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/video.webm
```

---

### Failure #13

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-11/0389798af9dc61b6b206918765b1acbf.webm +39ms`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
      48 |     // Soft assertion - warn instead of failing if CSS not applied
      53 |       // Still fail but with better context
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:50:31
```

---

### Failure #14

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-11/0389798af9dc61b6b206918765b1acbf.webm +39ms`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
      48 |     // Soft assertion - warn instead of failing if CSS not applied
      53 |       // Still fail but with better context
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:50:31
```

---

### Failure #15

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-11/0389798af9dc61b6b206918765b1acbf.webm +39ms`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
      48 |     // Soft assertion - warn instead of failing if CSS not applied
      53 |       // Still fail but with better context
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:50:31
```

---

### Failure #16

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-11/0389798af9dc61b6b206918765b1acbf.webm +39ms`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
      48 |     // Soft assertion - warn instead of failing if CSS not applied
      53 |       // Still fail but with better context
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:50:31
```

---

### Failure #17

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-11/0389798af9dc61b6b206918765b1acbf.webm +39ms`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
      48 |     // Soft assertion - warn instead of failing if CSS not applied
      53 |       // Still fail but with better context
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:50:31
```

---

### Failure #18

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-11/0389798af9dc61b6b206918765b1acbf.webm +39ms`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
      48 |     // Soft assertion - warn instead of failing if CSS not applied
      53 |       // Still fail but with better context
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:50:31
```

---

### Failure #19

**Test:** `image-validation-Image-Vis-fe53a-ots-for-visual-verification`

**Error Details:**
```
Test timeout of 60000ms exceeded while running "beforeEach" hook.
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:178:8
    TimeoutError: page.goto: Timeout 60000ms exceeded.
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:179:16
```

## 📄 Raw Test Output

<details>
<summary>Click to expand full test output (cleaned)</summary>

```
Running 110 tests using 2 workers
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/7731563075da44000047d4f6e8d1245a.webm +1s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/8b0ec0fb614aa4bea49f5f9ea33a702f.webm +1s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/f63ae3362e0fe358ab391b969fd135d1.webm +494ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/9618d70aae4edd2f56f2fe51bd40eb03.webm +417ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/9d085d5385f2eb8da235137820bd7b1b.webm +4s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/e3b497d202d7e2c26c4129b12e8934bf.webm +8s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/d07289f5e8ee21ab8e8bc5cee4309d8c.webm +38ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/3ccd0a5f245fd20181dfbdb5ba055a84.webm +58ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-2/c90bd7328b48bc2826673a60553c9490.webm +79ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/bd5d86f237dc5f9c9c31e9720070c638.webm +92ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/efbf4260e7c5b6b3eafdb6eb5747b916.webm +78ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-2/6e6be96b82461258a5157885dced8a8e.webm +11s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/71441784ae5f4b634effa7d7ab929ed3.webm +11s
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-3/2eff02204cfb17bf5b11b8eda5095d0a.webm +44ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/9aaff2e6c93573ffdfb5424ed54265c5.webm +74ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-3/4922174b1ff254cb36e2cc1f7af6dcf9.webm +10s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/0776954f4a7ac082b3086fb18d4dda8f.webm +10s
    Error: expect(received).toEqual(expected) // deep equality
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +             "message": "Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1",
    +   Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1",
    +               "expectedContrastRatio": "3:1",
    +             "message": "Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1",
    +   Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1",
    +               "expectedContrastRatio": "3:1",
    +             "message": "Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1",
    +   Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1",
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:32:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/video.webm
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/video-1.webm
    Error Context: test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium/error-context.md
    Error: expect(received).toEqual(expected) // deep equality
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +             "message": "Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1",
    +   Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1",
    +               "expectedContrastRatio": "3:1",
    +             "message": "Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1",
    +   Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1",
    +               "expectedContrastRatio": "3:1",
    +             "message": "Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1",
    +   Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1",
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:32:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/test-failed-1.png
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/video-1.webm
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/video.webm
    Error Context: test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/error-context.md
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/trace.zip
        npx playwright show-trace test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry1/trace.zip
    Error: expect(received).toEqual(expected) // deep equality
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +             "message": "Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1",
    +   Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1",
    +               "expectedContrastRatio": "3:1",
    +             "message": "Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1",
    +   Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1",
    +               "expectedContrastRatio": "3:1",
    +             "message": "Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1",
    +   Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1",
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:32:49
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/test-failed-1.png
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/video.webm
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/video-1.webm
    Error Context: test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/error-context.md
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/d7d9729642f9d5b5db9b88bad82bb48a.webm +46ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/ad6d922c9f72800312f9e903d17611a5.webm +62ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-6/bfc495547fcbc853c512553cf198fe39.webm +54ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/e973f1ff1925ad5b764944d9bd7bf760.webm +100ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/c4c1e9dcee736f3c3b6c301c348e9167.webm +106ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-6/d1194ad12a62732a427ed824e58c598f.webm +11s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/6394c51a3fd9fbbd39757c6494eb5c24.webm +99ms
    Error: expect(received).toHaveLength(expected)
      Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1", "html": "<h4 class=\"roadmap-description-title\">Blockchain Badges</h4>", "impact": "serious", "none": [], "target": [".container-head-roadmap-25-1st > .container-roadmap-content.w-layout-blockcontainer.w-container > .w-richtext:nth-child(3) > h4"]}], "tags": ["cat.color", "wcag2aa", "wcag143", "TTv5", "TT13.c", "EN-301-549", "EN-9.1.4.3", "ACT"]}]
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:127:32
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/video.webm
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/video-1.webm
    Error Context: test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/error-context.md
    Error: expect(received).toHaveLength(expected)
      Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1", "html": "<h4 class=\"roadmap-description-title\">Blockchain Badges</h4>", "impact": "serious", "none": [], "target": [".container-head-roadmap-25-1st > .container-roadmap-content.w-layout-blockcontainer.w-container > .w-richtext:nth-child(3) > h4"]}], "tags": ["cat.color", "wcag2aa", "wcag143", "TTv5", "TT13.c", "EN-301-549", "EN-9.1.4.3", "ACT"]}]
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:127:32
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium-retry1/test-failed-1.png
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium-retry1/video.webm
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium-retry1/video-1.webm
    Error Context: test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium-retry1/error-context.md
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium-retry1/trace.zip
        npx playwright show-trace test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium-retry1/trace.zip
    Error: expect(received).toHaveLength(expected)
      Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1", "html": "<h4 class=\"roadmap-description-title\">Blockchain Badges</h4>", "impact": "serious", "none": [], "target": [".container-head-roadmap-25-1st > .container-roadmap-content.w-layout-blockcontainer.w-container > .w-richtext:nth-child(3) > h4"]}], "tags": ["cat.color", "wcag2aa", "wcag143", "TTv5", "TT13.c", "EN-301-549", "EN-9.1.4.3", "ACT"]}]
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:127:32
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium-retry2/test-failed-1.png
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium-retry2/video-1.webm
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium-retry2/video.webm
    Error Context: test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium-retry2/error-context.md
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/2d2afe6ff89a5cee4c510f27328b17ff.webm +55ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/608712e4165ff35bb0489d19096f949c.webm +67ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/48ec981a8f33b0aaa437f1e4f62430c5.webm +95ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/553dcccffb72bbaf253282f048ddae5e.webm +45ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/335a226af6b5f2f29d6787086b05ca61.webm +98ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/ff239a7ef5d9d8e13eeeca4e9489ce64.webm +151ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/4fee87db7b127c26dc970a92838ecd24.webm +52ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/06df40561709c71d1c764fbfbd72c62a.webm +68ms
[1A✓ 404 handling is working correctly for static site
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/7c456dcc00c812dbe0cdd25a403c72ef.webm +63ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/aee558a40645b3f2c2238d409e4c8d15.webm +14s
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/668cf1583d7315f306667016b16f1e8a.webm +84ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/d4916cf012f582c70a538bd4a1657975.webm +392ms
[1A[34/110] [chromium] › image-validation.spec.js:265:3 › Image Visibility on Live Page › No 404 errors for images
[1A[chromium] › image-validation.spec.js:265:3 › Image Visibility on Live Page › No 404 errors for images
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/c91ab9fb9f2f0c26f5c29c91b28474a7.webm +138ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-8/7c64a2d0dab694aa65f618a49b1cdf11.webm +135ms
[1A[chromium] › image-validation.spec.js:265:3 › Image Visibility on Live Page › No 404 errors for images
✅ No 404 errors detected for images
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/3da2de8a52bb51c1b1aae63ef1b456b8.webm +123ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-9/0e34df4e1d5fc8066c222cd501591a09.webm +47ms
    Error: expect(received).toBeLessThanOrEqual(expected)
      242 |           const expectedWidth = parseInt(image.maxWidth.replace('px', ''));
    > 244 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:244:31
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/video.webm
    Error Context: test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/error-context.md
    Error: expect(received).toBeLessThanOrEqual(expected)
      242 |           const expectedWidth = parseInt(image.maxWidth.replace('px', ''));
    > 244 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:244:31
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/video.webm
    Error Context: test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/error-context.md
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/trace.zip
        npx playwright show-trace test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry1/trace.zip
    Error: expect(received).toBeLessThanOrEqual(expected)
      242 |           const expectedWidth = parseInt(image.maxWidth.replace('px', ''));
    > 244 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:244:31
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry2/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium-retry2/video.webm
```
</details>
