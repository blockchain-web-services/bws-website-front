# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BWS (Blockchain Web Services) marketing website — a static site built with **Astro 4**, deployed to GitHub Pages via CloudFront CDN at **www.bws.ninja**.

## Commands

```bash
# Development
npm run dev              # Dev server at http://localhost:8087
npm run build            # Full build: clean + astro build + prettify + validate → _site/
npm run build:only       # Astro build only, no pre/post steps
npm run preview          # Preview production build

# Formatting & Validation
npm run format           # Prettier on src/**/*.{astro,js,ts,json}
npm run format:check     # Check formatting without writing
npm run validate         # HTML validation on built output
npm run pretty-print     # Prettify + validate HTML/CSS in _site/

# Tests (separate npm ecosystem in tests/)
cd tests && npm install && npx playwright install chromium
cd tests && npm test                    # All tests
cd tests && npm run test:smoke          # Smoke tests
cd tests && npm run test:visual         # Visual regression
cd tests && npm run test:a11y           # Accessibility (WCAG)
cd tests && npm run test:perf           # Performance
cd tests && npx playwright test path/to/test.spec.js  # Single test

# Worktrees (run from project root)
npm run worktree:create <name>   # Create worktree in .trees/<name>/
npm run worktree:list            # List active worktrees
npm run worktree:merge <name>    # Merge worktree back to root with --no-ff
npm run worktree:remove <name>   # Remove worktree
```

## Architecture

### Content System

Two-tier content model:

1. **Automated (AI-generated via GitHub Actions)**: Articles (`src/pages/articles/`), success stories, partnership news. Generated daily by scripts using Claude API + Twitter API, committed automatically.
2. **Manual**: Core pages (About, Industries, Marketplace products), roadmap content.

### Key Directories

- `src/pages/` — Astro route pages. Each `.astro` file = one route.
- `src/components/` — Reusable components. `*MainContent.astro` files hold the bulk of each page's content. `home/` has homepage-specific components (carousels, cards).
- `src/layouts/BaseLayout.astro` — Single layout wrapping all pages. Imports quarter data for roadmap rendering.
- `src/data/` — TypeScript data files (`articles.ts`, `news.ts`, `solutions.ts`, `successStories.ts`, `quarterContent.ts`, `quarterLearnings.ts`). Some auto-updated by scripts.
- `public/` — Static assets served as-is. `styles.css` is the consolidated CSS (originally from Webflow). Images in `public/assets/images/`.
- `scripts/` — Automation and build scripts. `scripts/data/` has JSON state files for content pipelines.
- `scripts/crawling/` — Web crawlers for content discovery (Crawlee/Puppeteer/Playwright-based).
- `_site/` — Build output directory (generated, never edit).

### Build Output

Astro outputs to `_site/` with `build.format: 'file'` (produces `.html` files, not directories). The `prebuild` step cleans `_site/`, and `postbuild` runs prettify + HTML validation.

### Worktree Workflow

Feature development uses git worktrees in `.trees/<name>/`. Each worktree gets isolated ports and a `CLAUDE_INSTRUCTIONS.md` describing the task. When working inside a worktree, only modify files within that worktree directory. Merge back via `npm run worktree:merge <name>` from root.

### Git Conventions

- Rebase on `origin/master` before committing
- Merge feature branches with `--no-ff` to preserve branch history
- One commit = one logical change
- The `worktree:merge` script handles the merge workflow automatically

### Deployment

Push to `master` triggers GitHub Actions (`main-deploy.yml`) which builds and deploys to GitHub Pages. Multiple scheduled workflows handle daily content generation (articles at 10 AM UTC, success stories at 11 AM UTC, partnerships at 9 AM UTC).

### Testing

Tests live in `tests/` with their own `package.json` and Playwright config. Tests require the site to be built first (`npm run build`). Uses Page Object Model pattern with classes in `tests/page-objects/`.
