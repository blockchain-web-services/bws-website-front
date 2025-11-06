/**
 * Debug ScrapFly response structure
 */

import ScrapFlyClient from './utils/scrapfly-client.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, 'config/x-crawler-accounts.json');

async function debugResponse() {
  const configData = await fs.readFile(CONFIG_PATH, 'utf-8');
  const config = JSON.parse(configData);
  const apiKey = config.scrapfly?.apiKey || config.scrapfly?.api_key;

  const client = new ScrapFlyClient(apiKey);

  try {
    console.log('🔍 Debugging ScrapFly response structure...\n');

    const result = await client.scrape('https://x.com/login', {
      renderJs: true,
      format: 'json',
      retry: false,
      timeout: 60000,
    });

    console.log('📊 Response structure:');
    console.log('   Top-level keys:', Object.keys(result));
    console.log();

    if (result.result) {
      console.log('   result keys:', Object.keys(result.result));
      console.log();

      // Check each field
      const fields = ['content', 'scrape_result', 'browser_data'];
      for (const field of fields) {
        if (result.result[field]) {
          const value = result.result[field];
          const type = typeof value;
          if (type === 'object') {
            console.log(`   result.${field} (object):`, Object.keys(value));
          } else if (type === 'string') {
            console.log(`   result.${field} (string): ${value.length} chars`);
          } else {
            console.log(`   result.${field} (${type})`);
          }
        }
      }
    }

    // Save full response
    await fs.writeFile(
      '/tmp/scrapfly-response-structure.json',
      JSON.stringify(result, null, 2)
    );

    console.log('\n💾 Full response saved to: /tmp/scrapfly-response-structure.json');
    console.log('   Review this file to find where the HTML is located\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

debugResponse();
