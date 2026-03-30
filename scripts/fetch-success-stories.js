#!/usr/bin/env node

/**
 * Fetch Success Stories from X (Twitter)
 *
 * This script fetches tweets from @BWSCommunity containing "Success Story" keyword,
 * processes manual legacy success stories from JSON config, and updates successStories.ts
 * with deduplicated entries that have dual buttons (View Post + Learn More/Read Story).
 */

import { TwitterApi } from 'twitter-api-v2';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const TWITTER_USERNAME = 'BWSCommunity';
const SEARCH_QUERY = `from:${TWITTER_USERNAME} "Success Story"`;
const MAX_TWEETS_TO_FETCH = 50;
const MANUAL_STORIES_PATH = path.join(__dirname, 'data', 'manual-success-stories.json');
const PROCESSED_TWEETS_PATH = path.join(__dirname, 'data', 'processed-success-story-tweets.json');
const SUCCESS_STORIES_FILE_PATH = path.join(__dirname, '..', 'src', 'data', 'successStories.ts');
const ARTICLES_FILE_PATH = path.join(__dirname, '..', 'src', 'data', 'articles.ts');
const SUCCESS_STORY_IMAGES_DIR = path.join(__dirname, '..', 'public', 'assets', 'images', 'success-stories');

// Product configuration
const PRODUCT_CONFIG = {
  'X Bot': {
    url: '/marketplace/telegram-xbot.html',
    slug: 'x-bot',
    fallbackImages: [
      '/assets/images/marketplace/fallback/x-bot/01-analytics.png'
    ]
  },
  'Telegram XBot': {
    url: '/marketplace/telegram-xbot.html',
    slug: 'x-bot',
    fallbackImages: [
      '/assets/images/marketplace/fallback/x-bot/01-analytics.png'
    ]
  },
  'Blockchain Badges': {
    url: '/marketplace/blockchain-badges.html',
    slug: 'blockchain-badges',
    fallbackImages: [
      '/assets/images/marketplace/fallback/blockchain-badges/01-badges-ui.png',
      '/assets/images/marketplace/fallback/blockchain-badges/02-issuers-list.png'
    ]
  },
};

// Ensure directories exist
if (!fs.existsSync(SUCCESS_STORY_IMAGES_DIR)) {
  fs.mkdirSync(SUCCESS_STORY_IMAGES_DIR, { recursive: true });
}

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * Load manual success stories from JSON config
 */
