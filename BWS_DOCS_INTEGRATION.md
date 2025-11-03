# BWS Documentation Integration

## Overview

The KOL system has been updated to use the official BWS documentation (`scripts/data/docs-index.json`) as the source for product information instead of hardcoded data.

**IMPORTANT:** The system reads directly from `scripts/data/docs-index.json` in its original location. Do NOT copy or move this file. When the documentation crawler updates this file, the KOL system will automatically use the latest product information on the next run.

This ensures:

✅ **Accurate product descriptions** - Uses real documentation content
✅ **Comprehensive use cases** - Includes actual use cases from docs
✅ **Rich context for AI** - More detailed information for better reply generation
✅ **Automatic updates** - When docs are updated, KOL system uses latest info
✅ **Better product matching** - AI can better determine which product fits each tweet

## What Changed

### 1. New Product Loading Function
**File**: `scripts/kols/utils/kol-utils.js`

Added `loadBWSProducts()` function that:
- Reads `scripts/data/docs-index.json` from its original location
- Extracts all BWS products (Marketplace Solutions and Platform APIs)
- Structures product data with full documentation context
- Returns comprehensive product information

**File Path Resolution:**
```javascript
// Location: scripts/kols/utils/kol-utils.js
const DOCS_INDEX_PATH = path.join(__dirname, '..', '..', 'data', 'docs-index.json');
// Resolves to: scripts/data/docs-index.json

// This ensures the KOL system always reads from the master docs location
// When docs are updated, KOL system gets latest data automatically
```

**Products loaded:**
- Blockchain Badges
- ESG Credits
- Fan Game Cube (NFT Game Cube)
- X Bot
- NFT.zK
- Blockchain Hash
- Blockchain Save
- BWS IPFS

### 2. Configuration Update
**File**: `scripts/kols/config/kol-config.json`

**Before:**
```json
{
  "bwsProducts": {
    "X Bot": { "description": "...", "keywords": [...] },
    "Blockchain Badges": { ... }
  }
}
```

**After:**
```json
{
  "bwsProductsSource": "docs-index.json"
}
```

The hardcoded product information was removed and replaced with a reference to the docs source.

### 3. Enhanced AI Prompts
**File**: `scripts/kols/utils/claude-client.js`

**Tweet Evaluation** (`evaluateTweetForReply`):
- Now includes product category (Platform API vs Marketplace Solution)
- Uses actual use cases from documentation
- Provides richer context for relevance scoring

**Reply Generation** (`generateReplyText`):
- Includes implementation steps when available
- Uses comprehensive use case descriptions
- Links to actual documentation URLs

**Example prompt enhancement:**
```
Before: "X Bot: Automated community tracking"
After: "X Bot (Guide): X Bot is a Telegram-based analytics platform...
        Use Cases: Measure crypto project community engagement;
        Track KOL performance; Verify authentic traction
        Keywords: twitter analytics, telegram bot, engagement metrics..."
```

### 4. Updated Scripts

**evaluate-and-reply-kols.js:**
- Loads products using `loadBWSProducts()`
- Validates products are loaded before starting
- Passes product data to Claude for evaluation

**test-kol-system.js:**
- Added Test 1b: BWS Products Loading
- Validates products load correctly from docs
- Checks product data completeness

## Product Data Structure

Each product now contains:

```javascript
{
  name: "Product Name",
  url: "https://docs.bws.ninja/...",  // Actual doc URL
  category: "Marketplace Solution" | "Platform API" | "Guide",
  description: "Full description from docs",
  keywords: ["keyword1", "keyword2", ...],
  useCases: [
    "Use case 1 from docs",
    "Use case 2 from docs"
  ],
  implementationSteps: [
    { title: "Step 1", description: "..." }
  ],
  fullContent: "Complete doc page content",
  structuredContent: { headings: [...], paragraphs: [...] }
}
```

## Benefits for Reply Generation

### 1. Better Product Matching

Claude AI can now:
- Match tweets to products based on actual use cases
- Understand product categories (API vs Solution)
- Use keyword lists from documentation
- Consider implementation complexity

### 2. More Natural Replies

With richer context, replies can:
- Reference specific use cases relevant to the tweet
- Mention implementation approaches
- Provide documentation links
- Sound more informed and less generic

### 3. Accurate Information

All product information comes from:
- ✅ Official BWS documentation
- ✅ Real use cases
- ✅ Actual implementation steps
- ✅ Current product descriptions

