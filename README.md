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

## TL;DR: Product-Targeted Customer Acquisition

**Goal**: Find potential customers discussing specific problems that BWS products solve, and reply with educational content about relevant solutions.

### Product Targeting Strategy

We run **product-specific searches** for 4 BWS products, targeting users discussing pain points each product solves:

| Product | Target Customer Pain Points | Search Focus | Key Features in Replies |
|---------|---------------------------|--------------|------------------------|
| **Blockchain Badges** | Credential fraud, diploma verification, professional certifications | Universities, HR departments, credential issuers | Tamper-proof credentials, immutable blockchain proof, combat fraud |
| **BWS IPFS** | IPFS setup complexity, NFT metadata storage, decentralized hosting | NFT creators, Web3 developers, content hosts | Simple API, no node management, BWS-hosted gateway |
| **NFT.zK** | Wallet setup friction, NFT distribution to non-crypto users | Brands, marketers, NFT projects | Wallet-free claiming, managed infrastructure, bulk minting |
| **Blockchain Hash** | Web3 development complexity, gas fees, wallet management | dApp developers, blockchain builders | Mutable on-chain database, no wallets/gas, simple REST API |

### How We Select Tweets (20 Search Queries)

**Blockchain Badges** (5 queries):
- Credential verification discussions (certificates, diplomas, degrees)
- Educational credentials (universities, courses, training certificates)
- Professional badges (skill endorsements, achievements)
- Credential fraud problems (fake degrees, counterfeit diplomas)
- Digital identity solutions (verifiable credentials, SSI)

**BWS IPFS** (5 queries):
- IPFS storage needs (upload, hosting, gateway setup)
- NFT metadata storage (permanent, decentralized)
- Decentralized storage discussions (Web3, censorship-resistant)
- IPFS setup problems (difficult, complex, node management)
- IPFS alternatives (vs Arweave, Filecoin, Storj)

**NFT.zK** (5 queries):
- NFT collection creation (minting, launching, no-code)
- NFT distribution challenges (airdrops, claims, mainstream adoption)
- Wallet friction (MetaMask setup, user barriers)
- NFT utility (membership, tickets, rewards, loyalty)
- Brand NFT strategies (marketing, business use cases)

**Blockchain Hash** (5 queries):
- Mutable blockchain database needs (update on-chain data)
- Web3 development pain points (wallet complexity, gas fees)
- Blockchain without wallets (gasless, wallet-free)
- On-chain storage needs (data, records, information)
- Simple blockchain APIs (REST, easy integration)

**Engagement Thresholds**: Min 3-5 likes, 1 retweet, 50-100 views, <24 hours old

### Reply Content Structure (3-4 Tweet Threads)

**Three Educational Templates** (weighted rotation):

1. **How-To Guide** (40%):
   - Tweet 1: Acknowledge pain point
   - Tweet 2: Solution features with $BWS
   - Tweet 3: Getting started steps
   - Tweet 4: CTA + docs link

2. **Problem-Solution** (40%):
   - Tweet 1: Amplify the problem
   - Tweet 2: Solution features
   - Tweet 3: Real-world use case
   - Tweet 4: CTA + docs link

3. **Feature Showcase** (20%):
   - Tweet 1: Specific feature hook
   - Tweet 2: Technical details
   - Tweet 3: Business benefits
   - Tweet 4: CTA + docs link

**Every Thread Includes**:
- ✅ **Product isolation**: Only ONE BWS product per thread
- ✅ **Call-to-action**: Clear next steps
- ✅ **Documentation link**: `https://docs.bws.ninja/[product-path]`
- ✅ **Brand mentions**: @BWSCommunity and $BWS cashtag
- ✅ **Anti-spam actions**: Follow author, like tweet before replying
- ✅ **Relevance threshold**: Minimum 70/100 AI score

### Implementation Status

**⚠️ IMPORTANT**: The product-specific customer acquisition workflow described above is **CONFIGURED but NOT YET ACTIVE** due to a bug in the discovery script (`fs.readFileSync is not a function` - Dec 12, 2025).

**Current Status**:
- ❌ **Product Discovery**: Failing (code bug needs fix)
- ❌ **Product-Specific Threads**: 0 threads posted
- ✅ **General KOL Engagement**: Active (see below)

**Queue Status**:
- Blockchain Badges: 0 tweets discovered
- BWS IPFS: 0 tweets discovered
- NFT.zK: 0 tweets discovered
- Blockchain Hash: 0 tweets discovered

### Current Active System: General KOL Engagement

**While product-specific targeting is being debugged**, the general KOL engagement workflow is active and working:

**How It Works**:
- Monitors 36 crypto KOLs (@IncomeSharks, @cobie, @CryptoRover, etc.)
- Replies to high-engagement tweets about crypto/Web3 topics
- Mentions BWS products contextually in replies
- Single-tweet replies (not educational threads)
- 2-5 replies/day, 30/day limit

**Recent Performance (Last 10 Replies - Dec 11-12, 2025)**:

**Target KOLs**:
- @CryptoRover (5 replies) - Microcap/fundamentals discussions
- @cobie (4 replies) - Alpha/investment discussions
- @AltcoinSherpa (1 reply) - Memecoin analysis

**Products Mentioned** (contextually within general crypto discussions):
1. **X Bot** - 7 mentions (community analytics)
2. **Blockchain Badges** - 7 mentions (credential verification)
3. **ESG Credits** - 5 mentions (sustainable finance)
4. **Fan Game Cube** - 3 mentions (NFT gaming)
5. **NFT.zK, BWS IPFS, Blockchain Hash, Blockchain Save** - 2 each

