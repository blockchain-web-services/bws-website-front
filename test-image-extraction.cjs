const https = require('https');

/**
 * Extract images from HTML
 */
function extractImages(html, baseUrl) {
  const images = [];
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    const fullMatch = match[0];
    let imgUrl = match[1];

    // Decode HTML entities in URL
    imgUrl = imgUrl.replace(/&amp;/g, '&')
                   .replace(/&lt;/g, '<')
                   .replace(/&gt;/g, '>')
                   .replace(/&quot;/g, '"')
                   .replace(/&#39;/g, "'");

    // Extract alt text if present
    const altMatch = fullMatch.match(/alt=["']([^"']*)["']/i);
    const alt = altMatch ? altMatch[1] : '';

    // For GitBook images, check the actual content URL (in the url parameter), not the wrapper
    const isGitbookImage = imgUrl.includes('gitbook.io') || imgUrl.includes('~gitbook/image');

    if (isGitbookImage) {
      // Decode the url parameter to check the actual content URL for logos/icons
      try {
        const urlParams = new URL(imgUrl).searchParams;
        const actualUrl = urlParams.get('url');
        if (actualUrl) {
          const decodedUrl = decodeURIComponent(actualUrl);
          // Skip if the actual content URL contains /icon/ or /logo (these are site logos, not product screenshots)
          // Logo URLs typically look like: /organizations/.../icon/.../logo%20void.svg
          // Product screenshots look like: /spaces/.../uploads/.../x-bot-desktop-2025-12-03-section-hero.png
          if (decodedUrl.includes('/icon/') || decodedUrl.includes('/logo')) {
            console.log(`  ❌ SKIPPED (logo): ${imgUrl.substring(0, 100)}...`);
            console.log(`     Decoded: ${decodedUrl.substring(0, 150)}...`);
            continue;
          }
        }
      } catch (e) {
        // If URL parsing fails, fall back to checking the raw URL
        if (imgUrl.includes('/icon/') || imgUrl.includes('/logo')) {
          console.log(`  ❌ SKIPPED (fallback logo check): ${imgUrl.substring(0, 100)}...`);
          continue;
        }
      }
    } else {
      // For non-GitBook images, check filename and alt text
      const isLogoInFilename = imgUrl.includes('/logo') || imgUrl.includes('/icon');
      if (isLogoInFilename || alt.toLowerCase().includes('logo')) {
        console.log(`  ❌ SKIPPED (non-gitbook logo): ${imgUrl.substring(0, 100)}...`);
        continue;
      }
    }

    // Make URL absolute if needed
    let absoluteUrl = imgUrl;
    if (imgUrl.startsWith('/')) {
      const urlObj = new URL(baseUrl);
      absoluteUrl = `${urlObj.protocol}//${urlObj.host}${imgUrl}`;
    } else if (!imgUrl.startsWith('http')) {
      absoluteUrl = new URL(imgUrl, baseUrl).href;
    }

    images.push({
      url: absoluteUrl,
      alt: alt || 'Product screenshot',
      type: 'img-tag'
    });
  }

  return images;
}

/**
 * Fetch page HTML
 */
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

(async () => {
  const testPages = [
    {
      name: 'X Bot Snapshots',
      url: 'https://docs.bws.ninja/media-assets/snapshots/marketplace-solutions/bws.x.bot'
    },
    {
      name: 'Blockchain Badges Snapshots',
      url: 'https://docs.bws.ninja/media-assets/snapshots/marketplace-solutions/bws.blockchain.badges'
    },
    {
      name: 'NFT Game Cube Snapshots',
      url: 'https://docs.bws.ninja/media-assets/snapshots/marketplace-solutions/bws.nft.gamecube'
    }
  ];

  for (const page of testPages) {
    console.log(`\n\n${'='.repeat(80)}`);
    console.log(`📄 Testing: ${page.name}`);
    console.log(`   URL: ${page.url}`);
    console.log('='.repeat(80));

    try {
      const html = await fetchPage(page.url);
      const images = extractImages(html, page.url);

      console.log(`\n✅ Found ${images.length} valid product screenshot(s):\n`);

      images.forEach((img, i) => {
        console.log(`${i + 1}. URL: ${img.url}`);
        console.log(`   Alt: ${img.alt}`);

        // Try to extract filename from URL
        try {
          const urlParams = new URL(img.url).searchParams;
          const actualUrl = urlParams.get('url');
          if (actualUrl) {
            const decoded = decodeURIComponent(actualUrl);
            const match = decoded.match(/([^\/]+)\?alt=media/);
            if (match) {
              console.log(`   Filename: ${match[1]}`);
            }
          }
        } catch (e) {
          // Ignore parsing errors
        }
        console.log('');
      });

    } catch (error) {
      console.log(`\n❌ Error: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ Test complete!');
  console.log('='.repeat(80));
})();
