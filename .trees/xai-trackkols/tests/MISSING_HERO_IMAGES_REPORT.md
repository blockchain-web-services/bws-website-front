# Missing Hero Images Report

## Issue Summary
All 6 industry-content pages are missing their hero background images, even though the image files exist in the filesystem.

## Affected Pages
1. `/industry-content/financial-services.html`
2. `/industry-content/content-creation.html`
3. `/industry-content/esg.html`
4. `/industry-content/legal.html`
5. `/industry-content/retail.html`
6. `/industry-content/supply-chain.html`

## Missing Images Details

### Background Images (Not Referenced in HTML/CSS)
These images exist in `/public/assets/images/6474d385cfec71cb21a9229a/` but are not being used:

| Page | Expected Background Image | Status |
|------|--------------------------|--------|
| financial-services | 6505dc980dbf1ad68ea4e1f0_Financial-Services_320x400_Layered.jpg | ✅ File exists, ❌ Not referenced |
| content-creation | 6505db28e3925660b50a55ff_Content-Creation_320x400_Layered.jpg | ✅ File exists, ❌ Not referenced |
| esg | 6505d9933660c5523d5f93eb_ESG-CREDITS_320x400_Layered.jpg | ✅ File exists, ❌ Not referenced |
| legal | 6505dde3f53261fa63529ee9_Legal-320x400.jpg | ✅ File exists, ❌ Not referenced |
| retail | 6505dfa0e3925660b50e279e_Retail_320x400_Layered.jpg | ✅ File exists, ❌ Not referenced |
| supply-chain | 6505e0f259aeff2f47db9530_Supply-Chain_320x400_layered.jpg | ✅ File exists, ❌ Not referenced |

### Article Images (Referenced but Files Missing)
These images are referenced in the HTML but the actual files don't exist with spaces in filenames:

| Page | Expected Article Image | Issue |
|------|----------------------|-------|
| All pages | Various article images | Files exist with %20 encoding, but references use spaces |

## Root Cause Analysis

1. **Background Images Not Applied**: The industry background images (320x400 layered versions) exist in the filesystem but are not referenced anywhere in the HTML or CSS. They should likely be applied as CSS background-images to the hero sections.

2. **Test Suite Gap**: The existing test suite only checks if referenced images exist, not if expected visual elements are missing. This is why these missing hero images weren't caught by the tests.

## Tests Created

### 1. `check-missing-images.cjs`
- Simple Node.js script that checks for missing image references
- Reported all images as "found" because it only checked referenced images

### 2. `check-hero-images.cjs`
- Enhanced test that specifically checks for expected hero images
- Successfully detects all 6 pages with missing background images
- Exit code 1 when missing images are found

### 3. `industry-hero-images.spec.js`
- Playwright test that checks for expected hero images
- Can be run as part of the test suite
- Provides detailed reporting of what's missing

## How to Run the Tests

```bash
# Run the enhanced hero image check (fast, no browser needed)
node tests/check-hero-images.cjs

# Run the Playwright test (requires test server running)
cd tests && npx playwright test tests/industry-hero-images.spec.js
```

## Recommended Fix

The hero background images need to be added to the source Astro components. Check the original Webflow design to understand how these images should be applied (likely as CSS background-images on the hero sections).

## Test Output Example

```
❌ FAILURE: 6 pages have missing hero images:

   • content-creation.html
   • esg.html
   • financial-services.html
   • legal.html
   • retail.html
   • supply-chain.html

📋 Missing Hero Image Details:

   financial-services.html:
     - Missing background image: 6505dc980dbf1ad68ea4e1f0_Financial-Services_320x400_Layered.jpg
     - Expected path: /assets/images/6474d385cfec71cb21a9229a/6505dc980dbf1ad68ea4e1f0_Financial-Services_320x400_Layered.jpg
```