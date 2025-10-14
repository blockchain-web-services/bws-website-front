# Test Failure Report

**Generated:** 2025-10-14 11:04:48 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18494137106)
**Commit:** adea16d6a6c34b99d46ed5e6ed246ebb1d7e822e
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 150
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 526474.857ms

### Failed Tests

## Test Output Extract
```
  ✘   95 [chromium] › tests/carousel-debug.spec.js:4:3 › Carousel Debug at Port 5500 › check carousel cards size and buttons (241ms)
  ✘   96 [chromium] › tests/carousel-debug.spec.js:4:3 › Carousel Debug at Port 5500 › check carousel cards size and buttons (retry #1) (491ms)
  ✘   97 [chromium] › tests/carousel-debug.spec.js:4:3 › Carousel Debug at Port 5500 › check carousel cards size and buttons (retry #2) (397ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
  ✘   98 [chromium] › tests/carousel-debug.spec.js:105:3 › Carousel Debug at Port 5500 › check CSS files loaded (326ms)
  ✘   99 [chromium] › tests/carousel-debug.spec.js:105:3 › Carousel Debug at Port 5500 › check CSS files loaded (retry #1) (473ms)
  ✘  100 [chromium] › tests/carousel-debug.spec.js:105:3 › Carousel Debug at Port 5500 › check CSS files loaded (retry #2) (340ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
  ✘  101 [chromium] › tests/carousel-debug.spec.js:132:3 › Carousel Debug at Port 5500 › check JavaScript files loaded (354ms)
  ✘  102 [chromium] › tests/carousel-debug.spec.js:132:3 › Carousel Debug at Port 5500 › check JavaScript files loaded (retry #1) (430ms)
  ✘  103 [chromium] › tests/carousel-debug.spec.js:132:3 › Carousel Debug at Port 5500 › check JavaScript files loaded (retry #2) (322ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
  ✘  104 [chromium] › tests/carousel-width-debug.spec.js:3:1 › debug announcement-box styles (345ms)
  ✘  105 [chromium] › tests/carousel-width-debug.spec.js:3:1 › debug announcement-box styles (retry #1) (629ms)
  ✘  106 [chromium] › tests/carousel-width-debug.spec.js:3:1 › debug announcement-box styles (retry #2) (469ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
  ✘  107 [chromium] › tests/check-all-assets.spec.js:6:3 › Comprehensive Asset Check › should find all broken images including background-images (13.9s)
  ✘  112 [chromium] › tests/check-all-assets.spec.js:6:3 › Comprehensive Asset Check › should find all broken images including background-images (retry #1) (15.5s)
  ✘  113 [chromium] › tests/check-all-assets.spec.js:6:3 › Comprehensive Asset Check › should find all broken images including background-images (retry #2) (13.2s)
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(received).toBe(expected) // Object.is equality
  ✘  114 [chromium] › tests/full-site-image-check.spec.js:39:3 › Full Site Image Check › should check ALL images across entire website (1.6m)
  ✘  120 [chromium] › tests/news-carousel.spec.js:8:3 › News Carousel with Swiper › carousel should be present and initialized (203ms)
  ✘  121 [chromium] › tests/news-carousel.spec.js:8:3 › News Carousel with Swiper › carousel should be present and initialized (retry #1) (392ms)
  ✘  122 [chromium] › tests/news-carousel.spec.js:8:3 › News Carousel with Swiper › carousel should be present and initialized (retry #2) (357ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
  ✘  123 [chromium] › tests/news-carousel.spec.js:28:3 › News Carousel with Swiper › first slide should be visible (357ms)
  ✘  124 [chromium] › tests/news-carousel.spec.js:28:3 › News Carousel with Swiper › first slide should be visible (retry #1) (369ms)
  ✘  125 [chromium] › tests/news-carousel.spec.js:28:3 › News Carousel with Swiper › first slide should be visible (retry #2) (322ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
  ✘  126 [chromium] › tests/news-carousel.spec.js:41:3 › News Carousel with Swiper › navigation arrows should be present (284ms)
  ✘  127 [chromium] › tests/news-carousel.spec.js:41:3 › News Carousel with Swiper › navigation arrows should be present (retry #1) (509ms)
  ✘  128 [chromium] › tests/news-carousel.spec.js:41:3 › News Carousel with Swiper › navigation arrows should be present (retry #2) (341ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
  ✘  129 [chromium] › tests/news-carousel.spec.js:52:3 › News Carousel with Swiper › clicking next arrow should change slide (278ms)
```
