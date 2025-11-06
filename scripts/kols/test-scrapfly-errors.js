/**
 * Test Suite for ScrapFly Error Handling
 * Tests error detection, fallback logic, and Zapier notifications
 */

import {
  handleScrapFlyError,
  handleScrapFlySuccess,
  isAuthError,
  isCreditsExhausted,
  ERROR_TYPES,
  getHealthStatus
} from './utils/scrapfly-error-handler.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROCESSED_POSTS_PATH = path.join(__dirname, 'data/processed-posts.json');
const PROCESSED_POSTS_BACKUP = path.join(__dirname, 'data/processed-posts.backup.json');

// Test counters
let passed = 0;
let failed = 0;

/**
 * Test helper functions
 */
function assert(condition, testName) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    failed++;
  }
}

function assertEquals(actual, expected, testName) {
  const match = JSON.stringify(actual) === JSON.stringify(expected);
  assert(match, testName);
  if (!match) {
    console.log(`   Expected: ${JSON.stringify(expected)}`);
    console.log(`   Actual:   ${JSON.stringify(actual)}`);
  }
}

/**
 * Backup and restore data
 */
async function backupData() {
  try {
    const data = await fs.readFile(PROCESSED_POSTS_PATH, 'utf-8');
    await fs.writeFile(PROCESSED_POSTS_BACKUP, data);
    console.log('📦 Backed up processed-posts.json');
  } catch (error) {
    console.log('⚠️  No existing processed-posts.json to backup');
  }
}

async function restoreData() {
  try {
    const data = await fs.readFile(PROCESSED_POSTS_BACKUP, 'utf-8');
    await fs.writeFile(PROCESSED_POSTS_PATH, data);
    await fs.unlink(PROCESSED_POSTS_BACKUP);
    console.log('📦 Restored processed-posts.json from backup');
  } catch (error) {
    console.log('⚠️  No backup to restore');
  }
}

