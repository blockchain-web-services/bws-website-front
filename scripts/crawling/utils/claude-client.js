import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

const MODEL = 'claude-sonnet-4-5-20250929';
const QUICK_FILTER_MODEL = 'claude-3-5-haiku-20241022'; // Fast, cheap model for pre-filtering
// Option C: Use Haiku by default (91% cost savings), opt-in to Sonnet for high quality
const REPLY_MODEL = process.env.USE_SONNET_FOR_REPLIES === 'true' ? MODEL : QUICK_FILTER_MODEL;

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
 * Sanitize JSON string by removing control characters that break JSON parsing
 * This handles cases where Claude returns JSON with literal control characters
 * in tweet text (newlines, tabs, etc.)
 *
 * Strategy: Simply REMOVE all problematic control characters rather than
 * trying to escape them, as escaping can corrupt the JSON structure.
 */
function sanitizeJSONString(jsonStr) {
  // Remove all ASCII control characters (0x00-0x1F) EXCEPT:
  // - Space (0x20) - needed for formatting
  // - Tab, newline, carriage return when they appear OUTSIDE of string values

  // Step 1: Remove control characters within JSON string values
  // This regex finds content within quotes and cleans it
  let cleaned = jsonStr.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, (match, content) => {
    // Inside the string value, replace control characters with spaces
    const cleanedContent = match.replace(/[\x00-\x1F]/g, ' ');
    return cleanedContent;
  });

  // Step 2: If that didn't work, use aggressive approach - remove ALL control chars
  // except spaces and those that are clearly part of JSON structure
  if (!cleaned) {
    cleaned = jsonStr.replace(/[\x00-\x1F]/g, (char) => {
      // Keep newlines/spaces that appear outside strings (between JSON elements)
      // Replace everything else with space
      return ' ';
    });
  }

  return cleaned;
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

  const jsonStr = jsonMatch[0];

  try {
    // First attempt: parse as-is (Claude usually returns well-formed JSON)
    return JSON.parse(jsonStr);
  } catch (error) {
    // Log the problematic position for debugging
    console.log(`⚠️  JSON parse failed at position ${error.message.match(/position (\d+)/)?.[1] || 'unknown'}`);

    // Second attempt: try with sanitization if first parse fails
    try {
      const sanitized = sanitizeJSONString(jsonStr);

      // Debug: show first 200 chars of sanitized JSON
      console.log(`🔧 Sanitized JSON (first 200 chars): ${sanitized.substring(0, 200)}`);

      return JSON.parse(sanitized);
    } catch (sanitizeError) {
      // If both fail, log the raw JSON for debugging and throw detailed error
      console.error(`❌ Raw JSON (first 300 chars): ${jsonStr.substring(0, 300)}`);
      console.error(`❌ Sanitized JSON (first 300 chars): ${sanitizeJSONString(jsonStr).substring(0, 300)}`);

      throw new Error(`Failed to parse JSON: ${error.message}. Sanitization also failed: ${sanitizeError.message}`);
    }
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
Likes: ${tweet.public_metrics?.likes || tweet.public_metrics?.like_count || 0}
Retweets: ${tweet.public_metrics?.retweets || tweet.public_metrics?.retweet_count || 0}
Replies: ${tweet.public_metrics?.replies || tweet.public_metrics?.reply_count || 0}

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
 * Option B: Intelligent truncation at word boundary
 * Truncates text at word boundary near target length while preserving required elements
 */
function intelligentTruncate(text, maxLength = 270) {
  // If already within limit, return as-is
  if (text.length <= maxLength) {
    return text;
  }

  // Extract required elements (these MUST be preserved)
  const urlMatch = text.match(/https?:\/\/[^\s]+/);
  const mentionMatch = text.match(/@\w+/);
  const cashtagMatch = text.match(/\$BWS/);
  const hashtagMatches = text.match(/#\w+/g) || [];

  const requiredElements = [
    urlMatch ? urlMatch[0] : '',
    mentionMatch ? mentionMatch[0] : '',
    cashtagMatch ? cashtagMatch[0] : '',
    ...hashtagMatches.slice(0, 2) // Keep max 2 hashtags
  ].filter(Boolean);

  const requiredLength = requiredElements.join(' ').length + 2; // +2 for spaces

  // Calculate available space for main content
  const availableForContent = maxLength - requiredLength;

  if (availableForContent < 50) {
    // Not enough space - remove hashtags
    const requiredElementsNoHashtags = [
      urlMatch ? urlMatch[0] : '',
      mentionMatch ? mentionMatch[0] : '',
      cashtagMatch ? cashtagMatch[0] : ''
    ].filter(Boolean);

    const requiredLengthNoHashtags = requiredElementsNoHashtags.join(' ').length + 2;
    const newAvailable = maxLength - requiredLengthNoHashtags;

    // Extract main content (everything before required elements)
    const mainContent = text
      .replace(urlMatch ? urlMatch[0] : '', '')
      .replace(mentionMatch ? mentionMatch[0] : '', '')
      .replace(cashtagMatch ? cashtagMatch[0] : '', '')
      .replace(/#\w+/g, '')
      .trim();

    // Truncate at word boundary
    const truncated = truncateAtWordBoundary(mainContent, newAvailable);

    // Reassemble
    return `${truncated} ${requiredElementsNoHashtags.join(' ')}`.trim();
  }

  // Normal case: truncate main content and keep required elements
  const mainContent = text
    .replace(urlMatch ? urlMatch[0] : '', '')
    .replace(mentionMatch ? mentionMatch[0] : '', '')
    .replace(cashtagMatch ? cashtagMatch[0] : '', '')
    .replace(/#\w+/g, '')
    .trim();

  const truncated = truncateAtWordBoundary(mainContent, availableForContent);

  return `${truncated} ${requiredElements.join(' ')}`.trim();
}

/**
 * Helper: Truncate text at word boundary
 */
function truncateAtWordBoundary(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }

  // Find last space before maxLength
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace === -1) {
    // No space found, hard truncate
    return truncated.trim();
  }

  // Truncate at last space and add ellipsis if needed
  const result = text.substring(0, lastSpace).trim();

  // Don't add ellipsis if we're ending at sentence boundary
  if (result.match(/[.!?]$/)) {
    return result;
  }

  return result;
}

/**
 * Option A: Retry with truncation instruction
 * Makes a second API call with strict truncation requirements
 */
async function retryWithTruncationInstruction(client, originalReply, originalPrompt, model) {
  const truncationPrompt = `Your previous reply was ${originalReply.length} characters (max: 280 for Twitter).

PREVIOUS REPLY:
"${originalReply}"

TASK: Rewrite this reply to be EXACTLY under 270 characters while preserving:
1. The $BWS cashtag
2. The @BWSCommunity mention
3. The URL at the end
4. The core message

STRATEGY:
- Cut filler words ("really", "very", "actually", etc.)
- Use shorter phrases
- Reduce hashtags to 1-2 if needed
- Make description ultra-concise (10-15 words max)
- Keep technical specifics but remove adjectives

Provide JSON response with the truncated version:
{
  "replyText": "The shortened reply (MUST be under 270 characters)",
  "charactersRemoved": number,
  "tone": "insightful/authentic/community-focused"
}`;

  try {
    const message = await client.messages.create({
      model: model,
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: truncationPrompt
      }]
    });

    const responseText = message.content[0].text.trim();
    const result = extractJSON(responseText);

    return result;
  } catch (error) {
    console.error(`Claude API error in retry: ${error.message}`);
    throw error;
  }
}

