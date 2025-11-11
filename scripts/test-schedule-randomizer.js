import { generateRandomCron, recordRun, getScheduleStatus } from './utils/schedule-randomizer.js';

console.log('🧪 Testing Schedule Randomizer\n');
console.log('='.repeat(60));

// Test 1: Generate random cron without history
console.log('\n📝 Test 1: Generate first random schedule');
const firstSchedule = generateRandomCron();
console.log(`   Cron: ${firstSchedule.cron}`);
console.log(`   Time: ${firstSchedule.scheduledTimeUTC}`);
console.log(`   ISO: ${firstSchedule.scheduledTime}`);

// Test 2: Record a run
console.log('\n📝 Test 2: Record run and generate next schedule');
const nextSchedule = recordRun('0 12 * * *');
console.log(`   Next cron: ${nextSchedule.cron}`);
console.log(`   Next time: ${nextSchedule.scheduledTimeUTC}`);

// Test 3: Get status
console.log('\n📝 Test 3: Get schedule status');
const status = getScheduleStatus();
console.log(`   Has previous runs: ${status.hasRun}`);
console.log(`   Last run time: ${status.lastRunTime}`);
console.log(`   Last cron: ${status.lastCron}`);
console.log(`   Next scheduled cron: ${status.nextScheduledCron}`);
console.log(`   Next scheduled time: ${status.nextScheduledTime}`);
console.log(`   Hours since last run: ${status.hoursSinceLastRun}`);

// Test 4: Generate multiple schedules to check variance
console.log('\n📝 Test 4: Generate 5 random schedules to verify variance');
for (let i = 0; i < 5; i++) {
  const schedule = generateRandomCron(new Date().toISOString());
  console.log(`   ${i + 1}. ${schedule.cron} (${schedule.scheduledTimeUTC})`);
}

console.log('\n' + '='.repeat(60));
console.log('✅ All tests completed!\n');
