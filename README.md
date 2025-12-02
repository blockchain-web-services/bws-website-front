# BWS Website

Production website for Blockchain Web Services, deployed at [www.bws.ninja](https://www.bws.ninja)

## Quick Start

```bash
# Clone repository
git clone [repository-url]
cd bws-website-front

# Setup build environment
cd build && npm install

# Start development server
npm run dev
# Opens at http://localhost:8087
```

---

# 1. Website

The BWS website is a static site built with **Astro**, optimized for performance and SEO. It showcases BWS products, documentation, and blockchain solutions for various industries.

## Technology Stack

- **Framework**: Astro (Static Site Generator)
- **Hosting**: GitHub Pages via CloudFront CDN
- **Build System**: Node.js 20+ with npm
- **Testing**: Playwright (E2E, visual, accessibility)
- **CI/CD**: GitHub Actions
- **Infrastructure**: AWS (S3 + CloudFront)

## Architecture & Design

The website follows a component-based architecture with modular Astro components organized by functionality:

```
src/
├── components/         # Reusable UI components
├── layouts/           # Page layouts and templates
├── pages/             # Route pages
└── styles/            # Global styles and themes
```

**Key Design Principles:**
- Static generation for optimal performance
- SEO-first architecture
- Responsive mobile-first design
- Component reusability
- Accessibility compliance (WCAG 2.1)

## Content Management

Website content is managed through:
- **Markdown files** in `src/pages/` for documentation
- **Astro components** for interactive features
- **JSON data files** in `scripts/data/` for structured content
- **Static assets** in `public/` for images, CSS, fonts

## Build & Deployment

**Local Development:**
```bash
cd build && npm install
npm run dev  # http://localhost:8087
```

**Production Build:**
```bash
npm run build  # Outputs to _site/
```

**Deployment:**
- Automated via GitHub Actions on push to main
- Deployed to AWS S3 + CloudFront
- Custom domain: www.bws.ninja

## Testing

Comprehensive test suite covering:
- **E2E Tests**: User flows and interactions
- **Visual Tests**: Screenshot comparisons
- **Accessibility Tests**: WCAG compliance
- **Performance Tests**: Load times and Core Web Vitals

```bash
cd tests && npm install
npm test  # Run all tests
```

## Website Documentation

Complete documentation in [`docs/`](./docs/):

| Document | Description |
|----------|-------------|
| **[Architecture](./docs/ARCHITECTURE.md)** | Technology stack, project structure, design principles |
| **[Development Guidelines](./docs/DEVELOPMENT_GUIDELINES.md)** | Code standards, workflow, best practices |
| **[Building](./docs/BUILDING.md)** | Build setup, development server, production builds |
| **[Testing](./docs/TESTING.md)** | Test setup, running tests, writing tests |
| **[AWS Infrastructure](./docs/AWS_INFRASTRUCTURE.md)** | AWS CloudFormation, S3, CloudFront setup |
| **[Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)** | Deployment configuration and process |
| **[Troubleshooting](./docs/TROUBLESHOOTING.md)** | Common issues and solutions |

---

# 2. Automations

BWS Website includes several X/Twitter automations for content discovery, KOL engagement, and analytics. Below is a detailed overview of each automation.

## Automation Status Overview

**Legend:**
- ✅ **Working** - 100% success rate
- ⚠️ **Partial** - 25-75% success rate
- 🔴 **Failing** - 0-25% success rate

### Discovery Workflows

| Automation | Status | Success Rate | Strategy | Schedule | Credentials |
|------------|--------|--------------|----------|----------|-------------|
| Morning Discovery (Seed-Based) | ⚠️ | Debugging | Oxylabs Web Unblocker + HTML Parsing | Mon/Wed/Fri 09:09 UTC | `OXYLABS_USERNAME`, `OXYLABS_PASSWORD`, `ANTHROPIC_API_KEY` |
| Search-Based Discovery (Dynamic) | ✅ | Fixed (2025-11-17) | Crawlee + Playwright | Tue/Thu/Sat 14:00 UTC | `OXYLABS_USERNAME`, `OXYLABS_PASSWORD`, `ANTHROPIC_API_KEY` |
| Content Discovery - Crawlee | ✅ | 100% (15/15) | Crawlee + Playwright | 4x daily (6hr intervals) | `OXYLABS_USERNAME`, `OXYLABS_PASSWORD`, `ANTHROPIC_API_KEY` |

### Engagement Workflows

| Automation | Status | Success Rate | Strategy | Schedule | Credentials |
|------------|--------|--------------|----------|----------|-------------|
| KOL Reply Cycle | ✅ | 100% (with fallback) | Twitter API v2 + Auto-fallback (@BWSXAI → @BWSCommunity) | 2x daily (09:00, 21:00 UTC) | `BWSXAI_TWITTER_*` (5 vars), `TWITTER_*` (4 vars fallback), `ANTHROPIC_API_KEY`, `OXYLABS_*` (2 vars), `SEARCH1_*` (2 vars), `PAT_REPOS_AND_WORKFLOW` |

### Analytics & Reporting

| Automation | Status | Success Rate | Strategy | Schedule | Credentials |
|------------|--------|--------------|----------|----------|-------------|
| Weekly KOL Analytics | ✅ | 100% (1/1) | Twitter API v2 | Sunday 21:00 UTC | `ANTHROPIC_API_KEY`, `GH_TOKEN` (GitHub auto) |

### Content Posting

| Automation | Status | Success Rate | Strategy | Schedule | Credentials |
|------------|--------|--------------|----------|----------|-------------|
| Post Article Content | 🔴 | 0% (0/4) | Twitter API v2 (403 errors) | Daily 12:00 UTC | `BWSXAI_TWITTER_*` (4 vars), `ANTHROPIC_API_KEY`, `OXYLABS_*` (2 vars), `PAT_REPOS_AND_WORKFLOW` |
| Weekly X Post | ⚠️ | 25% (1/4) | Twitter API v2 (403 errors) | Monday 15:00 UTC | `TWITTER_*` (4 vars), `ANTHROPIC_API_KEY`, `PAT_REPOS_AND_WORKFLOW`, `PAT_GITHUB_ACTIONS` |

### Infrastructure

| Automation | Status | Success Rate | Strategy | Schedule | Credentials |
|------------|--------|--------------|----------|----------|-------------|
| Production Monitoring | ✅ | 100% (16/16) | Internal | Hourly | None (GitHub API) |

---

## Credentials & Authentication

All workflows use credentials stored as **GitHub Secrets** (environment variables). Credentials are **never** committed to the repository.

### Credential Types & Usage

| Credential | Purpose | Used By | Selection Method |
|------------|---------|---------|------------------|
| **`OXYLABS_USERNAME`** | Residential proxy authentication | Discovery workflows | Environment variable (GitHub Secret) |
| **`OXYLABS_PASSWORD`** | Residential proxy authentication | Discovery workflows | Environment variable (GitHub Secret) |
| **`ANTHROPIC_API_KEY`** | Claude AI for KOL evaluation & reply generation | Discovery & Reply workflows | Environment variable (GitHub Secret) |
| **`BWSXAI_TWITTER_BEARER_TOKEN`** | Twitter API read-only access (@BWSXAI account) | Analytics workflow | Environment variable (GitHub Secret) |
| **`BWSXAI_TWITTER_API_KEY`** | Twitter API OAuth 1.0a (@BWSXAI primary account) | Reply & Posting workflows | Environment variable (GitHub Secret) |
| **`BWSXAI_TWITTER_API_SECRET`** | Twitter API OAuth 1.0a (@BWSXAI primary account) | Reply & Posting workflows | Environment variable (GitHub Secret) |
| **`BWSXAI_TWITTER_ACCESS_TOKEN`** | Twitter API OAuth 1.0a (@BWSXAI primary account) | Reply & Posting workflows | Environment variable (GitHub Secret) |
| **`BWSXAI_TWITTER_ACCESS_SECRET`** | Twitter API OAuth 1.0a (@BWSXAI primary account) | Reply & Posting workflows | Environment variable (GitHub Secret) |
| **`TWITTER_API_KEY`** | Twitter API OAuth 1.0a (@BWSCommunity fallback account) | Reply workflow (403 fallback), Weekly X Post | Environment variable (GitHub Secret) |
| **`TWITTER_API_SECRET`** | Twitter API OAuth 1.0a (@BWSCommunity fallback account) | Reply workflow (403 fallback), Weekly X Post | Environment variable (GitHub Secret) |
| **`TWITTER_ACCESS_TOKEN`** | Twitter API OAuth 1.0a (@BWSCommunity fallback account) | Reply workflow (403 fallback), Weekly X Post | Environment variable (GitHub Secret) |
| **`TWITTER_ACCESS_SECRET`** | Twitter API OAuth 1.0a (@BWSCommunity fallback account) | Reply workflow (403 fallback), Weekly X Post | Environment variable (GitHub Secret) |
| **`SEARCH1_USERNAME`** | Twitter-scraper account credentials | Reply workflow (tweet reading) | Environment variable (GitHub Secret) |
| **`SEARCH1_PASSWORD`** | Twitter-scraper account credentials | Reply workflow (tweet reading) | Environment variable (GitHub Secret) |
| **`PAT_REPOS_AND_WORKFLOW`** | GitHub Personal Access Token | Workflow automation | Environment variable (GitHub Secret) |
| **`PAT_GITHUB_ACTIONS`** | GitHub Personal Access Token | Workflow automation | Environment variable (GitHub Secret) |
| **`GH_TOKEN`** | GitHub Actions auto-token | Workflow automation | Automatically provided by GitHub |

### Proxy Configuration

**Oxylabs Residential Proxies** (used by search & content discovery workflows):

- **Provider**: Oxylabs residential proxy network
- **Authentication**: `OXYLABS_USERNAME` and `OXYLABS_PASSWORD` environment variables
- **Purpose**: Bypass IP rate limits and anti-bot detection
- **Endpoint**: `pr.oxylabs.io:7777`
- **Selection**: Automatically rotates residential IPs per request

**When Proxies Are Used:**
- ✅ Search-Based Discovery - Required for Twitter search scraping
- ✅ Content Discovery - Required for KOL timeline monitoring
- ❌ Morning Discovery - Not required (direct profile fetching only)

### Credential Selection Logic

**Priority Order (highest to lowest):**

1. **Environment Variables (GitHub Secrets)** - Used in production workflows
2. **Local `.env` file** - Used in local development (gitignored)
3. **Config files** - Fallback for local testing (also gitignored)

**Example:** For Oxylabs credentials:
- Production: Uses `${{ secrets.OXYLABS_USERNAME }}` from GitHub Secrets
- Local: Uses `OXYLABS_USERNAME` from `.env` file
- Fallback: Can read from `config/x-crawler-accounts.json` if environment vars not set

### Local Development Setup

For local testing, create a `.env` file in the repository root (gitignored):

```bash
# Oxylabs Proxy (required for search & content discovery)
OXYLABS_USERNAME=customer-nachocoll_XXXX
OXYLABS_PASSWORD=your-password-here

# Anthropic AI (required for all workflows)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Twitter API - BWSXAI Account (for posting/reply tests)
BWSXAI_TWITTER_BEARER_TOKEN=your-bearer-token
BWSXAI_TWITTER_API_KEY=your-api-key
BWSXAI_TWITTER_API_SECRET=your-api-secret
BWSXAI_TWITTER_ACCESS_TOKEN=your-access-token
BWSXAI_TWITTER_ACCESS_SECRET=your-access-secret

# Twitter API - Legacy Naming (for weekly post workflow)
TWITTER_API_KEY=your-api-key
TWITTER_API_SECRET=your-api-secret
TWITTER_ACCESS_TOKEN=your-access-token
TWITTER_ACCESS_SECRET=your-access-secret

# Twitter-Scraper Credentials (for reply workflow)
SEARCH1_USERNAME=your-twitter-username
SEARCH1_PASSWORD=your-twitter-password
```

**Note:** See [`scripts/crawling/docs/CREDENTIALS.md`](./scripts/crawling/docs/CREDENTIALS.md) for detailed credential setup and management instructions.

---

## 2.1 KOL Discovery

The KOL Discovery system employs two complementary approaches to identify crypto Key Opinion Leaders (KOLs). Both workflows use **Crawlee + Playwright + Oxylabs Proxy** for browser automation, eliminating Twitter API dependencies and restrictions.

**Discovery Methods:**

1. **Seed-Based (2.1.1)**: Validates pre-curated candidates from an organized tier list, with automatic removal of successfully discovered KOLs
2. **Search-Based (2.1.2)**: Dynamically searches Twitter for emerging KOLs through engagement analysis on microcap and investment-focused content

**Current KOL Database Status:**

| Total KOLs | Active KOLs | Last Updated |
|------------|-------------|--------------|
| _14_ | _14_ | _2025-11-17 19:41 UTC_ |

_Note: This table is **automatically updated** by the discovery scripts (`discover-crawlee-direct.js` and `discover-by-engagement-crawlee.js`) after each successful KOL discovery. Manual updates can be triggered by calling `updateReadmeKolStats()` from `kol-utils.js`._

---

### 2.1.1 Morning Discovery (Seed-Based)

**Workflow File**: `.github/workflows/kol-discovery-morning.yml`

**Overview**: Discovers Key Opinion Leaders (KOLs) in the crypto space using a curated seed list of high-value influencer candidates across 11 tiers. Uses **Oxylabs Web Unblocker** for server-side rendering to bypass X/Twitter's JavaScript rendering requirements.

**Schedule**: 3x weekly - Monday, Wednesday, Friday at 09:09 UTC

**Scripts Used**:
- `scripts/crawling/production/discover-kols-oxylabs.js` (main discovery with Web Unblocker)
- `scripts/crawling/crawlers/html-parser.js` (HTML parsing for profile data)
- `scripts/crawling/utils/kol-utils.js` (data management)
- `scripts/crawling/utils/claude-client.js` (AI evaluation)

**Strategy**: **Oxylabs Web Unblocker + HTML Parsing**

Morning Discovery uses **Oxylabs Web Unblocker** for server-side rendering of X/Twitter profiles. Unlike traditional Crawlee approaches, Web Unblocker renders JavaScript on Oxylabs' servers and returns fully rendered HTML, which is then parsed to extract profile metrics (followers, following, bio, verification status).

**Key Technical Details**:
- **Server-side rendering**: Oxylabs renders X/Twitter profiles before returning HTML
- **HTML parsing**: Custom parser extracts follower counts with K/M/B suffix handling
- **European number format support**: Handles both `188.2K` (US) and `188,2K` (European) formats
- **Multi-account authentication**: Rotates through multiple Twitter accounts with per-account geo-targeting
- **Session reuse**: 10-minute session windows reduce proxy costs

**Discovery Process**:
1. **Load Candidates**: Reads candidate usernames from `kol-candidates.json`
2. **Filter Existing**: Skips candidates already in KOL database
3. **Web Unblocker Fetch**: Oxylabs renders X/Twitter profile pages server-side
4. **HTML Parsing**: Extract follower counts, bio, verification from rendered HTML
5. **Number Parsing**: Handle K/M/B suffixes with sanity checks for invalid patterns
6. **Validation**: Filters by follower count (10K-500K range), crypto relevance
7. **Auto-Removal**: Successfully added KOLs removed from candidate list automatically
8. **Commit**: Both KOL database and updated candidate list saved to git

**Key Features**:
- **Self-Optimizing**: Candidate list shrinks automatically after each successful discovery
- **No Re-Checks**: Previously discovered KOLs never evaluated again
- **Server-Side Rendering**: Oxylabs Web Unblocker renders JavaScript-heavy pages
- **HTML Parsing**: Custom parser with data-testid selectors for reliable extraction
- **Number Format Support**: Handles US (188.2K) and European (188,2K) decimal formats
- **Account Rotation**: Multi-account support with per-account country geo-targeting
- **Sanity Checks**: Prevents parsing errors like "376,200K" → 376,200,000

**Current Status**: ⚠️ **Debugging follower count parsing** - Large accounts (M suffix) parse correctly, but some K-suffix accounts showing incorrect values. Debug logging added to identify text extraction issues.

**Candidate Tiers** (11 Total):
- **Tier 1-4**: Core KOLs (10K-500K followers) - High engagement, crypto-native accounts
- **Tier 5**: Major Influencers (500K-5M) - VitalikButerin, cz_binance, balajis, naval
- **Tier 6**: Trading & Analysis (100K-500K) - Technical analysts and chart experts
- **Tier 7**: DeFi & Protocol Experts (50K-200K) - Protocol founders and researchers
- **Tier 8**: NFT & Web3 (50K-300K) - NFT collectors and Web3 builders
- **Tier 9**: Layer 1/2 Projects (30K-150K) - Official blockchain accounts
- **Tier 10**: Content Creators (20K-100K) - YouTubers and educators
- **Tier 11**: Researchers (10K-50K) - Crypto researchers and analysts

**Data Files**:
- **Input**: `scripts/crawling/config/kol-candidates.json` (self-updating candidate list)
- **Output**: `scripts/crawling/data/kols-data.json` (KOL database)

**Auto-Removal Example**:
```
Run N: 150 candidates → 3 KOLs added → 147 remaining
Run N+1: 147 candidates → 2 KOLs added → 145 remaining
Run N+2: 145 candidates → 0 KOLs added → 145 remaining (workflow fails, alerts team)
```

Each successful discovery automatically removes that candidate from the pool, ensuring the list stays clean and efficient.

---

**Recent Execution History** (Last 10 Days):

| Date | Day | Environment | Candidates Start | KOLs Discovered | Candidates Remaining | Top Discovery | Status |
|------|-----|-------------|------------------|-----------------|----------------------|---------------|--------|


_Note: Table auto-generated from last 10 days of workflow executions. Older entries automatically removed. Metrics populated from logged execution data._

---

### 2.1.2 Search-Based Discovery (Dynamic)

**Workflow File**: `.github/workflows/kol-discovery-search.yml`

**Overview**: Dynamic KOL discovery that searches X/Twitter for crypto-related content and identifies influential accounts through engagement analysis. Focuses on microcap projects, new launches, and early-stage investors.

**Schedule**: 3x weekly - Monday, Wednesday, Friday at 6:30 AM UTC

**Scripts Used**:
- `scripts/crawling/production/discover-by-engagement-crawlee.js` (search & analysis)
- `scripts/crawling/crawlers/crawlee-browser.js` (browser automation)
- `scripts/crawling/utils/claude-client.js` (AI evaluation)
- `scripts/crawling/utils/x-auth-manager.js` (multi-account rotation)

**Strategy**: **Search-Based Discovery with AI Evaluation**

Unlike seed-based discovery, this workflow actively searches Twitter for crypto content using configurable search queries targeting microcaps, new launches, and investor discussions. It identifies KOLs organically by analyzing who creates high-engagement content in these niches.

**Discovery Process**:
1. **Query Selection**: Rotates through subset of available search queries per run
2. **Content Search**: Searches Twitter for crypto keywords (microcaps, launches, investments)
3. **Engagement Filtering**: Filters tweets by engagement thresholds (15-50 likes minimum)
4. **Username Extraction**: Extracts authors and mentioned users from high-engagement tweets
5. **Profile Analysis**: Scrapes candidate profiles using Crawlee + Playwright
6. **AI Evaluation**: Claude AI evaluates crypto relevance and KOL quality
7. **Database Update**: Adds qualified KOLs to monitoring database

**Search Query Categories**:

- **Microcap** (5 queries): #microcap, #smallcap, #lowcap, "micro cap alert", "low cap calls"
- **Discovery** (7 queries): #cryptogem, #100xgem, #moonshot, "hidden gem", "next 100x", #DeFi gem
- **Launch** (8 queries): #IDO, #presale, #tokensale, #airdrop, #fairlaunch, #GameFi, "crypto launchpad"
- **Investor** (7 queries): #cryptoinvesting, #altcoininvesting, #cryptoportfolio, #altseason, #cryptoalpha, #earlyinvestor, #Web3 investing
- **Institutional** (2 queries): #cryptovc, #seedround
- **Ticker** (1 query): $XAI

**Configuration Settings**:
- **Queries per run**: 5 (rotates through available queries)
- **Tweets per query**: 50 maximum
- **Engagement threshold**: 15-50 likes (varies by query category)
- **Max accounts per query**: 10 candidates
- **Focus areas**: Early-stage opportunities, microcaps, new token launches

**Key Features**:
- **Dynamic Discovery**: Finds KOLs organically through content engagement (not predefined lists)
- **Niche Targeting**: Focuses on microcap and early-stage investor communities
- **Multi-Account Rotation**: Uses authentication manager to rotate Twitter accounts
- **Browser Automation**: Crawlee + Playwright bypasses API restrictions
- **Oxylabs Proxy**: Residential proxies prevent IP blocking
- **AI Screening**: Claude evaluates crypto relevance before adding to database
- **Query Rotation**: Different queries each run for diverse discovery

**Data Files**:
- **Input**: `scripts/crawling/config/search-queries.json` (search query configuration)
- **Output**: `scripts/crawling/data/kols-data.json` (shared KOL database)

**Discovery Approach Comparison**:

| Aspect | Seed-Based (2.1.2) | Search-Based (2.1.3) |
|--------|-------------------|---------------------|
| Source | Predefined candidate list | Dynamic Twitter searches |
| Discovery | Validates known influencers | Finds unknown accounts organically |
| Focus | Established KOLs (10K+ followers) | Emerging voices (any size) |
| Approach | Top-down (curated list) | Bottom-up (engagement analysis) |
| Scalability | Limited to candidate pool | Unlimited (continuous search) |

---

**Recent Execution History** (Last 10 Days):

| Date | Day | Environment | Queries Used | Tweets Analyzed | Candidates Checked | KOLs Discovered | Top Discovery | Status |
|------|-----|-------------|--------------|-----------------|--------------------|--------------------|---------------|--------|


_Note: Table auto-generated from last 10 days of workflow executions. Older entries automatically removed. Metrics populated from logged execution data._

---

## 2.2 Tweet Discovery

Tweet Discovery monitors the timelines of discovered KOLs to identify high-engagement content relevant to BWS products and blockchain trends. The system uses a 2-script architecture:

1. **Script 2.2.1**: Timeline monitoring - discovers high-engagement tweets and saves to queue
2. **Script 2.3.1**: Reply posting - processes queue and posts AI-generated replies

---

### 2.2.1 KOL Timeline Monitoring

**Workflow File**: `.github/workflows/kol-monitor-timelines.yml`

**Overview**: Monitors KOL timelines to discover high-engagement crypto content relevant to BWS products and blockchain trends. Populates the reply queue (`engaging-posts.json`) for downstream reply processing.

**Schedule**: 4x daily - 07:15, 12:30, 17:45, 22:00 UTC (randomized schedule)

**Scripts Used**:
- `scripts/crawling/production/monitor-kol-timelines.js` (timeline scanner)
- `scripts/crawling/crawlers/twitter-crawler.js` (HTML parsing via Web Unblocker)
- `scripts/crawling/utils/x-auth-manager.js` (multi-account authentication)
- `scripts/crawling/utils/kol-utils.js` (KOL data management)
- `scripts/crawling/utils/zapier-webhook.js` (monitoring notifications)

**Strategy**: **HTML Parsing + Engagement Filtering (NO AI)**

Timeline Monitoring scans active KOL timelines using HTML parsing via getUserTweetsWebUnblocker(). Unlike the old monolithic approach, this script ONLY discovers and queues tweets - it does NOT evaluate relevance or post replies.

**Monitoring Process**:
1. **Load KOL Database**: Reads list of active KOLs from `kols-data.json`
2. **Timeline Fetching**: Uses HTML parsing via Web Unblocker to fetch recent tweets (no Twitter API)
3. **Engagement Filtering**: Filters by engagement threshold (likes + retweets)
4. **Queue Population**: Saves qualifying tweets to `engaging-posts.json` with metadata
5. **Deduplication**: Skips tweets already in queue or processed
6. **Schedule Randomization**: Randomizes next 4 run times to avoid spam detection
7. **Zapier Notification**: Sends simplified metrics (tweets scanned, selected, queue status)

**Key Features**:
- **NO AI Evaluation**: Pure monitoring - evaluation happens in Script 2.3.1
- **NO Reply Posting**: Only populates queue - replying happens in Script 2.3.1
- **HTML Parsing**: Uses getUserTweetsWebUnblocker() via authManager
- **Cookie Authentication**: Multi-account rotation via x-auth-manager.js
- **Oxylabs Proxy**: Residential proxies prevent IP blocking
- **Engagement-Only Filtering**: Simple like/retweet threshold (no AI overhead)
- **7-Day Expiration**: Posts expire after 7 days if not processed
- **Processed Flag**: Marks posts as processed: false for downstream handling

**Queue Data Structure** (`engaging-posts.json`):
```json
{
  "posts": [{
    "id": "tweet_id",
    "text": "tweet content",
    "author": { "id": "kol_id", "username": "@KOL", "displayName": "KOL Name" },
    "public_metrics": { "like_count": 100, "retweet_count": 20 },
    "processed": false,
    "expiresAt": "2025-12-05T00:00:00Z",
    "source": "timeline_monitor"
  }]
}
```

**Data Files**:
- **Input**: `scripts/crawling/data/kols-data.json` (KOL database)
- **Output**: `scripts/crawling/data/engaging-posts.json` (reply queue for Script 2.3.1)

---

**Recent Execution History** (Last 10 Days):

| Date | Time (UTC) | Environment | KOLs Monitored | Posts Found | High-Relevance | Status |
|------|------------|-------------|----------------|-------------|----------------|--------|


_Note: Table auto-generated from last 10 days of workflow executions. Older entries automatically removed. Metrics populated from logged execution data._

---

## 2.3 Reply Automation

Reply Automation processes the tweet queue populated by Script 2.2.1, evaluating each tweet with Claude AI and posting contextual replies that mention BWS products naturally.

---

### 2.3.1 KOL Reply Cycle (Queue Processor)

**Workflow File**: `.github/workflows/kol-reply-cycle.yml`

**Overview**: Processes the `engaging-posts.json` queue populated by Script 2.2.1. Evaluates each unprocessed tweet with Claude AI and posts contextual replies via Twitter API v2.

**Schedule**: 2x daily (09:00, 21:00 UTC)

**Scripts Used**:
- `scripts/crawling/production/reply-to-kol-posts.js` (queue processor with automatic fallback)
- `scripts/crawling/utils/twitter-client.js` (Twitter API v2 posting with dual-account support)
- `scripts/crawling/utils/claude-client.js` (AI evaluation & reply generation)
- `scripts/crawling/utils/kol-utils.js` (KOL data management)
- `scripts/crawling/utils/schedule-randomizer.js` (anti-spam delays)
- `scripts/crawling/utils/zapier-webhook.js` (reply notifications)

**Strategy**: **Queue-Based Processing + Twitter API v2 + Automatic Account Fallback**
- Reads unprocessed posts from `engaging-posts.json` (populated by Script 2.2.1)
- AI evaluation per tweet (relevance scoring + product matching)
- AI-generated contextual replies via Claude API
- Posts via Twitter API v2 with anti-spam actions (follow KOL, like tweet)
- **NEW: Automatic fallback** - Switches from @BWSXAI to @BWSCommunity on 403 errors
- Marks posts as `processed: true` to prevent duplicate replies
- Rate limiting: Max 1 reply per run (configurable)
- Continue-until-reply logic: Evaluates up to 2x limit if no replies posted
- Randomized scheduling to avoid spam detection

**Status**: ✅ **WORKING with Fallback** - Now using @BWSCommunity account automatically when @BWSXAI encounters 403 errors

**Recent Implementation (2025-12-01)**:

**Multi-Account Fallback System:**
- **Primary Account**: @BWSXAI (BWSXAI_TWITTER_* credentials)
- **Fallback Account**: @BWSCommunity (TWITTER_* credentials)
- **Automatic Switching**: Detects 403 errors and switches accounts mid-operation
- **Retry Logic**: Automatically retries follow/like/reply with fallback account
- **Success Tracking**: Records which account posted each reply

**How Fallback Works:**
1. Initializes both @BWSXAI (primary) and @BWSCommunity (fallback) clients at startup
2. Attempts to post with @BWSXAI first
3. On 403 error detection, automatically switches to @BWSCommunity
4. Retries the failed operation (follow/like/reply) with fallback account
5. Continues processing remaining tweets with active account

**Recent Success** (Run 19834445618 - 2025-12-01 19:14 UTC):
- @BWSXAI encountered 403 errors during follow/like/reply operations
- Automatic switch to @BWSCommunity triggered
- **3 replies successfully posted** using fallback account
- Continue-until-reply feature evaluated 10 tweets (doubled from 5) to ensure success

**Recent Outputs** (When Working):
- **Total Replies Posted**: 6 successful replies
- **Recent Replies**:
  - Reply to @IncomeSharks about market sentiment → Mentioned Fan Game Cube
  - Reply to @IncomeSharks about crypto discounts → Mentioned X Bot
  - Reply to @AltcoinSherpa about DeFi trends → Mentioned BWS solutions
- **Products Mentioned**: Fan Game Cube, X Bot, BWS NFT solutions
- **Average Relevance Score**: 72/100

**Data Files**:
- Input: `scripts/crawling/data/kols-data.json`, `scripts/crawling/data/engaging-posts.json`
- Output: `scripts/crawling/data/kol-replies.json`

---

## 2.4 Weekly KOL Analytics

**Workflow File**: `.github/workflows/analyze-kols-weekly.yml`

**Overview**: Generates comprehensive weekly reports analyzing KOL engagement performance, product mentions, and AI-powered insights.

**Schedule**: Every Sunday at 21:00 UTC

**Scripts Used**:
- `scripts/crawling/production/analyze-kol-engagement.js`
- `scripts/crawling/utils/claude-client.js` (AI analysis)
- `scripts/crawling/utils/kol-utils.js`

**Strategy**: **Data Analysis + Claude AI**
- Analyzes reply performance metrics from `kol-replies.json`
- Calculates engagement rates, success rates, relevance scores
- AI-powered insights and recommendations via Claude
- Creates GitHub issue with formatted report
- Tracks product mention performance

**Recent Failures**: None (1/1 success)

**Recent Outputs** (Latest Weekly Report):
- **Period**: Last 7 days
- **Total Replies**: 6
- **Success Rate**: 100% (when not blocked by 403 errors)
- **Average Relevance Score**: 72/100
- **Top KOLs Engaged**:
  - @IncomeSharks (3 replies, 688K followers)
  - @AltcoinSherpa (1 reply, 257K followers)
- **Product Performance**:
  - Fan Game Cube: 2 mentions
  - X Bot: 2 mentions
  - NFT Solutions: 1 mention
- **AI Assessment**: "Engagement quality high, but volume limited by API restrictions. Focus on top-performing KOLs."

**Data Files**:
- Input: `scripts/crawling/data/kol-replies.json`
- Output: `scripts/crawling/data/kol-metrics.json`
- Creates GitHub issue with report

---

## 2.5 Post Article Content to X

**Workflow File**: `.github/workflows/post-article-content.yml`

**Overview**: 🔴 **NOT WORKING** - Automatically posts newly published blog articles to @BWSXAI Twitter account. Currently blocked by Twitter API restrictions.

**Schedule**: Daily at 12:00 UTC + after article generation completes

**Scripts Used**:
- `scripts/generate-article-posts.js` (generates post text)
- `scripts/post-article-content.js` (posts to X)
- `scripts/crawling/utils/twitter-client.js` (Twitter API v2)
- `scripts/crawling/utils/claude-client.js` (AI post generation)

**Strategy**: **Twitter API v2 + Claude AI**
- Scans `src/pages/` for new blog articles
- AI-generated promotional posts via Claude
- Includes article link, emoji, hashtags
- Tracks posted articles to avoid duplicates

**Recent Failures**: **4/4 failures** (0% success rate)

**Failure Details**:
```
Error: Request failed with code 403 (Forbidden)
Root Cause: Same Twitter API blocking issue as KOL Reply Cycle
```

**Recommended Fix**: Migrate to browser automation (Crawlee + Playwright) for posting.

**Recent Outputs** (When Working): None (never succeeded in last 3 days)

**Expected Outputs**:
- Article posts promoting new blog content
- Format: "[Emoji] Article Title - [Summary] [Link] [Hashtags]"
- Example: "🚀 New Guide: Building Web3 Marketplaces with BWS NFT Platform https://bws.ninja/article-slug #Web3 #Blockchain #NFT"

**Data Files**:
- Input: Article files in `src/pages/`
- Output: `scripts/data/article-x-posts.json`

---

## 2.6 Weekly X Post

**Workflow File**: `.github/workflows/weekly-x-post.yml`

**Overview**: ⚠️ **UNSTABLE** - Posts weekly update summaries about BWS development progress, new features, and community highlights.

**Schedule**: Daily at 14:00 UTC (checks if week summary needed)

**Scripts Used**:
- `scripts/generate-weekly-x-post.js` (main script)
- `scripts/crawling/utils/twitter-client.js` (Twitter API v2)
- `scripts/crawling/utils/claude-client.js` (AI content generation)

**Strategy**: **Twitter API v2 + GitHub API + Claude AI**
- Fetches GitHub activity (PRs, commits, releases)
- AI-generated weekly summaries via Claude
- Posts to @BWSXAI with project updates
- Tracks posted weeks to avoid duplicates

**Recent Failures**: **3/4 failures** (25% success rate)

**Failure Details**:
```
Error: Request failed with code 403 (Forbidden)
Root Cause: Twitter API restrictions (same as other posting workflows)
Occasional Success: Suggests intermittent account access or rate limit recovery
```

**Recent Outputs** (When Working):
- 1 successful weekly update post (details not in logs)
- Format: "📊 BWS Weekly Update - [Highlights] [Stats] [Links]"

**Data Files**:
- Output: `scripts/data/weekly-x-posts-state.json`

---

## 2.7 Production Monitoring

**Workflow File**: `.github/workflows/monitor.yml`

**Overview**: Monitors health and performance of all production automation scripts. Sends alerts on failures.

**Schedule**: Continuous (monitors all workflows)

**Scripts Used**:
- Internal monitoring logic (no specific script file)
- GitHub Actions status checks
- Zapier webhook integration for Slack alerts

**Strategy**: **GitHub Actions API + Zapier**
- Monitors workflow run statuses
- Tracks success/failure rates
- Sends Slack notifications on failures
- Creates detailed status reports

**Recent Failures**: None (16/16 success)

**Recent Outputs**:
- **Total Workflows Monitored**: 17
- **Health Check**: All monitoring functions operational
- **Recent Alerts**: 403 errors on KOL Reply Cycle, Post Article Content, Weekly X Post

**Data Files**: None (status only)

---

## Automation Documentation

Complete automation documentation in [`scripts/crawling/docs/`](./scripts/crawling/docs/):

**System Setup:**
| Document | Description |
|----------|-------------|
| **[README](./scripts/crawling/README.md)** | Overview of crawling system structure |
| **[KOL System Setup](./scripts/crawling/docs/KOL_SYSTEM_SETUP.md)** | Setting up the KOL automation system |
| **[Credentials Guide](./scripts/crawling/docs/CREDENTIALS.md)** | Twitter API and authentication setup |
| **[README Auth](./scripts/crawling/docs/README-AUTH.md)** | Authentication methods (cookie extraction) |

**Reports & Analysis:**
| Document | Description |
|----------|-------------|
| **[GitHub Actions Status Report](./scripts/crawling/docs/GITHUB_ACTIONS_STATUS_REPORT.md)** | 3-day automation status analysis |
| **[KOL Analysis Report](./scripts/crawling/docs/KOL_ANALYSIS_REPORT.md)** | KOL discovery and engagement analysis |
| **[Rate Limit Root Cause](./scripts/crawling/docs/RATE_LIMIT_ROOT_CAUSE.md)** | Twitter API 403 error investigation |

**Implementation Strategy:**
| Document | Description |
|----------|-------------|
| **[Daily Scheduling Strategy](./scripts/crawling/docs/DAILY_SCHEDULING_STRATEGY.md)** | Automated scheduling approach |
| **[Anti-Spam Actions](./scripts/crawling/docs/ANTI_SPAM_ACTIONS.md)** | Spam prevention measures |
| **[Article X Posting Plan](./scripts/crawling/docs/ARTICLE_X_POSTING_PLAN.md)** | Content posting strategy |

---

## Critical Issues & Recommended Actions

### Issue #1: Twitter API 403 Forbidden Errors

**Affected Workflows:**
- KOL Reply Cycle (33% success)
- Post Article Content (0% success)
- Weekly X Post (25% success)

**Root Cause**: @BWSXAI account flagged by Twitter for automated posting patterns.

**Recommended Solution**: Migrate from Twitter API v2 to **Crawlee + Playwright + Cookie Auth** (same approach used successfully in Content Discovery).

**Action Plan**:
1. Extract @BWSXAI cookies manually (see `scripts/crawling/docs/README-AUTH.md`)
2. Update posting scripts to use browser automation
3. Test locally with Playwright
4. Deploy to GitHub Actions

**Timeline**: 3-5 days implementation

**Reference**: See `scripts/crawling/docs/GITHUB_ACTIONS_STATUS_REPORT.md` for detailed analysis and action items.

---

## Project Structure

```
bws-website-front/
├── src/                    # Source code (Astro components and pages)
├── public/                 # Static assets (CSS, images, fonts)
├── build/                  # Build tools and dependencies
├── tests/                  # Test suite and dependencies
├── docs/                   # Website documentation
├── scripts/
│   ├── crawler/           # BWS website crawler
│   └── crawling/          # X/Twitter automation system
│       ├── production/    # Production scripts (8 active)
│       ├── utils/         # Utility modules (17 files)
│       ├── crawlers/      # Browser automation (Crawlee + Playwright)
│       ├── tests/         # Test scripts (9 files)
│       ├── data/          # JSON data files (KOLs, replies, metrics)
│       └── docs/          # Automation documentation (29+ files)
├── _site/                 # Build output (generated)
├── .github/workflows/     # GitHub Actions workflows (17 automations)
└── README.md              # This file
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the [Development Guidelines](./docs/DEVELOPMENT_GUIDELINES.md)
4. Test your changes (see [Testing](./docs/TESTING.md))
5. Submit a pull request

For worktree-based development, see [Worktrees Guide](./docs/WORKTREES.md).

---

## Support

- **Documentation**: [/docs/](./docs/) and [/scripts/crawling/docs/](./scripts/crawling/docs/)
- **GitHub Issues**: [Submit Issue](https://github.com/blockchain-web-services/bws-website-front/issues)
- **Live Site**: [www.bws.ninja](https://www.bws.ninja)
- **X/Twitter**: [@BWSXAI](https://twitter.com/BWSXAI)

---

## License

MIT License - see LICENSE file for details
