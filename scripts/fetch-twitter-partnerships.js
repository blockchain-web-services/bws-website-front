#!/usr/bin/env node

/**
 * Fetch Partnership Announcements from X (Twitter)
 *
 * This script fetches recent tweets from @BWSCommunity, filters for "Partnership"
 * announcements, extracts images, and adds them to the news carousel.
 * Uses Anthropic Claude API to generate concise summaries.
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
const FALLBACK_IMAGE = '/assets/images/logos/bws-logo-violet-flying.png';
const PROCESSED_TWEETS_PATH = path.join(__dirname, 'data', 'processed-tweets.json');
const NEWS_FILE_PATH = path.join(__dirname, '..', 'src', 'data', 'news.ts');
const NEWS_IMAGES_DIR = path.join(__dirname, '..', 'public', 'assets', 'images', 'news');
const PARTNERSHIP_CSS_FILE = path.join(__dirname, '..', 'public', 'partnerships.css');

// Ensure directories exist
if (!fs.existsSync(NEWS_IMAGES_DIR)) {
  fs.mkdirSync(NEWS_IMAGES_DIR, { recursive: true });
}

/**
 * Load processed tweets from state file
 */
function loadProcessedTweets() {
  try {
    const data = fs.readFileSync(PROCESSED_TWEETS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading processed tweets:', error.message);
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
 * Extract image URL from tweet or quoted tweet
 */
function extractImageUrl(tweet, includes) {
  let imageUrl = null;
  let useFallback = false;

  console.log(`   🔍 Extracting image for tweet ${tweet.id}...`);

  // Priority 1: Check main tweet media
  if (tweet.attachments?.media_keys && includes.media) {
    console.log(`   📎 Main tweet has ${tweet.attachments.media_keys.length} media attachment(s)`);
    const imageMedia = includes.media.find(
      m => m.media_key === tweet.attachments.media_keys[0] && m.type === 'photo'
    );
    if (imageMedia?.url) {
      console.log(`   ✅ Found image in main tweet: ${imageMedia.url.substring(0, 60)}...`);
      imageUrl = imageMedia.url;
    }
  }

  // Priority 2: Check referenced/quoted tweet
  if (!imageUrl && tweet.referenced_tweets && includes.tweets) {
    console.log(`   🔗 Tweet has ${tweet.referenced_tweets.length} referenced tweet(s)`);
    const quotedTweet = includes.tweets.find(
      t => tweet.referenced_tweets.some(ref => ref.id === t.id)
    );

    if (quotedTweet) {
      console.log(`   📝 Found referenced tweet ${quotedTweet.id}`);
      if (quotedTweet.attachments?.media_keys) {
        console.log(`   📎 Referenced tweet has ${quotedTweet.attachments.media_keys.length} media attachment(s)`);
        if (includes.media) {
          const imageMedia = includes.media.find(
            m => m.media_key === quotedTweet.attachments.media_keys[0] && m.type === 'photo'
          );
          if (imageMedia?.url) {
            console.log(`   ✅ Found image in referenced tweet: ${imageMedia.url.substring(0, 60)}...`);
            imageUrl = imageMedia.url;
          } else {
            console.log(`   ⚠️  Media key ${quotedTweet.attachments.media_keys[0]} not found in includes.media`);
          }
        }
      } else {
        console.log(`   ℹ️  Referenced tweet has no media attachments`);
      }
    }
  }

  // Priority 3: Use fallback
  if (!imageUrl) {
    console.log(`   ⚠️  No image found for tweet ${tweet.id}, using fallback BWS logo`);
    useFallback = true;
    imageUrl = FALLBACK_IMAGE;
  }

  return { imageUrl, useFallback };
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
 * Extract partner name from tweet text
 */
function extractPartnerName(text) {
  // Try to extract partner name after "Partnership" keyword
  // Handle formats like "Partnership | @Name" or "Partnership: Name" or "Partnership with Name"
  const match = text.match(/Partnership\s*[:|]\s*(?:with\s+)?([^.\n]+)/i);
  if (match && match[1]) {
    let name = match[1].trim();
    // Remove leading pipe if present
    name = name.replace(/^\|\s*/, '');
    // Take only the first line if multi-line
    name = name.split('\n')[0].trim();
    return name;
  }
  return 'Partnership Announcement';
}

/**
 * Clean tweet text for description (fallback if AI fails)
 */
function cleanTweetText(text) {
  // Remove URLs
  let cleaned = text.replace(/https?:\/\/\S+/g, '');
  // Remove extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  // Limit length
  if (cleaned.length > 280) {
    cleaned = cleaned.substring(0, 277) + '...';
  }
  return cleaned;
}

/**
 * Generate concise summary and title using Claude API
 */
async function generateContentWithClaude(tweetText) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Fallback to basic extraction if no API key
  if (!apiKey) {
    console.log('   ⚠️  No ANTHROPIC_API_KEY found, using basic text extraction');
    return {
      title: extractPartnerName(tweetText),
      description: cleanTweetText(tweetText)
    };
  }

  try {
    const anthropic = new Anthropic({ apiKey });

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 150,
      messages: [{
        role: 'user',
        content: `Analyze this partnership announcement tweet and provide:
1. A title (max 3 words) - just the partner name or key term
2. A description (one sentence, max 150 characters) - focus on how the partner is using BWS platform solutions, APIs, or integrating BWS technology. This is NOT about the partner becoming a solution in BWS marketplace, but about them utilizing or integrating BWS services.
3. The partner's X (Twitter) username (without @) - extract from the tweet text

Format your response as JSON:
{
  "title": "Partner Name",
  "description": "Brief partnership summary emphasizing BWS platform/API usage",
  "xUsername": "partnername"
}

Tweet: ${tweetText}`
      }]
    });

    const responseText = message.content[0].text.trim();
    // Try to parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log(`   🤖 AI Title: ${parsed.title}`);
      console.log(`   🤖 AI Description: ${parsed.description}`);
      console.log(`   🤖 AI X Username: ${parsed.xUsername || 'N/A'}`);
      return {
        title: parsed.title,
        description: parsed.description,
        xUsername: parsed.xUsername || null
      };
    } else {
      throw new Error('Could not parse JSON response from Claude');
    }
  } catch (error) {
    console.error(`   ⚠️  Claude API error: ${error.message}`);
    console.log('   📝 Falling back to basic text extraction');
    return {
      title: extractPartnerName(tweetText),
      description: cleanTweetText(tweetText)
    };
  }
}

