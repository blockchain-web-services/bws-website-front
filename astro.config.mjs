import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Canonical production URL — required for sitemap and absolute URLs
  site: 'https://www.bws.ninja',

  // Generate sitemap-index.xml + sitemap-0.xml at build time.
  // Exclude noindex redirect stubs and the 404 page.
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/marketplace/database-immutable') &&
        !page.includes('/marketplace/database-mutable') &&
        !page.includes('/404'),
    }),
  ],

  // Keep existing file structure
  outDir: './_site',

  // Use public directory for static assets
  publicDir: './public',

  // Build settings
  build: {
    format: 'file',
    assets: 'assets'
  },

  // Server settings for development
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 4321,
    host: true
  },

  // Preview server settings
  preview: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 4321,
    host: true
  },

  // Disable telemetry
  telemetry: false,

  // Keep paths as they are
  base: '/',
  trailingSlash: 'ignore'
});