# Development Guidelines for BWS Website

## Important Development Rules

### 1. Always Modify Templates, Never Generated Files
**CRITICAL**: When fixing issues with HTML or content, ALWAYS modify the source template files in the `src/` directory (e.g., `src/components/IndexMainContent.astro`, `src/layouts/BaseLayout.astro`), NEVER modify the generated HTML files in `_site/` or built output.

- ✅ CORRECT: Edit `src/components/IndexMainContent.astro` to fix image attributes
- ❌ WRONG: Edit `_site/index.html` directly
- ❌ WRONG: Edit any file in the `_site/` directory

The build process will regenerate all HTML files from the templates. Any direct edits to generated files will be lost on the next build.

### 2. CSS Organization
All CSS styles are consolidated in `/public/styles.css`. This unified file:
- Combines styles from multiple original Webflow CSS files
- Removes conflicting and redundant definitions
- Is served directly from the root path as `/styles.css`

### 3. Code Standards

#### Astro Components
- Use `.astro` files for all page templates and components
- Keep components small and focused on a single responsibility
- Use semantic HTML elements
- Maintain consistent naming conventions

#### File Naming
- Use kebab-case for file names: `index-main-content.astro`
- Use PascalCase for component names when imported
- Match URL structure with file structure in `src/pages/`

#### Image Assets
- Store all images in `/public/assets/images/`
- Use descriptive file names without spaces or special characters
- Optimize images before adding to the repository
- Reference images with absolute paths from root

### 4. Development Workflow

1. **Before Making Changes**
   - Pull latest changes from main branch
   - Review related documentation in `/docs/`
   - Check existing patterns in similar files

2. **During Development**
   - Work in feature branches
   - Test changes locally with development server
   - Ensure no console errors or warnings
   - Validate HTML and CSS syntax

3. **After Making Changes**
   - Build the site to verify no build errors
   - Run relevant tests
   - Update documentation if needed
   - Commit with clear, descriptive messages

### 5. Common Patterns

#### Adding a New Page
1. Create new file in `src/pages/`
2. Import and use `BaseLayout` component
3. Add navigation entry if needed
4. Test routing and navigation

#### Modifying Navigation
- Edit `src/components/Navigation.astro`
- Ensure all links are working
- Test mobile and desktop views

#### Updating Content
- Find the corresponding component in `src/components/`
- Edit the Astro component directly
- Never edit files in `_site/`

### 6. Troubleshooting

#### Build Failures
- Check for syntax errors in Astro files
- Verify all imports are correct
- Ensure no missing dependencies
- Clear `_site/` directory and rebuild

#### Style Issues
- All styles should be in `/public/styles.css`
- Check for CSS specificity conflicts
- Use browser DevTools to debug
- Verify styles aren't being overridden

#### Image Loading Issues
- Verify image paths are absolute from root
- Check file names don't contain spaces or special characters
- Ensure images exist in `/public/assets/images/`
- Verify image file extensions are correct

## Related Documentation

- [Architecture](./ARCHITECTURE.md) - System design and structure
- [Building](./BUILDING.md) - Build procedures
- [Testing](./TESTING.md) - Test procedures
- [Deployment](./GITHUB_PAGES_DEPLOYMENT.md) - Deployment process