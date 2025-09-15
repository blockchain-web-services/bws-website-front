# BWS Website

Production website for Blockchain Web Services, deployed at [www.bws.ninja](https://www.bws.ninja)

## 🏗️ Architecture

### Technology Stack
- **[Astro](https://astro.build)** - Static site generator
- **Astro Components** - Component-based templating system
- **GitHub Pages** - Hosting via `gh-pages` branch
- **GitHub Actions** - CI/CD pipeline
- **Playwright** - E2E testing framework

### Template System
The website uses Astro's component-based architecture:
- **Pages** (`src/pages/`) - Astro pages that define routes
- **Components** (`src/components/`) - Reusable Astro components for content sections
- **Layouts** (`src/layouts/`) - Base layouts that wrap pages
- **Public Assets** (`public/`) - Static files served directly (CSS, images, fonts)

## 📁 Project Structure

```
bws-website-front/
├── src/
│   ├── pages/                 # Astro pages (routes)
│   │   ├── index.astro        # Homepage
│   │   ├── about.astro        # About page
│   │   ├── industries.astro   # Industries page
│   │   ├── marketplace/       # Marketplace product pages
│   │   └── industry-content/  # Industry-specific pages
│   ├── components/            # Astro components
│   │   ├── Navigation.astro   # Main navigation
│   │   ├── Footer.astro       # Footer component
│   │   ├── Scripts.astro      # JavaScript includes
│   │   └── *MainContent.astro # Page-specific content components
│   └── layouts/               # Layout templates
│       └── BaseLayout.astro   # Main layout wrapper
├── public/                    # Static assets
│   ├── styles.css            # Consolidated CSS (from Webflow)
│   ├── CNAME                 # Custom domain configuration
│   └── assets/               # Images, fonts, JS files
├── tests/                    # Playwright test suite
│   ├── e2e/                  # End-to-end tests
│   ├── smoke/                # Production smoke tests
│   ├── visual/               # Visual regression tests
│   ├── performance/          # Performance tests
│   ├── accessibility/        # WCAG compliance tests
│   └── page-objects/         # Page Object Model classes
├── .github/workflows/        # GitHub Actions
│   ├── deploy.yml           # Main deployment pipeline
│   ├── rollback.yml         # Rollback workflow
│   └── monitor.yml          # Production monitoring
├── docs/                     # Documentation
│   └── GITHUB_PAGES_DEPLOYMENT.md
└── _site/                    # Build output (git-ignored)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation
```bash
# Clone repository
git clone [repository-url]
cd bws-website-front

# Install dependencies
npm install

# Install Playwright browsers for testing
npx playwright install chromium
```

### Development
```bash
# Start development server (http://localhost:8087)
npm run dev

# Build the site
npm run build

# Preview production build
npm run preview
```

## ✏️ Modifying the Website

### Important Rules (from CLAUDE.md)
1. **ALWAYS modify source templates** in `src/`, never edit `_site/` directly
2. **CSS is consolidated** in `/public/styles.css`
3. **Run build after changes**: `npm run build`
4. **Test before committing**: `npm test`

### Common Modifications

#### 1. Updating Page Content
Edit the corresponding component in `src/components/`:
```astro
<!-- src/components/IndexMainContent.astro -->
<section class="hero-section">
  <h1>Your New Content Here</h1>
</section>
```

#### 2. Adding a New Page
Create a new file in `src/pages/`:
```astro
---
// src/pages/new-page.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Navigation from '../components/Navigation.astro';
---

<BaseLayout title="New Page">
  <Navigation />
  <main>
    <h1>New Page Content</h1>
  </main>
</BaseLayout>
```

#### 3. Modifying Navigation
Edit `src/components/Navigation.astro` to update menu items.

#### 4. Updating Styles
Edit `/public/styles.css` - all styles are consolidated here.

## 🏗️ Build Process

### Local Build
```bash
# Build site to _site/ directory
npm run build

# This runs:
# 1. Astro build
# 2. HTML prettification
# 3. HTML/CSS validation
```

### Build Output
- Built files are generated in `_site/`
- CNAME file is automatically copied for custom domain
- All assets are optimized and bundled

## 🚢 Deployment

### Automatic Deployment (CI/CD)

The site automatically deploys via GitHub Actions when:
1. Code is pushed to `main` or `master` branch
2. Pull request is merged

#### Deployment Pipeline
1. **Test Phase** - Run all Playwright tests
2. **Build Phase** - Build Astro site
3. **Deploy Phase** - Push to `gh-pages` branch
4. **Validate Phase** - Run smoke tests on production

### Manual Deployment
```bash
# Trigger deployment manually via GitHub Actions
# Go to Actions tab → "Build, Test, and Deploy" → Run workflow
```

### Rollback Procedure
```bash
# Via GitHub Actions
# Go to Actions tab → "Rollback Deployment" → Run workflow
# Enter commit SHA or leave empty for previous version
```

## 🧪 Testing

### Test Structure
Tests use Playwright with Page Object Model pattern:
- **E2E Tests** - User journeys and workflows
- **Smoke Tests** - Critical path verification
- **Visual Tests** - Screenshot comparisons
- **Performance Tests** - Core Web Vitals
- **Accessibility Tests** - WCAG compliance

### Running Tests
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:smoke      # Quick smoke tests
npm run test:e2e        # End-to-end tests
npm run test:visual     # Visual regression
npm run test:a11y       # Accessibility
npm run test:perf       # Performance

# Interactive UI mode
npm run test:ui

# Debug mode
npm run test:debug
```

## 📊 Monitoring

### Production Monitoring
- **Automated checks** run every 6 hours
- **Health checks** verify site availability
- **Performance monitoring** tracks Core Web Vitals
- **SSL certificate** validation

### View Status
- Check GitHub Actions for monitoring results
- Automated issues created on failures

## 🌐 GitHub Pages Configuration

### Setup (One-time)
1. Go to **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** / **root**
4. Custom domain: **www.bws.ninja**
5. Enable **Enforce HTTPS**

### Custom Domain
- CNAME record points to GitHub Pages
- Automatically configured via `public/CNAME` file
- SSL certificate provided by GitHub

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production site |
| `npm run preview` | Preview built site |
| `npm test` | Run all tests |
| `npm run test:smoke` | Run smoke tests only |
| `npm run test:ui` | Open Playwright UI |
| `npm run validate` | Validate HTML syntax |
| `npm run pretty-print` | Format HTML/CSS files |

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Astro configuration |
| `tests/playwright.config.cjs` | Test configuration |
| `.github/workflows/deploy.yml` | Deployment pipeline |
| `public/CNAME` | Custom domain |
| `CLAUDE.md` | AI assistant guidelines |

## 📚 Documentation

- [Testing Guide](tests/README.md) - Complete testing documentation
- [Deployment Guide](docs/GITHUB_PAGES_DEPLOYMENT.md) - GitHub Pages setup
- [Astro Documentation](https://docs.astro.build) - Framework docs
- [Playwright Documentation](https://playwright.dev) - Testing framework

## 🤝 Contributing

1. Create feature branch from `main`
2. Make changes in `src/` files
3. Test locally: `npm test`
4. Build and verify: `npm run build`
5. Commit and push
6. Create pull request
7. Tests run automatically in CI
8. Merge after review and tests pass

## ⚠️ Important Notes

- **Never edit `_site/` directly** - changes will be lost on rebuild
- **Always test before pushing** - broken builds block deployment
- **Use pull requests** - direct pushes to main trigger deployment
- **Monitor after deployment** - check Actions tab for status

## 📞 Support

For issues or questions:
- Create an issue in this repository
- Check GitHub Actions for deployment status
- Review monitoring alerts for production issues

## 📄 License

MIT License - See LICENSE file for details