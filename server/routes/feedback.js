const express = require('express');
const { createFeedback } = require('../controllers/feedbackController');

const router = express.Router();

/**
 * POST /api/feedback
 * Public endpoint to submit UAT feedback.
 */
router.post('/', createFeedback);

module.exports = router;
