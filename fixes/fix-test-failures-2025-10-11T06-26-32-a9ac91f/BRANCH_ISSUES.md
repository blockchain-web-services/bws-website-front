# Test Failure Report

**Generated:** 2025-10-11 06:26:19 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18425573025)
**Commit:** a9ac91fe2fe4425c8b340c214c56f9b9721ca701
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 142
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 338593.119ms

### Failed Tests

## Test Output Extract
```
  ✘   18 [chromium] › debug-token-image.spec.js:4:3 › Token Allocation Image Centering Debug › Check token allocation image centering and size (377ms)
  ✘   19 [chromium] › debug-token-image.spec.js:4:3 › Token Allocation Image Centering Debug › Check token allocation image centering and size (retry #1) (586ms)
  ✘   21 [chromium] › debug-token-image.spec.js:4:3 › Token Allocation Image Centering Debug › Check token allocation image centering and size (retry #2) (480ms)
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/white-paper.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/white-paper.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/white-paper.html
  ✘   63 [chromium] › smoke/critical-paths.spec.js:90:3 › Critical Path Smoke Tests › White Paper page has required content (1.9s)
  ✘   66 [chromium] › smoke/critical-paths.spec.js:90:3 › Critical Path Smoke Tests › White Paper page has required content (retry #1) (3.2s)
  ✘   70 [chromium] › smoke/critical-paths.spec.js:90:3 › Critical Path Smoke Tests › White Paper page has required content (retry #2) (1.9s)
    Error: expect.toBeVisible: Error: strict mode violation: locator('text=Abstract') resolved to 2 elements:
    Error: expect.toBeVisible: Error: strict mode violation: locator('text=Abstract') resolved to 2 elements:
    Error: expect.toBeVisible: Error: strict mode violation: locator('text=Abstract') resolved to 2 elements:
  ✘  118 [smoke] › smoke/critical-paths.spec.js:90:3 › Critical Path Smoke Tests › White Paper page has required content (1.1s)
  ✘  119 [smoke] › smoke/critical-paths.spec.js:90:3 › Critical Path Smoke Tests › White Paper page has required content (retry #1) (2.9s)
  ✘  122 [smoke] › smoke/critical-paths.spec.js:90:3 › Critical Path Smoke Tests › White Paper page has required content (retry #2) (2.0s)
    Error: expect.toBeVisible: Error: strict mode violation: locator('text=Abstract') resolved to 2 elements:
    Error: expect.toBeVisible: Error: strict mode violation: locator('text=Abstract') resolved to 2 elements:
    Error: expect.toBeVisible: Error: strict mode violation: locator('text=Abstract') resolved to 2 elements:
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/white-paper.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/white-paper.html
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5500/white-paper.html
    Error: expect.toBeVisible: Error: strict mode violation: locator('text=Abstract') resolved to 2 elements:
    Error: expect.toBeVisible: Error: strict mode violation: locator('text=Abstract') resolved to 2 elements:
    Error: expect.toBeVisible: Error: strict mode violation: locator('text=Abstract') resolved to 2 elements:
    Error: expect.toBeVisible: Error: strict mode violation: locator('text=Abstract') resolved to 2 elements:
    Error: expect.toBeVisible: Error: strict mode violation: locator('text=Abstract') resolved to 2 elements:
    Error: expect.toBeVisible: Error: strict mode violation: locator('text=Abstract') resolved to 2 elements:
```
