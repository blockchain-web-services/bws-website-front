#!/usr/bin/env node

/**
 * Generate Articles from X (Twitter) Posts
 *
 * This script fetches recent tweets from @BWSCommunity, classifies them by product,
 * and generates full article pages with content components, along with success story carousel entries.
 * Uses Anthropic Claude API to generate comprehensive article content.
 */

import { TwitterApi } from 'twitter-api-v2';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const TWITTER_USERNAME = 'BWSCommunity';
const MAX_TWEETS_TO_FETCH = 50;
const PROCESSED_TWEETS_PATH = path.join(__dirname, 'data', 'processed-article-tweets.json');

// Product rotation order (1 article per day, rotating through products)
const PRODUCT_ROTATION = ['X Bot', 'Blockchain Badges', 'ESG Credits', 'Fan Game Cube'];
const ARTICLES_FILE_PATH = path.join(__dirname, '..', 'src', 'data', 'articles.ts');
const ARTICLES_METADATA_PATH = path.join(__dirname, 'data', 'articles-metadata.json'); // JSON source of truth
const ARTICLE_IMAGES_DIR = path.join(__dirname, '..', 'public', 'assets', 'images', 'articles');
const ARTICLE_PAGES_DIR = path.join(__dirname, '..', 'src', 'pages', 'articles');
const ARTICLE_COMPONENTS_DIR = path.join(__dirname, '..', 'src', 'components', 'articles');

// Product configuration
const PRODUCT_CONFIG = {
  'X Bot': {
    url: '/marketplace/telegram-xbot.html',
    slug: 'x-bot',
    buttonText: 'Learn More',
    fallbackImages: [
      '/assets/images/marketplace/fallback/x-bot/01-analytics.png'
    ]
  },
  'Telegram XBot': {
    url: '/marketplace/telegram-xbot.html',
    slug: 'x-bot',
    buttonText: 'Learn More',
    fallbackImages: [
      '/assets/images/marketplace/fallback/x-bot/01-analytics.png'
    ]
  },
  'Blockchain Badges': {
    url: '/marketplace/blockchain-badges.html',
    slug: 'blockchain-badges',
    buttonText: 'Learn More',
    fallbackImages: [
      '/assets/images/marketplace/fallback/blockchain-badges/01-badges-ui.png',
      '/assets/images/marketplace/fallback/blockchain-badges/02-issuers-list.png'
    ]
  },
  'ESG Credits': {
    url: '/marketplace/esg-credits.html',
    slug: 'esg-credits',
    buttonText: 'Learn More',
    fallbackImages: [
      '/assets/images/marketplace/fallback/esg-credits/01-report.png'
    ]
  },
  'Fan Game Cube': {
    url: '/marketplace/nft-gamecube.html',
    slug: 'fan-game-cube',
    buttonText: 'View Details',
    fallbackImages: [
      '/assets/images/marketplace/fallback/fan-game-cube/01-football-cubes-selection.png',
      '/assets/images/marketplace/fallback/fan-game-cube/02-welcome-message.png'
    ]
  },
  'NFT Game Cube': {
    url: '/marketplace/nft-gamecube.html',
    slug: 'fan-game-cube',
    buttonText: 'View Details',
    fallbackImages: [
      '/assets/images/marketplace/fallback/fan-game-cube/01-football-cubes-selection.png',
      '/assets/images/marketplace/fallback/fan-game-cube/02-welcome-message.png'
    ]
  }
};

// Ensure directories exist
[ARTICLE_IMAGES_DIR, ARTICLE_PAGES_DIR, ARTICLE_COMPONENTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * Load docs index for intelligent URL mapping
 */
function loadDocsIndex() {
  try {
    const indexPath = path.join(__dirname, 'data', 'docs-index.json');
    const data = fs.readFileSync(indexPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log('   ℹ️  Docs index not found, using fallback URLs');
    return { productMapping: {} };
  }
}

/**
 * Find primary docs URL for a product
 */
function findDocsUrl(productName, docsIndex) {
  const urls = docsIndex.productMapping[productName] || [];
  // Return primary URL (first one, usually the main product page)
  return urls.length > 0 ? urls[0] : 'https://docs.bws.ninja/';
}

/**
 * Find website marketplace URL for a product
 */
function findWebsiteUrl(productName) {
  const config = PRODUCT_CONFIG[productName];
  return config ? config.url : '/marketplace';
}

/**
 * Find documentation images for a product
 * Returns array of images from docs pages matching the product
 */
function findDocsImages(productName, docsIndex) {
  if (!docsIndex || !docsIndex.pages) {
    return [];
  }

  // Find all pages for this product
  const productPages = docsIndex.pages.filter(page => page.product === productName);

  // Collect all images from these pages
  const allImages = [];
  productPages.forEach(page => {
    if (page.images && Array.isArray(page.images) && page.images.length > 0) {
      page.images.forEach(image => {
        allImages.push({
          ...image,
          sourcePage: page.title || page.url
        });
      });
    }
  });

  return allImages;
}

/**
 * Load processed tweets from state file
 */
function loadProcessedTweets() {
  try {
    const data = fs.readFileSync(PROCESSED_TWEETS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log('   ℹ️  No previous state found, creating new state file');
    return { processedTweetIds: [], lastCheck: null, lastSuccess: null, failureCount: 0 };
  }
}

/**
 * Save processed tweets to state file
 */
function saveProcessedTweets(data) {
  try {
    fs.writeFileSync(PROCESSED_TWEETS_PATH, JSON.stringify(data, null, 2));
    console.log('✅ Saved processed tweets state');
  } catch (error) {
    console.error('Error saving processed tweets:', error.message);
    throw error;
  }
}

/**
 * Download image from URL
 */
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });

      file.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete partial file
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete partial file
      reject(err);
    });
  });
}

/**
 * Generate article content and metadata using Claude
 */
