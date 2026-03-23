const morgan = require('morgan');
const logger = require('../config/logger');

const stream = {
  write: (message) => {
    logger.info(message.trim(), { type: 'http' });
  },
};

const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream }
);

module.exports = requestLogger;