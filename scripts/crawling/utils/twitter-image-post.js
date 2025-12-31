#!/usr/bin/env node

/**
 * Twitter Image Posting Utility
 *
 * Posts tweets with attached images using Twitter API v2.
 * Handles media upload and tweet creation in a single operation.
 *
 * Features:
 * - Uploads images to Twitter
 * - Creates tweet with attached media
 * - Supports multiple images (up to 4)
 * - Error handling and retry logic
 */

import fs from 'fs';
import path from 'path';
import { createReadWriteClient } from './twitter-client.js';

/**
 * Upload image to Twitter and get media ID
 *
 * @param {Object} client - Twitter API client
 * @param {string} imagePath - Path to image file
 * @returns {Promise<string>} Media ID
 */
async function uploadImage(client, imagePath) {
  console.log(`📤 Uploading image: ${path.basename(imagePath)}...`);

  // Read image file
  const imageBuffer = fs.readFileSync(imagePath);
  const fileStats = fs.statSync(imagePath);
  const fileSizeKB = (fileStats.size / 1024).toFixed(2);

  console.log(`   File size: ${fileSizeKB} KB`);

  // Determine MIME type from file extension
  const ext = path.extname(imagePath).toLowerCase();
  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };

  const mimeType = mimeTypes[ext] || 'image/png';
  console.log(`   MIME type: ${mimeType}`);

  try {
    // Upload media using v1.1 API (required for media uploads)
    const mediaId = await client.v1.uploadMedia(imageBuffer, {
      mimeType,
      target: 'tweet'  // Specify this is for tweeting
    });

    console.log(`   ✅ Upload successful (Media ID: ${mediaId})`);
    return mediaId;

  } catch (error) {
    console.error(`   ❌ Upload failed: ${error.message}`);
    throw error;
  }
}

/**
 * Post a tweet with image(s) attached
 *
 * @param {string} tweetText - The tweet text content
 * @param {string|string[]} imagePaths - Path(s) to image file(s) (max 4 images)
 * @param {Object} options - Additional options
 * @param {boolean} options.useFallback - Use @BWSCommunity account instead of @BWSXAI
 * @param {string} options.replyToTweetId - If provided, post as a reply to this tweet
 * @returns {Promise<Object>} Tweet creation response
 */
async function postTweetWithImage(tweetText, imagePaths, options = {}) {
  const {
    useFallback = false,
    replyToTweetId = null
  } = options;

  console.log('\n🐦 Posting tweet with image(s)...\n');
  console.log(`Account: ${useFallback ? '@BWSCommunity' : '@BWSXAI'}`);
  console.log(`Text: ${tweetText.substring(0, 100)}${tweetText.length > 100 ? '...' : ''}`);
  console.log(`Length: ${tweetText.length} characters`);

  // Normalize imagePaths to array
  const imagePathsArray = Array.isArray(imagePaths) ? imagePaths : [imagePaths];

  // Validate image count (Twitter allows max 4 images per tweet)
  if (imagePathsArray.length > 4) {
    throw new Error('Twitter allows maximum 4 images per tweet');
  }

  console.log(`Images: ${imagePathsArray.length} file(s)`);

  // Validate all image files exist
  for (const imagePath of imagePathsArray) {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }
  }

  // Create Twitter client
  const { client, accountName } = createReadWriteClient(useFallback);

  try {
    // Upload all images and collect media IDs
    const mediaIds = [];

    for (const imagePath of imagePathsArray) {
      const mediaId = await uploadImage(client, imagePath);
      mediaIds.push(mediaId);
    }

    console.log(`\n✅ All images uploaded successfully`);
    console.log(`   Media IDs: ${mediaIds.join(', ')}\n`);

    // Create tweet with media attached
    console.log('📤 Creating tweet...');

    const tweetPayload = {
      text: tweetText,
      media: {
        media_ids: mediaIds
      }
    };

    // Add reply reference if provided
    if (replyToTweetId) {
      tweetPayload.reply = {
        in_reply_to_tweet_id: replyToTweetId
      };
      console.log(`   Replying to tweet: ${replyToTweetId}`);
    }

    const response = await client.v2.tweet(tweetPayload);

    if (response.data && response.data.id) {
      const tweetId = response.data.id;
      const tweetUrl = `https://twitter.com/${accountName}/status/${tweetId}`;

      console.log(`\n✅ Tweet posted successfully!`);
      console.log(`   Tweet ID: ${tweetId}`);
      console.log(`   URL: ${tweetUrl}`);

      return {
        success: true,
        tweetId,
        tweetUrl,
        accountName,
        mediaIds,
        text: tweetText
      };
    } else {
      throw new Error('Twitter API returned no tweet ID');
    }

  } catch (error) {
    console.error(`\n❌ Failed to post tweet with image: ${error.message}`);

    // Check for specific error types
    if (error.code === 403) {
      console.error('   Error: Account may not have permission to post tweets');
    } else if (error.code === 401) {
      console.error('   Error: Authentication failed - check credentials');
    } else if (error.code === 400) {
      console.error('   Error: Bad request - check tweet content and media');
    }

    throw error;
  }
}

/**
 * Post a tweet with a single image (convenience function)
 *
 * @param {string} tweetText - The tweet text content
 * @param {string} imagePath - Path to image file
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Tweet creation response
 */
async function postTweetWithSingleImage(tweetText, imagePath, options = {}) {
  return postTweetWithImage(tweetText, imagePath, options);
}

// If run directly (not imported), execute with command-line arguments
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: node twitter-image-post.js <tweet-text> <image-path> [--fallback] [--reply <tweet-id>]');
    console.error('');
    console.error('Examples:');
    console.error('  node twitter-image-post.js "Check out this cool image!" ./screenshot.png');
    console.error('  node twitter-image-post.js "Using fallback account" ./img.png --fallback');
    console.error('  node twitter-image-post.js "Reply with image" ./img.png --reply 1234567890');
    process.exit(1);
  }

  const tweetText = args[0];
  const imagePath = args[1];

  const options = {};

  // Parse additional flags
  if (args.includes('--fallback')) {
    options.useFallback = true;
  }

  const replyIndex = args.indexOf('--reply');
  if (replyIndex !== -1 && args[replyIndex + 1]) {
    options.replyToTweetId = args[replyIndex + 1];
  }

  postTweetWithSingleImage(tweetText, imagePath, options)
    .then(result => {
      console.log('\n📄 Result:');
      console.log(JSON.stringify(result, null, 2));
      process.exit(0);
    })
    .catch(error => {
      console.error('\nFatal error:', error);
      process.exit(1);
    });
}

export { postTweetWithImage, postTweetWithSingleImage, uploadImage };
export default postTweetWithImage;
