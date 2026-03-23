const pool = require('../config/db');

/**
 * GET /api/feedback
 * Retrieve all UAT feedback entries, newest first.
 */
exports.getAllFeedback = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, feedback_text, created_at FROM uat_feedback ORDER BY created_at DESC'
    );
    return res.json({ ok: true, feedback: rows });
  } catch (err) {
    console.error('[feedback] Failed to fetch feedback:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * POST /api/feedback
 * Store a UAT feedback submission.
 */

exports.createFeedback = async (req, res) => {
  try {
    const feedbackText = (req.body.feedback_text ?? '').toString().trim();
    const errors = []; // empty array to catch errors (say if ones unkown)

    if (!feedbackText) {
      errors.push('Feedback text is required.');
    }

    if (feedbackText.length > 5000) {
      errors.push('Feedback must be 5000 characters or fewer.');
    }

    if (errors.length > 0) {
      return res.status(400).
      json({
        error: 'Validation failed',
        details: errors,
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO uat_feedback (feedback_text) VALUES (?)',
      [feedbackText]
    );

    return res.status(201).
    json({
      message: 'Feedback submitted successfully.',
      feedback_id: result.insertId,
    });
  
  } 
  catch (err) {
    console.error('[feedback] Failed to create feedback:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};