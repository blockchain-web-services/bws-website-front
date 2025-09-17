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

      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

      // Update summary
      this.errors.summary.total = data.stats?.total || 0;
      this.errors.summary.failed = data.stats?.failed || 0;
      this.errors.summary.passed = data.stats?.passed || 0;
      this.errors.summary.skipped = data.stats?.skipped || 0;

      // Extract failed tests
      if (data.suites) {
        this.extractFailedTests(data.suites);
      }
    } catch (error) {
      console.error('Error parsing Playwright results:', error);
    }
  }

  /**
   * Recursively extract failed tests from test suites
   */
  extractFailedTests(suites, parentTitle = '') {
    for (const suite of suites) {
      const suiteTitle = parentTitle ? `${parentTitle} > ${suite.title}` : suite.title;

      // Process tests in this suite
      if (suite.tests) {
        for (const test of suite.tests) {
          if (test.status === 'failed' || test.status === 'timedOut') {
            this.errors.testFailures.push({
              title: test.title,
              fullTitle: `${suiteTitle} > ${test.title}`,
              file: suite.file || 'unknown',
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
      if (suite.suites) {
        this.extractFailedTests(suite.suites, suiteTitle);
      }
    }
  }

  /**
   * Format test error from results
   */
  formatTestError(results) {
    if (!results || results.length === 0) {
      return { message: 'No error details available', stack: '' };
    }

    const failedResult = results.find(r => r.status === 'failed') || results[0];

    if (!failedResult.error) {
      return { message: 'Test failed without error details', stack: '' };
    }

    return {
      message: failedResult.error.message || 'Unknown error',
      stack: failedResult.error.stack || '',
      snippet: failedResult.error.snippet || ''
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
      }
    } catch (error) {
      console.error('Error parsing console output:', error);
    }
  }

  /**
   * Generate markdown content for GitHub issue
   */
  generateIssueContent(metadata = {}) {
    const {
      workflowRun = '',
      commit = '',
      branch = '',
      timestamp = new Date().toISOString(),
      runId = '',
      repo = 'blockchain-web-services/bws-website-front',
      nodeVersion = process.version,
      os = process.platform
    } = metadata;

    let content = `## 🔴 Automated Test Failure Report

**Workflow Run:** ${runId ? `[View Run](https://github.com/${repo}/actions/runs/${runId})` : 'N/A'}
**Commit:** \`${commit || 'unknown'}\`
**Branch:** \`${branch || 'unknown'}\`
**Time:** ${timestamp}

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

    // Add failed tests table
    if (this.errors.testFailures.length > 0) {
      content += `### 📊 Failed Tests

| Test | File | Error Type | Status |
|------|------|------------|--------|
`;
      for (const test of this.errors.testFailures) {
        const errorType = test.error.message.split(':')[0] || 'Unknown';
        const fileName = path.basename(test.file);
        const fileLink = `${test.file}:${test.line}`;
        content += `| ${test.title} | \`${fileLink}\` | ${errorType} | ${test.status} |\n`;
      }
      content += '\n';
    }

    // Add detailed error logs
    if (this.errors.testFailures.length > 0) {
      content += `### 🔍 Detailed Error Logs\n\n`;

      for (const test of this.errors.testFailures) {
        content += `<details>
<summary><strong>❌ ${test.fullTitle}</strong></summary>

**File:** \`${test.file}:${test.line}:${test.column}\`
**Duration:** ${test.duration}ms
**Status:** ${test.status}

**Error Message:**
\`\`\`
${test.error.message}
\`\`\`

`;
        if (test.error.stack) {
          content += `**Stack Trace:**
\`\`\`javascript
${test.error.stack}
\`\`\`

`;
        }

        if (test.error.snippet) {
          content += `**Code Snippet:**
\`\`\`javascript
${test.error.snippet}
\`\`\`

`;
        }

        content += `</details>\n\n`;
      }
    }

    // Add WebServer errors
    if (this.errors.webServerErrors.length > 0) {
      content += `### 🖥️ WebServer Errors\n\n`;
      content += `\`\`\`\n`;
      content += this.errors.webServerErrors.join('\n');
      content += `\n\`\`\`\n\n`;
    }

    // Add build errors
    if (this.errors.buildErrors.length > 0) {
      content += `### 🔨 Build Errors\n\n`;
      content += `\`\`\`\n`;
      content += this.errors.buildErrors.join('\n');
      content += `\n\`\`\`\n\n`;
    }

    // Add environment details
    content += `### 🛠️ Environment

- **Node Version:** ${nodeVersion}
- **OS:** ${os}
- **Playwright Version:** Check package.json
- **Browser:** Chromium

### 🎯 Action Required

@claude Please investigate and fix these test failures. Key areas to check:

1. **WebServer Configuration:** Review \`playwright.config.cjs\` for server setup issues
2. **File URL Encoding:** Check for encoded characters in file paths and URLs
3. **CI Environment:** Verify GitHub Actions environment variables and configuration
4. **Build Process:** Ensure static files are correctly generated and served
5. **Test Stability:** Review flaky tests and add appropriate wait conditions

### 📚 Relevant Files

- \`/tests/playwright.config.cjs\` - Test configuration
- \`/.github/workflows/deploy.yml\` - CI/CD workflow
- \`/package.json\` - Scripts and dependencies
- \`/CLAUDE.md\` - Project-specific instructions
- \`/src/components/\` - Astro components
- \`/public/assets/\` - Static assets

### 💡 Debugging Tips

1. Check if the issue is reproducible locally
2. Review recent commits for breaking changes
3. Verify all dependencies are correctly installed
4. Check for race conditions in async operations
5. Ensure proper cleanup between tests

---
*This issue was automatically created by the test failure detection system.*
`;

    return content;
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
   * Main execution
   */
  async run() {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const jsonResultsPath = args[0] || 'test-results.json';
    const consoleOutputPath = args[1] || 'test-output.txt';
    const outputPath = args[2] || 'issue-content.md';

    console.log('Collecting test errors...');

    // Parse test results
    this.parsePlaywrightResults(jsonResultsPath);

    // Parse console output
    this.parseConsoleOutput(consoleOutputPath);

    // Get metadata from environment variables
    const metadata = {
      runId: process.env.GITHUB_RUN_ID || '',
      commit: process.env.GITHUB_SHA || '',
      branch: process.env.GITHUB_REF || '',
      repo: process.env.GITHUB_REPOSITORY || 'blockchain-web-services/bws-website-front',
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