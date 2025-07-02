/**
 * Instanță singleton pentru logging
 * @class Logger
 */
import { CONFIG } from './config.js';

class Logger {
  constructor() {
    this.enabled = CONFIG.LOGGING.ENABLED;
    this.level = CONFIG.LOGGING.LEVEL || 'info';
    this.levels = ['debug', 'info', 'warn', 'error'];
    this.maxLogs = CONFIG.LOGGING.MAX_LOGS;
    this.logs = [];
  }

  /**
   * Verifică dacă un anumit tip de mesaj ar trebui logat
   * @param {string} type - Tipul logului: debug, info, warn, error
   * @returns {boolean} True dacă se poate loga
   * @private
   */
  _shouldLog(type) {
    return (
      this.enabled &&
      this.levels.indexOf(type) >= this.levels.indexOf(this.level)
    );
  }

  /**
   * Adaugă un log în istoricul intern și îl afișează în consolă
   * @param {string} type - Tipul logului
   * @param {string} message - Mesajul de log
   * @param {any} [data] - Date adiționale opționale
   * @private
   */
  _log(type, message, data) {
    if (!this._shouldLog(type)) return;

    const entry = {
      timestamp: new Date().toISOString(),
      type,
      message,
      data,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) this.logs.shift();

    const formatted = `[${entry.timestamp}] [${type.toUpperCase()}] ${message}`;
    console[type](formatted, data || '');
  }

  debug(msg, data) {
    this._log('debug', msg, data);
  }

  info(msg, data) {
    this._log('info', msg, data);
  }

  warn(msg, data) {
    this._log('warn', msg, data);
  }

  error(msg, data) {
    this._log('error', msg, data);
  }

  /**
   * Returnează toate logurile salvate
   * @returns {Array<Object>} Lista de loguri
   */
  getLogs() {
    return this.logs;
  }

  clear() {
    this.logs = [];
  }
}

export const logger = new Logger();
