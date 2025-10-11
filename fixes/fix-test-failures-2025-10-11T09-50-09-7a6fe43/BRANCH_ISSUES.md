# Test Failure Report

**Generated:** 2025-10-11 09:50:00 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18427650092)
**Commit:** 7a6fe43e239b8f38ec6379a20af632f8c418158d
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 151
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 845714.968ms

### Failed Tests

## Test Output Extract
```
  ✘   92 [chromium] › test-hidden-buttons.spec.js:4:3 › Hidden Buttons with w-condition-invisible › database-immutable Solution Website button should be hidden (6.7s)
  ✘   96 [chromium] › test-hidden-buttons.spec.js:4:3 › Hidden Buttons with w-condition-invisible › database-immutable Solution Website button should be hidden (retry #1) (7.7s)
  ✘   98 [chromium] › test-hidden-buttons.spec.js:4:3 › Hidden Buttons with w-condition-invisible › database-immutable Solution Website button should be hidden (retry #2) (6.0s)
    Error: expect(locator).toHaveCount(expected) failed
    Error: expect(locator).toHaveCount(expected) failed
    Error: expect(locator).toHaveCount(expected) failed
  ✘   97 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/blockchain-badges.html (31.2s)
  ✘   99 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/database-immutable.html (31.1s)
  ✘  100 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/blockchain-badges.html (retry #1) (33.0s)
  ✘  101 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/database-immutable.html (retry #1) (32.9s)
  ✘  102 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/blockchain-badges.html (retry #2) (31.1s)
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
  ✘  107 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/esg-credits.html (retry #1) (32.8s)
  ✘  108 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/database-mutable.html (retry #2) (31.1s)
    TimeoutError: locator.click: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 30000ms exceeded.
  ✘  109 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/esg-credits.html (retry #2) (31.1s)
    TimeoutError: locator.click: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 30000ms exceeded.
  ✘  110 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/ipfs-upload.html (31.1s)
  ✘  111 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/nft-gamecube.html (31.0s)
  ✘  112 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/ipfs-upload.html (retry #1) (33.0s)
  ✘  113 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/nft-gamecube.html (retry #1) (32.6s)
  ✘  114 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/ipfs-upload.html (retry #2) (31.1s)
    TimeoutError: locator.click: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 30000ms exceeded.
  ✘  115 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/nft-gamecube.html (retry #2) (31.1s)
    TimeoutError: locator.click: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 30000ms exceeded.
  ✘  116 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/nft-zeroknwoledge.html (31.0s)
  ✘  120 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/nft-zeroknwoledge.html (retry #1) (33.2s)
  ✘  123 [chromium] › test-zapier-forms.spec.js:16:5 › Zapier Forms on Marketplace Pages › Zapier form loads on /marketplace/nft-zeroknwoledge.html (retry #2) (31.0s)
    TimeoutError: locator.click: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 30000ms exceeded.
    TimeoutError: locator.click: Timeout 30000ms exceeded.
  ✘  124 [chromium] › tests/full-site-image-check.spec.js:39:3 › Full Site Image Check › should check ALL images across entire website (1.5m)
  ✘  128 [chromium] › tests/full-site-image-check.spec.js:39:3 › Full Site Image Check › should check ALL images across entire website (retry #1) (1.7m)
```
