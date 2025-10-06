// Force visibility for specific images that Webflow hides
// This runs after page load to override Webflow's aggressive hiding
(function() {
  function forceVisibility() {
    // Target BFG images
    const bfgImages = document.querySelectorAll('.image-bfg');
    bfgImages.forEach(img => {
      img.style.setProperty('visibility', 'visible', 'important');
      img.style.setProperty('opacity', '1', 'important');
      img.style.setProperty('display', 'block', 'important');
    });

    // Target Tokenomics image
    const tokenImages = document.querySelectorAll('.image-token-allocation');
    tokenImages.forEach(img => {
      img.style.setProperty('visibility', 'visible', 'important');
      img.style.setProperty('opacity', '1', 'important');
      img.style.setProperty('display', 'block', 'important');
    });

    // Also fix parent containers if they're hidden
    const tokenContainers = document.querySelectorAll('.token-allocation, .token-allocation-image');
    tokenContainers.forEach(el => {
      el.style.setProperty('visibility', 'visible', 'important');
      el.style.setProperty('opacity', '1', 'important');
    });
  }

  // Run immediately
  forceVisibility();

  // Run after DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forceVisibility);
  }

  // Run after window load (after all resources)
  window.addEventListener('load', function() {
    // Delay slightly to run after Webflow
    setTimeout(forceVisibility, 100);
    setTimeout(forceVisibility, 500);
    setTimeout(forceVisibility, 1000);
  });
})();
