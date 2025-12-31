# Tweet Discovery Improvement Plan - Blockchain Badges Focus

**Date:** December 31, 2025
**Focus:** Expand from KOL-only to topic/keyword-based discovery
**Priority Product:** Blockchain Badges (institutions, e-learning, course providers)

---

## Problem Statement

**Current Limitation:**
The tweet discovery system is **KOL-centric**, relying heavily on monitoring timelines of pre-tracked influencers (36 tracked KOLs). This misses:

1. **Institutional accounts** - Universities, training centers, certification bodies not yet in KOL database
2. **E-learning platforms** - Coursera, Udemy, edX competitors/users discussing credentials
3. **Professional communities** - HR managers, recruiters discussing credential verification
4. **Organic discussions** - People asking about verifiable credentials who aren't crypto influencers
5. **Pain points** - Users complaining about fake degrees, credential fraud

**Result:** Empty reply queue (0 tweets available) because we're only watching 36 KOLs, missing thousands of potential conversations.

---

## Current Discovery Analysis

### Existing Methods (3 Workflows)

**1. KOL Timeline Monitoring** ⚠️ Limited Scope
- Monitors 36 tracked KOLs only
- Method: `client.getUserTweets(kol_username)`
- Miss rate: ~99.9% of relevant tweets (not from tracked KOLs)

**2. Search-Based KOL Discovery** ⚠️ Wrong Focus
- Searches 100+ token cashtags ($JLP, $MARS4, etc.)
- Purpose: Find new crypto KOLs
- Gap: Doesn't find Blockchain Badges opportunities

**3. Product-Specific Discovery** ✅ Good Start, Needs Expansion
- Searches keywords for Blockchain Badges
- Current queries: 5 (credentials, education, fraud, identity)
- Gap: Missing institution-specific terms, e-learning platforms

---

## Blockchain Badges Current Search Queries

### Existing 5 Queries (from `product-search-queries.json`)

1. **credentials-general** (HIGH priority)
   ```
   (credentials OR certificates OR certifications) (blockchain OR verifiable OR digital) lang:en -is:retweet min_faves:5
   ```

2. **educational-credentials** (HIGH priority)
   ```
   (university OR course OR training OR education) (certificate OR certification OR diploma OR degree) (blockchain OR NFT OR verify) lang:en -is:retweet min_faves:5
   ```

3. **professional-badges** (MEDIUM priority)
   ```
   (professional OR skill OR endorsement OR achievement) (badge OR certificate OR credential) (verify OR proof OR authentic) lang:en -is:retweet min_faves:3
   ```

4. **credential-fraud** (HIGH priority)
   ```
   (fake OR fraud OR counterfeit OR forged) (degree OR certificate OR diploma OR credential) lang:en -is:retweet min_faves:10
   ```

5. **digital-identity** (MEDIUM priority)
   ```
   (digital identity OR verifiable credentials OR self-sovereign) (blockchain OR decentralized OR DID) lang:en -is:retweet min_faves:5
   ```

### Gaps in Current Queries

**Missing Institution Types:**
- Online learning platforms (Coursera, Udemy, edX, Skillshare)
- Corporate training programs
- Bootcamps (coding, data science)
- Professional certifications (PMP, CPA, AWS, etc.)
- HR tech companies

**Missing Pain Points:**
- "How to verify" questions
- Credential sharing/portability problems
- International credential recognition
- Employer trust issues

**Missing Use Cases:**
- Micro-credentials/nanodegrees
- Continuing education units (CEUs)
- Skills-based hiring
- Portfolio credentials

---

## Proposed Solution: Multi-Tier Discovery System

### TIER 1: Enhanced Product-Specific Discovery (Immediate - Week 1)

**Expand Blockchain Badges queries from 5 → 20 queries**

Add these 15 new search queries:

#### **Institution & Platform Queries (5 NEW)**

6. **e-learning-platforms** (HIGH priority)
   ```
   (Coursera OR Udemy OR edX OR Skillshare OR LinkedIn Learning) (certificate OR certification OR credential) lang:en -is:retweet min_faves:3
   ```

7. **bootcamp-training** (MEDIUM priority)
   ```
   (bootcamp OR coding bootcamp OR data science OR cybersecurity) (certificate OR completion OR credential) lang:en -is:retweet min_faves:3
   ```