function loadManualStories() {
  try {
    const data = fs.readFileSync(MANUAL_STORIES_PATH, 'utf-8');
    const stories = JSON.parse(data);
    console.log(`   ℹ️  Loaded ${stories.length} manual success stories from config`);
    return stories;
  } catch (error) {
    console.log('   ℹ️  No manual stories config found or error reading file');
    return [];
  }
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
 * Load articles metadata to check if article exists for product
 */
function loadArticlesMetadata() {
  try {
    const content = fs.readFileSync(ARTICLES_FILE_PATH, 'utf-8');
    const articles = [];

    // Extract product and slug pairs from articles.ts
    const matches = [...content.matchAll(/\{\s*slug:\s*'([^']+)',\s*product:\s*'([^']+)'/g)];
    matches.forEach(match => {
      articles.push({ slug: match[1], product: match[2] });
    });

    console.log(`   ℹ️  Loaded ${articles.length} articles metadata`);
    return articles;
  } catch (error) {
    console.log('   ℹ️  Could not load articles metadata, will use marketplace links');
    return [];
  }
}

/**
 * Load existing success stories from successStories.ts
 */
function loadExistingStories() {
  try {
    const content = fs.readFileSync(SUCCESS_STORIES_FILE_PATH, 'utf-8');

    // Extract array content
    const arrayMatch = content.match(/export const successStories: SuccessStory\[\] = \[([\s\S]*)\];/);
    if (!arrayMatch || arrayMatch[1].trim() === '') {
      console.log('   ℹ️  No existing stories found (empty array)');
      return [];
    }

    const stories = [];
    const content_stories = arrayMatch[1];

    // Split by story blocks (} followed by optional comma and whitespace, then {)
    const storyBlocks = content_stories.split(/\},\s*\{/);

    storyBlocks.forEach((block, index) => {
      // Add back braces that were removed by split
      let fullBlock = block.trim();
      if (index > 0) fullBlock = '{' + fullBlock;
      if (index < storyBlocks.length - 1) fullBlock = fullBlock + '}';

      // Extract key fields for deduplication
      const productMatch = fullBlock.match(/product:\s*'([^']+)'/);
      const tweetIdMatch = fullBlock.match(/tweetId:\s*'([^']+)'/);
      const articleSlugMatch = fullBlock.match(/articleSlug:\s*'([^']+)'/);

      if (productMatch) {
        stories.push({
          product: productMatch[1],
          tweetId: tweetIdMatch ? tweetIdMatch[1] : null,
          articleSlug: articleSlugMatch ? articleSlugMatch[1] : null,
          _rawBlock: fullBlock  // Preserve original formatting
        });
      }
    });

    console.log(`   ℹ️  Loaded ${stories.length} existing stories`);
    return stories;
  } catch (error) {
    console.log(`   ℹ️  Could not load existing stories: ${error.message}`);
    return [];
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
 * Fetch a single tweet by ID with all referenced tweets and media (for manual stories)
 */
async function fetchTweetWithReferences(client, tweetId) {
  try {
    const result = await client.v2.singleTweet(tweetId, {
      expansions: [
        'attachments.media_keys',
        'referenced_tweets.id',
        'referenced_tweets.id.attachments.media_keys'
      ],
      'tweet.fields': ['created_at', 'text', 'attachments', 'referenced_tweets'],
      'media.fields': ['url', 'preview_image_url', 'type', 'width', 'height', 'media_key']
    });
    return result;
  } catch (error) {
    console.log(`   ⚠️  Could not fetch tweet ${tweetId}: ${error.message}`);
    return null;
  }
}

/**
 * Load product documentation from docs index
 */
function loadProductDocs(product) {
  try {
    const docsIndexPath = path.join(__dirname, 'data', 'docs-index.json');
    const docsIndex = JSON.parse(fs.readFileSync(docsIndexPath, 'utf-8'));

    // Find all pages for this product
    const productPages = docsIndex.pages.filter(page => page.product === product);

    if (productPages.length === 0) {
      return null;
    }

    // Combine summaries, use cases, and keywords
    const summaries = productPages.map(p => p.summary).filter(Boolean);
    const useCases = productPages.flatMap(p => p.useCases || []);
    const keywords = [...new Set(productPages.flatMap(p => p.keywords || []))];

    return {
      summaries,
      useCases,
      keywords
    };
  } catch (error) {
    console.log(`   ℹ️  Could not load product docs: ${error.message}`);
    return null;
  }
}

/**
 * Generate summary from tweet content using Claude
 */
async function generateSummaryFromTweet(tweetData, product) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required');
  }

  // Collect tweet text + referenced tweet text
  let fullContext = tweetData.data.text;
  if (tweetData.includes?.tweets) {
    fullContext += '\n\nReferenced tweets:\n';
    tweetData.includes.tweets.forEach(t => {
      fullContext += '- ' + t.text + '\n';
    });
  }

  // Load product documentation
  const productDocs = loadProductDocs(product);
  let productContext = '';

  if (productDocs) {
    productContext = `\n\nProduct Context (${product}):\n`;
    if (productDocs.summaries.length > 0) {
      productContext += `\nOverview: ${productDocs.summaries[0]}\n`;
    }
    if (productDocs.useCases.length > 0) {
      productContext += `\nKey Use Cases:\n${productDocs.useCases.map(uc => `- ${uc}`).join('\n')}\n`;
    }
  }

  const anthropic = new Anthropic({ apiKey });

  const prompt = `Analyze this tweet about ${product} and create a success story summary.

Tweet content:
${fullContext}${productContext}

Generate:
1. **Title**: Short, impact-focused (3-5 words) highlighting the specific achievement or customer
   - Include client/customer name if mentioned in tweet
   - Focus on the outcome, not just product name
   - Examples: "ACME Corp Badge Success" or "Event Credential Adoption"

2. **Description**: Success story (40-60 words) with HTML formatting:
   - Start with introduction mentioning client/organization (if available) + use case
   - Include 2-3 achievements/improvements/features as HTML unordered list
   - End with the impact or benefit

   HTML Format (REQUIRED):
   "[Intro sentence]:<ul><li>First achievement/feature</li><li>Second achievement/feature</li><li>Third achievement/feature</li></ul>[Impact sentence]."

   Content requirements:
   - PRIORITY #1: Extract and use client/customer/organization name from tweet
   - List 2-3 specific achievements, improvements, or concrete features
   - Include measurable results or benefits if stated
   - If tweet lacks details, use product documentation features

   Example:
   "ACME Corp uses Product X to automate workflows. Key benefits:<ul><li>50% reduction in manual tasks</li><li>Real-time data synchronization</li><li>Enterprise-grade security</li></ul>This enables teams to focus on high-value activities."

Output as JSON:
{
  "title": "Client-focused or achievement-focused title (3-5 words)",
  "description": "HTML-formatted story with intro + <ul><li> list + impact (40-60 words)"
}

CRITICAL RULES:
- MUST use HTML <ul><li> tags for the achievement list
- ALWAYS extract client/customer/organization name if mentioned in tweet
- List must contain 2-3 concrete items (not generic marketing phrases)
- If no specific achievements in tweet, use product documentation features
- Do not invent client names or statistics not in the tweet`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    });

    const responseText = message.content[0].text.trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON response from Claude');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error(`   ❌ Claude API error: ${error.message}`);
    throw error;
  }
}

