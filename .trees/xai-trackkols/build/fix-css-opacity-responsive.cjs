const fs = require('fs');
const path = require('path');

// Path to the CSS file
const cssPath = path.join(__dirname, '..', 'public', 'assets', 'css', 'bws-21ce3b.webflow.shared.9162577b1.min.css');

// Read the CSS file
let css = fs.readFileSync(cssPath, 'utf8');

console.log('Fixing CSS opacity and responsive issues...');

// Fix 1: Remove opacity: 0 from decorative blob images that block content
css = css.replace(/\.image\.blob[^{]*\{[^}]*opacity:\s*0[^}]*\}/g, (match) => {
  // Keep the styles but set opacity to 1 for visible decorative elements
  return match.replace(/opacity:\s*0/, 'opacity: 0.3');
});

// Fix 2: Ensure dropdown menus are visible (remove any opacity: 0 on dropdown elements)
css = css.replace(/\.w-dropdown[^{]*\{[^}]*opacity:\s*0[^}]*\}/g, (match) => {
  return match.replace(/opacity:\s*0/, 'opacity: 1');
});

// Fix 3: Add responsive container padding for better mobile centering
const responsiveFixes = `
/* Custom responsive fixes for content centering */
@media screen and (max-width: 991px) {
  .w-container {
    padding-left: 20px;
    padding-right: 20px;
  }

  .section-content,
  .container-medium {
    padding-left: 20px;
    padding-right: 20px;
  }
}

@media screen and (max-width: 767px) {
  .w-container {
    padding-left: 15px;
    padding-right: 15px;
  }

  .section-content,
  .container-medium {
    padding-left: 15px;
    padding-right: 15px;
  }

  /* Fix content alignment on mobile */
  .hero-content,
  .section-wrapper {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
}

@media screen and (max-width: 479px) {
  .w-container {
    padding-left: 10px;
    padding-right: 10px;
  }

  .section-content,
  .container-medium {
    padding-left: 10px;
    padding-right: 10px;
  }
}

/* Fix for industry dropdown transparency */
.top-menu-industry-card {
  opacity: 1 !important;
  transition: filter 0.3s ease;
}

.top-menu-industry-card-wrapper {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.dropdown-menu.wide,
.dropdown-menu {
  background-color: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
}

/* Ensure dropdown lists are fully opaque */
.w-dropdown-list {
  opacity: 1 !important;
  background-color: white;
}

/* Fix for navigation dropdowns */
.nav-link-dropdown .w-dropdown-list {
  opacity: 1 !important;
  visibility: visible;
}

/* Ensure images are responsive */
img {
  max-width: 100%;
  height: auto;
}

/* Fix srcset images that might be missing */
img[srcset] {
  object-fit: cover;
}

/* Fallback for missing responsive images */
img[srcset]:not([src]) {
  display: none;
}
`;

// Append the responsive fixes to the CSS
css += responsiveFixes;

// Write the fixed CSS back
fs.writeFileSync(cssPath, css);

console.log('CSS fixes applied successfully!');
console.log('- Fixed blob image opacity');
console.log('- Added responsive container padding');
console.log('- Fixed industry dropdown transparency');
console.log('- Added image responsive fallbacks');