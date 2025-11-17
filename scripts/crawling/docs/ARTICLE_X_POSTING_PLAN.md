# Article-to-X Posting Integration Plan

**Date**: 2025-11-11
**Goal**: Automatically generate and post X (Twitter) content based on newly created articles, linking to docs.bws.ninja pages

---

## Current Article Generation System

### How Articles Are Created

**Workflow**: `.github/workflows/generate-articles.yml`
- **Trigger**: Daily at 10:00 AM UTC (1 hour after partnerships fetch)
- **Source**: Fetches tweets from @BWSCommunity
- **Process**:
  1. Fetches recent tweets from @BWSCommunity (max 50)
  2. Classifies tweets by product using Anthropic Claude
  3. Generates full article pages with Astro components
  4. Creates success story carousel entries

**Script**: `scripts/generate-articles.js`
- **Input**: Twitter posts from @BWSCommunity
- **Output**:
  - Article metadata: `src/data/articles.ts`
  - Article pages: `src/pages/articles/{product}-{date}.astro`
  - Article components: `src/components/articles/{ProductDate}MainContent.astro`
  - Images: `public/assets/images/articles/`
  - Tracking: `scripts/data/processed-article-tweets.json`

### Article Structure

Each article includes:
- **Slug**: `x-bot-2025-11-10`
- **Product**: One of: X Bot, Blockchain Badges, ESG Credits, Fan Game Cube
- **Title**: SEO-optimized headline (60-80 chars)
- **Subtitle**: Compelling description (40-60 words)
- **Publish Date**: ISO timestamp
- **Featured Image**: Product screenshot or fallback
- **SEO Description**: Meta description (150-160 chars)
- **Content**: 3-5 sections with:
  - Product explanation
  - Key features
  - Real-world use cases
  - Recent updates
  - **Links to docs.bws.ninja** (embedded in content)

### Current Articles (Last 10 days)

```
📰 Recent Articles Generated:
- x-bot-2025-11-10
- blockchain-badges-2025-11-10
- esg-credits-2025-11-10
- fan-game-cube-2025-11-10
- blockchain-badges-2025-11-09
- blockchain-badges-2025-11-08
- blockchain-badges-2025-11-07
... (daily generation)
```

### Article URLs

**Website URLs**:
```
https://www.bws.ninja/articles/{slug}
Example: https://www.bws.ninja/articles/x-bot-2025-11-10
```

**Docs URLs** (linked in articles):
```
https://docs.bws.ninja/telegram-bots/x-bot
https://docs.bws.ninja/marketplace-solutions/bws.blockchain.badges
https://docs.bws.ninja/marketplace-solutions/bws.esg.credits
https://docs.bws.ninja/marketplace-solutions/bws.nft.gamecube
https://docs.bws.ninja/solutions/bws.blockchain.hash
https://docs.bws.ninja/solutions/bws.blockchain.save
https://docs.bws.ninja/solutions/bws.ipfs.upload
https://docs.bws.ninja/solutions/bws.nft.zk
```

---

## Proposed Solution: Article-to-X Posting Workflow

### Strategy

**Goal**: For each newly created article, automatically generate and post 2-4 X posts that:
1. Highlight different aspects of the article
2. Link to specific sections of docs.bws.ninja
3. Drive traffic to both www.bws.ninja/articles AND docs.bws.ninja
4. Build credibility for @BWSXAI account (solve 403 restriction via activity)

### Posting Schedule

**Option A: Immediate Posting** (Recommended)
- Post 2-3 tweets immediately after article generation
- Spread posts over 2-4 hours
- Example schedule:
  - 10:30 AM UTC: Article announcement + docs link
  - 12:00 PM UTC: Key feature highlight + specific docs section
  - 2:00 PM UTC: Use case + marketplace link

**Option B: Daily Batch**
- Generate posts during article creation (10 AM UTC)
- Queue posts for BWSXAI posting workflow (6:30, 12:00, 15:30, 21:00 UTC)
- Spreads content across the day

### Post Types (Per Article)

**Post 1: Article Announcement** (Priority: High)
```
Purpose: Drive traffic to new article
Content:
  - Hook: Problem statement from article subtitle
  - Solution: Product name + key benefit
  - CTA: Link to article OR primary docs page
  - Hashtags: #Web3 #Blockchain #{Product}

Example:
"Managing crypto communities requires constant manual monitoring.

@BWSCommunity X Bot automates mention tracking, KOL analytics & leaderboards—all in Telegram.

Learn how: https://docs.bws.ninja/telegram-bots/x-bot

#CryptoCommunity #Web3Tools"
```

