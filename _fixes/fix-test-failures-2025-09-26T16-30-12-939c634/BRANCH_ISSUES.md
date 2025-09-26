# Test Failure Report

**Generated:** 2025-09-26 16:30:12 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18043182593)
**Commit:** 939c63492ebc9b63fe995f3f6009c863e3bf3297

## Test Results Summary
Processing test results from: test-results.json
### Statistics
- **Total Tests:** 62
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Skipped:** ⏭️ 1
- **Duration:** 956172.094ms

### Failed Tests


## Test Execution Log (Cleaned)
### Failed Test Output Only
```
[WebServer]   [16:14:23] 200 ─ 4.40ms ─ /assets/fonts/THICCCBOI-Regular.ttf

  ✘    1 [chromium] › accessibility/wcag-compliance.spec.js:16:3 › WCAG Accessibility Compliance › About page passes accessibility checks (5.7s)
[3/107] [chromium] › accessibility/wcag-compliance.spec.js:16:3 › WCAG Accessibility Compliance › About page passes accessibility checks (retry #1)
[WebServer]   [16:14:26] 200 ─ 4.76ms ─ /about
[WebServer]   [16:14:26] 200 ─ 4.76ms ─ /about

[WebServer]   [16:14:26] 200 ─ 5.60ms ─ /assets/js/webfont.js
[WebServer]   [16:14:26] 200 ─ 5.60ms ─ /assets/js/webfont.js

[WebServer]   [16:14:26] 200 ─ 7.81ms ─ /assets/hoisted.D51iEawP.js
[WebServer]   [16:14:26] 200 ─ 7.81ms ─ /assets/hoisted.D51iEawP.js

--
[WebServer]   [16:14:27] 206 ─ 24.25ms ─ /assets/images/6474d385cfec71cb21a92251/670f916b2f60627d5201850b_shutterstock_1108417201-transcode.webm

  ✘    2 [chromium] › accessibility/wcag-compliance.spec.js:5:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (10.2s)
[4/107] [chromium] › accessibility/wcag-compliance.spec.js:5:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (retry #1)
[WebServer]   [16:14:30] 200 ─ 9.30ms ─ /
[WebServer]   [16:14:30] 200 ─ 9.30ms ─ /

[WebServer]   [16:14:30] 200 ─ 3.33ms ─ /assets/js/webfont.js
[WebServer]   [16:14:30] 200 ─ 4.51ms ─ /assets/hoisted.D51iEawP.js
[WebServer]   [16:14:30] 200 ─ 3.33ms ─ /assets/js/webfont.js
[WebServer]   [16:14:30] 200 ─ 4.51ms ─ /assets/hoisted.D51iEawP.js

[WebServer]   [16:14:30] 200 ─ 6.07ms ─ /assets/images/6474d385cfec71cb21a92251/651c58eabcaaed235a87df6d_logo_plus_BWS.svg
--
[WebServer]   [16:14:32] 200 ─ 1.72ms ─ /assets/js/6474d385cfec71cb21a9236e_lottie-techplus-x-template.json

  ✘    3 [chromium] › accessibility/wcag-compliance.spec.js:16:3 › WCAG Accessibility Compliance › About page passes accessibility checks (retry #1) (6.2s)
[WebServer]   [16:14:36] 200 ─ 3.72ms ─ /assets/fonts/THICCCBOI-Regular.ttf
[WebServer]   [16:14:36] 200 ─ 3.72ms ─ /assets/fonts/THICCCBOI-Regular.ttf

[5/107] [chromium] › accessibility/wcag-compliance.spec.js:16:3 › WCAG Accessibility Compliance › About page passes accessibility checks (retry #2)
[WebServer]   [16:14:37] 200 ─ 2.15ms ─ /about
[WebServer]   [16:14:37] 200 ─ 2.15ms ─ /about

[WebServer]   [16:14:37] 200 ─ 7.41ms ─ /assets/js/webfont.js
[WebServer]   [16:14:37] 200 ─ 7.41ms ─ /assets/js/webfont.js

--
[WebServer]   [16:14:38] 206 ─ 63.40ms ─ /assets/images/6474d385cfec71cb21a92251/670f916b2f60627d5201850b_shutterstock_1108417201-transcode.webm

  ✘    5 [chromium] › accessibility/wcag-compliance.spec.js:16:3 › WCAG Accessibility Compliance › About page passes accessibility checks (retry #2) (6.1s)
  1) [chromium] › accessibility/wcag-compliance.spec.js:16:3 › WCAG Accessibility Compliance › About page passes accessibility checks 

    Error: expect(received).toEqual(expected) // deep equality

    - Expected  -   1
    + Received  + 123

    - Array []
    + Array [
    +   Object {
    +     "description": "Ensure every HTML document has a lang attribute",
    +     "help": "<html> element must have a lang attribute",
    +     "helpUrl": "https://dequeuniversity.com/rules/axe/4.10/html-has-lang?application=playwright",
--
    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toEqual(expected) // deep equality

    - Expected  -   1
    + Received  + 123

    - Array []
    + Array [
    +   Object {
    +     "description": "Ensure every HTML document has a lang attribute",
    +     "help": "<html> element must have a lang attribute",
    +     "helpUrl": "https://dequeuniversity.com/rules/axe/4.10/html-has-lang?application=playwright",
--
    Retry #2 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toEqual(expected) // deep equality

    - Expected  -   1
    + Received  + 123

    - Array []
    + Array [
    +   Object {
    +     "description": "Ensure every HTML document has a lang attribute",
    +     "help": "<html> element must have a lang attribute",
    +     "helpUrl": "https://dequeuniversity.com/rules/axe/4.10/html-has-lang?application=playwright",
--
[WebServer]   [16:14:47] 206 ─ 18.98ms ─ /assets/images/6474d385cfec71cb21a92251/670f916b2f60627d5201850b_shutterstock_1108417201-transcode.webm

  ✘    6 [chromium] › accessibility/wcag-compliance.spec.js:27:3 › WCAG Accessibility Compliance › All images have alt text (3.3s)
  ✘    4 [chromium] › accessibility/wcag-compliance.spec.js:5:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (retry #1) (15.6s)
[7/107] [chromium] › accessibility/wcag-compliance.spec.js:27:3 › WCAG Accessibility Compliance › All images have alt text (retry #1)
[WebServer]   [16:14:50] 200 ─ 7.88ms ─ /
[WebServer]   [16:14:50] 200 ─ 7.88ms ─ /

[WebServer]   [16:14:50] 200 ─ 7.78ms ─ /assets/js/webfont.js
[WebServer]   [16:14:50] 200 ─ 7.92ms ─ /assets/hoisted.D51iEawP.js
[WebServer]   [16:14:50] 200 ─ 7.78ms ─ /assets/js/webfont.js
[WebServer]   [16:14:50] 200 ─ 7.92ms ─ /assets/hoisted.D51iEawP.js

[WebServer]   [16:14:50] 200 ─ 8.70ms ─ /assets/images/6474d385cfec71cb21a92251/651c58eabcaaed235a87df6d_logo_plus_BWS.svg
--
[WebServer]   [16:14:57] 200 ─ 1.56ms ─ /assets/fonts/THICCCBOI-Regular.ttf

  ✘    7 [chromium] › accessibility/wcag-compliance.spec.js:27:3 › WCAG Accessibility Compliance › All images have alt text (retry #1) (8.2s)
  ✘    8 [chromium] › accessibility/wcag-compliance.spec.js:5:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (retry #2) (10.4s)
  2) [chromium] › accessibility/wcag-compliance.spec.js:5:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks 

    Error: expect(received).toEqual(expected) // deep equality

    - Expected  -    1
    + Received  + 1619

    - Array []
    + Array [
    +   Object {
    +     "description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
    +     "help": "Elements must meet minimum color contrast ratio thresholds",
    +     "helpUrl": "https://dequeuniversity.com/rules/axe/4.10/color-contrast?application=playwright",
--
    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toEqual(expected) // deep equality

    - Expected  -    1
    + Received  + 1619

    - Array []
    + Array [
    +   Object {
    +     "description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
    +     "help": "Elements must meet minimum color contrast ratio thresholds",
    +     "helpUrl": "https://dequeuniversity.com/rules/axe/4.10/color-contrast?application=playwright",
--
    Retry #2 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toEqual(expected) // deep equality

    - Expected  -    1
    + Received  + 1619

    - Array []
    + Array [
    +   Object {
    +     "description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
    +     "help": "Elements must meet minimum color contrast ratio thresholds",
    +     "helpUrl": "https://dequeuniversity.com/rules/axe/4.10/color-contrast?application=playwright",
--
[WebServer]   [16:15:06] 200 ─ 4.49ms ─ /assets/js/jquery-3.5.1.min.dc5e7f18c8.js

  ✘    9 [chromium] › accessibility/wcag-compliance.spec.js:27:3 › WCAG Accessibility Compliance › All images have alt text (retry #2) (4.2s)
  3) [chromium] › accessibility/wcag-compliance.spec.js:27:3 › WCAG Accessibility Compliance › All images have alt text 

    Error: expect(received).toHaveLength(expected)

    Expected length: 0
    Received length: 21
    Received array:  ["http://localhost:4321/assets/images/6474d385cfec71cb21a92251/651c58eabcaaed235a87df6d_logo_plus_BWS.svg", "http://localhost:4321/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg", "http://localhost:4321/assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template.png", "http://localhost:4321/assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template.png", "http://localhost:4321/assets/images/6474d385cfec71cb21a9229a/65061f550fd7be777e64f36f_Save_400x300.jpg", "http://localhost:4321/assets/images/6474d385cfec71cb21a9229a/65061ebf5608b7584d9def34_Hash_400x300.jpg", "http://localhost:4321/assets/images/6474d385cfec71cb21a9229a/655b1a1220eb4c16ccfcab4b_BWS.IPFS.Upload_400x300.jpg", "http://localhost:4321/assets/images/6474d385cfec71cb21a9229a/65061646ead0751dc83790e1_NFT_1200x628.jpg", "http://localhost:4321/assets/images/6474d385cfec71cb21a9229a/66842c0750c2f76ef6ee8a4a_raibow-colors.jpg", "http://localhost:4321/assets/images/6474d385cfec71cb21a9229a/65061830bf101fe685a48e2f_NFT-Marketplace_400x300.jpg", …]

      32 |     );
      33 |
    > 34 |     expect(imagesWithoutAlt).toHaveLength(0);
         |                              ^
      35 |   });
--
    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toHaveLength(expected)

    Expected length: 0
    Received length: 21
    Received array:  ["http://localhost:4321/assets/images/6474d385cfec71cb21a92251/651c58eabcaaed235a87df6d_logo_plus_BWS.svg", "http://localhost:4321/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg", "http://localhost:4321/assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template.png", "http://localhost:4321/assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template.png", "http://localhost:4321/assets/images/6474d385cfec71cb21a9229a/65061f550fd7be777e64f36f_Save_400x300.jpg", "http://localhost:4321/assets/images/6474d385cfec71cb21a9229a/65061ebf5608b7584d9def34_Hash_400x300.jpg", "http://localhost:4321/assets/images/6474d385cfec71cb21a9229a/655b1a1220eb4c16ccfcab4b_BWS.IPFS.Upload_400x300.jpg", "http://localhost:4321/assets/images/6474d385cfec71cb21a9229a/65061646ead0751dc83790e1_NFT_1200x628.jpg", "http://localhost:4321/assets/images/6474d385cfec71cb21a9229a/66842c0750c2f76ef6ee8a4a_raibow-colors.jpg", "http://localhost:4321/assets/images/6474d385cfec71cb21a9229a/65061830bf101fe685a48e2f_NFT-Marketplace_400x300.jpg", …]

      32 |     );
      33 |
    > 34 |     expect(imagesWithoutAlt).toHaveLength(0);
         |                              ^
      35 |   });
--
    Retry #2 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toHaveLength(expected)

    Expected length: 0
    Received length: 21
    Received array:  ["http://localhost:4321/assets/images/6474d385cfec71cb21a92251/651c58eabcaaed235a87df6d_logo_plus_BWS.svg", "http://localhost:4321/assets/images/6474d385cfec71cb21a9229a/6505cc39f53261fa63453cc8_logo-blockchain-founders-group-background-transparent.svg", "http://localhost:4321/assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template.png", "http://localhost:4321/assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template.png", "http://localhost:4321/assets/images/6474d385cfec71cb21a9229a/65061f550fd7be777e64f36f_Save_400x300.jpg", "http://localhost:4321/assets/images/6474d385cfec71cb21a9229a/65061ebf5608b7584d9def34_Hash_400x300.jpg", "http://localhost:4321/assets/images/6474d385cfec71cb21a9229a/655b1a1220eb4c16ccfcab4b_BWS.IPFS.Upload_400x300.jpg", "http://localhost:4321/assets/images/6474d385cfec71cb21a9229a/65061646ead0751dc83790e1_NFT_1200x628.jpg", "http://localhost:4321/assets/images/6474d385cfec71cb21a9229a/66842c0750c2f76ef6ee8a4a_raibow-colors.jpg", "http://localhost:4321/assets/images/6474d385cfec71cb21a9229a/65061830bf101fe685a48e2f_NFT-Marketplace_400x300.jpg", …]

      32 |     );
      33 |
    > 34 |     expect(imagesWithoutAlt).toHaveLength(0);
         |                              ^
      35 |   });
--
[WebServer]   [16:15:10] 206 ─ 7.76ms ─ /assets/images/6474d385cfec71cb21a92251/670f916b2f60627d5201850b_shutterstock_1108417201-transcode.webm

  ✘   13 [chromium] › accessibility/wcag-compliance.spec.js:97:3 › WCAG Accessibility Compliance › Page has proper heading hierarchy (4.8s)
[WebServer]   [16:15:14] 200 ─ 4.35ms ─ /assets/fonts/THICCCBOI-Regular.ttf
[WebServer]   [16:15:14] 200 ─ 4.35ms ─ /assets/fonts/THICCCBOI-Regular.ttf

[14/107] [chromium] › accessibility/wcag-compliance.spec.js:97:3 › WCAG Accessibility Compliance › Page has proper heading hierarchy (retry #1)
```

## Environment Information
- **Runner OS:** Linux
- **Node Version:** 20
- **Browser:** chromium
