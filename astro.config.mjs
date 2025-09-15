import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
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
    port: 8081,
    host: true
  },

  // Disable telemetry
  telemetry: false,

  // Keep paths as they are
  base: '/',
  trailingSlash: 'ignore'
});