import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Check if running on GitHub Actions
 */
export function isGitHubActions() {
  return process.env.GITHUB_ACTIONS === 'true' || process.env.CI === 'true';
}

/**
 * Update workflow YAML with new cron schedule(s)
 * @param {string|Array} newCrons - New cron expression(s) (e.g., "30 14 * * *" or ["0 6 * * *", "0 12 * * *"])
 * @param {string} scheduledTimeUTC - Human-readable time for logging
 * @param {string} workflowFile - Path to workflow file
 * @returns {boolean} Success status
 */
export function updateWorkflowSchedule(newCrons, scheduledTimeUTC, workflowFile) {
  try {
    console.log('\n🔄 Updating workflow schedule...');

    const cronsArray = Array.isArray(newCrons) ? newCrons : [newCrons];
    console.log(`   New cron(s): ${cronsArray.join(', ')}`);
    console.log(`   Next run: ${scheduledTimeUTC}`);

    // Read current workflow file
    const workflowContent = readFileSync(workflowFile, 'utf8');

    let updatedContent = workflowContent;

    if (cronsArray.length === 1) {
      // Single schedule - replace first cron pattern
      const cronPattern = /(- cron:\s*')(\d+\s+\d+\s+\*\s+\*\s+\*)(')/;

      if (!cronPattern.test(updatedContent)) {
        console.error('   ❌ Could not find cron schedule in workflow file');
        return false;
      }

      updatedContent = updatedContent.replace(
        cronPattern,
        `$1${cronsArray[0]}$3`
      );
    } else {
      // Multiple schedules - replace the entire schedule section
      const schedulePattern = /(schedule:\s*\n(?:\s*-\s*cron:\s*'[^']+'\s*(?:#[^\n]*)?\n)+)/;

      if (!schedulePattern.test(updatedContent)) {
        console.error('   ❌ Could not find schedule section in workflow file');
        return false;
      }

      const newScheduleSection = 'schedule:\n' + cronsArray.map(cron => `    - cron: '${cron}'`).join('\n') + '\n';

      updatedContent = updatedContent.replace(schedulePattern, newScheduleSection);
    }

    // Verify the update worked
    if (updatedContent === workflowContent) {
      console.error('   ❌ Workflow content unchanged (regex might have failed)');
      return false;
    }

    // Write updated workflow file
    writeFileSync(workflowFile, updatedContent, 'utf8');
    console.log('   ✅ Workflow file updated');

    return true;

  } catch (error) {
    console.error('   ❌ Error updating workflow:', error.message);
    return false;
  }
}

/**
 * Commit and push workflow schedule change
 * @param {string|Array} newCrons - The new cron expression(s)
 * @param {string} scheduledTimeUTC - Human-readable time
 * @param {string} workflowFile - Path to workflow file
 * @param {string} workflowName - Name for commit message
 */
export function commitScheduleChange(newCrons, scheduledTimeUTC, workflowFile, workflowName = 'workflow') {
  try {
    console.log('\n📝 Committing schedule change...');

    const cronsArray = Array.isArray(newCrons) ? newCrons : [newCrons];

    // Check if there are changes to commit
    const workflowFileRelative = workflowFile.replace(join(__dirname, '..', '..') + '/', '');
    const status = execSync(`git status --porcelain ${workflowFileRelative}`, {
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
    execSync(`git add ${workflowFileRelative}`, {
      cwd: join(__dirname, '..', '..')
    });

    // Commit with detailed message
    const scheduleText = cronsArray.length === 1
      ? `Schedule updated to: ${cronsArray[0]}`
      : `Schedules updated to:\n${cronsArray.map(c => `  - ${c}`).join('\n')}`;

    const commitMessage = `chore: Randomize next ${workflowName} schedule [skip ci]

${scheduleText}
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
 * @param {string|Array} newCrons - New cron expression(s)
 * @param {string} scheduledTimeUTC - Human-readable time
 * @param {string} workflowFile - Path to workflow file
 * @param {string} workflowName - Name for commit message
 * @returns {boolean} Success status
 */
export function updateAndCommitSchedule(newCrons, scheduledTimeUTC, workflowFile, workflowName = 'workflow') {
  // Update workflow file
  const updateSuccess = updateWorkflowSchedule(newCrons, scheduledTimeUTC, workflowFile);
  if (!updateSuccess) {
    return false;
  }

  // Commit and push changes
  const commitSuccess = commitScheduleChange(newCrons, scheduledTimeUTC, workflowFile, workflowName);
  if (!commitSuccess) {
    return false;
  }

  console.log('\n✅ Schedule randomization complete!');
  console.log(`   Next run scheduled for: ${scheduledTimeUTC}\n`);

  return true;
}