No more maintaining duplicate information!

## Example: Before vs After

### Before (Hardcoded)
**Tweet**: "Looking for a way to issue digital certificates for our online courses"

**Product Info**: "Blockchain Badges: Verifiable digital credentials"

**Generated Reply**: "Have you checked out Blockchain Badges? It's great for credentials. https://www.bws.ninja/marketplace/blockchain-badges.html"

### After (From Docs)
**Tweet**: "Looking for a way to issue digital certificates for our online courses"

**Product Info**:
- Description: "Marketplace solution for issuing, managing, and verifying digital credentials on blockchain..."
- Use Cases: "Issue digital credentials for educational achievements; Verify professional certifications..."
- Keywords: blockchain badges, digital credentials, achievement recognition...

**Generated Reply**: "For educational certificates, check out BWS Blockchain Badges - it's designed specifically for issuing verifiable digital credentials on blockchain. Perfect for course certifications. Learn more: https://docs.bws.ninja/marketplace-solutions/bws.blockchain.badges"

## Testing

Run the test suite to validate:

```bash
node scripts/kols/test-kol-system.js
```

**Expected output:**
```
Test 1: Configuration Loading
   ✅ Configuration loaded successfully

Test 1b: BWS Products Loading from Docs
   ✅ Loaded 8 BWS products from docs-index.json
      Products: Blockchain Badges, ESG Credits, Fan Game Cube, X Bot, ...
   ✅ Products have complete documentation data
```

## Maintenance

### Updating Product Information

**Workflow:**
1. Update docs.bws.ninja content (your documentation site)
2. Run documentation crawler to regenerate `scripts/data/docs-index.json`
3. **KOL system automatically uses new content on next run** ✅ (no code changes needed!)

**How it works:**
```
docs.bws.ninja (updated)
    ↓
[Doc Crawler Script]
    ↓
scripts/data/docs-index.json (updated in place)
    ↓
KOL system reads on each run
    ↓
Latest product info used automatically ✅
```

**Important Notes:**
- ⚠️ Do NOT copy docs-index.json to scripts/kols/data/
- ✅ Always keep docs-index.json at `scripts/data/docs-index.json`
- ✅ The KOL system reads from this location every time it runs
- ✅ No restart or deployment needed - next workflow run uses latest data

### Adding New Products

When a new BWS product is added to docs:

1. Add to `relevantProducts` array in `kol-utils.js` (line ~48):
```javascript
const relevantProducts = [
  'Blockchain Badges',
  'ESG Credits',
  'Fan Game Cube',
  'X Bot',
  'NFT.zK',
  'Blockchain Hash',
  'Blockchain Save',
  'BWS IPFS',
  'Your New Product'  // Add here
];
```

2. Regenerate docs-index.json with new product page
3. Run tests to validate

## Migration Checklist

- [x] Add `loadBWSProducts()` to kol-utils.js
- [x] Update kol-config.json (remove hardcoded products)
- [x] Update claude-client.js (use richer product data)
- [x] Update evaluate-and-reply-kols.js (load from docs)
- [x] Update test-kol-system.js (test product loading)
- [x] Validate with test suite
- [ ] Test with actual KOL evaluation (dry run)
- [ ] Monitor reply quality after deployment

## Troubleshooting

### "No BWS products loaded"

**Cause**: `scripts/data/docs-index.json` not found or invalid

**Solution**:
```bash
# Check file exists at the correct location
ls -la scripts/data/docs-index.json

# Validate JSON structure
cat scripts/data/docs-index.json | jq '.pages[0]'

# Check file is readable
cat scripts/data/docs-index.json | jq '.productMapping'
```

**Common Issues:**
- ❌ File was moved/copied to wrong location
- ❌ File was deleted or renamed
- ❌ File has incorrect JSON syntax
- ✅ File should be at: `scripts/data/docs-index.json`

### Products missing fields

**Cause**: docs-index.json structure changed

**Solution**: Update `loadBWSProducts()` mapping in kol-utils.js

### AI not selecting right products

**Cause**: Keywords or use cases need refinement

**Solution**: Update docs.bws.ninja content with better keywords

## Future Enhancements

Possible improvements:

1. **Product Similarity Scoring** - Rank products by relevance
2. **Context-Aware Selection** - Consider conversation history
3. **Multi-Product Mentions** - Suggest multiple products when relevant
4. **Product Analytics** - Track which products get most mentions
5. **Dynamic Product Loading** - Reload products periodically without restart

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
