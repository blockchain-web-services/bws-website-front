import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-sonnet-4-5-20250929';
const QUICK_FILTER_MODEL = 'claude-3-5-haiku-20241022'; // Fast, cheap model for pre-filtering

/**
 * Create Anthropic client
 */
export function createClaudeClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required');
  }

  return new Anthropic({ apiKey });
}

/**
 * Extract JSON from Claude response
 */
function extractJSON(text) {
  // Try to find JSON block
  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error('No JSON found in response');
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error.message}`);
  }
}

/**
 * Evaluate if a Twitter user is a crypto KOL
 */
export async function evaluateUserAsCryptoKOL(client, user, recentTweets) {
  const tweetTexts = recentTweets.map(t => t.text).join('\n---\n');

  const prompt = `Analyze this Twitter user and their recent tweets to determine if they are a cryptocurrency/blockchain Key Opinion Leader (KOL).

User Profile:
- Username: @${user.username}
- Name: ${user.name}
- Bio: ${user.description || 'N/A'}
- Followers: ${user.public_metrics?.followers_count || 0}
- Following: ${user.public_metrics?.following_count || 0}
- Verified: ${user.verified || false}

Recent Tweets:
${tweetTexts}

Analyze and provide a JSON response:
{
  "isCryptoKOL": true/false,
  "cryptoRelevanceScore": 0-100,
  "reasoning": "Brief explanation of why they are/aren't a crypto KOL",
  "primaryTopics": ["topic1", "topic2", "topic3"],
  "cryptoProjects": ["mentioned projects"],
  "sentimentTowardsCrypto": "positive/neutral/negative/mixed",
  "accountType": "person/business/project/bot/news"
}

Focus on:
- Do they discuss crypto/blockchain projects regularly?
- Do they provide insights, analysis, or opinions on crypto?
- Are they promoting specific projects or providing neutral commentary?
- Is this a personal account or a project/business account?
- Do they have meaningful engagement (not just promotional spam)?`;

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].text.trim();
    return extractJSON(responseText);
  } catch (error) {
    console.error(`Claude API error evaluating user: ${error.message}`);
    throw error;
  }
}

/**
 * Quick pre-filter: Is this tweet about crypto projects/opportunities?
 * Fast, cheap evaluation using Haiku model
 * Returns true if tweet is potentially relevant for detailed evaluation
 */
export async function quickFilterTweetRelevance(client, tweet) {
  const prompt = `Quickly analyze if this tweet is about cryptocurrency PROJECTS, ALTCOINS, or INVESTMENT OPPORTUNITIES.

Tweet: "${tweet.text}"

Answer with ONLY a JSON object:
{
  "isRelevant": true/false,
  "category": "project-discussion/altcoin-talk/market-trends/price-speculation/technical-analysis/off-topic/news"
}

RELEVANT (return true):
- Discusses specific crypto projects (tokens, DeFi, NFT projects)
- Talks about altcoins, portfolio building, gems, opportunities
- Project launches, narratives, ecosystem discussions
- "What are you buying?", "Hidden gems", "Undervalued projects"

NOT RELEVANT (return false):
- Pure technical analysis (support/resistance levels, chart patterns)
- Bitcoin-only price speculation ("BTC to $100k")
- Traditional stocks/finance
- Off-topic (politics, sports, food)
- Generic news with no investment angle`;

  try {
    const message = await client.messages.create({
      model: QUICK_FILTER_MODEL, // Use Haiku for speed and cost
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].text.trim();
    const result = extractJSON(responseText);
    return result;
  } catch (error) {
    console.error(`Claude API error in quick filter: ${error.message}`);
    // Default to true (pass through) on error to avoid losing tweets
    return { isRelevant: true, category: 'error' };
  }
}

/**
 * Evaluate if a tweet is suitable for reply
 */
export async function evaluateTweetForReply(client, tweet, kolProfile, bwsProducts, config) {
  const productsInfo = Object.entries(bwsProducts).map(([name, prod]) => {
    const useCases = prod.useCases && prod.useCases.length > 0
      ? `\nUse Cases: ${prod.useCases.slice(0, 3).join('; ')}`
      : '';
    return `${name} (${prod.category}): ${prod.description}${useCases}\nKeywords: ${prod.keywords.join(', ')}`;
  }).join('\n\n');

  const avoidKeywords = config.spamPrevention?.avoidKeywords || [];
  const competitors = config.spamPrevention?.avoidCompetitors || [];

  const prompt = `Analyze this tweet from a crypto KOL and determine if it's appropriate to reply mentioning BWS as a microcap opportunity with real fundamentals.

