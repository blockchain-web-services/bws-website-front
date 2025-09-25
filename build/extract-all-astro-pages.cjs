const fs = require('fs');
const path = require('path');

// Function to replace CDN URLs with local paths
function replaceCdnUrls(html) {
  // Replace cdn.prod.website-files.com URLs with local assets
  return html.replace(/https:\/\/cdn\.prod\.website-files\.com\//g, '/assets/images/');
}

// Function to extract components from HTML
function extractComponents(html, pageName) {
  // Replace CDN URLs in the entire HTML first
  html = replaceCdnUrls(html);

  // Find the navigation section (from page-wrapper to hero section or main content)
  const navStart = html.indexOf('<div class="page-wrapper');
  let navEnd = html.indexOf('<div class="section hero-section');

  // For non-index pages, navigation might end at different sections
  if (navEnd === -1) {
    navEnd = html.indexOf('<section class="section');
    if (navEnd === -1) {
      navEnd = html.indexOf('<div class="section');
      if (navEnd === -1) {
        navEnd = html.indexOf('<main');
        if (navEnd === -1) {
          // For pages without clear sections, try to find where main content starts
          navEnd = html.indexOf('<div class="container');
        }
      }
    }
  }

  const hasNavigation = navStart !== -1 && navEnd !== -1 && navEnd > navStart;
  const navigation = hasNavigation ? html.substring(navStart, navEnd) : '';

  // Find the footer section
  const footerStart = html.indexOf('<footer class="footer">');
  const footerEnd = html.indexOf('</footer>') + '</footer>'.length;
  const hasFooter = footerStart !== -1 && footerEnd > footerStart;
  const footer = hasFooter ? html.substring(footerStart, footerEnd) : '';

  // Find the main content (between navigation/header and footer)
  let mainStart = hasNavigation ? navEnd : 0;
  let mainEnd = hasFooter ? footerStart : html.lastIndexOf('</body>');

  // Look for the main content area
  if (mainStart === 0) {
    // No navigation found, look for body start
    const bodyStart = html.indexOf('<body');
    if (bodyStart !== -1) {
      const bodyTagEnd = html.indexOf('>', bodyStart) + 1;
      mainStart = bodyTagEnd;
    }
  }

  const mainContent = html.substring(mainStart, mainEnd);

  // Extract scripts after footer and before </body>
  let scriptsStart = hasFooter ? footerEnd : mainEnd;
  const scriptsEnd = html.lastIndexOf('</body>');
  let scripts = '';

  if (scriptsStart !== -1 && scriptsEnd !== -1 && scriptsEnd > scriptsStart) {
    scripts = html.substring(scriptsStart, scriptsEnd);
    // Clean up scripts - remove empty script tags and pipedrive references
    scripts = scripts
      .replace(/<script[^>]*>[\s]*window\.pipedriveLeadboosterConfig[\s\S]*?<\/script>/gi, '')
      .replace(/<script[^>]*src="[^"]*loader\.js"[^>]*><\/script>/gi, '')
      .trim();
  }

  // Extract head content for page-specific meta tags
  const headStart = html.indexOf('<head>') + 6;
  const headEnd = html.indexOf('</head>');
  const headContent = html.substring(headStart, headEnd);

  // Extract title and description
  const titleMatch = headContent.match(/<title>([^<]*)<\/title>/);
  const descMatch = headContent.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/);

  const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : 'Blockchain Web Services';
  const description = descMatch ? descMatch[1].replace(/\s+/g, ' ').trim() : 'Blockchain Web Services - Enterprise blockchain solutions';

  return {
    title,
    description,
    navigation: replaceCdnUrls(navigation),
    mainContent: replaceCdnUrls(mainContent),
    footer: replaceCdnUrls(footer),
    scripts: replaceCdnUrls(scripts),
    hasNavigation,
    hasFooter
  };
}

// Function to create Astro page component
function createAstroPage(components, pageName) {
  const { title, description, mainContent, hasNavigation, hasFooter, scripts } = components;

  // Determine which components to import
  const depth = pageName.split('/').length - 1;
  const prefix = depth > 0 ? '../'.repeat(depth) : '';

  const imports = [`import BaseLayout from '${prefix}../layouts/BaseLayout.astro';`];

  if (hasNavigation) {
    imports.push(`import Navigation from '${prefix}../components/Navigation.astro';`);
  }

  if (hasFooter) {
    imports.push(`import Footer from '${prefix}../components/Footer.astro';`);
  }

  // Check if we need Scripts component (excluding pipedrive)
  const hasScripts = scripts && scripts.includes('<script');
  if (hasScripts) {
    imports.push(`import Scripts from '${prefix}../components/Scripts.astro';`);
  }

  // Create the main content component name
  const mainComponentName = `${pageName.replace(/[^a-zA-Z0-9]/g, '')}MainContent`;
  imports.push(`import ${mainComponentName} from '${prefix}../components/${mainComponentName}.astro';`);

  let astroContent = `---
${imports.join('\n')}

const pageTitle = '${title.replace(/'/g, "\\'")}';
const pageDescription = '${description.replace(/'/g, "\\'")}';
---

<BaseLayout title={pageTitle} description={pageDescription}>
`;

  if (hasNavigation) {
    astroContent += `  <Navigation />\n`;
  }

  astroContent += `  <${mainComponentName} />\n`;

  if (hasFooter) {
    astroContent += `  <Footer />\n`;
  }

  if (hasScripts) {
    astroContent += `
  <Fragment slot="scripts">
    <Scripts />
  </Fragment>`;
  }

  astroContent += `
</BaseLayout>`;

  return { astroContent, mainComponentName };
}

