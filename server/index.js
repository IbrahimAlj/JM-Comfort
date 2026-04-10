const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { validateEnv } = require('./config/validateEnv');
validateEnv();

const { initSentry } = require('./config/sentry');
const logger = require('./config/logger');
const requestLogger = require('./middleware/requestLogger');
const sanitizeInput = require('./middleware/validateInput');

const appointmentRoutes = require('./routes/appointments');
const projectRoutes = require('./routes/projects');
const serviceRoutes = require('./routes/services');
const leadsRoutes = require('./routes/leads');
const galleryRoutes = require('./routes/gallery');
const sentryTestRoutes = require('./routes/sentryTest');
const analyticsRoutes = require('./routes/analytics');
const feedbackRoutes = require('./routes/feedback');
const analyticsSummaryRoutes = require('./routes/analyticsSummary');
const { validateEmailConfig } = require('./config/mailer');

const app = express();
const PORT = process.env.PORT || 5000;
const startTime = Date.now();

/* --------------------
   Middleware
-------------------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(sanitizeInput);

/* --------------------
   Routes
-------------------- */
app.use('/api/appointments', appointmentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/sentry', sentryTestRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/analytics/summary', analyticsSummaryRoutes);

/* --------------------
   Health & Uptime Check
-------------------- */
app.get('/health', (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const days = Math.floor(uptimeSeconds / 86400);
  const hours = Math.floor((uptimeSeconds % 86400) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: {
      raw_seconds: uptimeSeconds,
      formatted: `${days}d ${hours}h ${minutes}m ${seconds}s`,
    },
    memory: {
      rss_mb: (process.memoryUsage().rss / 1024 / 1024).toFixed(2),
      heap_used_mb: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
      heap_total_mb: (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2),
    },
    environment: process.env.NODE_ENV || 'development',
  });
});

/* --------------------
   API Logs Endpoint (admin)
-------------------- */
app.get('/api/admin/logs', (req, res) => {
  const fs = require('fs');
  const logsDir = path.join(__dirname, 'logs');
  const type = req.query.type || 'error';
  const today = new Date().toISOString().split('T')[0];
  const filename = `${type}-${today}.log`;
  const filepath = path.join(logsDir, filename);

  if (!fs.existsSync(filepath)) {
    return res.json({ entries: [], message: `No ${type} logs for today.` });
  }

  const content = fs.readFileSync(filepath, 'utf-8');
  const entries = content
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      try { return JSON.parse(line); }
      catch { return { raw: line }; }
    });

  res.json({ date: today, type, count: entries.length, entries });
});

/* --------------------
   Sentry Error Handler
-------------------- */
initSentry(app);

/* --------------------
   Global Error Handler
-------------------- */
app.use((err, req, res, next) => {
  logger.error(err.message, {
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    statusCode: err.status || 500,
  });

  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message,
  });
});

/* --------------------
   Start Server
-------------------- */
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, { port: PORT, env: process.env.NODE_ENV || 'development' });
});