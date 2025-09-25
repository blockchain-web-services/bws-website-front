# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BWS Website is a static site for Blockchain Web Services (www.bws.ninja) built with Astro. The project uses a unique folder structure where build tools and test suites are isolated in their own directories with separate dependencies.

## Critical Rules

1. **NEVER edit files in `_site/`** - This is build output. Always edit source files in `src/`
2. **All CSS is in `/public/styles.css`** - Single consolidated CSS file from Webflow migration
3. **No package.json in root** - Build tools in `build/`, tests in `tests/`

## Essential Commands

### Development
```bash
# Start dev server (http://localhost:8087)
cd build && npm run dev
```

### Building
```bash
# Full production build with validation
cd build && npm run build

# Build without validation (faster)
cd build && npm run build:only

# Clean build directory
cd build && node clean-build.js
```

### Testing
```bash
# Install test dependencies first
cd tests && npm install

# Run all tests
cd tests && npm test

# Run specific test suites
cd tests && npm run test:smoke    # Quick health checks
cd tests && npm run test:e2e      # End-to-end tests
cd tests && npm run test:visual   # Visual regression
cd tests && npm run test:a11y     # Accessibility

# Debug tests
cd tests && npm run test:ui       # Interactive UI mode
cd tests && npm run test:debug    # Debug with inspector

# Run preview server for testing
cd tests && npm run preview:sirv   # Serves at http://localhost:4321
```

### Single Test Execution
```bash
# Run specific test file
cd tests && npx playwright test tests/smoke/basic.spec.js

# Run test matching pattern
cd tests && npx playwright test -g "Homepage loads"
```

## Architecture

### Folder Structure
```
/
├── src/                    # Astro source files
│   ├── pages/             # Routes (URL = file path)
│   ├── components/        # Reusable components (*MainContent.astro pattern)
│   └── layouts/           # BaseLayout.astro wraps all pages
├── public/                # Static assets (served as-is)
│   ├── styles.css        # ALL styles (consolidated from Webflow)
│   └── assets/           # Images at /assets/images/[webflow-ids]/
├── build/                 # Build tools (separate npm ecosystem)
│   └── node_modules/     # Build-only dependencies
├── tests/                 # Test suite (separate npm ecosystem)
│   └── node_modules/     # Test-only dependencies
└── _site/                 # Build output (NEVER EDIT)
```

### Key Architectural Patterns

1. **Component Naming**: Each page has a corresponding `*MainContent.astro` component in `src/components/`
   - `index.astro` → `IndexMainContent.astro`
   - `about.astro` → `AboutMainContent.astro`

2. **Page Structure**: All pages follow this pattern:
   ```astro
   ---
   import BaseLayout from '../layouts/BaseLayout.astro';
   import Navigation from '../components/Navigation.astro';
   import [Page]MainContent from '../components/[Page]MainContent.astro';
   ---
   <BaseLayout title="...">
     <Navigation />
     <[Page]MainContent />
   </BaseLayout>
   ```

3. **Image References**: Images use Webflow's ID-based paths:
   - Path: `/assets/images/[webflow-collection-id]/[image-id]_[name].[ext]`
   - Example: `/assets/images/6474d385cfec71cb21a92251/670f82f9b05322735f72cbcc_PROOF-logo.png`

4. **CSS Organization**:
   - Single file: `/public/styles.css`
   - Contains all Webflow classes (e.g., `.w-container`, `.hero-section`)
   - Custom fixes for specific images (`.image-assure`, `.image-proof`)

## Common Tasks

### Adding a New Page
1. Create `src/pages/new-page.astro`
2. Create `src/components/NewPageMainContent.astro`
3. Import BaseLayout and Navigation
4. Add to Navigation component if needed

### Fixing Image Display Issues
- Check `/public/styles.css` for image-specific classes
- Images are in `/public/assets/images/`
- Use absolute paths from root in HTML

### Modifying Navigation
Edit `src/components/Navigation.astro` - shared across all pages

### Build Failures
```bash
cd build
rm -rf node_modules
npm install
node clean-build.js
npm run build
```

### Test Failures
- Ensure site is built first: `cd build && npm run build`
- Check preview server: `cd tests && npm run preview:sirv`
- Install Playwright browsers: `cd tests && npx playwright install chromium`

## Documentation

All detailed documentation is in `/docs/`:
- `OVERVIEW.md` - Documentation index
- `ARCHITECTURE.md` - System design details
- `BUILDING.md` - Build procedures
- `TESTING.md` - Test procedures
- `DEVELOPMENT_GUIDELINES.md` - Code standards
- `GITHUB_PAGES_DEPLOYMENT.md` - Deployment
- `GITHUB_ACTIONS.md` - CI/CD workflows

## GitHub Actions

Workflows automatically:
- Test on PR (must pass to merge)
- Build and deploy to gh-pages on push to main
- Run smoke tests every 6 hours on production

## Special Considerations

1. **Astro Config**: Must remain in root (`astro.config.mjs`)
2. **Dev Port**: Development runs on 8087, preview on 4321
3. **Webflow Migration**: Many classes and IDs are from original Webflow export
4. **No Root Package.json**: This is intentional - keeps root clean

## Testing Philosophy

**IMPORTANT: Never mock or create placeholder data to make tests pass!**
- When tests fail (especially 404 errors), fix the root cause properly
- Research missing assets from the live site at www.bws.ninja
- Download and add actual images/assets rather than creating placeholders
- If something is broken, stop and fix it correctly rather than working around it
- Test failures are valuable signals - address them properly