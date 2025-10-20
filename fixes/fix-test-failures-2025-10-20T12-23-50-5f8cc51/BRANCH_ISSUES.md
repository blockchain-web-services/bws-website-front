# Test Failure Report

**Generated:** 2025-10-20 12:23:40 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18651688713)
**Commit:** 5f8cc515b776c494569d763cdaf940e97b00e1b8
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 160
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 327553.602ms

### Failed Tests

## Test Output Extract
```
  ✘  111 [chromium] › tests/news-carousel.spec.js:8:3 › News Carousel with Swiper › carousel should be present and initialized (3.3s)
  ✘  112 [chromium] › tests/news-carousel.spec.js:8:3 › News Carousel with Swiper › carousel should be present and initialized (retry #1) (5.9s)
  ✘  113 [chromium] › tests/news-carousel.spec.js:8:3 › News Carousel with Swiper › carousel should be present and initialized (retry #2) (3.4s)
    Error: expect.toBeVisible: Error: strict mode violation: locator('.swiper-wrapper') resolved to 2 elements:
    Error: expect.toBeVisible: Error: strict mode violation: locator('.swiper-wrapper') resolved to 2 elements:
    Error: expect.toBeVisible: Error: strict mode violation: locator('.swiper-wrapper') resolved to 2 elements:
  ✘  119 [chromium] › tests/news-carousel.spec.js:121:3 › News Carousel with Swiper › announcement text should have fixed height (3.0s)
  ✘  120 [chromium] › tests/news-carousel.spec.js:121:3 › News Carousel with Swiper › announcement text should have fixed height (retry #1) (5.2s)
  ✘  121 [chromium] › tests/news-carousel.spec.js:121:3 › News Carousel with Swiper › announcement text should have fixed height (retry #2) (3.2s)
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect.toBeVisible: Error: strict mode violation: locator('.swiper-wrapper') resolved to 2 elements:
    Error: expect.toBeVisible: Error: strict mode violation: locator('.swiper-wrapper') resolved to 2 elements:
    Error: expect.toBeVisible: Error: strict mode violation: locator('.swiper-wrapper') resolved to 2 elements:
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(received).toBe(expected) // Object.is equality
```
