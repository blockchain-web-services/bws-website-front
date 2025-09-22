# BWS Website - GitHub Copilot Instructions

**CRITICAL**: Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

Bootstrap, build, and test the repository:

```bash
# Step 1: Install dependencies
npm install
# Takes ~51 seconds. NEVER CANCEL. Set timeout to 2+ minutes.

# Step 2: Install Playwright browsers (CRITICAL STEP!)
npx playwright install chromium
# OR if that fails:
npx playwright install --with-deps chromium
# Takes 2-10 minutes depending on network. NEVER CANCEL. Set timeout to 15+ minutes.

# Step 3: Build the site
npm run build
# Takes ~21 seconds. Includes Astro build + validation. NEVER CANCEL. Set timeout to 2+ minutes.

# Step 4: Run tests (MANDATORY when fixing test issues)
npm test
# Takes 5-15 minutes for full suite (86 tests). NEVER CANCEL. Set timeout to 30+ minutes.
# CRITICAL: When fixing test failures, you MUST run this and achieve 100% pass rate
```

## Essential Commands

### Development
```bash
# Start development server
npm run dev                 # Hot reload at http://localhost:4321
npm run start               # Alias for npm run dev

# Build production site
npm run build               # Full build with validation (~21 seconds)
npm run build:only          # Build without validation (~3 seconds)

# Preview built site
npm run preview             # Serve _site/ at http://localhost:4321
npm run preview:sirv        # Alternative preview server
```

### Testing (After Installing Browsers)
```bash
# Test setup (REQUIRED FIRST TIME)
npm run test:setup          # Install Chromium browser

# Run test suites
npm test                    # All tests (86 tests, ~15 minutes)
npm run test:smoke          # Quick smoke tests only (~2 minutes)
npm run test:e2e            # End-to-end tests (~5 minutes)
npm run test:a11y           # Accessibility tests (~3 minutes)
npm run test:perf           # Performance tests (~3 minutes)
npm run test:visual         # Visual regression tests (~5 minutes)

# Test debugging
npm run test:ui             # Open Playwright UI
npm run test:headed         # Run with visible browser
npm run test:debug          # Debug mode with inspector
npm run test:report         # View HTML test report
```

### Validation
```bash
# Code quality
npm run validate            # HTML syntax validation (~5 seconds)
npm run pretty-print        # Format HTML/CSS + validation (~10 seconds)
```

## Manual Validation Scenarios

After making any changes, ALWAYS test these scenarios:

1. **Build and Preview Test**: 
   ```bash
   npm run build && npm run preview
   # Visit http://localhost:4321 and verify:
   # - Homepage loads without errors
   # - Navigation works correctly
   # - Images display properly
   # - No console errors in browser devtools
   ```

2. **Mobile Responsive Test**:
   - Resize browser to mobile width (320px-479px)
   - Test tablet width (480px-767px) 
   - Verify all content remains accessible

3. **Key Page Functionality**:
   - Test contact form submission
   - Verify all navigation links work
   - Check marketplace pages load correctly
   - Confirm industry content displays properly

4. **Performance Check**:
   ```bash
   curl -I http://localhost:4321/
   # Should return HTTP/1.1 200 OK
   ```

## Common Issues and Solutions

### Browser Installation Failures
**Issue**: `npm run test:setup` fails with download errors
**Solutions**:
1. Try: `npx playwright install chromium`
2. If that fails: `npx playwright install --with-deps chromium`
3. Last resort: Skip tests and focus on build validation only

### Build Failures
**Issue**: `npm run build` fails
**Solutions**:
1. Clean build: `rm -rf _site && npm run build`
2. Check for template syntax errors in `src/` files
3. Verify all image references exist in `public/assets/`

### Test Environment Issues
**Issue**: Tests fail with "Executable doesn't exist"
**Solution**: Always run `npx playwright install chromium` after `npm install`

## File Structure and Key Locations

```
BWS Website Structure:
├── src/                     # Source templates (EDIT THESE)
│   ├── components/          # Reusable Astro components
│   ├── layouts/            # Page layouts (BaseLayout.astro)
│   └── pages/              # Page templates (generate HTML)
├── public/                 # Static assets (served directly)
│   ├── styles.css          # Main consolidated CSS
│   ├── assets/             # Images, fonts, JS files
│   └── CNAME               # Custom domain config
├── _site/                  # Generated output (DO NOT EDIT!)
├── tests/                  # Playwright test suite
│   ├── e2e/                # End-to-end user journey tests
│   ├── smoke/              # Production health checks
│   ├── accessibility/      # WCAG compliance tests
│   ├── performance/        # Core Web Vitals tests
│   └── visual/             # Screenshot comparisons
├── scripts/                # Build and maintenance scripts
├── .github/workflows/      # CI/CD pipelines
│   ├── deploy.yml          # Main deployment workflow
│   └── monitor.yml         # Production monitoring
└── docs/                   # Documentation
```

