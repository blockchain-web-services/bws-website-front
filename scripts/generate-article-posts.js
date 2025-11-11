import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from worktree root
const worktreeRoot = join(__dirname, '..');
dotenv.config({ path: join(worktreeRoot, '.env') });

// Configuration
const ARTICLE_X_POSTS_FILE = join(__dirname, 'data', 'article-x-posts.json');
const DOCS_INDEX_FILE = join(__dirname, 'data', 'docs-index.json');
const ARTICLES_FILE = join(__dirname, '..', 'src', 'data', 'articles.ts');

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

/**
 * Parse articles.ts file to extract article metadata
 */
function loadArticles() {
  console.log('📖 Loading articles from articles.ts...');

  const articlesContent = readFileSync(ARTICLES_FILE, 'utf8');

  // Extract the articles array using regex
  const articlesMatch = articlesContent.match(/export const articles: ArticleMetadata\[\] = \[([\s\S]*)\];/);

  if (!articlesMatch) {
    throw new Error('Could not find articles array in articles.ts');
  }

  // Parse the articles - this is a simplified parser
  // In production, you might want to use a proper TypeScript parser
  const articlesString = articlesMatch[1];

  // Extract individual article objects
  const articleMatches = [...articlesString.matchAll(/\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/gs)];

  const articles = articleMatches.map(match => {
    const articleStr = match[0];

    // Extract fields
    const slug = articleStr.match(/slug:\s*['"]([^'"]+)['"]/)?.[1];
    const product = articleStr.match(/product:\s*['"]([^'"]+)['"]/)?.[1];
    const title = articleStr.match(/title:\s*['"]([^'"]+)['"]/)?.[1];
    const subtitle = articleStr.match(/subtitle:\s*['"]([^'"]+)['"]/)?.[1];
    const publishDate = articleStr.match(/publishDate:\s*['"]([^'"]+)['"]/)?.[1];
    const seoDescription = articleStr.match(/seoDescription:\s*['"]([^'"]+)['"]/)?.[1];

    return {
      slug,
      product,
      title,
      subtitle,
      publishDate,
      seoDescription
    };
  }).filter(article => article.slug && article.product);

  console.log(`   ✅ Loaded ${articles.length} articles\n`);
  return articles;
}

/**
 * Load docs index with product mappings
 */
function loadDocsIndex() {
  console.log('📚 Loading docs index...');

  if (!existsSync(DOCS_INDEX_FILE)) {
    console.log('   ⚠️  Docs index not found, will use default URLs\n');
    return { productMapping: {} };
  }

  const docsIndex = JSON.parse(readFileSync(DOCS_INDEX_FILE, 'utf8'));
  console.log(`   ✅ Loaded ${Object.keys(docsIndex.productMapping || {}).length} product mappings\n`);

  return docsIndex;
}

/**
 * Load existing article X posts
 */
function loadExistingPosts() {
  if (!existsSync(ARTICLE_X_POSTS_FILE)) {
    console.log('📝 No existing posts file, creating new one...\n');
    return {
      metadata: {
        lastGenerated: null,
        totalPosts: 0,
        totalArticles: 0
      },
      posts: []
    };
  }

  console.log('📝 Loading existing posts...');
  const data = JSON.parse(readFileSync(ARTICLE_X_POSTS_FILE, 'utf8'));
  console.log(`   ✅ Found ${data.posts?.length || 0} existing posts\n`);

  return data;
}

/**
 * Check if article already has posts generated
 */
function hasPostsForArticle(existingPosts, articleSlug) {
  return existingPosts.posts.some(post => post.articleSlug === articleSlug);
}

/**
 * Get docs URL for product
 */
function getDocsUrl(product, docsIndex) {
  const productMapping = docsIndex.productMapping || {};

  // Try to find exact match
  if (productMapping[product] && productMapping[product].length > 0) {
    return productMapping[product][0];
  }

  // Fallback to main docs page
  return 'https://docs.bws.ninja';
}

/**
 * Generate posts for an article using Anthropic API
 */
