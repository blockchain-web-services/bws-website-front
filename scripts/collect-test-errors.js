#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Collects test errors from various sources and formats them for GitHub issue creation
 */
class TestErrorCollector {
  constructor() {
    this.errors = {
      testFailures: [],
      webServerErrors: [],
      buildErrors: [],
      jobLogs: [],
      summary: {
        total: 0,
        failed: 0,
        passed: 0,
        skipped: 0
      }
    };
  }

  /**
   * Parse Playwright JSON reporter output
   */
  parsePlaywrightResults(jsonPath) {
    try {
      if (!fs.existsSync(jsonPath)) {
        console.log(`No test results found at ${jsonPath}`);
        return;
      }

      const content = fs.readFileSync(jsonPath, 'utf8');

      // Handle empty or invalid JSON
      if (!content || content.trim() === '' || content === '{}') {
        console.log('JSON file is empty or invalid');
        return;
      }

      const data = JSON.parse(content);

      // Debug: Log the structure
      console.log('JSON structure keys:', Object.keys(data));

      // Update summary from stats
      if (data.stats) {
        this.errors.summary.total = data.stats.total || 0;
        this.errors.summary.failed = data.stats.failed || 0;
        this.errors.summary.passed = data.stats.passed || 0;
        this.errors.summary.skipped = data.stats.skipped || 0;
        console.log(`Test summary: ${this.errors.summary.failed} failed out of ${this.errors.summary.total}`);
      }

      // Extract failed tests from suites
      if (data.suites) {
        this.extractFailedTests(data.suites);
      }

      // Also check for errors array (common in Playwright JSON output)
      if (data.errors && Array.isArray(data.errors)) {
        for (const error of data.errors) {
          if (error.message) {
            this.errors.webServerErrors.push(error.message);
            if (error.stack) {
              this.errors.webServerErrors.push(error.stack);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error parsing Playwright results:', error);
      console.error('JSON content preview:', fs.readFileSync(jsonPath, 'utf8').substring(0, 500));
    }
  }

  /**
   * Recursively extract failed tests from test suites
   */
  extractFailedTests(suites, parentTitle = '', parentFile = '') {
    if (!Array.isArray(suites)) {
      console.log('Suites is not an array:', typeof suites);
      return;
    }

    for (const suite of suites) {
      if (!suite) continue;

      const suiteTitle = parentTitle ? `${parentTitle} > ${suite.title}` : suite.title;
      const suiteFile = suite.file || parentFile;

      // Process specs array (Playwright v1.40+ format)
      if (suite.specs && Array.isArray(suite.specs)) {
        for (const spec of suite.specs) {
          if (spec.tests && Array.isArray(spec.tests)) {
            for (const test of spec.tests) {
              if (test.status === 'failed' || test.status === 'timedOut' || test.status === 'unexpected') {
                console.log(`Found failed test: ${spec.title || test.title}`);
                this.errors.testFailures.push({
                  title: spec.title || test.title || 'Unknown test',
                  fullTitle: `${suiteTitle} > ${spec.title || test.title}`,
                  file: spec.file || suiteFile || 'unknown',
                  line: spec.line || test.line || 0,
                  column: spec.column || test.column || 0,
                  status: test.status,
                  duration: test.duration || 0,
                  error: this.formatTestError(test.results)
                });
              }
            }
          }
        }
      }

      // Process tests array (older format)
      if (suite.tests && Array.isArray(suite.tests)) {
        for (const test of suite.tests) {
          if (test.status === 'failed' || test.status === 'timedOut' || test.status === 'unexpected') {
            console.log(`Found failed test (old format): ${test.title}`);
            this.errors.testFailures.push({
              title: test.title || 'Unknown test',
              fullTitle: `${suiteTitle} > ${test.title}`,
              file: suiteFile || 'unknown',
              line: test.line || 0,
              column: test.column || 0,
              status: test.status,
              duration: test.duration || 0,
              error: this.formatTestError(test.results)
            });
          }
        }
      }

      // Process nested suites
      if (suite.suites && Array.isArray(suite.suites)) {
        this.extractFailedTests(suite.suites, suiteTitle, suiteFile);
      }
    }
  }

  /**
   * Format test error from results
   */
  formatTestError(results) {
    if (!results || !Array.isArray(results) || results.length === 0) {
      return { message: 'No error details available', stack: '', snippet: '' };
    }

    // Find the failed result with the most detail
    const failedResult = results.find(r => r.status === 'failed' || r.status === 'timedOut') || results[0];

    if (!failedResult) {
      return { message: 'Test failed without result details', stack: '', snippet: '' };
    }

    // Extract error information
    const error = failedResult.error || {};

    // Try to extract more context from the error
    let message = error.message || 'Unknown error';
    let stack = error.stack || '';
    let snippet = error.snippet || '';

    // If we have attachments, mention them
    if (failedResult.attachments && failedResult.attachments.length > 0) {
      const attachmentTypes = failedResult.attachments.map(a => a.name || a.contentType).join(', ');
      message += `\n\nAttachments: ${attachmentTypes}`;
    }

    // Extract actual vs expected if available
    if (error.matcherResult) {
      const mr = error.matcherResult;
      if (mr.expected !== undefined && mr.actual !== undefined) {
        message += `\n\nExpected: ${JSON.stringify(mr.expected, null, 2)}\nActual: ${JSON.stringify(mr.actual, null, 2)}`;
      }
    }

    return {
      message,
      stack,
      snippet,
      location: error.location || null
    };
  }

  /**
   * Parse stdout/stderr for WebServer and build errors
   */
  parseConsoleOutput(outputPath) {
    try {
      if (!fs.existsSync(outputPath)) {
        console.log(`No console output found at ${outputPath}`);
        return;
      }

      const output = fs.readFileSync(outputPath, 'utf8');
      const lines = output.split('\n');

      // Parse test failures from console output if JSON is not available
      let inFailureSection = false;
      let currentTest = null;
      let failureBuffer = [];

      for (const line of lines) {
        // Detect WebServer errors
        if (line.includes('[WebServer]') && line.includes('Error')) {
          this.errors.webServerErrors.push(line);
        }

        // Detect specific error types
        if (line.includes('ERR_INVALID_FILE_URL_PATH')) {
          this.errors.webServerErrors.push(line);
        }

        if (line.includes('ERR_CONNECTION_REFUSED')) {
          this.errors.webServerErrors.push(line);
        }

        // Detect build errors
        if (line.includes('Build failed') || line.includes('npm ERR!')) {
          this.errors.buildErrors.push(line);
        }

        // Parse Playwright test failures from console output
        if (line.includes('✓') || line.includes('✔')) {
          // Test passed
          this.errors.summary.passed++;
          this.errors.summary.total++;
        } else if (line.includes('✕') || line.includes('✗') || line.includes('failed')) {
          // Test failed
          inFailureSection = true;
          this.errors.summary.failed++;
          this.errors.summary.total++;

          // Extract test name
          const match = line.match(/\d+\)\s+(.+?)\s+\(/);
          if (match) {
            currentTest = {
              title: match[1],
              fullTitle: match[1],
              file: 'unknown',
              line: 0,
              column: 0,
              status: 'failed',
              duration: 0,
              error: { message: '', stack: '' }
            };
            failureBuffer = [];
          }
        }

        // Collect failure details
        if (inFailureSection && currentTest) {
          failureBuffer.push(line);

          // Look for end of failure section
          if (line.includes('at ') || line.includes('Error:')) {
            currentTest.error.message = failureBuffer.join('\n');
          }

          // Save test when we hit the next test or end
          if ((line.includes('✓') || line.includes('✕') || line.trim() === '') && failureBuffer.length > 1) {
            if (!this.errors.testFailures.find(t => t.title === currentTest.title)) {
              this.errors.testFailures.push(currentTest);
            }
            inFailureSection = false;
            currentTest = null;
            failureBuffer = [];
          }
        }

        // Parse summary line
        if (line.includes('passed') && line.includes('failed')) {
          const passMatch = line.match(/(\d+)\s+passed/);
          const failMatch = line.match(/(\d+)\s+failed/);
          const skipMatch = line.match(/(\d+)\s+skipped/);

          if (passMatch) this.errors.summary.passed = parseInt(passMatch[1]);
          if (failMatch) this.errors.summary.failed = parseInt(failMatch[1]);
          if (skipMatch) this.errors.summary.skipped = parseInt(skipMatch[1]);

          this.errors.summary.total = this.errors.summary.passed + this.errors.summary.failed + this.errors.summary.skipped;
        }
      }

      // Save any pending test failure
      if (currentTest && !this.errors.testFailures.find(t => t.title === currentTest.title)) {
        currentTest.error.message = failureBuffer.join('\n');
        this.errors.testFailures.push(currentTest);
      }
    } catch (error) {
      console.error('Error parsing console output:', error);
    }
  }

  /**
   * Generate markdown content for GitHub issue
   * GitHub has a 65536 character limit for issue bodies
   */
  generateIssueContent(metadata = {}, maxLength = 65000) {
    const {
      runId = '',
      runNumber = '',
      runAttempt = '1',
      commit = '',
      branch = '',
      repo = 'blockchain-web-services/bws-website-front',
      actor = '',
      workflow = '',
      job = '',
      eventName = '',
      prNumber = '',
      prBranch = '',
      baseBranch = '',
      timestamp = new Date().toISOString(),
      nodeVersion = process.version,
      os = process.platform
    } = metadata;

    const runUrl = runId ? `https://github.com/${repo}/actions/runs/${runId}` : 'N/A';

    // Start with Claude command structure
    let content = `## 🔴 CI Failure - Auto-Fix Request

@claude - Please fix these test failures using the command below.

### Command for Claude
\`\`\`
/fix-ci
\`\`\`

### Failure Context

**Failed Run:** [View Run #${runNumber}](${runUrl})
**Workflow:** ${workflow || 'CI/CD Pipeline'}
**Job:** ${job || 'test'}
**Triggered by:** @${actor || 'unknown'}
**Event:** ${eventName || 'push'}
${prNumber ? `**Pull Request:** #${prNumber} (${prBranch} → ${baseBranch})` : ''}
**Commit:** \`${commit ? commit.substring(0, 7) : 'unknown'}\`
**Branch:** \`${branch || 'unknown'}\`
**Time:** ${timestamp}
**Attempt:** ${runAttempt}

### 📋 Project Context

**Project:** BWS Website - Static site for Blockchain Web Services
**Tech Stack:** Astro SSG, GitHub Pages, Playwright Testing
**Production URL:** https://www.bws.ninja
**Build Output:** \`_site/\` directory
**Repository:** [${repo}](https://github.com/${repo})

### ❌ Test Results Summary

- **Total Tests:** ${this.errors.summary.total}
- **Failed:** ${this.errors.summary.failed}
- **Passed:** ${this.errors.summary.passed}
- **Skipped:** ${this.errors.summary.skipped}
- **Success Rate:** ${this.errors.summary.total > 0 ?
    ((this.errors.summary.passed / this.errors.summary.total) * 100).toFixed(1) : 0}%

`;

    // Add failed tests table (limit to prevent huge tables)
    if (this.errors.testFailures.length > 0) {
      const maxTableRows = 10; // Limit table size
      const testsToShow = this.errors.testFailures.slice(0, maxTableRows);
      const remaining = this.errors.testFailures.length - maxTableRows;

      content += `### 📊 Failed Tests${remaining > 0 ? ` (First ${maxTableRows} of ${this.errors.testFailures.length})` : ''}

| Test | File | Error Type | Status |
|------|------|------------|--------|
`;
      for (const test of testsToShow) {
        const errorType = (test.error.message.split(':')[0] || 'Unknown').substring(0, 30);
        const fileName = path.basename(test.file);
        const fileLink = `${test.file}:${test.line}`;
        const shortTitle = test.title.length > 40 ? test.title.substring(0, 40) + '...' : test.title;
        content += `| ${shortTitle} | \`${fileLink}\` | ${errorType} | ${test.status} |\n`;
      }

      if (remaining > 0) {
        content += `\n**⚠️ ${remaining} additional test failures not shown in table**\n`;
      }
      content += '\n';
    }

    // Add detailed error logs (limit to prevent exceeding GitHub's limit)
    if (this.errors.testFailures.length > 0) {
      // Limit detailed failures to prevent huge issue bodies
      const maxDetailedFailures = 5; // Only show details for first 5 failures
      const failuresToDetail = this.errors.testFailures.slice(0, maxDetailedFailures);
      const remainingFailures = this.errors.testFailures.length - maxDetailedFailures;

      content += `### 🔍 Detailed Test Failures\n\n`;
      content += `Showing detailed information for ${Math.min(maxDetailedFailures, this.errors.testFailures.length)} of ${this.errors.testFailures.length} failed test(s):\n\n`;

      for (let i = 0; i < failuresToDetail.length; i++) {
        const test = failuresToDetail[i];
        const testNumber = i + 1;

        // Create a clear header for each failure
        content += `---\n\n`;
        content += `#### Test Failure #${testNumber}: ${test.title}\n\n`;

        // Basic test information
        content += `**Full Test Path:** \`${test.fullTitle}\`\n`;
        content += `**File Location:** \`${test.file}:${test.line}:${test.column}\`\n`;
        content += `**Test Status:** \`${test.status}\`\n`;
        content += `**Duration:** ${test.duration}ms\n\n`;

        // Error details in expandable section
        content += `<details>\n`;
        content += `<summary><strong>📝 Error Details (click to expand)</strong></summary>\n\n`;

        // Primary error message (truncate if too long)
        const errorMsg = test.error.message || 'No error message available';
        const maxErrorLength = 500; // Limit error message length
        const truncatedError = errorMsg.length > maxErrorLength ?
          errorMsg.substring(0, maxErrorLength) + '\n...truncated (full error: ' + errorMsg.length + ' chars)...' : errorMsg;

        content += `**Error Message:**\n`;
        content += `\`\`\`\n`;
        content += `${truncatedError}\n`;
        content += `\`\`\`\n\n`;

        // Stack trace if available (truncate if too long)
        if (test.error.stack) {
          const maxStackLength = 300; // Limit stack trace length
          const truncatedStack = test.error.stack.length > maxStackLength ?
            test.error.stack.substring(0, maxStackLength) + '\n...truncated...' : test.error.stack;

          content += `**Stack Trace:**\n`;
          content += `\`\`\`javascript\n`;
          content += `${truncatedStack}\n`;
          content += `\`\`\`\n\n`;
        }

        // Code snippet if available (limit size)
        if (test.error.snippet) {
          const maxSnippetLength = 200;
          const truncatedSnippet = test.error.snippet.length > maxSnippetLength ?
            test.error.snippet.substring(0, maxSnippetLength) + '\n...' : test.error.snippet;

          content += `**Failing Code:**\n`;
          content += `\`\`\`javascript\n`;
          content += `${truncatedSnippet}\n`;
          content += `\`\`\`\n\n`;
        }

        // Location information if available
        if (test.error.location) {
          content += `**Error Location:**\n`;
          content += `- File: ${test.error.location.file || 'unknown'}\n`;
          content += `- Line: ${test.error.location.line || 'unknown'}\n`;
          content += `- Column: ${test.error.location.column || 'unknown'}\n\n`;
        }

        content += `</details>\n\n`;

        // Action items for this specific test
        content += `**🔧 Suggested Actions:**\n`;
        content += this.generateSuggestedActions(test);
        content += `\n\n`;
      }

      // Add notice about remaining failures
      if (remainingFailures > 0) {
        content += `### ⚠️ Additional Failures Not Shown\n\n`;
        content += `There are **${remainingFailures} additional test failures** not shown in detail above.\n\n`;
        content += `**To manage the large number of failures:**\n`;
        content += `1. Focus on fixing the first ${maxDetailedFailures} detailed failures\n`;
        content += `2. These often have common root causes that fix multiple tests\n`;
        content += `3. Re-run tests after fixing to see remaining failures\n`;
        content += `4. Iterate until all tests pass\n\n`;
      }
    } else if (this.errors.summary.failed > 0) {
      // No detailed test failures but summary shows failures
      content += `### ⚠️ Test Failures Without Details\n\n`;
      content += `The test summary reports ${this.errors.summary.failed} failed tests, but detailed error information was not captured.\n\n`;
      content += `**Possible Reasons:**\n`;
      content += `- JSON reporter output was incomplete\n`;
      content += `- Tests failed before reporter could capture details\n`;
      content += `- WebServer or build errors prevented test execution\n\n`;
      content += `Please check the console output below for more information.\n\n`;
    }

    // Add WebServer errors (limit size)
    if (this.errors.webServerErrors.length > 0) {
      const maxWebServerErrors = 5;
      const webServerErrorsToShow = this.errors.webServerErrors.slice(0, maxWebServerErrors);

      content += `### 🖥️ WebServer Errors${this.errors.webServerErrors.length > maxWebServerErrors ? ` (First ${maxWebServerErrors} of ${this.errors.webServerErrors.length})` : ''}\n\n`;
      content += `\`\`\`\n`;
      content += webServerErrorsToShow
        .map(err => err.length > 150 ? err.substring(0, 150) + '...' : err)
        .join('\n');
      content += `\n\`\`\`\n\n`;
    }

    // Add build errors (limit size)
    if (this.errors.buildErrors.length > 0) {
      const maxBuildErrors = 5;
      const buildErrorsToShow = this.errors.buildErrors.slice(0, maxBuildErrors);

      content += `### 🔨 Build Errors${this.errors.buildErrors.length > maxBuildErrors ? ` (First ${maxBuildErrors} of ${this.errors.buildErrors.length})` : ''}\n\n`;
      content += `\`\`\`\n`;
      content += buildErrorsToShow
        .map(err => err.length > 150 ? err.substring(0, 150) + '...' : err)
        .join('\n');
      content += `\n\`\`\`\n\n`;
    }

    // Add job logs summary
    if (this.errors.jobLogs && this.errors.jobLogs.length > 0) {
      content += `### 📋 Job Logs Summary\n\n`;
      content += `<details>\n`;
      content += `<summary>Key errors extracted from job logs (${this.errors.jobLogs.length} found)</summary>\n\n`;
      content += `\`\`\`\n`;
      content += this.errors.jobLogs.join('\n');
      content += `\n\`\`\`\n\n`;
      content += `</details>\n\n`;
    }

    // Add environment details
    content += `### 🛠️ Environment

- **Node Version:** ${nodeVersion}
- **OS:** ${os}
- **Playwright Version:** Check package.json
- **Browser:** Chromium

### 🌿 Suggested Fix Branch

Create a new branch for the fixes:
\`\`\`bash
git checkout -b claude-fix-ci-${new Date().toISOString().split('T')[0]}-${runId || 'local'}
\`\`\`

### 🎯 Auto-Fix Instructions for Claude

@claude This issue contains a large number of test failures (${this.errors.summary.failed} failures). To manage this effectively:

**Priority Approach:**
1. **Start with the ${Math.min(5, this.errors.testFailures.length)} detailed failures above** - These are shown with full error context
2. **Look for common root causes** - Many failures often share the same underlying issue
3. **Focus on configuration/setup issues first** - WebServer errors, connection issues, etc.
4. **Fix and re-run** - After fixing initial issues, re-run tests to see remaining failures

**Analysis Steps:**
1. Review the detailed test failures and error patterns
2. Check WebServer/build errors if present (these often cause cascade failures)
3. Identify if issues are code, config, or environment related
4. Apply targeted fixes to address root causes

### 🛠️ Allowed Tools for Auto-Fix

\`\`\`
Edit, MultiEdit, Write, Read, Glob, Grep, Bash(git:*), Bash(npm:*), Bash(npx:*)
\`\`\`

### 📋 Fix Checklist

- [ ] Fix all test failures
- [ ] Update configurations if needed
- [ ] Ensure code follows project conventions
- [ ] Verify no new issues introduced
- [ ] Document any significant changes

### 📚 Repository Context

**Repository:** \`${repo}\`
**Main Files:**
- \`/tests/playwright.config.cjs\` - Test configuration
- \`/.github/workflows/deploy.yml\` - CI/CD workflow
- \`/package.json\` - Scripts and dependencies
- \`/CLAUDE.md\` - Project-specific instructions
- \`/src/components/\` - Astro components
- \`/public/assets/\` - Static assets

### 📎 Artifacts

- [Test Results](${runUrl}/artifacts) - Download test reports and screenshots
- [Job Logs](${runUrl}) - View complete job execution logs

### 💡 Debugging Tips

1. Check if the issue is reproducible locally
2. Review recent commits for breaking changes
3. Verify all dependencies are correctly installed
4. Check for race conditions in async operations
5. Ensure proper cleanup between tests

---
*This issue was automatically created by the test failure detection system.*
`;

    // Check if content exceeds GitHub's limit and truncate if needed
    if (content.length > maxLength) {
      console.log(`Warning: Issue content is ${content.length} characters, truncating to ${maxLength}`);

      // Add truncation notice
      const truncationNotice = `\n\n---\n## ⚠️ Content Truncated\n\nThis issue was truncated from ${content.length} to ${maxLength} characters due to GitHub's 65KB limit.\n\nFocus on fixing the issues shown above first, then re-run tests to see remaining failures.`;
      const availableLength = maxLength - truncationNotice.length - 100; // Leave buffer

      content = content.substring(0, availableLength) + truncationNotice;
    }

    console.log(`Issue content size: ${content.length} characters`);
    return content;
  }

  /**
   * Generate suggested actions based on the test failure
   */
  generateSuggestedActions(test) {
    const suggestions = [];
    const errorMsg = test.error.message.toLowerCase();

    // Analyze error message for common patterns
    if (errorMsg.includes('timeout')) {
      suggestions.push('- Increase timeout in test or config');
      suggestions.push('- Check if element selectors are correct');
      suggestions.push('- Verify page is loading completely');
    } else if (errorMsg.includes('net::err_connection_refused')) {
      suggestions.push('- Ensure web server is running');
      suggestions.push('- Check PORT configuration');
      suggestions.push('- Verify baseURL in playwright.config.js');
    } else if (errorMsg.includes('element not found') || errorMsg.includes('no element matches')) {
      suggestions.push('- Verify element selector is correct');
      suggestions.push('- Check if element exists in the current page state');
      suggestions.push('- Add appropriate wait conditions');
    } else if (errorMsg.includes('navigation')) {
      suggestions.push('- Check URL is correct');
      suggestions.push('- Verify page route exists');
      suggestions.push('- Check for redirect issues');
    } else if (errorMsg.includes('err_invalid_file_url_path')) {
      suggestions.push('- Check for URL-encoded characters in file paths');
      suggestions.push('- Verify all asset file names');
      suggestions.push('- Review recent file renames');
    } else {
      suggestions.push('- Review the error message and stack trace');
      suggestions.push('- Check recent code changes in the failing area');
      suggestions.push('- Run test locally to reproduce');
    }

    // Add file-specific suggestion
    suggestions.push(`- Check test file: ${test.file}:${test.line}`);

    return suggestions.join('\n');
  }

  /**
   * Save issue content to file
   */
  saveIssueContent(content, outputPath = 'issue-content.md') {
    try {
      fs.writeFileSync(outputPath, content, 'utf8');
      console.log(`Issue content saved to ${outputPath}`);
      return true;
    } catch (error) {
      console.error('Error saving issue content:', error);
      return false;
    }
  }

  /**
   * Parse job logs for additional error context
   */
  parseJobLogs(jobLogsPath) {
    try {
      if (!fs.existsSync(jobLogsPath)) {
        console.log(`No job logs found at ${jobLogsPath}`);
        return;
      }

      const logs = fs.readFileSync(jobLogsPath, 'utf8');
      const lines = logs.split('\n');

      // Extract key error patterns from job logs
      const errorPatterns = [
        /error TS\d+:/i,  // TypeScript errors
        /SyntaxError:/,   // JavaScript syntax errors
        /npm ERR!/,       // NPM errors
        /ERROR:/,         // Generic errors
        /FAILED:/,        // Failed steps
        /\[ERROR\]/,     // Bracketed errors
      ];

      const extractedErrors = [];
      for (const line of lines) {
        for (const pattern of errorPatterns) {
          if (pattern.test(line)) {
            extractedErrors.push(line.trim());
            break;
          }
        }
      }

      // Store unique errors (limit and truncate each line)
      const maxLogErrors = 10; // Reduce from 20 to 10
      const maxLineLength = 100; // Truncate long lines
      this.errors.jobLogs = [...new Set(extractedErrors)]
        .slice(0, maxLogErrors)
        .map(line => line.length > maxLineLength ? line.substring(0, maxLineLength) + '...' : line);
    } catch (error) {
      console.error('Error parsing job logs:', error);
    }
  }

  /**
   * Main execution
   */
  async run() {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const jsonResultsPath = args[0] || 'test-results.json';
    const consoleOutputPath = args[1] || 'test-output.txt';
    const outputPath = args[2] || 'issue-content.md';
    const jobLogsPath = args[3] || null;

    console.log('Collecting test errors...');

    // Parse test results
    this.parsePlaywrightResults(jsonResultsPath);

    // Parse console output
    this.parseConsoleOutput(consoleOutputPath);

    // Parse job logs if available
    if (jobLogsPath) {
      this.parseJobLogs(jobLogsPath);
    }

    // Get enhanced metadata from environment variables
    const metadata = {
      runId: process.env.GITHUB_RUN_ID || '',
      runNumber: process.env.GITHUB_RUN_NUMBER || '',
      runAttempt: process.env.GITHUB_RUN_ATTEMPT || '1',
      commit: process.env.GITHUB_SHA || '',
      branch: process.env.GITHUB_REF || '',
      repo: process.env.GITHUB_REPOSITORY || 'blockchain-web-services/bws-website-front',
      actor: process.env.GITHUB_ACTOR || '',
      workflow: process.env.GITHUB_WORKFLOW || '',
      job: process.env.GITHUB_JOB || '',
      eventName: process.env.GITHUB_EVENT_NAME || '',
      prNumber: process.env.GITHUB_PR_NUMBER || '',
      prBranch: process.env.GITHUB_HEAD_REF || '',
      baseBranch: process.env.GITHUB_BASE_REF || '',
      nodeVersion: process.version,
      os: process.platform
    };

    // Generate issue content
    const issueContent = this.generateIssueContent(metadata);

    // Save to file
    const saved = this.saveIssueContent(issueContent, outputPath);

    if (saved) {
      console.log('Test error collection completed successfully');
      console.log(`Summary: ${this.errors.summary.failed} failed out of ${this.errors.summary.total} tests`);
    }

    // Exit with error code if tests failed
    if (this.errors.summary.failed > 0) {
      process.exit(1);
    }
  }
}

// Execute if run directly
if (import.meta.url === `file://${__filename}`) {
  const collector = new TestErrorCollector();
  collector.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export default TestErrorCollector;