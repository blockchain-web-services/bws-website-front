import { config as dotenvConfig } from 'dotenv';
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenvConfig({ path: path.join(__dirname, '../../../.env') });

async function test() {
  const browser = await chromium.launch({
    headless: true,
    proxy: {
      server: 'https://unblock.oxylabs.io:60000',
      username: process.env.OXYLABS_USERNAME,
      password: process.env.OXYLABS_PASSWORD
    },
  });

  const context = await browser.newContext({
    extraHTTPHeaders: {
      'X-Oxylabs-Session-Id': 'test-123'
    },
    ignoreHTTPSErrors: true
  });

  const page = await context.newPage();
  
  await page.goto('https://x.com/elonmusk', { timeout: 60000 });
  
  const content = await page.content();
  console.log('Page length:', content.length);
  console.log('Has React:', content.includes('react'));
  console.log('Has script tags:', (content.match(/<script/g) || []).length);
  console.log('Has data:', content.includes('elonmusk') || content.includes('Elon'));
  
  await browser.close();
}

test();
