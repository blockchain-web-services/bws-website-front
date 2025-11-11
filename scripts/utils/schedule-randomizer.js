import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SCHEDULE_DATA_FILE = join(__dirname, '..', 'data', 'last-schedule.json');

// Configuration
const TIME_WINDOW = {
  minHour: 8,   // 8:00 AM UTC
  maxHour: 20   // 8:00 PM UTC
};

const RUN_CONSTRAINTS = {
  minHoursBetween: 18,  // Minimum 18 hours between runs
  maxHoursBetween: 30   // Maximum 30 hours between runs
};

/**
 * Load schedule history
 */
export function loadScheduleData() {
  if (!existsSync(SCHEDULE_DATA_FILE)) {
    return {
      lastRunTime: null,
      lastCron: null,
      nextScheduledCron: null,
      history: []
    };
  }

  return JSON.parse(readFileSync(SCHEDULE_DATA_FILE, 'utf8'));
}

/**
 * Save schedule history
 */
export function saveScheduleData(data) {
  writeFileSync(SCHEDULE_DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Generate random integer between min and max (inclusive)
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calculate next run time within constraints
 */
function calculateNextRunTime(lastRunTime) {
  const now = lastRunTime ? new Date(lastRunTime) : new Date();

  // Random hours between min and max constraints
  const hoursToAdd = randomInt(
    RUN_CONSTRAINTS.minHoursBetween,
    RUN_CONSTRAINTS.maxHoursBetween
  );

  const nextRun = new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);

  // Ensure time is within daily window (8:00-20:00 UTC)
  let hour = nextRun.getUTCHours();

  // If outside window, adjust to random time within window
  if (hour < TIME_WINDOW.minHour || hour > TIME_WINDOW.maxHour) {
    hour = randomInt(TIME_WINDOW.minHour, TIME_WINDOW.maxHour);
    nextRun.setUTCHours(hour);
  }

  // Randomize minutes (0-59)
  const minute = randomInt(0, 59);
  nextRun.setUTCMinutes(minute);
  nextRun.setUTCSeconds(0);
  nextRun.setUTCMilliseconds(0);

  return nextRun;
}

/**
 * Convert Date to cron expression (minute hour * * *)
 */
function dateToCron(date) {
  const minute = date.getUTCMinutes();
  const hour = date.getUTCHours();
  return `${minute} ${hour} * * *`;
}

/**
 * Generate next random cron schedule
 * @param {string|null} lastRunTime - ISO timestamp of last run
 * @returns {object} { cron: string, scheduledTime: string }
 */
export function generateRandomCron(lastRunTime = null) {
  const nextRunTime = calculateNextRunTime(lastRunTime);
  const cron = dateToCron(nextRunTime);

  return {
    cron,
    scheduledTime: nextRunTime.toISOString(),
    scheduledTimeUTC: `${nextRunTime.toISOString().split('T')[1].substring(0, 5)} UTC`
  };
}

/**
 * Record a run in schedule history
 */
export function recordRun(cronExpression) {
  const data = loadScheduleData();
  const now = new Date().toISOString();

  // Update schedule data
  data.lastRunTime = now;
  data.lastCron = cronExpression;

  // Add to history (keep last 10 runs)
  data.history = data.history || [];
  data.history.push({
    time: now,
    cron: cronExpression
  });

  if (data.history.length > 10) {
    data.history = data.history.slice(-10);
  }

  // Generate next schedule
  const nextSchedule = generateRandomCron(now);
  data.nextScheduledCron = nextSchedule.cron;
  data.nextScheduledTime = nextSchedule.scheduledTime;

  saveScheduleData(data);

  return nextSchedule;
}

/**
 * Get current schedule status
 */
export function getScheduleStatus() {
  const data = loadScheduleData();

  if (!data.lastRunTime) {
    return {
      hasRun: false,
      message: 'No previous runs recorded'
    };
  }

  const lastRun = new Date(data.lastRunTime);
  const now = new Date();
  const hoursSince = (now - lastRun) / (1000 * 60 * 60);

  return {
    hasRun: true,
    lastRunTime: data.lastRunTime,
    lastCron: data.lastCron,
    nextScheduledCron: data.nextScheduledCron,
    nextScheduledTime: data.nextScheduledTime,
    hoursSinceLastRun: Math.round(hoursSince * 10) / 10,
    historyCount: data.history?.length || 0
  };
}
