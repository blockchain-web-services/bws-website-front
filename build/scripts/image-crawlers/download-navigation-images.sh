#!/bin/bash

# Download missing navigation dropdown images from live site
echo "Downloading missing navigation dropdown images..."

# Create the directory if it doesn't exist
mkdir -p public/assets/images/6474d385cfec71cb21a9229a

# Download the images
echo "Downloading Financial Services image..."
curl -o public/assets/images/6474d385cfec71cb21a9229a/654a2597be432d1f0879bfa6_Elevating-Financial-Services-and-ESG-Compiance.jpg \
  https://www.bws.ninja/assets/images/6474d385cfec71cb21a9229a/654a2597be432d1f0879bfa6_Elevating-Financial-Services-and-ESG-Compiance.jpg

echo "Downloading Creative Ownership image..."
curl -o public/assets/images/6474d385cfec71cb21a9229a/654a258bbfafadcb274d5024_The-Future-of-Creative-Ownership-and-Empowerment.jpg \
  https://www.bws.ninja/assets/images/6474d385cfec71cb21a9229a/654a258bbfafadcb274d5024_The-Future-of-Creative-Ownership-and-Empowerment.jpg

echo "Downloading Transform UX image..."
curl -o public/assets/images/6474d385cfec71cb21a9229a/654a2561e29f2df41f5bfeb8_Transform-the-user-eXperience-with-Blockchain.jpg \
  https://www.bws.ninja/assets/images/6474d385cfec71cb21a9229a/654a2561e29f2df41f5bfeb8_Transform-the-user-eXperience-with-Blockchain.jpg

echo "Downloading Blockchain Frontier image..."
curl -o public/assets/images/6474d385cfec71cb21a9229a/654a256e853678a54e9cebdf_Blockchain-is-the-New-Frontier-in-Accountability-and-Transparency.jpg \
  https://www.bws.ninja/assets/images/6474d385cfec71cb21a9229a/654a256e853678a54e9cebdf_Blockchain-is-the-New-Frontier-in-Accountability-and-Transparency.jpg

echo "Downloading Supply Chain image..."
curl -o public/assets/images/6474d385cfec71cb21a9229a/654a25780f2320f1dc394e6a_The-Future-of-Transparent-and-Efficient-Supply-Chain-Management.jpg \
  https://www.bws.ninja/assets/images/6474d385cfec71cb21a9229a/654a25780f2320f1dc394e6a_The-Future-of-Transparent-and-Efficient-Supply-Chain-Management.jpg

echo "Downloading Legal Practices image..."
curl -o public/assets/images/6474d385cfec71cb21a9229a/654a2515de4301ab69f9951e_Blockchain-Trust-in-Legal-Practices.jpg \
  https://www.bws.ninja/assets/images/6474d385cfec71cb21a9229a/654a2515de4301ab69f9951e_Blockchain-Trust-in-Legal-Practices.jpg

# Also copy to _site directory for immediate serving
cp -r public/assets/images/6474d385cfec71cb21a9229a/* _site/assets/images/6474d385cfec71cb21a9229a/

echo "All navigation images downloaded successfully!"