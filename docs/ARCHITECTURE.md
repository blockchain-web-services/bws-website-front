# Architecture

## Technology Stack

### Core Technologies
- **[Astro](https://astro.build)** - Static site generator with component islands architecture
- **Astro Components** - Component-based templating system using `.astro` files
- **HTML5 & CSS3** - Modern web standards for structure and styling
- **JavaScript** - Client-side interactivity and animations

### Infrastructure
- **GitHub Pages** - Static site hosting via `gh-pages` branch
- **GitHub Actions** - CI/CD pipeline for automated testing and deployment
- **Playwright** - End-to-end testing framework with cross-browser support
- **Node.js** - Build tooling and development environment

## Project Structure

```
bws-website-front/
├── src/                       # Source code
│   ├── pages/                 # Astro pages (routes)
│   │   ├── index.astro        # Homepage
│   │   ├── about.astro        # About page
│   │   ├── industries.astro   # Industries overview
│   │   ├── marketplace/       # Marketplace product pages
│   │   └── industry-content/  # Industry-specific pages
│   ├── components/            # Reusable Astro components
│   │   ├── Navigation.astro   # Main navigation
│   │   ├── Footer.astro       # Footer component
│   │   ├── Scripts.astro      # JavaScript includes
│   │   └── *MainContent.astro # Page-specific content
│   └── layouts/               # Page layouts
│       └── BaseLayout.astro   # Main layout wrapper
├── public/                    # Static assets (served as-is)
│   ├── styles.css            # Consolidated CSS (from Webflow)
│   ├── CNAME                 # Custom domain configuration
│   └── assets/               # Images, fonts, JS files
│       ├── images/           # All image assets
│       ├── fonts/            # Web fonts
│       └── js/               # JavaScript libraries
├── build/                    # Build tools (isolated)
│   ├── node_modules/         # Build dependencies
│   ├── package.json          # Build scripts and deps
│   ├── utilities/            # One-time utility scripts
│   └── *.js                  # Build and validation scripts
├── tests/                    # Test suite (isolated)
│   ├── node_modules/         # Test dependencies
│   ├── package.json          # Test configuration
│   ├── playwright.config.cjs # Playwright configuration
│   ├── e2e/                  # End-to-end tests
│   ├── smoke/                # Production smoke tests
│   ├── visual/               # Visual regression tests
│   ├── performance/          # Performance tests
│   ├── accessibility/        # WCAG compliance tests
│   └── page-objects/         # Page Object Model classes
├── docs/                     # Documentation
├── .github/                  # GitHub configuration
│   └── workflows/            # CI/CD workflows
├── _site/                    # Build output (generated)
└── astro.config.mjs          # Astro configuration
```

## Design Principles

### Component Architecture
- **Component Islands**: Astro's partial hydration for optimal performance
- **Static First**: Generate static HTML at build time
- **Progressive Enhancement**: JavaScript enhances but isn't required
- **Separation of Concerns**: Clear boundaries between source, build, and tests

### Folder Organization
- **Root Cleanliness**: No package.json or node_modules in root
- **Isolated Dependencies**: Build and test have separate dependency trees
- **Source Clarity**: All source code in `src/` and `public/`
- **Generated Separation**: Build output clearly marked as `_site/`

## Build Architecture

### Build Pipeline
1. **Source Files** (`src/`) → Astro processes templates
2. **Static Assets** (`public/`) → Copied directly to output
3. **Build Output** (`_site/`) → Complete static website

### CSS Architecture
- Single consolidated CSS file (`/public/styles.css`)
- Migrated from Webflow with optimizations
- Served directly without processing
- All styles in one place for maintainability

## Deployment Architecture

### GitHub Pages Setup
- **Source Branch**: `main` or `master`
- **Deployment Branch**: `gh-pages`
- **Custom Domain**: www.bws.ninja (via CNAME)
- **SSL**: Provided automatically by GitHub Pages

### CI/CD Pipeline
1. **Push to main** → Triggers GitHub Actions
2. **Test Job** → Runs Playwright test suite
3. **Build Job** → Creates production build
4. **Deploy Job** → Pushes to gh-pages branch
5. **Validate Job** → Smoke tests on production

## Performance Considerations

### Static Site Benefits
- No server-side processing required
- CDN distribution via GitHub Pages
- Optimal caching strategies
- Minimal JavaScript footprint

### Optimization Strategies
- Image optimization before commit
- CSS consolidation and minification
- HTML prettification for consistency
- Lazy loading for below-fold content

## Security Considerations

### Static Security
- No server-side vulnerabilities
- No database or dynamic content risks
- HTTPS enforced via GitHub Pages
- No user data processing

### Development Security
- Dependencies isolated in subfolders
- No secrets in repository
- Public repository transparency
- Automated security updates via Dependabot