8. **university-programs** (HIGH priority)
   ```
   (university OR college OR academic) (digital credential OR digital badge OR micro-credential OR microcredential) lang:en -is:retweet min_faves:3
   ```

9. **corporate-training** (MEDIUM priority)
   ```
   (corporate training OR employee training OR L&D OR learning development) (certificate OR credential OR badge) lang:en -is:retweet min_faves:3
   ```

10. **professional-cert-bodies** (HIGH priority)
    ```
    (PMP OR AWS certification OR Google certified OR Microsoft certified OR CompTIA) (verify OR verification OR authentic) lang:en -is:retweet min_faves:5
    ```

#### **Pain Point & Problem Queries (5 NEW)**

11. **verification-problems** (HIGH priority)
    ```
    ("how to verify" OR "can't verify" OR "verify my") (degree OR certificate OR diploma OR credential) lang:en -is:retweet min_faves:2
    ```

12. **fake-credential-concerns** (HIGH priority)
    ```
    (worried OR concerned OR checking OR verifying) (fake degree OR fake certificate OR diploma mill) lang:en -is:retweet min_faves:5
    ```

13. **international-recognition** (MEDIUM priority)
    ```
    (international OR global OR cross-border) (credential recognition OR degree verification OR certificate validation) lang:en -is:retweet min_faves:3
    ```

14. **employer-trust** (HIGH priority)
    ```
    (employer OR recruiter OR HR OR hiring) (verify education OR verify degree OR credential check) lang:en -is:retweet min_faves:3
    ```

15. **credential-sharing** (MEDIUM priority)
    ```
    (share my OR sharing OR display OR showcase) (certificate OR credential OR badge OR achievement) (LinkedIn OR portfolio OR resume) lang:en -is:retweet min_faves:2
    ```

#### **Use Case Queries (5 NEW)**

16. **micro-credentials** (HIGH priority)
    ```
    (micro-credential OR microcredential OR nanodegree OR digital badge) lang:en -is:retweet min_faves:3
    ```

17. **continuing-education** (MEDIUM priority)
    ```
    (continuing education OR CEU OR CPE OR professional development) (certificate OR credential OR proof) lang:en -is:retweet min_faves:2
    ```

18. **skills-based-hiring** (HIGH priority)
    ```
    (skills-based hiring OR skill verification OR competency-based) (credential OR certificate OR proof) lang:en -is:retweet min_faves:3
    ```

19. **alternative-credentials** (MEDIUM priority)
    ```
    (alternative credential OR stackable credential OR open badge OR verifiable achievement) lang:en -is:retweet min_faves:2
    ```

20. **blockchain-education** (HIGH priority)
    ```
    (blockchain education OR blockchain course OR learn blockchain OR Web3 course) (certificate OR credential OR completion) lang:en -is:retweet min_faves:3
    ```

---

### TIER 2: Targeted Account Discovery (Week 2)

**Create new workflow:** `discover-institution-accounts-sdk.js`

**Purpose:** Discover and track institutional accounts (not KOLs) that would benefit from Blockchain Badges

**Target Account Types:**
1. E-learning platforms (@Coursera, @udemy, @edXOnline, @Skillshare)
2. Universities with digital programs
3. Bootcamp providers (@LambdaSchool, @Flatiron, @GeneralAssembly)
4. Professional cert bodies (@PMI, @CompTIA, @awscloud)
5. HR tech companies (@Workday, @Greenhouse, @Lever)
6. EdTech startups

**Discovery Method:**
```javascript
// Search for accounts posting about credentials/certificates
const institutionSearchQueries = [
  'from:(account with "university" OR "learning" OR "education" in bio) (certificate OR credential)',
  'bio:"e-learning" OR bio:"online courses" (certificate OR badge)',
  'bio:"bootcamp" OR bio:"training program" (completion OR credential)',
  'bio:"HR tech" OR bio:"recruitment" (verify OR verification)'
];

// For each result:
// 1. Check account type (institution vs individual)
// 2. Evaluate product-market fit for Blockchain Badges
// 3. Add to new list: institution-accounts.json
// 4. Monitor their timelines separately from KOLs
```

