import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

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

// Load product highlights once at module level
let productHighlights = null;
function loadProductHighlights() {
  if (productHighlights) return productHighlights;

  try {
    const highlightsPath = path.join(process.cwd(), 'scripts/crawling/config/product-highlights.json');
    const data = fs.readFileSync(highlightsPath, 'utf-8');
    productHighlights = JSON.parse(data);
    return productHighlights;
  } catch (error) {
    console.warn(`⚠️  Could not load product-highlights.json: ${error.message}`);
    return { productHighlights: {}, diversityGuidelines: {} };
  }
}

// Load reply templates once at module level
let replyTemplates = null;
function loadReplyTemplates() {
  if (replyTemplates) return replyTemplates;

  try {
    const templatesPath = path.join(process.cwd(), 'scripts/crawling/config/reply-templates.json');
    const data = fs.readFileSync(templatesPath, 'utf-8');
    replyTemplates = JSON.parse(data);
    return replyTemplates;
  } catch (error) {
    console.warn(`⚠️  Could not load reply-templates.json: ${error.message}`);
    return { templates: [] };
  }
}

/**
 * Extract template IDs from recent replies
 */
function extractTemplateIds(replies) {
  return replies
    .filter(r => r.templateUsed)
    .map(r => r.templateUsed);
}

/**
 * Weighted random selection from array of templates
 */
function weightedRandomSelect(templates) {
  // Calculate total weight
  const totalWeight = templates.reduce((sum, t) => sum + (t.weight || 0), 0);

  if (totalWeight === 0) {
    // No weights, select randomly
    return templates[Math.floor(Math.random() * templates.length)];
  }

  // Generate random number between 0 and totalWeight
  let random = Math.random() * totalWeight;

  // Select based on cumulative weights
  for (const template of templates) {
    random -= (template.weight || 0);
    if (random <= 0) {
      return template;
    }
  }

  // Fallback to last template
  return templates[templates.length - 1];
}

/**
 * Select appropriate reply template based on recent usage
 * Avoids using same template consecutively
 */
function selectReplyTemplate(recentReplies = []) {
  const templatesData = loadReplyTemplates();
  const allTemplates = templatesData.templates || [];

  if (allTemplates.length === 0) {
    console.warn('⚠️  No templates loaded, using default structure');
    return null;
  }

  // Get templates used in last 5 replies
  const recentTemplateIds = extractTemplateIds(recentReplies.slice(0, 5));

  // Filter out templates used in last 3 replies to avoid immediate repetition
  const recentlyUsed = recentTemplateIds.slice(0, 3);
  const availableTemplates = allTemplates.filter(t => !recentlyUsed.includes(t.id));

  // If all templates were recently used, reset and use all
  const templatesPool = availableTemplates.length > 0 ? availableTemplates : allTemplates;

  // Weighted random selection
  const selected = weightedRandomSelect(templatesPool);

  console.log(`📋 Template selected: "${selected.name}" (${selected.id})`);
  console.log(`   Recent templates: [${recentTemplateIds.slice(0, 3).join(', ')}]`);

  return selected;
}

/**
 * Select appropriate product image for reply
 * Prioritizes images based on priority level and template type
 *
 * @param {Object} product - Product object with images array
 * @param {Object} template - Selected reply template (optional)
 * @returns {Object|null} Selected image metadata or null
 */
export function selectProductImage(product, template = null) {
  if (!product.images || product.images.length === 0) {
    return null;
  }

  // Sort images by priority (lowest number = highest priority)
  const sortedImages = [...product.images].sort((a, b) => {
    const priorityA = a.priority || 999;
    const priorityB = b.priority || 999;
    return priorityA - priorityB;
  });

  // Strategy: Use first image (highest priority, typically product hero/overview)
  // Future enhancement: Template-aware selection
  // - feature_list template → UI screenshots (type: "screenshot")
  // - stat_driven template → Analytics dashboards
  // - problem_solution template → Hero shots (type: "hero")

  const selectedImage = sortedImages[0];

  console.log(`📸 Image selected: ${selectedImage.localPath || selectedImage.path}`);
  if (selectedImage.alt) {
    console.log(`   Alt: ${selectedImage.alt}`);
  }

  return selectedImage;
}