/**
 * Fetch partner's X profile image
 */
async function fetchPartnerProfileImage(client, username) {
  try {
    if (!username) return null;

    console.log(`   🔍 Fetching profile image for @${username}...`);
    const user = await client.v2.userByUsername(username, {
      'user.fields': ['profile_image_url']
    });

    if (user.data?.profile_image_url) {
      // Get the larger version (replace _normal with _400x400)
      const largeImageUrl = user.data.profile_image_url.replace('_normal', '_400x400');
      console.log(`   ✅ Found profile image for @${username}`);
      return largeImageUrl;
    }
    return null;
  } catch (error) {
    console.error(`   ⚠️  Failed to fetch profile image for @${username}: ${error.message}`);
    return null;
  }
}

/**
 * Generate news entry object
 */
async function generateNewsEntry(tweet, imagePath, client) {
  const { title, description, xUsername } = await generateContentWithClaude(tweet.text);

  // Generate unique background class for this partnership
  const backgroundClass = `container-image-partnership-${tweet.id}`;

  // Fetch partner's profile image if we have their username
  let partnerProfileImage = null;
  if (xUsername) {
    partnerProfileImage = await fetchPartnerProfileImage(client, xUsername);
  }

  // Build logos array - BWS logo + partner logo (if available)
  const logos = [
    {
      src: '/assets/images/6474d385cfec71cb21a92251/651c58eabcaaed235a87df6d_logo_plus_BWS.svg',
      alt: 'BWS Logo',
      href: 'https://www.bws.ninja',
      class: 'image-partnership image-partnership-bws'
    }
  ];

  // Add partner logo if we have it
  if (partnerProfileImage) {
    logos.push({
      src: partnerProfileImage,
      alt: `${title} Logo`,
      href: xUsername ? `https://x.com/${xUsername}` : `https://x.com/BWSCommunity/status/${tweet.id}`,
      class: 'image-partnership image-partnership-partner'
    });
  }

  return {
    title: title,
    description: description,
    partnershipTitle: title,
    logos: logos,
    buttons: [{
      text: 'View Announcement',
      href: `https://x.com/BWSCommunity/status/${tweet.id}`,
      type: 'secondary',
      target: '_blank',
      hasArrow: true
    }],
    backgroundClass: backgroundClass,
    backgroundImage: imagePath
  };
}

/**
 * Add CSS rule for partnership background image
 */
function addPartnershipCSS(backgroundClass, imagePath) {
  try {
    const cssRule = `
/* Partnership background: ${backgroundClass} */
.${backgroundClass} {
  background-image: url('${imagePath}');
  background-position: 50%;
  background-size: cover;
  background-repeat: no-repeat;
  border: 1px solid #000;
  border-top-style: none;
  border-radius: 20px 20px 0 0;
  min-width: 100%;
  max-width: none;
  min-height: 200px;
}
`;

    // Read existing CSS or create new
    let cssContent = '';
    if (fs.existsSync(PARTNERSHIP_CSS_FILE)) {
      cssContent = fs.readFileSync(PARTNERSHIP_CSS_FILE, 'utf-8');
    } else {
      // Create file with header
      cssContent = `/* Auto-generated partnership announcement styles */
/* Do not edit manually - managed by fetch-twitter-partnerships.js */

/* Fixed height for description text to ensure consistent card heights */
.announcement-text {
  min-height: 96px !important;
  max-height: 96px !important;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-height: 30px !important;
  margin-bottom: 16px !important;
}

/* Partnership logo styling */
.image-partnership {
  height: auto !important;
  max-width: 80px !important;
  object-fit: contain !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* BWS logo - no circle, 20% smaller than original */
.image-partnership-bws {
  max-width: 80px !important;
}

/* Partner logo - circle styling (like X profile pics) */
.image-partnership:not(.image-partnership-bws) {
  border-radius: 50% !important;
  width: 80px !important;
  height: 80px !important;
  object-fit: cover !important;
}
`;
    }

    // Check if this background class already exists
    if (!cssContent.includes(`.${backgroundClass}`)) {
      cssContent += cssRule;
      fs.writeFileSync(PARTNERSHIP_CSS_FILE, cssContent);
      console.log(`   ✅ Added CSS rule for ${backgroundClass}`);
    } else {
      console.log(`   ℹ️  CSS rule for ${backgroundClass} already exists`);
    }
  } catch (error) {
    console.error(`   ⚠️  Error adding CSS: ${error.message}`);
  }
}

