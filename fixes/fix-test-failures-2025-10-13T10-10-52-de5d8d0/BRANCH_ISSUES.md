# Test Failure Report

**Generated:** 2025-10-13 10:10:38 UTC
**Workflow Run:** [View Run](https://github.com/blockchain-web-services/bws-website-front/actions/runs/18462135916)
**Commit:** de5d8d01a93020f7ae58ce89071786610a2c09ed
**Branch:** master

## Test Results Summary
Processing test results...
### Statistics
- **Total Tests:** 149
- **Passed:** ✅ null
- **Failed:** ❌ null
- **Duration:** 403752.158ms

### Failed Tests

## Test Output Extract
```
  ✘   57 [chromium] › smoke/critical-paths.spec.js:14:3 › Critical Path Smoke Tests › Critical CSS and JS files load (3.4s)
  ✘   59 [chromium] › smoke/critical-paths.spec.js:14:3 › Critical Path Smoke Tests › Critical CSS and JS files load (retry #1) (6.2s)
  ✘   64 [chromium] › smoke/critical-paths.spec.js:14:3 › Critical Path Smoke Tests › Critical CSS and JS files load (retry #2) (3.1s)
    Error: expect(received).toHaveLength(expected)
    Error: expect(received).toHaveLength(expected)
    Error: expect(received).toHaveLength(expected)
  ✘   97 [chromium] › tests/check-all-assets.spec.js:6:3 › Comprehensive Asset Check › should find all broken images including background-images (14.7s)
  ✘  102 [chromium] › tests/check-all-assets.spec.js:6:3 › Comprehensive Asset Check › should find all broken images including background-images (retry #1) (16.7s)
  ✘  103 [chromium] › tests/check-all-assets.spec.js:6:3 › Comprehensive Asset Check › should find all broken images including background-images (retry #2) (13.6s)
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(received).toBe(expected) // Object.is equality
    Error: expect(received).toBe(expected) // Object.is equality
  ✘  121 [smoke] › smoke/critical-paths.spec.js:14:3 › Critical Path Smoke Tests › Critical CSS and JS files load (3.3s)
  ✘  123 [smoke] › smoke/critical-paths.spec.js:14:3 › Critical Path Smoke Tests › Critical CSS and JS files load (retry #1) (5.6s)
  ✘  127 [smoke] › smoke/critical-paths.spec.js:14:3 › Critical Path Smoke Tests › Critical CSS and JS files load (retry #2) (3.4s)
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
