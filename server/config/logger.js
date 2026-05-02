const winston = require('winston');
const path = require('path');
require('winston-daily-rotate-file');

const logsDir = path.join(__dirname, '..', 'logs');
const isServerless = !!process.env.VERCEL;

const transports = [];

if (!isServerless) {
  // Long-running host (PM2 / VPS): rotate to disk.
  transports.push(
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '10m',
      maxFiles: '30d',
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    }),
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: 'jm-comfort-api' },
  transports,
});

// Always log to console in dev or on serverless (Vercel captures stdout).
if (process.env.NODE_ENV !== 'production' || isServerless) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
          const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
          return `${timestamp} [${level}] ${message} ${metaStr}`;
        }),
      ),
    }),
  );
}

module.exports = logger;