**Example Replies**:
- **@cobie** (score: 88/100): "Real alpha means identifying fundamentals the market hasn't priced yet - products solving actual enterprise friction. ESG Credits enables financial institutions to verify green asset compliance..."
- **@CryptoRover** (score: 85/100): "Building through cycles separates projects with substance from hype plays. Blockchain Badges delivers: tamper-proof credentials with immutable blockchain proof..."

**Difference Between Approaches**:

| Aspect | Product-Specific (Planned) | General KOL (Active) |
|--------|---------------------------|---------------------|
| **Target** | Users with specific pain points | Crypto KOLs with large followings |
| **Discovery** | Search for problem keywords | Monitor KOL timelines |
| **Reply Format** | 3-4 tweet educational threads | Single contextual reply |
| **Goal** | Customer acquisition | Brand awareness/engagement |
| **Volume** | 2-4 threads/day | 2-5 replies/day |
| **Status** | 🔴 Failing (needs bug fix) | ✅ Active |

---

## Automation Status Overview

**Last Updated**: December 12, 2025

**Legend:**
- ✅ **Working** - 100% success rate (last 3 runs)
- ⚠️ **Partial** - 33-67% success rate (last 3 runs)
- 🔴 **Failing** - 0-33% success rate (last 3 runs)
- ❌ **Deprecated** - Removed or disabled

### System Statistics (Real-Time)

| Metric | Count | Last Run Details |
|--------|-------|------------------|
| **KOLs Tracked** | 36 | @IncomeSharks, @cobie, @CryptoRover, @AltcoinSherpa, + 32 more |
| **Total Replies Posted** | 90 | Last reply: Dec 10, 2025 (@CryptoRover) |
| **Engaging Posts Queue** | 288 | 259 added last run (Dec 12 07:22 UTC) |
| **Articles Generated** | 5 | X Bot, Blockchain Badges, ESG Credits, Fan Game Cube |
| **BWS Products** | 8 | Loaded from docs-index.json |

### Discovery Workflows

| Automation | Status | Success Rate | Last Run | Details | Schedule | Credentials |
|------------|--------|--------------|----------|---------|----------|-------------|
| Content Discovery - Crawlee | ✅ | 100% (3/3) | Dec 12, 07:37 UTC | Found content from multiple sources | 4x daily (6hr intervals) | `OXYLABS_USERNAME`, `OXYLABS_PASSWORD`, `ANTHROPIC_API_KEY` |
| KOL Timeline Monitoring | ✅ | 100% (3/3) | Dec 12, 07:22 UTC | **22 KOLs monitored**, 259 posts saved, 20 passed filters (project-discussion: 10, altcoin-talk: 5, market-trends: 4) | Every 5 hours | `OXYLABS_USERNAME`, `OXYLABS_PASSWORD`, `ANTHROPIC_API_KEY` |
| Search-Based Discovery (Dynamic) | 🔴 | 0% (1/3) | Dec 12, 06:42 UTC | **FAILURE** - Needs investigation | Tue/Thu/Sat 14:00 UTC | `OXYLABS_USERNAME`, `OXYLABS_PASSWORD`, `ANTHROPIC_API_KEY` |
| Discover Documentation Pages | ✅ | 100% (3/3) | Dec 12, 02:40 UTC | Documentation index maintained | Daily 02:35 UTC | `OXYLABS_USERNAME`, `OXYLABS_PASSWORD` |
| Index Documentation Site | ✅ | 100% (3/3) | Dec 12, 03:34 UTC | **73 pages indexed**, 8 products categorized | After docs discovery | `ANTHROPIC_API_KEY` |
| Discover Product Tweets | 🔴 | 0% (0/3) | Dec 12, 08:01 UTC | **FAILING** - Code bug: `fs.readFileSync is not a function`, 0 tweets discovered | Daily 08:00 UTC | `OXYLABS_USERNAME`, `OXYLABS_PASSWORD`, `ANTHROPIC_API_KEY` |

### Engagement Workflows

| Automation | Status | Success Rate | Last Run | Details | Schedule | Credentials |
|------------|--------|--------------|----------|---------|----------|-------------|
| KOL Reply Cycle | ✅ | 100% (3/3) | Dec 12, 07:37 UTC | **2 replies posted** (to @CryptoRover, @cobie), 10 tweets evaluated, 2/30 daily limit, followed KOLs, liked tweets, images attached | 4x daily (randomized) | `TWITTER_*` (4 vars), `ANTHROPIC_API_KEY`, `OXYLABS_*` (2 vars), `SEARCH1_*` (2 vars), `PAT_REPOS_AND_WORKFLOW` |

### Content Generation & Posting

| Automation | Status | Success Rate | Last Run | Details | Schedule | Credentials |
|------------|--------|--------------|----------|---------|----------|-------------|
| Generate Articles from X Posts | ✅ | 100% (3/3) | Dec 11, 19:33 UTC | **1 article generated** (X Bot), 50 tweets analyzed, product rotation 1/4, AI-generated content | Manual trigger | `TWITTER_BEARER_TOKEN`, `ANTHROPIC_API_KEY` |
| Post Article Content to X | ✅ | 100% (3/3) | Dec 12, 08:06 UTC | Posted article announcements to @BWSCommunity | Daily (randomized) + after article gen | `TWITTER_*` (4 vars), `ANTHROPIC_API_KEY`, `OXYLABS_*` (2 vars), `PAT_REPOS_AND_WORKFLOW` |
| Weekly X Post | ✅ | 100% (3/3) | Dec 5, 17:13 UTC | Weekly development updates across BWS products | Daily 14:00 UTC (checks content) | `TWITTER_*` (4 vars), `ANTHROPIC_API_KEY`, `PAT_REPOS_AND_WORKFLOW`, `PAT_GITHUB_ACTIONS` |
| Fetch Twitter Partnerships | ✅ | 100% (3/3) | Recent | Partnership announcements from @BWSCommunity | Daily 09:00 UTC | `TWITTER_BEARER_TOKEN`, `ANTHROPIC_API_KEY` |

