import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to workflow file (relative to worktree root)
const WORKFLOW_FILE = join(__dirname, '..', '..', '.github', 'workflows', 'post-article-content.yml');

/**
 * Check if running on GitHub Actions
 */
export function isGitHubActions() {
  return process.env.GITHUB_ACTIONS === 'true' || process.env.CI === 'true';
}

/**
 * Update workflow YAML with new cron schedule
 * @param {string} newCron - New cron expression (e.g., "30 14 * * *")
 * @param {string} scheduledTimeUTC - Human-readable time for logging
 * @returns {boolean} Success status
 */
export function updateWorkflowSchedule(newCron, scheduledTimeUTC) {
  try {
    console.log('\n🔄 Updating workflow schedule...');
    console.log(`   New cron: ${newCron}`);
    console.log(`   Next run: ${scheduledTimeUTC}`);

    // Read current workflow file
    const workflowContent = readFileSync(WORKFLOW_FILE, 'utf8');

    // Find and replace the cron schedule
    // Pattern: - cron: 'MINUTE HOUR * * *'
    const cronPattern = /(- cron:\s*')(\d+\s+\d+\s+\*\s+\*\s+\*)(')/;

    if (!cronPattern.test(workflowContent)) {
      console.error('   ❌ Could not find cron schedule in workflow file');
      return false;
    }

    // Replace the cron expression
    const updatedContent = workflowContent.replace(
      cronPattern,
      `$1${newCron}$3`
    );

    // Verify the update worked
    if (updatedContent === workflowContent) {
      console.error('   ❌ Workflow content unchanged (regex might have failed)');
      return false;
    }

    // Write updated workflow file
    writeFileSync(WORKFLOW_FILE, updatedContent, 'utf8');
    console.log('   ✅ Workflow file updated');

    return true;

  } catch (error) {
    console.error('   ❌ Error updating workflow:', error.message);
    return false;
  }
}

/**
 * Commit and push workflow schedule change
 * @param {string} newCron - The new cron expression
 * @param {string} scheduledTimeUTC - Human-readable time
 */
export function commitScheduleChange(newCron, scheduledTimeUTC) {
  try {
    console.log('\n📝 Committing schedule change...');

    // Check if there are changes to commit
    const status = execSync('git status --porcelain .github/workflows/post-article-content.yml', {
      encoding: 'utf8',
      cwd: join(__dirname, '..', '..')
    }).trim();

    if (!status) {
      console.log('   ℹ️  No changes to commit');
      return true;
    }

    // Configure git (for GitHub Actions bot)
    if (isGitHubActions()) {
      execSync('git config user.name "github-actions[bot]"', {
        cwd: join(__dirname, '..', '..')
      });
      execSync('git config user.email "github-actions[bot]@users.noreply.github.com"', {
        cwd: join(__dirname, '..', '..')
      });
    }

    // Stage the workflow file
    execSync('git add .github/workflows/post-article-content.yml', {
      cwd: join(__dirname, '..', '..')
    });

    // Commit with detailed message
    const commitMessage = `chore: Randomize next posting schedule [skip ci]

Schedule updated to: ${newCron}
Next run approximately: ${scheduledTimeUTC}

This randomization helps avoid predictable posting patterns.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>`;

    execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, {
      cwd: join(__dirname, '..', '..')
    });

    console.log('   ✅ Changes committed');

    // Push to origin (only on GitHub Actions)
    if (isGitHubActions()) {
      console.log('\n🚀 Pushing to origin...');
      execSync('git push origin master', {
        cwd: join(__dirname, '..', '..')
      });
      console.log('   ✅ Pushed to origin');
    } else {
      console.log('   ℹ️  Skipping push (not on GitHub Actions)');
    }

    return true;

  } catch (error) {
    console.error('   ❌ Error committing changes:', error.message);
    return false;
  }
}

/**
 * Complete workflow schedule update (update + commit + push)
 * @param {string} newCron - New cron expression
 * @param {string} scheduledTimeUTC - Human-readable time
 * @returns {boolean} Success status
 */
export function updateAndCommitSchedule(newCron, scheduledTimeUTC) {
  // Update workflow file
  const updateSuccess = updateWorkflowSchedule(newCron, scheduledTimeUTC);
  if (!updateSuccess) {
    return false;
  }

  // Commit and push changes
  const commitSuccess = commitScheduleChange(newCron, scheduledTimeUTC);
  if (!commitSuccess) {
    return false;
  }

  console.log('\n✅ Schedule randomization complete!');
  console.log(`   Next run scheduled for: ${scheduledTimeUTC}\n`);

  return true;
}