async function generateArticleContent(tweets, includes) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required');
  }

  console.log('   🤖 Sending tweets to Claude for article generation...');

  // Prepare tweets data for Claude
  const tweetsData = tweets.map(tweet => {
    const images = [];
    if (tweet.attachments?.media_keys && includes.media) {
      tweet.attachments.media_keys.forEach(key => {
        const media = includes.media.find(m => m.media_key === key && m.type === 'photo');
        if (media?.url) {
          images.push(media.url);
        }
      });
    }

    // Check referenced tweets for images
    if (tweet.referenced_tweets && includes.tweets && includes.media) {
      const quotedTweet = includes.tweets.find(
        t => tweet.referenced_tweets.some(ref => ref.id === t.id)
      );
      if (quotedTweet?.attachments?.media_keys) {
        quotedTweet.attachments.media_keys.forEach(key => {
          const media = includes.media.find(m => m.media_key === key && m.type === 'photo');
          if (media?.url) {
            images.push(media.url);
          }
        });
      }
    }

    return {
      id: tweet.id,
      text: tweet.text,
      images: images,
      created_at: tweet.created_at
    };
  });

  const anthropic = new Anthropic({ apiKey });

  const prompt = `Analyze these ${tweets.length} tweets from @BWSCommunity and generate FULL ARTICLE CONTENT for each product category.

Product Categories (DO NOT include IPFS):
- X Bot (also called Telegram XBot)
- Blockchain Badges
- ESG Credits
- Fan Game Cube (also called NFT Game Cube)

For EACH product category that has relevant tweets, create ONE comprehensive article by:

1. **Article Title**: SEO-optimized, engaging (8-12 words)
   - Example: "How X Bot Revolutionizes Community Management for Web3 Projects"

2. **Article Subtitle**: Hook paragraph (2-3 sentences, 40-60 words)
   - Engaging intro that summarizes value proposition
   - Example: "Managing crypto communities across multiple platforms is challenging. X Bot simplifies this with automated tracking, real-time analytics, and KOL monitoring, helping projects build engaged communities without manual overhead."

3. **Article Sections** (3-5 sections):
   Each section needs:
   - Section heading (h3, 4-6 words)
   - Section content (2-4 SHORT paragraphs, 100-150 words total)
   - Image placement suggestion: "image-after-section", "image-mid-section", or "no-image"
   - sectionType: "normal" or "advantages"

   **PARAGRAPH FORMATTING RULES (CRITICAL - MUST FOLLOW):**
   - MAXIMUM 3-4 sentences per paragraph - NO EXCEPTIONS
   - If you write more than 4 sentences, you MUST split them into separate paragraphs
   - Use EXACTLY double line breaks (\\n\\n) to separate paragraphs
   - Each paragraph = one main idea

   **PARAGRAPH EXAMPLE:**
   Instead of this (TOO LONG - 6 sentences in one paragraph):
   "The bot tracks mentions automatically. It generates daily reports with comprehensive analytics. Projects can monitor KOL performance in real-time. The system captures engagement metrics across platforms. Setup takes less than one minute. Simply add the bot to your Telegram group as an admin."

   Do this (CORRECT - split into 2 paragraphs with \\n\\n):
   "The bot tracks mentions automatically and generates daily reports with comprehensive analytics. Projects can monitor KOL performance in real-time.\\n\\nThe system captures engagement metrics across platforms. Setup takes less than one minute - simply add the bot to your Telegram group as an admin."

   **ONE section must be a benefits/advantages section:**
   - Heading example: "Key Benefits and Advantages"
   - Set sectionType: "advantages"
   - Provide advantages array with 4-5 specific benefits
   - Add 1 SHORT paragraph intro before advantages (2-3 sentences max)

   IMPORTANT: Content should be professional, detailed, and substantive. Use concrete examples and benefits. Keep paragraphs short and scannable.

4. **INLINE LINKS** (MINIMUM 2 per article - CRITICAL):
   You MUST include at least 2 inline hyperlinks naturally within the article text:

   - **Link 1 (Docs)**: In first or second section, link the product name or a key feature to the docs page
     Format: <a href="{{DOCS_URL}}" target="_blank" rel="noopener noreferrer">product/feature name</a>

   - **Link 2 (Website)**: In a later section, link a call-to-action phrase to the marketplace page
     Format: <a href="{{WEBSITE_URL}}" target="_blank" rel="noopener noreferrer">call to action text</a>

   Example placements:
   - "Check out <a href=\"{{DOCS_URL}}\" target=\"_blank\" rel=\"noopener noreferrer\">X Bot documentation</a> for detailed setup instructions."
   - "Learn more about <a href=\"{{WEBSITE_URL}}\" target=\"_blank\" rel=\"noopener noreferrer\">how Blockchain Badges works</a> for your organization."

   CRITICAL RULES:
   - Links MUST flow naturally within sentences
   - Use EXACTLY these placeholders: {{DOCS_URL}} and {{WEBSITE_URL}}
   - DO NOT repeat the same placeholder multiple times - use BOTH {{DOCS_URL}} and {{WEBSITE_URL}} to provide variety
   - Each link should point to a different destination (docs vs website marketplace)
   - I will replace placeholders with actual URLs after generation
   - Do NOT use real URLs - ONLY use the placeholders

5. **Success Story Summary**: Short carousel description (30-45 words)
   - Concise value proposition for homepage carousel
   - Example: "X Bot automates community tracking across X and Telegram, helping crypto projects monitor engagement, track KOLs, and reward contributors with real-time analytics."

6. **SEO Meta Description**: 150-160 characters
   - Example: "Learn how X Bot helps crypto projects automate community management, track KOL performance, and generate daily engagement reports across social platforms."

7. **Most Relevant Image Tweet ID**: ONLY ONE tweet ID containing the MOST relevant image
   - **CRITICAL**: Select ONLY ONE image - the most representative of the product
   - **PRIORITY ORDER**:
     1. Product interface screenshots or feature demonstrations
     2. Product logo or branding (if no interface available)
     3. Partnership announcements (ONLY if no product images exist)
   - Choose the image that best represents the product itself, not partnerships
   - Return single tweet ID as a string (NOT an array)

Output as JSON array:
[
  {
    "product": "exact product name from list",
    "articleTitle": "SEO-optimized article title",
    "articleSubtitle": "Engaging intro paragraph",
    "sections": [
      {
        "heading": "Section heading",
        "sectionType": "normal",
        "content": "Main paragraph content with {{DOCS_URL}} and {{WEBSITE_URL}} placeholders. First paragraph will be displayed next to the image in two-column layout.",
        "imagePlacement": "image-after-title"
      },
      {
        "heading": "Key Benefits",
        "sectionType": "advantages",
        "content": "Intro paragraph before advantages",
        "advantages": ["benefit 1", "benefit 2", "benefit 3", "benefit 4"]
      }
    ],
    "successStorySummary": "Carousel description",
    "seoDescription": "Meta description",
    "imageTweetId": "single_tweet_id"
  }
]

IMPORTANT IMAGE PLACEMENT:
- ALWAYS use "imagePlacement": "image-after-title" for the FIRST section
- This creates a two-column layout: Image (left) + First paragraph (right)
- First paragraph should be a strong introduction to the product
- Remaining sections: use "imagePlacement": null (no additional images)

IMPORTANT:
- Only include products that are actually mentioned in the tweets
- DO NOT include IPFS
- Generate comprehensive, professional content based ONLY on information from the tweets
- Each section should have substantive detail
- Must include ONE advantages section per article

**CRITICAL - DO NOT INVENT FEATURES:**
- ONLY describe features, capabilities, and benefits explicitly mentioned in the provided tweets
- DO NOT make up technical specifications, integrations, or features not stated in the tweets
- DO NOT invent use cases, customer names, or statistics not present in the tweets
- If tweets lack detail, keep descriptions general rather than inventing specifics
- Focus on what IS mentioned rather than speculating about what MIGHT exist

Tweets:
${JSON.stringify(tweetsData, null, 2)}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].text.trim();
    console.log('   🤖 Claude response received');

    // Extract JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON response from Claude');
    }

    const articles = JSON.parse(jsonMatch[0]);
    console.log(`   ✅ Generated content for ${articles.length} product articles`);

    return articles;
  } catch (error) {
    console.error(`   ❌ Claude API error: ${error.message}`);
    throw error;
  }
}

/**
 * Refine article content for better narrative flow
 */
async function refineArticleFlow(articleData) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required');
  }

  console.log(`   ✨ Refining article flow for ${articleData.product}...`);

  const anthropic = new Anthropic({ apiKey });

  // Prepare current article content for refinement
  const currentContent = {
    product: articleData.product,
    title: articleData.articleTitle,
    subtitle: articleData.articleSubtitle,
    sections: articleData.sections.map(section => ({
      heading: section.heading,
      sectionType: section.sectionType,
      content: section.content,
      advantages: section.advantages,
      imagePlacement: section.imagePlacement
    }))
  };

  const prompt = `You are a content editor specializing in technical blog articles. Your task is to improve the narrative flow and readability of this article about "${articleData.product}".