KOL Profile:
- Username: @${kolProfile.username}
- Followers: ${kolProfile.followersCount || 0}
- Topics: ${kolProfile.recentTopics?.join(', ') || 'N/A'}

Tweet:
"${tweet.text}"

Posted: ${tweet.created_at}
Likes: ${tweet.public_metrics?.like_count || 0}
Retweets: ${tweet.public_metrics?.retweet_count || 0}
Replies: ${tweet.public_metrics?.reply_count || 0}

BWS Products (real utility being built):
${productsInfo}

**NEW STRATEGY**: We are looking for tweets about MARKET TRENDS, ALTCOINS, GEM HUNTING, or PORTFOLIO BUILDING where we can naturally mention BWS as a microcap opportunity with real products and long-term vision.

HIGH RELEVANCE TOPICS (Score 75-95%):
- Market trends and crypto market cycles
- Altcoin discussions and altcoin season
- Microcap gems / low-cap opportunities
- Portfolio building and diversification
- New crypto project launches or project discovery
- Bull/bear market sentiment and positioning
- "Hidden gem" or undervalued project discussions
- Crypto investment strategies
- Project fundamentals and team discussions

MEDIUM RELEVANCE (Score 40-70%):
- General crypto sentiment and market commentary
- Trading psychology with long-term investment angle
- Blockchain technology discussions

LOW RELEVANCE (Score 0-35%):
- Pure day trading / technical analysis with no project discussion
- Traditional stocks only (no crypto context)
- Completely off-topic (politics, food, sports)
- Promotional posts (giveaways, airdrops, shilling other projects)
- Tweets containing: ${avoidKeywords.join(', ')}
- Tweets mentioning competitors: ${competitors.join(', ')}

SPAM AVOIDANCE:
- Skip if tweet is angry/negative sentiment toward crypto
- Skip pure price speculation with no project discussion
- Skip if KOL is shilling a specific project already (don't compete)

Provide JSON response:
{
  "shouldReply": true/false,
  "relevanceScore": 0-100,
  "bestMatchingProduct": "Product Name or null (pick 1-2 relevant BWS products)",
  "reasoning": "Why this tweet is/isn't suitable for positioning BWS as a microcap opportunity",
  "suggestedAngle": "How to naturally mention BWS as a gem with real fundamentals",
  "riskFactors": ["any spam/negative indicators"],
  "tweetCategory": "market-trends/altcoin-discussion/gem-hunting/portfolio/announcement/trading/off-topic"
}`;

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].text.trim();
    return extractJSON(responseText);
  } catch (error) {
    console.error(`Claude API error evaluating tweet: ${error.message}`);
    throw error;
  }
}

/**
 * Generate a reply to a tweet
 */
export async function generateReplyText(client, tweet, kolProfile, product, evaluation, positioningPhrase = 'microcap opportunity with real fundamentals', recentReplies = [], specialNotes = '') {
  const useCasesText = product.useCases && Array.isArray(product.useCases) && product.useCases.length > 0
    ? `\nUse Cases:\n${product.useCases.slice(0, 4).map(u => `- ${u}`).join('\n')}`
    : '';

  const implementationText = product.implementationSteps && Array.isArray(product.implementationSteps) && product.implementationSteps.length > 0
    ? `\nHow it works:\n${product.implementationSteps.slice(0, 3).map(s => `- ${s.title || s.description || s}`).join('\n')}`
    : '';

  const productInfo = `${product.description || product.name || 'BWS Product'}${useCasesText}${implementationText}

Documentation: ${product.url || 'https://docs.bws.ninja'}`;

  const specialNotesSection = specialNotes ? `\n\n${specialNotes}` : '';

  // Build recent replies context for diversity
  const recentRepliesContext = recentReplies.length > 0
    ? `\n\n**RECENT REPLIES CONTEXT** (for diversity - avoid repeating these structures/phrases):\n${recentReplies.slice(0, 3).map((r, idx) =>
      `${idx + 1}. Product: ${r.productMentioned} | Reply: "${r.replyText}"`
    ).join('\n')}`
    : '';

  const prompt = `Generate a natural reply positioning BWS as a ${positioningPhrase}.

KOL's Tweet:
"${tweet.text}"

BWS Product to Reference:
${product.name || 'BWS Solution'}
URL: ${product.url || 'https://www.bws.ninja'}

Product Details:
${productInfo}${specialNotesSection}

Context from Analysis:
- Suggested Angle: ${evaluation.suggestedAngle}
- Tweet Category: ${evaluation.tweetCategory}${recentRepliesContext}

**POSITIONING STRATEGY**: Focus on the angle "${positioningPhrase}". Vary your approach based on:
- The KOL's tweet context and sentiment
- Recent replies (avoid repeating similar structures/products/phrases)
- The specific BWS product's strengths
- Natural conversation flow (don't force positioning if it doesn't fit)

**CRITICAL: PLATFORM vs PRODUCT POSITIONING**
Choose ONE approach per reply:

A) **PLATFORM-LEVEL** (when tweet is about general market/trends/gems):
   - Position BWS as "Blockchain Solutions Marketplace"
   - Mention "platform containing multiple solutions targeting mass markets"
   - Use phrases like: "multiple live products", "suite of blockchain solutions", "AWS-style platform for Web3"
   - DO NOT mention single product details (sports clubs, credentials, etc.)
   - Example: "$BWS operates a Blockchain Solutions Marketplace with multiple products targeting mass markets - real utility, consistent delivery"