/**
 * Insert news entry at the beginning of news.ts
 */
function insertNewsEntry(newsEntry) {
  try {
    let newsContent = fs.readFileSync(NEWS_FILE_PATH, 'utf-8');

    // Format logos array
    const logosCode = newsEntry.logos.map(logo => `
      {
        src: '${logo.src}',
        alt: '${logo.alt.replace(/'/g, "\\'")}',
        href: '${logo.href}',
        class: '${logo.class}'
      }`).join(',');

    // Format the entry as TypeScript code
    const entryCode = `
  {
    title: '${newsEntry.title.replace(/'/g, "\\'")}',
    description: '${newsEntry.description.replace(/'/g, "\\'")}',
    partnershipTitle: '${newsEntry.partnershipTitle.replace(/'/g, "\\'")}',
    logos: [${logosCode}
    ],
    buttons: [
      {
        text: '${newsEntry.buttons[0].text}',
        href: '${newsEntry.buttons[0].href}',
        type: '${newsEntry.buttons[0].type}',
        target: '${newsEntry.buttons[0].target}',
        hasArrow: ${newsEntry.buttons[0].hasArrow}
      }
    ],
    backgroundClass: '${newsEntry.backgroundClass}'
  },`;

    // Find the newsItems array and insert at the beginning
    const newsItemsStart = newsContent.indexOf('export const newsItems: NewsItem[] = [');
    if (newsItemsStart === -1) {
      throw new Error('Could not find newsItems array in news.ts');
    }

    // Find the '[' that starts the array (after the '= ')
    const arrayStartMarker = '] = [';
    const arrayStart = newsContent.indexOf(arrayStartMarker, newsItemsStart);
    if (arrayStart === -1) {
      throw new Error('Could not find array start marker in news.ts');
    }
    const insertPosition = arrayStart + arrayStartMarker.length;
    newsContent = newsContent.slice(0, insertPosition) + entryCode + newsContent.slice(insertPosition);

    fs.writeFileSync(NEWS_FILE_PATH, newsContent);
    console.log('✅ Added news entry to news.ts');
  } catch (error) {
    console.error('Error inserting news entry:', error.message);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting Twitter partnership fetch...');
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

    // Process tweets
    let newPartnershipsCount = 0;
    const includes = timeline.includes || {};

    for (const tweet of timeline.data.data) {
      // Check if starts with "Partnership"
      if (!tweet.text.toLowerCase().startsWith('partnership')) {
        continue;
      }

      // Check if already processed
      if (processedData.processedTweetIds.includes(tweet.id)) {
        console.log(`⏭️  Tweet ${tweet.id} already processed, skipping`);
        continue;
      }

      console.log(`\n🎯 Found new partnership tweet: ${tweet.id}`);
      console.log(`   Text: ${tweet.text.substring(0, 80)}...`);

      // Extract image
      const { imageUrl, useFallback } = extractImageUrl(tweet, includes);
      let imagePath;

      if (useFallback) {
        imagePath = FALLBACK_IMAGE;
      } else {
        // Download image
        const filename = `partnership-${Date.now()}-${tweet.id}.jpg`;
        const filepath = path.join(NEWS_IMAGES_DIR, filename);
        imagePath = `/assets/images/news/${filename}`;

        console.log(`   📥 Downloading image...`);
        try {
          await downloadImage(imageUrl, filepath);
          console.log(`   ✅ Image saved: ${filename}`);
        } catch (error) {
          console.error(`   ⚠️  Failed to download image: ${error.message}`);
          console.log(`   📌 Using fallback image instead`);
          imagePath = FALLBACK_IMAGE;
        }
      }

      // Generate news entry
      const newsEntry = await generateNewsEntry(tweet, imagePath, client);

      // Add CSS for background image
      addPartnershipCSS(newsEntry.backgroundClass, newsEntry.backgroundImage);

      // Insert into news.ts
      insertNewsEntry(newsEntry);

      // Mark as processed
      processedData.processedTweetIds.push(tweet.id);
      newPartnershipsCount++;

      console.log(`   ✅ Added to news carousel`);
    }

    // Save state
    processedData.lastSuccess = new Date().toISOString();
    processedData.failureCount = 0;
    saveProcessedTweets(processedData);

    console.log(`\n✨ Completed successfully!`);
    console.log(`   New partnerships added: ${newPartnershipsCount}`);
    console.log(`   Total processed tweets: ${processedData.processedTweetIds.length}`);

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