CURRENT ARTICLE CONTENT:
${JSON.stringify(currentContent, null, 2)}

YOUR TASK:
Improve the text flow so the article reads like a cohesive story rather than disconnected paragraphs. Maintain ALL existing structure (sections, headings, advantages lists) but enhance:

1. **Paragraph Transitions**: Add smooth transitions between paragraphs within each section
   - Use connecting words/phrases (Furthermore, Additionally, Moreover, As a result, etc.)
   - Reference previous points when introducing new ones
   - Create logical flow from one idea to the next

2. **Section Coherence**: Ensure each section tells a complete mini-story
   - Opening sentence should connect to section heading
   - Middle content should develop the idea progressively
   - Closing sentence should bridge to next topic or reinforce the point

3. **Overall Narrative Arc**: Maintain progression through the article
   - Introduction → Problem/Context → Solution/Features → Benefits → Call to Action
   - Each section should build on previous sections naturally

4. **Readability Improvements**:
   - Keep paragraphs SHORT (2-4 sentences max)
   - Use active voice
   - Vary sentence structure for better rhythm
   - Remove redundant phrases

CRITICAL RULES:
- DO NOT change section headings
- DO NOT change advantages lists (keep them as bullet points)
- DO NOT change sectionType values
- DO NOT change imagePlacement values
- DO NOT remove or add sections
- DO NOT change placeholder links ({{DOCS_URL}}, {{WEBSITE_URL}})
- Keep paragraphs SHORT - split into multiple if needed using \\n\\n
- Maintain the same overall length (don't make it significantly longer or shorter)
- Only improve flow, transitions, and readability

Output ONLY the refined JSON in the exact same structure:
{
  "product": "product name",
  "articleTitle": "unchanged title",
  "articleSubtitle": "refined subtitle with better flow",
  "sections": [
    {
      "heading": "unchanged heading",
      "sectionType": "normal",
      "content": "refined content with better flow and transitions",
      "imagePlacement": "unchanged"
    }
  ]
}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 6000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].text.trim();

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log('   ⚠️  Could not parse refinement response, using original content');
      return articleData;
    }

    const refinedContent = JSON.parse(jsonMatch[0]);
    console.log(`   ✅ Flow refinement complete`);

    // Merge refined content back into original articleData
    return {
      ...articleData,
      articleSubtitle: refinedContent.articleSubtitle || articleData.articleSubtitle,
      sections: refinedContent.sections || articleData.sections
    };
  } catch (error) {
    console.error(`   ⚠️  Flow refinement error: ${error.message}, using original content`);
    return articleData; // Return original if refinement fails
  }
}

/**
 * Generate slug from product name and date
 */
function generateSlug(product, publishDate) {
  const date = new Date(publishDate);
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const productSlug = product.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `${productSlug}-${dateStr}`;
}

/**
 * Sanitize component name (remove special chars, make PascalCase)
 */
function sanitizeComponentName(slug) {
  return slug
    .split('-')
    .filter(part => part.length > 0)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * Generate descriptive caption for image based on product and article subtitle
 * Uses Claude API to create a complete, concise sentence summarizing the article content
 */
async function generateImageCaption(anthropic, productName, articleSubtitle) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 100,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: `Generate a short, complete sentence that summarizes this article about ${productName}.

Article summary: ${articleSubtitle}

CRITICAL REQUIREMENTS:
- Must be a COMPLETE grammatically correct sentence (no incomplete endings like "with." or "through secure.")
- Start with "${productName}" followed by an action verb
- STRICT length limit: 50-60 characters total (count carefully!)
- If you cannot fit a complete thought in 60 chars, use a simpler verb/object combination
- Format: "${productName} [verb] [object/description]."
- Examples of good captions:
  * "Fan Game Cube transforms digital fan engagement through NFT."
  * "ESG Credits validates green asset performance via blockchain."

Output only the caption sentence, nothing else.`
      }]
    });

    let caption = response.content[0].text.trim();

    // Remove quotes if Claude added them
    caption = caption.replace(/^["']|["']$/g, '');

    // Ensure it ends with a period
    if (!caption.endsWith('.')) {
      caption += '.';
    }

    // No truncation - trust Claude to generate complete sentences
    // User requirement: "sentence should be a final sentence. not a truncated one!"

    return caption;
  } catch (error) {
    console.error(`Error generating caption: ${error.message}`);
    // Fallback to simple caption
    return `${productName} solution.`;
  }
}

