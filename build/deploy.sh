#!/bin/bash

# Deploy script for GitHub Pages
# This script builds the site and deploys it to the gh-pages branch

set -e

echo "🚀 Starting deployment to GitHub Pages..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}✖ Not a git repository${NC}"
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $CURRENT_BRANCH"

# Build the site
echo -e "${YELLOW}🔨 Building the site...${NC}"
node scripts/build.js

if [ ! -d "_site" ]; then
    echo -e "${RED}✖ Build failed: _site directory not found${NC}"
    exit 1
fi

# Check if gh-pages branch exists
if git show-ref --verify --quiet refs/heads/gh-pages; then
    echo "gh-pages branch exists"
else
    echo "Creating gh-pages branch..."
    git checkout --orphan gh-pages
    git rm -rf .
    git commit --allow-empty -m "Initial gh-pages commit"
    git checkout $CURRENT_BRANCH
fi

# Create temporary directory for deployment
TEMP_DIR=$(mktemp -d)
echo "Using temp directory: $TEMP_DIR"

# Copy built site to temp directory
cp -r _site/* $TEMP_DIR/

# Switch to gh-pages branch
echo -e "${YELLOW}Switching to gh-pages branch...${NC}"
git checkout gh-pages

# Clean current directory (except .git)
find . -maxdepth 1 ! -name '.git' ! -name '.' ! -name '..' -exec rm -rf {} +

# Copy built site from temp directory
cp -r $TEMP_DIR/* .

# Remove temp directory
rm -rf $TEMP_DIR

# Add all files
git add -A

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo -e "${YELLOW}No changes to deploy${NC}"
    git checkout $CURRENT_BRANCH
    exit 0
fi

# Commit changes
COMMIT_MESSAGE="Deploy to GitHub Pages from $CURRENT_BRANCH at $(date +"%Y-%m-%d %H:%M:%S")"
echo "Committing: $COMMIT_MESSAGE"
git commit -m "$COMMIT_MESSAGE"

# Push to GitHub
echo -e "${YELLOW}Pushing to GitHub...${NC}"
git push origin gh-pages

# Switch back to original branch
git checkout $CURRENT_BRANCH

echo -e "${GREEN}✅ Deployment successful!${NC}"
echo ""
echo "Your site will be available at:"
echo "  https://<username>.github.io/<repository-name>/"
echo "  or https://www.bws.ninja (if CNAME is configured)"
echo ""
echo "Note: It may take a few minutes for changes to appear."