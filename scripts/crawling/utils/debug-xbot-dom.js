#!/usr/bin/env node

/**
 * Debug script to inspect xbot.ninja DOM structure
 */

import playwright from 'playwright';
import fs from 'fs';

async function debugXBotDOM() {
  console.log('🔍 Debugging xbot.ninja DOM structure\n');

  const browser = await playwright.chromium.launch({
    headless: true
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

    console.log('⏳ Waiting for dynamic content to load...');
    await page.waitForTimeout(5000);

    // Scroll through page to trigger lazy loading
    console.log('   Scrolling to bottom to trigger lazy loading...');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(3000);

    console.log('   Scrolling to cashtagsList...');
    await page.evaluate(() => {
      const cashtagsEl = document.getElementById('cashtagsList');
      if (cashtagsEl) {
        cashtagsEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await page.waitForTimeout(5000);

    // Save full HTML
    const html = await page.content();
    fs.writeFileSync('xbot-debug.html', html);
    console.log('✅ Saved full HTML to xbot-debug.html');

    // Test cashtag XPath
    console.log('\n🔍 Testing cashtag XPath variations:');

    const xpaths = [
      '//*[@id="cashtagsList"]',
      '//*[@id="cashtagsList"]/div',
      '//div[@id="cashtagsList"]',
      '//div[@id="cashtagsList"]/div',
    ];

    for (const xpath of xpaths) {
      const elements = await page.$$(`xpath=${xpath}`);
      console.log(`   ${xpath} → ${elements.length} elements`);

      if (elements.length > 0) {
        const html = await elements[0].innerHTML();
        console.log(`   First element HTML (first 200 chars):\n   ${html.substring(0, 200)}`);
      }
    }

    // Check if element exists with ID
    console.log('\n🔍 Checking for elements with ID "cashtagsList":');
    const cashtagsListExists = await page.$('#cashtagsList');
    console.log(`   #cashtagsList exists: ${cashtagsListExists !== null}`);

    if (cashtagsListExists) {
      const innerHTML = await cashtagsListExists.innerHTML();
      fs.writeFileSync('cashtags-list-inner.html', innerHTML);
      console.log('   Saved inner HTML to cashtags-list-inner.html');
      console.log(`   Inner HTML length: ${innerHTML.length} characters`);
      console.log(`   First 500 chars:\n${innerHTML.substring(0, 500)}`);

      // Check children structure
      const childrenInfo = await page.evaluate(() => {
        const el = document.getElementById('cashtagsList');
        return {
          directChildren: el.children.length,
          firstChildTag: el.children[0]?.tagName,
          firstChildClasses: el.children[0]?.className,
          allHTML: el.innerHTML.substring(0, 1000)
        };
      });
      console.log(`   Direct children: ${childrenInfo.directChildren}`);
      console.log(`   First child: <${childrenInfo.firstChildTag} class="${childrenInfo.firstChildClasses}">`);
    }

    // Test account XPath to verify it's working
    console.log('\n🔍 Testing account XPath (for comparison):');
    const accountXPath = '/html/body/main/div/section[3]/div[2]/div[3]/div/div[2]/div[2]/div[1]/div[1]';
    const accountItems = await page.$$(`xpath=${accountXPath}/div`);
    console.log(`   ${accountXPath}/div → ${accountItems.length} elements`);

    if (accountItems.length > 0) {
      const firstAccountHTML = await accountItems[0].innerHTML();
      console.log(`   First account HTML (first 300 chars):\n   ${firstAccountHTML.substring(0, 300)}`);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await browser.close();
    console.log('\n🔒 Browser closed.');
  }
}

debugXBotDOM().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
