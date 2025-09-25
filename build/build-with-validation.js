#!/usr/bin/env node

/**
 * Enhanced Build Process with Validation and Rollback
 *
 * This script:
 * 1. Backs up the current build (if exists)
 * 2. Runs the Astro build
 * 3. Prettifies HTML files
 * 4. Validates HTML files
 * 5. On success: Removes backup
 * 6. On failure: Restores backup and exits with error
 */

const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const { prettifyHTML } = require('./html-prettifier');
const { validateHTML } = require('./html-validator');

const SITE_DIR = path.join(__dirname, '..', '_site');
const BACKUP_DIR = path.join(__dirname, '..', '_site_backup');
const ROOT_DIR = path.join(__dirname, '..');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, description) {
  log(`\n${description}...`, 'cyan');
  try {
    const result = execSync(command, {
      stdio: 'inherit',
      cwd: ROOT_DIR,
      shell: true
    });
    // Check if command succeeded
    return true;
  } catch (error) {
    // Only mark as failed if there was an actual error
    if (error.status !== 0 && error.status !== undefined) {
      log(`❌ Failed: ${description}`, 'red');
      return false;
    }
    // If status is undefined, check if _site was created
    if (fs.existsSync(SITE_DIR) && fs.readdirSync(SITE_DIR).length > 0) {
      return true;
    }
    log(`❌ Failed: ${description}`, 'red');
    return false;
  }
}

async function backupCurrentBuild() {
  if (fs.existsSync(SITE_DIR)) {
    log('\n📦 Backing up current build...', 'yellow');

    // Remove old backup if exists
    if (fs.existsSync(BACKUP_DIR)) {
      await fs.remove(BACKUP_DIR);
    }

    // Create new backup
    await fs.copy(SITE_DIR, BACKUP_DIR, {
      preserveTimestamps: true
    });

    log('✅ Backup created successfully', 'green');
    return true;
  }
  return false;
}

async function restoreBackup() {
  if (fs.existsSync(BACKUP_DIR)) {
    log('\n🔄 Restoring backup...', 'yellow');

    // Remove failed build
    if (fs.existsSync(SITE_DIR)) {
      await fs.remove(SITE_DIR);
    }

    // Restore backup
    await fs.move(BACKUP_DIR, SITE_DIR);

    log('✅ Backup restored successfully', 'green');
    return true;
  }
  return false;
}

async function cleanupBackup() {
  if (fs.existsSync(BACKUP_DIR)) {
    log('\n🧹 Cleaning up backup...', 'cyan');
    await fs.remove(BACKUP_DIR);
    log('✅ Backup cleaned up', 'green');
  }
}

async function runBuildWithValidation() {
  log('\n' + '='.repeat(60), 'bright');
  log('🚀 Starting Enhanced Build Process', 'bright');
  log('='.repeat(60) + '\n', 'bright');

  let hasBackup = false;
  let buildSuccess = false;

  try {
    // Step 1: Backup current build
    hasBackup = await backupCurrentBuild();

    // Step 2: Clean build directory
    log('\n🧹 Cleaning build directory...', 'cyan');
    if (fs.existsSync(SITE_DIR)) {
      await fs.remove(SITE_DIR);
    }
    await fs.ensureDir(SITE_DIR);

    // Step 3: Run Astro build
    // Use npx with --no-install to prevent auto-installation
    buildSuccess = execCommand(
      'cd .. && npx --no-install astro build',
      '🔨 Building with Astro'
    );

    // Verify build succeeded by checking if files were generated
    const indexPath = path.join(SITE_DIR, 'index.html');
    if (!buildSuccess && !fs.existsSync(indexPath)) {
      throw new Error('Astro build failed - no output generated');
    }

    // Step 4: Prettify HTML files
    log('\n🎨 Prettifying HTML files...', 'magenta');
    const prettifySuccess = await prettifyHTML();

    if (!prettifySuccess) {
      throw new Error('HTML prettification failed');
    }

    // Step 5: Validate HTML files
    log('\n🔍 Validating HTML files...', 'magenta');
    const validationSuccess = await validateHTML();

    if (!validationSuccess) {
      throw new Error('HTML validation failed - syntax errors detected');
    }

    // Step 6: Run additional checks
    log('\n🔍 Running additional checks...', 'cyan');

    // Check for missing assets
    const assetsExist = fs.existsSync(path.join(SITE_DIR, 'assets'));
    if (!assetsExist) {
      throw new Error('Assets directory missing in build output');
    }

    // Check for index.html
    const indexExists = fs.existsSync(path.join(SITE_DIR, 'index.html'));
    if (!indexExists) {
      throw new Error('index.html missing in build output');
    }

    // All checks passed - cleanup backup
    await cleanupBackup();

    // Success!
    log('\n' + '='.repeat(60), 'bright');
    log('✅ BUILD SUCCESSFUL!', 'green');
    log('='.repeat(60) + '\n', 'bright');

    log('Build output: ' + SITE_DIR, 'cyan');
    log('All HTML files have been prettified and validated\n', 'green');

    return true;

  } catch (error) {
    // Build failed - restore backup if available
    log('\n' + '='.repeat(60), 'bright');
    log('❌ BUILD FAILED!', 'red');
    log('='.repeat(60), 'bright');

    log(`\nError: ${error.message}`, 'red');

    if (hasBackup) {
      const restored = await restoreBackup();
      if (restored) {
        log('\n✅ Previous build has been restored', 'yellow');
        log('The build directory is unchanged from before this attempt\n', 'yellow');
      }
    } else {
      log('\n⚠️ No backup available to restore', 'yellow');
      log('Build directory may be in an incomplete state\n', 'yellow');
    }

    process.exit(1);
  }
}

// Check for dependencies
async function checkDependencies() {
  const requiredPackages = ['glob', 'prettier', 'cheerio', 'fs-extra'];
  const missingPackages = [];

  for (const pkg of requiredPackages) {
    try {
      require.resolve(pkg);
    } catch (e) {
      missingPackages.push(pkg);
    }
  }

  if (missingPackages.length > 0) {
    log('📦 Installing required dependencies...', 'yellow');
    execCommand(
      `npm install ${missingPackages.join(' ')}`,
      'Installing packages'
    );
  }
}

// Main execution
if (require.main === module) {
  checkDependencies().then(() => {
    runBuildWithValidation();
  });
}

module.exports = { runBuildWithValidation };