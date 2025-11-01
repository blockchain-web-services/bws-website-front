# Building the Website

## Prerequisites

- Node.js 18+ and npm
- Git

## Initial Setup

```bash
# Clone repository
git clone [repository-url]
cd bws-website-front

# Install build dependencies
cd build
npm install
```

## Development Build

Start the development server with hot reload:

```bash
cd build
npm run dev
```

The development server runs at `http://localhost:8087`

## Production Build

Build the static website for production:

```bash
cd build
npm run build
```

### Build Process Steps

1. **Clean** - Remove previous `_site/` directory
2. **Build** - Astro generates static HTML from templates
3. **Copy Assets** - Static files from `public/` copied to `_site/`
4. **Prettify** - Format HTML/CSS with Prettier
5. **Validate** - Check HTML/CSS syntax
6. **Report** - Save validation results

## Build Scripts

All build scripts are in the `build/` folder:

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start development server with hot reload |
| `build` | `npm run build` | Full production build with validation |
| `build:only` | `npm run build:only` | Build without prettify/validate |
| `preview` | `npm run preview` | Preview production build |
| `validate` | `npm run validate` | Validate HTML syntax only |
| `pretty-print` | `npm run pretty-print` | Format and validate HTML/CSS |
| `clean` | `node clean-build.js` | Clean build directory |

## Build Output

The build generates a complete static website in `_site/`:

```
_site/
├── index.html              # Homepage
├── about.html             # About page
├── industries.html        # Industries page
├── marketplace/           # Product pages
├── industry-content/      # Industry pages
├── styles.css            # Consolidated CSS
└── assets/               # Images, fonts, JS
    ├── images/
    ├── fonts/
    └── js/
```

## Build Configuration

### Astro Configuration

The `astro.config.mjs` file in the root controls:
- Output directory (`_site`)
- Build optimizations
- Asset handling

### Build Dependencies

Located in `build/package.json`:
- `astro` - Static site generator
- `prettier` - Code formatting
- `cheerio` - HTML manipulation
- Various build utilities

## Troubleshooting

### Build Fails

**Module not found errors:**
```bash
cd build
rm -rf node_modules
npm install
```

**Permission errors:**
```bash
cd build
rm -rf ../_site
npm run build
```

**Out of memory:**
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Development Server Issues

**Port already in use:**
```bash
# Find process using port 8087
lsof -i :8087
# Kill the process
kill -9 <PID>
```

**Changes not reflecting:**
- Clear browser cache
- Restart dev server
- Check for syntax errors in console

## Advanced Building

### Custom Build Commands

Build specific pages only:
```bash
cd build
npx astro build --help
```

### Environment Variables

Set build environment:
```bash
NODE_ENV=production npm run build
```

### Build Performance

Speed up builds:
- Use `build:only` to skip validation
- Increase Node memory allocation
- Use SSD for faster I/O

## Validation Results

After building, check validation results:
```bash
cat build/validation-results.json
```

The report includes:
- HTML validation errors/warnings
- CSS validation issues
- File processing statistics