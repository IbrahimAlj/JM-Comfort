const express = require('express');
const router = express.Router();

router.get('/test-error', (req, res, next) => {
  next(new Error('Sentry test error from Express server'));
});

router.get('/test-ok', (req, res) => {
  res.json({ status: 'ok', message: 'Sentry test route is working' });
});

module.exports = router;
