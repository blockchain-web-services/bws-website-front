# Testing Guide

## Overview

Comprehensive testing suite for BWS website using Playwright with Page Object Model (POM) pattern.

## Structure

```
tests/
├── playwright.config.ts      # Main Playwright configuration
├── e2e/                      # End-to-end user journey tests
├── smoke/                    # Quick production health checks
├── visual/                   # Visual regression tests
│   └── baselines/           # Baseline screenshots for comparison
├── performance/             # Performance and Core Web Vitals tests
├── accessibility/           # WCAG compliance and a11y tests
├── page-objects/            # Page Object Model classes
├── fixtures/                # Test data and mock responses
└── utils/                   # Helper functions and utilities
```

## Initial Setup

```bash
# Install test dependencies
cd tests
npm install

# Install Playwright browsers
npx playwright install chromium
```

## Running Tests

### Prerequisites
Tests require the site to be built first:
```bash
cd build
npm run build
```

### Running Tests

All test commands must be run from the `tests/` directory:

```bash
cd tests

# Run all tests
npm test

# Run tests in UI mode (interactive)
npm run test:ui

# Run specific test suites
npm run test:smoke      # Quick smoke tests
npm run test:visual     # Visual regression tests
npm run test:a11y       # Accessibility tests
npm run test:perf       # Performance tests
npm run test:e2e        # End-to-end tests

# Debug tests
npm run test:debug      # Debug mode with inspector
npm run test:headed     # Run in headed browser

# View test report
npm run test:report
```

### Preview Server

To run tests against local server:
```bash
cd tests
npm run preview:sirv
# Server runs at http://localhost:4321
```

### Command Line Options

```bash
# Run specific test file
npx playwright test tests/e2e/navigation.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run tests against production
PLAYWRIGHT_BASE_URL=https://www.bws.ninja npm test
```

## Writing Tests

### Using Page Object Model

The Page Object Model pattern separates page structure from test logic:

```typescript
// tests/page-objects/HomePage.ts
export class HomePage extends BasePage {
  readonly heroSection: Locator;

  constructor(page: Page) {
    super(page);
    this.heroSection = page.locator('.hero-section');
  }

  async isHeroVisible(): Promise<boolean> {
    return await this.heroSection.isVisible();
  }
}

// tests/e2e/homepage.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage';

test('Homepage hero is visible', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  const isVisible = await homePage.isHeroVisible();
  expect(isVisible).toBeTruthy();
});
```

### Test Organization

1. **E2E Tests** (`e2e/`): Complete user workflows
2. **Smoke Tests** (`smoke/`): Critical path verification
3. **Visual Tests** (`visual/`): Screenshot comparisons
4. **Performance Tests** (`performance/`): Core Web Vitals
5. **Accessibility Tests** (`accessibility/`): WCAG compliance

### Best Practices

1. **Independence**: Each test should be independent and not rely on others
2. **Idempotency**: Tests should produce the same result when run multiple times
3. **Descriptive Names**: Use clear, descriptive test names
4. **Page Objects**: Always use POM for page interactions
5. **Assertions**: Use meaningful assertions with clear error messages
6. **Waits**: Use proper waits instead of hard-coded timeouts
7. **Cleanup**: Clean up test data after tests complete

## Visual Testing

Visual regression tests compare screenshots against baselines:

```typescript
test('Visual regression - Homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
    maxDiffPixels: 100
  });
});
```

### Updating Baselines

When intentional visual changes are made:

```bash
# Update baseline screenshots
npx playwright test --update-snapshots

# Update specific test's baseline
npx playwright test tests/visual/homepage.spec.ts --update-snapshots
```

## Accessibility Testing

Tests use axe-core for WCAG compliance:

```typescript
import AxeBuilder from '@axe-core/playwright';

test('Homepage accessibility', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});
```

## Performance Testing

Monitor Core Web Vitals:

```typescript
test('Measure LCP', async ({ page }) => {
  await page.goto('/');
  const lcp = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        resolve(entries[entries.length - 1].startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
  });

  expect(Number(lcp)).toBeLessThan(2500); // Good LCP < 2.5s
});
```

## CI/CD Integration

Tests run automatically in GitHub Actions:

1. **On Pull Request**: All tests run to validate changes
2. **On Push to Main**: Tests run before deployment
3. **Post-Deployment**: Smoke tests verify production
4. **Scheduled**: Health checks run every 6 hours

## Debugging

### Local Debugging

```bash
# Debug mode with Playwright Inspector
npm run test:debug

# Run in headed mode to see browser
npm run test:headed

# Verbose output
DEBUG=pw:api npm test
```

### CI Debugging

- Test artifacts are uploaded to GitHub Actions
- Screenshots on failure help identify issues
- Videos available for failed tests
- Trace files for detailed debugging

## Test Data

Test data is stored in `tests/fixtures/`:

```typescript
import testData from '../fixtures/test-data.json';

test('Form submission', async ({ page }) => {
  const { validUser } = testData;
  // Use test data in tests
});
```

## Troubleshooting

### Common Issues

1. **Tests failing locally but passing in CI**
   - Check Node version matches CI (v20)
   - Clear Playwright cache: `npx playwright install --force`
   - Check for environment-specific issues

2. **Visual tests failing**
   - Different OS/browser versions can cause pixel differences
   - Update baselines if changes are intentional
   - Increase `maxDiffPixels` threshold if needed

3. **Timeout errors**
   - Increase timeout in config or specific test
   - Check for network issues
   - Ensure proper wait strategies

4. **Flaky tests**
   - Add proper waits for dynamic content
   - Use `waitForLoadState('networkidle')`
   - Check for race conditions

## Contributing

1. Write tests for new features
2. Update Page Objects when UI changes
3. Run tests locally before pushing
4. Update documentation for new patterns
5. Keep tests maintainable and readable

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Axe-core for Accessibility](https://github.com/dequelabs/axe-core)
- [Web Vitals](https://web.dev/vitals/)