// Main function to process all pages
async function processAllPages() {
  const backupDir = path.join(__dirname, '..', '_site_backup');
  const srcPagesDir = path.join(__dirname, '..', 'src', 'pages');
  const srcComponentsDir = path.join(__dirname, '..', 'src', 'components');

  // Ensure directories exist
  if (!fs.existsSync(srcPagesDir)) {
    fs.mkdirSync(srcPagesDir, { recursive: true });
  }

  // Get all HTML files from backup
  const htmlFiles = [];

  function findHtmlFiles(dir, basePath = '') {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const relativePath = path.join(basePath, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        findHtmlFiles(fullPath, relativePath);
      } else if (file.endsWith('.html')) {
        htmlFiles.push({ fullPath, relativePath: relativePath.replace(/\\/g, '/') });
      }
    }
  }

  findHtmlFiles(backupDir);

  console.log(`Found ${htmlFiles.length} HTML files to process`);

  // Process each HTML file
  for (const { fullPath, relativePath } of htmlFiles) {
    const pageName = relativePath.replace('.html', '');
    console.log(`Processing: ${pageName}`);

    // Skip index.html as it's already processed
    if (pageName === 'index') {
      console.log(`  Skipping index.html - already processed`);
      continue;
    }

    try {
      const html = fs.readFileSync(fullPath, 'utf-8');
      const components = extractComponents(html, pageName);

      // Skip if page has no real content
      if (!components.mainContent || components.mainContent.trim().length < 100) {
        console.log(`  Skipping ${pageName} - no significant content found`);
        continue;
      }

      // Create Astro page
      const { astroContent, mainComponentName } = createAstroPage(components, pageName);

      // Determine output paths
      const pageDir = path.dirname(pageName);
      const pageFileName = path.basename(pageName);

      // Create directory structure in src/pages
      if (pageDir && pageDir !== '.') {
        const targetPageDir = path.join(srcPagesDir, pageDir);
        if (!fs.existsSync(targetPageDir)) {
          fs.mkdirSync(targetPageDir, { recursive: true });
        }
      }

      // Write the Astro page
      const astroPagePath = path.join(srcPagesDir, `${pageName}.astro`);
      fs.writeFileSync(astroPagePath, astroContent);
      console.log(`  Created page: ${astroPagePath}`);

      // Write the main content component
      const mainContentPath = path.join(srcComponentsDir, `${mainComponentName}.astro`);
      const mainContentAstro = `---
// Main content for ${pageName} page
---

${components.mainContent}`;

      fs.writeFileSync(mainContentPath, mainContentAstro);
      console.log(`  Created component: ${mainContentPath}`);

    } catch (error) {
      console.error(`  Error processing ${pageName}:`, error.message);
    }
  }

  // Update Navigation and Footer components to use local assets
  const navPath = path.join(srcComponentsDir, 'Navigation.astro');
  if (fs.existsSync(navPath)) {
    let navContent = fs.readFileSync(navPath, 'utf-8');
    navContent = replaceCdnUrls(navContent);
    fs.writeFileSync(navPath, navContent);
    console.log('Updated Navigation component with local asset URLs');
  }

  const footerPath = path.join(srcComponentsDir, 'Footer.astro');
  if (fs.existsSync(footerPath)) {
    let footerContent = fs.readFileSync(footerPath, 'utf-8');
    footerContent = replaceCdnUrls(footerContent);
    fs.writeFileSync(footerPath, footerContent);
    console.log('Updated Footer component with local asset URLs');
  }

  // Update BaseLayout to use local assets
  const layoutPath = path.join(__dirname, '..', 'src', 'layouts', 'BaseLayout.astro');
  if (fs.existsSync(layoutPath)) {
    let layoutContent = fs.readFileSync(layoutPath, 'utf-8');
    layoutContent = replaceCdnUrls(layoutContent);
    fs.writeFileSync(layoutPath, layoutContent);
    console.log('Updated BaseLayout with local asset URLs');
  }

  // Update existing index components with local asset URLs
  const indexMainPath = path.join(srcComponentsDir, 'IndexMainContent.astro');
  if (fs.existsSync(indexMainPath)) {
    let indexContent = fs.readFileSync(indexMainPath, 'utf-8');
    indexContent = replaceCdnUrls(indexContent);
    fs.writeFileSync(indexMainPath, indexContent);
    console.log('Updated IndexMainContent component with local asset URLs');
  }

  console.log('\nAll pages processed successfully!');
  console.log('Run "npm run build" to build the site with all pages');
}

// Run the extraction
processAllPages().catch(console.error);