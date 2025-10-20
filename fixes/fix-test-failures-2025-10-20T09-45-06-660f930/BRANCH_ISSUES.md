# Test Failure Report

**Generated:** 2025-10-20 09:44:56 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18647632918)
**Commit:** 660f9305d0a1c11237fa5eda7fb090330072a21c
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 160
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 726001.13ms

### Failed Tests

## Test Output Extract
```
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
  ✘    1 [chromium] › accessibility/button-hover-contrast.spec.js:9:3 › Button Hover State Accessibility › All button hover states maintain proper contrast (1.5m)
    recoverFromStepError: [AsyncFunction: recoverFromStepError],
      message: 'TimeoutError: locator.hover: Timeout 30000ms exceeded.\n' +
      stack: 'TimeoutError: locator.hover: Timeout 30000ms exceeded.\n' +
    recoverFromStepError: [AsyncFunction: recoverFromStepError],
      message: 'TimeoutError: locator.hover: Timeout 30000ms exceeded.\n' +
      stack: 'TimeoutError: locator.hover: Timeout 30000ms exceeded.\n' +
  ✘   53 [chromium] › roadmap-cards.spec.js:74:3 › Roadmap Card Text Visibility › Visual snapshot of entire roadmap section (32.0s)
  ✘   33 [chromium] › accessibility/button-hover-contrast.spec.js:9:3 › Button Hover State Accessibility › All button hover states maintain proper contrast (retry #1) (1.6m)
  ✘   54 [chromium] › roadmap-cards.spec.js:74:3 › Roadmap Card Text Visibility › Visual snapshot of entire roadmap section (retry #1) (35.9s)
  ✘   56 [chromium] › roadmap-cards.spec.js:74:3 › Roadmap Card Text Visibility › Visual snapshot of entire roadmap section (retry #2) (32.3s)
    TimeoutError: locator.scrollIntoViewIfNeeded: Timeout 30000ms exceeded.
    TimeoutError: locator.scrollIntoViewIfNeeded: Timeout 30000ms exceeded.
    TimeoutError: locator.scrollIntoViewIfNeeded: Timeout 30000ms exceeded.
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
  ✘   98 [chromium] › test-articles.spec.js:30:5 › Articles Pages › Fan Game Cube - loads and displays correctly (6.9s)
  ✘  105 [chromium] › tests/carousel-debug.spec.js:4:3 › Carousel Debug › check carousel cards size and buttons (5.8s)
  ✘  103 [chromium] › test-articles.spec.js:30:5 › Articles Pages › Fan Game Cube - loads and displays correctly (retry #1) (8.1s)
  ✘  107 [chromium] › test-articles.spec.js:30:5 › Articles Pages › Fan Game Cube - loads and displays correctly (retry #2) (7.4s)
    Error: expect(locator).toContainText(expected) failed
    Error: expect(locator).toContainText(expected) failed
    Error: expect(locator).toContainText(expected) failed
  ✘  106 [chromium] › tests/carousel-debug.spec.js:4:3 › Carousel Debug › check carousel cards size and buttons (retry #1) (8.6s)
  ✘  109 [chromium] › tests/carousel-debug.spec.js:4:3 › Carousel Debug › check carousel cards size and buttons (retry #2) (6.4s)
    Error: locator.isVisible: Error: strict mode violation: locator('.swiper-button-next') resolved to 2 elements:
    Error: locator.isVisible: Error: strict mode violation: locator('.swiper-button-next') resolved to 2 elements:
    Error: locator.isVisible: Error: strict mode violation: locator('.swiper-button-next') resolved to 2 elements:
  ✘  117 [chromium] › tests/full-site-image-check.spec.js:39:3 › Full Site Image Check › should check ALL images across entire website (1.7m)
  ✘  123 [chromium] › tests/news-carousel.spec.js:8:3 › News Carousel with Swiper › carousel should be present and initialized (3.6s)
```