async function generatePostsForArticle(article, docsUrl) {
  console.log(`🤖 Generating posts for: ${article.title}`);
  console.log(`   Product: ${article.product}`);
  console.log(`   Docs URL: ${docsUrl}`);

  const articleUrl = `https://www.bws.ninja/articles/${article.slug}`;

  // System prompt for Claude
  const systemPrompt = `You are a technical content writer for @BWSXAI - the official account for Blockchain Web Services. Write informative, neutral X (Twitter) posts about blockchain technology and products.

CRITICAL: AVOID PROMOTIONAL LANGUAGE
- NO sales-y phrases like "Stop doing X", "Transform your Y", "Revolutionize Z"
- NO hype words like "game-changer", "revolutionary", "cutting-edge"
- NO aggressive calls-to-action or urgency tactics
- USE factual, descriptive, educational tone
- DESCRIBE what the product does, not what problems it "solves"
- WRITE like a technical blog, not a sales pitch

STYLE GUIDELINES:
- Clear, neutral, informative language
- Factual descriptions of capabilities
- Educational and technical tone
- Use active voice
- Focus on explaining functionality

FORMAT REQUIREMENTS:
- Maximum 250 characters for main text (before links/mentions/hashtags)
- Must include: @BWSCommunity mention
- Must include: $BWS token ticker
- Must include: 2 relevant hashtags (product/industry specific)
- Must include: BOTH article link AND docs link
- Each post must be self-contained and informative
- NO emojis unless explicitly requested

CONTENT STRATEGY:
- Describe technical capabilities and features
- Provide concrete examples of functionality
- Include both article and docs links for detailed info
- Vary the angle (overview, feature, implementation example)

TARGET AUDIENCE:
- Developers integrating blockchain solutions
- Web3 project managers and technical leads
- Blockchain technology enthusiasts`;

  const userPrompt = `Generate 3 X posts for this article:

ARTICLE DETAILS:
- Product: ${article.product}
- Title: ${article.title}
- Subtitle: ${article.subtitle}
- Article URL: ${articleUrl}
- Docs URL: ${docsUrl}
- SEO Description: ${article.seoDescription}

REQUIRED POSTS:
1. **Overview Post** (High Priority)
   - Describe what the product/feature does
   - Use neutral, factual language
   - NO promotional phrases or pain points
   - Include BOTH article link AND docs link
   - Must include @BWSCommunity
   - Must include $BWS
   - 2 hashtags: product-related + industry

2. **Feature Description Post** (Medium Priority)
   - Explain ONE specific capability or function
   - Use technical but accessible language
   - Include a concrete implementation example
   - Include BOTH article link AND docs link
   - Must include @BWSCommunity
   - Must include $BWS
   - 2 hashtags: feature-specific + technical

3. **Implementation Example Post** (Medium Priority)
   - Describe a practical usage scenario
   - Focus on HOW it works, not WHY you need it
   - Use descriptive, educational tone
   - Include BOTH article link AND docs link
   - Must include @BWSCommunity
   - Must include $BWS
   - 2 hashtags: industry + application-specific

Return ONLY a JSON array with exactly 3 posts in this format:
[
  {
    "type": "overview",
    "text": "X Bot provides automated tracking for community mentions across X and Telegram. Real-time leaderboards and analytics for engagement monitoring. Built by @BWSCommunity using $BWS",
    "articleUrl": "${articleUrl}",
    "docsUrl": "${docsUrl}",
    "hashtags": ["XBot", "Web3Community"],
    "priority": "high"
  },
  {
    "type": "feature",
    "text": "The platform includes mention detection, engagement scoring, and customizable leaderboards. Integration available via REST API. @BWSCommunity $BWS",
    "articleUrl": "${articleUrl}",
    "docsUrl": "${docsUrl}",
    "hashtags": ["APIIntegration", "Analytics"],
    "priority": "medium"
  },
  {
    "type": "implementation",
    "text": "Projects use X Bot to track advocate activity and reward contributors. The system aggregates data from multiple social platforms. @BWSCommunity $BWS",
    "articleUrl": "${articleUrl}",
    "docsUrl": "${docsUrl}",
    "hashtags": ["CommunityTools", "Web3"],
    "priority": "medium"
  }
]

CRITICAL FORMATTING RULES:
- Main text: up to 250 characters (keep it SHORT)
- Must include @BWSCommunity mention in text
- Must include $BWS ticker in text
- NO promotional or sales language
- Use factual, descriptive, educational tone
- Return ONLY valid JSON, no markdown, no explanation

EXAMPLE FORMAT:
"text": "Problem statement here. Solution with @BWSCommunity $BWS."
"articleUrl": "https://www.bws.ninja/articles/..."
"docsUrl": "https://docs.bws.ninja/..."
"hashtags": ["Web3", "Blockchain"]`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{
        role: "user",
        content: userPrompt
      }]
    });

    // Extract JSON from response
    const responseText = response.content[0].text;

    // Try to parse JSON (Claude might wrap it in markdown)
    let posts;
    try {
      posts = JSON.parse(responseText);
    } catch (e) {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        posts = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Could not parse JSON from Claude response');
      }
    }

    // Validate and enhance posts
    const enhancedPosts = posts.map((post, index) => {
      // Construct full tweet text with links and hashtags
      const hashtagsText = post.hashtags.map(tag => `#${tag}`).join(' ');
      const fullText = `${post.text}\n\n📖 Article: ${post.articleUrl}\n📚 Docs: ${post.docsUrl}\n\n${hashtagsText}`;

      return {
        id: crypto.randomUUID(),
        articleSlug: article.slug,
        product: article.product,
        type: post.type,
        text: fullText,
        mainText: post.text,
        articleUrl: post.articleUrl,
        docsUrl: post.docsUrl,
        hashtags: post.hashtags || [],
        priority: post.priority || 'medium',
        status: 'pending',
        scheduledFor: null,
        postedAt: null,
        tweetId: null,
        generatedAt: new Date().toISOString(),
        metadata: {
          articleTitle: article.title,
          articlePublishDate: article.publishDate,
          mainTextLength: post.text.length,
          fullTextLength: fullText.length
        }
      };
    });

    console.log(`   ✅ Generated ${enhancedPosts.length} posts\n`);

    return enhancedPosts;

  } catch (error) {
    console.error(`   ❌ Error generating posts: ${error.message}\n`);
    throw error;
  }
}