/**
 * Select link URL for reply
 * Rotates between product-specific docs and main BWS site
 *
 * @param {Object} product - Product object with docsPath
 * @param {Object} highlights - Product highlights configuration with linkRotationSettings
 * @returns {string} URL to include in reply
 */
export function selectReplyLink(product, highlights) {
  const settings = highlights.linkRotationSettings || {
    mainSiteWeight: 0.25,
    productDocsWeight: 0.75,
    mainSiteUrl: 'https://www.bws.ninja',
    docsBaseUrl: 'https://docs.bws.ninja'
  };

  // Weighted random selection (75% product docs, 25% main site)
  const useMainSite = Math.random() < settings.mainSiteWeight;

  if (useMainSite) {
    console.log(`🔗 Link selected: Main site (${settings.mainSiteUrl})`);
    return settings.mainSiteUrl;
  }

  // Get product-specific docs path
  const productName = product.name || 'Unknown Product';
  const productHighlights = highlights.productHighlights[productName];

  if (productHighlights && productHighlights.docsPath) {
    const productDocsUrl = settings.docsBaseUrl + productHighlights.docsPath;
    console.log(`🔗 Link selected: Product docs (${productDocsUrl})`);
    return productDocsUrl;
  }

  // Fallback to main site if no docs path found
  console.log(`🔗 Link selected: Main site (fallback - no docs path for ${productName})`);
  return settings.mainSiteUrl;
}

/**
 * Build template-specific prompt instructions
 */