**Output:** `scripts/crawling/data/institution-accounts.json`

**Monitoring:** Separate from KOL monitoring (different engagement thresholds, reply strategies)

---

### TIER 3: Topic-Based Monitoring (Week 3)

**Create new workflow:** `monitor-topic-trends-sdk.js`

**Purpose:** Monitor trending topics related to credentials, education, verification without user-specific targeting

**Approach:**
1. **Daily topic searches** for credential-related discussions
2. **Engagement clustering** - Find conversations with multiple replies/engagement
3. **Thread discovery** - Find discussion threads about credential problems
4. **News monitoring** - Detect credential fraud news, policy changes

**Example Topics to Monitor:**
```javascript
const credentialTopics = [
  // Fraud news
  'fake degree scandal',
  'diploma mill exposed',
  'credential fraud arrest',

  // Policy/regulation
  'credential verification requirement',
  'education verification law',
  'digital credential standard',

  // Technology adoption
  'university adopts blockchain',
  'digital badge implementation',
  'verifiable credential rollout',

  // Market trends
  'micro-credential market',
  'alternative credential growth',
  'skills-based hiring trend'
];
```

**Engagement Strategy:**
- Higher engagement threshold (10+ likes, 5+ replies)
- Focus on conversations (threads with multiple participants)
- Educational responses (not promotional)
- Link to case studies/whitepapers

---

### TIER 4: Semantic Search & AI-Powered Discovery (Week 4+)

**Advanced capabilities for future:**

1. **Semantic Understanding**
   - Use Claude to analyze tweet intent
   - Classify pain points vs solutions vs questions
   - Identify implicit credential needs (e.g., "How do I prove my skills?")

2. **Dynamic Query Expansion**
   - Start with seed keywords
   - Claude suggests related terms based on discovered tweets
   - Auto-generate new search queries

3. **Trend Adaptation**
   - Monitor what credential topics are trending
   - Adjust query weights based on conversation volume
   - Discover emerging use cases

4. **Account Classification**
   - AI-powered institution vs individual detection
   - Relevance scoring for Blockchain Badges product-market fit
   - Automatic segmentation (education, corporate, certification, etc.)

---

## Implementation Plan

### Phase 1: Immediate Expansion (Week 1)

**Goal:** Increase Blockchain Badges tweet discovery 5-10x

**Tasks:**
1. ✅ Expand `product-search-queries.json` with 15 new queries
2. ✅ Update `discover-product-tweets-sdk.js` to handle 20 queries
3. ✅ Adjust query rotation (execute 5 queries per run instead of 3)
4. ✅ Lower engagement thresholds for Blockchain Badges (min_faves:2-3 instead of 5)
5. ✅ Test search queries manually to verify results

**Files to Modify:**
- `scripts/crawling/config/product-search-queries.json` (add 15 queries)
- `scripts/crawling/production/discover-product-tweets-sdk.js` (maxQueriesPerRun: 3→5)

**Expected Impact:**
- Current: 5 queries finding ~0-5 tweets/day
- After: 20 queries finding ~30-50 tweets/day (10x increase)

**Acceptance Criteria:**
- `product-discovery-queue.json` has 30+ unprocessed Blockchain Badges tweets
- Tweets from non-KOL accounts (institutions, individuals asking questions)
- Variety of topics (not just crypto influencers)

---

### Phase 2: Institution Account Discovery (Week 2)

**Goal:** Build database of 50-100 institutional accounts to monitor

**Tasks:**
1. Create `scripts/crawling/production/discover-institution-accounts-sdk.js`
2. Create `scripts/crawling/data/institution-accounts.json` structure
3. Create `scripts/crawling/config/institution-search-queries.json`
4. Build account classification logic (institution vs individual)
5. Create separate monitoring workflow for institutions

**New Script Structure:**
```javascript
// discover-institution-accounts-sdk.js
async function discoverInstitutionAccounts() {
  // 1. Search for accounts posting about credentials
  const queries = loadInstitutionSearchQueries();

  // 2. For each tweet found, extract author
  const accounts = [];

  // 3. Classify account type
  const classification = await classifyAccount(account);
  // Types: e-learning, university, bootcamp, cert-body, hr-tech, individual

  // 4. Score product-market fit for Blockchain Badges
  const fitScore = await scoreProductFit(account);
  // Based on: bio keywords, follower count, tweet topics, engagement

  // 5. Add to institution-accounts.json if qualified
  if (classification.isInstitution && fitScore > 60) {
    saveInstitutionAccount(account);
  }
}
```