/**
 * Get image dimensions and determine appropriate min-size constraint
 * Returns style string with min-width or min-height based on image orientation
 */
function getImageSizeConstraint(imagePath) {
  try {
    // Get full path to image file
    const fullPath = path.join(__dirname, '..', 'public', imagePath);

    // Use 'file' command to get image dimensions
    const fileOutput = execSync(`file "${fullPath}"`, { encoding: 'utf8' });

    // Parse dimensions from output (e.g., "JPEG image data ... 829x339")
    // Match digits followed by 'x' followed by digits, followed by a comma or space (to skip "1x1" density)
    const match = fileOutput.match(/(\d{2,})x(\d{2,})(?:,|\s)/);
    if (match) {
      const width = parseInt(match[1]);
      const height = parseInt(match[2]);

      // Horizontal image (wider than tall) - constrain width
      if (width > height) {
        return 'min-width: 500px; max-width: 600px;';
      }
      // Vertical image (taller than wide) - constrain height
      else {
        return 'min-height: 500px; max-height: 600px;';
      }
    }
  } catch (error) {
    console.log(`   ⚠️  Could not determine image dimensions for ${imagePath}: ${error.message}`);
  }

  // Default fallback - assume horizontal
  return 'min-width: 500px; max-width: 600px;';
}

/**
 * Generate article content component with image integration
 */
