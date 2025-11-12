import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Default configuration
const DEFAULT_CONFIG = {
  scheduleDataFile: join(__dirname, '..', 'data', 'last-schedule.json'),
  timeWindow: {
    minHour: 8,   // 8:00 AM UTC
    maxHour: 20   // 8:00 PM UTC
  },
  runConstraints: {
    minHoursBetween: 18,  // Minimum 18 hours between runs
    maxHoursBetween: 30   // Maximum 30 hours between runs
  }
};

/**
 * Load schedule history
 * @param {string} scheduleDataFile - Path to schedule data file
 */
export function loadScheduleData(scheduleDataFile = DEFAULT_CONFIG.scheduleDataFile) {
  if (!existsSync(scheduleDataFile)) {
    return {
      lastRunTime: null,
      lastCron: null,
      nextScheduledCron: null,
      history: []
    };
  }

  return JSON.parse(readFileSync(scheduleDataFile, 'utf8'));
}

/**
 * Save schedule history
 * @param {object} data - Schedule data to save
 * @param {string} scheduleDataFile - Path to schedule data file
 */
export function saveScheduleData(data, scheduleDataFile = DEFAULT_CONFIG.scheduleDataFile) {
  writeFileSync(scheduleDataFile, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Generate random integer between min and max (inclusive)
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calculate next run time within constraints
 * @param {string|null} lastRunTime - ISO timestamp of last run
 * @param {object} config - Configuration object
 */
function calculateNextRunTime(lastRunTime, config = DEFAULT_CONFIG) {
  const now = lastRunTime ? new Date(lastRunTime) : new Date();

  // Random hours between min and max constraints
  const hoursToAdd = randomInt(
    config.runConstraints.minHoursBetween,
    config.runConstraints.maxHoursBetween
  );

  const nextRun = new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);

  // Ensure time is within daily window
  let hour = nextRun.getUTCHours();

  // If outside window, adjust to random time within window
  if (hour < config.timeWindow.minHour || hour > config.timeWindow.maxHour) {
    hour = randomInt(config.timeWindow.minHour, config.timeWindow.maxHour);
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
 * @param {object} config - Configuration object
 * @returns {object} { cron: string, scheduledTime: string, scheduledTimeUTC: string }
 */
export function generateRandomCron(lastRunTime = null, config = DEFAULT_CONFIG) {
  const nextRunTime = calculateNextRunTime(lastRunTime, config);
  const cron = dateToCron(nextRunTime);

  return {
    cron,
    scheduledTime: nextRunTime.toISOString(),
    scheduledTimeUTC: `${nextRunTime.toISOString().split('T')[1].substring(0, 5)} UTC`
  };
}

/**
 * Record a run in schedule history
 * @param {string} cronExpression - Current cron expression
 * @param {object} config - Configuration object
 * @returns {object} Next schedule information
 */
export function recordRun(cronExpression, config = DEFAULT_CONFIG) {
  const data = loadScheduleData(config.scheduleDataFile);
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
  const nextSchedule = generateRandomCron(now, config);
  data.nextScheduledCron = nextSchedule.cron;
  data.nextScheduledTime = nextSchedule.scheduledTime;

  saveScheduleData(data, config.scheduleDataFile);

  return nextSchedule;
}

/**
 * Get current schedule status
 * @param {string} scheduleDataFile - Path to schedule data file
 */
export function getScheduleStatus(scheduleDataFile = DEFAULT_CONFIG.scheduleDataFile) {
  const data = loadScheduleData(scheduleDataFile);

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

/**
 * Generate multiple random cron schedules evenly distributed throughout the day
 * @param {number} count - Number of schedules to generate
 * @param {object} config - Configuration object
 * @returns {Array} Array of cron schedules
 */
export function generateMultipleRandomCrons(count, config = DEFAULT_CONFIG) {
  const schedules = [];
  const hourRange = config.timeWindow.maxHour - config.timeWindow.minHour;
  const hoursPerSlot = hourRange / count;

  for (let i = 0; i < count; i++) {
    // Divide the day into slots and randomize within each slot
    const slotStart = config.timeWindow.minHour + (i * hoursPerSlot);
    const slotEnd = Math.min(slotStart + hoursPerSlot, config.timeWindow.maxHour);

    // Random hour within this slot
    const hour = Math.floor(slotStart + Math.random() * (slotEnd - slotStart));
    const minute = randomInt(0, 59);

    const cron = `${minute} ${hour} * * *`;
    const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} UTC`;

    schedules.push({ cron, time });
  }

  // Sort by time
  schedules.sort((a, b) => a.cron.localeCompare(b.cron));

  return schedules;
}
