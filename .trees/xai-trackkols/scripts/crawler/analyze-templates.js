const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

class TemplateAnalyzer {
  constructor() {
    this.templates = new Map();
    this.componentPatterns = new Map();
  }

  async analyzePages(pagesFile) {
    const pages = JSON.parse(await fs.readFile(pagesFile, 'utf8'));
    const results = [];
    
    for (const page of pages) {
      console.log(`Analyzing: ${page.url}`);
      const templateInfo = await this.detectTemplate(page);
      results.push({
        url: page.url,
        template: templateInfo.template,
        components: templateInfo.components,
        buttons: templateInfo.buttons,
        features: templateInfo.features
      });
      
      // Track template usage
      if (!this.templates.has(templateInfo.template)) {
        this.templates.set(templateInfo.template, []);
      }
      this.templates.get(templateInfo.template).push(page.url);
    }
    
    return this.generateTemplateReport(results);
  }

  async detectTemplate(page) {
    const url = page.url;
    const features = {
      hasHero: false,
      hasFeatureGrid: false,
      hasSidebar: false,
      hasForm: false,
      hasCodeBlocks: false,
      hasVideoPlayer: false,
      hasPricing: false,
      hasTestimonials: false,
      columnLayout: 'single',
      navigationStyle: 'standard'
    };
    
    // Fetch the actual HTML content for analysis
    // In production, this would come from the crawled data
    const html = await this.fetchPageHtml(url);
    const $ = cheerio.load(html);
    
    // Analyze page structure
    features.hasHero = this.checkForHero($);
    features.hasFeatureGrid = this.checkForFeatureGrid($);
    features.hasSidebar = this.checkForSidebar($);
    features.hasForm = this.checkForForms($);
    features.hasCodeBlocks = this.checkForCode($);
    features.hasVideoPlayer = this.checkForVideo($);
    features.hasPricing = this.checkForPricing($);
    features.hasTestimonials = this.checkForTestimonials($);
    features.columnLayout = this.detectLayout($);
    
    // Extract button variations
    const buttons = this.extractButtons($);
    
    // Extract components
    const components = this.identifyComponents($);
    
    // Determine template type
    const template = this.matchTemplate(url, features);
    
    return {
      template,
      features,
      buttons,
      components
    };
  }

  checkForHero($) {
    const heroSelectors = [
      '.hero', '.hero-section', '.banner', '.jumbotron',
      'section:first-child h1', '[class*="hero"]'
    ];
    
    for (const selector of heroSelectors) {
      if ($(selector).length > 0) {
        return true;
      }
    }
    return false;
  }