async function generateContentComponent(slug, articleData, images, publishDate, docsUrl, anthropic) {
  let sectionsHTML = '';
  let imageIndex = 0;
  let titleImageHTML = ''; // For image-after-title placement

  // Check if first section has image-after-title placement
  if (articleData.sections.length > 0 &&
      articleData.sections[0].imagePlacement === 'image-after-title' &&
      images.length > 0) {
    // Single-column centered image with caption after title
    const caption = await generateImageCaption(anthropic, articleData.product, articleData.articleSubtitle);
    titleImageHTML = `    <div class="container-medium" style="margin-top: 2rem; margin-bottom: 2rem;">
      <figure style="margin: 0; text-align: center;">
        <img
          src="${images[0].src}"
          alt="${images[0].alt}"
          class="article-image-clickable"
          data-image-src="${images[0].src}"
          style="max-width: 100%; height: auto; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"
          loading="eager"
        />
        <figcaption style="margin-top: 0.75rem; font-size: 0.9rem; color: #666; font-style: italic;">${caption}</figcaption>
      </figure>
    </div>\n`;
    imageIndex = 1; // Skip first image in section loop
  }

  for (const section of articleData.sections) {
    const sectionType = section.sectionType || 'normal';

    // Add section heading
    sectionsHTML += `        <h3><strong>${section.heading}</strong></h3>\n`;

    // Add main content - split into multiple paragraphs on double line breaks
    const paragraphs = section.content.split('\n\n').filter(p => p.trim().length > 0);

    // With single-column layout, show all paragraphs
    const startIndex = 0;

    paragraphs.slice(startIndex).forEach(paragraph => {
      sectionsHTML += `        <p>\n          ${paragraph.trim().replace(/\n/g, '\n          ')}\n        </p>\n`;
    });

    // Add special section types
    if (sectionType === 'advantages' && section.advantages && section.advantages.length > 0) {
      sectionsHTML += `        <div class="solution-advantages">\n`;
      sectionsHTML += `          <h4>Why Choose ${articleData.product}</h4>\n`;
      sectionsHTML += `          <ul>\n`;
      section.advantages.forEach(advantage => {
        sectionsHTML += `            <li>${advantage}</li>\n`;
      });
      sectionsHTML += `          </ul>\n`;
      sectionsHTML += `        </div>\n`;
    } else if (sectionType === 'code' && section.codeSnippet) {
      const language = section.codeLanguage || 'bash';
      sectionsHTML += `        <div class="code-example">\n`;
      sectionsHTML += `          <div class="code-example-header">${language.toUpperCase()}</div>\n`;
      sectionsHTML += `          <pre><code>${section.codeSnippet}</code></pre>\n`;
      sectionsHTML += `        </div>\n`;
    } else if (sectionType === 'steps' && section.implementationSteps && section.implementationSteps.length > 0) {
      sectionsHTML += `        <div class="step-by-step-guide">\n`;
      sectionsHTML += `          <h4>How to Implement ${articleData.product}</h4>\n`;
      section.implementationSteps.forEach((step, stepIndex) => {
        sectionsHTML += `          <div class="step-item">\n`;
        sectionsHTML += `            <div class="step-number">${stepIndex + 1}</div>\n`;
        sectionsHTML += `            <div class="step-content">\n`;
        sectionsHTML += `              <h5>${step.title}</h5>\n`;
        sectionsHTML += `              <p>${step.description}</p>\n`;
        sectionsHTML += `            </div>\n`;
        sectionsHTML += `          </div>\n`;
      });
      sectionsHTML += `        </div>\n`;
    }

    // Add image if placement specified and images available
    // Note: Maximum ONE image per article - imageIndex ensures only first placement gets image
    if (section.imagePlacement === 'image-after-section' && imageIndex < images.length) {
      // Single-column centered image with caption
      const caption = await generateImageCaption(anthropic, articleData.product, articleData.articleSubtitle);
      sectionsHTML += `        <figure style="margin: 2rem 0; text-align: center;">\n`;
      sectionsHTML += `          <img\n`;
      sectionsHTML += `            src="${images[imageIndex].src}"\n`;
      sectionsHTML += `            alt="${images[imageIndex].alt}"\n`;
      sectionsHTML += `            class="article-image-clickable"\n`;
      sectionsHTML += `            data-image-src="${images[imageIndex].src}"\n`;
      sectionsHTML += `            style="max-width: 100%; height: auto; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"\n`;
      sectionsHTML += `            loading="lazy"\n`;
      sectionsHTML += `          />\n`;
      sectionsHTML += `          <figcaption style="margin-top: 0.75rem; font-size: 0.9rem; color: #666; font-style: italic;">${caption}</figcaption>\n`;
      sectionsHTML += `        </figure>\n`;
      imageIndex++;
    } else if (section.imagePlacement === 'image-mid-section' && imageIndex < images.length) {
      // Insert image mid-section by splitting content - single column centered
      const paragraphs = section.content.split('\n\n');
      if (paragraphs.length > 1) {
        const caption = await generateImageCaption(anthropic, articleData.product, articleData.articleSubtitle);
        sectionsHTML += `        <figure style="margin: 2rem 0; text-align: center;">\n`;
        sectionsHTML += `          <img\n`;
        sectionsHTML += `            src="${images[imageIndex].src}"\n`;
        sectionsHTML += `            alt="${images[imageIndex].alt}"\n`;
        sectionsHTML += `            class="article-image-clickable"\n`;
        sectionsHTML += `            data-image-src="${images[imageIndex].src}"\n`;
        sectionsHTML += `            style="max-width: 100%; height: auto; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"\n`;
        sectionsHTML += `            loading="lazy"\n`;
        sectionsHTML += `          />\n`;
        sectionsHTML += `          <figcaption style="margin-top: 0.75rem; font-size: 0.9rem; color: #666; font-style: italic;">${caption}</figcaption>\n`;
        sectionsHTML += `        </figure>\n`;
        imageIndex++;
      }
    }
  }

  return `---
// Main content for articles/${slug} page
// Auto-generated by scripts/generate-articles.js

const publishDate = new Date('${publishDate}');
const formattedDate = publishDate.toLocaleDateString("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});
---

<div class="page-top-section">
  <div class="container-medium w-container">
    <div class="top-content post-top-content container-medium-790px">
      <div data-w-id="0bc70bd5-c350-e083-e791-138d15b3f694" class="top-content about-post">
        <div class="top-content post-date">
          <img
            src="/assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a92305_date-icon-techplus-x-template.svg"
            alt="Calendar - Techplus X Webflow Template"
            class="image detail-solution-icon"
          />
          <div>{formattedDate}</div>
        </div>
      </div>
      <h1 data-w-id="b3312688-6e5e-b18d-2c9c-2086cd55d40e" class="title blog-post-title">
        ${articleData.articleTitle}
      </h1>
      <div class="split-vertical split-horizontal">
        <div class="rich-text post-subtitle w-richtext">
          <p>
            ${articleData.articleSubtitle}
          </p>
        </div>
      </div>
    </div>
  </div>
${titleImageHTML}  <div class="container-medium">
    <div class="blog-post-body-wrapper">
      <div class="rich-text w-richtext">
${sectionsHTML}
      </div>

      <!-- Call-to-Action Buttons -->
      <div class="w-layout-hflex flex-block-9" style="margin-top: 3rem; row-gap: 5px;">
        <a target="_blank" href="${docsUrl}" class="button-primary small flex w-inline-block">
          <div class="text-block-24">API&nbsp;Docs</div>&nbsp;
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
        <a href="/contact-us.html" class="button-secondary _2-buttons w-button">
          Contact Us
        </a>
      </div>
    </div>
  </div>
</div>
<div class="bg-blobs-wrapper hidden-overflow">
  <img
    src="/assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template.png"
    alt="Decorative background pattern"
    sizes="100vw"
    srcset="
      /assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template-p-500.png   500w,
      /assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template-p-800.png   800w,
      /assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template-p-1080.png 1080w,
      /assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template.png        2114w"
    class="image blob post-1"
  /><img
    src="/assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template.png"
    alt="Decorative background pattern"
    sizes="93vw"
    srcset="
      /assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template-p-500.png   500w,
      /assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template-p-800.png   800w,
      /assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template-p-1080.png 1080w,
      /assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template.png        2114w"
    class="image blob post-2"
  />
</div>

<script is:inline>
  // Image lightbox functionality - must run after DOM loads
  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', function() {
      // Check if lightbox already exists
      if (document.getElementById('article-image-lightbox')) {
        return;
      }

      // Create lightbox element with inline styles
      const lightbox = document.createElement('div');
      lightbox.id = 'article-image-lightbox';
      lightbox.style.cssText = \`
        display: none;
        position: fixed;
        z-index: 99999;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.95);
        cursor: pointer;
        align-items: center;
        justify-content: center;
      \`;

      const closeBtn = document.createElement('span');
      closeBtn.innerHTML = '&times;';
      closeBtn.style.cssText = \`
        position: absolute;
        top: 20px;
        right: 35px;
        color: #f1f1f1;
        font-size: 50px;
        font-weight: bold;
        cursor: pointer;
        z-index: 100000;
      \`;
      closeBtn.onmouseover = function() { this.style.color = '#bbb'; };
      closeBtn.onmouseout = function() { this.style.color = '#f1f1f1'; };

      const lightboxImg = document.createElement('img');
      lightboxImg.style.cssText = \`
        max-width: 90vw;
        max-height: 90vh;
        width: auto;
        height: auto;
        object-fit: contain;
        display: block;
        margin: auto;
      \`;

      lightbox.appendChild(closeBtn);
      lightbox.appendChild(lightboxImg);
      document.body.appendChild(lightbox);

      // Add click handlers to all article images
      function attachImageHandlers() {
        document.querySelectorAll('.article-image-clickable').forEach(img => {
          img.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            lightboxImg.src = this.getAttribute('data-image-src');
            lightboxImg.alt = this.alt;
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
          };
        });
      }

      attachImageHandlers();

      // Close lightbox function
      function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
      }

      // Close on background click
      lightbox.onclick = function(e) {
        if (e.target === lightbox || e.target === closeBtn) {
          closeLightbox();
        }
      };

      // Close on X click
      closeBtn.onclick = closeLightbox;

      // Close on Escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
          closeLightbox();
        }
      });
    });
  }
</script>
`;
}

