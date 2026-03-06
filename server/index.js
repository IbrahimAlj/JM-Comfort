const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { initSentry } = require('./config/sentry');
const sanitizeInput = require('./middleware/validateInput');

const appointmentRoutes = require('./routes/appointments');
const projectRoutes = require('./routes/projects');
const serviceRoutes = require('./routes/services');
const leadsRoutes = require('./routes/leads');
const galleryRoutes = require('./routes/gallery');
const { validateEmailConfig } = require('./config/mailer');

const app = express();
const PORT = process.env.PORT || 3001;

/* --------------------
   Middleware
-------------------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeInput);

/* --------------------
   Routes
-------------------- */
app.use('/api/appointments', appointmentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/gallery', galleryRoutes);

/* --------------------
   Health Check
-------------------- */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

/* --------------------
   Sentry Error Handler
-------------------- */
initSentry(app);

/* --------------------
   Global Error Handler
-------------------- */
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: 'Something went wrong',
  });
});

/* --------------------
   Start Server
-------------------- */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});