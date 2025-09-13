# BWS Website - Static Site Generator

A production-ready static website for Blockchain Web Services (www.bws.ninja), migrated from Webflow to GitHub Pages using Eleventy.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation
```bash
# Clone the repository
git clone git@github.com:blockchain-web-services/bws-website-front.git
cd bws-website-front

# Install dependencies
npm install

# Install Playwright browsers for testing
npx playwright install chromium
```

### Development
```bash
# Start development server (http://localhost:8081)
npm start

# Watch for changes
npm run watch
```

## 🏗️ Architecture

Built with:
- **Eleventy (11ty)** - Static site generator
- **Nunjucks** - Templating engine
- **Playwright** - End-to-end testing
- **GitHub Pages** - Hosting platform

## 📁 Project Structure
```
bws-website-front/
├── src/                      # Source files
│   ├── _data/                # Global data files
│   │   ├── navigation.json   # Navigation structure
│   │   ├── site.json         # Site metadata
│   │   └── pages/            # Page-specific data
│   ├── _includes/            # Templates and partials
│   │   ├── layouts/          # Page layouts
│   │   └── partials/         # Reusable components
│   ├── assets/               # Static assets
│   │   ├── css/              # Stylesheets
│   │   ├── js/               # JavaScript files
│   │   └── images/           # Images and icons
│   └── pages/                # Content pages
├── scripts/                  # Build and utility scripts
│   ├── crawler/              # Web crawler tools
│   ├── data-generation/      # Data generation scripts
│   └── validation/           # Validation tools
├── tests/                    # Test suites
├── data/                     # Crawled data (git-ignored)
└── _site/                    # Generated output (git-ignored)
```

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:links      # Test link integrity
npm run test:seo        # Test SEO requirements
npm run test:a11y       # Test accessibility
npm run test:content    # Test content validation

# Run tests with UI
npm run test:headed

# Debug tests
npm run test:debug
```

### Test Coverage
- Link integrity (no broken links or orphan pages)
- SEO validation (meta tags, structured data)
- Accessibility (WCAG 2.1 AA compliance)
- Content validation (required elements)

## 🚢 Deployment

### Automatic Deployment (Recommended)
The site automatically deploys to GitHub Pages when you push to the `main` or `master` branch.

### Manual Deployment
```bash
# Deploy to GitHub Pages
npm run deploy
```

### Build Process
```bash
# Build the site
npm run build

# Test the production build locally
npm run deploy:test
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server on port 8081 |
| `npm run build` | Build production site |
| `npm run serve` | Serve site locally |
| `npm test` | Run all Playwright tests |
| `npm run crawl` | Crawl www.bws.ninja for content |
| `npm run generate-data` | Generate page data from crawl results |
| `npm run validate` | Validate crawled data |
| `npm run deploy` | Deploy to GitHub Pages |
| `npm run clean` | Clean build artifacts |

## 🔧 Configuration

### Site Configuration
Edit `src/_data/site.json`:
```json
{
  "name": "BWS",
  "url": "https://www.bws.ninja",
  "description": "Cutting-Edge Blockchain Solutions"
}
```

### Navigation
Edit `src/_data/navigation.json` to update menus.

### Environment Variables
Create `.env` for local development:
```env
ZAPIER_WEBHOOK_ID=your_webhook_id
GOOGLE_ANALYTICS_ID=your_ga_id
```

## 📝 Content Management

### Adding New Pages
1. Create a new `.njk` file in `src/pages/`
2. Add front matter with page metadata
3. Use an existing layout or create a new one
4. Update navigation in `src/_data/navigation.json`

### Templates
The site uses Nunjucks templates with these layouts:
- `base.njk` - Base layout with header/footer
- `homepage.njk` - Landing page layout
- `marketplace-solution.njk` - Product/solution pages
- `industry-content.njk` - Industry-specific pages
- `article.njk` - Blog/article pages
- `legal.njk` - Legal document pages
- `contact.njk` - Contact form page

### Content Migration
The crawler was used to migrate content from Webflow:
```bash
# Re-crawl the live site
npm run crawl

# Generate page data
npm run generate-data

# Validate results
npm run validate
```

## 🔌 Third-Party Integrations

### Active Integrations
- **Google Analytics** - Tracking code: `G-TKTH70X52B`
- **Google Tag Manager** - Container: `GTM-PVB2TL4X`
- **Zapier Webhooks** - For contact forms (when implemented)

### Removed Integrations
- **Pipedrive** - No longer in use, all code removed

## 🛠️ Troubleshooting

### Local Server Issues
```bash
# If port 8080 is in use, change it in package.json
"serve": "npx http-server . -p 3000 -c-1"
```

### Test Failures
```bash
# Clear test cache
rm -rf test-results/ playwright-report/

# Re-run tests
npm test
```

### Visual Test Updates
```bash
# Update snapshots after intentional changes
npm run test:update-snapshots
```

## 📚 Additional Resources
- [Playwright Documentation](https://playwright.dev)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Original Site](https://www.bws.ninja)

## 📄 License
MIT License - See LICENSE file for details

## 🤝 Contributing
1. Create a feature branch
2. Make your changes
3. Run tests: `npm test`
4. Submit a pull request
5. Tests will run automatically via GitHub Actions

## 📞 Support
For issues or questions, please open an issue in this repository.