### Product Education

| Automation | Status | Success Rate | Last Run | Details | Schedule | Credentials |
|------------|--------|--------------|----------|---------|----------|-------------|
| Reply to Product Tweets | ⚠️ | N/A | Dec 11, 16:05 UTC | **0 threads posted** - Waiting for discovery workflow fix, queue empty | 2x daily (10 AM, 4 PM UTC) | `TWITTER_*` (4 vars), `ANTHROPIC_API_KEY` |

### Infrastructure

| Automation | Status | Success Rate | Last Run | Details | Schedule | Credentials |
|------------|--------|--------------|----------|---------|----------|-------------|
| Production Monitoring | ✅ | 100% (3/3) | Dec 12, 06:11 UTC | Monitors health of all automation workflows | Every 6 hours | None (GitHub API) |
| Main Branch Deploy | ✅ | Active | Ongoing | Deploys website changes to production | On push to master | `AWS_*`, `CLOUDFRONT_*` |

### Deprecated Workflows

| Automation | Status | Removed Date | Reason |
|------------|--------|--------------|--------|
| Weekly KOL Analytics | ❌ | Dec 4, 2025 | Not actively used, analytics can be generated manually when needed |
| Fetch Success Stories | ❌ | Dec 2025 | Web scraping approach unreliable |

---

## Complete Workflow Inventory

All GitHub Actions workflows in `.github/workflows/`:

### Production Automations (15 Active)
1. ✅ **content-discovery-scrapfly.yml** → Content Discovery - Crawlee
2. ✅ **discover-docs-pages.yml** → Discover Documentation Pages
3. ✅ **discover-product-tweets.yml** → Discover Product Tweets
4. ✅ **fetch-twitter-partnerships.yml** → Fetch Twitter Partnerships
5. ✅ **generate-articles.yml** → Generate Articles from X Posts
6. ✅ **index-docs-site.yml** → Index Documentation Site
7. ✅ **kol-discovery-morning.yml** → Morning Discovery (Seed-Based)
8. ✅ **kol-discovery-search.yml** → Search-Based Discovery (Dynamic)
9. ✅ **kol-monitor-timelines.yml** → KOL Timeline Monitoring
10. ✅ **kol-reply-cycle.yml** → KOL Reply Cycle
11. ✅ **main-deploy.yml** → Main Branch Deploy
12. ✅ **monitor.yml** → Production Monitoring
13. ✅ **post-article-content.yml** → Post Article Content to X
14. ✅ **reply-to-product-tweets.yml** → Reply to Product Tweets
15. ✅ **weekly-x-post.yml** → Weekly X Post

### Utility & Maintenance Workflows (3)
- **fix-branch.yml** - Automated branch fixing utility
- **rollback.yml** - Deployment rollback utility
- **update-snapshots.yml** - Visual regression test snapshot updates

### Test Workflows (7)
- **test-content-variations.yml** - Content generation testing
- **test-credentials-debug.yml** - Twitter API credential testing
- **test-h-multi-account-scraper.yml** - Multi-account scraping tests
- **test-minimal-reply.yml** - Minimal reply posting tests
- **test-reply-to-kol.yml** - KOL reply testing
- **test-twitter-auth.yml** - Twitter authentication tests
- **test-twitter-posting-ci.yml** - Twitter posting CI tests

### Deprecated/Backup Workflows (3)
- ❌ **deploy.yml.backup** - Old deployment configuration
- ❌ **discover-kols-daily.yml** - Replaced by kol-discovery-morning.yml
- ❌ **reply-kols-daily.yml** - Replaced by kol-reply-cycle.yml
- ❌ **fetch-success-stories.yml** - Deprecated (web scraping unreliable)

**Total**: 28 workflow files (15 production, 3 utility, 7 test, 3 deprecated)

---

## KOL Reply Configuration

Current settings from `scripts/crawling/config/kol-config.json`:

| Setting | Value | Description |
|---------|-------|-------------|
| **Max Replies Per Run** | 5 | Maximum replies posted in a single workflow run |
| **Max Tweets to Evaluate** | 10 | Tweets evaluated before stopping if no replies posted |
| **Max Replies Per Day** | 30 | Daily limit across all runs (currently averaging 2-3/day) |
| **Max Replies Per KOL/Week** | 2 | Prevents over-engaging with same KOL |
| **Min Relevance Score** | 7/10 | Minimum AI relevance threshold for reply |
| **Tweet Freshness Filter** | 24 hours | Only reply to tweets < 24 hours old |
| **Cleanup Threshold** | 48 hours | Remove tweets > 48 hours from queue |
| **Follow KOL Before Reply** | Yes | Anti-spam action |
| **Like Tweet Before Reply** | Yes | Anti-spam action |
| **Image Attachments** | Enabled | Attach product images when available |

**Recent Performance** (Last Run: Dec 12, 07:37 UTC):
- Evaluated: 10 tweets
- Relevance threshold passed: 2 tweets
- Replies posted: 2 (both with images)
- Products mentioned: Multiple
- Daily progress: 2/30 (7%)
- Average relevance score: ~72/100

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

