// links from app.js

const app = require('./app');
const logger = require('./config/logger');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, {
    port: PORT,
    env: process.env.NODE_ENV || 'development',
  });
});