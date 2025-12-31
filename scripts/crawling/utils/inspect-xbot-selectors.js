#!/usr/bin/env node

/**
 * X Bot Selector Discovery Tool
 *
 * This script inspects xbot.ninja to identify CSS selectors for:
 * - Top X Accounts leaderboard
 * - Top Hashtags leaderboard
 * - Individual item elements
 * - Username, score, and rank change elements
 *
 * Run this locally with a visible browser to manually inspect the DOM.
 */

import playwright from 'playwright';
import fs from 'fs';
import path from 'path';

async function discoverSelectors() {
  console.log('🔍 X Bot Selector Discovery Tool\n');
  console.log('This will open xbot.ninja in a visible browser window.');
  console.log('The script will test common selector patterns and report findings.\n');

  const browser = await playwright.chromium.launch({
    headless: false,  // Visible browser for manual inspection
    slowMo: 500       // Slow down actions for visibility
  });

  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  try {
    console.log('📂 Navigating to https://xbot.ninja...');
    await page.goto('https://xbot.ninja', {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    console.log('⏳ Waiting for content to load (10 seconds)...');
    await page.waitForTimeout(10000);

    console.log('\n' + '='.repeat(70));
    console.log('TESTING SELECTOR PATTERNS');
    console.log('='.repeat(70) + '\n');

    // Get page HTML for reference
    const html = await page.content();

    // Save HTML for inspection
    const htmlPath = path.join(process.cwd(), 'xbot-page.html');
    fs.writeFileSync(htmlPath, html);
    console.log(`📄 Saved page HTML to: ${htmlPath}\n`);

    // Test common patterns for containers
    const containerPatterns = {
      'Accounts Container': [
        'div[class*="account"]',
        'div[id*="account"]',
        '[data-type="accounts"]',
        '.accounts-leaderboard',
        '#accounts-section',
        'section:has-text("Top X Accounts")',
        'div:has-text("Top X Accounts by Performance")'
      ],
      'Hashtags Container': [
        'div[class*="hashtag"]',
        'div[id*="hashtag"]',
        '[data-type="hashtags"]',
        '.hashtags-leaderboard',
        '#hashtags-section',
        'section:has-text("Top Hashtags")',
        'div:has-text("Top Hashtags by Engagement")'
      ]
    };

    const results = {};

    for (const [name, selectors] of Object.entries(containerPatterns)) {
      console.log(`\n📦 ${name}:`);
      results[name] = [];

      for (const selector of selectors) {
        try {
          const elements = await page.$$(selector);
          if (elements.length > 0) {
            const text = await elements[0].textContent();
            const preview = text.substring(0, 100).replace(/\n/g, ' ');
            console.log(`  ✅ ${selector}`);
            console.log(`     Found: ${elements.length} element(s)`);
            console.log(`     Preview: "${preview}..."`);

            // Get class names for reference
            const className = await elements[0].evaluate(el => el.className);
            if (className) {
              console.log(`     Classes: ${className}`);
            }

            results[name].push({
              selector,
              count: elements.length,
              preview,
              className
            });
          }
        } catch (error) {
          // Selector not found or invalid, skip silently
        }
      }

      if (results[name].length === 0) {
        console.log(`  ❌ No elements found with tested patterns`);
      }
    }

    // Test for leaderboard items
    console.log('\n\n📋 Leaderboard Items:');
    const itemPatterns = [
      'li',
      'tr',
      'div[class*="item"]',
      'div[class*="row"]',
      '[role="row"]',
      '.leaderboard-item',
      '[data-item]'
    ];

    results['Items'] = [];
    for (const selector of itemPatterns) {
      try {
        const elements = await page.$$(selector);
        if (elements.length > 0 && elements.length < 200) { // Reasonable number
          console.log(`  ✅ ${selector} - found ${elements.length} elements`);

          // Get sample text from first item
          const text = await elements[0].textContent();
          const preview = text.substring(0, 80).replace(/\n/g, ' ');
          console.log(`     First item: "${preview}..."`);

          results['Items'].push({
            selector,
            count: elements.length,
            preview
          });
        }
      } catch (error) {
        // Skip
      }
    }

    // Test for specific data elements
    console.log('\n\n🔢 Data Elements:');
    const dataPatterns = {
      'Username/Name': ['a', 'strong', 'b', '.username', '.name', '[class*="user"]', '[class*="name"]'],
      'Score/Points': ['.score', '.points', '[class*="score"]', '[class*="point"]', 'span'],
      'Rank/Position': ['.rank', '.position', '[class*="rank"]', '[class*="position"]'],
      'Change/Trend': ['.change', '.trend', '[class*="change"]', '[class*="trend"]', 'svg']
    };

    for (const [name, selectors] of Object.entries(dataPatterns)) {
      console.log(`\n  ${name}:`);
      let found = false;

      for (const selector of selectors) {
        try {
          const elements = await page.$$(selector);
          if (elements.length > 0 && elements.length < 500) {
            const text = await elements[0].textContent();
            if (text && text.trim().length > 0) {
              console.log(`    ✅ ${selector} - ${elements.length} elements - First: "${text.trim().substring(0, 40)}"`);
              found = true;
              break; // Found one that works, move to next category
            }
          }
        } catch (error) {
          // Skip
        }
      }

      if (!found) {
        console.log(`    ❌ No suitable elements found`);
      }
    }

    // Save results to JSON
    const resultsPath = path.join(process.cwd(), 'xbot-selectors-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    console.log(`\n💾 Saved selector test results to: ${resultsPath}`);

    // Manual inspection instructions
    console.log('\n\n' + '='.repeat(70));
    console.log('MANUAL INSPECTION REQUIRED');
    console.log('='.repeat(70));
    console.log('\nThe browser will stay open for 5 minutes for manual inspection.');
    console.log('\nPLEASE DO THE FOLLOWING:');
    console.log('\n1. Open DevTools (F12 or right-click → Inspect)');
    console.log('2. Find the "Top X Accounts" section');
    console.log('3. Right-click on the FIRST account item → Inspect');
    console.log('4. Note the following:');
    console.log('   - Container element selector (parent div/ul/table)');
    console.log('   - Individual item selector (each account row/card)');
    console.log('   - Username element selector');
    console.log('   - Score element selector');
    console.log('   - Rank change indicator (if visible)');
    console.log('\n5. Repeat for "Top Hashtags" section');
    console.log('6. Note the selectors in the format below\n');

    console.log('Expected format for feedback:');
    console.log('-'.repeat(70));
    console.log(`{
  "topAccounts": {
    "container": "CSS_SELECTOR_HERE",
    "item": "CSS_SELECTOR_HERE",
    "username": "CSS_SELECTOR_HERE",
    "score": "CSS_SELECTOR_HERE",
    "change": "CSS_SELECTOR_HERE (or null if not visible)"
  },
  "topHashtags": {
    "container": "CSS_SELECTOR_HERE",
    "item": "CSS_SELECTOR_HERE",
    "hashtag": "CSS_SELECTOR_HERE",
    "engagement": "CSS_SELECTOR_HERE",
    "change": "CSS_SELECTOR_HERE (or null if not visible)"
  }
}`);
    console.log('-'.repeat(70));

    console.log('\n⏰ Browser will close automatically in 5 minutes...');
    console.log('   Press Ctrl+C to close earlier.\n');

    await page.waitForTimeout(300000); // 5 minutes

  } catch (error) {
    console.error('\n❌ Error during inspection:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
    console.log('\n✅ Browser closed. Inspection complete.');
  }
}

// Run the discovery
discoverSelectors().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
