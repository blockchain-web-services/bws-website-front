#!/usr/bin/env node

/**
 * Fetch Marketplace Announcements from X (Twitter)
 *
 * This script fetches recent tweets from @BWSCommunity, classifies them by product,
 * and generates marketplace announcement cards with complementary text sections and images.
 * Uses Anthropic Claude API to classify, aggregate, and generate content.
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
const MAX_TWEETS_TO_FETCH = 50;
const PROCESSED_TWEETS_PATH = path.join(__dirname, 'data', 'processed-marketplace-tweets.json');
const ANNOUNCEMENTS_FILE_PATH = path.join(__dirname, '..', 'src', 'data', 'marketplaceAnnouncements.ts');
const MARKETPLACE_IMAGES_DIR = path.join(__dirname, '..', 'public', 'assets', 'images', 'marketplace');

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
if (!fs.existsSync(MARKETPLACE_IMAGES_DIR)) {
  fs.mkdirSync(MARKETPLACE_IMAGES_DIR, { recursive: true });
}

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
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
 * Load existing marketplace announcements
 */
function loadExistingAnnouncements() {
  try {
    const content = fs.readFileSync(ANNOUNCEMENTS_FILE_PATH, 'utf-8');

    // Extract the array content using regex
    const arrayMatch = content.match(/export const marketplaceAnnouncements: MarketplaceAnnouncement\[\] = (\[[\s\S]*?\]);/);
    if (!arrayMatch) {
      console.log('   ⚠️  Could not parse existing announcements');
      return [];
    }

    // Use eval to parse the array (safe in this context as it's our own file)
    // Note: This is a simple approach - in production you might want a proper TS parser
    const arrayStr = arrayMatch[1];

    // For now, just extract product names and video data manually
    const productMatches = [...content.matchAll(/product:\s*'([^']+)'/g)];
    const videoMatches = [...content.matchAll(/video:\s*\{[\s\S]*?embedUrl:\s*'([^']+)'[\s\S]*?\}/g)];

    const existing = [];
    productMatches.forEach((match, index) => {
      const product = match[1];
      const videoMatch = videoMatches.find((v) => {
        const videoIndex = content.indexOf(v[0]);
        const productIndex = match.index;
        return videoIndex > productIndex && (index === productMatches.length - 1 || videoIndex < productMatches[index + 1].index);
      });

      if (videoMatch) {
        // Extract full video object
        const videoBlock = videoMatch[0];
        const embedUrl = videoMatch[1];
        const titleMatch = videoBlock.match(/title:\s*'([^']+)'/);
        const widthMatch = videoBlock.match(/width:\s*'([^']+)'/);
        const heightMatch = videoBlock.match(/height:\s*'([^']+)'/);
        const paddingMatch = videoBlock.match(/paddingTop:\s*'([^']+)'/);

        // Extract link if exists
        const linkStartIndex = content.indexOf('link:', match.index);
        const nextProductIndex = index < productMatches.length - 1 ? productMatches[index + 1].index : content.length;
        const linkMatch = linkStartIndex > match.index && linkStartIndex < nextProductIndex
          ? content.substring(linkStartIndex, nextProductIndex).match(/link:\s*\{[\s\S]*?\}/)
          : null;

        existing.push({
          product: product,
          video: {
            embedUrl: embedUrl,
            title: titleMatch ? titleMatch[1] : '',
            width: widthMatch ? widthMatch[1] : '940',
            height: heightMatch ? heightMatch[1] : '1671',
            paddingTop: paddingMatch ? paddingMatch[1] : '177.77%'
          },
          link: linkMatch ? extractLinkObject(linkMatch[0]) : null
        });
      }
    });

    console.log(`   ℹ️  Loaded ${existing.length} existing announcements with videos`);
    return existing;
  } catch (error) {
    console.log(`   ⚠️  Error loading existing announcements: ${error.message}`);
    return [];
  }
}

/**
 * Extract link object from link block text
 */