**Expected Impact:**
- 50-100 new institutional accounts tracked
- Separate monitoring pipeline (different engagement rules)
- Better targeting for educational/informative replies

---

### Phase 3: Topic Trend Monitoring (Week 3)

**Goal:** Discover conversations beyond account-based monitoring

**Tasks:**
1. Create `scripts/crawling/production/monitor-topic-trends-sdk.js`
2. Define trending topic queries (fraud news, policy, adoption)
3. Implement conversation thread detection
4. Build engagement clustering (find active discussions)
5. Create workflow to run daily

**Features:**
- **Thread Discovery:** Identify tweet threads with 5+ replies
- **News Detection:** Find tweets linking to news articles about credentials
- **Conversation Mapping:** Track multi-user discussions
- **Hot Topic Alerts:** Notify when credential topics trend

**Expected Impact:**
- Discover 20-30 high-engagement conversations/day
- Join discussions early (within 2-4 hours of thread start)
- Higher reply visibility (threads get more views)

---

### Phase 4: Advanced AI Discovery (Future)

**Goal:** Self-improving discovery system

**Features:**
1. **Semantic Search:** Claude analyzes tweet meaning, not just keywords
2. **Dynamic Queries:** Auto-generate new search queries based on discoveries
3. **Trend Prediction:** Identify emerging credential topics before they trend
4. **Smart Classification:** AI-powered account and tweet categorization

**Timeline:** Month 2-3 (after validating Phases 1-3)

---

## Configuration Changes

### 1. Update `product-search-queries.json`

**Current Structure:**
```json
{
  "blockchain-badges": {
    "queries": [
      {
        "id": "credentials-general",
        "query": "...",
        "priority": "HIGH"
      }
    ]
  }
}
```

**New Structure (20 queries):**
```json
{
  "blockchain-badges": {
    "queries": [
      // Existing 5 queries
      {...},

      // NEW: Institution & Platform Queries (5)
      {
        "id": "e-learning-platforms",
        "query": "(Coursera OR Udemy OR edX OR Skillshare OR LinkedIn Learning) (certificate OR certification OR credential) lang:en -is:retweet min_faves:3",
        "priority": "HIGH",
        "category": "institutions"
      },
      {
        "id": "bootcamp-training",
        "query": "(bootcamp OR coding bootcamp OR data science OR cybersecurity) (certificate OR completion OR credential) lang:en -is:retweet min_faves:3",
        "priority": "MEDIUM",
        "category": "institutions"
      },
      // ... (15 more queries)
    ],
    "config": {
      "maxQueriesPerRun": 5,
      "minEngagement": {
        "likes": 2,
        "retweets": 0,
        "views": 30
      }
    }
  }
}
```

---

### 2. Create `institution-search-queries.json`

**New Configuration File:**
```json
{
  "e-learning": {
    "bioKeywords": ["e-learning", "online courses", "learning platform", "edtech"],
    "mustInclude": ["certificate", "credential", "learning"],
    "accountExamples": ["Coursera", "udemy", "edXOnline"]
  },
  "universities": {
    "bioKeywords": ["university", "college", "academic institution"],
    "mustInclude": ["digital credential", "online program", "certificate"],
    "accountExamples": ["Harvard", "MIT", "Stanford"]
  },
  "bootcamps": {
    "bioKeywords": ["bootcamp", "coding school", "immersive program"],
    "mustInclude": ["graduates", "certificate", "career"],
    "accountExamples": ["LambdaSchool", "Flatiron", "GeneralAssembly"]
  },
  "cert-bodies": {
    "bioKeywords": ["certification", "professional standards", "accreditation"],
    "mustInclude": ["certified", "credential", "exam"],
    "accountExamples": ["PMI", "CompTIA", "awscloud"]
  }
}
```

---

### 3. Update `discover-product-tweets-sdk.js`

