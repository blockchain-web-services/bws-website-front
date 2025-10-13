# Test Failure Report

**Generated:** 2025-10-13 20:17:55 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18476962333)
**Commit:** e6e0bc120904d0a0be96b083ca65f207d766c979
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 151
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 498406.419ms

### Failed Tests

## Test Output Extract
```
  ✘   96 [chromium] › tests/carousel-debug.spec.js:105:3 › Carousel Debug at Port 5500 › check CSS files loaded (213ms)
  ✘   95 [chromium] › tests/carousel-debug.spec.js:4:3 › Carousel Debug at Port 5500 › check carousel cards size and buttons (260ms)
  ✘   98 [chromium] › tests/carousel-debug.spec.js:4:3 › Carousel Debug at Port 5500 › check carousel cards size and buttons (retry #1) (476ms)
  ✘   97 [chromium] › tests/carousel-debug.spec.js:105:3 › Carousel Debug at Port 5500 › check CSS files loaded (retry #1) (601ms)
  ✘   99 [chromium] › tests/carousel-debug.spec.js:4:3 › Carousel Debug at Port 5500 › check carousel cards size and buttons (retry #2) (363ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
  ✘  100 [chromium] › tests/carousel-debug.spec.js:105:3 › Carousel Debug at Port 5500 › check CSS files loaded (retry #2) (331ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
  ✘  101 [chromium] › tests/carousel-debug.spec.js:132:3 › Carousel Debug at Port 5500 › check JavaScript files loaded (370ms)
  ✘  102 [chromium] › tests/carousel-width-debug.spec.js:3:1 › debug announcement-box styles (326ms)
  ✘  103 [chromium] › tests/carousel-debug.spec.js:132:3 › Carousel Debug at Port 5500 › check JavaScript files loaded (retry #1) (520ms)
  ✘  104 [chromium] › tests/carousel-width-debug.spec.js:3:1 › debug announcement-box styles (retry #1) (429ms)
  ✘  105 [chromium] › tests/carousel-debug.spec.js:132:3 › Carousel Debug at Port 5500 › check JavaScript files loaded (retry #2) (388ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
  ✘  106 [chromium] › tests/carousel-width-debug.spec.js:3:1 › debug announcement-box styles (retry #2) (319ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/index.html
  ✘  112 [chromium] › tests/full-site-image-check.spec.js:39:3 › Full Site Image Check › should check ALL images across entire website (1.6m)
  ✘  118 [chromium] › tests/news-carousel.spec.js:8:3 › News Carousel with Swiper › carousel should be present and initialized (281ms)
  ✘  119 [chromium] › tests/news-carousel.spec.js:8:3 › News Carousel with Swiper › carousel should be present and initialized (retry #1) (390ms)
  ✘  120 [chromium] › tests/news-carousel.spec.js:8:3 › News Carousel with Swiper › carousel should be present and initialized (retry #2) (263ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
  ✘  121 [chromium] › tests/news-carousel.spec.js:28:3 › News Carousel with Swiper › first slide should be visible (448ms)
  ✘  122 [chromium] › tests/news-carousel.spec.js:28:3 › News Carousel with Swiper › first slide should be visible (retry #1) (359ms)
  ✘  123 [chromium] › tests/news-carousel.spec.js:28:3 › News Carousel with Swiper › first slide should be visible (retry #2) (389ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
  ✘  124 [chromium] › tests/news-carousel.spec.js:41:3 › News Carousel with Swiper › navigation arrows should be present (383ms)
  ✘  125 [chromium] › tests/news-carousel.spec.js:41:3 › News Carousel with Swiper › navigation arrows should be present (retry #1) (296ms)
  ✘  126 [chromium] › tests/news-carousel.spec.js:41:3 › News Carousel with Swiper › navigation arrows should be present (retry #2) (267ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
  ✘  127 [chromium] › tests/news-carousel.spec.js:52:3 › News Carousel with Swiper › clicking next arrow should change slide (290ms)
  ✘  128 [chromium] › tests/news-carousel.spec.js:52:3 › News Carousel with Swiper › clicking next arrow should change slide (retry #1) (298ms)
  ✘  129 [chromium] › tests/news-carousel.spec.js:52:3 › News Carousel with Swiper › clicking next arrow should change slide (retry #2) (435ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:41501/
  ✘  130 [chromium] › tests/news-carousel.spec.js:71:3 › News Carousel with Swiper › partnership cards should have backgrounds (270ms)
```
