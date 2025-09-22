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

# Step 4: Run tests (OPTIONAL - for validation only)
npm test
# Takes 5-15 minutes for full suite (86 tests). NEVER CANCEL. Set timeout to 30+ minutes.
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
1. Install browsers: `npx playwright install chromium`
2. Run specific test: `npm run test:smoke` (fastest feedback)
3. Debug: `npm run test:debug` or `npm run test:headed`
4. Fix issues in `src/` files (never `_site/`)
5. Rebuild: `npm run build`
6. Retest: `npm test`

### Pre-Commit Checklist
- [ ] `npm run build` completes successfully
- [ ] `npm run preview` serves site without errors
- [ ] Manual test: Visit http://localhost:4321 and verify functionality
- [ ] If browsers installed: `npm run test:smoke` passes
- [ ] No console errors in browser devtools

## Production URLs
- **Live Site**: https://www.bws.ninja
- **GitHub Pages**: https://blockchain-web-services.github.io/bws-website-front
- **Actions**: https://github.com/blockchain-web-services/bws-website-front/actions

## Additional Resources
- [Testing Guide](tests/README.md) - Complete testing documentation  
- [Deployment Guide](docs/GITHUB_PAGES_DEPLOYMENT.md) - GitHub Pages setup
- [CLAUDE.md](CLAUDE.md) - AI assistant specific guidelines
- [Astro Documentation](https://docs.astro.build) - Framework reference