/**
 * Extract best image from tweet or referenced tweets
 */
function extractBestImage(tweetData) {
  let bestImage = null;

  // Check main tweet for images
  if (tweetData.data.attachments?.media_keys && tweetData.includes?.media) {
    const media = tweetData.includes.media.find(m =>
      tweetData.data.attachments.media_keys.includes(m.media_key) &&
      m.type === 'photo' &&
      (m.width >= 500 || m.height >= 500)
    );
    if (media) bestImage = media;
  }

  // Check referenced tweets for images
  if (!bestImage && tweetData.includes?.tweets && tweetData.includes?.media) {
    for (const refTweet of tweetData.includes.tweets) {
      if (refTweet.attachments?.media_keys) {
        const media = tweetData.includes.media.find(m =>
          refTweet.attachments.media_keys.includes(m.media_key) &&
          m.type === 'photo' &&
          (m.width >= 500 || m.height >= 500)
        );
        if (media) {
          bestImage = media;
          break;
        }
      }
    }
  }

  return bestImage;
}

/**
 * Generate buttons for a success story
 */
function generateButtons(product, tweetUrl, forceMarketplace = false) {
  const config = PRODUCT_CONFIG[product];
  if (!config) {
    throw new Error(`Unknown product: ${product}`);
  }

  // Button 1: Always link to X post
  const button1 = {
    text: 'View Post',
    href: tweetUrl,
    target: '_blank',
    hasArrow: true
  };

  // Button 2: Link to article OR marketplace
  let button2;
  if (!forceMarketplace) {
    const articles = loadArticlesMetadata();
    const matchingArticle = articles.find(a => a.product === product);

    if (matchingArticle) {
      button2 = {
        text: 'Read Full Story',
        href: `/articles/${matchingArticle.slug}`,
        hasArrow: true
      };
    }
  }

  // Fallback to marketplace if no article or forced
  if (!button2) {
    button2 = {
      text: 'Learn More',
      href: config.url,
      hasArrow: true
    };
  }

  return [button1, button2];
}

/**
 * Process manual success stories
 */
