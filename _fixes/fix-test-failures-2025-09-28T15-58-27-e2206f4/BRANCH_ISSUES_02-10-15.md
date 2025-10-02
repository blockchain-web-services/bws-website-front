# Test Failure Report - Fix Branch

**Generated:** 2025-10-02 15:27:30 UTC
**Branch:** fix/test-failures-2025-09-28T15-58-27-e2206f4
**Commit:** 69da70b8ee7cdb2ff22cb24a55fef601de8a9719
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18197198883)

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

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-3/1f024ff6afa18bf6454e82da0468d067.webm +11s`

**Error Details:**
```
Error: expect(received).toEqual(expected) // deep equality
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
```

---

### Failure #2

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-3/1f024ff6afa18bf6454e82da0468d067.webm +11s`

**Error Details:**
```
Error: expect(received).toEqual(expected) // deep equality
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
```

---

### Failure #3

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-3/1f024ff6afa18bf6454e82da0468d067.webm +11s`

**Error Details:**
```
Error: expect(received).toEqual(expected) // deep equality
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
    +               "expectedContrastRatio": "3:1",
```

---

### Failure #4

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-5/da9b20b5f82dc2b396df47e84c6160ea.webm +90ms`

**Error Details:**
```
Error: expect(received).toHaveLength(expected)
      Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1", "html": "<h4 class=\"roadmap-description-title\">Blockchain Badges</h4>", "impact": "serious", "none": [], "target": [".container-head-roadmap-25-1st > .container-roadmap-content.w-layout-blockcontainer.w-container > .w-richtext:nth-child(3) > h4"]}], "tags": ["cat.color", "wcag2aa", "wcag143", "TTv5", "TT13.c", "EN-301-549", "EN-9.1.4.3", "ACT"]}]
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:127:32
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/test-failed-1.png
```

---

### Failure #5

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-5/da9b20b5f82dc2b396df47e84c6160ea.webm +90ms`

**Error Details:**
```
Error: expect(received).toHaveLength(expected)
      Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1", "html": "<h4 class=\"roadmap-description-title\">Blockchain Badges</h4>", "impact": "serious", "none": [], "target": [".container-head-roadmap-25-1st > .container-roadmap-content.w-layout-blockcontainer.w-container > .w-richtext:nth-child(3) > h4"]}], "tags": ["cat.color", "wcag2aa", "wcag143", "TTv5", "TT13.c", "EN-301-549", "EN-9.1.4.3", "ACT"]}]
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:127:32
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/test-failed-1.png
```

---

### Failure #6

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-5/da9b20b5f82dc2b396df47e84c6160ea.webm +90ms`

**Error Details:**
```
Error: expect(received).toHaveLength(expected)
      Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1", "html": "<h4 class=\"roadmap-description-title\">Blockchain Badges</h4>", "impact": "serious", "none": [], "target": [".container-head-roadmap-25-1st > .container-roadmap-content.w-layout-blockcontainer.w-container > .w-richtext:nth-child(3) > h4"]}], "tags": ["cat.color", "wcag2aa", "wcag143", "TTv5", "TT13.c", "EN-301-549", "EN-9.1.4.3", "ACT"]}]
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:127:32
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/test-failed-1.png
```

---

### Failure #7

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-5/9f842963a140ec0b67b32a7facb6e2f9.webm +47ms`

**Error Details:**
```
Error: expect(received).toBeLessThanOrEqual(expected)
      225 |           const expectedWidth = parseInt(image.maxWidth.replace('px', ''));
    > 227 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:227:31
```

---

### Failure #8

**Test:** `    Error: expect(received).toBeLessThanOrEqual(expected)`

**Error Details:**
```
> 227 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:227:31
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/video.webm
```

---

### Failure #9

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-5/9f842963a140ec0b67b32a7facb6e2f9.webm +47ms`

**Error Details:**
```
Error: expect(received).toBeLessThanOrEqual(expected)
      225 |           const expectedWidth = parseInt(image.maxWidth.replace('px', ''));
    > 227 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:227:31
```

---

### Failure #10

**Test:** `    Error: expect(received).toBeLessThanOrEqual(expected)`

