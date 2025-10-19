# Test Failure Report

**Generated:** 2025-10-19 15:59:37 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18632616706)
**Commit:** 6f3cae76461dafdb524c464a063122e030f9c516
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 145
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 719799.523ms

### Failed Tests

## Test Output Extract
```
  ✘    3 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (4.0s)
  ✘    4 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (retry #1) (9.2s)
  ✘    5 [chromium] › accessibility/wcag-compliance.spec.js:6:3 › WCAG Accessibility Compliance › Homepage passes accessibility checks (retry #2) (6.9s)
    Error: expect(received).toEqual(expected) // deep equality
    Error: expect(received).toEqual(expected) // deep equality
    Error: expect(received).toEqual(expected) // deep equality
  ✘    7 [chromium] › accessibility/wcag-compliance.spec.js:61:3 › WCAG Accessibility Compliance › All images have alt text (1.4s)
  ✘    8 [chromium] › accessibility/wcag-compliance.spec.js:61:3 › WCAG Accessibility Compliance › All images have alt text (retry #1) (2.7s)
  ✘    9 [chromium] › accessibility/wcag-compliance.spec.js:61:3 › WCAG Accessibility Compliance › All images have alt text (retry #2) (1.4s)
    Error: expect(received).toHaveLength(expected)
    Error: expect(received).toHaveLength(expected)
    Error: expect(received).toHaveLength(expected)
  ✘   12 [chromium] › accessibility/wcag-compliance.spec.js:157:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (3.9s)
  ✘   13 [chromium] › accessibility/wcag-compliance.spec.js:157:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (retry #1) (6.6s)
  ✘   14 [chromium] › accessibility/wcag-compliance.spec.js:157:3 › WCAG Accessibility Compliance › Color contrast meets WCAG standards (retry #2) (3.9s)
    Error: expect(received).toHaveLength(expected)
    Error: expect(received).toHaveLength(expected)
    Error: expect(received).toHaveLength(expected)
    recoverFromStepError: [AsyncFunction: recoverFromStepError],
      message: 'Error: locator.hover: Test timeout of 90000ms exceeded.\n' +
      stack: 'Error: locator.hover: Test timeout of 90000ms exceeded.\n' +
    recoverFromStepError: [AsyncFunction: recoverFromStepError],
      message: 'Error: locator.hover: Test timeout of 90000ms exceeded.\n' +
      stack: 'Error: locator.hover: Test timeout of 90000ms exceeded.\n' +
  ✘    2 [chromium] › accessibility/button-hover-contrast.spec.js:9:3 › Button Hover State Accessibility › All button hover states maintain proper contrast (1.5m)
    recoverFromStepError: [AsyncFunction: recoverFromStepError],
      message: 'TimeoutError: locator.hover: Timeout 30000ms exceeded.\n' +
      stack: 'TimeoutError: locator.hover: Timeout 30000ms exceeded.\n' +
    recoverFromStepError: [AsyncFunction: recoverFromStepError],
      message: 'TimeoutError: locator.hover: Timeout 30000ms exceeded.\n' +
      stack: 'TimeoutError: locator.hover: Timeout 30000ms exceeded.\n' +
  ✘   57 [chromium] › roadmap-cards.spec.js:30:3 › Roadmap Card Text Visibility › Q1 2025 rose card title should be visible with rose text on white (2.7s)
  ✘   24 [chromium] › accessibility/button-hover-contrast.spec.js:9:3 › Button Hover State Accessibility › All button hover states maintain proper contrast (retry #1) (1.6m)
  ✘   58 [chromium] › roadmap-cards.spec.js:30:3 › Roadmap Card Text Visibility › Q1 2025 rose card title should be visible with rose text on white (retry #1) (5.2s)
  ✘   60 [chromium] › roadmap-cards.spec.js:30:3 › Roadmap Card Text Visibility › Q1 2025 rose card title should be visible with rose text on white (retry #2) (2.1s)
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(received).toBe(expected) // Object.is equality
  ✘   62 [chromium] › roadmap-cards.spec.js:74:3 › Roadmap Card Text Visibility › Visual snapshot of entire roadmap section (31.6s)
  ✘   63 [chromium] › roadmap-cards.spec.js:74:3 › Roadmap Card Text Visibility › Visual snapshot of entire roadmap section (retry #1) (33.5s)
    recoverFromStepError: [AsyncFunction: recoverFromStepError],
      message: 'Error: locator.hover: Test timeout of 90000ms exceeded.\n' +
      stack: 'Error: locator.hover: Test timeout of 90000ms exceeded.\n' +
    recoverFromStepError: [AsyncFunction: recoverFromStepError],
      message: 'Error: locator.hover: Test timeout of 90000ms exceeded.\n' +
      stack: 'Error: locator.hover: Test timeout of 90000ms exceeded.\n' +
  ✘   59 [chromium] › accessibility/button-hover-contrast.spec.js:9:3 › Button Hover State Accessibility › All button hover states maintain proper contrast (retry #2) (1.5m)
    Error: locator.isVisible: Target page, context or browser has been closed
    Error: expect(received).toHaveLength(expected)
    Error: locator.isVisible: Target page, context or browser has been closed
```
