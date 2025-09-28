# Test Failure Report

**Generated:** 2025-09-28 15:58:16 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18076407556)
**Commit:** e2206f463aac49a9a7a60b6c91b38f5a9aefee65
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 63
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 959999.079ms

### Failed Tests

## Test Output Extract
```
  ✘    3 [chromium] › accessibility/wcag-compliance.spec.js:27:3 › WCAG Accessibility Compliance › All images have alt text (4.7s)
  ✘    2 [chromium] › accessibility/wcag-compliance.spec.js:5:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (11.0s)
  ✘    4 [chromium] › accessibility/wcag-compliance.spec.js:27:3 › WCAG Accessibility Compliance › All images have alt text (retry #1) (7.9s)
  ✘    6 [chromium] › accessibility/wcag-compliance.spec.js:27:3 › WCAG Accessibility Compliance › All images have alt text (retry #2) (4.4s)
    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoHaveLength[2m([22m[32mexpected[39m[2m)[22m
    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoHaveLength[2m([22m[32mexpected[39m[2m)[22m
    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoHaveLength[2m([22m[32mexpected[39m[2m)[22m
  ✘    5 [chromium] › accessibility/wcag-compliance.spec.js:5:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (retry #1) (15.0s)
  ✘    9 [chromium] › accessibility/wcag-compliance.spec.js:5:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (retry #2) (12.5s)
    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoEqual[2m([22m[32mexpected[39m[2m) // deep equality[22m
    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoEqual[2m([22m[32mexpected[39m[2m) // deep equality[22m
    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoEqual[2m([22m[32mexpected[39m[2m) // deep equality[22m
  ✘   10 [chromium] › accessibility/wcag-compliance.spec.js:82:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (12.6s)
  ✘   11 [chromium] › accessibility/wcag-compliance.spec.js:97:3 › WCAG Accessibility Compliance › Page has proper heading hierarchy (3.6s)
  ✘   13 [chromium] › accessibility/wcag-compliance.spec.js:97:3 › WCAG Accessibility Compliance › Page has proper heading hierarchy (retry #1) (8.2s)
  ✘   12 [chromium] › accessibility/wcag-compliance.spec.js:82:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (retry #1) (16.0s)
  ✘   14 [chromium] › accessibility/wcag-compliance.spec.js:97:3 › WCAG Accessibility Compliance › Page has proper heading hierarchy (retry #2) (3.2s)
    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m
    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m
    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m
  ✘   15 [chromium] › accessibility/wcag-compliance.spec.js:82:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (retry #2) (13.3s)
    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoHaveLength[2m([22m[32mexpected[39m[2m)[22m
    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoHaveLength[2m([22m[32mexpected[39m[2m)[22m
    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoHaveLength[2m([22m[32mexpected[39m[2m)[22m
  ✘   21 [chromium] › assets.spec.js:86:3 › Asset Verification Tests › Blockchain Founders Group image test (8.7s)
  ✘   25 [chromium] › assets.spec.js:86:3 › Asset Verification Tests › Blockchain Founders Group image test (retry #1) (12.4s)
  ✘   26 [chromium] › e2e/navigation.spec.js:8:3 › Navigation Tests › Main navigation menu works correctly (19.1s)
  ✘   27 [chromium] › assets.spec.js:86:3 › Asset Verification Tests › Blockchain Founders Group image test (retry #2) (9.3s)
    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed
    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed
    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed
  ✘   30 [chromium] › e2e/navigation.spec.js:48:3 › Navigation Tests › Footer navigation links work (10.5s)
  ✘   28 [chromium] › e2e/navigation.spec.js:8:3 › Navigation Tests › Main navigation menu works correctly (retry #1) (34.4s)
  ✘   31 [chromium] › e2e/navigation.spec.js:48:3 › Navigation Tests › Footer navigation links work (retry #1) (13.7s)
  ✘   33 [chromium] › e2e/navigation.spec.js:48:3 › Navigation Tests › Footer navigation links work (retry #2) (11.6s)
    Error: [2mexpect([22m[31mpage[39m[2m).[22mtoHaveURL[2m([22m[32mexpected[39m[2m)[22m failed
    Error: [2mexpect([22m[31mpage[39m[2m).[22mtoHaveURL[2m([22m[32mexpected[39m[2m)[22m failed
    Error: [2mexpect([22m[31mpage[39m[2m).[22mtoHaveURL[2m([22m[32mexpected[39m[2m)[22m failed
  ✘   32 [chromium] › e2e/navigation.spec.js:8:3 › Navigation Tests › Main navigation menu works correctly (retry #2) (18.9s)
    TimeoutError: locator.click: Timeout 15000ms exceeded.
    TimeoutError: page.waitForLoadState: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 15000ms exceeded.
  ✘   35 [chromium] › e2e/navigation.spec.js:81:3 › Navigation Tests › 404 page handles non-existent routes (6.2s)
  ✘   34 [chromium] › e2e/navigation.spec.js:72:3 › Navigation Tests › Logo click returns to homepage (16.7s)
  ✘   36 [chromium] › e2e/navigation.spec.js:81:3 › Navigation Tests › 404 page handles non-existent routes (retry #1) (6.1s)
  ✘   38 [chromium] › e2e/navigation.spec.js:81:3 › Navigation Tests › 404 page handles non-existent routes (retry #2) (6.0s)
    Error: [2mexpect([22m[31mpage[39m[2m).[22mtoHaveURL[2m([22m[32mexpected[39m[2m)[22m failed
    Error: [2mexpect([22m[31mpage[39m[2m).[22mtoHaveURL[2m([22m[32mexpected[39m[2m)[22m failed
    Error: [2mexpect([22m[31mpage[39m[2m).[22mtoHaveURL[2m([22m[32mexpected[39m[2m)[22m failed
  ✘   37 [chromium] › e2e/navigation.spec.js:72:3 › Navigation Tests › Logo click returns to homepage (retry #1) (18.3s)
```