function extractLinkObject(linkBlock) {
  const textMatch = linkBlock.match(/text:\s*'([^']+)'/);
  const hrefMatch = linkBlock.match(/href:\s*'([^']+)'/);
  const targetMatch = linkBlock.match(/target:\s*'([^']+)'/);
  const highlightedMatch = linkBlock.match(/highlightedText:\s*'([^']+)'/);

  if (!textMatch || !hrefMatch) return null;

  return {
    text: textMatch[1],
    href: hrefMatch[1],
    target: targetMatch ? targetMatch[1] : '_blank',
    highlightedText: highlightedMatch ? highlightedMatch[1] : null
  };
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
 * Classify tweets and generate announcements using Claude
 */
async function classifyAndGenerateContent(tweets, includes) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required');
  }

  console.log('   🤖 Sending tweets to Claude for classification...');

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

  const prompt = `Analyze these ${tweets.length} tweets from @BWSCommunity and classify them by product category:

Product Categories (DO NOT include IPFS):
- X Bot (also called Telegram XBot)
- Blockchain Badges
- ESG Credits
- Fan Game Cube (also called NFT Game Cube)

For EACH product category that has relevant tweets, create ONE announcement by:

1. Select 2-3 tweets about that product
2. Generate a product-focused title (3-5 words)
3. Create TWO EXTENDED complementary description sections (CRITICAL LENGTH: 60-80 words per section, much longer than before):
   - Section 1: Comprehensive value proposition - explain what the product does, who it's for, and the main problem it solves (60-80 words)
   - Section 2: Detailed feature explanation or use case - describe specific features, benefits, technical capabilities, or real-world applications (60-80 words)
   - MUST tell a cohesive and detailed story about the same product
   - DO NOT repeat the same information
   - Descriptions must complement each other, not duplicate
   - Use rich, descriptive language that fills the space effectively
   - Each section should be approximately 2-3 sentences with substantial detail
   - Example length reference: "The X Bot provides automated community engagement analytics by tracking and reporting X (Twitter) metrics while seamlessly syncing posts to Telegram groups. This innovative tool enables blockchain projects to monitor Key Opinion Leader performance in real-time, helping teams understand engagement patterns across their community. By automating daily reports and providing actionable insights, projects can gamify community support and reward top contributors, creating a more engaged and motivated user base that drives organic growth and brand awareness."
   - Example GOOD (extended): "Creates comprehensive blockchain-based badge systems for organizations to verify achievements, event participation, and learning milestones with immutable proof. The platform provides enterprise-grade security while maintaining user privacy, allowing institutions to issue digital credentials that can be independently verified without central authority. Perfect for educational institutions, event organizers, and corporate training programs seeking to modernize their certification processes." + "Enables Web2 companies to seamlessly issue tamper-proof digital credentials without requiring end users to understand blockchain technology. The system handles all blockchain complexity behind the scenes, providing simple APIs and interfaces that integrate with existing systems. Recipients can share their credentials across platforms, and verifiers can instantly confirm authenticity, eliminating fraud and reducing administrative overhead while building trust in digital certifications."
   - Example BAD (too short): "Creates blockchain certificates for achievements" + "Uses blockchain to verify credentials"
4. Select the best tweet ID that has an image (if any)
5. Detect if any tweet mentions a video URL (Vimeo, YouTube, TikTok)

Output as JSON array:
[
  {
    "product": "exact product name from list",
    "title": "Product-focused title",
    "descriptions": [
      "First EXTENDED complementary description (60-80 words with rich detail)",
      "Second EXTENDED complementary description (60-80 words with rich detail)"
    ],
    "imageTweetId": "tweet_id_with_best_image or null",
    "videoUrl": "video_url if found or null",
    "videoTitle": "video title if found or null"
  }
]

IMPORTANT: Only include products that are actually mentioned in the tweets. DO NOT include IPFS.

Tweets:
${JSON.stringify(tweetsData, null, 2)}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
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

    const classifications = JSON.parse(jsonMatch[0]);
    console.log(`   ✅ Classified into ${classifications.length} product categories`);

    return classifications;
  } catch (error) {
    console.error(`   ❌ Claude API error: ${error.message}`);
    throw error;
  }
}

/**
 * Process classified content into announcement objects
 */
async function processAnnouncements(classifications, tweets, includes) {
  const announcements = [];
  const existingAnnouncements = loadExistingAnnouncements();

  for (const classification of classifications) {
    console.log(`\n   📦 Processing ${classification.product}...`);

    const config = PRODUCT_CONFIG[classification.product];
    if (!config) {
      console.log(`   ⚠️  Unknown product: ${classification.product}, skipping`);
      continue;
    }

    const announcement = {
      product: classification.product,
      title: classification.title,
      descriptions: classification.descriptions
    };

    // Process image if tweet ID provided
    let imageSet = false;
    if (classification.imageTweetId) {
      const tweet = tweets.find(t => t.id === classification.imageTweetId);
      if (tweet) {
        let imageUrl = null;

        // Find image from tweet
        if (tweet.attachments?.media_keys && includes.media) {
          const media = includes.media.find(
            m => m.media_key === tweet.attachments.media_keys[0] && m.type === 'photo'
          );
          if (media?.url) {
            imageUrl = media.url;
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
            if (media?.url) {
              imageUrl = media.url;
            }
          }
        }

        if (imageUrl) {
          try {
            const filename = `${config.slug}-${Date.now()}.jpg`;
            const filepath = path.join(MARKETPLACE_IMAGES_DIR, filename);

            console.log(`   📥 Downloading image from tweet...`);
            await downloadImage(imageUrl, filepath);
            console.log(`   ✅ Image saved: ${filename}`);

            announcement.image = {
              src: `/assets/images/marketplace/${filename}`,
              alt: `${classification.product} solution`,
              loading: 'lazy',
              sizes: '(max-width: 767px) 100vw, (max-width: 991px) 95vw, 829px'
            };
            imageSet = true;
          } catch (error) {
            console.error(`   ⚠️  Failed to download image: ${error.message}`);
          }
        }
      }
    }

    // Use fallback image if no image from tweets
    if (!imageSet && config.fallbackImages && config.fallbackImages.length > 0) {
      // Select random fallback image
      const randomIndex = Math.floor(Math.random() * config.fallbackImages.length);
      const fallbackImage = config.fallbackImages[randomIndex];

      console.log(`   🎲 Using fallback image: ${fallbackImage}`);

      announcement.image = {
        src: fallbackImage,
        alt: `${classification.product} solution`,
        loading: 'lazy',
        sizes: '(max-width: 767px) 100vw, (max-width: 991px) 95vw, 829px'
      };
    }

    // Process video if found in tweets
    if (classification.videoUrl) {
      console.log(`   📹 Found video in tweets: ${classification.videoUrl}`);

      // Parse video details
      let embedUrl = classification.videoUrl;
      let width = '940';
      let height = '1671';
      let paddingTop = '177.77%';

      // Handle different video platforms
      if (embedUrl.includes('vimeo.com')) {
        // Already in embed format or convert
        if (!embedUrl.includes('player.vimeo.com')) {
          const videoId = embedUrl.match(/vimeo\.com\/(\d+)/)?.[1];
          if (videoId) {
            embedUrl = `https://player.vimeo.com/video/${videoId}`;
          }
        }
      } else if (embedUrl.includes('youtube.com') || embedUrl.includes('youtu.be')) {
        // Convert to embed format
        const videoId = embedUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
        if (videoId) {
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
          width = '560';
          height = '315';
          paddingTop = '56.25%'; // 16:9 aspect ratio
        }
      }

      announcement.video = {
        embedUrl: embedUrl,
        title: classification.videoTitle || `${classification.product} Video`,
        width: width,
        height: height,
        paddingTop: paddingTop
      };
    } else {
      // Preserve existing video if no new one found
      const existing = existingAnnouncements.find(e => e.product === classification.product);
      if (existing?.video) {
        console.log(`   📹 Preserving existing video for ${classification.product}`);
        announcement.video = existing.video;
        if (existing.link) {
          announcement.link = existing.link;
        }
      }
    }

    // Add button
    announcement.button = {
      text: config.buttonText,
      href: config.url,
      target: '_blank',
      hasArrow: true
    };

    announcements.push(announcement);
    console.log(`   ✅ Processed ${classification.product}`);
  }

  return announcements;
}

