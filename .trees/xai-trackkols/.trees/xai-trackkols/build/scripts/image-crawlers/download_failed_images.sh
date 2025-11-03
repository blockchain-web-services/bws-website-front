#!/bin/bash

# Download the failed images with correct URLs

echo "Downloading failed images..."

# Video poster image
echo "Downloading video poster..."
curl -o "public/assets/images/6474d385cfec71cb21a92251/670f916b2f60627d5201850b_shutterstock_1108417201-poster-00001.jpg" \
  "https://cdn.prod.website-files.com/6474d385cfec71cb21a92251/670f916b2f60627d5201850b_shutterstock_1108417201-poster-00001.jpg"

# Industry images
echo "Downloading ESG Credits image..."
curl -o "public/assets/images/6474d385cfec71cb21a9229a/6505d9933660c5523d5f93eb_ESG-CREDITS_320x400_Layered.jpg" \
  "https://cdn.prod.website-files.com/6474d385cfec71cb21a9229a/6505d9933660c5523d5f93eb_ESG-CREDITS_320x400_Layered.jpg"

echo "Downloading Content Creation image..."
curl -o "public/assets/images/6474d385cfec71cb21a9229a/6505db28e3925660b50a55ff_Content-Creation_320x400_Layered.jpg" \
  "https://cdn.prod.website-files.com/6474d385cfec71cb21a9229a/6505db28e3925660b50a55ff_Content-Creation_320x400_Layered.jpg"

echo "Downloading Financial Services image..."
curl -o "public/assets/images/6474d385cfec71cb21a9229a/6505dc980dbf1ad68ea4e1f0_Financial-Services_320x400_Layered.jpg" \
  "https://cdn.prod.website-files.com/6474d385cfec71cb21a9229a/6505dc980dbf1ad68ea4e1f0_Financial-Services_320x400_Layered.jpg"

echo "Downloading Legal image..."
curl -o "public/assets/images/6474d385cfec71cb21a9229a/6505dde3f53261fa63529ee9_Legal-320x400.jpg" \
  "https://cdn.prod.website-files.com/6474d385cfec71cb21a9229a/6505dde3f53261fa63529ee9_Legal-320x400.jpg"

echo "Downloading Retail image..."
curl -o "public/assets/images/6474d385cfec71cb21a9229a/6505dfa0e3925660b50e279e_Retail_320x400_Layered.jpg" \
  "https://cdn.prod.website-files.com/6474d385cfec71cb21a9229a/6505dfa0e3925660b50e279e_Retail_320x400_Layered.jpg"

echo "Downloading Supply Chain image..."
curl -o "public/assets/images/6474d385cfec71cb21a9229a/6505e0f259aeff2f47db9530_Supply-Chain_320x400_layered.jpg" \
  "https://cdn.prod.website-files.com/6474d385cfec71cb21a9229a/6505e0f259aeff2f47db9530_Supply-Chain_320x400_layered.jpg"

echo "Done!"