**Post 2: Deep Dive Feature** (Priority: Medium)
```
Purpose: Highlight specific product capability
Content:
  - Feature spotlight
  - Technical detail or benefit
  - Link to specific docs section
  - More technical hashtags

Example:
"X Bot's leaderboard system goes beyond basic metrics:

✓ Project-level scoring
✓ KOL performance tracking
✓ Custom date filtering
✓ Real-time sync from X to Telegram

Setup in < 1 min: https://docs.bws.ninja/telegram-bots/x-bot#setup

#Analytics #CommunityManagement"
```

**Post 3: Use Case / Success Story** (Priority: Medium)
```
Purpose: Social proof and real-world validation
Content:
  - Real project name
  - Specific use case
  - Results or benefits
  - Link to marketplace or article

Example:
"4K Token deployed X Bot PRO for community-driven airdrop competitions.

The Barmy Army tracks engagement across multiple projects they support.

Real adoption. Real results.

Explore solutions: https://www.bws.ninja/marketplace/telegram-xbot.html

#CaseStudy #Community"
```

**Post 4: Education / Quick Tip** (Priority: Low, Optional)
```
Purpose: Provide immediate value
Content:
  - Quick tip or best practice
  - Actionable insight from article
  - Link to detailed guide

Example:
"Pro tip: Set up custom mention filters in X Bot to track competitor mentions.

Monitor market sentiment while you sleep.

Full configuration guide: https://docs.bws.ninja/telegram-bots/x-bot#configuration

#CryptoIntel #Automation"
```

---

## Implementation Plan

### Phase 1: Create Post Generation Script

**New File**: `scripts/generate-article-posts.js`

**Functionality**:
1. **Load newly created articles** from `articles.ts`
2. **Load processed posts tracking** from `scripts/data/article-x-posts.json`
3. **For each new article**:
   - Extract key information (product, title, subtitle, content)
   - Load relevant docs URLs from `docs-index.json`
   - Call Anthropic API to generate 2-4 posts
   - Save posts to `scripts/data/article-x-posts.json`
4. **Track processed articles** to avoid duplicates

**Anthropic API Call**:
```javascript
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 2000,
  system: `You are a Web3 marketing expert writing X (Twitter) posts for @BWSXAI.

Your goal: Create engaging, informative posts that drive traffic to docs.bws.ninja and article pages.

Style Guide:
- Clear, direct language
- Technical but accessible
- Value-first approach
- Strong CTAs
- Use emojis sparingly (1-2 max)
- Include relevant hashtags (2-3 max)
- Link placement matters (mid-post or end)
- Character count: 200-270 (leaves room for URL)

Avoid:
- Overhype or buzzwords
- Generic statements
- Multiple exclamation points
- Salesy language
- More than 3 hashtags`,

  messages: [{
    role: "user",
    content: `Generate 3 X posts for this article:

**Product**: ${article.product}
**Title**: ${article.title}
**Subtitle**: ${article.subtitle}
**Article URL**: https://www.bws.ninja/articles/${article.slug}
**Primary Docs URL**: ${docsUrl}
**Additional Docs**: ${additionalDocsUrls.join(', ')}

**Article Key Points**:
${articleKeyPoints}

**Target Audience**: Crypto project founders, community managers, Web3 developers

Create 3 posts:
1. Article announcement (link to article OR docs)
2. Feature highlight (link to specific docs section)
3. Use case/benefit (link to marketplace page)

Return as JSON array:
[
  {
    "type": "announcement",
    "text": "post text here",
    "url": "https://docs.bws.ninja/...",
    "hashtags": ["Web3", "Community"],
    "priority": "high"
  },
  ...
]`
  }]
});
```

### Phase 2: Integrate with Existing Workflows

**Option A: Add to Article Generation Workflow** (Recommended)

Modify `.github/workflows/generate-articles.yml`:

```yaml
- name: Generate X posts for new articles
  id: generate_posts
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  run: |
    node scripts/generate-article-posts.js
    echo "posts_generated=true" >> $GITHUB_OUTPUT

- name: Commit X posts data
  if: steps.generate_posts.outputs.posts_generated == 'true'
  run: |
    git add scripts/data/article-x-posts.json
    git commit -m "Generate X posts for new articles" || true
```

**Option B: Separate Workflow** (More flexible)

Create `.github/workflows/post-article-content.yml`:

