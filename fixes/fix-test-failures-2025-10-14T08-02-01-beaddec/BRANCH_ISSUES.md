# Test Failure Report

**Generated:** 2025-10-14 08:01:48 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18489411416)
**Commit:** beaddec6101760175c642dfc1fd45e9637f379ec
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 151
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 513791.86000000004ms

### Failed Tests

## Test Output Extract
```
  ✘   95 [chromium] › tests/carousel-debug.spec.js:4:3 › Carousel Debug at Port 5500 › check carousel cards size and buttons (279ms)
  ✘   96 [chromium] › tests/carousel-debug.spec.js:105:3 › Carousel Debug at Port 5500 › check CSS files loaded (220ms)
  ✘   97 [chromium] › tests/carousel-debug.spec.js:4:3 › Carousel Debug at Port 5500 › check carousel cards size and buttons (retry #1) (473ms)
  ✘   98 [chromium] › tests/carousel-debug.spec.js:105:3 › Carousel Debug at Port 5500 › check CSS files loaded (retry #1) (403ms)
  ✘   99 [chromium] › tests/carousel-debug.spec.js:4:3 › Carousel Debug at Port 5500 › check carousel cards size and buttons (retry #2) (375ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
  ✘  100 [chromium] › tests/carousel-debug.spec.js:105:3 › Carousel Debug at Port 5500 › check CSS files loaded (retry #2) (330ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
  ✘  101 [chromium] › tests/carousel-debug.spec.js:132:3 › Carousel Debug at Port 5500 › check JavaScript files loaded (372ms)
  ✘  102 [chromium] › tests/carousel-width-debug.spec.js:3:1 › debug announcement-box styles (304ms)
  ✘  103 [chromium] › tests/carousel-debug.spec.js:132:3 › Carousel Debug at Port 5500 › check JavaScript files loaded (retry #1) (434ms)
  ✘  104 [chromium] › tests/carousel-width-debug.spec.js:3:1 › debug announcement-box styles (retry #1) (393ms)
  ✘  105 [chromium] › tests/carousel-debug.spec.js:132:3 › Carousel Debug at Port 5500 › check JavaScript files loaded (retry #2) (363ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
  ✘  106 [chromium] › tests/carousel-width-debug.spec.js:3:1 › debug announcement-box styles (retry #2) (311ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
  ✘  112 [chromium] › tests/full-site-image-check.spec.js:39:3 › Full Site Image Check › should check ALL images across entire website (1.6m)
  ✘  118 [chromium] › tests/news-carousel.spec.js:8:3 › News Carousel with Swiper › carousel should be present and initialized (246ms)
  ✘  119 [chromium] › tests/news-carousel.spec.js:8:3 › News Carousel with Swiper › carousel should be present and initialized (retry #1) (400ms)
  ✘  120 [chromium] › tests/news-carousel.spec.js:8:3 › News Carousel with Swiper › carousel should be present and initialized (retry #2) (338ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
  ✘  121 [chromium] › tests/news-carousel.spec.js:28:3 › News Carousel with Swiper › first slide should be visible (260ms)
  ✘  122 [chromium] › tests/news-carousel.spec.js:28:3 › News Carousel with Swiper › first slide should be visible (retry #1) (365ms)
  ✘  123 [chromium] › tests/news-carousel.spec.js:28:3 › News Carousel with Swiper › first slide should be visible (retry #2) (297ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
  ✘  124 [chromium] › tests/news-carousel.spec.js:41:3 › News Carousel with Swiper › navigation arrows should be present (214ms)
  ✘  125 [chromium] › tests/news-carousel.spec.js:41:3 › News Carousel with Swiper › navigation arrows should be present (retry #1) (517ms)
  ✘  126 [chromium] › tests/news-carousel.spec.js:41:3 › News Carousel with Swiper › navigation arrows should be present (retry #2) (261ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
  ✘  127 [chromium] › tests/news-carousel.spec.js:52:3 › News Carousel with Swiper › clicking next arrow should change slide (270ms)
  ✘  128 [chromium] › tests/news-carousel.spec.js:52:3 › News Carousel with Swiper › clicking next arrow should change slide (retry #1) (477ms)
  ✘  129 [chromium] › tests/news-carousel.spec.js:52:3 › News Carousel with Swiper › clicking next arrow should change slide (retry #2) (305ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
  ✘  130 [chromium] › tests/news-carousel.spec.js:71:3 › News Carousel with Swiper › partnership cards should have backgrounds (304ms)
```
