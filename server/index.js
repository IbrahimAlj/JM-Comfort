const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Existing routes
const appointmentRoutes = require('./routes/appointments');
const projectRoutes = require('./routes/projects');

// NEW: Services route
const servicesRoutes = require('./routes/services');

// Other imports
const { validateEmailConfig } = require('./config/mailer');
const sanitizeInput = require('./middleware/validateInput');

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

// NEW: mount services API
app.use('/api/services', servicesRoutes);

/* --------------------
   Health Check
-------------------- */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

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