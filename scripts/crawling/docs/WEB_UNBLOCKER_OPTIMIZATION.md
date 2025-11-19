# Web Unblocker Performance Optimization Strategies

## Key Findings from Documentation Research

### 1. **Rendering is the Main Bottleneck** ⚠️

- **With rendering** (`X-Oxylabs-Render: html`): 50-95+ seconds per page
- **Without rendering**: Still slow (~60s) but potentially faster
- **Rendering timeout requirement**: 180 seconds
- **Rendering traffic cost**: Consumes more bandwidth than non-rendered requests

### 2. **Session Reuse** (X-Oxylabs-Session-Id) ✅

**Benefits:**
- Maintains same IP for up to **10 minutes**
- Reduces proxy handshake overhead
- Improves consistency for multi-request scraping

**Implementation:**
```javascript
extraHTTPHeaders: {
  'X-Oxylabs-Session-Id': 'random-session-123'  // Reuse same proxy
}
```

### 3. **Disable Rendering** (When Possible) ✅

**How to disable:**
```javascript
extraHTTPHeaders: {
  'X-Oxylabs-Render': ''  // Empty value = disable rendering
}
```

**Important:** Twitter/X may be on auto-render list. Need to test if disabling works.

### 4. **Avoid Custom Parameters** ⚠️

Documentation warns:
> "For optimal website unblocking, Web Unblocker employs pre-defined sessions. Refrain from sending any custom parameters commonly used for unblocking."

This means:
- Don't add custom User-Agent headers
- Don't add custom cookies
- Let Web Unblocker handle fingerprinting

**But we need cookies for authentication!** This may conflict with optimization.

### 5. **Geo-Location Targeting** (X-Oxylabs-Geo-Location)

**May improve speed** by routing through nearby proxies:
```javascript
extraHTTPHeaders: {
  'X-Oxylabs-Geo-Location': 'Spain'  // Match our account country
}
```

---

## Optimization Strategies to Test

### Strategy 1: Disable Rendering + GraphQL Interception ✅ **BEST OPTION**

**Theory:**
- Disable `X-Oxylabs-Render` header
- Let page load in local Playwright browser
- Intercept GraphQL responses (our original approach!)
- Should be much faster

**Implementation:**
```javascript
const context = await browser.newContext({
  extraHTTPHeaders: {
    'X-Oxylabs-Render': '',  // Disable server-side rendering
    'X-Oxylabs-Session-Id': sessionId,  // Reuse same proxy
    'x-csrf-token': account.cookies.ct0  // Still need auth
  },
  ignoreHTTPSErrors: true
});

// Add cookies for authentication
await context.addCookies(cookies);

// Set up GraphQL listener (our original approach)
page.on('response', async (response) => {
  if (url.includes('UserByScreenName')) {
    const data = await response.json();
    // Extract profile
  }
});
```

**Expected Performance:** 10-20 seconds per page (vs. 50-95s)

---

### Strategy 2: Session Reuse Across Profiles ✅

**Theory:**
- Use same session ID for all 146 profiles
- Reduces proxy switching overhead
- 10-minute session window should cover all profiles

**Implementation:**
```javascript
const sessionId = `kol-discovery-${Date.now()}`;  // Same for all profiles

// Reuse for each profile
extraHTTPHeaders: {
  'X-Oxylabs-Session-Id': sessionId
}
```

**Expected Benefit:** 5-10% speed improvement

---

### Strategy 3: Parallel Processing (If Safe) ⚠️

**Theory:**
- Process multiple profiles simultaneously
- Reduces total wall-clock time
- Risk: May trigger rate limiting

**Implementation:**
```javascript
// Process 3-5 profiles in parallel
const chunks = chunkArray(usernames, 3);

for (const chunk of chunks) {
  await Promise.all(chunk.map(username => fetchProfile(username)));
}
```

**Expected Benefit:** 3-5x total time reduction (but same per-profile time)

---

### Strategy 4: Remove Unnecessary Waits ✅

