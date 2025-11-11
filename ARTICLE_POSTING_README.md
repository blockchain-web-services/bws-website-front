# Article-to-X Posting System

**Complete automation for posting BWS article content to X (Twitter) via @BWSXAI**

## 📋 Overview

This system automatically generates and posts high-quality X content from BWS articles, linking back to docs.bws.ninja pages to drive traffic and engagement.

### Key Features
- ✅ **AI-Powered Post Generation**: Uses Claude Sonnet 4.5 to create engaging, professional posts
- ✅ **Automated Posting**: Regular tweets (not replies) to avoid account restrictions
- ✅ **Smart Scheduling**: Posts 2-4 tweets per article with priority-based queueing
- ✅ **Rate Limit Safe**: Conservative posting (4 posts/run, 30s delays)
- ✅ **Full Tracking**: Tracks all post statuses, tweet IDs, and URLs
- ✅ **GitHub Automation**: Workflows for generation and posting

## 🏗️ Architecture

### Components

#### 1. **generate-article-posts.js**
Generates X posts from articles using Anthropic API.

**Location**: `scripts/generate-article-posts.js`

**What it does**:
- Loads article metadata from `src/data/articles.ts`
- Loads docs mapping from `scripts/data/docs-index.json`
- Checks which articles already have posts
- For each new article, calls Claude API to generate 3 posts:
  - **Announcement** (high priority): Introduces product/article
  - **Feature Highlight** (medium): Focuses on specific capability
  - **Use Case** (medium): Real-world scenario/story
- Saves generated posts to `scripts/data/article-x-posts.json`

**Environment Variables**:
```bash
ANTHROPIC_API_KEY=sk-ant-...  # Required
```

**Run Manually**:
```bash
cd scripts
node generate-article-posts.js
```

**Output Example**:
```
🤖 Generating posts for: X Bot: Automate Community Tracking
   Product: X Bot
   Docs URL: https://docs.bws.ninja/telegram-bots/x-bot
   ✅ Generated 3 posts
```

#### 2. **post-article-content.js**
Posts generated content to X (Twitter).

**Location**: `scripts/post-article-content.js`

**What it does**:
- Loads posts from `scripts/data/article-x-posts.json`
- Filters for `status === 'pending'` posts
- Sorts by priority (high first), then by age (oldest first)
- Posts up to 4 tweets per run
- Waits 30 seconds between posts
- Tracks success/failure and updates post status
- Saves updated data back to JSON

**Environment Variables**:
```bash
BWSXAI_TWITTER_API_KEY=...           # Required
BWSXAI_TWITTER_API_SECRET=...        # Required
BWSXAI_TWITTER_ACCESS_TOKEN=...      # Required
BWSXAI_TWITTER_ACCESS_SECRET=...     # Required
```

**Run Manually**:
```bash
cd scripts
node post-article-content.js
```

**Output Example**:
```
[1/4] ----------------------------------------

📤 Posting tweet for X Bot...
   Type: announcement
   Priority: high
   ✅ Posted successfully!
   Tweet ID: 1988149840774066548
   URL: https://twitter.com/i/web/status/1988149840774066548
```

#### 3. **article-x-posts.json**
Data store for all generated posts.

**Location**: `scripts/data/article-x-posts.json`

**Structure**:
```json
{
  "metadata": {
    "lastGenerated": "2025-11-11T07:39:54.658Z",
    "lastPosted": "2025-11-11T08:42:13.102Z",
    "totalPosts": 12,
    "totalArticles": 4,
    "pendingPosts": 8,
    "postedCount": 4,
    "failedCount": 0
  },
  "posts": [
    {
      "id": "98ab83f5-bd83-4f85-99f0-adaff08093cc",
      "articleSlug": "x-bot-2025-11-10",
      "product": "X Bot",
      "type": "announcement",
      "text": "Stop manually tracking community mentions...",
      "hashtags": ["XBot", "CommunityManagement"],
      "priority": "high",
      "linkedUrl": "https://docs.bws.ninja/telegram-bots/x-bot",
      "status": "posted",
      "postedAt": "2025-11-11T08:40:15.123Z",
      "tweetId": "1988149840774066548",
      "tweetUrl": "https://twitter.com/i/web/status/1988149840774066548",
      "generatedAt": "2025-11-11T07:39:24.927Z",
      "metadata": {
        "articleTitle": "X Bot: Automate Community Tracking...",
        "articlePublishDate": "2025-11-10T10:04:31.897Z",
        "characterCount": 236
      }
    }
  ]
}
```

**Post Status Values**:
- `pending`: Ready to post
- `posted`: Successfully posted to X
- `failed`: Post attempt failed (see `error` field)

#### 4. **post-article-content.yml**
GitHub Actions workflow for automation.

**Location**: `.github/workflows/post-article-content.yml`

