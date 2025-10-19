# Test Failure Report

**Generated:** 2025-10-19 16:32:31 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18632991944)
**Commit:** 1dc4eabe9ba5b23ca45f5393e0b5b0acfc894530
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 147
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 688589.327ms

### Failed Tests

## Test Output Extract
```
  ✘    5 [chromium] › accessibility/wcag-compliance.spec.js:61:3 › WCAG Accessibility Compliance › All images have alt text (1.3s)
  ✘    6 [chromium] › accessibility/wcag-compliance.spec.js:61:3 › WCAG Accessibility Compliance › All images have alt text (retry #1) (2.7s)
  ✘    7 [chromium] › accessibility/wcag-compliance.spec.js:61:3 › WCAG Accessibility Compliance › All images have alt text (retry #2) (1.3s)
    Error: expect(received).toHaveLength(expected)
    Error: expect(received).toHaveLength(expected)
    Error: expect(received).toHaveLength(expected)
    recoverFromStepError: [AsyncFunction: recoverFromStepError],
      message: 'TimeoutError: locator.hover: Timeout 30000ms exceeded.\n' +
      stack: 'TimeoutError: locator.hover: Timeout 30000ms exceeded.\n' +
    recoverFromStepError: [AsyncFunction: recoverFromStepError],
      message: 'TimeoutError: locator.hover: Timeout 30000ms exceeded.\n' +
      stack: 'TimeoutError: locator.hover: Timeout 30000ms exceeded.\n' +
    recoverFromStepError: [AsyncFunction: recoverFromStepError],
      message: 'Error: locator.hover: Test timeout of 90000ms exceeded.\n' +
      stack: 'Error: locator.hover: Test timeout of 90000ms exceeded.\n' +
    recoverFromStepError: [AsyncFunction: recoverFromStepError],
      message: 'Error: locator.hover: Test timeout of 90000ms exceeded.\n' +
      stack: 'Error: locator.hover: Test timeout of 90000ms exceeded.\n' +
  ✘    2 [chromium] › accessibility/button-hover-contrast.spec.js:9:3 › Button Hover State Accessibility › All button hover states maintain proper contrast (1.5m)
  ✘   53 [chromium] › roadmap-cards.spec.js:30:3 › Roadmap Card Text Visibility › Q1 2025 rose card title should be visible with rose text on white (1.7s)
  ✘   54 [chromium] › roadmap-cards.spec.js:30:3 › Roadmap Card Text Visibility › Q1 2025 rose card title should be visible with rose text on white (retry #1) (3.3s)
  ✘   55 [chromium] › roadmap-cards.spec.js:30:3 › Roadmap Card Text Visibility › Q1 2025 rose card title should be visible with rose text on white (retry #2) (1.9s)
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(received).toBe(expected) // Object.is equality
    recoverFromStepError: [AsyncFunction: recoverFromStepError],
      message: 'TimeoutError: locator.hover: Timeout 30000ms exceeded.\n' +
      stack: 'TimeoutError: locator.hover: Timeout 30000ms exceeded.\n' +
    recoverFromStepError: [AsyncFunction: recoverFromStepError],
      message: 'TimeoutError: locator.hover: Timeout 30000ms exceeded.\n' +
      stack: 'TimeoutError: locator.hover: Timeout 30000ms exceeded.\n' +
    recoverFromStepError: [AsyncFunction: recoverFromStepError],
      message: 'Error: locator.hover: Test timeout of 90000ms exceeded.\n' +
      stack: 'Error: locator.hover: Test timeout of 90000ms exceeded.\n' +
    recoverFromStepError: [AsyncFunction: recoverFromStepError],
      message: 'Error: locator.hover: Test timeout of 90000ms exceeded.\n' +
      stack: 'Error: locator.hover: Test timeout of 90000ms exceeded.\n' +
  ✘   33 [chromium] › accessibility/button-hover-contrast.spec.js:9:3 › Button Hover State Accessibility › All button hover states maintain proper contrast (retry #1) (1.6m)
  ✘   57 [chromium] › roadmap-cards.spec.js:74:3 › Roadmap Card Text Visibility › Visual snapshot of entire roadmap section (31.7s)
  ✘   59 [chromium] › roadmap-cards.spec.js:74:3 › Roadmap Card Text Visibility › Visual snapshot of entire roadmap section (retry #1) (33.4s)
  ✘   60 [chromium] › roadmap-cards.spec.js:74:3 › Roadmap Card Text Visibility › Visual snapshot of entire roadmap section (retry #2) (31.8s)
    TimeoutError: locator.scrollIntoViewIfNeeded: Timeout 30000ms exceeded.
    TimeoutError: locator.scrollIntoViewIfNeeded: Timeout 30000ms exceeded.
    TimeoutError: locator.scrollIntoViewIfNeeded: Timeout 30000ms exceeded.
    recoverFromStepError: [AsyncFunction: recoverFromStepError],
      message: 'Error: locator.hover: Test timeout of 90000ms exceeded.\n' +
      stack: 'Error: locator.hover: Test timeout of 90000ms exceeded.\n' +
    recoverFromStepError: [AsyncFunction: recoverFromStepError],
      message: 'Error: locator.hover: Test timeout of 90000ms exceeded.\n' +
      stack: 'Error: locator.hover: Test timeout of 90000ms exceeded.\n' +
```
