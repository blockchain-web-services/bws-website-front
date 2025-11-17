# Important: File Locations

## docs-index.json Location

### ✅ CORRECT LOCATION
```
scripts/data/docs-index.json
```

**This file should:**
- ✅ Stay in `scripts/data/` directory
- ✅ Be updated by your documentation crawler
- ✅ Be read directly by the KOL system (not copied)
- ✅ Automatically provide latest product info to KOL system

### ❌ INCORRECT - Do NOT do this:
```
scripts/kols/data/docs-index.json  ← WRONG! Don't copy here
scripts/kols/docs-index.json       ← WRONG! Don't copy here
.trees/*/docs-index.json           ← WRONG! Don't copy here
```

## How It Works

### File Path Resolution

```javascript
// In: scripts/kols/utils/kol-utils.js
const __dirname = 'scripts/kols/utils/';

const DOCS_INDEX_PATH = path.join(__dirname, '..', '..', 'data', 'docs-index.json');
//                                              ↑     ↑      ↑
//                      scripts/kols/utils/ ──┘     │      │
//                      scripts/kols/ ──────────────┘      │
//                      scripts/data/docs-index.json ──────┘
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Documentation Site (docs.bws.ninja)                      │
│    - User updates product documentation                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Documentation Crawler Script                             │
│    - Crawls docs.bws.ninja                                  │
│    - Extracts product information                           │
│    - Generates: scripts/data/docs-index.json                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓ (file updated in place)
┌─────────────────────────────────────────────────────────────┐
│ 3. scripts/data/docs-index.json                             │
│    ✅ Lives here permanently                                 │
│    ✅ Updated by crawler                                     │
│    ✅ Read by KOL system                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓ (read on each run)
┌─────────────────────────────────────────────────────────────┐
│ 4. KOL System (scripts/kols/utils/kol-utils.js)            │
│    - loadBWSProducts() reads from scripts/data/             │
│    - Gets latest product information                         │
│    - No restart needed                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. KOL Reply Generation                                     │
│    - Uses latest product descriptions                        │
│    - Mentions correct use cases                             │
│    - Links to current documentation                          │
└─────────────────────────────────────────────────────────────┘
```

## Benefits of This Architecture

### ✅ Single Source of Truth
- One file location for documentation data
- Documentation crawler knows where to write
- KOL system knows where to read
- No confusion, no duplication

### ✅ Automatic Updates
- Update docs.bws.ninja → Crawler updates file → KOL system uses new data
- No manual copying required
- No code changes needed
- No deployments required

### ✅ No Stale Data
- KOL system reads fresh data every run
- Daily workflows get latest product info
- Reply generation always uses current descriptions

### ✅ Easy Maintenance
- Documentation team updates docs site
- Crawler runs and updates file
- KOL system automatically benefits
- Zero coordination required

## Directory Structure

```
project-root/
├── scripts/
│   ├── data/
│   │   ├── docs-index.json          ← MASTER FILE (read by KOL system)
│   │   ├── processed-tweets.json    ← Other data files
│   │   └── ...
│   │
│   └── kols/
│       ├── config/
│       │   └── kol-config.json
│       ├── data/
│       │   ├── .gitkeep
│       │   ├── kols-data.json       ← KOL database
│       │   ├── kol-replies.json     ← Reply history
│       │   └── ...                  ← KOL system data only
│       ├── utils/
│       │   ├── kol-utils.js         ← Reads ../../data/docs-index.json
│       │   ├── twitter-client.js
│       │   └── claude-client.js
│       ├── discover-kols.js
│       ├── evaluate-and-reply-kols.js
│       └── ...
│
└── .env
```

## Verification Commands

### Check file is in correct location
```bash
ls -la scripts/data/docs-index.json
# Should show the file with recent timestamp
```

### Verify KOL system can read it
```bash
node scripts/kols/test-kol-system.js
# Should pass: "Test 1b: BWS Products Loading from Docs"
```

### Check product count
```bash
cat scripts/data/docs-index.json | jq '.pages | length'
# Should show number of doc pages (typically 14+)
```

### List products loaded by KOL system
```bash
node -e "import('./scripts/kols/utils/kol-utils.js').then(m => {
  const products = m.loadBWSProducts();
  console.log('Products loaded:', Object.keys(products).join(', '));
})"
# Should show: Blockchain Badges, ESG Credits, Fan Game Cube, X Bot, etc.
```

## Troubleshooting

### Issue: "No BWS products loaded"

**Check 1:** File exists
```bash
ls -la scripts/data/docs-index.json
```

**Check 2:** File is valid JSON
```bash
cat scripts/data/docs-index.json | jq . > /dev/null && echo "Valid JSON" || echo "Invalid JSON"
```

**Check 3:** File has product data
```bash
cat scripts/data/docs-index.json | jq '.pages[0].product'
# Should show a product name
```

### Issue: Products seem outdated

**Solution:** Re-run documentation crawler
```bash
# Your crawler command here
# Example: node scripts/crawl-docs.js

# Then verify
cat scripts/data/docs-index.json | jq '.lastCrawl'
# Should show recent timestamp
```

### Issue: File was moved/copied

**Solution:** Move it back to correct location
```bash
# If file was moved to wrong location:
mv scripts/kols/data/docs-index.json scripts/data/docs-index.json

# Verify KOL system can find it:
node scripts/kols/test-kol-system.js
```

## Summary

**Remember:**
- 📍 **Location:** `scripts/data/docs-index.json`
- 🚫 **Don't:** Copy or move this file
- ✅ **Do:** Let documentation crawler update it in place
- 🔄 **Result:** KOL system always uses latest product info

---

🤖 This architecture ensures the KOL system always has current, accurate product information without any manual intervention.
