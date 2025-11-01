#!/bin/bash

# Crawl Webflow site and download all images

BASE_URL="https://bws-21ce3b.webflow.io"
OUTPUT_DIR="public/assets/images"

echo "Fetching main page..."
curl -s "$BASE_URL" > webflow_index.html

echo "Extracting image URLs..."

# Extract all image URLs from the HTML
grep -oE '(src|srcset|data-src|poster)="[^"]*\.(jpg|jpeg|png|gif|webp|svg)[^"]*"' webflow_index.html | \
  sed 's/.*="\([^"]*\)".*/\1/' | \
  sort -u > image_urls.txt

# Also extract from CSS url() patterns
grep -oE 'url\([^)]*\.(jpg|jpeg|png|gif|webp|svg)[^)]*\)' webflow_index.html | \
  sed 's/url(\([^)]*\))/\1/g' | \
  sed 's/["\x27]//g' | \
  sort -u >> image_urls.txt

# Extract from srcset (handle multiple URLs)
grep -oE 'srcset="[^"]*"' webflow_index.html | \
  sed 's/srcset="\([^"]*\)"/\1/' | \
  tr ',' '\n' | \
  sed 's/^ *//; s/ [0-9]*[wx]$//' | \
  grep -E '\.(jpg|jpeg|png|gif|webp|svg)' | \
  sort -u >> image_urls.txt

# Remove duplicates and empty lines
sort -u image_urls.txt | grep -v '^$' > unique_images.txt

echo "Found $(wc -l < unique_images.txt) unique images"

# Process each image URL
while IFS= read -r img_url; do
  # Handle relative and absolute URLs
  if [[ "$img_url" =~ ^https?:// ]]; then
    full_url="$img_url"
  elif [[ "$img_url" =~ ^// ]]; then
    full_url="https:$img_url"
  elif [[ "$img_url" =~ ^/ ]]; then
    full_url="$BASE_URL$img_url"
  else
    full_url="$BASE_URL/$img_url"
  fi

  echo "Processing: $full_url"

  # Determine local path based on URL structure
  if [[ "$full_url" =~ uploads-ssl\.webflow\.com/([a-f0-9]{24})/([^/]+)$ ]]; then
    # Webflow CDN pattern
    collection_id="${BASH_REMATCH[1]}"
    filename="${BASH_REMATCH[2]}"
    local_path="$OUTPUT_DIR/$collection_id/$filename"
  else
    # Extract path from URL
    local_path=$(echo "$full_url" | sed 's|https\?://[^/]*/||' | sed 's|^|public/|')
  fi

  # Create directory if needed
  mkdir -p "$(dirname "$local_path")"

  # Download if not exists
  if [ ! -f "$local_path" ]; then
    echo "  Downloading to: $local_path"
    curl -s -o "$local_path" "$full_url"
  else
    echo "  Already exists: $local_path"
  fi

done < unique_images.txt

echo "Download complete!"