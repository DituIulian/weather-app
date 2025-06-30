import { CONFIG } from './config.js';

const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

export class Logger {
  constructor() {
    this.logs = [];
    this.enabled = CONFIG.LOGGING.ENABLED;
    this.level = levels[CONFIG.LOGGING.LEVEL] || levels.info;
    this.maxLogs = CONFIG.LOGGING.MAX_LOGS;
  }

  debug(message, data = null) {
    this._log('debug', message, data);
  }

  info(message, data = null) {
    this._log('info', message, data);
  }

  warn(message, data = null) {
    this._log('warn', message, data);
  }

  error(message, error = null) {
    const errorData = error instanceof Error ? { message: error.message, stack: error.stack } : error;
    this._log('error', message, errorData);
  }

  _log(level, message, data) {
    if (!this.enabled || levels[level] < this.level) return;

    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message, data };

    this.logs.push(logEntry);

    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    console[level](`[${timestamp}] [${level.toUpperCase()}] ${message}`, data || '');
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs() {
    return this.logs.map(log => `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message} ${log.data ? JSON.stringify(log.data) : ''}`).join('\n');
  }
}

export const logger = new Logger();