**Triggers**:
- After "Generate Articles" workflow completes
- Daily at 12:00 PM UTC
- Manual dispatch (with configurable max_posts)

**What it does**:
1. Installs dependencies (@anthropic-ai/sdk, twitter-api-v2)
2. Runs `generate-article-posts.js` to create posts for new articles
3. Runs `post-article-content.js` to post to X
4. Commits updated `article-x-posts.json` back to repo
5. Creates summary with posting stats

**Required GitHub Secrets**:
```
ANTHROPIC_API_KEY
BWSXAI_TWITTER_API_KEY
BWSXAI_TWITTER_API_SECRET
BWSXAI_TWITTER_ACCESS_TOKEN
BWSXAI_TWITTER_ACCESS_SECRET
```

## 🔄 Workflow

### Automated Flow (Production)

```
┌─────────────────────┐
│  New Article        │
│  Created            │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Generate Articles  │
│  Workflow           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Post Article       │ ◄── Also runs daily at 12 PM UTC
│  Content Workflow   │ ◄── Also manual trigger
└──────────┬──────────┘
           │
           ├──► generate-article-posts.js (if new articles)
           │    └──► Claude API: Generate 3 posts per article
           │
           ├──► post-article-content.js
           │    └──► Twitter API: Post up to 4 tweets
           │
           └──► Git commit & push (update article-x-posts.json)
```

### Manual Flow (Development/Testing)

```bash
# 1. Generate posts for articles
cd scripts
node generate-article-posts.js

# 2. Review generated posts
cat data/article-x-posts.json

# 3. Post to X (up to 4 posts)
node post-article-content.js

# 4. Check @BWSXAI on Twitter
open https://twitter.com/BWSXAI
```

## 📊 Content Strategy

### Post Types & Examples

#### Announcement (High Priority)
**Purpose**: Introduce article/product, lead with problem solved

**Example**:
```
Stop manually tracking community mentions and engagement. X Bot
automates mention tracking across X and Telegram with real-time
analytics and leaderboards to reward your most active supporters.
https://docs.bws.ninja/telegram-bots/x-bot
```

#### Feature Highlight (Medium Priority)
**Purpose**: Focus on ONE specific capability with use case

**Example**:
```
X Bot's automated leaderboard system tracks every mention, reply,
and share—then ranks your top contributors in real-time. Perfect
for running engagement campaigns and identifying your true community
champions.
https://www.bws.ninja/articles/x-bot-2025-11-10
```

#### Use Case (Medium Priority)
**Purpose**: Tell a story showing before/after or problem/solution

**Example**:
```
Launch day chaos: your team scrambles to track hundreds of mentions
manually. With X Bot, one project automated their entire community
tracking—identifying 847 supporters and distributing rewards accurately
in 24 hours.
https://docs.bws.ninja/telegram-bots/x-bot
```

### Content Guidelines

**Character Limits**:
- Target: 200-270 characters (including URL)
- Leaves room for Twitter's link wrapping

**Hashtags**:
- 2-3 relevant hashtags per post
- Product-specific + industry/feature tags
- Examples: `#Web3`, `#CommunityManagement`, `#ESG`, `#NFTUtility`

**Links**:
- Prioritize docs.bws.ninja links (primary goal)
- Alternate with www.bws.ninja/articles links
- Place strategically (usually at end)

**Style**:
- Clear, technical but accessible
- Value-first approach (benefits before features)
- Active voice, professional yet engaging
- NO emojis in generated text
- Focus on solving real problems

## 📈 Posting Strategy

### Rate Limits & Safety

**Twitter API Limits (Basic Tier)**:
- 100 posts per 24 hours
- We post conservatively: 4 posts/run, 12/day max

**Our Safety Measures**:
- Max 4 posts per workflow run
- 30-second delays between posts
- Priority-based queueing (high priority first)
- Automatic error handling (429 rate limit detection)
- Post status tracking (prevent duplicates)

### Current Schedule

**Daily at 12:00 PM UTC**:
- Checks for new articles
- Generates posts if needed
- Posts up to 4 pending tweets

**After Article Generation**:
- Automatically triggered when new articles published
- Generates and posts content immediately

### Expected Volume

With 1 new article per day:
- 3 posts generated per article
- 1 announcement posted immediately (high priority)
- 2 additional posts queued (medium priority)
- Approximately 3-4 posts per day total

## 🔧 Maintenance

### Monitoring

**Check Posting Status**:
```bash
node -e "const d = require('./scripts/data/article-x-posts.json'); console.log('Pending:', d.metadata.pendingPosts, 'Posted:', d.metadata.postedCount, 'Failed:', d.metadata.failedCount);"
```

**View Recent Posts**:
```bash
node -e "const d = require('./scripts/data/article-x-posts.json'); d.posts.filter(p => p.status === 'posted').slice(-5).forEach(p => console.log(p.postedAt, p.product, p.tweetUrl));"
```

