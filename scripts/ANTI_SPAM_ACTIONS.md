# Anti-Spam Actions for Reply System

## 📋 Overview

To reduce spam detection and make @BWSXAI appear more like a genuine human account, the reply system now automatically performs "social engagement actions" before posting replies:

1. **Like the original tweet** - Shows appreciation for the content
2. **Follow the KOL** - Builds genuine connections

These actions signal to Twitter that the account is engaging authentically, not just dropping promotional replies.

## ✅ Benefits

- **Reduced spam detection**: Accounts that like and follow are less likely to be flagged
- **Natural behavior**: Mimics how real users interact on Twitter
- **Relationship building**: Following KOLs creates potential for ongoing engagement
- **Better deliverability**: Replies from followed accounts get better visibility

## ⚙️ Configuration

Located in `scripts/kols/config/kol-config.json`:

```json
"replySettings": {
  "antiSpamActions": {
    "followKolBeforeReply": true,
    "likeTweetBeforeReply": true,
    "onlyIfNotAlreadyFollowing": true,
    "skipOnError": true
  }
}
```

### Configuration Options

| Setting | Default | Description |
|---------|---------|-------------|
| `followKolBeforeReply` | `true` | Follow the KOL before replying to their tweet |
| `likeTweetBeforeReply` | `true` | Like the original tweet before replying |
| `onlyIfNotAlreadyFollowing` | `true` | Only follow if not already following (future enhancement) |
| `skipOnError` | `true` | Continue with reply even if follow/like fails |

## 🔧 Implementation

### New Functions Added

**`scripts/kols/utils/twitter-client.js`**:

```javascript
// Follow a user
export async function followUser(client, userId)

// Like a tweet
export async function likeTweet(client, tweetId)
```

### Workflow

```
1. Evaluate tweet for reply suitability ✓
2. Generate reply text with Claude ✓
3. 👍 LIKE the original tweet (NEW)
4. 👤 FOLLOW the KOL (NEW)
5. ⏸️  Wait 2 seconds
6. 💬 Post the reply
7. ⏸️  Wait 2 minutes before next reply
```

### Error Handling

- **`skipOnError: true`** (default): If follow/like fails, continue with reply
- **`skipOnError: false`**: If follow/like fails, abort the reply

This prevents a failed like/follow from blocking important replies.

## 📊 Example Output

```
🎯 Tweet 3 from @CryptoRover matches: X Bot (85% relevance)
   💬 Reply: "X Bot's automated tracking can save hours..."
   Tone: informative

   👍 Liking original tweet...
   ✅ Liked tweet successfully

   👤 Following @CryptoRover...
   ✅ Followed successfully

   ✅ Posted successfully!
   🔗 https://twitter.com/bws_official/status/1234567890
```

## ⚠️ Rate Limits

Both actions consume Twitter API quota:

| Action | Limit (Basic Tier) | Consumed Per Reply |
|--------|-------------------|--------------------|
| Like Tweet | 1,000 / 24 hours | 1 |
| Follow User | 400 / 24 hours | 1 |
| Post Reply | 100 / 24 hours | 1 |

**Current Reply Limit**: 15 replies/day
- **Likes consumed**: 15/day (1.5% of quota)
- **Follows consumed**: 15/day (3.75% of quota)

Very safe margins - no risk of hitting limits.

## 🎯 Best Practices

### When to Enable

✅ **Enable for production** - These actions improve deliverability
✅ **Enable for established KOLs** - Building relationships with influencers
✅ **Enable for organic growth** - Natural account behavior

### When to Disable

❌ **Disable for testing** - Save API quota during development
❌ **Disable if quota limited** - If approaching Twitter API limits
❌ **Disable if following too many** - Twitter has 5,000 following limit

## 📈 Tracking

Actions are tracked via the API tracker:

```javascript
apiTracker.recordCall('users/follow', 1, true);
apiTracker.recordCall('tweets/like', 1, true);
```

View usage with:
```bash
node view-api-usage.js
```

## 🔄 Future Enhancements

- [ ] Check if already following before attempting (save API calls)
- [ ] Track follow/like success rates
- [ ] Unfollow inactive/unresponsive accounts after 30 days
- [ ] Smart follow limits (don't exceed 5,000 following)
- [ ] Retweet high-quality KOL content occasionally

## 🚫 What We DON'T Do

- ❌ Follow/unfollow spam (no automatic unfollowing)
- ❌ Like unrelated content (only tweets we reply to)
- ❌ Mass following (only 15/day with replies)
- ❌ Fake engagement (only genuine reply-worthy content)

## 🎭 The Human Touch

These actions make @BWSXAI behave like a real person:

**Without anti-spam actions**:
```
[New account] → [Drops reply] → [Never interacts again]
Twitter: "This looks like spam 🚨"
```

**With anti-spam actions**:
```
[Reads tweet] → [Likes it 👍] → [Follows author 👤] → [Leaves thoughtful comment 💬]
Twitter: "This looks like genuine engagement ✅"
```

---

**Implemented**: 2025-11-11
**Status**: ✅ Active in production
**Impact**: Improved spam detection scores, better reply deliverability
