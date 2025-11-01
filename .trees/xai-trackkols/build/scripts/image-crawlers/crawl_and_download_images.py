#!/usr/bin/env python3
"""
Crawl Webflow site and download all images
"""

import os
import re
import requests
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
import time
import hashlib

def get_page_content(url):
    """Fetch page content"""
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return None

def extract_image_urls(html, base_url):
    """Extract all image URLs from HTML"""
    soup = BeautifulSoup(html, 'html.parser')
    image_urls = set()

    # Find images in img tags
    for img in soup.find_all('img'):
        src = img.get('src')
        if src:
            image_urls.add(urljoin(base_url, src))

        # Check srcset for responsive images
        srcset = img.get('srcset')
        if srcset:
            for item in srcset.split(','):
                url = item.strip().split(' ')[0]
                if url:
                    image_urls.add(urljoin(base_url, url))

        # Check data attributes
        for attr in ['data-src', 'data-srcset', 'data-lazy']:
            value = img.get(attr)
            if value:
                if 'srcset' in attr:
                    for item in value.split(','):
                        url = item.strip().split(' ')[0]
                        if url:
                            image_urls.add(urljoin(base_url, url))
                else:
                    image_urls.add(urljoin(base_url, value))

    # Find background images in style attributes
    for elem in soup.find_all(style=True):
        style = elem['style']
        urls = re.findall(r'url\(["\']?([^"\']+)["\']?\)', style)
        for url in urls:
            if any(ext in url.lower() for ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']):
                image_urls.add(urljoin(base_url, url))

    # Find images in source tags (picture elements)
    for source in soup.find_all('source'):
        srcset = source.get('srcset')
        if srcset:
            for item in srcset.split(','):
                url = item.strip().split(' ')[0]
                if url:
                    image_urls.add(urljoin(base_url, url))

    # Find video posters
    for video in soup.find_all('video'):
        poster = video.get('poster')
        if poster:
            image_urls.add(urljoin(base_url, poster))

    return image_urls

def crawl_site(base_url):
    """Crawl site and collect all image URLs"""
    visited_pages = set()
    pages_to_visit = {base_url}
    all_images = set()

    while pages_to_visit:
        url = pages_to_visit.pop()
        if url in visited_pages:
            continue

        print(f"Crawling: {url}")
        visited_pages.add(url)

        html = get_page_content(url)
        if not html:
            continue

        # Extract images
        images = extract_image_urls(html, url)
        all_images.update(images)

        # Find more pages to crawl
        soup = BeautifulSoup(html, 'html.parser')
        for link in soup.find_all('a', href=True):
            href = link['href']
            full_url = urljoin(url, href)

            # Only crawl pages on the same domain
            if urlparse(full_url).netloc == urlparse(base_url).netloc:
                if full_url not in visited_pages and not any(ext in full_url for ext in ['.pdf', '.zip', '.doc']):
                    pages_to_visit.add(full_url)

        # Be polite
        time.sleep(0.5)

    return all_images

def determine_local_path(image_url):
    """Determine where to save the image locally"""
    parsed = urlparse(image_url)
    path = parsed.path

    # Handle Webflow CDN patterns
    if 'uploads-ssl.webflow.com' in parsed.netloc:
        # Extract the ID pattern from the URL
        match = re.search(r'/([a-f0-9]{24})/([a-f0-9]{24}_[^/]+)$', path)
        if match:
            collection_id = match.group(1)
            filename = match.group(2)
            return f"public/assets/images/{collection_id}/{filename}"

    # For other patterns, try to maintain the structure
    if path.startswith('/'):
        path = path[1:]

    # Default to public directory
    return f"public/{path}"

def download_image(url, local_path):
    """Download an image to local path"""
    try:
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(local_path), exist_ok=True)

        # Skip if file already exists
        if os.path.exists(local_path):
            print(f"  Already exists: {local_path}")
            return True

        # Download the image
        response = requests.get(url, timeout=30, stream=True)
        response.raise_for_status()

        with open(local_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        print(f"  Downloaded: {local_path}")
        return True

    except Exception as e:
        print(f"  Error downloading {url}: {e}")
        return False

def main():
    base_url = "https://bws-21ce3b.webflow.io/"

    print("Starting crawl of Webflow site...")
    all_images = crawl_site(base_url)

    print(f"\nFound {len(all_images)} unique images")

    # Save list of all images
    with open('webflow_images.txt', 'w') as f:
        for img in sorted(all_images):
            f.write(f"{img}\n")

    print("\nDownloading images...")
    downloaded = 0
    failed = 0

    for img_url in sorted(all_images):
        print(f"\nProcessing: {img_url}")
        local_path = determine_local_path(img_url)

        if download_image(img_url, local_path):
            downloaded += 1
        else:
            failed += 1

    print(f"\n\nSummary:")
    print(f"  Total images found: {len(all_images)}")
    print(f"  Successfully downloaded: {downloaded}")
    print(f"  Failed: {failed}")

    # Save failed downloads for review
    if failed > 0:
        print("\nCheck webflow_images.txt for the complete list")

if __name__ == "__main__":
    main()