/**
 * Save posts to file
 */
function savePosts(postsData) {
  console.log('💾 Saving posts to file...');

  // Update metadata
  postsData.metadata = {
    lastGenerated: new Date().toISOString(),
    totalPosts: postsData.posts.length,
    totalArticles: [...new Set(postsData.posts.map(p => p.articleSlug))].length,
    pendingPosts: postsData.posts.filter(p => p.status === 'pending').length,
    postedCount: postsData.posts.filter(p => p.status === 'posted').length
  };

  writeFileSync(ARTICLE_X_POSTS_FILE, JSON.stringify(postsData, null, 2), 'utf8');
  console.log(`   ✅ Saved ${postsData.posts.length} total posts\n`);
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Article Post Generation\n');
  console.log('=' .repeat(60) + '\n');

  // Check for API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY environment variable not set');
    console.error('   Please set it in your .env file or environment\n');
    process.exit(1);
  }

  try {
    // Load data
    const articles = loadArticles();
    const docsIndex = loadDocsIndex();
    const existingPosts = loadExistingPosts();

    // Find articles that need posts
    const articlesNeedingPosts = articles.filter(article =>
      !hasPostsForArticle(existingPosts, article.slug)
    );

    console.log(`📊 Summary:`);
    console.log(`   Total articles: ${articles.length}`);
    console.log(`   Already have posts: ${articles.length - articlesNeedingPosts.length}`);
    console.log(`   Need posts generated: ${articlesNeedingPosts.length}\n`);

    if (articlesNeedingPosts.length === 0) {
      console.log('✅ All articles already have posts generated!\n');
      return;
    }

    console.log('=' .repeat(60) + '\n');

    // Generate posts for each article
    for (const article of articlesNeedingPosts) {
      const docsUrl = getDocsUrl(article.product, docsIndex);
      const newPosts = await generatePostsForArticle(article, docsUrl);

      // Add to existing posts
      existingPosts.posts.push(...newPosts);

      // Add delay to avoid rate limiting
      if (articlesNeedingPosts.indexOf(article) < articlesNeedingPosts.length - 1) {
        console.log('⏳ Waiting 2 seconds before next article...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Save all posts
    savePosts(existingPosts);

    console.log('=' .repeat(60));
    console.log('\n✅ Post generation complete!\n');
    console.log(`📊 Final Stats:`);
    console.log(`   Total posts: ${existingPosts.posts.length}`);
    console.log(`   Pending: ${existingPosts.posts.filter(p => p.status === 'pending').length}`);
    console.log(`   Posted: ${existingPosts.posts.filter(p => p.status === 'posted').length}`);
    console.log(`\n📝 Posts saved to: ${ARTICLE_X_POSTS_FILE}\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generatePostsForArticle, loadArticles, loadDocsIndex };
