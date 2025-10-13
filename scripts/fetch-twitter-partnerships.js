#!/usr/bin/env node

/**
 * Fetch Partnership Announcements from X (Twitter)
 *
 * This script fetches recent tweets from @BWSCommunity, filters for "Partnership"
 * announcements, extracts images, and adds them to the news carousel.
 */

import { TwitterApi } from 'twitter-api-v2';
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

  // Priority 1: Check main tweet media
  if (tweet.attachments?.media_keys && includes.media) {
    const imageMedia = includes.media.find(
      m => m.media_key === tweet.attachments.media_keys[0] && m.type === 'photo'
    );
    imageUrl = imageMedia?.url;
  }

  // Priority 2: Check referenced/quoted tweet
  if (!imageUrl && tweet.referenced_tweets && includes.tweets) {
    const quotedTweet = includes.tweets.find(
      t => tweet.referenced_tweets.some(ref => ref.id === t.id)
    );

    if (quotedTweet?.attachments?.media_keys && includes.media) {
      const imageMedia = includes.media.find(
        m => m.media_key === quotedTweet.attachments.media_keys[0] && m.type === 'photo'
      );
      imageUrl = imageMedia?.url;
    }
  }

  // Priority 3: Use fallback
  if (!imageUrl) {
    console.log(`⚠️  No image found for tweet ${tweet.id}, using fallback BWS logo`);
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
 * Clean tweet text for description
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
 * Generate news entry object
 */
function generateNewsEntry(tweet, imagePath) {
  const partnerName = extractPartnerName(tweet.text);
  const description = cleanTweetText(tweet.text);

  return {
    title: `Partnership: ${partnerName}`,
    description: description,
    partnershipTitle: partnerName,
    logos: [{
      src: imagePath,
      alt: `${partnerName} partnership`,
      href: `https://x.com/BWSCommunity/status/${tweet.id}`,
      class: 'image-partnership'
    }],
    buttons: [{
      text: 'View Announcement',
      href: `https://x.com/BWSCommunity/status/${tweet.id}`,
      type: 'secondary',
      target: '_blank',
      hasArrow: true
    }]
  };
}

/**
 * Insert news entry at the beginning of news.ts
 */
function insertNewsEntry(newsEntry) {
  try {
    let newsContent = fs.readFileSync(NEWS_FILE_PATH, 'utf-8');

    // Format the entry as TypeScript code
    const entryCode = `
  {
    title: '${newsEntry.title.replace(/'/g, "\\'")}',
    description: '${newsEntry.description.replace(/'/g, "\\'")}',
    partnershipTitle: '${newsEntry.partnershipTitle.replace(/'/g, "\\'")}',
    logos: [
      {
        src: '${newsEntry.logos[0].src}',
        alt: '${newsEntry.logos[0].alt.replace(/'/g, "\\'")}',
        href: '${newsEntry.logos[0].href}',
        class: '${newsEntry.logos[0].class}'
      }
    ],
    buttons: [
      {
        text: '${newsEntry.buttons[0].text}',
        href: '${newsEntry.buttons[0].href}',
        type: '${newsEntry.buttons[0].type}',
        target: '${newsEntry.buttons[0].target}',
        hasArrow: ${newsEntry.buttons[0].hasArrow}
      }
    ]
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
        'author_id'
      ],
      'tweet.fields': ['created_at', 'text'],
      'media.fields': ['url', 'preview_image_url', 'type', 'width', 'height']
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
      const newsEntry = generateNewsEntry(tweet, imagePath);

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
