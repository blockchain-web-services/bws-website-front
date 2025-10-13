# Test Failure Report

**Generated:** 2025-10-12 21:38:08 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18449657649)
**Commit:** 8cde9e8e86eb9a960146502a7b50a5d48a6228e8
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 151
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 852239.252ms

### Failed Tests

## Test Output Extract
```
  ✘   92 [chromium] › test-hidden-buttons.spec.js:4:3 › Hidden Buttons with w-condition-invisible › database-immutable Solution Website button should be hidden (6.8s)
  ✘   96 [chromium] › test-hidden-buttons.spec.js:4:3 › Hidden Buttons with w-condition-invisible › database-immutable Solution Website button should be hidden (retry #1) (7.6s)
  ✘   98 [chromium] › test-hidden-buttons.spec.js:4:3 › Hidden Buttons with w-condition-invisible › database-immutable Solution Website button should be hidden (retry #2) (6.1s)
    Error: expect(locator).toHaveCount(expected) failed
    Error: expect(locator).toHaveCount(expected) failed
    Error: expect(locator).toHaveCount(expected) failed
  ✘   97 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/blockchain-badges.html (31.0s)
  ✘   99 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/database-immutable.html (31.2s)
  ✘  100 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/blockchain-badges.html (retry #1) (32.6s)
  ✘  101 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/database-immutable.html (retry #1) (32.6s)
  ✘  102 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/blockchain-badges.html (retry #2) (31.3s)
    TimeoutError: locator.click: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 30000ms exceeded.
  ✘  103 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/database-immutable.html (retry #2) (31.0s)
    TimeoutError: locator.click: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 30000ms exceeded.
  ✘  104 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/database-mutable.html (31.0s)
  ✘  105 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/esg-credits.html (31.1s)
  ✘  106 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/database-mutable.html (retry #1) (32.7s)
  ✘  107 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/esg-credits.html (retry #1) (32.9s)
  ✘  108 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/database-mutable.html (retry #2) (31.7s)
    TimeoutError: locator.click: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 30000ms exceeded.
  ✘  109 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/esg-credits.html (retry #2) (31.0s)
    TimeoutError: locator.click: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 30000ms exceeded.
  ✘  110 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/ipfs-upload.html (31.1s)
  ✘  111 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/nft-gamecube.html (31.3s)
  ✘  112 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/ipfs-upload.html (retry #1) (32.7s)
  ✘  113 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/nft-gamecube.html (retry #1) (32.8s)
  ✘  114 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/ipfs-upload.html (retry #2) (31.3s)
    TimeoutError: locator.click: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 30000ms exceeded.
  ✘  115 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/nft-gamecube.html (retry #2) (31.1s)
    TimeoutError: locator.click: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 30000ms exceeded.
  ✘  116 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/nft-zeroknwoledge.html (31.3s)
  ✘  120 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/nft-zeroknwoledge.html (retry #1) (33.3s)
  ✘  123 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/nft-zeroknwoledge.html (retry #2) (31.2s)
    TimeoutError: locator.click: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 30000ms exceeded.
  ✘  124 [chromium] › tests/full-site-image-check.spec.js:39:3 › Full Site Image Check › should check ALL images across entire website (1.5m)
  ✘  128 [chromium] › tests/full-site-image-check.spec.js:39:3 › Full Site Image Check › should check ALL images across entire website (retry #1) (1.7m)
```
