import config from '../../config/env';

const logLevel = config.nodeEnv === 'production' ? 'info' : 'debug';

const logger = {
  info: (message: string, ...args: any[]): void => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
  },
  error: (message: string, error?: Error | any): void => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
    if (error) {
      console.error(error);
    }
  },
  warn: (message: string, ...args: any[]): void => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
  },
  debug: (message: string, ...args: any[]): void => {
    if (logLevel === 'debug') {
      console.debug(
        `[DEBUG] ${new Date().toISOString()} - ${message}`,
        ...args
      );
    }
  },
};

export default logger;