function buildTemplateInstructions(template, recentTemplateIds, productHighlights) {
  if (!template) return '';

  const structure = template.structure;
  const formatting = template.formatting;

  let instructions = `\n\n**🎨 STRUCTURAL TEMPLATE FOR THIS REPLY**: ${template.name}\n\n`;
  instructions += `**Description**: ${template.description}\n\n`;

  // Structure requirements
  instructions += `**Structure Requirements**:\n`;
  instructions += `- Paragraphs: ${structure.paragraphs}\n`;

  if (structure.opening) {
    const openingSentences = Array.isArray(structure.opening.sentences)
      ? `${structure.opening.sentences[0]}-${structure.opening.sentences[1]}`
      : structure.opening.sentences;
    instructions += `- Opening: ${openingSentences} sentence(s), pattern: ${structure.opening.pattern}\n`;
    if (structure.opening.instruction) {
      instructions += `  → ${structure.opening.instruction}\n`;
    }
  }

  if (structure.middle) {
    instructions += `- Middle section: `;
    if (structure.middle.format === 'bullet_list') {
      const bulletCount = Array.isArray(structure.middle.bulletCount)
        ? `${structure.middle.bulletCount[0]}-${structure.middle.bulletCount[1]}`
        : structure.middle.bulletCount;
      instructions += `BULLET LIST format with ${bulletCount} bullets\n`;
    } else {
      const middleSentences = Array.isArray(structure.middle.sentences)
        ? `${structure.middle.sentences[0]}-${structure.middle.sentences[1]}`
        : structure.middle.sentences;
      instructions += `${middleSentences} sentence(s)\n`;
    }

    // EXPLICIT $BWS POSITIONING INSTRUCTIONS
    if (structure.middle.startsWithCashtag) {
      instructions += `  → ⚠️  CRITICAL: Start immediately with "$BWS [Product Name]:" (no text before $BWS)\n`;
    } else if (structure.middle.cashtagPosition === 'middle') {
      instructions += `  → ⚠️  CRITICAL: Product name FIRST, then $BWS in MIDDLE of content\n`;
      instructions += `     Example: "[Product] [feature]. $BWS [additional detail]."\n`;
    } else if (structure.middle.cashtagPosition === 'middle-end') {
      instructions += `  → ⚠️  CRITICAL: Product name FIRST (no $BWS). Add $BWS in SECOND sentence.\n`;
      instructions += `     Example: "[Product] [features]. This is what $BWS ships..."\n`;
    } else if (structure.middle.startsWithCashtag === false) {
      instructions += `  → ⚠️  CRITICAL: DO NOT start with $BWS. Place it naturally in middle/end.\n`;
    }

    if (structure.middle.instruction) {
      instructions += `  → ${structure.middle.instruction}\n`;
    }
  }

  if (structure.conclusion) {
    const conclusionSentences = Array.isArray(structure.conclusion.sentences)
      ? `${structure.conclusion.sentences[0]}-${structure.conclusion.sentences[1]}`
      : structure.conclusion.sentences;
    instructions += `- Conclusion: ${conclusionSentences} sentence(s)`;
    if (structure.conclusion.includesCashtag) {
      instructions += `, must include $BWS`;
    }
    instructions += `\n`;
    if (structure.conclusion.instruction) {
      instructions += `  → ${structure.conclusion.instruction}\n`;
    }
  }

  // Formatting requirements
  instructions += `\n**Formatting**:\n`;
  instructions += `- Emojis: ${formatting.emojis ? `YES - Use 1-${formatting.emojiLimit || 2} contextual emojis` : 'NO - Plain text only'}\n`;
  instructions += `- Bullet points: ${formatting.bulletPoints ? 'YES - Use • for features' : 'NO'}\n`;

  // Add template-specific guidelines if available
  const guidelines = productHighlights?.templateGuidelines?.[template.id];
  if (guidelines) {
    instructions += `\n**${template.name} Guidelines**:\n`;

    if (guidelines.bulletPointRules) {
      instructions += `\nBullet Point Rules:\n`;
      guidelines.bulletPointRules.forEach(rule => {
        instructions += `- ${rule}\n`;
      });
    }

    if (guidelines.emojiRules) {
      instructions += `\nEmoji Rules:\n`;
      guidelines.emojiRules.forEach(rule => {
        instructions += `- ${rule}\n`;
      });
    }

    if (guidelines.problemStatementRules) {
      instructions += `\nProblem Statement Rules:\n`;
      guidelines.problemStatementRules.forEach(rule => {
        instructions += `- ${rule}\n`;
      });
    }

    if (guidelines.cashtagPlacementRules) {
      instructions += `\nCashtag Placement:\n`;
      guidelines.cashtagPlacementRules.forEach(rule => {
        instructions += `- ${rule}\n`;
      });
    }
  }

  // Add examples
  if (template.examples && template.examples.length > 0) {
    instructions += `\n**${template.name} EXAMPLES**:\n\n`;
    template.examples.forEach((ex, idx) => {
      instructions += `Example ${idx + 1}:\n"${ex.text}"\n\n`;
    });
  }

  // Diversity requirements
  instructions += `**STRUCTURAL DIVERSITY**:\n`;
  instructions += `- This reply uses: "${template.name}" template\n`;
  instructions += `- Recent templates used: [${recentTemplateIds.slice(0, 3).join(', ') || 'none'}] - DO NOT replicate these structures\n`;
  instructions += `- Follow the structure rules above EXACTLY\n`;
  instructions += `- Vary sentence lengths within the template constraints\n`;

  return instructions;
}

/**
 * Generate a reply to a tweet with enhanced diversity and specific product features
 */