**Current code has delays:**
```javascript
await page.waitForTimeout(5000);  // Waiting 5 seconds for GraphQL
```

**Optimization:**
- Use event-based waiting instead of fixed timeouts
- Exit as soon as GraphQL response is captured

**Expected Benefit:** 5-10 seconds per profile

---

### Strategy 5: Skip Rendering Header Entirely ✅ **TEST FIRST**

**Theory:**
- Don't send `X-Oxylabs-Render` at all
- Web Unblocker may auto-detect if rendering is needed
- Potentially faster for simple pages

**Implementation:**
```javascript
extraHTTPHeaders: {
  // NO X-Oxylabs-Render header
  'X-Oxylabs-Session-Id': sessionId,
  'x-csrf-token': account.cookies.ct0
}
```

**Expected Performance:** Unknown - need to test

---

## Recommended Implementation Order

### Phase 1: Quick Wins (Implement First) ✅

1. **Remove `X-Oxylabs-Render: html` header** - Test with empty value or omit entirely
2. **Add session reuse** - Use same session ID for all profiles
3. **Optimize waits** - Event-based instead of fixed timeouts
4. **Add geo-location** - Match account country

**Expected improvement:** 50-95s → 15-30s per profile

---

### Phase 2: Advanced Optimizations

1. **GraphQL interception** - If rendering disabled, revert to our original approach
2. **Parallel processing** - Process 3-5 profiles simultaneously
3. **Timeout tuning** - Reduce from 180s to 60s if rendering is disabled

**Expected improvement:** 15-30s → 10-20s per profile, 3-5x faster total time

---

### Phase 3: Fallback Strategy

If optimizations don't work:
1. **Keep HTML parsing** with rendering (slow but reliable)
2. **Implement caching** - Cache successful profiles for 24 hours
3. **Incremental processing** - Only check new/updated profiles

---

## Performance Targets

| Approach | Per Profile | 146 Profiles | Acceptable? |
|----------|-------------|--------------|-------------|
| **Current (with render)** | 50-95s | 2+ hours | ❌ No |
| **Optimized (no render)** | 15-30s | 35-75 min | ⚠️ Marginal |
| **Optimized + parallel (3x)** | 15-30s | 12-25 min | ✅ Yes |
| **Best case (GraphQL)** | 10-20s | 5-15 min (parallel) | ✅ Ideal |

---

## Implementation Plan

1. ✅ Create optimized crawler without rendering
2. ✅ Test with 1-3 profiles
3. ✅ Benchmark performance
4. ✅ If successful (< 20s/profile): Deploy to production
5. ⚠️ If still slow: Add parallel processing
6. ❌ If still unacceptable: Escalate to Web Scraper API

---

## Code Changes Required

### File: `twitter-crawler-web-unblocker.js`

**Remove:**
```javascript
'X-Oxylabs-Render': 'html',  // DELETE THIS
```

**Add:**
```javascript
'X-Oxylabs-Session-Id': `kol-discovery-${Date.now()}`,  // Session reuse
'X-Oxylabs-Geo-Location': account.country || 'Spain',  // Geo-targeting
```

**Change:**
```javascript
// FROM:
await page.goto(url, { waitUntil: 'networkidle', timeout: 180000 });
await page.waitForTimeout(2000);
const profile = await parseProfileFromHTML(page, username);

// TO:
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

// Set up GraphQL listener
page.on('response', async (response) => {
  if (response.url().includes('UserByScreenName')) {
    const data = await response.json();
    profile = parseUserProfile(data);  // Use GraphQL parser!
  }
});

// Wait for GraphQL response (event-based)
await page.waitForResponse(
  response => response.url().includes('UserByScreenName'),
  { timeout: 30000 }
);
```

---

## Next Steps

1. Implement Strategy 1 (disable rendering + GraphQL)
2. Test with 3 profiles
3. Measure:
   - Time per profile
   - Success rate
   - Data completeness
4. If successful: Roll out to all profiles
5. Document final performance metrics
