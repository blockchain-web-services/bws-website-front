/**
 * ScrapFly API Client for X/Twitter Scraping
 * Handles anti-scraping protection and JavaScript rendering
 */

import https from 'https';
import { URL } from 'url';

class ScrapFlyClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.scrapfly.io/scrape';
  }

  /**
   * Scrape a URL using ScrapFly
   */
  async scrape(targetUrl, options = {}) {
    const {
      asp = true,                           // Anti Scraping Protection
      renderJs = true,                       // JavaScript rendering
      proxyPool = 'public_residential_pool', // Residential proxies
      country = 'us',                        // US proxies
      timeout = 150000,                      // 150 seconds
      session = null,                        // Session name
      format = 'json',                       // Response format (json includes xhr_call data)
      waitForSelector = null,                // CSS selector or xhr:Name to wait for
      screenshots = {},                      // Screenshots to take
      debug = false,                         // Debug mode
      cookies = null,                        // Cookies to inject
      autoScroll = false,                    // Auto-scroll for pagination
      jsScenario = null,                     // JavaScript scenario (base64 encoded)
      retry = true,                          // Retry on failure
    } = options;

    // Build query parameters
    const params = new URLSearchParams({
      key: this.apiKey,
      url: targetUrl,
    });

    // Add optional parameters
    if (asp) params.append('asp', 'true');
    if (renderJs) params.append('render_js', 'true');
    if (proxyPool) params.append('proxy_pool', proxyPool);
    if (country) params.append('country', country);
    if (timeout) params.append('timeout', timeout);
    if (session) params.append('session', session);
    if (format) params.append('format', format);
    if (waitForSelector) params.append('wait_for_selector', waitForSelector);
    if (autoScroll) params.append('auto_scroll', 'true');
    if (jsScenario) params.append('js_scenario', jsScenario);
    if (!retry) params.append('retry', 'false');
    if (debug) params.append('debug', 'true');

    // Add screenshots
    Object.entries(screenshots).forEach(([name, selector]) => {
      params.append(`screenshots[${name}]`, selector);
    });

    // Add cookies if provided
    if (cookies) {
      params.append('headers[Cookie]', cookies);
    }

    const apiUrl = `${this.baseUrl}?${params.toString()}`;

    console.log(`   🌐 ScrapFly request: ${targetUrl}`);
    console.log(`   📍 Proxy: ${proxyPool} (${country})`);
    if (session) console.log(`   🔑 Session: ${session}`);

    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(apiUrl);

      const requestOptions = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      };

      const req = https.request(requestOptions, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          // Log cost information
          const cost = res.headers['x-scrapfly-api-cost'];
          const remaining = res.headers['x-scrapfly-remaining-api-credit'];

          if (cost) console.log(`   💰 Cost: ${cost} credits`);
          if (remaining) console.log(`   💳 Remaining: ${remaining} credits`);

          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const result = JSON.parse(data);
              resolve(result);
            } catch (e) {
              reject(new Error(`Failed to parse response: ${e.message}`));
            }
          } else {
            // Handle ScrapFly errors
            const rejectCode = res.headers['x-scrapfly-reject-code'];
            const rejectDesc = res.headers['x-scrapfly-reject-description'];
            const retryable = res.headers['x-scrapfly-reject-retryable'];

            let errorMsg = `ScrapFly error ${res.statusCode}`;
            if (rejectCode) errorMsg += ` - ${rejectCode}`;
            if (rejectDesc) errorMsg += `\n   ${rejectDesc}`;
            if (retryable) errorMsg += `\n   Retryable: ${retryable}`;

            reject(new Error(errorMsg));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });

      req.setTimeout(timeout + 5000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  /**
   * Search X/Twitter
   * ⚠️ REQUIRES AUTHENTICATION - X shows login wall without valid cookies
   * Use cookies parameter to pass authenticated session cookies
   */
  async searchTwitter(query, options = {}) {
    const searchUrl = `https://x.com/search?q=${encodeURIComponent(query)}&src=typed_query&f=live`;

    return this.scrape(searchUrl, {
      asp: true,
      renderJs: true,
      proxyPool: 'public_residential_pool',
      country: 'us',
      format: 'json',  // JSON includes xhr_call data
      autoScroll: true,  // Auto-scroll to load more results
      ...options,
    });
  }

  /**
   * Get user profile with XHR data
   * Returns JSON format including browser_data with xhr_call array
   * Note: Public profiles work without authentication
   */
  async getUserProfile(username, options = {}) {
    const profileUrl = `https://x.com/${username}`;

    return this.scrape(profileUrl, {
      asp: true,
      renderJs: true,
      proxyPool: 'public_residential_pool',
      country: 'us',
      format: 'json',  // JSON includes xhr_call data
      waitForSelector: 'xhr:UserBy',  // Wait for user data XHR call
      autoScroll: true,  // Auto-scroll to load tweets
      ...options,
    });
  }

  /**
   * Get tweet details
   * Note: Does not wait for tweet selector by default since X may show login wall
   * Pass waitForSelector: 'article[data-testid="tweet"]' if you have valid cookies
   */
  async getTweet(tweetUrl, options = {}) {
    return this.scrape(tweetUrl, {
      asp: true,
      renderJs: true,
      proxyPool: 'public_residential_pool',
      country: 'us',
      renderingWait: 2000,
      format: 'raw',
      ...options,
    });
  }
}

export default ScrapFlyClient;