/**
 * Option B: Use Claude to complete intelligently truncated text
 * Takes a truncated reply and asks Claude to complete it naturally
 */
async function completeIntelligentTruncation(client, truncatedText, requiredElements, model) {
  const completionPrompt = `Complete this truncated Twitter reply naturally. You have ${270 - truncatedText.length - requiredElements.join(' ').length} characters remaining.

TRUNCATED TEXT:
"${truncatedText}"

REQUIRED ELEMENTS TO ADD:
${requiredElements.join(', ')}

TASK: Add a natural ending + required elements. Total must be under 270 characters.

Provide JSON:
{
  "replyText": "The complete reply with natural ending + required elements",
  "tone": "insightful/authentic/community-focused"
}`;

  try {
    const message = await client.messages.create({
      model: model,
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: completionPrompt
      }]
    });

    const responseText = message.content[0].text.trim();
    const result = extractJSON(responseText);

    return result;
  } catch (error) {
    console.error(`Claude API error in completion: ${error.message}`);
    throw error;
  }
}

/**
 * Generate a reply to a tweet with enhanced diversity and specific product features
 * NOW WITH MULTI-STRATEGY CHARACTER LIMIT ENFORCEMENT (Options A, B, C)
 */
export async function generateReplyText(client, tweet, kolProfile, product, evaluation, positioningPhrase = 'microcap opportunity with real fundamentals', recentReplies = [], specialNotes = '') {
  // Select structural template for this reply
  const selectedTemplate = selectReplyTemplate(recentReplies);
  const recentTemplateIds = extractTemplateIds(recentReplies.slice(0, 5));

  // ✂️ OPTIMIZED: Limit to top 2 use cases only
  const useCasesText = product.useCases && Array.isArray(product.useCases) && product.useCases.length > 0
    ? `\nTop Use Cases: ${product.useCases.slice(0, 2).join('; ')}`
    : '';

  // ✂️ OPTIMIZED: Remove implementation steps (not used in 270-char replies)

  // Load product highlights for more specific features
  const highlights = loadProductHighlights();
  const productHighlight = highlights.productHighlights[product.name];

  // ✂️ OPTIMIZED: Limit to top 3 features only, no angles
  let specificFeaturesText = '';
  if (productHighlight) {
    const features = productHighlight.specificFeatures.slice(0, 3).map(f => `- ${f}`).join('\n');
    specificFeaturesText = `\n**Key Features** (use 1-2):\n${features}`;
  }

  const productInfo = `${product.description || product.name || 'BWS Product'}${useCasesText}${specificFeaturesText}`;

  const specialNotesSection = specialNotes ? `\n${specialNotes}` : '';

  // ✂️ OPTIMIZED: Send only patterns from last 5 replies (not full text)
  const recentRepliesContext = recentReplies.length > 0
    ? `\n**Recent Reply Patterns** (avoid repeating):\n${recentReplies.slice(0, 5).map((r, idx) => {
      const opening = r.replyText ? r.replyText.split('\n')[0].substring(0, 30) + '...' : 'N/A';
      return `${idx + 1}. Product: ${r.productMentioned || 'Platform'} | Opening: "${opening}"`;
    }).join('\n')}`
    : '';

  // Select link URL (75% product docs, 25% main site)
  const replyLink = selectReplyLink(product, highlights);

  // Build template-specific instructions
  const templateInstructions = buildTemplateInstructions(selectedTemplate, recentTemplateIds, highlights);

  const prompt = `Generate a 270-character reply positioning BWS as a ${positioningPhrase}.

Tweet: "${tweet.text}"

Product: ${product.name || 'BWS Solution'}
${productInfo}${specialNotesSection}

Context: ${evaluation.suggestedAngle} (${evaluation.tweetCategory})${recentRepliesContext}

${templateInstructions}

**REPLY RULES**:
1. MUST be under 270 chars total
2. Use "we" or "BWS" (never "I")
3. Include: $BWS cashtag + @BWSCommunity + ${replyLink}
4. Use 2-3 hashtags: #altcoins #gems #microcap #crypto
5. ${recentReplies.length > 0 ? 'Use DIFFERENT opening/features than recent replies above' : 'Use specific features from Key Features list'}
6. NO salesy language ("amazing", "revolutionary", "moon")

**POSITIONING**: Default to PLATFORM-LEVEL ("Blockchain Solutions Marketplace with multiple products") unless tweet clearly matches ONE product use case.

Examples:

Platform: "$BWS operates a Blockchain Solutions Marketplace - multiple products targeting mass markets with real utility and consistent delivery.

@BWSCommunity #microcap #altcoins https://www.bws.ninja"

Product-Specific: "$BWS Fan Game Cube: fans own digital field sections as NFTs, earn rewards during live games. Real utility for sports clubs.

@BWSCommunity #sports #GameFi https://docs.bws.ninja/marketplace-solutions/bws.nft.gamecube"

JSON response:
{
  "replyText": "Full reply with URL",
  "tone": "insightful/authentic/community-focused",
  "primaryHook": "Why relevant to their tweet"
}`;

  // === OPTION C: Use Haiku model if configured ===
  const modelToUse = REPLY_MODEL;
  console.log(`   📝 Using model: ${modelToUse === QUICK_FILTER_MODEL ? 'Haiku (fast/cheap)' : 'Sonnet (high-quality)'}`);

  try {
    // === INITIAL GENERATION ===
    const message = await client.messages.create({
      model: modelToUse,
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].text.trim();
    let result = extractJSON(responseText);

    // Add template metadata to result
    if (selectedTemplate) {
      result.templateUsed = selectedTemplate.id;
      result.templateName = selectedTemplate.name;
    }

    // === CHARACTER LIMIT ENFORCEMENT WATERFALL ===
    const initialLength = result.replyText.length;
    console.log(`   📏 Initial reply length: ${initialLength} chars`);

    if (initialLength > 280) {
      console.log(`   ⚠️  Reply exceeds 280 chars - applying fix strategies...`);

      // === OPTION A: Retry with truncation instruction ===
      console.log(`   🔄 Strategy 1: Retry with truncation instruction...`);
      try {
        const retryResult = await retryWithTruncationInstruction(client, result.replyText, prompt, modelToUse);

        if (retryResult.replyText.length <= 280) {
          console.log(`   ✅ Retry successful! New length: ${retryResult.replyText.length} chars (saved ${retryResult.charactersRemoved || initialLength - retryResult.replyText.length} chars)`);
          result.replyText = retryResult.replyText;
          result.tone = retryResult.tone;
          result.truncationMethod = 'retry_with_instruction';
          return result;
        } else {
          console.log(`   ⚠️  Retry still too long (${retryResult.replyText.length} chars) - trying next strategy...`);
        }
      } catch (retryError) {
        console.log(`   ⚠️  Retry failed: ${retryError.message} - trying next strategy...`);
      }

      // === OPTION B: Intelligent truncation ===
      console.log(`   ✂️  Strategy 2: Intelligent truncation...`);
      try {
        const truncated = intelligentTruncate(result.replyText, 270);

        if (truncated.length <= 280) {
          console.log(`   ✅ Intelligent truncation successful! New length: ${truncated.length} chars`);
          result.replyText = truncated;
          result.truncationMethod = 'intelligent_truncation';
          return result;
        } else {
          console.log(`   ⚠️  Truncation still too long (${truncated.length} chars) - applying fallback...`);
        }
      } catch (truncError) {
        console.log(`   ⚠️  Truncation failed: ${truncError.message} - applying fallback...`);
      }

      // === FALLBACK: Hard truncation at 280 chars ===
      console.log(`   🛑 Strategy 3: Hard truncation fallback at 280 chars...`);
      result.replyText = result.replyText.substring(0, 280);
      result.truncationMethod = 'hard_truncation';
      console.log(`   ✅ Hard truncation applied - length: ${result.replyText.length} chars`);
      return result;
    }

    // Reply is within limit - no fixes needed
    console.log(`   ✅ Reply within limit - no truncation needed`);
    result.truncationMethod = 'none';
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
