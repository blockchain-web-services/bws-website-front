#!/bin/bash

echo "Downloading ALL missing assets from bws.ninja..."

# Create directories
mkdir -p public/assets/fonts
mkdir -p public/assets/images/logos
mkdir -p public/assets/images/6474d385cfec71cb21a92251
mkdir -p public/assets/js

# Download missing fonts
echo "Downloading fonts..."
curl -s -o "public/assets/fonts/THICCCBOI-Bold.ttf" \
  "https://bws.ninja/assets/fonts/THICCCBOI-Bold.ttf"

curl -s -o "public/assets/fonts/THICCCBOI-Medium.ttf" \
  "https://bws.ninja/assets/fonts/THICCCBOI-Medium.ttf"

curl -s -o "public/assets/fonts/THICCCBOI-Regular.ttf" \
  "https://bws.ninja/assets/fonts/THICCCBOI-Regular.ttf"

curl -s -o "public/assets/fonts/font-awesome-6-pro-light-300.otf" \
  "https://bws.ninja/assets/fonts/font-awesome-6-pro-light-300.otf"

curl -s -o "public/assets/fonts/font-awesome-6-pro-solid-900.otf" \
  "https://bws.ninja/assets/fonts/font-awesome-6-pro-solid-900.otf"

curl -s -o "public/assets/fonts/icons-techplus-x-template.woff2" \
  "https://bws.ninja/assets/fonts/icons-techplus-x-template.woff2"

curl -s -o "public/assets/fonts/icons-techplus-x-template.woff" \
  "https://bws.ninja/assets/fonts/icons-techplus-x-template.woff"

curl -s -o "public/assets/fonts/icons-techplus-x-template.ttf" \
  "https://bws.ninja/assets/fonts/icons-techplus-x-template.ttf"

curl -s -o "public/assets/fonts/icons-techplus-x-template.eot" \
  "https://bws.ninja/assets/fonts/icons-techplus-x-template.eot"

curl -s -o "public/assets/fonts/icons-techplus-x-template.svg" \
  "https://bws.ninja/assets/fonts/icons-techplus-x-template.svg"

# More font files that might be needed
curl -s -o "public/assets/fonts/fa-solid-900.woff" \
  "https://bws.ninja/assets/fonts/fa-solid-900.woff"

curl -s -o "public/assets/fonts/fa-v4compatibility.woff2" \
  "https://bws.ninja/assets/fonts/fa-v4compatibility.woff2"

# Nohemi fonts
curl -s -o "public/assets/fonts/Nohemi-Medium.woff2" \
  "https://bws.ninja/assets/fonts/Nohemi-Medium.woff2"

curl -s -o "public/assets/fonts/Nohemi-Regular.woff2" \
  "https://bws.ninja/assets/fonts/Nohemi-Regular.woff2"

curl -s -o "public/assets/fonts/Nohemi-Semi.woff2" \
  "https://bws.ninja/assets/fonts/Nohemi-Semi.woff2"

echo "Fonts downloaded."

# Download images that were still missing
echo "Checking and downloading missing images..."

# The blob template - ensure we get the right one
if [ ! -f "public/assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template.png" ] || [ $(stat -c%s "public/assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template.png" 2>/dev/null || echo 0) -lt 1000 ]; then
  echo "Downloading blob template (correct version)..."
  curl -s -o "public/assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template.png" \
    "https://bws.ninja/assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template.png"
fi

# Football cubes
if [ ! -f "public/assets/images/6474d385cfec71cb21a92251/6708d536ef7b294fa972098e_football-cubes-selection.png" ] || [ $(stat -c%s "public/assets/images/6474d385cfec71cb21a92251/6708d536ef7b294fa972098e_football-cubes-selection.png" 2>/dev/null || echo 0) -lt 1000 ]; then
  echo "Downloading football cubes..."
  curl -s -o "public/assets/images/6474d385cfec71cb21a92251/6708d536ef7b294fa972098e_football-cubes-selection.png" \
    "https://bws.ninja/assets/images/6474d385cfec71cb21a92251/6708d536ef7b294fa972098e_football-cubes-selection.png"
fi

# Tokenomics
if [ ! -f "public/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png" ] || [ $(stat -c%s "public/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png" 2>/dev/null || echo 0) -lt 1000 ]; then
  echo "Downloading tokenomics..."
  curl -s -o "public/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png" \
    "https://bws.ninja/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png"
fi

# Ensure we have the lottie JSON
echo "Downloading Lottie animation..."
curl -s -o "public/assets/js/6474d385cfec71cb21a9236e_lottie-techplus-x-template.json" \
  "https://bws.ninja/assets/js/6474d385cfec71cb21a9236e_lottie-techplus-x-template.json"

echo "All assets downloaded to public folder."
echo ""
echo "Now rebuilding site to include these assets..."