**Current Config:**
```javascript
const MAX_QUERIES_PER_RUN = 3;
const MAX_TWEETS_PER_QUERY = 30;
```

**New Config:**
```javascript
const MAX_QUERIES_PER_RUN = 5;  // 3 → 5 (execute more queries)
const MAX_TWEETS_PER_QUERY = 30;
const MAX_TWEETS_PER_PRODUCT = 50;  // 20 → 50 (collect more tweets)
```

**Query Selection Logic Update:**
```javascript
// Before: Simple weighted random
const selectedQueries = selectQueriesForProduct(queries, MAX_QUERIES_PER_RUN);

// After: Category-aware selection (ensure diversity)
const selectedQueries = selectDiverseQueries(queries, MAX_QUERIES_PER_RUN, {
  categories: ['institutions', 'pain-points', 'use-cases', 'general'],
  minPerCategory: 1  // At least 1 query from each category
});
```

---

## Expected Results

### Metrics to Track

| Metric | Current | Week 1 Target | Week 2 Target | Week 3 Target |
|--------|---------|--------------|--------------|--------------|
| **Discovery** |
| Tweets discovered/day | 5-10 | 30-50 | 50-80 | 80-120 |
| Unique accounts found | 5-8 | 20-30 | 40-60 | 60-100 |
| Institutional accounts | 0 | 10-15 | 30-50 | 50-100 |
| **Engagement** |
| Reply opportunities/day | 0-2 | 10-15 | 20-30 | 30-50 |
| Product-relevant score | 60% | 70% | 75% | 80% |
| **Quality** |
| High-intent tweets (%) | 20% | 40% | 50% | 60% |
| Non-KOL tweets (%) | 10% | 50% | 70% | 80% |

### Success Indicators

**Week 1:**
- ✅ `product-discovery-queue.json` has 30+ Blockchain Badges tweets
- ✅ At least 50% from non-KOL accounts
- ✅ Tweets from e-learning platforms, bootcamps, or universities
- ✅ Mix of questions, pain points, and discussions

**Week 2:**
- ✅ 30+ institutional accounts discovered
- ✅ At least 5 different institution types (e-learning, university, bootcamp, cert-body, hr-tech)
- ✅ Institutional tweets monitored separately
- ✅ 20+ reply opportunities from institutions

**Week 3:**
- ✅ 10+ conversation threads discovered
- ✅ Early engagement (within 2-4 hours of thread start)
- ✅ Higher reply visibility (avg 100+ views per reply)
- ✅ Balanced discovery across all query categories

---

## Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| **Too many low-quality tweets** | High | Medium | Raise engagement thresholds after testing |
| **Twitter API rate limits** | High | Medium | Implement query throttling, use crawler mode |
| **Irrelevant institutional accounts** | Medium | High | AI classification scoring, manual review first 50 |
| **Reply spam perception** | High | Low | Maintain educational tone, max 1 reply/institution/week |
| **Query overlap/duplication** | Low | Medium | Track tweet IDs, deduplicate across queries |
| **Increased workflow costs** | Medium | Low | Monitor GitHub Actions minutes, optimize runs |

---

## Rollout Strategy

### Conservative Rollout (Recommended)

**Week 1:** Test with 10 new queries (not all 15)
- Deploy 5 institution queries + 5 pain point queries
- Monitor results for 3 days
- Adjust engagement thresholds based on quality
- Add remaining 5 queries if quality is good

**Week 2:** Full 20 queries + Institution discovery
- Enable all 20 Blockchain Badges queries
- Launch institution account discovery (manual review)
- Run discovery 2x/week (not daily yet)

**Week 3:** Automated institution monitoring
- Auto-add qualified institutions (score > 70)
- Daily discovery runs
- Launch topic trend monitoring

### Aggressive Rollout (If needed)

**Day 1:** Deploy all 20 queries immediately
**Day 3:** Launch institution discovery
**Week 2:** Full automation

---

## Implementation Checklist

### Phase 1: Query Expansion (Week 1)

- [ ] **Update product-search-queries.json**
  - [ ] Add 5 institution queries
  - [ ] Add 5 pain point queries
  - [ ] Add 5 use case queries
  - [ ] Set priority and category tags

