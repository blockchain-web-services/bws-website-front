# Test Failure Report

**Generated:** 2025-10-30 07:51:47 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18933335473)
**Commit:** 61e93fb14e177eabf9549c50eaad6e0730269a44
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 280
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 689642.1329999999ms

### Failed Tests

## Test Output Extract
```
  ✘    3 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (8.5s)
  ✘    8 [chromium] › accessibility/wcag-compliance.spec.js:157:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (10.0s)
  ✘    7 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (retry #1) (12.9s)
  ✘   10 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (retry #2) (8.9s)
    Error: expect(received).toEqual(expected) // deep equality
    Error: expect(received).toEqual(expected) // deep equality
    Error: expect(received).toEqual(expected) // deep equality
  ✘    9 [chromium] › accessibility/wcag-compliance.spec.js:157:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (retry #1) (13.0s)
  ✘   13 [chromium] › accessibility/wcag-compliance.spec.js:157:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (retry #2) (9.3s)
    Error: expect(received).toHaveLength(expected)
    Error: expect(received).toHaveLength(expected)
    Error: expect(received).toHaveLength(expected)
  ✘  146 [chromium] › verify-news-company-menu-live.spec.js:4:3 › Live Site - Company Menu News › Company menu displays 4 news items with titles and descriptions (32.3s)
  ✘  147 [chromium] › verify-news-company-menu-live.spec.js:4:3 › Live Site - Company Menu News › Company menu displays 4 news items with titles and descriptions (retry #1) (34.4s)
  ✘  148 [chromium] › verify-news-company-menu-live.spec.js:4:3 › Live Site - Company Menu News › Company menu displays 4 news items with titles and descriptions (retry #2) (32.3s)
    TimeoutError: locator.hover: Timeout 30000ms exceeded.
    TimeoutError: locator.hover: Timeout 30000ms exceeded.
    TimeoutError: locator.hover: Timeout 30000ms exceeded.
  ✘  149 [chromium] › verify-news-company-menu-live.spec.js:70:3 › Live Site - Company Menu News › News items have proper styling (32.0s)
  ✘  155 [chromium] › verify-news-company-menu-live.spec.js:70:3 › Live Site - Company Menu News › News items have proper styling (retry #1) (34.3s)
  ✘  157 [chromium] › verify-news-company-menu-live.spec.js:70:3 › Live Site - Company Menu News › News items have proper styling (retry #2) (31.9s)
    TimeoutError: locator.hover: Timeout 30000ms exceeded.
    TimeoutError: locator.hover: Timeout 30000ms exceeded.
    TimeoutError: locator.hover: Timeout 30000ms exceeded.
    Error: expect(received).toEqual(expected) // deep equality
    Error: expect(received).toEqual(expected) // deep equality
    Error: expect(received).toEqual(expected) // deep equality
    Error: expect(received).toHaveLength(expected)
    Error: expect(received).toHaveLength(expected)
    Error: expect(received).toHaveLength(expected)
    TimeoutError: locator.hover: Timeout 30000ms exceeded.
    TimeoutError: locator.hover: Timeout 30000ms exceeded.
    TimeoutError: locator.hover: Timeout 30000ms exceeded.
    TimeoutError: locator.hover: Timeout 30000ms exceeded.
    TimeoutError: locator.hover: Timeout 30000ms exceeded.
    TimeoutError: locator.hover: Timeout 30000ms exceeded.
```
