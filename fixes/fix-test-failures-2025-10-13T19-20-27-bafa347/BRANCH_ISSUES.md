# Test Failure Report

**Generated:** 2025-10-13 19:20:15 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18475839582)
**Commit:** bafa34768d479f7e7bca4f5dd57071001d6fbe2a
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 152
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 414110.22400000005ms

### Failed Tests

## Test Output Extract
```
  ✘   95 [chromium] › tests/carousel-debug.spec.js:4:3 › Carousel Debug at Port 5500 › check carousel cards size and buttons (329ms)
  ✘   96 [chromium] › tests/carousel-debug.spec.js:4:3 › Carousel Debug at Port 5500 › check carousel cards size and buttons (retry #1) (477ms)
  ✘   97 [chromium] › tests/carousel-debug.spec.js:4:3 › Carousel Debug at Port 5500 › check carousel cards size and buttons (retry #2) (724ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
  ✘   99 [chromium] › tests/carousel-debug.spec.js:132:3 › Carousel Debug at Port 5500 › check JavaScript files loaded (385ms)
  ✘   98 [chromium] › tests/carousel-debug.spec.js:105:3 › Carousel Debug at Port 5500 › check CSS files loaded (388ms)
  ✘  100 [chromium] › tests/carousel-debug.spec.js:132:3 › Carousel Debug at Port 5500 › check JavaScript files loaded (retry #1) (616ms)
  ✘  101 [chromium] › tests/carousel-debug.spec.js:105:3 › Carousel Debug at Port 5500 › check CSS files loaded (retry #1) (481ms)
  ✘  102 [chromium] › tests/carousel-debug.spec.js:132:3 › Carousel Debug at Port 5500 › check JavaScript files loaded (retry #2) (444ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
  ✘  103 [chromium] › tests/carousel-debug.spec.js:105:3 › Carousel Debug at Port 5500 › check CSS files loaded (retry #2) (450ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
  ✘  104 [chromium] › tests/carousel-width-debug.spec.js:3:1 › debug announcement-box styles (498ms)
  ✘  106 [chromium] › tests/carousel-width-debug.spec.js:3:1 › debug announcement-box styles (retry #1) (705ms)
  ✘  107 [chromium] › tests/carousel-width-debug.spec.js:3:1 › debug announcement-box styles (retry #2) (455ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
  ✘  117 [chromium] › tests/news-carousel.spec.js:8:3 › News Carousel with Swiper › carousel should be present and initialized (317ms)
  ✘  118 [chromium] › tests/news-carousel.spec.js:8:3 › News Carousel with Swiper › carousel should be present and initialized (retry #1) (303ms)
  ✘  119 [chromium] › tests/news-carousel.spec.js:8:3 › News Carousel with Swiper › carousel should be present and initialized (retry #2) (202ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
  ✘  120 [chromium] › tests/news-carousel.spec.js:28:3 › News Carousel with Swiper › first slide should be visible (248ms)
  ✘  121 [chromium] › tests/news-carousel.spec.js:28:3 › News Carousel with Swiper › first slide should be visible (retry #1) (321ms)
  ✘  122 [chromium] › tests/news-carousel.spec.js:28:3 › News Carousel with Swiper › first slide should be visible (retry #2) (321ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
  ✘  123 [chromium] › tests/news-carousel.spec.js:41:3 › News Carousel with Swiper › navigation arrows should be present (212ms)
  ✘  124 [chromium] › tests/news-carousel.spec.js:41:3 › News Carousel with Swiper › navigation arrows should be present (retry #1) (267ms)
  ✘  125 [chromium] › tests/news-carousel.spec.js:41:3 › News Carousel with Swiper › navigation arrows should be present (retry #2) (226ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
  ✘  126 [chromium] › tests/news-carousel.spec.js:52:3 › News Carousel with Swiper › clicking next arrow should change slide (485ms)
  ✘  127 [chromium] › tests/news-carousel.spec.js:52:3 › News Carousel with Swiper › clicking next arrow should change slide (retry #1) (309ms)
  ✘  128 [chromium] › tests/news-carousel.spec.js:52:3 › News Carousel with Swiper › clicking next arrow should change slide (retry #2) (209ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
  ✘  129 [chromium] › tests/news-carousel.spec.js:71:3 › News Carousel with Swiper › partnership cards should have backgrounds (226ms)
  ✘  130 [chromium] › tests/news-carousel.spec.js:71:3 › News Carousel with Swiper › partnership cards should have backgrounds (retry #1) (318ms)
```
