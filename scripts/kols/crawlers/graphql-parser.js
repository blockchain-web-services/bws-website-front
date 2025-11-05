/**
 * GraphQL Parser for Twitter/X API Responses
 * Parses Twitter's internal GraphQL API responses captured via network interception
 */

/**
 * Parse individual tweet from GraphQL data
 */
export function parseTweet(tweetData) {
  if (!tweetData) return null;

  const legacy = tweetData.legacy || {};
  const core = tweetData.core || {};

  return {
    id: tweetData.rest_id,
    text: legacy.full_text || '',
    author_id: legacy.user_id_str,
    created_at: legacy.created_at,
    public_metrics: {
      like_count: legacy.favorite_count || 0,
      retweet_count: legacy.retweet_count || 0,
      reply_count: legacy.reply_count || 0,
      quote_count: legacy.quote_count || 0,
      impression_count: tweetData.views?.count ? parseInt(tweetData.views.count) : 0
    },
    // Additional fields
    conversation_id: legacy.conversation_id_str,
    lang: legacy.lang,
    possibly_sensitive: legacy.possibly_sensitive,
    // Metadata
    entities: legacy.entities,
    source: tweetData.source
  };
}

/**
 * Parse user profile from GraphQL response
 */
export function parseUserProfile(graphqlResponse) {
  try {
    const user = graphqlResponse?.data?.user?.result || {};

    // Handle "User not found" case
    if (user.__typename === 'UserUnavailable' || !user.rest_id) {
      return null;
    }

    const legacy = user.legacy || {};

    return {
      id: user.rest_id,
      username: legacy.screen_name,
      name: legacy.name,
      description: legacy.description || '',
      public_metrics: {
        followers_count: legacy.followers_count || 0,
        following_count: legacy.friends_count || 0,
        tweet_count: legacy.statuses_count || 0,
        listed_count: legacy.listed_count || 0
      },
      verified: user.is_blue_verified || legacy.verified || false,
      created_at: legacy.created_at,
      profile_image_url: legacy.profile_image_url_https,
      profile_banner_url: legacy.profile_banner_url,
      url: legacy.url,
      location: legacy.location,
      // Additional metadata
      protected: legacy.protected,
      verified_type: user.verified_type
    };
  } catch (error) {
    console.error('Error parsing user profile:', error.message);
    return null;
  }
}

/**
 * Parse search results from GraphQL response
 */
export function parseSearchResults(graphqlResponse) {
  try {
    // Try multiple possible paths for search results
    let instructions = null;

    // Path 1: Original path
    if (graphqlResponse?.data?.search_by_raw_query?.search_timeline?.timeline?.instructions) {
      instructions = graphqlResponse.data.search_by_raw_query.search_timeline.timeline.instructions;
      console.log('   📍 Found search data at: data.search_by_raw_query.search_timeline.timeline.instructions');
    }
    // Path 2: Alternative search timeline path
    else if (graphqlResponse?.data?.search?.search_timeline?.timeline?.instructions) {
      instructions = graphqlResponse.data.search.search_timeline.timeline.instructions;
      console.log('   📍 Found search data at: data.search.search_timeline.timeline.instructions');
    }
    // Path 3: Direct timeline path
    else if (graphqlResponse?.data?.timeline?.instructions) {
      instructions = graphqlResponse.data.timeline.instructions;
      console.log('   📍 Found search data at: data.timeline.instructions');
    }
    // Path 4: Search timeline without raw query
    else if (graphqlResponse?.data?.search_timeline?.timeline?.instructions) {
      instructions = graphqlResponse.data.search_timeline.timeline.instructions;
      console.log('   📍 Found search data at: data.search_timeline.timeline.instructions');
    }

    // Debug: Log the actual structure if we didn't find instructions
    if (!instructions) {
      console.log('   ⚠️  Could not find instructions in GraphQL response');

      // Try to identify what paths exist
      if (graphqlResponse?.data) {
        const topLevelKeys = Object.keys(graphqlResponse.data);
        console.log('   📊 Available top-level data keys:', topLevelKeys);

        // Try recursive search for tweet data
        const foundTweets = recursivelyFindTweets(graphqlResponse);
        if (foundTweets.length > 0) {
          console.log(`   ✅ Found ${foundTweets.length} tweets via recursive search`);
          return foundTweets;
        }
      }

      return [];
    }

    const tweets = [];

    for (const instruction of instructions) {
      if (instruction.type === 'TimelineAddEntries') {
        for (const entry of instruction.entries || []) {
          // Tweet entries
          if (entry.content?.itemContent?.tweet_results?.result) {
            const tweet = parseTweet(entry.content.itemContent.tweet_results.result);
            if (tweet) tweets.push(tweet);
          }

          // Module entries (promoted tweets, etc.)
          if (entry.content?.items) {
            for (const item of entry.content.items) {
              if (item.item?.itemContent?.tweet_results?.result) {
                const tweet = parseTweet(item.item.itemContent.tweet_results.result);
                if (tweet) tweets.push(tweet);
              }
            }
          }
        }
      }
    }

    return tweets;
  } catch (error) {
    console.error('Error parsing search results:', error.message);
    console.error('Stack:', error.stack);
    return [];
  }
}