export async function generateReplyText(client, tweet, kolProfile, product, evaluation, positioningPhrase = 'microcap opportunity with real fundamentals', recentReplies = [], specialNotes = '') {
  // Select structural template for this reply
  const selectedTemplate = selectReplyTemplate(recentReplies);
  const recentTemplateIds = extractTemplateIds(recentReplies.slice(0, 5));

  const useCasesText = product.useCases && Array.isArray(product.useCases) && product.useCases.length > 0
    ? `\nUse Cases:\n${product.useCases.slice(0, 4).map(u => `- ${u}`).join('\n')}`
    : '';

  const implementationText = product.implementationSteps && Array.isArray(product.implementationSteps) && product.implementationSteps.length > 0
    ? `\nHow it works:\n${product.implementationSteps.slice(0, 3).map(s => `- ${s.title || s.description || s}`).join('\n')}`
    : '';

  // Load product highlights for more specific features
  const highlights = loadProductHighlights();
  const productHighlight = highlights.productHighlights[product.name];

  let specificFeaturesText = '';
  if (productHighlight) {
    const features = productHighlight.specificFeatures.slice(0, 5).map(f => `- ${f}`).join('\n');
    const angles = productHighlight.uniqueAngles.slice(0, 3).map(a => `- ${a}`).join('\n');
    specificFeaturesText = `\n\n**Specific ${product.name} Features** (use 1-2 of these for variety):\n${features}\n\n**Unique Positioning Angles**:\n${angles}`;
  }

  const productInfo = `${product.description || product.name || 'BWS Product'}${useCasesText}${implementationText}${specificFeaturesText}

Documentation: ${product.url || 'https://docs.bws.ninja'}`;

  const specialNotesSection = specialNotes ? `\n\n${specialNotes}` : '';

  // Build recent replies context for diversity (last 10 replies)
  const recentRepliesContext = recentReplies.length > 0
    ? `\n\n**RECENT REPLIES CONTEXT** (CRITICAL - avoid these patterns/phrases/structures):\n${recentReplies.slice(0, 10).map((r, idx) =>
      `${idx + 1}. [${r.timestamp ? new Date(r.timestamp).toLocaleDateString() : 'recent'}] Product: ${r.productMentioned}\n   Reply: "${r.replyText}"\n`
    ).join('')}`
    : '';

  // Select link URL (75% product docs, 25% main site)
  const replyLink = selectReplyLink(product, highlights);

  // Build template-specific instructions
  const templateInstructions = buildTemplateInstructions(selectedTemplate, recentTemplateIds, highlights);

  const prompt = `Generate a natural reply positioning BWS as a ${positioningPhrase}.

KOL's Tweet:
"${tweet.text}"

BWS Product to Reference:
${product.name || 'BWS Solution'}
URL: ${replyLink}

Product Details:
${productInfo}${specialNotesSection}

Context from Analysis:
- Suggested Angle: ${evaluation.suggestedAngle}
- Tweet Category: ${evaluation.tweetCategory}${recentRepliesContext}

**CONTENT DIVERSITY REQUIREMENTS** (CRITICAL - read recent replies carefully):
${recentReplies.length > 0 ? `
You have ${recentReplies.length} recent replies above. Your NEW reply MUST:
1. Use DIFFERENT opening phrases (don't start with same words as recent replies)
2. Highlight DIFFERENT product features (pick specific features from the list, don't use generic statements)
3. Use DIFFERENT sentence structures and flow
4. Vary between problem-solution, feature-benefit, use-case, technical detail approaches
5. Mix high-level platform positioning with specific technical capabilities

**SPECIFIC vs GENERIC - USE SPECIFIC FEATURES**:
❌ BAD (generic): "$BWS X Bot provides verifiable KOL analytics using official X API"
✅ GOOD (specific): "$BWS X Bot tracks engagement rates across 100+ KOLs simultaneously with bot farm detection through pattern analysis"

❌ BAD (generic): "$BWS Fan Game Cube creates revenue streams for sports clubs"
✅ GOOD (specific): "Fans own digital field sections as NFTs - earn points when game events happen at their location, creating new monetization for clubs"

USE THE SPECIFIC FEATURES LIST ABOVE - pick 1-2 unique features to highlight!
` : 'Create a unique, engaging reply using specific product features from the list above.'}

**POSITIONING STRATEGY**: Focus on the angle "${positioningPhrase}". Vary your approach based on:
- The KOL's tweet context and sentiment
- Recent replies (avoid repeating similar structures/products/phrases)
- The specific BWS product's strengths and SPECIFIC FEATURES listed above
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
${templateInstructions}

**GENERAL REPLY GUIDELINES** (Apply to all templates):
1. Keep total reply under 280 characters including line breaks
2. Use conversational brand voice - be transparent this is BWS (the company) speaking
3. **CRITICAL**: NEVER use "I" - use "we" or third-person "BWS". This is BWS team/company account.
4. **REQUIRED**: Include "$BWS" cashtag somewhere in the reply
   ⚠️  **$BWS POSITIONING VARIES BY TEMPLATE** - Follow the template's cashtag placement instructions EXACTLY:
   - Some templates start with "$BWS" immediately
   - Some templates mention product name FIRST, then $BWS later
   - Check the template instructions above for the EXACT positioning rule
5. **REQUIRED**: Include "@BWSCommunity" in the closing line
6. **CRITICAL - MUST INCLUDE LINK**: End reply with the URL provided above: ${replyLink}
   - Place link at the very end after @BWSCommunity and hashtags
   - This link is REQUIRED in every reply - do not omit it
7. **HASHTAGS**: Choose 2-3 hashtags that relate to the tweet context (e.g., #altcoins #gems #microcap #blockchain #DeFi #Web3 #crypto)
8. NO salesy language: avoid "amazing", "revolutionary", "don't miss", "moon"
9. **CRITICAL**: Follow the TEMPLATE STRUCTURE above EXACTLY - especially the $BWS placement rule - this is the most important requirement

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
    const result = extractJSON(responseText);

    // Add template metadata to result
    if (selectedTemplate) {
      result.templateUsed = selectedTemplate.id;
      result.templateName = selectedTemplate.name;
    }

    return result;
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

/**
 * Evaluate tweet for product-specific reply (customer acquisition)
 * Analyzes if tweet discusses pain points that a BWS product solves
 */
export async function evaluateTweetForProductReply(tweetText, productName, productHighlight) {
  const client = createClaudeClient();

  const specificFeatures = productHighlight.specificFeatures?.join('\n• ') || '';
  const technicalDetails = productHighlight.technicalDetails?.join('\n• ') || '';
  const uniqueAngles = productHighlight.uniqueAngles?.join('\n• ') || '';

  const prompt = `You are analyzing a tweet to determine if it's a good opportunity to reply with educational content about ${productName}, a BWS product.

**${productName} Overview:**
${productHighlight.docsPath ? `Documentation: https://docs.bws.ninja${productHighlight.docsPath}` : ''}

**Key Features:**
• ${specificFeatures}

**Technical Details:**
• ${technicalDetails}

**Value Propositions:**
• ${uniqueAngles}

**Tweet to Analyze:**
"${tweetText}"

**Task:** Evaluate if this tweet presents a good opportunity for educational outreach about ${productName}.

**Consider:**
1. Does the tweet discuss a problem that ${productName} solves?
2. Is the author expressing frustration, asking questions, or seeking solutions?
3. Is the context professional/technical (vs. casual/meme)?
4. Would a helpful educational thread about ${productName} be valuable and relevant?

**Scoring Guidelines:**
- 90-100: Perfect match - tweet directly discusses the exact problem ${productName} solves
- 70-89: Good match - tweet discusses related problems or expresses clear need
- 50-69: Moderate match - tangentially related but connection requires explanation
- 30-49: Weak match - very indirect connection, forced fit
- 0-29: Poor match - unrelated or inappropriate context

Respond with JSON only:
{
  "relevanceScore": <0-100>,
  "detectedPainPoint": "<specific problem mentioned in tweet>",
  "howProductHelps": "<how ${productName} addresses this specific pain point>",
  "suggestedApproach": "how-to" | "problem-solution" | "feature-showcase",
  "reasoning": "<brief explanation of score>"
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].text.trim();
    return extractJSON(responseText);
  } catch (error) {
    console.error(`Claude API error evaluating product tweet: ${error.message}`);
    throw error;
  }
}

export default {
  createClaudeClient,
  evaluateUserAsCryptoKOL,
  evaluateTweetForReply,
  evaluateTweetForProductReply,
  generateReplyText,
  analyzeEngagementPatterns,
  selectProductImage,
  selectReplyLink
};
