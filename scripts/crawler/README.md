# BWS Website Crawler

**Purpose:** Crawls and analyzes the BWS website (www.bws.ninja) to understand page structure, detect templates, validate links, and analyze content patterns.

**Target:** `https://www.bws.ninja/`

## Overview

This directory contains tools for crawling and analyzing the BWS website itself. This is completely separate from the Twitter/X crawling functionality in `scripts/crawling/`.

## Files

### Main Crawler Scripts

#### `crawl.js`
**Purpose:** Main website crawler with full feature set

- Crawls the BWS website starting from the homepage
- Configurable crawl depth (default: 5 levels)
- Extracts and follows internal links
- Records page metadata, title, meta descriptions
- Builds link graph showing page relationships
- Tracks crawl errors and broken links
- Generates comprehensive crawl report

**Output:**
- `output/crawl-report.json` - Summary statistics
- `output/pages.json` - All discovered pages with metadata
- `output/link-report.json` - Link graph and relationships

#### `crawl-simple.js`
**Purpose:** Lightweight version of the crawler

- Simplified crawling logic
- Lower memory footprint
- Basic link extraction and following
- Max depth: 3 levels (configurable)
- Suitable for quick scans

#### `crawl-standalone.js`
**Purpose:** Zero-dependency crawler

- No external npm dependencies (uses only Node.js built-ins)
- Regex-based HTML parsing
- Useful when external dependencies are unavailable
- Basic link extraction and categorization

### Analysis Scripts

#### `analyze-simple.js`
**Purpose:** Basic page categorization

- Reads `output/pages.json` from crawler
- Categorizes pages by URL pattern:
  - Homepage
  - Marketplace solutions
  - Industry content
  - Use case pages
  - Resource pages
  - Other pages
- Generates summary statistics by category

**Usage:**
```bash
node scripts/crawler/analyze-simple.js
```

#### `analyze-templates.js`
**Purpose:** Advanced template detection

- Analyzes page structure and components
- Detects template patterns using:
  - Component fingerprinting
  - Layout analysis
  - Structural similarity detection
- Groups pages by detected template
- Identifies reusable components
- Useful for understanding site architecture

**Usage:**
```bash
node scripts/crawler/analyze-templates.js
```

**Output:**
- `output/templates.json` - Detected templates and grouped pages

### Validation Scripts

#### `validate-results.js`
**Purpose:** Comprehensive validation of crawl results

Validates:
- Crawl completeness
- Link integrity
- Template detection accuracy
- Page categorization correctness
- Data consistency across reports

Provides pass/fail/warning status for each check.

**Usage:**
```bash
node scripts/crawler/validate-results.js
```

## Output Directory

The `output/` directory contains all generated reports:

```
output/
├── crawl-report.json      # Crawl statistics and summary
├── pages.json             # All discovered pages with metadata
├── link-report.json       # Link graph and relationships
└── templates.json         # Template detection results
```

## Usage Examples

### Basic Crawl
```bash
# Run the main crawler
node scripts/crawler/crawl.js

# Analyze the results
node scripts/crawler/analyze-simple.js

# Validate everything
node scripts/crawler/validate-results.js
```

### Quick Scan
```bash
# Use the simple crawler for a quick scan
node scripts/crawler/crawl-simple.js
```

### Template Analysis
```bash
# First crawl the site
node scripts/crawler/crawl.js

# Then analyze templates
node scripts/crawler/analyze-templates.js
```

### Standalone Mode
```bash
# Run without dependencies
node scripts/crawler/crawl-standalone.js
```

## Configuration

Most crawlers accept configuration options:

```javascript
const config = {
  startUrl: 'https://www.bws.ninja/',
  maxDepth: 5,          // How many levels deep to crawl
  // Add other options as needed
};
```

## Common Use Cases

### 1. Site Structure Analysis
Use `crawl.js` + `analyze-templates.js` to understand how the site is organized and which templates are used where.

### 2. Link Validation
Use `crawl.js` + `validate-results.js` to find broken links and validate internal link structure.

### 3. Content Inventory
Use `crawl.js` + `analyze-simple.js` to get a complete inventory of pages categorized by type.

### 4. Quick Site Check
Use `crawl-simple.js` for a fast scan to check if major pages are accessible.

## Difference from scripts/crawling/

**scripts/crawler/** (this directory):
- Crawls the BWS website (www.bws.ninja)
- Analyzes website structure and content
- Internal website development tool

**scripts/crawling/** (different directory):
- Crawls Twitter/X social media platform
- KOL discovery and engagement automation
- Social media marketing tool

## Requirements

- Node.js 14+
- Dependencies (for non-standalone scripts):
  - `cheerio` - HTML parsing
  - Built-in Node.js modules: `https`, `fs`, `path`, `url`

## Notes

- All crawlers respect the BWS website structure
- Crawlers follow internal links only (stay within www.bws.ninja domain)
- External links are recorded but not followed
- Results are cached in the `output/` directory
- Re-running crawlers will overwrite previous results