## Development Rules

1. **ALWAYS modify source templates** in `src/`, NEVER edit `_site/` directly
2. **CSS is consolidated** in `/public/styles.css` (single source of truth)
3. **Run build after changes**: `npm run build` to regenerate HTML
4. **Test before committing**: `npm test` (if browsers are installed)
5. **Use pull requests**: Direct pushes to main trigger immediate deployment

## CI/CD Integration

The repository uses GitHub Actions with these key behaviors:

- **On Pull Request**: All tests run automatically
- **On Push to Main**: Tests run, then deployment to https://www.bws.ninja
- **Failed Tests**: Automatically creates GitHub issues for fixes
- **Production Monitoring**: Smoke tests run every 6 hours

### Automated Test Fix Workflow
When assigned to a test failure issue:
1. The issue will contain specific test failures
2. You MUST fix ALL reported failures
3. You MUST run `npm test` to verify 100% pass rate
4. You MUST iterate if new failures appear
5. Only close the issue when ALL tests pass

## Build Timing Reference

| Command | Expected Time | Timeout Setting |
|---------|---------------|-----------------|
| `npm install` | ~51 seconds | 2+ minutes |
| `npx playwright install` | 2-10 minutes | 15+ minutes |  
| `npm run build` | ~21 seconds | 2+ minutes |
| `npm test` (full suite) | 5-15 minutes | 30+ minutes |
| `npm run test:smoke` | ~2 minutes | 5+ minutes |
| `npm run preview` | ~2 seconds | 30 seconds |

**CRITICAL**: NEVER CANCEL long-running commands. Always use the timeout settings above.

## Common Development Tasks

### Adding New Pages
1. Create template in `src/pages/new-page.astro`
2. Use existing layout: `import BaseLayout from '../layouts/BaseLayout.astro'`
3. Build: `npm run build`
4. Test: `npm run preview` and verify at http://localhost:4321/new-page

### Modifying Styles
1. Edit `/public/styles.css` (consolidated CSS)
2. Build: `npm run build` (prettifies CSS)
3. Test responsive: Resize browser to test breakpoints

### Fixing Test Failures

**CRITICAL REQUIREMENT**: When fixing test failures from GitHub issues, you MUST:
1. Fix the reported issues in `src/` files (never `_site/`)
2. Run `npm run build` to rebuild the site
3. Run `npm test` to verify ALL tests pass (not just the ones you fixed)
4. If any tests still fail, iterate and fix them until achieving 100% pass rate
5. ONLY mark the issue as resolved when ALL tests pass

**Step-by-step process**:
1. Install browsers: `npx playwright install chromium`
2. Understand the failure: Read error messages carefully
3. Fix issues in `src/` files (templates, components, layouts)
4. Rebuild: `npm run build`
5. **MANDATORY**: Run full test suite: `npm test`
6. If tests fail:
   - Analyze new failures
   - Fix additional issues
   - Rebuild and retest
   - Repeat until 100% pass rate
7. Only close issue when: `npm test` shows all tests passing

### Pre-Commit Checklist
- [ ] `npm run build` completes successfully
- [ ] `npm run preview` serves site without errors
- [ ] Manual test: Visit http://localhost:4321 and verify functionality
- [ ] **MANDATORY for test fixes**: `npm test` shows 100% pass rate (all tests passing)
- [ ] No console errors in browser devtools

### When Resolving Test Failure Issues
**DO NOT close the issue until:**
1. ✅ All originally reported failures are fixed
2. ✅ `npm test` runs completely with 0 failures
3. ✅ No new test failures have been introduced
4. ✅ The fix has been committed with appropriate message

**Iteration is expected**: If fixing one issue causes another test to fail, you must fix that too before marking the issue as resolved.

## Production URLs
- **Live Site**: https://www.bws.ninja
- **GitHub Pages**: https://blockchain-web-services.github.io/bws-website-front
- **Actions**: https://github.com/blockchain-web-services/bws-website-front/actions

## Additional Resources
- [Testing Guide](tests/README.md) - Complete testing documentation  
- [Deployment Guide](docs/GITHUB_PAGES_DEPLOYMENT.md) - GitHub Pages setup
- [Astro Documentation](https://docs.astro.build) - Framework reference