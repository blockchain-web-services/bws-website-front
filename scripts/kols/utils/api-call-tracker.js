/**
 * API Call Tracker
 * Tracks Twitter API calls, posts fetched, and displays consumption statistics
 */

class ApiCallTracker {
  constructor() {
    this.reset();
  }

  reset() {
    this.calls = [];
    this.startTime = Date.now();
  }

  /**
   * Record an API call
   * @param {string} endpoint - API endpoint (e.g., 'search/recent', 'users/by/username')
   * @param {number} itemsFetched - Number of items (tweets/users) returned
   * @param {boolean} success - Whether the call succeeded
   * @param {string|null} error - Error message if failed
   */
  recordCall(endpoint, itemsFetched = 0, success = true, error = null) {
    this.calls.push({
      timestamp: new Date().toISOString(),
      endpoint,
      itemsFetched,
      success,
      error,
      duration: Date.now() - this.startTime
    });
  }

  /**
   * Get statistics grouped by endpoint
   */
  getStatsByEndpoint() {
    const stats = {};

    for (const call of this.calls) {
      if (!stats[call.endpoint]) {
        stats[call.endpoint] = {
          totalCalls: 0,
          successfulCalls: 0,
          failedCalls: 0,
          totalItemsFetched: 0,
          errors: []
        };
      }

      const endpointStats = stats[call.endpoint];
      endpointStats.totalCalls++;

      if (call.success) {
        endpointStats.successfulCalls++;
        endpointStats.totalItemsFetched += call.itemsFetched;
      } else {
        endpointStats.failedCalls++;
        if (call.error && !endpointStats.errors.includes(call.error)) {
          endpointStats.errors.push(call.error);
        }
      }
    }

    return stats;
  }

  /**
   * Get overall statistics
   */
  getOverallStats() {
    const totalCalls = this.calls.length;
    const successfulCalls = this.calls.filter(c => c.success).length;
    const failedCalls = this.calls.filter(c => !c.success).length;
    const totalItemsFetched = this.calls
      .filter(c => c.success)
      .reduce((sum, c) => sum + c.itemsFetched, 0);

    const duration = Date.now() - this.startTime;
    const durationSeconds = (duration / 1000).toFixed(1);
    const callsPerMinute = totalCalls > 0
      ? ((totalCalls / duration) * 60000).toFixed(1)
      : 0;

    return {
      totalCalls,
      successfulCalls,
      failedCalls,
      totalItemsFetched,
      duration: durationSeconds,
      callsPerMinute
    };
  }

  /**
   * Display comprehensive statistics
   */
  displayStats() {
    const overall = this.getOverallStats();
    const byEndpoint = this.getStatsByEndpoint();

    console.log('\n' + '='.repeat(70));
    console.log('📊 API CONSUMPTION STATISTICS');
    console.log('='.repeat(70));

    console.log('\n🌍 OVERALL SUMMARY:');
    console.log(`   Total API Calls:       ${overall.totalCalls}`);
    console.log(`   Successful:            ${overall.successfulCalls} ✅`);
    console.log(`   Failed:                ${overall.failedCalls} ❌`);
    console.log(`   Total Items Fetched:   ${overall.totalItemsFetched} (tweets/users)`);
    console.log(`   Duration:              ${overall.duration}s`);
    console.log(`   Rate:                  ${overall.callsPerMinute} calls/minute`);

    if (Object.keys(byEndpoint).length > 0) {
      console.log('\n📍 BY ENDPOINT:');
      console.log('   ' + '-'.repeat(66));
      console.log('   Endpoint                      Calls  Success  Failed  Items');
      console.log('   ' + '-'.repeat(66));

      // Sort endpoints by total calls (descending)
      const sortedEndpoints = Object.entries(byEndpoint)
        .sort(([, a], [, b]) => b.totalCalls - a.totalCalls);

      for (const [endpoint, stats] of sortedEndpoints) {
        const endpointShort = endpoint.length > 28
          ? endpoint.substring(0, 25) + '...'
          : endpoint;

        console.log(
          `   ${endpointShort.padEnd(28)} ` +
          `${String(stats.totalCalls).padStart(6)} ` +
          `${String(stats.successfulCalls).padStart(7)} ` +
          `${String(stats.failedCalls).padStart(7)} ` +
          `${String(stats.totalItemsFetched).padStart(6)}`
        );

        // Show errors if any
        if (stats.errors.length > 0) {
          for (const error of stats.errors) {
            console.log(`      ❌ Error: ${error}`);
          }
        }
      }
      console.log('   ' + '-'.repeat(66));
    }

    console.log('\n' + '='.repeat(70));
  }

  /**
   * Display compact summary (for inline logging)
   */
  displayCompactSummary() {
    const overall = this.getOverallStats();
    console.log(
      `\n📊 API Summary: ${overall.totalCalls} calls ` +
      `(✅ ${overall.successfulCalls}, ❌ ${overall.failedCalls}), ` +
      `${overall.totalItemsFetched} items fetched in ${overall.duration}s`
    );
  }

  /**
   * Export statistics as JSON
   */
  exportStats() {
    return {
      timestamp: new Date().toISOString(),
      overall: this.getOverallStats(),
      byEndpoint: this.getStatsByEndpoint(),
      calls: this.calls
    };
  }
}

// Singleton instance
const tracker = new ApiCallTracker();

export default tracker;
export { ApiCallTracker };