/**
 * Write announcements to marketplaceAnnouncements.ts
 */
function writeAnnouncementsFile(announcements) {
  console.log('\n   📝 Writing announcements to file...');

  // Generate TypeScript code
  const announcementsCode = announcements.map(ann => {
    let code = `{
  product: '${ann.product}',
  title: '${ann.title.replace(/'/g, "\\'")}',
  descriptions: [
    '${ann.descriptions[0].replace(/'/g, "\\'")}',
    '${ann.descriptions[1].replace(/'/g, "\\'")}'
  ]`;

    if (ann.image) {
      code += `,
  image: {
    src: '${ann.image.src}',
    alt: '${ann.image.alt.replace(/'/g, "\\'")}',
    loading: '${ann.image.loading}',
    sizes: '${ann.image.sizes}'
  }`;
    }

    if (ann.button) {
      code += `,
  button: {
    text: '${ann.button.text}',
    href: '${ann.button.href}',
    target: '${ann.button.target}',
    hasArrow: ${ann.button.hasArrow}
  }`;
    }

    if (ann.video) {
      code += `,
  video: {
    embedUrl: '${ann.video.embedUrl}',
    title: '${ann.video.title.replace(/'/g, "\\'")}',
    width: '${ann.video.width}',
    height: '${ann.video.height}',
    paddingTop: '${ann.video.paddingTop}'
  }`;
    }

    if (ann.link) {
      code += `,
  link: {
    text: '${ann.link.text.replace(/'/g, "\\'")}',
    href: '${ann.link.href}',
    target: '${ann.link.target}'`;
      if (ann.link.highlightedText) {
        code += `,
    highlightedText: '${ann.link.highlightedText.replace(/'/g, "\\'")}'`;
      }
      code += `
  }`;
    }

    code += `
}`;
    return code;
  }).join(',\n');

  // Read current file to preserve interfaces
  const currentContent = fs.readFileSync(ANNOUNCEMENTS_FILE_PATH, 'utf-8');

  // Find where the export starts
  const exportMatch = currentContent.match(/export const marketplaceAnnouncements: MarketplaceAnnouncement\[\] = \[/);
  if (!exportMatch) {
    throw new Error('Could not find marketplaceAnnouncements export in file');
  }

  const beforeExport = currentContent.substring(0, exportMatch.index + exportMatch[0].length);
  const newContent = beforeExport + announcements.length > 0 ? announcements.map(a => `
${announcementsCode}`).join(',') : '' + `
];
`;

  fs.writeFileSync(ANNOUNCEMENTS_FILE_PATH, beforeExport + (announcements.length > 0 ? '\n' + announcementsCode : '') + '\n];\n');
  console.log(`   ✅ Written ${announcements.length} announcements to file`);
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting marketplace announcements fetch...');
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

    // Classify tweets and generate content with Claude
    const classifications = await classifyAndGenerateContent(tweets, includes);

    if (classifications.length === 0) {
      console.log('ℹ️  No product-related tweets found');
      processedData.lastSuccess = new Date().toISOString();
      saveProcessedTweets(processedData);
      return;
    }

    // Process announcements
    const announcements = await processAnnouncements(classifications, tweets, includes);

    if (announcements.length === 0) {
      console.log('ℹ️  No announcements generated');
      processedData.lastSuccess = new Date().toISOString();
      saveProcessedTweets(processedData);
      return;
    }

    // Write to file
    writeAnnouncementsFile(announcements);

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
    console.log(`   Announcements generated: ${announcements.length}`);
    console.log(`   Products: ${announcements.map(a => a.product).join(', ')}`);

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
