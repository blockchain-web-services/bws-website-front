#!/bin/bash

echo "Cleaning up problematic files and directories..."

# Remove directories with URL-like names or encoded characters
echo "Removing problematic directories..."

# Find and remove directories containing 'https:', '%20', '%2F', or srcset-like patterns
find ../public -type d \( -name '*https:*' -o -name '*%20*' -o -name '*%2F*' -o -name '* 500w*' -o -name '* 800w*' -o -name '*cdn.prod.website-files.com*' \) -exec rm -rf {} + 2>/dev/null

find ../_site -type d \( -name '*https:*' -o -name '*%20*' -o -name '*%2F*' -o -name '* 500w*' -o -name '* 800w*' -o -name '*cdn.prod.website-files.com*' \) -exec rm -rf {} + 2>/dev/null

# Remove specific problematic directories
rm -rf '../public/"https:' 2>/dev/null
rm -rf '../public/&quot;https:' 2>/dev/null
rm -rf '../_site/"https:' 2>/dev/null
rm -rf '../_site/&quot;https:' 2>/dev/null

# Also clean up files with problematic names
find ../public -type f -name '*https:*' -exec rm -f {} + 2>/dev/null
find ../_site -type f -name '*https:*' -exec rm -f {} + 2>/dev/null

echo "Cleaning complete!"

# List remaining directories to verify
echo ""
echo "Remaining directories in public:"
ls -la ../public/ | head -20

echo ""
echo "Remaining image directories:"
ls -la ../public/assets/images/ 2>/dev/null | head -10