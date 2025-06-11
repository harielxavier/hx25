/**
 * Logger utility for consistent logging across the application
 * Automatically disables logs in production environment
 */

const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface Logger {
  debug: (...args: any[]) => void;
  log: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

/**
 * Production logger that suppresses all logs except errors and warnings
 */
const productionLogger: Logger = {
  debug: () => {},
  log: () => {},
  info: () => {},
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args)
};

/**
 * Development logger that outputs all logs
 */
const developmentLogger: Logger = {
  debug: (...args) => console.debug(...args),
  log: (...args) => console.log(...args),
  info: (...args) => console.info(...args),
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args)
};

// Export the appropriate logger based on environment
export const logger: Logger = isProduction ? productionLogger : developmentLogger;

/**
 * Track occurrences of events (in dev mode only)
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (!isProduction) {
    logger.debug(`[EVENT] ${eventName}`, properties || {});
  }
  // In production, this would connect to your actual analytics system
}

export default logger;
