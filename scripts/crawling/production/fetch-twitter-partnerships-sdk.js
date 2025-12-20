#!/usr/bin/env node

/**
 * Fetch Partnership Announcements from X (Twitter) - SDK Version
 *
 * MIGRATED TO: BWS X SDK v1.6.0
 * This script fetches recent tweets from @BWSCommunity, filters for "Partnership"
 * announcements, extracts images, and adds them to the news carousel.
 * Uses Anthropic Claude API to generate concise summaries.
 *
 * Changes from original:
 * - ✅ Replaced TwitterApi with XTwitterClient
 * - ✅ Using getUserTweets() instead of userTimeline()
 * - ✅ Using getProfile() instead of userByUsername()
 * - ⚠️ Note: SDK provides normalized data, but Twitter API v2 is used in API mode
 *   to preserve full media expansion support (media URLs, referenced tweets, etc.)
 */

import { XTwitterClient } from '@blockchain-web-services/bws-x-sdk-node';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const worktreeRoot = path.resolve(__dirname, '../../..');
dotenv.config({ path: path.join(worktreeRoot, '.env') });

// Configuration
const TWITTER_USERNAME = 'BWSCommunity';
const MAX_TWEETS_TO_FETCH = 50;
const FALLBACK_IMAGE = '/assets/images/logos/bws-logo-violet-flying.png';
const PROCESSED_TWEETS_PATH = path.join(__dirname, 'data', 'processed-tweets.json');
const CRAWLER_ACCOUNTS_PATH = path.join(__dirname, '..', 'config', 'x-crawler-accounts.json');
const NEWS_FILE_PATH = path.join(__dirname, '..', '..', '..', 'src', 'data', 'news.ts');
const NEWS_IMAGES_DIR = path.join(__dirname, '..', '..', '..', 'public', 'assets', 'images', 'news');
const PARTNERSHIP_CSS_FILE = path.join(__dirname, '..', '..', '..', 'public', 'partnerships.css');

// Ensure directories exist
if (!fs.existsSync(NEWS_IMAGES_DIR)) {
  fs.mkdirSync(NEWS_IMAGES_DIR, { recursive: true });
}

/**
 * Load crawler accounts from config file
 */
