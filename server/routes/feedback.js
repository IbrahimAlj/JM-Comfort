const express = require('express');
const { createFeedback, getAllFeedback } = require('../controllers/feedbackController');

const router = express.Router();

/**
 * GET /api/feedback
 * Retrieve all UAT feedback entries.
 */
router.get('/', getAllFeedback);

/**
 * POST /api/feedback
 * Public endpoint to submit UAT feedback.
 */
router.post('/', createFeedback);

module.exports = router;