- [ ] **Modify discover-product-tweets-sdk.js**
  - [ ] Change MAX_QUERIES_PER_RUN: 3 → 5
  - [ ] Change MAX_TWEETS_PER_PRODUCT: 20 → 50
  - [ ] Implement category-aware query selection
  - [ ] Add engagement threshold config per product

- [ ] **Test Queries**
  - [ ] Run each query manually via Twitter search
  - [ ] Verify results are relevant
  - [ ] Check engagement levels (likes, retweets)
  - [ ] Adjust min_faves if needed

- [ ] **Deploy and Monitor**
  - [ ] Commit changes to git
  - [ ] Merge to master
  - [ ] Monitor product-discovery-queue.json for 3 days
  - [ ] Check quality of discovered tweets

### Phase 2: Institution Discovery (Week 2)

- [ ] **Create New Script**
  - [ ] File: `discover-institution-accounts-sdk.js`
  - [ ] Implement account classification logic
  - [ ] Implement product-fit scoring
  - [ ] Add manual review workflow

- [ ] **Create Config File**
  - [ ] File: `institution-search-queries.json`
  - [ ] Define institution types
  - [ ] Set bio keyword patterns
  - [ ] List example accounts

- [ ] **Create Data Structure**
  - [ ] File: `institution-accounts.json`
  - [ ] Schema: account type, fit score, last checked, tweets found

- [ ] **Create Workflow**
  - [ ] File: `.github/workflows/discover-institutions.yml`
  - [ ] Schedule: 2x/week initially
  - [ ] Manual trigger enabled

- [ ] **Test and Deploy**
  - [ ] Run discovery manually
  - [ ] Review first 20 accounts
  - [ ] Validate classification accuracy
  - [ ] Deploy if >80% accuracy

### Phase 3: Topic Monitoring (Week 3)

- [ ] **Create Trend Monitoring Script**
  - [ ] File: `monitor-topic-trends-sdk.js`
  - [ ] Implement thread detection
  - [ ] Implement conversation clustering
  - [ ] Add news detection

- [ ] **Create Config**
  - [ ] Define trending topics to monitor
  - [ ] Set engagement thresholds for threads
  - [ ] Configure alert conditions

- [ ] **Create Workflow**
  - [ ] File: `.github/workflows/monitor-topics.yml`
  - [ ] Schedule: Daily
  - [ ] Manual trigger enabled

- [ ] **Deploy and Monitor**
  - [ ] Test thread detection
  - [ ] Verify conversation relevance
  - [ ] Deploy to production

---

## Monitoring & Optimization

### Daily Checks (First 2 Weeks)

1. **Check discovery queue size:**
   ```bash
   cat scripts/crawling/data/product-discovery-queue.json | jq '[.tweets[] | select(.product == "blockchain-badges")] | length'
   ```

2. **Check tweet quality:**
   - Sample 10 random tweets
   - Verify relevance to Blockchain Badges
   - Check account types (institutional vs individual)

3. **Check engagement thresholds:**
   - Are we getting too many low-quality tweets? → Raise min_faves
   - Are we missing opportunities? → Lower min_faves

4. **Check query performance:**
   - Which queries find the most relevant tweets?
   - Which queries find low-quality results?
   - Adjust priorities accordingly

### Weekly Reviews

1. **Reply success rate:** How many discovered tweets result in replies?
2. **Account diversity:** Are we discovering varied account types?
3. **Topic coverage:** Are we covering all query categories?
4. **API usage:** Are we staying within rate limits?

---

## Next Steps

**Immediate Actions (This Week):**
1. Review and approve this plan
2. Test 5 new queries manually on Twitter
3. Update `product-search-queries.json` with approved queries
4. Deploy Phase 1 changes
5. Monitor results for 48 hours

**Follow-up (Next Week):**
1. Analyze Phase 1 results
2. Adjust queries based on findings
3. Begin Phase 2 implementation if Phase 1 successful

---

**Plan Status:** 📋 Ready for Review
**Priority:** 🔴 HIGH (blocking reply engagement growth)
**Estimated Effort:**
- Phase 1: 4-6 hours
- Phase 2: 8-12 hours
- Phase 3: 12-16 hours
