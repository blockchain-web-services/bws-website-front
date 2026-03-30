/**
 * Thread Generator
 * Generates multi-tweet educational threads for product-specific replies
 *
 * Templates: How-To, Problem-Solution, Feature Showcase
 * Structure: 3-4 tweets with clear CTA
 */

import { createClaudeClient } from './claude-client.js';

const THREAD_TEMPLATES = {
  'how-to': {
    name: 'How-To Guide',
    description: 'Step-by-step tutorial approach',
    weight: 40,
    structure: [
      {
        position: 1,
        purpose: 'Hook - Acknowledge pain point or need',
        maxLength: 280,
        guidelines: [
          'Respond directly to the original tweet',
          'Agree with their point or acknowledge the problem',
          'Keep it conversational and empathetic'
        ]
      },
      {
        position: 2,
        purpose: 'Introduce solution with key features',
        maxLength: 280,
        guidelines: [
          'Introduce the product by name',
          'Include $BWS cashtag',
          'List 3-4 key features as bullet points',
          'Focus on capabilities that solve the stated problem'
        ]
      },
      {
        position: 3,
        purpose: 'Getting started steps',
        maxLength: 280,
        guidelines: [
          'Provide 3-5 simple steps to get started',
          'Emphasize ease of use ("No blockchain expertise needed")',
          'Make it actionable and clear'
        ]
      },
      {
        position: 4,
        purpose: 'Call-to-action with documentation link',
        maxLength: 280,
        guidelines: [
          'Strong CTA related to use case',
          'Include documentation URL',
          'Mention @BWSCommunity',
          'Can include $BWS again if not in tweet 2'
        ]
      }
    ]
  },
  'problem-solution': {
    name: 'Problem-Solution',
    description: 'Amplify pain point then present solution',
    weight: 40,
    structure: [
      {
        position: 1,
        purpose: 'Amplify the problem or pain point',
        maxLength: 280,
        guidelines: [
          'Respond to original tweet',
          'Expand on why this problem matters',
          'Add context or statistics if relevant',
          'Build urgency'
        ]
      },
      {
        position: 2,
        purpose: 'Present solution features',
        maxLength: 280,
        guidelines: [
          'Introduce product as the solution',
          'Include $BWS cashtag',
          'List key features that address the problem',
          'Technical capabilities or unique approach'
        ]
      },
      {
        position: 3,
        purpose: 'Real-world use case or benefit',
        maxLength: 280,
        guidelines: [
          'Provide specific use case example',
          'Show business or practical benefit',
          'Make it relatable to the audience'
        ]
      },
      {
        position: 4,
        purpose: 'Call-to-action with documentation link',
        maxLength: 280,
        guidelines: [
          'Strong CTA focused on solving their problem',
          'Include documentation URL',
          'Mention @BWSCommunity'
        ]
      }
    ]
  },
  'feature-showcase': {
    name: 'Feature Showcase',
    description: 'Deep dive into specific product capability',
    weight: 20,
    structure: [
      {
        position: 1,
        purpose: 'Hook with specific feature or capability',
        maxLength: 280,
        guidelines: [
          'Respond to original tweet',
          'Lead with a compelling feature',
          'Make it relevant to their discussion'
        ]
      },
      {
        position: 2,
        purpose: 'Technical details of the feature',
        maxLength: 280,
        guidelines: [
          'Explain how it works technically',
          'Include $BWS cashtag',
          'Be specific but not overly complex',
          'Focus on what makes it unique'
        ]
      },
      {
        position: 3,
        purpose: 'Business benefits and outcomes',
        maxLength: 280,
        guidelines: [
          'Translate technical feature to business value',
          'Show ROI or practical benefit',
          'Connect to their use case'
        ]
      },
      {
        position: 4,
        purpose: 'Call-to-action with documentation link',
        maxLength: 280,
        guidelines: [
          'CTA focused on learning more',
          'Include documentation URL',
          'Mention @BWSCommunity'
        ]
      }
    ]
  }
};

/**
 * Select thread template based on tweet context
 */