async function resetScrapFlyStatus() {
  try {
    const data = JSON.parse(await fs.readFile(PROCESSED_POSTS_PATH, 'utf-8'));
    data.scrapflyStatus = {
      enabled: true,
      lastSuccess: null,
      consecutiveFailures: 0,
      lastError: null,
      fallbackActive: false,
      creditsRemaining: null,
    };
    await fs.writeFile(PROCESSED_POSTS_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to reset ScrapFly status:', error.message);
  }
}

/**
 * Test 1: Auth Error Detection
 */
async function testAuthErrorDetection() {
  console.log('\n📝 Test 1: Auth Error Detection');

  const error401 = new Error('Request failed with status code 401');
  const error403 = new Error('403 Forbidden - Unauthorized access');
  const errorAuth = new Error('Authentication failed');
  const errorOther = new Error('Network timeout');

  assert(isAuthError(error401), 'Should detect 401 error');
  assert(isAuthError(error403), 'Should detect 403 error');
  assert(isAuthError(errorAuth), 'Should detect auth keyword');
  assert(!isAuthError(errorOther), 'Should not detect non-auth error');
}

/**
 * Test 2: Credits Exhausted Detection
 */
async function testCreditsDetection() {
  console.log('\n📝 Test 2: Credits Exhausted Detection');

  const errorExhausted = new Error('ScrapFly credits exhausted');
  const errorDepleted = new Error('API credit limit depleted');
  const errorInsufficient = new Error('Insufficient credits remaining');
  const errorOther = new Error('Network timeout');

  assert(isCreditsExhausted(errorExhausted), 'Should detect exhausted credits');
  assert(isCreditsExhausted(errorDepleted), 'Should detect depleted credits');
  assert(isCreditsExhausted(errorInsufficient), 'Should detect insufficient credits');
  assert(!isCreditsExhausted(errorOther), 'Should not detect non-credit error');
}

/**
 * Test 3: Auth Error Handling
 */
async function testAuthErrorHandling() {
  console.log('\n📝 Test 3: Auth Error Handling');

  await resetScrapFlyStatus();

  const error = new Error('401 Unauthorized');
  const result = await handleScrapFlyError(error, {
    workflowUrl: 'https://github.com/test/actions/runs/123',
  });

  assert(result.errorType === ERROR_TYPES.AUTH_FAILURE, 'Should identify auth failure');
  assert(result.fallbackActive === true, 'Should activate fallback');

  // Check that status was updated
  const status = await getHealthStatus();
  assert(status.status.consecutiveFailures === 1, 'Should increment failure count');
  assert(status.status.fallbackActive === true, 'Should set fallback active');
}

/**
 * Test 4: Credits Exhausted Handling
 */
async function testCreditsHandling() {
  console.log('\n📝 Test 4: Credits Exhausted Handling');

  await resetScrapFlyStatus();

  const error = new Error('ScrapFly API credits exhausted');
  const result = await handleScrapFlyError(error, {
    creditsRemaining: 0,
    queriesAttempted: 5,
  });

  assert(result.errorType === ERROR_TYPES.CREDITS_EXHAUSTED, 'Should identify credits exhausted');
  assert(result.fallbackActive === true, 'Should activate fallback');
}

/**
 * Test 5: Systematic Failure Detection
 */
async function testSystematicFailure() {
  console.log('\n📝 Test 5: Systematic Failure Detection');

  await resetScrapFlyStatus();

  // Simulate 3 consecutive failures
  for (let i = 0; i < 3; i++) {
    const error = new Error(`Generic error ${i + 1}`);
    await handleScrapFlyError(error);
  }

  const status = await getHealthStatus();
  assert(status.status.consecutiveFailures >= 3, 'Should track 3+ failures');
  assert(status.status.fallbackActive === true, 'Should activate fallback after 3 failures');
}

/**
 * Test 6: Success Recovery
 */
async function testSuccessRecovery() {
  console.log('\n📝 Test 6: Success Recovery');

  await resetScrapFlyStatus();

  // Trigger failure
  const error = new Error('401 Unauthorized');
  await handleScrapFlyError(error);

  // Then success
  await handleScrapFlySuccess({ creditsRemaining: 100 });

  const status = await getHealthStatus();
  assert(status.status.consecutiveFailures === 0, 'Should reset failure count');
  assert(status.status.fallbackActive === false, 'Should deactivate fallback');
  assert(status.status.lastSuccess !== null, 'Should record success timestamp');
}

/**
 * Test 7: Health Status
 */
async function testHealthStatus() {
  console.log('\n📝 Test 7: Health Status');

  await resetScrapFlyStatus();

  let health = await getHealthStatus();
  assert(health.healthy === true, 'Should be healthy initially');

  // Trigger failure
  const error = new Error('Test error');
  await handleScrapFlyError(error);

  health = await getHealthStatus();
  assert(health.healthy === false, 'Should be unhealthy after failure');

  // Recover
  await handleScrapFlySuccess();

  health = await getHealthStatus();
  assert(health.healthy === true, 'Should be healthy after recovery');
}

/**
 * Test 8: Error Type Priority
 */
async function testErrorTypePriority() {
  console.log('\n📝 Test 8: Error Type Priority');

  await resetScrapFlyStatus();

  // Auth error should take priority
  const authError = new Error('401 Unauthorized - credits exhausted');
  const result = await handleScrapFlyError(authError);

  assert(result.errorType === ERROR_TYPES.AUTH_FAILURE, 'Auth error should take priority');
}

/**
 * Test 9: Fallback State Persistence
 */
async function testFallbackPersistence() {
  console.log('\n📝 Test 9: Fallback State Persistence');

  await resetScrapFlyStatus();

  // Trigger error
  const error = new Error('Test error');
  await handleScrapFlyError(error);

  // Read status directly from file
  const data = JSON.parse(await fs.readFile(PROCESSED_POSTS_PATH, 'utf-8'));
  assert(data.scrapflyStatus.fallbackActive === true, 'Should persist fallback state');
  assert(data.scrapflyStatus.consecutiveFailures === 1, 'Should persist failure count');
}

/**
 * Test 10: Multiple Error Types
 */
async function testMultipleErrorTypes() {
  console.log('\n📝 Test 10: Multiple Error Types');

  await resetScrapFlyStatus();

  // Test different error sequences
  const errors = [
    new Error('401 Unauthorized'),
    new Error('ScrapFly credits exhausted'),
    new Error('Network timeout'),
  ];

  for (const error of errors) {
    await handleScrapFlyError(error);
  }

  const status = await getHealthStatus();
  assert(status.status.consecutiveFailures === 3, 'Should count all failures');
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🧪 Starting ScrapFly Error Handling Test Suite\n');
  console.log('=' .repeat(60));

  // Backup existing data
  await backupData();

  try {
    // Run all tests
    await testAuthErrorDetection();
    await testCreditsDetection();
    await testAuthErrorHandling();
    await testCreditsHandling();
    await testSystematicFailure();
    await testSuccessRecovery();
    await testHealthStatus();
    await testErrorTypePriority();
    await testFallbackPersistence();
    await testMultipleErrorTypes();

  } catch (error) {
    console.error('\n❌ Test suite error:', error);
  } finally {
    // Restore original data
    await restoreData();
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Results');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  console.log('='.repeat(60));

  if (failed > 0) {
    console.log('\n⚠️  Some tests failed. Please review the output above.');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export default runTests;
