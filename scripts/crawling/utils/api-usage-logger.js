/**
 * API Usage Logger
 * Persistent logging of Twitter API usage to track quota consumption
 * and identify external usage or rate limit patterns
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ApiUsageLogger {
  constructor() {
    this.logFile = path.join(__dirname, '../data/api-usage-log.json');
    this.dailyFile = path.join(__dirname, '../data/api-usage-daily.json');
  }

  /**
   * Log an API posting attempt with full details
   */
  async logPostAttempt(data) {
    const entry = {
      timestamp: new Date().toISOString(),
      type: 'post_attempt',
      endpoint: 'tweets/reply',
      ...data
    };

    await this.appendToLog(entry);
    return entry;
  }

  /**
   * Log a rate limit error with details
   */
  async logRateLimitError(errorData) {
    const entry = {
      timestamp: new Date().toISOString(),
      type: 'rate_limit_error',
      endpoint: 'tweets/reply',
      error: '429 Rate Limit Exceeded',
      ...errorData
    };

    await this.appendToLog(entry);

    // Also update daily summary
    await this.updateDailySummary(entry);

    return entry;
  }

  /**
   * Log a successful post with rate limit info if available
   */
  async logSuccessfulPost(postData) {
    const entry = {
      timestamp: new Date().toISOString(),
      type: 'post_success',
      endpoint: 'tweets/reply',
      ...postData
    };

    await this.appendToLog(entry);
    await this.updateDailySummary(entry);

    return entry;
  }

  /**
   * Append entry to the main log file
   */
  async appendToLog(entry) {
    try {
      let log = [];

      // Try to read existing log
      try {
        const content = await fs.readFile(this.logFile, 'utf-8');
        log = JSON.parse(content);
      } catch (err) {
        // File doesn't exist or is invalid, start fresh
        log = [];
      }

      // Add new entry
      log.push(entry);

      // Keep only last 1000 entries to prevent file from growing too large
      if (log.length > 1000) {
        log = log.slice(-1000);
      }

      // Write back
      await fs.writeFile(this.logFile, JSON.stringify(log, null, 2));
    } catch (error) {
      console.error(`Failed to append to usage log: ${error.message}`);
    }
  }

  /**
   * Update daily usage summary
   */
  async updateDailySummary(entry) {
    try {
      const today = entry.timestamp.split('T')[0];

      let dailyData = {};

      // Try to read existing daily data
      try {
        const content = await fs.readFile(this.dailyFile, 'utf-8');
        dailyData = JSON.parse(content);
      } catch (err) {
        // File doesn't exist, start fresh
        dailyData = {};
      }

      // Initialize today's data if needed
      if (!dailyData[today]) {
        dailyData[today] = {
          date: today,
          postAttempts: 0,
          postSuccesses: 0,
          postFailures: 0,
          rateLimitErrors: 0,
          firstAttempt: entry.timestamp,
          lastAttempt: entry.timestamp,
          rateLimitDetails: []
        };
      }

      const dayData = dailyData[today];

      // Update counts
      if (entry.type === 'post_attempt' || entry.type === 'post_success') {
        dayData.postAttempts++;
      }

      if (entry.type === 'post_success') {
        dayData.postSuccesses++;
      }

      if (entry.type === 'rate_limit_error') {
        dayData.postFailures++;
        dayData.rateLimitErrors++;

        // Store rate limit details if available
        if (entry.limit || entry.remaining !== undefined) {
          dayData.rateLimitDetails.push({
            timestamp: entry.timestamp,
            limit: entry.limit,
            remaining: entry.remaining,
            used: entry.used,
            reset: entry.reset
          });
        }
      }

      dayData.lastAttempt = entry.timestamp;

      // Keep only last 30 days
      const dates = Object.keys(dailyData).sort();
      if (dates.length > 30) {
        const datesToRemove = dates.slice(0, dates.length - 30);
        datesToRemove.forEach(date => delete dailyData[date]);
      }

      // Write back
      await fs.writeFile(this.dailyFile, JSON.stringify(dailyData, null, 2));
    } catch (error) {
      console.error(`Failed to update daily summary: ${error.message}`);
    }
  }

  /**
   * Get usage for a specific date
   */
  async getUsageForDate(date) {
    try {
      const content = await fs.readFile(this.dailyFile, 'utf-8');
      const dailyData = JSON.parse(content);
      return dailyData[date] || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get usage for today
   */
  async getTodayUsage() {
    const today = new Date().toISOString().split('T')[0];
    return this.getUsageForDate(today);
  }

  /**
   * Get all daily usage data
   */
  async getAllDailyUsage() {
    try {
      const content = await fs.readFile(this.dailyFile, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      return {};
    }
  }

  /**
   * Get recent log entries
   */
  async getRecentEntries(count = 20) {
    try {
      const content = await fs.readFile(this.logFile, 'utf-8');
      const log = JSON.parse(content);
      return log.slice(-count);
    } catch (error) {
      return [];
    }
  }

  /**
   * Display today's usage summary
   */
  async displayTodayUsage() {
    const usage = await this.getTodayUsage();

    if (!usage) {
      console.log('\n📊 No usage data for today yet');
      return;
    }

    console.log('\n' + '='.repeat(70));
    console.log('📊 TODAY\'S API USAGE SUMMARY');
    console.log('='.repeat(70));
    console.log(`\n📅 Date: ${usage.date}`);
    console.log(`⏰ First attempt: ${usage.firstAttempt.split('T')[1].substring(0, 8)}`);
    console.log(`⏰ Last attempt:  ${usage.lastAttempt.split('T')[1].substring(0, 8)}`);
    console.log(`\n📤 Post Attempts:      ${usage.postAttempts}`);
    console.log(`✅ Successful:         ${usage.postSuccesses} (${usage.postAttempts > 0 ? Math.round(usage.postSuccesses / usage.postAttempts * 100) : 0}%)`);
    console.log(`❌ Failed:             ${usage.postFailures} (${usage.postAttempts > 0 ? Math.round(usage.postFailures / usage.postAttempts * 100) : 0}%)`);
    console.log(`🚫 Rate Limit Errors:  ${usage.rateLimitErrors}`);

    // Show rate limit details if available
    if (usage.rateLimitDetails && usage.rateLimitDetails.length > 0) {
      console.log('\n📊 Rate Limit Details:');
      const latest = usage.rateLimitDetails[usage.rateLimitDetails.length - 1];
      if (latest.limit) {
        console.log(`   Daily Limit:    ${latest.limit} posts/24h`);
        console.log(`   Used Today:     ${latest.used || 'N/A'}`);
        console.log(`   Remaining:      ${latest.remaining || 'N/A'}`);

        if (latest.reset) {
          const resetTime = new Date(latest.reset);
          console.log(`   Resets At:      ${resetTime.toISOString()}`);

          const now = Date.now();
          const resetMs = resetTime.getTime();
          if (resetMs > now) {
            const minutesUntilReset = Math.round((resetMs - now) / 60000);
            console.log(`   Reset In:       ${minutesUntilReset} minutes`);
          }
        }

        // Calculate tier
        if (latest.limit === 17) {
          console.log(`   \n⚠️  TIER: FREE TIER (17 posts/24h)`);
          console.log(`   Recommendation: Upgrade to Basic tier ($100/month) for 100 posts/24h`);
        } else if (latest.limit === 100) {
          console.log(`   \n✅ TIER: BASIC TIER (100 posts/24h per user)`);
        } else if (latest.limit >= 1000) {
          console.log(`   \n✅ TIER: PRO/ENTERPRISE TIER`);
        }
      }
    }

    console.log('\n' + '='.repeat(70));
  }

  /**
   * Display last 7 days usage
   */
  async displayWeeklyUsage() {
    const allData = await this.getAllDailyUsage();
    const dates = Object.keys(allData).sort().slice(-7);

    if (dates.length === 0) {
      console.log('\n📊 No usage data available');
      return;
    }

    console.log('\n' + '='.repeat(70));
    console.log('📊 LAST 7 DAYS API USAGE');
    console.log('='.repeat(70));
    console.log('\n   Date         Attempts  Success  Failed  Rate Limited');
    console.log('   ' + '-'.repeat(66));

    for (const date of dates) {
      const data = allData[date];
      const successRate = data.postAttempts > 0
        ? `(${Math.round(data.postSuccesses / data.postAttempts * 100)}%)`
        : '';

      console.log(
        `   ${date}  ` +
        `${String(data.postAttempts).padStart(8)}  ` +
        `${String(data.postSuccesses).padStart(7)} ${successRate.padEnd(6)} ` +
        `${String(data.postFailures).padStart(6)}  ` +
        `${String(data.rateLimitErrors).padStart(13)}`
      );
    }

    console.log('   ' + '-'.repeat(66));

    // Calculate totals
    const totals = dates.reduce((acc, date) => {
      const data = allData[date];
      acc.attempts += data.postAttempts;
      acc.successes += data.postSuccesses;
      acc.failures += data.postFailures;
      acc.rateLimited += data.rateLimitErrors;
      return acc;
    }, { attempts: 0, successes: 0, failures: 0, rateLimited: 0 });

    const avgSuccessRate = totals.attempts > 0
      ? Math.round(totals.successes / totals.attempts * 100)
      : 0;

    console.log(
      `   TOTAL        ` +
      `${String(totals.attempts).padStart(8)}  ` +
      `${String(totals.successes).padStart(7)} (${avgSuccessRate}%)  ` +
      `${String(totals.failures).padStart(6)}  ` +
      `${String(totals.rateLimited).padStart(13)}`
    );

    console.log('\n' + '='.repeat(70));
  }

  /**
   * Export all usage data for analysis
   */
  async exportUsageData() {
    const log = await this.getRecentEntries(1000);
    const daily = await this.getAllDailyUsage();

    return {
      timestamp: new Date().toISOString(),
      recentLog: log,
      dailySummary: daily
    };
  }
}

// Singleton instance
const usageLogger = new ApiUsageLogger();

export default usageLogger;
export { ApiUsageLogger };