| Total KOLs | Active KOLs | Last Reply | Last Monitored | Engaging Posts Queue |
|------------|-------------|------------|----------------|----------------------|
| **36** | **36** | Dec 10, 2025 | Dec 12, 07:22 UTC | **288 posts** |

**Top KOLs**: @IncomeSharks (688K followers), @cobie, @CryptoRover, @AltcoinSherpa (257K), @aantonop, @SBF_FTX, @CryptoKaleo, @CryptoHayes, @WuBlockchain, @CryptoWendyO, @CryptoRover, @Pentosh1, @CryptoPatel, @CryptoCapo_, @CryptosR_Us, + 21 more

_Note: KOL database is **automatically updated** by discovery workflows. Timeline monitoring runs every 5 hours to populate the engaging posts queue._

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

**Schedule**: 4x daily (randomized between 6:00-22:00 UTC)

**Scripts Used**:
- `scripts/crawling/production/reply-to-kol-posts.js` (queue processor)
- `scripts/crawling/utils/twitter-client.js` (Twitter API v2 posting)
- `scripts/crawling/utils/claude-client.js` (AI evaluation & reply generation with template system)
- `scripts/crawling/utils/kol-utils.js` (KOL data management & freshness filtering)
- `scripts/crawling/utils/schedule-randomizer.js` (anti-spam delays)
- `scripts/crawling/utils/zapier-webhook.js` (reply notifications)