/**
 * Generate article page wrapper
 */
function generateArticlePage(slug, componentName, articleData) {
  return `---
// Auto-generated by scripts/generate-articles.js
import BaseLayout from "../../layouts/BaseLayout.astro";
import Navigation from "../../components/Navigation.astro";
import Footer from "../../components/Footer.astro";
import Scripts from "../../components/Scripts.astro";
import ArticleMainContent from "../../components/articles/${componentName}MainContent.astro";

const pageTitle = "${articleData.articleTitle.replace(/"/g, '\\"')}";
const pageDescription = "${articleData.seoDescription.replace(/"/g, '\\"')}";
---

<BaseLayout title={pageTitle} description={pageDescription}>
  <Navigation />
  <ArticleMainContent />
  <Footer />
  <Fragment slot="scripts">
    <Scripts />
  </Fragment>
</BaseLayout>
`;
}

/**
 * Process article generation
 */
async function processArticles(articleDataList, tweets, includes) {
  const docsIndex = loadDocsIndex();
  const articles = [];

  // Initialize Anthropic client for caption generation
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required');
  }
  const anthropic = new Anthropic({ apiKey });

  for (let articleData of articleDataList) {
    console.log(`\n   📦 Processing article for ${articleData.product}...`);

    const config = PRODUCT_CONFIG[articleData.product];
    if (!config) {
      console.log(`   ⚠️  Unknown product: ${articleData.product}, skipping`);
      continue;
    }

    const publishDate = new Date().toISOString();
    const slug = generateSlug(articleData.product, publishDate);
    const componentName = sanitizeComponentName(slug);

    // Get URLs for this product
    const docsUrl = findDocsUrl(articleData.product, docsIndex);
    const websiteUrl = findWebsiteUrl(articleData.product);

    console.log(`   🔗 Docs URL: ${docsUrl}`);
    console.log(`   🔗 Website URL: ${websiteUrl}`);

    // Replace URL placeholders in all section content
    articleData.sections = articleData.sections.map(section => ({
      ...section,
      content: section.content
        .replace(/\{\{DOCS_URL\}\}/g, docsUrl)
        .replace(/\{\{WEBSITE_URL\}\}/g, websiteUrl)
    }));

    // Refine article flow for better narrative coherence
    articleData = await refineArticleFlow(articleData);

    // Download images - MAXIMUM ONE image per article
    // PRIORITY ORDER: 1) Docs images, 2) Tweet images, 3) Fallback images
    const images = [];

    // PRIORITY 1: Check for documentation images first (official product screenshots)
    const docsImages = findDocsImages(articleData.product, docsIndex);
    if (docsImages.length > 0) {
      console.log(`   📚 Using docs image (${docsImages.length} available from ${new Set(docsImages.map(i => i.sourcePage)).size} pages)`);
      images.push({
        src: docsImages[0].localPath,
        alt: docsImages[0].alt || `${articleData.product} product interface`
      });
    }

    // PRIORITY 2: If no docs images, try tweet image selected by Claude
    if (images.length === 0) {
      // Handle both new single value format (imageTweetId) and legacy array format (imageTweetIds)
      const tweetId = articleData.imageTweetId ||
                      (articleData.imageTweetIds && Array.isArray(articleData.imageTweetIds)
                        ? articleData.imageTweetIds[0]
                        : null);

    if (tweetId) {
      const tweet = tweets.find(t => t.id === tweetId);
      if (tweet) {
        let imageUrl = null;

        // Find image from tweet (check size requirements)
        if (tweet.attachments?.media_keys && includes.media) {
          const media = includes.media.find(
            m => m.media_key === tweet.attachments.media_keys[0] && m.type === 'photo'
          );
          // Only use images that are at least 500px in either dimension
          if (media?.url && (media.width >= 500 || media.height >= 500)) {
            imageUrl = media.url;
          } else if (media?.url) {
            console.log(`   ⚠️  Skipping small image from tweet ${tweetId}: ${media.width}x${media.height}px`);
          }
        }

        // Check referenced tweet for image (check size requirements)
        if (!imageUrl && tweet.referenced_tweets && includes.tweets && includes.media) {
          const quotedTweet = includes.tweets.find(
            t => tweet.referenced_tweets.some(ref => ref.id === t.id)
          );
          if (quotedTweet?.attachments?.media_keys) {
            const media = includes.media.find(
              m => m.media_key === quotedTweet.attachments.media_keys[0] && m.type === 'photo'
            );
            // Only use images that are at least 500px in either dimension
            if (media?.url && (media.width >= 500 || media.height >= 500)) {
              imageUrl = media.url;
            } else if (media?.url) {
              console.log(`   ⚠️  Skipping small image from quoted tweet: ${media.width}x${media.height}px`);
            }
          }
        }

        if (imageUrl) {
          try {
            const timestamp = Date.now();
            const filename = `${config.slug}-${timestamp}.jpg`;
            const filepath = path.join(ARTICLE_IMAGES_DIR, filename);

            console.log(`   📥 Downloading single most relevant image from tweet ${tweetId}...`);
            await downloadImage(imageUrl, filepath);
            console.log(`   ✅ Image saved: ${filename}`);

            images.push({
              src: `/assets/images/articles/${filename}`,
              alt: `${articleData.product} - ${articleData.articleTitle}`,
            });
          } catch (error) {
            console.error(`   ⚠️  Failed to download image: ${error.message}`);
          }
        }
      }
    }
    } // End of PRIORITY 2 check

    // PRIORITY 3: Use fallback image as last resort
    if (images.length === 0 && config.fallbackImages && config.fallbackImages.length > 0) {
      const randomIndex = Math.floor(Math.random() * config.fallbackImages.length);
      const fallbackImage = config.fallbackImages[randomIndex];
      console.log(`   🎲 Using fallback image: ${fallbackImage}`);
      images.push({
        src: fallbackImage,
        alt: `${articleData.product} solution`,
      });
    }

    // Set image placement on second section (or first if only one section exists)
    if (images.length > 0 && articleData.sections && articleData.sections.length > 0) {
      const targetSection = articleData.sections.length > 1 ? 1 : 0; // Second section preferred
      articleData.sections[targetSection].imagePlacement = 'image-after-section';
    }

    // Generate content component
    const contentComponent = await generateContentComponent(slug, articleData, images, publishDate, docsUrl, anthropic);
    const contentPath = path.join(ARTICLE_COMPONENTS_DIR, `${componentName}MainContent.astro`);
    fs.writeFileSync(contentPath, contentComponent);
    console.log(`   ✅ Generated content component: ${componentName}MainContent.astro`);

    // Generate article page
    const articlePage = generateArticlePage(slug, componentName, articleData);
    const pagePath = path.join(ARTICLE_PAGES_DIR, `${slug}.astro`);
    fs.writeFileSync(pagePath, articlePage);
    console.log(`   ✅ Generated article page: ${slug}.astro`);

    // Add to articles metadata
    articles.push({
      slug: slug,
      product: articleData.product,
      title: articleData.articleTitle,
      subtitle: articleData.articleSubtitle,
      publishDate: publishDate,
      tweetId: articleData.imageTweetIds && articleData.imageTweetIds.length > 0 ? articleData.imageTweetIds[0] : '',
      featuredImage: images.length > 0 ? {
        src: images[0].src,
        alt: images[0].alt,
        loading: 'eager'
      } : undefined,
      seoDescription: articleData.seoDescription
    });

    console.log(`   ✅ Processed ${articleData.product}`);
  }

  return { articles };
}

