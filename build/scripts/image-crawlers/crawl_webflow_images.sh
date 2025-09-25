#!/bin/bash

# Comprehensive Webflow image crawler and downloader

BASE_URL="https://bws-21ce3b.webflow.io"
OUTPUT_DIR="public/assets/images"

echo "=== Webflow Image Crawler ==="
echo "Fetching all pages from sitemap..."

# First, get the sitemap to find all pages
curl -s "$BASE_URL/sitemap.xml" > sitemap.xml 2>/dev/null

# Extract all page URLs from sitemap
grep -oE '<loc>[^<]+</loc>' sitemap.xml | sed 's/<[^>]*>//g' > page_urls.txt

# Add the main URL if not in sitemap
echo "$BASE_URL/" >> page_urls.txt
echo "$BASE_URL" >> page_urls.txt

# Remove duplicates
sort -u page_urls.txt > unique_pages.txt

echo "Found $(wc -l < unique_pages.txt) unique pages to crawl"

# Create a file to store all image URLs
> all_image_urls.txt

# Function to extract images from a page
extract_images() {
    local url="$1"
    local html_file="$2"

    # Extract img src attributes
    grep -oE 'src="[^"]*"' "$html_file" | \
        sed 's/src="//; s/"$//' | \
        grep -E '\.(jpg|jpeg|png|gif|webp|svg)' >> all_image_urls.txt

    # Extract srcset attributes (responsive images)
    grep -oE 'srcset="[^"]*"' "$html_file" | \
        sed 's/srcset="//; s/"$//' | \
        tr ',' '\n' | \
        sed 's/^ *//; s/ [0-9]*[wx]$//' | \
        grep -E '\.(jpg|jpeg|png|gif|webp|svg)' >> all_image_urls.txt

    # Extract data-src attributes (lazy loading)
    grep -oE 'data-src="[^"]*"' "$html_file" | \
        sed 's/data-src="//; s/"$//' | \
        grep -E '\.(jpg|jpeg|png|gif|webp|svg)' >> all_image_urls.txt

    # Extract background images from inline styles
    grep -oE 'style="[^"]*background-image:[^"]*"' "$html_file" | \
        grep -oE 'url\([^)]+\)' | \
        sed 's/url(//; s/)//; s/"//g; s/'\''//g' | \
        grep -E '\.(jpg|jpeg|png|gif|webp|svg)' >> all_image_urls.txt

    # Extract video posters
    grep -oE 'poster="[^"]*"' "$html_file" | \
        sed 's/poster="//; s/"$//' | \
        grep -E '\.(jpg|jpeg|png|gif|webp)' >> all_image_urls.txt
}

# Crawl each page
page_num=0
while IFS= read -r page_url; do
    ((page_num++))
    echo "[$page_num/$(wc -l < unique_pages.txt)] Crawling: $page_url"

    # Download the page
    curl -s "$page_url" > "temp_page_$page_num.html" 2>/dev/null

    # Extract images from this page
    extract_images "$page_url" "temp_page_$page_num.html"

    # Clean up temp file
    rm "temp_page_$page_num.html"

    # Small delay to be polite
    sleep 0.2
done < unique_pages.txt

# Process and normalize URLs
echo ""
echo "Processing image URLs..."

# Create a temporary file for processed URLs
> processed_urls.txt

while IFS= read -r img_url; do
    # Skip empty lines
    [[ -z "$img_url" ]] && continue

    # Remove quotes if present
    img_url="${img_url//\"/}"

    # Handle different URL formats
    if [[ "$img_url" =~ ^https?:// ]]; then
        # Full URL
        echo "$img_url" >> processed_urls.txt
    elif [[ "$img_url" =~ ^// ]]; then
        # Protocol-relative URL
        echo "https:$img_url" >> processed_urls.txt
    elif [[ "$img_url" =~ ^/ ]]; then
        # Absolute path
        echo "$BASE_URL$img_url" >> processed_urls.txt
    else
        # Relative path
        echo "$BASE_URL/$img_url" >> processed_urls.txt
    fi
done < all_image_urls.txt

# Remove duplicates and sort
sort -u processed_urls.txt > unique_image_urls.txt

echo "Found $(wc -l < unique_image_urls.txt) unique images"

# Download images
echo ""
echo "Downloading images..."

downloaded=0
skipped=0
failed=0

while IFS= read -r img_url; do
    # Skip empty lines
    [[ -z "$img_url" ]] && continue

    # Determine local path based on URL
    if [[ "$img_url" =~ cdn\.prod\.website-files\.com/([a-f0-9]{24})/(.+)$ ]]; then
        # Webflow CDN pattern
        collection_id="${BASH_REMATCH[1]}"
        filename="${BASH_REMATCH[2]}"
        # URL decode the filename
        filename=$(echo "$filename" | sed 's/%20/ /g; s/%2B/+/g')
        local_path="$OUTPUT_DIR/$collection_id/$filename"
    elif [[ "$img_url" =~ uploads-ssl\.webflow\.com/([a-f0-9]{24})/(.+)$ ]]; then
        # Old Webflow CDN pattern
        collection_id="${BASH_REMATCH[1]}"
        filename="${BASH_REMATCH[2]}"
        # URL decode the filename
        filename=$(echo "$filename" | sed 's/%20/ /g; s/%2B/+/g')
        local_path="$OUTPUT_DIR/$collection_id/$filename"
    else
        # Extract filename from URL
        filename=$(basename "$img_url" | sed 's/?.*$//')
        local_path="$OUTPUT_DIR/misc/$filename"
    fi

    # Create directory if needed
    mkdir -p "$(dirname "$local_path")"

    # Download if not exists
    if [ -f "$local_path" ]; then
        echo "  [SKIP] $filename (already exists)"
        ((skipped++))
    else
        echo "  [DOWNLOAD] $filename"
        if curl -s -f -o "$local_path" "$img_url" 2>/dev/null; then
            ((downloaded++))
        else
            echo "    ERROR: Failed to download $img_url"
            echo "$img_url" >> failed_downloads.txt
            ((failed++))
        fi
    fi
done < unique_image_urls.txt

# Clean up
rm -f sitemap.xml page_urls.txt unique_pages.txt all_image_urls.txt processed_urls.txt temp_page_*.html

echo ""
echo "=== Download Summary ==="
echo "Total unique images: $(wc -l < unique_image_urls.txt)"
echo "Downloaded: $downloaded"
echo "Skipped (already exists): $skipped"
echo "Failed: $failed"

if [ "$failed" -gt 0 ]; then
    echo ""
    echo "Failed downloads saved to: failed_downloads.txt"
fi

echo ""
echo "All image URLs saved to: unique_image_urls.txt"