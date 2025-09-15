# Claude Code Guidelines for BWS Website

## Important Rules

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

### 3. Build Process
**IMPORTANT**: After making any changes as a result of a user request, always rebuild the website by running `npm run build` to ensure changes are applied to the generated files.

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

### 4. Testing
Run tests after making changes:
- `npm run test` - Run all Playwright tests
- `npm run test:ui` - Run tests with UI interface
- `npm run test:assets` - Test asset loading
- `npm run test:visibility` - Test image visibility
- Tests are located in the `tests/` folder

### 4. File Structure
- `/src/` - Source templates and components (Astro files)
- `/public/` - Static assets served directly (CSS, images, JS)
- `/_site/` - Generated output from build (DO NOT EDIT)
- `/tests/` - Playwright test files