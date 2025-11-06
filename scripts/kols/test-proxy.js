/**
 * Test Oxylabs Proxy Connection
 * Verifies proxy credentials and connectivity
 */

import { PlaywrightCrawler, ProxyConfiguration } from 'crawlee';
import authManager from './utils/x-auth-manager.js';

async function testProxy() {
  console.log('🧪 Testing Oxylabs Proxy Connection\n');

  // Load config to get proxy credentials
  await authManager.initialize();

  if (!authManager.config.proxy || !authManager.config.proxy.username || !authManager.config.proxy.password) {
    console.log('❌ No proxy configured in x-crawler-accounts.json');
    return;
  }

  const { username, password } = authManager.config.proxy;
  const sessionId = 'test-session-123';
  const proxyUrl = `http://customer-${username}-sessid-${sessionId}:${password}@pr.oxylabs.io:7777`;

  console.log('📋 Proxy Configuration:');
  console.log(`   Username: customer-${username}`);
  console.log(`   Session: ${sessionId}`);
  console.log(`   Endpoint: pr.oxylabs.io:7777\n`);

  const proxyConfiguration = new ProxyConfiguration({
    proxyUrls: [proxyUrl],
  });

  return new Promise((resolve) => {
    let proxyInfo = null;

    const crawler = new PlaywrightCrawler({
      proxyConfiguration,
      launchContext: {
        launchOptions: {
          headless: true,
        },
      },
      maxRequestRetries: 0,
      requestHandlerTimeoutSecs: 30,

      async requestHandler({ page }) {
        try {
          console.log('🌐 Testing proxy connection...\n');

          // Get proxy IP info
          const content = await page.content();
          proxyInfo = JSON.parse(content.match(/<pre>(.*?)<\/pre>/)?.[1] || '{}');

          console.log('✅ Proxy Connection Successful!\n');
          console.log('📍 Proxy IP Information:');
          console.log(`   IP Address: ${proxyInfo.ip || 'N/A'}`);
          console.log(`   Country: ${proxyInfo.country || 'N/A'}`);
          console.log(`   City: ${proxyInfo.city || 'N/A'}`);
          console.log(`   ASN: ${proxyInfo.asn || 'N/A'}`);
          console.log(`   ISP: ${proxyInfo.isp || 'N/A'}\n');

        } catch (error) {
          console.error('❌ Proxy test failed:', error.message);
        }
      },
    });

    crawler.run(['https://ip.oxylabs.io/location'])
      .then(() => resolve(proxyInfo))
      .catch((error) => {
        console.error('❌ Proxy connection failed:', error.message);
        resolve(null);
      });
  });
}

// Run test
testProxy()
  .then(() => {
    console.log('✨ Proxy test complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  });