async function processManualStories(client, manualStories) {
  console.log(`\n📋 Processing ${manualStories.length} manual success stories...`);

  const processedStories = [];

  for (const manual of manualStories) {
    console.log(`\n   📦 Processing manual story: ${manual.product} (tweet: ${manual.tweetId})`);

    const config = PRODUCT_CONFIG[manual.product];
    if (!config) {
      console.log(`   ⚠️  Unknown product: ${manual.product}, skipping`);
      continue;
    }

    // 1. Fetch full tweet data with references
    const tweetData = await fetchTweetWithReferences(client, manual.tweetId);
    if (!tweetData) {
      console.log(`   ⚠️  Could not fetch tweet data, skipping`);
      continue;
    }

    // 2. Generate summary from tweet content using Claude (if not provided in config)
    let title = manual.title;
    let description = manual.description;

    if (!title || !description) {
      console.log(`   🤖 Generating summary from tweet content with Claude...`);
      try {
        const generated = await generateSummaryFromTweet(tweetData, manual.product);
        title = title || generated.title;
        description = description || generated.description;
        console.log(`   ✅ Generated: "${title}"`);
      } catch (error) {
        console.log(`   ⚠️  Could not generate summary: ${error.message}`);
        // Use config values or skip
        if (!title || !description) {
          console.log(`   ⚠️  No title/description available, skipping`);
          continue;
        }
      }
    }

    // 3. Extract best image from tweet or referenced tweets
    let image = null;
    const bestMedia = extractBestImage(tweetData);

    if (bestMedia) {
      try {
        const filename = `${config.slug}-${manual.tweetId}.jpg`;
        const filepath = path.join(SUCCESS_STORY_IMAGES_DIR, filename);

        console.log(`   📥 Downloading image (${bestMedia.width}x${bestMedia.height}px)...`);
        await downloadImage(bestMedia.url, filepath);
        console.log(`   ✅ Downloaded image: ${filename}`);

        image = {
          src: `/assets/images/success-stories/${filename}`,
          alt: `${manual.product} - ${title}`,
          loading: 'lazy',
          sizes: '(max-width: 767px) 100vw, (max-width: 991px) 95vw, 829px'
        };
      } catch (error) {
        console.log(`   ⚠️  Failed to download image: ${error.message}`);
      }
    } else {
      console.log(`   ⚠️  No suitable image found (≥500px required)`);
    }

    // Use fallback image if no image from tweet
    if (!image && config.fallbackImages?.length > 0) {
      const randomIndex = Math.floor(Math.random() * config.fallbackImages.length);
      image = {
        src: config.fallbackImages[randomIndex],
        alt: `${manual.product} solution`,
        loading: 'lazy',
        sizes: '(max-width: 767px) 100vw, (max-width: 991px) 95vw, 829px'
      };
      console.log(`   🎲 Using fallback image`);
    }

    // 4. Generate buttons
    const buttons = generateButtons(manual.product, manual.tweetUrl, manual.forceMarketplaceLink);

    processedStories.push({
      product: manual.product,
      title: title,
      description: description,
      image: image,
      buttons: buttons,
      tweetUrl: manual.tweetUrl,
      tweetId: manual.tweetId
    });

    console.log(`   ✅ Processed manual story: ${manual.product}`);
  }

  return processedStories;
}

/**
 * Generate success stories from tweets using Claude
 */
