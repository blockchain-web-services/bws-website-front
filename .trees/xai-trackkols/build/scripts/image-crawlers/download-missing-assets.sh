#!/bin/bash

echo "Downloading missing assets from bws.ninja..."

# Create directories if they don't exist
mkdir -p public/assets/images/6474d385cfec71cb21a92251
mkdir -p public/assets/images/logos
mkdir -p public/assets/js

# Download missing images - fixing the filenames
echo "Downloading PROOF logo..."
curl -o "public/assets/images/6474d385cfec71cb21a92251/670f82f9b05322735f72cbcc_PROOF-logo-lightBG.png" \
  "https://bws.ninja/assets/images/6474d385cfec71cb21a92251/670f82f9b05322735f72cbcc_PROOF-logo-lightBG.png"

echo "Downloading blob template..."
curl -o "public/assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template.png" \
  "https://bws.ninja/assets/images/6474d385cfec71cb21a92251/6474d385cfec71cb21a922e3_blob-techplus-x-template.png"

echo "Downloading football cubes..."
curl -o "public/assets/images/6474d385cfec71cb21a92251/6708d536ef7b294fa972098e_football-cubes-selection.png" \
  "https://bws.ninja/assets/images/6474d385cfec71cb21a92251/6708d536ef7b294fa972098e_football-cubes-selection.png"

echo "Downloading tokenomics image..."
curl -o "public/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png" \
  "https://bws.ninja/assets/images/6474d385cfec71cb21a92251/6707fd987c3a05d42e1e908e_Tokenomics-Allocation-letters-black.png"

echo "Downloading BWS logo violet..."
curl -o "public/assets/images/logos/bws-logo-violet.png" \
  "https://bws.ninja/assets/images/logos/bws-logo-violet.png"

echo "Downloading BWS logo violet flying..."
curl -o "public/assets/images/logos/bws-logo-violet-flying.png" \
  "https://bws.ninja/assets/images/logos/bws-logo-violet-flying.png"

echo "Downloading lottie animation JSON..."
curl -o "public/assets/js/6474d385cfec71cb21a9236e_lottie-techplus-x-template.json" \
  "https://bws.ninja/assets/js/6474d385cfec71cb21a9236e_lottie-techplus-x-template.json"

echo "Downloading Zapier interfaces..."
curl -o "public/assets/js/zapier-interfaces.esm.js" \
  "https://bws.ninja/assets/js/zapier-interfaces.esm.js"

echo "Done downloading missing assets!"
