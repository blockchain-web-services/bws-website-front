#!/usr/bin/env node

/**
 * Verify the EXACT XPath provided by user
 *
 * User provided:
 * Top account XPath: /html/body/main/div/section[3]/div[2]/div[3]/div/div[2]/div[2]/div[1]/div[1]/div[1]/div[2]
 * This element contains 2 divs for username and display name
 */

import playwright from 'playwright';

async function verifyExactXPath() {
  console.log('🔍 Verifying EXACT XPath from User\n');

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

    console.log('⏳ Waiting 10 seconds for full load...');
    await page.waitForTimeout(10000);

    // The EXACT XPath the user provided
    const exactXPath = '/html/body/main/div/section[3]/div[2]/div[3]/div/div[2]/div[2]/div[1]/div[1]/div[1]/div[2]';

    console.log(`\nTesting EXACT XPath from user:`);
    console.log(`${exactXPath}\n`);

    const elements = await page.$$(`xpath=${exactXPath}`);
    console.log(`Elements found: ${elements.length}\n`);

    if (elements.length > 0) {
      const element = elements[0];

      // Get full HTML
      const html = await element.innerHTML();
      console.log(`Full HTML of element:`);
      console.log(html);
      console.log('\n');

      // Get all child divs
      const divs = await element.$$('div');
      console.log(`Child divs found: ${divs.length}\n`);

      for (let i = 0; i < divs.length; i++) {
        const text = await divs[i].textContent();
        const className = await divs[i].evaluate(el => el.className);
        console.log(`div[${i}]:`);
        console.log(`  Class: "${className}"`);
        console.log(`  Text: "${text.trim()}"`);
        console.log('');
      }

      if (divs.length >= 2) {
        const username = (await divs[0].textContent()).trim();
        const displayName = (await divs[1].textContent()).trim();

        console.log('✅ EXTRACTED DATA:');
        console.log(`   Username (raw): "${username}"`);
        console.log(`   Username (clean): "${username.replace(/^@/, '')}"`);
        console.log(`   Display Name: "${displayName}"`);
      }
    } else {
      console.log('❌ Element not found with exact XPath!');
      console.log('Let me try breaking down the path...\n');

      // Try each level
      const paths = [
        '/html/body/main/div/section[3]',
        '/html/body/main/div/section[3]/div[2]',
        '/html/body/main/div/section[3]/div[2]/div[3]',
        '/html/body/main/div/section[3]/div[2]/div[3]/div',
        '/html/body/main/div/section[3]/div[2]/div[3]/div/div[2]',
        '/html/body/main/div/section[3]/div[2]/div[3]/div/div[2]/div[2]',
        '/html/body/main/div/section[3]/div[2]/div[3]/div/div[2]/div[2]/div[1]',
        '/html/body/main/div/section[3]/div[2]/div[3]/div/div[2]/div[2]/div[1]/div[1]',
        '/html/body/main/div/section[3]/div[2]/div[3]/div/div[2]/div[2]/div[1]/div[1]/div[1]',
        '/html/body/main/div/section[3]/div[2]/div[3]/div/div[2]/div[2]/div[1]/div[1]/div[1]/div[2]'
      ];

      for (const path of paths) {
        const els = await page.$$(`xpath=${path}`);
        console.log(`${path} → ${els.length} element(s)`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
    console.log('\n🔒 Browser closed.');
  }
}

verifyExactXPath().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
