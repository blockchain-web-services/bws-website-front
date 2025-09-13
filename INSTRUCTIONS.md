# BWS Website Build Instructions

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

## Building the Site

### Development Build

For development with live reload:
```bash
npm run serve
```
This will:
- Start a local development server (usually at http://localhost:8080)
- Watch for file changes
- Automatically rebuild and refresh the browser

### Production Build

To build the site for production:
```bash
npm run build
```
Or directly with Eleventy:
```bash
npx @11ty/eleventy
```

This will:
- Generate static HTML files in the `_site` directory
- Process all templates and data files
- Copy static assets to the output directory

### Quick Build (No Console Output)

For a quiet build without console logs:
```bash
npx @11ty/eleventy --quiet
```

## Project Structure

```
bws-website-front/
├── src/                      # Source files
│   ├── _data/               # Global data files (JSON)
│   │   ├── navigation.json # Site navigation structure
│   │   └── site.json       # Site-wide configuration
│   ├── _includes/          # Templates and components
│   │   ├── layouts/        # Page layout templates
│   │   │   ├── base.njk   # Base template (header/footer)
│   │   │   ├── default.njk # Standard page template
│   │   │   ├── landing.njk # Marketing page template
│   │   │   ├── content.njk # Article/blog template
│   │   │   └── product.njk # Product/solution template
│   │   ├── partials/       # Reusable partial templates
│   │   │   ├── header.njk # Site header
│   │   │   ├── footer.njk # Site footer
│   │   │   └── breadcrumbs.njk # Breadcrumb navigation
│   │   └── components/     # Reusable components
│   │       ├── sections/   # Section components
│   │       └── cards/      # Card components
│   ├── assets/             # Static assets
│   │   ├── css/           # Stylesheets
│   │   ├── js/            # JavaScript files
│   │   └── images/        # Images
│   ├── marketplace/        # Product/solution pages
│   ├── industry-content/   # Industry-specific pages
│   └── articles/          # Blog/article pages
├── _site/                   # Output directory (generated)
├── .eleventy.js            # Eleventy configuration
└── package.json            # Node.js dependencies

```

## Template System

### Using Templates

Each page uses a layout template specified in its front matter:

```yaml
---
layout: layouts/default.njk
title: Page Title
description: Page description
---
```

### Available Templates

1. **default.njk** - Standard content pages
2. **landing.njk** - Marketing/promotional pages with hero sections
3. **content.njk** - Articles/blog posts with metadata
4. **product.njk** - Product pages with features, pricing, FAQs

### Creating New Pages

1. Create a new `.njk` file in the appropriate directory
2. Add front matter with layout and metadata
3. Add your content using HTML or Markdown
4. Run the build command

Example:
```yaml
---
layout: layouts/default.njk
title: My New Page
description: Description of my new page
permalink: /my-new-page.html
breadcrumbs:
  - title: My New Page
    url: /my-new-page.html
---

<h2>Page Content</h2>
<p>Your content here...</p>
```

## Development Workflow

1. **Start Development Server**
   ```bash
   npm run serve
   ```

2. **Make Changes**
   - Edit templates in `src/_includes/`
   - Modify content pages in `src/`
   - Update data in `src/_data/`

3. **Preview Changes**
   - Browser auto-refreshes on save
   - Check console for build errors

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Deploy**
   - Upload contents of `_site/` directory to your web server
   - All files are static HTML, CSS, and JavaScript

## Common Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run serve` | Start dev server with live reload |
| `npm run build` | Build for production |
| `npx @11ty/eleventy --help` | Show Eleventy help |
| `npx @11ty/eleventy --dryrun` | Show what files would be written |

## Troubleshooting

### Build Errors

If you encounter build errors:
1. Check for syntax errors in `.njk` template files
2. Verify JSON files in `_data/` are valid
3. Ensure all referenced includes exist
4. Run with `--dryrun` flag to debug

### Missing Assets

If CSS/JS/images are missing:
1. Check paths in `.eleventy.js` passthrough copies
2. Verify files exist in source directories
3. Clear `_site/` and rebuild

### Template Not Found

If templates aren't found:
1. Check the `layout:` path in front matter
2. Verify template exists in `src/_includes/`
3. Check for typos in template names

## Configuration

Main configuration is in `.eleventy.js`:
- Template formats
- Directory structure
- Filters and shortcodes
- Asset passthrough rules

## Support

For issues or questions:
- Check the [Eleventy documentation](https://www.11ty.dev/docs/)
- Review existing templates for examples
- Contact the development team