async function generateStoriesFromTweets(tweets, includes) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required');
  }

  console.log('   🤖 Sending tweets to Claude for success story generation...');

  // Prepare tweets data for Claude
  const tweetsData = tweets.map(tweet => {
    const images = [];
    if (tweet.attachments?.media_keys && includes.media) {
      tweet.attachments.media_keys.forEach(key => {
        const media = includes.media.find(m => m.media_key === key && m.type === 'photo');
        if (media?.url) {
          images.push({ url: media.url, width: media.width, height: media.height });
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
            images.push({ url: media.url, width: media.width, height: media.height });
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

  const prompt = `Analyze these tweets from @BWSCommunity that contain "Success Story".

Classify by product:
- X Bot (also called Telegram XBot)
- Blockchain Badges

For EACH product with success story tweets, create ONE success story:

1. **Title**: Impact-focused, short (3-5 words)
   - Focus on the achievement/result, not just product name
   - Example: "4K Token Airdrop Success" (not just "X Bot")

2. **Description**: Real-world success story (30-50 words)
   - MUST mention specific customer/project name if available
   - MUST highlight concrete results or use cases
   - Focus on measurable impact when mentioned
   - Example: "4K Token uses X Bot to automate their community airdrop campaign, tracking engagement and identifying top contributors. The tool saves their team 10+ hours weekly while ensuring transparent, data-driven reward distribution."

3. **Best Image Tweet ID**: Select tweet with highest quality image

CRITICAL RULES:
- Only describe facts explicitly stated in tweets
- DO NOT invent customer names, statistics, or features
- If tweets lack specific details, keep description general
- Focus on what IS mentioned, not what might exist

Output JSON array:
[
  {
    "product": "exact product name",
    "title": "Achievement-focused title",
    "description": "Specific success story with real customer/results (30-50 words)",
    "imageTweetId": "tweet_id or null"
  }
]

IMPORTANT: Only include products that are actually mentioned in the tweets. DO NOT include IPFS.

Tweets:
${JSON.stringify(tweetsData, null, 2)}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4000,
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

    const stories = JSON.parse(jsonMatch[0]);
    console.log(`   ✅ Generated ${stories.length} success stories from tweets`);

    return stories;
  } catch (error) {
    console.error(`   ❌ Claude API error: ${error.message}`);
    throw error;
  }
}

/**
 * Process generated stories (download images, add buttons)
 */
async function processGeneratedStories(storiesData, tweets, includes) {
  console.log(`\n📦 Processing ${storiesData.length} generated success stories...`);

  const processedStories = [];

  for (const storyData of storiesData) {
    console.log(`\n   📦 Processing story: ${storyData.product}`);

    const config = PRODUCT_CONFIG[storyData.product];
    if (!config) {
      console.log(`   ⚠️  Unknown product: ${storyData.product}, skipping`);
      continue;
    }

    // Get tweet ID from imageTweetId
    let tweetId = storyData.imageTweetId;
    let tweetUrl = '';

    // If no image tweet specified, use first tweet mentioning the product
    if (!tweetId) {
      const productTweet = tweets.find(t =>
        t.text.toLowerCase().includes(storyData.product.toLowerCase())
      );
      if (productTweet) {
        tweetId = productTweet.id;
      }
    }

    if (tweetId) {
      tweetUrl = `https://x.com/${TWITTER_USERNAME}/status/${tweetId}`;
    }

    // Download image
    let image = null;
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
            console.log(`   ⚠️  Skipping small image: ${media.width}x${media.height}px`);
          }
        }

        // Check referenced tweet for image
        if (!imageUrl && tweet.referenced_tweets && includes.tweets && includes.media) {
          const quotedTweet = includes.tweets.find(
            t => tweet.referenced_tweets.some(ref => ref.id === t.id)
          );
          if (quotedTweet?.attachments?.media_keys) {
            const media = includes.media.find(
              m => m.media_key === quotedTweet.attachments.media_keys[0] && m.type === 'photo'
            );
            if (media?.url && (media.width >= 500 || media.height >= 500)) {
              imageUrl = media.url;
            } else if (media?.url) {
              console.log(`   ⚠️  Skipping small quoted image: ${media.width}x${media.height}px`);
            }
          }
        }

        if (imageUrl) {
          try {
            const timestamp = Date.now();
            const filename = `${config.slug}-${timestamp}.jpg`;
            const filepath = path.join(SUCCESS_STORY_IMAGES_DIR, filename);

            console.log(`   📥 Downloading image from tweet ${tweetId}...`);
            await downloadImage(imageUrl, filepath);
            console.log(`   ✅ Image saved: ${filename}`);

            image = {
              src: `/assets/images/success-stories/${filename}`,
              alt: `${storyData.product} - ${storyData.title}`,
              loading: 'lazy',
              sizes: '(max-width: 767px) 100vw, (max-width: 991px) 95vw, 829px'
            };
          } catch (error) {
            console.error(`   ⚠️  Failed to download image: ${error.message}`);
          }
        }
      }
    }

    // Use fallback image if no image downloaded
    if (!image && config.fallbackImages?.length > 0) {
      const randomIndex = Math.floor(Math.random() * config.fallbackImages.length);
      image = {
        src: config.fallbackImages[randomIndex],
        alt: `${storyData.product} solution`,
        loading: 'lazy',
        sizes: '(max-width: 767px) 100vw, (max-width: 991px) 95vw, 829px'
      };
      console.log(`   🎲 Using fallback image`);
    }

    // Generate buttons
    const buttons = generateButtons(storyData.product, tweetUrl, false);

    processedStories.push({
      product: storyData.product,
      title: storyData.title,
      description: storyData.description,
      image: image,
      buttons: buttons,
      tweetUrl: tweetUrl,
      tweetId: tweetId
    });

    console.log(`   ✅ Processed story: ${storyData.product}`);
  }

  return processedStories;
}

