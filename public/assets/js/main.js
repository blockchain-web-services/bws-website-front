// BWS Website Main JavaScript

// Initialize Webfont loader
if (typeof WebFont !== 'undefined') {
  WebFont.load({
    google: {
      families: [
        "Montserrat:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic",
        "DM Sans:regular,500,700"
      ]
    }
  });
}

// Webflow touch detection
!function(o, c) {
  var n = c.documentElement,
      t = " w-mod-";
  n.className += t + "js";
  ("ontouchstart" in o || o.DocumentTouch && c instanceof DocumentTouch) && (n.className += t + "touch")
}(window, document);

// Dynamic item fade functionality
function initDynamicFade() {
  const items = document.querySelectorAll('.w-dyn-item');
  
  items.forEach(item => {
    item.addEventListener('click', function() {
      this.classList.toggle('fade');
    });
  });
}

// Initialize Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('set', 'developer_id.dZGVlNj', true);
gtag('config', 'G-TKTH70X52B');

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  initDynamicFade();
});

// Webflow currency settings
window.__WEBFLOW_CURRENCY_SETTINGS = {
  "currencyCode": "USD",
  "symbol": "$",
  "decimal": ".",
  "fractionDigits": 2,
  "group": ",",
  "template": "{{wf {\"path\":\"symbol\",\"type\":\"PlainText\"} }} {{wf {\"path\":\"amount\",\"type\":\"CommercePrice\"} }} {{wf {\"path\":\"currencyCode\",\"type\":\"PlainText\"} }}",
  "hideDecimalForWholeNumbers": false
};