```yaml
name: Post Article Content to X

on:
  workflow_run:
    workflows: ["Generate Articles from X Posts"]
    types:
      - completed
  workflow_dispatch:

jobs:
  generate-posts:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install @anthropic-ai/sdk

      - name: Generate X posts for articles
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: node scripts/generate-article-posts.js

      - name: Commit generated posts
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add scripts/data/article-x-posts.json
          git commit -m "Generate X posts for articles" || echo "No changes"
          git push

  post-to-x:
    needs: generate-posts
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install twitter-api-v2

      - name: Post to X
        env:
          BWSXAI_TWITTER_API_KEY: ${{ secrets.BWSXAI_TWITTER_API_KEY }}
          BWSXAI_TWITTER_API_SECRET: ${{ secrets.BWSXAI_TWITTER_API_SECRET }}
          BWSXAI_TWITTER_ACCESS_TOKEN: ${{ secrets.BWSXAI_TWITTER_ACCESS_TOKEN }}
          BWSXAI_TWITTER_ACCESS_SECRET: ${{ secrets.BWSXAI_TWITTER_ACCESS_SECRET }}
        run: node scripts/post-article-content.js
```

### Phase 3: Create Posting Script

**New File**: `scripts/post-article-content.js`

**Functionality**:
1. **Load queued posts** from `article-x-posts.json`
2. **Filter unpublished posts** (status !== 'posted')
3. **Sort by priority** (high → medium → low)
4. **Post to X**:
   - Respect rate limits (use regular tweet, not reply)
   - Add URL to post text
   - Track success/failure
   - Update post status in JSON
5. **Implement posting schedule**:
   - Option A: Post all immediately (spread over 2-4 hours)
   - Option B: Post 1-2 per run, integrate with existing schedules
6. **Error handling**:
   - Retry failed posts (not 403 errors)
   - Log all attempts
   - Alert on persistent failures

**Data Structure**: `scripts/data/article-x-posts.json`

```json
{
  "posts": [
    {
      "id": "uuid",
      "articleSlug": "x-bot-2025-11-10",
      "product": "X Bot",
      "type": "announcement",
      "text": "Managing crypto communities requires...",
      "url": "https://docs.bws.ninja/telegram-bots/x-bot",
      "hashtags": ["Web3", "Community"],
      "priority": "high",
      "status": "pending",
      "createdAt": "2025-11-10T10:05:00Z",
      "scheduledFor": "2025-11-10T10:30:00Z",
      "postedAt": null,
      "tweetId": null,
      "error": null
    },
    ...
  ],
  "metadata": {
    "lastGenerated": "2025-11-10T10:05:00Z",
    "totalPosts": 12,
    "postedCount": 8,
    "pendingCount": 4,
    "failedCount": 0
  }
}
```

---

## Docs URL Mapping

### Product → Docs URL Mapping

```javascript
const PRODUCT_DOCS_URLS = {
  'X Bot': {
    primary: 'https://docs.bws.ninja/telegram-bots/x-bot',
    sections: [
      'https://docs.bws.ninja/telegram-bots/x-bot#setup',
      'https://docs.bws.ninja/telegram-bots/x-bot#features',
      'https://docs.bws.ninja/telegram-bots/x-bot#leaderboards'
    ],
    marketplace: 'https://www.bws.ninja/marketplace/telegram-xbot.html'
  },
  'Blockchain Badges': {
    primary: 'https://docs.bws.ninja/marketplace-solutions/bws.blockchain.badges',
    sections: [
      'https://docs.bws.ninja/marketplace-solutions/bws.blockchain.badges#use-cases',
      'https://docs.bws.ninja/marketplace-solutions/bws.blockchain.badges#api'
    ],
    marketplace: 'https://www.bws.ninja/marketplace/blockchain-badges.html'
  },
  'ESG Credits': {
    primary: 'https://docs.bws.ninja/marketplace-solutions/bws.esg.credits',
    sections: [
      'https://docs.bws.ninja/marketplace-solutions/bws.esg.credits#features',
      'https://docs.bws.ninja/marketplace-solutions/bws.esg.credits#integration'
    ],
    marketplace: 'https://www.bws.ninja/marketplace/esg-credits.html'
  },
  'Fan Game Cube': {
    primary: 'https://docs.bws.ninja/marketplace-solutions/bws.nft.gamecube',
    sections: [
      'https://docs.bws.ninja/marketplace-solutions/bws.nft.gamecube#how-it-works',
      'https://docs.bws.ninja/marketplace-solutions/bws.nft.gamecube#revenue-model'
    ],
    marketplace: 'https://www.bws.ninja/marketplace/nft-gamecube.html'
  }
};
```

### Dynamic URL Discovery