**Error Details:**
```
> 227 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:227:31
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/video.webm
```

---

### Failure #11

**Test:** `  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-5/9f842963a140ec0b67b32a7facb6e2f9.webm +47ms`

**Error Details:**
```
Error: expect(received).toBeLessThanOrEqual(expected)
      225 |           const expectedWidth = parseInt(image.maxWidth.replace('px', ''));
    > 227 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:227:31
```

---

### Failure #12

**Test:** `    Error: expect(received).toBeLessThanOrEqual(expected)`

**Error Details:**
```
> 227 |           expect(actualWidth).toBeLessThanOrEqual(expectedWidth);
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-validation.spec.js:227:31
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/test-failed-1.png
    test-results/image-validation-Image-Vis-184d7--visible-and-properly-sized-chromium/video.webm
```

---

### Failure #13

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-11/23d6ec6040bce900320368bfef95c1fd.webm +48ms`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
      48 |     // Soft assertion - warn instead of failing if CSS not applied
      53 |       // Still fail but with better context
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:50:31
```

---

### Failure #14

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-11/23d6ec6040bce900320368bfef95c1fd.webm +48ms`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
      48 |     // Soft assertion - warn instead of failing if CSS not applied
      53 |       // Still fail but with better context
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:50:31
```

---

### Failure #15

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-11/23d6ec6040bce900320368bfef95c1fd.webm +48ms`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
      48 |     // Soft assertion - warn instead of failing if CSS not applied
      53 |       // Still fail but with better context
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:50:31
```

---

### Failure #16

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-11/23d6ec6040bce900320368bfef95c1fd.webm +48ms`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
      48 |     // Soft assertion - warn instead of failing if CSS not applied
      53 |       // Still fail but with better context
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:50:31
```

---

### Failure #17

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-11/23d6ec6040bce900320368bfef95c1fd.webm +48ms`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
      48 |     // Soft assertion - warn instead of failing if CSS not applied
      53 |       // Still fail but with better context
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:50:31
```

---

### Failure #18

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-11/23d6ec6040bce900320368bfef95c1fd.webm +48ms`

**Error Details:**
```
Error: expect(received).toContain(expected) // indexOf
      48 |     // Soft assertion - warn instead of failing if CSS not applied
      53 |       // Still fail but with better context
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:50:31
```

---

### Failure #19

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-19/201b8e560f34080d4622b01fcd3fa9ff.webm +64ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        13 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" class="top-menu-company-news-image" alt="Blockchain Founders Group logo" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
           - unexpected value "hidden"
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:104:26
```

---

### Failure #20

**Test:** `[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/.playwright-artifacts-19/201b8e560f34080d4622b01fcd3fa9ff.webm +64ms`

**Error Details:**
```
Error: expect(locator).toBeVisible() failed
        13 × locator resolved to <img loading="lazy" data-astro-cid-pux6a34n="" class="top-menu-company-news-image" alt="Blockchain Founders Group logo" src="/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg"/>
           - unexpected value "hidden"
        at /home/runner/work/bws-website-front/bws-website-front/tests/image-visibility-index.spec.js:104:26
```

## 📄 Raw Test Output

<details>
<summary>Click to expand full test output (cleaned)</summary>

