#!/bin/bash
# Script to update root README.md after deployment completes
# Monitors deployment 20073234282 and updates documentation

WORKFLOW_ID="20073234282"
ROOT_README="../../README.md"

echo "Monitoring deployment ${WORKFLOW_ID}..."

while true; do
  STATUS=$(gh run view ${WORKFLOW_ID} --json status,conclusion --jq '{status, conclusion}')
  CURRENT_TIME=$(date '+%H:%M:%S')
  echo "[${CURRENT_TIME}] ${STATUS}"

  # Check if completed
  if echo "$STATUS" | grep -q '"status":"completed"'; then
    CONCLUSION=$(echo "$STATUS" | jq -r '.conclusion')
    echo "Deployment completed with conclusion: ${CONCLUSION}"

    if [ "$CONCLUSION" = "success" ]; then
      echo "✅ Deployment successful! Updating README.md..."

      # Verify live site has two-column layout
      LIVE_CHECK=$(curl -s https://www.bws.ninja/articles/esg-credits-2025-12-09.html | grep -c "grid-template-columns: 1fr 1fr")

      if [ "$LIVE_CHECK" -gt 0 ]; then
        echo "✅ Live site verified - two-column layout detected!"

        # Create backup
        cp "$ROOT_README" "${ROOT_README}.backup-$(date +%Y%m%d-%H%M%S)"

        # Add section 2.7 for Article Generation from X Posts
        # Insert after line 820 (before section 2.8)
        LINE_NUM=$(grep -n "^## 2.8 Partnership Announcements Fetch" "$ROOT_README" | cut -d: -f1)

        if [ -n "$LINE_NUM" ]; then
          # Create the new section content
          cat > /tmp/section-2.7.txt << 'EOF'
## 2.7 Article Generation from X Posts

**Workflow File**: `.github/workflows/generate-articles.yml`

**Overview**: ✅ **WORKING** - Automatically generates blog articles from @BWSCommunity product tweets using Claude AI (Sonnet 4.5), with rich documentation images and optimized layouts.

**Schedule**: Manually triggered via GitHub Actions

**Status**: ✅ Fully operational with two-column layout (Dec 9, 2025)

**Scripts Used**:
- `scripts/generate-articles.js` (article generation with Claude AI)
- `scripts/index-docs-site.js` (documentation image extraction)

**Strategy**: **AI-Powered Content Generation + GitBook Image Extraction**
1. Fetches recent tweets from @BWSCommunity X account
2. Identifies product-specific tweets (X Bot, ESG Credits, Fan Game Cube, Blockchain Badges, etc.)
3. Uses Claude AI (Sonnet 4.5) to generate comprehensive article content
4. Extracts product screenshots from docs.bws.ninja documentation
5. Generates Astro components with two-column grid layouts (image + intro paragraph)
6. Applies clearfix to prevent image overlap with styled sections
7. Commits generated articles and triggers deployment

**Key Features**:
- **Two-Column Layout**: Image on left (1fr), intro paragraph on right (1fr)
- **Documentation Images**: 149 product screenshots from docs.bws.ninja (77MB)
- **Image Overlap Prevention**: Clearfix before `.solution-advantages` sections
- **AI Content Quality**: Claude Sonnet 4.5 generates technically accurate content
- **Automated Deployment**: Triggers site rebuild after article generation

**Recent Success** (Dec 9, 2025):
- Generated 4 articles with two-column layouts
- Deployed to production successfully
- Workflow run: 20073234282
- Articles: esg-credits, blockchain-badges, fan-game-cube, x-bot

**Data Files**:
- Input: @BWSCommunity tweets, `public/docs-index.json` (1.5MB, 76 pages)
- Output: `src/components/articles/[Product][Date]MainContent.astro`
- Images: `public/assets/images/docs/[product]/` (149 images, 77MB total)
- Tracking: `scripts/data/processed-article-tweets.json`

**Documentation**:
- `.trees/xai-trackkols/ARTICLE_GENERATION_VERIFICATION_SUMMARY.md`
- `.trees/xai-trackkols/DEPLOYMENT_VERIFICATION_SUMMARY.md`
- `.trees/xai-trackkols/DOCUMENTATION_INDEXER_COMPLETION_SUMMARY.md`

---

EOF

          # Insert the new section before line 2.8
          head -n $((LINE_NUM - 1)) "$ROOT_README" > /tmp/readme-new.txt
          cat /tmp/section-2.7.txt >> /tmp/readme-new.txt
          tail -n +$LINE_NUM "$ROOT_README" >> /tmp/readme-new.txt

          # Replace original
          mv /tmp/readme-new.txt "$ROOT_README"

          echo "✅ README.md updated with section 2.7"
          echo "   Inserted at line $LINE_NUM (before section 2.8)"
        else
          echo "❌ Could not find section 2.8 in README.md"
          exit 1
        fi
      else
        echo "⚠️  Live site does not show two-column layout yet"
        echo "   Waiting for CDN cache to clear..."
        sleep 300  # Wait 5 minutes for CDN

        # Check again
        LIVE_CHECK=$(curl -s https://www.bws.ninja/articles/esg-credits-2025-12-09.html | grep -c "grid-template-columns: 1fr 1fr")
        if [ "$LIVE_CHECK" -gt 0 ]; then
          echo "✅ Live site verified after cache clear!"
        else
          echo "❌ Live site still not showing layout - manual verification needed"
          exit 1
        fi
      fi
    else
      echo "❌ Deployment failed with conclusion: ${CONCLUSION}"
      exit 1
    fi

    break
  fi

  sleep 60
done

echo "Script completed successfully"
