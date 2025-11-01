---
description: Create a new page with components and tests
---

# Create a New Page

Create a new page for the BWS Website following established patterns and best practices.

## Instructions

You are tasked with creating a new page for the BWS Website. Follow these steps carefully:

### 1. Gather Page Information

Ask the user for:
- **Page name** (e.g., "pricing", "team", "services")
- **Page title** (for `<title>` tag and metadata)
- **Page description** (for meta description and SEO)
- **Page content** (HTML structure or requirements)
- **Should it be added to navigation?** (yes/no, and where)

### 2. Create the Page File

Create the page at `src/pages/[page-name].astro` following this pattern:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Navigation from "../components/Navigation.astro";
import [PageName]MainContent from "../components/[PageName]MainContent.astro";
import Footer from "../components/Footer.astro";
import Scripts from "../components/Scripts.astro";

const pageTitle = "[Your Page Title]";
const pageDescription = "[Your page description for SEO]";
---

<BaseLayout title={pageTitle} description={pageDescription}>
  <Navigation />
  <[PageName]MainContent />
  <Footer />

  <Fragment slot="scripts">
    <Scripts />
  </Fragment>
</BaseLayout>
```

**Important naming conventions:**
- Page file: lowercase with hyphens (e.g., `contact-us.astro`)
- Component: PascalCase with "MainContent" suffix (e.g., `ContactUsMainContent.astro`)
- Convert hyphens to PascalCase: `contact-us` → `ContactUsMainContent`

### 3. Create the MainContent Component

Create the component at `src/components/[PageName]MainContent.astro`:

```astro
---
// Main content for [page-name] page
---

<main class="section" role="main">
  <div class="landing-page-content w-container">
    <!-- Your page content here -->
    <h1 class="title">[Your Page Title]</h1>
    <div class="paragraph">
      [Your content here]
    </div>
  </div>
</main>
```

**CSS Classes to use:**
- `.section` - Main section wrapper
- `.landing-page-content` - Content container
- `.w-container` - Webflow container
- `.title` - Main headings
- `.paragraph` - Text content
- `.button-primary` - Primary CTA buttons
- `.button-secondary` - Secondary buttons

Refer to existing components like `IndexMainContent.astro` or `aboutMainContent.astro` for more complex layouts.

### 4. Add to Navigation (if needed)

If the page should appear in navigation, edit `src/components/Navigation.astro`:

**For main navigation links:**
Add to the `.nav-menu` section around line 144

**For dropdown menus:**
Add to the appropriate `w-dropdown-list` section (Solutions, Developers, Resources, or Company)

Example:
```astro
<li class="menu-list-item">
  <a href="/[page-name].html" class="small-top-menu-item w-inline-block">
    <div class="top-menu-icon-wrapper"><div class="top-menu-icon"></div></div>
    <div class="top-menu-option-text-wrapper">
      <div class="menu-option-tittle">[Page Title]</div>
      <div class="menu-option-text">[Brief description]</div>
    </div>
  </a>
</li>
```

### 5. Build and Test Locally

Run the build to verify the page works:

```bash
npm run build
```

Check for any build errors and fix them before proceeding.

### 6. Create Tests

Create comprehensive tests for the new page in the `tests/` directory:

#### A. Basic Smoke Test

Add to `tests/smoke/basic.spec.js`:

```javascript
test('[PageName] page loads successfully', async ({ page }) => {
  const response = await page.goto('/[page-name].html');
  expect(response?.status()).toBeLessThan(400);
  await expect(page.locator('h1')).toBeVisible();
});
```

#### B. Critical Path Test

Add to `tests/smoke/critical-paths.spec.js`:

```javascript
test('[PageName] has required content', async ({ page }) => {
  await page.goto('/[page-name].html');

  // Check critical elements
  await expect(page.locator('.title').first()).toBeVisible();
  await expect(page.locator('.nav-menu')).toBeVisible();

  // Check for specific content
  const heading = await page.locator('h1').first().textContent();
  expect(heading).toContain('[Expected heading text]');
});
```

#### C. Navigation Test (if added to nav)

Add to `tests/e2e/navigation.spec.js`:

```javascript
test('Navigate to [PageName] from navigation menu', async ({ page }) => {
  await page.goto('/');

  // Click navigation link
  await page.click('text=[Page Link Text]');

  // Verify navigation
  await expect(page).toHaveURL(/.*[page-name].html/);
  await expect(page.locator('h1')).toBeVisible();
});
```

#### D. Image Tests (if page has images)

Add to `tests/image-visibility.spec.js` following existing patterns:

```javascript
test.describe('[PageName] images', () => {
  test('All images load correctly', async ({ page }) => {
    await page.goto('/[page-name].html');

    const images = await page.locator('img').all();
    for (const img of images) {
      const src = await img.getAttribute('src');
      expect(src).toBeTruthy();

      // Verify image loads
      const naturalWidth = await img.evaluate(el => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});
```

### 7. Run All Tests

Execute the full test suite to ensure nothing broke:

```bash
cd tests && npm test
```

Fix any test failures before completing the task.

### 8. Final Checklist

Before marking the task complete, verify:

- [ ] Page file created in `src/pages/`
- [ ] MainContent component created in `src/components/`
- [ ] Naming convention followed (lowercase page, PascalCase component)
- [ ] Page title and description set
- [ ] Added to navigation (if required)
- [ ] Build completes without errors (`npm run build`)
- [ ] Smoke tests added and passing
- [ ] Critical path tests added and passing
- [ ] Navigation tests added (if applicable)
- [ ] Image tests added (if page has images)
- [ ] All existing tests still passing
- [ ] Page displays correctly in browser

## Testing Commands Reference

```bash
# Full test suite
cd tests && npm test

# Specific test suites
cd tests && npm run test:smoke      # Quick health checks
cd tests && npm run test:e2e        # End-to-end tests
cd tests && npm run test:a11y       # Accessibility tests

# Single test file
cd tests && npx playwright test tests/smoke/basic.spec.js

# Interactive debugging
cd tests && npm run test:ui         # Visual test runner
cd tests && npm run test:debug      # Debug mode
```

## Common Patterns and Examples

### Simple Content Page (like About)
- Single section with text content
- See: `src/pages/about.astro` and `src/components/aboutMainContent.astro`

### Complex Content Page (like Index)
- Multiple sections with cards, images, videos
- See: `src/pages/index.astro` and `src/components/IndexMainContent.astro`

### Marketplace Solution Page
- Product showcase with features and pricing
- See: `src/pages/marketplace/esg-credits.astro`

### Industry Content Page
- Industry-specific solutions and use cases
- See: `src/pages/industry-content/financial-services.astro`

## Important Reminders

1. **Never edit `_site/`** - This is build output. Always edit source files in `src/`
2. **All CSS is in `/public/styles.css`** - Use existing Webflow classes
3. **Images go in `/public/assets/images/`** - Use absolute paths from root
4. **Test philosophy**: Never mock or create placeholder data. Fix issues properly.
5. **Build before testing**: Always run `npm run build` before running tests

## Getting Help

- Read `CLAUDE.md` in the project root for detailed architecture
- Check `/docs/` directory for comprehensive documentation
- Look at existing pages for patterns and examples
- Run `npm run dev` to test locally at http://localhost:8087