**Strategy**: **Queue-Based Processing + Twitter API v2**
- Reads unprocessed posts from `engaging-posts.json` (populated by Script 2.2.1)
- **NEW (2025-12-04): 24-hour freshness filter** - Only replies to tweets < 24 hours old for maximum engagement
- AI evaluation per tweet (relevance scoring + product matching)
- **NEW (2025-12-04): Structural diversity templates** - 7 reply templates with varied $BWS positioning
- **NEW (2025-12-04): Image attachments** - Automatically attaches product images when available
- **NEW (2025-12-04): Link rotation** - 75% product docs, 25% main site (https://www.bws.ninja)
- **NEW (2025-12-05): Single account (@BWSCommunity)** - Simplified from dual-account fallback system
- AI-generated contextual replies via Claude API
- Posts via Twitter API v2 with anti-spam actions (follow KOL, like tweet)
- Marks posts as `processed: true` to prevent duplicate replies
- Rate limiting: Max 1-3 replies per run (configurable)
- Continue-until-reply logic: Evaluates up to 2x limit if no replies posted
- Randomized scheduling to avoid spam detection (4 random times per day)

**Status**: ✅ **PRODUCTION** - Structural diversity, image attachments, 24h freshness filter, and @BWSCommunity posting active

**Recent Feature Updates (December 2025)**:

**1. 24-Hour Freshness Filter** (2025-12-04):
- **Problem**: Replying to posts up to 7 days old resulted in low engagement and spammy appearance
- **Solution**: Two-tier freshness system
  - **Reply Window**: Only replies to tweets < 24 hours old
  - **Cleanup**: Automatically removes tweets > 48 hours old from queue
  - **Fallback**: Uses `addedAt` for legacy posts without `created_at`
- **Configuration**: `freshnessFilter` in `kol-config.json`
  - `maxTweetAgeHours: 24` - Reply window
  - `cleanupThresholdHours: 48` - Cleanup threshold
  - Can be adjusted for testing (12h, 36h, etc.)
- **Impact**: Higher engagement rates, natural timing, efficient API usage

**2. Structural Diversity Templates** (2025-12-03):
- **Problem**: All replies had same 2-paragraph structure with $BWS at start
- **Solution**: 7 reply templates with varied structures
  1. **Classic** (30%): `$BWS Product:` at start of 2nd paragraph
  2. **Feature List** (15%): Bullet points + `$BWS` at end
  3. **Delayed Cashtag** (15%): Product name first, `$BWS` in 2nd sentence
  4. **Problem-Solution** (15%): Problem → Solution with `$BWS`
  5. **Emoji-Enhanced** (10%): 1-2 contextual emojis (💡🔧📊)
  6. **Stat-Driven** (10%): Leads with metrics/facts
  7. **Question-Led** (5%): Opens with question
- **Configuration**: `scripts/crawling/config/reply-templates.json`
- **Template Tracking**: Each reply records `templateUsed` and `templateName`
- **Anti-Repetition**: Avoids same template 3+ times consecutively
- **Impact**: Natural conversation flow, reduced monotony, varied $BWS positioning

**3. Image Attachments** (2025-12-03):
- **Product Images**: 14 images across 5 products (X Bot, Fan Game Cube, NFT.zK, Blockchain Badges, BWS IPFS)
- **Auto-Selection**: Prioritizes hero images (priority 1) for each product
- **Upload**: Twitter API v1 for media upload, v2 for posting with media_ids
- **Configuration**: `imageAttachments` in `kol-config.json`
  - `enabled: true` - Toggle image attachments
  - `attachOnlyWhenAvailable: true` - Graceful fallback if no images
  - `skipReplyOnUploadFailure: false` - Continue without image if upload fails
- **Tracking**: Records `imageAttached: true/false` and `imagePath` in reply data
- **Impact**: Visual engagement, product showcase, higher reply visibility

**4. Link Rotation** (2025-12-03):
- **Strategy**: Weighted rotation between docs and main site
  - **75%**: Product-specific docs (e.g., `https://docs.bws.ninja/marketplace-solutions/bws.x.bot`)
  - **25%**: Main site (`https://www.bws.ninja`)
- **Product Mapping**: Each product has `docsPath` in `product-highlights.json`
- **Enforcement**: Links required in every reply (placed at end after @BWSCommunity and hashtags)
- **Impact**: Drive traffic to both docs and main site, provide value to readers

**5. Single Account System** (2025-12-05):
- **Account**: @BWSCommunity (TWITTER_* credentials)
- **Previous**: Multi-account fallback system (@BWSXAI → @BWSCommunity) deprecated Dec 5, 2025
- **Reason**: @BWSXAI credentials resulted in 403 Forbidden errors
- **Simplification**: Removed ~140 lines of fallback logic
- **Result**: 100% success rate with @BWSCommunity, cleaner codebase

**Recent Outputs**:
- **Template Distribution**: Varied structures (Classic, Feature List, Emoji-Enhanced, etc.)
- **Image Attachments**: 60%+ of replies include product images
- **Link Inclusion**: 100% of replies include docs or main site links
- **Freshness**: Average tweet age at reply < 12 hours
- **Products Mentioned**: Equal rotation across 8 BWS products (12.5% each)
- **Average Relevance Score**: 72-88/100 (only high-quality tweets selected)

**Configuration Files**:
- `scripts/crawling/config/kol-config.json` - Main configuration
- `scripts/crawling/config/reply-templates.json` - Template definitions
- `scripts/crawling/config/product-highlights.json` - Product features & link rotation
- `scripts/crawling/config/product-images.json` - Manual image mappings

**Data Files**:
- Input: `scripts/crawling/data/kols-data.json`, `scripts/crawling/data/engaging-posts.json`
- Output: `scripts/crawling/data/kol-replies.json`
- Images: `public/assets/images/docs/` (14 images across 5 products)

---

## 2.4 Weekly KOL Analytics

**Workflow File**: `.github/workflows/analyze-kols-weekly.yml` (REMOVED)

**Overview**: ❌ **DEPRECATED** - This workflow has been removed as of December 4, 2025.

**Status**: Workflow and script removed from repository

**Previous Schedule**: Every Sunday at 21:00 UTC (no longer active)

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

**Overview**: ✅ **WORKING** - Automatically posts newly published blog articles to @BWSCommunity Twitter account.

**Schedule**: Daily (randomized between 6:00-22:00 UTC) + after article generation completes

**Scripts Used**:
- `scripts/generate-article-posts.js` (generates post text)
- `scripts/crawling/production/post-article-content.js` (posts to X)
- `scripts/crawling/utils/twitter-client.js` (Twitter API v2)
- `scripts/crawling/utils/claude-client.js` (AI post generation)

**Strategy**: **Twitter API v2 + Claude AI**
- Scans `src/data/articles.ts` for new blog articles
- AI-generated promotional posts via Claude
- Includes article link, docs link, hashtags
- Posts up to 4 articles per run with 60s delays
- Tracks posted articles to avoid duplicates

**Recent Success**: **4/4 success** (100% success rate - Dec 5, 2025)

**Recent Changes** (Dec 5, 2025):
- ✅ Fixed all path issues (script location, imports, data file paths)
- ✅ Switched from @BWSXAI to @BWSCommunity account
- ✅ Removed fallback logic (simplified to single account)
- ✅ Added schedule randomization to avoid detection

**Recent Outputs**:
- ESG Credits (Feature): Tweet ID 1996982223996645653
- ESG Credits (Implementation): Tweet ID 1996982477869420803
- Fan Game Cube (Feature): Tweet ID 1996982731176067204
- Fan Game Cube (Implementation): Tweet ID 1996982984751153279

**Post Format**:
- Technical features with blockchain implementation details
- Product name + feature description + @BWSCommunity + $BWS
- Article URL and docs URL included
- Hashtags: 2 relevant tags per post
- Example: "The platform includes immutable audit trails for ESG data, automated compliance checking against disclosure frameworks, and investor-grade report generation. Built on blockchain for transparent verification. @BWSCommunity $BWS"

**Data Files**:
- Input: Article data in `src/data/articles.ts`
- Output: `scripts/data/article-x-posts.json` (24 posts total, 5 posted, 8 pending, 11 failed from old @BWSXAI attempts)

**Note**: Section 2.4 (Weekly KOL Analytics) has been deprecated and removed. Analytics can be manually generated from `kol-replies.json` data when needed.

---

## 2.5 Weekly X Post

**Workflow File**: `.github/workflows/weekly-x-post.yml`

**Overview**: ✅ **STABLE** - Posts weekly update summaries about BWS development progress, focusing on customer-relevant improvements and new features.

**Schedule**: Daily at 14:00 UTC (checks if sufficient content since last post)

**Status**: ✅ Working correctly after fixes (Dec 5, 2025)

**Scripts Used**:
- `scripts/crawling/production/generate-weekly-x-post.js` (main script)
- `scripts/crawling/utils/twitter-client.js` (Twitter API v2)
- `scripts/crawling/utils/claude-client.js` (AI content generation)

**Strategy**: **Twitter API v2 + GitHub API + Claude AI**
- Fetches commits from tracked GitHub repositories (bws-api-telegram-xbot, bws-backoffice-website-esg, docs.bws.ninja)
- Filters for customer-relevant changes only (new features, improvements, documentation updates)
- AI-generated paragraph summaries via Claude (not bullet lists)
- Posts to @BWSCommunity with project updates
- Tracks posted weeks to avoid duplicates
- Dynamic lookback window (extends if insufficient content)

**Content Focus** (Updated Dec 5, 2025):
- ✅ **Include**: New features, product improvements, user-facing enhancements, documentation updates
- ❌ **Exclude**: Small bug fixes, internal refactoring, infrastructure changes, security patches
- **Format**: Paragraph summaries (3-5 sentences) per product, grouped by theme
- **Special Handling**: Documentation repo updates always included (enhance user understanding)

**Posting Criteria**:
- Minimum 4 customer-relevant changes across all products
- Minimum 5 days since last post
- Lookback window: 14 days (extends up to 60 days if needed)

**Recent Status**: ✅ **STABLE** (Successfully tested and deployed Dec 5, 2025)

**Latest Runs** (Dec 5-6, 2025):
- Dec 5, 17:13 UTC: ✅ SUCCESS
- Dec 5, 17:08 UTC: ✅ SUCCESS
- Dec 5, 17:05 UTC: ✅ SUCCESS

**Recent Fixes** (Dec 5, 2025):
```
Issue #1: Wrong script path in workflow file
Fix: Updated .github/workflows/weekly-x-post.yml with correct path
Commit: c61e90a

Issue #2: Data file location mismatch
Fix: Moved repos-to-track.json to scripts/crawling/production/data/
Commit: f9af4c8

Issue #3: docs.bws.ninja branch name incorrect (main → master)
Fix: Updated repos-to-track.json with correct branch name
Commit: c571ddb

Result: Successfully posted to @BWSCommunity
Tweet URL: https://x.com/BWSCommunity/status/1996991473686835656
```

**Recent Updates** (Dec 5, 2025):
- Added docs.bws.ninja repository tracking
- Changed format from bullet lists to paragraph summaries
- Added customer-relevance filtering
- Updated example to show paragraph format
- Added special handling for documentation repos

**Post Format**:
```
BWS | Coding

This week we deployed [N] updates across [X] BWS products to production, focusing on [key themes].

[Product Name]
[Paragraph summary of customer-relevant changes, 3-5 sentences, grouped by theme]

[Product description from docs]

📚 [product docs URL]

$BWS #Web3 #Blockchain #BWS
```

**Tracked Repositories**:
- bws-api-telegram-xbot (prod) - X Bot
- bws-backoffice-website-esg (staging) - ESG Credits
- docs.bws.ninja (master) - BWS Documentation

**Data Files**:
- Input: `scripts/crawling/production/data/repos-to-track.json`
- Output: `scripts/crawling/production/data/weekly-x-posts-state.json`

---

## 2.6 Production Monitoring

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
- **Total Workflows Monitored**: 16 (Weekly KOL Analytics removed Dec 4, 2025)
- **Health Check**: All monitoring functions operational
- **Recent Alerts**: 403 errors on Weekly X Post (KOL Reply Cycle and Post Article Content resolved Dec 5, 2025)

**Data Files**: None (status only)

---

## 2.7 Article Generation from X Posts

**Workflow File**: `.github/workflows/generate-articles.yml`

**Overview**: ✅ **WORKING** - Automatically generates blog articles from @BWSCommunity product tweets using Claude AI (Sonnet 4.5), with rich documentation images and optimized layouts.

**Schedule**: Manually triggered via GitHub Actions

**Status**: ✅ Fully operational with two-column layout (Dec 9, 2025)

**Scripts Used**:
- `scripts/generate-articles.js` (article generation with Claude AI)
- `scripts/index-docs-site.js` (documentation image extraction)

**Strategy**: **AI-Powered Content Generation + GitBook Image Extraction**
1. Fetches recent tweets from @BWSCommunity X account
2. Identifies product-specific tweets (X Bot, ESG Credits, Fan Game Cube, Blockchain Badges, etc.)
3. Uses Claude AI (Sonnet 4.5) to generate comprehensive article content
4. Extracts product screenshots from docs.bws.ninja documentation
5. Generates Astro components with two-column grid layouts (image + intro paragraph)
6. Applies clearfix to prevent image overlap with styled sections
7. Commits generated articles and triggers deployment

**Key Features**:
- **Two-Column Layout**: Image on left (1fr), intro paragraph on right (1fr)
- **Documentation Images**: 149 product screenshots from docs.bws.ninja (77MB)
- **Image Overlap Prevention**: Clearfix before `.solution-advantages` sections
- **AI Content Quality**: Claude Sonnet 4.5 generates technically accurate content
- **Automated Deployment**: Triggers site rebuild after article generation

**Recent Success** (Dec 9, 2025):
- Generated 4 articles with two-column layouts
- Deployed to production successfully
- Workflow run: 20073234282
- Articles: esg-credits, blockchain-badges, fan-game-cube, x-bot

**Data Files**:
- Input: @BWSCommunity tweets, `public/docs-index.json` (1.5MB, 76 pages)
- Output: `src/components/articles/[Product][Date]MainContent.astro`
- Images: `public/assets/images/docs/[product]/` (149 images, 77MB total)
- Tracking: `scripts/data/processed-article-tweets.json`

**Documentation**:
- `.trees/xai-trackkols/ARTICLE_GENERATION_VERIFICATION_SUMMARY.md`
- `.trees/xai-trackkols/DEPLOYMENT_VERIFICATION_SUMMARY.md`
- `.trees/xai-trackkols/DOCUMENTATION_INDEXER_COMPLETION_SUMMARY.md`

---

## 2.8 Partnership Announcements Fetch

**Workflow File**: `.github/workflows/fetch-twitter-partnerships.yml`

**Overview**: ✅ **STABLE** - Automatically detects and adds partnership announcements from @BWSCommunity to the BWS website news carousel.

**Schedule**: Daily at 9:00 AM UTC

**Status**: ✅ Fixed and working (Dec 5, 2025)

**Scripts Used**:
- `scripts/crawling/production/fetch-twitter-partnerships.js` (main script)
- Uses Twitter API v2 for tweet fetching
- Uses Claude AI (Anthropic) for content summarization

**Strategy**: **Twitter API v2 + Claude AI + Automated Website Updates**
- Monitors @BWSCommunity timeline for tweets starting with "Partnership"
- Extracts partnership images (from main tweet or quoted tweet)
- Fetches partner's X profile image for logo display
- AI-generated title and concise description via Claude
- Automatically updates `src/data/news.ts` with new partnership entry
- Downloads and saves partnership images to `public/assets/images/news/`
- Generates CSS for partnership background images in `public/partnerships.css`
- Tracks processed tweets to avoid duplicates
- Auto-commits and pushes changes to repository

**Recent Status**: ✅ **STABLE** (Fixed, tested, and deployed Dec 5, 2025)

**Latest Runs** (Dec 5, 2025):
- Dec 5, 17:49 UTC: ✅ SUCCESS - No new partnerships (correctly skipped processed tweets)
- Dec 5, 17:40 UTC: ✅ SUCCESS - Added 4 partnerships
- Dec 5, 09:02 UTC: ❌ FAILURE - Path issues (before fixes)

**Recent Execution** (Dec 5, 2025):
```
Run #19971119201: Successfully added 4 partnerships to website
- Rouge Studio (tweet 1991912746615775572)
- Agentify (tweet 1990835882102857755)
- RATI AI (tweet 1983622185538257272)
- Orbler (tweet 1975576723337982186)

Status: ✅ All 4 partnerships live on bws.ninja
Commit: 1f46594 (auto-committed by workflow)
Deployment: Successful (Run #19971605178)
Verification: All partnerships confirmed visible on production site
```

**Recent Fixes** (Dec 5, 2025):
```
Issue #1: Wrong script path in workflow
Fix: Updated workflow from scripts/fetch-twitter-partnerships.js
     to scripts/crawling/production/fetch-twitter-partnerships.js
Commit: 85beb1b

Issue #2: Incorrect relative paths in script
Fix: Updated path resolution from ../ to ../../../
     (NEWS_FILE_PATH, NEWS_IMAGES_DIR, PARTNERSHIP_CSS_FILE)
Commit: 85beb1b

Issue #3: Wrong data file path in workflow
Fix: Updated from scripts/data/processed-tweets.json
     to scripts/crawling/production/data/processed-tweets.json
Commit: 85beb1b

Result: All path issues resolved, workflow operational
Verified: 4 partnerships added and deployed successfully
```

**Partnership Detection**:
- Filters tweets starting with "Partnership"
- Formats: "Partnership | @Name", "Partnership: Name", "Partnership with Name"
- Extracts partner X username for profile image fetching
- Falls back to BWS logo if no image found

**Content Generation** (Claude AI):
- Title: 3-word partner name extraction
- Description: One sentence (max 150 chars) focusing on BWS platform/API usage
- Partner username extraction for profile linking
- Highlights partner name with rose-colored span in description

**Website Integration**:
- Adds entries to beginning of news carousel (`src/data/news.ts`)
- Each entry includes:
  - Partnership title and description
  - Partner logo (circular, like X profile pics)
  - Background image from tweet
  - "View Announcement" button linking to tweet
  - Unique CSS class for background styling

**Data Files**:
- State: `scripts/crawling/production/data/processed-tweets.json`
- Output: `src/data/news.ts` (TypeScript news carousel data)
- Images: `public/assets/images/news/partnership-*.jpg`
- CSS: `public/partnerships.css` (auto-generated styles)

**Error Handling**:
- Creates fix branch and PR on failure
- Tracks failure count in state file
- Continues workflow with `continue-on-error: true`
- Auto-creates GitHub issue for tracking

---

## 2.9 Product-Specific Educational Threads

**Workflow Files**:
- `.github/workflows/discover-product-tweets.yml` (Discovery)
- `.github/workflows/reply-to-product-tweets.yml` (Reply Automation)

**Overview**: ✅ **NEW** (Dec 6, 2025) - Discovers tweets about specific BWS products and posts educational multi-tweet threads to drive customer acquisition. Unlike general KOL engagement (2.3), this automation targets users discussing specific pain points that BWS products solve.

**Schedule**:
- Discovery: Daily at 8:00 AM UTC
- Replies: Twice daily at 10:00 AM and 4:00 PM UTC

**Status**: ✅ Implemented and ready for deployment

**Products Covered**:
1. **Blockchain Badges** - Verifiable digital credentials
2. **BWS IPFS** - Decentralized file storage
3. **NFT.zK** - Wallet-free NFT distribution
4. **Blockchain Hash** - Mutable blockchain database

**Scripts Used**:
- `scripts/crawling/production/discover-product-tweets.js` - Product-specific tweet discovery
- `scripts/crawling/production/reply-to-product-tweets.js` - Educational thread processor
- `scripts/crawling/utils/thread-generator.js` - Multi-tweet thread generation (3 templates)
- `scripts/crawling/utils/twitter-thread-client.js` - Thread posting client
- `scripts/crawling/utils/docs-fetcher.js` - Documentation content loader

**Strategy**: **Product-Specific Search + Multi-Tweet Educational Threads + Conversion Focus**

**Discovery Approach**:
- 20 search queries across 4 products (5 queries each)
- Query categories:
  - **Blockchain Badges**: credentials, education, fraud, professional badges, digital identity
  - **BWS IPFS**: IPFS storage, NFT metadata, decentralized storage, setup problems
  - **NFT.zK**: NFT collections, distribution, wallet friction, utility, brand NFTs
  - **Blockchain Hash**: blockchain database, Web3 development, wallets, on-chain storage
- Engagement filtering: minimum likes (3-5), retweets (1), views (50-100)
- Product tagging and isolation
- 24-hour freshness filter

**Thread Structure** (3-4 tweets per thread):
Three template types with weighted rotation:
1. **How-To Guide** (40%):
   - Tweet 1: Hook - Acknowledge pain point
   - Tweet 2: Solution features with $BWS
   - Tweet 3: Getting started steps
   - Tweet 4: CTA + docs link

2. **Problem-Solution** (40%):
   - Tweet 1: Amplify the problem
   - Tweet 2: Solution features
   - Tweet 3: Real-world use case
   - Tweet 4: CTA + docs link

3. **Feature Showcase** (20%):
   - Tweet 1: Hook with specific feature
   - Tweet 2: Technical details
   - Tweet 3: Business benefits
   - Tweet 4: CTA + docs link

**Content Generation**:
- Claude AI evaluates tweet relevance (70+ threshold)
- Loads product documentation for context
- Generates educational thread matching template
- Strict product isolation (only one BWS product per thread)
- Includes call-to-action and docs.bws.ninja link
- Mentions @BWSCommunity and $BWS cashtag

**Product Isolation**:
- Each thread focuses on exactly one BWS product
- Validation before posting prevents mixed products
- AI prompt emphasizes single-product focus
- Automated checks scan for other product mentions

**Anti-Spam Measures**:
- 2-minute delay between threads
- 5-second delay between tweets in thread
- Follow author and like tweet before replying
- Product rotation to balance coverage

**Target Volume**:
- 2-4 educational threads per day total
- 0.5-1 thread per product daily
- Smart product rotation prevents consecutive threads about same product

**Recent Execution**: Not yet deployed (implementation completed Dec 6, 2025)

**Configuration Files**:
- `scripts/crawling/config/product-search-queries.json` - 20 search queries across 4 products
- `scripts/crawling/config/product-reply-config.json` - Reply automation settings

**Data Files**:
- Queue: `scripts/crawling/data/product-discovery-queue.json` (discovered tweets by product)
- Tracking: `scripts/crawling/data/product-replies.json` (posted threads and stats)
- Cache: `scripts/crawling/data/docs-cache/*.json` (24h documentation cache)

**Thread Example** (Blockchain Badges - How-To template):
```
Tweet 1:
Credential fraud costs organizations $10B annually. Universities need
verifiable proof that can't be faked.

Tweet 2:
Blockchain Badges by $BWS solves this:
• Issue certificates on blockchain
• Immutable proof of achievements
• Public verification URLs
• Integrates with existing LMS

Tweet 3:
Getting started (3 steps):
1. Connect your LMS via API
2. Design badge templates
3. Issue to students

No blockchain expertise needed.

Tweet 4:
See how universities are preventing diploma fraud with blockchain credentials.

📚 Full docs: https://docs.bws.ninja/marketplace-solutions/bws.blockchain.badges

@BWSCommunity $BWS
```

**Success Metrics**:
- Discovery: 10-20 relevant tweets per product per day
- Relevance: >70% of discovered tweets pass threshold
- Threads: 2-4 posted daily with balanced product rotation
- Quality: 100% product isolation, 100% CTA inclusion
- Engagement: >5 likes average per thread

**Key Differences from KOL Reply (2.3)**:
- **Focus**: Product education vs. general engagement
- **Format**: 3-4 tweet threads vs. single reply
- **Content**: How-to guides and conversion focus vs. contextual mentions
- **Search**: Product-specific queries vs. general crypto/token discussions
- **Goal**: Customer acquisition vs. brand awareness

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

## Recent Updates & Fixes

### December 5, 2025: Switch to @BWSCommunity Account

**Problem**: @BWSXAI account credentials resulted in 403 Forbidden errors on all Twitter API v2 posting attempts.

**Solution**: Switched all workflows to use @BWSCommunity account exclusively.

**Changes Made**:
1. **KOL Reply Cycle** - Now uses @BWSCommunity (TWITTER_* credentials)
2. **Post Article Content** - Now uses @BWSCommunity (TWITTER_* credentials)
3. **Code Simplification** - Removed ~140 lines of multi-account fallback logic
4. **Path Fixes** - Fixed script locations and import paths in Post Article Content workflow

**Results**:
- ✅ KOL Reply Cycle: 100% success rate with @BWSCommunity
- ✅ Post Article Content: 100% success rate (4/4 posts on Dec 5, 2025)
- ✅ Cleaner, more maintainable codebase
- ✅ Single account path eliminates complexity

**Remaining Issue**:
- ⚠️ Weekly X Post: Still experiencing 403 errors (25% success rate) - needs investigation

### December 4, 2025: Workflow Cleanup

**Removed**: Weekly KOL Analytics workflow
- **Reason**: Not actively used, analytics can be generated manually when needed
- **Files Deleted**:
  - `.github/workflows/analyze-kols-weekly.yml`
  - `scripts/crawling/production/analyze-kol-engagement.js`
  - Helper functions from `kol-utils.js`

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
