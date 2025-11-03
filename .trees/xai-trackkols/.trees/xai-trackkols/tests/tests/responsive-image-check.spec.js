import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4321';

const INDUSTRY_PAGES = [
  'financial-services',
  'content-creation',
  'esg',
  'legal',
  'retail',
  'supply-chain'
];

const VIEWPORT_SIZES = [
  { width: 375, height: 667, name: 'mobile' },    // iPhone SE
  { width: 768, height: 1024, name: 'tablet' },   // iPad
  { width: 1440, height: 900, name: 'desktop' },  // Desktop
  { width: 1920, height: 1080, name: 'large' }    // Large desktop
];

// File removed - all tests were skipped and redundant with core image tests