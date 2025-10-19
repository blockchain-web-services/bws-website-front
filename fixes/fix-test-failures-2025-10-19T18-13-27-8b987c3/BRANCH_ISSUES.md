# Test Failure Report

**Generated:** 2025-10-19 18:13:13 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18634051995)
**Commit:** 8b987c3398d439c7a9d119e40b646a27b01a9d1d
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 150
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 699136.653ms

### Failed Tests

## Test Output Extract
```
    recoverFromStepError: [AsyncFunction: recoverFromStepError],
      message: 'Error: locator.hover: Test timeout of 90000ms exceeded.\n' +
      stack: 'Error: locator.hover: Test timeout of 90000ms exceeded.\n' +
    recoverFromStepError: [AsyncFunction: recoverFromStepError],
      message: 'Error: locator.hover: Test timeout of 90000ms exceeded.\n' +
      stack: 'Error: locator.hover: Test timeout of 90000ms exceeded.\n' +
  ✘    1 [chromium] › accessibility/button-hover-contrast.spec.js:9:3 › Button Hover State Accessibility › All button hover states maintain proper contrast (1.5m)
    recoverFromStepError: [AsyncFunction: recoverFromStepError],
      message: 'TimeoutError: locator.hover: Timeout 30000ms exceeded.\n' +
      stack: 'TimeoutError: locator.hover: Timeout 30000ms exceeded.\n' +
    recoverFromStepError: [AsyncFunction: recoverFromStepError],
      message: 'TimeoutError: locator.hover: Timeout 30000ms exceeded.\n' +
      stack: 'TimeoutError: locator.hover: Timeout 30000ms exceeded.\n' +
  ✘   53 [chromium] › roadmap-cards.spec.js:74:3 › Roadmap Card Text Visibility › Visual snapshot of entire roadmap section (32.2s)
  ✘   32 [chromium] › accessibility/button-hover-contrast.spec.js:9:3 › Button Hover State Accessibility › All button hover states maintain proper contrast (retry #1) (1.6m)
  ✘   54 [chromium] › roadmap-cards.spec.js:74:3 › Roadmap Card Text Visibility › Visual snapshot of entire roadmap section (retry #1) (34.1s)
  ✘   56 [chromium] › roadmap-cards.spec.js:74:3 › Roadmap Card Text Visibility › Visual snapshot of entire roadmap section (retry #2) (31.9s)
    TimeoutError: locator.scrollIntoViewIfNeeded: Timeout 30000ms exceeded.
    TimeoutError: locator.scrollIntoViewIfNeeded: Timeout 30000ms exceeded.
    TimeoutError: locator.scrollIntoViewIfNeeded: Timeout 30000ms exceeded.
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
  ✘   55 [chromium] › accessibility/button-hover-contrast.spec.js:9:3 › Button Hover State Accessibility › All button hover states maintain proper contrast (retry #2) (1.5m)
    Error: locator.isVisible: Target page, context or browser has been closed
    Error: expect(received).toHaveLength(expected)
    Error: locator.isVisible: Target page, context or browser has been closed
  ✘   96 [chromium] › test-articles.spec.js:30:5 › Articles Pages › Blockchain Badges - loads and displays correctly (6.5s)
  ✘   97 [chromium] › test-articles.spec.js:30:5 › Articles Pages › ESG Credits - loads and displays correctly (6.3s)
  ✘   98 [chromium] › test-articles.spec.js:30:5 › Articles Pages › Blockchain Badges - loads and displays correctly (retry #1) (7.5s)
  ✘   99 [chromium] › test-articles.spec.js:30:5 › Articles Pages › ESG Credits - loads and displays correctly (retry #1) (8.2s)
  ✘  100 [chromium] › test-articles.spec.js:30:5 › Articles Pages › Blockchain Badges - loads and displays correctly (retry #2) (6.8s)
    Error: expect(locator).toContainText(expected) failed
    Error: expect(locator).toContainText(expected) failed
    Error: expect(locator).toContainText(expected) failed
  ✘  101 [chromium] › test-articles.spec.js:30:5 › Articles Pages › ESG Credits - loads and displays correctly (retry #2) (6.3s)
    Error: expect(locator).toContainText(expected) failed
    Error: expect(locator).toContainText(expected) failed
    Error: expect(locator).toContainText(expected) failed
  ✘  102 [chromium] › test-articles.spec.js:30:5 › Articles Pages › Fan Game Cube - loads and displays correctly (6.2s)
  ✘  103 [chromium] › test-articles.spec.js:30:5 › Articles Pages › X Bot - loads and displays correctly (6.4s)
```
