# Twitter/X Crawling & Automation Scripts

This directory contains all Twitter/X-related crawling, scraping, and automation functionality.

## Directory Structure

```
scripts/crawling/
├── production/       # Production scripts actively used in workflows
├── utils/           # Shared utility modules
├── crawlers/        # Browser automation and scraping utilities
├── tests/           # Test scripts for credentials, API, etc.
├── data/            # JSON data files (KOLs, replies, metrics, etc.)
├── docs/            # Documentation and analysis files
└── README.md        # This file
```

## Production Scripts

Located in `production/`:

- **evaluate-and-reply-kols.js** - Main KOL reply generation and posting script
- **analyze-kol-engagement.js** - Weekly analytics and metrics generation
- **discover-crawlee-direct.js** - Direct Crawlee-based KOL discovery
- **discover-by-engagement-crawlee.js** - Search-based KOL discovery
- **discover-with-fallback.js** - Discovery with fallback strategies
- **generate-weekly-x-post.js** - Weekly X post generation
- **post-article-content.js** - Article content posting to X
- **fetch-twitter-partnerships.js** - Partnership data fetching

## Utility Modules

Located in `utils/`:

- **kol-utils.js** - Core KOL data management utilities
- **twitter-client.js** - Twitter API v2 client
- **multi-account-scraper-client.js** - Multi-account scraping client
- **claude-client.js** - Anthropic Claude API integration
- **amplified-search.js** - Enhanced search capabilities
- **api-usage-logger.js** - API usage tracking and logging
- **schedule-randomizer.js** - Random scheduling to avoid detection
- **workflow-updater.js** - GitHub Actions workflow automation

## Test Scripts

Located in `tests/`:

- Authentication tests (minimal auth, read, write, reply)
- Account status verification
- Proxy connection testing
- Multi-account scraper testing
- Secret values validation

## Data Files

Located in `data/`:

- **kols-data.json** - KOL profiles and metadata
- **kol-replies.json** - Reply history and tracking
- **engaging-posts.json** - Discovered engaging content
- **processed-posts.json** - Processed post tracking
- **kol-metrics.json** - Analytics and engagement metrics

## Documentation

Located in `docs/`:

Comprehensive documentation about:
- Implementation summaries
- Authentication guides
- API usage tracking
- ScrapFly/Crawlee setup
- Error reporting improvements
- Investigation reports
- Multi-account analysis

## Usage in GitHub Actions

The scripts in this directory are used by several workflows:

- `.github/workflows/kol-reply-cycle.yml` - Main reply automation (4x daily)
- `.github/workflows/analyze-kols-weekly.yml` - Weekly analytics
- `.github/workflows/discover-content-scrapfly.yml` - Content discovery
- `.github/workflows/test-h-multi-account-scraper.yml` - Testing workflow

## Important Notes

1. All Twitter API credentials are stored as GitHub Secrets
2. Multi-account approach separates search (scraper) from posting (API)
3. Oxylabs proxy is used for API calls to avoid rate limiting
4. Claude API is used for content evaluation and reply generation
5. Schedule randomization prevents spam detection
