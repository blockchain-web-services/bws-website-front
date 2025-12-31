#!/usr/bin/env node

/**
 * Debug X Bot Account Extraction
 *
 * Detailed logging of how we extract the top account from xbot.ninja
 */

import playwright from 'playwright';

async function debugAccountExtraction() {
  console.log('🔍 Debug X Bot Account Extraction\n');

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

    console.log('⏳ Waiting for content to load...');
    const accountXPath = '/html/body/main/div/section[3]/div[2]/div[3]/div/div[2]/div[2]/div[1]/div[1]/div[1]';
    await page.waitForSelector(`xpath=${accountXPath}`, { timeout: 30000 });
    console.log('✅ Account section loaded\n');

    // Get the base XPath container
    const baseXPath = '/html/body/main/div/section[3]/div[2]/div[3]/div/div[2]/div[2]/div[1]/div[1]';
    console.log(`Base XPath: ${baseXPath}\n`);

    // Get all account items
    const accountItems = await page.$$(`xpath=${baseXPath}/div`);
    console.log(`Found ${accountItems.length} account items\n`);

    // Inspect each account item
    for (let i = 0; i < accountItems.length; i++) {
      console.log(`${'='.repeat(70)}`);
      console.log(`ACCOUNT ITEM #${i + 1}`);
      console.log(`${'='.repeat(70)}\n`);

      const item = accountItems[i];

      // Get full HTML of this item
      const itemHTML = await item.innerHTML();
      console.log(`Full HTML of item #${i + 1}:`);
      console.log(itemHTML.substring(0, 500));
      console.log('...\n');

      // Check for div[2] using XPath
      const dataContainers = await item.$$('xpath=./div[2]');
      console.log(`div[2] containers found: ${dataContainers.length}`);

      if (dataContainers.length > 0) {
        const dataContainer = dataContainers[0];

        // Get all divs within div[2]
        const innerDivs = await dataContainer.$$('div');
        console.log(`Inner divs in div[2]: ${innerDivs.length}\n`);

        // Extract text from each div
        for (let j = 0; j < innerDivs.length; j++) {
          const text = await innerDivs[j].textContent();
          console.log(`  div[${j}] text: "${text.trim()}"`);
        }

        console.log('');

        // Our extraction logic
        if (innerDivs.length >= 2) {
          const username = (await innerDivs[0].textContent()).trim();
          const displayName = (await innerDivs[1].textContent()).trim();

          console.log(`Extracted data:`);
          console.log(`  Username (div[0]): "${username}"`);
          console.log(`  Display Name (div[1]): "${displayName}"`);
          console.log(`  Clean username: "${username.replace(/^@/, '')}"`);
        }
      } else {
        console.log('❌ No div[2] found in this item');
      }

      console.log('');
    }

    console.log(`${'='.repeat(70)}`);
    console.log('SUMMARY');
    console.log(`${'='.repeat(70)}\n`);

    // Now run the actual extraction as the scraper does
    const firstItemDataContainers = await accountItems[0].$$('xpath=./div[2]');
    if (firstItemDataContainers.length > 0) {
      const divs = await firstItemDataContainers[0].$$('div');
      if (divs.length >= 2) {
        const username = (await divs[0].textContent()).trim();
        const displayName = (await divs[1].textContent()).trim();
        const cleanUsername = username.replace(/^@/, '');

        console.log('✅ Top Account Extracted:');
        console.log(`   Raw username from HTML: "${username}"`);
        console.log(`   Cleaned username: "${cleanUsername}"`);
        console.log(`   Display name: "${displayName}"`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
    console.log('\n🔒 Browser closed.');
  }
}

debugAccountExtraction().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
