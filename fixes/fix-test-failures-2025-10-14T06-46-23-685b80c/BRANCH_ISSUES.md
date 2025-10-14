# Test Failure Report

**Generated:** 2025-10-14 06:46:08 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18487731821)
**Commit:** 685b80cec6e4c0e1566e0a96e87f4d545cd67d9e
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 151
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 503783.06ms

### Failed Tests

## Test Output Extract
```
  ✘   95 [chromium] › tests/carousel-debug.spec.js:4:3 › Carousel Debug at Port 5500 › check carousel cards size and buttons (353ms)
  ✘   96 [chromium] › tests/carousel-debug.spec.js:105:3 › Carousel Debug at Port 5500 › check CSS files loaded (314ms)
  ✘   97 [chromium] › tests/carousel-debug.spec.js:4:3 › Carousel Debug at Port 5500 › check carousel cards size and buttons (retry #1) (447ms)
  ✘   98 [chromium] › tests/carousel-debug.spec.js:105:3 › Carousel Debug at Port 5500 › check CSS files loaded (retry #1) (529ms)
  ✘   99 [chromium] › tests/carousel-debug.spec.js:4:3 › Carousel Debug at Port 5500 › check carousel cards size and buttons (retry #2) (441ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
  ✘  100 [chromium] › tests/carousel-debug.spec.js:105:3 › Carousel Debug at Port 5500 › check CSS files loaded (retry #2) (502ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
  ✘  101 [chromium] › tests/carousel-debug.spec.js:132:3 › Carousel Debug at Port 5500 › check JavaScript files loaded (451ms)
  ✘  102 [chromium] › tests/carousel-width-debug.spec.js:3:1 › debug announcement-box styles (403ms)
  ✘  103 [chromium] › tests/carousel-debug.spec.js:132:3 › Carousel Debug at Port 5500 › check JavaScript files loaded (retry #1) (521ms)
  ✘  104 [chromium] › tests/carousel-width-debug.spec.js:3:1 › debug announcement-box styles (retry #1) (495ms)
  ✘  105 [chromium] › tests/carousel-debug.spec.js:132:3 › Carousel Debug at Port 5500 › check JavaScript files loaded (retry #2) (383ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
  ✘  106 [chromium] › tests/carousel-width-debug.spec.js:3:1 › debug announcement-box styles (retry #2) (439ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
  ✘  112 [chromium] › tests/full-site-image-check.spec.js:39:3 › Full Site Image Check › should check ALL images across entire website (1.6m)
  ✘  118 [chromium] › tests/news-carousel.spec.js:8:3 › News Carousel with Swiper › carousel should be present and initialized (232ms)
  ✘  119 [chromium] › tests/news-carousel.spec.js:8:3 › News Carousel with Swiper › carousel should be present and initialized (retry #1) (394ms)
  ✘  120 [chromium] › tests/news-carousel.spec.js:8:3 › News Carousel with Swiper › carousel should be present and initialized (retry #2) (324ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
  ✘  121 [chromium] › tests/news-carousel.spec.js:28:3 › News Carousel with Swiper › first slide should be visible (398ms)
  ✘  122 [chromium] › tests/news-carousel.spec.js:28:3 › News Carousel with Swiper › first slide should be visible (retry #1) (296ms)
  ✘  123 [chromium] › tests/news-carousel.spec.js:28:3 › News Carousel with Swiper › first slide should be visible (retry #2) (355ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
  ✘  124 [chromium] › tests/news-carousel.spec.js:41:3 › News Carousel with Swiper › navigation arrows should be present (328ms)
  ✘  125 [chromium] › tests/news-carousel.spec.js:41:3 › News Carousel with Swiper › navigation arrows should be present (retry #1) (304ms)
  ✘  126 [chromium] › tests/news-carousel.spec.js:41:3 › News Carousel with Swiper › navigation arrows should be present (retry #2) (344ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
  ✘  127 [chromium] › tests/news-carousel.spec.js:52:3 › News Carousel with Swiper › clicking next arrow should change slide (290ms)
  ✘  128 [chromium] › tests/news-carousel.spec.js:52:3 › News Carousel with Swiper › clicking next arrow should change slide (retry #1) (288ms)
  ✘  129 [chromium] › tests/news-carousel.spec.js:52:3 › News Carousel with Swiper › clicking next arrow should change slide (retry #2) (456ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
  ✘  130 [chromium] › tests/news-carousel.spec.js:71:3 › News Carousel with Swiper › partnership cards should have backgrounds (462ms)
```