B) **PRODUCT-SPECIFIC** (when tweet clearly relates to ONE BWS product):
   - Mention the specific product AND its specific features
   - Include product-specific details (sports clubs for SportsBlock, credentials for CredBlock, etc.)
   - Link directly to that product's docs page
   - Example: "$BWS CredBlock enables verifiable credentials on-chain - sports clubs already using it for fan verification"

**DEFAULT to PLATFORM-LEVEL unless the tweet is CLEARLY about a specific use case that matches ONE BWS product.**

**REPLY STRUCTURE** (REQUIRED - Follow this exact format):

Line 1: Context-related sentence responding directly to the KOL's tweet content
[blank line]
Line 2-3: Describe BWS product features and vision (platform or product-specific as defined above)
[blank line]
Line 4: @BWSCommunity mention + 2-3 context-related hashtags + URL

Guidelines for Reply:
1. **STRUCTURE**: Must follow the 3-part format above with blank lines separating sections
2. **Opening sentence**: Directly engage with the KOL's tweet content - show you read and understood it
3. **Middle section**: Position BWS (platform or product-specific) with features and vision
4. **Closing line**: Always include @BWSCommunity + relevant hashtags + URL
5. Keep total reply under 280 characters including line breaks
6. Use conversational brand voice - be transparent this is BWS (the company) speaking
7. **CRITICAL**: NEVER use "I" - use "we" or third-person "BWS". This is BWS team/company account.
8. **REQUIRED**: Include "$BWS" cashtag in the middle section (not just at end)
9. **REQUIRED**: Include "@BWSCommunity" in the closing line
10. **REQUIRED**: Include link to specific product docs page or https://www.bws.ninja in closing line
11. **HASHTAGS**: Choose 2-3 hashtags that relate to the tweet context (e.g., #altcoins #gems #microcap #blockchain #DeFi #Web3 #crypto)
12. NO salesy language: avoid "amazing", "revolutionary", "don't miss", "moon"
13. Use emojis sparingly (0-1 max)
14. **DIVERSITY**: If recent replies exist, vary your tone, structure, and word choices significantly

Examples of PLATFORM-LEVEL positioning (for general market/trends tweets):

Example 1:
"Great point about microcap opportunities in this market cycle.

$BWS operates a Blockchain Solutions Marketplace with multiple products targeting mass markets - real utility, consistent delivery regardless of market conditions.

@BWSCommunity #microcap #altcoins #crypto https://www.bws.ninja"

Example 2:
"Totally agree - fundamentals matter more than ever right now.

$BWS brings AWS-style reliability to blockchain with multiple live solutions including credentials, ESG reporting, NFT APIs, and fan engagement platforms.

@BWSCommunity #blockchain #Web3 #gems https://www.bws.ninja"

Example 3:
"This is why projects with real revenue models stand out in bear markets.

$BWS keeps shipping multiple blockchain solutions: API services, marketplace solutions, and mass-market tools. Building through all cycles.

@BWSCommunity #DeFi #altcoins #fundamentals https://www.bws.ninja"

Examples of PRODUCT-SPECIFIC positioning (when tweet matches a specific use case):

Example 1 (Sports/Gaming):
"Fan engagement is huge for sports clubs - totally underserved market.

$BWS Fan Game Cube enables fans to own digital field sections and earn rewards during live games. Already live across multiple sports with real utility.

@BWSCommunity #sports #GameFi #NFT https://docs.bws.ninja/marketplace-solutions/bws.nft.gamecube"

Example 2 (Credentials/Identity):
"Verifiable credentials are essential for Web3's next phase.

$BWS Blockchain Badges provides secure digital credential issuance on blockchain - trusted, immutable, cross-platform. Used by educational institutions and enterprises.

@BWSCommunity #Web3 #credentials #blockchain https://docs.bws.ninja/marketplace-solutions/bws.blockchain.badges"

Example 3 (ESG/Enterprise):
"ESG reporting transparency is a massive opportunity for blockchain adoption.

$BWS ESG Credits helps financial institutions deliver environmental impact reporting with ICMA framework support - immutable, transparent, compliant.

@BWSCommunity #ESG #blockchain #fintech https://docs.bws.ninja/marketplace-solutions/bws.esg.credits"

Provide JSON response:
{
  "replyText": "The actual reply text with URL",
  "tone": "insightful/authentic/community-focused",
  "primaryHook": "What makes this reply relevant to their tweet",
  "alternativeVersion": "A slightly different version if the first seems off"
}`;

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].text.trim();
    return extractJSON(responseText);
  } catch (error) {
    console.error(`Claude API error generating reply: ${error.message}`);
    throw error;
  }
}

/**
 * Analyze KOL engagement patterns for weekly report
 */
export async function analyzeEngagementPatterns(client, repliesData, kolsData) {
  const recentReplies = repliesData.replies.slice(-50); // Last 50 replies

  const summary = {
    totalReplies: recentReplies.length,
    successRate: recentReplies.filter(r => r.status === 'posted').length / recentReplies.length * 100,
    productDistribution: {},
    avgRelevanceScore: 0
  };

  if (recentReplies.length > 0) {
    summary.avgRelevanceScore = recentReplies.reduce((sum, r) => sum + (r.relevanceScore || 0), 0) / recentReplies.length;

    recentReplies.forEach(r => {
      if (r.productMentioned) {
        summary.productDistribution[r.productMentioned] = (summary.productDistribution[r.productMentioned] || 0) + 1;
      }
    });
  }

  const prompt = `Analyze the performance of our KOL engagement strategy based on recent data.

Summary:
- Total Replies: ${summary.totalReplies}
- Success Rate: ${summary.successRate.toFixed(1)}%
- Average Relevance Score: ${summary.avgRelevanceScore.toFixed(1)}
- Product Distribution: ${JSON.stringify(summary.productDistribution, null, 2)}

Recent Replies (sample):
${recentReplies.slice(0, 10).map(r => `- @${r.kolUsername}: "${r.replyText}" (${r.productMentioned}, Score: ${r.relevanceScore})`).join('\n')}

Provide analysis in JSON:
{
  "overallAssessment": "Brief assessment of strategy performance",
  "strengths": ["What's working well"],
  "weaknesses": ["What needs improvement"],
  "recommendations": ["Specific actionable recommendations"],
  "bestPerformingProduct": "Which product gets best engagement",
  "spamRiskLevel": "low/medium/high",
  "suggestedAdjustments": {
    "replyFrequency": "increase/decrease/maintain",
    "targetingStrategy": "Suggestions for better KOL targeting",
    "contentApproach": "How to improve reply quality"
  }
}`;

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].text.trim();
    return extractJSON(responseText);
  } catch (error) {
    console.error(`Claude API error analyzing engagement: ${error.message}`);
    throw error;
  }
}

export default {
  createClaudeClient,
  evaluateUserAsCryptoKOL,
  evaluateTweetForReply,
  generateReplyText,
  analyzeEngagementPatterns
};