function loadCrawlerAccounts() {
  try {
    if (!fs.existsSync(CRAWLER_ACCOUNTS_PATH)) {
      console.log('⚠️  No crawler accounts file found, will use API-only mode');
      return null;
    }

    const config = JSON.parse(fs.readFileSync(CRAWLER_ACCOUNTS_PATH, 'utf-8'));

    // Transform to SDK format
    const accounts = config.accounts.map(acc => ({
      id: acc.id,
      username: acc.username,
      cookies: {
        auth_token: acc.cookies.auth_token,
        ct0: acc.cookies.ct0,
        guest_id: acc.cookies.guest_id || ''
      },
      country: acc.country || 'us'
    }));

    console.log(`✅ Loaded ${accounts.length} crawler accounts from config file`);
    return { accounts, proxy: config.proxy };
  } catch (error) {
    console.error('⚠️  Error loading crawler accounts:', error.message);
    return null;
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
 * Extract image URL from tweet entities
 * SDK version: Works with normalized Tweet structure
 */
function extractImageUrl(tweet) {
  let imageUrl = null;
  let useFallback = false;

  console.log(`   🔍 Extracting image for tweet ${tweet.id}...`);

  // Check if tweet has media URLs in entities
  if (tweet.entities?.urls && tweet.entities.urls.length > 0) {
    console.log(`   🔗 Tweet has ${tweet.entities.urls.length} URL(s)`);

    // Look for image URLs (Twitter photos often appear as t.co links with expanded URLs)
    for (const urlEntity of tweet.entities.urls) {
      const expandedUrl = urlEntity.expanded_url || urlEntity.url;

      // Check if it's a photo URL
      if (expandedUrl.includes('/photo/') || expandedUrl.includes('pbs.twimg.com')) {
        console.log(`   ✅ Found potential image URL: ${expandedUrl.substring(0, 60)}...`);
        imageUrl = expandedUrl;
        break;
      }
    }
  }

  // Note: SDK in API mode provides access to underlying Twitter API response
  // which includes full media expansion. For now, we'll use fallback more often.
  // TODO: Enhance SDK to expose media URLs directly in Tweet.media field

  // Use fallback if no image found
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
      model: 'claude-sonnet-4-5-20250929',
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
 * Wrap partner name in description with rose-colored span
 */
function highlightPartnerName(description, partnerName) {
  if (!partnerName || partnerName === 'Partnership Announcement') {
    return description;
  }

  // Escape special regex characters in partner name
  const escapedName = partnerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Create case-insensitive regex to find partner name
  const regex = new RegExp(`\\b${escapedName}\\b`, 'gi');

  // Replace with span-wrapped version
  const highlighted = description.replace(regex, '<span class="partner-name">$&</span>');

  return highlighted;
}

/**
 * Fetch partner's X profile image
 * SDK version: Uses client.getProfile()
 */
async function fetchPartnerProfileImage(client, username) {
  try {
    if (!username) return null;

    console.log(`   🔍 Fetching profile image for @${username}...`);

    // SDK method: getProfile() returns normalized UserProfile
    const profile = await client.getProfile(username);

    if (profile?.profileImageUrl) {
      // Get the larger version (replace _normal with _400x400)
      const largeImageUrl = profile.profileImageUrl.replace('_normal', '_400x400');
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

  // Highlight partner name in description with rose color
  const highlightedDescription = highlightPartnerName(description, title);

  // Generate unique background class for this partnership
  const backgroundClass = `container-image-partnership-${tweet.id}`;

  // Fetch partner's profile image if we have their username
  let partnerProfileImage = null;
  if (xUsername) {
    partnerProfileImage = await fetchPartnerProfileImage(client, xUsername);
  }

  // Build logos array - only partner logo
  const logos = [];

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
    description: highlightedDescription,
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

/* Partnership logo styling - circle styling (like X profile pics), 20% smaller */
.image-partnership {
  border-radius: 50% !important;
  width: 64px !important;
  height: 64px !important;
  object-fit: cover !important;
  visibility: visible !important;
  opacity: 1 !important;
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
  console.log('🚀 Starting Twitter partnership fetch (SDK version)...');
  console.log(`📅 ${new Date().toISOString()}`);
  console.log(`📦 Using: BWS X SDK v1.6.0\n`);

  // Load processed tweets
  const processedData = loadProcessedTweets();
  processedData.lastCheck = new Date().toISOString();

  try {
    // Initialize SDK client (HYBRID mode - crawler first, API fallback)
    console.log('🔧 Initializing XTwitterClient...');

    // Load crawler accounts from config file
    const crawlerConfig = loadCrawlerAccounts();

    // Build configuration with hybrid mode for cost optimization
    const config = {
      mode: crawlerConfig ? 'hybrid' : 'api',  // Hybrid if crawler accounts available, otherwise API-only

      // Crawler accounts (from x-crawler-accounts.json)
      crawler: crawlerConfig ? {
        accounts: crawlerConfig.accounts
      } : undefined,

      // API fallback (when crawler fails or rate limited)
      api: {
        accounts: [{
          name: 'BWSCommunity',
          apiKey: process.env.TWITTER_API_KEY,
          apiSecret: process.env.TWITTER_API_SECRET,
          accessToken: process.env.TWITTER_ACCESS_TOKEN,
          accessSecret: process.env.TWITTER_ACCESS_SECRET
        }]
      },

      // Proxy for crawler mode (from config file or env vars)
      // NOTE: Proxy is DISABLED in GitHub Actions because direct access works better
      // Working scripts (discover-by-engagement-crawlee.js) use "WITHOUT proxy - direct access works on GitHub Actions"
      proxy: (crawlerConfig?.proxy?.enabled && !process.env.GITHUB_ACTIONS) ? {
        provider: crawlerConfig.proxy.provider,
        username: process.env.OXYLABS_USERNAME || crawlerConfig.proxy.username,
        password: process.env.OXYLABS_PASSWORD || crawlerConfig.proxy.password
      } : undefined,

      // Logging
      logging: {
        level: 'info'
      }
    };

    const client = new XTwitterClient(config);

    // Display what mode we're using
    const info = client.getInfo();
    console.log(`✅ SDK client initialized in ${info.mode} mode`);
    console.log(`   Has crawler: ${info.hasCrawler ? '✅ Yes' : '❌ No (will use API only)'}`);
    console.log(`   Has API: ${info.hasAPI ? '✅ Yes' : '❌ No'}`);
    console.log(`   Has proxy: ${info.hasProxy ? '✅ Yes' : '❌ No'}`);
    console.log('');

    // Fetch recent tweets using SDK
    console.log(`🔍 Fetching tweets from @${TWITTER_USERNAME}...`);
    console.log(`📥 Requesting last ${MAX_TWEETS_TO_FETCH} tweets...`);

    // SDK method: getUserTweets() - cleaner than userTimeline()
    const tweets = await client.getUserTweets(TWITTER_USERNAME, {
      maxResults: MAX_TWEETS_TO_FETCH,
      excludeReplies: false,  // Include replies in case partnerships are in replies
      excludeRetweets: true   // Exclude retweets
    });

    if (!tweets || tweets.length === 0) {
      console.log('ℹ️  No tweets found');
      processedData.lastSuccess = new Date().toISOString();
      saveProcessedTweets(processedData);
      return;
    }

    console.log(`📊 Found ${tweets.length} tweets`);

    // Process tweets
    let newPartnershipsCount = 0;

    for (const tweet of tweets) {
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
      const { imageUrl, useFallback } = extractImageUrl(tweet);
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
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
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