Use existing `scripts/data/docs-index.json`:

```javascript
function getDocsUrlsForProduct(product, docsIndex) {
  // Find all pages matching product
  const productPages = docsIndex.pages.filter(p => p.product === product);

  return {
    primary: productPages[0]?.url || 'https://docs.bws.ninja/',
    sections: productPages.slice(1, 4).map(p => p.url),
    keywords: productPages[0]?.keywords || [],
    useCases: productPages[0]?.useCases || []
  };
}
```

---

## Success Metrics

### KPIs to Track

1. **Posting Success Rate**
   - Target: >80% success rate
   - Track: Regular tweets vs replies (replies = 403)

2. **Engagement Metrics**
   - Impressions per post
   - Clicks on docs.bws.ninja links
   - Clicks on article links
   - Retweets and likes

3. **Account Health**
   - Tweet count growth
   - Follower growth
   - When reply restrictions are lifted (can post replies)

4. **Traffic Metrics**
   - Referral traffic from X to docs.bws.ninja
   - Referral traffic from X to www.bws.ninja/articles
   - Time on page for X referrals

### Monitoring

```javascript
// Add to scripts/kols/utils/api-usage-logger.js
function logArticlePost(data) {
  return {
    timestamp: new Date().toISOString(),
    articleSlug: data.articleSlug,
    product: data.product,
    postType: data.type,
    tweetId: data.tweetId,
    url: data.url,
    status: data.status,
    error: data.error || null
  };
}
```

---

## Next Steps

### Immediate Actions

1. **Create `generate-article-posts.js`**
   - Load articles from `articles.ts`
   - Call Anthropic API
   - Generate post variations
   - Save to `article-x-posts.json`

2. **Create `post-article-content.js`**
   - Load queued posts
   - Post to X (regular tweets, NOT replies)
   - Track status
   - Update JSON

3. **Test End-to-End**
   - Generate posts for existing articles
   - Post manually to verify format
   - Check link tracking
   - Verify docs.bws.ninja traffic

4. **Integrate with Workflows**
   - Add to article generation workflow OR
   - Create separate posting workflow
   - Schedule appropriately

### Long-term Enhancements

1. **A/B Testing**
   - Test different post formats
   - Test link placement (mid vs end)
   - Test hashtag combinations
   - Measure engagement differences

2. **Thread Support**
   - Create 2-3 tweet threads for complex articles
   - First tweet: Hook
   - Second tweet: Details + link
   - Third tweet: CTA

3. **Image Integration**
   - Attach article featured image to posts
   - Create custom social media cards
   - Use docs screenshots

4. **Scheduling Optimization**
   - Analyze best posting times
   - Distribute posts across timezones
   - Avoid posting during low-engagement windows

---

## Timeline

| Phase | Task | Duration | Status |
|-------|------|----------|--------|
| 1 | Create `generate-article-posts.js` | 3-4 hours | Not Started |
| 1 | Create `post-article-content.js` | 2-3 hours | Not Started |
| 1 | Create `article-x-posts.json` schema | 30 min | Not Started |
| 2 | Test post generation locally | 1 hour | Not Started |
| 2 | Test posting to X (manual) | 1 hour | Not Started |
| 3 | Integrate with workflows | 1-2 hours | Not Started |
| 3 | Deploy and monitor | 1 week | Not Started |
| 4 | Analyze metrics and optimize | Ongoing | Not Started |

**Total Estimated Time**: 8-12 hours development + ongoing optimization

---

## Risk Mitigation

### Risk 1: 403 Errors on Regular Tweets
**Likelihood**: Low (test workflow succeeded)
**Mitigation**:
- Regular tweets work (verified)
- Only replies fail (403)
- This solution uses regular tweets
- Should post successfully

### Risk 2: Content Quality
**Likelihood**: Medium
**Mitigation**:
- Use Claude Sonnet (high quality)
- Provide detailed prompts
- Review first 10-20 posts manually
- Iterate on prompt based on results

### Risk 3: Rate Limits
**Likelihood**: Low (Basic tier = 100 posts/24h)
**Mitigation**:
- 4 articles/day × 3 posts = 12 posts/day
- Well under 100 posts/day limit
- Space posts 2-4 hours apart
- Track with API usage logger

### Risk 4: Duplicate Content
**Likelihood**: Medium
**Mitigation**:
- Track processed articles
- Check `article-x-posts.json` before generating
- Use article slug as unique identifier
- Add `lastProcessedDate` check

---

**Status**: Proposal Ready
**Next Action**: Review plan → Implement Phase 1
