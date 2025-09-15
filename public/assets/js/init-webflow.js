// Initialize Webflow after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Check if Webflow is loaded
  if (typeof Webflow !== 'undefined') {
    Webflow.destroy();
    Webflow.ready();
    Webflow.require('ix2').init();
  }
  
  // Initialize dropdowns manually if needed
  const dropdowns = document.querySelectorAll('.w-dropdown');
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('mouseenter', function() {
      this.classList.add('w--open');
    });
    dropdown.addEventListener('mouseleave', function() {
      this.classList.remove('w--open');
    });
  });
});