/**
 * Recursively search for tweet data in GraphQL response
 * Fallback when standard paths don't work
 */
function recursivelyFindTweets(obj, depth = 0, maxDepth = 10) {
  if (depth > maxDepth || !obj || typeof obj !== 'object') return [];

  const tweets = [];

  // Check if this object looks like a tweet
  if (obj.rest_id && obj.legacy?.full_text) {
    const tweet = parseTweet(obj);
    if (tweet) tweets.push(tweet);
  }

  // Check if this object has tweet_results.result
  if (obj.tweet_results?.result) {
    const tweet = parseTweet(obj.tweet_results.result);
    if (tweet) tweets.push(tweet);
  }

  // Recurse into arrays and objects
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      for (const item of obj[key]) {
        tweets.push(...recursivelyFindTweets(item, depth + 1, maxDepth));
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      tweets.push(...recursivelyFindTweets(obj[key], depth + 1, maxDepth));
    }
  }

  return tweets;
}

/**
 * Parse following list from GraphQL response
 */
export function parseFollowingList(graphqlResponse) {
  try {
    const instructions = graphqlResponse?.data?.user?.result?.timeline?.timeline?.instructions || [];
    const users = [];

    for (const instruction of instructions) {
      if (instruction.type === 'TimelineAddEntries') {
        for (const entry of instruction.entries || []) {
          // User entries
          if (entry.content?.itemContent?.user_results?.result) {
            const userResult = entry.content.itemContent.user_results.result;
            const user = parseUserProfile({ data: { user: { result: userResult } } });
            if (user) users.push(user);
          }
        }
      }
    }

    return users;
  } catch (error) {
    console.error('Error parsing following list:', error.message);
    return [];
  }
}

/**
 * Parse user tweets from GraphQL response
 */
export function parseUserTweets(graphqlResponse) {
  try {
    const instructions = graphqlResponse?.data?.user?.result?.timeline_v2?.timeline?.instructions ||
                        graphqlResponse?.data?.user?.result?.timeline?.timeline?.instructions || [];
    const tweets = [];

    for (const instruction of instructions) {
      if (instruction.type === 'TimelineAddEntries') {
        for (const entry of instruction.entries || []) {
          // Tweet entries
          if (entry.content?.itemContent?.tweet_results?.result) {
            const tweet = parseTweet(entry.content.itemContent.tweet_results.result);
            if (tweet) tweets.push(tweet);
          }

          // Module entries
          if (entry.content?.items) {
            for (const item of entry.content.items) {
              if (item.item?.itemContent?.tweet_results?.result) {
                const tweet = parseTweet(item.item.itemContent.tweet_results.result);
                if (tweet) tweets.push(tweet);
              }
            }
          }
        }
      }
    }

    return tweets;
  } catch (error) {
    console.error('Error parsing user tweets:', error.message);
    return [];
  }
}

/**
 * Extract cursor for pagination
 */
export function extractCursor(graphqlResponse, cursorType = 'Bottom') {
  try {
    const instructions = graphqlResponse?.data?.search_by_raw_query?.search_timeline?.timeline?.instructions ||
                        graphqlResponse?.data?.user?.result?.timeline?.timeline?.instructions ||
                        graphqlResponse?.data?.user?.result?.timeline_v2?.timeline?.instructions || [];

    for (const instruction of instructions) {
      if (instruction.type === 'TimelineAddEntries') {
        for (const entry of instruction.entries || []) {
          if (entry.content?.cursorType === cursorType && entry.content?.value) {
            return entry.content.value;
          }
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error extracting cursor:', error.message);
    return null;
  }
}

export default {
  parseTweet,
  parseUserProfile,
  parseSearchResults,
  parseFollowingList,
  parseUserTweets,
  extractCursor
};
