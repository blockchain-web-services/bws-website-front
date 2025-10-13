# Test Failure Report

**Generated:** 2025-10-13 10:29:40 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18462595775)
**Commit:** 509bc32d504b9b74c2772cf73d38d350537e9031
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 149
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 401850.602ms

### Failed Tests

## Test Output Extract
```
  ✘   57 [chromium] › smoke/critical-paths.spec.js:14:3 › Critical Path Smoke Tests › Critical CSS and JS files load (3.2s)
  ✘   59 [chromium] › smoke/critical-paths.spec.js:14:3 › Critical Path Smoke Tests › Critical CSS and JS files load (retry #1) (5.5s)
  ✘   64 [chromium] › smoke/critical-paths.spec.js:14:3 › Critical Path Smoke Tests › Critical CSS and JS files load (retry #2) (3.4s)
    Error: expect(received).toHaveLength(expected)
    Error: expect(received).toHaveLength(expected)
    Error: expect(received).toHaveLength(expected)
  ✘   97 [chromium] › tests/check-all-assets.spec.js:6:3 › Comprehensive Asset Check › should find all broken images including background-images (15.1s)
  ✘  102 [chromium] › tests/check-all-assets.spec.js:6:3 › Comprehensive Asset Check › should find all broken images including background-images (retry #1) (16.1s)
  ✘  103 [chromium] › tests/check-all-assets.spec.js:6:3 › Comprehensive Asset Check › should find all broken images including background-images (retry #2) (13.3s)
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(received).toBe(expected) // Object.is equality
  ✘  121 [smoke] › smoke/critical-paths.spec.js:14:3 › Critical Path Smoke Tests › Critical CSS and JS files load (3.4s)
  ✘  123 [smoke] › smoke/critical-paths.spec.js:14:3 › Critical Path Smoke Tests › Critical CSS and JS files load (retry #1) (5.5s)
  ✘  126 [smoke] › smoke/critical-paths.spec.js:14:3 › Critical Path Smoke Tests › Critical CSS and JS files load (retry #2) (3.5s)
    Error: expect(received).toHaveLength(expected)
    Error: expect(received).toHaveLength(expected)
    Error: expect(received).toHaveLength(expected)
    Error: expect(received).toHaveLength(expected)
    Error: expect(received).toHaveLength(expected)
    Error: expect(received).toHaveLength(expected)
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(received).toHaveLength(expected)
    Error: expect(received).toHaveLength(expected)
    Error: expect(received).toHaveLength(expected)
```
