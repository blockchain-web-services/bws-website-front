# Claude Code Guidelines for BWS Website

## ⚠️ PRIORITY: Check Issue Type First!

**Quick Check**: Does the issue have labels `single-test`, `automated`, or `Claude-Fix-Attempt` in the title?
- **YES** → Follow the CI FIX section below only (5 steps)
- **NO** → Skip to Normal Development Instructions

### IF THIS IS AN AUTOMATED CI FIX (Issue has 'single-test' or 'automated' label):

**FOLLOW THESE SPECIAL RULES - IGNORE ALL OTHER SECTIONS:**

1. **SKIP ALL SETUP**: No npm install, no build, no test commands needed
2. **FIX ONLY**: Read the error in the issue and fix the specific file
3. **COMMIT DIRECTLY**:
   ```bash
   git add -A
   git commit -m "Fixed: [issue description]

   Claude-Fix-Attempt

   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```
4. **PUSH TO MASTER**:
   ```bash
   git push origin HEAD:master
   ```
5. **UPDATE ISSUE**:
   ```bash
   gh issue comment [issue-number] --body "✅ Fixed and pushed to master"
   gh issue close [issue-number]
   ```

**DO NOT follow the normal development instructions below for CI fixes!**

---

## Normal Development Instructions (NOT for automated CI fixes)

### 1. Always Modify Templates, Never Generated Files
**CRITICAL**: When fixing issues with HTML or content, ALWAYS modify the source template files in the `src/` directory (e.g., `src/components/IndexMainContent.astro`, `src/layouts/BaseLayout.astro`), NEVER modify the generated HTML files in `_site/` or built output.

- ✅ CORRECT: Edit `src/components/IndexMainContent.astro` to fix image attributes
- ❌ WRONG: Edit `_site/index.html` directly
- ❌ WRONG: Edit any file in the `_site/` directory

The build process (`npm run build`) will regenerate all HTML files from the templates. Any direct edits to generated files will be lost on the next build.

### 2. CSS Organization
All CSS styles are consolidated in `/public/styles.css`. This unified file:
- Combines styles from multiple original Webflow CSS files
- Removes conflicting and redundant definitions
- Is served directly from the root path as `/styles.css`

### 3. Build Process (Normal Development Only)
**Only for regular development work**: After making changes, rebuild the website by running `npm run build` to ensure changes are applied to the generated files.

⚠️ **NEVER run build for automated CI fix issues** - the site builds automatically after merge.

The build process includes automatic prettification and validation:
- `npm run build` - Build site, prettify HTML/CSS, and validate syntax
- `npm run build:only` - Build site without prettification/validation
- `npm run postbuild` - Run prettification and validation separately
- `npm run pretty-print` - Prettify and validate HTML/CSS files
- `npm run validate` - Validate HTML syntax only

Build workflow:
1. Astro builds the site to `_site/` directory
2. HTML files are prettified with Prettier
3. CSS files are prettified (except minified files)
4. HTML and CSS are validated for syntax errors
5. Results are saved to `pretty-print-validation-results.json`

### 4. Testing Environment Setup (Normal Development Only)

⚠️ **SKIP THIS ENTIRE SECTION FOR AUTOMATED CI FIXES** - tests already ran!

**For normal development**: Before running any tests, you MUST set up the Playwright environment properly:

#### Initial Setup (REQUIRED FIRST TIME):
```bash
# Step 1: Install dependencies
npm install

# Step 2: Install Playwright browsers - THIS IS REQUIRED!
npm run test:setup
# Alternative commands if the above doesn't work:
npx playwright install chromium
# Or with system dependencies (if needed in CI):
npx playwright install --with-deps chromium

# Step 3: Build the site before testing
npm run build
```

#### Running Tests:
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:a11y      # Accessibility tests
npm run test:e2e       # End-to-end tests
npm run test:smoke     # Smoke tests
npm run test:assets    # Asset loading tests
npm run test:visibility # Image visibility tests

# Run with UI (for debugging)
npm run test:ui

# Run headed (see browser)
npm run test:headed
```

#### Common Test Issues and Solutions:

**Issue 1: "Executable doesn't exist at /home/runner/.cache/ms-playwright/"**
- **Cause**: Playwright browsers are not installed
- **Solution**: Run `npx playwright install chromium`
- **In CI**: May need `npx playwright install --with-deps chromium`

**Issue 2: "browserType.launch: Executable doesn't exist"**
- **Cause**: Playwright was just installed/updated but browsers weren't
- **Solution**: Always run `npx playwright install chromium` after npm install

**Issue 3: Tests fail with "net::ERR_CONNECTION_REFUSED"**
- **Cause**: Dev server not running
- **Solution**: The test config starts server automatically, but ensure port 4321 is free

**Issue 4: "Error: This command requires approval"**
- **Cause**: GitHub Actions security restriction
- **Solution**: Use the exact commands listed above, they should be pre-approved

#### Test Execution Order for CI Fixes:
When fixing test failures in CI, ALWAYS follow this sequence:
1. `npm install` - Install all dependencies
2. `npx playwright install chromium` - Install browser (CRITICAL STEP!)
3. `npm run build` - Build the site to `_site/` directory
4. `npm test` - Run tests to verify current state
5. Make fixes to source files in `src/`
6. `npm run build` - Rebuild after changes
7. `npm test` - Verify fixes worked
8. Commit with message including "Claude-Fix-Attempt"

**Note**: Tests are located in the `tests/` folder and use Playwright framework.

### 5. File Structure
- `/src/` - Source templates and components (Astro files)
- `/public/` - Static assets served directly (CSS, images, JS)
- `/_site/` - Generated output from build (DO NOT EDIT)
- `/tests/` - Playwright test files