function selectThreadTemplate(tweetText, product, evaluation) {
  // If evaluation suggests a specific approach, prefer that
  if (evaluation && evaluation.suggestedApproach) {
    const suggested = evaluation.suggestedApproach;
    if (THREAD_TEMPLATES[suggested]) {
      console.log(`   📋 Using suggested template: ${THREAD_TEMPLATES[suggested].name}`);
      return suggested;
    }
  }

  // Weighted random selection
  const templates = Object.keys(THREAD_TEMPLATES);
  const weights = templates.map(t => THREAD_TEMPLATES[t].weight);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  let random = Math.random() * totalWeight;
  for (let i = 0; i < templates.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      console.log(`   📋 Selected template: ${THREAD_TEMPLATES[templates[i]].name}`);
      return templates[i];
    }
  }

  return 'how-to'; // Fallback
}

/**
 * Generate educational thread using Claude AI
 */
async function generateEducationalThread(
  originalTweetId,
  tweetText,
  product,
  productInfo,
  docsContent,
  evaluation,
  config
) {
  console.log(`\n🧵 Generating educational thread for ${product}...`);

  // Select template
  const templateKey = selectThreadTemplate(tweetText, product, evaluation);
  const template = THREAD_TEMPLATES[templateKey];

  // Prepare context for Claude
  const context = {
    originalTweet: tweetText,
    product,
    docsPath: productInfo.docsPath,
    docsUrl: `https://docs.bws.ninja${productInfo.docsPath}`,
    features: docsContent?.features || productInfo.specificFeatures || [],
    technicalDetails: docsContent?.technicalDetails || productInfo.technicalDetails || [],
    howToSteps: docsContent?.howToSteps || [],
    useCases: docsContent?.useCases || [],
    uniqueAngles: docsContent?.uniqueAngles || productInfo.uniqueAngles || [],
    evaluation
  };

  // Create Claude client
  const claude = createClaudeClient();

  // Generate thread
  const prompt = buildThreadPrompt(context, template);

  console.log(`   🤖 Calling Claude AI to generate ${template.structure.length}-tweet thread...`);

  try {
    const response = await claude.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2000,
      temperature: 0.8,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    let responseText = response.content[0].text;

    // Strip markdown code fences if present
    responseText = responseText.trim();
    if (responseText.startsWith('```json')) {
      responseText = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Parse JSON response
    let threadData;
    try {
      threadData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('   ❌ Failed to parse Claude response as JSON');
      console.error('   Response:', responseText.substring(0, 200));
      throw new Error('Claude returned invalid JSON');
    }

    // Validate thread
    const validated = validateThread(threadData, product, template);

    if (!validated.isValid) {
      console.error(`   ❌ Thread validation failed: ${validated.errors.join(', ')}`);
      throw new Error(`Thread validation failed: ${validated.errors[0]}`);
    }

    console.log(`   ✅ Generated ${threadData.tweets.length}-tweet thread (${templateKey})`);
    threadData.tweets.forEach((tweet, i) => {
      console.log(`      ${i + 1}. ${tweet.purpose} (${tweet.text.length} chars)`);
    });

    return {
      ...threadData,
      templateUsed: templateKey,
      templateName: template.name,
      originalTweetId
    };
  } catch (error) {
    console.error(`   ❌ Error generating thread: ${error.message}`);
    throw error;
  }
}

/**
 * Build prompt for Claude to generate thread
 */
function buildThreadPrompt(context, template) {
  return `You are creating an educational Twitter thread to reply to a tweet and introduce ${context.product} as a solution.

**Original Tweet**:
"${context.originalTweet}"

**Product**: ${context.product}
**Documentation**: ${context.docsUrl}

**Product Information**:
Features:
${context.features.map(f => `  - ${f}`).join('\n')}

Technical Details:
${context.technicalDetails.map(d => `  - ${d}`).join('\n')}

How-To Steps:
${context.howToSteps.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}

Use Cases:
${context.useCases.map(u => `  - ${u}`).join('\n')}

Unique Angles:
${context.uniqueAngles.map(a => `  - ${a}`).join('\n')}

**Evaluation Context**:
${context.evaluation ? `
- Detected Pain Point: ${context.evaluation.detectedPainPoint}
- Suggested Approach: ${context.evaluation.suggestedApproach}
- Key Features to Highlight: ${context.evaluation.keyFeaturesToHighlight?.join(', ')}
` : 'No evaluation provided'}

**Thread Template**: ${template.name}
**Structure**: ${template.structure.length} tweets

**Thread Structure Requirements**:
${template.structure.map((tweet, i) => `
Tweet ${tweet.position}:
  Purpose: ${tweet.purpose}
  Max Length: ${tweet.maxLength} characters
  Guidelines:
${tweet.guidelines.map(g => `    - ${g}`).join('\n')}
`).join('\n')}

**Critical Requirements**:
1. Mention ONLY ${context.product} - do NOT reference other BWS products
2. Include $BWS cashtag exactly once (preferably in tweet 2)
3. Mention @BWSCommunity in the final tweet
4. Each tweet must be under 280 characters
5. First tweet must respond naturally to the original tweet
6. Last tweet must include the documentation URL: ${context.docsUrl}
7. Use conversational, helpful tone (not salesy or pushy)
8. Focus on practical value and how to get started
9. No emojis except for bullet points (•) if listing features
10. Make each tweet standalone readable but part of coherent thread
11. **FORMATTING**: When using bullet lists, ALWAYS add a blank line before the first bullet point for readability

**Output Format**:
Respond with valid JSON only (no markdown code blocks):
{
  "approach": "${template.name.toLowerCase().replace(/ /g, '-')}",
  "tweets": [
    {
      "position": 1,
      "text": "Tweet text here (max 280 chars)",
      "purpose": "${template.structure[0].purpose}"
    },
    {
      "position": 2,
      "text": "Tweet text here",
      "purpose": "${template.structure[1].purpose}"
    },
    {
      "position": 3,
      "text": "Tweet text here",
      "purpose": "${template.structure[2].purpose}"
    },
    {
      "position": 4,
      "text": "Tweet text here with ${context.docsUrl}",
      "purpose": "${template.structure[3].purpose}"
    }
  ],
  "productMentioned": "${context.product}",
  "includesCTA": true,
  "includesDocsLink": true
}`;
}

/**
 * Validate generated thread
 */
function validateThread(threadData, product, template) {
  const errors = [];

  // Check thread structure
  if (!threadData.tweets || !Array.isArray(threadData.tweets)) {
    errors.push('Thread must have tweets array');
    return { isValid: false, errors };
  }

  if (threadData.tweets.length !== template.structure.length) {
    errors.push(`Thread must have ${template.structure.length} tweets, got ${threadData.tweets.length}`);
  }

  // Check each tweet
  threadData.tweets.forEach((tweet, i) => {
    // Character limit
    if (tweet.text.length > 280) {
      errors.push(`Tweet ${i + 1} exceeds 280 characters (${tweet.text.length})`);
    }

    // Position matches
    if (tweet.position !== i + 1) {
      errors.push(`Tweet ${i + 1} has wrong position: ${tweet.position}`);
    }
  });

  // Check product isolation (no other BWS product mentions)
  const otherProducts = [
    'X Bot', 'Blockchain Hash', 'NFT.zK',
    'Blockchain Badges', 'BWS IPFS', 'Blockchain Save'
  ].filter(p => p !== product);

  const fullThreadText = threadData.tweets.map(t => t.text).join(' ');

  for (const otherProduct of otherProducts) {
    if (fullThreadText.includes(otherProduct)) {
      errors.push(`Thread mentions other product: ${otherProduct}`);
    }
  }

  // Check $BWS cashtag presence
  const bwsCount = fullThreadText.match(/\$BWS/g)?.length || 0;
  if (bwsCount === 0) {
    errors.push('Thread must include $BWS cashtag');
  }
  if (bwsCount > 2) {
    errors.push('Thread should include $BWS cashtag at most twice');
  }

  // Check @BWSCommunity in last tweet
  const lastTweet = threadData.tweets[threadData.tweets.length - 1];
  if (!lastTweet.text.includes('@BWSCommunity')) {
    errors.push('Last tweet must include @BWSCommunity');
  }

  // Check documentation link in last tweet
  if (!lastTweet.text.includes('docs.bws.ninja')) {
    errors.push('Last tweet must include documentation link');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Get template statistics
 */
function getTemplateStats() {
  const stats = {};

  for (const [key, template] of Object.entries(THREAD_TEMPLATES)) {
    stats[key] = {
      name: template.name,
      weight: template.weight,
      tweetCount: template.structure.length,
      description: template.description
    };
  }

  return stats;
}

export {
  generateEducationalThread,
  selectThreadTemplate,
  validateThread,
  getTemplateStats,
  THREAD_TEMPLATES
};
