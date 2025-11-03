import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-sonnet-4-5-20250929';

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
export async function generateReplyText(client, tweet, kolProfile, product, evaluation, specialNotes = '') {
  const useCasesText = product.useCases && Array.isArray(product.useCases) && product.useCases.length > 0
    ? `\nUse Cases:\n${product.useCases.slice(0, 4).map(u => `- ${u}`).join('\n')}`
    : '';

  const implementationText = product.implementationSteps && Array.isArray(product.implementationSteps) && product.implementationSteps.length > 0
    ? `\nHow it works:\n${product.implementationSteps.slice(0, 3).map(s => `- ${s.title || s.description || s}`).join('\n')}`
    : '';

  const productInfo = `${product.description || product.name || 'BWS Product'}${useCasesText}${implementationText}

Documentation: ${product.url || 'https://docs.bws.ninja'}`;

  const specialNotesSection = specialNotes ? `\n\n${specialNotes}` : '';

  const prompt = `Generate a natural reply positioning BWS as a microcap opportunity with real fundamentals and long-term vision.

KOL's Tweet:
"${tweet.text}"

BWS Product(s) to Reference:
${product.slug}

Product Details:
${productInfo}${specialNotesSection}

Context from Analysis:
- Suggested Angle: ${evaluation.suggestedAngle}
- Tweet Category: ${evaluation.tweetCategory}

**POSITIONING STRATEGY**: Present BWS as an under-the-radar microcap project with:
- Real products being built (not just hype)
- Working team delivering even at microcap valuation
- Long-term vision and fundamentals
- Multiple utility products (blockchain infrastructure, credentials, NFTs, ESG)
- Opportunity for those looking beyond meme coins

Guidelines for Reply:
1. Keep it concise (under 280 characters total)
2. Lead with value/insight related to their tweet
3. Position BWS as a microcap gem: "building real products", "still at microcap", "long-term play"
4. Mention 1-2 BWS products as proof of utility
5. Emphasize fundamentals over hype: "working team", "actual utility", "vision"
6. Use conversational brand voice - be transparent this is BWS (the company) speaking
7. **CRITICAL**: NEVER use "I" - use "we" or third-person "BWS". This is BWS team/company account.
8. **REQUIRED**: Include "$BWS" cashtag somewhere in the text (not just at end)
9. **REQUIRED**: Include "@BWSCommunity" mention in the reply
10. **REQUIRED**: Link to specific product docs page or https://www.bws.ninja
11. NO salesy language: avoid "amazing", "revolutionary", "don't miss", "moon"
12. Use emojis sparingly (0-1 max)

Examples of good positioning (notice NO "I", using "we" or "$BWS"):
- "If you're looking beyond memes, $BWS is building real blockchain infrastructure at microcap valuation. Check what we're shipping @BWSCommunity"
- "$BWS ships actual products (Blockchain Badges, ESG Credits) while still under most radars. We're at https://www.bws.ninja @BWSCommunity"
- "Rare to find projects still building at this valuation - $BWS has multiple live solutions with working APIs. @BWSCommunity building long-term"
- "This resonates with our approach at $BWS - we focus on fundamentals (credentials, ESG reporting) vs hype. @BWSCommunity"

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