```
Running 110 tests using 2 workers
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/cd27cdae1e76c466a2164466877bcbd9.webm +481ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/28ff8a3cf0470a625a465a3a3edcc261.webm +495ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/bdb15ab0332d17a14784bd1021fc9763.webm +581ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/18cdd13755495bd475f719a0a6b491ca.webm +614ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/961b7c66071c366eafb50f88de3a520c.webm +4s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-1/74362e77a48867f76ee7c9f056137e3a.webm +9s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/60f1a6d92fc19ca75fda0513ccc53a60.webm +81ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/55afbc59438096b0e425f94bdaebbe27.webm +76ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-2/e2790dda171ab5d08bc172de5af3407c.webm +45ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/bc80b502821d934a695f848504026e3f.webm +51ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/7e8aae04621019430610f2e0bb3a3196.webm +88ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-2/f91a75dc771a023506305d1ef394d7a1.webm +12s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-0/f61544588b01c7f6077e8fec106041d8.webm +12s
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-3/9662e0a97344021c8aff617cedc112fa.webm +45ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/15ccebd1880de105aeb5a4b0598d3bde.webm +61ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-3/1f024ff6afa18bf6454e82da0468d067.webm +11s
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-4/94e0c6bb6cc41f8edd1781c935992a3c.webm +11s
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
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/video-1.webm
    test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/video.webm
    Error Context: test-results/accessibility-wcag-complia-62f5f-passes-accessibility-checks-chromium-retry2/error-context.md
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/24ed35c874517fe7cbc6d77d8c378ae0.webm +39ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/f7cb473cf8fcbf027d4cc545cfc39cc6.webm +66ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-6/82f9867a7dc318c1cee97339c1e89f39.webm +55ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/06c13e801c167f1bb19973e9e8a518f3.webm +90ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/27ecb66e3ea6324e7d796c558fd9a696.webm +126ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/da9b20b5f82dc2b396df47e84c6160ea.webm +90ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-6/f1967311ea54e60757679b0f6f811b77.webm +10s
    Error: expect(received).toHaveLength(expected)
      Element has insufficient color contrast of 1.22 (foreground color: #6b7280, background color: #c41841, font size: 16.5pt (22px), font weight: bold). Expected contrast ratio of 3:1", "html": "<h4 class=\"roadmap-description-title\">Blockchain Badges</h4>", "impact": "serious", "none": [], "target": [".container-head-roadmap-25-1st > .container-roadmap-content.w-layout-blockcontainer.w-container > .w-richtext:nth-child(3) > h4"]}], "tags": ["cat.color", "wcag2aa", "wcag143", "TTv5", "TT13.c", "EN-301-549", "EN-9.1.4.3", "ACT"]}]
        at /home/runner/work/bws-website-front/bws-website-front/tests/accessibility/wcag-compliance.spec.js:127:32
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/test-failed-1.png
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/video-1.webm
    test-results/accessibility-wcag-complia-9c6ac-ntrast-meets-WCAG-standards-chromium/video.webm
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
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/295809109e0afc39a2a66cfab4f60db4.webm +44ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/6185a77284084278f9f9d42dd470f2b2.webm +64ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/7fd00e3c4827a0ee6c11b114faf5fca7.webm +96ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/533fdfd0af6934a7eb7387368e16c990.webm +98ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/1979e5ff1d547e833d1d7ade5c6a42d9.webm +94ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/3c551c2fbd904948393721be1ca88115.webm +153ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/652f256b32cefdfb73bca8d08312c914.webm +5s
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/d7056ffc4e28361982e519d1290ba672.webm +138ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/837b9dbdbaffd5f96d1dc5873d18465d.webm +118ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/b6674b25d6819ce956126191dc88d255.webm +77ms
[1A✓ 404 handling is working correctly for static site
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/40f0bcc0883c09892df52b17fbdbd251.webm +114ms
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-7/9fad78193bdd509d05e1f59351efe429.webm +309ms
[1A[34/110] [chromium] › image-validation.spec.js:248:3 › Image Visibility on Live Page › No 404 errors for images
[1A[chromium] › image-validation.spec.js:248:3 › Image Visibility on Live Page › No 404 errors for images
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/ff96e919010b1d721ce55e40cd9fd526.webm +91ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-8/0465fdbc51a4a71a7d6a23b84e674790.webm +93ms
[1A[chromium] › image-validation.spec.js:248:3 › Image Visibility on Live Page › No 404 errors for images
✅ No 404 errors detected for images
  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-5/9f842963a140ec0b67b32a7facb6e2f9.webm +47ms
[1A  pw:browser <launching> /home/runner/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux -loglevel error -f image2pipe -avioflags direct -fpsprobesize 0 -probesize 32 -analyzeduration 0 -c:v mjpeg -i pipe:0 -y -an -r 25 -c:v vp8 -qmin 0 -qmax 50 -crf 8 -deadline realtime -speed 8 -b:v 1M -threads 1 -vf pad=800:450:0:0:gray,crop=800:450:0:0 /home/runner/work/bws-website-front/bws-website-front/tests/test-results/.playwright-artifacts-9/e17ca4b38a6d613c9acbc9339be3ac6f.webm +37ms
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
```
</details>