**Check for Failures**:
```bash
node -e "const d = require('./scripts/data/article-x-posts.json'); d.posts.filter(p => p.status === 'failed').forEach(p => console.log(p.product, p.type, p.error));"
```

### Troubleshooting

#### Posts not generating?
1. Check `ANTHROPIC_API_KEY` in GitHub Secrets
2. Verify articles exist in `src/data/articles.ts`
3. Check workflow logs: Actions → Post Article Content

#### Posts not posting?
1. Check Twitter credentials in GitHub Secrets
2. Verify account not restricted (check @BWSXAI profile)
3. Check for rate limits (429 errors in logs)
4. Review `article-x-posts.json` for error details

#### Duplicate posts?
- System tracks posted tweets in JSON
- Each post has unique ID
- Status prevents re-posting (`pending` → `posted`)

#### Account restrictions?
- @BWSXAI may have low activity restrictions
- Use regular tweets (NOT replies) - already implemented
- Build account credibility through quality content
- Restrictions typically lift after consistent posting

### Manual Operations

**Regenerate posts for specific article**:
1. Edit `article-x-posts.json`
2. Remove posts for that article
3. Run `node generate-article-posts.js`

**Retry failed posts**:
1. Edit `article-x-posts.json`
2. Change `status: "failed"` to `status: "pending"`
3. Remove `error` field
4. Run `node post-article-content.js`

**Clear all posts** (use with caution):
```bash
echo '{"metadata":{"lastGenerated":null,"lastPosted":null,"totalPosts":0,"totalArticles":0,"pendingPosts":0,"postedCount":0,"failedCount":0},"posts":[]}' > scripts/data/article-x-posts.json
```

## 📦 Dependencies

**Required npm packages**:
```json
{
  "@anthropic-ai/sdk": "^0.45.0",
  "twitter-api-v2": "^1.15.0",
  "dotenv": "^16.3.1"
}
```

**Installation**:
```bash
npm install @anthropic-ai/sdk twitter-api-v2 dotenv
```

## 🎯 Success Metrics

### Target Metrics
- ✅ 3-4 posts per day (sustainable rate)
- ✅ 100% docs.bws.ninja link coverage
- ✅ <1% failure rate
- ✅ All products represented equally
- ✅ Zero manual intervention required

### Current Status (as of 2025-11-11)
- ✅ 12 posts generated (4 articles × 3 posts)
- ✅ 4 posts successfully posted
- ✅ 8 posts queued (pending)
- ✅ 0 failures
- ✅ All 4 products have content

**Live Posts**:
- [X Bot Announcement](https://twitter.com/i/web/status/1988149840774066548)
- [Blockchain Badges Announcement](https://twitter.com/i/web/status/1988149964669677882)
- [ESG Credits Announcement](https://twitter.com/i/web/status/1988150088481309102)
- [Fan Game Cube Announcement](https://twitter.com/i/web/status/1988150212146200847)

## 🚀 Future Enhancements

### Potential Improvements
- [ ] **Thread Support**: Multi-tweet threads for detailed features
- [ ] **Image Generation**: Product screenshots or branded graphics
- [ ] **Engagement Tracking**: Monitor likes, retweets, clicks
- [ ] **A/B Testing**: Test different post formats
- [ ] **Scheduled Posting**: Optimal time-of-day posting
- [ ] **Reply Detection**: Monitor and respond to comments
- [ ] **Analytics Dashboard**: Track performance metrics

### Integration Opportunities
- [ ] Link with KOL reply system for coordinated campaigns
- [ ] Notify Zapier webhook on successful posts
- [ ] Auto-generate weekly summary reports
- [ ] Integrate with docs.bws.ninja analytics

## 📝 Notes

### Why Regular Tweets (Not Replies)?
- @BWSXAI account has low activity (9 tweets, 147 days old)
- Twitter restricts reply functionality for new/inactive accounts
- Regular tweets work perfectly (tested and verified)
- As account grows, can enable reply functionality

### Why Claude Sonnet 4.5?
- Latest and most capable model
- Excellent at following strict formatting guidelines
- Consistent JSON output
- Better understanding of marketing/technical balance

### Why Priority-Based Queueing?
- Ensures high-priority announcements post first
- Distributes content across products
- Prevents flooding with one product
- Allows manual priority adjustment

## 🔗 Related Documentation
- [Main Article Posting Plan](./ARTICLE_X_POSTING_PLAN.md)
- [Workflow Data Protection](./WORKFLOW_DATA_PROTECTION_PROPOSAL.md)
- [X Bot Documentation](https://docs.bws.ninja/telegram-bots/x-bot)
- [@BWSXAI on Twitter](https://twitter.com/BWSXAI)

---

**Last Updated**: 2025-11-11
**System Status**: ✅ Operational
**Next Review**: 2025-11-18