/**
 * Deduplicate stories by product + tweetId
 */
function deduplicateStories(existingStories, newStories) {
  console.log(`\n🔄 Deduplicating stories...`);
  console.log(`   Existing: ${existingStories.length}, New: ${newStories.length}`);

  // Create map: "product:tweetId" -> story
  const storiesMap = new Map();

  // Add existing stories to map (preserve with _rawBlock for formatting)
  existingStories.forEach(story => {
    const key = `${story.product}:${story.tweetId || story.articleSlug || 'unknown'}`;
    storiesMap.set(key, story);
  });

  // Add new stories (never replace existing with same key)
  newStories.forEach(story => {
    const key = `${story.product}:${story.tweetId}`;
    if (!storiesMap.has(key)) {
      storiesMap.set(key, story);
      console.log(`   ✅ Added new story: ${story.product} (tweet: ${story.tweetId})`);
    } else {
      console.log(`   ⏭️  Skipped duplicate: ${story.product} (tweet: ${story.tweetId})`);
    }
  });

  const deduplicated = Array.from(storiesMap.values());
  console.log(`   Final count: ${deduplicated.length} stories`);

  return deduplicated;
}

/**
 * Write success stories to successStories.ts
 */
function writeSuccessStoriesFile(stories) {
  console.log(`\n   📝 Writing ${stories.length} success stories to file...`);

  const currentContent = fs.readFileSync(SUCCESS_STORIES_FILE_PATH, 'utf-8');
  const exportMatch = currentContent.match(/export const successStories: SuccessStory\[\] = \[/);

  if (!exportMatch) {
    throw new Error('Could not find successStories export in file');
  }

  const beforeExport = currentContent.substring(0, exportMatch.index + exportMatch[0].length);

  // Generate TypeScript code for each story
  const storiesCode = stories.map(story => {
    // If story has _rawBlock, preserve it (from existing entries)
    if (story._rawBlock) {
      return story._rawBlock;
    }

    // Otherwise, generate new entry
    let code = `\n{\n`;
    code += `  product: '${story.product}',\n`;
    code += `  title: '${story.title.replace(/'/g, "\\'")}',\n`;
    code += `  description: '${story.description.replace(/'/g, "\\'")}',\n`;

    if (story.image) {
      code += `  image: {\n`;
      code += `    src: '${story.image.src}',\n`;
      code += `    alt: '${story.image.alt.replace(/'/g, "\\'")}',\n`;
      code += `    loading: '${story.image.loading}',\n`;
      code += `    sizes: '${story.image.sizes}'\n`;
      code += `  },\n`;
    }

    if (story.buttons && story.buttons.length > 0) {
      code += `  buttons: [\n`;
      story.buttons.forEach(btn => {
        code += `    {\n`;
        code += `      text: '${btn.text}',\n`;
        code += `      href: '${btn.href}',\n`;
        if (btn.target) code += `      target: '${btn.target}',\n`;
        code += `      hasArrow: ${btn.hasArrow}\n`;
        code += `    },\n`;
      });
      code += `  ],\n`;
    }

    if (story.tweetUrl) {
      code += `  tweetUrl: '${story.tweetUrl}',\n`;
    }

    if (story.tweetId) {
      code += `  tweetId: '${story.tweetId}'`;
    }

    if (story.articleSlug) {
      code += `,\n  articleSlug: '${story.articleSlug}'`;
    }

    if (story.publishDate) {
      code += `,\n  publishDate: '${story.publishDate}'`;
    }

    code += `\n}`;
    return code;
  }).join(',\n');

  const newContent = beforeExport + '\n' + storiesCode + '\n];\n';
  fs.writeFileSync(SUCCESS_STORIES_FILE_PATH, newContent);

  console.log(`   ✅ Written ${stories.length} success stories`);
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting success stories fetch...');
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

    // 1. Load manual stories
    const manualStories = loadManualStories();

    // 2. Load existing stories
    const existingStories = loadExistingStories();

    // 3. Fetch tweets with "Success Story" keyword
    console.log(`\n🔍 Searching for tweets: ${SEARCH_QUERY}`);
    const searchResult = await client.v2.search(SEARCH_QUERY, {
      max_results: Math.min(MAX_TWEETS_TO_FETCH, 100), // Twitter API limit
      expansions: [
        'attachments.media_keys',
        'referenced_tweets.id',
        'referenced_tweets.id.attachments.media_keys',
        'author_id'
      ],
      'tweet.fields': ['created_at', 'text', 'attachments', 'referenced_tweets'],
      'media.fields': ['url', 'preview_image_url', 'type', 'width', 'height', 'media_key']
    });

    const tweets = searchResult.data.data || [];
    const includes = searchResult.data.includes || {};

    console.log(`📊 Found ${tweets.length} tweets with "Success Story"`);

    let newStoriesFromTweets = [];
    if (tweets.length > 0) {
      // 4. Generate stories from tweets with Claude
      const storiesData = await generateStoriesFromTweets(tweets, includes);

      // 5. Process generated stories (download images, add buttons)
      newStoriesFromTweets = await processGeneratedStories(storiesData, tweets, includes);
    }

    // 6. Process manual stories
    const processedManualStories = await processManualStories(client, manualStories);

    // 7. Combine all new stories
    const allNewStories = [...processedManualStories, ...newStoriesFromTweets];

    console.log(`\n📊 Summary:`);
    console.log(`   Manual stories: ${processedManualStories.length}`);
    console.log(`   Tweet stories: ${newStoriesFromTweets.length}`);
    console.log(`   Total new: ${allNewStories.length}`);

    // 8. API Failure Protection: Don't overwrite if we got no new stories
    if (allNewStories.length === 0 && existingStories.length > 0) {
      console.log(`\n⚠️  API LIMIT PROTECTION: No new stories processed`);
      console.log(`   Keeping ${existingStories.length} existing stories intact`);
      console.log(`   The script will retry tomorrow when API limits reset`);

      // Save state but don't modify stories file
      processedData.lastCheck = new Date().toISOString();
      processedData.failureCount = (processedData.failureCount || 0) + 1;
      saveProcessedTweets(processedData);

      console.log(`\n✅ Exiting without changes to preserve existing content`);
      return; // Exit early without writing
    }

    // 9. Deduplicate
    const deduplicatedStories = deduplicateStories(existingStories, allNewStories);

    // 10. Write to file
    writeSuccessStoriesFile(deduplicatedStories);

    // Update processed tweets
    const newTweetIds = tweets.map(t => t.id);
    processedData.processedTweetIds = [...new Set([...processedData.processedTweetIds, ...newTweetIds])];

    // Keep only last 200 tweet IDs to prevent file from growing indefinitely
    if (processedData.processedTweetIds.length > 200) {
      processedData.processedTweetIds = processedData.processedTweetIds.slice(-200);
    }

    // Save state
    processedData.lastSuccess = new Date().toISOString();
    processedData.failureCount = 0;
    saveProcessedTweets(processedData);

    console.log(`\n✨ Completed successfully!`);
    console.log(`   Success stories in file: ${deduplicatedStories.length}`);
    console.log(`   Products: ${[...new Set(deduplicatedStories.map(s => s.product))].join(', ')}`);

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