  checkForFeatureGrid($) {
    const gridSelectors = [
      '.features-grid', '.feature-grid', '.services-grid',
      '.grid', '[class*="grid"]', '.row .col-md-4'
    ];
    
    for (const selector of gridSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        // Check if it contains multiple similar items
        const children = element.children();
        if (children.length >= 3) {
          return true;
        }
      }
    }
    return false;
  }

  checkForSidebar($) {
    const sidebarSelectors = [
      '.sidebar', 'aside', '.side-nav', '.left-nav',
      '[class*="sidebar"]', '[class*="side-menu"]'
    ];
    
    for (const selector of sidebarSelectors) {
      if ($(selector).length > 0) {
        return true;
      }
    }
    return false;
  }

  checkForForms($) {
    return $('form').length > 0;
  }

  checkForCode($) {
    const codeSelectors = ['pre', 'code', '.highlight', '.code-block'];
    
    for (const selector of codeSelectors) {
      if ($(selector).length > 0) {
        return true;
      }
    }
    return false;
  }

  checkForVideo($) {
    const videoSelectors = ['video', 'iframe[src*="youtube"]', 'iframe[src*="vimeo"]'];
    
    for (const selector of videoSelectors) {
      if ($(selector).length > 0) {
        return true;
      }
    }
    return false;
  }

  checkForPricing($) {
    const pricingKeywords = ['pricing', 'price', 'plan', 'tier', 'subscription'];
    const text = $('body').text().toLowerCase();
    
    for (const keyword of pricingKeywords) {
      if (text.includes(keyword)) {
        // Check for pricing-specific elements
        if ($('[class*="pricing"]').length > 0 || $('[class*="price"]').length > 0) {
          return true;
        }
      }
    }
    return false;
  }

  checkForTestimonials($) {
    const testimonialSelectors = [
      '.testimonial', '.review', '.testimonials',
      '[class*="testimonial"]', 'blockquote'
    ];
    
    for (const selector of testimonialSelectors) {
      if ($(selector).length > 0) {
        return true;
      }
    }
    return false;
  }

  detectLayout($) {
    const mainContent = $('main, .main-content, #content, .content');
    const sidebar = $('aside, .sidebar');
    
    if (sidebar.length > 0 && mainContent.length > 0) {
      return 'two-column';
    }
    
    if ($('.container-fluid').length > 0 || $('[class*="full-width"]').length > 0) {
      return 'full-width';
    }
    
    return 'single-column';
  }

  extractButtons($) {
    const buttons = {
      primary: [],
      secondary: [],
      navigation: [],
      ghost: [],
      icon: []
    };
    
    // Find all button-like elements
    const buttonElements = $('button, a.btn, a[class*="button"], .cta, [class*="cta"]');
    
    buttonElements.each((_, element) => {
      const $el = $(element);
      const classes = $el.attr('class') || '';
      const text = $el.text().trim();
      const href = $el.attr('href') || '';
      const hasIcon = $el.find('i, svg, [class*="icon"]').length > 0;
      
      const buttonInfo = {
        text,
        classes,
        href,
        hasIcon
      };
      
      // Categorize button
      if (classes.includes('primary') || classes.includes('cta-primary')) {
        buttons.primary.push(buttonInfo);
      } else if (classes.includes('secondary') || classes.includes('outline')) {
        buttons.secondary.push(buttonInfo);
      } else if (classes.includes('ghost') || classes.includes('text')) {
        buttons.ghost.push(buttonInfo);
      } else if (hasIcon && text.length < 20) {
        buttons.icon.push(buttonInfo);
      } else if ($el.closest('nav, header').length > 0) {
        buttons.navigation.push(buttonInfo);
      } else {
        buttons.secondary.push(buttonInfo);
      }
    });
    
    return buttons;
  }

  identifyComponents($) {
    const components = [];
    
    // Check for header
    if ($('header, .header, nav.navbar').length > 0) {
      components.push('header');
    }
    
    // Check for footer
    if ($('footer, .footer').length > 0) {
      components.push('footer');
    }
    
    // Check for navigation
    if ($('nav, .nav, .navigation').length > 0) {
      components.push('navigation');
    }
    
    // Check for hero
    if (this.checkForHero($)) {
      components.push('hero');
    }
    
    // Check for features section
    if (this.checkForFeatureGrid($)) {
      components.push('features');
    }
    
    // Check for CTA sections
    if ($('.cta-section, [class*="call-to-action"]').length > 0) {
      components.push('cta-section');
    }
    
    // Check for content sections
    if ($('article, .article, .post').length > 0) {
      components.push('article');
    }
    
    // Check for cards
    if ($('.card, [class*="card"]').length > 0) {
      components.push('cards');
    }
    
    // Check for breadcrumbs
    if ($('.breadcrumb, nav[aria-label="breadcrumb"]').length > 0) {
      components.push('breadcrumbs');
    }
    
    return components;
  }

  matchTemplate(url, features) {
    // Homepage detection
    if (url.endsWith('/') || url.endsWith('/index.html')) {
      return 'homepage';
    }
    
    // Marketplace/Product pages
    if (url.includes('/marketplace/')) {
      return 'marketplace-solution';
    }
    
    // Documentation pages
    if (url.includes('/docs/') || url.includes('/documentation/') || features.hasCodeBlocks) {
      return 'documentation';
    }
    
    // Form pages
    if (features.hasForm && !features.hasFeatureGrid) {
      return 'form-page';
    }
    
    // Landing pages
    if (features.hasHero && features.hasFeatureGrid && features.hasPricing) {
      return 'landing-page';
    }
    
    // Content pages
    if (features.columnLayout === 'single-column' && !features.hasFeatureGrid) {
      return 'content-page';
    }
    
    // Blog/Article pages
    if (url.includes('/blog/') || url.includes('/news/') || url.includes('/article/')) {
      return 'blog-post';
    }
    
    // Default fallback
    return 'generic-page';
  }

  async fetchPageHtml(url) {
    // In production, this would use the cached HTML from crawling
    // For now, we'll fetch it
    try {
      const fetch = (await import('node-fetch')).default;
      const response = await fetch(url);
      return await response.text();
    } catch (error) {
      console.error(`Failed to fetch ${url}:`, error.message);
      return '<html></html>';
    }
  }

  generateTemplateReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      totalPages: results.length,
      templates: {},
      components: {},
      buttonTypes: {
        primary: new Set(),
        secondary: new Set(),
        ghost: new Set(),
        icon: new Set()
      }
    };
    
    // Count template usage
    results.forEach(page => {
      if (!report.templates[page.template]) {
        report.templates[page.template] = {
          count: 0,
          pages: []
        };
      }
      report.templates[page.template].count++;
      report.templates[page.template].pages.push(page.url);
      
      // Aggregate button types
      Object.keys(page.buttons).forEach(type => {
        page.buttons[type].forEach(button => {
          report.buttonTypes[type].add(button.text);
        });
      });
      
      // Count component usage
      page.components.forEach(component => {
        if (!report.components[component]) {
          report.components[component] = 0;
        }
        report.components[component]++;
      });
    });
    
    // Convert sets to arrays
    Object.keys(report.buttonTypes).forEach(type => {
      report.buttonTypes[type] = Array.from(report.buttonTypes[type]);
    });
    
    return {
      report,
      pages: results
    };
  }

  async saveResults(analysisResults) {
    const outputDir = path.join(__dirname, 'output');
    
    // Save template analysis
    await fs.writeFile(
      path.join(outputDir, 'templates.json'),
      JSON.stringify(analysisResults.report, null, 2)
    );
    
    // Save page-template mapping
    await fs.writeFile(
      path.join(outputDir, 'page-templates.json'),
      JSON.stringify(analysisResults.pages, null, 2)
    );
    
    console.log('\nTemplate Analysis Complete!');
    console.log('Templates found:');
    Object.entries(analysisResults.report.templates).forEach(([template, data]) => {
      console.log(`  - ${template}: ${data.count} pages`);
    });
  }
}

// Run the analyzer
async function main() {
  const analyzer = new TemplateAnalyzer();
  
  try {
    const pagesFile = path.join(__dirname, 'output', 'pages.json');
    
    // Check if pages.json exists
    try {
      await fs.access(pagesFile);
    } catch {
      console.error('Please run crawl.js first to generate pages.json');
      process.exit(1);
    }
    
    const results = await analyzer.analyzePages(pagesFile);
    await analyzer.saveResults(results);
  } catch (error) {
    console.error('Analysis failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = TemplateAnalyzer;