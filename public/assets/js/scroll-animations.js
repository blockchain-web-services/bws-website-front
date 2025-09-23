/* Override any webflow animations or opacity settings immediately on page load */
document.addEventListener('DOMContentLoaded', function() {
  // Immediately show all critical images and elements
  const criticalElements = document.querySelectorAll('img[src*="blockchain-founders-group"], img[src*="BFG"], img[src*="Tokenomics"], .image-bfg, .image-token-allocation, .heading-landing-page-content');
  criticalElements.forEach(element => {
    element.style.visibility = 'visible';
    element.style.opacity = '1';
    element.style.transform = 'none';
    element.style.display = element.tagName === 'IMG' ? 'inline-block' : 'block';
    element.style.zIndex = '1000';
    element.style.position = 'static';
    element.style.filter = 'none';
    element.style.clip = 'auto';
    if (element.tagName === 'IMG') {
      element.loading = 'eager';
    }
  });
  
  // Also ensure parent containers are visible
  const containers = document.querySelectorAll('.top-menu-company-news, .token-allocation-image, .landing-page-content, .w-layout-vflex, .w-layout-hflex, .w-layout-blockcontainer');
  containers.forEach(container => {
    container.style.visibility = 'visible';
    container.style.opacity = '1';
    container.style.display = container.classList.contains('w-layout-vflex') || container.classList.contains('w-layout-hflex') ? 'flex' : 'block';
    container.style.transform = 'none';
    container.style.filter = 'none';
    container.style.overflow = 'visible';
  });
}, { passive: true });

(function() {
  'use strict';
  
  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    
    // Find all elements with opacity:0 inline style (scroll animations)
    const animatedElements = document.querySelectorAll('[style*="opacity:0"], [style*="opacity: 0"]');
    
    // Create Intersection Observer for scroll animations
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          // Animate the element
          element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          element.style.opacity = '1';
          element.style.transform = 'translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)';
          element.style.webkitTransform = 'translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)';
          
          // Stop observing once animated
          observer.unobserve(element);
        }
      });
    }, observerOptions);
    
    // Start observing all animated elements
    animatedElements.forEach(element => {
      observer.observe(element);
    });
    
    // Also handle elements with data-w-id attribute (Webflow interactions)
    const webflowElements = document.querySelectorAll('[data-w-id]');
    webflowElements.forEach(element => {
      // Check if element has opacity 0 in computed styles
      const computedStyle = window.getComputedStyle(element);
      if (computedStyle.opacity === '0') {
        observer.observe(element);
      }
    });
    
    // Handle lazy loading images
    const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    const imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
    
    // Handle background videos
    const bgVideos = document.querySelectorAll('.w-background-video video');
    bgVideos.forEach(video => {
      if (video.autoplay) {
        video.play().catch(e => {
          console.log('Video autoplay failed:', e);
        });
      }
    });
    
    // Trigger Webflow reinit if available
    if (typeof Webflow !== 'undefined') {
      setTimeout(() => {
        if (Webflow.require && Webflow.require('ix2')) {
          const ix2 = Webflow.require('ix2');
          ix2.init();
        }
      }, 100);
    }
  });
  
  // Also trigger on window load for safety
  window.addEventListener('load', function() {
    // Force any remaining hidden elements to show after page load
    setTimeout(() => {
      const stillHidden = document.querySelectorAll('[style*="opacity:0"], [style*="opacity: 0"]');
      stillHidden.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          element.style.opacity = '1';
          element.style.transform = 'translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)';
          element.style.webkitTransform = 'translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)';
        }
      });
    }, 1000); // Increased delay to ensure all elements are processed
    
    // Force critical images to be visible immediately
    setTimeout(() => {
      const criticalImages = document.querySelectorAll('img[src*="blockchain-founders-group"], img[src*="BFG"], img[src*="Tokenomics"], .image-bfg, .image-token-allocation');
      criticalImages.forEach(img => {
        img.style.visibility = 'visible';
        img.style.opacity = '1';
        img.style.transform = 'none';
        img.style.display = 'inline-block';
        img.style.zIndex = '1000';
        img.style.position = 'static';
        img.style.filter = 'none';
        img.style.clip = 'auto';
        img.style.overflow = 'visible';
        img.loading = 'eager';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
      });
      
      // Also ensure parent containers are visible
      const containers = document.querySelectorAll('.top-menu-company-news, .token-allocation-image, .w-layout-vflex, .w-layout-hflex, .w-layout-blockcontainer');
      containers.forEach(container => {
        container.style.visibility = 'visible';
        container.style.opacity = '1';
        container.style.display = container.classList.contains('w-layout-vflex') || container.classList.contains('w-layout-hflex') ? 'flex' : 'block';
        container.style.transform = 'none';
        container.style.filter = 'none';
        container.style.overflow = 'visible';
      });
    }, 500);
  });
})();