/**
 * Load existing articles from JSON metadata file
 * Falls back to parsing articles.ts if JSON doesn't exist yet (migration)
 */
function loadArticlesMetadata() {
  try {
    // Try loading from JSON metadata file first (source of truth)
    if (fs.existsSync(ARTICLES_METADATA_PATH)) {
      const data = JSON.parse(fs.readFileSync(ARTICLES_METADATA_PATH, 'utf-8'));
      console.log(`   📚 Loaded ${data.articles.length} existing articles from metadata file`);
      return data.articles;
    }
  } catch (error) {
    console.warn(`   ⚠️  Error loading articles metadata: ${error.message}`);
  }

  // Fallback: Parse existing articles from articles.ts (for initial migration)
  try {
    console.log('   ℹ️  No JSON metadata found, attempting to parse articles.ts...');
    if (fs.existsSync(ARTICLES_FILE_PATH)) {
      const content = fs.readFileSync(ARTICLES_FILE_PATH, 'utf-8');

      // Extract the articles array content
      const arrayMatch = content.match(/export const articles: ArticleMetadata\[\] = \[([\s\S]*?)\];/);
      if (arrayMatch && arrayMatch[1].trim()) {
        // Convert TypeScript object notation to JSON-like format
        const arrayContent = arrayMatch[1];

        // Simple regex-based extraction (handles single-line and multi-line objects)
        const articles = [];
        const objectMatches = arrayContent.matchAll(/\{([^}]+)\}/gs);

        for (const match of objectMatches) {
          const objectContent = match[1];
          const article = {};

          // Extract each field
          const extractField = (fieldName) => {
            const regex = new RegExp(`${fieldName}:\\s*'([^']*)'`, 'g');
            const fieldMatch = regex.exec(objectContent);
            return fieldMatch ? fieldMatch[1] : '';
          };

          article.slug = extractField('slug');
          article.product = extractField('product');
          article.title = extractField('title').replace(/\\'/g, "'");
          article.subtitle = extractField('subtitle').replace(/\\'/g, "'");
          article.publishDate = extractField('publishDate');
          article.tweetId = extractField('tweetId');
          article.seoDescription = extractField('seoDescription').replace(/\\'/g, "'");

          // Extract featuredImage (nested object)
          const imageMatch = objectContent.match(/featuredImage:\s*\{([^}]+)\}/);
          if (imageMatch) {
            const imageSrc = extractField('src');
            const imageAlt = extractField('alt').replace(/\\'/g, "'");
            const imageLoading = extractField('loading');
            article.featuredImage = {
              src: imageSrc,
              alt: imageAlt,
              loading: imageLoading
            };
          }

          if (article.slug) {
            articles.push(article);
          }
        }

        if (articles.length > 0) {
          console.log(`   📚 Parsed ${articles.length} existing articles from articles.ts`);
          return articles;
        }
      }
    }
  } catch (error) {
    console.warn(`   ⚠️  Error parsing articles.ts: ${error.message}`);
  }

  console.log('   ℹ️  No existing articles found, starting fresh');
  return [];
}

/**
 * Save articles metadata to JSON file
 */
function saveArticlesMetadata(articles) {
  const data = {
    lastUpdated: new Date().toISOString(),
    totalArticles: articles.length,
    articles: articles
  };

  fs.writeFileSync(ARTICLES_METADATA_PATH, JSON.stringify(data, null, 2));
  console.log(`   ✅ Saved ${articles.length} articles to metadata file`);
}

/**
 * Write articles metadata to articles.ts
 * IMPORTANT: This function now APPENDS new articles instead of replacing all
 */
function writeArticlesFile(newArticles) {
  console.log('\n   📝 Writing articles metadata to file...');

  // Load existing articles from JSON metadata file
  const existingArticles = loadArticlesMetadata();
  const existingSlugs = new Set(existingArticles.map(a => a.slug));

  // Filter out duplicates from new articles
  const uniqueNewArticles = newArticles.filter(article => {
    if (existingSlugs.has(article.slug)) {
      console.log(`   ⏭️  Skipping duplicate article: ${article.slug}`);
      return false;
    }
    return true;
  });

  if (uniqueNewArticles.length === 0) {
    console.log('   ℹ️  No new articles to add (all duplicates)');
    return;
  }

  // Merge: existing articles + new unique articles
  const allArticles = [...existingArticles, ...uniqueNewArticles];

  // Sort by publishDate (newest first)
  allArticles.sort((a, b) => {
    const dateA = new Date(a.publishDate).getTime();
    const dateB = new Date(b.publishDate).getTime();
    return dateB - dateA; // Descending (newest first)
  });

  console.log(`   📊 Total articles after merge: ${allArticles.length} (${existingArticles.length} existing + ${uniqueNewArticles.length} new)`);

  // Save to JSON metadata file (source of truth)
  saveArticlesMetadata(allArticles);

  // Read current TypeScript file to preserve interfaces
  const currentContent = fs.readFileSync(ARTICLES_FILE_PATH, 'utf-8');

  // Find where the export starts
  const exportMatch = currentContent.match(/export const articles: ArticleMetadata\[\] = \[/);
  if (!exportMatch) {
    throw new Error('Could not find articles export in file');
  }

  const beforeExport = currentContent.substring(0, exportMatch.index + exportMatch[0].length);

  // Generate articles code for ALL articles
  const articlesCode = allArticles.map(article => {
    let code = `\n{\n`;
    code += `  slug: '${article.slug}',\n`;
    code += `  product: '${article.product}',\n`;
    code += `  title: '${article.title.replace(/'/g, "\\'")}',\n`;
    code += `  subtitle: '${article.subtitle.replace(/'/g, "\\'")}',\n`;
    code += `  publishDate: '${article.publishDate}',\n`;
    code += `  tweetId: '${article.tweetId}',\n`;

    if (article.featuredImage) {
      code += `  featuredImage: {\n`;
      code += `    src: '${article.featuredImage.src}',\n`;
      code += `    alt: '${article.featuredImage.alt.replace(/'/g, "\\'")}',\n`;
      code += `    loading: '${article.featuredImage.loading}'\n`;
      code += `  },\n`;
    }

    code += `  seoDescription: '${article.seoDescription.replace(/'/g, "\\'")}'`;
    code += `\n}`;

    return code;
  }).join(',');

  const newContent = beforeExport + articlesCode + '\n];\n';
  fs.writeFileSync(ARTICLES_FILE_PATH, newContent);
  console.log(`   ✅ Written ${allArticles.length} articles to ${ARTICLES_FILE_PATH}`);
}

/**
 * Get the next product to generate an article for, rotating through products
 */
function getNextProduct(processedData) {
  const lastIndex = processedData.lastProductIndex ?? -1;
  const nextIndex = (lastIndex + 1) % PRODUCT_ROTATION.length;
  const product = PRODUCT_ROTATION[nextIndex];

  console.log(`\n   🔄 Product rotation: ${product} (${nextIndex + 1}/${PRODUCT_ROTATION.length})`);

  return { product, index: nextIndex };
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting article generation from X posts...');
  console.log(`📅 ${new Date().toISOString()}`);

  // Check for bearer token
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  if (!bearerToken) {
    throw new Error('TWITTER_BEARER_TOKEN environment variable is required');
  }

  // Load processed tweets
  const processedData = loadProcessedTweets();
  processedData.lastCheck = new Date().toISOString();

  try {
    // Initialize Twitter client
    const client = new TwitterApi(bearerToken);

    // Get user ID for @BWSCommunity
    console.log(`🔍 Looking up user: @${TWITTER_USERNAME}`);
    const user = await client.v2.userByUsername(TWITTER_USERNAME);

    if (!user.data) {
      throw new Error(`User @${TWITTER_USERNAME} not found`);
    }

    console.log(`✅ Found user: ${user.data.name} (ID: ${user.data.id})`);

    // Fetch recent tweets
    console.log(`📥 Fetching last ${MAX_TWEETS_TO_FETCH} tweets...`);
    const timeline = await client.v2.userTimeline(user.data.id, {
      max_results: MAX_TWEETS_TO_FETCH,
      expansions: [
        'attachments.media_keys',
        'referenced_tweets.id',
        'referenced_tweets.id.attachments.media_keys',
        'author_id'
      ],
      'tweet.fields': ['created_at', 'text', 'attachments', 'referenced_tweets'],
      'media.fields': ['url', 'preview_image_url', 'type', 'width', 'height', 'media_key']
    });

    if (!timeline.data.data || timeline.data.data.length === 0) {
      console.log('ℹ️  No tweets found');
      processedData.lastSuccess = new Date().toISOString();
      saveProcessedTweets(processedData);
      return;
    }

    console.log(`📊 Found ${timeline.data.data.length} tweets`);

    const tweets = timeline.data.data;
    const includes = timeline.includes || {};

    // Get next product in rotation (1 article per day)
    const { product: selectedProduct, index: productIndex } = getNextProduct(processedData);

    // Generate article content with Claude
    const articleDataList = await generateArticleContent(tweets, includes);

    if (articleDataList.length === 0) {
      console.log('ℹ️  No product-related tweets found');
      processedData.lastSuccess = new Date().toISOString();
      saveProcessedTweets(processedData);
      return;
    }

    // Filter to only the selected product (1 article per day)
    const filteredArticles = articleDataList.filter(article => article.product === selectedProduct);

    if (filteredArticles.length === 0) {
      console.log(`ℹ️  No tweets found for ${selectedProduct}, skipping for today`);
      processedData.lastSuccess = new Date().toISOString();
      processedData.lastProductIndex = productIndex; // Still advance rotation even if no tweets
      saveProcessedTweets(processedData);
      return;
    }

    console.log(`   ✅ Selected 1 article for ${selectedProduct} (filtered ${articleDataList.length - filteredArticles.length} other products)`);

    // Process articles (generate pages, components, download images)
    const { articles } = await processArticles(filteredArticles, tweets, includes);

    if (articles.length === 0) {
      console.log('ℹ️  No articles generated');
      processedData.lastSuccess = new Date().toISOString();
      saveProcessedTweets(processedData);
      return;
    }

    // Write to files
    writeArticlesFile(articles);

    // Update processed tweets
    const newTweetIds = tweets.map(t => t.id);
    processedData.processedTweetIds = [...new Set([...processedData.processedTweetIds, ...newTweetIds])];

    // Keep only last 200 tweet IDs to prevent file from growing indefinitely
    if (processedData.processedTweetIds.length > 200) {
      processedData.processedTweetIds = processedData.processedTweetIds.slice(-200);
    }

    // Save state with product rotation index
    processedData.lastSuccess = new Date().toISOString();
    processedData.failureCount = 0;
    processedData.lastProductIndex = productIndex; // Save rotation index for next run
    saveProcessedTweets(processedData);

    console.log(`\n✨ Completed successfully!`);
    console.log(`   Articles generated: ${articles.length}`);
    console.log(`   Products: ${articles.map(a => a.product).join(', ')}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    processedData.failureCount = (processedData.failureCount || 0) + 1;
    saveProcessedTweets(processedData);
    throw error;
  }
}

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
