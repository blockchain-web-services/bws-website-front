#!/bin/bash

# Copy the original index.html to _site
cp index.html _site/index.html

# Fix asset URLs in _site/index.html
sed -i 's|assets/css/webflow.css|/assets/css/webflow.css|g' _site/index.html
sed -i 's|assets/css/main.css|/assets/css/main.css|g' _site/index.html
sed -i 's|assets/images/|/assets/images/|g' _site/index.html
sed -i 's|assets/js/|/assets/js/|g' _site/index.html

# Fix duplicate slashes
sed -i 's|//assets/|/assets/|g' _site/index.html

echo "Fixed content and asset URLs"